import React, { useState, useEffect, useRef } from 'react';
import { Language, translations } from '../i18n';
import { TabType } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onNavigate: (tab: TabType) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: string;
  actionTab?: TabType;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigate,
}) => {
  const t = translations[language] || translations.en;
  const vt = t.voiceAssistant;

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Initialize initial greeting when opened or language changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis || null;
    }

    const greetings: Record<Language, string> = {
      en: "Hello! I am AIDA, your AI Financial Risk Voice Assistant. You can ask me about cash runways, simulate domino failures, or review systemic risk alerts.",
      ta: "வணக்கம்! நான் உங்கள் AI நிதி அபாய வழிகாட்டி AIDA. பண கையிருப்பு, டோமினோ அபாய வரைபடம் மற்றும் மீட்பு நடவடிக்கைகள் பற்றி என்னிடம் கேட்கலாம்.",
      hi: "नमस्ते! मैं आपकी AI वित्तीय जोखिम वॉइस कोपायलट AIDA हूँ। आप मुझसे कैश रनवे, डोमिनो विफलता सिमुलेशन या अलर्ट के बारे में पूछ सकते हैं।",
      ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI ഫിനാൻഷ്യൽ റിസ്ക് അസിസ്റ്റന്റ് AIDA ആണ്. ക്യാഷ് റൺവേ, ഡോമിനോ റിസ്ക് മാപ്പ്, പരിഹാര നിർദ്ദേശങ്ങൾ എന്നിവ ചോദിക്കാം.",
      te: "నమస్కారం! నేను మీ AI ఫైనాన్షియల్ రిస్క్ వాయిస్ కోపైలట్ AIDA. క్యాష్ రన్‌వే, డొమినో విశ్లేషణ లేదా సిఫార్సు చర్యల గురించి నన్ను అడగవచ్చు.",
    };

    setMessages([
      {
        id: 'greet-1',
        sender: 'assistant',
        text: greetings[language] || greetings.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language, isOpen]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing, isSpeaking]);

  // Clean up speech synthesis & recognition on unmount or close
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const localeMap: Record<Language, string> = {
        en: 'en-US',
        ta: 'ta-IN',
        hi: 'hi-IN',
        ml: 'ml-IN',
        te: 'te-IN',
      };
      utterance.lang = localeMap[language] || 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select matching voice if available
      const voices = synthRef.current.getVoices();
      const voice = voices.find((v) => v.lang.startsWith(utterance.lang.substring(0, 2)));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Start / Stop Web Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const localeMap: Record<Language, string> = {
        en: 'en-US',
        ta: 'ta-IN',
        hi: 'hi-IN',
        ml: 'ml-IN',
        te: 'te-IN',
      };
      recognition.lang = localeMap[language] || 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript && transcript.trim()) {
          handleProcessQuery(transcript.trim());
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechSupported(false);
    }
  };

  // Process natural language command and formulate answers in chosen language
  const handleProcessQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    const lower = query.toLowerCase();

    setTimeout(() => {
      let responseText = '';
      let actionTag: string | undefined;
      let actionTab: TabType | undefined;

      // 1. Cash runway & liquidity
      if (
        lower.includes('runway') ||
        lower.includes('cash') ||
        lower.includes('பணம்') ||
        lower.includes('ஓடுபாதை') ||
        lower.includes('कैश') ||
        lower.includes('रनवे') ||
        lower.includes('റൺവേ') ||
        lower.includes('రన్‌వే') ||
        lower.includes('నగదు')
      ) {
        const answers: Record<Language, string> = {
          en: "Your current runway is 45 days with ₹42.5 Lakhs available cash. In a worst-case Customer Alpha delay, your runway drops to 27 days (-18 days).",
          ta: "உங்கள் தற்போதைய பண ஓடுபாதை 45 நாட்கள் மற்றும் ₹42.5 லட்சம் கையிருப்பு உள்ளது. வாடிக்கையாளர் ஆல்ஃபா தாமதத்தால் இது 27 நாட்களாக குறையலாம் (-18 நாட்கள்).",
          hi: "आपका वर्तमान कैश रनवे 45 दिन है और उपलब्ध नकदी ₹42.5 लाख है। कस्टमर अल्फा के विलंब से यह घटकर 27 दिन हो सकता है (-18 दिन)।",
          ml: "നിങ്ങളുടെ നിലവിലെ ക്യാഷ് റൺവേ 45 ദിവസവും ₹42.5 ലക്ഷം ലഭ്യമായ പണവുമാണ്. കസ്റ്റമർ ആൽഫ വൈകിയാൽ ഇത് 27 ദിവസമായി കുറയും (-18 ദിവസങ്ങൾ).",
          te: "మీ ప్రస్తుత క్యాష్ రన్‌వే 45 రోజులు మరియు ₹42.5 లక్షల అందుబాటులో ఉన్న నగదు ఉంది. కస్టమర్ ఆల్ఫా ఆలస్యమైతే ఇది 27 రోజులకు తగ్గుతుంది (-18 రోజులు).",
        };
        responseText = answers[language] || answers.en;
        actionTag = t.nav.dashboard;
        actionTab = 'dashboard';
      }
      // 2. Simulation / What if / Stress test
      else if (
        lower.includes('simulate') ||
        lower.includes('stress') ||
        lower.includes('what if') ||
        lower.includes('சிமுலேஷன்') ||
        lower.includes('சோதனை') ||
        lower.includes('सिमुलेशन') ||
        lower.includes('टेस्ट') ||
        lower.includes('സിമുലേറ്റ്') ||
        lower.includes('సిమ్యులేషన్')
      ) {
        const answers: Record<Language, string> = {
          en: "Opening the What-If Simulator. I have loaded the Customer Alpha delay scenario (₹25,00,000 exposed, 45-day delay, 68% contagion probability).",
          ta: "வாட்-இஃப் சிமுலேட்டரைத் திறக்கிறேன். வாடிக்கையாளர் ஆல்ஃபா தாமத சூழ்நிலை (₹25,00,000 வெளிப்பாடு, 45 நாட்கள் தாமதம், 68% பரவல் நிகழ்தகவு) ஏற்றப்பட்டுள்ளது.",
          hi: "व्हाट-इफ सिम्युलेटर खोला जा रहा है। मैंने कस्टमर अल्फा विलंब परिदृश्य लोड कर दिया है (₹25,00,000 एक्सपोज़र, 45 दिन का विलंब, 68% प्रसार संभावना)।",
          ml: "വാട്ട്-ഇഫ് സിമുലേറ്റർ തുറക്കുന്നു. കസ്റ്റമർ ആൽഫ വൈകുന്ന സാഹചര്യം (₹25,00,000 റിസ്ക്, 45 ദിവസത്തെ കാലതാമസം, 68% സാധ്യത) ലോഡ് ചെയ്തു.",
          te: "వాట్-ఇఫ్ సిమ్యులేటర్ తెరవబడుతోంది. నేను కస్టమర్ ఆల్ఫా ఆలస్య పరిస్థితిని లోడ్ చేసాను (₹25,00,000 ఎక్స్‌పోజర్, 45 రోజుల ఆలస్యం, 68% వ్యాప్తి సంభావ్యత).",
        };
        responseText = answers[language] || answers.en;
        actionTag = t.nav.simulator;
        actionTab = 'simulator';
      }
      // 3. Domino Map / Topology
      else if (
        lower.includes('map') ||
        lower.includes('domino') ||
        lower.includes('node') ||
        lower.includes('topology') ||
        lower.includes('வரைபடம்') ||
        lower.includes('முனையம்') ||
        lower.includes('मैप') ||
        lower.includes('टोपोलॉजी') ||
        lower.includes('മാപ്പ്') ||
        lower.includes('మ్యాప్') ||
        lower.includes('నోడ్')
      ) {
        const answers: Record<Language, string> = {
          en: "Navigating to Domino Map. There are 2 critical nodes: Customer Alpha (₹25L exposure) and Supplier Beta (48hr component backlog).",
          ta: "டோமினோ வரைபடத்திற்கு செல்கிறேன். 2 தீவிர அபாய முனையங்கள் உள்ளன: வாடிக்கையாளர் ஆல்ஃபா (₹25 லட்சம் வெளிப்பாடு) மற்றும் சப்ளையர் பீட்டா (48 மணிநேர தாமதம்).",
          hi: "डोमिनो मैप पर ले जाया जा रहा है। 2 गंभीर नोड्स हैं: कस्टमर अल्फा (₹25L एक्सपोज़र) और सप्लायर बीटा (48 घंटे की देरी)।",
          ml: "ഡോമിനോ മാപ്പിലേക്ക് പോകുന്നു. 2 ഗുരുതരമായ നോഡുകൾ ഉണ്ട്: കസ്റ്റമർ ആൽഫ (₹25 ലക്ഷം ബാധ്യത), സപ്ലയർ ബീറ്റ (48 മണിക്കൂർ കാലതാമസം).",
          te: "డొమినో మ్యాప్‌కు నావిగేట్ చేస్తున్నాను. 2 తీవ్రమైన నోడ్లు ఉన్నాయి: కస్టమర్ ఆల్ఫా (₹25 లక్షల ముప్పు) మరియు సప్లయర్ బీటా (48 గంటల ఆలస్యం).",
        };
        responseText = answers[language] || answers.en;
        actionTag = t.nav.dominoMap;
        actionTab = 'domino-map';
      }
      // 4. Action Center / Interventions
      else if (
        lower.includes('action center') ||
        lower.includes('actions') ||
        lower.includes('execute') ||
        lower.includes('credit line') ||
        lower.includes('freeze') ||
        lower.includes('moratorium') ||
        lower.includes('செயல்பாட்டு மையம்') ||
        lower.includes('செயல்படுத்து') ||
        lower.includes('एक्शन सेंटर') ||
        lower.includes('कार्रवाई') ||
        lower.includes('ആക്ഷൻ') ||
        lower.includes('നടപടി കേന്ദ്രം') ||
        lower.includes('యాక్షన్') ||
        lower.includes('చర్యల కేంద్రం')
      ) {
        const answers: Record<Language, string> = {
          en: "Opening the Action Center. You can execute working capital drawdowns, counterparty settlements, supplier term extensions, or deploy automated AI playbooks.",
          ta: "செயல்பாட்டு மையத்தைத் திறக்கிறேன். அவசர பணப்புழக்கம், வாடிக்கையாளர் செட்டில்மென்ட், சப்ளையர் தவணை நீட்டிப்பு மற்றும் தானியங்கி AI உத்திகளை இயக்கலாம்.",
          hi: "एक्शन सेंटर खोला जा रहा है। आप वर्किंग कैपिटल ड्रॉडाउन, कस्टमर सेटलमेंट, सप्लायर टर्म एक्सटेंशन या स्वचालित AI प्लेबुक निष्पादित कर सकते हैं।",
          ml: "ആക്ഷൻ സെന്റർ തുറക്കുന്നു. അടിയന്തര മൂലധനം ലഭ്യമാക്കൽ, കസ്റ്റമർ സെറ്റിൽമെന്റ്, സപ്ലയർ കാലാവധി നീട്ടൽ, ഓട്ടോമേറ്റഡ് AI പ്ലേബുക്കുകൾ എന്നിവ നടപ്പിലാക്കാം.",
          te: "యాక్షన్ సెంటర్ తెరవబడుతోంది. మీరు వర్కింగ్ క్యాపిటల్ డ్రాడౌన్, కస్టమర్ సెటిల్మెంట్, సప్లయర్ టర్మ్ ఎక్స్‌టెన్షన్ లేదా ఆటోమేటెడ్ AI ప్లేబుక్‌లను అమలు చేయవచ్చు.",
        };
        responseText = answers[language] || answers.en;
        actionTag = t.nav.actions;
        actionTab = 'actions';
      }
      // 5. Recommendation / Copilot
      // 5. Alerts
      else if (
        lower.includes('alert') ||
        lower.includes('warning') ||
        lower.includes('எச்சரிக்கை') ||
        lower.includes('अलर्ट') ||
        lower.includes('അലേർട്ട്') ||
        lower.includes('అలర్ట్')
      ) {
        const answers: Record<Language, string> = {
          en: "You have 1 Critical alert (Supplier Beta payment terms compressed to 30 days) and 1 Warning alert (Inventory storage holding cost up 4%).",
          ta: "உங்களுக்கு 1 தீவிர எச்சரிக்கை (சப்ளையர் பீட்டா கட்டண தவணை 30 நாட்களாக குறைப்பு) மற்றும் 1 எச்சரிக்கை (சரக்கு கிடங்கு கட்டணம் 4% உயர்வு) உள்ளன.",
          hi: "आपके पास 1 गंभीर अलर्ट (सप्लायर बीटा भुगतान शर्तें 30 दिन) और 1 चेतावनी अलर्ट (इन्वेंट्री लागत 4% बढ़ी) है।",
          ml: "നിങ്ങൾക്ക് 1 ഗുരുതരമായ അലേർട്ട് (സപ്ലയർ ബീറ്റ നിബന്ധനകൾ 30 ദിവസമായി ചുരുങ്ങി) 1 മുന്നറിയിപ്പ് (ഇൻവെന്ററി ചെലവ് 4% കൂടി) എന്നിവയുണ്ട്.",
          te: "మీకు 1 తీవ్రమైన అలర్ట్ (సప్లయర్ బీటా నిబంధనలు 30 రోజులకు తగ్గింపు) మరియు 1 హెచ్చరిక (ఇన్వెంటరీ నిల్వ ఖర్చు 4% పెరుగుదల) ఉన్నాయి.",
        };
        responseText = answers[language] || answers.en;
        actionTag = t.nav.alerts;
        actionTab = 'alerts';
      }
      // Default conversational response
      else {
        const answers: Record<Language, string> = {
          en: `I analyzed your query regarding "${query}". The systemic risk models indicate that maintaining minimum liquidity reserves above ₹35 Lakhs is vital to withstand supply chain contagion. Would you like to run a simulation or open the AI Intervention Copilot?`,
          ta: `"${query}" பற்றிய உங்கள் வினவலை பகுப்பாய்வு செய்தேன். சப்ளையர் சங்கிலி அழுத்தத்தை எதிர்கொள்ள குறைந்தபட்ச பண இருப்பு ₹35 லட்சத்திற்கு மேல் இருக்க வேண்டும் என மாதிரிகள் கூறுகின்றன. சிமுலேஷன் இயக்கவா அல்லது AI வழிகாட்டியை திறக்கவா?`,
          hi: `मैंने "${query}" के संबंध में आपके प्रश्न का विश्लेषण किया। सिस्टम जोखिम मॉडल बताते हैं कि आपूर्ति श्रृंखला के झटकों को झेलने के लिए न्यूनतम ₹35 लाख की तरलता बनाए रखना आवश्यक है। क्या आप सिमुलेशन चलाना चाहते हैं या AI कोपायलट खोलना चाहते हैं?`,
          ml: `"${query}" സംബന്ധിച്ച ചോദ്യം വിശകലനം ചെയ്തു. സപ്ലൈ ചെയിൻ പ്രതിസന്ധികളെ മറികടക്കാൻ ₹35 ലക്ഷത്തിലധികം പണലഭ്യത നിലനിർത്തേണ്ടതുണ്ട്. സിമുലേഷൻ പ്രവർത്തിപ്പിക്കണോ അതോ AI കോപൈലറ്റ് തുറക്കണോ?`,
          te: `"${query}" పై మీ ప్రశ్నను విశ్లేషించాను. సప్లై చైన్ సమస్యలను తట్టుకోవడానికి కనీస లిక్విడిటీ ₹35 లక్షల కంటే ఎక్కువగా ఉండాలని మోడల్స్ సూచిస్తున్నాయి. మీరు సిమ్యులేషన్ చేయాలనుకుంటున్నారా లేదా AI కోపైలట్ తెరవాలనుకుంటున్నారా?`,
        };
        responseText = answers[language] || answers.en;
        actionTag = t.nav.copilot;
        actionTab = 'copilot';
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag,
        actionTab,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);
      speakText(responseText);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0A0E17] border border-white/10 rounded-[32px] w-full max-w-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh] relative">
        {/* Glowing Top Ambient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-[#0E1322]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                isListening ? 'bg-rose-600 animate-pulse ring-4 ring-rose-500/30' : isSpeaking ? 'bg-indigo-600 ring-4 ring-indigo-500/30' : 'bg-indigo-600'
              }`}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isListening ? 'mic' : isSpeaking ? 'volume_up' : 'smart_toy'}
                </span>
              </div>
              {(isListening || isSpeaking) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight font-geist">
                  {vt.title}
                </h3>
                <span className="text-[10px] font-mono-custom font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {language.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {isListening ? vt.listening : isSpeaking ? vt.speaking : isProcessing ? vt.processing : 'Real-time Systemic AI Intelligence'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Stop Audio"
              >
                <span className="material-symbols-outlined text-lg">volume_off</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title={vt.close}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Chat History & Waveform Canvas */}
        <div 
          ref={chatScrollRef}
          className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4 bg-[#07090E]"
        >
          {/* Audio Pulsing Wave Visualizer */}
          <div className="p-4 rounded-2xl bg-[#0D121F] border border-white/5 flex items-center justify-center gap-1.5 h-16">
            {[40, 65, 85, 30, 95, 55, 75, 45, 90, 60, 35, 80, 50, 70, 95, 30].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isListening
                    ? 'bg-rose-500 animate-pulse'
                    : isSpeaking
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-indigo-500/40'
                }`}
                style={{
                  height: isListening || isSpeaking ? `${Math.max(12, (h * (isSpeaking ? 0.9 : 0.8)))}%` : '20%',
                  animationDelay: `${i * 70}ms`,
                }}
              />
            ))}
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md rounded-tr-sm'
                    : 'bg-[#111728] text-gray-200 border border-white/10 shadow-md rounded-tl-sm'
                }`}
              >
                <p>{m.text}</p>

                {m.actionTag && m.actionTab && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => {
                        onNavigate(m.actionTab!);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>{m.actionTag}</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-500 font-mono-custom mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-[#111728] px-4 py-2.5 rounded-2xl w-fit border border-white/5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{vt.processing}</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips in Chosen Language */}
        <div className="px-5 py-2.5 bg-[#0A0E17] border-t border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
          {[vt.prompt1, vt.prompt2, vt.prompt3, vt.prompt4].map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleProcessQuery(p)}
              className="text-xs bg-[#121829] hover:bg-[#1A2238] text-gray-300 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 whitespace-nowrap transition-all flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-xs text-indigo-400">chat</span>
              {p}
            </button>
          ))}
        </div>

        {/* Input & Voice Trigger Footer */}
        <div className="p-4 md:p-5 bg-[#0D121F] border-t border-white/10 flex items-center gap-3">
          {/* Big Circular Microphone Button */}
          <button
            onClick={toggleListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 shadow-lg ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white ring-2 ring-indigo-400/30'
            }`}
            title={isListening ? vt.tapToStop : vt.tapToSpeak}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isListening ? 'mic_off' : 'mic'}
            </span>
          </button>

          {/* Text Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessQuery(inputQuery);
            }}
            className="flex-1 flex items-center gap-2 bg-[#07090E] border border-white/10 rounded-full px-4 py-1.5 focus-within:border-indigo-500 transition-all"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.copilot.askPlaceholder}
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
