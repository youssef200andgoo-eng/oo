import React, { useState, useMemo } from "react";
import {
  Users,
  Building,
  UserCheck,
  UserX,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Search,
  Check,
  Trash2,
  Mail,
  UserPlus,
  AlertTriangle,
  FileSpreadsheet,
  Grid,
  QrCode,
  Download
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { AdmissionApplication } from "../types";
import { DatabaseUser } from "../databaseMock";

interface SguAdmissionSystemProps {
  applications: AdmissionApplication[];
  setApplications: React.Dispatch<React.SetStateAction<AdmissionApplication[]>>;
  dbUsers: DatabaseUser[];
  setDbUsers: React.Dispatch<React.SetStateAction<DatabaseUser[]>>;
  lang: "ar" | "en";
  triggerSystemPush: (title: string, message: string) => void;
  addLog?: (msg: string) => void;
}

export default function SguAdmissionSystem({
  applications,
  setApplications,
  dbUsers,
  setDbUsers,
  lang,
  triggerSystemPush,
  addLog
}: SguAdmissionSystemProps) {
  const [activeTab, setActiveTab] = useState<"portal" | "review" | "dashboard">("review");

  // State for new application form
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [highSchoolScore, setHighSchoolScore] = useState<number>(85);
  const [targetCollege, setTargetCollege] = useState("fcis");
  const [targetProgram, setTargetProgram] = useState("AI & Data Science");
  const [certFile, setCertFile] = useState<string>("highschool_certificate_signed.pdf");
  const [idCardFile, setIdCardFile] = useState<string>("scanned_id_card.png");
  const [photoFile, setPhotoFile] = useState<string>("biometric_portrait.jpg");
  const [signedConsent, setSignedConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appIdFeedback, setAppIdFeedback] = useState<string | null>(null);

  // Search & Filter state for Review panel
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(applications[0]?.id || null);

  // Academic Sync states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [assignedAdvisor, setAssignedAdvisor] = useState("د. محمد أحمد عيسى (AI Group)");

  // Local feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedApplication = useMemo(() => {
    return applications.find(app => app.id === selectedAppId) || applications[0] || null;
  }, [applications, selectedAppId]);

  // Handle applicant self-submission
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nationalId.trim() || !signedConsent) {
      triggerToast(lang === "ar" ? "⚠️ يرجى ملء الحقول المطلوبة والموافقة على صحة البيانات" : "⚠️ Please fill all required fields and accept terms.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newId = `SGU-ADM-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];

      const newApp: AdmissionApplication = {
        id: newId,
        fullName: fullName.trim(),
        nationalId: nationalId.trim(),
        highSchoolPercentage: Number(highSchoolScore),
        wishes: [targetCollege === "fcis" ? "كلية الحاسبات والذكاء الاصطناعي" : targetCollege === "engineering" ? "كلية الهندسة والتشييد" : "كلية العلوم الإدارية والمالية"],
        certificateFile: certFile,
        idCardFile: idCardFile,
        photoFile: photoFile,
        paidFee: true,
        status: "pending",
        electronicSignatureId: `RSA-SIG-${Math.random().toString(36).substring(3, 8).toUpperCase()}`,
        electronicSignatureDate: formattedDate,
        signatureConsent: true,
        signatureValue: `SHA256-RSA.${Math.random().toString(36).substring(2, 15)}`
      };

      setApplications(prev => [newApp, ...prev]);
      setAppIdFeedback(newId);
      setSelectedAppId(newId);
      setIsSubmitting(false);

      if (addLog) addLog(`✓ [نظام القبول] تقديم طلب التحاق إلكتروني جديد باسم المتقدم [${fullName}] كود الطلب: ${newId}`);
      triggerSystemPush(
        lang === "ar" ? "🆕 طلب التحاق جديد قيد المراجعة" : "🆕 New Admission Application Received",
        lang === "ar" ? `تقدم المتقدم ${fullName} بمجموع ثانوية عامة ${highSchoolScore}%` : `Applicant ${fullName} submitted files with ${highSchoolScore}% highschool GPA.`
      );

      // Reset
      setFullName("");
      setNationalId("");
      setHighSchoolScore(85);
      setSignedConsent(false);
    }, 1500);
  };

  // Process Application (Accept and register student, create academic account)
  const handleProcessApplication = (status: "accepted" | "rejected") => {
    if (!selectedApplication) return;

    if (status === "rejected") {
      setApplications(prev =>
        prev.map(app => (app.id === selectedApplication.id ? { ...app, status: "rejected" } : app))
      );
      if (addLog) addLog(`❌ [نظام القبول] تم رفض طلب الالتحاق رقم ${selectedApplication.id} للمتقدم [${selectedApplication.fullName}]`);
      triggerSystemPush(
        lang === "ar" ? "❌ رفض طلب التحاق" : "❌ Application Rejected",
        lang === "ar" ? `تم رفض طلب المتقدم ${selectedApplication.fullName} لعدم مطابقة الشروط.` : `Application for candidate ${selectedApplication.fullName} was rejected.`
      );
      triggerToast(lang === "ar" ? "تم رفض الطلب بنجاح" : "Application marked as rejected.");
      return;
    }

    // Start academic linkage process
    setIsSyncing(true);
    setSyncLogs([
      lang === "ar" ? "⏳ بدء عملية ربط القبول بالنظام الأكاديمي..." : "⏳ Initiating academic linkage...",
      lang === "ar" ? "🔍 فحص وتوثيق صحة الأوراق والشهادات والتوثيق الإلكتروني..." : "🔍 Validating certificates, file hashes, and electronic signatures...",
      lang === "ar" ? "✅ البصمة الرقمية RSA صحيحة ومطابقة..." : "✅ Cryptographic RSA signatures matched..."
    ]);

    setTimeout(() => {
      // 1. Generate University ID
      const sequentialNum = 1000 + dbUsers.filter(u => u.role === "student").length;
      const generatedStudentId = `2026SGU-ST-${sequentialNum}`;

      // 2. Generate University Email
      const cleanName = selectedApplication.fullName.split(" ").slice(0, 2).join(".").toLowerCase()
        .replace(/[^a-zA-Z]/g, "") || "student";
      const universityEmail = `${cleanName}.${sequentialNum}@stud.sgu.edu.eg`;

      setSyncLogs(prev => [
        ...prev,
        lang === "ar" ? `🎓 توليد الرقم الجامعي تلقائياً: ${generatedStudentId}` : `🎓 Auto-generated SGU Student ID: ${generatedStudentId}`,
        lang === "ar" ? `📧 تخصيص الحساب الإلكتروني الجامعي: ${universityEmail}` : `📧 Provisioned campus Google Workspace email: ${universityEmail}`,
        lang === "ar" ? "🗃️ بناء وتشييد ملف الطالب والمسار الأكاديمي..." : "🗃️ Structuring academic portfolio, advisors, and GPA databases...",
        lang === "ar" ? `👨‍🏫 تعيين المرشد الأكاديمي: ${assignedAdvisor}` : `👨‍🏫 Assigned academic advisor: ${assignedAdvisor}`
      ]);

      setTimeout(() => {
        // 3. Create student profile in centralized database
        const newStudentUser: DatabaseUser = {
          id: generatedStudentId,
          nameAr: selectedApplication.fullName,
          nameEn: selectedApplication.fullName,
          role: "student",
          collegeId: targetCollege,
          email: universityEmail,
          phone: "+20 1012345678",
          nationalId: selectedApplication.nationalId,
          createdAt: new Date().toISOString().split("T")[0],
          status: "active",
          gpaOrSalary: "0.00", // Fresh freshman
          campusBranch: "فرع الصالحية الجديدة الرئيسي"
        };

        setDbUsers(prev => [newStudentUser, ...prev]);

        // 4. Update Application Status to accepted
        setApplications(prev =>
          prev.map(app => (app.id === selectedApplication.id ? { ...app, status: "accepted" } : app))
        );

        setSyncLogs(prev => [
          ...prev,
          lang === "ar" ? "🎉 تم إكمال مزامنة البيانات وتأسيس الحساب بنجاح!" : "🎉 Data synchronization and academic initialization succeeded!"
        ]);
        setIsSyncing(false);

        if (addLog) addLog(`✓ [الربط الأكاديمي] تم تسجيل الطالب الجديد [${selectedApplication.fullName}] بالمنظومة الأكاديمية برقم جامعي: ${generatedStudentId}`);
        triggerSystemPush(
          lang === "ar" ? "🎉 تم القبول والربط الأكاديمي" : "🎉 Admission Succeeded & Linked",
          lang === "ar" ? `تم قبول الطالب ${selectedApplication.fullName} وإصدار رقم جامعي ${generatedStudentId}` : `Approved ${selectedApplication.fullName} with Student ID ${generatedStudentId}.`
        );
        triggerToast(lang === "ar" ? "✓ تم قبول الطالب وتأسيس ملفه الأكاديمي بنجاح!" : "✓ Candidate accepted and academic record provisioned.");
      }, 1500);
    }, 1500);
  };

  // Filtered Applications
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.nationalId.includes(searchTerm) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" ? true : app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Metrics for dashboard
  const metrics = useMemo(() => {
    const total = applications.length;
    const accepted = applications.filter(a => a.status === "accepted").length;
    const rejected = applications.filter(a => a.status === "rejected").length;
    const pending = applications.filter(a => a.status === "pending").length;

    // College distribution of accepted applicants
    const collegeDist = {
      fcis: dbUsers.filter(u => u.role === "student" && u.collegeId === "fcis").length,
      engineering: dbUsers.filter(u => u.role === "student" && u.collegeId === "engineering").length,
      business: dbUsers.filter(u => u.role === "student" && (u.collegeId === "business" || u.collegeId === "fba")).length,
    };

    const distChartData = [
      { name: lang === "ar" ? "كلية الحاسبات والذكاء الاصطناعي" : "Computers & AI", value: collegeDist.fcis, color: "#10b981" },
      { name: lang === "ar" ? "كلية الهندسة والتشييد" : "Engineering", value: collegeDist.engineering, color: "#0ea5e9" },
      { name: lang === "ar" ? "كلية العلوم الإدارية والمالية" : "Business Administration", value: collegeDist.business, color: "#f59e0b" }
    ];

    const scoreRanges = [
      { range: "95% - 100%", count: applications.filter(a => a.highSchoolPercentage >= 95).length },
      { range: "90% - 94%", count: applications.filter(a => a.highSchoolPercentage >= 90 && a.highSchoolPercentage < 95).length },
      { range: "85% - 89%", count: applications.filter(a => a.highSchoolPercentage >= 85 && a.highSchoolPercentage < 90).length },
      { range: "80% - 84%", count: applications.filter(a => a.highSchoolPercentage >= 80 && a.highSchoolPercentage < 85).length },
      { range: "70% - 79%", count: applications.filter(a => a.highSchoolPercentage >= 70 && a.highSchoolPercentage < 80).length },
      { range: "< 70%", count: applications.filter(a => a.highSchoolPercentage < 70).length },
    ];

    return { total, accepted, rejected, pending, distChartData, scoreRanges };
  }, [applications, dbUsers, lang]);

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Upper Panel */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/80 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-right">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <span>{lang === "ar" ? "نظام إدارة القبول والتسجيل Admission System" : "Central Admission & Registration Suite"}</span>
              <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">Phase 10</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "ar" ? "بوابة التقديم، مراجعة الوثائق إلكترونياً، الربط الأكاديمي الفوري، وتوليد أرقام الطلاب والبريد الجامعي." : "Student registration, document review, instant SIS database linkage, and automated university ID issuance."}
            </p>
          </div>
        </div>

        {/* Local Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
          {[
            { id: "portal", label: lang === "ar" ? "بوابة التقديم" : "Student Portal" },
            { id: "review", label: lang === "ar" ? "مراجعة الطلبات" : "Registrar Review" },
            { id: "dashboard", label: lang === "ar" ? "لوحة الإحصائيات" : "Admissions Analytics" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Sections */}

      {/* 1. APPLICANT REGISTRATION PORTAL */}
      {activeTab === "portal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Application Form */}
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
            <h4 className="text-xs font-black text-slate-100 flex items-center gap-2 flex-row-reverse border-b border-slate-900 pb-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{lang === "ar" ? "طلب التحاق إلكتروني جديد" : "Apply for New SGU Admission"}</span>
            </h4>

            {appIdFeedback && (
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl text-center space-y-2 animate-fadeIn">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h5 className="text-xs font-black text-slate-100">{lang === "ar" ? "✓ تم تقديم طلبك بنجاح" : "✓ Application Submitted Successfully"}</h5>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  {lang === "ar" 
                    ? `يرجى حفظ كود الطلب لمتابعة حالة القبول لاحقاً: ` 
                    : `Please save your registration code for status tracking: `}
                  <strong className="text-emerald-400 font-mono text-xs">{appIdFeedback}</strong>
                </p>
                <button
                  onClick={() => setAppIdFeedback(null)}
                  className="mt-2 text-[10px] text-slate-500 hover:text-slate-300 underline font-bold"
                >
                  {lang === "ar" ? "تقديم طلب آخر" : "Submit another application"}
                </button>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "الاسم رباعي باللغة العربية:" : "Full Name (Arabic):"}</label>
                  <input
                    type="text"
                    required
                    placeholder="يوسف عاطف عواد"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "الرقم القومي (14 رقم):" : "National ID (14 digits):"}</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="30101234567891"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-left font-mono text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "مجموع الثانوية العامة (%):" : "High School GPA (%):"}</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    required
                    value={highSchoolScore}
                    onChange={(e) => setHighSchoolScore(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center font-mono text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "الكلية المفضلة (الرغبة الأولى):" : "Target College Wish:"}</label>
                  <select
                    value={targetCollege}
                    onChange={(e) => setTargetCollege(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="fcis">{lang === "ar" ? "كلية الحاسبات والذكاء الاصطناعي" : "Computers & AI"}</option>
                    <option value="engineering">{lang === "ar" ? "كلية الهندسة والتشييد" : "Engineering"}</option>
                    <option value="business">{lang === "ar" ? "كلية العلوم الإدارية والمالية" : "Business Admin"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "البرنامج الأكاديمي المفضل:" : "Target Academic Program:"}</label>
                  <select
                    value={targetProgram}
                    onChange={(e) => setTargetProgram(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {targetCollege === "fcis" ? (
                      <>
                        <option value="AI & Data Science">AI & Data Science</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </>
                    ) : targetCollege === "engineering" ? (
                      <>
                        <option value="Civil & Infrastructure">Civil & Infrastructure Engineering</option>
                        <option value="Mechatronics">Mechatronics</option>
                        <option value="Renewable Energy">Renewable Energy</option>
                      </>
                    ) : (
                      <>
                        <option value="Digital Marketing">Digital Marketing & Fintech</option>
                        <option value="Accounting & Audit">Accounting & Auditing</option>
                        <option value="Business Logistics">Business Logistics</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Document upload fields */}
              <div className="border border-slate-850 p-4 rounded-xl bg-slate-900/40 space-y-3">
                <span className="text-[10.5px] text-slate-400 font-bold block">{lang === "ar" ? "📁 المستندات والملفات الثبوتية المطلوبة:" : "📁 Required Certificates & Document Uploads:"}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* File 1 */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 text-center flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-[10px] text-slate-300 font-bold">{lang === "ar" ? "شهادة الثانوية العامة" : "Highschool Certificate"}</span>
                    <span className="text-[8.5px] text-emerald-400 font-mono">✓ {certFile}</span>
                  </div>
                  {/* File 2 */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 text-center flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-[10px] text-slate-300 font-bold">{lang === "ar" ? "صورة بطاقة الرقم القومي" : "National ID Card Copy"}</span>
                    <span className="text-[8.5px] text-emerald-400 font-mono">✓ {idCardFile}</span>
                  </div>
                  {/* File 3 */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 text-center flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-[10px] text-slate-300 font-bold">{lang === "ar" ? "صورة شخصية بخلفية بيضاء" : "Personal Portrait Photo"}</span>
                    <span className="text-[8.5px] text-emerald-400 font-mono">✓ {photoFile}</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Signing consent */}
              <div className="flex gap-2.5 items-start bg-slate-900/60 p-3.5 border border-slate-850 rounded-lg text-right">
                <input
                  type="checkbox"
                  id="consent"
                  checked={signedConsent}
                  onChange={(e) => setSignedConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 bg-slate-950 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                />
                <label htmlFor="consent" className="text-[10.5px] text-slate-400 font-semibold leading-relaxed cursor-pointer select-none">
                  {lang === "ar" 
                    ? "أقر بصحة البيانات المكتوبة وأعطي الصلاحية لقسم القبول بمطابقة أوراقي الثبوتية واستخدام التوقيع الإلكتروني RSA لتصديق طلب الالتحاق." 
                    : "I assert that all submitted information is authentic, and consent to utilizing digital RSA encryption to secure my college admission application."}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black py-2.5 rounded-lg transition text-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>{lang === "ar" ? "جاري معالجة طلبك وتوقيعه رقمياً..." : "Signing & uploading your files..."}</span>
                  </>
                ) : (
                  <span>{lang === "ar" ? "تقديم طلب الالتحاق إلكترونياً ⚡" : "Submit Certified Admission Application ⚡"}</span>
                )}
              </button>
            </form>
          </div>

          {/* Status Lookup Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl text-right space-y-3">
              <span className="text-[10px] text-slate-500 font-bold font-mono block uppercase">Status Tracker</span>
              <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "🔍 تتبع حالة القبول فورياً" : "🔍 Track Admission Status"}</h4>
              <p className="text-[11px] text-slate-400">
                {lang === "ar" ? "أدخل رقم طلب الالتحاق لمشاهدة الموقف الفعلي من مراجعة شؤون الطلاب:" : "Enter your ADM code below to retrieve live status feedback:"}
              </p>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="SGU-ADM-1234"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-center text-xs font-mono text-slate-200 outline-none"
                  />
                </div>

                <div className="border border-slate-850 p-3 rounded-lg bg-slate-900/40 text-center space-y-2">
                  {selectedApplication ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] border-b border-slate-850 pb-1.5 font-bold">
                        <span className="text-slate-500">{lang === "ar" ? "المتقدم:" : "Applicant:"}</span>
                        <span className="text-slate-200 truncate max-w-40">{selectedApplication.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] border-b border-slate-850 pb-1.5 font-bold font-mono">
                        <span className="text-slate-500">{lang === "ar" ? "كود الطلب:" : "Code:"}</span>
                        <span className="text-slate-200">{selectedApplication.id}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] border-b border-slate-850 pb-1.5 font-bold">
                        <span className="text-slate-500">{lang === "ar" ? "الحالة:" : "Status:"}</span>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] ${
                          selectedApplication.status === "accepted"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : selectedApplication.status === "rejected"
                            ? "bg-rose-500/10 text-rose-455 font-bold"
                            : "bg-amber-500/10 text-amber-500 animate-pulse"
                        }`}>
                          {selectedApplication.status === "accepted" ? (lang === "ar" ? "قبول معتمد" : "Accepted")
                            : selectedApplication.status === "rejected" ? (lang === "ar" ? "مرفوض" : "Rejected")
                            : (lang === "ar" ? "قيد المراجعة والتدقيق" : "Under Review")}
                        </span>
                      </div>

                      {selectedApplication.status === "accepted" && (
                        <div className="bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded text-xs text-emerald-400 space-y-1">
                          <strong className="block text-center text-[10px] uppercase font-mono tracking-wider">{lang === "ar" ? "🟢 تَمْ القبول الجامعي!" : "🟢 REGISTRATION ACTIVE!"}</strong>
                          <p className="text-[9.5px] leading-relaxed text-slate-350">
                            {lang === "ar" 
                              ? "تم إصدار الرقم الجامعي، يرجى مراجعة قسم الشؤون لتسليم أصول الأوراق والتوجه لدفع القسط الأول." 
                              : "Student ID issued. Please head to campus to submit original files and finalize installment plans."}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500">{lang === "ar" ? "لا توجد نتائج مطابقة لبحثك" : "No record retrieved yet."}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REGISTRAR REVIEW & DATABASE SYSTEM */}
      {activeTab === "review" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applications list selection */}
          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-850 p-4 rounded-2xl space-y-4">
            <div className="border-b border-slate-900 pb-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">Incoming Queue</span>
              <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "📋 طابور طلبات التقديم المتاحة" : "📋 Applications Inbox Queue"}</h4>
            </div>

            {/* Quick search and filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute top-3 right-3" />
                <input
                  type="text"
                  placeholder={lang === "ar" ? "البحث بالاسم أو القومي..." : "Search by candidate..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 py-2 pr-9 pl-3 text-xs text-right text-slate-200 outline-none rounded-lg"
                />
              </div>

              <div className="flex gap-1 bg-slate-900 p-1 rounded border border-slate-850">
                {[
                  { id: "all", label: lang === "ar" ? "الكل" : "All" },
                  { id: "pending", label: lang === "ar" ? "مراجعة" : "Pending" },
                  { id: "accepted", label: lang === "ar" ? "مقبول" : "Accepted" },
                  { id: "rejected", label: lang === "ar" ? "مرفوض" : "Rejected" }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id as any)}
                    className={`flex-1 py-1 text-[9.5px] font-bold rounded ${
                      statusFilter === f.id
                        ? "bg-slate-850 text-emerald-400"
                        : "text-slate-450 hover:text-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredApps.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-600">
                  {lang === "ar" ? "لا توجد طلبات معالجة" : "No incoming applications."}
                </div>
              ) : (
                filteredApps.map(app => {
                  const isSelected = app.id === selectedApplication?.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`p-3 rounded-xl border transition text-right cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 border-emerald-500/40 shadow-md"
                          : "bg-slate-950 hover:bg-slate-900 border-slate-850"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                          app.status === "accepted"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : app.status === "rejected"
                            ? "bg-rose-500/10 text-rose-455 font-bold"
                            : "bg-amber-500/10 text-amber-500 animate-pulse"
                        }`}>
                          {app.status === "accepted" ? (lang === "ar" ? "مقبول" : "Accepted")
                            : app.status === "rejected" ? (lang === "ar" ? "مرفوض" : "Rejected")
                            : (lang === "ar" ? "قيد التدقيق" : "Under Review")}
                        </span>
                        <strong className="text-xs text-slate-200 font-black font-mono">{app.id}</strong>
                      </div>
                      <div className="font-bold text-slate-300 text-[11px] truncate">{app.fullName}</div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-semibold font-mono">
                        <span>{app.highSchoolPercentage}%</span>
                        <span>{app.nationalId.substring(0, 7)}...</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Application Details & Registry Sync Log */}
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-6">
            {selectedApplication ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <div>
                    <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-400 px-2.5 py-0.5 rounded font-mono font-bold">
                      {selectedApplication.id}
                    </span>
                    <h4 className="text-sm font-black text-slate-100 mt-1">{selectedApplication.fullName}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {lang === "ar" ? `رغبة الكلية: ${selectedApplication.wishes[0]}` : `Wish: ${selectedApplication.wishes[0]}`}
                  </span>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="space-y-2 bg-slate-900/40 p-3 border border-slate-850 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold block">{lang === "ar" ? "📋 البيانات الأساسية والتحقق:" : "📋 Demographics & ID Checks:"}</span>
                    <div className="space-y-1.5 font-bold">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === "ar" ? "الرقم القومي:" : "National ID:"}</span>
                        <span className="text-slate-200 font-mono">{selectedApplication.nationalId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === "ar" ? "درجة الثانوية العامة:" : "Highschool score:"}</span>
                        <span className="text-emerald-400 font-mono">{selectedApplication.highSchoolPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === "ar" ? "دفع الرسوم المصلحية:" : "Application Fee Paid:"}</span>
                        <span className="text-emerald-400 font-mono">🟢 Paid (500 EGP)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 bg-slate-900/40 p-3 border border-slate-850 rounded-xl text-left">
                    <span className="text-[10px] text-slate-500 font-bold block text-right">{lang === "ar" ? "🔒 التوقيع الإلكتروني RSA والتحقق:" : "🔒 Crypto RSA Digital Seals:"}</span>
                    <div className="space-y-1 text-slate-350 text-[9.5px] leading-relaxed font-mono">
                      <div><strong className="text-slate-500 font-sans">Sig ID:</strong> {selectedApplication.electronicSignatureId || "N/A"}</div>
                      <div><strong className="text-slate-500 font-sans">Date:</strong> {selectedApplication.electronicSignatureDate || "N/A"}</div>
                      <div className="truncate"><strong className="text-slate-500 font-sans">RSA-Value:</strong> {selectedApplication.signatureValue || "N/A"}</div>
                      <div className="text-emerald-400 font-sans font-bold flex items-center gap-1 mt-1 justify-end">
                        <span>{lang === "ar" ? "✓ التوقيع مشفر وسليم بنسبة 100%" : "✓ Cryptographically Verified & Secured"}</span>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decision Making & Sync with Academic Module */}
                {selectedApplication.status === "pending" && (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
                    <div className="border-b border-slate-850 pb-2">
                      <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">Decision Panel</span>
                      <h5 className="text-xs font-black text-slate-200 mt-0.5">{lang === "ar" ? "🛠️ معالجة وقبول ملف المتقدم في الـ ERP" : "🛠️ Process & Register Applicant in academic core"}</h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                      <div className="space-y-1.5">
                        <label className="text-slate-450 block">{lang === "ar" ? "الكلية المعتمدة:" : "Target College Allocation:"}</label>
                        <select
                          value={targetCollege}
                          onChange={(e) => setTargetCollege(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-right text-slate-200 outline-none"
                        >
                          <option value="fcis">{lang === "ar" ? "كلية الحاسبات والذكاء الاصطناعي" : "Computers & AI"}</option>
                          <option value="engineering">{lang === "ar" ? "كلية الهندسة والتشييد" : "Engineering"}</option>
                          <option value="business">{lang === "ar" ? "كلية العلوم الإدارية والمالية" : "Business Admin"}</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-450 block">{lang === "ar" ? "المرشد الأكاديمي المقترح:" : "Suggested Academic Advisor:"}</label>
                        <select
                          value={assignedAdvisor}
                          onChange={(e) => setAssignedAdvisor(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-right text-slate-200 outline-none"
                        >
                          <option value="د. محمد أحمد عيسى (AI Group)">د. محمد أحمد عيسى (AI Group)</option>
                          <option value="أ.د. حاتم ممدوح (Engineering Head)">أ.د. حاتم ممدوح (Engineering Head)</option>
                          <option value="د. رانيا سعيد (Business Dept)">د. رانيا سعيد (Business Dept)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleProcessApplication("rejected")}
                        className="cursor-pointer bg-slate-950 hover:bg-rose-950/20 text-rose-455 border border-rose-900/40 font-black px-4 py-2.5 rounded-lg transition"
                      >
                        {lang === "ar" ? "❌ رفض الطلب" : "❌ Reject Application"}
                      </button>

                      <button
                        onClick={() => handleProcessApplication("accepted")}
                        disabled={isSyncing}
                        className="cursor-pointer flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        {isSyncing ? (
                          <>
                            <Clock className="w-4.5 h-4.5 animate-spin" />
                            <span>{lang === "ar" ? "جاري ربط السجلات وتوليد الهوية..." : "Linking databases..."}</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4.5 h-4.5" />
                            <span>{lang === "ar" ? "✓ قبول الطلب وتأسيس ملف الطالب الأكاديمي تلقائياً" : "✓ Accept & Initialize Student File"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Sgu Live Database Sync Logs */}
                {syncLogs.length > 0 && (
                  <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold font-mono block uppercase">Real-Time Academic Sync Logs</span>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 max-h-40 overflow-y-auto font-mono text-[9.5px] text-emerald-400 space-y-1.5 leading-normal">
                      {syncLogs.map((log, idx) => (
                        <div key={idx} className="border-b border-slate-900/60 pb-1 flex items-center gap-1 flex-row-reverse">
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApplication.status === "accepted" && (
                  <div className="bg-emerald-950/10 border border-emerald-500/20 p-4 rounded-xl text-center space-y-1">
                    <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                    <h5 className="text-xs font-black text-slate-200">{lang === "ar" ? "تم قبول هذا الطالب وتسجيله بنجاح" : "Student is Successfully Accepted & Registered"}</h5>
                    <p className="text-[10.5px] text-slate-400">
                      {lang === "ar" 
                        ? `سجل الطالب نشط حالياً بقسم شؤون الطلاب بـ SGU.` 
                        : `The academic student profile is completely integrated inside the SIS database.`}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-16 text-center text-slate-500 text-xs">
                {lang === "ar" ? "الرجاء تحديد طلب التحاق من القائمة للمراجعة والتحقق." : "Please select an admission application from the queue to review."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ADMISSION CONTROL PANEL DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-right">
              <span className="text-[10px] text-slate-500 font-bold font-mono block uppercase">{lang === "ar" ? "إجمالي طلبات الالتحاق" : "Total Applications"}</span>
              <strong className="text-2xl font-black text-slate-100 font-mono block mt-1">{metrics.total}</strong>
              <span className="text-[9px] text-slate-450 block mt-0.5">{lang === "ar" ? "جميع المستويات" : "All ranges"}</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-right">
              <span className="text-[10px] text-slate-500 font-bold block">{lang === "ar" ? "الطلاب المقبولين مع تفعيل الـ ID" : "Accepted Students"}</span>
              <strong className="text-2xl font-black text-emerald-400 font-mono block mt-1">{metrics.accepted}</strong>
              <span className="text-[9px] text-emerald-500/70 block mt-0.5">{lang === "ar" ? "تأسست لهم سجلات أكاديمية" : "Provisioned with university IDs"}</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-right">
              <span className="text-[10px] text-slate-500 font-bold block">{lang === "ar" ? "الطلبات قيد المراجعة" : "Pending Reviews"}</span>
              <strong className="text-2xl font-black text-amber-500 font-mono block mt-1">{metrics.pending}</strong>
              <span className="text-[9px] text-amber-500/80 block mt-0.5">{lang === "ar" ? "في طابور الفحص والتدقيق" : "Waiting for registrar audit"}</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-right">
              <span className="text-[10px] text-slate-500 font-bold block">{lang === "ar" ? "معدل القبول العام %" : "Acceptance Rate"}</span>
              <strong className="text-2xl font-black text-sky-400 font-mono block mt-1">
                {metrics.total > 0 ? ((metrics.accepted / metrics.total) * 100).toFixed(1) : "0.0"}%
              </strong>
              <span className="text-[9px] text-sky-500/70 block mt-0.5">{lang === "ar" ? "من إجمالي المتقدمين" : "Of total candidates queue"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* College Allocation chart */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-850 p-5 rounded-2xl text-right space-y-4">
              <h5 className="text-xs font-black text-slate-200 border-b border-slate-900 pb-2">{lang === "ar" ? "📊 توزيع الطلاب المقبولين على الكليات" : "📊 College Distribution of Accepted Applicants"}</h5>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.distChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {metrics.distChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0b1329", borderColor: "#333", color: "#fff", direction: "rtl" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with values */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                {metrics.distChartData.map((d, i) => (
                  <div key={i} className="space-y-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: d.color }}></span>
                    <p className="text-slate-400 truncate">{d.name}</p>
                    <strong className="text-slate-200 block font-mono">{d.value} {lang === "ar" ? "طالب" : "students"}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Score range distribution */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-850 p-5 rounded-2xl text-right space-y-4">
              <h5 className="text-xs font-black text-slate-200 border-b border-slate-900 pb-2">{lang === "ar" ? "📈 فئات درجات الثانوية العامة للمتقدمين" : "📈 Highschool Grade Distribution curves"}</h5>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.scoreRanges}>
                    <XAxis dataKey="range" stroke="#888" fontSize={10} />
                    <YAxis stroke="#888" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0b1329", borderColor: "#333", color: "#fff" }} />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name={lang === "ar" ? "عدد الطلاب" : "Count"}>
                      {metrics.scoreRanges.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#10b981" opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold text-center mt-1">
                {lang === "ar" ? "تمثيل إحصائي لفئات مجموع الثانوية العامة للطلاب الجدد المقيدين بالـ ERP." : "Dynamic statistical view of incoming freshman highschool percentage brackets."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Local toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 bg-slate-950 text-slate-200 text-xs border-r-4 border-r-emerald-500 border border-slate-850 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 z-50">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
