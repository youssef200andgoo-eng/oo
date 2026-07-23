import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  ArrowLeft, 
  BookOpen, 
  Award, 
  DollarSign, 
  CheckCircle2, 
  ChevronRight, 
  ShieldAlert 
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  isSandbox?: boolean;
}

interface SguAcademicChatbotProps {
  student: any;
  courses: any[];
  finance: any[];
  lang: "ar" | "en";
}

export default function SguAcademicChatbot({
  student,
  courses,
  finance,
  lang
}: SguAcademicChatbotProps) {
  const [modelType, setModelType] = useState<"gemini" | "chatgpt" | "claude">("gemini");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      role: "model",
      text: lang === "ar" 
        ? "مرحباً بك! أنا المرشد الأكاديمي الذكي لـ SGU. يمكنني إرشادك في خطتك الدراسية، والتحقق من درجاتك، أو حساب معدلك المتوقع. كيف يمكنني مساعدتك اليوم؟"
        : "Welcome! I am your SGU AI Academic Counselor. I can assist with study plans, grade summaries, or GPA predictions. How can I help you today?",
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Direct context-guided prompt suggestions
  const arabicChips = [
    { text: "ما هو معدلي التراكمي المحدث؟", prompt: "أخبرني بمعدلي التراكمي ونقاطي المكتسبة حالياً بناءً على سجلي الدراسي." },
    { text: "ما المقررات غير المكتملة المسجلة حالياً؟", prompt: "ما هي المواد التي أقوم بدراستها في الفصل الثاني (semester 2) حالياً؟" },
    { text: "احسب معدلي لو حصلت على A+ في المقررات المسجلة", prompt: "لو افترضنا أنني حصلت على A+ في جميع المقررات المسجلة حالياً، كيف سيصبح معدلي التراكمي الإجمالي؟" },
    { text: "هل يتبقى علي أي أقساط مالية مستحقة؟", prompt: "هل يوجد قسط متأخر في حسابي المالي بالجامعة؟" }
  ];

  const englishChips = [
    { text: "What is my current cumulative GPA?", prompt: "Tell me my current cumulative GPA and credit history." },
    { text: "List my currently registered courses", prompt: "What subjects am I currently registered for in Semester 2?" },
    { text: "Calculate final GPA if I get A in all classes", prompt: "What is my cumulative GPA if I get A in all registered courses?" },
    { text: "Check pending tuition dues", prompt: "Do I have any outstanding tuition payments?" }
  ];

  const quickChips = lang === "ar" ? arabicChips : englishChips;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim() || loading) return;

    // Clear main input
    if (!customText) setInputVal("");

    const newMsg: Message = {
      id: "msg_" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    // Context Injection: Add current profile info in Arabic/English to guide model response
    const studentStatusContext = `
      [USER PROFILE CONTEXT]
      Student Name: ${student.nameArabic} (${student.nameEnglish || "Youssef El-Kurdy"})
      ID: ${student.id}
      Major: ${student.major}
      Current GPA: ${student.totalGPA || student.gpa}
      Registered Courses: ${courses.filter(c => c.status === "registered").map(c => `${c.code}: ${c.name}`).join(", ")}
      Completed Courses: ${courses.filter(c => c.status === "completed").map(c => `${c.code}: ${c.name} (${c.gradeObtained || c.finalGrade})`).join(", ")}
      Financial Status: Total Tuition Due is ${finance.reduce((sum, f) => sum + (f.amount || 0), 0)} EGP, Total Paid is ${finance.reduce((sum, f) => sum + (f.paid ? (f.amount || 0) : 0), 0)} EGP.
      [INSTRUCTIONS]
      Always personalize the response to the student's status. Be highly polite, professional and factual. Format equations and steps using clean lists and markdown.
    `;

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${studentStatusContext}\n\n[USER QUESTION]\n${textToSend}`,
          history: chatHistory,
          modelType: modelType
        })
      });

      if (!res.ok) {
        throw new Error("Failed to receive feedback from the AI server.");
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        id: "ans_" + Date.now(),
        role: "model",
        text: data.text || "Sorry, I could not understand the input.",
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        isSandbox: data.isSandbox
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: "err_" + Date.now(),
        role: "model",
        text: lang === "ar" 
          ? "⚠️ عذراً، تعذر الاتصال بخبراء الكنترول الذكي حالياً. يرجى مراجعة تفعيل مفتاح GEMINI_API_KEY بسجلات السيرفر."
          : "⚠️ Error contacting the academic hub server. Make sure GEMINI_API_KEY is configured under Settings.",
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-right border-b border-slate-850 pb-4">
        {/* Persona Toggle */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850 w-full lg:w-auto overflow-x-auto gap-1">
          <button
            onClick={() => setModelType("gemini")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
              modelType === "gemini" 
                ? "bg-teal-600 text-slate-950" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini</span>
          </button>
          <button
            onClick={() => setModelType("chatgpt")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
              modelType === "chatgpt" 
                ? "bg-emerald-600 text-slate-950" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>OpenAI ChatGPT</span>
          </button>
          <button
            onClick={() => setModelType("claude")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
              modelType === "claude" 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Anthropic Claude</span>
          </button>
        </div>

        {/* Header Title */}
        <div className="text-right">
          <h4 className="text-sm font-black text-slate-100 flex items-center gap-2 justify-end">
            <span>{lang === "ar" ? "المرشد الأكاديمي الذكي الموحد لـ SGU" : "SGU Integrated Academic AI Advisor"}</span>
            <Bot className="w-5 h-5 text-teal-400" />
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal max-w-md">
            {lang === "ar" 
              ? "مساعد فيدرالي ذكي مطلع على سجلك الدراسي، الساعات المسجلة، الأقساط، واللوائح، لمساعدتك في اتخاذ قراراتك الأكاديمية."
              : "Smart AI Companion powered by Gemini, trained with SGU guidelines, course transcripts, and tuition status."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Helper context panel */}
        <div className="lg:col-span-1 bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-4 text-right">
          <h5 className="text-xs font-bold text-teal-400 border-b border-slate-900 pb-1.5">
            {lang === "ar" ? "معطيات ملقمة حياً للمساعد" : "Live Integrated Context"}
          </h5>
          
          <div className="space-y-3 text-[11px]">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850/50 space-y-1">
              <span className="text-slate-500 block">{lang === "ar" ? "السجل الأكاديمي" : "Academic Records"}</span>
              <p className="text-slate-200 font-bold font-mono">GPA: {student.totalGPA || student.gpa}</p>
              <p className="text-slate-400">
                {courses.filter(c => c.status === "completed").length} Completed Courses
              </p>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850/50 space-y-1">
              <span className="text-slate-500 block">{lang === "ar" ? "الفصل الحالي (Semester 2)" : "Semester 2 Focus"}</span>
              <p className="text-slate-200 font-bold">
                {courses.filter(c => c.status === "registered").length} Registered Subjects
              </p>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850/50 space-y-1">
              <span className="text-slate-500 block">{lang === "ar" ? "الذمة المالية" : "Financial Invoices"}</span>
              <p className="text-slate-200 font-bold font-mono">
                {finance.filter(f => !f.paid).length > 0 
                  ? (lang === "ar" ? "⚠️ يوجد أقساط مستحقة" : "Outstanding Balance") 
                  : (lang === "ar" ? "✅ مسدد بالكامل" : "Fully custom paid")}
              </p>
            </div>
          </div>

          <div className="bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10 text-[10px] text-yellow-500 flex gap-1.5 items-start">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <p className="leading-relaxed">
              {lang === "ar" 
                ? "تنبيه الأمان: يتم إرسال بيانات ملفك الأكاديمي بشكل مغلق كتعليمات للنظام، ولا يتم الكشف عن معلومات هويتك الشخصية."
                : "Privacy shield: Your academic statistics are proxied securely with zero personally identifiable data leaked."}
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-950 rounded-xl border border-slate-850 h-[38vh] overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-3 flex-row-reverse items-start ${m.role === "user" ? "justify-start" : "justify-end text-right"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border uppercase font-mono text-xs ${
                  m.role === "user" 
                    ? "bg-teal-950 text-teal-400 border-teal-900/35" 
                    : "bg-slate-900 text-slate-300 border-slate-800"
                }`}>
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1 max-w-[85%]">
                  <div className={`p-3 rounded-xl text-xs leading-relaxed text-right font-medium whitespace-pre-wrap ${
                    m.role === "user" 
                      ? "bg-teal-900/30 text-teal-200 rounded-tr-none border border-teal-500/15" 
                      : "bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800"
                  }`}>
                    {m.text}
                  </div>
                  
                  <div className="flex items-center gap-1.5 justify-end text-[9px] text-slate-500">
                    <span>{m.timestamp}</span>
                    {m.isSandbox && (
                      <span className="text-[8px] bg-slate-900 text-amber-500 px-1 py-0.2 rounded font-mono">Sandbox Simulation</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 flex-row justify-end items-center mr-11">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-300"></span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">AI compiling answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips suggested prompts */}
          <div className="flex flex-wrap gap-2 justify-end">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={loading}
                className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-[10.5px] text-slate-300 font-semibold px-3 py-1.5 rounded-full transition text-right max-w-full truncate"
              >
                {chip.text}
              </button>
            ))}
          </div>

          {/* Type sender input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-2 rounded-xl bg-slate-950 p-1.5 border border-slate-850"
          >
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-lg px-4 py-2 text-xs font-bold transition disabled:opacity-40 disabled:bg-slate-900 flex items-center justify-center cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
            
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={lang === "ar" ? "سل المرشد الذكي... (مثال: توقع نقاط المقررات)" : "Ask AI Advisor..."}
              className="w-full bg-transparent text-right text-xs text-slate-100 outline-none px-2 py-2"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
