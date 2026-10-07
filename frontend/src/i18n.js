export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'हिन्दी', native: 'हिन्दी' },
  { code: 'mr', label: 'मराठी', native: 'मराठी' },
  { code: 'kn', label: 'ಕನ್ನಡ', native: 'ಕನ್ನಡ' },
  { code: 'te', label: 'తెలుగు', native: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்', native: 'தமிழ்' },
  { code: 'gu', label: 'ગુજરાતી', native: 'ગુજરાતી' },
  { code: 'bn', label: 'বাংলা', native: 'বাংলা' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', native: 'ਪੰਜਾਬੀ' }
];

export const translations = {
  en: {
    // Header & Navigation
    appTitle: "PlantSense",
    dashboard: "Dashboard",
    inspections: "Inspections",
    reports: "Reports",
    connecting: "Connecting...",
    aiReady: "AI Ready",
    aiDegraded: "AI Degraded",
    offline: "Offline",

    // Stats Bar
    liveModel: "AI MODEL",
    criticalAlerts: "CRITICAL ALERTS",
    totalDetections: "DETECTIONS",
    activeStreams: "ACTIVE STREAMS",

    // Sidebar & Modes
    camera: "Camera",
    video: "Video",
    image: "Image",
    scan: "Scan",
    start: "Start",
    stop: "Stop",
    chooseCamera: "Select Camera",
    noCamerasFound: "No cameras found — click Scan",
    chooseVideoFile: "Choose Video File",
    chooseImageFile: "Choose Image File",
    diseaseHistory: "DETECTION HISTORY",
    noDetectionsYet: "No detections yet.",
    startCameraMedia: "Start a camera or upload media.",
    clearHistory: "Clear History",

    // Upload Views
    dropLeafImage: "Drop leaf image here",
    imageFormats: "JPG, PNG, WEBP up to 10 MB",
    browseFiles: "Browse Files",
    chooseAnother: "Choose Another",
    analyzing: "Analyzing...",
    dropVideoFile: "Drop video file or click to browse",
    videoFormats: "MP4, MOV, WEBM · Multi-frame aggregate analysis",
    uploadingAndAnalyzing: "Analyzing video frames...",
    videoProcessingComplete: "Video Inspection Complete",

    // Center Stream Footer
    samplingFps: "✓ Sampling @ ~2 FPS",
    readyForInput: "Ready for input",
    lastDetection: "Last",

    // Farmer Context
    farmerContext: "Farmer Context (Optional)",
    cropType: "CROP TYPE",
    location: "LOCATION / STATE",
    growthStage: "GROWTH STAGE",
    weather: "WEATHER",
    irrigation: "IRRIGATION",
    vegetative: "Vegetative",
    flowering: "Flowering",
    fruiting: "Fruiting",
    sunny: "Sunny / Dry",
    humid: "Humid / Rainy",
    drip: "Drip Irrigation",
    sprinkler: "Sprinkler",
    flood: "Flood / Furrow",

    // Right Tabs
    aiAnalysis: "AI Analysis",
    askAI: "Ask AI",

    // Detection Result Card
    detectionResult: "DETECTION RESULT",
    noDetectionYet: "No Detection Yet",
    noDetectionSub: "Start camera feed or upload a plant image to get AI-powered disease diagnosis.",
    modelsAgree: "models agree",
    lowConfidence: "Low confidence",
    noSupportedPlant: "No supported plant detected",
    severity: "Severity",
    confidence: "Confidence",
    modelsBreakdown: "Model Predictions",

    // AI Analysis Tabs & Headings
    overview: "Overview",
    cause: "Cause",
    treatment: "Treatment",
    prevention: "Prevention",
    whatIsDisease: "What is this disease?",
    keySymptoms: "Key Symptoms",
    rootCause: "Root Cause",
    spreadConditions: "Spread Conditions",
    treatmentSteps: "Treatment Steps",
    organicRemedies: "Organic Remedies",
    actionPlan: "Action Plan",
    today: "TODAY",
    next3Days: "NEXT 3 DAYS",
    next2Weeks: "NEXT 2 WEEKS",
    safetyNotice: "Follow local agricultural officer advice and product label instructions for dosage.",
    generatingAI: "Generating AI analysis...",
    aiUnavailable: "AI Analysis unavailable without valid plant diagnosis.",

    // Chat / Ask AI
    askPlaceholder: "Ask about treatments, organic remedies, symptoms...",
    send: "Send",
    clearChat: "Clear Chat",
    chatPromptFirst: "Please upload or capture a plant image first so I can provide disease-specific guidance.",
    chatSuggestion1: "How do I treat this disease?",
    chatSuggestion2: "What organic remedies can I use?",
    chatSuggestion3: "What caused this infection?",

    // Video Report
    videoReportTitle: "Complete Video Inspection Report",
    aggregatedDetection: "Aggregated Frame Detection",
    plantSpecies: "Plant Species",
    primaryDisease: "Primary Disease",
    maxConfidence: "Max Confidence",
    avgConfidence: "Average Confidence",
    totalFrames: "Total Video Frames",
    analyzedFrames: "Sampled Frames",
    affectedFrames: "Affected Frames Count",
    detectedDiseasesBreakdown: "All Detected Diseases Across Video",

    // Reports Modal
    inspectionReports: "PlantSense Inspection Reports",
    noReportsYet: "No inspection reports generated yet.",
    exportReport: "Export Summary",
    close: "Close"
  },

  hi: {
    appTitle: "PlantSense",
    dashboard: "डैशबोर्ड",
    inspections: "निरीक्षण",
    reports: "रिपोर्ट",
    connecting: "कनेक्ट हो रहा है...",
    aiReady: "एआई तैयार है",
    aiDegraded: "एआई आंशिक तैयार",
    offline: "ऑफ़लाइन",

    liveModel: "एआई मॉडल",
    criticalAlerts: "गंभीर अलर्ट",
    totalDetections: "कुल जांच",
    activeStreams: "सक्रिय स्ट्रीम",

    camera: "कैमरा",
    video: "वीडियो",
    image: "चित्र",
    scan: "स्कैन करें",
    start: "शुरू करें",
    stop: "रोकें",
    chooseCamera: "कैमरा चुनें",
    noCamerasFound: "कोई कैमरा नहीं मिला — स्कैन दबाएं",
    chooseVideoFile: "वीडियो फ़ाइल चुनें",
    chooseImageFile: "चित्र फ़ाइल चुनें",
    diseaseHistory: "जांच इतिहास",
    noDetectionsYet: "अभी तक कोई जांच नहीं हुई।",
    startCameraMedia: "कैमरा शुरू करें या फोटो अपलोड करें।",
    clearHistory: "इतिहास हटाएं",

    dropLeafImage: "पत्ती की फोटो यहां डालें",
    imageFormats: "JPG, PNG, WEBP (अधिकतम 10 MB)",
    browseFiles: "फ़ाइलें चुनें",
    chooseAnother: "दूसरी फोटो चुनें",
    analyzing: "विश्लेषण हो रहा है...",
    dropVideoFile: "वीडियो फ़ाइल डालें या ब्राउज़ करें",
    videoFormats: "MP4, MOV, WEBM · फ्रेम-दर-फ्रेम विश्लेषण",
    uploadingAndAnalyzing: "वीडियो फ्रेम का विश्लेषण हो रहा है...",
    videoProcessingComplete: "वीडियो निरीक्षण पूर्ण हुआ",

    samplingFps: "✓ सैंपलिंग @ ~2 FPS",
    readyForInput: "इनपुट के लिए तैयार",
    lastDetection: "अंतिम जांच",

    farmerContext: "किसान संदर्भ (ऐच्छिक)",
    cropType: "फसल का प्रकार",
    location: "स्थान / राज्य",
    growthStage: "विकास चरण",
    weather: "मौसम",
    irrigation: "सिंचाई प्रणाली",
    vegetative: "वानस्पतिक (बढ़वार)",
    flowering: "फूल आने की अवस्था",
    fruiting: "फल लगने की अवस्था",
    sunny: "धूप / सूखा",
    humid: "नम / बारिश",
    drip: "ड्रिप सिंचाई",
    sprinkler: "फव्वारा सिंचाई",
    flood: "खुला पानी",

    aiAnalysis: "एआई विश्लेषण",
    askAI: "एआई से पूछें",

    detectionResult: "जांच परिणाम",
    noDetectionYet: "अभी कोई जांच नहीं हुई",
    noDetectionSub: "एआई द्वारा रोग निदान के लिए कैमरा चालू करें या पत्ती की फोटो अपलोड करें।",
    modelsAgree: "मॉडल सहमत हैं",
    lowConfidence: "कम सटीकता",
    noSupportedPlant: "कोई समर्थित पौधा नहीं मिला",
    severity: "गंभीरता",
    confidence: "विश्वास स्तर",
    modelsBreakdown: "मॉडल भविष्यवाणियां",

    overview: "विवरण",
    cause: "कारण",
    treatment: "इलाज",
    prevention: "रोकथाम",
    whatIsDisease: "यह कौन सी बीमारी है?",
    keySymptoms: "मुख्य लक्षण",
    rootCause: "मूल कारण",
    spreadConditions: "फैलने के अनुकूल परिस्थितियां",
    treatmentSteps: "उपचार के चरण",
    organicRemedies: "जैविक / देशी उपचार",
    actionPlan: "किसान कार्य योजना",
    today: "आज",
    next3Days: "अगले 3 दिन",
    next2Weeks: "अगले 2 सप्ताह",
    safetyNotice: "दवा की सही मात्रा के लिए स्थानीय कृषि अधिकारी की सलाह लें।",
    generatingAI: "एआई विश्लेषण तैयार हो रहा है...",
    aiUnavailable: "पौधे की पहचान के बिना विश्लेषण उपलब्ध नहीं है।",

    askPlaceholder: "इलाज, जैविक उपाय या लक्षणों के बारे में पूछें...",
    send: "भेजें",
    clearChat: "चैट साफ करें",
    chatPromptFirst: "कृपया पहले किसी पौधे की पत्ती की तस्वीर अपलोड करें ताकि मैं सटीक मार्गदर्शन दे सकूं।",
    chatSuggestion1: "इस बीमारी का इलाज कैसे करें?",
    chatSuggestion2: "कौन से जैविक उपचार उपयोगी हैं?",
    chatSuggestion3: "यह संक्रमण किस कारण हुआ?",

    videoReportTitle: "संपूर्ण वीडियो निरीक्षण रिपोर्ट",
    aggregatedDetection: "एकीकृत फ्रेम जांच",
    plantSpecies: "पौधे की प्रजाति",
    primaryDisease: "मुख्य बीमारी",
    maxConfidence: "अधिकतम सटीकता",
    avgConfidence: "औसत सटीकता",
    totalFrames: "कुल वीडियो फ्रेम",
    analyzedFrames: "जांचे गए फ्रेम",
    affectedFrames: "प्रभावित फ्रेम संख्या",
    detectedDiseasesBreakdown: "वीडियो में पाई गई सभी बीमारियां",

    inspectionReports: "प्लांटसेंस निरीक्षण रिपोर्ट",
    noReportsYet: "अभी तक कोई रिपोर्ट तैयार नहीं हुई है।",
    exportReport: "रिपोर्ट निर्यात करें",
    close: "बंद करें"
  },

  mr: {
    appTitle: "PlantSense",
    dashboard: "डॅशबोर्ड",
    inspections: "तपासणी",
    reports: "अहवाल",
    connecting: "कनेक्ट करत आहे...",
    aiReady: "एआय तयार आहे",
    aiDegraded: "एआय अंशतः तयार",
    offline: "ऑफलाइन",

    liveModel: "एआय मॉडेल",
    criticalAlerts: "गंभीर इशारे",
    totalDetections: "एकूण तपासणी",
    activeStreams: "सक्रिय प्रवाह",

    camera: "कॅमेरा",
    video: "व्हिडिओ",
    image: "चित्र",
    scan: "स्कॅन",
    start: "सुरू करा",
    stop: "थांबवा",
    chooseCamera: "कॅमेरा निवडा",
    noCamerasFound: "कॅमेरा आढळला नाही — स्कॅन दाबा",
    chooseVideoFile: "व्हिडिओ फाइल निवडा",
    chooseImageFile: "चित्र फाइल निवडा",
    diseaseHistory: "तपासणी इतिहास",
    noDetectionsYet: "अद्याप कोणतीही तपासणी नाही.",
    startCameraMedia: "कॅमेरा सुरू करा किंवा फोटो अपलोड करा.",
    clearHistory: "इतिहास साफ करा",

    dropLeafImage: "पानाचा फोटो येथे टाका",
    imageFormats: "JPG, PNG, WEBP (कमाल 10 MB)",
    browseFiles: "फाइल निवडा",
    chooseAnother: "दुसरा फोटो निवडा",
    analyzing: "विश्लेषण करत आहे...",
    dropVideoFile: "व्हिडिओ फाइल टाका किंवा निवडा",
    videoFormats: "MP4, MOV, WEBM · फ्रेमनुसार विश्लेषण",
    uploadingAndAnalyzing: "व्हिडिओ फ्रेमचे विश्लेषण चालू आहे...",
    videoProcessingComplete: "व्हिडिओ तपासणी पूर्ण झाली",

    samplingFps: "✓ सॅम्पलिंग @ ~2 FPS",
    readyForInput: "तयार आहे",
    lastDetection: "शेवटची तपासणी",

    farmerContext: "शेतकरी संदर्भ (पर्यायी)",
    cropType: "पिकाचा प्रकार",
    location: "ठिकाण / राज्य",
    growthStage: "वाढीचा टप्पा",
    weather: "हवामान",
    irrigation: "सिंचन पद्धत",
    vegetative: "शाकीय वाढ",
    flowering: "फुलोरा",
    fruiting: "फळधारणा",
    sunny: "उन्हाळा / कोरडे",
    humid: "दमट / पावसाळी",
    drip: "ठिबक सिंचन",
    sprinkler: "तुषार सिंचन",
    flood: "पाट पाणी",

    aiAnalysis: "एआय विश्लेषण",
    askAI: "एआयला विचारा",

    detectionResult: "तपासणी निकाल",
    noDetectionYet: "अद्याप कोणतीही तपासणी नाही",
    noDetectionSub: "रोगाचे निदान करण्यासाठी कॅमेरा सुरू करा किंवा पाण्याचा फोटो अपलोड करा.",
    modelsAgree: "मॉडेल सहमत आहेत",
    lowConfidence: "कमी खात्री",
    noSupportedPlant: "वनस्पती किंवा पान आढळले नाही",
    severity: "तीव्रता",
    confidence: "विश्वासार्हता",
    modelsBreakdown: "मॉडेल निकाल",

    overview: "माहिती",
    cause: "कारण",
    treatment: "उपचार",
    prevention: "प्रतिबंध",
    whatIsDisease: "हा कोणता रोग आहे?",
    keySymptoms: "मुख्य लक्षणे",
    rootCause: "मूळ कारण",
    spreadConditions: "रोगाच्या प्रसारास अनुकूल हवामान",
    treatmentSteps: "उपचाराचे टप्पे",
    organicRemedies: "जैविक व सेंद्रिय उपाय",
    actionPlan: "शेतकरी कृती योजना",
    today: "आज",
    next3Days: "पुढील ३ दिवस",
    next2Weeks: "पुढील २ आठवडे",
    safetyNotice: "औषधाच्या योग्य प्रमाणासाठी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.",
    generatingAI: "एआय विश्लेषण तयार होत आहे...",
    aiUnavailable: "पिकाच्या ओळखीशिवाय विश्लेषण उपलब्ध नाही.",

    askPlaceholder: "उपचार, सेंद्रिय उपाय किंवा लक्षणांबद्दल विचारा...",
    send: "पाठवा",
    clearChat: "चॅट साफ करा",
    chatPromptFirst: "कृपया प्रथम पिकाच्या पानाचा फोटो द्या जेणेकरून मी योग्य सल्ला देऊ शकेन.",
    chatSuggestion1: "या रोगावर काय उपचार करावेत?",
    chatSuggestion2: "कोणते सेंद्रिय किंवा घरगुती उपाय आहेत?",
    chatSuggestion3: "हा रोग कशामुळे झाला?",

    videoReportTitle: "संपूर्ण व्हिडिओ तपासणी अहवाल",
    aggregatedDetection: "एकत्रित फ्रेम विश्लेषण",
    plantSpecies: "पिकाचा प्रकार",
    primaryDisease: "मुख्य रोग",
    maxConfidence: "कमाल विश्वासार्हता",
    avgConfidence: "सरासरी विश्वासार्हता",
    totalFrames: "एकूण व्हिडिओ फ्रेम्स",
    analyzedFrames: "तपासलेल्या फ्रेम्स",
    affectedFrames: "बाधित फ्रेम्स संख्या",
    detectedDiseasesBreakdown: "व्हिडिओमध्ये आढळलेले सर्व रोग",

    inspectionReports: "प्लांटसेंस तपासणी अहवाल",
    noReportsYet: "अद्याप कोणतेही अहवाल तयार नाहीत.",
    exportReport: "अहवाल डाऊनलोड करा",
    close: "बंद करा"
  }
};

// Fallback for remaining Indian languages
['kn', 'te', 'ta', 'gu', 'bn', 'pa'].forEach(lang => {
  translations[lang] = { ...translations.en, ...translations[lang] };
});

export const t = (lang, key) => {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
};

// Authoritative multilingual disease name translation helper
export const translateDiseaseName = (rawDisease, lang = 'en') => {
  if (!rawDisease) return '';
  if (rawDisease.toLowerCase().includes('no supported plant')) {
    return t(lang, 'noSupportedPlant');
  }

  const diseaseTranslations = {
    "Apple - Apple Scab": {
      hi: "सेब - एप्पल स्कैब (पपड़ीदार रोग)",
      mr: "सफरचंद - सफरचंद स्कॅब रोग"
    },
    "Apple - Healthy": {
      hi: "सेब - स्वस्थ पत्ता",
      mr: "सफरचंद - निरोगी पान"
    },
    "Apple - Cedar Rust": {
      hi: "सेब - सिडार रस्ट (गेरुआ रोग)",
      mr: "सफरचंद - तांबेरा रोग"
    },
    "Pepper - Healthy": {
      hi: "शिमला मिर्च - स्वस्थ पौधा",
      mr: "ढोबळी मिरची - निरोगी पान"
    },
    "Pepper - Bacterial Spot": {
      hi: "शिमला मिर्च - जीवाणु धब्बा रोग",
      mr: "ढोबळी मिरची - जिवाणू डाग रोग"
    },
    "Blueberry - Healthy": {
      hi: "ब्लूबेरी - स्वस्थ पौधा",
      mr: "ब्लूबेरी - निरोगी पान"
    },
    "Cherry - Healthy": {
      hi: "चेरी - स्वस्थ पौधा",
      mr: "चेरी - निरोगी पान"
    },
    "Corn - Gray Leaf Spot": {
      hi: "मक्का - धूसर पत्ती धब्बा",
      mr: "मका - करडा पर्ण डाग"
    },
    "Corn - Northern Leaf Blight": {
      hi: "मक्का - उत्तरी पत्ता झुलसा",
      mr: "मका - तुरा करपा (पर्ण करपा)"
    },
    "Corn - Common Rust": {
      hi: "मक्का - सामान्य रतुआ (गेरुआ)",
      mr: "मका - तांबेरा रोग"
    },
    "Peach - Healthy": {
      hi: "आड़ू (पीच) - स्वस्थ पौधा",
      mr: "पीच - निरोगी पान"
    },
    "Potato - Early Blight": {
      hi: "आलू - अगेती झुलसा",
      mr: "बटाटा - लवकर येणारा करपा"
    },
    "Potato - Late Blight": {
      hi: "आलू - पछेती झुलसा",
      mr: "बटाटा - उशिरा येणारा करपा"
    },
    "Raspberry - Healthy": {
      hi: "रसभरी - स्वस्थ पौधा",
      mr: "रासबेरी - निरोगी पान"
    },
    "Soybean - Healthy": {
      hi: "सोयाबीन - स्वस्थ पौधा",
      mr: "सोयाबीन - निरोगी पान"
    },
    "Squash - Powdery Mildew": {
      hi: "कद्दू / स्क्वैश - चूर्णिल आसिता (सफेद फफूंद)",
      mr: "भोपळा - भुरी रोग (पांढरी बुरशी)"
    },
    "Strawberry - Healthy": {
      hi: "स्ट्रॉबेरी - स्वस्थ पौधा",
      mr: "स्ट्रॉबेरी - निरोगी पान"
    },
    "Tomato - Early Blight": {
      hi: "टमाटर - अगेती झुलसा",
      mr: "टोमॅटो - लवकर येणारा करपा"
    },
    "Tomato - Septoria Leaf Spot": {
      hi: "टमाटर - सेप्टोरिया पत्ता धब्बा",
      mr: "टोमॅटो - सेप्टोरिया डाग रोग"
    },
    "Tomato - Healthy": {
      hi: "टमाटर - स्वस्थ पौधा",
      mr: "टोमॅटो - निरोगी पान"
    },
    "Tomato - Bacterial Spot": {
      hi: "टमाटर - जीवाणु पत्ता धब्बा",
      mr: "टोमॅटो - जिवाणू डाग रोग"
    },
    "Tomato - Late Blight": {
      hi: "टमाटर - पछेती झुलसा",
      mr: "टोमॅटो - उशिरा येणारा करपा"
    },
    "Tomato - Mosaic Virus": {
      hi: "टमाटर - मोज़ेक वायरस",
      mr: "टोमॅटो - मोझॅक विषाणू रोग"
    },
    "Tomato - Yellow Leaf Curl Virus": {
      hi: "टमाटर - पीला पत्ती मरोड़िया वायरस",
      mr: "टोमॅटो - पिवळा पाने बोकड्या विषाणू"
    },
    "Tomato - Leaf Mold": {
      hi: "टमाटर - पर्ण फफूंद (लीफ मोल्ड)",
      mr: "टोमॅटो - पानावरील बुरशी (लीफ मोल्ड)"
    },
    "Tomato - Spider Mites": {
      hi: "टमाटर - लाल मकड़ी (माइट्स)",
      mr: "टोमॅटो - लाल कोळी कीड"
    },
    "Grape - Healthy": {
      hi: "अंगूर - स्वस्थ पत्ता",
      mr: "द्राक्ष - निरोगी पान"
    },
    "Grape - Black Rot": {
      hi: "अंगूर - ब्लैक रॉट (काला सड़ांध)",
      mr: "द्राक्ष - काळी कुज / ब्लॅक रॉट"
    }
  };

  const entry = diseaseTranslations[rawDisease];
  if (entry && entry[lang]) {
    return entry[lang];
  }
  return rawDisease;
};
