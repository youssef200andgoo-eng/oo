import React, { createContext, useContext, useState, useMemo } from "react";
import {
  Code, HeartPulse, Award, Activity, Clock, Users, BookOpen, Calendar,
  DollarSign, BookMarked, TrendingUp, AlertTriangle, Trash2, RefreshCw,
  Cpu, CheckCircle2, ShieldAlert, ArrowLeftRight, FileText, QrCode, Mail, Smartphone
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie
} from "recharts";

// ==========================================
// TYPES & INTERFACES DEFINITIONS
// ==========================================
export interface Student {
  id: string;
  name: string;
  level: string;
  gpa: number;
  project: string;
  status: "Active" | "Probation" | "Graduated";
  registeredCourses: string[];
  documents: { name: string; status: "Submitted" | "Pending" }[];
}

export interface Professor {
  id: string;
  name: string;
  specialty: string;
  hours: number;
  rank: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  code: string;
  creditHours: number;
  prerequisite: string;
}

export interface TransferRequest {
  id: string;
  studentName: string;
  origin: string;
  targetCollege: string;
  gpa: number;
  status: "Pending" | "Approved" | "Rejected";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  method: string;
}

export interface FinancialRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  paid: number;
  scholarship: "None" | "25%" | "50%" | "Full 100%";
  installments: "Cash" | "2 Payments" | "4 Payments";
}

export interface BookLoan {
  id: string;
  title: string;
  borrowerId: string;
  borrowerName: string;
  dueDate: string;
  status: "Borrowed" | "Overdue";
  finePaid: boolean;
}

export interface NotificationRecord {
  id: string;
  studentName: string;
  channel: "SMS" | "WhatsApp" | "Email" | "Push";
  template: string;
  timestamp: string;
}

export interface CollegeData {
  students: Student[];
  professors: Professor[];
  courses: CourseMaterial[];
  transfers: TransferRequest[];
  attendance: AttendanceRecord[];
  finance: FinancialRecord[];
  library: BookLoan[];
  notifications: NotificationRecord[];
  stats: Record<string, any>;
}

// ==========================================
// INITIAL MOCK DATA GENERATOR
// ==========================================
const initDatabase = (): Record<string, CollegeData> => {
  const defaultDocs = () => [
    { name: "أصل شهادة الثانوية", status: "Submitted" as const },
    { name: "شهادة ميلاد كمبيوتر", status: "Submitted" as const },
    { name: "أوراق الكشف الطبي", status: "Pending" as const },
    { name: "استمارة 2 جند الذكور", status: "Pending" as const }
  ];

  return {
    fcis: {
      students: [
        { id: "S-CS-10", name: "أحمد محمد كمال عبدالرضا", level: "المستوى الرابع", gpa: 3.84, project: "الوكيل الذكي بنظام ERP الصالحية", status: "Active", registeredCourses: ["CS402"], documents: defaultDocs() },
        { id: "S-CS-11", name: "محمود رأفت حلمي الشوربجي", level: "المستوى الثالث", gpa: 3.25, project: "تطوير مستودع بلوك تشين لامركزي", status: "Active", registeredCourses: ["CS402", "SE301"], documents: defaultDocs() },
        { id: "S-CS-12", name: "مريم يسري جودة الهواري", level: "المستوى الثاني", gpa: 2.89, project: "تتبع الحضور بالرؤية الحاسوبية", status: "Probation", registeredCourses: ["CS402"], documents: defaultDocs() }
      ],
      professors: [
        { id: "D-CS-01", name: "أ.د. عادل توفيق غنيم", specialty: "الذكاء الاصطناعي والشبكات العصبية", hours: 14, rank: "أستاذ دكتور" },
        { id: "D-CS-02", name: "د. شريف يسري حبيب", specialty: "هندسة البرمجيات والأنظمة السحابية", hours: 16, rank: "مدرس" }
      ],
      courses: [
        { id: "C-CS-01", title: "مبادئ تعلم الآلة العميق", code: "CS402", creditHours: 3, prerequisite: "لا يوجد" },
        { id: "C-CS-02", title: "هندسة البرمجيات وسيادتها", code: "SE301", creditHours: 3, prerequisite: "مبادئ علوم الحاسب" }
      ],
      transfers: [
        { id: "T-CS-01", studentName: "كريم ممدوح السقا", origin: "حاسبات جامعة المنصورة", targetCollege: "fcis", gpa: 3.4, status: "Pending" }
      ],
      attendance: [
        { id: "A-01", studentId: "S-CS-10", studentName: "أحمد محمد كمال", date: "2026-06-20", status: "Present", method: "AI Face Scanner" }
      ],
      finance: [
        { id: "F-01", studentId: "S-CS-10", studentName: "أحمد محمد كمال", amount: 24000, paid: 18000, scholarship: "None", installments: "2 Payments" },
        { id: "F-02", studentId: "S-CS-11", studentName: "محمود رأفت حلمي", amount: 24000, paid: 24000, scholarship: "25%", installments: "Cash" }
      ],
      library: [
        { id: "B-01", title: "Artificial Intelligence: A Modern Approach", borrowerId: "S-CS-10", borrowerName: "أحمد محمد كمال", dueDate: "2026-06-15", status: "Overdue", finePaid: false }
      ],
      notifications: [],
      stats: { gpuCharge: 78, activeEnvironments: 12, aiCoreAccuracy: 98.4 }
    },
    med: {
      students: [
        { id: "S-MD-20", name: "محمد ياسين الرفاعي", level: "الفرقة السادسة", gpa: 3.92, project: "تقييم الرئة بالأشعة المقطعية الاصطناعية", status: "Active", registeredCourses: ["ANAT101"], documents: defaultDocs() }
      ],
      professors: [
        { id: "D-MD-01", name: "أ.د. حازم فاروق المسيري", specialty: "الجراحة العامة العميقة", hours: 18, rank: "أستاذ دكتور" }
      ],
      courses: [
        { id: "C-MD-01", title: "التشريح السريري الدقيق", code: "ANAT101", creditHours: 6, prerequisite: "مقدمة علم الأحياء" }
      ],
      transfers: [],
      attendance: [],
      finance: [
        { id: "F-03", studentId: "S-MD-20", studentName: "محمد ياسين الرفاعي", amount: 55000, paid: 55000, scholarship: "Full 100%", installments: "Cash" }
      ],
      library: [],
      notifications: [],
      stats: { bedsOccupied: 14, activeOsceStations: 8 }
    },
    den: {
      students: [
        { id: "S-DN-30", name: "بلال حازم درويش", level: "الفرقة الرابعة", gpa: 3.58, project: "التركيبات الخزفية ثلاثية الأبعاد", status: "Active", registeredCourses: ["DENT352"], documents: defaultDocs() }
      ],
      professors: [
        { id: "D-DN-01", name: "أ.د. تامر رامي الشناوي", specialty: "تركيبات وتجميل الفك المتقدم", hours: 12, rank: "أستاذ دكتور" }
      ],
      courses: [
        { id: "C-DN-01", title: "التيجان والجسور الـ CAD/CAM", code: "DENT352", creditHours: 4, prerequisite: "المواد الحيوية للأسنان" }
      ],
      transfers: [],
      attendance: [],
      finance: [
        { id: "F-04", studentId: "S-DN-30", studentName: "بلال حازم درويش", amount: 48000, paid: 30000, scholarship: "50%", installments: "4 Payments" }
      ],
      library: [],
      notifications: [],
      stats: { cadCamPrinters: 4, crownPrintsCount: 168 }
    },
    phr: {
      students: [
        { id: "S-PH-40", name: "خالد سعيد عبدالمجيد", level: "المستوى الخامس", gpa: 3.69, project: "صياغة الجسيمات الشحمية للجرعات الذكية", status: "Active", registeredCourses: ["PHR512"], documents: defaultDocs() }
      ],
      professors: [
        { id: "D-PH-01", name: "أ.د. وفاء جلال الشرقاوي", specialty: "حركية وصياغة المواد الفعالة", hours: 14, rank: "أستاذ دكتور" }
      ],
      courses: [
        { id: "C-PH-01", title: "صيدلة إكلينيكية متطورة", code: "PHR512", creditHours: 4, prerequisite: "علم الكيمياء العضوية" }
      ],
      transfers: [],
      attendance: [],
      finance: [
        { id: "F-05", studentId: "S-PH-40", studentName: "خالد سعيد عبدالمجيد", amount: 35000, paid: 15000, scholarship: "None", installments: "2 Payments" }
      ],
      library: [],
      notifications: [],
      stats: { bioFormulas: 28, calibrationStatus: "مستقر ومبرمج" }
    },
    pt: {
      students: [
        { id: "S-PT-50", name: "عمر كمال الشريف", level: "المستوى الثالث", gpa: 3.42, project: "القياس الحركي لإصابات الرباط المتقاطع", status: "Active", registeredCourses: ["KINE302"], documents: defaultDocs() }
      ],
      professors: [
        { id: "D-PT-01", name: "أ.د. منذر وليد الصاوي", specialty: "تأهيل وتناسق الميكانيكا الحيوية", hours: 15, rank: "أستاذ دكتور" }
      ],
      courses: [
        { id: "C-PT-01", title: "علم كيناتيكا المفاصل والحركة", code: "KINE302", creditHours: 3, prerequisite: "علم وظائف الأعضاء" }
      ],
      transfers: [],
      attendance: [],
      finance: [
        { id: "F-06", studentId: "S-PT-50", studentName: "عمر كمال الشريف", amount: 32000, paid: 32000, scholarship: "25%", installments: "Cash" }
      ],
      library: [],
      notifications: [],
      stats: { emgSensorsCalibrated: 12, rehabGymReady: true }
    },
    nur: {
      students: [
        { id: "S-NU-60", name: "إيماء شريف الشاذلي", level: "الفرقة الثالثة", gpa: 3.64, project: "التحذير المبكر بالرعاية الحرجة للقلب", status: "Active", registeredCourses: ["CRIT301"], documents: defaultDocs() }
      ],
      professors: [
        { id: "D-NU-01", name: "د. وفاء عبدالرحمن منصور", specialty: "الحالات الحرجة والطوارئ للمسنين", hours: 12, rank: "مدرس" }
      ],
      courses: [
        { id: "C-NU-01", title: "رعاية الحالات الحرجة البالغة", code: "CRIT301", creditHours: 4, prerequisite: "تمريض أساسي" }
      ],
      transfers: [],
      attendance: [],
      finance: [
        { id: "F-07", studentId: "S-NU-60", studentName: "إيماء شريف الشاذلي", amount: 22000, paid: 10000, scholarship: "None", installments: "4 Payments" }
      ],
      library: [],
      notifications: [],
      stats: { telemetryBeats: 74, oxygenBar: 4.8 }
    },
    bus: {
      students: [
        { id: "S-BS-70", name: "ياسين أحمد عبدالحليم", level: "المستوى الرابع", gpa: 3.75, project: "محاكاة تداول المحافظ المالية الناشئة SGU", status: "Active", registeredCourses: ["TRADE301"], documents: defaultDocs() }
      ],
      professors: [
        { id: "D-BS-01", name: "أ.د. رأفت هاني حمودة", specialty: "أسواق تداول الفلزات وعقود الفروقات", hours: 16, rank: "أستاذ دكتور" }
      ],
      courses: [
        { id: "C-BS-01", title: "محاكاة تداول وتطوير المحافظ", code: "TRADE301", creditHours: 3, prerequisite: "مبادئ الاقتصاد الكلي" }
      ],
      transfers: [],
      attendance: [],
      finance: [
        { id: "F-08", studentId: "S-BS-70", studentName: "ياسين أحمد عبدالحليم", amount: 28000, paid: 28000, scholarship: "Full 100%", installments: "Cash" }
      ],
      library: [],
      notifications: [],
      stats: { startupFundsValuation: 1850000, activeVentures: 6 }
    }
  };
};

export const SGU_COLLEGES_CATALOG = [
  { id: "fcis", name: "حاسبات ومعلومات", systemName: "AI & DevLab Sandbox", accreditation: "ABET & NAQAAE Registered", accentText: "text-emerald-400", accentBg: "bg-emerald-500/10", accentBorder: "border-emerald-500/30", icon: Code, glow: "shadow-emerald-950/20" },
  { id: "med", name: "الطب البشري", systemName: "OSCE Medical Hub", accreditation: "NAQAAE Certified Clinic", accentText: "text-blue-400", accentBg: "bg-blue-500/10", accentBorder: "border-blue-500/30", icon: HeartPulse, glow: "shadow-blue-950/20" },
  { id: "den", name: "طب الأسنان", systemName: "3D Dental CAD-CAM", accreditation: "Clinical CAD APPROVED", accentText: "text-purple-400", accentBg: "bg-purple-500/10", accentBorder: "border-purple-500/30", icon: Award, glow: "shadow-purple-950/20" },
  { id: "phr", name: "الصيدلة", systemName: "PharmD Formulation Lab", accreditation: "Pharmacy Council Approved", accentText: "text-amber-400", accentBg: "bg-amber-500/10", accentBorder: "border-amber-500/30", icon: Cpu, glow: "shadow-amber-950/20" },
  { id: "pt", name: "العلاج الطبيعي", systemName: "Kinesiology Rehab Planner", accreditation: "Sports Academy Certified", accentText: "text-cyan-400", accentBg: "bg-cyan-500/10", accentBorder: "border-cyan-500/30", icon: Activity, glow: "shadow-cyan-950/20" },
  { id: "nur", name: "التمريض", systemName: "ICU Critical Care Console", accreditation: "Hospital ICU Standards", accentText: "text-rose-400", accentBg: "bg-rose-500/10", accentBorder: "border-rose-500/30", icon: Clock, glow: "shadow-rose-950/20" },
  { id: "bus", name: "إدارة الأعمال", systemName: "SGU TradeSim & Venture Hub", accreditation: "EQUIS & AACSB Certified", accentText: "text-yellow-400", accentBg: "bg-yellow-500/10", accentBorder: "border-yellow-500/30", icon: TrendingUp, glow: "shadow-yellow-950/20" }
];

export const SguCollegeSystemContent: React.FC = () => {
  const [activeCollegeId, setActiveCollegeId] = useState<string>("fcis");
  const [database, setDatabase] = useState<Record<string, CollegeData>>(initDatabase);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing">("synced");
  const [activeTab, setActiveTab] = useState<"dashboard" | "academics" | "registrations" | "operations">("dashboard");

  const college = useMemo(() => SGU_COLLEGES_CATALOG.find(c => c.id === activeCollegeId) || SGU_COLLEGES_CATALOG[0], [activeCollegeId]);
  const colData = useMemo(() => database[activeCollegeId], [database, activeCollegeId]);

  // Form states
  const [newStudName, setNewStudName] = useState("");
  const [newStudLevel, setNewStudLevel] = useState("المستوى الأول");
  const [newStudProject, setNewStudProject] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Grade states
  const [midtermGrade, setMidtermGrade] = useState("18");
  const [practicalGrade, setPracticalGrade] = useState("18");
  const [finalGrade, setFinalGrade] = useState("36");

  // Faculty state
  const [newProfName, setNewProfName] = useState("");
  const [newProfSpecialty, setNewProfSpecialty] = useState("");
  const [newProfRank, setNewProfRank] = useState("أستاذ دكتور");

  // Course state
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCoursePrereq, setNewCoursePrereq] = useState("لا يوجد");

  // Operations Form State
  const [financeDiscount, setFinanceDiscount] = useState<"None" | "25%" | "50%" | "Full 100%">("None");
  const [financeInstallments, setFinanceInstallments] = useState<"Cash" | "2 Payments" | "4 Payments">("Cash");
  const [paymentInput, setPaymentInput] = useState("5000");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerStudent, setScannerStudent] = useState("");
  const [scanMethod, setScanMethod] = useState("NFC Card");

  // Notifications State
  const [notifChannel, setNotifChannel] = useState<"SMS" | "WhatsApp" | "Email" | "Push">("WhatsApp");
  const [notifTemplate, setNotifTemplate] = useState("تنبيه الحضور والأقساط العاجلة");

  // ==========================================
  // HIGH-FIDELITY INTERACTIVE SANDBOX STATES
  // ==========================================
  // 1. FCIS AI Sandbox states
  const [fcisTemplate, setFcisTemplate] = useState<"classification" | "cyber" | "llm">("classification");
  const [fcisCode, setFcisCode] = useState<string>(
    `# SGU AI DevLab - Neural Net Classification\nimport tensorflow as tf\n\nmodel = tf.keras.models.Sequential([\n  tf.keras.layers.Dense(128, activation='relu'),\n  tf.keras.layers.Dense(10, activation='softmax')\n])\nmodel.compile(optimizer='adam', loss='sparse_categorical_crossentropy')\nprint("Model ready for training.")`
  );
  const [fcisConsoleLogs, setFcisConsoleLogs] = useState<string[]>(["[System READY]: SGU GPU cluster is idle. Waiting for compilation..."]);
  const [fcisIsCompiling, setFcisIsCompiling] = useState(false);
  const [fcisGpuAllocation, setFcisGpuAllocation] = useState(50);
  const [fcisMentorInput, setFcisMentorInput] = useState("");
  const [fcisMentorChat, setFcisMentorChat] = useState<{ sender: "user" | "mentor"; text: string }[]>([
    { sender: "mentor", text: "مرحباً بك في مختبر الذكاء الاصطناعي بجامعة الصالحية. كيف يمكنني إرشادك اليوم بشأن مشاريعك البرمجية؟" }
  ]);

  // 2. Medical Lab states
  const [medActiveCaseId, setMedActiveCaseId] = useState<string>("case1");
  const [medEcgMode, setMedEcgMode] = useState<"Normal" | "Tachycardia" | "Cardiac Arrest">("Normal");
  const [medOsceChecklist, setMedOsceChecklist] = useState<Record<string, boolean>>({
    hygiene: false,
    consent: false,
    airway: false,
    pulse: false,
    medication: false,
    history: false
  });
  const [medCaseLogs, setMedCaseLogs] = useState<string[]>(["[OSCE Virtual Ward Initiated]: Patient is lying in Bed #4. Check vitals and perform checklist."]);

  // 3. Dentistry 3D CAD/CAM State
  const [denOdontogram, setDenOdontogram] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28].forEach(tooth => {
      initial[tooth] = tooth === 14 ? "Cavity" : tooth === 16 ? "Crown" : "Healthy";
    });
    return initial;
  });
  const [denSelectedTooth, setDenSelectedTooth] = useState<number | null>(null);
  const [denMaterial, setDenMaterial] = useState<"Zirconia" | "Ceramic" | "PMMA" | "Titanium">("Zirconia");
  const [denMillingSpeed, setDenMillingSpeed] = useState<number>(18000); // RPM
  const [denSinteringTemp, setDenSinteringTemp] = useState<number>(1450); // Celsius
  const [denManufactureLog, setDenManufactureLog] = useState<string[]>(["[CAD/CAM Station]: Sintering furnace and milling arms calibrated."]);

  // 4. Pharmacy FarmD Formulation Lab
  const [phrApiWeight, setPhrApiWeight] = useState<number>(500); // 500mg
  const [phrBinderRatio, setPhrBinderRatio] = useState<number>(25); // 25% binder
  const [phrCompactionForce, setPhrCompactionForce] = useState<number>(12); // 12 kN
  const [phrDisintegrationResult, setPhrDisintegrationResult] = useState<{ status: string; color: string; time: number } | null>(null);
  
  // Renal dose calculators
  const [phrPatientWeight, setPhrPatientWeight] = useState<string>("70");
  const [phrPatientAge, setPhrPatientAge] = useState<string>("65");
  const [phrPatientScr, setPhrPatientScr] = useState<string>("1.5");
  const [phrCalcedRenalResult, setPhrCalcedRenalResult] = useState<string>("");

  const [phrDrugA, setPhrDrugA] = useState<string>("Warfarin");
  const [phrDrugB, setPhrDrugB] = useState<string>("Aspirin");
  const [phrInteractionWarning, setPhrInteractionWarning] = useState<string>("");

  // 5. Physical Therapy Kinesiology Planner
  const [ptRomAngle, setPtRomAngle] = useState<number>(90);
  const [ptActiveExercises, setPtActiveExercises] = useState<string[]>([
    "Isometric Quadriceps Contraction (3 sets x 10 reps)",
    "Straight Leg Raise for Hip Flexors (3 sets x 12 reps)"
  ]);
  const [ptSuggestedExercises, setPtSuggestedExercises] = useState<string[]>([
    "Heel Slides for Range of Motion Extension",
    "Theraband Hamstring Resistance Curl",
    "Standing Calf Stretch with Wall Support",
    "Knee Proprioception Board Balance Drill"
  ]);

  // 6. ICU Critical Nurse Console State
  const [nurIcuStatus, setNurIcuStatus] = useState<"Critical" | "Stable">("Critical");
  const [nurHeartRate, setNurHeartRate] = useState<number>(138);
  const [nurSpO2, setNurSpO2] = useState<number>(84);
  const [nurBloodPressure, setNurBloodPressure] = useState<string>("85/45");
  const [nurCriticalLogs, setNurCriticalLogs] = useState<string[]>(["[ICU Code Blue Alert]: Patient in respiratory distress and tachycardia! Check hemodynamics."]);

  // 7. Business TradeSim & Valuation States
  const [busCashBalance, setBusCashBalance] = useState<number>(50000);
  const [busPortfolio, setBusPortfolio] = useState<Record<string, number>>({
    SGU: 150,
    AAPL: 50,
    BTC: 0,
    GOLD: 10
  });
  const [busPrices, setBusPrices] = useState<Record<string, number>>({
    SGU: 120,
    AAPL: 180,
    BTC: 65000,
    GOLD: 2350
  });
  const [busTradeAmount, setBusTradeAmount] = useState<string>("5");
  // Break-even
  const [busFixedCost, setBusFixedCost] = useState<number>(15000); // Rent, salaries etc.
  const [busVariableCost, setBusVariableCost] = useState<number>(40); // Cost per product
  const [busPricePerUnit, setBusPricePerUnit] = useState<number>(100); // Sales price

  // Actions
  const handleCentralSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("synced");
      addLogMessage("جميع النظم السبعة متزامنة بنجاح مع ERP الصالحية المركزي");
    }, 1000);
  };

  const addLogMessage = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    const isSuccess = msg.includes("بنجاح") || msg.includes("موافق");
    const item: NotificationRecord = {
      id: `NOT-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: colData.students[0]?.name || "النظام الموحد",
      channel: "Push",
      template: msg,
      timestamp
    };
    setDatabase(prev => ({
      ...prev,
      [activeCollegeId]: {
        ...prev[activeCollegeId],
        notifications: [item, ...prev[activeCollegeId].notifications]
      }
    }));
  };

  const registerStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudName) return;
    const newId = `S-${activeCollegeId.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newStudent: Student = {
      id: newId,
      name: newStudName,
      level: newStudLevel,
      gpa: 3.5,
      project: newStudProject || "تخطيط وبحث غير مسمى",
      status: "Active",
      registeredCourses: [colData.courses[0]?.code || "SGU-01"],
      documents: [
        { name: "أصل شهادة الثانوية", status: "Submitted" },
        { name: "شهادة ميلاد كمبيوتر", status: "Submitted" },
        { name: "أوراق الكشف الطبي", status: "Pending" },
        { name: "استمارة 2 جند الذكور", status: "Pending" }
      ]
    };
    const finRecord: FinancialRecord = {
      id: `F-${Math.floor(100 + Math.random() * 900)}`,
      studentId: newId,
      studentName: newStudName,
      amount: 30000,
      paid: 0,
      scholarship: "None",
      installments: "Cash"
    };

    setDatabase(prev => ({
      ...prev,
      [activeCollegeId]: {
        ...prev[activeCollegeId],
        students: [...prev[activeCollegeId].students, newStudent],
        finance: [...prev[activeCollegeId].finance, finRecord]
      }
    }));
    addLogMessage(`تم تسجيل الطالب ${newStudName} وإصدار ملفه والأكواد المرجعية له بنجاح`);
    setNewStudName("");
    setNewStudProject("");
  };

  const handleDocumentApprove = (studId: string, docName: string) => {
    setDatabase(prev => {
      const students = prev[activeCollegeId].students.map(s => {
        if (s.id === studId) {
          const documents = s.documents.map(d => d.name === docName ? { ...d, status: "Submitted" as const } : d);
          return { ...s, documents };
        }
        return s;
      });
      return { ...prev, [activeCollegeId]: { ...prev[activeCollegeId], students } };
    });
    addLogMessage(`تم مراجعة واعتماد وثيقة ${docName} رسمياً`);
  };

  const handleTransferDecision = (transId: string, action: "Approved" | "Rejected") => {
    setDatabase(prev => {
      const transfers = prev[activeCollegeId].transfers.map(t => t.id === transId ? { ...t, status: action } : t);
      return { ...prev, [activeCollegeId]: { ...prev[activeCollegeId], transfers } };
    });
    addLogMessage(`تم ${action === "Approved" ? "قبول وتثبيت" : "رفض وحفظ"} طلب التحويل رقم ${transId}`);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseCode) return;
    const newCourse: CourseMaterial = {
      id: `C-${Math.floor(100 + Math.random() * 900)}`,
      title: newCourseTitle,
      code: newCourseCode.toUpperCase(),
      creditHours: 3,
      prerequisite: newCoursePrereq
    };
    setDatabase(prev => ({
      ...prev,
      [activeCollegeId]: { ...prev[activeCollegeId], courses: [...prev[activeCollegeId].courses, newCourse] }
    }));
    addLogMessage(`تم إدراج المقرر الجديد ${newCourseTitle} مع متطلب سابق: ${newCoursePrereq}`);
    setNewCourseTitle("");
    setNewCourseCode("");
  };

  const handleAddDropCourse = (studId: string, courseCode: string, action: "add" | "drop") => {
    setDatabase(prev => {
      const students = prev[activeCollegeId].students.map(s => {
        if (s.id === studId) {
          const registeredCourses = action === "add"
            ? s.registeredCourses.includes(courseCode) ? s.registeredCourses : [...s.registeredCourses, courseCode]
            : s.registeredCourses.filter(c => c !== courseCode);
          return { ...s, registeredCourses };
        }
        return s;
      });
      return { ...prev, [activeCollegeId]: { ...prev[activeCollegeId], students } };
    });
    addLogMessage(`تم ${action === "add" ? "قيد وتسجيل" : "سحب وإسقاط"} المادة ${courseCode} للطالب`);
  };

  const handleFacultyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName || !newProfSpecialty) return;
    const newProf: Professor = {
      id: `D-${activeCollegeId.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newProfName,
      specialty: newProfSpecialty,
      hours: 12,
      rank: newProfRank
    };
    setDatabase(prev => ({
      ...prev,
      [activeCollegeId]: { ...prev[activeCollegeId], professors: [...prev[activeCollegeId].professors, newProf] }
    }));
    addLogMessage(`تم قيد عضو هيئة التدريس ${newProfName} برتبة ${newProfRank}`);
    setNewProfName("");
    setNewProfSpecialty("");
  };

  const handleApplyFeesSettings = (recId: string) => {
    setDatabase(prev => {
      const finance = prev[activeCollegeId].finance.map(f => {
        if (f.id === recId) {
          const multiplier = financeDiscount === "Full 100%" ? 0 : financeDiscount === "50%" ? 0.5 : financeDiscount === "25%" ? 0.75 : 1;
          const outstanding = 30000 * multiplier;
          return { ...f, scholarship: financeDiscount, installments: financeInstallments, amount: outstanding };
        }
        return f;
      });
      return { ...prev, [activeCollegeId]: { ...prev[activeCollegeId], finance } };
    });
    addLogMessage("تم تحديث الرسوم المالية ونظام الأقساط والخصومات للطالب المختار");
  };

  const handleExecutePayment = (recId: string) => {
    const val = parseFloat(paymentInput) || 0;
    setDatabase(prev => {
      const finance = prev[activeCollegeId].finance.map(f => {
        if (f.id === recId) {
          const paid = Math.min(f.amount, f.paid + val);
          return { ...f, paid };
        }
        return f;
      });
      return { ...prev, [activeCollegeId]: { ...prev[activeCollegeId], finance } };
    });
    addLogMessage(`تم استلام وسداد دفعة مالية بقيمة ${val.toLocaleString()} ج.م وقيد السند المركزي`);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) return;
    const mid = parseFloat(midtermGrade) || 0;
    const prac = parseFloat(practicalGrade) || 0;
    const fin = parseFloat(finalGrade) || 0;
    const total = mid + prac + fin;

    let computedGpa = 2.0;
    if (total >= 90) computedGpa = 4.0;
    else if (total >= 80) computedGpa = 3.5;
    else if (total >= 70) computedGpa = 3.0;
    else if (total >= 60) computedGpa = 2.5;
    else computedGpa = 1.0;

    setDatabase(prev => {
      const students = prev[activeCollegeId].students.map(s => {
        if (s.id === selectedStudentId) {
          const newGpa = parseFloat(((s.gpa + computedGpa) / 2).toFixed(2));
          return { ...s, gpa: newGpa };
        }
        return s;
      });
      return { ...prev, [activeCollegeId]: { ...prev[activeCollegeId], students } };
    });
    addLogMessage(`تم رصد شهادة التقدير للمادة؛ الدرجة الكلية: ${total}/100 بنجاح`);
  };

  const triggerMockAttendanceScan = () => {
    if (!scannerStudent) return;
    const studName = colData.students.find(s => s.id === scannerStudent)?.name || "";
    const record: AttendanceRecord = {
      id: `A-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: scannerStudent,
      studentName: studName,
      date: new Date().toISOString().split("T")[0],
      status: "Present",
      method: scanMethod
    };
    setDatabase(prev => ({
      ...prev,
      [activeCollegeId]: { ...prev[activeCollegeId], attendance: [record, ...prev[activeCollegeId].attendance] }
    }));
    setScannerOpen(false);
    addLogMessage(`تم مسح وحساب حضور الطالب ${studName} بنجاح عبر ${scanMethod}`);
  };

  const handleReturnBookAndPayFine = (loanId: string) => {
    setDatabase(prev => {
      const library = prev[activeCollegeId].library.map(loan => {
        if (loan.id === loanId) {
          return { ...loan, status: "Returned" as any, finePaid: true };
        }
        return loan;
      }).filter(loan => loan.id !== loanId);
      return { ...prev, [activeCollegeId]: { ...prev[activeCollegeId], library } };
    });
    addLogMessage("تم تسوية الغرامات وإرجاع الكتاب لمجموعات المكتبة بنجاح");
  };

  const handleNotificationBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const stud = colData.students[0];
    if (!stud) return;
    const newNotif: NotificationRecord = {
      id: `NOT-${Math.floor(100+Math.random()*900)}`,
      studentName: stud.name,
      channel: notifChannel,
      template: notifTemplate,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
    };
    setDatabase(prev => ({
      ...prev,
      [activeCollegeId]: { ...prev[activeCollegeId], notifications: [newNotif, ...prev[activeCollegeId].notifications] }
    }));
    addLogMessage(`تم بث إشعار فوري للطالب عبر قناة ${notifChannel} بمحتوى: ${notifTemplate}`);
  };

  // Recharts Data
  const gpaChartData = useMemo(() => {
    return colData.students.map(s => ({ name: s.name.split(" ")[0], gpa: s.gpa }));
  }, [colData.students]);

  // ==========================================
  // HIGH-FIDELITY SIMULATION HANDLERS
  // ==========================================
  const handleExecuteAICompiler = () => {
    setFcisIsCompiling(true);
    setFcisConsoleLogs(p => [...p, `[Action]: Kicking off ${fcisTemplate} compilation...`, `[Config]: CUDA cores loaded @ GPU Allocation: ${fcisGpuAllocation}%`]);
    setTimeout(() => {
      setFcisConsoleLogs(p => [
        ...p,
        "[Compile Output]: Loaded CUDA core libraries & weights from SGU servers.",
        "[Epoch 1/5] Loss: 0.814 - Accuracy: 76.5%",
        "[Epoch 3/5] Loss: 0.312 - Accuracy: 92.1%",
        "[Epoch 5/5] Loss: 0.081 - Accuracy: 98.4%",
        "[System Status]: Training completed successfully! Metric targets compiled safely."
      ]);
      setFcisIsCompiling(false);
      addLogMessage("محاكاة الكود: تم تشغيل وتطوير نموذج تعلم الآلة بنجاح بالـ Sandbox");
    }, 1200);
  };

  const handleSendMentorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fcisMentorInput.trim()) return;
    const msg = fcisMentorInput;
    setFcisMentorChat(curr => [...curr, { sender: "user", text: msg }]);
    setFcisMentorInput("");
    setTimeout(() => {
      let reply = "بناءً على بروتوكول كلية الحاسبات والمعلومات بجامعة الصالحية، فإنني أنصح دوماً بمتابعة الأرواق العلمية والتدريبية ومراجعة دكاترة المسار لتحديد مشاريعك الحالية.";
      const lower = msg.toLowerCase();
      if (lower.includes("مشروع") || lower.includes("تخرج") || lower.includes("بحث")) {
        reply = "🎓 لمشاريع الحاسبات والمعلومات في SGU، نقترح بشدة العمل على نظام 'الوكيل الذكي والـ Sandbox' لربط المنظومات الخدمية معاً بمقاييس مذهلة.";
      } else if (lower.includes("مادة") || lower.includes("منهج") || lower.includes("صعب")) {
        reply = "المناهج العملية كمساق CS402 (تعلم الآلة) ممتازة للتأهيل. ادرس الفصلين الأول والثاني واهتم بمطابقة الخوارزميات رياضياً.";
      } else if (lower.includes("أمن") || lower.includes("سايبر") || lower.includes("سيكيورتي")) {
        reply = "🔒 حقل الأمن السيبراني متاح بالكلية ويغطي التحليل الجنائي واختبار الاختراق المتقدم لقواعد البيانات. ننصح بدراسة بروتوكول OWASP TOP 10.";
      }
      setFcisMentorChat(curr => [...curr, { sender: "mentor", text: reply }]);
    }, 800);
  };

  const updateMedState = (mode: "Normal" | "Tachycardia" | "Cardiac Arrest") => {
    setMedEcgMode(mode);
    setDatabase(prev => {
      const beats = mode === "Normal" ? 75 : mode === "Tachycardia" ? 142 : 0;
      return {
        ...prev,
        med: {
          ...prev.med,
          stats: { ...prev.med.stats, telemetryBeats: beats }
        }
      };
    });
    addLogMessage(`تم تغيير تخطيط مرسم القلب ECG للمريض إلى: ${mode === "Normal" ? "طبيعي" : mode === "Tachycardia" ? "تسارع قلب" : "توقف عضلة القلب"}`);
  };

  const handleSelectTooth = (tooth: number) => {
    setDenSelectedTooth(tooth);
  };

  const handleUpdateToothStatus = (status: string) => {
    if (denSelectedTooth === null) return;
    setDenOdontogram(prev => ({ ...prev, [denSelectedTooth]: status }));
    addLogMessage(`رسم الفم: تثبيت تشخيص السن رقم ${denSelectedTooth} بطلب: ${status}`);
  };

  const handleStartDentalMilling = () => {
    setDenManufactureLog(p => [...p, `[Mill]: بدء نحت التركيبات بالذراع الروبوتية... Material: ${denMaterial}`]);
    setTimeout(() => {
      const errorRate = (Math.abs(denMillingSpeed - 18000) / 25000 + 0.1).toFixed(3);
      setDenManufactureLog(p => [
        ...p,
        `[Furnace]: البدء في فرن الالتحام الحراري (Sintering) على حرارة ${denSinteringTemp}° مئوية.`,
        `[CNC Carve]: تم إخراج التاج مخرطاً بالكامل بدقة هامشية: ${errorRate}μm (الهامش المقبول < 15μm).`,
        `[CAD/CAM Ready]: التركيبة السنية جاهزة للتركيب الإكلينيكي في عيادة الكلية.`
      ]);
      setDatabase(prev => ({
        ...prev,
        den: {
          ...prev.den,
          stats: { ...prev.den.stats, crownPrintsCount: prev.den.stats.crownPrintsCount + 1 }
        }
      }));
      addLogMessage("مخرطة CAD/CAM: تم معالجة وتصنيع تركيبة الأسنان المخصصة بنجاح");
    }, 1200);
  };

  const handleSimulateFormulation = () => {
    setPhrDisintegrationResult(null);
    let time = Math.round(11 + (phrApiWeight / 120) - (phrBinderRatio / 6) + (phrCompactionForce / 2.5));
    let status = "تصنيف: ذوبان فوري وتفكك ضمن المعايير الدستورية الفضلى للأقراص";
    let color = "text-emerald-400";
    if (phrCompactionForce > 17) {
      time = time * 2;
      status = "تنبيه: أقراص صلبة بشكل مفرط - خطر تأخر إتاحة الدواء حيوياً بالدم";
      color = "text-rose-400";
    } else if (phrBinderRatio < 10) {
      time = Math.round(time / 2);
      status = "تفطن: كمية المادة الرابطة هشة جداً - قد تواجه الأقراص مشكلة الصيانة والحفظ";
      color = "text-amber-400";
    }
    setTimeout(() => {
      setPhrDisintegrationResult({ status, color, time });
      addLogMessage(`محاكاة الصيدلة: تم احتساب اختبار تفكك الأقراص الصيدلية الفوري (${time} دقيقة)`);
    }, 400);
  };

  const handleCalcRenalClearance = () => {
    const wt = parseFloat(phrPatientWeight) || 70;
    const ag = parseFloat(phrPatientAge) || 60;
    const scr = parseFloat(phrPatientScr) || 1.1;
    const crcl = Math.round(((140 - ag) * wt) / (72 * scr));
    let recommendation = `الجرعة المحتسبة كلوياً: Vancomycin 1g كل 12 ساعة (معدل تصفية ${crcl} mL/min مستقر)`;
    if (crcl < 50) {
      recommendation = `الجرعة المحمية كلوياً: Vancomycin 750mg كل 24 ساعة (تراجع تصفية ${crcl} mL/min)`;
    }
    if (crcl < 30) {
      recommendation = `الجرعة الحرجة كلوياً: Vancomycin 500mg كل 48 ساعة (معدل تصفية حرجة ${crcl} mL/min خطر)`;
    }
    setPhrCalcedRenalResult(recommendation);
    addLogMessage(`معايرة الجرعة: رصد معدل تصفية الكرياتينين المستهدف: ${crcl} mL/min`);
  };

  const handleCheckDrugInteractions = () => {
    const pair = `${phrDrugA} + ${phrDrugB}`;
    let warning = "لا يوجد تفاعل دوائي خطير مرصود في أرشيف الأدوية للائحة SGU المعتمدة.";
    if (pair.includes("Warfarin") && pair.includes("Aspirin")) {
      warning = "❌ تفاعل وخيم (Major Interaction): خطر النزيف الرئوي والمعوي الحاد للمريض. غير مسموح بالوصف!";
    } else if (pair.includes("Ibuprofen") && pair.includes("Aspirin")) {
      warning = "⚠️ تفاعل متوسط (Moderate): تراجع التأثير الحامي للقلب من الأسبرين وتهيج جدار المعدة.";
    } else if (pair.includes("Metformin") && pair.includes("Contrast Dye")) {
      warning = "🔴 تفاعل وخيم (Severe): حموضة لاكتية كلوية حادة (Lactic Acidosis). يجب إيقاف الميتفورمين يومين.";
    }
    setPhrInteractionWarning(warning);
  };

  const handlePtAddExercise = (exercise: string) => {
    if (ptActiveExercises.includes(exercise)) return;
    setPtActiveExercises(p => [...p, exercise]);
    addLogMessage(`العلاج الطبيعي: تم قيد تمرين "${exercise}" في خطة المريض`);
  };

  const handlePtRemoveExercise = (idx: number) => {
    setPtActiveExercises(p => p.filter((_, i) => i !== idx));
    addLogMessage("العلاج الطبيعي: تم إزالة تمرين من الخطة العلاجية");
  };

  const ptRomStatus = useMemo(() => {
    if (ptRomAngle <= 45) return { status: "محدودية حركة مفصلية شديدة الجوف (Severe Contracture)", impairment: "نسبة العجز الوظيفي: 45%", color: "text-rose-400" };
    if (ptRomAngle <= 90) return { status: "تقييد حركة متوسط في مفصل الركبة (Moderate Motor Impairment)", impairment: "نسبة العجز الوظيفي: 20%", color: "text-yellow-400" };
    return { status: "المدى الحركي سليم وطبيعي الميكانيكا (Normal Full Range)", impairment: "نسبة العجز الوظيفي: 0% (تعافي تام)", color: "text-emerald-400" };
  }, [ptRomAngle]);

  const handleIcuAction = (action: "defib" | "adrenaline" | "compress") => {
    if (action === "defib") {
      setNurHeartRate(78);
      setNurSpO2(98);
      setNurBloodPressure("118/76");
      setNurIcuStatus("Stable");
      setNurCriticalLogs(p => [...p, "[Emergency Defib Electroshock 200J]: تم إعطاء الصعقة الفورية للقلب واستعادة النبض الجيبي السينوسي المستقر."]);
      addLogMessage("رعاية تمريضية: إنعاش ناجح للقلب بالصدمة الكهربائية الموجهة");
    } else if (action === "adrenaline") {
      setNurHeartRate(112);
      setNurBloodPressure("98/62");
      setNurCriticalLogs(p => [...p, "[IV Adrenaline 1mg Given]: تم حقن الأدرينالين وريدياً لدعم حركية الدم الشريانية والتسارع الإنعاشي."]);
    } else if (action === "compress") {
      setNurSpO2(95);
      setNurCriticalLogs(p => [...p, "[Airway assistance & CPR begun]: تم البدء بالضغط الصدري الموجه واستعمال تهوية الأكسجين الذاتي بالبالون ماسك."]);
    }
  };

  const handleTradeStock = (ticker: string, action: "buy" | "sell") => {
    const amount = parseInt(busTradeAmount) || 0;
    if (amount <= 0) return;
    const price = busPrices[ticker];
    const cost = amount * price;

    if (action === "buy") {
      if (busCashBalance < cost) {
        addLogMessage("محاكاة التداول: الرصيد النقدي المتوفر غير كافٍ لقيمة الصفقة");
        return;
      }
      setBusCashBalance(prev => prev - cost);
      setBusPortfolio(prev => ({ ...prev, [ticker]: (prev[ticker] || 0) + amount }));
      addLogMessage(`محاكاة التداول: شراء ${amount} أسهم في محفظة ${ticker} بسعر فوري ${price} ج.م`);
    } else {
      const held = busPortfolio[ticker] || 0;
      if (held < amount) {
        addLogMessage("محاكاة التداول: لا تمتلك العدد الكافي من الأسهم لبيعها");
        return;
      }
      setBusCashBalance(prev => prev + cost);
      setBusPortfolio(prev => ({ ...prev, [ticker]: held - amount }));
      addLogMessage(`محاكاة التداول: بيع وتسييل ${amount} أسهم من محفظة ${ticker} نقداً للقيمة`);
    }
  };

  const busBreakEvenVolume = useMemo(() => {
    const denominator = busPricePerUnit - busVariableCost;
    if (denominator <= 0) return 0;
    return Math.ceil(busFixedCost / denominator);
  }, [busFixedCost, busVariableCost, busPricePerUnit]);

  const financeCount = useMemo(() => {
    let collectedValue = 0;
    let outstandingValue = 0;
    colData.finance.forEach(f => {
      collectedValue += f.paid;
      outstandingValue += (f.amount - f.paid);
    });
    return [
      { name: "المسدد والمستلم", value: collectedValue, color: "#10b981" },
      { name: "المستنزل والديون", value: outstandingValue, color: "#f43f5e" }
    ];
  }, [colData.finance]);

  return (
    <div id="SguCentralErpContainer" className="space-y-6 text-slate-200 text-right font-sans">
      
      {/* SGU SYSTEM MAIN HEADER */}
      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${syncStatus === "synced" ? "bg-emerald-400" : "bg-yellow-400 animate-pulse"}`}></span>
              قواعد البيانات الموحدة متزامنة (Central ERP)
            </span>
            <span className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded text-slate-400">SGU UNIVERSITY</span>
          </div>
          <h1 className="text-base font-black text-slate-100 mt-2">البوابات الأكاديمية والسريرية السبعة المتطورة لجامعة الصالحية الجديدة SGU</h1>
          <p className="text-xs text-slate-500 mt-1">بين أيديكم لوحة عمل مستقلة لكل كلية تغطي المهام المالية، الأكاديمية، الحضور الذكي والدرجات في إطار بيئة مركزية موحدة.</p>
        </div>
        <button
          onClick={handleCentralSync}
          disabled={syncStatus === "syncing"}
          className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
          {syncStatus === "syncing" ? "جاري التزامن..." : "تأكيد مزامنة الكليات الشاملة"}
        </button>
      </div>

      {/* HIGH-FIDELITY SELECT & TABS CONTROLLERS (UPPER CHOOSER) */}
      <div className="bg-slate-955 p-4 rounded-3xl border border-slate-850/80 space-y-4">
        <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-3">
          <div className="text-right">
            <h2 className="text-xs font-black text-slate-350 mb-1 flex items-center gap-1.5 justify-end">
              <span>اختر الكلية للتحويل والتبديل البرمجي المباشر</span>
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            </h2>
            <p className="text-[10px] text-slate-500">منظومة الصالحية الموحدة تُقلم البيانات وتُهيئ العدادات تلقائياً لكل كلية</p>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10.5px] font-mono text-slate-400 bg-slate-900/80 border border-slate-850 px-2.5 py-1 rounded-lg">
              Active Module: <strong className="text-emerald-400">{activeCollegeId.toUpperCase()}</strong>
            </span>
            <div className="relative">
              <select
                value={activeCollegeId}
                onChange={(e) => {
                  const val = e.target.value;
                  setActiveCollegeId(val);
                  setActiveTab("dashboard");
                }}
                className="cursor-pointer bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 pr-9 text-xs text-slate-200 outline-none focus:border-emerald-500/80 font-black text-right min-w-[210px] appearance-none"
              >
                {SGU_COLLEGES_CATALOG.map((item) => (
                  <option key={item.id} value={item.id}>
                    🎓 {item.name}
                  </option>
                ))}
              </select>
              {/* Custom indicator icon for dropdown */}
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px] font-mono pr-2 border-r border-slate-850">
                L-7
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Horizontal Segmented Tabs switcher */}
        <div className="border-t border-slate-900/80 pt-3">
          <div className="flex flex-row-reverse gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {SGU_COLLEGES_CATALOG.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeCollegeId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveCollegeId(item.id);
                    setActiveTab("dashboard");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-2xl border whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? `${item.accentBg} ${item.accentBorder} ${item.accentText} ring-2 ring-emerald-550/10 shadow-lg`
                      : "bg-slate-900/30 border-slate-900 text-slate-450 hover:bg-slate-900 hover:text-slate-100 hover:border-slate-850"
                  }`}
                >
                  <span>{item.name}</span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? item.accentText : "text-slate-500"}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SGU 7 COLLEGES MAIN SWITCH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {SGU_COLLEGES_CATALOG.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeCollegeId;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveCollegeId(item.id); setActiveTab("dashboard"); }}
              className={`cursor-pointer p-4 rounded-2xl border text-right transition-all duration-300 ${
                isActive ? `${item.accentBg} ${item.accentBorder} ring-2 ring-emerald-500/15 ${item.glow}` : "bg-slate-950 border-slate-900 hover:border-slate-850 hover:bg-slate-900/40"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`p-1.5 rounded-xl ${isActive ? "bg-slate-950" : "bg-slate-900"}`}>
                  <Icon className={`w-4 h-4 ${isActive ? item.accentText : "text-slate-500"}`} />
                </span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">{item.id}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-250 truncate">{item.name}</h3>
              <span className="text-[9px] text-slate-550 block mt-0.5 truncate">{item.systemName}</span>
            </button>
          );
        })}
      </div>

      {/* TWO PANEL INTERACTIVE DESKTOP CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT NAV PANEL - MODULE SELECT */}
        <div className="lg:col-span-3 bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
          <div className={`p-4 rounded-xl text-right space-y-1.5 ${college.accentBg} border ${college.accentBorder}`}>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">المنظومة النشطة حالياً</span>
            <h4 className="text-xs font-black text-slate-100">{college.name}</h4>
            <p className="text-[10.5px] text-slate-400">نظام {college.systemName}</p>
          </div>

          <div className="flex flex-col gap-1 text-right">
            {[
              { id: "dashboard", label: "📊 لوحة التحكم والتحليلات" },
              { id: "academics", label: "🎓 الملف الأكاديمي وهيئة التدريس" },
              { id: "registrations", label: "🔄 القيد الذكي ورصد الدرجات" },
              { id: "operations", label: "⚙️ العمليات والشؤون الموحدة" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium text-right transition ${
                  activeTab === t.id ? "bg-slate-900 text-emerald-400 font-black border-r-2 border-emerald-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 text-right space-y-2">
            <span className="text-[10px] font-black text-slate-400 block border-b border-slate-800 pb-1">آخر إرسال وبث إشعارات برمجية</span>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto font-mono text-[9.5px]">
              {colData.notifications.length === 0 ? (
                <div className="text-slate-500 text-center py-2">لا يوجد بث إشعارات حالياً</div>
              ) : (
                colData.notifications.map((n) => (
                  <div key={n.id} className="p-1.5 bg-slate-950 rounded border border-slate-850/60 leading-normal text-slate-400">
                    <div className="flex justify-between font-bold text-[9px] text-emerald-400">
                      <span>{n.channel}</span>
                      <span>{n.timestamp}</span>
                    </div>
                    <div>{n.template}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT WORKPLACE VIEW PANELS */}
        <div className="lg:col-span-9 bg-slate-950 p-6 rounded-2xl border border-slate-850 min-h-[500px]">
          
          {/* A. DASHBOARD VIEW WITH GRAPHS & TELEMETRY */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Telemetry Block - unique to college type */}
              <div className="p-5 bg-slate-900 rounded-2xl border border-emerald-500/10 space-y-4">
                <div className="flex justify-between items-center flex-row-reverse border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                    <span className="inline-block w-2 bg-emerald-400 h-2 rounded-full animate-ping"></span>
                    محاكاة وعدادات أداء عيادات وتجهيزات الكلية الحالية
                  </h4>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${college.accentBg} ${college.accentText}`}>SYSTEM LIVE</span>
                </div>
                
                {activeCollegeId === "fcis" && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">GPU Clusters Charge</span>
                      <strong className="text-emerald-400 text-sm font-mono">{colData.stats.gpuCharge}%</strong>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Environments Active</span>
                      <strong className="text-blue-400 text-sm font-mono">{colData.stats.activeEnvironments} Sandbox</strong>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Accuracy (Model test)</span>
                      <strong className="text-yellow-400 text-sm font-mono">{colData.stats.aiCoreAccuracy}%</strong>
                    </div>
                  </div>
                )}

                {activeCollegeId === "med" && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Beds Occupied (University Hospital)</span>
                      <strong className="text-blue-400 text-sm font-mono">{colData.stats.bedsOccupied} سرير</strong>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Live OSCE Stations</span>
                      <strong className="text-purple-400 text-sm font-mono">{colData.stats.activeOsceStations} محطة معتمدة</strong>
                    </div>
                  </div>
                )}

                {activeCollegeId === "den" && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">3D SLA/Sintering Printers</span>
                      <strong className="text-purple-400 text-sm font-mono">{colData.stats.cadCamPrinters} طابعات</strong>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Crown/Bridge Prints Approved</span>
                      <strong className="text-emerald-400 text-sm font-mono">{colData.stats.crownPrintsCount} تاج</strong>
                    </div>
                  </div>
                )}

                {activeCollegeId === "phr" && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Biopharm Formulas Certified</span>
                      <strong className="text-amber-400 text-sm font-mono">{colData.stats.bioFormulas} صيغة</strong>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Spectrometer Calibration</span>
                      <strong className="text-emerald-450 text-xs font-mono">{colData.stats.calibrationStatus}</strong>
                    </div>
                  </div>
                )}

                {activeCollegeId === "pt" && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">EMG Active Sensors</span>
                      <strong className="text-cyan-400 text-sm font-mono">{colData.stats.emgSensorsCalibrated} وحدة معايرة</strong>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Orthopedic Gym System</span>
                      <strong className="text-emerald-400 text-sm">{colData.stats.rehabGymReady ? "مستعد للفحص" : "تحت المراجعة"}</strong>
                    </div>
                  </div>
                )}

                {activeCollegeId === "nur" && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Average Vital telemetry Pulse</span>
                      <strong className="text-rose-400 text-sm font-mono">{colData.stats.telemetryBeats} BPM</strong>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Oxygen Main Line Pressure</span>
                      <strong className="text-cyan-400 text-sm font-mono">{colData.stats.oxygenBar} Bar</strong>
                    </div>
                  </div>
                )}

                {activeCollegeId === "bus" && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Venture Incubator Capital</span>
                      <strong className="text-yellow-400 text-sm font-mono">{colData.stats.startupFundsValuation.toLocaleString()} ج.م</strong>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 block">Interactive Venture Companies</span>
                      <strong className="text-emerald-400 text-sm font-mono">{colData.stats.activeVentures} حاضنات</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC HIGH-FIDELITY SIMULATION WORKSPACE SECTION (Specific to activeCollegeId) */}
              <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-5 text-right relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-emerald-500/10 px-3 py-1 rounded-br-2xl text-[10px] font-mono text-emerald-400 border-r border-b border-emerald-500/25">
                  SGU LAB WORKSTATION v4.0
                </div>
                
                <div>
                  <h3 className="text-sm font-black text-slate-100 flex items-center gap-2 justify-end">
                    مختبر المحاكاة التفاعلي ومحطة التجارب الرقمية الذكية (Interactive Labs & Calculators)
                    <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    محطة مهيأة إكلينيكياً وعملياً لمحاكاة سيناريوهات حية لكل تخصص، وربطها مع عدادات الكليات.
                  </p>
                </div>

                {/* FCIS AI Lab: Classifier compiler and Mentor desk */}
                {activeCollegeId === "fcis" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Part A: AI Sandbox compilation */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                        <h4 className="text-xs font-bold text-slate-200">الـ Sandbox البرمجي لتعلم الآلة والذكاء الاصطناعي</h4>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">TensorFlow v2</span>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block">:اختر نموذج المشروع أو خوارزمية التعلم</label>
                          <select
                            value={fcisTemplate}
                            onChange={(e) => {
                              const v = e.target.value as any;
                              setFcisTemplate(v);
                              if (v === "classification") {
                                setFcisCode(`# SGU AI DevLab - Neural Net Classification\nimport tensorflow as tf\n\nmodel = tf.keras.models.Sequential([\n  tf.keras.layers.Dense(128, activation='relu'),\n  tf.keras.layers.Dense(10, activation='softmax')\n])\nmodel.compile(optimizer='adam', loss='sparse_categorical_crossentropy')\nprint("Model ready for training.")`);
                              } else if (v === "cyber") {
                                setFcisCode(`# SGU Cybersecurity - Socket Port Scanner\nimport socket\n\nfor port in [21, 22, 80, 443, 3306]:\n  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n  res = s.connect_ex(('127.0.0.1', port))\n  if res == 0:\n    print(f"Port {port} is OPEN.")\n  s.close()`);
                              } else {
                                setFcisCode(`# SGU SLM Fine-Tuning - Small LLM Prompt Agent\nfrom sgu_llm import TinyLlama\n\nagent = TinyLlama(weights="SguClassic-7B")\nprompt = "أنا طالب بكلية حاسبات جامعة الصالحية..."\nprint("Tokenizing and decoding prompt responses...")`);
                              }
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 outline-none"
                          >
                            <option value="classification">تصنيف الشبكات العصبية العميقة (Deep Neural Net Classification)</option>
                            <option value="cyber">فاحص المنافذ والوقاية السيبرانية (Secure Socket Port Scanner)</option>
                            <option value="llm">تهيئة النماذج اللغوية الصغيرة (SGU LLM Fine-Tuning Console)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block">:محرر التجارب الحرة وكود المعالجة</label>
                          <textarea
                            value={fcisCode}
                            onChange={(e) => setFcisCode(e.target.value)}
                            rows={5}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-emerald-400 font-mono focus:border-emerald-500 outline-none leading-relaxed text-left"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-mono text-slate-300">{fcisGpuAllocation}% CUDA Cores</span>
                            <span className="text-slate-400 text-right">:تخصيص قوى كروت الشاشة بالتجميعة الحوسبية</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={fcisGpuAllocation}
                            onChange={(e) => setFcisGpuAllocation(parseInt(e.target.value))}
                            className="w-full accent-emerald-400"
                          />
                        </div>

                        <div className="flex justify-between items-center gap-2 pt-1">
                          <button
                            onClick={() => setFcisConsoleLogs(["[System READY]: SGU GPU cluster is idle. Waiting for compilation..."])}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded cursor-pointer"
                          >
                            مسح الأرشيف
                          </button>
                          
                          <button
                            onClick={handleExecuteAICompiler}
                            disabled={fcisIsCompiling}
                            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 text-slate-950 font-black px-4 py-2 rounded text-xs transition cursor-pointer flex-1 text-center"
                          >
                            {fcisIsCompiling ? "جاري تهيئة كروت شاشة الـ Clusters..." : "⚡ تشغيل وتطوير الكود (Run & Train Model)"}
                          </button>
                        </div>
                      </div>

                      {/* Console Term */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block">:قراءات الطرفية ومستخرج الحسابات (SGU Terminal Console)</label>
                        <div className="bg-slate-950 p-2.5 rounded border border-slate-900 max-h-[140px] overflow-y-auto text-left font-mono text-[9px] text-zinc-400 space-y-1 leading-relaxed">
                          {fcisConsoleLogs.map((log, idx) => (
                            <div key={idx} className={log.includes("completed") || log.includes("Accuracy") ? "text-emerald-400" : log.includes("[Action]") ? "text-amber-400" : ""}>
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Part B: FCIS Mentor Assistant Desk */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2 mb-3">
                          <h4 className="text-xs font-bold text-slate-200">المرشد الأكاديمي الرقمي الذكي بجامعة الصالحية SGU</h4>
                          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">Dr. Saleh AI Mentor</span>
                        </div>

                        {/* Presets buttons */}
                        <div className="flex flex-wrap gap-1.5 justify-end mb-3">
                          <button
                            onClick={() => { setFcisMentorInput("اقترح مشروع تخرج مميز للحاسبات الذكية"); }}
                            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9.5px] px-2 py-1 rounded text-slate-300 transition"
                          >
                            💡 مقترحات تخرج
                          </button>
                          <button
                            onClick={() => { setFcisMentorInput("كيف أتجاوز مقرر تعلم الآلة CS402 الصعب؟"); }}
                            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9.5px] px-2 py-1 rounded text-slate-300 transition"
                          >
                            📚 دليل تعلم الآلة
                          </button>
                          <button
                            onClick={() => { setFcisMentorInput("ما هو بروتوكول أمن المعلومات المتبع بالكلية؟"); }}
                            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9.5px] px-2 py-1 rounded text-slate-300 transition"
                          >
                            🔒 دليل السكيورتي
                          </button>
                        </div>

                        {/* Chat Scroll area */}
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-850/60 h-[220px] overflow-y-auto space-y-3 mb-3">
                          {fcisMentorChat.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                              <span className="text-[9px] text-slate-500 mb-0.5">{msg.sender === "user" ? "أنا" : "المرشد البرمجي الذكي"}</span>
                              <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${msg.sender === "user" ? "bg-emerald-500/20 text-emerald-300 rounded-tr-none" : "bg-slate-950 text-slate-200 rounded-tl-none border border-slate-800"}`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Input form */}
                      <form onSubmit={handleSendMentorMessage} className="flex gap-2">
                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black text-xs px-4 rounded transition cursor-pointer">
                          إرسال
                        </button>
                        <input
                          type="text"
                          value={fcisMentorInput}
                          onChange={(e) => setFcisMentorInput(e.target.value)}
                          placeholder="اسأل المرشد الأكاديمي عن كليتك أو مشاريعك..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded p-2 text-xs text-right outline-none focus:border-emerald-500"
                        />
                      </form>
                    </div>
                  </div>
                )}

                {/* MEDICAL WORKSPACE: ECG Telemetry Monitor & OSCE Station Verification */}
                {activeCollegeId === "med" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Part A: Patient Telemetry & ECG Monitor */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                        <h4 className="text-xs font-bold text-slate-200">شاشة مراقبة العلامات الحيوية بجناح المحاكاة المتقدم</h4>
                        <span className="text-[9px] bg-red-500/15 text-rose-400 px-1.5 py-0.5 rounded font-mono">ICU Patient Monitor</span>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-center space-y-4 relative">
                        {/* Interactive state display */}
                        <div className="flex justify-around items-center">
                          <div>
                            <span className="text-[10px] text-slate-400 block">معدل نبضات القلب</span>
                            <strong className={`font-mono text-2xl ${medEcgMode === "Cardiac Arrest" ? "text-red-500 line-through animate-pulse" : medEcgMode === "Tachycardia" ? "text-yellow-405 animate-bounce" : "text-emerald-400"}`}>
                              {medEcgMode === "Normal" ? "75" : medEcgMode === "Tachycardia" ? "142" : "0"} <span className="text-xs font-sans">BPM</span>
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">ضغط الدم الإبهامي</span>
                            <strong className="font-mono text-slate-200 text-base">
                              {medEcgMode === "Normal" ? "120/80" : medEcgMode === "Tachycardia" ? "90/55" : "0/0"}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">نسبة تغذية الأكسجين</span>
                            <strong className="font-mono text-cyan-400 text-base">
                              {medEcgMode === "Cardiac Arrest" ? "42%" : "98%"}
                            </strong>
                          </div>
                        </div>

                        {/* Animated ECG graph rendering */}
                        <div className="h-16 bg-slate-950 rounded border border-slate-900 flex items-center justify-center overflow-hidden">
                          {medEcgMode === "Normal" && (
                            <div className="w-full h-full flex justify-around items-center opacity-85">
                              <div className="w-full h-[2px] bg-emerald-500 relative animate-pulse flex items-center">
                                <span className="absolute w-4 h-4 bg-emerald-500/40 rounded-full blur-sm"></span>
                                <span className="text-[9px] text-emerald-400 font-mono pl-3">^v^v ECG Stream (Continuous Normal Sinus Rhythm) v^v^</span>
                              </div>
                            </div>
                          )}
                          {medEcgMode === "Tachycardia" && (
                            <div className="w-full h-full flex justify-around items-center bg-yellow-500/5">
                              <div className="w-full h-[2px] bg-yellow-400 relative flex items-center">
                                <span className="absolute w-4 h-4 bg-yellow-400/40 rounded-full blur-sm animate-ping"></span>
                                <span className="text-[9px] text-yellow-400 font-mono pr-3 animate-pulse">^^^^ TACHYCARDIA CRISIS: ST Segment Elevation Alert ^^^^</span>
                              </div>
                            </div>
                          )}
                          {medEcgMode === "Cardiac Arrest" && (
                            <div className="w-full h-full flex justify-around items-center bg-rose-500/10">
                              <div className="w-full h-[2px] bg-red-600 relative flex items-center">
                                <span className="absolute w-4 h-4 bg-red-650/40 rounded-full blur-sm"></span>
                                <span className="text-[9px] text-red-500 font-mono pr-3 tracking-widest uppercase animate-ping">---------------- ASYSTOLE / CARDIAC ARREST STATE ----------------</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Mode Select Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => updateMedState("Normal")}
                            className={`px-2.5 py-1.5 rounded text-xs transition cursor-pointer font-bold ${medEcgMode === "Normal" ? "bg-emerald-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"}`}
                          >
                            نمط طبيعي (Normal)
                          </button>
                          <button
                            onClick={() => updateMedState("Tachycardia")}
                            className={`px-2.5 py-1.5 rounded text-xs transition cursor-pointer font-bold ${medEcgMode === "Tachycardia" ? "bg-yellow-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"}`}
                          >
                            تسارع نبض (Tachycardia)
                          </button>
                          <button
                            onClick={() => updateMedState("Cardiac Arrest")}
                            className={`px-2.5 py-1.5 rounded text-xs transition cursor-pointer font-bold ${medEcgMode === "Cardiac Arrest" ? "bg-rose-500 text-slate-950 font-black animate-pulse" : "bg-slate-950 text-slate-300 hover:bg-slate-800"}`}
                          >
                            سكتة قلبية (Arrest!)
                          </button>
                        </div>
                      </div>

                      {/* Log output medically */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400">:سجل الإسعافات والملاحظات الإكلينيكية بالسرير</span>
                        <div className="bg-slate-900 p-2 rounded border border-slate-850 h-[80px] overflow-y-auto font-mono text-[9.5px] text-slate-400 leading-normal text-left">
                          {medCaseLogs.map((log, idx) => (
                            <div key={idx} className={log.includes("Code Blue") || log.includes("Cardiac") ? "text-rose-450" : ""}>{log}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Part B: OSCE Clinical Assessment Station Checklist */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2 mb-3">
                          <h4 className="text-xs font-bold text-slate-200">محطة تقييم لجان OSCE الإكلينيكية الموحدة</h4>
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">OSCE Board Exam #4</span>
                        </div>
                        <p className="text-[11px] text-slate-450 leading-relaxed mb-3">
                          يجب على طالب الطب إنجاز الخطوات المنهجية الكاملة بجمالياتها الطبية لضمان علامة النجاح الكاملة بالكلية:
                        </p>

                        <div className="space-y-2 text-right">
                          {[
                            { key: "hygiene", label: "📂 غسل وتطهير اليدين ولبس القفازات الطبية (Hand Hygiene)" },
                            { key: "consent", label: "📑 التعريف بالنفس للمريض والحصول على الموافقة (Informed Consent)" },
                            { key: "airway", label: "🫁 فتح مجرى التنفس والتأكد من ملاءمة القناة الرئوية (Airway Access)" },
                            { key: "pulse", label: "💓 جس النبض الكعبري ومتابعة عداد مرسم القلب (Verify Carotid Pulse)" },
                            { key: "medication", label: "💊 تحضير ومطابقة دواء الطوارئ الموصوف آلياً (Deliver Therapy)" },
                            { key: "history", label: "📋 استفسار المريض عن قائمة الأدوية وسوابق الحساسية البدنية (Patient History)" }
                          ].map((item) => (
                            <label
                              key={item.key}
                              className={`flex items-center gap-2 justify-end p-2 rounded border transition cursor-pointer text-xs ${medOsceChecklist[item.key] ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-300 font-bold" : "bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800"}`}
                            >
                              <span>{item.label}</span>
                              <input
                                type="checkbox"
                                checked={medOsceChecklist[item.key]}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setMedOsceChecklist(p => ({ ...p, [item.key]: checked }));
                                  setMedCaseLogs(curr => [
                                    ...curr,
                                    `[OSCE Checklist Update]: ${item.label.split(" (")[0]} - ${checked ? "منجز بنجاح ✅" : "ملغى ⚠️"}`
                                  ]);
                                  addLogMessage(`تقييم OSCE: تحديث حالة بروتوكول خطوة "${item.label.split(" (")[0]}"`);
                                }}
                                className="accent-emerald-450 w-4 h-4 cursor-pointer"
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Score metrics */}
                      <div className="border-t border-slate-900 pt-3 mt-3 flex justify-between items-center flex-row-reverse text-xs">
                        <span className="text-slate-400">:تقييم لجنة OSCE الإجمالي</span>
                        <strong className="text-emerald-400 font-mono text-sm">
                          {Object.values(medOsceChecklist).filter(Boolean).length} / 6 خطوات منجزة
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* DENTISTRY WORKSPACE: Visual Odontogram & 3D Milling Station */}
                {activeCollegeId === "den" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Part A: 3D Teeth mapping (Odontogram) */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                        <h4 className="text-xs font-bold text-slate-200">مخطط الفم والأسنان التفاعلي الشامل (Visual Odontogram)</h4>
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">عيادة الأسنان الذكية SGU</span>
                      </div>
                      <p className="text-[11px] text-slate-450 leading-relaxed text-right">
                        انقر على أي سن من الكشوف لتعديل تشخيصه الطبي الحالي وإحالته لمخرطة تيجان CAD/CAM الكلية:
                      </p>

                      {/* Teeth Grid */}
                      <div className="grid grid-cols-8 gap-1.5 pt-1">
                        {[11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28].map((tooth) => {
                          const status = denOdontogram[tooth] || "Healthy";
                          const isSelected = denSelectedTooth === tooth;
                          return (
                            <button
                              key={tooth}
                              onClick={() => handleSelectTooth(tooth)}
                              className={`p-1.5 rounded-xl border flex flex-col justify-between items-center h-[52px] text-center transition cursor-pointer ${
                                isSelected ? "bg-purple-950 border-purple-500 ring-2 ring-purple-400/20" : status === "Cavity" ? "bg-rose-500/10 border-rose-500/35 hover:bg-rose-500/15" : status === "Crown" ? "bg-indigo-500/10 border-indigo-500/35 hover:bg-indigo-500/15" : "bg-slate-900 border-slate-850 hover:bg-slate-800"
                              }`}
                            >
                              <span className="text-[9px] text-slate-500 block font-mono">{tooth}</span>
                              <span className={`text-[8.5px] truncate font-bold ${status === "Cavity" ? "text-rose-455" : status === "Crown" ? "text-indigo-400" : "text-emerald-400"}`}>
                                {status === "Cavity" ? "تسوس" : status === "Crown" ? "تاج" : "سليم"}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active edit tool for selected tooth */}
                      {denSelectedTooth ? (
                        <div className="p-3 bg-slate-900 rounded-xl border border-purple-800/30 text-right space-y-2">
                          <div className="flex justify-between items-center flex-row-reverse text-xs">
                            <span className="text-slate-300 font-bold">تحديد الإجراء العلاجي للسن رقم {denSelectedTooth}:</span>
                            <span className="text-[10px] text-slate-450 font-mono">الحالة الحالية: <strong className="text-yellow-400">{denOdontogram[denSelectedTooth]}</strong></span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => handleUpdateToothStatus("Healthy")} className="bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-[10.5px] py-1 rounded cursor-pointer transition">سليم (Healthy)</button>
                            <button onClick={() => handleUpdateToothStatus("Cavity")} className="bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-[10.5px] py-1 rounded cursor-pointer transition">تسوس (Cavity)</button>
                            <button onClick={() => handleUpdateToothStatus("Crown")} className="bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-[10.5px] py-1 rounded cursor-pointer transition">تركيب تاج (Crown)</button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2.5 text-[10px] bg-slate-900 border border-slate-850 text-slate-500 rounded-xl">
                          يرجى اختيار رقم سن من الأعلى لمعاينة تشخيصه وإقراره
                        </div>
                      )}
                    </div>

                    {/* Part B: CAD/CAM Robotic Milling & Sintering Console */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                          <h4 className="text-xs font-bold text-slate-200">التحكم في مخرطة تيجان وتلبيسات الأسنان المتقدمة CAD/CAM</h4>
                          <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">3D Robotic Mill</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 block">:مادة التركيبة المستهدفة</label>
                            <select
                              value={denMaterial}
                              onChange={(e: any) => setDenMaterial(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 outline-none"
                            >
                              <option value="Zirconia">ديركونيا معالج حرارياً (Zirconia)</option>
                              <option value="Ceramic">سيراميك فلسباثي لامع (Ceramic)</option>
                              <option value="PMMA">أكريليك مرن وتأهيل مؤقت (PMMA)</option>
                              <option value="Titanium">معدن تيتانيوم طبي زراعي (Titanium)</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 block">درجة حرارة التحام فرن التلبيس (°C):</label>
                            <input
                              type="number"
                              value={denSinteringTemp}
                              onChange={(e) => setDenSinteringTemp(parseInt(e.target.value) || 1450)}
                              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs outline-none text-right font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-right">
                          <div className="flex justify-between text-[10px] font-mono mb-1">
                            <span>{denMillingSpeed.toLocaleString()} RPM</span>
                            <span>سرعة مخرطة الذراع الروبوتية بالدقيقة:</span>
                          </div>
                          <input
                            type="range"
                            min="10000"
                            max="30000"
                            step="2000"
                            value={denMillingSpeed}
                            onChange={(e) => setDenMillingSpeed(parseInt(e.target.value))}
                            className="w-full select-none accent-cyan-400"
                          />
                        </div>

                        <button
                          onClick={handleStartDentalMilling}
                          className="w-full bg-purple-500 hover:bg-purple-450 text-slate-950 font-black py-2 rounded text-xs transition cursor-pointer"
                        >
                          ⚙️ تشغيل المخرطة الذكية وإنتاج طقم الأسنان
                        </button>
                      </div>

                      <div className="space-y-1 text-right mt-3">
                        <span className="text-[10px] text-slate-455">مخرجات مفرزة الإنتاج (Robotic Mill Logs):</span>
                        <div className="bg-slate-900 p-2 rounded border border-slate-850 h-[80px] overflow-y-auto font-mono text-[9.5px] text-slate-300 text-left leading-relaxed">
                          {denManufactureLog.map((log, idx) => (
                            <div key={idx} className={log.includes("Ready") || log.includes("Ready") ? "text-emerald-400" : log.includes("[Mill]:") ? "text-cyan-400" : ""}>{log}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PHARMACY WORKSPACE: Formulation Dissolution Test, Drug Interactions & Cockcroft-Gault Calculator */}
                {activeCollegeId === "phr" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Part A: Pharmaceutics Disintegration Simulator */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                        <h4 className="text-xs font-bold text-slate-200">محاكاة تصنيع واختبار ذوبان وسقوط الأقراص الصيدلانية</h4>
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">Tablet Formulation Lab</span>
                      </div>

                      <div className="space-y-3 text-right">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span>{phrApiWeight} mg</span>
                            <span>وزن المادة الفعالة النشطة (API):</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="1000"
                            step="50"
                            value={phrApiWeight}
                            onChange={(e) => setPhrApiWeight(parseInt(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span>{phrBinderRatio}%</span>
                            <span>نسبة الأكسجين/المادة الرابطة بالقرص (Binder Ratio):</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={phrBinderRatio}
                            onChange={(e) => setPhrBinderRatio(parseInt(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span>{phrCompactionForce} kN</span>
                            <span>قوة ضغط كبس المكبس الدوار (Compaction Force):</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="25"
                            step="1"
                            value={phrCompactionForce}
                            onChange={(e) => setPhrCompactionForce(parseInt(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>

                        <button
                          onClick={handleSimulateFormulation}
                          className="w-full bg-amber-500 hover:bg-amber-450 text-slate-950 font-black py-2 rounded text-xs transition cursor-pointer"
                        >
                          🧪 تشغيل جهاز تفكك الأقراص (Disintegration Test)
                        </button>

                        {/* Calculated Disintegration results block */}
                        {phrDisintegrationResult && (
                          <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/20 space-y-1.5">
                            <div className="flex justify-between items-center flex-row-reverse text-xs">
                              <span className="text-slate-400">وقت التفكك والذوبان الكلي:</span>
                              <strong className="text-amber-400 font-mono text-base">{phrDisintegrationResult.time} دقيقة</strong>
                            </div>
                            <p className={`text-[10.5px] leading-relaxed font-bold text-center ${phrDisintegrationResult.color}`}>
                              {phrDisintegrationResult.status}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Part B: Clinical Pharmacy calculators and Interactions Desk */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                      {/* Sub-item 1: renal dosage calc */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-1.5">
                          <h5 className="text-[11px] font-black text-rose-300">مقياس تصفية الكرياتينين وجرعات الكلى الموحد (Cockcroft-Gault)</h5>
                          <span className="text-[8.5px] bg-rose-500/10 text-rose-450 px-1 rounded font-mono">Renal Clear</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="الوزن kg"
                            value={phrPatientWeight}
                            onChange={(e) => setPhrPatientWeight(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-center outline-none"
                          />
                          <input
                            type="text"
                            placeholder="العمر"
                            value={phrPatientAge}
                            onChange={(e) => setPhrPatientAge(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-center outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Scr mg/dL"
                            value={phrPatientScr}
                            onChange={(e) => setPhrPatientScr(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-center outline-none"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleCalcRenalClearance}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 text-[10.5px] font-bold px-3 py-1.5 rounded transition cursor-pointer flex-1"
                          >
                            احسب المقياس واقترح توقيت الجرعات
                          </button>
                        </div>
                        {phrCalcedRenalResult && (
                          <div className="p-2 bg-slate-900 rounded border border-rose-500/20 text-[10.5px] text-center font-bold text-slate-300">
                            {phrCalcedRenalResult}
                          </div>
                        )}
                      </div>

                      {/* Sub-item 2: Drug interaction warning checker */}
                      <div className="space-y-2 border-t border-slate-900 pt-3">
                        <div className="flex justify-between items-center flex-row-reverse pb-1">
                          <h5 className="text-[11px] font-black text-amber-300">فاحص التداخلات الدوائية الإكلينيكي المباشر (Clinical Drug Interaction)</h5>
                          <span className="text-[8.5px] bg-amber-500/10 text-amber-400 px-1 rounded font-mono">Interaction API</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-right text-xs">
                          <select
                            value={phrDrugA}
                            onChange={(e) => setPhrDrugA(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[11px] text-slate-300 outline-none text-right"
                          >
                            <option value="Warfarin">الوارفارين (Warfarin)</option>
                            <option value="Ibuprofen">إيبوبروفين (Ibuprofen)</option>
                            <option value="Metformin">ميتفورمين (Metformin)</option>
                          </select>

                          <select
                            value={phrDrugB}
                            onChange={(e) => setPhrDrugB(e.target.value)}
                            className="w-full bg-slate-905 border border-slate-800 rounded p-1.5 text-[11px] text-slate-300 outline-none text-right"
                          >
                            <option value="Aspirin">أسبرين (Aspirin)</option>
                            <option value="Contrast Dye">صبغة أشعة (Contrast Dye)</option>
                            <option value="Ibuprofen">إيبوبروفين (Ibuprofen)</option>
                          </select>
                        </div>

                        <button
                          onClick={handleCheckDrugInteractions}
                          className="w-full bg-slate-905 hover:bg-slate-800 border border-slate-800 text-amber-400 text-[10.5px] font-bold py-1.5 rounded cursor-pointer transition"
                        >
                          افحص تطابق التركيب التفاعلي وتداخلاتها
                        </button>

                        {phrInteractionWarning && (
                          <div className="p-2 bg-slate-900 rounded border border-amber-500/20 text-[10.5px] font-medium leading-relaxed text-right text-rose-300">
                            {phrInteractionWarning}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* PHYSICAL THERAPY WORKSPACE: ROM Goniometer Angle & Kinematic rehabilitation planner */}
                {activeCollegeId === "pt" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Part A: Joint Goniometer Angle selector */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                        <h4 className="text-xs font-bold text-slate-200">معايرة غونيوميتر قياس حركة مفصل الركبة (Joint ROM Goniometer)</h4>
                        <span className="text-[9px] bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded font-mono">Kinematic Gait Lab</span>
                      </div>
                      <p className="text-[11px] text-slate-450 leading-relaxed text-right">
                        قم بسحب المؤشر لمحاكاة المدى الحركي لمفصل المريض، وقياس العجز الوظيفي والحركي للأربطة:
                      </p>

                      <div className="space-y-4 text-right">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-cyan-400">{ptRomAngle}° Flexion Angle</span>
                          <span>زاوية الانحناء المفصلي المرصودة:</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="140"
                          step="5"
                          value={ptRomAngle}
                          onChange={(e) => {
                            setPtRomAngle(parseInt(e.target.value));
                            addLogMessage(`العلاج الطبيعي: معايرة زاوية غونيوميتر الركبة عند ${e.target.value}° درجة`);
                          }}
                          className="w-full accent-cyan-400"
                        />

                        {/* ROM Diagnosis output block */}
                        <div className="p-4 bg-slate-900 rounded-xl border border-indigo-500/20 space-y-2">
                          <div className="flex justify-between items-center flex-row-reverse text-xs">
                            <span className="text-slate-400">التشخيص الوظيفي الفوري:</span>
                            <span className={`text-xs font-bold ${ptRomStatus.color}`}>{ptRomStatus.status}</span>
                          </div>
                          <div className="flex justify-between items-center flex-row-reverse text-xs border-t border-slate-850 pt-2">
                            <span className="text-slate-500">مستوى نسبة العجز:</span>
                            <strong className="text-white text-xs">{ptRomStatus.impairment}</strong>
                          </div>
                        </div>

                        {/* Interactive Goniometer visual representation */}
                        <div className="h-14 bg-slate-900 rounded border border-slate-850 flex items-center justify-center p-3">
                          <div className="w-full max-w-sm bg-slate-950 h-2 rounded-full relative flex items-center">
                            <div className="h-2 bg-gradient-to-r from-rose-500 via-yellow-505 to-emerald-500 rounded-full" style={{ width: `${(ptRomAngle / 140) * 100}%` }}></div>
                            <span className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-lg border-2 border-indigo-500 animate-pulse" style={{ left: `calc(${(ptRomAngle / 140) * 100}% - 7px)` }}></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Part B: Kinesiology Rehabitation Planner */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2 mb-3">
                          <h4 className="text-xs font-bold text-slate-200">مخطط ومنصة صياغة التمارين الحركية للمرضى</h4>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Rehab Prescription Desk</span>
                        </div>

                        <div className="space-y-1 text-right mb-3">
                          <label className="text-[10px] text-slate-400 block font-bold">تمارين مقترحة تفصيلية لتقوية الأربطة والركبة:</label>
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {ptSuggestedExercises.map((ex, i) => (
                              <button
                                key={i}
                                onClick={() => handlePtAddExercise(ex)}
                                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] px-2 py-1 rounded text-slate-300 transition cursor-pointer"
                              >
                                + {ex.split(" for ")[0]}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Active list with remove */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-400 block font-bold">الخطة الحركية والتدريبات المبرمجة للمريض في الملف:</label>
                          <div className="bg-slate-900 rounded-lg p-2 max-h-[140px] overflow-y-auto space-y-1">
                            {ptActiveExercises.length === 0 ? (
                              <div className="text-center text-[10px] text-slate-500 py-4">الخطة فارغة. انقر على التمارين بالأعلى لإضافتها.</div>
                            ) : (
                              ptActiveExercises.map((exe, x) => (
                                <div key={x} className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-850 text-[10.5px]">
                                  <button onClick={() => handlePtRemoveExercise(x)} className="text-rose-400 hover:text-rose-350 font-bold text-[9px] px-1 py-0.5 hover:bg-rose-500/10 rounded transition">
                                    حذف ×
                                  </button>
                                  <span className="text-slate-200 text-right leading-relaxed font-bold">{exe}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-900 pt-3 mt-3 flex justify-between items-center flex-row-reverse text-xs text-slate-450">
                        <span>وحدات النشاط بالخطة:</span>
                        <strong className="text-emerald-400 font-mono">{ptActiveExercises.length} تمارين مبرمجة</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* ICU CRITICAL CARE NURSING: Live Crisis & Rapid Emergency Interventions */}
                {activeCollegeId === "nur" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Part A: Hemodynamic vitals crashing dashboard */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                        <h4 className="text-xs font-bold text-slate-200">لوحة رعاية الحالات الحرجة وغرف الصدمات ICU</h4>
                        <span className="text-[9px] bg-red-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono">ICU Nurse Console</span>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-center space-y-4">
                        <div className="flex justify-between items-center flex-row-reverse border-b border-slate-800 pb-1.5">
                          <span className="text-[10px] text-slate-400 font-bold">الحالة الإكلينيكية الحالية:</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${nurIcuStatus === "Critical" ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`}>
                            {nurIcuStatus === "Critical" ? "غير مستقر - CRITICAL ALERT" : "حالة مستقرة - HELMET COMPLIANT STABLE"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-2 bg-slate-950 rounded border border-slate-850">
                            <span className="text-[9px] text-slate-500 block">Pulse Rate</span>
                            <strong className={`font-mono text-xl block ${nurHeartRate > 120 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>{nurHeartRate} BPM</strong>
                          </div>
                          
                          <div className="p-2 bg-slate-950 rounded border border-slate-850">
                            <span className="text-[9px] text-slate-500 block">SpO2 Oxygen</span>
                            <strong className={`font-mono text-xl block ${nurSpO2 < 90 ? "text-rose-400 animate-bounce" : "text-cyan-400"}`}>{nurSpO2}%</strong>
                          </div>

                          <div className="p-2 bg-slate-950 rounded border border-slate-850">
                            <span className="text-[9px] text-slate-500 block">Arterial BP</span>
                            <strong className="font-mono text-slate-200 text-xl block">{nurBloodPressure}</strong>
                          </div>
                        </div>

                        <div className="h-10 bg-slate-950 rounded border border-slate-900 flex items-center justify-center overflow-hidden">
                          {nurIcuStatus === "Critical" ? (
                            <span className="text-[9.5px] font-mono text-red-400 animate-pulse font-bold tracking-wider">⚠️ WARNING: SPO2 DROPPED BELOW 85%. INITIATE CPR OR ADRENALINE IMMEDIATELY!</span>
                          ) : (
                            <span className="text-[9.5px] font-mono text-emerald-400 font-bold">✅ VITALS RESTORED: SINUS RHYTHM HAS SHOWN STABILITY WITHIN STANDARD ICU LIMITS.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Part B: Rapid ICU Emergency Interventions */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                          <h4 className="text-xs font-bold text-slate-200">ماتريكس التدخل والإنقاذ السريع للممرض المقيم</h4>
                          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">Crash Cart v2</span>
                        </div>
                        <p className="text-[11px] text-slate-450 leading-relaxed text-right">
                          انقر على أدوات عربة الإنعاش (Crash Cart) أدناه لمحاكاة التدخل السريري والإنعاش الفوري للمريض من الصدمة الهيموديناميكية:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center text-xs">
                          <button
                            onClick={() => handleIcuAction("defib")}
                            className="bg-red-500 hover:bg-red-450 text-slate-950 font-black p-2 rounded cursor-pointer transition flex flex-col justify-center items-center gap-1"
                          >
                            <span>⚡ صدمة كهربائية</span>
                            <span className="text-[9px] font-mono opacity-85">Defib 200J</span>
                          </button>

                          <button
                            onClick={() => handleIcuAction("adrenaline")}
                            className="bg-amber-500 hover:bg-amber-450 text-slate-950 font-black p-2 rounded cursor-pointer transition flex flex-col justify-center items-center gap-1"
                          >
                            <span>💉 إعطاء تفاعل</span>
                            <span className="text-[9px] font-mono opacity-85">Adrenaline 1mg</span>
                          </button>

                          <button
                            onClick={() => handleIcuAction("compress")}
                            className="bg-cyan-500 hover:bg-cyan-450 text-slate-950 font-black p-2 rounded cursor-pointer transition flex flex-col justify-center items-center gap-1"
                          >
                            <span>🫁 إنعاش يدوي</span>
                            <span className="text-[9px] font-mono opacity-85">Airway / CPR</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 text-right mt-3">
                        <span className="text-[10px] text-slate-450">سجلات رعاية المريض وحالة الإنعاش (Emergency Logs):</span>
                        <div className="bg-slate-900 p-2 rounded border border-slate-850 h-[80px] overflow-y-auto font-mono text-[9px] text-slate-400 text-left leading-relaxed">
                          {nurCriticalLogs.map((log, idx) => (
                            <div key={idx} className={log.includes("Electroshock") || log.includes("RESTORED") ? "text-emerald-400" : log.includes("Given") ? "text-amber-400" : ""}>{log}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BUSINESS TRADE VIEW: Paper Trading simulated deck & Price elasticity calculators */}
                {activeCollegeId === "bus" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Part A: Paper Trading Brokerage simulator */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2">
                        <h4 className="text-xs font-bold text-slate-200">بوابة محاكاة تداول الأسهم وبناء المحافظ التنافسية (TradeSim)</h4>
                        <span className="text-[9px] bg-yellow-500/15 text-yellow-400 px-1.5 py-0.5 rounded font-mono">SGU Investment Lab</span>
                      </div>

                      <div className="space-y-3 text-right">
                        {/* Balance display */}
                        <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                          <strong className="font-mono text-emerald-400 text-base">{busCashBalance.toLocaleString()} ج.م</strong>
                          <span className="text-xs text-slate-400 font-bold">الرصيد النقدي التنافسي المتوفر للعمليات (Cash):</span>
                        </div>

                        {/* Trade amount config */}
                        <div className="flex gap-2 items-center justify-end">
                          <input
                            type="number"
                            min="1"
                            value={busTradeAmount}
                            onChange={(e) => setBusTradeAmount(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded p-1 text-xs text-center font-mono w-16"
                          />
                          <span className="text-[10px] text-slate-450 block">عدد الأسهم في العملية الواحدة:</span>
                        </div>

                        {/* Assets mapping and actions */}
                        <div className="space-y-1.5">
                          {[
                            { ticker: "SGU", name: "أسهم كليات الصالحية الموحدة", assetColor: "text-emerald-400" },
                            { ticker: "AAPL", name: "أبل كورب العالمية (AAPL US)", assetColor: "text-blue-400" },
                            { ticker: "BTC", name: "العملات الرقمية المشفرة (Bitcoin)", assetColor: "text-amber-400" },
                            { ticker: "GOLD", name: "أوقية الذهب الفورية الملاذ الآمن", assetColor: "text-yellow-400" }
                          ].map((asset) => {
                            const price = busPrices[asset.ticker];
                            const held = busPortfolio[asset.ticker] || 0;
                            return (
                              <div key={asset.ticker} className="p-2 bg-slate-900 rounded border border-slate-850/80 flex justify-between items-center text-[11px] flex-row-reverse">
                                <div className="text-right">
                                  <strong className={`${asset.assetColor} block font-mono`}>{asset.ticker} ({price.toLocaleString()} ج.م)</strong>
                                  <span className="text-[10px] text-slate-500">{asset.name}</span>
                                </div>
                                <div className="font-mono text-slate-300">الحيازة بالمحفظة: {held}</div>
                                <div className="flex gap-1">
                                  <button onClick={() => handleTradeStock(asset.ticker, "buy")} className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black px-2 py-1 rounded text-[9.5px] cursor-pointer">شراء</button>
                                  <button onClick={() => handleTradeStock(asset.ticker, "sell")} className="bg-rose-500 hover:bg-rose-450 text-slate-950 font-black px-2 py-1 rounded text-[9.5px] cursor-pointer">بيع</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Part B: Microeconomics project Break-Even calculator */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center flex-row-reverse border-b border-slate-900 pb-2 mb-3">
                          <h4 className="text-xs font-bold text-slate-200">مقياس تحليل نقطة التعادل والجدوى الاقتصادية (Break-Even Analyst)</h4>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Valuation Desk</span>
                        </div>
                        <p className="text-[11px] text-slate-450 leading-relaxed mb-4 text-right">
                          أداة لمعايرة تكاليف مشاريع ريادة الأعمال بحاضنة SGU واحتساب الحجم الإنتاجي المطلوب لتغطية التكاليف:
                        </p>

                        <div className="space-y-4 text-right">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span>{busFixedCost.toLocaleString()} ج.م</span>
                              <span>التكاليف الثابتة الشهرية (Fixed Cost - مقرات، رواتب):</span>
                            </div>
                            <input
                              type="range"
                              min="5000"
                              max="50000"
                              step="2500"
                              value={busFixedCost}
                              onChange={(e) => setBusFixedCost(parseInt(e.target.value))}
                              className="w-full accent-emerald-400"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span>{busVariableCost} ج.م / وحدة</span>
                              <span>المنصرف المتغير للوحدة المنتجة (Variable Cost):</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="200"
                              step="10"
                              value={busVariableCost}
                              onChange={(e) => setBusVariableCost(parseInt(e.target.value))}
                              className="w-full accent-emerald-400"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span>{busPricePerUnit} ج.م / وحدة</span>
                              <span>سعر مبيع المنتج النهائي المقترح (Sales Unit Price):</span>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="500"
                              step="10"
                              value={busPricePerUnit}
                              onChange={(e) => setBusPricePerUnit(parseInt(e.target.value))}
                              className="w-full accent-emerald-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Display breakdown results */}
                      <div className="p-4 bg-slate-900 rounded-xl border border-emerald-500/20 text-right mt-4 flex justify-between items-center flex-row-reverse text-xs">
                        <div>
                          <span className="text-slate-450 block">حجم المبيعات لتغطية التعادل:</span>
                          <strong className="text-emerald-400 font-mono text-base">{busBreakEvenVolume} وحدة مباعة</strong>
                        </div>
                        <div className="text-left font-sans text-[10.5px] text-slate-400 leading-normal max-w-[50%]">
                          {busPricePerUnit <= busVariableCost ? (
                            <span className="text-rose-450 font-bold block">تنبيه: سعر البيع أقل من التكلفة المتغيرة! خسارة محققة.</span>
                          ) : (
                            <span>عند بلوغ {busBreakEvenVolume} وحدة، سيتم تغطية كافة النفقات الثابتة والبدء في رصد هامش الربحية.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced GPA Graph & Financial Ledger Pie Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Academic Performance Graph Bar Chart */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-850">
                  <h4 className="text-xs font-black text-slate-200 mb-3 text-right">رصد توزيعات النتائج والمعدل التراكمي (GPA Patterns) للطلاب المقيدين بالكلية</h4>
                  {gpaChartData.length > 0 ? (
                    <div className="h-48 text-black">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gpaChartData}>
                          <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 9 }} />
                          <YAxis stroke="#6b7280" domain={[0, 4]} tick={{ fontSize: 9 }} />
                          <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "10px", color: "#fff" }} />
                          <Bar dataKey="gpa" fill="#10b981" radius={[4, 4, 0, 0]}>
                            {gpaChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.gpa >= 3.5 ? "#10b981" : entry.gpa >= 3.0 ? "#3b82f6" : "#f43f5e"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-xs text-slate-500">لا توجد سجلات لعرض بياني لحساب التراكمي للطلاب حالياً.</div>
                  )}
                </div>

                {/* Ledger Pie Chart summary */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-850">
                  <h4 className="text-xs font-black text-slate-200 mb-3 text-right">ملخص السداد والتحصيل من الرسوم والمنح الكلية الموحدة (جنيه مصري)</h4>
                  <div className="h-48 flex items-center justify-between">
                    <div className="w-1/2 h-full text-black">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={financeCount}
                            innerRadius={30}
                            outerRadius={55}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {financeCount.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 space-y-2 text-xs">
                      {financeCount.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 justify-end">
                          <span className="font-mono text-slate-300">{(f.value).toLocaleString()} ج.م</span>
                          <span className="text-slate-500 font-bold">{f.name}</span>
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: f.color }}></span>
                        </div>
                      ))}
                      <div className="border-t border-slate-800 pt-1.5 text-[10px] text-slate-400 text-right leading-relaxed">
                        يتم تحديث الديون والمنصرفات والمنح بنسب استحقاق تفضيلية ٢٥٪ و ٥٠٪ و ١٠٠٪ فوراً.
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* B. ACADEMICS SECTION: Student Folder Registry & Teaching Staff */}
          {activeTab === "academics" && (
            <div className="space-y-6">
              
              {/* Nested Tabs toggle */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-4">
                
                {/* 1. STUDENT DOSSIERS & FILES / TRANSFERS */}
                <div>
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-4">الملف الإجرائي للطلاب (ملفات الوثائق، القبول والتحويلات الأكاديمية)</h3>
                  
                  {/* Register New Student */}
                  <form onSubmit={registerStudent} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4 text-right">
                    <span className="text-[11px] text-slate-400 block font-bold">تسجيل وقيد طالب ذو ملف جديد بالكلية:</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="اسم الطالب رباعياً باللغة العربية"
                        value={newStudName}
                        onChange={(e) => setNewStudName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-right focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="مشروع البحث (AI، OSCE، CAD ...)"
                        value={newStudProject}
                        onChange={(e) => setNewStudProject(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-right focus:border-emerald-500"
                      />
                      <select
                        value={newStudLevel}
                        onChange={(e) => setNewStudLevel(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-slate-350 text-right"
                      >
                        <option value="المستوى الأول">المستوى الأول</option>
                        <option value="المستوى الثاني">المستوى الثاني</option>
                        <option value="المستوى الثالث">المستوى الثالث</option>
                        <option value="الفرقة الخامسة">الفرقة الخامسة</option>
                        <option value="الفرقة السادسة">الفرقة السادسة</option>
                      </select>
                    </div>
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 px-4 py-2 rounded font-black text-xs cursor-pointer transition">
                      حفظ السجل الأكاديمي والوثائق الأساسية وتعميد الرمز الجامعي
                    </button>
                  </form>

                  {/* Students files verification and Transfer deck */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    
                    {/* Student dossier files checking */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                      <h4 className="text-[11px] font-black text-slate-300">متابعة الأوراق الرسمية المودعة في الأرشيف (ملفات الطلاب)</h4>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto">
                        {colData.students.map((st) => (
                          <div key={st.id} className="p-2 bg-slate-900 rounded border border-slate-850 space-y-1.5 text-[10.5px]">
                            <div className="flex justify-between font-bold">
                              <span className="text-slate-450 font-mono text-[9px]">{st.id}</span>
                              <span className="text-slate-200">{st.name}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {st.documents.map((doc, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleDocumentApprove(st.id, doc.name)}
                                  disabled={doc.status === "Submitted"}
                                  className={`text-[9px] px-1.5 py-0.5 rounded transition ${doc.status === "Submitted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 cursor-not-allowed" : "bg-rose-500/10 text-rose-450 border border-rose-500/20 hover:bg-rose-500/25 cursor-pointer"}`}
                                >
                                  {doc.name} ({doc.status === "Submitted" ? "معتمد 📁" : "معلق ⏳"})
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Faculty/College Transfers system */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                      <h4 className="text-[11px] font-black text-slate-300 flex items-center gap-1 justify-end">
                        <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
                        طلبات التحويل للأعوام الدراسية وقبول التحويلات (من جامعات أخرى)
                      </h4>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto">
                        {colData.transfers.length === 0 ? (
                          <div className="text-slate-500 text-center py-4 text-[10px]">لا يوجد طلبات تحويل موجهة حالياً لهذه الكلية</div>
                        ) : (
                          colData.transfers.map((req) => (
                            <div key={req.id} className="p-2.5 bg-slate-900 rounded border border-slate-850 flex justify-between items-center text-[10.5px]">
                              <div className="flex gap-1.5">
                                {req.status === "Pending" ? (
                                  <>
                                    <button onClick={() => handleTransferDecision(req.id, "Approved")} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-1.5 py-0.5 rounded text-[9.5px] cursor-pointer">قبول ورصد</button>
                                    <button onClick={() => handleTransferDecision(req.id, "Rejected")} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-1.5 py-0.5 rounded text-[9.5px] cursor-pointer">رفض</button>
                                  </>
                                ) : (
                                  <span className={`text-[9.5px] font-bold ${req.status === "Approved" ? "text-emerald-400" : "text-rose-400"}`}>
                                    {req.status === "Approved" ? "مقبول وثبت القيد" : "طلب مرفوض"}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-slate-200 block font-bold">{req.studentName}</span>
                                <span className="text-[9.5px] text-slate-450 block">معدله التراكمي: {req.gpa} • تحويل من: {req.origin}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>

                {/* 2. COURSE SYLLABUS MANAGEMENT WITH PREREQUISITES */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-4">تنظيم المناهج وتفصيل الخطط الأكاديمية (مقررات ومتطلبات سابق)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Add core course */}
                    <form onSubmit={handleCreateCourse} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                      <span className="text-[11px] text-slate-400 block font-bold">تسجيل وإضافة مادة أو مقرر للائحة المعتمدة بالكلية:</span>
                      <input
                        type="text"
                        required
                        placeholder="اسم المادة (مثال: جراحة العظام وتأهيلها)"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-right focus:border-emerald-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="رمز المقرر (DENT352)"
                          value={newCourseCode}
                          onChange={(e) => setNewCourseCode(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-right focus:border-emerald-500"
                        />
                        <select
                          value={newCoursePrereq}
                          onChange={(e) => setNewCoursePrereq(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-slate-350 text-right"
                        >
                          <option value="لا يوجد">لا يوجد متطلب سابق</option>
                          {colData.courses.map(c => (
                            <option key={c.id} value={c.code}>{c.title} ({c.code})</option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-450 text-slate-950 py-2 rounded font-black text-xs cursor-pointer transition">
                        إقرار المنهج في لائحة متطلبات الكلية
                      </button>
                    </form>

                    {/* Active Curricula list */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                      <span className="text-[11px] font-black text-slate-300 block">قائمة المساقات والخطط المعتمدة في الأرشيف الفصلي للكلية</span>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                        {colData.courses.map((crs) => (
                          <div key={crs.id} className="p-2 bg-slate-900 rounded border border-slate-850 flex justify-between items-center text-[10.5px]">
                            <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-emerald-400 font-bold">{crs.code}</span>
                            <div className="text-right">
                              <span className="text-slate-200 block font-bold">{crs.title}</span>
                              <span className="text-[9px] text-slate-500 block">المتطلب السابق له: <strong className="text-slate-400">{crs.prerequisite}</strong> • {crs.creditHours} ساعات معتمدة</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* 3. TEACHING STAFF DIRECTORY (PROFESSORS, TAs, LAB ADMINS) */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-4">كادر هيئة التدريس والعلميين والسريريين بالكلية (دكاترة، معيدين، مساعدين)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Add Professor Form */}
                    <form onSubmit={handleFacultyRegister} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                      <span className="text-[11px] text-slate-400 block font-bold">تسجيل وتكليف عضو هيئة تدريس / معيد جديد بالكلية:</span>
                      <input
                        type="text"
                        required
                        placeholder="الاسم والألقاب الأكاديمية"
                        value={newProfName}
                        onChange={(e) => setNewProfName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-right focus:border-emerald-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="التخصص الدقيق (معالجة إشارات، طب الجذور...)"
                          value={newProfSpecialty}
                          onChange={(e) => setNewProfSpecialty(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-right focus:border-emerald-500"
                        />
                        <select
                          value={newProfRank}
                          onChange={(e) => setNewProfRank(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-slate-350 text-right"
                        >
                          <option value="أستاذ دكتور">أستاذ دكتور</option>
                          <option value="أستاذ مساعد">أستاذ مساعد</option>
                          <option value="مدرس">مدرس</option>
                          <option value="معيد ومحاكٍ سريري">معيد ومحاكٍ سريري</option>
                          <option value="مساعد هيئة تدريس فني">مساعد هيئة تدريس فني</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-450 text-slate-950 py-2 rounded font-black text-xs cursor-pointer transition">
                        اعتماد تكليف العضو ونصاب الحصص الموزعة بالـ ERP
                      </button>
                    </form>

                    {/* Staff List */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                      <span className="text-[11px] font-black text-slate-300 block">أخصائيين وطواقم دكاترة ومعيدي الكلية المقيدين رسمياً</span>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                        {colData.professors.map((p) => (
                          <div key={p.id} className="p-2.5 bg-slate-900 rounded border border-slate-850 flex justify-between items-center text-[10.5px]">
                            <span className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 font-bold text-[9px]">{p.rank}</span>
                            <div className="text-right">
                              <span className="text-slate-200 block font-bold">{p.name}</span>
                              <span className="text-[9.5px] text-slate-500 block">تخصص: {p.specialty} • نصاب التدريس الموزع أسبوعياً: {p.hours} ساعة معتمدة</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* C. REGISTRATIONS & GRADES SECTION: Course add/drop & Grade Entry */}
          {activeTab === "registrations" && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-850 space-y-6">
                
                {/* 1. INTERACTIVE REGISTERED COURSES - ADD / DROP */}
                <div>
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-4">بوابة الخدمة الذاتية للتسجيل والقيد (شعبة الإضافة والسحب للمساقات)</h3>
                  
                  <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">يرجى تحديد الطالب المستحق في كشوف الكلية:</label>
                        <select
                          value={selectedStudentId}
                          onChange={(e) => setSelectedStudentId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-slate-350 text-right"
                        >
                          <option value="">-- اختر طالب من السجل --</option>
                          {colData.students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">قرر المنهج المراد تسجيله أو إسقاطه:</label>
                        <select
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs outline-none text-slate-350 text-right"
                        >
                          <option value="">-- المقررات المعتمدة باللائحة --</option>
                          {colData.courses.map(c => (
                            <option key={c.id} value={c.code}>{c.title} ({c.code})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedStudentId && (
                      <div className="p-3 bg-slate-900 rounded-lg text-[11px] space-y-3">
                        <div className="flex justify-between font-bold border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400">المقررات المسجلة حالياً بالملف الشخصي</span>
                          <span className="text-slate-200">
                            سجل الطالب: {colData.students.find(s => s.id === selectedStudentId)?.name}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {colData.students.find(s => s.id === selectedStudentId)?.registeredCourses.map((cCode, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                              <button
                                onClick={() => handleAddDropCourse(selectedStudentId, cCode, "drop")}
                                className="text-rose-400 hover:text-rose-350 font-black text-[9.5px]"
                                title="إسقاط وسحب المادة"
                              >
                                سحب ×
                              </button>
                              <strong className="text-slate-300 font-mono text-[10px]">{cCode}</strong>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-start gap-2 pt-1">
                          <button
                            type="button"
                            disabled={!selectedCourseId}
                            onClick={() => handleAddDropCourse(selectedStudentId, selectedCourseId, "add")}
                            className="bg-emerald-500 hover:bg-emerald-450 disabled:bg-slate-950 text-slate-950 font-black px-4 py-1.5 rounded text-[10px] cursor-pointer transition"
                          >
                            + إضافة المادة المحددة في الجدول
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. CORE STUDENT GRADES - EXAMS, MIDTERM, FINAL, PRACTICAL */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-4">كنترول الفصل الدراسي (رصد ومكافحة التقديرات: نهائي، نصفي، عملي)</h3>
                  
                  <form onSubmit={handleGradeSubmit} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
                    <span className="text-[11px] text-slate-400 block font-bold">تسجيل وتنزيل علامات الطالب في المقرر المعتمد (الدرجات من 100):</span>
                    
                    <div className="grid grid-cols-3 gap-3 text-right">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-450">أعمال النصفي - Midterm:</label>
                        <input
                          type="number"
                          max="20"
                          min="0"
                          value={midtermGrade}
                          onChange={(e) => setMidtermGrade(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-right outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-450">عملي/شفهي - Practical:</label>
                        <input
                          type="number"
                          max="20"
                          min="0"
                          value={practicalGrade}
                          onChange={(e) => setPracticalGrade(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-right outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-450">نهائي - Final Exam:</label>
                        <input
                          type="number"
                          max="60"
                          min="0"
                          value={finalGrade}
                          onChange={(e) => setFinalGrade(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-right outline-none font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedStudentId || !selectedCourseId}
                      className="w-full bg-emerald-500 hover:bg-emerald-450 disabled:bg-slate-900 text-slate-950 py-2 rounded font-black text-xs cursor-pointer transition"
                    >
                      حفظ السجل الشرفي للدرجة وتعديل المعدل التراكمي GPA للرصيد بنجاح
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* D. OPERATIONS VIEW: Attendance Scanners, Finance & Library Overdues */}
          {activeTab === "operations" && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-850 space-y-6">
                
                {/* 1. DIGITAL ATTENDANCE LOGGERS (QR, NFC OR BIOMETRICS) */}
                <div>
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-3 flex items-center justify-end gap-1">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    منظومة التدقيق ورصد الحضور الذكية بالكلية (يدوي، QR، NFC، بصمة)
                  </h3>
                  
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                    <span className="text-[11px] text-slate-400 block leading-relaxed text-right">
                      رصد ومطابقة حضور المحاضرات والعيادات السرية الفورية للحد من الغيابات عبر الهواتف والبطاقات الجامعية الذكية.
                    </span>
                    <div className="flex gap-2 justify-end">
                      <select
                        value={scanMethod}
                        onChange={(e) => setScanMethod(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-350 outline-none"
                      >
                        <option value="AI Face Scanner">بصمة ملامح الوجه بالكاميرا (AI Face)</option>
                        <option value="NFC Smart Band">نظام بصمة البطاقة الجامعية (Smart NFC)</option>
                        <option value="Fingerprint Reader">قارئ بصمة الإصبع للعيادات (Fingerprint)</option>
                        <option value="QR Code Scan">البث بالباركود الذاتي (QR Code)</option>
                        <option value="Instructor manual Roster">دفتر التحضير اليدوي للدكتور</option>
                      </select>
                      
                      <button
                        onClick={() => {
                          if (colData.students.length > 0) {
                            setScannerStudent(colData.students[0].id);
                            setScannerOpen(true);
                          }
                        }}
                        className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 px-4 py-2 rounded text-xs font-black cursor-pointer transition"
                      >
                        محاكاة تحضير طالب فوري بالكود والماسح
                      </button>
                    </div>

                    {/* Simple Scanner simulator interface */}
                    {scannerOpen && (
                      <div className="p-4 bg-slate-900 rounded-lg border border-emerald-500/30 text-center space-y-3">
                        <span className="text-[11px] text-emerald-400 font-bold block animate-pulse">جاري تفويض جهاز المحاكاة والماسح وقراءة البصمات المقيدة...</span>
                        <select
                          value={scannerStudent}
                          onChange={(e) => setScannerStudent(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded p-2 text-xs outline-none text-slate-200"
                        >
                          {colData.students.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                        <div className="flex justify-center gap-2">
                          <button onClick={triggerMockAttendanceScan} className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 px-3 py-1 rounded text-[11px] font-black cursor-pointer">تحقق وقيد الحضور</button>
                          <button onClick={() => setScannerOpen(false)} className="bg-slate-850 hover:bg-slate-800 text-slate-400 px-3 py-1 rounded text-[11px] cursor-pointer">إلغاء ×</button>
                        </div>
                      </div>
                    )}

                    {/* Attendance Logs List */}
                    <div className="max-h-[140px] overflow-y-auto space-y-1.5 pt-2">
                      {colData.attendance.length === 0 ? (
                        <div className="text-slate-500 text-center text-[10px] py-2">لم يجر كشوف رصد حضور اليوم حالياً</div>
                      ) : (
                        colData.attendance.map((at) => (
                          <div key={at.id} className="p-2 bg-slate-900 rounded border border-slate-850 flex justify-between items-center text-[10.5px]">
                            <span className="bg-slate-950 font-mono text-[9px] px-1.5 py-0.5 rounded text-indigo-400">{at.method}</span>
                            <div className="text-right">
                              <span className="text-slate-300 font-bold">{at.studentName}</span>
                              <span className="text-[9.5px] text-slate-500 block">التاريخ: {at.date} • حالة رصد: <strong className="text-emerald-450">{at.status}</strong></span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                </div>

                {/* 2. DETAILED FINANCIALS, DISCOUNTS & SCHOLARSHIPS */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-3">شعبة الرسوم والمنح والتقسيط (أقساط، خصم تفوق، منح معينة)</h3>
                  
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Set Scholarship and plan form */}
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-3 text-right">
                        <span className="text-[10.5px] font-bold text-slate-300 block">إقرار الخصومات وتوزيع الأقساط:</span>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={financeDiscount}
                            onChange={(e: any) => setFinanceDiscount(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded p-1.5 text-[10.5px] text-slate-300 outline-none"
                          >
                            <option value="None">None (رسوم كاملة)</option>
                            <option value="25%">خصم ٢٥٪ تفوق علمي</option>
                            <option value="50%">خصم ٥٠٪ تمثيل رياضي</option>
                            <option value="Full 100%">منحة مجانية كاملة ١٠٠٪</option>
                          </select>
                          <select
                            value={financeInstallments}
                            onChange={(e: any) => setFinanceInstallments(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded p-1.5 text-[10.5px] text-slate-300 outline-none"
                          >
                            <option value="Cash">سداد نقدي (كاش)</option>
                            <option value="2 Payments">تقسيط على قسطين</option>
                            <option value="4 Payments">تقسيط على ٤ دفعات</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const rec = colData.finance[0];
                            if (rec) handleApplyFeesSettings(rec.id);
                          }}
                          className="bg-blue-500 hover:bg-blue-450 text-slate-950 px-3 py-1 rounded text-[10px] font-black transition cursor-pointer"
                        >
                          تفعيل على ملف أول طالب مصنف
                        </button>
                      </div>

                      {/* Pay fee */}
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-3 text-right">
                        <span className="text-[10.5px] font-bold text-slate-300 block">توثيق واستلام دفعة مالية نقداً:</span>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="1000"
                            value={paymentInput}
                            onChange={(e) => setPaymentInput(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded p-1.5 text-xs outline-none text-right flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const rec = colData.finance[0];
                              if (rec) handleExecutePayment(rec.id);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 px-3 py-1.5 rounded text-[11px] font-black cursor-pointer"
                          >
                            سجل السند المالي
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Financial stats list */}
                    <div className="space-y-1.5">
                      {colData.finance.map((fn) => {
                        const unpaid = fn.amount - fn.paid;
                        return (
                          <div key={fn.id} className="p-2.5 bg-slate-900 rounded border border-slate-850 flex justify-between items-center text-[10.5px]">
                            <div className="text-left font-mono text-emerald-400 font-bold">
                              <div>المسدد: {fn.paid.toLocaleString()} ج.م</div>
                              <div className="text-[9px] text-slate-500">المتبقي: {unpaid.toLocaleString()} ج.م</div>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-200 block font-bold">{fn.studentName}</span>
                              <span className="text-[9.5px] text-slate-500 block">
                                الرسوم الإجمالية: {fn.amount.toLocaleString()} ج.م • نظام: <strong className="text-slate-400">{fn.installments}</strong> • الخصم: <strong className="text-blue-400">{fn.scholarship}</strong>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* 3. ACADEMIC LIBRARY TEXTBOOKS & OVERDUE FINES */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-3">لوحة المكتبة الأكاديمية واسترداد المراجع والغرامات</h3>
                  
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                    <span className="text-[11px] text-slate-400 block text-right">
                      رصد غرامات التأخير المتراكمة على إعارة أصل الكتب. تحتسب الغرامة بقيمة <strong className="text-rose-400">٥٠ جنيه يومياً</strong> لكل مرجع متأخر.
                    </span>

                    <div className="space-y-1.5">
                      {colData.library.length === 0 ? (
                        <div className="text-slate-505 text-center text-xs py-4 text-slate-500">لا يوجد كتب مستعارة حالياً بقسم مكتبة الكلية</div>
                      ) : (
                        colData.library.map((loan) => {
                          const today = new Date("2026-06-20");
                          const due = new Date(loan.dueDate);
                          const diffTime = Math.abs(today.getTime() - due.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          const fine = loan.status === "Overdue" ? diffDays * 50 : 0;

                          return (
                            <div key={loan.id} className="p-3 bg-slate-900 rounded border border-slate-850 flex justify-between items-center text-[11px]">
                              <div>
                                <button
                                  onClick={() => handleReturnBookAndPayFine(loan.id)}
                                  className="bg-rose-500 hover:bg-rose-450 text-slate-950 px-2.5 py-1 rounded text-[10px] font-black cursor-pointer transition"
                                >
                                  تسوية الغرامة ({fine} ج.م) واسترجاع الكتاب
                                </button>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-200 block font-bold">"{loan.title}"</span>
                                <span className="text-[9.5px] text-slate-500 block">
                                  تاريخ الاستحقاق: {loan.dueDate} (متأخر {diffDays} أيام) • المستعير: <strong className="text-slate-400">{loan.borrowerName}</strong>
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. NOTIFICATION BOARD - MULTI-CHANNEL SENDER */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2 mb-3">بث الإشعارات وتنبيه الهواتف (SMS، Email، Push، WhatsApp) SGU</h3>
                  
                  <form onSubmit={handleNotificationBroadcast} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                    <span className="text-[11px] text-slate-400 block text-right">
                      بث رسائل تنبيهية فردية أو جماعية للطلاب وأجهزة هيئة التدريس عبر شبكات الجوال الموصولة مركزيًا بالبوابة الموحدة:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block">قناة الإرسال:</label>
                        <select
                          value={notifChannel}
                          onChange={(e: any) => setNotifChannel(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none text-right"
                        >
                          <option value="WhatsApp">💬 تطبيق واتساب (WhatsApp Channel)</option>
                          <option value="SMS">📱 شبكة الجوال القصيرة (SMS Cellular)</option>
                          <option value="Email">✉️ البريد الإلكتروني الأكاديمي (Secure Email)</option>
                          <option value="Push">🔔 إشعارات الويب وتطبيق الهاتف (App Push)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block">مضمون البث أو التنبيه الحاسم:</label>
                        <select
                          value={notifTemplate}
                          onChange={(e) => setNotifTemplate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none text-right"
                        >
                          <option value="تنبيه الحضور والأقساط العاجلة">تنبيه الحضور والإنذار المالي للأقساط</option>
                          <option value="نداء الامتحانات الإكلينيكية OSCE الموحدة">نداء موعد وخطوات لجان OSCE الطبية</option>
                          <option value="إشعار غرامة وتأخير بالـ Library">تنبيه الغرامة لعدم تسليم الكتاب في اللموعد</option>
                          <option value="إشعار قبول طلب التحويل والوثائق">تأكيد قبول طلب التحويل وتعديل ملف القيد الأساسي</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-450 text-slate-950 py-2 rounded font-black text-xs cursor-pointer transition">
                      بث وإرسال الإشعار الفوري للمستخدم المقيد بالـ ERP
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default function SguCollegeSystem({
  student,
  setStudent,
  addLog,
  coursesByCollege,
  setCourses
}: any) {
  return <SguCollegeSystemContent />;
}
