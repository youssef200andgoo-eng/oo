import React, { useState } from "react";
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  Send, 
  Compass, 
  Bot, 
  DollarSign, 
  User, 
  Award, 
  Radio, 
  Bell, 
  Smartphone as PhoneIcon, 
  MessageCircle, 
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw
} from "lucide-react";

interface SguMobileCompanionProps {
  student: any;
  courses: any[];
  finance: any[];
  triggerSystemPush: (title: string, message: string) => void;
  lang: "ar" | "en";
}

export default function SguMobileCompanion({
  student,
  courses,
  finance,
  triggerSystemPush,
  lang
}: SguMobileCompanionProps) {
  // Mobile app sub-views
  const [mobileTab, setMobileTab] = useState<"home" | "ai_chat" | "analytics" | "sync_hub">("home");

  // NFC State simulation
  const [nfcTransmitting, setNfcTransmitting] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);

  // Chat states inside mobile phone
  const [phoneMessages, setPhoneMessages] = useState<any[]>([
    { role: "model", text: lang === "ar" ? "أهلاً بك في تطبيق SGU الذكي السريع! كيف أخدمك اليوم بقرارك الأكاديمي؟" : "Hello! SGU Mobile AI is live. Ask me anything about your GPA or courses." }
  ]);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  // WhatsApp simulation states
  const [phoneNumber, setPhoneNumber] = useState("01026418319");
  const [waLoading, setWaLoading] = useState(false);
  const [waLogs, setWaLogs] = useState<any>(null);

  // FCM push simulation states
  const [fcmRegistered, setFcmRegistered] = useState(false);
  const [fcmResponse, setFcmResponse] = useState<any>(null);

  const startNfcTransmission = () => {
    if (nfcTransmitting) return;
    setNfcTransmitting(true);
    setNfcSuccess(false);

    // Dynamic Central push log trigger
    triggerSystemPush(
      lang === "ar" ? "📡 إرسال رمز البصمة (NFC)" : "📡 Virtual NFC Broadcast",
      lang === "ar" 
        ? "بث إلكتروني نشط لمعرف الهوية NFC-SGU-D9AB3E عبر محاكي البلوتوث الذكي للقارئ." 
        : "NFC Broadcast triggered. Validating secure digital student tag."
    );

    setTimeout(() => {
      setNfcTransmitting(false);
      setNfcSuccess(true);
      
      triggerSystemPush(
        lang === "ar" ? "✅ تم التصديق ومطابقة الحضور بـ SGU" : "✅ Biometric Attendance Verified",
        lang === "ar"
          ? "تأكيد الحضور الذاتي: دمج البلوكتشين ومطابقة الوثيقة في قاعدة سجلات المحاضرة بنجاح!"
          : "NFC matching complete. Attendance logged for Semester 2 DB301."
      );
    }, 2500);
  };

  const handlePhoneSendChat = async () => {
    if (!phoneInput.trim() || phoneLoading) return;
    const userMsg = phoneInput;
    setPhoneInput("");
    setPhoneMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setPhoneLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[MOBILE COMPANION SCREEN]\nStudent: ${student.nameArabic}\nGPA: ${student.gpa}\nQuestion: ${userMsg}`,
          modelType: "gemini"
        })
      });

      const data = await res.json();
      setPhoneMessages(prev => [...prev, { role: "model", text: data.text || "No Response." }]);
    } catch (e) {
      setPhoneMessages(prev => [...prev, { role: "model", text: "⚠️ Error contacting AI hub." }]);
    } finally {
      setPhoneLoading(false);
    }
  };

  const registerFcmDeviceToken = async () => {
    setWaLoading(true);
    try {
      const response = await fetch("/api/mobile/fcm/register-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          deviceToken: "fcm_token_and_84719bbfe72c",
          platform: "android"
        })
      });
      const data = await response.json();
      setFcmResponse(data);
      setFcmRegistered(true);

      triggerSystemPush(
        lang === "ar" ? "🔔 تم ربط جهازك بـ FCM" : "🔔 Device Token Registered",
        lang === "ar" 
          ? `تم تمكين إشعارات الدفع الموحدة لحسابك بـ SGU لتلقي تفوقات السلسلة والأنشطة.`
          : `Device token registered. System handles central push releases automatically.`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setWaLoading(false);
    }
  };

  const triggerFcmAlert = async () => {
    try {
      const res = await fetch("/api/mobile/fcm/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lang === "ar" ? "📢 استعد لامتحان الميدترم" : "📢 Prepare for Midterm Exam",
          body: lang === "ar" ? "تنبيه: متبقي 4 أيام على انطلاق امتحانات الميدترم لطلاب المستوى الثالث." : "Midterm starts in 4 days. Download study plan.",
          studentId: student.id
        })
      });
      const data = await res.json();
      setFcmResponse(data);

      triggerSystemPush(
         lang === "ar" ? "📢 إشعار عاجل من FCM" : "📢 FCM Live Push Notification",
         lang === "ar" 
           ? "تنبيه معجل: قام السيرفر ببث الإشعار طبقاً للمعيار القياسي HTTP v1 بنجاح."
           : "FCM Alert released successfully with high-priority. Check logs!"
      );

    } catch (e) {
      console.error(e);
    }
  };

  const triggerWhatsAppAlert = async (type: "dues" | "admission") => {
    setWaLoading(true);
    setWaLogs(null);
    try {
      const response = await fetch("/api/whatsapp/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: phoneNumber,
          studentName: lang === "ar" ? student.nameArabic : "Youssef El-Kurdy",
          alertType: type,
          amount: "18,500 EGP",
          admissionStatus: "مقبول نهائياً بالجامعة"
        })
      });
      
      const data = await response.json();
      setWaLogs(data);

      triggerSystemPush(
        lang === "ar" ? "💬 إرسال تنبيه WhatsApp حي" : "💬 dispatch WhatsApp Alert",
        lang === "ar" 
          ? `تم تكوين وإرسال الحمولة الرقمية بنجاح إلى الرقم +2${phoneNumber} طبقاً لـ Meta API v19`
          : `Payload compiled and dispatched through Meta Cloud API to +2${phoneNumber}!`
      );
    } catch (e: any) {
      console.error(e);
    } finally {
      setWaLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center gap-4 text-right border-b border-slate-850 pb-4">
        <div>
          <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-teal-400 font-mono font-bold ml-auto block w-fit mb-2">
            CROSS-PLATFORM FLUTTER APPS
          </span>
          <h4 className="text-sm font-black text-slate-100 flex items-center gap-2 justify-end">
            <span>{lang === "ar" ? "محاكي بوابات الحرم المحمول وقنوات التواصل" : "SGU Student Mobile App & Omni-channel Hub"}</span>
            <Smartphone className="w-5 h-5 text-teal-400" />
          </h4>
        </div>

        <p className="text-[11px] text-slate-500 max-w-sm">
          {lang === "ar" 
            ? "اختبر النسخة المصغرة للجامعة على الهاتف المحمول بالتكامل مع بطاقة الـ NFC الرقمية، خدمات الدفع الكنترول الفوري، البث المباشر لإعلانات الـ FCM، وقنوات WhatsApp لـ Meta."
            : "Simulate mobile services. Experience on-device interactive NFC credentials, push notifications via standard FCM, and Meta Business API logs."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Phone Mockup Frame (Slices 5 Columns of Grid) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[310px] h-[610px] bg-slate-950 rounded-[40px] p-2.5 border-[4px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden">
            
            {/* Top Speaker Notch and Sensor */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center gap-1.5 px-3">
              <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
              <span className="w-12 h-1 bg-slate-900 rounded-full"></span>
            </div>

            {/* Inner Phone OS Header (Status Bar) */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 px-5 pt-3 pb-2 select-none z-20">
              <span className="font-mono font-bold">10:17</span>
              <div className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono font-bold">5G</span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Phone Active Screen Area */}
            <div className="flex-1 bg-slate-900 rounded-[30px] overflow-hidden flex flex-col relative z-10 select-none">
              
              {/* Phone app header */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-850/60 text-right flex justify-between items-center">
                <span className="text-[8px] bg-emerald-950 text-emerald-400 font-bold px-1 py-0.5 rounded">
                  SGU GO v2.1
                </span>
                
                <div className="flex gap-1 items-center flex-row-reverse">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span className="text-[10px] font-black text-slate-250">
                    {lang === "ar" ? "بوابة الطالب" : "SGU GO Portal"}
                  </span>
                </div>
              </div>

              {/* PHONE TAB CONTENT SCREEN */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* 1. HOME TAB SCREEN */}
                {mobileTab === "home" && (
                  <div className="space-y-4">
                    {/* Welcome banner */}
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 text-right space-y-1">
                      <span className="text-[8px] text-slate-500 block">SGU-10045</span>
                      <h5 className="text-[11px] font-black text-slate-200">
                        {lang === "ar" ? `مرحباً، ${student.nameArabic}` : `Welcome, ${student.nameEnglish || "Youssef"}`}
                      </h5>
                      <p className="text-[9px] text-teal-400">{student.major}</p>
                    </div>

                    {/* Integrated GPA Progress Circular simulation */}
                    <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 space-y-2 text-right">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono text-emerald-400 font-bold">{student.totalGPA || student.gpa} / 4.00</span>
                        <span className="text-slate-550 font-bold">{lang === "ar" ? "المعدل التراكمي النشط" : "Active GPA Meter"}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition"
                          style={{ width: `${(student.gpa / 4.00) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* NFC Student Card Simulator */}
                    <div className="bg-slate-950 p-4.5 rounded-xl border border-teal-500/10 text-center space-y-3 relative overflow-hidden bg-[radial-gradient(circle_at_bottom_center,rgba(20,184,166,0.04),transparent)]">
                      <span className="text-[8px] text-teal-400 font-bold uppercase tracking-wider block">
                        NFC CONTACTLESS ID CARD
                      </span>

                      <div className="w-24 h-12 bg-slate-900 border border-slate-800 rounded-lg mx-auto flex items-center justify-center font-mono text-[9px] text-slate-400">
                        Barcode: SGU-10045
                      </div>

                      <button
                        onClick={startNfcTransmission}
                        disabled={nfcTransmitting}
                        className={`w-full py-1.5 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          nfcTransmitting 
                            ? "bg-slate-800 text-teal-400" 
                            : "bg-teal-600 hover:bg-teal-500 text-slate-950"
                        }`}
                      >
                        <Radio className={`w-3.5 h-3.5 ${nfcTransmitting ? "animate-ping" : ""}`} />
                        <span>
                          {nfcTransmitting 
                            ? (lang === "ar" ? "جاري بث الرمز..." : "Transmitting RFID...") 
                            : (lang === "ar" ? "بث رمز الحضور (NFC Tag)" : "Simulate NFC Tap")}
                        </span>
                      </button>

                      {nfcSuccess && (
                        <p className="text-[9px] text-emerald-400 text-center animate-bounce">
                          ✓ Verified at ibn-Sina Lecture gate!
                        </p>
                      )}
                    </div>

                    {/* Upcoming Exams quick row */}
                    <div className="space-y-1.5 text-right">
                      <span className="text-[9px] text-slate-500 font-bold block">{lang === "ar" ? "امتحان الميدترم القادم:" : "Upcoming Midterm:"}</span>
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center">
                        <span className="text-[8px] bg-indigo-950 text-indigo-400 px-1 py-0.5 rounded">25 June</span>
                        <div className="text-right">
                          <p className="text-[9.5px] font-bold text-slate-350">مبادئ الذكاء الاصطناعي</p>
                          <p className="text-[8.5px] text-slate-500">SGU-AI302 • 09:00 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. AI CHAT TAB SCREEN */}
                {mobileTab === "ai_chat" && (
                  <div className="flex flex-col h-[380px] text-right space-y-2">
                    <div className="flex-1 overflow-y-auto bg-slate-950/80 p-2.5 rounded-xl border border-slate-850 space-y-2 text-[10px]">
                      {phoneMessages.map((m, idx) => (
                        <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-start text-left" : "items-end text-right"}`}>
                          <span className="text-[7px] text-slate-500 uppercase font-mono block mb-0.5">
                            {m.role === "user" ? "Student" : "SGU AI"}
                          </span>
                          <div className={`p-2 rounded-lg leading-normal whitespace-pre-wrap max-w-[90%] ${
                            m.role === "user" 
                              ? "bg-teal-950 text-teal-300 rounded-tl-none border border-teal-900/40" 
                              : "bg-slate-900 text-slate-200 rounded-tr-none border border-slate-800"
                          }`}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      {phoneLoading && (
                        <span className="text-[8px] text-slate-500 animate-pulse block">AI Thinking replies...</span>
                      )}
                    </div>

                    <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-850">
                      <button 
                        onClick={handlePhoneSendChat}
                        className="bg-teal-605 bg-teal-600 rounded text-slate-950 p-1.5 cursor-pointer shrink-0"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={e => setPhoneInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handlePhoneSendChat()}
                        placeholder="Type messages..."
                        className="w-full bg-transparent text-right text-[10px] text-slate-200 outline-none px-1"
                      />
                    </div>
                  </div>
                )}

                {/* 3. SIMULATED SLIDER ANALYTICS */}
                {mobileTab === "analytics" && (
                  <div className="space-y-4 text-right">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                      <h6 className="text-[11px] font-bold text-teal-400">GPA Predictor Engine</h6>
                      <p className="text-[9px] text-slate-500 leading-normal">
                        Simulate final grades across your active course load and estimate outcomes instantly from the phone terminal.
                      </p>
                    </div>

                    <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 space-y-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono text-emerald-400 font-serif">4.00 (A+)</span>
                        <span className="text-slate-400">SGU-AI302 Target:</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono text-emerald-400 font-serif">3.00 (B)</span>
                        <span className="text-slate-400">SGU-DB301 Target:</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono text-emerald-400 font-serif">4.00 (A+)</span>
                        <span className="text-slate-400">SGU-SWE311 Target:</span>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10.5px]">
                        <span className="font-bold text-teal-400">GPA: 3.82</span>
                        <span className="text-slate-350">Final projection:</span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30 text-[9.5px] text-emerald-400 leading-snug">
                      🔮 SGU Trend Analytics forecasts you will grad in top tier list with magna honor.
                    </div>
                  </div>
                )}

                {/* 4. SYNC HUB - Meta WhatsApp and FCM */}
                {mobileTab === "sync_hub" && (
                  <div className="space-y-4 text-right">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1.5">
                      <h6 className="text-[10px] font-bold text-slate-200">Omni-Channel Sync Center</h6>
                      <p className="text-[8.5px] text-slate-500 leading-normal">
                        Verify device notifications registry token and simulate instant triggers.
                      </p>
                    </div>

                    {/* FCM Token Registration Toggle */}
                    <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 space-y-2">
                      <span className="text-[8.5px] text-slate-500 font-bold block">FCM GOOGLE SUITE DEVICETOKEN:</span>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] py-0.5 px-1 bg-slate-900 text-teal-400 rounded font-mono truncate max-w-[120px]">
                          {fcmRegistered ? "fcm_token_and_8471..." : "Unregistered"}
                        </span>
                        
                        <button
                          onClick={registerFcmDeviceToken}
                          className="bg-teal-650 bg-teal-600 text-slate-950 text-[8px] font-bold px-2.5 py-1 rounded"
                        >
                          {fcmRegistered ? "Registered" : "Register"}
                        </button>
                      </div>

                      {fcmRegistered && (
                        <button
                          onClick={triggerFcmAlert}
                          className="w-full bg-slate-900 hover:bg-slate-850 text-[9px] text-slate-300 py-1 rounded flex items-center justify-center gap-1 cursor-pointer border border-slate-800"
                        >
                          <Bell className="w-3 h-3 text-emerald-400" />
                          <span>Dispatch high-priority FCM Push Notification</span>
                        </button>
                      )}
                    </div>

                    {/* WhatsApp mock parameters */}
                    <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 space-y-2">
                      <span className="text-[8.5px] text-slate-500 font-bold block">META WHATSAPP ALERT DIALER:</span>
                      
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 font-mono text-center text-[10px] text-slate-250 py-1 rounded"
                        placeholder="Phone No, E.g: 010264..."
                      />

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => triggerWhatsAppAlert("dues")}
                          disabled={waLoading}
                          className="bg-indigo-600 text-white rounded text-[8px] font-bold py-1 px-1 shrink-0"
                        >
                          Send Tuition Dues
                        </button>
                        <button
                          onClick={() => triggerWhatsAppAlert("admission")}
                          disabled={waLoading}
                          className="bg-indigo-600 text-white rounded text-[8px] font-bold py-1 px-1 shrink-0"
                        >
                          Send Admissions
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* MOCK OS HOME SYSTEM NAVIGATION BAR CHIPS */}
              <div className="bg-slate-950 border-t border-slate-850/60 p-1 flex justify-around items-center text-slate-400">
                <button
                  onClick={() => setMobileTab("home")}
                  className={`flex flex-col items-center gap-0.5 py-1 cursor-pointer transition w-1/4 ${mobileTab === "home" ? "text-teal-400" : "hover:text-white"}`}
                >
                  <Compass className="w-4 h-4" />
                  <span className="text-[7.5px]">{lang === "ar" ? "الرئيسية" : "Home"}</span>
                </button>
                <button
                  onClick={() => setMobileTab("ai_chat")}
                  className={`flex flex-col items-center gap-0.5 py-1 cursor-pointer transition w-1/4 ${mobileTab === "ai_chat" ? "text-teal-400" : "hover:text-white"}`}
                >
                  <Bot className="w-4 h-4" />
                  <span className="text-[7.5px]">{lang === "ar" ? "المرشد" : "AI"}</span>
                </button>
                <button
                  onClick={() => setMobileTab("analytics")}
                  className={`flex flex-col items-center gap-0.5 py-1 cursor-pointer transition w-1/4 ${mobileTab === "analytics" ? "text-teal-400" : "hover:text-white"}`}
                >
                  <Award className="w-4 h-4" />
                  <span className="text-[7.5px]">{lang === "ar" ? "التوقعات" : "Metrics"}</span>
                </button>
                <button
                  onClick={() => setMobileTab("sync_hub")}
                  className={`flex flex-col items-center gap-0.5 py-1 cursor-pointer transition w-1/4 ${mobileTab === "sync_hub" ? "text-teal-400" : "hover:text-white"}`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[7.5px]">{lang === "ar" ? "التراسل" : "Channels"}</span>
                </button>
              </div>

              {/* Physical Home Indicator Line */}
              <div className="bg-slate-950 pb-1.5 flex justify-center">
                <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
              </div>

            </div>
          </div>
        </div>

        {/* Omnichannel Meta Cloud API Integration Diagnostic Console logs (Slices 7 Columns of Grid) */}
        <div className="lg:col-span-7 text-right space-y-6">
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-850 space-y-4">
            <h5 className="text-xs font-black text-slate-200 border-b border-slate-900 pb-2.5 flex items-center justify-end gap-1.5">
              <span>{lang === "ar" ? "سجل تتبع ومراقبة قنوات التحول الرقمي (Omni Diagnostic)" : "Omnichannel Payload Diagnostic & Trace Logs"}</span>
              <Radio className="w-4 h-4 text-teal-400" />
            </h5>

            <p className="text-[10.5px] text-slate-500 leading-normal">
              {lang === "ar" 
                ? "تتكامل منصات SGU المحمولة مع خوادم Meta ومصادقات Google FCM لإرسال تنبيهات موثقة ومطابقة للـ RFC. استعرض بنية الحزم الصادرة والواردة حياً."
                : "Diagnostics showing the precise format of packages dispatched server-side to OAuth endpoints like Meta Cloud API or Firebase Cloud Messaging (FCM)."}
            </p>

            {/* Diagnostic blocks */}
            <div className="space-y-4 font-mono text-[10px]">
              
              {/* WhatsApp meta Cloud API schema logs */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[9px] text-slate-500">
                  <span className="bg-indigo-950 text-indigo-400 px-1.5 py-0.2 rounded font-sans uppercase font-bold">Meta Cloud API v19.0 compliant</span>
                  <span>Payload: whatsapp_outbox_stream</span>
                </div>
                
                {waLogs ? (
                  <pre className="text-[9.5px] text-slate-300 overflow-x-auto whitespace-pre p-2 bg-slate-950/70 rounded border border-slate-900">
                    {JSON.stringify(waLogs, null, 2)}
                  </pre>
                ) : (
                  <p className="text-slate-500 italic text-[9.5px]">
                    {lang === "ar" 
                      ? "بانتظار إرسال تنبيه WhatsApp لتسجيل حمولة Meta..." 
                      : "Awaiting WhatsApp Dispatch from phone to debug Meta structures."}
                  </p>
                )}
              </div>

              {/* FCM standard structures logs */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[9px] text-slate-500">
                  <span className="bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded font-sans uppercase font-bold">FCM HTTP v1 payload</span>
                  <span>Payload: fcm_outbox_stream</span>
                </div>

                {fcmResponse ? (
                  <pre className="text-[9.5px] text-slate-300 overflow-x-auto whitespace-pre p-2 bg-slate-950/70 rounded border border-slate-900">
                    {JSON.stringify(fcmResponse, null, 2)}
                  </pre>
                ) : (
                  <p className="text-slate-500 italic text-[9.5px]">
                    {lang === "ar"
                      ? "سيرد هنا كود الاستجابة الخاص بـ Google FCM حال التفعيل والتسجيل."
                      : "Register token within SGU Go phone screen to review Google FCM response payload schemas."}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
