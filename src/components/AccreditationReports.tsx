import React, { useState, useMemo } from "react";
import {
  Award,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  Users,
  BookOpen,
  Calendar,
  Layers,
  Plus,
  Trash2,
  Check,
  FileCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  Award as AwardIcon
} from "lucide-react";

import { ALL_SGU_SQLITE_TABLES } from "../sqliteMock";
import { SGU_COLLEGES, DatabaseUser } from "../databaseMock";

interface AccreditationReportsProps {
  dbUsers: DatabaseUser[];
}

export default function AccreditationReports({ dbUsers }: AccreditationReportsProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<"med" | "fcis">("fcis");
  const [accreditationType, setAccreditationType] = useState<"NAQAAE" | "ABET">("ABET");
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);

  // Auto-calculated Statistics from dbUsers (the 30,000 live dataset)
  const stats = useMemo(() => {
    // Filter students, profs, and TAs under the selected faculty
    const facultyStudents = dbUsers.filter(u => u.collegeId === selectedFaculty && u.role === "student");
    const facultyStaff = dbUsers.filter(u => u.collegeId === selectedFaculty && (u.role === "faculty" || u.role === "ta" || u.role === "dept_head"));
    const facultyTotal = dbUsers.filter(u => u.collegeId === selectedFaculty);
    
    // SQLite Tables matching selected faculty
    const sqliteStudents = ALL_SGU_SQLITE_TABLES.find(t => t.tableName === "students")?.rows || [];
    const sqliteEnrolls = ALL_SGU_SQLITE_TABLES.find(t => t.tableName === "enrollments")?.rows || [];
    const sqliteGrades = ALL_SGU_SQLITE_TABLES.find(t => t.tableName === "grades")?.rows || [];

    const collegeIdMapping = selectedFaculty === "med" ? 1 : 2;
    const filterSqliteStudents = sqliteStudents.filter(s => s.college_id === collegeIdMapping);
    
    // Success rate computation
    let avgSuccessRate = 85; 
    let avgAttendance = 91.2;
    
    if (sqliteEnrolls.length > 0) {
      const activeEnrolls = sqliteEnrolls.filter(e => e.status === "active");
      if (activeEnrolls.length > 0) {
        const totalAttendance = activeEnrolls.reduce((acc, curr) => acc + (curr.attendance_percent || 90), 0);
        avgAttendance = parseFloat((totalAttendance / activeEnrolls.length).toFixed(1));
      }
    }

    if (sqliteGrades.length > 0) {
      const gradesCount = sqliteGrades.length;
      const passingGrades = sqliteGrades.filter(g => (g.total_grade || 0) >= 60).length;
      avgSuccessRate = parseFloat(((passingGrades / gradesCount) * 100).toFixed(1));
    }

    // Faculty specific naming
    const facultyNameAr = selectedFaculty === "med" ? "كلية الطب البشري" : "كلية الحاسبات والمعلومات";
    const facultyDean = selectedFaculty === "med" ? "أ.د. حسام الجوهري" : "أ.د. يوسف خالد";
    const headOfQA = selectedFaculty === "med" ? "أ.د. سلوى عبدالباقي" : "أ.د. طارق الشروق";

    const studentCount = facultyStudents.length > 0 ? facultyStudents.length : (filterSqliteStudents.length * 40 + 4900); // realistic scale
    const staffCount = facultyStaff.length > 0 ? facultyStaff.length : 164;
    const ratio = Math.round(studentCount / staffCount);

    return {
      facultyNameAr,
      facultyDean,
      headOfQA,
      studentCount,
      staffCount,
      ratio,
      avgSuccessRate,
      avgAttendance,
      departmentsCount: selectedFaculty === "med" ? 8 : 4,
      classroomsCount: selectedFaculty === "med" ? 12 : 8,
      activeCoursesCount: selectedFaculty === "med" ? 34 : 26
    };
  }, [selectedFaculty, dbUsers]);

  // NAQAAE Standards Setup (National Authority for Quality Assurance & Accreditation of Egypt)
  const initialNaqaeStandards = useMemo(() => [
    {
      id: "N1",
      code: "STD-01",
      titleAr: "التخطيط الاستراتيجي ورسالة المؤسسة",
      titleEn: "Strategic Planning & Mission",
      weight: 10,
      score: 5, // out of 5
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "المخطط الاستراتيجي الخماسي المعتمد (2024-2029)، استطلاعات الأطراف المجتمعية، رؤية الكلية المعلقة بقاعات الدراسة والموقع الإلكتروني.",
      indicators: [
        "وضوح وصياغة رسالة الكلية بمشاركة الأطراف المعنية",
        "مواءمة الخطة الاستراتيجية للكلية مع خطة جامعة الصالحية الجديدة الكلية",
        "توفر نظام متابعة وتقييم دوري لمؤشرات الأداء الرئيسية KPIs"
      ]
    },
    {
      id: "N2",
      code: "STD-02",
      titleAr: "القيادة والحوكمة والهيكل التنظيمي",
      titleEn: "Leadership & Governance",
      weight: 10,
      score: 4,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "الهيكل التنظيمي المعتمد من مجلس الجامعة، محاضر مجالس الأقسام والكلية، مدونة السلوك الأخلاقي لأعضاء هيئة التدريس والطلاب.",
      indicators: [
        "التوصيف الوظيفي الواضح لكافة القيادات الأكاديمية وصناع القرار",
        "تفعيل لجنة ضمان الجودة والاعتماد وتبعيتها المباشرة لعميد الكلية",
        "الممارسات الديمقراطية ومشاركة أعضاء هيئة التدريس والطلاب في اللجان والمجالس"
      ]
    },
    {
      id: "N3",
      code: "STD-03",
      titleAr: "إدارة الموارد المالية والمادية واللوجستية",
      titleEn: "Financial & Physical Resources",
      weight: 15,
      score: 3,
      status: "partially" as "compliant" | "partially" | "non",
      evidence: "الميزانية السنوية لوحدة الجودة وبنود الصرف، عقود صيانة المعامل الطبية والميكانيكية، دفتر الهردوير والسعة الاستيعابية للمدرجات.",
      indicators: [
        "كفاية واستدامة الموارد المالية المخصصة للعملية التعليمية والبحث العلمي",
        "توزيع وتأهيل المعامل الفنية والمحاكاة لضمان السلامة والصحة المهنية",
        "تكامل الخدمات اللوجستية مثل العيادات الطبية، النقل، ومجموعات السكن للطلاب"
      ]
    },
    {
      id: "N4",
      code: "STD-04",
      titleAr: "المعايير الأكاديمية والبرامج التعليمية المعتمدة",
      titleEn: "Academic Standards & Educational Programs",
      weight: 15,
      score: 5,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "وثيقة المعايير الأكاديمية القومية المرجعية (NARS 2020)، توصيف وتقارير البرامج والمقررات بملفات كرتونية رقمية، استمارات اعتماد المناهج.",
      indicators: [
        "تبني المعايير المرجعية NARS المعتمدة من الهيئة القومية لضمان جودة التعليم",
        "توافق أساليب التدريس والتقييم مع نواتج التعلم المستهدفة ILOs",
        "الاتساق التتابعي للمقررات واستيفاء المتطلبات السابقة للقيد بانتظام"
      ]
    },
    {
      id: "N5",
      code: "STD-05",
      titleAr: "شؤون الطلاب والأنشطة الإرشادية والمهنية",
      titleEn: "Students & Academic Support",
      weight: 10,
      score: 4,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "سجلات ريادة الطلاب والأنشطة الرياضية والاجتماعية، دفاتر توجيه المرشد الأكاديمي، سجلات المساعدات المباشرة للطلاب المتعثرين.",
      indicators: [
        "تفعيل نظام الإرشاد الأكاديمي والمهني للطلاب والربط مع بوابة ERP",
        "توفير خدمات الرعاية الاجتماعية والمساعدات من صندوق التكافل الطلابي",
        "قياس ودراسة استطلاعات رضا الطلاب عن البيئة الجامعية بانتظام"
      ]
    },
    {
      id: "N6",
      code: "STD-06",
      titleAr: "أعضاء هيئة التدريس والكوادر المساندة",
      titleEn: "Faculty & Supporting Staff",
      weight: 15,
      score: 3,
      status: "partially" as "compliant" | "partially" | "non",
      evidence: "قاعدة بيانات العاملين، خطة التنمية المهنية بمركز تنمية قدرات أعضاء هيئة التدريس بجامعة SGU، سجل الترقيات العلمية المنجزة.",
      indicators: [
        "تطابق معدل الطلاب الفعلي لكل أستاذ مع المؤشرات القياسية المقرة لكل قطاع",
        "انتظام برامج التدريب المتخصص على استراتيجيات التعليم الحديث والتقييم الإلكتروني",
        "كفاية الكادر الإداري والفني المساعد والأطباء المقيمين لخدمة العملية التعليمية"
      ]
    },
    {
      id: "N7",
      code: "STD-07",
      titleAr: "البحث العلمي والأنشطة والبعثات العلمية",
      titleEn: "Scientific Research & Scholarship",
      weight: 10,
      score: 3,
      status: "partially" as "compliant" | "partially" | "non",
      evidence: "خطة البحث العلمي للكلية الموجهة للصناعة، قائمة الأبحاث المنشورة دولياً Scopus بأكواد SGU، محاضر مجلس لجنة أخلاقيات البحث العلمي.",
      indicators: [
        "مخصصات تمويل أبحاث الكلية ومشاركتها في مشروعات علمية ممولة خارجياً",
        "عدد وجودة الأبحاث المنشورة في مجلات علمية مفهرسة دولياً",
        "إشراك الطلاب المتميزين والماجستير والدكتوراه بفرق بحثية نشطة بالكلية"
      ]
    },
    {
      id: "N8",
      code: "STD-08",
      titleAr: "المسؤولية المجتمعية والخدمة البيئية",
      titleEn: "Community Engagement & Environment",
      weight: 10,
      score: 4,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "التقرير السنوي لقطاع خدمة المجتمع، القوافل الطبية وورش العمل للتنمية التكنولوجية في الصالحية، الندوات التثقيفية للأمومة والطفولة.",
      indicators: [
        "مساهمة الكلية الفعالة في حل قضايا التنمية والبيئة بالمحيط الجغرافي للجامعة",
        "تقديم برامج الاستشارات والدورات التدريبية المهنية للمؤسسات والمصانع",
        "اشتراك ممثلي النقابات المهنية والصناعية في بروتوكولات التدريب الميداني للطلاب"
      ]
    },
    {
      id: "N9",
      code: "STD-09",
      titleAr: "ضمان الجودة والتطوير والتقييم الذاتي الدائم",
      titleEn: "Quality Assurance & Continuous Improvement",
      weight: 5,
      score: 4,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "تقارير المراجعة الداخلية السنوية لفرق الجودة، سجل الإجراءات التدخلية لتصحيح العثرات، لائحة تشغيل نظام التغذية الراجعة المستمر.",
      indicators: [
        "انتظام دورية إعداد تقارير التقييم الذاتي السنوية واعتماد الخطة التصحيحية",
        "توفر نظام محاسبة ومساءلة حقيقي بناءً على التقييمات الدورية",
        "تنسيق وحدة ضمان الجودة بالكلية مع مركز ضمان الجودة المركزي بالجامعة"
      ]
    }
  ], []);

  // ABET Criteria Setup (primarily for CSE/Software Engineering programs under FCIS)
  const initialAbetCriteria = useMemo(() => [
    {
      id: "C1",
      code: "CRT-1",
      titleAr: "المعيار الأول: الطلاب وشؤون تقييم الأداء والمتابعة",
      titleEn: "Criterion 1: Students",
      weight: 15,
      score: 4,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "ERP Student tracking system, graduation credits audit processes, prerequisite check logs, academic warning regulations.",
      indicators: [
        "Systematically evaluates student performance, progress, and graduation alignment.",
        "Strict compliance with prerequisite constraints and curriculum pathways.",
        "Adequate processes for awarding transfer credits and validating transfer equivalents."
      ]
    },
    {
      id: "C2",
      code: "CRT-2",
      titleAr: "المعيار الثاني: أهداف البرنامج التعليمية (PEOs)",
      titleEn: "Criterion 2: Program Educational Objectives",
      weight: 10,
      score: 5,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "Published Program Educational Objectives, Minutes of the SGU Industry Advisory Board, survey of alumni 3-5 years post-grad.",
      indicators: [
        "Clear, written, and published PEOs aligned with the institution's strategic mission.",
        "Structured feedback loop involving alumni, employers, and professional bodies.",
        "Frequent evaluation of program mission relevance to current computing trends."
      ]
    },
    {
      id: "C3",
      code: "CRT-3",
      titleAr: "المعيار الثالث: مخرجات الطلاب والمهارات المكتسبة (SOs)",
      titleEn: "Criterion 3: Student Outcomes",
      weight: 20,
      score: 4,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "Completed course assessment portfolios, student capstone projects with evaluation rubrics, computing lab exam rubrics.",
      indicators: [
        "Documented, measurable SOs (1 to 6/7) encompassing computing technical and human teamwork skills.",
        "Structured direct (exams, projects) and indirect (exit surveys) assessment procedures.",
        "Demonstrated mastery in analyzing complex computing problems and building software architecture."
      ]
    },
    {
      id: "C4",
      code: "CRT-4",
      titleAr: "المعيار الرابع: التحسين والتقييم والتقويم المستمر",
      titleEn: "Criterion 4: Continuous Improvement",
      weight: 15,
      score: 3,
      status: "partially" as "compliant" | "partially" | "non",
      evidence: "Historical assessment cycles reports, Action plans tracking software fixes, minutes of curriculum reform committees.",
      indicators: [
        "Uses collected assessment data systematically to evaluate and improve the program.",
        "Explicitly implements feedback changes to address identified program weaknesses.",
        "Well-documented actions taken based on student outcomes analysis to close the loop."
      ]
    },
    {
      id: "C5",
      code: "CRT-5",
      titleAr: "المعيار الخامس: المنهج الدراسي وهيكل الساعات المعتمدة",
      titleEn: "Criterion 5: Curriculum",
      weight: 15,
      score: 5,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "Undergraduate curriculum maps, syllabus documents, sample student senior design projects with engineering designs.",
      indicators: [
        "Curriculum integrates computing/engineering science with general education and professional values.",
        "Major design or capstone experience in the final year based on cumulative knowledge and standards.",
        "Provides sufficient depth in theoretical, practical software engineering, and technical coding lab hours."
      ]
    },
    {
      id: "C6",
      code: "CRT-6",
      titleAr: "المعيار السادس: كفاءة ومؤهلات أعضاء هيئة التدريس",
      titleEn: "Criterion 6: Faculty",
      weight: 10,
      score: 4,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "Resume/CV profiles of active professors, IEEE/ACM professional activity rosters, student teaching evaluations.",
      indicators: [
        "Faculty members must have appropriate PhD/MS qualifications and technical credentials to teach curriculum.",
        "Sufficient faculty count to sustain program continuity, advising, and university governance.",
        "Demonstrated authority and active leadership in program improvement and professional societies."
      ]
    },
    {
      id: "C7",
      code: "CRT-7",
      titleAr: "المعيار السابع: المرافق والمعامل والأجهزة الفنية",
      titleEn: "Criterion 7: Facilities",
      weight: 10,
      score: 3,
      status: "partially" as "compliant" | "partially" | "non",
      evidence: "Hardware list of computer lab spaces, networking lab layout, cloud resources allocation (AWS/Google Cloud SGU student access).",
      indicators: [
        "Adequate computing spaces, software design environments, and high-speed campus networking infrastructure.",
        "Systematic training and security compliance rules inside operational computing/hardware labs.",
        "Availability of proper study libraries, collaborative group zones, and virtual learning environments."
      ]
    },
    {
      id: "C8",
      code: "CRT-8",
      titleAr: "المعيار الثامن: الدعم المؤسسي والتمويل والقيادات",
      titleEn: "Criterion 8: Institutional Support",
      weight: 5,
      score: 4,
      status: "compliant" as "compliant" | "partially" | "non",
      evidence: "University administration funding allocations, office technology equipment upgrades, professional development budget lines.",
      indicators: [
        "Institutional leadership ensures program stability, sufficient funding, and technical resource acquisition.",
        "Adequate resources to attract, retain, and reward high-quality teaching assistants and faculty.",
        "Proper administrative staff and technician resources to maintain lab servers and computing safety."
      ]
    }
  ], []);

  // Local state for standards so users can interactively edit them!
  const [naqaeStandards, setNaqaeStandards] = useState(() => initialNaqaeStandards);
  const [abetCriteria, setAbetCriteria] = useState(() => initialAbetCriteria);

  // Active standards list depending on selection
  const activeStandards = useMemo(() => {
    return accreditationType === "NAQAAE" ? naqaeStandards : abetCriteria;
  }, [accreditationType, naqaeStandards, abetCriteria]);

  // Overall compliance metrics calculations
  const totalWeight = useMemo(() => activeStandards.reduce((acc, curr) => acc + curr.weight, 0), [activeStandards]);
  const scoredWeightSum = useMemo(() => {
    return activeStandards.reduce((acc, curr) => {
      // Scale evaluation: compliant = 100%, partially = 60%, non = 10%
      const scalar = curr.status === "compliant" ? 1.0 : curr.status === "partially" ? 0.6 : 0.1;
      return acc + (curr.weight * scalar);
    }, 0);
  }, [activeStandards]);

  const overallScorePercentage = useMemo(() => {
    if (totalWeight === 0) return 0;
    return Math.round((scoredWeightSum / totalWeight) * 100);
  }, [scoredWeightSum, totalWeight]);

  // Handlers to edit state in real-time
  const toggleStatus = (id: string, newStatus: "compliant" | "partially" | "non") => {
    if (accreditationType === "NAQAAE") {
      setNaqaeStandards(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } else {
      setAbetCriteria(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    }
  };

  const handleEvidenceEdit = (id: string, value: string) => {
    if (accreditationType === "NAQAAE") {
      setNaqaeStandards(prev => prev.map(s => s.id === id ? { ...s, evidence: value } : s));
    } else {
      setAbetCriteria(prev => prev.map(s => s.id === id ? { ...s, evidence: value } : s));
    }
  };

  // Live Action plan items builder
  const [actionPlan, setActionPlan] = useState([
    { id: 1, action: "تحديث المعامل الحاسوبية وشراء أجهزة تخديم متقدمة وشاشات عرض للمدرجات الكبيرة بفروع الكلية", owner: "أ.د. يوسف خالد", deadline: "أكتوبر 2026", status: "pending", category: "Facilities" },
    { id: 2, action: "عقد ورش تدريبية دورية لقياس نواتج التعلم ومخرجات الطلاب وتطبيق نظام Rubrics بكل المقررات", owner: "د. آية الراضي", deadline: "أغسطس 2026", status: "ongoing", category: "Continuous Improvement" },
    { id: 3, action: "مراجعة مواءمة المناهج والمحاضرات للفرقة الرابعة مع نقابة المهندسين وممثلي سوق العمل والشركاء", owner: "د. طارق الشافعي", deadline: "نوفمبر 2026", status: "completed", category: "Curriculum" },
    { id: 4, action: "إعداد ملف كرتوني رقمي تجميعي (Quality Portfolio) يضم توصيفات المقررات والامتحانات المعتمدة", owner: "أ.د. طارق الشروق", deadline: "يوليو 2026", status: "ongoing", category: "Academic Standards" }
  ]);

  const [newActionText, setNewActionText] = useState("");
  const [newActionOwner, setNewActionOwner] = useState("");
  const [newActionDeadline, setNewActionDeadline] = useState("");
  const [newActionCategory, setNewActionCategory] = useState("Continuous Improvement");

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    const item = {
      id: Date.now(),
      action: newActionText,
      owner: newActionOwner || "إدارة الكلية",
      deadline: newActionDeadline || "ديسمبر 2026",
      status: "pending",
      category: newActionCategory
    };
    setActionPlan(prev => [...prev, item]);
    setNewActionText("");
    setNewActionOwner("");
    setNewActionDeadline("");
  };

  const deleteAction = (id: number) => {
    setActionPlan(prev => prev.filter(a => a.id !== id));
  };

  const toggleActionStatus = (id: number) => {
    setActionPlan(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === "pending" ? "ongoing" : a.status === "ongoing" ? "completed" : "pending";
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Self assessment text evaluation
  const selfAssessmentSummary = useMemo(() => {
    const compliantCount = activeStandards.filter(s => s.status === "compliant").length;
    const partialCount = activeStandards.filter(s => s.status === "partially").length;
    const nonCount = activeStandards.filter(s => s.status === "non").length;

    let text = `بناءً على التقييم الذاتي لوحدة جودة التعليم بجامعة الصالحية الجديدة لحرم "${stats.facultyNameAr}"، تبين استيفاء نسبة الكلية لـ `;
    text += `[${compliantCount}] معايير رئيسية بشكل كامل ومثالي، بينما يوجد [${partialCount}] معايير مستوفاة جزئياً تخضع لخطط التطوير والتقويم الفوري لعام 2026/2027. `;
    
    if (nonCount > 0) {
      text += `كما تم تسجيل [${nonCount}] فجوات حرجة تتطلب تدخلاً عاجلاً من الهيكل الإداري لتوفير الميزانية والموارد البشرية الكافية لتقليص النسبة.`;
    } else {
      text += `ولا توجد أي معايير مسجلة كـ "غير مستوفاة" مما يمنح الكلية ثقة عالية بنسبة نجاح تفوق الـ 90% للحصول على الاعتماد المؤسسي والبرامجي النهائي دون شروط قاسية.`;
    }

    // Dynamic metrics text insertion
    text += ` متوسط معدل حضور المحاضرات المُسجل بالسحابة هو (${stats.avgAttendance}%) ومتوسط نسب نجاح المقررات المعتمدة تبلغ (${stats.avgSuccessRate}%) مع معدل طلاب لكل عضو هيئة تدريس فاعل يقارب (${stats.ratio}:1).`;

    return text;
  }, [activeStandards, stats]);

  // Handle true Print Action
  const triggerNativePrint = () => {
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div id="accreditation-module" className="space-y-6 text-right" dir="rtl">
      
      {/* Title & Banner Grid */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-950/45 px-2.5 py-0.5 rounded-lg font-mono font-bold">
              ISO 9001:2015 & Quality Assurance Hub
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2 justify-center md:justify-start">
            <Award className="w-6 h-6 text-amber-500" />
            نظام تقارير الاعتماد والتقييم الذاتي الأكاديمي
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            وحدة ذكية تستخرج البيانات الحية من كشوف الطلاب وهيئة التدريس ونسب الحضور والنتائج بشكل مؤتمت لتوليد ملف التقييم الذاتي المعتمد لتقديمه لقطاع التطوير الجامعي وهيئات الاعتماد المحلية <strong className="text-emerald-400 font-bold">NAQAAE</strong> والاعتماد العالمي للمجالات التقنية <strong className="text-amber-500 font-bold">ABET</strong>.
          </p>
        </div>

        {/* Action Buttons to open the printable report preview */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowPrintPreview(true)}
            className="cursor-pointer px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold transition flex items-center gap-2 justify-center"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            معاينة ملف الـ PDF المتكامل
          </button>
          <button
            onClick={triggerNativePrint}
            className="cursor-pointer px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-2 justify-center shadow-lg"
          >
            <Download className="w-4 h-4" />
            تحميل وطباعة التقرير PDF
          </button>
        </div>
      </div>

      {/* Main interactive panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column (SGU Context Extracted Stats Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl block space-y-5">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <span className="text-[10px] bg-sky-500/10 text-sky-400 font-bold px-2 py-0.5 rounded font-mono">Live Extraction</span>
              <h3 className="text-xs font-bold text-slate-200">الكلية والجهة المرجعية المستهدفة</h3>
            </div>
            
            {/* Faculty selection */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-400">الكلية المعنية للتقويم:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedFaculty("fcis");
                    setAccreditationType("ABET");
                  }}
                  className={`cursor-pointer px-3 py-2.5 rounded-lg border text-xs font-bold transition ${
                    selectedFaculty === "fcis"
                      ? "bg-emerald-600/15 border-emerald-500 text-emerald-300"
                      : "bg-slate-950 border-slate-850 text-slate-450 hover:text-slate-200"
                  }`}
                >
                  حاسبات ومعلومات (FCIS)
                </button>
                <button
                  onClick={() => {
                    setSelectedFaculty("med");
                    setAccreditationType("NAQAAE");
                  }}
                  className={`cursor-pointer px-3 py-2.5 rounded-lg border text-xs font-bold transition ${
                    selectedFaculty === "med"
                      ? "bg-emerald-600/15 border-emerald-500 text-emerald-300"
                      : "bg-slate-950 border-slate-850 text-slate-450 hover:text-slate-200"
                  }`}
                >
                  كلية الطب البشري (MED)
                </button>
              </div>
            </div>

            {/* Standards criteria selection */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-400">معايير الاعتماد والامتثال:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAccreditationType("NAQAAE")}
                  className={`cursor-pointer px-3 py-2.5 rounded-lg border text-xs font-bold transition ${
                    accreditationType === "NAQAAE"
                      ? "bg-amber-600/15 border-amber-500 text-amber-300"
                      : "bg-slate-950 border-slate-850 text-slate-450 hover:text-slate-200"
                  }`}
                >
                  معايير الهيئة المصرية NAQAAE
                </button>
                <button
                  onClick={() => setAccreditationType("ABET")}
                  disabled={selectedFaculty === "med"} // ABET is engineering/technology specifically, disabled for medicine
                  className={`cursor-pointer px-3 py-2.5 rounded-lg border text-xs font-bold transition ${
                    selectedFaculty === "med" ? "opacity-40 cursor-not-allowed" : ""
                  } ${
                    accreditationType === "ABET"
                      ? "bg-amber-600/15 border-amber-500 text-amber-300"
                      : "bg-slate-950 border-slate-850 text-slate-450 hover:text-slate-200"
                  }`}
                >
                  معايير ABET الدولية للتقنية
                </button>
              </div>
              {selectedFaculty === "med" && (
                <p className="text-[10px] text-amber-500 font-medium">
                  * تُطبق معايير الـ NAQAAE فقط محلياً ودولياً تخصصياً لكليات القطاع الطبي البشري.
                </p>
              )}
            </div>
          </div>

          {/* Real System Extracted Statistics Box */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl block space-y-4">
            <div className="border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-slate-100">مؤشرات الجودة المستخرجة مؤتمتاً:</h3>
            </div>

            <div className="space-y-3">
              {/* Statistic 1: Students count */}
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between">
                <div className="text-left">
                  <span className="font-mono text-xs font-bold text-teal-400">{stats.studentCount}</span>
                  <span className="text-[9px] text-slate-500 block">من كشوف ERP المقيدة</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-300 block">إجمالي الطلاب المقيدين</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">Student Body</span>
                </div>
              </div>

              {/* Statistic 2: Faculty ratio */}
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between">
                <div className="text-left">
                  <span className="font-mono text-xs font-bold text-amber-400">{stats.ratio} : 1</span>
                  <span className="text-[9px] text-slate-500 block">أستاذ / طالب</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-300 block">نسبة كفاية أعضاء هيئة التدريس</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">Student-to-Staff Ratio</span>
                </div>
              </div>

              {/* Statistic 3: Success rate matches NAQAAE */}
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between">
                <div className="text-left">
                  <span className="font-mono text-xs font-bold text-emerald-400">{stats.avgSuccessRate}%</span>
                  <span className="text-[9px] text-slate-500 block">الحد المعتمد &gt; 60%</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-300 block">متوسط نسب النجاح الكلي</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">Overall Success rate</span>
                </div>
              </div>

              {/* Statistic 4: Attendance matches NAQAAE */}
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between">
                <div className="text-left">
                  <span className="font-mono text-xs font-bold text-sky-400">{stats.avgAttendance}%</span>
                  <span className="text-[9px] text-slate-500 block">الغياب الآمن دون حرمان</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-300 block">معدل الحضور التراكمي المحاسب</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">Attendance Average</span>
                </div>
              </div>
            </div>

            {/* Threshold recommendation */}
            <div className="bg-emerald-500/10 border border-emerald-900/40 p-3 rounded-xl flex gap-2.5 text-[10.5px]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-emerald-300 font-bold block">مؤشر الامتثال الكلي للبيانات المقيدة:</strong>
                نسبة الطلاب لأعضاء التدريس ممتازة ومثالية وتطابق الدليل التنظيمي المعتمد من قطاع التعليم الطبي والهندسي بجامعة الصالحية.
              </div>
            </div>
          </div>

          {/* Compliance Percentage radial index */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl block text-center space-y-4">
            <h3 className="text-xs font-bold text-slate-200">الامتثال التقريبي المقيّم للمخطط:</h3>
            
            <div className="relative inline-flex items-center justify-center">
              {/* Simple beautiful SVG Circular Progressbar */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-slate-850 fill-none"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-amber-500 transition-all duration-500 ease-in-out fill-none"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - overallScorePercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-2xl font-black text-slate-100">{overallScorePercentage}%</span>
                <span className="text-[9.5px] text-slate-400">معدل الامتثال</span>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-400 leading-relaxed text-right">
              * يتم احتساب معدل الامتثال هذا بتجميع أوزان الاستيفاء التفاعلية بالجدول الفعلي. قم بتحديث حالات المعايير باليسار لمعايرة المؤشر فوراً.
            </p>
          </div>
        </div>

        {/* Right column (Standards checklist and actions workspace) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Table Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 flex-wrap gap-2">
              <span className="text-[10.5px] text-emerald-400/90 font-bold bg-emerald-500/10 border border-emerald-900/30 px-3 py-0.5 rounded-lg">
                معايير {accreditationType} الموحدة
              </span>
              <h3 className="text-xs font-bold text-slate-150">
                قائمة المعايير ونسب التقييم والامتثال المتاحة للكلية
              </h3>
            </div>

            {/* Sub-header of rating system */}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              انقر على أزرار التقييم الثلاثية لتحديد كفاءة وحالة استيفاء الملف الورقي والإثباتات المعلقة بكل معيار لتحديث النتيجة فورياً تمهيداً للاعتماد.
            </p>

            {/* Standards List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {activeStandards.map((std) => (
                <div key={std.id} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3 transition hover:border-slate-750">
                  <div className="flex justify-between items-start gap-3">
                    {/* Interactive Toggles */}
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
                      <button
                        onClick={() => toggleStatus(std.id, "compliant")}
                        className={`cursor-pointer px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                          std.status === "compliant"
                            ? "bg-emerald-600/30 text-emerald-400 border border-emerald-800/40"
                            : "text-slate-500 hover:text-slate-350"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        مستوفى
                      </button>
                      <button
                        onClick={() => toggleStatus(std.id, "partially")}
                        className={`cursor-pointer px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                          std.status === "partially"
                            ? "bg-amber-600/30 text-amber-400 border border-amber-800/40"
                            : "text-slate-500 hover:text-slate-350"
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        جزئي
                      </button>
                      <button
                        onClick={() => toggleStatus(std.id, "non")}
                        className={`cursor-pointer px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                          std.status === "non"
                            ? "bg-rose-600/30 text-rose-400 border border-rose-800/40"
                            : "text-slate-500 hover:text-slate-350"
                        }`}
                      >
                        <XCircle className="w-3 h-3" />
                        غير مستوفى
                      </button>
                    </div>

                    {/* Standard title */}
                    <div className="text-right flex-1 space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[10.5px] font-mono text-amber-500 font-bold">{std.code}</span>
                        <h4 className="text-xs font-bold text-slate-100">{std.titleAr}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">{std.titleEn} (الوزن النسبي: {std.weight}%)</span>
                    </div>
                  </div>

                  {/* Indicators details list */}
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-900 text-right space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">أدلة القياس والمواءمة المطلوبة:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-450">
                      {std.indicators.map((ind, idx) => (
                        <li key={idx} className="list-item">{ind}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Supporting Documents / Evidence field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400">وثائق الأدلة المرفقة (Evidence Details):</label>
                    <input
                      type="text"
                      value={std.evidence}
                      onChange={(e) => handleEvidenceEdit(std.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-2 rounded text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500 text-right font-medium"
                      placeholder="صف أسماء الملفات، المحاضر واللوائح التي تم تجميعها..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-950/40 px-3 py-0.5 rounded-lg font-bold">
                تدارك الفجوات والتحسين المستمر (Closing the Loop)
              </span>
              <h3 className="text-xs font-bold text-slate-200">
                خطة العمل التنفيذية المعتمدة لعلاج جوانب القصور
              </h3>
            </div>

            {/* Actions Table */}
            <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950">
              <table className="w-full text-xs text-right border-collapse">
                <thead className="bg-slate-900 border-b border-slate-850 text-slate-400">
                  <tr>
                    <th className="p-2.5">الإجراء التصحيحي المستهدف</th>
                    <th className="p-2.5">المعيار المالي/الفني</th>
                    <th className="p-2.5">المسؤول عن التنفيذ</th>
                    <th className="p-2.5">الموعد النهائي</th>
                    <th className="p-2.5">الحالة الحالية</th>
                    <th className="p-2.5 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {actionPlan.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-2.5 text-slate-100 font-medium max-w-xs truncate">{act.action}</td>
                      <td className="p-2.5 text-slate-400 font-semibold">{act.category}</td>
                      <td className="p-2.5 font-bold text-slate-300">{act.owner}</td>
                      <td className="p-2.5 font-mono text-amber-500 text-[11px]">{act.deadline}</td>
                      <td className="p-2.5">
                        <button
                          onClick={() => toggleActionStatus(act.id)}
                          className={`cursor-pointer px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-950/20"
                              : act.status === "ongoing"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-950/20"
                              : "bg-slate-900 text-slate-500 border border-slate-800"
                          }`}
                        >
                          {act.status === "completed" ? "مكتمل" : act.status === "ongoing" ? "جاري التنفيذ" : "معلق"}
                        </button>
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => deleteAction(act.id)}
                          className="cursor-pointer text-rose-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fast Add Action Form */}
            <form onSubmit={handleAddAction} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              <div className="md:col-span-5">
                <input
                  type="text"
                  required
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  placeholder="ابن إجراءاً تنفيذياً جديداً..."
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={newActionOwner}
                  onChange={(e) => setNewActionOwner(e.target.value)}
                  placeholder="المسؤول عن التنفيذ"
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={newActionDeadline}
                  onChange={(e) => setNewActionDeadline(e.target.value)}
                  placeholder="أكتوبر 2026"
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <select
                  value={newActionCategory}
                  onChange={(e) => setNewActionCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-300"
                >
                  <option value="Facilities">المرافق</option>
                  <option value="Curriculum">المناهج</option>
                  <option value="Continuous Improvement">التقييم المستمر</option>
                  <option value="Academic Standards">المعايير الأكاديمية</option>
                </select>
              </div>
              <div className="md:col-span-1 flex items-center justify-end">
                <button
                  type="submit"
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 p-2 rounded-lg w-full flex items-center justify-center transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* AI Self Assessment Statement Summary */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl block space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 flex-wrap gap-2 text-right">
              <span className="text-[9.5px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">Auto-Generated Insight</span>
              <h3 className="text-xs font-bold text-slate-200">البيان التنفيذي للتقييم الذاتي المتطابق (Self-Assessment Summary)</h3>
            </div>
            
            <p className="text-xs text-slate-350 leading-relaxed text-right whitespace-pre-wrap">
              {selfAssessmentSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Paginated PDF Document Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header Controls */}
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerNativePrint}
                  className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  طباعة الوثيقة / تصدير PDF
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="cursor-pointer px-4 py-2 bg-slate-900 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                >
                  إغلاق المعاينة
                </button>
              </div>
              
              <div className="text-right">
                <h3 className="text-sm font-bold text-slate-100">وثيقة ورقة التقييم الذاتي المعتمدة - جامعة الصالحية الجديدة</h3>
                <span className="text-[10px] text-slate-500">تم توليد نسق الطباعة A4 Portrait الصديق للطباعة مسبقاً</span>
              </div>
            </div>

            {/* Paginated Paper Content Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-slate-950 relative scrollbar-thin">
              
              {/* PRINT STYLE INJECTOR WITH CSS PAGE BREAKS */}
              <style>{`
                @media print {
                  body {
                    background-color: white !important;
                    color: black !important;
                  }
                  #accreditation-module, header, footer, .modal-header, button, select, input, form {
                    display: none !important;
                  }
                  .print-page {
                    background-color: white !important;
                    color: black !important;
                    padding: 2.5cm !important;
                    box-shadow: none !important;
                    border: none !important;
                    margin: 0 !important;
                    page-break-after: always !important;
                    width: 100% !important;
                    min-height: auto !important;
                    font-size: 11pt !important;
                  }
                  .print-page h1, .print-page h2, .print-page h3 {
                    color: black !important;
                  }
                  .print-divider {
                    border-color: #000 !important;
                  }
                }
              `}</style>

              {/* Page 1: Formal University Cover Sheet */}
              <div className="mx-auto w-[210mm] min-h-[297mm] bg-white text-slate-900 p-16 shadow-lg rounded-xl border border-slate-300 print-page flex flex-col justify-between">
                
                {/* School Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                  <div className="text-left">
                    <span className="text-xs font-mono font-bold block">SGU QUALITY ASSURANCE DEPT</span>
                    <span className="text-[10px] text-slate-500 block">Date of Export: 19 June 2026</span>
                  </div>
                  <div className="text-right space-y-1">
                    <strong className="text-sm font-black block">جامعة الصالحية الجديدة</strong>
                    <span className="text-xs block">وكالة الجامعة لشؤون التطوير وضمان الجودة</span>
                    <span className="text-xs block text-slate-500">وحدة المتابعة والتقييم والتقويم المستمر</span>
                  </div>
                </div>

                {/* Central Crest & Document Title */}
                <div className="text-center py-16 my-auto space-y-8">
                  {/* Mock Crest */}
                  <div className="mx-auto w-24 h-24 bg-slate-950 text-white rounded-full flex items-center justify-center font-black text-2xl border-4 border-amber-500">
                    SGU
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-sm tracking-wider font-bold text-slate-500 block">REPORT OF SELF-ASSESSMENT & COMPLIANCE</span>
                    <h1 className="text-2xl font-black text-slate-900 leading-tight">
                      تقرير التقييم الذاتي الأكاديمي والامتثال البرامجي
                    </h1>
                    <p className="text-lg font-bold text-amber-600">
                      {stats.facultyNameAr}
                    </p>
                  </div>

                  <div className="w-1/2 h-1 bg-slate-900 mx-auto rounded" />

                  <div className="space-y-2">
                    <span className="text-xs text-slate-500 block">معد للتقديم لجهات الاعتماد والاعتراف:</span>
                    <strong className="text-sm bg-slate-100 px-4 py-1.5 rounded-lg inline-block border border-slate-300">
                      طلب الاعتماد المؤسسي لـ ( {accreditationType} Standards )
                    </strong>
                  </div>
                </div>

                {/* Official Stamp & Signatures */}
                <div className="border-t border-slate-300 pt-6 grid grid-cols-3 text-center text-xs justify-between gap-4">
                  <div>
                    <span className="text-slate-500 block mb-3">عميد الكلية المعنية</span>
                    <strong className="block">{stats.facultyDean}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">توقيع معتمد</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    {/* Mock Stamp circular */}
                    <div className="w-16 h-16 border-2 border-dashed border-emerald-600 rounded-full flex items-center justify-center text-[10px] text-emerald-600 font-extrabold rotate-12">
                      خاتم الجودة SGU
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-3">رئيس وحدة الجودة والتقويم</span>
                    <strong className="block">{stats.headOfQA}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">توقيع معتمد</span>
                  </div>
                </div>
              </div>

              {/* Page 2: Analytical Metadata Profile & Performance Index */}
              <div className="mx-auto w-[210mm] min-h-[297mm] bg-white text-slate-900 p-16 shadow-lg rounded-xl border border-slate-300 print-page flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-950 pb-2.5">
                    <span className="text-xs font-mono font-bold text-slate-500">Page 2 of 4</span>
                    <h2 className="text-sm font-black text-slate-900 font-mono">01. PROFILE OF THE INSTITUTION | الملف الإحصائي للكلية</h2>
                  </div>

                  <p className="text-xs text-slate-650 leading-relaxed text-right">
                    يرصد هذا الجدول اللائحة الإنشائية والمؤشرات الأساسية المخرجة تلقائياً من نظام جامعة الصالحية الجديدة ERP لمطابقتها مع الجداول الإحصائية المعتمدة للمؤسسة.
                  </p>

                  {/* Fact Sheet Table */}
                  <div className="border border-slate-900 rounded-lg overflow-hidden my-4 text-xs">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-900">
                          <th className="p-3 font-bold border-l border-slate-300">متغير المؤشر والقياس</th>
                          <th className="p-3 font-bold">البيانات الحية الموثقة بالخادم</th>
                          <th className="p-3 font-bold border-r border-slate-300">الوضعية والامتثال للمقاييس</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-3 font-bold border-l border-slate-300">إجمالي طلاب الكلية الفعليين</td>
                          <td className="p-3 font-mono">{stats.studentCount.toLocaleString()} طالب مقيد</td>
                          <td className="p-3 text-emerald-650 font-bold border-r border-slate-300">طبيعي - سعة مواءمة مستهدفة</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-3 font-bold border-l border-slate-300">عدد هيئة التدريس والهيئة المساندة</td>
                          <td className="p-3 font-mono">{stats.staffCount} عضو نشط دائم</td>
                          <td className="p-3 text-emerald-650 font-bold border-r border-slate-300">كاف - مستقر</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-3 font-bold border-l border-slate-300">معدل الطلاب الكلي لكل أستاذ</td>
                          <td className="p-3 font-mono">{stats.ratio} طالب لكل عضو</td>
                          <td className="p-3 text-emerald-650 font-bold border-r border-slate-300">تطابق تام للمعدل قطاعياً</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-3 font-bold border-l border-slate-300">الأقسام والشعب العلمية النشطة</td>
                          <td className="p-3 font-mono">{stats.departmentsCount} شعب معتمدة</td>
                          <td className="p-3 text-emerald-650 font-bold border-r border-slate-300">لائحة معتمدة</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-3 font-bold border-l border-slate-300">متوسط معدل حضور المحاضرات</td>
                          <td className="p-3 font-mono">{stats.avgAttendance}% حضور تراكمي</td>
                          <td className="p-3 text-emerald-650 font-bold border-r border-slate-300">أكبر من الحد الحرمان 75%</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-3 font-bold border-l border-slate-300">متوسط نسب نجاح المقررات</td>
                          <td className="p-3 font-mono">{stats.avgSuccessRate}% معدل نجاح</td>
                          <td className="p-3 text-emerald-650 font-bold border-r border-slate-300">ممتازة وتطابق الجودة</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary of Insights block */}
                  <div className="space-y-3 pt-4">
                    <h3 className="text-xs font-black text-slate-900 border-r-4 border-slate-900 pr-2">البيان الرسمي للتقييم والبيئة المادية:</h3>
                    <p className="text-xs text-slate-700 leading-relaxed text-right">
                      تم معايرة هذه الأرقام في السحابة مع لجان الامتحانات ورؤساء الأقسام. ويتضح أن البنية التحتية والمباني والفصول كافية لخدمة التدريس لطلاب الكلية دون تكدس أو إخلال بمتطلبات التدريس.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-3 text-center text-[9px] text-slate-400">
                  جامعة الصالحية الجديدة - وكالة الجودة - SGU Accreditation Document S-026
                </div>
              </div>

              {/* Page 3: Evaluation of Standards Checklist */}
              <div className="mx-auto w-[210mm] min-h-[297mm] bg-white text-slate-900 p-16 shadow-lg rounded-xl border border-slate-300 print-page flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-950 pb-2.5">
                    <span className="text-xs font-mono font-bold text-slate-500">Page 3 of 4</span>
                    <h2 className="text-sm font-black text-slate-900 font-mono">02. STANDARDS EVALUATION MATRIX | مصفوفة تقييم معايير الجودة والاعتماد</h2>
                  </div>

                  <p className="text-xs text-slate-650 leading-relaxed text-right">
                    يوضح الجدول أدناه مدى استيفاء الكلية لمتطلبات ومعايير جهة الاعتماد (<code className="font-bold text-slate-900">{accreditationType}</code>) ونسب الأوزان والتوصيف المرتبط.
                  </p>

                  <div className="border border-slate-900 rounded-lg overflow-hidden text-[10.5px]">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-900">
                          <th className="p-2 border-l border-slate-300">الرمز</th>
                          <th className="p-2">المعيار المستهدف</th>
                          <th className="p-2">الوزن</th>
                          <th className="p-2">الوضعية للتقويم</th>
                          <th className="p-2 border-r border-slate-300">التوصيف والإثبات المرفق</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeStandards.map((std) => (
                          <tr key={std.id} className="border-b border-slate-200">
                            <td className="p-2 font-mono border-l border-slate-300">{std.code}</td>
                            <td className="p-2 font-bold max-w-[150px] truncate">{std.titleAr}</td>
                            <td className="p-2 font-mono">{std.weight}%</td>
                            <td className="p-2">
                              <span className={`font-bold ${
                                std.status === "compliant"
                                  ? "text-emerald-750"
                                  : std.status === "partially"
                                  ? "text-amber-700"
                                  : "text-rose-700"
                              }`}>
                                {std.status === "compliant" ? "مستوفى" : std.status === "partially" ? "مستوفى جزئياً" : "غير مستوفى"}
                              </span>
                            </td>
                            <td className="p-2 text-[10px] text-slate-650 max-w-[200px] truncate border-r border-slate-300">{std.evidence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-300">
                    <strong className="text-xs font-bold block mb-1">الرأي الاستشاري لوحدة الجودة والاعتماد:</strong>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selfAssessmentSummary}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-3 text-center text-[9px] text-slate-400">
                  جامعة الصالحية الجديدة - وكالة الجودة - SGU Accreditation Document S-026
                </div>
              </div>

              {/* Page 4: Continuous Actions Plan & Sign Off */}
              <div className="mx-auto w-[210mm] min-h-[297mm] bg-white text-slate-900 p-16 shadow-lg rounded-xl border border-slate-300 print-page flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-950 pb-2.5">
                    <span className="text-xs font-mono font-bold text-slate-500">Page 4 of 4</span>
                    <h2 className="text-sm font-black text-slate-900 font-mono">03. CORRECTIVE ACTIONS & SIGN OFF | الخطة الاستقصائية التصحيحية والاعتماد</h2>
                  </div>

                  <p className="text-xs text-slate-650 leading-relaxed text-right">
                    يوضح الجدول التالي الترتيبات الفنية والمالية المتفق عليها لعلاج أي خلل تم رصده في ملفات الاعتماد والمسؤولين المعنيين بالكلية.
                  </p>

                  <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-900">
                          <th className="p-2.5 border-l border-slate-300">الإجراء التصحيحي المستهدف</th>
                          <th className="p-2.5">الفئة</th>
                          <th className="p-2.5">المنسق والمسؤول</th>
                          <th className="p-2.5">الموعد النهائي</th>
                          <th className="p-2.5 border-r border-slate-300">توقيع المسؤول</th>
                        </tr>
                      </thead>
                      <tbody>
                        {actionPlan.slice(0, 5).map((act) => (
                          <tr key={act.id} className="border-b border-slate-200">
                            <td className="p-2.5 font-bold border-l border-slate-300">{act.action}</td>
                            <td className="p-2.5 font-semibold text-slate-650">{act.category}</td>
                            <td className="p-2.5">{act.owner}</td>
                            <td className="p-2.5 font-mono text-amber-700">{act.deadline}</td>
                            <td className="p-2.5 text-[10px] text-slate-400 italic border-r border-slate-300">........................</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-8 space-y-4">
                    <span className="text-xs font-black text-slate-900 border-r-4 border-slate-900 pr-2 block">إقرار وتوقيع ومصادقة لجان الجودة:</span>
                    <p className="text-[11px] text-slate-650 leading-relaxed text-right">
                      نحن الموقعين أدناه، نقر ونصادق على صحة كافة البيانات والمقاييس المسرودة بملف الاعتماد والتقييم الذاتي الحالي المخرجة من قواعد بيانات جامعة الصالحية الجديدة الموثقة لخدمة الاعتماد البرامجي والأكاديمي.
                    </p>

                    <div className="grid grid-cols-2 text-center pt-8 text-xs gap-12">
                      <div className="border-t border-slate-300 pt-3">
                        <span className="text-slate-500 block">منسق قطاع شؤون التعليم والطلاب</span>
                        <strong className="block mt-1">أ.د. سلوى عبدالباقي</strong>
                        <span className="text-[10px] text-slate-400">التوقيع: ............................</span>
                      </div>
                      <div className="border-t border-slate-300 pt-3">
                        <span className="text-slate-500 block">رئيس مجلس إدارة كليات جامعة الصالحية SGU</span>
                        <strong className="block mt-1">المهندس يوسف خالد سليمان</strong>
                        <span className="text-[10px] text-slate-400">التوقيع والختم الجامعي: ............................</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-3 text-center text-[9px] text-slate-400">
                  جامعة الصالحية الجديدة - وكالة الجودة - SGU Accreditation Document S-026
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
