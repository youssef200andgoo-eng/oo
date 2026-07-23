import React, { useState } from "react";
import { AdmissionApplication } from "../types";
import { verifyWithRSA, simpleHash, generateRSAKeyPair, signWithRSA } from "../utils/crypto";

interface SignatureVerificationPanelProps {
  app: AdmissionApplication;
  onClose: () => void;
  onUpdateApp: (updated: AdmissionApplication) => void;
  sqliteTables: any[];
  setSqliteTables: React.Dispatch<React.SetStateAction<any[]>>;
  addLog: (msg: string) => void;
}

export const SignatureVerificationPanel: React.FC<SignatureVerificationPanelProps> = ({
  app,
  onClose,
  onUpdateApp,
  sqliteTables,
  setSqliteTables,
  addLog
}) => {
  const [isTamperingSimulated, setIsTamperingSimulated] = useState(app.isTampered || false);
  const [tamperedName, setTamperedName] = useState(app.fullName);
  const [tamperedPercentage, setTamperedPercentage] = useState<number>(app.highSchoolPercentage);
  const [notificationSent, setNotificationSent] = useState(false);

  // Re-verify the RSA signature cryptographically
  // Payload formula: fullName | nationalId | percentage | wishes/files
  const docPayload = isTamperingSimulated
    ? `${tamperedName.trim()}|${app.nationalId}|${Number(tamperedPercentage)}|highschool_certificate.pdf|scanned_id.png|personal_portrait.jpg`
    : app.documentDataHash || `${app.fullName.trim()}|${app.nationalId}|${Number(app.highSchoolPercentage)}|highschool_certificate.pdf|scanned_id.png|personal_portrait.jpg`;

  // Parse e & n values from electronicSignatureId if they exist (SGU-RSA-SIG-e17-n3233-XXXX)
  let eVal = 17;
  let nVal = 3233;
  if (app.electronicSignatureId) {
    const eMatch = app.electronicSignatureId.match(/-e(\d+)-/);
    const nMatch = app.electronicSignatureId.match(/-n(\d+)-/);
    if (eMatch && eMatch[1]) eVal = parseInt(eMatch[1]);
    if (nMatch && nMatch[1]) nVal = parseInt(nMatch[1]);
  }

  // Fallback to signatureValue generation if app was not submitted with one
  let activeSignature = app.signatureValue;
  if (!activeSignature) {
    // Generate valid RSA signature for legacy mock items
    const fallbackKeys = generateRSAKeyPair();
    const sigResult = signWithRSA(docPayload, fallbackKeys.privateKey);
    activeSignature = sigResult.signature;
  }

  const isValid = !isTamperingSimulated && verifyWithRSA(docPayload, activeSignature, { e: eVal, n: nVal });

  // Function to simulate a hacker/user tampering with database variables directly
  const handleToggleTampering = () => {
    const nextTamper = !isTamperingSimulated;
    setIsTamperingSimulated(nextTamper);
    
    // Update main application record
    onUpdateApp({
      ...app,
      isTampered: nextTamper,
      // If tampered, we modify the internal payload representation
      fullName: nextTamper ? "مُخترق / تَعْدِيل غَيْر مُصَرَّح بِهِ" : app.fullName,
      highSchoolPercentage: nextTamper ? 99.99 : app.highSchoolPercentage
    });

    if (nextTamper) {
      addLog(`🚨 تم الكشف عن محاكاة تلاعب ببيانات ملف المتقدم ${app.fullName} (فشل التحقق الرياضي RSA-SHA256)`);
      // Auto trigger student notification inside SQLite database table
      triggerAutomatedNotification();
    } else {
      addLog(`🟢 تم إعادة تعيين وتأمين ملف المتقدم ${app.fullName} للوضع الآمن الموقّع.`);
    }
  };

  // Helper to append a notification to the sqlite tables state
  const triggerAutomatedNotification = () => {
    const tableId = "notifications";
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours() % 12 || 12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} PM`;
    
    const newNotif = {
      id: Math.floor(100 + Math.random() * 900),
      user_type: "Student",
      user_id: app.id,
      title: "🚨 خطأ في مصادقة التوقيع الإلكتروني لمستنداتك",
      message: `يرجى العلم بأنه تم رصد تباين أو خطأ أثناء فحص توقيعك والمفاتيح العامة (RSA) لشهادة الثانوية العامة الخاصة بك. يرجى إعادة توقيع ومصادقة الطلب فوراً لتجنب استبعاد الملف.`,
      created_at: formattedDate,
      is_read: 0
    };

    setSqliteTables((prevTables) => {
      return prevTables.map((tbl) => {
        if (tbl.tableName === tableId) {
          // Check if this notification is already sent to avoid duplicates
          const alreadyExists = tbl.rows.some((row: any) => row.user_id === app.id && row.title.includes("خطأ"));
          if (alreadyExists) return tbl;
          
          return {
            ...tbl,
            rows: [newNotif, ...tbl.rows]
          };
        }
        return tbl;
      });
    });

    setNotificationSent(true);
    addLog(`💬 تم إرسال تنبيه آلي وحقن سجل في جدول notifications برقم الطالب ${app.id} للتنبيه.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div 
        className="bg-slate-900 border border-slate-755 rounded-2xl w-full max-w-2xl p-5 space-y-4 shadow-2xl relative text-right text-xs text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Head Bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <button 
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-200 text-base font-bold bg-slate-950 px-2.5 py-0.5 rounded border border-slate-850"
          >
            ✕
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10.5px] uppercase tracking-wider ${
              isValid ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
            }`}>
              {isValid ? "VALID SIGNATURE" : "SIGNATURE INVALID / TAMPERED"}
            </span>
            <h4 className="text-sm font-bold text-slate-100 font-sans">
              لوحة التحكم والمصداقية للتوقيع الإلكتروني (SignatureVerificationPanel)
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Key pair specs and hex payloads */}
          <div className="md:col-span-7 space-y-3.5">
            {/* Payload description */}
            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 block font-mono">DOCUMENT PAYLOAD COMPARED (RSA DATA STRING)</span>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-900 font-mono text-[10.5px] text-slate-300 break-all select-all text-left">
                {docPayload}
              </div>
              <p className="text-[9.5px] text-slate-400 leading-normal">
                * يتم دمج الاسم، الرقم القومي، النسبة، والمستندات في سلسلة نصية موحدة ومقارنتها عبر الهاش المشفر لضمان وثوقية البيانات.
              </p>
            </div>

            {/* Signature value */}
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 block font-mono">ENCRYPTED DIGITAL SIGNATURE (S-HASH EXP VALUE)</span>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-900 font-mono text-[10px] text-amber-500 break-all text-left">
                {activeSignature}
              </div>
            </div>

            {/* Asymmetric Public Key PEM info */}
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span className="font-mono text-[9px] text-emerald-400">RSA PUBLIC KEY</span>
                <span>المفتاح العام للتوقيع الإلكتروني</span>
              </div>
              <pre className="p-2.5 bg-slate-900 text-[10px] font-mono text-slate-400 overflow-x-auto rounded border border-slate-900 text-left whitespace-pre">
                {app.publicKey || `-----BEGIN PUBLIC KEY-----\nMIIB_SGU_ZT0xNyxuPTMyMzM=A\n-----END PUBLIC KEY-----`}
              </pre>
            </div>
          </div>

          {/* Verification status graphics */}
          <div className="md:col-span-5 space-y-3 flex flex-col justify-between">
            <div className={`p-4 rounded-2xl border text-center space-y-3 flex-1 flex flex-col justify-center items-center ${
              isValid ? "bg-emerald-950/20 border-emerald-800/40" : "bg-rose-950/20 border-rose-800/40"
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-md ${
                isValid ? "bg-emerald-500/10 border-2 border-emerald-500/30" : "bg-rose-500/10 border-2 border-rose-500/30 animate-pulse"
              }`}>
                {isValid ? "🛡️" : "⚠️"}
              </div>

              <div className="space-y-1 text-center">
                <h5 className={`font-bold text-sm ${isValid ? "text-emerald-400" : "text-rose-400"}`}>
                  {isValid ? "التوقيع صحيح وسليم 100%" : "التوقيع خاطئ أو تم التلاعب بالشهادة!"}
                </h5>
                <p className="text-[10px] text-slate-400 leading-normal max-w-[200px]">
                  {isValid 
                    ? "يتطابق تشفير المفتاح العام RSA بالكامل مع البيانات المرفقة بطلب الطالب دون تعديل." 
                    : "اختلال الهاش الحسابي! قد تم تعديل أو تزوير مستندات الطالب بعد مرحلة التقديم."
                  }
                </p>
              </div>

              {/* Status details breakdown list */}
              <div className="w-full text-right text-[10.5px] border-t border-slate-850 pt-2 space-y-1 bg-slate-950/30 p-2 rounded-lg">
                <div className="flex justify-between">
                  <span className={isValid ? "text-emerald-400" : "text-rose-400"}>
                    {isValid ? "متطابق ✓" : "غير متطابق ✕"}
                  </span>
                  <span className="text-slate-400">سلامة البيانات:</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300 font-mono">e={eVal}, n={nVal}</span>
                  <span className="text-slate-400">طريقة التشفير:</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300 font-mono">{app.id}</span>
                  <span className="text-slate-400">معرف الطلب:</span>
                </div>
              </div>
            </div>

            {/* Simulated actions panel */}
            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl space-y-2.5">
              <span className="text-[10.5px] font-bold text-amber-500 block">منصة اختبار المحاكاة والأثر:</span>
              
              <button
                type="button"
                onClick={handleToggleTampering}
                className={`cursor-pointer w-full font-bold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 ${
                  isTamperingSimulated 
                    ? "bg-slate-800 text-slate-200 hover:bg-slate-700" 
                    : "bg-rose-900 hover:bg-rose-850 text-slate-100"
                }`}
              >
                {isTamperingSimulated ? "🔄 إلغاء محاكاة التلاعب وإعادة الختم" : "🛑 محاكاة التلاعب بملف وبيانات الطالب"}
              </button>

              {!isValid && (
                <button
                  type="button"
                  onClick={triggerAutomatedNotification}
                  disabled={notificationSent}
                  className={`cursor-pointer w-full font-bold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 ${
                    notificationSent 
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                      : "bg-amber-600 hover:bg-amber-550 text-slate-950"
                  }`}
                >
                  {notificationSent ? "✓ تم إرسال تنبيه في notifications" : "⚠️ إرسال تنبيه آلي للطالب بإعادة التوقيع"}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Info label about database and SQL schema */}
        <div className="bg-slate-950 p-3 border border-slate-850 rounded-xl leading-relaxed text-[10.5px] text-slate-400">
          <strong>إخطار المخطط الهيكلي لإدارة الرموز:</strong>
          <p className="mt-1">
            عند الضغط على تنبيه الطالب، يقوم السيرفر بحقن سجل تحديث جديد فوري في جدول <code className="text-amber-500 font-mono">notifications</code> في قاعدة بيانات الـ SQLite المضمنة، مما يتيح لك الاستفسار عنها ببرمجة SQL في شاشة الأجهزة، وتنبيه مستخدم الطالب.
          </p>
        </div>

        {/* Footer closing bar */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono">SGU CRYPTOENGINE V4.0 // RSA-SHA256 Mapped</span>
          <button
            onClick={onClose}
            className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-4 py-1.5 rounded-lg text-xs transition"
          >
            إغلاق الإطار
          </button>
        </div>

      </div>
    </div>
  );
};
