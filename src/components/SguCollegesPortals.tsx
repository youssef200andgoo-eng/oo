import React, { useState, useMemo } from "react";
import {
  HeartPulse,
  Activity,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Building,
  Users,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  DollarSign,
  Settings,
  Layers,
  ArrowRight,
  RefreshCw,
  Award,
  Code,
  Sparkles,
  Database,
  Lock,
  Check,
  ShieldCheck,
  HelpCircle,
  Thermometer,
  Zap,
  Cpu,
  Wrench,
  BarChart2
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Interfaces and Prop definitions
interface SguCollegesPortalsProps {
  student: any;
  setStudent: React.Dispatch<React.SetStateAction<any>>;
  addLog: (msg: string) => void;
  coursesByCollege: Record<string, any[]>;
  setCourses: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function SguCollegesPortals({
  student,
  setStudent,
  addLog,
  coursesByCollege,
  setCourses
}: SguCollegesPortalsProps) {

  // Current selected college system tab
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("fcis");

  // Notification Toast state
  const [portalToast, setPortalToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setPortalToast(msg);
    setTimeout(() => setPortalToast(null), 3500);
  };

  // Shared Central Database Sync State
  const [dbSyncStatus, setDbSyncStatus] = useState<"synced" | "syncing" | "idle">("synced");
  const triggerDbSync = () => {
    setDbSyncStatus("syncing");
    addLog(`مزامنة قواعد البيانات البينية لكليات SGU مع الخادم المركزي...`);
    setTimeout(() => {
      setDbSyncStatus("synced");
      showToast("تم مزامنة بيانات الكلية الحالية مع قاعدة البيانات المركزية لجامعة الصالحية بنجاح!");
    }, 1500);
  };

  // List of the 7 Accredited Colleges inside SGU
  const collegeSystems = [
    {
      id: "fcis",
      name: "كلية الحاسبات والمعلومات",
      systemName: "منظومة الحاسبات المتطورة والذكاء الاصطناعي (SGU AI & DevLab Sandbox)",
      accreditation: "NAQAAE & ABET Certified",
      themeColor: "from-emerald-505/10 to-teal-500/5 hover:border-emerald-500/40",
      accentText: "text-emerald-400",
      accentBg: "bg-emerald-500/10 border-emerald-504/30",
      icon: Code,
      slots: 1450,
      activeProjects: 48,
    },
    {
      id: "med",
      name: "كلية الطب البشري",
      systemName: "المنصة السريرية ونظام الكنترول الطبي (OSCE Medical Hub)",
      accreditation: "NAQAAE Certified - Hospital Connected",
      themeColor: "from-blue-500/10 to-indigo-500/5 hover:border-blue-500/40",
      accentText: "text-blue-400",
      accentBg: "bg-blue-500/10 border-blue-500/30",
      icon: HeartPulse,
      slots: 980,
      activeProjects: 32,
    },
    {
      id: "den",
      name: "كلية طب الأسنان",
      systemName: "مركز طب وجراحة الأسنان وعيادات كاد-كام (3D Dental CAD-CAM)",
      accreditation: "NAQAAE Certified - Live Clinics",
      themeColor: "from-purple-500/10 to-fuchsia-500/5 hover:border-purple-500/40",
      accentText: "text-purple-400",
      accentBg: "bg-purple-500/10 border-purple-500/30",
      icon: ShieldCheck,
      slots: 750,
      activeProjects: 29,
    },
    {
      id: "phr",
      name: "كلية الصيدلة",
      systemName: "نظام تصنيع الجرعات الدوائية والتحليل الإكلينيكي (PharmD Formulation)",
      accreditation: "PharmD - International Accredited",
      themeColor: "from-amber-500/10 to-orange-500/5 hover:border-amber-500/40",
      accentText: "text-amber-400",
      accentBg: "bg-amber-500/10 border-amber-500/30",
      icon: Award, 
      slots: 1100,
      activeProjects: 24,
    },
    {
      id: "pt",
      name: "كلية العلاج الطبيعي",
      systemName: "مخطط التأهيل الحركي والتحليل المفصلي (Kinesiology Rehab Planner)",
      accreditation: "Certified - Sports & Ortho Tracker",
      themeColor: "from-sky-500/10 to-cyan-500/5 hover:border-sky-500/40",
      accentText: "text-sky-400",
      accentBg: "bg-sky-500/10 border-sky-500/30",
      icon: Activity,
      slots: 850,
      activeProjects: 18,
    },
    {
      id: "nur",
      name: "كلية التمريض",
      systemName: "شاشة رعاية الحالات الحرجة ومراقبة المرضى (ICU Critical Care Console)",
      accreditation: "Hospital Accredited - Emergency Deck",
      themeColor: "from-rose-500/10 to-pink-500/5 hover:border-rose-500/40",
      accentText: "text-rose-400",
      accentBg: "bg-rose-500/10 border-rose-500/30",
      icon: Clock, 
      slots: 640,
      activeProjects: 15,
    },
    {
      id: "eng",
      name: "كلية الهندسة والتكنولوجيا",
      systemName: "مختبر التصميم الذكي والمحاكاة الهندسية (SGU CAD-Simulation Lab)",
      accreditation: "FEANI Standards - Smart Grid Ready",
      themeColor: "from-orange-500/10 to-red-500/5 hover:border-orange-500/40",
      accentText: "text-orange-400",
      accentBg: "bg-orange-500/10 border-orange-500/30",
      icon: Wrench,
      slots: 1250,
      activeProjects: 62,
    }
  ];

  // ==========================================
  // SHARED STATES FOR RESOURCE MANAGERS (PER COLLEGE)
  // ==========================================
  const [academicData, setAcademicData] = useState<Record<string, {
    students: any[];
    professors: any[];
    grades: any[];
    finance: any[];
    books: any[];
  }>>({
    fcis: {
      students: [
        { id: "S-1001", name: "يوسف أحمد كمال", level: "المستوى الرابع", gpa: 3.82, status: "Active", project: "AI Agent in ERP" },
        { id: "S-1002", name: "كريم محمد هاني", level: "المستوى الثالث", gpa: 3.45, status: "Active", project: "Distributed Blockchain Storage" },
        { id: "S-1003", name: "إسلام يحيى فوزي", level: "المستوى الرابع", gpa: 2.91, status: "On Probation", project: "NFC Smart Attendance" }
      ],
      professors: [
        { id: "D-101", name: "أ.د. عادل توفيق غنيم", specialty: "معالجة اللغات الطبيعية NLP", hours: 14, status: "Active" },
        { id: "D-102", name: "د. هدى صبري الجيار", specialty: "الشبكات الذكية والأمن السيبراني", hours: 18, status: "Active" }
      ],
      grades: [
        { subject: "الذكاء الاصطناعي", code: "CS-401", examGrade: 88, practical: 28, final: 91, grade: "A" },
        { subject: "هندسة البرمجيات", code: "SE-402", examGrade: 92, practical: 29, final: 95, grade: "A+" }
      ],
      finance: [
        { id: "F-101", amount: 45000, paid: 45000, remaining: 0, status: "Paid", method: "Paymob credit" }
      ],
      books: [
        { id: "b-101", title: "Artificial Intelligence: A Modern Approach", author: "Russell & Norvig", copiesAvailable: 3, isbn: "978-0136" }
      ]
    },
    med: {
      students: [
        { id: "S-2001", name: "أحمد أشرف الشناوي", level: "المستوى السادس", gpa: 3.91, status: "Active", project: "OSCE Case Simulation" },
        { id: "S-2002", name: "دنيا مصطفى فهمي", level: "المستوى الخامس", gpa: 3.62, status: "Active", project: "Emergency triage guidelines" }
      ],
      professors: [
        { id: "D-201", name: "أ.د. حاتم صبري المنشاوي", specialty: "جراحة القلب والأوعية الدموية", hours: 22, status: "Active" },
        { id: "D-202", name: "أ.د. مها محمود زهران", specialty: "علم التشريح والأنسجة والخلية", hours: 16, status: "Active" }
      ],
      grades: [
        { subject: "علم وظائف الأعضاء (Physiology)", code: "MED-302", examGrade: 84, practical: 27, final: 87, grade: "B+" },
        { subject: "الجراحة العامة الإكلينيكية", code: "MED-501", examGrade: 91, practical: 29, final: 93, grade: "A" }
      ],
      finance: [
        { id: "F-201", amount: 75000, paid: 50000, remaining: 25000, status: "Partial", method: "Bank Transfer" }
      ],
      books: [
        { id: "b-201", title: "Gray's Anatomy for Students", author: "Richard Drake", copiesAvailable: 2, isbn: "978-0702" }
      ]
    },
    den: {
      students: [
        { id: "S-3001", name: "مي جلال الشافعي", level: "المستوى الخامس", gpa: 3.74, status: "Active", project: "Crown Milling Accuracy" },
        { id: "S-3002", name: "عمرو شيرين البدري", level: "المستوى الثالث", gpa: 3.22, status: "Active", project: "Root canal endodontics demo" }
      ],
      professors: [
        { id: "D-301", name: "أ.د. علاء توفيق السعيد", specialty: "الاستعاضة الصناعية وزراعة الأسنان", hours: 18, status: "Active" },
        { id: "D-302", name: "د. هبة عبد المنعم الشريف", specialty: "علاج الجذور والتحضير الرقمي", hours: 20, status: "Active" }
      ],
      grades: [
        { subject: "المواد السنية وتكنولوجيا تركيبها", code: "DEN-201", examGrade: 78, practical: 26, final: 81, grade: "B" },
        { subject: "جراحة الوجه والفكين وتطبيقاتها", code: "DEN-402", examGrade: 85, practical: 28, final: 89, grade: "A" }
      ],
      finance: [
        { id: "F-301", amount: 65000, paid: 65000, remaining: 0, status: "Paid", method: "Stripe Payment" }
      ],
      books: [
        { id: "b-301", title: "Textbook of Operative Dentistry", author: "Nisha Garg", copiesAvailable: 4, isbn: "978-9350" }
      ]
    },
    phr: {
      students: [
        { id: "S-4001", name: "شريف وائل عبد النبي", level: "المستوى الثالث", gpa: 3.51, status: "Active", project: "PharmD Liposomal formulation" },
        { id: "S-4002", name: "سلوى عماد فكري", level: "المستوى الرابع", gpa: 3.88, status: "Active", project: "Bio-equivalence Study" }
      ],
      professors: [
        { id: "D-401", name: "أ.د. رأفت ضياء غبور", specialty: "الصيدلانيات وتصنيع الدواء المستدام", hours: 12, status: "Active" },
        { id: "D-402", name: "د. نادية عبدالحميد سليم", specialty: "علم الأدوية الإكلينيكي والسموم", hours: 18, status: "Active" }
      ],
      grades: [
        { subject: "الصيدلانيات الفيزيائية والكينماتيكا", code: "PHR-301", examGrade: 82, practical: 28, final: 86, grade: "A-" },
        { subject: "الكيمياء العضوية الصيدلية", code: "PHR-202", examGrade: 90, practical: 30, final: 92, grade: "A" }
      ],
      finance: [
        { id: "F-401", amount: 55000, paid: 55000, remaining: 0, status: "Paid", method: "Fawry Gateway" }
      ],
      books: [
        { id: "b-401", title: "Martin's Physical Pharmacy", author: "Patrick J. Sinko", copiesAvailable: 2, isbn: "978-1451" }
      ]
    },
    pt: {
      students: [
        { id: "S-5001", name: "مريم يسري قطب", level: "المستوى الثالث", gpa: 3.65, status: "Active", project: "Knee flexion recovery" },
        { id: "S-5002", name: "محمود زكي قورة", level: "المستوى الثاني", gpa: 3.10, status: "Active", project: "Gait bio-mechanics analysis" }
      ],
      professors: [
        { id: "D-501", name: "أ.د. عثمان رأفت النمكي", specialty: "إصابات الملاعب والتأهيل العضلي", hours: 16, status: "Active" },
        { id: "D-502", name: "د. رانيا منجي العادلي", specialty: "العلاج الطبيعي للأمراض العصبية", hours: 15, status: "Active" }
      ],
      grades: [
        { subject: "ميكانيكا الحركة البشرية والبيوميكانيكس", code: "PT-202", examGrade: 87, practical: 27, final: 90, grade: "A" },
        { subject: "الوسائل الكهربائية لتقليل الألم العضلي", code: "PT-303", examGrade: 75, practical: 25, final: 78, grade: "C+" }
      ],
      finance: [
        { id: "F-501", amount: 48000, paid: 40000, remaining: 8000, status: "Partial", method: "Bank Transfer" }
      ],
      books: [
        { id: "b-501", title: "Brunnstrom's Clinical Kinesiology", author: "Peggy A. Houglum", copiesAvailable: 5, isbn: "978-0803" }
      ]
    },
    nur: {
      students: [
        { id: "S-6001", name: "رانيا سليم الشلقامي", level: "المستوى الثاني", gpa: 3.42, status: "Active", project: "ICU Alert response times" },
        { id: "S-6002", name: "خالد مراد البنا", level: "المستوى الأول", gpa: 2.80, status: "Active", project: "Neonatal emergency care" }
      ],
      professors: [
        { id: "D-601", name: "أ.د. صفاء صفي الدين شاهين", specialty: "تمريض العناية المركزة والحالات الحرجة", hours: 20, status: "Active" },
        { id: "D-602", name: "د. سامية عبد الهادي غانم", specialty: "تمريض صحة الأمومة والطفل الرضيع", hours: 18, status: "Active" }
      ],
      grades: [
        { subject: "أساسيات التمريض الميداني", code: "NUR-101", examGrade: 90, practical: 29, final: 92, grade: "A" },
        { subject: "تمريض البالغين والرعاية المركزة 1", code: "NUR-202", examGrade: 83, practical: 28, final: 86, grade: "B+" }
      ],
      finance: [
        { id: "F-601", amount: 32000, paid: 32000, remaining: 0, status: "Paid", method: "Vodafone Cash" }
      ],
      books: [
        { id: "b-601", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing", author: "Janice L. Hinkle", copiesAvailable: 3, isbn: "978-1451" }
      ]
    },
    eng: {
      students: [
        { id: "S-7001", name: "عبدالرحمن أشرف بهجت", level: "المستوى الرابع", gpa: 3.71, status: "Active", project: "3D Finite Element Simulator" },
        { id: "S-7002", name: "مينا رفيق جرجس", level: "المستوى الثالث", gpa: 3.48, status: "Active", project: "Smart Grid Power distribution" }
      ],
      professors: [
        { id: "D-701", name: "أ.د. يسري طارق عبد الحميد", specialty: "الهندسة الإنشائية ومقاومة المواد", hours: 16, status: "Active" },
        { id: "D-702", name: "د. مصطفى أمين الشربيني", specialty: "هندسة القوى الكهربائية والطاقة المتجددة", hours: 18, status: "Active" }
      ],
      grades: [
        { subject: "ميكانيكا السوائل والهيدروليكا", code: "ENG-201", examGrade: 85, practical: 28, final: 88, grade: "A-" },
        { subject: "التحليل الإنشائي ثلاثي الأبعاد", code: "ENG-302", examGrade: 89, practical: 29, final: 93, grade: "A" }
      ],
      finance: [
        { id: "F-701", amount: 50000, paid: 50000, remaining: 0, status: "Paid", method: "Paymob credit" }
      ],
      books: [
        { id: "b-701", title: "Vector Mechanics for Engineers: Statics", author: "Ferdinand Beer", copiesAvailable: 3, isbn: "978-0073" }
      ]
    }
  });

  // Resource input actions states
  const [newStudName, setNewStudName] = useState("");
  const [newStudRank, setNewStudRank] = useState("المستوى الأول");
  const [newStudGpa, setNewStudGpa] = useState("3.00");
  const [newStudProject, setNewStudProject] = useState("");

  const handleAddAcademicStudent = (collegeId: string) => {
    if (!newStudName.trim()) return;
    const sGpa = parseFloat(newStudGpa) || 3.00;
    const newStud = {
      id: `S-${Math.floor(1004 + Math.random() * 8000)}`,
      name: newStudName,
      level: newStudRank,
      gpa: sGpa,
      status: "Active",
      project: newStudProject || "SGU Applied Research Program"
    };

    setAcademicData(prev => ({
      ...prev,
      [collegeId]: {
        ...prev[collegeId],
        students: [newStud, ...prev[collegeId].students]
      }
    }));
    setNewStudName("");
    setNewStudProject("");
    addLog(`إدراج طالب أكاديمي جديد بنظام كلية ${collegeId.toUpperCase()}: ${newStudName}`);
    showToast(`تم إدراج الطالب ومزامنة سجله الأكاديمي مع الكلية!`);
  };

  const handleDeleteAcademicStudent = (collegeId: string, studentId: string, name: string) => {
    setAcademicData(prev => ({
      ...prev,
      [collegeId]: {
        ...prev[collegeId],
        students: prev[collegeId].students.filter(s => s.id !== studentId)
      }
    }));
    addLog(`شطب أو إيقاف قيد الطالب ${name} بنظام كلية ${collegeId.toUpperCase()}`);
    showToast("تم إيقاف قيد الطالب وتجميد سجله الأكاديمي.");
  };

  // ==========================================
  // SYSTEM 1: COMPUTERS & AI (fcis)
  // ==========================================
  const [codeInputValue, setCodeInputValue] = useState<string>(
    `# SGU Cognitive Computing Service v1.0\n# Calculating student admission risk scores...\n\ndef calculate_risk(gpa, completed_hours):\n    risk_score = 100 - (gpa * 20) - (completed_hours * 0.15)\n    return max(0, min(100, risk_score))\n\nprint("SGU Risk Analysis Report:")\nprint("Student Youssef Ahmed: ", calculate_risk(3.82, 94), "%")`
  );
  const [codeOutput, setCodeOutput] = useState<string>(
    "SGU Risk Analysis Report:\nStudent Youssef Ahmed: 9.5 % (Low Academic Risk)\n\nProcess finished with exit code 0"
  );
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [epochProgress, setEpochProgress] = useState<number>(30);
  const [aiPromptMsg, setAiPromptMsg] = useState<string>("تلخيص متطلبات القيد لكلية الحاسبات");
  const [aiReply, setAiReply] = useState<string>("طبقاً للائحة لعام 2026، يشترط للاستمرار في مسار بكالوريوس البرمجيات والأنظمة الذكية اجتياز 136 ساعة معتمدة بمعدل تراكمي لا يقل عن 2.00.");

  const [aiLog, setAiLog] = useState<string[]>([
    "INFO: GPU cluster initialized: NVIDIA RTX L40S x 4 nodes online.",
    "SUCCESS: Model SGU_AIMS_GEN2 successfully validated. Accuracy rate: 97.42%."
  ]);

  const runCodeCompiler = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      let output = "";
      if (codeInputValue.includes("def calculate_risk")) {
        output = "SGU Risk Analysis Report:\nStudent Youssef Ahmed: 9.5 % (Low Academic Risk)\n\n-- System Log: Verified student status --\nProcess finished with exit code 0";
      } else {
        output = `Executed code at SGU-Cloud:\n${codeInputValue.substring(0, 100)}...\n\nProcess completed successfully at ${new Date().toLocaleTimeString()}`;
      }
      setCodeOutput(output);
      addLog("تشغيل محاكي الكود السحابي في كلية الحاسبات.");
      showToast("تم الانتهاء من تصريف وتحليل الكود!");
    }, 1200);
  };

  const handleSendAiPrompt = () => {
    if (!aiPromptMsg.trim()) return;
    addLog(`استعلام المساعد الأكاديمي للذكاء الاصطناعي بكلية الحاسبات: ${aiPromptMsg}`);
    setTimeout(() => {
      if (aiPromptMsg.includes("تلخيص") || aiPromptMsg.includes("قيد")) {
        setAiReply("متطلبات الكلية المعتمدة تشمل: 136 ساعة دراسية، إتمام مشروع تخرج متكامل على مدار فصلين دراسيين، واجتياز تدريب صيفي ميداني في إحدى الشركات الموثقة لـ 6 أسابيع.");
      } else if (aiPromptMsg.includes("gpa") || aiPromptMsg.includes("معدل")) {
        setAiReply("معدل الطالب الحالي 3.82 ممتاز ويندرج تحت مرتبة الشرف الأولى المعتمدة من مجلس الكلية بالصالحية.");
      } else {
        setAiReply(`بخصوص "${aiPromptMsg}"، تم رصد هذا المفهوم في اللائحة الأكاديمية لكلية الحاسبات SGU. ينصح بمراجعة الفصل 4 الخاص بالتدريب الميداني والشبكات الذكية.`);
      }
      showToast("تم توليد الرد الذكي المعتمد!");
    }, 500);
  };

  // ==========================================
  // SYSTEM 2: HUMAN MEDICINE (med)
  // ==========================================
  const initialPatientRecords = [
    { id: "P-101", name: "محمود حسن سلامة", gender: "ذكر", age: 54, symptom: "ألم صدر حاد ممتد للمرفق الأيسر", diagnosis: "احتشاء عضلة القلب الحاد (STEMI)", status: "Critical", ward: "العناية المركزة القلبية (CCU)" },
    { id: "P-102", name: "فاطمة عبدالمحسن الخطيب", gender: "أنثى", age: 67, symptom: "ضيق تنفس تدريجي واستسقاء حاد", diagnosis: "فشل القلب الاحتقاني المزمن (CHF)", status: "Active", ward: "الباطنة العامة" },
    { id: "P-103", name: "كرم سمير الجيار", gender: "ذكر", age: 29, symptom: "ألم في الربع السفلي الأيمن من البطن", diagnosis: "التهاب الزائدة الدودية الحاد", status: "In Surgery", ward: "جراحة الطوارئ" }
  ];
  const [patients, setPatients] = useState(initialPatientRecords);
  const [newPatName, setNewPatName] = useState("");
  const [newPatSymptom, setNewPatSymptom] = useState("");
  const [newPatDiag, setNewPatDiag] = useState("نزلة معوية حادة");
  const [newPatWard, setNewPatWard] = useState("الباطنة العامة");

  const [simulationVitals, setSimulationVitals] = useState({
    hr: 75,
    bpSystolic: 120,
    bpDiastolic: 80,
    spo2: 98
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName.trim() || !newPatSymptom.trim()) return;
    const p = {
      id: `P-${Math.floor(104 + Math.random() * 99)}`,
      name: newPatName,
      gender: Math.random() > 0.5 ? "ذكر" : "أنثى",
      age: Math.floor(18 + Math.random() * 65),
      symptom: newPatSymptom,
      diagnosis: newPatDiag,
      status: "Active",
      ward: newPatWard
    };
    setPatients([...patients, p]);
    setNewPatName("");
    setNewPatSymptom("");
    addLog(`تسجيل مريض قرين بالعيادة السريرية لكلية الطب: ${newPatName}`);
    showToast("تم إدراج المريض ومحاكاة جدول رصد OSCE.");
  };

  const updateVitals = (key: string, val: number) => {
    setSimulationVitals(prev => ({ ...prev, [key]: val }));
  };

  const isVitalsSafe = useMemo(() => {
    const { hr, bpSystolic, spo2 } = simulationVitals;
    if (hr < 50 || hr > 110) return false;
    if (bpSystolic < 90 || bpSystolic > 145) return false;
    if (spo2 < 93) return false;
    return true;
  }, [simulationVitals]);

  // ==========================================
  // SYSTEM 3: DENTISTRY (den)
  // ==========================================
  const initialTeethState = [
    { number: 11, label: "ثنية علوية يمنى", status: "Healthy" },
    { number: 12, label: "رباعية علوية يمنى", status: "Cavity" },
    { number: 13, label: "ناب علوي أيمن", status: "Healthy" },
    { number: 14, label: "ضاحك أول علوي أيمن", status: "Root Canal" },
    { number: 15, label: "ضرس أول علوي أيمن", status: "Extracted" },
    { number: 21, label: "ثنية علوية يسرى", status: "Healthy" },
    { number: 22, label: "رباعية علوية يسرى", status: "Cavity" }
  ];

  const [teeth, setTeeth] = useState(initialTeethState);
  const [selectedTooth, setSelectedTooth] = useState<any>(initialTeethState[1]);
  const [millingMaterial, setMillingMaterial] = useState<string>("الزركونيا الصلبة (Zirconia Premium)");
  const [isCADMilling, setIsCADMilling] = useState<boolean>(false);
  const [cadStatusMsg, setCadStatusMsg] = useState<string | null>(null);

  const handleUpdateToothStatus = (newStat: string) => {
    if (!selectedTooth) return;
    const updated = teeth.map(t =>
      t.number === selectedTooth.number ? { ...t, status: newStat } : t
    );
    setTeeth(updated);
    setSelectedTooth({ ...selectedTooth, status: newStat });
    addLog(`تعديل تشخيص السن رقم ${selectedTooth.number} ليكون: ${newStat}`);
    showToast(`تم حفظ تعديل السن ${selectedTooth.number} بملف المريض الرقمي CAD-CAM.`);
  };

  const startCADMillingSim = () => {
    setIsCADMilling(true);
    setCadStatusMsg("جاري تشغيل مخرطة الكاد كام ونمذجة السن ثلاثي الأبعاد...");
    setTimeout(() => {
      setIsCADMilling(false);
      setCadStatusMsg(`✅ اكتملت تفريز التاج السني بنجاح! الخامة: ${millingMaterial}. مطابقة الحواف: 99.8%. السن جاهز للتجربة السريرية للمريض.`);
      addLog(`تشغيل خراط كاد كام CAD-CAM لسن ورسم التاج بخامة ${millingMaterial}`);
      showToast("اكتملت التفريز الرقمي للزركونيا!");
    }, 2000);
  };

  // ==========================================
  // SYSTEM 4: PHARMACY (phr)
  // ==========================================
  const [compoundA, setCompoundA] = useState<string>("بنزيل بنزوات (Benzyl Benzoate)");
  const [compoundB, setCompoundB] = useState<string>("جليسرول مائي (Glycerol Base)");
  const [compDensity, setCompDensity] = useState<number>(1.25);
  const [compTemperature, setCompTemperature] = useState<number>(37.5);
  const [isFormulating, setIsFormulating] = useState<boolean>(false);
  const [formulationResult, setFormulationResult] = useState<any | null>(null);

  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);
  const [dosageRatePerKg, setDosageRatePerKg] = useState<number>(15); // mg/kg

  const handleFormulate = () => {
    setIsFormulating(true);
    setFormulationResult(null);
    setTimeout(() => {
      setIsFormulating(false);
      const isStable = compDensity < 2.0 && compTemperature <= 42;
      const res = {
        serial: `RX-${Math.floor(403 + Math.random() * 90)}`,
        name: `تركيبة SGU-${compoundA.split(" ")[0]}-${compoundB.split(" ")[0]}`,
        status: isStable ? "مستقرة وصالحة للتطبيق" : "غير مستقرة - خطر ترسب كيميائي",
        ph: (6.2 + Math.random() * 1.2).toFixed(2),
        isStable,
        dosageRecommend: `${((patientWeightKg * dosageRatePerKg) / 250).toFixed(1)} ملعقة قياس يومياً (تركيز 250مغ)`
      };
      setFormulationResult(res);
      addLog(`إعداد صيغة صيدلانية ناجحة من الكلية: ${res.name}`);
      showToast(isStable ? "تم تصنيع المركب وفحصه المخبري بنجاح!" : "تنبيه: فشل استقرار اختبار المحلول!");
    }, 1500);
  };

  // ==========================================
  // SYSTEM 5: PHYSICAL THERAPY (pt)
  // ==========================================
  const [kneeAngle, setKneeAngle] = useState<number>(75);
  const [hipAngle, setHipAngle] = useState<number>(90);
  const [sessionPatientName, setSessionPatientName] = useState<string>("أيمن عبد الفتاح بركات");

  const evaluationReport = useMemo(() => {
    let kneeEval = "مستقر ضمن نطاق الثني والمد العادي";
    if (kneeAngle < 60) kneeEval = "تقييد حاد في حركة الركبة - يحتاج تدليك عميق وتحريك سلبي";
    else if (kneeAngle > 115) kneeEval = "مرونة مثالية في مفصل الركبة - مناسب للمرحلة الرياضية المتقدمة";

    let hipEval = "حركة طبيعية ومطابقة للمعايير";
    if (hipAngle < 80) hipEval = "تصلب خفيف في مفصل الفخذ الخلفي";

    return { kneeEval, hipEval };
  }, [kneeAngle, hipAngle]);

  const handleUpdatePtNote = () => {
    addLog(`تحديث تشخيص التأهيل الطبي للمريض ${sessionPatientName}: زوايا الحركة رصدت Knee ${kneeAngle}°`);
    showToast("تم تحديث الفحص الميكانيكي وعلم الحركة بالمستند!");
  };

  // ==========================================
  // SYSTEM 6: NURSING (nur)
  // ==========================================
  const [icuHeartRate, setIcuHeartRate] = useState<number>(82);
  const [icuOxygen, setIcuOxygen] = useState<number>(97);
  const [icuTemperature, setIcuTemperature] = useState<number>(37.2);

  const icuStatusEvaluation = useMemo(() => {
    if (icuHeartRate < 50 || icuHeartRate > 120 || icuOxygen < 92 || icuTemperature > 39.0) {
      return { status: "CRITICAL ALERT", color: "text-rose-500 animate-pulse bg-rose-950/40 border-rose-500/40" };
    }
    if (icuHeartRate < 60 || icuHeartRate > 100 || icuOxygen < 95 || icuTemperature > 37.8) {
      return { status: "WARNING: CHECK VITALS", color: "text-amber-500 bg-amber-950/20 border-amber-500/30" };
    }
    return { status: "NORMAL CLINICAL STATE", color: "text-emerald-400 bg-emerald-950/20 border-emerald-500/30" };
  }, [icuHeartRate, icuOxygen, icuTemperature]);

  const [nursingChecklists, setNursingChecklists] = useState([
    { id: 1, task: "فحص ومطابقة الهوية الوطنية عبر NFC للمريض", done: true },
    { id: 2, task: "إعادة تعيين المحاليل وتفريغ كيس قسطرة البول", done: true },
    { id: 3, task: "أخذ عينات الدم الشرياني لفحص غازات الدم ABG", done: false },
    { id: 4, task: "فحص وتوثيق تقرح السرير للمريض كل 4 ساعات", done: false }
  ]);

  const toggleChecklist = (id: number) => {
    setNursingChecklists(
      nursingChecklists.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
    addLog("تعديل حالة مهام الرعاية التمريضية بملف المريض.");
  };

  // ==========================================
  // SYSTEM 7: ENGINEERING && TECH (eng)
  // ==========================================
  const [concreteLoadKns, setConcreteLoadKns] = useState<number>(450); // Concrete Load in Kilonewtons
  const [reinforceSteelD, setReinforceSteelD] = useState<number>(16); // Rebar steel diam in mm
  const [isSimulatingEngineering, setIsSimulatingEngineering] = useState<boolean>(false);
  const [engineeringResult, setEngineeringResult] = useState<any | null>(null);

  const [smartGridPowerMw, setSmartGridPowerMw] = useState<number>(14.5); // Grid power capacity MW
  const [gridFaultRelays, setGridFaultRelays] = useState<boolean>(false);

  const calculateEngineeringStrain = () => {
    setIsSimulatingEngineering(true);
    setTimeout(() => {
      setIsSimulatingEngineering(false);
      const crossArea = Math.PI * Math.pow(reinforceSteelD / 2000, 2); // area in m2
      const calculatedStress = (concreteLoadKns / (crossArea * 1000)).toFixed(2); // stress in MPa
      const margin = 250 - parseFloat(calculatedStress); // yield factor
      const isSafe = margin > 0;

      setEngineeringResult({
        stress: calculatedStress,
        factorOfSafety: (250 / parseFloat(calculatedStress)).toFixed(2),
        isSafe,
        recommendation: isSafe 
          ? "العنصر الإنشائي آمن ومطابق للمواصفات القياسية المصرية للخرسانة المسلحة." 
          : "تحذير: جهد الانحناء يتجاوز السقف المسموح به للسيخ الفولاذي! يوصى بزيادة القطر لـ 22مم."
      });
      addLog(`تشغيل حاسبة الخرسانة الهندسية: حمل الأسطوانة ${concreteLoadKns} KN`);
      showToast("تم الانتهاء من حسابات الإجهاد والأمان الإنشائي!");
    }, 1200);
  };

  // ==========================================
  // INTER-COLLEGE GENERAL UTILITIES
  // ==========================================
  const handleImmediateSwitchCollege = (collegeId: string, collegeName: string) => {
    const confirmSwitch = window.confirm(
      `تحديث قيد الطالب: هل ترغب في ترحيل ملفك الأكاديمي الرقمي بالكامل إلى "${collegeName}" ومزامنة كشف المواد والجدول الدراسي فورياً مع الملقم المركزي لـ SGU؟`
    );
    if (confirmSwitch) {
      const activeItem = collegeSystems.find(c => c.id === collegeId);
      if (activeItem) {
        setStudent((prev: any) => ({
          ...prev,
          college: collegeName,
          department: "القسم العام التخصصي",
          major: `بكالوريوس ${collegeName.split(" ")[1]} المعتمد`,
          requiredHours: collegeId === "med" ? 250 : collegeId === "phr" ? 180 : collegeId === "eng" ? 150 : 136,
          completedHours: Math.floor((collegeId === "med" ? 250 : collegeId === "phr" ? 180 : collegeId === "eng" ? 150 : 136) * 0.45)
        }));

        const newSyllabus = coursesByCollege[collegeId] || [];
        if (newSyllabus.length > 0) {
          setCourses(newSyllabus);
        }

        addLog(`تم ترحيل قيد الطالب والمستندات ببروتوكول آمن إلى: ${collegeName}`);
        showToast("تم ترحيل ونقل قيد الطالب وتعديل كشف المقررات!");
      }
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl" id="sgu-colleges-portals-root">
      
      {/* Toast Alert */}
      {portalToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-emerald-500 text-slate-950 p-4 rounded-xl shadow-2xl border border-emerald-400 font-extrabold flex items-center gap-3 animate-fadeIn">
          <Sparkles className="w-5 h-5 shrink-0 animate-spin" />
          <span className="text-xs leading-relaxed">{portalToast}</span>
        </div>
      )}

      {/* Header and Sync Panel */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 justify-end md:justify-start">
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
              ERP UNIVERSAL CONSOLE
            </span>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-500" />
              المنظومات والأكاديميات الـ 7 لجامعة الصالحية الجديدة
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            منظومة تشغيل وإدارة معلومات موحدة لكافة الكليات والعمادات مع المزامنة اللحظية لقواعد البيانات والأرصدة المالية.
          </p>
        </div>
        
        <div className="flex gap-2.5 items-center w-full md:w-auto justify-end">
          <button
            onClick={triggerDbSync}
            disabled={dbSyncStatus === "syncing"}
            className="cursor-pointer bg-slate-950 hover:bg-slate-850 hover:text-slate-100 text-slate-300 border border-slate-800 text-xs px-4 py-2 rounded-xl transition flex items-center gap-2 select-none"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            {dbSyncStatus === "syncing" ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                جاري المزامنة...
              </>
            ) : (
              "حالة الربط: متصلة ونشطة"
            )}
          </button>
          
          <div className="bg-slate-950 text-slate-400 px-3.5 py-2 rounded-xl border border-slate-850 text-xs flex items-center gap-2">
            <span className="font-bold text-slate-200">الكلية المقيد بها حالياً:</span>
            <span className="text-emerald-400 font-extrabold">{student.college}</span>
          </div>
        </div>
      </div>

      {/* Grid of the 7 Colleges Workspace Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {collegeSystems.map(col => {
          const isSelected = selectedCollegeId === col.id;
          const isCurrentStudentCollege = student.college === col.name;
          const IconComponent = col.icon;
          
          return (
            <button
              key={col.id}
              onClick={() => setSelectedCollegeId(col.id)}
              className={`cursor-pointer p-4 rounded-xl border transition text-center flex flex-col items-center justify-between gap-2.5 h-28 ${
                isSelected
                  ? "bg-slate-800 border-amber-500 text-slate-100 shadow-lg shadow-amber-500/10 scale-102"
                  : "bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400"
              }`}
            >
              <div className="relative">
                <IconComponent className={`w-6 h-6 ${col.accentText}`} />
                {isCurrentStudentCollege && (
                  <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950" title="كلية القيد الفعلي" />
                )}
              </div>
              <div className="text-center w-full">
                <span className="text-[11px] font-extrabold block truncate">{col.name.split(" ")[1]}</span>
                <span className="text-[8.5px] text-slate-500 block font-mono truncate">{col.id.toUpperCase()} MODULE</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE WORKSPACE GRID PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        
        {/* Active Workspace Header and Quick Shift buttons */}
        {collegeSystems.map(col => {
          if (col.id !== selectedCollegeId) return null;
          return (
            <div key={col.id} className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${col.accentBg}`}>
                  <col.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-extrabold text-slate-150">{col.systemName}</h4>
                    <span className="text-[9px] bg-slate-950 text-amber-400 font-mono border border-amber-500/20 px-2 py-0.5 rounded">
                      {col.accreditation}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">المحطة المتكاملة لإدارة دراسات وبروتوكولات وبحوث {col.name}</p>
                </div>
              </div>

              {student.college !== col.name ? (
                <button
                  onClick={() => handleImmediateSwitchCollege(col.id, col.name)}
                  className="cursor-pointer bg-amber-500 hover:bg-amber-400 hover:scale-102 hover:shadow-amber-500/10 text-slate-950 text-[11.5px] font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                  تحويل قيدك الأكاديمي فورياً لـ {col.name.split(" ")[1]}
                </button>
              ) : (
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 select-none animate-pulse">
                  <Check className="w-4 h-4" />
                  أنت مسجل أكاديمياً بهذه الكلية
                </div>
              )}
            </div>
          );
        })}

        {/* -----------------------------------------------------
            1. COLLEGE OF COMPUTER SCIENCE && AI (fcis)
            ----------------------------------------------------- */}
        {selectedCollegeId === "fcis" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left Code Editor Section */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[320px]">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center font-mono text-[11px] text-slate-400" dir="ltr">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span>sgu_ai_risk_estimator.py</span>
                </div>
                <textarea
                  value={codeInputValue}
                  onChange={(e) => setCodeInputValue(e.target.value)}
                  className="flex-1 bg-slate-950 p-4 font-mono text-xs text-slate-200 resize-none focus:outline-none focus:ring-0 leading-relaxed text-left"
                  dir="ltr"
                />
                <div className="bg-slate-900/60 p-3 border-t border-slate-800 flex justify-between items-center">
                  <button
                    onClick={runCodeCompiler}
                    disabled={isCompiling}
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-950 font-black px-4 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
                  >
                    {isCompiling ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        جاري تشغيل المعالج...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        تشغيل محاكاة الكود
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-slate-500">تم جلب إخراج الـ Sandbox في 15 ملي ثانية</span>
                </div>
              </div>

              {/* Console Output Terminal */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 h-[120px] overflow-y-auto">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pb-2 border-b border-slate-900 mb-2">
                  <span>CONSOLE OUTPUT WINDOW</span>
                  <button onClick={() => setCodeOutput("")} className="hover:text-slate-200">مسح النافذة</button>
                </div>
                <pre className="font-mono text-[11px] text-slate-300 text-left leading-relaxed whitespace-pre-wrap" dir="ltr">
                  {codeOutput || "Terminal cleared. Run code to view logs."}
                </pre>
              </div>
            </div>

            {/* Right panel: AI Prompt testing & Cluster utilization */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* AI Prompt Playground */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3">
                <span className="text-xs font-bold text-slate-300 block mb-1">الاستعلام الأكاديمي الذكي (SGU AI Mentor)</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleSendAiPrompt}
                    className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2 rounded-lg text-xs border border-slate-750"
                  >
                    استعلم
                  </button>
                  <input
                    type="text"
                    value={aiPromptMsg}
                    onChange={(e) => setAiPromptMsg(e.target.value)}
                    placeholder="اكتب استعلام أو متطلبات للتنبؤ بمتطلبات الامتحان..."
                    className="flex-1 bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
                {aiReply && (
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg text-xs text-slate-300 leading-relaxed">
                    <strong>الرد الذكي المستنتج:</strong> {aiReply}
                  </div>
                )}
              </div>

              {/* Cognitive GPU Cluster Status */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block">العقد ومصادر الحوسبة المخصصة (GPU Cluster Allocation)</span>
                
                <div className="grid grid-cols-2 gap-3 text-right">
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <span className="text-[10px] text-slate-500 block font-bold">نموذج المحاكاة</span>
                    <strong className="text-xs font-bold text-emerald-400 font-mono">SGU_DeepV2</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <span className="text-[10px] text-slate-500 block font-bold">دقة التخمين Accuracy</span>
                    <strong className="text-xs font-bold text-emerald-400 font-mono">97.42%</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>97.42% accuracy score</span>
                    <span>نسبة دقة التدريب الكلي</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: "97.4%" }} />
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-3 space-y-1 text-[10px] text-slate-500 font-mono text-left" dir="ltr">
                  {aiLog.map((log, i) => <div key={i}>{log}</div>)}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* -----------------------------------------------------
            2. COLLEGE OF HUMAN MEDICINE (med)
            ----------------------------------------------------- */}
        {selectedCollegeId === "med" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left Form: OSCE Case register */}
            <div className="lg:col-span-5 space-y-4">
              <form onSubmit={handleAddPatient} className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3.5">
                <span className="text-xs font-bold text-slate-300 block border-b border-slate-900 pb-2">تسجيل حالة سريرية جديدة (OSCE Evaluation Clinical Case):</span>
                
                <div className="space-y-1">
                  <label className="text-[10.5px] text-slate-400">اسم المريض قرين الافتراضي:</label>
                  <input
                    type="text"
                    required
                    value={newPatName}
                    onChange={(e) => setNewPatName(e.target.value)}
                    placeholder="مثال: يحيى زكريا سليمان"
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] text-slate-400">الشكوى والرصد السريري:</label>
                  <input
                    type="text"
                    required
                    value={newPatSymptom}
                    onChange={(e) => setNewPatSymptom(e.target.value)}
                    placeholder="مثال: آلام حادة بالصدر ممتدة للكتف"
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10.5px] text-slate-400">التشخيص المقترح:</label>
                    <select
                      value={newPatDiag}
                      onChange={(e) => setNewPatDiag(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-350 outline-none"
                    >
                      <option value="التهاب الكبد الوبائي أ">التهاب الكبد الوبائي أ</option>
                      <option value="قرحة المعدة الحادة">قرحة المعدة الحادة</option>
                      <option value="النيومونيا البكتيرية">النيومونيا البكتيرية</option>
                      <option value="احتشاء القلب الحاد (STEMI)">احتشاء القلب الحاد (STEMI)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] text-slate-400">جناح الإيواء والمستشفى:</label>
                    <select
                      value={newPatWard}
                      onChange={(e) => setNewPatWard(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-350 outline-none"
                    >
                      <option value="الباطنة العامة">الباطنة العامة</option>
                      <option value="الرعاية الطارئة">الرعاية الطارئة</option>
                      <option value="قسم رعاية الأطفال ICU">قسم رعاية الأطفال ICU</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-500 text-slate-950 font-black py-2 rounded-lg text-xs transition"
                >
                  رصد وإصدار الحالة السريرية
                </button>
              </form>

              {/* Interactive Vitals simulator sliders */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block">محاكي المؤشرات الحيوية للمريض OSCE (Vitals Controller)</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-blue-405 font-bold">{simulationVitals.hr} bpm</span>
                    <span>نبضات القلب (HR)</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    value={simulationVitals.hr}
                    onChange={(e) => updateVitals("hr", parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-blue-405 font-bold">{simulationVitals.bpSystolic} mmHg</span>
                    <span>ضغط الدم الشرياني الانقباضي (BP)</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="180"
                    value={simulationVitals.bpSystolic}
                    onChange={(e) => updateVitals("bpSystolic", parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-blue-405 font-bold">{simulationVitals.spo2} %</span>
                    <span>تشبع الأكسجين بالدم (SpO2)</span>
                  </div>
                  <input
                    type="range"
                    min="85"
                    max="100"
                    value={simulationVitals.spo2}
                    onChange={(e) => updateVitals("spo2", parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Table: Registered clinical cases & telemetry screen */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Simulated Medical Telemetry CRT screen */}
              <div className={`p-4 rounded-xl border transition ${
                isVitalsSafe 
                  ? "bg-slate-950 border-blue-500/30" 
                  : "bg-red-950/20 border-red-500/40 animate-pulse text-red-100"
              }`}>
                <div className="flex justify-between items-center text-xs font-mono font-bold pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isVitalsSafe ? "bg-emerald-500 animate-ping" : "bg-red-500 animate-ping"}`} />
                    <span>SGU HOSPITAL OSCE LIFE MONITOR</span>
                  </div>
                  <span>{isVitalsSafe ? "PATIENT STABLE" : "⚠️ WARNING: ABNORMAL VITALS"}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-4 text-center">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block font-bold">HEART RATE</span>
                    <strong className="text-xl font-bold font-mono text-emerald-400">{simulationVitals.hr}</strong>
                    <span className="text-[8.5px] text-slate-600 block font-bold">BPM</span>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block font-bold">BLOOD PRESSURE</span>
                    <strong className="text-xl font-bold font-mono text-cyan-400">{simulationVitals.bpSystolic}/80</strong>
                    <span className="text-[8.5px] text-slate-600 block font-bold">mmHg</span>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block font-bold">OXYGEN SAT.</span>
                    <strong className={`text-xl font-bold font-mono ${simulationVitals.spo2 >= 94 ? "text-emerald-400" : "text-rose-500"}`}>{simulationVitals.spo2}%</strong>
                    <span className="text-[8.5px] text-slate-600 block font-bold font-mono">SpO2</span>
                  </div>
                </div>
              </div>

              {/* Enrolled patients table */}
              <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden">
                <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-850 font-bold text-xs text-slate-350">
                  قائمة الحالات السريرية النشطة بمستشفى الصالحية الجامعي:
                </div>
                <div className="overflow-x-auto text-right">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-550 border-b border-slate-850">
                        <th className="p-3">رقم الملف</th>
                        <th className="p-3">الاسم والسن</th>
                        <th className="p-3">الشكوى</th>
                        <th className="p-3">التشخيص الطبي</th>
                        <th className="p-3">موضع الجناح</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {patients.map((pat) => (
                        <tr key={pat.id} className="hover:bg-slate-900/40 text-slate-300">
                          <td className="p-3 font-mono text-slate-500">{pat.id}</td>
                          <td className="p-3 font-bold">{pat.name} <span className="text-slate-500 font-mono">({pat.age} عام)</span></td>
                          <td className="p-3 text-slate-400">{pat.symptom}</td>
                          <td className="p-3 text-blue-450 font-bold">{pat.diagnosis}</td>
                          <td className="p-3 text-slate-400">{pat.ward}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------
            3. COLLEGE OF DENTAL MEDICINE (den)
            ----------------------------------------------------- */}
        {selectedCollegeId === "den" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left panel: Interactive tooth mapping */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-[10px] bg-slate-900 text-slate-450 font-mono px-2 py-0.5 rounded">FDI ISO Notation</span>
                  <span className="text-xs font-bold text-slate-300">فحص وتثبيت حالة السن (Interactive Odontogram)</span>
                </div>

                <p className="text-xs text-slate-400">اختر السن أدناه لتعديل التشخيص السريري له وحفظ مسار الكاد كام الخاص به:</p>

                {/* Grid representing oral cavity teeth */}
                <div className="grid grid-cols-7 gap-1.5 p-3 bg-slate-900/60 rounded-xl">
                  {teeth.map((t) => {
                    const isSelected = selectedTooth?.number === t.number;
                    let colorNode = "bg-slate-800 border-slate-700 text-slate-400";
                    if (t.status === "Cavity") colorNode = "bg-rose-500 text-slate-950 border-rose-400";
                    if (t.status === "Root Canal") colorNode = "bg-amber-500 text-slate-950 border-amber-400";
                    if (t.status === "Extracted") colorNode = "bg-slate-950 text-slate-600 border-slate-900 line-through";
                    if (t.status === "Healthy") colorNode = "bg-emerald-500 text-slate-950 border-emerald-400";

                    return (
                      <button
                        key={t.number}
                        type="button"
                        onClick={() => setSelectedTooth(t)}
                        className={`p-2.5 rounded-lg text-xs font-bold font-mono border text-center transition cursor-pointer flex flex-col justify-between h-14 ${
                          isSelected ? "ring-2 ring-amber-400 scale-105" : ""
                        } ${colorNode}`}
                      >
                        <span>{t.number}</span>
                        <span className="text-[8px] font-sans block leading-none truncate">{t.status.substring(0, 7)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Teeth Status Legend */}
                <div className="flex gap-4 justify-center text-[10px] bg-slate-900 p-2 rounded-lg">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded" /> سليم</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded" /> تسوس نشط</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded" /> علاج جذور</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-950 border border-slate-800 rounded" /> مخلوع</span>
                </div>
              </div>

              {/* Selected Tooth Action tools */}
              {selectedTooth && (
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-slate-400">Tooth #{selectedTooth.number}</span>
                    <strong className="text-xs font-extrabold text-slate-200">الضرس المختار: {selectedTooth.label}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      onClick={() => handleUpdateToothStatus("Healthy")}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-850 p-2.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-bold transition"
                    >
                      تعيين كـ سليم ومعافى
                    </button>
                    <button
                      onClick={() => handleUpdateToothStatus("Cavity")}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-850 p-2.5 rounded-lg border border-rose-500/30 text-rose-400 text-xs font-bold transition"
                    >
                      تسجيل (نخر / تسوس مخبري)
                    </button>
                    <button
                      onClick={() => handleUpdateToothStatus("Root Canal")}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-850 p-2.5 rounded-lg border border-amber-500/30 text-amber-400 text-xs font-bold transition"
                    >
                      تحويل لعلاج جذور (Root Canal)
                    </button>
                    <button
                      onClick={() => handleUpdateToothStatus("Extracted")}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-850 p-2.5 rounded-lg border border-slate-800 text-slate-400 text-xs font-bold transition"
                    >
                      تسجيل كـ سن مخلوع بالكامل
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right panel: CAD-CAM 3D milling simulator */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block">منصة تفريز الحشوات والزركونيا (3D CAD-CAM Milling Unit)</span>
                
                <div className="space-y-1.5">
                  <label className="text-[10.5px] text-slate-400">خامة التاج المفروزة (Restorative Material):</label>
                  <select
                    value={millingMaterial}
                    onChange={(e) => setMillingMaterial(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-300 outline-none"
                  >
                    <option value="الزركونيا الصلبة (Zirconia Premium)">الزركونيا الصلبة (Zirconia Premium)</option>
                    <option value="الـ E-Max السويسري الشفاف">الـ E-Max السويسري الشفاف</option>
                    <option value="سيراميك معزز بالنانو تكنولوجي">سيراميك معزز بالنانو تكنولوجي</option>
                  </select>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl space-y-3.5 border border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400 font-mono font-bold">12 minutes</span>
                    <span>زمن التدريج والتنعيم الكلي</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400 font-mono font-bold">0.02 mm</span>
                    <span>دقة الحافة ومطابقة الطبعة ثلاثية الأبعاد</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startCADMillingSim}
                  disabled={isCADMilling}
                  className="cursor-pointer w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-slate-950 font-black py-2 rounded-lg text-xs transition flex justify-center items-center gap-2"
                >
                  {isCADMilling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      جاري تفريز ونحت السن مخبرياً...
                    </>
                  ) : (
                    "تشغيل المخرطة الرقمية ونمذجة التاج"
                  )}
                </button>

                {cadStatusMsg && (
                  <div className="bg-purple-950/20 border border-purple-900/40 p-4 rounded-xl text-xs text-slate-305 leading-relaxed text-right">
                    {cadStatusMsg}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------
            4. COLLEGE OF PHARMACY (phr)
            ----------------------------------------------------- */}
        {selectedCollegeId === "phr" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left panel: Chemical Dose formulation */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block border-b border-slate-900 pb-2">نظام صياغة المركبات والجرعات الدوائية (Formulation Sandbox)</span>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block">المادة النشطة القعالة (Compound A):</label>
                    <select
                      value={compoundA}
                      onChange={(e) => setCompoundA(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-300 outline-none"
                    >
                      <option value="بنزيل بنزوات (Benzyl Benzoate)">بنزيل بنزوات (Benzyl Benzoate)</option>
                      <option value="الباراسيتامول القابل للذوبان">الباراسيتامول القابل للذوبان</option>
                      <option value="أمبيسيلين صوديوم معقم">أمبيسيلين صوديوم معقم</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block">المذيب والقوام الحامل (Base Liquid):</label>
                    <select
                      value={compoundB}
                      onChange={(e) => setCompoundB(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-300 outline-none"
                    >
                      <option value="جليسرول مائي (Glycerol Base)">جليسرول مائي (Glycerol Base)</option>
                      <option value="كربوكسي ميثيل سيليلوز سائل">كربوكسي ميثيل سيليلوز سائل</option>
                      <option value="كحول بروبيلين مخفف">كحول بروبيلين مخفف</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-amber-400 font-mono font-bold">{compDensity} g/cm³</span>
                      <span>كثافة المحلول الزيتية</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={compDensity}
                      onChange={(e) => setCompDensity(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-amber-400 font-mono font-bold">{compTemperature} °C</span>
                      <span>حرارة التفاعل والمزج</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      step="0.5"
                      value={compTemperature}
                      onChange={(e) => setCompTemperature(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={handleFormulate}
                  disabled={isFormulating}
                  className="cursor-pointer w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-black py-2 rounded-lg text-xs transition"
                >
                  {isFormulating ? "جاري قياس الذوبان والاستقرار بالمحاكاة..." : "تحضير واختبار استقرار الجرعة الدوائية"}
                </button>
              </div>
            </div>

            {/* Right panel: PharmD formulation results / calculations */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Ped Dosage calculator based on patient weight */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3.5">
                <span className="text-xs font-bold text-slate-300 block">نظام حساب الجرعات الدوائية للأطفال والبالغين (Clinical Dose Calculator)</span>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400">وزن المريض الإجمالي كيلوغرام:</label>
                    <input
                      type="number"
                      value={patientWeightKg}
                      onChange={(e) => setPatientWeightKg(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400">الجرعة المحددة لكل كيلوغرام (mg/kg):</label>
                    <input
                      type="number"
                      value={dosageRatePerKg}
                      onChange={(e) => setDosageRatePerKg(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg flex justify-between items-center text-xs text-right">
                  <span className="font-extrabold text-amber-400 font-mono">{patientWeightKg * dosageRatePerKg} mg يومياً</span>
                  <span className="text-slate-400">صافي جرعة المريض الموصى بها إكلينيكياً:</span>
                </div>
              </div>

              {/* Formulation Sandbox Result */}
              {formulationResult && (
                <div className={`p-4 rounded-xl border ${formulationResult.isStable ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-450" : "bg-rose-955/20 border-rose-500/40 text-rose-300"}`}>
                  <span className="text-xs font-bold block mb-1">تقرير التحليل المخبري والدستوري للتركيبة:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div><strong>الرقم التسلسلي:</strong> <span className="font-mono">{formulationResult.serial}</span></div>
                    <div><strong>اسم التركيبة:</strong> {formulationResult.name}</div>
                    <div><strong>طبيعة الرقم الهيدروجيني:</strong> pH {formulationResult.pH}</div>
                    <div><strong>الجرعة السائلة المقدرة:</strong> {formulationResult.dosageRecommend}</div>
                  </div>
                  <strong className="block text-xs mt-3 border-t border-slate-800 pt-2 text-slate-205">
                    الاستقرار والذوبان الدستوري: {formulationResult.status}
                  </strong>
                </div>
              )}
            </div>

          </div>
        )}

        {/* -----------------------------------------------------
            5. COLLEGE OF PHYSIOTHERAPY (pt)
            ----------------------------------------------------- */}
        {selectedCollegeId === "pt" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left panel: Joint angle simulator */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block border-b border-slate-900 pb-2">قياس مجال الحركة المفصلي والميكانيكي (Joint Flexion Ortho Console)</span>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">اسم حالة الفحص الميداني:</label>
                  <input
                    type="text"
                    value={sessionPatientName}
                    onChange={(e) => setSessionPatientName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-200 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-sky-450 font-bold">{kneeAngle}°</span>
                      <span>زاوية ثني الركبة (Knee Flexion)</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="140"
                      value={kneeAngle}
                      onChange={(e) => setKneeAngle(parseInt(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">مرونة ركبة منخفضة تدعو للاستشفاء</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-sky-450 font-bold">{hipAngle}°</span>
                      <span>زاوية مفصل الحوض (Hip Flexion)</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="130"
                      value={hipAngle}
                      onChange={(e) => setHipAngle(parseInt(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">نطاق حركة طبيعي 90 درجة للمقعد والعمود</span>
                  </div>
                </div>

                <button
                  onClick={handleUpdatePtNote}
                  className="cursor-pointer w-full bg-sky-600 hover:bg-sky-500 text-slate-950 font-black py-2 rounded-lg text-xs transition"
                >
                  حفظ وتحديث فحص زوايا الحركة
                </button>
              </div>
            </div>

            {/* Right panel: Evaluation rehab logs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block">التقرير الحركي والتقييم السريري للمريض:</span>
                
                <div className="bg-slate-900 p-4 rounded-xl space-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-450">اسم المريض:</span>
                    <strong className="text-slate-200 block mt-1">{sessionPatientName}</strong>
                  </div>
                  <div className="border-t border-slate-850 pt-2.5">
                    <span className="text-slate-450">تقييم حركة الركبة المقاسة:</span>
                    <strong className="text-sky-400 block mt-1">{evaluationReport.kneeEval}</strong>
                  </div>
                  <div className="border-t border-slate-850 pt-2.5">
                    <span className="text-slate-450">تقييم زاوية مفصل الفخذ الخلفي:</span>
                    <strong className="text-sky-405 block mt-1">{evaluationReport.hipEval}</strong>
                  </div>
                </div>

                {/* Simulated Rehabilitation Recovery chart */}
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-2">منحنى تقدم الاستعادة الحركية الأسبوعي للمريض (%):</span>
                  <div className="h-[120px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { week: "الأول", recovery: 30 },
                        { week: "الثاني", recovery: 48 },
                        { week: "الثالث", recovery: 62 },
                        { week: "الرابع", recovery: 85 }
                      ]}>
                        <defs>
                          <linearGradient id="rehabColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip />
                        <Area type="monotone" dataKey="recovery" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#rehabColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------
            6. COLLEGE OF NURSING (nur)
            ----------------------------------------------------- */}
        {selectedCollegeId === "nur" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left Panel: ICU patient vitals panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block">شاشة المراقبة الميدانية لوحدة الرعاية المركزة (ICU Live Monitor)</span>
                
                <div className={`p-3 rounded-lg border text-xs text-center ${icuStatusEvaluation.color}`}>
                  <strong>حالة الإنذار بوحدة الرعاية:</strong>
                  <span className="block font-black mt-1">{icuStatusEvaluation.status}</span>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-rose-400 font-bold">{icuHeartRate} bpm</span>
                      <span>معدل ضربات القلب (Patient HR)</span>
                    </div>
                    <input
                      type="range"
                      min="35"
                      max="150"
                      value={icuHeartRate}
                      onChange={(e) => setIcuHeartRate(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-rose-400 font-bold">{icuOxygen} %</span>
                      <span>نسبة الأكسجين بالدم للرعاية رئة هادئة</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="100"
                      value={icuOxygen}
                      onChange={(e) => setIcuOxygen(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Nursing Checklist of Care */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block border-b border-slate-900 pb-2">مسار الرعاية والمهام التمريضية المعتمدة (Registered Nurse Duty Sheet)</span>
                
                <div className="space-y-2 text-right">
                  {nursingChecklists.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className="cursor-pointer flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 transition"
                    >
                      <div className="flex items-center gap-2">
                        {item.done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                        )}
                      </div>
                      <span className={`text-xs ${item.done ? "text-slate-500 line-through" : "text-slate-200 font-bold"}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-900 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-400">
                    {nursingChecklists.filter(i => i.done).length} من أصل {nursingChecklists.length} مهام منجزة
                  </span>
                  <span className="text-slate-450">نسبة التزام الجناح بروتوكولات العناية:</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------
            7. COLLEGE OF ENGINEERING (eng)
            ----------------------------------------------------- */}
        {selectedCollegeId === "eng" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left Panel: Finite Element Concrete Stress simulator */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-300 block border-b border-slate-900 pb-2">محاكاة إجهاد الخرسانة المسلحة والـ CAD (Structural Fatigue simulation)</span>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block">حمل الضغط المطبق (Axial Load):</label>
                  <div className="flex gap-2">
                    <span className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs font-mono text-amber-400 font-bold shrink-0">{concreteLoadKns} KN</span>
                    <input
                      type="range"
                      min="100"
                      max="1200"
                      step="50"
                      value={concreteLoadKns}
                      onChange={(e) => setConcreteLoadKns(parseInt(e.target.value))}
                      className="flex-1 accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block">قطر سيخ حديد التسليح المختار (Rebar Diameter):</label>
                  <select
                    value={reinforceSteelD}
                    onChange={(e) => setReinforceSteelD(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-300 outline-none"
                  >
                    <option value="12">Φ 12 مم (فولاذ خفيف)</option>
                    <option value="16">Φ 16 مم (فولاذ مدرفل عالي المقاومة)</option>
                    <option value="20">Φ 20 مم (مقاوم للانحناء والزلازل)</option>
                    <option value="25">Φ 25 مم (للجسور والأسطوانات الكبرى)</option>
                  </select>
                </div>

                <button
                  onClick={calculateEngineeringStrain}
                  disabled={isSimulatingEngineering}
                  className="cursor-pointer w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-slate-950 font-black py-2 rounded-lg text-xs transition"
                >
                  {isSimulatingEngineering ? "جاري تشغيل مصفوفة المحاكاة ثلاثية الأبعاد..." : "حساب إجهادات الفولاذ وعوامل الأمان الخرسانية"}
                </button>

                {engineeringResult && (
                  <div className={`p-3 rounded-lg border text-xs text-right space-y-1 ${engineeringResult.isSafe ? "bg-emerald-955/20 border-emerald-500/30 text-emerald-350" : "bg-rose-955/20 border-rose-500/40 text-rose-350"}`}>
                    <div><strong>جهد الشد المحسوب:</strong> <span className="font-mono">{engineeringResult.stress} MPa</span></div>
                    <div><strong>معامل الأمان الفعلي (FOS):</strong> <span className="font-mono">{engineeringResult.factorOfSafety}</span></div>
                    <div className="mt-2 text-slate-200 leading-relaxed">{engineeringResult.recommendation}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Smart-Grid Power distribution controller */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-[10px] bg-slate-900 text-slate-450 font-mono px-2 py-0.5 rounded">Smart Grid v3</span>
                  <span className="text-xs font-bold text-slate-300">منظومة توزيع أحمال الطاقة الكهربائية للجامعة</span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">الحمولة الإجمالية المسحوبة من الشبكة:</span>
                    <strong className="text-orange-400 font-mono text-sm">{smartGridPowerMw.toFixed(1)} MW</strong>
                  </div>
                  
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="0.5"
                    value={smartGridPowerMw}
                    onChange={(e) => setSmartGridPowerMw(parseFloat(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />

                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <button
                      onClick={() => {
                        setGridFaultRelays(!gridFaultRelays);
                        addLog("تعديل ريلاي فصل الشبكة الأوتوماتيكي في مختبر الهندسة.");
                      }}
                      className={`px-3 py-1 rounded text-[10px] font-bold ${gridFaultRelays ? "bg-emerald-600 text-slate-950" : "bg-slate-800 text-slate-400"}`}
                    >
                      {gridFaultRelays ? "مفعل" : "معطل"}
                    </button>
                    <span className="text-xs text-slate-350">حماية التردد التلقائية والمحولات المغمورة (Relays):</span>
                  </div>

                  <div className="p-3.5 rounded-xl text-xs bg-slate-900 border border-slate-850 space-y-1">
                    <span className="text-slate-450 block font-bold">مخرجات محطة رصد الـ Smart Grid:</span>
                    <span className="text-slate-350 leading-relaxed block">
                      جهد الخروج للمحطة الرئيسية: ٢٢ كيلوفولت. استهلاك معامل القدرة (Power Factor): 0.94 مطابق لشروط الجودة والأشباه المصنفة.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            ACADEMIC RESOURCES MANAGEMENT TAB (FOR EACH SYSTEMS)
            ================--------------------------------------------------------- */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
            <div>
              <h5 className="text-xs font-black text-slate-100 flex items-center gap-1.5 justify-start">
                <Users className="w-4 h-4 text-amber-500" />
                المصادر الأكاديمية والمقاضاة لقواعد بيانات نظام: {collegeSystems.find(c => c.id === selectedCollegeId)?.name}
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">جدول الطلاب، الأساتذة، الدرجات، والمطبوعات المعتمدة قانونياً بفرع جامعة الصالحية الجديد.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sub-Panel: ADD Student */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-4">
              <span className="text-xs font-bold text-slate-300 block">إدراج وتوثيق قيد طالب إضافي (Enlist Student):</span>
              
              <div className="grid grid-cols-2 gap-3 text-right">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">اسم الطالب رباعي باللغة العربية:</label>
                  <input
                    type="text"
                    value={newStudName}
                    onChange={(e) => setNewStudName(e.target.value)}
                    placeholder="كمال يسري الشناوي"
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">التجربة البحثية أو المشروع:</label>
                  <input
                    type="text"
                    value={newStudProject}
                    onChange={(e) => setNewStudProject(e.target.value)}
                    placeholder="مثال: CAD simulation build"
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-right">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">المستوى الأكاديمي الحالى:</label>
                  <select
                    value={newStudRank}
                    onChange={(e) => setNewStudRank(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-350 outline-none"
                  >
                    <option value="المستوى الأول">المستوى الأول</option>
                    <option value="المستوى الثاني">المستوى الثاني</option>
                    <option value="المستوى الثالث">المستوى الثالث</option>
                    <option value="المستوى الرابع">المستوى الرابع</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">المعدل التراكمي المبدئي (GPA):</label>
                  <select
                    value={newStudGpa}
                    onChange={(e) => setNewStudGpa(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-right text-slate-350 outline-none"
                  >
                    <option value="4.00">4.00 - ممتاز مرتفع</option>
                    <option value="3.50">3.50 - جيد جداً مرتفع</option>
                    <option value="3.00">3.00 - جيد جداً</option>
                    <option value="2.50">2.50 - جيد</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddAcademicStudent(selectedCollegeId)}
                className="cursor-pointer bg-amber-500 hover:bg-amber-450 text-slate-950 font-black py-2 px-4 rounded-lg text-xs transition"
              >
                الموافقة والتسجيل بكشف طلاب الكلية
              </button>
            </div>

            {/* Sub-Panel: STUDENTS LIST */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-4">
              <span className="text-xs font-bold text-slate-300 block">طلاب الكلية المسجلين رسمياً (Registered SGU Class):</span>
              
              <div className="max-h-[190px] overflow-y-auto space-y-2 text-right">
                {(academicData[selectedCollegeId]?.students || []).map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleDeleteAcademicStudent(selectedCollegeId, s.id, s.name)}
                      className="cursor-pointer text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-900 ml-2"
                      title="شطب الطالب وتجميد قيده"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[10px] bg-slate-900 text-amber-450 font-mono px-1.5 py-0.5 rounded border border-amber-500/10">GPA {s.gpa}</span>
                        <strong className="text-xs text-slate-200">{s.name}</strong>
                      </div>
                      <div className="flex gap-2 justify-end text-[10px] text-slate-500 mt-1">
                        <span>{s.project}</span>
                        <span>•</span>
                        <span>{s.level}</span>
                        <span>•</span>
                        <span className="font-mono">{s.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Settle: Shared Doctors/Faculty list, Financial summary, and books available */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-900 pt-5">
            
            {/* Doctors list */}
            <div className="bg-slate-905 p-4 rounded-xl border border-slate-850 space-y-3">
              <strong className="text-xs text-slate-350 block border-b border-slate-900 pb-1">أعضاء هيئة التدريس والأطباء (SGU Faculty):</strong>
              <div className="space-y-2 max-h-[140px] overflow-y-auto text-right">
                {(academicData[selectedCollegeId]?.professors || []).map((prof) => (
                  <div key={prof.id} className="bg-slate-950 p-2 rounded-lg text-[11px] space-y-0.5 border border-slate-900">
                    <strong className="text-slate-200 block">{prof.name}</strong>
                    <div className="text-[9.5px] text-slate-505 flex justify-between">
                      <span className="text-amber-400 font-mono font-bold">نصاب {prof.hours} ساعة</span>
                      <span>تخصص: {prof.specialty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial tuition */}
            <div className="bg-slate-905 p-4 rounded-xl border border-slate-850 space-y-3">
              <strong className="text-xs text-slate-350 block border-b border-slate-900 pb-1">الوضع المالي للطلاب والرسوم (Financial Ledger):</strong>
              <div className="space-y-2 text-right text-xs">
                {(academicData[selectedCollegeId]?.finance || []).map((fin) => (
                  <div key={fin.id} className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="bg-emerald-950/20 text-emerald-450 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">{fin.status}</span>
                      <span className="text-slate-400">معرف الدائن: {fin.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-extrabold text-slate-200 font-mono">{fin.amount.toLocaleString()} ج.م</span>
                      <span>الرسوم الكلية:</span>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-extrabold text-emerald-400 font-mono">{fin.paid.toLocaleString()} ج.م</span>
                      <span>مسدد ومرصود:</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Books in Library */}
            <div className="bg-slate-905 p-4 rounded-xl border border-slate-850 space-y-3">
              <strong className="text-xs text-slate-350 block border-b border-slate-900 pb-1">المراجع المعارة من المكتبة المركزية (Library Desk):</strong>
              <div className="space-y-2 text-right text-xs text-slate-400">
                {(academicData[selectedCollegeId]?.books || []).map((book) => (
                  <div key={book.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 space-y-0.5">
                    <strong className="text-slate-200 text-[11px] block truncate">{book.title}</strong>
                    <div className="flex justify-between text-[9.5px]">
                      <span className="text-emerald-400 font-bold">{book.copiesAvailable} نسخ متوفرة</span>
                      <span className="text-slate-500 font-mono">ISBN {book.isbn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
