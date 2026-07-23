import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  DollarSign,
  FileText,
  Bookmark,
  TrendingUp,
  Inbox,
  UserCheck,
  UserX,
  CreditCard,
  Building,
  ArrowRight,
  ShieldAlert,
  Send,
  Printer,
  Sparkles,
  Lock,
  RefreshCw,
  Clock,
  Briefcase
} from "lucide-react";
import { AdmissionApplication, FinanceRecord, Course } from "../types";

interface SguEmployeePortalProps {
  applications: AdmissionApplication[];
  setApplications: React.Dispatch<React.SetStateAction<AdmissionApplication[]>>;
  finance: FinanceRecord[];
  setFinance: React.Dispatch<React.SetStateAction<FinanceRecord[]>>;
  student: any;
  setStudent: any;
  dbUsers: any[];
  setDbUsers: React.Dispatch<React.SetStateAction<any[]>>;
  triggerSystemPush: (title: string, message: string) => void;
  lang: "ar" | "en";
  addLog?: (log: string) => void;
  employeeRole: "registrar" | "student_affairs" | "finance_officer";
}

export default function SguEmployeePortal({
  applications,
  setApplications,
  finance,
  setFinance,
  student,
  setStudent,
  dbUsers,
  setDbUsers,
  triggerSystemPush,
  lang,
  addLog,
  employeeRole
}: SguEmployeePortalProps) {
  
  // Tab states inside each portal role
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Student affairs states
  const [servicesRequests, setServicesRequests] = useState([
    { id: "req1", studentId: "SGU-10045", studentName: "يحيى شريف الكردي", type: "إثبات قيد باللغة العربية", date: "2026-06-21", status: "pending", notes: "مطلوب موجه للتأمينات الاجتماعية" },
    { id: "req2", studentId: "SGU-20119", studentName: "مصطفى كمال الدين الشربيني", type: "بيان درجات تفتيتي كلي", date: "2026-06-20", status: "completed", notes: "الكنترول المالي اعتمد السداد" },
    { id: "req3", studentId: "SGU-30441", studentName: "أمينة يسري فريد", type: "خطاب تدريب صيفي خارجي", date: "2026-06-19", status: "pending", notes: "موجه لشركة فودافون مصر" }
  ]);

  // Handle Admission Officer Approval/Rejection
  const handleAdmissionAction = (id: string, action: "accepted" | "rejected") => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: action } : app))
    );
    
    const targetApp = applications.find(app => app.id === id);
    const applicantName = targetApp?.fullName || "متقدم جديد";
    
    const actionAr = action === "accepted" ? "قبول معتمد" : "رفض نهائي";
    const actionEn = action === "accepted" ? "Approved" : "Rejected";
    
    const logMsg = `[شؤون القبول] قام موظف القبول باتخاذ قرار (${actionAr}) لملف المتقدم [${applicantName}] كود #${id}`;
    if (addLog) addLog(logMsg);

    triggerSystemPush(
      lang === "ar" ? "💼 تحديث ملف القبول" : "💼 Admissions File Update",
      lang === "ar"
        ? `تم تحديث حالة طلب الالتحاق للمتقدم [${applicantName}] إلى: ${actionAr} بعد المراجعة الأكاديمية.`
        : `Admission request for [${applicantName}] updated to: ${actionEn} after committee review.`
    );
  };

  // Handle Student Affairs Action (Approve Letter / Request)
  const handleRequestAction = (reqId: string, status: "completed" | "rejected") => {
    setServicesRequests(prev =>
      prev.map(req => (req.id === reqId ? { ...req, status } : req))
    );
    
    const targetReq = servicesRequests.find(r => r.id === reqId);
    if (!targetReq) return;
    
    const logMsg = `[شؤون الطلاب] تم (${status === "completed" ? "معالجة وإصدار" : "رفض"}) طلب [${targetReq.type}] للطالب [${targetReq.studentName}]`;
    if (addLog) addLog(logMsg);

    triggerSystemPush(
      lang === "ar" ? "📄 الخدمات الطلابية" : "📄 Student Services",
      lang === "ar"
        ? `عزيزي الطالب، تم اعتماد ومعالجة طلبك لـ [${targetReq.type}] وهو جاهز للاستلام الآن من الإدارة.`
        : `Your request for [${targetReq.type}] has been approved and is ready for pickup.`
    );
  };

  // Student affairs freeze/unfreeze action
  const handleToggleFreezeStudent = (studentId: string) => {
    // If it's the active simulated student
    if (studentId === "SGU-10045" || studentId === student.id) {
      const isFrozen = student.level.includes("مجمد");
      const nextLevel = isFrozen ? "السنة الثالثة - الفصل الدراسي الثاني" : "مجمد مؤقتاً بقرار إداري (شؤون الطلاب)";
      const updated = { ...student, level: nextLevel };
      setStudent(updated);
      localStorage.setItem("u_student", JSON.stringify(updated));
      
      const logMsg = `[شؤون الطلاب] تم تغيير الوضع الأكاديمي للطالب [${student.nameArabic}] إلى: ${isFrozen ? "نشط ومقيد" : "قيد مجمد"}`;
      if (addLog) addLog(logMsg);
      
      triggerSystemPush(
        lang === "ar" ? "⚠️ تحديث الوضع الأكاديمي" : "⚠️ Academic Status Update",
        lang === "ar"
          ? `تم ${isFrozen ? "إلغاء تجميد قيدك الأكاديمي بنجاح" : "تجميد قيدك الإداري مؤقتاً"} بناءً على المراجعة الدورية.`
          : `Your registration status has been set to: ${isFrozen ? "Active" : "Frozen"} by Student Affairs.`
      );
      return;
    }

    // Otherwise, change in dbUsers
    setDbUsers(prev =>
      prev.map(u => {
        if (u.id === studentId) {
          const isSuspended = u.status === "suspended";
          const nextStatus = isSuspended ? "active" : "suspended";
          const logMsg = `[شؤون الطلاب] تم (${nextStatus === "active" ? "تنشيط" : "إيقاف مؤقت"}) لحساب الطالب [${u.nameAr}] كود: ${u.id}`;
          if (addLog) addLog(logMsg);
          
          triggerSystemPush(
            lang === "ar" ? "🔒 إدارة حسابات الطلاب" : "🔒 Student Accounts Management",
            lang === "ar"
              ? `تم تحديث حالة حساب الطالب [${u.nameAr}] بقاعدة البيانات المركزية.`
              : `Student account for [${u.nameAr}] status changed to: ${nextStatus}.`
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Finance Officer: Confirm Student Payment
  const handleConfirmPayment = (paymentId: string) => {
    setFinance(prev =>
      prev.map(f => (f.id === paymentId ? { ...f, paid: true, paymentDate: new Date().toISOString().split("T")[0] } : f))
    );
    
    const targetPay = finance.find(f => f.id === paymentId);
    if (!targetPay) return;

    const logMsg = `[الخزينة والمالية] قام أمين الصندوق المالي باعتماد وإقرار الدفع للطلب رقم #${paymentId} بقيمة ${targetPay.amount} ج.م للطالب يوسف الكردي.`;
    if (addLog) addLog(logMsg);

    triggerSystemPush(
      lang === "ar" ? "💳 إقرار سداد مالي معتمد" : "💳 Financial Payment Approved",
      lang === "ar"
        ? `تم اعتماد ومعالجة معاملة السداد المالي لـ [${targetPay.description}] بقيمة ${targetPay.amount} ج.م بنجاح.`
        : `Your payment of ${targetPay.amount} EGP for [${targetPay.description}] has been officially posted.`
    );
  };

  // Filter lists based on search
  const filteredApps = applications.filter(app =>
    app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.nationalId.includes(searchQuery)
  );

  const filteredRequests = servicesRequests.filter(req =>
    req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.studentId.includes(searchQuery) ||
    req.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Employee Context Banner */}
      <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 justify-end">
            <h3 className="text-sm font-black text-slate-100">
              {employeeRole === "registrar" && (lang === "ar" ? "أ. عبدالرحمن مصطفى - موظف القبول والتسجيل الموحد" : "Mr. Abdelrahman Mostafa - Unified Admissions Officer")}
              {employeeRole === "student_affairs" && (lang === "ar" ? "أ. فاطمة الزهراء الشافعي - أخصائي شؤون الطلاب" : "Mrs. Fatima El-Shafei - Student Affairs Specialist")}
              {employeeRole === "finance_officer" && (lang === "ar" ? "أ. كريم الهلالي - مدقق عام الحسابات والخزينة" : "Mr. Karim El-Hilaly - General Treasury & Auditor")}
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-450 bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-400">
            {employeeRole === "registrar" && (lang === "ar" ? "إدارة القبول وشؤون الانتساب والشهادات المعادلة" : "Admissions, Enrolment & Equivalent Certificates Department")}
            {employeeRole === "student_affairs" && (lang === "ar" ? "قسم شؤون الطلاب، الخدمات، وتعديل الوضع الأكاديمي" : "Student Affairs, Services, & Registration Status Department")}
            {employeeRole === "finance_officer" && (lang === "ar" ? "الإدارة المالية المركزية، التحصيل الإلكتروني، وإقرار الدفع" : "Central Financial Management, Online Clearing, & Treasury Posting")}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            SGU Authorized Employee Token ID: EMP-STAFF-{employeeRole.toUpperCase()}-09322
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-850">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">{lang === "ar" ? "درجة تفويض الأمان" : "Security clearance level"}</span>
            <span className="text-xs font-black text-emerald-400 font-mono">LEVEL-2 (AUTH)</span>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-850">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">{lang === "ar" ? "صلاحيات التعديل" : "Write Authorities"}</span>
            <span className="text-xs font-black text-teal-400">
              {employeeRole === "registrar" && (lang === "ar" ? "اعتماد طلبات القبول" : "Admissions Only")}
              {employeeRole === "student_affairs" && (lang === "ar" ? "إصدار شهادات وتغيير قيد" : "Registration Only")}
              {employeeRole === "finance_officer" && (lang === "ar" ? "إقرار سداد وتسويات" : "Treasury Posting Only")}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH / CONTROL BAR FOR SUB-DASHBOARDS */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={
              employeeRole === "registrar" ? (lang === "ar" ? "ابحث عن متقدم باسمه أو هاتفه..." : "Search applicant name/phone...") :
              employeeRole === "student_affairs" ? (lang === "ar" ? "ابحث عن طالب باسمه أو الكود الأكاديمي..." : "Search student name/ID...") :
              (lang === "ar" ? "البحث بـ اسم المعاملة أو الكود المالي..." : "Search billing title/ID...")
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-600 text-right"
          />
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
          <Briefcase className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>
            {employeeRole === "registrar" && (lang === "ar" ? "تلقي طلبات الالتحاق المباشرة ومراجعة درجات الثانوية" : "Receiving Admissions and Secondary Certificate GPA Reviews")}
            {employeeRole === "student_affairs" && (lang === "ar" ? "لوحة تجميد القيد وإصدار إثبات القيد للطلاب النشطين" : "Student Registration Status Freeze Panel & Service Outlets")}
            {employeeRole === "finance_officer" && (lang === "ar" ? "مدفوعات الطلاب وقسم مراجعة المعاملات السحابة" : "Student Tuition Payments & Online Transaction Reconciliation")}
          </span>
        </div>
      </div>

      {/* ==================== 1. ADMISSIONS OFFICER VIEW ==================== */}
      {employeeRole === "registrar" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded font-mono font-bold">
              SYSTEM_PORTAL: OK (ACTIVE)
            </span>
            <h3 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
              <span>{lang === "ar" ? "طلبات الالتحاق والقبول للمستجدين الجدد" : "Applicant Intake & Admissions Dashboard"}</span>
              <Inbox className="w-4 h-4 text-emerald-500" />
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 font-medium text-right">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-[10px] text-slate-400">
                  <th className="p-3">{lang === "ar" ? "رقم الطلب" : "App ID"}</th>
                  <th className="p-3">{lang === "ar" ? "اسم المتقدم" : "Applicant Name"}</th>
                  <th className="p-3">{lang === "ar" ? "شهادة الثانوية العامة / النسبة" : "Secondary Cert / GPA"}</th>
                  <th className="p-3">{lang === "ar" ? "الكلية المرغوبة" : "Preferred College"}</th>
                  <th className="p-3">{lang === "ar" ? "الرقم القومي" : "National ID"}</th>
                  <th className="p-3 text-center">{lang === "ar" ? "الحالة الحالية" : "Current Status"}</th>
                  <th className="p-3 text-center">{lang === "ar" ? "القرارات الإدارية" : "Administrative Action"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      {lang === "ar" ? "لا توجد طلبات إلتحاق مطابقة للبحث حالياً." : "No applications match your search query."}
                    </td>
                  </tr>
                ) : (
                 filteredApps.map((app) => {
                    const wishes = app.wishes || [];
                    const preferredCollege = wishes[0] || "كلية الحاسبات";
                    return (
                      <tr key={app.id} className="border-b border-slate-850/60 hover:bg-slate-950/30 transition">
                        <td className="p-3 font-mono text-slate-400 text-[10.5px]">#{app.id}</td>
                        <td className="p-3 font-bold text-slate-205 text-slate-200">
                          <div className="flex flex-col">
                            <span>{app.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {app.nationalId}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-emerald-400 font-mono">{app.highSchoolPercentage}%</span>
                            <span className="text-[10px] text-slate-500">{preferredCollege}</span>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-teal-400">
                          {preferredCollege.includes("حاسب") ? (lang === "ar" ? "كلية الحاسبات والمعلومات" : "FCIS") :
                           preferredCollege.includes("طب") ? (lang === "ar" ? "كلية الطب البشري" : "Medicine") :
                           (lang === "ar" ? "إدارة الأعمال واللغات" : "Business")}
                        </td>
                        <td className="p-3 font-mono text-slate-500 text-[10.5px]">{app.nationalId}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                            app.status === "accepted" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40" :
                            app.status === "rejected" ? "bg-rose-950 text-rose-400 border border-rose-900/40" :
                            "bg-amber-950 text-amber-400 border border-amber-900/40 animate-pulse"
                          }`}>
                            {app.status === "accepted" ? (lang === "ar" ? "مقبول نهائياً" : "Approved") :
                             app.status === "rejected" ? (lang === "ar" ? "طلب مرفوض" : "Rejected") :
                             (lang === "ar" ? "قيد الدراسة والفرز" : "Pending study")}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleAdmissionAction(app.id, "accepted")}
                              disabled={app.status === "accepted"}
                              className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-black px-2 py-1 rounded text-[10px] transition-all flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>{lang === "ar" ? "قبول" : "Approve"}</span>
                            </button>
                            <button
                              onClick={() => handleAdmissionAction(app.id, "rejected")}
                              disabled={app.status === "rejected"}
                              className="cursor-pointer bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-slate-105 text-white font-bold px-2 py-1 rounded text-[10px] transition-all flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>{lang === "ar" ? "رفض" : "Reject"}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 2. STUDENT AFFAIRS OFFICER VIEW ==================== */}
      {employeeRole === "student_affairs" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Student List & status management */}
          <div className="lg:col-span-8 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1.5 border-b border-slate-850 pb-2">
              <span>{lang === "ar" ? "إدارة تسجيل وحالة قيد الطلاب (Active / Frozen)" : "Manage Student Status (Active / Frozen)"}</span>
              <Users className="w-4 h-4 text-emerald-500" />
            </h4>

            <div className="overflow-x-auto text-right">
              <table className="w-full text-xs text-slate-300 font-medium">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-950/40 text-[10px] text-slate-400">
                    <th className="p-3">{lang === "ar" ? "كود الطالب" : "Student ID"}</th>
                    <th className="p-3">{lang === "ar" ? "اسم الطالب" : "Student Name"}</th>
                    <th className="p-3">{lang === "ar" ? "الكلية / الفرقة" : "College & Year"}</th>
                    <th className="p-3 text-center">{lang === "ar" ? "الوضع الأكاديمي الحالي" : "Current Status"}</th>
                    <th className="p-3 text-center">{lang === "ar" ? "تعديل القيد الأكاديمي" : "Action Control"}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock the active student first */}
                  <tr className="border-b border-emerald-950 bg-emerald-950/10 hover:bg-emerald-950/20 transition">
                    <td className="p-3 font-mono text-emerald-400 font-bold">{student.id}</td>
                    <td className="p-3 font-bold text-slate-200">
                      {student.nameArabic}
                      <span className="bg-emerald-900 text-emerald-300 text-[8.5px] px-1.5 py-0.2 rounded-full mx-2 border border-emerald-800">حساب محاكي</span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col text-[11px]">
                        <span className="font-semibold text-teal-400">{student.college}</span>
                        <span className="text-[10px] text-slate-500">{student.level}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        student.level.includes("مجمد") ? "bg-rose-950 text-rose-400 border border-rose-900/50" : "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
                      }`}>
                        {student.level.includes("مجمد") ? (lang === "ar" ? "قيد مجمد إدارياً" : "Suspended/Frozen") : (lang === "ar" ? "نشط ومقيد" : "Active")}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleFreezeStudent(student.id)}
                        className={`cursor-pointer font-bold px-3 py-1 rounded text-[10.5px] transition ${
                          student.level.includes("مجمد") 
                            ? "bg-emerald-600 hover:bg-emerald-500 text-slate-950" 
                            : "bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-900/50"
                        }`}
                      >
                        {student.level.includes("مجمد") ? (lang === "ar" ? "إلغاء تجميد القيد" : "Activate Registration") : (lang === "ar" ? "تجميد القيد" : "Freeze Registration")}
                      </button>
                    </td>
                  </tr>

                  {/* Seeded users */}
                  {dbUsers.filter(u => u.role === "student").slice(0, 5).map((u) => {
                    const isSuspended = u.status === "suspended";
                    return (
                      <tr key={u.id} className="border-b border-slate-850 hover:bg-slate-950/20 transition">
                        <td className="p-3 font-mono text-slate-400">{u.id}</td>
                        <td className="p-3 font-bold text-slate-200">{u.nameAr}</td>
                        <td className="p-3">
                          <div className="flex flex-col text-[11px]">
                            <span className="font-semibold text-teal-400">{u.collegeId.toUpperCase()}</span>
                            <span className="text-[10px] text-slate-500">GPA: {u.gpaOrSalary}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isSuspended ? "bg-rose-950 text-rose-400 border border-rose-900/50" : "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
                          }`}>
                            {isSuspended ? (lang === "ar" ? "مجمد مؤقتاً" : "Suspended") : (lang === "ar" ? "نشط ومقيد" : "Active")}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleFreezeStudent(u.id)}
                            className={`cursor-pointer font-bold px-3 py-1 rounded text-[10.5px] transition ${
                              isSuspended 
                                ? "bg-emerald-600 hover:bg-emerald-500 text-slate-950" 
                                : "bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-900/50"
                            }`}
                          >
                            {isSuspended ? (lang === "ar" ? "إلغاء التجميد" : "Activate") : (lang === "ar" ? "تجميد القيد" : "Freeze")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Requests list */}
          <div className="lg:col-span-4 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1.5 border-b border-slate-850 pb-2">
              <span>{lang === "ar" ? "طلبات الطلاب والخدمات الطلابية المستلمة" : "Student Services & Requests Queue"}</span>
              <FileText className="w-4 h-4 text-emerald-500" />
            </h4>

            <div className="space-y-3">
              {filteredRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 text-right relative overflow-hidden">
                  {/* Decorative indicator */}
                  <div className={`absolute top-0 bottom-0 right-0 w-1 ${req.status === "completed" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-500 text-[10px]">{req.date}</span>
                    <strong className="font-black text-slate-200">{req.type}</strong>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <p>{lang === "ar" ? "اسم الطالب:" : "Student Name:"} <span className="font-semibold text-slate-200">{req.studentName}</span></p>
                    <p>{lang === "ar" ? "الكود الأكاديمي:" : "Student ID:"} <span className="font-mono text-emerald-400">{req.studentId}</span></p>
                    {req.notes && <p className="text-[10px] text-slate-500 bg-slate-900 p-1.5 rounded mt-1.5 italic font-sans">{req.notes}</p>}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-900 flex-row-reverse">
                    <span className={`text-[9.5px] font-bold ${
                      req.status === "completed" ? "text-emerald-450 text-emerald-400" : "text-amber-500 animate-pulse"
                    }`}>
                      {req.status === "completed" ? (lang === "ar" ? "✓ تم الإصدار والطباعة" : "Issued") : (lang === "ar" ? "قيد التدقيق والتحقق" : "Pending Verify")}
                    </span>

                    {req.status === "pending" && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleRequestAction(req.id, "completed")}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded text-[10px] transition-all flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3 text-slate-950" />
                          <span>{lang === "ar" ? "إصدار وطباعة" : "Issue & Print"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================== 3. FINANCIAL OFFICER VIEW ==================== */}
      {employeeRole === "finance_officer" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 text-right border-b border-slate-850 pb-4">
            <div className="text-right space-y-1">
              <h4 className="text-xs font-black text-slate-200 flex items-center gap-2 justify-end">
                <span>{lang === "ar" ? "إقرار سداد المدفوعات والرسوم الدراسية للطلاب" : "Student Payments Clearing & Tuition Verification"}</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal max-w-sm">
                {lang === "ar" 
                  ? "تتيح هذه الصفحة للمسؤول المالي مراجعة مدفوعات الطلاب المصرفية وتأكيد سداد المصروفات إلكترونياً مما يتيح للطالب التسجيل الأكاديمي."
                  : "Review billing entries, confirm bank payments, issue online payment clearing statements instantly."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right mb-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-slate-500 text-[10px] block font-semibold">{lang === "ar" ? "إجمالي الإيرادات المحصلة اليوم" : "Total Revenue Cleared Today"}</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">1,348,000 ج.م</div>
              <span className="text-[9.5px] text-slate-500">تم تصفية المعاملات عبر بوابة الدفع</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-slate-500 text-[10px] block font-semibold">{lang === "ar" ? "الطلبات المعلقة المتبقية" : "Pending Clearance Receipts"}</span>
              <div className="text-lg font-bold text-amber-500 mt-1">
                {finance.filter(f => !f.paid).length} معاملات معلقة
              </div>
              <span className="text-[9.5px] text-slate-500">في انتظار مراجعة الحوالات البنكية</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-slate-500 text-[10px] block font-semibold">{lang === "ar" ? "معدل السداد الفصلي للطلاب" : "Intake Tuition Payment Ratio"}</span>
              <div className="text-lg font-bold text-teal-400 mt-1">87.5%</div>
              <span className="text-[9.5px] text-slate-500">باقي {100 - 87.5}% من المستهدف المالي للترم</span>
            </div>
          </div>

          {/* Roster list of financial records */}
          <div className="overflow-x-auto text-right">
            <table className="w-full text-xs text-slate-300 font-medium">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] text-slate-400">
                  <th className="p-3 text-right">{lang === "ar" ? "كود الفاتورة" : "Invoice ID"}</th>
                  <th className="p-3 text-right">{lang === "ar" ? "تفاصيل بند الرسوم" : "Tuition Fee Title"}</th>
                  <th className="p-3 text-center">{lang === "ar" ? "طريقة الدفع" : "Channel"}</th>
                  <th className="p-3 text-center">{lang === "ar" ? "قيمة المستحق" : "Amount (EGP)"}</th>
                  <th className="p-3 text-center">{lang === "ar" ? "الاستحقاق" : "Due Date"}</th>
                  <th className="p-3 text-center">{lang === "ar" ? "حالة الدفع" : "Clearing Status"}</th>
                  <th className="p-3 text-center">{lang === "ar" ? "إقرار التحصيل والسداد" : "Action Posting"}</th>
                </tr>
              </thead>
              <tbody>
                {finance.map((row) => (
                  <tr key={row.id} className="border-b border-slate-850 hover:bg-slate-950/20 transition">
                    <td className="p-3 text-right text-[10.5px] font-mono text-slate-400">#INV-{row.id}</td>
                    <td className="p-3 text-right">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200">{row.description}</span>
                        <span className="text-[10px] text-slate-500 font-mono">طالب كود: SGU-10045</span>
                      </div>
                    </td>
                    <td className="p-3 text-center text-[10.5px] font-mono text-slate-400">{row.paymentMethod}</td>
                    <td className="p-3 text-center font-mono font-extrabold text-teal-450 text-teal-400">
                      {row.amount.toLocaleString()} ج.م
                    </td>
                    <td className="p-3 text-center text-[10.5px] font-mono text-slate-500">{row.dueDate}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.paid ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40" : "bg-rose-950 text-rose-450 text-rose-400 border border-rose-900/40 animate-pulse"
                      }`}>
                        {row.paid ? (lang === "ar" ? "مكتمل السداد" : "Paid") : (lang === "ar" ? "معلق غير مدفوع" : "Unpaid")}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {!row.paid ? (
                        <button
                          onClick={() => handleConfirmPayment(row.id)}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded text-[10px] transition-all flex items-center justify-center gap-1 mx-auto"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === "ar" ? "إقرار واستلام الدفع" : "Confirm Payment"}</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px] font-bold">{lang === "ar" ? "تم تأكيد السداد المالي" : "Cleared & Settled"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
