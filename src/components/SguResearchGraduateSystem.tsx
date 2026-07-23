import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Award,
  BookOpen,
  Search,
  Sparkles,
  CheckCircle,
  Clock,
  UserPlus,
  PlusCircle,
  Database,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar
} from "lucide-react";

interface SguResearchGraduateSystemProps {
  lang: "ar" | "en";
  triggerSystemPush: (title: string, message: string) => void;
  addLog?: (msg: string) => void;
}

interface Thesis {
  id: string;
  titleAr: string;
  titleEn: string;
  researcherAr: string;
  researcherEn: string;
  degree: "Master" | "PhD";
  advisorAr: string;
  advisorEn: string;
  status: "drafting" | "review" | "defense_scheduled" | "completed";
  progress: number;
}

interface ScopusPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  indexing: "Scopus Q1" | "Scopus Q2" | "Web of Science";
  citations: number;
  year: number;
  deptAr: string;
  deptEn: string;
}

export default function SguResearchGraduateSystem({
  lang,
  triggerSystemPush,
  addLog
}: SguResearchGraduateSystemProps) {
  const [activeTab, setActiveTab] = useState<"theses" | "scopus" | "directory">("theses");

  // State for theses tracking
  const [theses, setTheses] = useState<Thesis[]>([
    {
      id: "SGU-TH-701",
      titleAr: "توظيف الشبكات العصبية العميقة للرصد المبكر لتعثر الطلاب بالبيئات الجامعية الذكية",
      titleEn: "Deep Neural Networks for Early Student Attrition Predictive Analytics in Smart Campuses",
      researcherAr: "م. يوسف عاطف عواد",
      researcherEn: "Eng. Youssef Atef",
      degree: "Master",
      advisorAr: "د. محمد أحمد عيسى",
      advisorEn: "Dr. Mohamed Eissa",
      status: "review",
      progress: 85
    },
    {
      id: "SGU-TH-702",
      titleAr: "تصميم أنظمة طاقة شمسية ذكية متكاملة ومتحكم بها بإنترنت الأشياء بفرع الصالحية الجديدة",
      titleEn: "IoT-Controlled Microgrid Solar Power Systems for SGU Salheya Smart Facilities",
      researcherAr: "م. كريم خالد منصور",
      researcherEn: "Eng. Kareem Khaled",
      degree: "PhD",
      advisorAr: "أ.د. حاتم ممدوح خفاجي",
      advisorEn: "Prof. Hatem Mamdouh",
      status: "drafting",
      progress: 45
    },
    {
      id: "SGU-TH-703",
      titleAr: "تحليل سيكولوجية التعلم الرقمي المدمج وأثره على تحصيل طلبة إدارة الأعمال بالشرق الأوسط",
      titleEn: "Hybrid Learning Psychometrics and its Impact on Business Student GPAs in MENA",
      researcherAr: "م. ريهام سعيد الجارحي",
      researcherEn: "Eng. Reham Saeed",
      degree: "Master",
      advisorAr: "د. رانيا سعيد",
      advisorEn: "Dr. Rania Saeed",
      status: "defense_scheduled",
      progress: 100
    }
  ]);

  // Scopus Research Papers
  const [papers, setPapers] = useState<ScopusPaper[]>([
    {
      id: "SGU-PUB-201",
      title: "Optimizing Learning Outcomes in Distributed Smart Environments Using Edge Compute Platforms",
      authors: ["Mohamed Eissa", "Youssef Atef"],
      journal: "IEEE Transactions on Education",
      indexing: "Scopus Q1",
      citations: 42,
      year: 2025,
      deptAr: "كلية الحاسبات والذكاء الاصطناعي",
      deptEn: "Faculty of Computers & AI"
    },
    {
      id: "SGU-PUB-202",
      title: "Geotechnical Resilience Factors for New Cities in Arid Areas: Case Salheya Al-Gadeeda Infrastructure",
      authors: ["Hatem Mamdouh", "Kareem Khaled"],
      journal: "Springer Civil Engineering Journal",
      indexing: "Scopus Q2",
      citations: 18,
      year: 2024,
      deptAr: "كلية الهندسة والتشييد",
      deptEn: "Faculty of Engineering"
    },
    {
      id: "SGU-PUB-203",
      title: "FinTech Acceleration and Regulatory Sandboxes in Emerging Economies: A Quantitative Framework",
      authors: ["Rania Saeed"],
      journal: "Elsevier Journal of Financial Economics",
      indexing: "Web of Science",
      citations: 55,
      year: 2025,
      deptAr: "كلية العلوم الإدارية والمالية",
      deptEn: "Faculty of Business Admin"
    }
  ]);

  // Form for registering new thesis
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newResearcher, setNewResearcher] = useState("");
  const [newDegree, setNewDegree] = useState<"Master" | "PhD">("Master");
  const [newAdvisor, setNewAdvisor] = useState("د. محمد أحمد عيسى");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search filter states
  const [searchTerm, setSearchTerm] = useState("");

  const handleRegisterThesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr.trim() || !newTitleEn.trim() || !newResearcher.trim()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newThesis: Thesis = {
        id: `SGU-TH-${Math.floor(704 + Math.random() * 99)}`,
        titleAr: newTitleAr.trim(),
        titleEn: newTitleEn.trim(),
        researcherAr: newResearcher.trim(),
        researcherEn: newResearcher.trim(),
        degree: newDegree,
        advisorAr: newAdvisor,
        advisorEn: newAdvisor,
        status: "drafting",
        progress: 10
      };

      setTheses(prev => [newThesis, ...prev]);
      setIsSubmitting(false);

      if (addLog) addLog(`✓ [الدراسات العليا] تسجيل مقترح رسالة جديد [${newTitleAr}] للباحث [${newResearcher}]`);
      triggerSystemPush(
        lang === "ar" ? "🎓 تسجيل مقترح رسالة أكاديمية" : "🎓 New Research Thesis Registered",
        lang === "ar" ? `تم تسجيل رسالة ${newDegree} للمهندس ${newResearcher}` : `Registered ${newDegree} thesis for candidate ${newResearcher}.`
      );

      // Reset
      setNewTitleAr("");
      setNewTitleEn("");
      setNewResearcher("");
    }, 1200);
  };

  const filteredTheses = useMemo(() => {
    return theses.filter(t =>
      t.titleAr.includes(searchTerm) ||
      t.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.researcherAr.includes(searchTerm)
    );
  }, [theses, searchTerm]);

  const filteredPapers = useMemo(() => {
    return papers.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [papers, searchTerm]);

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Upper Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/75 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-right">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <span>{lang === "ar" ? "نظام الدراسات العليا والبحث العلمي (Research System)" : "SGU Graduate Studies & Research Suite"}</span>
              <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">Phase 14</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "ar" ? "متابعة رسائل الماجستير والدكتوراه، رصد مستوعبات أبحاث سكوبس الدولية، ومؤشرات الباحثين العلميّة." : "Monitor Ph.D / Master theses, international indexed Scopus publications, and researcher metrics."}
            </p>
          </div>
        </div>

        {/* Local Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
          {[
            { id: "theses", label: lang === "ar" ? "رسائل الماجستير والدكتوراه" : "Theses Tracker" },
            { id: "scopus", label: lang === "ar" ? "أبحاث سكوبس المعتمدة" : "Scopus Papers" },
            { id: "directory", label: lang === "ar" ? "دليل الباحثين" : "Researchers Profiles" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                activeTab === tab.id
                  ? "bg-amber-600 text-slate-950 shadow-md"
                  : "text-slate-450 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. THESES TRACKER VIEW */}
      {activeTab === "theses" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New thesis registration */}
          <div className="lg:col-span-5 bg-slate-950 p-6 border border-slate-850 rounded-2xl text-right space-y-4">
            <h4 className="text-xs font-black text-slate-200 border-b border-slate-900 pb-2 flex items-center gap-2 flex-row-reverse">
              <PlusCircle className="w-4.5 h-4.5 text-amber-400" />
              <span>{lang === "ar" ? "تسجيل مقترح رسالة ماجستير/دكتوراه" : "Register Graduate Research Proposal"}</span>
            </h4>

            <form onSubmit={handleRegisterThesis} className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5">
                <label className="text-slate-450 block">{lang === "ar" ? "اسم الباحث (المقيد):" : "Researcher Name (Candidate):"}</label>
                <input
                  type="text"
                  required
                  placeholder="م. يونس أحمد كمال"
                  value={newResearcher}
                  onChange={(e) => setNewResearcher(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "الدرجة المستهدفة:" : "Target Degree:"}</label>
                  <select
                    value={newDegree}
                    onChange={(e) => setNewDegree(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-250 cursor-pointer"
                  >
                    <option value="Master">{lang === "ar" ? "ماجستير (M.Sc)" : "Master (M.Sc)"}</option>
                    <option value="PhD">{lang === "ar" ? "دكتوراه (Ph.D)" : "Doctorate (Ph.D)"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-450 block">{lang === "ar" ? "المشرف الأكاديمي الرئيسي:" : "Principal Supervisor Advisor:"}</label>
                  <select
                    value={newAdvisor}
                    onChange={(e) => setNewAdvisor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-255 cursor-pointer"
                  >
                    <option value="د. محمد أحمد عيسى">د. محمد أحمد عيسى</option>
                    <option value="أ.د. حاتم ممدوح خفاجي">أ.د. حاتم ممدوح خفاجي</option>
                    <option value="د. رانيا سعيد">د. رانيا سعيد</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-450 block">{lang === "ar" ? "عنوان الرسالة (بالعربية):" : "Thesis Title (Arabic):"}</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تحسين كفاءة البوابات الرقمية بالخوارزميات الذكية"
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-right text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-450 block">{lang === "ar" ? "عنوان الرسالة (بالإنجليزية):" : "Thesis Title (English):"}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Optimizing SGU gateway access control parameters"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-left text-slate-205 outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 font-black py-2.5 rounded-lg transition text-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>{lang === "ar" ? "جاري تدقيق المقترح وتسجيله..." : "Verifying proposal credentials..."}</span>
                  </>
                ) : (
                  <span>{lang === "ar" ? "تسجيل مقترح الرسالة بالـ ERP 🎓" : "Submit Proposal Draft 🎓"}</span>
                )}
              </button>
            </form>
          </div>

          {/* Active Theses Log Tracker */}
          <div className="lg:col-span-7 bg-slate-950 p-6 border border-slate-850 rounded-2xl text-right space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "📜 مسيرة الرسائل الأكاديمية قيد الإعداد" : "📜 Graduate Theses Progress Monitoring"}</h4>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2 right-2.5" />
                <input
                  type="text"
                  placeholder={lang === "ar" ? "البحث بالباحث أو العنوان..." : "Search thesis logs..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-850 py-1.5 pr-8 pl-3 text-[11px] rounded text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {filteredTheses.map(t => (
                <div key={t.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {t.degree} | {t.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${
                      t.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : t.status === "defense_scheduled"
                        ? "bg-sky-500/10 text-sky-400 font-black animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {t.status === "completed" ? (lang === "ar" ? "تمت المناقشة بنجاح" : "Defended & Approved")
                        : t.status === "defense_scheduled" ? (lang === "ar" ? "تم جدولة المناقشة" : "Defense Scheduled")
                        : (lang === "ar" ? "قيد البحث والكتابة" : "Under drafting")}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-[11.5px] text-slate-200 block">{lang === "ar" ? t.titleAr : t.titleEn}</strong>
                    <div className="flex gap-2 justify-end text-[10.5px] text-slate-400 font-bold">
                      <span>{lang === "ar" ? `الباحث: ${t.researcherAr}` : `Candidate: ${t.researcherEn}`}</span>
                      <span>|</span>
                      <span>{lang === "ar" ? `المشرف: ${t.advisorAr}` : `Supervisor: ${t.advisorEn}`}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold">
                      <span>{t.progress}%</span>
                      <span>{lang === "ar" ? "نسبة الإنجاز المعتمدة" : "Research Milestones Complete"}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 transition-all" style={{ width: `${t.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SCOPUS PAPERS VIEW */}
      {activeTab === "scopus" && (
        <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h4 className="text-xs font-black text-slate-100 flex items-center gap-2 flex-row-reverse">
              <Award className="w-4.5 h-4.5 text-amber-400" />
              <span>{lang === "ar" ? "الأبحاث الأكاديمية المصنفة دولياً Scopus" : "SGU International Indexed Scopus Publication Vault"}</span>
            </h4>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2 right-2.5" />
              <input
                type="text"
                placeholder={lang === "ar" ? "البحث بالكاتب أو العنوان..." : "Search Scopus publications..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-850 py-1.5 pr-8 pl-3 text-[11px] rounded text-slate-200 outline-none w-56"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Index metrics */}
            <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl text-center space-y-1">
              <strong className="text-2xl font-black text-emerald-400 font-mono">112</strong>
              <p className="text-[10px] text-slate-400 uppercase font-black">{lang === "ar" ? "بحث مصنف في Q1 Scopus" : "Scopus Q1 Publications"}</p>
            </div>
            <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl text-center space-y-1">
              <strong className="text-2xl font-black text-sky-400 font-mono">842</strong>
              <p className="text-[10px] text-slate-400 uppercase font-black">{lang === "ar" ? "إجمالي الاقتباسات الدولية" : "Total Citations"}</p>
            </div>
            <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl text-center space-y-1">
              <strong className="text-2xl font-black text-amber-400 font-mono">22.4%</strong>
              <p className="text-[10px] text-slate-400 uppercase font-black">{lang === "ar" ? "النمو البحثي السنوي للمقررات" : "Annual Research Growth Rate"}</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {filteredPapers.map(p => (
              <div key={p.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="space-y-1 text-right flex-1 leading-relaxed">
                  <span className="text-[9.5px] uppercase font-bold text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block mb-1">
                    {p.indexing} | {p.id}
                  </span>
                  <strong className="text-xs text-slate-250 block font-sans">{p.title}</strong>
                  <div className="flex gap-2 justify-end text-[10px] text-slate-500 font-bold">
                    <span>{lang === "ar" ? "الباحثين:" : "Authors:"} {p.authors.join(", ")}</span>
                    <span>|</span>
                    <span>{p.journal} ({p.year})</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-lg text-center font-mono shrink-0">
                  <strong className="text-sm font-black text-emerald-400 block">{p.citations}</strong>
                  <span className="text-[8.5px] text-slate-500 uppercase font-black">{lang === "ar" ? "اقتباس" : "Citations"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RESEARCHER DIRECTORY VIEW */}
      {activeTab === "directory" && (
        <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl text-right space-y-4">
          <div className="border-b border-slate-900 pb-2">
            <h4 className="text-xs font-black text-slate-200">{lang === "ar" ? "👨‍🔬 مؤشرات التميز والباحثين المعتمدين" : "👨‍🔬 SGU Prominent Researchers Dashboard"}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile 1 */}
            <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
              <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-850 text-center font-mono shrink-0">
                <strong className="text-xl font-black text-amber-400">18</strong>
                <span className="text-[8.5px] text-slate-500 uppercase font-black block">H-Index</span>
              </div>
              <div className="text-right">
                <strong className="text-xs text-slate-100 block">د. محمد أحمد عيسى</strong>
                <span className="text-[9.5px] text-amber-400 block font-bold">{lang === "ar" ? "كلية الحاسبات والذكاء الاصطناعي" : "Computers & AI"}</span>
                <span className="text-[10px] text-slate-450 block mt-1">
                  {lang === "ar" ? "أبحاث الذكاء الاصطناعي وتنقيب البيانات الكبرى." : "Specialization: AI, Big Data & Attrition prediction."}
                </span>
              </div>
            </div>

            {/* Profile 2 */}
            <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
              <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-850 text-center font-mono shrink-0">
                <strong className="text-xl font-black text-amber-400">24</strong>
                <span className="text-[8.5px] text-slate-500 uppercase font-black block">H-Index</span>
              </div>
              <div className="text-right">
                <strong className="text-xs text-slate-100 block">أ.د. حاتم ممدوح خفاجي</strong>
                <span className="text-[9.5px] text-amber-400 block font-bold">{lang === "ar" ? "كلية الهندسة والتشييد" : "Engineering Faculty"}</span>
                <span className="text-[10px] text-slate-450 block mt-1">
                  {lang === "ar" ? "الهندسة الإنشائية، تكييف التربة والمباني الذكية." : "Specialization: Soil mechanics & Smart sustainable design."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
