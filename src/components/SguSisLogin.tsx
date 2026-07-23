import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Lock,
  User,
  RefreshCw,
  Globe,
  Building,
  PhoneCall,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Database,
  Cpu,
  Bookmark,
  ShieldCheck,
  Eye,
  EyeOff,
  Server,
  FileText,
  Users,
  Search,
  Key,
  HelpCircle,
  Activity,
  Layers
} from "lucide-react";
import { motion } from "motion/react";
import { 
  SGU_CENTRAL_USERS, 
  SGU_ROLES_REGISTRY, 
  INITIAL_COLLEGES, 
  validateUserAccess, 
  addAuditLog,
  UniversityUser 
} from "../utils/identityManager";

interface SguSisLoginProps {
  onLoginSuccess: (
    role: "student" | "faculty" | "employee" | "admin" | "registrar" | "executive" | "database" | "pro_systems" | "applicant" | "parent",
    studentId?: string,
    employeeRole?: "registrar" | "student_affairs" | "finance_officer"
  ) => void;
  dbUsers?: Array<any>;
  lang?: "ar" | "en";
  setLang?: (lang: "ar" | "en") => void;
}

export default function SguSisLogin({ onLoginSuccess, dbUsers, lang: propLang, setLang: propSetLang }: SguSisLoginProps) {
  const [localLang, setLocalLang] = useState<"ar" | "en">("ar");
  const lang = propLang || localLang;
  const setLang = propSetLang || setLocalLang;
  
  // Single Unified Identity ID and Secure Password
  const [studentIdInput, setStudentIdInput] = useState("SGU-ST-10045");
  const [password, setPassword] = useState("youssef24");
  const [showPassword, setShowPassword] = useState(false);
  
  // Security verification equation
  const [numA, setNumA] = useState(() => Math.floor(3 + Math.random() * 6));
  const [numB, setNumB] = useState(() => Math.floor(2 + Math.random() * 7));
  const [captchaInput, setCaptchaInput] = useState("");
  
  // Feedback & State
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelperModal, setShowHelperModal] = useState(false);

  // Multi-Factor Authentication (MFA) & Google reCAPTCHA v3 States
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaOtpInput, setMfaOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [recaptchaScore, setRecaptchaScore] = useState<number | null>(null);
  const [isRecaptchaLoading, setIsRecaptchaLoading] = useState(false);
  
  // The resolved active user after credential verification
  const [resolvedUser, setResolvedUser] = useState<UniversityUser | null>(null);

  // Re-generate Captcha
  const resetCaptcha = () => {
    setNumA(Math.floor(3 + Math.random() * 6));
    setNumB(Math.floor(2 + Math.random() * 7));
    setCaptchaInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate captcha
    const expected = numA + numB;
    if (parseInt(captchaInput) !== expected) {
      setErrorMsg(
        lang === "ar"
          ? "⚠️ رمز التحقق الهجين غير صحيح. يرجى حساب ناتج الجمع بدقة."
          : "⚠️ Incorrect security code. Please calculate the arithmetic sum precisely."
      );
      resetCaptcha();
      return;
    }

    setIsSubmitting(true);
    setIsRecaptchaLoading(true);

    // Simulate central Identity verification with database lookup
    setTimeout(() => {
      setIsRecaptchaLoading(false);
      setRecaptchaScore(0.98); // High trust human score

      const normalizedInput = studentIdInput.trim().toUpperCase();
      
      // Query central SGU identity registry
      let matchUser = SGU_CENTRAL_USERS.find(
        (u) => u.id.toUpperCase() === normalizedInput || u.email.toUpperCase() === normalizedInput
      );

      if (!matchUser && dbUsers) {
        const dbUser = dbUsers.find(
          (u) => u.id.toUpperCase() === normalizedInput || u.email.toUpperCase() === normalizedInput
        );
        if (dbUser) {
          matchUser = {
            id: dbUser.id,
            universityId: dbUser.id,
            nameAr: dbUser.nameAr,
            nameEn: dbUser.nameEn || dbUser.nameAr,
            email: dbUser.email,
            roleId: dbUser.role as any,
            collegeId: dbUser.collegeId,
            departmentAr: "الشعبة العامة / إدارة",
            departmentEn: "General / Admin Dept",
            programAr: "برنامج أكاديمي معتمد",
            programEn: "Accredited Degree Program",
            academicLevelAr: dbUser.role === "student" ? "المستوى الأول" : "كادر الجامعة العامل",
            academicLevelEn: dbUser.role === "student" ? "Year 1 - Semester 1" : "SGU Active Staff",
            status: dbUser.status || "active",
            gpaOrSalary: dbUser.gpaOrSalary,
            nationalId: dbUser.nationalId,
            phone: dbUser.phone,
            campusBranchAr: dbUser.campusBranch || "الفرع الرئيسي",
            campusBranchEn: "Main Campus",
            avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
          };
        }
      }

      if (!matchUser) {
        setErrorMsg(
          lang === "ar"
            ? "❌ لم يتم العثور على الكود الأكاديمي أو الرقم التعريفي المدخل في قواعد بيانات جامعة الصالحية الموحدة."
            : "❌ Academic ID or University email not found in Al-Salihiyah databases."
        );
        addAuditLog(
          studentIdInput,
          "غير معروف (Unknown)",
          "فشل تسجيل الدخول",
          "Login Failed",
          `محاولة تسجيل دخول فاشلة للمعرف غير المسجل: ${studentIdInput}`,
          `Failed login attempt for unregistered ID: ${studentIdInput}`,
          "error"
        );
        setIsSubmitting(false);
        resetCaptcha();
        return;
      }

      // Check Password validation
      const simpleExpectedPassword = matchUser.id.replace("SGU-", "").toLowerCase() + "24";
      // Allow fallback if they use standard demo password
      const isCorrectPassword = password === simpleExpectedPassword || password === "youssef24" || password === "admin24" || password === "super24" || password === "dean24" || password === "prof24" || password === "ta24" || password === "adv24" || password === "hod24" || password === "emp24" || password === "fin24" || password === "lib24" || password === "••••••••";

      if (!isCorrectPassword) {
        setErrorMsg(
          lang === "ar"
            ? "❌ كلمة المرور غير صحيحة. يرجى إدخال كلمة المرور المعتمدة المرتبطة ببطاقة هويتك."
            : "❌ Incorrect secure password. Please enter the valid password paired with your identity card."
        );
        addAuditLog(
          matchUser.id,
          matchUser.nameAr,
          "فشل تسجيل الدخول (كلمة مرور خاطئة)",
          "Login Failed (Incorrect Password)",
          `محاولة دخول غير مصرحة للمعرف ${matchUser.id} بكلمة مرور خاطئة.`,
          `Unauthorized access attempt for ID ${matchUser.id} with incorrect credentials.`,
          "warning",
          matchUser.collegeId
        );
        setIsSubmitting(false);
        resetCaptcha();
        return;
      }

      // Gatekeeping & Authorization checks before MFA (Middlewares simulation)
      const accessStatus = validateUserAccess(matchUser);
      if (!accessStatus.allowed) {
        setErrorMsg(lang === "ar" ? accessStatus.reasonAr : accessStatus.reasonEn);
        addAuditLog(
          matchUser.id,
          matchUser.nameAr,
          "حظر الدخول بسبب حالة الحساب",
          "Login Blocked (Account Status)",
          `تم حظر الدخول بسبب حالة الحساب: ${matchUser.status}`,
          `Blocked login attempt due to account status: ${matchUser.status}`,
          "blocked",
          matchUser.collegeId
        );
        setIsSubmitting(false);
        resetCaptcha();
        return;
      }

      // Credentials valid - Proceed to MFA Step 2
      setResolvedUser(matchUser);
      const secureCode = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(secureCode);
      setMfaStep(true);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanedInput = mfaOtpInput.trim();
      
      if (cleanedInput === generatedOtp || cleanedInput === "123456" || cleanedInput === "482931") {
        if (resolvedUser) {
          // Add Audit Log
          addAuditLog(
            resolvedUser.id,
            resolvedUser.nameAr,
            "تسجيل دخول ناجح للجامعة الموحدة",
            "Successful Unified University Login",
            `تم التحقق من هوية (${resolvedUser.nameAr}) بصفة ${SGU_ROLES_REGISTRY[resolvedUser.roleId].nameAr}. الكلية المعزولة: ${resolvedUser.collegeId.toUpperCase()}`,
            `Verified identity of (${resolvedUser.nameEn}) as ${SGU_ROLES_REGISTRY[resolvedUser.roleId].nameEn}. Isolated College: ${resolvedUser.collegeId.toUpperCase()}`,
            "success",
            resolvedUser.collegeId
          );

          // Map the legacy parameters for compatibility
          let legacyRole: any = resolvedUser.roleId;
          let legacyEmpRole: any = "registrar";

          if (resolvedUser.roleId === "finance_staff") {
            legacyRole = "employee";
            legacyEmpRole = "finance_officer";
          } else if (resolvedUser.roleId === "library_staff") {
            legacyRole = "employee";
            legacyEmpRole = "student_affairs";
          } else if (resolvedUser.roleId === "employee") {
            legacyRole = "employee";
            legacyEmpRole = "registrar";
          } else if (resolvedUser.roleId === "admin" || resolvedUser.roleId === "super_admin") {
            legacyRole = "admin";
          } else if (resolvedUser.roleId === "ta" || resolvedUser.roleId === "advisor" || resolvedUser.roleId === "dept_head" || resolvedUser.roleId === "dean") {
            legacyRole = "faculty";
          }

          // Trigger Success Callback
          onLoginSuccess(legacyRole, resolvedUser.id, legacyEmpRole);
        }
      } else {
        setErrorMsg(
          lang === "ar"
            ? "⚠️ الرمز المدخل غير مطابق لرمز الهاتف أو البريد المولد. يرجى مراجعة الرمز بدقة."
            : "⚠️ The verification code is incorrect. Please verify and try again."
        );
      }
    }, 800);
  };

  // Helper to pre-fill test users from helper directory
  const preFillUser = (u: UniversityUser) => {
    setStudentIdInput(u.id);
    // Simple password formula: [Id without SGU- in lowercase] + 24
    const simplePassword = u.id.replace("SGU-", "").toLowerCase() + "24";
    setPassword(simplePassword);
    setCaptchaInput(String(numA + numB));
    setErrorMsg("");
    setMfaStep(false);
  };

  return (
    <div className="min-h-screen bg-radial from-slate-900 via-slate-950 to-emerald-950 text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Abstract Design Elements (Gradients & Grid Lines) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c2212_1px,transparent_1px),linear-gradient(to_bottom,#022c2212_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Language / Server Stats */}
      <div className="w-full bg-slate-950/80 border-b border-slate-800/60 px-6 py-2.5 flex justify-between items-center z-10 text-xs backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SECURE IDENTITY ROUTING: ACTIVE (TLS 1.3)
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:inline text-slate-400 font-medium">
            {lang === "ar"
              ? "بوابة الخدمات الإلكترونية الموحدة لجامعة الصالحية"
              : "Unified e-Services Portal of Al-Salihiyah New University"}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHelperModal(true)}
            className="cursor-pointer text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded hover:bg-emerald-500/20 font-bold transition flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === "ar" ? "🔑 دليل الهويات الأكاديمية" : "🔑 Academic Identities Directory"}</span>
          </button>
          
          <span className="text-slate-700">|</span>
          
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="cursor-pointer flex items-center gap-1.5 font-bold hover:text-emerald-400 transition text-[11.5px]"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
      </div>

      {/* Main Core Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 z-10">
        
        {/* Title block */}
        <div className="text-center mb-6 max-w-lg">
          <div className="w-20 h-20 rounded-2xl bg-white p-2.5 mx-auto mb-4 border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 transition-transform hover:scale-105 flex items-center justify-center">
            <img
              src="https://graph.facebook.com/SGU.EG/picture?width=400&height=400"
              alt="SGU Emblem"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://sgu.edu.eg/wp-content/uploads/2021/03/SGU-Logo-png.png";
              }}
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-100 to-amber-300">
            {lang === "ar" ? "جامعة الصالحية الجديدة" : "Al-Salihiyah New University"}
          </h2>
          <p className="text-[11.5px] text-slate-400 tracking-wide font-mono uppercase mt-1">
            {lang === "ar"
              ? "منصة الدخول الذكية الموحدة | Smart Identity-Based Access Portal"
              : "Unified Smart Identity-Based Access Portal"}
          </p>
          <div className="flex justify-center mt-2.5">
            <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] py-1 px-3.5 rounded-full font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "تم إزالة الاختيار اليدوي للكلية: توجيه أمني تلقائي بالكامل" : "No manual selection: Full dynamic routing gate active"}</span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden text-right"
          id="sgu_login_card"
        >
          {/* Top aesthetic lock indicator */}
          <div className="absolute top-0 right-0 left-0 h-[3.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />
          
          <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-5">
            <span className="text-[10.5px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 px-2.5 py-0.5 rounded font-mono font-bold">
              SYS_ACTIVE_2026
            </span>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              {lang === "ar" ? "بوابة النفاذ الأمني الموحد" : "Unified Access Gate"}
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
            </h3>
          </div>

          {mfaStep ? (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              {/* Clean, high-impact secure shield banner */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-right space-y-2 relative overflow-hidden">
                <div className="absolute left-3 top-3 opacity-10">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 animate-pulse" />
                </div>
                <span className="text-[9.5px] uppercase bg-emerald-500/10 text-emerald-300 font-extrabold px-2.5 py-1 rounded border border-emerald-500/20 inline-block">
                  {lang === "ar" ? "الخطوة الثانية: التحقق الثنائي المتعدد MFA" : "MFA Step 2: Multi-Factor Authentication"}
                </span>
                <h4 className="text-xs font-black text-slate-100 mt-1">
                  {lang === "ar" ? "رمز المرور المؤقت لمرة واحدة" : "One-Time Security OTP Code"}
                </h4>
                <p className="text-[11px] text-slate-350 leading-relaxed font-semibold">
                  {lang === "ar" 
                    ? `مرحباً يا ${resolvedUser?.nameAr || "المستخدم"}. تفعيلاً لإجراءات الأمان الموحدة، يرجى إدخال رمز الأمان الثنائي المؤلف من 6 أرقام المرسل إليك على بريدك الإلكتروني الجامعي:`
                    : `Hello, ${resolvedUser?.nameAr || "user"}. For secure data isolation compliance, please insert the temporary 6-digit verification code sent to your university mail:`}
                </p>
                <div className="font-mono text-[9px] bg-emerald-500/5 text-emerald-400 py-1 px-2 rounded border border-emerald-500/10 inline-block font-extrabold text-left" dir="ltr">
                  {resolvedUser?.email ? resolvedUser.email.replace(/(..)(.*)(@.*)/, "$1***$3") : "yo****@sgu.edu.eg"}
                </div>
              </div>

              {/* The OTP input */}
              <div className="space-y-2 text-right">
                <label className="block text-xs font-bold text-slate-300">
                  {lang === "ar" ? "رمز النفاذ الثنائي (OTP):" : "One-Time Password (OTP):"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-500 absolute pr-0.5 right-3 top-3.5" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="e.g., 482931"
                    value={mfaOtpInput}
                    onChange={(e) => setMfaOtpInput(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-800/80 p-3 pl-3 pr-10 rounded-xl text-center text-sm font-mono tracking-[0.5em] text-emerald-450 focus:outline-none focus:border-emerald-500 font-black transition-colors"
                  />
                </div>
                
                {/* Simulation Helper Note */}
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-start gap-1.5 text-right">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[9.5px] text-amber-300 font-bold leading-snug">
                      {lang === "ar" ? "⚡ الرمز المولد الآن للمصادقة المزدوجة:" : "⚡ Temporary secure code generated for demo is:"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMfaOtpInput(generatedOtp);
                      }}
                      className="cursor-pointer bg-amber-500/20 text-yellow-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold text-xs hover:bg-amber-500/30 transition inline-block text-left"
                      dir="ltr"
                    >
                      {generatedOtp} ({lang === "ar" ? "اضغط للتعبئة التلقائية ⚡" : "Tap to fill ⚡"})
                    </button>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-950/40 border border-rose-900/55 p-3 rounded-xl flex items-start gap-2.5 text-right text-[11px] text-rose-300">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons row */}
              <div className="flex gap-2 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setMfaStep(false);
                    setMfaOtpInput("");
                    setErrorMsg("");
                  }}
                  className="cursor-pointer bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-100 hover:bg-slate-900 px-4 py-3 rounded-xl transition"
                >
                  {lang === "ar" ? "رجوع" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 py-3 rounded-xl text-xs font-black transition shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === "ar" ? "جاري المصادقة..." : "Checking Code..."}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0" />
                      <span>{lang === "ar" ? "تأكيد واستكمال الدخول" : "Verify & Complete Log In"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Academic ID Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400">
                  {lang === "ar" ? "الرقم الجامعي أو الكود التعريفي (University ID):" : "University Academic ID or Email:"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-500 absolute pr-0.5 right-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., SGU-ST-10045"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-3 pl-3 pr-10 rounded-xl text-xs text-left font-mono text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <p className="text-[9.5px] text-slate-500 leading-normal">
                  {lang === "ar"
                    ? "أدخل الرقم الأكاديمي المطبوع على بطاقة هويتك الجامعية."
                    : "Enter the code or academic email attached to your university ID."}
                </p>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="cursor-pointer text-[9.5px] text-slate-550 hover:text-emerald-400 hover:underline">
                    {lang === "ar" ? "نسيت الرقم السري؟" : "Forgot Password?"}
                  </span>
                  <label className="block text-xs font-bold text-slate-400">
                    {lang === "ar" ? "كلمة المرور المشفرة:" : "Secure Password:"}
                  </label>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3.5 text-slate-500 hover:text-slate-350"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <Lock className="w-4 h-4 text-emerald-500 absolute pr-0.5 right-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 pr-10 rounded-xl text-xs text-left font-mono text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Hybrid Captcha Mathematics Verification */}
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-2.5">
                <div className="flex justify-between items-center text-[10px]">
                  <button
                    type="button"
                    onClick={resetCaptcha}
                    className="cursor-pointer text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-500 shrink-0" />
                    {lang === "ar" ? "تحديث السؤال" : "Refresh Security Question"}
                  </button>
                  <span className="font-bold text-slate-450">
                    {lang === "ar" ? "التحقق الرياضي لمنع الروبوتات:" : "Arithmetic Human Verification:"}
                  </span>
                </div>
                
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder={lang === "ar" ? "أدخل الناتج" : "Enter result"}
                    className="flex-1 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center text-xs font-bold text-slate-100 outline-none focus:border-emerald-500"
                  />
                  
                  <div className="font-mono font-bold text-sm bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-emerald-400 select-none flex items-center gap-1.5 shrink-0" dir="ltr">
                    <span>{numA}</span>
                    <span>+</span>
                    <span>{numB}</span>
                    <span>=</span>
                    <span className="text-yellow-500 animate-pulse font-extrabold">?</span>
                  </div>
                </div>
              </div>

              {/* Google reCAPTCHA v3 simulated status line */}
              <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5 bg-slate-950/45 py-2 rounded-lg border border-slate-850/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  {lang === "ar" 
                    ? "محمي بواسطة Google reCAPTCHA v3 (درجة التحقق الأمني: 0.98)" 
                    : "Secured by Google reCAPTCHA v3 (Security Trust: 0.98)"}
                </span>
              </div>

              {errorMsg && (
                <div className="bg-rose-950/40 border border-rose-900/55 p-3 rounded-xl flex items-start gap-2.5 text-right text-[11px] text-rose-300">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-3 rounded-xl text-xs font-black transition-transform active:scale-98 shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === "ar" ? "فحص وتحليل هويتك وتوليد الـ MFA..." : "Resolving University Identity..."}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === "ar"
                        ? "دخول موحد للنظام المركزي الموحد"
                        : "Unified Secure Entry"}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Helper info toggle */}
          <div className="border-t border-slate-850/80 mt-5 pt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                const sampleStudent = SGU_CENTRAL_USERS[0]; // Youssef
                preFillUser(sampleStudent);
              }}
              className="cursor-pointer text-[10.5px] text-slate-550 hover:text-amber-400 hover:underline"
            >
              {lang === "ar" ? "⚡ ملء بيانات الطالب يوسف" : "⚡ Fill Student Youssef"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowHelperModal(true);
              }}
              className="cursor-pointer text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "استكشاف الحسابات (11 دور)" : "Explore Accounts (11 Roles)"}</span>
            </button>
          </div>
        </motion.div>
        
        {/* Sandbox Quick Account Shortcuts Drawer/Accordion directly in page for ultimate visibility */}
        <div className="w-full max-w-md bg-slate-950/60 border border-slate-850 p-4 rounded-2xl mt-4 space-y-3 z-10 text-right">
          <div className="flex justify-between items-center">
            <span className="text-[9.5px] uppercase bg-amber-500/10 text-amber-400 font-extrabold px-2 py-0.5 rounded border border-amber-500/20">
              DEMO CLUSTERS
            </span>
            <h4 className="text-xs font-black text-slate-300 flex items-center gap-1.5">
              <span>قائمة الإدخال السريع لهويات التجربة</span>
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            </h4>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            {lang === "ar" 
              ? "لتسهيل التحقق والتقييم، انقر على أي فئة بالأسفل لتعبئة الحقول ببياناتها فورياً ورؤية التوجيه التلقائي وعزل الكلية:"
              : "Click any profile below to immediately fill the credentials and test dynamic identity-routing:"}
          </p>
          
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-1 text-[9.5px]">
            {SGU_CENTRAL_USERS.slice(0, 11).map((usr) => {
              const roleTitle = SGU_ROLES_REGISTRY[usr.roleId]?.nameAr || usr.roleId;
              const isCol = usr.collegeId !== "all" ? usr.collegeId.toUpperCase() : "مركزية";
              return (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => preFillUser(usr)}
                  className="bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-850 p-1.5 rounded text-right transition flex flex-col justify-between"
                >
                  <span className="font-bold text-slate-200 truncate block w-full">{usr.nameAr.split(" ")[0] + " " + (usr.nameAr.split(" ")[1] || "")}</span>
                  <div className="flex justify-between items-center text-[8.5px] mt-1 text-slate-500">
                    <span className="text-emerald-450 font-bold font-mono">{isCol}</span>
                    <span className="text-[8px] bg-slate-955 text-slate-400 px-1 py-0.2 rounded truncate">{usr.roleId.toUpperCase()}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-900 border border-slate-850/60 rounded p-2.5 space-y-1.5 text-[10px] text-slate-400 text-right">
            <span className="font-bold text-amber-400 block">🛑 تجربة حالات المنع الدبلوماسي (Middlewares):</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const m = SGU_CENTRAL_USERS.find(x => x.status === "suspended");
                  if (m) preFillUser(m);
                }}
                className="bg-slate-950 hover:bg-slate-900 px-2 py-1.5 rounded border border-rose-500/20 text-rose-300 font-bold flex-1"
              >
                🚫 حساب موقوف (Suspended)
              </button>
              <button
                type="button"
                onClick={() => {
                  const m = SGU_CENTRAL_USERS.find(x => x.status === "pending");
                  if (m) preFillUser(m);
                }}
                className="bg-slate-950 hover:bg-slate-900 px-2 py-1.5 rounded border border-amber-500/20 text-amber-300 font-bold flex-1"
              >
                ⏳ قيد الانتظار (Pending)
              </button>
            </div>
          </div>
        </div>

        {/* Portal support footer */}
        <div className="mt-6 text-center space-y-1 z-10 max-w-sm text-slate-500">
          <p className="text-[11px] font-bold flex items-center justify-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
            {lang === "ar" ? "الخط الساخن للأعطال والقبول: 19823" : "Support Hotline: 19823"}
          </p>
          <p className="text-[10px] leading-relaxed">
            {lang === "ar"
              ? "جامعة الصالحية الجديدة - جميع الحقوق محفوظة © 2026. مركز تكنولوجيا المعلومات والتوثيق الأكاديمي الموحد."
              : "Al-Salihiyah New University © 2026. All rights reserved. IT & Central Academic Documentation Unit."}
          </p>
        </div>
      </div>

      {/* IDENTITY INSPECTOR HELPER MODAL */}
      {showHelperModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur flex justify-center items-center p-4 z-50 text-right">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <button
                onClick={() => setShowHelperModal(false)}
                className="cursor-pointer text-slate-500 hover:text-slate-300 text-xs font-black bg-slate-950 px-2.5 py-1 rounded"
              >
                {lang === "ar" ? "إغلاق" : "Close"}
              </button>
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                {lang === "ar" ? "تفاصيل هويات وصلاحيات الكادر الطلابي والأكاديمي (11 دور معزول)" : "Central Identity Registry (11 Roles Details)"}
                <Server className="w-4 h-4 text-emerald-500" />
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === "ar"
                ? "تعتمد بنية SGU الأمنية على التحقق التلقائي للهوية وربطها بقاعدة بيانات الكلية المعزولة. انقر على أي شخصية لتحميل كودها فورياً:"
                : "SGU architecture performs dynamic query lookup on academic cards to isolate deans, professors, and depts. Click any card:"}
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {SGU_CENTRAL_USERS.map((usr) => {
                const isCorrectPassword = usr.id.replace("SGU-", "").toLowerCase() + "24";
                const roleObj = SGU_ROLES_REGISTRY[usr.roleId];
                return (
                  <div
                    key={usr.id}
                    onClick={() => {
                      preFillUser(usr);
                      setShowHelperModal(false);
                    }}
                    className="cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-emerald-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={usr.avatarUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-emerald-500/20" referrerPolicy="no-referrer" />
                      <div className="text-right">
                        <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded font-bold">{usr.id}</span>
                        <h4 className="text-xs font-black text-slate-100">{lang === "ar" ? usr.nameAr : usr.nameEn}</h4>
                        <p className="text-[10px] text-slate-400">{lang === "ar" ? usr.programAr : usr.programEn} | {usr.academicLevelAr}</p>
                      </div>
                    </div>

                    <div className="text-right md:text-left space-y-1 self-stretch md:self-auto flex md:flex-col justify-between items-end md:justify-center border-t md:border-t-0 border-slate-850 pt-2 md:pt-0">
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-black">
                        {roleObj?.nameAr || usr.roleId}
                      </span>
                      <div className="text-[9.5px] font-mono text-slate-500">
                        Password: <span className="text-emerald-400 font-bold">{isCorrectPassword}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10.5px]">
              <span className="text-slate-500 font-mono">COUNT: 11 DISTINCT ENTERPRISE PERSONAS</span>
              <p className="text-slate-400">
                {lang === "ar" ? "انقر لتعبئة الحساب المعين واستكمال التحقق والتوجيه." : "Click any card above to resolve identity."}
              </p>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
