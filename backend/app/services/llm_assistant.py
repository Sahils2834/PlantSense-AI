import os
import json
import logging
from typing import Dict, List, Any, Optional

from app.core.config import settings
from app.services.knowledge_service import knowledge_service

logger = logging.getLogger("llm_assistant")
logging.basicConfig(level=logging.INFO)

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi (हिन्दी)",
    "mr": "Marathi (मराठी)",
    "kn": "Kannada (ಕನ್ನಡ)",
    "te": "Telugu (తెలుగు)",
    "ta": "Tamil (தமிழ்)",
    "gu": "Gujarati (ગુજરાતી)",
    "bn": "Bengali (বাংলা)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)"
}

class LLMAssistantService:
    """
    PlantSense GenAI Agricultural Assistant & Multilingual Intelligence Layer.
    Translates, explains, and advises farmers in their chosen native language
    grounded in the ML model's exact disease prediction.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.model = None

        if self.api_key and self.api_key != "your_api_key_here":
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                logger.info("Successfully initialized Gemini Generative AI Model.")
            except Exception as e:
                logger.warning(f"Could not initialize google.generativeai: {e}")

    def is_available(self) -> bool:
        return self.model is not None

    def analyze_disease(
        self,
        disease: str,
        confidence: float,
        severity: str,
        language: str = "en",
        farmer_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generates structured agricultural disease analysis in target language.
        """
        lang = language.lower()
        lang_name = LANGUAGE_NAMES.get(lang, "English")

        # Handle non-plant or unknown detection
        if not disease or "no supported plant" in disease.lower() or "unknown" in disease.lower():
            return knowledge_service.get_disease_info(disease, language=lang)

        # If Gemini model is active, generate personalized, native-language structured analysis
        if self.model:
            try:
                prompt = f"""
You are PlantSense AI, a compassionate expert agricultural scientist helping a local farmer.
Exact Detected Crop Condition: {disease} (Confidence: {confidence * 100:.1f}%, Severity: {severity}).
Farmer Context: {json.dumps(farmer_context or {})}
Target Output Language: Output ALL text strictly in {lang_name}.

Provide a structured JSON response with exact keys:
1. "explanation": Simple, easy-to-understand explanation of the disease in {lang_name}.
2. "symptoms": List of 3-4 bullet points describing visible symptoms in {lang_name}.
3. "cause": Explanation of cause and spread conditions in {lang_name}.
4. "spread_conditions": Weather or field conditions favoring spread in {lang_name}.
5. "treatment": List of 3-4 practical treatment steps in {lang_name}.
6. "natural_remedies": List of 2-3 organic/natural remedies in {lang_name}.
7. "prevention": List of 3-4 actionable preventive steps in {lang_name}.
8. "action_plan": Object with keys "today", "next_3_days", "next_2_weeks" in {lang_name}.

SAFETY INSTRUCTION: Do NOT fabricate specific chemical dosage formulas. Always advise consulting local agricultural extension officers or reading the product label.
Return ONLY valid JSON.
"""
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                data = json.loads(response.text)
                return data
            except Exception as err:
                logger.error(f"Gemini API call error: {err}. Falling back to grounded knowledge base.")

        # Fallback to grounded multilingual database
        return knowledge_service.get_disease_info(disease, language=lang)

    def generate_chat_reply(
        self,
        message: str,
        disease_context: Optional[str] = None,
        confidence: Optional[float] = None,
        language: str = "en",
        farmer_context: Optional[Dict[str, Any]] = None,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Generates conversational farmer assistant response in the selected language.
        """
        lang = language.lower()
        lang_name = LANGUAGE_NAMES.get(lang, "English")

        # 1. No valid detection context check
        if not disease_context or "no supported plant" in disease_context.lower() or "unknown" in disease_context.lower():
            if lang == "hi":
                return "कृपया पहले किसी पौधे या पत्ती की फोटो अपलोड करें या कैमरा स्कैन करें, ताकि मैं उस फसल और बीमारी के अनुसार सटीक सलाह दे सकूं।"
            elif lang == "mr":
                return "कृपया प्रथम पिकाच्या किंवा झाडाच्या पानाचा फोटो अपलोड करा किंवा कॅमेरा सुरू करा, जेणेकरून मी अचूक मार्गदर्शन करू शकेन."
            return "Please upload or capture a plant leaf image first so I can provide disease-specific guidance."

        grounded_info = knowledge_service.get_disease_info(disease_context, language=lang)

        # 2. Gemini Live Conversation
        if self.model:
            try:
                system_instruction = f"""
You are PlantSense AI, a friendly, knowledgeable agricultural extension scientist speaking directly to a farmer.
Current Diagnosed Plant Disease: {disease_context} (Confidence: {f'{confidence*100:.1f}%' if confidence else 'N/A'})
Grounded Agricultural Knowledge: {json.dumps(grounded_info)}
Farmer Context: {json.dumps(farmer_context or {})}
Selected Native Language: {lang_name}

Instructions:
1. Answer the farmer's question directly, clearly, and concisely strictly in {lang_name}.
2. Use short paragraphs, clear bullet points, and farmer-friendly language.
3. If asked about chemical sprays, remind them to check local product labels and verify with local agricultural officers.
"""
                chat = self.model.start_chat(history=[])
                response = chat.send_message(f"{system_instruction}\n\nFarmer Question: {message}")
                return response.text.strip()
            except Exception as ex:
                logger.error(f"Gemini chat error: {ex}")

        # 3. Grounded Rule-based Multilingual Fallbacks
        lower_msg = message.lower()
        if lang == "hi":
            if any(k in lower_msg for k in ["इलाज", "दवा", "उपचार", "treat", "cure", "remedy"]):
                trts = "\n• ".join(grounded_info.get("treatment", []))
                return f"आपकी फसल में {disease_context} के लिए अनुशंसित उपचार:\n• {trts}\n\n⚠️ कीटनाशक छिड़काव की सटीक मात्रा के लिए स्थानीय कृषि अधिकारी या दवा के लेबल का पालन करें।"
            if any(k in lower_msg for k in ["रोकथाम", "बचाव", "prevent"]):
                prevs = "\n• ".join(grounded_info.get("prevention", []))
                return f"{disease_context} की रोकथाम के उपाय:\n• {prevs}"
            if any(k in lower_msg for k in ["कारण", "क्यों", "cause", "why"]):
                return f"कारण: {grounded_info.get('cause', '')}\n\nफैलने की परिस्थितियां: {grounded_info.get('spread_conditions', '')}"
            return f"आपकी फसल ({disease_context}) के बारे में जानकारी:\n{grounded_info.get('explanation', '')}\n\nआज का कार्य: {grounded_info.get('action_plan', {}).get('today', '')}"

        elif lang == "mr":
            if any(k in lower_msg for k in ["उपचार", "औषध", "दवा", "treat", "cure", "remedy"]):
                trts = "\n• ".join(grounded_info.get("treatment", []))
                return f"तुमच्या पिकातील {disease_context} साठी शिफारस केलेले उपाय:\n• {trts}\n\n⚠️ औषधाच्या अचूक प्रमाणासाठी स्थानिक कृषी अधिकारी किंवा लेबलवरील सूचनांचे पालन करा."
            if any(k in lower_msg for k in ["प्रतिबंध", "काळजी", "prevent"]):
                prevs = "\n• ".join(grounded_info.get("prevention", []))
                return f"{disease_context} चा प्रसार रोखण्यासाठी प्रतिबंधात्मक उपाय:\n• {prevs}"
            if any(k in lower_msg for k in ["कारण", "कसे", "cause", "why"]):
                return f"कारण: {grounded_info.get('cause', '')}\n\nप्रसार अनुकूल हवामान: {grounded_info.get('spread_conditions', '')}"
            return f"तुमच्या पिकाबद्दल ({disease_context}) माहिती:\n{grounded_info.get('explanation', '')}\n\nआजची कृती: {grounded_info.get('action_plan', {}).get('today', '')}"

        # English fallback
        if any(k in lower_msg for k in ["treat", "remedy", "cure", "medicine"]):
            trts = "\n• ".join(grounded_info.get("treatment", []))
            return f"Recommended treatment steps for {disease_context}:\n• {trts}\n\n⚠️ Always consult local agricultural extension officers or product labels for precise spray dosages."
        if any(k in lower_msg for k in ["prevent", "stop", "avoid"]):
            prevs = "\n• ".join(grounded_info.get("prevention", []))
            return f"To prevent {disease_context} from spreading:\n• {prevs}"
        if any(k in lower_msg for k in ["cause", "why"]):
            return f"Cause: {grounded_info.get('cause', '')}\n\nSpread Conditions: {grounded_info.get('spread_conditions', '')}"

        return f"Regarding {disease_context}:\n{grounded_info.get('explanation', '')}\n\nToday's Action: {grounded_info.get('action_plan', {}).get('today', '')}"

llm_assistant = LLMAssistantService()
