import React, { useState } from 'react';
import { TabType } from '../types';
import { Language, translations } from '../i18n';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isCritical?: boolean;
}

interface InterventionEngineViewProps {
  onNavigate: (tab: TabType) => void;
  language: Language;
  onExecuteAction?: (actionId: string, params?: Record<string, any>) => void;
}

export const InterventionEngineView: React.FC<InterventionEngineViewProps> = ({ onNavigate, language, onExecuteAction }) => {
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [selectedAlt, setSelectedAlt] = useState<number | null>(null);
  const [approvedActionName, setApprovedActionName] = useState<string>('Recover partial payment from Customer Alpha');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [recoveryTarget, setRecoveryTarget] = useState(60); // 60% partial payment
  const [inputQuery, setInputQuery] = useState('');

  const t = translations[language] || translations.en;
  const ct = t.copilot;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: ct.chatInitialAi,
      time: '10:42 AM',
    },
    {
      id: '2',
      sender: 'user',
      text: ct.chatInitialUser,
      time: '10:43 AM',
    },
    {
      id: '3',
      sender: 'ai',
      text: ct.chatInitialAi2,
      time: '10:43 AM',
      isCritical: true,
    },
  ]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      time: userTime,
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputQuery('');

    // Generate intelligent AI Copilot response in current language
    setTimeout(() => {
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let reply = "";
      let critical = false;

      const lower = text.toLowerCase();
      if (lower.includes('today') || lower.includes('இன்று') || lower.includes('आज') || lower.includes('ഇന്ന്') || lower.includes('ఈరోజు')) {
        const answers: Record<Language, string> = {
          en: "Recommended priority today: Authorize the Customer Alpha 50% upfront settlement agreement. This injects ₹10.2L liquidity before Day 14 and preserves Supplier Beta delivery slots.",
          ta: "இன்றைய முதன்மை பரிந்துரை: வாடிக்கையாளர் ஆல்ஃபாவிடம் 50% முன்பண ஒப்பந்தத்தை இறுதி செய்யுங்கள். இது 14 நாட்களுக்குள் ₹10.2L பணப்புழக்கத்தை அளித்து சப்ளையர் பீட்டா விநியோகத்தை உறுதி செய்யும்.",
          hi: "आज की प्राथमिक सिफारिश: कस्टमर अल्फा के 50% अग्रिम समझौते को मंजूरी दें। यह 14वें दिन से पहले ₹10.2L तरलता लाएगा और सप्लायर डिलीवरी स्लॉट सुरक्षित रखेगा।",
          ml: "ഇന്നത്തെ പ്രധാന നടപടി: കസ്റ്റമർ ആൽഫയിൽ നിന്ന് 50% മുൻകൂർ തുക സ്വീകരിക്കുക. ഇത് 14 ദിവസത്തിനുള്ളിൽ ₹10.2L പണലഭ്യത ഉറപ്പാക്കും.",
          te: "ఈరోజు ప్రాధాన్యత చర్య: కస్టమర్ ఆల్ఫా 50% ముందస్తు పరిష్కారాన్ని ఆమోదించండి. ఇది డే 14 లోపు ₹10.2L లిక్విడిటీని అందిస్తుంది.",
        };
        reply = answers[language] || answers.en;
      } else if (lower.includes('depend') || lower.includes('முனையம்') || lower.includes('नोड') || lower.includes('നോഡ്') || lower.includes('నోడ్')) {
        const answers: Record<Language, string> = {
          en: "Critical Dependency Path: Customer Alpha (₹12.8L Receivable) ➔ Liquidity Buffer (-₹10.2L) ➔ Supplier Beta Invoicing (14 Days) ➔ Assembly Line Production Halt.",
          ta: "தீவிர சார்பு பாதை: வாடிக்கையாளர் ஆல்ஃபா (₹12.8L வரவு) ➔ பண இருப்பு (-₹10.2L) ➔ சப்ளையர் பீட்டா கட்டணம் (14 நாட்கள்) ➔ உற்பத்தி நிறுத்தம்.",
          hi: "गंभीर निर्भरता पथ: कस्टमर अल्फा (₹12.8L प्राप्य) ➔ तरलता बफर (-₹10.2L) ➔ सप्लायर बीटा बिलिंग (14 दिन) ➔ असेंबली लाइन उत्पादन रुकना।",
          ml: "ഗുരുതരമായ ഡിപൻഡൻസി പാത: കസ്റ്റമർ ആൽഫ (₹12.8L) ➔ പണലഭ്യത (-₹10.2L) ➔ സപ്ലയർ ബീറ്റ (14 ദിവസം) ➔ ഉത്പാദന തടസ്സം.",
          te: "కీలక డిపెండెన్సీ మార్గం: కస్టమర్ ఆల్ఫా (₹12.8L రావలసిన మొత్తం) ➔ లిక్విడిటీ బఫర్ (-₹10.2L) ➔ సప్లయర్ బీటా (14 రోజులు) ➔ ఉత్పత్తి నిలిపివేత.",
        };
        reply = answers[language] || answers.en;
        critical = true;
      } else {
        const answers: Record<Language, string> = {
          en: `Intervention Copilot Analysis: Applying "${text}" to systemic cash flow models reduces cascade probability by 48%. Estimated runway variance is within ±4 days.`,
          ta: `AI வழிகாட்டி பகுப்பாய்வு: "${text}" நடவடிக்கையை செயல்படுத்துவது டோமினோ அபாயத்தை 48% குறைக்கிறது. பண ஓடுபாதை உறுதித்தன்மை அதிகரிக்கும்.`,
          hi: `AI कोपायलट विश्लेषण: "${text}" को लागू करने से डोमिनो जोखिम 48% कम हो जाता है। रनवे स्थिरता में सुधार होगा।`,
          ml: `AI കോപൈലറ്റ് വിശകലനം: "${text}" നടപ്പിലാക്കുന്നത് ഡോമിനോ റിസ്ക് 48% കുറയ്ക്കുന്നു. പ്രവർത്തന സുരക്ഷിതത്വം ഉറപ്പാക്കുന്നു.`,
          te: `AI కోపైలట్ విశ్లేషణ: "${text}" ను వర్తింపజేయడం ద్వారా డొమినో ప్రమాదం 48% తగ్గుతుంది. రన్‌వే స్థిరత్వం పెరుగుతుంది.`,
        };
        reply = answers[language] || answers.en;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          time: aiTime,
          isCritical: critical,
        },
      ]);
    }, 600);
  };

  const handleApproveAction = (actionTitle: string, actionId?: string) => {
    setApprovedActionName(actionTitle);
    setShowSuccessOverlay(true);
    if (onExecuteAction) {
      if (actionId) {
        onExecuteAction(actionId);
      } else if (actionTitle.includes('Alpha') || actionTitle.includes('ஆல்ஃபா') || actionTitle.includes('अल्फा')) {
        onExecuteAction('act-customer-accord');
      } else if (actionTitle.includes('Supplier') || actionTitle.includes('சப்ளையர்') || actionTitle.includes('सप्लायर')) {
        onExecuteAction('act-supplier-moratorium');
      } else if (actionTitle.includes('Loan') || actionTitle.includes('கடன்') || actionTitle.includes('लोन')) {
        onExecuteAction('act-bridge-credit');
      } else {
        onExecuteAction('act-freeze-spend');
      }
    }
    setTimeout(() => {
      setShowSuccessOverlay(false);
    }, 2500);
  };

  return (
    <div className="pt-20 pb-28 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* Left Column: Interventions & Analysis */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono-custom">
                  {ct.badge}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-geist">
                {ct.title}
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                {ct.desc}
              </p>
            </div>
            <button
              onClick={() => onNavigate('actions')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 self-start sm:self-auto transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span>All Action Sections</span>
            </button>
          </div>

          {/* Primary Recommendation Bento Hero Card (Obsidian Black) */}
          <div className="bg-[#0D121F] rounded-[32px] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-cyan-400 flex items-center justify-center border border-indigo-500/30">
                  <span 
                    className="material-symbols-outlined text-lg" 
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </div>
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono-custom">
                  {ct.primaryRecommendation}
                </span>
              </div>
              <span className="text-xs font-bold font-mono-custom text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                {ct.confidence}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 max-w-2xl tracking-tight font-geist">
              {ct.recTitle}
            </h2>
            <p className="text-sm text-gray-300 mb-6 max-w-2xl leading-relaxed">
              {ct.recDesc}
            </p>

            {/* Metrics Chips */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-[#121829] px-5 py-3.5 rounded-2xl border border-white/10 min-w-[140px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase font-mono-custom mb-1">
                  {ct.riskReduction}
                </p>
                <p className="text-3xl font-bold text-cyan-400">85%</p>
              </div>

              <div className="bg-[#121829] px-5 py-3.5 rounded-2xl border border-white/10 min-w-[140px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase font-mono-custom mb-1">
                  {ct.estRecovery}
                </p>
                <p className="text-3xl font-bold text-white">₹10.2L</p>
              </div>

              <div className="bg-[#121829] px-5 py-3.5 rounded-2xl border border-white/10 min-w-[140px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase font-mono-custom mb-1">
                  {ct.timeToImpact}
                </p>
                <p className="text-3xl font-bold text-indigo-300">48 Hrs</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleApproveAction(ct.recTitle)}
                className="bg-white hover:bg-gray-200 text-black font-bold text-xs px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-white/10"
              >
                <span className="material-symbols-outlined text-lg text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                {ct.approveAction}
              </button>
              <button
                onClick={() => setShowAdjustModal(true)}
                className="bg-[#141C33] hover:bg-[#1C2645] text-white font-medium text-xs px-6 py-3.5 rounded-full transition-colors flex items-center gap-2 border border-white/10"
              >
                <span className="material-symbols-outlined text-lg text-gray-300">tune</span>
                {ct.adjustParameters}
              </button>
            </div>
          </div>

          {/* Intervention Impact Chart Bento Card */}
          <div className="bg-[#0D121F] rounded-[32px] p-8 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight font-geist">
                  {ct.projectedCashFlow}
                </h3>
                <p className="text-xs text-gray-400 font-mono-custom">
                  {ct.liquidityTrajectory}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
                  <span className="font-medium text-gray-200">{ct.withIntervention}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#F43F5E]" />
                  <span className="font-medium text-gray-400">{ct.baselineRisk}</span>
                </div>
              </div>
            </div>

            <div className="h-48 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" strokeWidth="1" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" strokeWidth="1" />
                <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" strokeWidth="1" />

                {/* Projected Line (With Intervention) */}
                <path
                  className="sparkline-anim"
                  d="M0,180 Q100,170 200,140 T400,90 T600,40 T800,20"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="3"
                />
                <path
                  d="M0,180 Q100,170 200,140 T400,90 T600,40 T800,20 L800,200 L0,200 Z"
                  fill="url(#grad1)"
                />

                {/* Baseline Line (No Action) */}
                <path
                  className="sparkline-anim"
                  d="M0,180 Q100,185 200,190 T400,185 T600,190 T800,195"
                  fill="none"
                  stroke="#F43F5E"
                  strokeDasharray="5"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Alternative Actions List */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono-custom mb-3">
              {ct.alternativeActions}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Alt Action 1 */}
              <div
                onClick={() => {
                  setSelectedAlt(1);
                  handleApproveAction(ct.alt1Title);
                }}
                className={`bg-[#0D121F] rounded-2xl p-5 border border-white/10 shadow-lg transition-all cursor-pointer group hover:border-amber-500/50 ${
                  selectedAlt === 1 ? 'ring-2 ring-amber-500 bg-amber-950/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <span className="material-symbols-outlined text-base">handshake</span>
                  </div>
                  <span className="font-mono-custom text-[10px] font-bold text-gray-400">ALT 1</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-3 font-geist">
                  {ct.alt1Title}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Risk Red.</span>
                    <span className="text-cyan-400 font-bold font-mono-custom">42%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Impl. Cost</span>
                    <span className="text-gray-300 font-medium font-mono-custom">Med</span>
                  </div>
                </div>
              </div>

              {/* Alt Action 2 */}
              <div
                onClick={() => {
                  setSelectedAlt(2);
                  handleApproveAction(ct.alt2Title);
                }}
                className={`bg-[#0D121F] rounded-2xl p-5 border border-white/10 shadow-lg transition-all cursor-pointer group hover:border-rose-500/50 ${
                  selectedAlt === 2 ? 'ring-2 ring-rose-500 bg-rose-950/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                    <span className="material-symbols-outlined text-base">account_balance</span>
                  </div>
                  <span className="font-mono-custom text-[10px] font-bold text-gray-400">ALT 2</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-3 font-geist">
                  {ct.alt2Title}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Risk Red.</span>
                    <span className="text-cyan-400 font-bold font-mono-custom">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Impl. Cost</span>
                    <span className="text-rose-400 font-bold font-mono-custom">High</span>
                  </div>
                </div>
              </div>

              {/* Alt Action 3 */}
              <div
                onClick={() => {
                  setSelectedAlt(3);
                  handleApproveAction(ct.alt3Title);
                }}
                className={`bg-[#0D121F] rounded-2xl p-5 border border-white/10 shadow-lg transition-all cursor-pointer group hover:border-indigo-500/50 ${
                  selectedAlt === 3 ? 'ring-2 ring-indigo-500 bg-indigo-950/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                    <span className="material-symbols-outlined text-base">content_cut</span>
                  </div>
                  <span className="font-mono-custom text-[10px] font-bold text-gray-400">ALT 3</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-3 font-geist">
                  {ct.alt3Title}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Risk Red.</span>
                    <span className="text-cyan-400 font-bold font-mono-custom">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Impl. Cost</span>
                    <span className="text-gray-300 font-medium font-mono-custom">Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Risk Copilot Bento Panel */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-[580px]">
          <div className="bg-[#0D121F] rounded-[32px] border border-white/10 shadow-2xl flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="p-5 border-b border-white/10 flex items-center gap-3 bg-[#0A0E17]">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight font-geist">
                  {ct.aiRiskCopilot}
                </h3>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5 font-mono-custom">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {ct.copilotOnline}
                </span>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 max-h-[420px] bg-[#07090E]">
              {messages.map((msg) => {
                if (msg.sender === 'ai') {
                  return (
                    <div key={msg.id} className="flex flex-col gap-1 max-w-[90%] self-start">
                      <div className="bg-[#111728] p-3.5 rounded-2xl rounded-tl-none text-gray-200 border border-white/10">
                        <p className="text-xs md:text-sm leading-relaxed">
                          {msg.text}
                        </p>
                        {msg.isCritical && (
                          <div className="bg-rose-500/20 border border-rose-500/30 p-2 mt-2 rounded-xl text-[11px] text-rose-300 font-mono-custom font-bold">
                            {ct.criticalRiskPath}
                          </div>
                        )}
                      </div>
                      <span className="font-mono-custom text-[10px] text-gray-500 ml-1">
                        {msg.time}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex flex-col gap-1 max-w-[90%] self-end">
                    <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-none shadow-md">
                      <p className="text-xs md:text-sm">
                        {msg.text}
                      </p>
                    </div>
                    <span className="font-mono-custom text-[10px] text-gray-500 mr-1 text-right">
                      {msg.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#0A0E17]">
              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => handleSendMessage(ct.quickAsk1)}
                  className="text-[11px] bg-[#121829] border border-white/10 text-gray-300 px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                >
                  {ct.quickAsk1}
                </button>
                <button
                  onClick={() => handleSendMessage(ct.quickAsk2)}
                  className="text-[11px] bg-[#121829] border border-white/10 text-gray-300 px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                >
                  {ct.quickAsk2}
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="w-full bg-[#07090E] border border-white/10 rounded-full pl-4 pr-11 py-2.5 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                  placeholder={ct.askPlaceholder}
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Parameters Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0A0E17] border border-white/15 rounded-[32px] max-w-lg w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white font-geist">
                {ct.adjustParameters}
              </h3>
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-300 mb-2">
                  <span>Partial Recovery Target:</span>
                  <span className="text-cyan-400 font-bold font-mono-custom">{recoveryTarget}% (₹{(recoveryTarget * 0.2).toFixed(1)}L)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={recoveryTarget}
                  onChange={(e) => setRecoveryTarget(Number(e.target.value))}
                />
              </div>

              <div className="bg-[#121829] p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Net Liquidity:</span>
                  <span className="text-cyan-400 font-bold font-mono-custom">+₹{(recoveryTarget * 0.17).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Customer Acceptance Likelihood:</span>
                  <span className="text-emerald-400 font-bold font-mono-custom">{100 - recoveryTarget + 10}%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  handleApproveAction(`Custom Recovery (${recoveryTarget}%) from Customer Alpha`);
                }}
                className="px-6 py-2.5 bg-white hover:bg-gray-200 text-black rounded-full text-xs font-semibold shadow-md"
              >
                Apply & Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay Feedback */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0A0E17] rounded-[32px] p-8 max-w-md w-full flex flex-col items-center text-center shadow-2xl border border-white/15">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10 border border-emerald-500/30">
              <span className="material-symbols-outlined text-3xl">
                check
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight font-geist">
              {ct.actionApproved}
            </h2>
            <p className="text-xs text-gray-400 mt-2 max-w-xs leading-relaxed">
              Sequence initiated for <span className="text-cyan-300 font-semibold">{approvedActionName}</span>. Updating models and notifying node owners.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
