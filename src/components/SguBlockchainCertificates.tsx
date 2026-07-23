import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  Cpu, 
  ExternalLink, 
  Award, 
  Download, 
  Copy, 
  CheckCircle, 
  Lock, 
  RefreshCw, 
  AlertCircle 
} from "lucide-react";
import { Course } from "../types";

interface SguBlockchainCertificatesProps {
  courses: Course[];
  student: any;
  lang: "ar" | "en";
}

interface BlockRecord {
  height: number;
  hash: string;
  previousHash: string;
  courseCode: string;
  courseName: string;
  grade: string;
  timestamp: string;
  validator: string;
}

export default function SguBlockchainCertificates({
  courses,
  student,
  lang
}: SguBlockchainCertificatesProps) {
  // Get completed courses
  const completedCourses = courses.filter(c => c.status === "completed" && c.gradeObtained);
  
  // Hash function simulation (similar to SHA-256 for academic verification)
  const generateSimulatedHash = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `0x5gu_bcd_${hex}${Math.abs(hash * 31).toString(16).substring(0, 16)}`;
  };

  // Compile overall Degree/Transcript hash
  const [degreeHash, setDegreeHash] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const coursesStr = completedCourses.map(c => `${c.code}-${c.gradeObtained}`).join("|");
    const docDataString = `${student.id}-${student.nameEnglish || "Youssef"}-${student.gpa}-${coursesStr}`;
    setDegreeHash(generateSimulatedHash(docDataString));
  }, [courses, student]);

  // Public Ledger Chain
  const [blockchain, setBlockchain] = useState<BlockRecord[]>([]);

  useEffect(() => {
    // Generate realistic block entries for each completed course
    let currentPrev = "0x0000000000000000000000000000000000000000";
    const chain: BlockRecord[] = completedCourses.map((c, idx) => {
      const blockHash = generateSimulatedHash(`${c.code}-${c.gradeObtained}-${idx}-${currentPrev}`);
      const block: BlockRecord = {
        height: 104520 + idx,
        hash: blockHash,
        previousHash: currentPrev,
        courseCode: c.code,
        courseName: c.name,
        grade: c.gradeObtained || "A",
        timestamp: `2026-06-20 1${idx}:20:15`,
        validator: "SGU Academic Ledger Node #4"
      };
      currentPrev = blockHash;
      return block;
    });
    setBlockchain(chain);
  }, [courses]);

  // Certificate Verifier Engine
  const [verifySearchQuery, setVerifySearchQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerifyCredential = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    // Check if searched matches overall Degree Hash or any Block hash
    if (verifySearchQuery.trim() === degreeHash) {
      setVerificationResult({
        status: "valid",
        type: lang === "ar" ? "شهادة تخرج مكتملة السجل الأكاديمي" : "Fully Endorsed Career Degree Certificate",
        candidateAr: student.nameArabic,
        candidateEn: student.nameEnglish || "Youssef El-Kurdy",
        gpa: student.totalGPA || student.gpa,
        signee: "أ.د محمد عبدالمجيد - عميد الكنترول بـ SGU",
        timestamp: "2026-06-21 10:00 UTC",
        details: `${completedCourses.length} courses authenticated cryptographically.`
      });
    } else {
      // Check block hashes
      const blockMatch = blockchain.find(b => b.hash === verifySearchQuery.trim());
      if (blockMatch) {
         setVerificationResult({
           status: "valid",
           type: lang === "ar" ? "وثيقة رصد مقرر تفصيلية" : "Specific Course Grade Ledger Block",
           candidateAr: student.nameArabic,
           candidateEn: student.nameEnglish || "Youssef El-Kurdy",
           gpa: blockMatch.grade,
           signee: "SGU Automatic Smart Contract Release",
           timestamp: blockMatch.timestamp,
           details: `Verified Course: [SGU-${blockMatch.courseCode}] ${blockMatch.courseName} with release grade: ${blockMatch.grade}.`
         });
      } else {
         setVerificationResult({
           status: "invalid",
           details: lang === "ar" ? "🛑 الهاش غير موجود أو تم التعديل اليدوي على البيانات خارج قيود البلوكتشين!" : "🛑 Encrypted hash is invalid, metadata mismatch, or edited manually outside the ledger bounds."
         });
      }
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(degreeHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintCertificate = () => {
    alert(lang === "ar" 
      ? `📄 جاري تصدير وتحميل شهادتك الموثقة بالهاش:\n\n${degreeHash}\n\nتم حفظ التقرير في سجلك المحلي.`
      : `📄 Exporting SGU Verified Certificate with Ledger Hash:\n\n${degreeHash}\n\nSaved successfully!`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center gap-4 text-right border-b border-slate-850 pb-4">
        <div>
          <div className="flex items-center gap-1 bg-emerald-950 border border-emerald-900/30 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-bold font-mono w-fit ml-auto mb-2">
            <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
            <span>SGU Decentralized Academic Ledger v2.1</span>
          </div>
          <h4 className="text-sm font-black text-slate-100 flex items-center gap-2 justify-end">
            <span>{lang === "ar" ? "تصدير وتدقيق الشهادات المصدقة بالبلوكتشين" : "Decentralized Blockchain Academic Credentials"}</span>
            <Cpu className="w-5 h-5 text-emerald-400" />
          </h4>
        </div>

        <p className="text-[11px] text-slate-500 max-w-sm">
          {lang === "ar" 
            ? "تقوم جامعة الصالحية بتوثيق شهادات الطلاب وعلامات الكنترول في سجل لامركزي غير قابل للتعديل للتأكد الفوري من سلامة الدرجات ومنع التزوير."
            : "Audit transcripts cryptographically. Every semester lock release has its Block height, SHA-256 hash, and digital ledger endorsement ID."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Printable/Exportable Certificate View */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950 p-6 rounded-2xl border-2 border-emerald-500/20 relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.04),transparent)] text-center space-y-4">
            
            {/* Watermark decors */}
            <div className="absolute top-2 left-2 text-[8px] text-slate-700 font-mono">
              VERIFIED LEDGER CREDENTIAL ID: {degreeHash.substring(0, 14)}...
            </div>
            <Award className="w-12 h-12 text-emerald-400 mx-auto" />

            <div className="space-y-1.5">
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest block">
                {lang === "ar" ? "جامعة الصالحية الجديدة" : "SALHEYA GREEN UNIVERSITY"}
              </span>
              <h5 className="text-base font-black text-slate-100">
                {lang === "ar" ? "شهادة تخرج موثقة رقمياً" : "DIPLOMA DEGREE CREDENTIAL"}
              </h5>
              <p className="text-[10px] text-slate-450 italic">
                {lang === "ar" ? "تفيد لجنة الكنترول وإدارة شؤون الطلاب الموحدة بـ SGU بأن:" : "This certifies that the academic records have been sealed for:"}
              </p>
            </div>

            <div className="py-2 space-y-1">
              <h6 className="text-[14px] font-black text-emerald-400 tracking-wide">
                {lang === "ar" ? student.nameArabic : "YOUSSEF EL-KURDY"}
              </h6>
              <p className="text-[10.5px] text-slate-350">
                {lang === "ar" ? `الملتحق ببرنامج: ${student.major}` : `Registered under major: ${student.major}`}
              </p>
              <div className="flex gap-4 justify-center py-2 text-xs font-bold text-slate-300 font-mono">
                <span>GPA: {student.totalGPA || student.gpa}</span>
                <span>•</span>
                <span>{lang === "ar" ? "المستوى 3" : "Level 3"}</span>
              </div>
            </div>

            {/* Cryptographic Hash segment */}
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg space-y-1 text-center font-mono">
              <span className="text-[8px] text-slate-500 block">{lang === "ar" ? "بصمة التوثيق الأكاديمي الرقمية SHA-256" : "SHA-256 LEDGER ANCHOR SIGNATURE"}</span>
              <p className="text-[9.5px] text-slate-300 break-all leading-tight">{degreeHash}</p>
            </div>

            {/* Printed signature */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-slate-900 flex-row-reverse">
              <div className="text-right">
                <span className="block font-bold text-slate-300">{lang === "ar" ? "أ.د. يوسف خالد النجار" : "Prof. Dr. Youssef Khaled"}</span>
                <span className="block text-[8.5px]">{lang === "ar" ? "رئيس مجلس أمناء الكنترول الموحد" : "Dean of Academic Controls"}</span>
              </div>

              <div className="text-left">
                <span className="font-mono bg-emerald-950/40 text-emerald-400 text-[8.5px] px-1.5 py-0.5 rounded border border-emerald-900/35">
                  ✓ VERIFIED ON LEDGER
                </span>
                <span className="block text-[8.5px] font-mono mt-0.5">Height: #104523</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCopyHash}
              className="bg-slate-950 text-slate-300 border border-slate-850 hover:bg-slate-900 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-emerald-400" />
              <span>{copied ? (lang === "ar" ? "تم النسخ!" : "Copied!") : (lang === "ar" ? "نسخ بصمة الهاش" : "Copy Hash Signature")}</span>
            </button>

            <button
              onClick={handlePrintCertificate}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-5 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{lang === "ar" ? "تصدير وتحميل للتقديم" : "Export & Save PDF"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Ledger Transactions & Verification Engine */}
        <div className="lg:col-span-7 space-y-6 text-right">
          
          {/* Certificate validator search form */}
          <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-3">
            <h6 className="text-xs font-black text-slate-200">{lang === "ar" ? "مدقق الهوية الأكاديمية والشهادات الذاتي" : "Decentralized Hash Verification Gateway"}</h6>
            <p className="text-[10px] text-slate-500 leading-normal">
              {lang === "ar" 
                ? "يمكن لأي جهة توظيف أو مستعلم خارجي وضع هاش الشهادة هنا للتحقق الفوري من صحة تخرج الطالب عبر العقد الذكي لـ SGU."
                : "Employers or credential committees can enter a ledger receipt hashes here to query the blockchain block and inspect matching GPAs."}
            </p>

            <form onSubmit={handleVerifyCredential} className="flex gap-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-lg transition shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              
              <input
                type="text"
                value={verifySearchQuery}
                onChange={e => setVerifySearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "انسخ هاش الشهادة أو هاش مادة واضغط للتحقق..." : "Paste verification hash..."}
                className="w-full bg-slate-900 border border-slate-800 text-right text-xs text-slate-200 outline-none px-3 py-2 rounded-lg focus:border-emerald-500 font-mono"
              />
            </form>

            {hasSearched && verificationResult && (
              <div className={`p-4 rounded-xl border transition text-right space-y-2 text-xs ${
                verificationResult.status === "valid" 
                  ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-200" 
                  : "bg-rose-950/20 border-rose-900/40 text-rose-200"
              }`}>
                {verificationResult.status === "valid" ? (
                  <>
                    <div className="flex gap-1.5 items-center justify-end font-bold text-emerald-400">
                      <span>{lang === "ar" ? "الوثيقة مطابقة وأصلية ✓" : "Credential Verified & Authentic"}</span>
                      <CheckCircle className="w-4 h-4 shrink-0" />
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      <li>• <strong>{lang === "ar" ? "نوع الوثيقة:" : "Type:"}</strong> {verificationResult.type}</li>
                      <li>• <strong>{lang === "ar" ? "صاحب السجل:" : "Issued to:"}</strong> {lang === "ar" ? verificationResult.candidateAr : verificationResult.candidateEn}</li>
                      <li>• <strong>{lang === "ar" ? "العلامة الموثقة:" : "Endorsed Standings:"}</strong> {verificationResult.gpa}</li>
                      <li>• <strong>{lang === "ar" ? "توقيع المصدق:" : "Seals:"}</strong> {verificationResult.signee} ({verificationResult.timestamp})</li>
                    </ul>
                    <p className="text-[10px] text-emerald-400 pt-1.5 border-t border-emerald-900/30">
                      {verificationResult.details}
                    </p>
                  </>
                ) : (
                  <div className="flex gap-2 items-center justify-end">
                    <p className="text-[11px]">{verificationResult.details}</p>
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ledger block stream */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">{lang === "ar" ? "تدفق كتل الكنترول على السلسلة" : "Live Ledger Block Feed"}</span>
            
            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              {blockchain.length === 0 ? (
                <p className="text-[11px] text-slate-500 text-center py-2">{lang === "ar" ? "لا توجد علامات مصدقة بعد بالسلسلة." : "Zero blocks registered."}</p>
              ) : (
                blockchain.map((b) => (
                  <div key={b.height} className="bg-slate-950 px-3 py-2.5 rounded-lg border border-slate-850/60 text-[10.5px] font-medium space-y-1.5 hover:border-emerald-500/20 transition">
                    <div className="flex justify-between items-center text-[9.5px]">
                      <span className="text-emerald-400 font-bold font-mono">Block #{b.height}</span>
                      <span className="text-slate-500 font-mono">{b.timestamp}</span>
                    </div>

                    <p className="text-slate-300">
                      {lang === "ar" 
                        ? `رصد وإقفال مقرر [${b.courseName} SGU-${b.courseCode}] للدرجة (${b.grade})`
                        : `Constructed Grade Settle for [SGU-${b.courseCode}] -> Letter: ${b.grade}`}
                    </p>

                    <div className="flex justify-between items-center bg-slate-900 text-[8.5px] font-mono px-2 py-1 rounded text-slate-500 flex-row-reverse">
                      <span>Hash: {b.hash.substring(0, 15)}...</span>
                      <span>Prev: {b.previousHash.substring(0, 10)}...</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
