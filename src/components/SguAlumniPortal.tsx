import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Briefcase,
  Search,
  Sparkles,
  CheckCircle,
  Clock,
  BookOpen,
  MapPin,
  Building,
  ExternalLink,
  PlusCircle,
  FileSpreadsheet
} from "lucide-react";

interface SguAlumniPortalProps {
  lang: "ar" | "en";
  triggerSystemPush: (title: string, message: string) => void;
  addLog?: (msg: string) => void;
}

interface Alumnus {
  id: string;
  nameAr: string;
  nameEn: string;
  classYear: number;
  collegeAr: string;
  collegeEn: string;
  currentCompany: string;
  currentRoleAr: string;
  currentRoleEn: string;
  location: string;
}

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-Time" | "Remote" | "Internship";
  deptAr: string;
  deptEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export default function SguAlumniPortal({
  lang,
  triggerSystemPush,
  addLog
}: SguAlumniPortalProps) {
  const [activeTab, setActiveTab] = useState<"tracker" | "jobs" | "continuous">("tracker");

  // State for Alumni database
  const [alumni, setAlumni] = useState<Alumnus[]>([
    {
      id: "SGU-AL-2021-01",
      nameAr: "م. إسلام عاصم كمال",
      nameEn: "Eng. Islam Assem",
      classYear: 2024,
      collegeAr: "كلية الحاسبات والذكاء الاصطناعي",
      collegeEn: "Computers & AI Faculty",
      currentCompany: "Vodafone Egypt (Smart Village)",
      currentRoleAr: "مهندس برمجيات أول (Senior DevOps)",
      currentRoleEn: "Senior DevOps Engineer",
      location: "القرية الذكية، الجيزة"
    },
    {
      id: "SGU-AL-2022-04",
      nameAr: "م. منى فريد الجندي",
      nameEn: "Eng. Mona Farid",
      classYear: 2023,
      collegeAr: "كلية الهندسة والتشييد",
      collegeEn: "Engineering Faculty",
      currentCompany: "Orascom Construction",
      currentRoleAr: "مهندس إنشائي بمشروع العاصمة الإدارية",
      currentRoleEn: "Structural Design Engineer",
      location: "العاصمة الإدارية الجديدة"
    },
    {
      id: "SGU-AL-2023-09",
      nameAr: "أ. هاني سليم مصلح",
      nameEn: "Mr. Hany Selim",
      classYear: 2024,
      collegeAr: "كلية العلوم الإدارية والمالية",
      collegeEn: "Business Administration",
      currentCompany: "CIB Bank Egypt",
      currentRoleAr: "محلل مخاطر مالية وتدقيق رقمي",
      currentRoleEn: "Financial Risk Analyst",
      location: "فرع الصالحية الجديدة"
    }
  ]);

  // Job Posts Board
  const [jobs, setJobs] = useState<JobPost[]>([
    {
      id: "SGU-JOB-01",
      title: "Junior Cloud Engineer (AWS / DevOps)",
      company: "Vodafone International Services",
      location: "Smart Village, Egypt",
      type: "Remote",
      deptAr: "كلية الحاسبات والذكاء الاصطناعي",
      deptEn: "Computers & AI Faculty",
      descriptionAr: "مطلوب مهندس سحابي مبتدئ ملم ببيئة AWS و Docker لمراقبة بوابات الخوادم.",
      descriptionEn: "Looking for a passionate junior cloud associate proficient in AWS, Docker, and CI/CD pipelines."
    },
    {
      id: "SGU-JOB-02",
      title: "Site Civil Engineer (Fresh Graduate)",
      company: "Arab Contractors (المقاولون العرب)",
      location: "New Salheya Branch, Egypt",
      type: "Full-Time",
      deptAr: "كلية الهندسة والتشييد",
      deptEn: "Engineering Faculty",
      descriptionAr: "مطلوب مهندس إنشائي للإشراف والمطابقة الميدانية لمباني شؤون المرافق والاتصالات الجديدة.",
      descriptionEn: "Excellent entry-level site supervision role for fresh SGU Engineering graduates. Salheya projects."
    },
    {
      id: "SGU-JOB-03",
      title: "Financial Analyst Intern",
      company: "PwC Middle East",
      location: "Cairo, Egypt",
      type: "Internship",
      deptAr: "كلية العلوم الإدارية والمالية",
      deptEn: "Business Administration",
      descriptionAr: "فرصة تدريبية متميزة بقسم التدقيق والتحول المالي الرقمي لخريجي الصالحية المتميزين.",
      descriptionEn: "Premium corporate internship in financial advisory & digital bookkeeping systems. Fast-track hiring."
    }
  ]);

  // Continuous Education Diplomas
  const continuousPrograms = [
    {
      id: "DIP-901",
      nameAr: "الدبلوم المهني التراكمي في حوسبة الذكاء الاصطناعي المتقدم",
      nameEn: "Post-Graduate Diploma in Applied Generative AI & ML",
      hours: 120,
      fees: 4500,
      status: "Registration Active"
    },
    {
      id: "DIP-902",
      nameAr: "الشهادة المهنية لإدارة مشاريع الهندسة المستدامة الـ Green LEED",
      nameEn: "LEED Green Associate Professional Project Certification",
      hours: 60,
      fees: 3000,
      status: "Registration Active"
    }
  ];

  // Applied jobs tracking
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleApplyToJob = (jobId: string, jobTitle: string) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs(prev => [...prev, jobId]);

    if (addLog) addLog(`✓ [بوابة الخريجين] تقديم طلب توظيف على فرصة [${jobTitle}] بنجاح.`);
    triggerSystemPush(
      lang === "ar" ? "💼 تم إرسال سيرتك الذاتية" : "💼 Resume Dispatched Successfully",
      lang === "ar" ? `تم إرسال ملف الخريج RSA المعتمد بنجاح لـ ${jobTitle}` : `Sent certified digital resume seal for ${jobTitle}`
    );
  };

  const filteredAlumni = useMemo(() => {
    return alumni.filter(a =>
      a.nameAr.includes(searchTerm) ||
      a.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.currentCompany.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [alumni, searchTerm]);

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/75 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-right">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <span>{lang === "ar" ? "نظام الخريجين وبوابة التوظيف (Alumni Portal)" : "SGU Alumni & Corporate Placement Suite"}</span>
              <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">Phase 15</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "ar" ? "تتبع الكفاءات والمسارات الوظيفية لخريجي الصالحية، التقديم على الوظائف الشريكة، ودبلومات التعلم المستمر." : "Monitor graduate career placements, corporate job postings board, and vocational training certifications."}
            </p>
          </div>
        </div>

        {/* Local Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
          {[
            { id: "tracker", label: lang === "ar" ? "لوحة تتبع الخريجين" : "Alumni Directory" },
            { id: "jobs", label: lang === "ar" ? "بوابة التوظيف المصلحية" : "Careers Board" },
            { id: "continuous", label: lang === "ar" ? "التعليم المستمر والدبلومات" : "Continuous Learning" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-slate-950 shadow-md"
                  : "text-slate-450 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. GRADUATE TRACKER DIRECTORY */}
      {activeTab === "tracker" && (
        <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "📊 سجل تتبع الوظائف ومسح التوظيف السنوي" : "📊 Alumni Placement Profiles & Career Surveys"}</h4>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2 right-2.5" />
              <input
                type="text"
                placeholder={lang === "ar" ? "البحث بالخريج أو الشركة..." : "Search graduate roster..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-850 py-1.5 pr-8 pl-3 text-[11px] rounded text-slate-200 outline-none w-56"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlumni.map(a => (
              <div key={a.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-right flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-500 font-mono">Dossier: {a.id}</span>
                    <span className="text-[10px] text-emerald-400 font-black">Class of {a.classYear}</span>
                  </div>
                  <strong className="text-xs text-slate-100 block">{lang === "ar" ? a.nameAr : a.nameEn}</strong>
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === "ar" ? a.collegeAr : a.collegeEn}</span>
                  
                  <div className="border-t border-slate-850/60 pt-2 mt-2 space-y-1 text-[10.5px]">
                    <div className="flex gap-1.5 justify-end text-slate-300 font-bold">
                      <span className="text-slate-500">{lang === "ar" ? "جهة العمل:" : "Placed at:"}</span>
                      <span>{a.currentCompany}</span>
                    </div>
                    <div className="flex gap-1.5 justify-end text-slate-350">
                      <span className="text-slate-500">{lang === "ar" ? "الوظيفة الحالية:" : "Active Role:"}</span>
                      <span>{lang === "ar" ? a.currentRoleAr : a.currentRoleEn}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CAREER OPPORTUNITIES BOARD */}
      {activeTab === "jobs" && (
        <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
          <div className="border-b border-slate-900 pb-3">
            <h4 className="text-xs font-black text-slate-100 flex items-center gap-2 flex-row-reverse">
              <Briefcase className="w-4.5 h-4.5 text-emerald-400" />
              <span>{lang === "ar" ? "بوابة فرص العمل والتوظيف السنوية" : "Corporate Placement & Jobs Board"}</span>
            </h4>
          </div>

          <div className="space-y-4">
            {jobs.map(job => {
              const isApplied = appliedJobs.includes(job.id);
              return (
                <div key={job.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl space-y-3">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div className="text-right flex-1">
                      <span className="text-[9.5px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded inline-block">
                        {job.type} | {job.id}
                      </span>
                      <h5 className="text-xs font-black text-slate-100 mt-1">{job.title}</h5>
                      <div className="flex gap-3 justify-end text-[10.5px] text-slate-450 mt-1.5 font-bold">
                        <span className="flex items-center gap-1 flex-row-reverse">
                          <Building className="w-3.5 h-3.5" />
                          <span>{job.company}</span>
                        </span>
                        <span className="flex items-center gap-1 flex-row-reverse font-mono">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{job.location}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyToJob(job.id, job.title)}
                      disabled={isApplied}
                      className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-black transition text-center shrink-0 ${
                        isApplied
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
                      }`}
                    >
                      {isApplied ? (lang === "ar" ? "✓ تم التقديم" : "✓ Applied") : (lang === "ar" ? "تقديم طلب فوري" : "Quick Apply")}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-850/60 pt-2 font-medium">
                    {lang === "ar" ? job.descriptionAr : job.descriptionEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CONTINUOUS EDUCATION HUB */}
      {activeTab === "continuous" && (
        <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
          <div className="border-b border-slate-900 pb-2">
            <h4 className="text-xs font-black text-slate-200 flex items-center gap-2 flex-row-reverse">
              <BookOpen className="w-4.5 h-4.5 text-emerald-400" />
              <span>{lang === "ar" ? "برامج التعليم المستمر والتطوير المهني" : "Continuous Vocational Training & Diplomas"}</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {continuousPrograms.map(p => (
              <div key={p.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl text-right space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9.5px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                    {p.id}
                  </span>
                  <span className="text-[9.5px] font-bold text-emerald-500">🟢 {p.status}</span>
                </div>

                <strong className="text-xs text-slate-200 block leading-relaxed">{lang === "ar" ? p.nameAr : p.nameEn}</strong>

                <div className="flex gap-3 justify-end text-[10.5px] text-slate-450 pt-1.5 border-t border-slate-850/50 font-bold font-mono">
                  <span>{p.hours} hours</span>
                  <span>|</span>
                  <span>{p.fees.toLocaleString()} EGP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
