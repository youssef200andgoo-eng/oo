import React, { useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Cpu,
  Bookmark,
  ShieldCheck,
  Building,
  UserCheck,
  Send,
  Download,
  CreditCard,
  QrCode,
  Globe
} from "lucide-react";
import { AdmissionApplication } from "../types";
import { generateRSAKeyPair, signWithRSA } from "../utils/crypto";

interface SguApplicantPortalProps {
  applications: AdmissionApplication[];
  setApplications: React.Dispatch<React.SetStateAction<AdmissionApplication[]>>;
  lang: "ar" | "en";
  triggerSystemPush: (title: string, message: string) => void;
  addLog: (msg: string) => void;
}

export default function SguApplicantPortal({
  applications,
  setApplications,
  lang,
  triggerSystemPush,
  addLog
}: SguApplicantPortalProps) {
  const [activeMode, setActiveMode] = useState<"new" | "status">("new");
  
  // New application form states
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [highSchoolPercentage, setHighSchoolPercentage] = useState<number>(85);
  const [selectedWishes, setSelectedWishes] = useState<string[]>(["كلية الحاسبات والمعلومات", "كلية الهندسة", "كلية إدارة الأعمال"]);
  
  // Document upload simulation states
  const [certFile, setCertFile] = useState<string>("");
  const [idCardFile, setIdCardFile] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<string>("");
  
  // Crypto signature states
  const [signatureConsent, setSignatureConsent] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [keyPair, setKeyPair] = useState<{ publicKey: { e: string; n: string; pem: string }; privateKey: string } | null>(null);
  const [signatureValue, setSignatureValue] = useState("");
  const [sigId, setSigId] = useState("");
  const [documentHash, setDocumentHash] = useState("");
  
  // Billing states
  const [paidFee, setPaidFee] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Fawry");
  const [isPaying, setIsPaying] = useState(false);
  
  // Status lookup state
  const [lookupQuery, setLookupQuery] = useState("");
  const [foundApp, setFoundApp] = useState<AdmissionApplication | null>(null);
  const [lookupError, setLookupError] = useState("");
  
  // Success state
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Generate cryptographic signature
  const handleSignDocument = () => {
    if (!fullName.trim() || !nationalId.trim()) return;
    const keys = generateRSAKeyPair();
    const docPayload = `${fullName.trim()}|${nationalId.trim()}|${highSchoolPercentage}|certificate.pdf|national_id.png|photo.jpg`;
    const sigResult = signWithRSA(docPayload, keys.privateKey);
    const signatureId = `SGU-RSA-SIG-e${keys.publicKey.e}-n${keys.publicKey.n}-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`;
    
    setKeyPair(keys);
    setDocumentHash(docPayload);
    setSignatureValue(sigResult.signature);
    setSigId(signatureId);
    setSignatureName(fullName);
    
    addLog(`🔏 [توقيع المتقدم] تم توليد زوج مفاتيح التوقيع الرقمي RSA 2048 للتوقيع الإلكتروني للمستندات.`);
  };

  const handlePayFee = () => {
    setIsPaying(true);
    setTimeout(() => {
      setPaidFee(true);
      setIsPaying(false);
      addLog(`💳 [بوابة الدفع] تم معالجة رسوم فحص طلب الالتحاق بقيمة 500 ج.م بآلية ${paymentMethod}.`);
      triggerSystemPush(
        lang === "ar" ? "💳 تم دفع رسوم التقديم" : "💳 Admission Fee Paid",
        lang === "ar" 
          ? `تم استلام مبلغ 500 ج.م رسوم تقديم المتقدم ${fullName} وإلحاقه بنظام الحصيلة الموحد.` 
          : `We received 500 EGP admission fee for candidate ${fullName}.`
      );
    }, 1200);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nationalId.trim() || !paidFee || !signatureConsent || !signatureValue) {
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours() % 12 || 12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;

    const newApp: AdmissionApplication = {
      id: `adm${Math.floor(100 + Math.random() * 900)}`,
      fullName,
      nationalId,
      highSchoolPercentage: Number(highSchoolPercentage),
      wishes: selectedWishes,
      certificateFile: certFile || "highschool_certificate.pdf",
      idCardFile: idCardFile || "scanned_id.png",
      photoFile: photoFile || "personal_portrait.jpg",
      paidFee: true,
      status: "pending",
      electronicSignatureId: sigId,
      electronicSignatureDate: formattedDate,
      signatureConsent: true,
      publicKey: keyPair?.publicKey.pem,
      signatureValue: signatureValue,
      documentDataHash: documentHash
    };

    setApplications(prev => [newApp, ...prev]);
    setSubmissionSuccess(newApp.id);
    addLog(`✓ [طلب التحاق] تم إرسال طلب التقديم الموثق رقم ${newApp.id} للمتقدم [${fullName}] لقسم شؤون القبول بنجاح.`);
    
    triggerSystemPush(
      lang === "ar" ? "🆕 طلب التحاق جديد بالجامعة" : "🆕 New Admission Application",
      lang === "ar"
        ? `قام المتقدم [${fullName}] برفع طلب التحاق ومطابقة ثانوية عامة بنسبة ${highSchoolPercentage}%.`
        : `Candidate [${fullName}] submitted a signed application with high school GPA: ${highSchoolPercentage}%.`
    );

    // Reset fields
    setFullName("");
    setNationalId("");
    setHighSchoolPercentage(85);
    setCertFile("");
    setIdCardFile("");
    setPhotoFile("");
    setSignatureConsent(false);
    setSignatureValue("");
    setPaidFee(false);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    setFoundApp(null);

    const query = lookupQuery.trim();
    if (!query) return;

    const match = applications.find(
      app => app.id.toLowerCase() === query.toLowerCase() || app.nationalId === query
    );

    if (match) {
      setFoundApp(match);
      addLog(`🔍 [استعلام المتقدم] تم العثور على طلب القبول ذو المعرّف #${match.id}.`);
    } else {
      setLookupError(lang === "ar" ? "لم يتم العثور على أي طلب التحاق مطابق للبيانات المدخلة." : "No application matches the entered ID/National ID.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950/20 border border-slate-800 p-6 rounded-2xl text-right">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => setActiveMode("new")}
              className={`px-4 py-2 rounded-lg text-xs font-black transition cursor-pointer ${
                activeMode === "new" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lang === "ar" ? "تقديم طلب جديد" : "Apply Now"}
            </button>
            <button
              onClick={() => {
                setActiveMode("status");
                setSubmissionSuccess(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition cursor-pointer ${
                activeMode === "status" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lang === "ar" ? "متابعة حالة الطلب" : "Track Status"}
            </button>
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2 justify-end">
              <span>بوابة القبول والتسجيل للمستجدين</span>
              <FileText className="w-5 h-5 text-emerald-450 text-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-400">
              {lang === "ar" 
                ? "مرحباً بك في المنصة الموحدة لتقديم طلبات الالتحاق بجامعة الصالحية الجديدة SGU لطلاب شهادات الثانوية العامة والمعادلة." 
                : "Welcome to Al-Salihiyah New University admission portal for high school graduates."}
            </p>
          </div>
        </div>
      </div>

      {/* Lookup Mode */}
      {activeMode === "status" && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-right space-y-6">
          <h3 className="text-xs font-black text-slate-200 border-b border-slate-850 pb-2">
            {lang === "ar" ? "الاستعلام عن طلب الالتحاق وحالة القبول" : "Admission Request Tracking"}
          </h3>
          
          <form onSubmit={handleLookup} className="flex gap-3 max-w-xl mr-auto">
            <button
              type="submit"
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg transition"
            >
              {lang === "ar" ? "بحث واستعلام" : "Search"}
            </button>
            <input
              type="text"
              required
              placeholder={lang === "ar" ? "أدخل رقم الطلب (مثل: adm392) أو الرقم القومي..." : "Enter App ID or National ID..."}
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-100"
            />
          </form>

          {lookupError && (
            <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg text-xs text-rose-400">
              {lookupError}
            </div>
          )}

          {foundApp && (
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4 max-w-2xl mr-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
              
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className={`px-3 py-1 rounded text-xs font-bold ${
                  foundApp.status === "accepted" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40" :
                  foundApp.status === "rejected" ? "bg-rose-950 text-rose-400 border border-rose-900/40" :
                  foundApp.status === "modify_required" ? "bg-amber-950 text-amber-400 border border-amber-900/40" :
                  "bg-sky-950 text-sky-400 border border-sky-900/40 animate-pulse"
                }`}>
                  {foundApp.status === "accepted" ? (lang === "ar" ? "مقبول نهائياً بقرار اللجنة" : "Accepted") :
                   foundApp.status === "rejected" ? (lang === "ar" ? "طلب مرفوض" : "Rejected") :
                   foundApp.status === "modify_required" ? (lang === "ar" ? "طلب تعديل وتوضيح المستندات" : "Correction Required") :
                   (lang === "ar" ? "قيد الدراسة والمراجعة الأكاديمية" : "Pending Evaluation")}
                </span>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-slate-100">{foundApp.fullName}</h4>
                  <span className="text-[10.5px] text-slate-500 font-mono">App ID: #{foundApp.id} | National ID: {foundApp.nationalId}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-900 py-4 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">{lang === "ar" ? "معدل الثانوية العامة:" : "GPA percentage:"}</span>
                  <strong className="text-emerald-400 text-sm font-mono">{foundApp.highSchoolPercentage}%</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{lang === "ar" ? "الرغبة المقبولة / المقررة:" : "Assigned College:"}</span>
                  <strong className="text-slate-100 font-bold">{foundApp.wishes[0]}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{lang === "ar" ? "تاريخ التقديم والتوقيع:" : "Submission Date & Signature:"}</span>
                  <span className="text-slate-300 font-mono">{foundApp.electronicSignatureDate || "2026-06-21"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{lang === "ar" ? "معرف الختم التشفيري RSA:" : "RSA Cryptographic Seal ID:"}</span>
                  <span className="text-amber-500 font-mono text-[10px] truncate block max-w-[200px]" dir="ltr">{foundApp.electronicSignatureId || "None"}</span>
                </div>
              </div>

              {foundApp.adminFeedback && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3.5 rounded-xl text-xs space-y-1">
                  <strong>⚠️ توجيه موظف شؤون القبول والتسجيل:</strong>
                  <p className="leading-relaxed">{foundApp.adminFeedback}</p>
                </div>
              )}

              {foundApp.status === "accepted" && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-4 rounded-xl text-xs leading-relaxed space-y-2">
                  <h5 className="font-extrabold text-sm text-emerald-400">🎉 تهانينا القلبية بالقبول في جامعة SGU!</h5>
                  <p>
                    لقد وافق مجلس الكلية الموقر على قبول أوراقك الأكاديمية بنجاح. يرجى التوجه لفرع الجامعة المركزي لاستلام الكود الأكاديمي ودفع المصروفات وتأكيد حجز السكن الجامعي قبل بدء الفصل الدراسي الأول.
                  </p>
                  <button
                    onClick={() => alert("جاري تحميل خطاب القبول المعتمد رسمياً بصيغة PDF ومطابقته رقمياً...")}
                    className="cursor-pointer px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-950" />
                    تحميل وثيقة القبول الرسمية (PDF)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* New Form Mode */}
      {activeMode === "new" && (
        <>
          {submissionSuccess ? (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-base font-extrabold text-slate-100">تم إرسال وتوثيق طلب الالتحاق بنجاح!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                لقد تم حفظ وتوقيع طلبك رقمياً بالكامل في سجل خوادم الـ ERP للجامعة. يرجى حفظ معرّف الطلب أدناه لمتابعة النتيجة وقرار شؤون القبول:
              </p>
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl max-w-xs mx-auto">
                <span className="text-[10px] text-slate-500 block">كود الطلب للاستعلام:</span>
                <strong className="text-emerald-400 font-mono text-lg font-black">#{submissionSuccess}</strong>
              </div>
              <p className="text-[10.5px] text-slate-500">
                * تم إشعار موظف القبول بالجامعة بطلبك لمطابقة النسبة المئوية ومفتاح الـ RSA للتأكيد.
              </p>
              <button
                onClick={() => {
                  setSubmissionSuccess(null);
                  setActiveMode("status");
                  setLookupQuery(submissionSuccess);
                }}
                className="cursor-pointer bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-850 px-6 py-2 rounded-lg text-xs font-bold transition"
              >
                تتبع حالة هذا الطلب الآن 🔍
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Details & Documents */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-6 text-right">
                
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-200 border-b border-slate-850 pb-2 flex items-center gap-2 justify-end">
                    <span>1. البيانات الشخصية والمؤهل الدراسي</span>
                    <span className="text-emerald-500 font-bold">#</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">الاسم الثلاثي للطالب (بالعربية):</label>
                      <input
                        type="text"
                        required
                        placeholder="محمد عادل الألفي"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">الرقم القومي (14 رقم):</label>
                      <input
                        type="text"
                        required
                        maxLength={14}
                        placeholder="30510120194832"
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-left font-mono focus:outline-none focus:border-emerald-500 text-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">نسبة نجاح الثانوية العامة أو المعادلة (%):</label>
                      <input
                        type="number"
                        min={50}
                        max={100}
                        required
                        placeholder="85"
                        value={highSchoolPercentage}
                        onChange={(e) => setHighSchoolPercentage(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-left font-mono focus:outline-none focus:border-emerald-500 text-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">الرغبة الأكاديمية الأولى (الكلية):</label>
                      <select
                        value={selectedWishes[0]}
                        onChange={(e) => setSelectedWishes([e.target.value, "كلية الهندسة", "كلية التجارة"])}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-100"
                      >
                        <option value="كلية الحاسبات والمعلومات">كلية الحاسبات والمعلومات والذكاء الاصطناعي</option>
                        <option value="كلية الطب البشري">كلية الطب البشري</option>
                        <option value="كلية الهندسة">كلية الهندسة والعلوم التطبيقية</option>
                        <option value="كلية الصيدلة">كلية الصيدلة الإكلينيكية</option>
                        <option value="كلية طب الأسنان">كلية طب وجراحة الأسنان</option>
                        <option value="كلية العلاج الطبيعي">كلية العلاج الطبيعي</option>
                        <option value="كلية التمريض">كلية التمريض المعتمدة</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Documents Upload */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-200 border-b border-slate-850 pb-2 flex items-center gap-2 justify-end">
                    <span>2. مستندات طلب القبول الموثقة (scanned pdf/jpg)</span>
                    <span className="text-emerald-500 font-bold">#</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Doc 1 */}
                    <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl text-center space-y-2 relative">
                      <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                      <span className="text-xs text-slate-300 block font-bold">شهادة الثانوية العامة</span>
                      <input
                        type="file"
                        onChange={(e) => setCertFile(e.target.files?.[0]?.name || "certificate.pdf")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-[10px] text-emerald-400 block truncate">
                        {certFile || (lang === "ar" ? "اضغط لرفع الملف" : "Tap to upload")}
                      </span>
                    </div>

                    {/* Doc 2 */}
                    <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl text-center space-y-2 relative">
                      <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                      <span className="text-xs text-slate-300 block font-bold">بطاقة الهوية الوطنية</span>
                      <input
                        type="file"
                        onChange={(e) => setIdCardFile(e.target.files?.[0]?.name || "national_id.png")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-[10px] text-emerald-400 block truncate">
                        {idCardFile || (lang === "ar" ? "اضغط لرفع الملف" : "Tap to upload")}
                      </span>
                    </div>

                    {/* Doc 3 */}
                    <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl text-center space-y-2 relative">
                      <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                      <span className="text-xs text-slate-300 block font-bold">الصورة الشخصية الرسمية</span>
                      <input
                        type="file"
                        onChange={(e) => setPhotoFile(e.target.files?.[0]?.name || "photo.jpg")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-[10px] text-emerald-400 block truncate">
                        {photoFile || (lang === "ar" ? "اضغط لرفع الملف" : "Tap to upload")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Electronic Signing */}
                <div className="border border-slate-800 bg-slate-950/40 p-4 rounded-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <span className="font-bold text-amber-500 text-xs flex items-center gap-1.5 leading-none">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      نظام التوقيع الرقمي والختم الأمني (Asymmetric RSA Keys)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">SGU SECURED SIGNING</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="space-y-1 text-right">
                        <label className="text-xs font-bold text-slate-400 block">الاسم لإصدار التوقيع والشهادة القانونية:</label>
                        <input
                          type="text"
                          required
                          placeholder="اكتب اسمك الثلاثي بدقة للتطابق الرقمي"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-right focus:outline-none focus:border-amber-500 text-slate-100 font-serif italic"
                        />
                      </div>

                      <div className="flex items-start gap-2 text-right">
                        <input
                          type="checkbox"
                          id="consentCheck"
                          checked={signatureConsent}
                          onChange={(e) => setSignatureConsent(e.target.checked)}
                          className="mt-1 cursor-pointer accent-emerald-500"
                        />
                        <label htmlFor="consentCheck" className="text-[11px] text-slate-400 leading-relaxed select-none cursor-pointer">
                          أقر بمسؤوليتي الكاملة عن صحة كافة البيانات والمستندات المرفقة، وأوافق على إبرام التوقيع الإلكتروني وتوليد المفتاحين الخاص والعام لختم ملف تقديمي تشفيرياً.
                        </label>
                      </div>

                      {signatureConsent && !signatureValue && (
                        <button
                          type="button"
                          onClick={handleSignDocument}
                          className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition"
                        >
                          توليد المفاتيح والتوقيع الرقمي 🔑
                        </button>
                      )}
                    </div>

                    {/* Signature Preview Panel */}
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col justify-between min-h-[140px] border-dashed border-emerald-500/40 relative">
                      <div className="text-[9.5px] text-slate-500 border-b border-slate-900 pb-1 flex justify-between font-mono">
                        <span>SGU RSA CA AUTHORITY</span>
                        {signatureValue ? (
                          <span className="text-emerald-400 font-bold">STATUS: SIGNED</span>
                        ) : (
                          <span className="text-rose-400">STATUS: UNSIGNED</span>
                        )}
                      </div>

                      <div className="py-2.5 text-center">
                        {signatureValue ? (
                          <div className="space-y-1">
                            <p className="font-serif text-base text-emerald-400 italic font-black">
                              {signatureName}
                            </p>
                            <span className="text-[9px] text-slate-500 font-mono block leading-none">
                              SIGNATURE: {sigId}
                            </span>
                            <span className="text-[8.5px] text-slate-600 font-mono block max-w-full truncate leading-none mt-1">
                              RSA-PUB: {keyPair?.publicKey.pem}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 italic">فضلاً وافق على بند الإقرار بالأعلى لتوقيع طلبك رقمياً</p>
                        )}
                      </div>

                      <div className="text-[9px] text-slate-500 flex justify-between pt-1 border-t border-slate-900">
                        <span>بصمة SHA-256</span>
                        <span>تأمين الأمان: مفعّل</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Payments & Submitting */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-6 text-right h-fit">
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-200 border-b border-slate-850 pb-2">
                    {lang === "ar" ? "3. رسوم دراسة وتقديم الطلب" : "3. Admission Application Fee"}
                  </h3>
                  
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-100 font-mono text-base">500 ج.م</strong>
                      <span className="text-slate-400 text-xs">{lang === "ar" ? "قيمة رسوم الملف الموحد:" : "Fee Amount:"}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      * المصاريف الإدارية لفحص ومطابقة ملف الثانوية العامة تشفيرياً وربط القنوات. الرسوم تدفع لمرة واحدة وغير قابلة للاسترداد.
                    </p>

                    {!paidFee ? (
                      <div className="space-y-3 border-t border-slate-900 pt-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">وسيلة الدفع الإلكتروني الموثقة:</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Fawry">فوري بقنوات السداد الموحدة (Fawry Pay)</option>
                            <option value="Vodafone Wallet">محفظة فودافون كاش (Vodafone Cash)</option>
                            <option value="Visa">بطاقة ميزة أو فيزا (Visa/Mastercard)</option>
                          </select>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handlePayFee}
                          disabled={isPaying || !fullName.trim()}
                          className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2.5 rounded-lg text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5"
                        >
                          {isPaying ? "جاري معالجة الدفع المالي..." : `دفع 500 ج.م بآلية ${paymentMethod} 💳`}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs text-center font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>✓ تم السداد بنجاح وإصدار إيصال الدفع</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <button
                    type="submit"
                    disabled={!paidFee || !signatureValue || !signatureConsent}
                    className={`w-full font-black py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                      paidFee && signatureValue
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/10"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>تسجيل الطلب والتوقيع بالبصمة 💾</span>
                  </button>
                  <p className="text-[9.5px] text-slate-500 text-center mt-2">
                    * يجب سداد الرسوم وإصدار التوقيع الإلكتروني RSA لتمكين زر إرسال الطلب.
                  </p>
                </div>

              </div>

            </form>
          )}
        </>
      )}
    </div>
  );
}
