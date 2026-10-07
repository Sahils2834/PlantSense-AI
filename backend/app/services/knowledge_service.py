import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("knowledge_service")
logging.basicConfig(level=logging.INFO)

# Grounded Multi-Language Knowledge Database for PlantDoc Diseases
DISEASE_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    "Apple - Apple Scab": {
        "en": {
            "explanation": "Apple Scab is a fungal disease caused by Venturia inaequalis affecting apple leaves and fruit, causing dark, olive-colored velvety spots.",
            "symptoms": [
                "Olive-green to dark brown velvet-like lesions on upper leaf surfaces.",
                "Leaves curl, turn yellow, and drop prematurely.",
                "Scabby, corky dark spots on apple fruit causing cracking."
            ],
            "cause": "Fungal pathogen Venturia inaequalis. Spores overwinter in fallen infected leaves.",
            "spread_conditions": "Cool (13°C-24°C), wet, rainy spring weather with prolonged leaf moisture.",
            "treatment": [
                "Prune and destroy infected foliage and fallen diseased leaves.",
                "Apply copper-based or sulfur-based protective fungicide sprays.",
                "Ensure proper tree canopy pruning to maximize sunlight and airflow."
            ],
            "natural_remedies": [
                "Neem Oil Spray (5ml/L water) applied every 7-10 days.",
                "Baking soda solution (1 tbsp baking soda + 1 tsp horticultural oil in 4L water)."
            ],
            "prevention": [
                "Rake and destroy fallen leaves before winter.",
                "Plant scab-resistant apple cultivars.",
                "Avoid overhead irrigation; water root zone directly."
            ],
            "action_plan": {
                "today": "Rake and clear fallen infected leaves beneath tree canopy.",
                "next_3_days": "Apply protective bio-fungicide or copper spray early in the morning.",
                "next_2_weeks": "Monitor new foliage weekly and maintain open canopy pruning."
            }
        },
        "hi": {
            "explanation": "सेब का स्कैब (Apple Scab) वेंटुरिया इनइक्वलिस कवक के कारण होने वाला रोग है जो पत्तियों और फलों पर काले, मखमली धब्बे बनाता है।",
            "symptoms": [
                "पत्तियों की ऊपरी सतह पर जैतूनी-हरे से गहरे भूरे रंग के मखमली धब्बे।",
                "पत्तियां मुड़ जाती हैं, पीली होकर समय से पहले गिर जाती हैं।",
                "फलों पर पपड़ीदार खुरदरे धब्बे और दरारें पड़ना।"
            ],
            "cause": "कवक वेंटुरिया इनइक्वलिस। इसके बीजाणु गिरी हुई संक्रमित पत्तियों में जीवित रहते हैं।",
            "spread_conditions": "ठंडा और नम वसंत का मौसम (13°C से 24°C) तथा पत्तियों पर लगातार नमी।",
            "treatment": [
                "संक्रमित पत्तियों और शाखाओं को काटकर सुरक्षित रूप से नष्ट करें।",
                "कॉपर या सल्फर आधारित कवकनाशी का समय पर छिड़काव करें।",
                "हवा और धूप के लिए पेड़ों की उचित छंटाई करें।"
            ],
            "natural_remedies": [
                "नीम का तेल (5 मिली प्रति लीटर पानी) का हर 7-10 दिन में छिड़काव।",
                "बेकिंग सोडा घोल का पत्तियों पर छिड़काव।"
            ],
            "prevention": [
                "पेड़ के नीचे गिरी सूखी पत्तियों को इकट्ठा कर जलाएं या नष्ट करें।",
                "रोग प्रतिरोधी किस्मों के पौधे लगाएं।",
                "ऊपर से पानी देने से बचें, जड़ों में पानी दें।"
            ],
            "action_plan": {
                "today": "पेड़ के नीचे गिरी संक्रमित पत्तियों को तुरंत साफ करें।",
                "next_3_days": "सुबह के समय कॉपर फफूंदनाशी का छिड़काव करें।",
                "next_2_weeks": "नई पत्तियों की नियमित जांच करें और हवा का प्रवाह बनाए रखें।"
            }
        },
        "mr": {
            "explanation": "सफरचंद स्कॅब (Apple Scab) हा व्हेंचरिया इनइक्वॅलिस बुरशीमुळे होणारा रोग असून पानांवर व फळांवर काळे मखमली डाग पडतात.",
            "symptoms": [
                "पानांच्या वरच्या भागावर ऑलिव्ह-हिरवे ते गडद तपकिरी मखमली डाग.",
                "पाने वाकडी होतात, पिवळी पडून गळतात.",
                "फळांवर खडबडीत काळे डाग व चिरा पडतात."
            ],
            "cause": "व्हेंचरिया इनइक्वॅलिस बुरशी. जमिनीवर पडलेल्या संक्रमित पानात हिवाळ्यात टिकून राहते.",
            "spread_conditions": "थंड व दमट हवामान (१३°C ते २४°C) आणि पानांवर दीर्घकाळ ओलावा.",
            "treatment": [
                "रोगट पाने व फांद्या छाटून नष्ट करा.",
                "तांब्रयुक्त (कॉपर) किंवा गंधकयुक्त बुरशीनाशकाची फवारणी करा.",
                "झाडांमध्ये हवा व सूर्यप्रकाश खेळता राहील अशी छाटणी करा."
            ],
            "natural_remedies": [
                "कडुलिंब तेल (५ मिली/लिटर पाणी) दर ७-१० दिवसांनी फवारा.",
                "बेकिंग सोडा द्रावण पानांवर फवारा."
            ],
            "prevention": [
                "झाडाखालील पडलेली रोगट पाने गोळा करून नष्ट करा.",
                "रोगप्रतिकारक जातींची लागवड करा.",
                "तुषार सिंचन टाळा, थेट मुळांना पाणी द्या."
            ],
            "action_plan": {
                "today": "झाडाखालील सर्व पडलेली रोगट पाने ताबडतोब नष्ट करा.",
                "next_3_days": "सकाळी लवकर कॉपर बुरशीनाशकाची फवारणी करा.",
                "next_2_weeks": "नवीन पानांवर लक्ष ठेवा आणि झाडाची स्वच्छता राखा."
            }
        }
    },
    "Tomato - Early Blight": {
        "en": {
            "explanation": "Early Blight is a common fungal leaf spot disease affecting tomatoes and potatoes caused by Alternaria solani, starting on older lower leaves.",
            "symptoms": [
                "Dark brown to black spots with concentric rings ('bullseye' target pattern) on older leaves.",
                "Yellowing tissue surrounding leaf spots, leading to severe defoliation.",
                "Dark, sunken, leathery lesions on stems and fruit near stem attachments."
            ],
            "cause": "Fungal pathogen Alternaria solani surviving in infected crop debris and soil.",
            "spread_conditions": "Warm temperatures (24°C to 29°C), high humidity, heavy dew, or frequent overhead irrigation.",
            "treatment": [
                "Immediately prune and destroy heavily infected lower foliage.",
                "Water at the soil base using drip irrigation; avoid splashing soil onto leaves.",
                "Apply protective bio-fungicide or copper spray at first sign of spots."
            ],
            "natural_remedies": [
                "Neem Oil Spray (5ml cold-pressed neem oil + 2ml liquid soap per liter water).",
                "Garlic and ginger extract spray to suppress fungal spore germination."
            ],
            "prevention": [
                "Practice 3-4 year crop rotation with non-solanaceous crops (corn, beans, cereals).",
                "Mulch around plant bases with clean straw to prevent soil splash.",
                "Disinfect pruning shears with alcohol between plants."
            ],
            "action_plan": {
                "today": "Prune and dispose of infected bottom leaves. Do not compost infected foliage.",
                "next_3_days": "Apply mulch around stem bases and switch strictly to root/drip watering.",
                "next_2_weeks": "Inspect weekly and spray organic neem/copper solution if new spots appear."
            }
        },
        "hi": {
            "explanation": "टमाटर का अगेती झुलसा (Early Blight) अल्टरनेरिया सोलानी कवक के कारण होता है, जो नीचे की पुरानी पत्तियों से शुरू होकर ऊपर की ओर फैलता है।",
            "symptoms": [
                "पुरानी पत्तियों पर गाढ़े भूरे-काले छल्लेदार (बुलआई/टारगेट) धब्बे।",
                "धब्बों के चारों ओर पीलापन और पत्तियों का सूखकर गिरना।",
                "तनों और फलों पर गहरे, धंसे हुए काले घाव।"
            ],
            "cause": "अल्टरनेरिया सोलानी फंगस जो मिट्टी और पुरानी संक्रमित फसलों के अवशेषों में जीवित रहता है।",
            "spread_conditions": "गर्म तापमान (24°C-29°C), अधिक आर्द्रता और पत्तियों का भीगा रहना।",
            "treatment": [
                "संक्रमित निचली पत्तियों को तुरंत काटकर जलाएं या नष्ट करें।",
                "ऊपर से पानी डालने के बजाय केवल जड़ों में ड्रिप द्वारा पानी दें।",
                "कॉपर युक्त या जैविक कवकनाशी का सही समय पर छिड़काव करें।"
            ],
            "natural_remedies": [
                "नीम का तेल (5 मिली प्रति लीटर पानी) का 7 दिन के अंतराल पर छिड़काव।",
                "छाछ (मट्ठा) और पानी का 1:4 के अनुपात में मिश्रण बनाकर छिड़काव।"
            ],
            "prevention": [
                "3-4 वर्ष का फसल चक्र (Crop Rotation) अपनाएं।",
                "मिट्टी के छीटों से बचाव के लिए पौधों के चारों ओर पुआल की मल्चिंग करें।",
                "उपकरणों को साफ और रोगाणुरहित रखें।"
            ],
            "action_plan": {
                "today": "रोगग्रस्त निचली पत्तियों को काटकर खेत से बाहर नष्ट करें।",
                "next_3_days": "पौधों के आधार पर मल्चिंग करें और ड्रिप से पानी दें।",
                "next_2_weeks": "नई पत्तियों की निगरानी करें और जरूरत पड़ने पर नीम तेल का छिड़काव करें।"
            }
        },
        "mr": {
            "explanation": "टोमॅटोचा करपा / लवकर येणारा करपा (Early Blight) हा अल्टरनेरिया सोलानी बुरशीमुळे होतो, जो खालच्या जुन्या पानांपासून सुरू होतो.",
            "symptoms": [
                "जुन्या पानांवर गडद तपकिरी ते काळे गोल कडीसारखे (टार्गेट/बुल-आय) डाग.",
                "डागांच्या भोवती पिवळसरपणा येऊन पाने गळणे.",
                "खोडावर आणि देठाजवळ काळे, खोलगट डाग पडणे."
            ],
            "cause": "अल्टरनेरिया सोलानी बुरशी, जी माती व जुन्या पिकांच्या अवशेषांमध्ये राहते.",
            "spread_conditions": "उबदार तापमान (२४°C ते २९°C), हवेतील आर्द्रता व पानांवर साचलेले पाणी.",
            "treatment": [
                "खालची बाधित पाने ताबडतोब छाटून नष्ट करा.",
                "पानांवर पाणी न टाकता थेट मुळांशी ठिबक सिंचनाने पाणी द्या.",
                "कॉपरयुक्त किंवा ट्रायकोडर्मा बुरशीनाशकाची योग्य फवारणी करा."
            ],
            "natural_remedies": [
                "कडुलिंब तेल (५ मिली/लिटर पाणी) दर ७ दिवसांनी फवारा.",
                "ताक (मठ्ठा) आणि पाण्याचे द्रावण फवारणे."
            ],
            "prevention": [
                "३-४ वर्षांचे पीक फेरपालट (Crop Rotation) पद्धत वापरा.",
                "मातीचे उडणारे थेंब रोखण्यासाठी बुंध्याभोवती पालापाचोळ्याचे आच्छादन (मल्चिंग) करा.",
                "छाटणीची अवजारे स्वच्छ ठेवा."
            ],
            "action_plan": {
                "today": "रोगाने बाधित खालची पाने कापून सुरक्षितपणे नष्ट करा.",
                "next_3_days": "झाडांच्या बुंध्याशी मल्चिंग करा आणि ठिबकने पाणी द्या.",
                "next_2_weeks": "दर आठवड्याला पिकाची पाहणी करून जैविक नीम फवारणी सुरू ठेवा."
            }
        }
    },
    "Tomato - Late Blight": {
        "en": {
            "explanation": "Late Blight is a destructive water-mold disease caused by Phytophthora infestans that rapidly devastates tomato and potato foliage and fruit.",
            "symptoms": [
                "Large, irregular water-soaked dark green to purplish-black lesions.",
                "White fuzzy fungal growth on leaf undersides during humid/rainy conditions.",
                "Greasy brown rot rapidly destroying tomatoes and stems."
            ],
            "cause": "Oomycete Phytophthora infestans transported by moisture and cool wind.",
            "spread_conditions": "Cool (15°C to 22°C), wet, foggy or rainy weather with relative humidity > 90%.",
            "treatment": [
                "Isolate infected plants and remove diseased foliage immediately.",
                "Apply approved copper-based fungicides at earliest detection.",
                "Avoid overhead irrigation and ensure good field drainage."
            ],
            "natural_remedies": [
                "Bordeaux Mixture (1% copper sulfate + hydrated lime) preventative spray.",
                "Trichoderma viride bio-fungicide soil and foliar drench."
            ],
            "prevention": [
                "Plant certified disease-free seedlings.",
                "Eliminate cull piles and volunteer tomato/potato plants.",
                "Ensure generous row spacing for rapid leaf drying."
            ],
            "action_plan": {
                "today": "Immediately prune and burn severely infected leaves and stems.",
                "next_3_days": "Spray copper fungicide early morning covering full leaf canopy.",
                "next_2_weeks": "Monitor weather and inspect daily during wet spells."
            }
        },
        "hi": {
            "explanation": "टमाटर का पछेती झुलसा (Late Blight) फाइटोफ्थोरा इन्फेस्टन्स के कारण होने वाला विनाशकारी रोग है जो पत्तियों और फलों को तेजी से सड़ाता है।",
            "symptoms": [
                "पत्तियों पर बड़े, अनियमित गहरे भूरे-काले पानी से भीगे हुए धब्बे।",
                "नम मौसम में पत्तियों के नीचे सफेद रंग की फफूंद दिखाई देना।",
                "फलों पर भूरे रंग का कड़ा सड़ांध।"
            ],
            "cause": "फाइटोफ्थोरा इन्फेस्टन्स फंगस जो नमी और हवा के माध्यम से तेजी से फैलता है।",
            "spread_conditions": "ठंडा और गीला मौसम (15°C-22°C) तथा 90% से अधिक नमी।",
            "treatment": [
                "संक्रमित पत्तियों और पौधों को तुरंत हटाकर नष्ट करें।",
                "कॉपर कवकनाशी या बोर्डो मिश्रण का तुरंत छिड़काव करें।",
                "खेत में जल निकासी की अच्छी व्यवस्था करें।"
            ],
            "natural_remedies": [
                "बोर्डो मिश्रण (1% कॉपर सल्फेट + चूना) का सुरक्षात्मक छिड़काव।",
                "ट्राइकोडर्मा विरिडी का पत्तियों और मिट्टी में उपयोग।"
            ],
            "prevention": [
                "प्रमाणित और रोगमुक्त बीजों का उपयोग करें।",
                "खेत के आसपास उगे अनचाहे पुराने पौधों को नष्ट करें।",
                "पौधों के बीच पर्याप्त दूरी रखें।"
            ],
            "action_plan": {
                "today": "गंभीर रूप से संक्रमित टहनियों और पत्तियों को तुरंत काटकर नष्ट करें।",
                "next_3_days": "सुबह कॉपर फफूंदनाशी का पूरे पौधे पर छिड़काव करें।",
                "next_2_weeks": "बारिश या कोहरे के समय रोजाना खेत का निरीक्षण करें।"
            }
        },
        "mr": {
            "explanation": "टोमॅटोचा उशिरा येणारा करपा (Late Blight) हा फायटोफ्थोरा इन्फेस्टन्समुळे होणारा घातक रोग असून पाने व फळे वेगाने सडतात.",
            "symptoms": [
                "पानांवर मोठे, अनियमित काळे-तपकिरी ओले डाग.",
                "दमट हवेत पानांच्या खालच्या बाजूला पांढरी बुरशी दिसणे.",
                "फळांवर काळपट-तपकिरी रंगाची सड निर्माण होणे."
            ],
            "cause": "फायटोफ्थोरा इन्फेस्टन्स, जो दमट वारे आणि पावसाच्या पाण्याने वेगाने पसरतो.",
            "spread_conditions": "थंड व ओलसर हवामान (१५°C ते २२°C) आणि ९०% पेक्षा जास्त आर्द्रता.",
            "treatment": [
                "बाधित पाने व फांद्या ताबडतोब छाटून नष्ट करा.",
                "कॉपरयुक्त बुरशीनाशक किंवा बोर्डो मिश्रणाची फवारणी करा.",
                "शेतात पाण्याचा चांगला निचरा ठेवा."
            ],
            "natural_remedies": [
                "१% बोर्डो मिश्रणाची प्रतिबंधात्मक फवारणी.",
                "ट्रायकोडर्मा विरिडीचा पानांवर व जमिनीत वापर."
            ],
            "prevention": [
                "रोगमुक्त रोपांची लागवड करा.",
                "मागील हंगामातील राहिलेली वनस्पती नष्ट करा.",
                "रोपांमध्ये योग्य अंतर ठेवा जेणेकरून पाने लवकर वाळतील."
            ],
            "action_plan": {
                "today": "बाधित फांद्या व पाने ताबडतोब कापून जाळून नष्ट करा.",
                "next_3_days": "सकाळी लवकर कॉपर बुरशीनाशकाची फवारणी करा.",
                "next_2_weeks": "ढगाळ व पावसाळी हवामानात दररोज पिकाची पाहणी करा."
            }
        }
    },
    "Corn - Northern Leaf Blight": {
        "en": {
            "explanation": "Northern Leaf Blight of corn is caused by Exserohilum turcicum, producing long cigar-shaped grayish-green to tan lesions on corn leaves.",
            "symptoms": [
                "Long, elliptical, cigar-shaped grayish-green lesions (2.5 to 15 cm long).",
                "Lesions turn tan and necrotic, causing extensive leaf death.",
                "Severe loss of photosynthetic area reducing grain yield."
            ],
            "cause": "Fungal pathogen Exserohilum turcicum surviving on crop residue.",
            "spread_conditions": "Moderate temperatures (18°C-27°C) with prolonged wetness and heavy dew.",
            "treatment": [
                "Apply registered foliar fungicide if lesions appear before silking stage.",
                "Ensure balanced soil potassium and nitrogen levels.",
                "Clear or bury infected crop residues after harvest."
            ],
            "natural_remedies": [
                "Neem seed kernel extract (5%) foliar spray.",
                "Pseudomonas fluorescens bio-agent application."
            ],
            "prevention": [
                "Plant resistant corn hybrid varieties.",
                "Practice 2-year crop rotation with legumes or soybean.",
                "Deep tillage to bury infected corn stubble."
            ],
            "action_plan": {
                "today": "Assess percentage of leaf area affected across the corn stand.",
                "next_3_days": "Apply protective bio-fungicide if crop is before tasseling stage.",
                "next_2_weeks": "Monitor newly emerged leaves for lesion development."
            }
        },
        "hi": {
            "explanation": "मक्का का उत्तरी पत्ता झुलसा (Northern Leaf Blight) एक्सरोहिलम टर्सिकम कवक द्वारा होता है, जिससे पत्तियों पर सिगार के आकार के लंबे धब्बे बनते हैं।",
            "symptoms": [
                "पत्तियों पर 2 से 15 सेमी लंबे, सिगार के आकार के भूरे-धूसर धब्बे।",
                "धब्बे आपस में मिलकर पूरी पत्ती को सुखा देते हैं।",
                "प्रकाश संश्लेषण कम होने से मक्के की पैदावार में भारी गिरावट।"
            ],
            "cause": "एक्सरोहिलम टर्सिकम फंगस जो फसल के पुराने डंठलों में रहता है।",
            "spread_conditions": "18°C से 27°C तापमान और पत्तियों पर लगातार ओस या नमी।",
            "treatment": [
                "मंजरी (Tasseling) से पहले लक्षण दिखने पर अनुशंसित फफूंदनाशी का छिड़काव करें।",
                "खेत में पोटाश और नाइट्रोजन का संतुलित उपयोग करें।",
                "फसल कटाई के बाद डंठलों को मिट्टी में दबाएं या नष्ट करें।"
            ],
            "natural_remedies": [
                "नीम बीज अर्क (5%) का पत्तियों पर छिड़काव।",
                "स्यूडोमोनास फ्लोरेसेन्स जैविक फफूंदनाशी का छिड़काव।"
            ],
            "prevention": [
                "झुलसा प्रतिरोधी हाइब्रिड मक्का किस्मों की बुवाई करें।",
                "दलहनी फसलों (सोयाबीन, मूंग) के साथ फसल चक्र अपनाएं।",
                "गहरी जुताई करें।"
            ],
            "action_plan": {
                "today": "खेत में प्रभावित पौधों और धब्बों के फैलाव की जांच करें।",
                "next_3_days": "मंजरी निकलने से पहले आवश्यक जैविक स्प्रे का छिड़काव करें।",
                "next_2_weeks": "नई पत्तियों की निगरानी करें और खेत में हवा का प्रवाह रखें।"
            }
        },
        "mr": {
            "explanation": "मक्याचा तुरा करपा / उत्तर पर्ण करपा (Northern Leaf Blight) हा बुरशीजन्य रोग असून पानांवर सिगारसारखे लांबट करडे डाग पडतात.",
            "symptoms": [
                "पानांवर २.५ ते १५ सेमी लांबीचे लांबट सिगारच्या आकाराचे करडे-तपकिरी डाग.",
                "डाग पसरून संपूर्ण पान सुकणे.",
                "पाने जळाल्यामुळे दाणे भरण्यात घट होणे."
            ],
            "cause": "एक्सरोहिलम टर्सिकम बुरशी, जी पिकाच्या अवशेषांवर टिकून राहते.",
            "spread_conditions": "१८°C ते २७°C तापमान, हवेत आर्द्रता आणि पानांवर साचलेले दव.",
            "treatment": [
                "तुरा येण्यापूर्वी लक्षणे दिसल्यास शिफारस केलेल्या बुरशीनाशकाची फवारणी करा.",
                "पोटॅश आणि नत्राचा संतुलित वापर करा.",
                "कापणीनंतर पिकाचे अवशेष जमिनीत गाडून टाका."
            ],
            "natural_remedies": [
                "५% निंबोळी अर्क द्रावणाची फवारणी.",
                "स्यूडोमोनास फ्लोरेसेन्स जैविक घटकाचा वापर."
            ],
            "prevention": [
                "रोगप्रतिकारक मका बियाण्यांची निवड करा.",
                "कडधान्य किंवा सोयाबीनसोबत पीक फेरपालट करा.",
                "नांगरट खोल करून अवशेष गाडा."
            ],
            "action_plan": {
                "today": "शेतातील बाधित पानांचे प्रमाण तपासा.",
                "next_3_days": "तुरा फुटण्याआधी योग्य जैविक बुरशीनाशकाची फवारणी करा.",
                "next_2_weeks": "नवीन पानांची नियमित पाहणी करा."
            }
        }
    }
}

class KnowledgeService:
    """
    Retrieves grounded disease knowledge, treatment steps, symptoms, and prevention rules
    in requested languages (en, hi, mr, etc.).
    """

    def get_disease_info(self, disease_name: str, language: str = "en") -> Dict[str, Any]:
        lang = language.lower() if language in ["en", "hi", "mr"] else "en"
        
        if not disease_name or "no supported plant" in disease_name.lower() or "unknown" in disease_name.lower():
            return self._get_non_plant_info(lang)

        # Match in database
        for key, lang_dict in DISEASE_KNOWLEDGE_BASE.items():
            if key.lower() in disease_name.lower() or disease_name.lower() in key.lower():
                return lang_dict.get(lang, lang_dict.get("en", {}))

        return self._get_fallback_info(disease_name, lang)

    def _get_non_plant_info(self, lang: str) -> Dict[str, Any]:
        if lang == "hi":
            return {
                "explanation": "छवि में कोई समर्थित पौधा या पत्ती नहीं पहचानी गई। कृपया पौधे की पत्ती का स्पष्ट फोटो लें।",
                "symptoms": ["कोई पौधा नहीं मिला"],
                "cause": "छवि में पत्ती या फसल मौजूद नहीं है।",
                "spread_conditions": "लागू नहीं",
                "treatment": ["कृपया किसी पौधे की पत्ती की साफ तस्वीर अपलोड करें।"],
                "natural_remedies": [],
                "prevention": ["केवल फसलों और पौधों की पत्तियों की तस्वीरें स्कैन करें।"],
                "action_plan": {
                    "today": "पौधे की पत्ती का नया फोटो लें।",
                    "next_3_days": "पौधों की नियमित देखभाल करें।",
                    "next_2_weeks": "लक्षण दिखने पर दोबारा जांच करें।"
                }
            }
        elif lang == "mr":
            return {
                "explanation": "प्रतिमेमध्ये कोणताही वनस्पती किंवा पानाचा भाग आढळला नाही. कृपया झाडाच्या पानाचा स्पष्ट फोटो घ्या.",
                "symptoms": ["झाड किंवा पान आढळले नाही"],
                "cause": "प्रतिमेत पीक किंवा पान उपलब्ध नाही.",
                "spread_conditions": "लागू नाही",
                "treatment": ["कृपया झाडाच्या पानाचा स्पष्ट फोटो पुन्हा अपलोड करा."],
                "natural_remedies": [],
                "prevention": ["केवळ पिकांच्या पानांचे फोटो स्कॅन करा."],
                "action_plan": {
                    "today": "झाडाच्या पानाचा नवीन फोटो घ्या.",
                    "next_3_days": "पिकांची नियमित पाहणी करा.",
                    "next_2_weeks": "लक्षणे दिसल्यास पुन्हा तपासा."
                }
            }
        return {
            "explanation": "No supported plant or leaf detected in the input image. Please provide a clear, close-up photo of a plant leaf.",
            "symptoms": ["No plant foliage detected in image."],
            "cause": "Input image did not match supported plant leaf characteristics.",
            "spread_conditions": "N/A",
            "treatment": ["Please upload or capture a clear photo of a crop leaf."],
            "natural_remedies": [],
            "prevention": ["Scan only crop and leaf images for disease diagnosis."],
            "action_plan": {
                "today": "Capture a clear, well-lit photo of the affected plant leaf.",
                "next_3_days": "Inspect crop field for any visible discoloration or spots.",
                "next_2_weeks": "Regularly monitor plant foliage for healthy growth."
            }
        }

    def _get_fallback_info(self, disease_name: str, lang: str) -> Dict[str, Any]:
        if lang == "hi":
            return {
                "explanation": f"{disease_name} फसल की पत्तियों और तनों को प्रभावित करता है, जिससे धब्बे, पीलापन और पैदावार में कमी आती है।",
                "symptoms": [
                    "पत्तियों की सतह पर रंगहीन धब्बे या घाव।",
                    "पत्तियों का मुड़ना, पीला पड़ना और गिरना।",
                    "पौधे की वृद्धि रुकना।"
                ],
                "cause": "कवक/जीवाणु बीजाणु या प्रतिकूल मौसम स्थितियां।",
                "spread_conditions": "उच्च आर्द्रता, पत्तियों पर लगातार गीलापन और हवा का कम प्रवाह।",
                "treatment": [
                    "संक्रमित पत्तियों को छांटकर सुरक्षित नष्ट करें।",
                    "ऊपर से पानी देने से बचें; केवल जड़ों में पानी दें।",
                    "स्थानीय कृषि अधिकारी की सलाह से अनुशंसित दवा का छिड़काव करें।"
                ],
                "natural_remedies": [
                    "नीम तेल का घोल (5 मिली/लीटर पानी) का छिड़काव।",
                    "जैविक खाद व जीवामृत का पत्तियों पर प्रयोग।"
                ],
                "prevention": [
                    "उचित फसल चक्र (Crop Rotation) अपनाएं।",
                    "कृषि औजारों को साफ रखें।",
                    "पौधों के बीच पर्याप्त दूरी बनाए रखें।"
                ],
                "action_plan": {
                    "today": "पौधों का बारीकी से निरीक्षण करें और रोगग्रस्त पत्तियां हटाएं।",
                    "next_3_days": "जड़ों में सिंचाई करें और खरपतवार हटाएं।",
                    "next_2_weeks": "नई पत्तियों की नियमित जांच करते रहें।"
                }
            }
        elif lang == "mr":
            return {
                "explanation": f"{disease_name} हा पिकाच्या पानांवर व खोडावर परिणाम करतो, ज्यामुळे डाग, पिवळेपणा व उत्पादनात घट होते.",
                "symptoms": [
                    "पानांच्या पृष्ठभागावर डाग किंवा चट्टे.",
                    "पाने पिवळी पडणे, सुकणे आणि गळणे.",
                    "रोपांची वाढ खुंटणे."
                ],
                "cause": "बुरशीजन्य/जिवाणूजन्य बीजाणू किंवा प्रतिकूल हवामान.",
                "spread_conditions": "जास्त आर्द्रता, पानांवर साचलेले पाणी आणि हवेचा अभाव.",
                "treatment": [
                    "बाधित पाने छाटून नष्ट करा.",
                    "पानांवर पाणी शिंपडणे टाळा; मुळांना पाणी द्या.",
                    "स्थानिक कृषी सल्लागाराच्या मार्गदर्शनाने औषध फवारणी करा."
                ],
                "natural_remedies": [
                    "कडुलिंब अर्क (५ मिली/लिटर पाणी) फवारा.",
                    "दशपर्णी अर्क किंवा जीवामृत फवारणी."
                ],
                "prevention": [
                    "पीक फेरपालट पद्धतीचा अवलंब करा.",
                    "अवजारे निर्जंतुक ठेवा.",
                    "रोपांमध्ये योग्य अंतर राखा."
                ],
                "action_plan": {
                    "today": "झाडांची काळजीपूर्वक पाहणी करून रोगट पाने काढा.",
                    "next_3_days": "मुळाशी पाणी द्या आणि तण काढा.",
                    "next_2_weeks": "नवीन फुटणाऱ्या पानांची नियमित तपासणी करा."
                }
            }
        return {
            "explanation": f"{disease_name} affects crop foliage and stems, causing spots, discoloration, and reduced photosynthesis.",
            "symptoms": [
                "Discolored spots or lesions on leaf surfaces.",
                "Leaf wilting, yellowing, or curling.",
                "Reduced plant vigor and stunted crop growth."
            ],
            "cause": "Pathogenic fungal/bacterial spores or unfavorable field conditions.",
            "spread_conditions": "High humidity, prolonged leaf wetness, or poor field air circulation.",
            "treatment": [
                "Isolate and prune infected plant leaves.",
                "Avoid spraying water directly onto crop foliage.",
                "Consult local agricultural expert for recommended local treatment products."
            ],
            "natural_remedies": [
                "Neem oil solution spray (5ml/L water).",
                "Organic compost tea foliage spray."
            ],
            "prevention": [
                "Practice proper crop rotation.",
                "Maintain clean tools and clear crop residues.",
                "Ensure recommended crop plant spacing."
            ],
            "action_plan": {
                "today": "Inspect plants closely and prune damaged leaves.",
                "next_3_days": "Ensure root watering and clear weed growth.",
                "next_2_weeks": "Monitor new growth for clean healthy leaves."
            }
        }

knowledge_service = KnowledgeService()
