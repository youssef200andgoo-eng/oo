import React, { useState, useMemo } from "react";
import {
  Bell,
  Send,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  Calendar,
  AlertCircle,
  AlertTriangle,
  User,
  RotateCcw,
  Volume2
} from "lucide-react";

interface SguCommunicationSystemProps {
  student: any;
  lang: "ar" | "en";
  triggerSystemPush: (title: string, message: string) => void;
  addLog?: (msg: string) => void;
}

interface Message {
  id: string;
  sender: "student" | "partner";
  text: string;
  timestamp: string;
}

interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  avatar: string;
  replies: { triggers: string[]; responseAr: string; responseEn: string }[];
}

export default function SguCommunicationSystem({
  student,
  lang,
  triggerSystemPush,
  addLog
}: SguCommunicationSystemProps) {
  const [activeTab, setActiveTab] = useState<"broadcast" | "inbox" | "messenger">("messenger");

  // Broadcast center form states
  const [broadcastTarget, setBroadcastTarget] = useState<"all" | "students" | "faculty" | "admins">("all");
  const [broadcastChannel, setBroadcastChannel] = useState<"in_app" | "push" | "email" | "sms">("in_app");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastLogs, setBroadcastLogs] = useState<string[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);

  // Incoming personal alerts inbox
  const [alerts, setAlerts] = useState<any[]>([
    {
      id: "1",
      titleAr: "📢 انطلاق امتحانات الميدترم للفصل الثاني",
      titleEn: "📢 Start of S2 Midterm Exams",
      descAr: "تنبيه هام: تنطلق امتحانات منتصف الفصل لجميع الكليات يوم الأحد المقبل. يرجى سحب رقم الجلوس.",
      descEn: "Midterm exams commence next Sunday. Please download your seat seating map.",
      time: "10:30 AM",
      category: "academic",
      channel: "in_app",
      isRead: false
    },
    {
      id: "2",
      titleAr: "💳 تسوية الرسوم الدراسية المتبقية",
      titleEn: "💳 Balance Settlement & Installments",
      descAr: "تذكير الحسابات: يرجى تسديد القسط الأكاديمي الثاني لتفادي تعليق تسجيل المقررات.",
      descEn: "Please settle your 2nd tuition installment to avoid Add/Drop restrictions.",
      time: "Yesterday",
      category: "finance",
      channel: "email",
      isRead: false
    },
    {
      id: "3",
      titleAr: "🩺 الكشف الطبي السنوي",
      titleEn: "🩺 Annual Medical Check-up",
      descAr: "أعلنت العيادة المركزية عن تمديد فترات الفحص لمستجدّي كليات الصالحية.",
      descEn: "Central medical clinic extended check-up schedule for SGU freshmen.",
      time: "2 days ago",
      category: "general",
      channel: "sms",
      isRead: true
    }
  ]);

  // Chat/Messenger States
  const chatPartners: Partner[] = [
    {
      id: "advisor",
      nameAr: "د. محمد أحمد عيسى",
      nameEn: "Dr. Mohamed Eissa",
      roleAr: "المرشد الأكاديمي",
      roleEn: "Academic Advisor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      replies: [
        {
          triggers: ["gpa", "معدل", "تقدير"],
          responseAr: `أهلاً بك يوسف. معدلك التراكمي الحالي هو ${student.gpa || "3.48"}. ينصح بتركيز الجهود على مقررات المستوى الثالث لرفع تقدير ABET التراكمي.`,
          responseEn: `Hello Youssef. Your current CGPA is ${student.gpa || "3.48"}. We recommend focusing on your S2 courses to secure ABET core marks.`
        },
        {
          triggers: ["exam", "امتحان", "جدول"],
          responseAr: "مرحباً! تم إقرار جدول الامتحانات الموحد رسمياً. يمكنك مراجعته بصفحة 'المنظومة الأكاديمية والامتحانات' فوراً.",
          responseEn: "Hello! The unified exam schedule has been officially approved. You can view it under the Exams tab."
        },
        {
          triggers: ["add", "drop", "تسجيل", "مادة"],
          responseAr: "أهلاً بك. لطلب زيادة العبء الدراسي (Overload) أو فتح شعبة مغلقة، يرجى التوجه لتقديم التماس إداري بموافقتي أولاً.",
          responseEn: "Hello. For course overload or closed division overrides, please register a formal advisor petition request first."
        }
      ]
    },
    {
      id: "registrar",
      nameAr: "أ. حسام رأفت (شؤون الطلاب)",
      nameEn: "Hossam Raafat (Registry)",
      roleAr: "مسؤول التسجيل والوثائق",
      roleEn: "Registrar Officer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      replies: [
        {
          triggers: ["بطاقة", "كارنيه", "id"],
          responseAr: "أهلاً طالب يوسف. تم ميكنة إصدار بطاقات الهوية الذكية RFID. يرجى تسليم أصل الأوراق لتسلم كارنيه البوابات الجديد.",
          responseEn: "Hello Youssef. RFID Student IDs are ready for pickup. Please bring original high school files to obtain yours."
        },
        {
          triggers: ["شهادة", "وثيقة", "تخرج"],
          responseAr: "أهلاً بك. يمكنك سحب بيان درجات باللغتين العربية والإنجليزية مصادق بالـ QR عبر بوابة خزانة الأمان.",
          responseEn: "Hello. You can request official bilingual transcripts protected by cryptographic QR seals directly from SGU vault."
        }
      ]
    },
    {
      id: "treasury",
      nameAr: "أ. نجلاء زكي (الحسابات)",
      nameEn: "Naglaa Zaki (Finance)",
      roleAr: "مدير الشؤون المالية",
      roleEn: "Finance Manager",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      replies: [
        {
          triggers: ["قسط", "مصاريف", "دفع", "فيزا"],
          responseAr: "مرحباً. بوابة الدفع الإلكتروني مفعّلة الآن بالفيزا أو فوراً. يمكنك رصد الأقساط وجدولتها عبر صفحة الطالب المالية.",
          responseEn: "Hello. Online fee payment via Fawry or cards is fully active. You can manage installment schedules from the finance tab."
        }
      ]
    }
  ];

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("advisor");
  const [chats, setChats] = useState<Record<string, Message[]>>({
    advisor: [
      { id: "1", sender: "partner", text: lang === "ar" ? "مرحباً يوسف! كيف أساعدك اليوم في مسارك الأكاديمي وإرشادك؟" : "Hello Youssef! How can I assist you with your academic roadmap today?", timestamp: "10:15 AM" }
    ],
    registrar: [
      { id: "1", sender: "partner", text: lang === "ar" ? "أهلاً بك في قسم الشؤون والقبول الموحد بـ SGU. تفضل باستفسارك." : "Welcome to SGU Registry Support. How can we help you?", timestamp: "Yesterday" }
    ],
    treasury: [
      { id: "1", sender: "partner", text: lang === "ar" ? "مرحباً طالب يوسف. هل لديك أي استفسار بخصوص الرسوم أو تقسيط المصروفات؟" : "Hello Youssef. Do you have any questions regarding fees or installments?", timestamp: "Yesterday" }
    ]
  });

  const [messageInput, setMessageInput] = useState("");
  const [partnerTyping, setPartnerTyping] = useState(false);

  const activePartner = useMemo(() => {
    return chatPartners.find(p => p.id === selectedPartnerId) || chatPartners[0];
  }, [selectedPartnerId]);

  // Handle send message in internal messaging chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const text = messageInput.trim();
    const timestamp = new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" });

    // 1. Add user message
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text,
      timestamp
    };

    setChats(prev => ({
      ...prev,
      [selectedPartnerId]: [...(prev[selectedPartnerId] || []), newMsg]
    }));
    setMessageInput("");
    setPartnerTyping(true);

    // 2. Mock replying logic
    setTimeout(() => {
      let replyText = lang === "ar" 
        ? "تلقيت رسالتك يا يوسف. سأقوم بمراجعة طلبك وإفادتك فور مراجعة ملقم السجلات." 
        : "Message received, Youssef. I will inspect your records and update you as soon as possible.";

      // Search matching triggers
      const match = activePartner.replies.find(r => 
        r.triggers.some(trig => text.toLowerCase().includes(trig))
      );

      if (match) {
        replyText = lang === "ar" ? match.responseAr : match.responseEn;
      }

      const partnerMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "partner",
        text: replyText,
        timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
      };

      setChats(prev => ({
        ...prev,
        [selectedPartnerId]: [...(prev[selectedPartnerId] || []), partnerMsg]
      }));
      setPartnerTyping(false);

      // Trigger standard notification chime
      triggerSystemPush(
        lang === "ar" ? `💬 رسالة جديدة من ${activePartner.nameAr}` : `💬 New chat from ${activePartner.nameEn}`,
        replyText
      );
    }, 1800);
  };

  // Dispatch broad global alerts
  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) {
      return;
    }

    setIsDispatching(true);
    setTimeout(() => {
      const now = new Date();
      const logTime = now.toLocaleTimeString();
      const newLog = `[${logTime}] Broadcast via ${broadcastChannel.toUpperCase()} to ${broadcastTarget.toUpperCase()} -> "${broadcastTitle}"`;

      setBroadcastLogs(prev => [newLog, ...prev]);
      setIsDispatching(false);

      // Trigger dynamic dashboard toast and alerts
      triggerSystemPush(
        `📢 ${broadcastTitle}`,
        broadcastMsg
      );

      // Add to personal alert inbox if target matches students
      if (broadcastTarget === "all" || broadcastTarget === "students") {
        const newAlert = {
          id: `alert-${Date.now()}`,
          titleAr: `📢 ${broadcastTitle}`,
          titleEn: `📢 ${broadcastTitle}`,
          descAr: broadcastMsg,
          descEn: broadcastMsg,
          time: "Just now",
          category: "general",
          channel: broadcastChannel,
          isRead: false
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

      if (addLog) addLog(`✓ [لوحة البث] بث رسالة جماعية موحدة عبر قنوات [${broadcastChannel}] للمجموع المستهدف: ${broadcastTarget}`);

      // Reset
      setBroadcastTitle("");
      setBroadcastMsg("");
    }, 1200);
  };

  // Mark personal notification alerts as read
  const handleMarkAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, isRead: true } : a)));
  };

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/75 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-right">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Bell className="w-6 h-6 animate-swing" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <span>{lang === "ar" ? "نظام التواصل والإشعارات الموحد" : "Central SGU Communication & Notification Hub"}</span>
              <span className="text-[9px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">Phase 11</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "ar" ? "صندوق البريد، البث متعدد القنوات (In-App, SMS, Email, Push)، وبوابة الدردشة الفورية مع الأكاديميين والحسابات." : "Personal inboxes, multi-channel dispatch systems, and instant university help chats (Student-Staff)."}
            </p>
          </div>
        </div>

        {/* Local Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
          {[
            { id: "messenger", label: lang === "ar" ? "بوابة الدردشة" : "Messenger Chat" },
            { id: "inbox", label: lang === "ar" ? "إشعاراتي المستلمة" : "My Alerts" },
            { id: "broadcast", label: lang === "ar" ? "لوحة الإرسال الإدارية" : "Admin Dispatcher" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-slate-100 shadow-md"
                  : "text-slate-450 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. BROADCAST DISPATCHER PANEL */}
      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Dispatch Center Form */}
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
            <h4 className="text-xs font-black text-slate-100 flex items-center gap-2 flex-row-reverse border-b border-slate-900 pb-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{lang === "ar" ? "إرسال وتعميم إشعار جديد" : "Compose Multi-Channel Broadcast Alert"}</span>
            </h4>

            <form onSubmit={handleDispatchBroadcast} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "الفئة المستهدفة بالبث:" : "Target Audience:"}</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-250 cursor-pointer focus:border-indigo-500"
                  >
                    <option value="all">{lang === "ar" ? "الجميع (طلاب وهيئة تدريس وموظفين)" : "All SGU Members"}</option>
                    <option value="students">{lang === "ar" ? "الطلاب فقط" : "Students Only"}</option>
                    <option value="faculty">{lang === "ar" ? "أعضاء هيئة التدريس" : "Faculty Staff Only"}</option>
                    <option value="admins">{lang === "ar" ? "الإداريين وشؤون الموظفين" : "Administrators Only"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "قناة الاتصال الأساسية:" : "Notification Delivery Channel:"}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "in_app", label: lang === "ar" ? "داخلي" : "In-App", icon: Bell },
                      { id: "push", label: lang === "ar" ? "دفع" : "Push", icon: Smartphone },
                      { id: "email", label: lang === "ar" ? "إيميل" : "Email", icon: Mail },
                      { id: "sms", label: lang === "ar" ? "رسالة" : "SMS", icon: MessageSquare }
                    ].map(chan => {
                      const isSel = broadcastChannel === chan.id;
                      return (
                        <button
                          key={chan.id}
                          type="button"
                          onClick={() => setBroadcastChannel(chan.id as any)}
                          className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                            isSel
                              ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                              : "bg-slate-900 border-slate-800 text-slate-450 hover:text-slate-300"
                          }`}
                        >
                          <chan.icon className="w-4 h-4" />
                          <span className="text-[9px] font-bold">{chan.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-450 block">{lang === "ar" ? "عنوان التنبيه الرئيسي:" : "Broadcast Title Headline:"}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === "ar" ? "مثال: تحديث جدول السكن، تأخير باص بلبيس..." : "e.g. SGU Housing updates, transport schedule delay..."}
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-450 block">{lang === "ar" ? "مضمون الإشعار الموجه:" : "Notification Alert Message Body:"}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={lang === "ar" ? "اكتب تفاصيل التنبيه الأكاديمي أو الخدمي الموجه للمستفيدين هنا..." : "Type the detailed notification parameters here..."}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isDispatching}
                className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-slate-100 font-black py-2.5 rounded-lg transition text-xs flex items-center justify-center gap-2"
              >
                {isDispatching ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>{lang === "ar" ? "جاري البث والتحليق بالشبكات الموحدة..." : "Broadcasting via Vodafone & AWS SES portals..."}</span>
                  </>
                ) : (
                  <span>{lang === "ar" ? "تعميم ونشر التنبيه الفوري للمستفيدين 🚀" : "Dispatch Global Broadcast Alert Now 🚀"}</span>
                )}
              </button>
            </form>
          </div>

          {/* Broadcast Logs & History */}
          <div className="lg:col-span-4 bg-slate-950 p-4 border border-slate-850 rounded-2xl text-right space-y-3">
            <span className="text-[10px] text-slate-500 font-bold block">DISPATCH LOGS</span>
            <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "📜 سجل عمليات البث الأخيرة" : "📜 Live Broadcast Feed"}</h4>
            
            <div className="bg-slate-900 rounded-xl p-3 max-h-[350px] overflow-y-auto space-y-2 border border-slate-850">
              {broadcastLogs.length === 0 ? (
                <div className="text-center py-16 text-slate-650 text-[10px]">
                  {lang === "ar" ? "لم يتم بث رسائل جديدة اليوم" : "No outgoing history available."}
                </div>
              ) : (
                broadcastLogs.map((log, idx) => (
                  <div key={idx} className="p-2 border-b border-slate-850 pb-1.5 mb-1 font-mono text-[9px] text-indigo-400 text-left">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSONAL NOTIFICATION ALERTS INBOX */}
      {activeTab === "inbox" && (
        <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h4 className="text-xs font-black text-slate-100 flex items-center gap-2 flex-row-reverse">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span>{lang === "ar" ? "صندوق الإشعارات الشخصية المستلمة" : "My Personal Notifications Inbox"}</span>
            </h4>
            <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-500 font-mono font-bold px-2 py-0.5 rounded">
              {alerts.filter(a => !a.isRead).length} {lang === "ar" ? "جديد" : "unread"}
            </span>
          </div>

          <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="p-16 text-center text-slate-600 text-xs font-semibold">
                {lang === "ar" ? "صندوق الوارد فارغ" : "Your alerts inbox is completely clean."}
              </div>
            ) : (
              alerts.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition text-right relative flex flex-col md:flex-row justify-between gap-4 items-start md:items-center ${
                    item.isRead ? "bg-slate-950/40 border-slate-900" : "bg-slate-900/60 border-indigo-500/30 shadow-indigo-500/5 shadow-md"
                  }`}
                >
                  <div className="space-y-1 flex-1 leading-relaxed">
                    <div className="flex items-center gap-2 flex-row-reverse mb-1">
                      <strong className="text-xs text-slate-200">
                        {lang === "ar" ? item.titleAr : item.titleEn}
                      </strong>
                      <span className="text-[9.5px] text-slate-500 font-mono font-bold">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {lang === "ar" ? item.descAr : item.descEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-row">
                    <span className="text-[9px] uppercase font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {item.channel}
                    </span>

                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="cursor-pointer text-[10px] bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-black px-3 py-1 rounded transition"
                      >
                        {lang === "ar" ? "مقروء" : "Read"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. INTERNAL MESSENGER CHAT PORTAL */}
      {activeTab === "messenger" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60 border border-slate-850 rounded-2xl overflow-hidden min-h-[500px]">
          {/* Partners Selector Sidebar */}
          <div className="lg:col-span-4 bg-slate-950 border-r border-slate-900/80 p-4 space-y-4">
            <div className="border-b border-slate-900 pb-2 text-right">
              <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">Contacts</span>
              <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "💬 غرف الحوار المتاحة" : "💬 Active Channels"}</h4>
            </div>

            <div className="space-y-2.5">
              {chatPartners.map(p => {
                const isSelected = p.id === selectedPartnerId;
                const lastMsg = chats[p.id]?.[chats[p.id].length - 1];
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPartnerId(p.id)}
                    className={`p-3 rounded-xl transition flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected ? "bg-slate-900 border border-slate-800" : "hover:bg-slate-900/40"
                    }`}
                  >
                    <span className="text-[9px] text-slate-500 font-mono font-semibold">{lastMsg?.timestamp || "Yesterday"}</span>
                    
                    <div className="flex items-center gap-2.5 text-right flex-row-reverse">
                      <img src={p.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-slate-800 shrink-0" />
                      <div>
                        <strong className="text-xs text-slate-200 block">{lang === "ar" ? p.nameAr : p.nameEn}</strong>
                        <span className="text-[9.5px] text-indigo-400 block font-bold">{lang === "ar" ? p.roleAr : p.roleEn}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Chat Thread */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900/20 text-right h-[480px]">
            {/* Header */}
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-900 flex justify-between items-center flex-row-reverse">
              <div className="flex items-center gap-2.5 flex-row-reverse">
                <img src={activePartner.avatar} alt="partner" className="w-9 h-9 rounded-full object-cover border border-slate-800" />
                <div>
                  <strong className="text-xs text-slate-100 block">{lang === "ar" ? activePartner.nameAr : activePartner.nameEn}</strong>
                  <span className="text-[9.5px] text-slate-450 font-bold block">{lang === "ar" ? activePartner.roleAr : activePartner.roleEn}</span>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-850 px-2 py-0.5 rounded text-[10px] text-indigo-400 font-bold font-mono">
                <span>VERIFIED</span>
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 scrollbar-thin">
              {chats[selectedPartnerId]?.map(m => {
                const isStudent = m.sender === "student";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isStudent ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-sm relative ${
                      isStudent
                        ? "bg-indigo-600 text-slate-100 rounded-tl-none text-right font-medium"
                        : "bg-slate-950 text-slate-250 rounded-tr-none text-right border border-slate-850 font-semibold"
                    }`}>
                      <p className="text-xs leading-relaxed">{m.text}</p>
                      <span className={`text-[8.5px] block mt-1 text-left ${isStudent ? "text-slate-300" : "text-slate-500"}`}>{m.timestamp}</span>
                    </div>
                  </div>
                );
              })}

              {partnerTyping && (
                <div className="flex justify-end animate-pulse">
                  <div className="p-3 bg-slate-950 rounded-2xl rounded-tr-none border border-slate-850 text-slate-550 text-[10px] font-bold font-mono">
                    {lang === "ar" ? `جاري كتابة رد من قِبل الأستاذ...` : `Advisor is typing...`}
                  </div>
                </div>
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="bg-slate-950 p-3 border-t border-slate-900 flex gap-2">
              <button
                type="submit"
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-505 text-slate-100 font-black px-4 py-2 rounded-xl text-xs transition shrink-0"
              >
                {lang === "ar" ? "إرسال" : "Send"}
              </button>
              <input
                type="text"
                placeholder={lang === "ar" ? "اكتب رسالتك للمستشار أو شؤون الطلاب هنا..." : "Type your instant message query..."}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-right text-slate-200 outline-none focus:border-indigo-500"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
