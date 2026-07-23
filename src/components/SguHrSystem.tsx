import React, { useState, useMemo } from "react";
import {
  Users,
  Briefcase,
  Fingerprint,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Sparkles,
  Award,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  UserCheck
} from "lucide-react";

interface SguHrSystemProps {
  lang: "ar" | "en";
  triggerSystemPush: (title: string, message: string) => void;
  addLog?: (msg: string) => void;
}

interface StaffMember {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  deptAr: string;
  deptEn: string;
  salary: number;
  allowance: number;
  contractAr: string;
  contractEn: string;
  hireDate: string;
}

export default function SguHrSystem({
  lang,
  triggerSystemPush,
  addLog
}: SguHrSystemProps) {
  const [activeTab, setActiveTab] = useState<"directory" | "biometric" | "payroll" | "leaves">("directory");

  // Mock SGU Staff Directory
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: "SGU-HR-501",
      nameAr: "أ.د. حاتم ممدوح خفاجي",
      nameEn: "Prof. Hatem Mamdouh",
      titleAr: "عميد كلية الهندسة ورئيس وحدة الـ ABET",
      titleEn: "Dean of Engineering & ABET Chair",
      deptAr: "كلية الهندسة والتشييد",
      deptEn: "Faculty of Engineering",
      salary: 28500,
      allowance: 4500,
      contractAr: "عقد دائم (Full-Time)",
      contractEn: "Permanent Full-Time",
      hireDate: "2019-09-01"
    },
    {
      id: "SGU-HR-502",
      nameAr: "د. محمد أحمد عيسى",
      nameEn: "Dr. Mohamed Eissa",
      titleAr: "مدرس الذكاء الاصطناعي ومستشار النظم",
      titleEn: "Lecturer of AI & Systems Advisor",
      deptAr: "كلية الحاسبات والذكاء الاصطناعي",
      deptEn: "Computers & AI Faculty",
      salary: 19800,
      allowance: 2500,
      contractAr: "عقد دائم (Full-Time)",
      contractEn: "Permanent Full-Time",
      hireDate: "2021-10-15"
    },
    {
      id: "SGU-HR-503",
      nameAr: "أ. نجلاء زكي الشرقاوي",
      nameEn: "Mrs. Naglaa Zaki",
      titleAr: "رئيس الشؤون المالية والتحصيل الرقمي",
      titleEn: "Director of Financial Affairs",
      deptAr: "قسم الحسابات والخزانة",
      deptEn: "Treasury Department",
      salary: 14500,
      allowance: 1500,
      contractAr: "عقد إداري سنوي",
      contractEn: "Administrative Contract",
      hireDate: "2020-02-01"
    },
    {
      id: "SGU-HR-504",
      nameAr: "م. يسرا كمال عبد الحميد",
      nameEn: "Eng. Yousra Kamal",
      titleAr: "معيدة بقسم الشبكات والاتصالات الذكية",
      titleEn: "Teaching Assistant - Networks Dept",
      deptAr: "كلية الحاسبات والذكاء الاصطناعي",
      deptEn: "Computers & AI Faculty",
      salary: 9500,
      allowance: 1200,
      contractAr: "عقد سنوي متجدد",
      contractEn: "Renewable Yearly Contract",
      hireDate: "2023-09-10"
    }
  ]);

  // Biometric log list
  const [biometricLogs, setBiometricLogs] = useState<any[]>([
    { id: "1", name: lang === "ar" ? "د. محمد أحمد عيسى" : "Dr. Mohamed Eissa", time: "08:15 AM", type: "check_in", status: "verified", method: "Fingerprint" },
    { id: "2", name: lang === "ar" ? "أ. نجلاء زكي الشرقاوي" : "Mrs. Naglaa Zaki", time: "08:30 AM", type: "check_in", status: "verified", method: "Facial Face Recognition" },
    { id: "3", name: lang === "ar" ? "م. يسرا كمال عبد الحميد" : "Eng. Yousra Kamal", time: "08:45 AM", type: "check_in", status: "verified", method: "Fingerprint" }
  ]);

  // Leave Requests state
  const [leaveRequests, setLeaveRequests] = useState<any[]>([
    {
      id: "LV-901",
      staffId: "SGU-HR-502",
      nameAr: "د. محمد أحمد عيسى",
      nameEn: "Dr. Mohamed Eissa",
      typeAr: "إجازة سنوية (أبحاث)",
      typeEn: "Annual Leave (Research)",
      days: 5,
      startDate: "2026-08-10",
      status: "pending"
    },
    {
      id: "LV-902",
      staffId: "SGU-HR-504",
      nameAr: "م. يسرا كمال عبد الحميد",
      nameEn: "Eng. Yousra Kamal",
      typeAr: "إجازة مرضية طارئة",
      typeEn: "Emergency Sick Leave",
      days: 2,
      startDate: "2026-07-15",
      status: "approved"
    }
  ]);

  // Selection states
  const [selectedStaffId, setSelectedStaffId] = useState<string>("SGU-HR-502");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedStaff = useMemo(() => {
    return staff.find(s => s.id === selectedStaffId) || staff[0];
  }, [staff, selectedStaffId]);

  // Biometric actions simulations
  const triggerBiometricPunch = (type: "check_in" | "check_out") => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    const newLog = {
      id: `bio-${Date.now()}`,
      name: lang === "ar" ? "د. محمد أحمد عيسى" : "Dr. Mohamed Eissa",
      time: timeString,
      type,
      status: "verified",
      method: "Biometric NFC Phone Match"
    };

    setBiometricLogs(prev => [newLog, ...prev]);

    if (addLog) addLog(`✓ [الموارد البشرية] تسجيل بصمة حضور [${type === "check_in" ? "دخول" : "خروج"}] للمستشار د. محمد عيسى.`);
    triggerSystemPush(
      lang === "ar" ? "🎯 تم توثيق الحضور الحيوي" : "🎯 Biometric Verification Succeeded",
      lang === "ar" ? `تم تسجيل بصمة الأستاذ بنجاح بالبوابات في ${timeString}` : `Attendance successfully registered at ${timeString}`
    );
  };

  // Process leave request (Accept / Reject)
  const handleProcessLeave = (id: string, action: "approved" | "rejected") => {
    setLeaveRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: action } : r))
    );

    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;

    if (addLog) addLog(`✓ [الموارد البشرية] تم ${action === "approved" ? "الموافقة على" : "رفض"} طلب إجازة رقم ${id} للموظف [${req.nameAr}]`);
    triggerSystemPush(
      lang === "ar" ? "⚖️ قرار شؤون الموظفين بخصوص إجازة" : "⚖️ Staff Leave Decision",
      lang === "ar" ? `تم تعديل حالة الإجازة إلى: ${action === "approved" ? "مقبول" : "مرفوض"}` : `Leave petition ${id} marked as ${action}.`
    );
  };

  // Filter staff directory
  const filteredStaff = useMemo(() => {
    return staff.filter(s =>
      s.nameAr.includes(searchTerm) ||
      s.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.deptAr.includes(searchTerm)
    );
  }, [staff, searchTerm]);

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/75 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-right">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-455 shrink-0 animate-pulse">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <span>{lang === "ar" ? "نظام إدارة الكوادر والموارد البشرية (HR System)" : "SGU Enterprise Human Resources Suite"}</span>
              <span className="text-[9px] bg-rose-500/15 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">Phase 13</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "ar" ? "إدارة شؤون موظفي الجامعة، الرواتب والمسيرات المصلحية، رصد حضور البصمة، وصندوق الإجازات والترقيات." : "Manage faculty files, automated payroll breakups, biometric check-ins, and leaves review dashboards."}
            </p>
          </div>
        </div>

        {/* Local Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
          {[
            { id: "directory", label: lang === "ar" ? "دليل الكوادر" : "Staff Directory" },
            { id: "biometric", label: lang === "ar" ? "بصمة الحضور" : "Biometrics" },
            { id: "payroll", label: lang === "ar" ? "مسير الرواتب" : "Payroll Hub" },
            { id: "leaves", label: lang === "ar" ? "طلبات الإجازة" : "Leaves Portal" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === tab.id
                  ? "bg-rose-600 text-slate-100 shadow-md"
                  : "text-slate-450 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. STAFF DIRECTORY VIEW */}
      {activeTab === "directory" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List selection */}
          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-850 p-4 rounded-2xl space-y-4">
            <div className="border-b border-slate-900 pb-2">
              <span className="text-[10px] font-mono text-rose-455 font-bold block uppercase">Active Dossiers</span>
              <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "📋 ملفات الموظفين النشطة" : "📋 Active SGU Staff"}</h4>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute top-3 right-3" />
              <input
                type="text"
                placeholder={lang === "ar" ? "بحث بالاسم أو القسم..." : "Search staff dossiers..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 py-2 pr-9 pl-3 text-xs text-right text-slate-200 outline-none rounded-lg"
              />
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredStaff.map(s => {
                const isSelected = s.id === selectedStaffId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStaffId(s.id)}
                    className={`p-3 rounded-xl border transition text-right cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 border-rose-500/40 shadow-md"
                        : "bg-slate-950 hover:bg-slate-900 border-slate-850"
                    }`}
                  >
                    <strong className="text-[11px] text-slate-200 block">{lang === "ar" ? s.nameAr : s.nameEn}</strong>
                    <span className="text-[9.5px] text-rose-400 block font-bold">{lang === "ar" ? s.titleAr : s.titleEn}</span>
                    <span className="text-[9px] text-slate-500 block font-mono">{s.id}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed dossier */}
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-5">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-400 px-2.5 py-0.5 rounded font-mono font-bold">
                  {selectedStaff.id}
                </span>
                <h4 className="text-sm font-black text-slate-100 mt-1">{lang === "ar" ? selectedStaff.nameAr : selectedStaff.nameEn}</h4>
              </div>
              <span className="text-[10.5px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                {lang === "ar" ? selectedStaff.deptAr : selectedStaff.deptEn}
              </span>
            </div>

            {/* Grid detail metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
              <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">{lang === "ar" ? "💼 المسمى الوظيفي والتعيين:" : "💼 Academic Placement:"}</span>
                <p>{lang === "ar" ? `اللقب المعتمد: ${selectedStaff.titleAr}` : `Title: ${selectedStaff.titleEn}`}</p>
                <p>{lang === "ar" ? `تاريخ الالتحاق: ${selectedStaff.hireDate}` : `Hired on: ${selectedStaff.hireDate}`}</p>
                <p className="font-mono text-emerald-450">{lang === "ar" ? `الحالة المصلحية: 🟢 مستمر بالعمل` : "Status: 🟢 Active Duty"}</p>
              </div>

              <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">{lang === "ar" ? "📁 تفاصيل العقد والراتب:" : "📁 Financial Contract Parameters:"}</span>
                <p>{lang === "ar" ? `الراتب الأساسي: ${selectedStaff.salary.toLocaleString()} ج.م` : `Basic salary: ${selectedStaff.salary.toLocaleString()} EGP`}</p>
                <p>{lang === "ar" ? `البدلات والحوافز: ${selectedStaff.allowance.toLocaleString()} ج.م` : `Allowances: ${selectedStaff.allowance.toLocaleString()} EGP`}</p>
                <p>{lang === "ar" ? `طبيعة العقد: ${selectedStaff.contractAr}` : `Contract type: ${selectedStaff.contractEn}`}</p>
              </div>
            </div>

            {/* Academic Evaluation Score cards */}
            <div className="border border-slate-850 p-4 rounded-xl bg-slate-900/40 text-center flex flex-wrap justify-between items-center gap-3">
              <div className="text-right">
                <strong className="text-xs text-slate-200 block">{lang === "ar" ? "🏆 التقييم السنوي للتدريس والخدمات" : "🏆 Annual Academic Quality Score"}</strong>
                <span className="text-[10.5px] text-slate-450 leading-relaxed block">{lang === "ar" ? "معدل استبيانات الطلاب والبحث العلمي المعتمد." : "Derived from student surveys, research impact, and NAQAAE filings."}</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg font-mono">
                <strong className="text-xl font-black text-emerald-400">96.8 / 100</strong>
                <span className="text-[9.5px] text-emerald-500 block uppercase font-bold">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BIOMETRIC ATTENDANCE PORTAL */}
      {activeTab === "biometric" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Biometric machine simulator */}
          <div className="lg:col-span-5 bg-slate-950 p-6 border border-slate-850 rounded-2xl text-center space-y-4">
            <Fingerprint className="w-14 h-14 text-rose-500 mx-auto animate-pulse" />
            <div>
              <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "🎯 جهاز توثيق البصمة الحيوية (محاكي)" : "🎯 Biometric Terminal Simulator"}</h4>
              <p className="text-[11px] text-slate-450 mt-1">
                {lang === "ar" ? "يمكن للأستاذ تسجيل الحضور الفعلي عبر إدخال بصمة NFC الجوال للحدود الجغرافية للجامعة:" : "Allows faculty staff to sign their attendance on campus using digital fingerprint credentials:"}
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-right space-y-2">
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-slate-500">{lang === "ar" ? "الموظف المفعّل:" : "Active Identity:"}</span>
                <span className="text-slate-200">د. محمد أحمد عيسى</span>
              </div>
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-slate-500">{lang === "ar" ? "الموقع الجغرافي للـ GPS:" : "GPS Campus Check:"}</span>
                <span className="text-emerald-400">🟢 In Radius (SGU Main Building)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => triggerBiometricPunch("check_in")}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs transition"
              >
                {lang === "ar" ? "🎯 بصمة دخول (In)" : "🎯 Clock In"}
              </button>
              <button
                onClick={() => triggerBiometricPunch("check_out")}
                className="cursor-pointer bg-rose-600 hover:bg-rose-500 text-slate-100 font-black py-2.5 rounded-xl text-xs transition"
              >
                {lang === "ar" ? "🛑 بصمة خروج (Out)" : "🛑 Clock Out"}
              </button>
            </div>
          </div>

          {/* Biometric Punch Logs */}
          <div className="lg:col-span-7 bg-slate-950 p-5 border border-slate-850 rounded-2xl text-right space-y-3">
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Attendance Records Feed</span>
            <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "📜 سجل الحضور اليومي الفوري" : "📜 Live Attendance Terminal Logs"}</h4>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {biometricLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex justify-between items-center text-xs font-bold font-sans">
                  <span className="text-slate-450 font-mono">{log.time} | {log.method}</span>
                  <div className="text-right">
                    <span className="text-slate-200 block">{log.name}</span>
                    <span className={`text-[9.5px] uppercase ${log.type === "check_in" ? "text-emerald-400" : "text-rose-400"}`}>
                      ● {log.type === "check_in" ? "دخول" : "خروج"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PAYROLL HUB VIEW */}
      {activeTab === "payroll" && (
        <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-5 animate-fadeIn">
          <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
            <h4 className="text-xs font-black text-slate-100 flex items-center gap-2 flex-row-reverse">
              <DollarSign className="w-4 h-4 text-rose-500" />
              <span>{lang === "ar" ? "مسيرات الرواتب والمستحقات المصلحية" : "Automated Payroll & Salary breakups"}</span>
            </h4>
            <span className="text-[9.5px] bg-slate-900 border border-slate-850 text-slate-500 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              Financial Year 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Salary Breakdown widget */}
            <div className="md:col-span-2 border border-slate-850 rounded-xl bg-slate-900/40 p-5 space-y-4">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">{lang === "ar" ? "قسيمة الراتب المقررة للموظف:" : "Monthly Pay Stub Breakdowns:"}</span>
              <div className="space-y-2.5 text-xs text-slate-300 font-semibold border-b border-slate-850 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === "ar" ? "اسم الموظف المستفيد:" : "Staff Name:"}</span>
                  <span className="text-slate-200">{lang === "ar" ? selectedStaff.nameAr : selectedStaff.nameEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === "ar" ? "المرتب الأساسي:" : "Basic Salary base:"}</span>
                  <span className="text-slate-200 font-mono">{selectedStaff.salary.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === "ar" ? "بدلات وحوافز البحوث:" : "Allowances & Merit benefits:"}</span>
                  <span className="text-emerald-400 font-mono">+{selectedStaff.allowance.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === "ar" ? "الضرائب والاستقطاعات المصلحية:" : "Tax / Insurance Deductions:"}</span>
                  <span className="text-rose-455 font-mono">-{((selectedStaff.salary + selectedStaff.allowance) * 0.12).toFixed(0)} EGP</span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-bold pt-1.5 font-sans">
                <span className="text-slate-200">{lang === "ar" ? "صافي الراتب المستحق:" : "Net Pay Out Check:"}</span>
                <span className="text-emerald-400 font-mono">
                  {((selectedStaff.salary + selectedStaff.allowance) * 0.88).toFixed(0)} EGP
                </span>
              </div>
            </div>

            {/* Account Details */}
            <div className="border border-slate-850 rounded-xl bg-slate-900/40 p-5 space-y-3">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">{lang === "ar" ? "🏦 تفاصيل الحساب البنكي:" : "🏦 Direct Deposit Parameters:"}</span>
              <div className="text-xs space-y-2 font-bold font-mono text-slate-350">
                <div><span className="text-slate-500 font-sans">Bank:</span> National Bank of Egypt (NBE)</div>
                <div><span className="text-slate-500 font-sans">IBAN:</span> EG7000030504101928374950</div>
                <div><span className="text-slate-500 font-sans">Swift:</span> NBEGEGCXX</div>
                <div className="text-emerald-400 font-sans font-bold flex items-center gap-1 mt-2.5 justify-end">
                  <span>🟢 Connected & Active</span>
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. LEAVE REQUESTS PORTAL */}
      {activeTab === "leaves" && (
        <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
          <div className="border-b border-slate-900 pb-3">
            <h4 className="text-xs font-black text-slate-100 flex items-center gap-2 flex-row-reverse">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>{lang === "ar" ? "صندوق مراجعة الإجازات والطلبات" : "Leaves & Vacations Approval Center"}</span>
            </h4>
          </div>

          <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
            {leaveRequests.map(r => (
              <div key={r.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="space-y-1 text-right flex-1 leading-relaxed">
                  <strong className="text-xs text-slate-200 block">{lang === "ar" ? r.nameAr : r.nameEn}</strong>
                  <div className="flex gap-2 justify-end text-[10px] text-slate-500 font-bold">
                    <span>{lang === "ar" ? `نوع الإجازة: ${r.typeAr}` : `Type: ${r.typeEn}`}</span>
                    <span>|</span>
                    <span>{lang === "ar" ? `المُدة: ${r.days} أيام` : `Duration: ${r.days} days`}</span>
                    <span>|</span>
                    <span>{lang === "ar" ? `البدء: ${r.startDate}` : `Start: ${r.startDate}`}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {r.status === "pending" ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleProcessLeave(r.id, "rejected")}
                        className="cursor-pointer bg-slate-950 hover:bg-rose-950/20 text-rose-455 border border-rose-900/40 text-[10.5px] font-black px-3 py-1.5 rounded transition"
                      >
                        {lang === "ar" ? "❌ رفض" : "Reject"}
                      </button>
                      <button
                        onClick={() => handleProcessLeave(r.id, "approved")}
                        className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10.5px] px-3 py-1.5 rounded transition"
                      >
                        {lang === "ar" ? "✓ موافقة" : "Approve"}
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      r.status === "approved"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}>
                      {r.status === "approved" ? (lang === "ar" ? "✓ تمت الموافقة" : "✓ Approved")
                        : (lang === "ar" ? "❌ مرفوض" : "❌ Rejected")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
