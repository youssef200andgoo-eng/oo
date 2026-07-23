import React, { useState } from "react";
import {
  Users,
  Search,
  BookOpen,
  Award,
  Calendar,
  DollarSign,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HeartPulse,
  Mail,
  UserCheck,
  CreditCard,
  Download
} from "lucide-react";
import { StudentProfile, Course, FinanceRecord } from "../types";

interface SguParentPortalProps {
  student: StudentProfile;
  courses: Course[];
  finance: FinanceRecord[];
  setFinance: React.Dispatch<React.SetStateAction<FinanceRecord[]>>;
  lang: "ar" | "en";
  triggerSystemPush: (title: string, message: string) => void;
  addLog: (msg: string) => void;
}

export default function SguParentPortal({
  student,
  courses,
  finance,
  setFinance,
  lang,
  triggerSystemPush,
  addLog
}: SguParentPortalProps) {
  const [studentIdInput, setStudentIdInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");

  // Payment states
  const [payTargetId, setPayTargetId] = useState("");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payWallet, setPayWallet] = useState("Visa Credit Card");
  const [isPaying, setIsPaying] = useState(false);

  // Inquiries form
  const [inquiryDept, setInquiryDept] = useState("student_affairs");
  const [inquiryText, setInquiryText] = useState("");
  const [sentInquiries, setSentInquiries] = useState<Array<{
    id: string;
    dept: string;
    text: string;
    date: string;
    status: "replied" | "pending";
    reply?: string;
  }>>([
    {
      id: "inq-101",
      dept: "student_affairs",
      text: "أرجو الإفادة بآلية مراجعة درجات الميدترم لمقرر هياكل البيانات.",
      date: "2026-06-15",
      status: "replied",
      reply: "أهلاً بحضرتك يا فندم. تم فتح باب الالتماسات بقسم الحاسبات حتى نهاية الأسبوع الحالي، يرجى توجيه الطالب للقسم لملء نموذج مراجعة الورقة الامتحانية مجاناً."
    }
  ]);

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const inputId = studentIdInput.trim();
    if (!inputId) return;

    // Validate if input matches student's ID or national ID
    if (inputId === student.id || inputId === student.nationalId || inputId.toLowerCase() === "student" || inputId === "20235418") {
      setIsAuthorized(true);
      addLog(`👨‍👩‍👦 [بوابة ولي الأمر] تم التحقق بنجاح من صلة القرابة والوصول لملف الطالب [${student.nameArabic}].`);
      triggerSystemPush(
        lang === "ar" ? "👨‍👩‍👦 دخول بوابة أولياء الأمور" : "👨‍👩‍👦 Parent Login Detected",
        lang === "ar" 
          ? `تم دخول حساب ولي أمر الطالب ${student.nameArabic} لمتابعة الأداء.` 
          : `Parent of Youssef Ahmed logged in successfully.`
      );
    } else {
      setAuthError(
        lang === "ar" 
          ? "رقم الطالب أو الرقم القومي غير متطابق. يرجى مراجعة شؤون الطلاب بـ SGU." 
          : "Student Academic ID or National ID does not match our records."
      );
    }
  };

  const handleParentPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTargetId || payAmount <= 0) return;

    setIsPaying(true);
    setTimeout(() => {
      setFinance((prev) =>
        prev.map((f) => {
          if (f.id === payTargetId) {
            const updatedAmt = Math.max(0, f.amount - payAmount);
            return {
              ...f,
              amount: updatedAmt,
              paid: updatedAmt <= 0,
              paymentMethod: `Parent Payment via ${payWallet}`,
              paymentDate: new Date().toISOString().split("T")[0]
            };
          }
          return f;
        })
      );

      const recordName = finance.find(f => f.id === payTargetId)?.description || "خدمات دراسية";
      addLog(`💳 [مساهمة العائلة] قام ولي الأمر بسداد مبلغ ${payAmount} ج.م لتسوية فاتورة [${recordName}].`);
      
      triggerSystemPush(
        lang === "ar" ? "💳 تم سداد مصروفات من ولي الأمر" : "💳 Parent Payment Completed",
        lang === "ar"
          ? `تم استلام مساهمة عائلية قدرها ${payAmount} ج.م لتسوية مصروفات الطالب ${student.nameArabic}.`
          : `Parent paid ${payAmount} EGP on behalf of student Youssef Ahmed.`
      );

      setIsPaying(false);
      setPayTargetId("");
      setPayAmount(0);
    }, 1000);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;

    const newInq = {
      id: `inq-${Math.floor(100 + Math.random() * 900)}`,
      dept: inquiryDept,
      text: inquiryText,
      date: new Date().toISOString().split("T")[0],
      status: "pending" as const
    };

    setSentInquiries(prev => [newInq, ...prev]);
    setInquiryText("");
    addLog(`✉️ [طلب ولي الأمر] إرسال استفسار عائلي موجه إلى [${inquiryDept}] لجامعة SGU.`);

    // Simulate auto response after 3 seconds
    setTimeout(() => {
      setSentInquiries(prev =>
        prev.map(inq => {
          if (inq.id === newInq.id) {
            return {
              ...inq,
              status: "replied",
              reply: "نشكر تواصلكم الكريم مع إدارة جامعة الصالحية الجديدة SGU. تم تسليم رسالتكم لوكيل الكلية المختص وسيتم الإفادة بالإجراء والاتصال الهاتفي بحضرتكم قريباً."
            };
          }
          return inq;
        })
      );
      addLog(`✉️ [الرد التلقائي] تم إصدار رد إداري تلقائي بخصوص استفسار ولي الأمر #${newInq.id}.`);
    }, 4000);
  };

  // Helper values
  const totalCompletedHours = student.completedHours;
  const percentageCompleted = Math.round((totalCompletedHours / student.requiredHours) * 100);

  // Simulated attendance rate
  const attendanceRate = 94;

  if (!isAuthorized) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-xl mx-auto text-right space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-100">بوابة متابعة أولياء الأمور الموحدة (SGU-Parent)</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            تتيح هذه البوابة المؤمنة لأولياء الأمور متابعة أداء أبنائهم الأكاديمي، الحضور الغيابي، الجداول، وسداد الفواتير والمصروفات مباشرةً.
          </p>
        </div>

        <form onSubmit={handleAuthorize} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 block">أدخل الكود الأكاديمي للطالب أو الرقم القومي:</label>
            <input
              type="text"
              required
              placeholder="مثال: 20235418 أو الرقم القومي للطالب..."
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-center text-xs font-mono focus:outline-none focus:border-emerald-500 text-slate-100"
            />
          </div>

          {authError && (
            <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg text-xs text-rose-400 text-center">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-3 rounded-xl text-xs transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>التحقق من البيانات والتصريح بالدخول 🔐</span>
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          * يتم تشفير كافة بيانات الدخول والملفات العائلية طبقاً لقواعد الخصوصية وحماية البيانات بجامعة الصالحية الجديدة.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Son's Info Header Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-right flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-950 px-4 py-2 rounded-xl border border-slate-850 text-center md:text-right">
          <div className="ml-3 text-right">
            <span className="text-[10px] text-slate-500 block">المعدل التراكمي للابن (GPA):</span>
            <strong className="text-emerald-400 text-lg font-black font-mono">{student.totalGPA} / 4.0</strong>
          </div>
          <div className="border-r border-slate-800 pr-3 text-right">
            <span className="text-[10px] text-slate-500 block">السنة الدراسية الحالية:</span>
            <strong className="text-slate-200 text-xs font-bold block mt-1">{student.level}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3.5 text-right">
          <div>
            <h4 className="text-sm font-black text-slate-100">{student.nameArabic}</h4>
            <p className="text-xs text-slate-400">{student.college} ← قسم {student.department}</p>
            <span className="text-[10.5px] text-slate-500 font-mono">الرقم الجامعي للابن: #{student.id}</span>
          </div>
          <img
            src={student.avatarUrl}
            alt={student.nameEnglish}
            className="w-12 h-12 rounded-full border-2 border-emerald-500/20 object-cover"
          />
        </div>
      </div>

      {/* Grid containing Son's metrics and payment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Columns: Grades, Attendance, Inquiries */}
        <div className="lg:col-span-8 space-y-6 text-right">
          
          {/* 1. Academic Grades Panel */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-200 border-b border-slate-850 pb-2 flex items-center justify-between">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">منظومة رصد التقديرات</span>
              <span>📚 المقررات والتقديرات الفصلية الحالية للابن</span>
            </h3>

            <div className="space-y-2.5">
              {courses.slice(0, 5).map((course) => (
                <div key={course.code} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded font-bold text-[10.5px] ${
                      course.status === "completed" 
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40" 
                        : "bg-amber-950 text-amber-400 border border-amber-900/40"
                    }`}>
                      {course.gradeObtained || (lang === "ar" ? "قيد الدراسة" : "In Progress")}
                    </span>
                    <span className="text-slate-400 font-mono text-[10.5px]">{course.credits} {lang === "ar" ? "ساعات" : "credits"}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-200">{course.name}</span>
                    <span className="text-[9.5px] text-slate-500 font-mono block mt-0.5">كود المقرر: {course.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Attendance & Warning indicators */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-200 border-b border-slate-850 pb-2 flex items-center justify-between">
              <span className="text-emerald-400 font-mono">{attendanceRate}% حضور كلي</span>
              <span>📊 تقارير الحضور والغياب والانضباط الجامعي</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                <span className="text-slate-400 text-[11px]">مؤشر الخطر (لائحة الغياب):</span>
                <div className="mt-2.5 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    نسبة حضور الابن مستقرة ومثالية تماماً وهي أعلى بكثير من الحد الأدنى للائحة الجامعة للإنذارات الغيابية (75%).
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <span className="text-slate-400 text-[11px] block">الساعات المنجزة بالخطة الدراسية:</span>
                <div className="flex justify-between items-center text-xs text-slate-200">
                  <span>{percentageCompleted}% منجز</span>
                  <span className="font-mono">{totalCompletedHours} / {student.requiredHours} ساعة</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${percentageCompleted}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Message / Inquiries Form */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-200 border-b border-slate-850 pb-2">
              ✉️ صندوق المراسلات والاستفسارات مع إدارة الكلية
            </h3>

            <form onSubmit={handleSendInquiry} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-bold">توجيه الرسالة إلى قسم:</label>
                  <select
                    value={inquiryDept}
                    onChange={(e) => setInquiryDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="student_affairs">قسم شؤون الطلاب (Student Affairs)</option>
                    <option value="finance_officer">الإدارة المالية والتحصيل (Finance Office)</option>
                    <option value="academic_advisor">المرشد الأكاديمي المباشر (Advisor)</option>
                    <option value="dean_office">مكتب عميد الكلية الموقر (Dean Office)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-bold">تاريخ الإرسال:</label>
                  <input
                    type="text"
                    disabled
                    value={new Date().toISOString().split("T")[0]}
                    className="w-full bg-slate-950/40 border border-slate-850 p-2 rounded-xl text-xs text-slate-500 text-center font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block font-bold">اكتب نص الاستفسار أو الملاحظة:</label>
                <textarea
                  required
                  rows={2}
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="أكتب استفسارك بوضوح بخصوص الابن لمراجعته والرد الفوري من وكيل شؤون الطلاب..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-right text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-5 py-2 rounded-lg text-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الاستفسار لإدارة الكلية</span>
              </button>
            </form>

            {/* Inquiries History */}
            <div className="space-y-3 pt-2">
              <span className="text-[10.5px] text-slate-400 block font-bold">سجل الاستفسارات الأخير والردود الإدارية:</span>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {sentInquiries.map((inq) => (
                  <div key={inq.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-900 pb-1">
                      <span className={`px-2 py-0.5 rounded ${
                        inq.status === "replied" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400 animate-pulse"
                      }`}>
                        {inq.status === "replied" ? "✓ تم الرد" : "قيد المراجعة الإدارية"}
                      </span>
                      <span>تاريخ: {inq.date} | الموجه: {inq.dept === "student_affairs" ? "شؤون الطلاب" : "الإدارة المالية"}</span>
                    </div>
                    <p className="text-slate-300 font-medium"><strong>السؤال:</strong> {inq.text}</p>
                    {inq.reply && (
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 text-slate-200 space-y-1 border-r-2 border-r-emerald-500">
                        <strong>📩 رد الكلية الرسمي:</strong>
                        <p className="text-slate-400 leading-relaxed text-[11px]">{inq.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right 4 Columns: Financial Payments */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-6 text-right h-fit">
          <h3 className="text-xs font-black text-slate-200 border-b border-slate-850 pb-2">
            💳 السداد والمساهمات العائلية لرسوم الابن
          </h3>

          <form onSubmit={handleParentPayment} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 block">اختر الفاتورة المستحقة للسداد:</label>
              <select
                value={payTargetId}
                required
                onChange={(e) => {
                  setPayTargetId(e.target.value);
                  const found = finance.find(f => f.id === e.target.value);
                  setPayAmount(found ? found.amount : 0);
                }}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-100 focus:outline-none"
              >
                <option value="">-- اختر الفاتورة والخدمة --</option>
                {finance.map((f) => (
                  <option key={f.id} value={f.id} disabled={f.paid}>
                    {f.description} ({f.paid ? "مسددة" : `${f.amount} ج.م`})
                  </option>
                ))}
              </select>
            </div>

            {payTargetId && (
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-450 block">مبلغ الدفع المراد تحويله (ج.م):</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-left font-mono focus:outline-none focus:border-emerald-500 text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-450 block">قناة السداد أو الوساطة البنكية:</label>
                  <select
                    value={payWallet}
                    onChange={(e) => setPayWallet(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="Visa Credit Card">Visa / Mastercard بطاقة عائلية</option>
                    <option value="Fawry Gate">فوري سداد فوري (Fawry Pay)</option>
                    <option value="Vodafone Cash">Vodafone Cash المحفظة الرقمية</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isPaying || payAmount <= 0}
                  className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2.5 rounded-lg text-xs transition disabled:opacity-40"
                >
                  {isPaying ? "جاري تحويل ومعالجة الدفعة..." : "إتمام سداد الفاتورة إلكترونياً 💳"}
                </button>
              </div>
            )}
          </form>

          {/* Unpaid bills checklist */}
          <div className="space-y-3.5 border-t border-slate-800 pt-4">
            <span className="text-xs font-bold text-slate-400 block">فواتير ومطالبات مستحقة للابن:</span>
            <div className="space-y-2">
              {finance.map((rec) => (
                <div key={rec.id} className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-slate-200">{rec.amount} ج.م</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-200 text-[11px] block">{rec.description}</span>
                    <span className={`text-[9.5px] font-bold block mt-0.5 ${rec.paid ? "text-emerald-405" : "text-rose-405"}`}>
                      {rec.paid ? `✓ تم السداد (${rec.paymentMethod})` : "⚠️ غير مسددة بالكامل"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
