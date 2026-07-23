import React, { useState, useMemo, useEffect } from "react";
import {
  Code, HeartPulse, Award, Activity, Clock, Users, BookOpen, Calendar,
  DollarSign, BookMarked, TrendingUp, AlertTriangle, Trash2, RefreshCw,
  Cpu, CheckCircle2, ShieldCheck, FileText, QrCode, Mail, Smartphone,
  Download, Send, MessageSquare, Flame, Check, Sparkles, Book, Info, Plus, Sliders, Play, Settings, Upload
} from "lucide-react";
import { motion } from "motion/react";

// =========================================================================
// STRUCTURED ERP SPECIALTY & DEPARTMENT-SPECIFIC METADATA
// =========================================================================
interface DeptDetailItem {
  headAr: string;
  headEn: string;
  profCount: number;
  studentsCount: number;
  announcementsAr: string[];
  announcementsEn: string[];
  lecturesAr: { title: string; doctor: string; date: string; code: string }[];
  lecturesEn: { title: string; doctor: string; date: string; code: string }[];
}

const departmentDetails: Record<string, Record<string, DeptDetailItem>> = {
  fcis: {
    "علوم الحاسب (CS)": {
      headAr: "أ.د. سمير عبد الرؤوف",
      headEn: "Prof. Samir Abdelraouf",
      profCount: 14,
      studentsCount: 380,
      announcementsAr: [
        "بدء ورش عمل البرمجة التنافسية (Competitive Programming) بقاعة المؤتمرات هذا الثلاثاء.",
        "تم تفعيل رابط تسليم واجب مقرر هياكل البيانات والخوارزميات عبر البوابة الإلكترونية."
      ],
      announcementsEn: [
        "Competitive Programming workshops start this Tuesday in the Main Conference Hall.",
        "Data Structures and Algorithms homework submission link is active on ERP."
      ],
      lecturesAr: [
        { title: "محاضرة 4: تصميم وتحليل الخوارزميات المتقدمة والفرز السريع", doctor: "أ.د. سمير عبد الرؤوف", code: "CS302-L4", date: "منذ يومين" },
        { title: "محاضرة 3: هياكل البيانات غير الخطية والبحث الثنائي المتوازن", doctor: "د. أحمد يسري", code: "CS201-L3", date: "منذ 4 أيام" }
      ],
      lecturesEn: [
        { title: "Lecture 4: Advanced Algorithms Design & Quicksort Analysis", doctor: "Prof. Samir Abdelraouf", code: "CS302-L4", date: "2 days ago" },
        { title: "Lecture 3: Non-Linear Data Structures & Balanced Binary Trees", doctor: "Dr. Ahmed Yousry", code: "CS201-L3", date: "4 days ago" }
      ]
    },
    "هندسة البرمجيات (SE)": {
      headAr: "أ.د. منال محمود الديب",
      headEn: "Prof. Manal El-Deeb",
      profCount: 11,
      studentsCount: 290,
      announcementsAr: [
        "يرجى مراجعة موعد تسليم نموذج المتطلبات الأولية (SRS Document) لمشروع التخرج النهائي.",
        "ورشة عمل متميزة حول منهجيات Agile & CI/CD DevOps بالتعاون مع كبرى شركات البرمجيات."
      ],
      announcementsEn: [
        "Please check the deadline for the initial SRS Document submission for your Graduation Projects.",
        "Comprehensive Agile & CI/CD DevOps workshop in collaboration with leading software enterprises."
      ],
      lecturesAr: [
        { title: "محاضرة 5: أنماط التصميم المعمارية للأنظمة الكبيرة الموزعة", doctor: "أ.د. منال الديب", code: "SE402-L5", date: "اليوم" },
        { title: "محاضرة 4: اختبار جودة البرمجيات وأنواع الفحص والتكامل المستمر", doctor: "د. هبة عبد الرحمن", code: "SE301-L4", date: "منذ 3 أيام" }
      ],
      lecturesEn: [
        { title: "Lecture 5: Architectural Design Patterns in Distributed Microservices", doctor: "Prof. Manal El-Deeb", code: "SE402-L5", date: "Today" },
        { title: "Lecture 4: Software Quality Assurance, Testing Frameworks & CI", doctor: "Dr. Heba Abdelrahman", code: "SE301-L4", date: "3 days ago" }
      ]
    },
    "الذكاء الاصطناعي (AI)": {
      headAr: "د. رامي رياض الحفناوي",
      headEn: "Dr. Ramy El-Hefnawy",
      profCount: 9,
      studentsCount: 240,
      announcementsAr: [
        "سيبدأ تفعيل حسابات الطلاب الرسمية على بيئة الحوسبة السحابية ومسرعات GPU يوم الأربعاء المقبل.",
        "فتح باب التسجيل في مسابقة الذكاء الاصطناعي للتطبيقات الطبية وتصميم النماذج الذكية."
      ],
      announcementsEn: [
        "Student GPU cloud cluster and Jupyter Lab accounts will be activated this Wednesday.",
        "Registration for the Medical AI Innovations & Neural Modeling competition is now open."
      ],
      lecturesAr: [
        { title: "محاضرة 6: الشبكات العصبية الالتفافية وتطبيقات تصنيف الصور الطبية", doctor: "د. رامي رياض", code: "AI401-L6", date: "أمس" },
        { title: "محاضرة 5: خوارزميات تعلم الآلة الكلاسيكية ومناهج التصنيف", doctor: "د. رامي رياض", code: "AI302-L5", date: "منذ 5 أيام" }
      ],
      lecturesEn: [
        { title: "Lecture 6: Convolutional Neural Networks & Medical Image Classification", doctor: "Dr. Ramy El-Hefnawy", code: "AI401-L6", date: "Yesterday" },
        { title: "Lecture 5: Classical Machine Learning & Classification Algorithms", doctor: "Dr. Ramy El-Hefnawy", code: "AI302-L5", date: "5 days ago" }
      ]
    },
    "تكنولوجيا المعلومات (IT)": {
      headAr: "أ.د. رأفت عزمي غالي",
      headEn: "Prof. Rafat Azmy Ghaly",
      profCount: 12,
      studentsCount: 310,
      announcementsAr: [
        "يبدأ الأسبوع المقبل التدريب العملي على إعداد وبرمجة الراوترات والسويتشات في معامل الشبكات.",
        "دورة إعداد مجانية لشهادة Cisco CCNA المعتمدة بالتعاون مع مركز تكنولوجيا المعلومات بالأكاديمية."
      ],
      announcementsEn: [
        "Hands-on routing and switching configuration labs start next Sunday in Network Lab B.",
        "Free Cisco CCNA preparation boot camp in collaboration with SGU IT Center."
      ],
      lecturesAr: [
        { title: "محاضرة 5: بروتوكولات التوجيه الديناميكي المتقدم OSPF & BGP", doctor: "أ.د. رأفت عزمي", code: "IT302-L5", date: "اليوم" },
        { title: "محاضرة 4: أمن الشبكات والشبكات الافتراضية الخاصة وطرق التشفير", doctor: "د. مينا فريد", code: "IT301-L4", date: "منذ يومين" }
      ],
      lecturesEn: [
        { title: "Lecture 5: Routing Protocols OSPF & BGP Architecture", doctor: "Prof. Rafat Azmy", code: "IT302-L5", date: "Today" },
        { title: "Lecture 4: Network Security Protocols, VPNs & Encryption Standards", doctor: "Dr. Mina Farid", code: "IT301-L4", date: "2 days ago" }
      ]
    }
  },
  med: {
    "التشريح وعلم الأنسجة (Anatomy)": {
      headAr: "أ.د. يحيى زكريا سليمان",
      headEn: "Prof. Yehia Zakaria Soliman",
      profCount: 16,
      studentsCount: 450,
      announcementsAr: [
        "يجب على طلاب الفرقة الأولى إحضار بالطو التشريح الكامل وكتيب التدريب العملي داخل المشرحة.",
        "جدول امتحانات العملي لمقرر تشريح الطرف العلوي متوفر الآن في المعمل الرئيسي."
      ],
      announcementsEn: [
        "First-year students must strictly bring their dissection coats and lab guides.",
        "Upper Limb practical anatomy examination schedule is now posted in the main dissection lab."
      ],
      lecturesAr: [
        { title: "محاضرة 8: تشريح تجويف الصدر والأعصاب والأوعية الدموية الكبرى", doctor: "أ.د. يحيى زكريا", code: "ANAT101-L8", date: "أمس" },
        { title: "محاضرة 7: العضلات الهيكلية والجهاز العصبي للطرف السفلي", doctor: "د. فاطمة عادل", code: "ANAT101-L7", date: "منذ 4 أيام" }
      ],
      lecturesEn: [
        { title: "Lecture 8: Anatomy of the Thoracic Cavity, Great Vessels & Nerves", doctor: "Prof. Yehia Zakaria", code: "ANAT101-L8", date: "Yesterday" },
        { title: "Lecture 7: Musculoskeletal System & Innervation of Lower Limb", doctor: "Dr. Fatima Adel", code: "ANAT101-L7", date: "4 days ago" }
      ]
    },
    "علم وظائف الأعضاء (Physiology)": {
      headAr: "أ.د. جيهان كمال شاكر",
      headEn: "Prof. Jihan Kamal Shaker",
      profCount: 12,
      studentsCount: 420,
      announcementsAr: [
        "محاضرة تفاعلية هذا الخميس حول فسيولوجيا الغدد الصماء باستخدام برنامج محاكاة SGU الحسي.",
        "يرجى قراءة ورقة التجربة المعملية لقياس الضغط ونشاط القلب ورسم القلب ECG قبل الحضور."
      ],
      announcementsEn: [
        "Interactive lecture on Endocrinology Physiology this Thursday using SGU visual simulators.",
        "Please read Blood Pressure & ECG practical sheets prior to attending the laboratory session."
      ],
      lecturesAr: [
        { title: "محاضرة 6: فسيولوجيا الكلى والتوازن الحمضي القاعدي بالدم", doctor: "أ.د. جيهان كمال", code: "PHYS102-L6", date: "اليوم" },
        { title: "محاضرة 5: الدورة الدموية الكبرى والتنظيم الهرموني لضغط الدم", doctor: "د. هاني عثمان", code: "PHYS102-L5", date: "منذ يومين" }
      ],
      lecturesEn: [
        { title: "Lecture 6: Renal Physiology & Acid-Base Equilibrium in Human Blood", doctor: "Prof. Jihan Kamal Shaker", code: "PHYS102-L6", date: "Today" },
        { title: "Lecture 5: Cardiovascular Circulation & Hormonal Blood Pressure Regulation", doctor: "Dr. Hany Osman", code: "PHYS102-L5", date: "2 days ago" }
      ]
    },
    "الجراحة العامة (Surgery)": {
      headAr: "أ.د. شريف عبد اللطيف الشافعي",
      headEn: "Prof. Sherif Abdel-Latif El-Shafei",
      profCount: 20,
      studentsCount: 390,
      announcementsAr: [
        "توزيع المجموعات الإكلينيكية على غرف العمليات بمستشفى الجامعة متوفر الآن بالقسم.",
        "امتحان الشفوي النهائي لمقرر جراحة البطن يبدأ الأسبوع المقبل وفق الجداول."
      ],
      announcementsEn: [
        "Clinical rotations and OR group distributions at SGU Hospital are now posted in the section.",
        "Final Oral Examination for Abdominal Surgery starts next week according to posted schedules."
      ],
      lecturesAr: [
        { title: "محاضرة 10: جراحات الجهاز الهضمي والفتق الإربي والتقنيات الحديثة", doctor: "أ.د. شريف الشافعي", code: "SURG402-L10", date: "أمس" },
        { title: "محاضرة 9: التعقيم والمبادئ الأساسية للمحافظة على بيئة غرفة العمليات", doctor: "د. أحمد منصور", code: "SURG402-L9", date: "منذ 5 أيام" }
      ],
      lecturesEn: [
        { title: "Lecture 10: Gastrointestinal Surgery & Hernia Repair Techniques", doctor: "Prof. Sherif El-Shafei", code: "SURG402-L10", date: "Yesterday" },
        { title: "Lecture 9: Asepsis & Fundamental Principles of Sterile Operating Rooms", doctor: "Dr. Ahmed Mansour", code: "SURG402-L9", date: "5 days ago" }
      ]
    },
    "الأطفال (Pediatrics)": {
      headAr: "أ.د. نادية عبد الهادي مرسي",
      headEn: "Prof. Nadia Abdel-Hady Morsi",
      profCount: 15,
      studentsCount: 400,
      announcementsAr: [
        "ورشة عمل إنعاش المواليد (NRP) بقاعة المحاكاة الكبرى إلزامية لجميع طلاب الفرقة الرابعة.",
        "ندوة علمية حول أمراض سوء التغذية في الأطفال وطرق الوقاية السريرية والرعاية الفائقة."
      ],
      announcementsEn: [
        "Neonatal Resuscitation Program (NRP) workshop is mandatory for all senior medical students.",
        "Scientific seminar on Childhood Malnutrition, Clinical Prevention & Intensive Pediatric Care."
      ],
      lecturesAr: [
        { title: "محاضرة 7: النمو والتطور الطبيعي والمعرفي في الرضع والأطفال", doctor: "أ.د. نادية عبد الهادي", code: "PED401-L7", date: "منذ يومين" },
        { title: "محاضرة 6: التطعيمات الأساسية وأمراض الجهاز التنفسي الحادة لدى الرضع", doctor: "د. مروة كامل", code: "PED401-L6", date: "منذ 4 أيام" }
      ],
      lecturesEn: [
        { title: "Lecture 7: Normal Growth, Cognitive & Milestone Development in Infants", doctor: "Prof. Nadia Morsi", code: "PED401-L7", date: "2 days ago" },
        { title: "Lecture 6: Childhood Immunization Schedule & Acute Pediatric Respiratory Management", doctor: "Dr. Marwa Kamel", code: "PED401-L6", date: "4 days ago" }
      ]
    }
  }
};

const getDeptDetails = (colId: string, deptName: string): DeptDetailItem => {
  const custom = departmentDetails[colId]?.[deptName];
  if (custom) return custom;
  
  // Generic high-quality ERP mock data generator for any department name
  return {
    headAr: `أ.د. أحمد الشرقاوي`,
    headEn: `Prof. Ahmed El-Sharkawy`,
    profCount: 10 + (deptName.length % 7),
    studentsCount: 150 + (deptName.length * 8),
    announcementsAr: [
      `تنبيه هام من رئيس القسم بخصوص تفعيل التدريب العملي والميداني لطلاب التخصص بمقررات ${deptName}.`,
      `ورشة عمل مشتركة للأسبوع الحالي لمناقشة أحدث الأبحاث العلمية وتطورات القسم بقاعة السمينار الرئيسية.`
    ],
    announcementsEn: [
      `Important notice from department head regarding active practical & field training in ${deptName} modules.`,
      `Joint scientific seminar this week to discuss active research and innovations in the Main Hall.`
    ],
    lecturesAr: [
      { title: `محاضرة 4: التطبيقات العملية والمتقدمة لمقرر تخصص ${deptName}`, doctor: `أ.د. أحمد الشرقاوي`, code: `${colId.toUpperCase()}-301`, date: "قبل يومين" },
      { title: `محاضرة 3: المبادئ والمفاهيم الأساسية والأخلاقية للتخصص`, doctor: `د. ياسمين خالد`, code: `${colId.toUpperCase()}-202`, date: "قبل 5 أيام" }
    ],
    lecturesEn: [
      { title: `Lecture 4: Clinical & Advanced Applications in ${deptName} Specialization`, doctor: "Prof. Ahmed El-Sharkawy", code: `${colId.toUpperCase()}-301`, date: "2 days ago" },
      { title: `Lecture 3: Essential Theoretical Core, Ethical Standards & Principles`, doctor: "Dr. Yasmine Khaled", code: `${colId.toUpperCase()}-202`, date: "5 days ago" }
    ]
  };
};

interface SguIndependentCollegePortalProps {
  student: any;
  setStudent: React.Dispatch<React.SetStateAction<any>>;
  addLog: (msg: string) => void;
  lang: "ar" | "en";
  triggerSystemPush: (title: string, message: string) => void;
}

export default function SguIndependentCollegePortal({
  student,
  setStudent,
  addLog,
  lang,
  triggerSystemPush
}: SguIndependentCollegePortalProps) {
  // Normalize College ID
  const collegeId = useMemo(() => {
    const colName = (student.college || "").toLowerCase();
    if (colName.includes("حاسبات") || colName.includes("comput") || colName.includes("fcis")) return "fcis";
    if (colName.includes("طب") && (colName.includes("بشر") || colName.includes("med")) && !colName.includes("أسنان")) return "med";
    if (colName.includes("أسنان") || colName.includes("dent") || colName.includes("den")) return "den";
    if (colName.includes("صيد") || colName.includes("pharm") || colName.includes("phr")) return "phr";
    if (colName.includes("علاج") || colName.includes("phys") || colName.includes("pt")) return "pt";
    if (colName.includes("تمريض") || colName.includes("nurs") || colName.includes("nur")) return "nur";
    if (colName.includes("إدارة") || colName.includes("أعمال") || colName.includes("bus") || colName.includes("تجارة")) return "bus";
    return "fcis"; // fallback
  }, [student.college]);

  const isAr = lang === "ar";

  // General Portal Active Tab
  const [activeTab, setActiveTab] = useState<"lab" | "structure" | "academics" | "admin">("lab");

  // Active selected department within structure tab
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  // Custom announcements posted by user in ERP simulation
  const [customAnnouncements, setCustomAnnouncements] = useState<Record<string, string[]>>({});
  // Input text for new announcement
  const [newAnnText, setNewAnnText] = useState("");
  // Simulated downloading state
  const [downloadingLecture, setDownloadingLecture] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // =========================================================================
  // SPECIFIC COLLEGE CONSTANTS & STRUCTURED ACADEMIC DATA
  // =========================================================================
  const collegeMeta = useMemo(() => {
    const metadata: Record<string, {
      nameAr: string;
      nameEn: string;
      accreditation: string;
      color: string;
      bgGlow: string;
      icon: React.ElementType;
      deanAr: string;
      deanEn: string;
      departments: string[];
      programs: string[];
      curriculum: Record<string, string[]>;
      courses: { code: string; nameAr: string; nameEn: string; credits: number; level: string }[];
      schedule: { day: string; time: string; course: string; room: string; instructor: string }[];
      announcements: string[];
      files: { name: string; size: string; category: string }[];
    }> = {
      fcis: {
        nameAr: "كلية الحاسبات والمعلومات",
        nameEn: "Faculty of Computer & Information Sciences",
        accreditation: "ABET & NAQAAE Accredited",
        color: "emerald",
        bgGlow: "shadow-emerald-500/10",
        icon: Code,
        deanAr: "أ.د. عادل توفيق غنيم",
        deanEn: "Prof. Adel Tawfik Ghoneim",
        departments: ["علوم الحاسب (CS)", "هندسة البرمجيات (SE)", "الذكاء الاصطناعي (AI)", "تكنولوجيا المعلومات (IT)"],
        programs: ["بكالوريوس هندسة البرمجيات والأنظمة الذكية", "بكالوريوس علوم الحاسب وهندسة البيانات"],
        curriculum: {
          "Level 1": ["Introduction to Programming", "Mathematics I", "Discrete Structures", "Electronics"],
          "Level 2": ["Object Oriented Programming", "Data Structures", "Database Management Systems", "Software Engineering"],
          "Level 3": ["Operating Systems", "Artificial Intelligence", "Computer Networks", "Algorithms Analysis"],
          "Level 4": ["Deep Learning & Neural Networks", "Cloud Computing & DevOps", "Cybersecurity", "Graduation Project"]
        },
        courses: [
          { code: "CS402", nameAr: "مبادئ تعلم الآلة العميق", nameEn: "Deep Learning Principles", credits: 3, level: "المستوى الرابع" },
          { code: "SE301", nameAr: "هندسة البرمجيات المتقدمة", nameEn: "Advanced Software Engineering", credits: 3, level: "المستوى الثالث" }
        ],
        schedule: [
          { day: isAr ? "الأحد" : "Sunday", time: "09:00 - 11:00", course: "Deep Learning (CS402)", room: "Hall 4 - Central Bldg", instructor: "أ.د. عادل توفيق" },
          { day: isAr ? "الثلاثاء" : "Tuesday", time: "11:00 - 01:00", course: "Software Engineering (SE301)", room: "Lab 5 - AI Bldg", instructor: "د. شريف يسري" }
        ],
        announcements: [
          "تنبيه هام لطلاب الفرقة الرابعة بشأن مناقشة المقترحات الأولية لمشاريع التخرج نهاية الأسبوع الحالي.",
          "فتح باب التسجيل في هكاثون SGU السنوي لتطوير تطبيقات الذكاء الاصطناعي."
        ],
        files: [
          { name: "Lecture 1 - Deep Learning Introduction.pdf", size: "4.2 MB", category: "Slides" },
          { name: "Lab 2 - TensorFlow & PyTorch Setup.ipynb", size: "1.8 MB", category: "Lab Guide" },
          { name: "ABET Course Syllabus & Requirements.pdf", size: "2.1 MB", category: "Syllabus" }
        ]
      },
      med: {
        nameAr: "كلية الطب البشري",
        nameEn: "Faculty of Medicine",
        accreditation: "NAQAAE Certified Clinic Partner",
        color: "blue",
        bgGlow: "shadow-blue-500/10",
        icon: HeartPulse,
        deanAr: "أ.د. حازم فاروق المسيري",
        deanEn: "Prof. Hazem El-Messeiry",
        departments: ["التشريح وعلم الأنسجة (Anatomy)", "علم وظائف الأعضاء (Physiology)", "الجراحة العامة (Surgery)", "الأطفال (Pediatrics)"],
        programs: ["بكالوريوس الطب البشري والجراحة (MBBCh)", "دبلوم الجراحة السريرية"],
        curriculum: {
          "Level 1": ["Human Anatomy I", "Medical Physiology I", "Histology", "Medical Biochemistry"],
          "Level 2": ["Pathology & Immunology", "Pharmacology & Toxicology", "Microbiology", "Human Anatomy II"],
          "Level 3": ["Clinical Pathology", "Preventive Medicine", "Introduction to Surgery", "Clinical Diagnostics"],
          "Level 4": ["Internal Medicine Rounds", "General Surgery Practice", "Pediatric Medicine", "OSCE Clinical Ward"]
        },
        courses: [
          { code: "ANAT101", nameAr: "التشريح السريري الدقيق", nameEn: "Clinical Microanatomy", credits: 6, level: "الفرقة الأولى" },
          { code: "OSCE401", nameAr: "التدريب الإكلينيكي المتقدم", nameEn: "OSCE Advanced Clinical Training", credits: 4, level: "الفرقة الرابعة" }
        ],
        schedule: [
          { day: isAr ? "الإثنين" : "Monday", time: "08:00 - 11:00", course: "Clinical Anatomy", room: "Anatomy Dissection Lab", instructor: "أ.د. حازم فاروق" },
          { day: isAr ? "الأربعاء" : "Wednesday", time: "10:00 - 01:00", course: "Clinical Practice (OSCE)", room: "Bed #4 OSCE Ward", instructor: "د. هاني سليمان" }
        ],
        announcements: [
          "بدء توزيع الطلاب على المستشفيات التعليمية للتدريب العملي للفصل الصيفي.",
          "جدول امتحانات OSCE السريرية للفرقة الرابعة متوفر الآن عبر البوابة."
        ],
        files: [
          { name: "OSCE Diagnostic Examination Manual.pdf", size: "8.5 MB", category: "Clinical Guide" },
          { name: "Anatomy dissection guide - Upper Limb.pdf", size: "12.4 MB", category: "Lab Atlas" },
          { name: "SGU Hospital Rounds Attendance Policy.pdf", size: "1.1 MB", category: "Regulations" }
        ]
      },
      den: {
        nameAr: "كلية طب الأسنان",
        nameEn: "Faculty of Dentistry",
        accreditation: "Clinical CAD-CAM Approved",
        color: "purple",
        bgGlow: "shadow-purple-500/10",
        icon: Award,
        deanAr: "أ.د. تامر رامي الشناوي",
        deanEn: "Prof. Tamer El-Shenawy",
        departments: ["جراحة الفم والأسنان", "تركيبات الأسنان وتجميلها", "علاج الجذور والأنسجة", "طب أسنان الأطفال"],
        programs: ["بكالوريوس طب وجراحة الفم والأسنان (BDS)", "دبلوم التركيبات الخزفية الرقمية"],
        curriculum: {
          "Level 1": ["Dental Anatomy", "Dental Biomaterials", "General Biochemistry", "General Pathology"],
          "Level 2": ["Oral Histology", "Operative Dentistry I", "Prosthodontics I", "Head & Neck Anatomy"],
          "Level 3": ["Endodontics I", "Oral Surgery I", "Dental CAD/CAM Principles", "Clinical Periodontology"],
          "Level 4": ["Advanced Prosthodontics", "Comprehensive Dental Clinic", "Oral Radiology", "Implantology"]
        },
        courses: [
          { code: "DENT352", nameAr: "التيجان والجسور الـ CAD/CAM", nameEn: "CAD/CAM Crowns & Bridges", credits: 4, level: "المستوى الثالث" }
        ],
        schedule: [
          { day: isAr ? "الأحد" : "Sunday", time: "11:00 - 02:00", course: "CAD/CAM Bridges", room: "CAD-CAM Sim Lab", instructor: "أ.د. تامر رامي" }
        ],
        announcements: [
          "تنبيه بضرورة تعقيم الأدوات الشخصية والالتزام بالزي الكامل بعيادات الكلية الخارجية.",
          "تسليم كراسات تقييم الحالات الإكلينيكية للفرقة الرابعة الأسبوع القادم."
        ],
        files: [
          { name: "Dental CAD-CAM Design standards.pdf", size: "6.7 MB", category: "Simulation" },
          { name: "Oral Surgery sterilization protocol.pdf", size: "2.4 MB", category: "Safety" }
        ]
      },
      phr: {
        nameAr: "كلية الصيدلة",
        nameEn: "Faculty of Pharmacy",
        accreditation: "PharmD National Certified",
        color: "amber",
        bgGlow: "shadow-amber-500/10",
        icon: Cpu,
        deanAr: "أ.د. وفاء جلال الشرقاوي",
        deanEn: "Prof. Wafaa El-Sharkawy",
        departments: ["الصيدلانيات والتكنولوجيا الصيدلية", "الصيدلة الإكلينيكية والممارسة", "الكيمياء الدوائية", "العقاقير والمنتجات الطبيعية"],
        programs: ["بكالوريوس الصيدلة الإكلينيكية (PharmD)", "دبلوم تصنيع المستحضرات الذكية"],
        curriculum: {
          "Level 1": ["General & Organic Chemistry", "Cell Biology & Genetics", "Medical Terminology", "Calculus"],
          "Level 2": ["Physical Pharmacy", "Analytical Chemistry", "Pharmacognosy I", "Human Physiology"],
          "Level 3": ["Pharmacology I", "Pharmaceutics I", "Instrumental Analysis", "Pathophysiology"],
          "Level 4": ["Clinical Pharmacy I", "Biopharmaceutics", "Medicinal Chemistry", "Toxicology & Forensic Science"]
        },
        courses: [
          { code: "PHR512", nameAr: "صيدلة إكلينيكية متطورة", nameEn: "Advanced Clinical Pharmacy", credits: 4, level: "الفرقة الخامسة" }
        ],
        schedule: [
          { day: isAr ? "الثلاثاء" : "Tuesday", time: "09:00 - 12:00", course: "Clinical Pharmacy", room: "Formulation Lab", instructor: "أ.د. وفاء جلال" }
        ],
        announcements: [
          "مواعيد اختبارات المعامل والتحليل الدوائي العملي لجميع الفرق متوفرة الآن باللوحة.",
          "اعتماد معايير PharmD الجديدة لتدريب الصيدليات المجتمعية والمستشفيات."
        ],
        files: [
          { name: "Pharmacokinetics and Renal Dosing Guidelines.pdf", size: "5.1 MB", category: "Dosing Manual" },
          { name: "PharmD Tablet Formulation Lab Guide.pdf", size: "4.0 MB", category: "Lab manual" }
        ]
      },
      pt: {
        nameAr: "كلية العلاج الطبيعي",
        nameEn: "Faculty of Physical Therapy",
        accreditation: "Sports Rehab Association Certified",
        color: "cyan",
        bgGlow: "shadow-cyan-500/10",
        icon: Activity,
        deanAr: "أ.د. منذر وليد الصاوي",
        deanEn: "Prof. Monzer El-Sawy",
        departments: ["العلاج الطبيعي للجهاز الحركي والعظام", "العلاج الطبيعي للأعصاب وجراحتها", "العلاج الطبيعي للأطفال وجراحتها", "الميكانيكا الحيوية والقياس الحركي"],
        programs: ["بكالوريوس العلاج الطبيعي (DPT)", "دبلوم التأهيل الرياضي الدقيق"],
        curriculum: {
          "Level 1": ["Human Anatomy of Musculoskeletal System", "Medical Physics", "Intro to Rehabilitation", "Physiology of Movement"],
          "Level 2": ["Kinesiology I", "Therapeutic Exercise I", "Electrotherapy Principles", "Biomechanics of Joints"],
          "Level 3": ["Orthopedic Rehabilitation", "Neurological Rehabilitation", "Hydrotherapy Practice", "Kinesiology II"],
          "Level 4": ["Pediatrics Rehabilitation", "Cardiopulmonary Rehabilitation", "Sports Medicine Rehab", "Graduation Internship"]
        },
        courses: [
          { code: "KINE302", nameAr: "علم كيناتيكا المفاصل والحركة", nameEn: "Joint Kinesiology & Kinetics", credits: 3, level: "المستوى الثالث" }
        ],
        schedule: [
          { day: isAr ? "الأربعاء" : "Wednesday", time: "01:00 - 04:00", course: "Kinesiology Lab", room: "Biomechanics Gym", instructor: "أ.د. منذر وليد" }
        ],
        announcements: [
          "تنظيم ورشة عمل عملية حول استخدام أجهزة رسم العضلات السطحي (sEMG) الحديثة بالكلية.",
          "تسجيل رغبات التدريب الميداني بمراكز التأهيل وإصابات الملاعب للترم الحالي."
        ],
        files: [
          { name: "Goniometry & Range of Motion measurement chart.pdf", size: "3.8 MB", category: "Clinical Chart" },
          { name: "Kinesiology Biomechanics Exercises.pdf", size: "5.9 MB", category: "Exercise library" }
        ]
      },
      nur: {
        nameAr: "كلية التمريض",
        nameEn: "Faculty of Nursing",
        accreditation: "ICU Hospital Standards Certified",
        color: "rose",
        bgGlow: "shadow-rose-500/10",
        icon: Clock,
        deanAr: "د. وفاء عبدالرحمن منصور",
        deanEn: "Dr. Wafaa Abdelrahman Mansour",
        departments: ["تمريض الرعاية الحرجة والطوارئ", "تمريض الباطنة والجراحة", "تمريض الأطفال وحديثي الولادة", "إدارة التمريض والجودة"],
        programs: ["بكالوريوس علوم التمريض", "دبلوم رعاية الحالات الحرجة وطوارئ القلب"],
        curriculum: {
          "Level 1": ["Fundamentals of Nursing I", "Human Anatomy", "General Nutrition", "Medical Terminology"],
          "Level 2": ["Medical-Surgical Nursing I", "Pharmacology for Nurses", "Microbiology for Nursing", "Health Assessment"],
          "Level 3": ["Critical Care Nursing", "Pediatric Nursing", "Maternity Nursing", "Psychiatric Nursing"],
          "Level 4": ["Critical Care Console", "Nursing Leadership & Management", "Community Health Nursing", "Quality Assurance in Hospitals"]
        },
        courses: [
          { code: "CRIT301", nameAr: "رعاية الحالات الحرجة للبالغين", nameEn: "Adult Critical Care Nursing", credits: 4, level: "الفرقة الثالثة" }
        ],
        schedule: [
          { day: isAr ? "الخميس" : "Thursday", time: "09:00 - 12:00", course: "Critical Care", room: "ICU Simulation Console", instructor: "د. وفاء عبدالرحمن" }
        ],
        announcements: [
          "بدء المناوبات الإلزامية العملية بقسم الطوارئ والرعاية الحرجة بمستشفى الجامعة.",
          "فتح باب التقدم لدورة إنعاش القلب الرئوي المتقدم (ACLS) لطلبة الامتياز."
        ],
        files: [
          { name: "Advanced ICU Monitoring & Telemetry Guidelines.pdf", size: "7.1 MB", category: "ICU Protocols" },
          { name: "Emergency Code Blue response flowchart.pdf", size: "1.9 MB", category: "Flowchart" }
        ]
      },
      bus: {
        nameAr: "كلية إدارة الأعمال",
        nameEn: "Faculty of Business Administration",
        accreditation: "EQUIS & AACSB Certified",
        color: "yellow",
        bgGlow: "shadow-yellow-500/10",
        icon: TrendingUp,
        deanAr: "أ.د. رأفت هاني حمودة",
        deanEn: "Prof. Raafat Hany Hamouda",
        departments: ["إدارة الأعمال والتسويق", "التمويل والاستثمار والأسواق المالية", "المحاسبة والتدقيق", "نظم المعلومات الإدارية"],
        programs: ["بكالوريوس العلوم المالية وتداول المحافظ", "بكالوريوس التسويق الرقمي وريادة الأعمال"],
        curriculum: {
          "Level 1": ["Principles of Management", "Microeconomics", "Business Mathematics", "Financial Accounting I"],
          "Level 2": ["Macroeconomics", "Organizational Behavior", "Managerial Accounting", "Business Statistics"],
          "Level 3": ["Corporate Finance", "Investment & Portfolio Management", "Marketing Strategy", "Operations Management"],
          "Level 4": ["Venture Simulation & Case Studies", "Strategic Management", "International Trade", "Graduation Business Thesis"]
        },
        courses: [
          { code: "TRADE301", nameAr: "محاكاة تداول وتطوير المحافظ", nameEn: "Trading Simulation & Portfolio Development", credits: 3, level: "المستوى الرابع" }
        ],
        schedule: [
          { day: isAr ? "الإثنين" : "Monday", time: "11:00 - 01:00", course: "Trading Simulation", room: "TradeSim Lab Room A", instructor: "أ.د. رأفت هاني" }
        ],
        announcements: [
          "مسابقة SGU السنوية للمحافظ المالية وإدارة صناديق الاستثمار تنطلق غداً.",
          "اعتماد دراسات حالة جديدة من هارفارد لتدريس مادة الإدارة الاستراتيجية للفرق النهائية."
        ],
        files: [
          { name: "Break-even Analysis and Business Model Template.xlsx", size: "2.8 MB", category: "Spreadsheet" },
          { name: "SGU TradeSim User Manual & Rules.pdf", size: "4.5 MB", category: "Rules Manual" }
        ]
      }
    };

    if (metadata[collegeId]) {
      return metadata[collegeId];
    }

    // Try to load newly added colleges dynamically from localStorage to generate live profiles
    const savedCollegesStr = localStorage.getItem("u_colleges");
    let dynamicNameAr = "";
    let dynamicNameEn = "";
    if (savedCollegesStr) {
      try {
        const savedColleges = JSON.parse(savedCollegesStr);
        const matched = savedColleges.find(
          (c: any) => c.id.toLowerCase() === collegeId.toLowerCase() || c.id.toUpperCase() === collegeId.toUpperCase()
        );
        if (matched) {
          dynamicNameAr = matched.name;
          dynamicNameEn = matched.nameEn || matched.name;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (dynamicNameAr) {
      return {
        nameAr: dynamicNameAr,
        nameEn: dynamicNameEn,
        accreditation: "NAQAAE Accredited & Sandbox Verified",
        color: "emerald",
        bgGlow: "shadow-emerald-500/10",
        icon: Code,
        deanAr: "أ.د. حسام الدين المعتز",
        deanEn: "Prof. Hossam El-Din El-Moataz",
        departments: [
          isAr ? "قسم العلوم الأساسية" : "Basic Sciences Dept.", 
          isAr ? "قسم التخصص المتطور" : "Advanced Specialty Dept."
        ],
        programs: [
          isAr ? `بكالوريوس العلوم في ${dynamicNameAr}` : `B.Sc. in ${dynamicNameEn}`
        ],
        curriculum: {
          "Level 1": ["Orientation Course I", "Mathematics", "Scientific Writing"],
          "Level 2": ["Core Specialty Introduction", "Statistics", "Laboratory Practice"],
          "Level 3": ["Advanced Research Methods", "Internship", "Ethics"],
          "Level 4": ["Graduation Capstone Project", "Case Studies", "DevOps Seminar"]
        },
        courses: [
          { code: "DYNC101", nameAr: "مبادئ العلوم الحديثة", nameEn: "Modern Science Principles", credits: 3, level: "المستوى الأول" }
        ],
        schedule: [
          { day: isAr ? "الأحد" : "Sunday", time: "10:00 - 12:00", course: "Modern Science Intro", room: "Dynamic Hall A", instructor: "د. هاني سليمان" }
        ],
        announcements: [
          isAr 
            ? `أهلاً بكم في ${dynamicNameAr} الجديدة كلياً بجامعة الصالحية!` 
            : `Welcome to the brand new ${dynamicNameEn} at Al-Salihiyah University!`
        ],
        files: [
          { name: "Dean Welcoming Letter.pdf", size: "1.5 MB", category: "Deanery" }
        ]
      };
    }

    return metadata.fcis;
  }, [collegeId, isAr]);

  // Sync default selected department when college changes
  useEffect(() => {
    if (collegeMeta?.departments && collegeMeta.departments.length > 0) {
      setSelectedDept(collegeMeta.departments[0]);
    } else {
      setSelectedDept(null);
    }
  }, [collegeId, collegeMeta]);

  const IconComponent = collegeMeta.icon;

  // =========================================================================
  // SUB-FEATURES STATE VARIABLES
  // =========================================================================
  // Attendance NFC / FaceID
  const [attRecord, setAttRecord] = useState<any[]>(() => {
    return [
      { id: "A-01", date: "2026-06-25", time: "09:05 AM", method: "AI Face Scanner", status: "Present" }
    ];
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanningMsg, setScanningMsg] = useState("");

  const runBiometricCheckin = () => {
    setIsScanning(true);
    setScanningMsg(isAr ? "جاري تشغيل المستشعر وقراءة البصمة الحيوية..." : "Initializing scanner & biometric verification...");
    setTimeout(() => {
      setScanningMsg(isAr ? "مطابقة ملامح الوجه مع الهوية الوطنية والتحقق من الموقع..." : "Pairing facial features with National ID & GPS...");
      setTimeout(() => {
        const timeNow = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const dateNow = new Date().toISOString().split("T")[0];
        const newRecord = {
          id: `A-${Math.floor(100 + Math.random() * 900)}`,
          date: dateNow,
          time: timeNow,
          method: "Biometric FaceID",
          status: "Present"
        };
        setAttRecord(prev => [newRecord, ...prev]);
        setIsScanning(false);
        addLog(`[حضور بيومتري] تم رصد حضور الطالب في معمل الكلية بنجاح بآلية FaceID`);
        triggerSystemPush(
          isAr ? "تم تسجيل الحضور بيومتریاً" : "Biometric Attendance Synced",
          isAr ? "تم تسجيل حضورك في الكلية ومزامنته مع نظام الكنترول المركزي بنجاح!" : "Your college attendance has been verified and logged successfully!"
        );
      }, 1500);
    }, 1500);
  };

  // Assignments & Project Uploads
  const [asgFiles, setAsgFiles] = useState<any[]>([
    { id: "asg-01", name: "SGU_College_Project_Final.zip", date: "2026-06-20", status: "Graded", grade: "94/100", reviewer: collegeMeta.deanAr }
  ]);
  const [asgNameInput, setAsgNameInput] = useState("");
  const [isUploadingAsg, setIsUploadingAsg] = useState(false);

  const handleAsgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgNameInput.trim()) return;
    setIsUploadingAsg(true);
    setTimeout(() => {
      const newAsg = {
        id: `asg-${Math.floor(100 + Math.random() * 900)}`,
        name: asgNameInput.trim().endsWith(".zip") || asgNameInput.trim().endsWith(".pdf") ? asgNameInput.trim() : `${asgNameInput.trim()}.pdf`,
        date: new Date().toISOString().split("T")[0],
        status: "Pending Review",
        grade: "—",
        reviewer: isAr ? "لجنة التقييم العلمي" : "Evaluation Board"
      };
      setAsgFiles(prev => [newAsg, ...prev]);
      setIsUploadingAsg(false);
      setAsgNameInput("");
      addLog(`[تسليم مشروع] تم تسليم ملف المشروع الدراسي بنجاح: ${newAsg.name}`);
      triggerSystemPush(
        isAr ? "تم استلام ملف مشروع الكلية" : "College Project Uploaded",
        isAr ? `تأكيد استلام مستند "${newAsg.name}" وجاري تحويله للمراجعة الأكاديمية.` : `Your file "${newAsg.name}" has been routed to the academic evaluation team.`
      );
    }, 1200);
  };

  // Student Services Requests
  const [serviceRequests, setServiceRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem("sgu_service_requests");
    if (saved) return JSON.parse(saved);
    const seeds = [
      { id: "S-512", studentId: "SGU-ST-FCIS-10045", studentName: student.nameArabic || "يوسف شريف الكردي", collegeId: "fcis", type: "تغيير المسار الأكاديمي (Major Transfer)", date: "2026-06-18", status: "Approved" },
      { id: "S-513", studentId: "SGU-ST-MED-20011", studentName: "سارة محمود الجندي", collegeId: "med", type: "طلب عذر طبي رسمي", date: "2026-06-20", status: "Pending Dean Approval" }
    ];
    localStorage.setItem("sgu_service_requests", JSON.stringify(seeds));
    return seeds;
  });

  const [serviceType, setServiceType] = useState(isAr ? "طلب عذر طبي رسمي" : "Official Medical Excuse");
  const [serviceDetails, setServiceDetails] = useState("");

  const submitServiceRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceDetails.trim()) return;

    const newReq = {
      id: `S-${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.id || "SGU-ST-10045",
      studentName: student.nameArabic || "طالب sgu",
      collegeId: collegeMeta.id || "fcis",
      type: serviceType,
      date: new Date().toISOString().split("T")[0],
      status: "Pending Dean Approval"
    };

    const saved = localStorage.getItem("sgu_service_requests");
    const currentList = saved ? JSON.parse(saved) : [];
    const updatedList = [newReq, ...currentList];
    
    setServiceRequests(updatedList);
    localStorage.setItem("sgu_service_requests", JSON.stringify(updatedList));

    setServiceDetails("");
    addLog(`[طلب إداري] تقديم طلب جديد للعمادة: ${serviceType}`);
    triggerSystemPush(
      isAr ? "تم تسجيل طلبك الإداري بالكلية" : "Service Request Logged",
      isAr ? `طلب "${serviceType}" قيد المعالجة الإدارية بكنترول العمادة.` : `Request for "${serviceType}" is pending dean review.`
    );
  };

  // Direct Academic Chat
  const [chatLog, setChatLog] = useState<any[]>([
    { sender: "advisor", text: isAr ? `مرحباً يا طالب جامعة SGU. أنا مرشدك الأكاديمي بـ ${collegeMeta.nameAr}. كيف يمكنني إعانتك اليوم؟` : `Welcome SGU student. I am your Academic Advisor for ${collegeMeta.nameEn}. How can I assist you today?` }
  ]);
  const [chatMsgInput, setChatMsgInput] = useState("");
  const [isAdvisorTyping, setIsAdvisorTyping] = useState(false);

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsgInput.trim()) return;
    const userMsg = { sender: "student", text: chatMsgInput.trim() };
    setChatLog(prev => [...prev, userMsg]);
    const inputClean = chatMsgInput.toLowerCase();
    setChatMsgInput("");
    setIsAdvisorTyping(true);

    setTimeout(() => {
      let reply = "";
      if (isAr) {
        if (inputClean.includes("خطة") || inputClean.includes("جدول")) {
          reply = `يمكنك مراجعة الخطة والجدول مباشرة من تبويب "العملية التعليمية والجداول". الخطة الأكاديمية معتمدة ومتوافقة تماماً مع معايير الجودة الدولية.`;
        } else if (inputClean.includes("درج") || inputClean.includes("امتحان")) {
          reply = `درجات امتحانات الكنترول معلنة بالكامل في تبويب "البوابة الإدارية والخدمات" تحت قسم "نتائج امتحانات الكنترول والشهادة".`;
        } else if (inputClean.includes("مشروع") || inputClean.includes("تسليم")) {
          reply = `يسعدني مراجعة مشروعك! يرجى رفعه بملف صيغته ZIP أو PDF عبر منصة تسليم التكليفات المتواجدة أسفل التبويب الإداري.`;
        } else {
          reply = `أهلاً بك. رسالتك بخصوص "${inputClean}" وصلتني. بصفتي مرشدك الأكاديمي، سأقوم بدراسة طلبك بالتنسيق مع إدارة شؤون الطلاب والرد عليك هاتفياً أو عبر البريد الأكاديمي قريباً جداً.`;
        }
      } else {
        if (inputClean.includes("curriculum") || inputClean.includes("schedule") || inputClean.includes("plan")) {
          reply = `You can review your detailed academic schedule under the "Curriculum & Academic Structure" tab. The curriculum is fully verified according to NAQAAE standards.`;
        } else if (inputClean.includes("grade") || inputClean.includes("result") || inputClean.includes("exam")) {
          reply = `Exam results are published and available under the "Administrative Portal" tab, in the "Exams & Control Result Logs" section.`;
        } else {
          reply = `Understood. I have logged your query regarding "${inputClean}". I will check your academic records and follow up during my office hours.`;
        }
      }
      setChatLog(prev => [...prev, { sender: "advisor", text: reply }]);
      setIsAdvisorTyping(false);
    }, 1500);
  };

  // =========================================================================
  // HIGH-FIDELITY CUSTOM LAB SIMULATORS BY COLLEGE
  // =========================================================================
  // 1. FCIS AI Sandbox
  const [fcisTemplate, setFcisTemplate] = useState<"classification" | "cyber" | "llm">("classification");
  const [fcisGpuAllocation, setFcisGpuAllocation] = useState(80);
  const [fcisLogs, setFcisLogs] = useState<string[]>(["[SGU GPU NODE-1]: Ready for Neural Compilation."]);
  const [isCompilingFcis, setIsCompilingFcis] = useState(false);

  const runFcisCompiler = () => {
    setIsCompilingFcis(true);
    setFcisLogs(prev => [...prev, `[SGU GPU ALLOCATED]: Allocated ${fcisGpuAllocation}% of Nvidia A100...`, `[COMPILER RUN]: Running python validation checks...`]);
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15;
      if (isSuccess) {
        setFcisLogs(prev => [
          ...prev,
          `[COMPILER SUCCESS]: Neural Network training completed. Loss: 0.042, Accuracy: 98.6%`,
          `[AUTO-GRADE]: 100/100 points! Model satisfies ABET and SGU guidelines. Well done!`
        ]);
        addLog("[مختبر الحاسبات] تشغيل محاكاة الذكاء الاصطناعي بنجاح وتقييم الكود بامتياز");
      } else {
        setFcisLogs(prev => [
          ...prev,
          `[COMPILER ERROR]: NameError: name 'tf' is not defined on line 5`,
          `[AUTO-GRADE]: 0/100 points. Compiler failed to execute.`
        ]);
      }
      setIsCompilingFcis(false);
    }, 2000);
  };

  // 2. Business StockSim
  const [busCash, setBusCash] = useState(100000);
  const [busStocks, setBusStocks] = useState<Record<string, number>>({ SGU: 50, AAPL: 10, BTC: 0.5 });
  const [busMarketPrices, setBusMarketPrices] = useState<Record<string, number>>({ SGU: 150, AAPL: 190, BTC: 64000 });
  const [busTradeStock, setBusTradeStock] = useState("SGU");
  const [busTradeQty, setBusTradeQty] = useState(5);
  const [busFixedCost, setBusFixedCost] = useState(12000);
  const [busVarCost, setBusVarCost] = useState(45);
  const [busUnitPrice, setBusUnitPrice] = useState(90);

  const calculateBreakEven = useMemo(() => {
    const margin = busUnitPrice - busVarCost;
    if (margin <= 0) return isAr ? "السعر لا يغطي الكلفة المتغيرة!" : "Price cannot cover variable cost!";
    const units = Math.ceil(busFixedCost / margin);
    return isAr ? `نقطة التعادل هي بيع ${units} وحدة بمبيعات قيمتها ${(units * busUnitPrice).toLocaleString()} ج.م` : `Break-even at ${units} units (Revenue: ${(units * busUnitPrice).toLocaleString()} EGP)`;
  }, [busFixedCost, busVarCost, busUnitPrice, isAr]);

  const executeStockTrade = (action: "buy" | "sell") => {
    const price = busMarketPrices[busTradeStock];
    const totalCost = price * busTradeQty;
    if (action === "buy") {
      if (busCash < totalCost) {
        alert(isAr ? "رصيدك المالي غير كافٍ لإتمام الصفقة!" : "Insufficient funds!");
        return;
      }
      setBusCash(prev => prev - totalCost);
      setBusStocks(prev => ({ ...prev, [busTradeStock]: (prev[busTradeStock] || 0) + busTradeQty }));
      addLog(`[تداول البورصة] شراء ${busTradeQty} أسهم في ${busTradeStock} بسعر ${price} ج.م`);
    } else {
      if ((busStocks[busTradeStock] || 0) < busTradeQty) {
        alert(isAr ? "لا تمتلك كمية كافية من الأسهم لبيعها!" : "Insufficient shares!");
        return;
      }
      setBusCash(prev => prev + totalCost);
      setBusStocks(prev => ({ ...prev, [busTradeStock]: Math.max(0, (prev[busTradeStock] || 0) - busTradeQty) }));
      addLog(`[تداول البورصة] بيع ${busTradeQty} أسهم في ${busTradeStock} بسعر ${price} ج.م`);
    }
  };

  // 3. Medicine Clinical Ward
  const [medVitals, setMedVitals] = useState({ hr: 110, bp: "140/90", spo2: 92 });
  const [medChecklist, setMedChecklist] = useState<Record<string, boolean>>({
    checkAirway: false,
    consent: false,
    history: false,
    ivAccess: false,
    giveOxygen: false
  });
  const [medCaseLogs, setMedCaseLogs] = useState<string[]>(["[OSCE WARD-4]: Patient admitted with mild dyspnea and tachycardia."]);

  const handleMedCheck = (key: string) => {
    const updated = !medChecklist[key];
    setMedChecklist(prev => ({ ...prev, [key]: updated }));
    if (key === "giveOxygen" && updated) {
      setMedVitals(prev => ({ hr: 88, bp: "120/80", spo2: 98 }));
      setMedCaseLogs(prev => [...prev, "[OXYGEN THERAPY]: Applied 4L Nasal Cannula. SpO2 normalized to 98%."]);
      addLog("[مختبر الطب] تطبيق العلاج بالأكسجين على المريض واستقرار المؤشرات الحيوية");
    } else if (key === "checkAirway" && updated) {
      setMedCaseLogs(prev => [...prev, "[AIRWAY CHECK]: Patent airway confirmed. No secretions."]);
    } else if (key === "ivAccess" && updated) {
      setMedCaseLogs(prev => [...prev, "[IV LINE]: Established 18G peripheral IV cannula in left forearm."]);
    }
  };

  // 4. Pharmacy formulation
  const [phrWeight, setPhrWeight] = useState(450);
  const [phrForce, setPhrForce] = useState(14);
  const [isFormulating, setIsFormulating] = useState(false);
  const [phrDisintegrationTime, setPhrDisintegrationTime] = useState<number | null>(null);
  // renal Cockcroft-Gault
  const [phrAge, setPhrAge] = useState(62);
  const [phrScr, setPhrScr] = useState(1.4);
  const [phrWeightKg, setPhrWeightKg] = useState(74);

  const calculateCrCl = useMemo(() => {
    const crCl = Math.round(((140 - phrAge) * phrWeightKg) / (72 * phrScr));
    return `${crCl} mL/min`;
  }, [phrAge, phrScr, phrWeightKg]);

  const runDisintegrationTest = () => {
    setIsFormulating(true);
    setPhrDisintegrationTime(null);
    setTimeout(() => {
      // higher compaction force leads to longer disintegration time
      const timeSec = Math.round(phrForce * 12 + (phrWeight / 100) * 15);
      setPhrDisintegrationTime(timeSec);
      setIsFormulating(false);
      addLog(`[الصيدلة] تشغيل اختبار تفكك الأقراص الصيدلانية واستخلاص المدة: ${timeSec} ثانية`);
    }, 1800);
  };

  // 5. Dentistry CAD/CAM
  const [denSelectedTooth, setDenSelectedTooth] = useState<number>(14);
  const [denCrownMaterial, setDenCrownMaterial] = useState<"Zirconia" | "Ceramic" | "Titanium">("Zirconia");
  const [denRpm, setDenRpm] = useState(22000);
  const [isMilling, setIsMilling] = useState(false);
  const [millingProgress, setMillingProgress] = useState(0);

  const runDentalMilling = () => {
    setIsMilling(true);
    setMillingProgress(0);
    const interval = setInterval(() => {
      setMillingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMilling(false);
          addLog(`[طب الأسنان] إتمام عملية خرط وتجهيز التاج الخزفي للسن رقم ${denSelectedTooth} بالـ CAD/CAM`);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  // 6. Physical Therapy
  const [ptKneeAngle, setPtKneeAngle] = useState(85);
  const ptExercises = [
    "Isometric Quad Contractions (3 sets x 10 reps)",
    "Straight Leg Raises (3 sets x 12 reps)",
    "Theraband Hamstring Curls (3 sets x 15 reps)"
  ];

  const calculateJointStress = useMemo(() => {
    // simulated mechanical knee torque calculation
    const torque = Math.round(ptKneeAngle * 1.45 + (180 - ptKneeAngle) * 0.85);
    return `${torque} Nm`;
  }, [ptKneeAngle]);

  // 7. Nursing ICU Console
  const [icuHeartRate, setIcuHeartRate] = useState(132);
  const [icuOxygen, setIcuOxygen] = useState(86);
  const [icuLogs, setIcuLogs] = useState<string[]>(["[CRITICAL ALERT]: ICU Bed #2 tachycardic & hypoxic."]);

  const triggerIcuAction = (action: "oxygen" | "bolus" | "defib") => {
    if (action === "oxygen") {
      setIcuOxygen(99);
      setIcuHeartRate(prev => Math.max(80, prev - 25));
      setIcuLogs(prev => [...prev, "[NURSE INTERVENTION]: Delivered high-flow oxygen mask. SpO2 recovered to 99%."]);
      addLog("[مختبر التمريض] تقديم تدخل سريع برفع الأكسجين واستقرار مؤشرات العناية المركزة");
    } else if (action === "bolus") {
      setIcuLogs(prev => [...prev, "[IV THERAPY]: Infused 250mL Normal Saline bolus."]);
    } else {
      setIcuHeartRate(78);
      setIcuOxygen(95);
      setIcuLogs(prev => [...prev, "[DEFIBRILLATOR]: Applied biphasic synchronized cardioversion."]);
    }
  };

  const isCollegeSuspended = useMemo(() => {
    try {
      const stored = localStorage.getItem("u_colleges");
      if (stored) {
        const list = JSON.parse(stored);
        const currentCollege = list.find((c: any) => c.id.toLowerCase() === collegeId.toLowerCase());
        return currentCollege?.status === "suspended";
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  }, [collegeId]);

  // =========================================================================
  // VIEW RENDER
  // =========================================================================
  if (isCollegeSuspended) {
    return (
      <div className="bg-slate-950 border border-red-900/40 rounded-2xl overflow-hidden shadow-2xl p-8 text-center space-y-6 relative max-w-2xl mx-auto my-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />
        <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
          <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-slate-100">
            {isAr ? "⚠️ تم تعليق خدمات الكلية مؤقتاً" : "⚠️ Faculty Services Temporarily Suspended"}
          </h2>
          <p className="text-xs text-slate-450 leading-relaxed max-w-lg mx-auto font-sans">
            {isAr
              ? `شؤون النظم والمعلومات بجامعة SGU تخطركم بأن خدمات البوابة الأكاديمية والولوج الموحد لـ [${collegeMeta?.nameAr || student.college}] معطلة حالياً بقرار من مجلس الجامعة لإجراء المراجعات الأكاديمية أو تحديث بنية الخوادم.`
              : `SGU Systems & Networks Administration notifies you that academic portal services for [${collegeMeta?.nameEn || student.college}] have been temporarily suspended by the University Council for curriculum auditing or server maintenance.`}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-850 p-4 rounded-xl text-right max-w-md mx-auto space-y-2 font-mono text-[11px] text-slate-400">
          <div className="flex justify-between border-b border-slate-850 pb-1.5">
            <span className="text-rose-400 font-bold">SUSPENDED_BY_COUNCIL</span>
            <span className="text-slate-500">{isAr ? "حالة القرار الأكاديمي:" : "Administrative Status:"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-850 pb-1.5">
            <span>SGU-SEC-BYPASS-GATE</span>
            <span className="text-slate-500">{isAr ? "نظام التوجيه الفدرالي:" : "Identity Routing Protocol:"}</span>
          </div>
          <div className="flex justify-between">
            <span>10.45.99.102 (PORT: 3000)</span>
            <span className="text-slate-500">{isAr ? "عنوان تدقيق الخادم:" : "Server Audited Endpoint:"}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => {
              localStorage.removeItem("sgu_is_logged_in");
              localStorage.removeItem("sgu_user_role");
              localStorage.removeItem("u_student");
              window.location.reload();
            }}
            className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-xs px-5 py-2.5 rounded-lg border border-slate-800 transition-colors"
          >
            {isAr ? "الخروج والعودة لبوابة الدخول الموحدة" : "Logout to Unified Portal"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* College Identity Banner */}
      <div className={`p-6 bg-gradient-to-r from-${collegeMeta.color}-950/40 via-slate-900 to-slate-950/60 border-b border-slate-800 relative overflow-hidden`}>
        {/* Decorative Glowing Circle */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-${collegeMeta.color}-500/10 rounded-full blur-3xl -z-10`} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 text-right">
            <div className={`w-14 h-14 rounded-2xl bg-${collegeMeta.color}-500/10 border border-${collegeMeta.color}-500/30 flex items-center justify-center shadow-lg ${collegeMeta.bgGlow}`}>
              <IconComponent className={`w-8 h-8 text-${collegeMeta.color}-400 animate-pulse`} />
            </div>
            <div className="space-y-1">
              <span className={`text-[11px] font-mono text-${collegeMeta.color}-400 bg-${collegeMeta.color}-950/40 border border-${collegeMeta.color}-800/50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
                {collegeMeta.accreditation}
              </span>
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-350">
                {isAr ? collegeMeta.nameAr : collegeMeta.nameEn}
              </h2>
              <p className="text-xs text-slate-450 font-medium">
                {isAr ? `العميد الأكاديمي: ${collegeMeta.deanAr}` : `Dean: ${collegeMeta.deanEn}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-850 shadow-inner">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                {isAr ? "الحالة الأكاديمية للقيد" : "Academic Enrolled Status"}
              </span>
              <p className="text-xs font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isAr ? "موجه لبيئة الكلية المستقلة" : "Routed to Independent College Portal"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* College Navigation Tabs */}
      <div className="bg-slate-950 p-2 border-b border-slate-850 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab("lab")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "lab"
                ? `bg-${collegeMeta.color}-600 text-slate-950 shadow-md`
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Cpu className="w-4 h-4" />
            {isAr ? "🧪 المختبر المحاكي التخصصي" : "🧪 Specialized Simulator Lab"}
          </button>
          
          <button
            onClick={() => setActiveTab("structure")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "structure"
                ? `bg-${collegeMeta.color}-600 text-slate-950 shadow-md`
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Book className="w-4 h-4" />
            {isAr ? "🏢 الأقسام والخطة الدراسية" : "🏢 Departments & Curriculum"}
          </button>

          <button
            onClick={() => setActiveTab("academics")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "academics"
                ? `bg-${collegeMeta.color}-600 text-slate-950 shadow-md`
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            {isAr ? "📚 المواد والمحاضرات والجداول" : "📚 Courses, Lectures & Schedules"}
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "admin"
                ? `bg-${collegeMeta.color}-600 text-slate-950 shadow-md`
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {isAr ? "🏛️ البوابة الإدارية والخدمات" : "🏛️ Admin Portal & Services"}
          </button>
        </div>

        <span className="text-[10px] text-slate-500 font-mono font-bold px-2 hidden sm:inline uppercase">
          SGU-{collegeId.toUpperCase()} OFFICE
        </span>
      </div>

      {/* College Tab Contents */}
      <div className="p-6">
        {/* 1. LAB SIMULATOR TAB */}
        {activeTab === "lab" && (
          <div className="space-y-6">
            <div className="bg-slate-950/40 p-4.5 rounded-xl border border-slate-850/60">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mb-1 text-right">
                <Sparkles className={`w-4 h-4 text-${collegeMeta.color}-400`} />
                {isAr ? "المختبر الإكلينيكي والعملي التفاعلي" : "Interactive Clinical & Practical Laboratory"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed text-right">
                {isAr
                  ? "محاكاة واقعية مصممة خصيصاً لمقررات هذه الكلية لضمان التدريب المستمر وتطبيق التكنولوجيا بالتعليم الأكاديمي."
                  : "A robust real-time simulation ward customized for this college's curriculum to guarantee continuous practical learning."}
              </p>
            </div>

            {/* FCIS COMPILER */}
            {collegeId === "fcis" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4 text-right">
                  <h4 className="text-xs font-bold text-slate-200">{isAr ? "إعداد المعالجة والتجميع" : "Compiler Setup"}</h4>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? "اختر قالب الكود البرمجي:" : "Code Template:"}</label>
                      <select
                        value={fcisTemplate}
                        onChange={(e: any) => setFcisTemplate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-250 outline-none"
                      >
                        <option value="classification">TensorFlow Classification NeuralNet</option>
                        <option value="cyber">Penetration testing & Port scan checks</option>
                        <option value="llm">SGU LLM RAG Custom Embeddings chain</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-mono text-slate-500">{fcisGpuAllocation}%</span>
                        <label className="text-slate-400">{isAr ? "قوة بطاقة الـ GPU المخصصة:" : "GPU Allocation Power:"}</label>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={fcisGpuAllocation}
                        onChange={(e) => setFcisGpuAllocation(Number(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={runFcisCompiler}
                      disabled={isCompilingFcis}
                      className="w-full bg-emerald-500 hover:bg-emerald-450 disabled:opacity-50 text-slate-950 py-2.5 rounded-lg font-black transition cursor-pointer"
                    >
                      {isCompilingFcis ? (isAr ? "جاري الترجمة والتشغيل..." : "Compiling...") : (isAr ? "تجميع وتشغيل التقييم التلقائي" : "Compile & Run Autograding")}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-black/80 rounded-xl border border-slate-850 p-4 font-mono text-xs text-left min-h-64 flex flex-col justify-between">
                  <div className="space-y-1.5 overflow-y-auto max-h-56">
                    <p className="text-emerald-500"># SGU AI DevLab Sandbox Environment</p>
                    {fcisLogs.map((lg, i) => (
                      <p key={i} className="text-slate-300 leading-normal whitespace-pre-wrap">{lg}</p>
                    ))}
                    {isCompilingFcis && (
                      <p className="text-emerald-400 animate-pulse">▋ [COMPILING NODE IN PROGRESS...]</p>
                    )}
                  </div>
                  <div className="border-t border-slate-900 pt-2 flex justify-between text-[10px] text-slate-500">
                    <span>GPU: Nvidia A100 TensorCore</span>
                    <span>Status: {isCompilingFcis ? "RUNNING" : "IDLE"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* BUSINESS STOCKSIM */}
            {collegeId === "bus" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
                <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200">📊 {isAr ? "مختبر محاكاة البورصة والأسواق المالية" : "StockSim Brokerage Station"}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isAr ? "تداول بأموال افتراضية لدراسة حركات محافظ الأسهم وسلوك السوق." : "Simulate live trades to study investment behavior."}
                  </p>
                  <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 text-xs flex justify-between items-center font-mono">
                    <span className="text-emerald-400 font-bold">{busCash.toLocaleString()} EGP</span>
                    <span className="text-slate-450">{isAr ? "رصيد الكاش الافتراضي المتوفر:" : "Virtual Cash Available:"}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    {Object.entries(busStocks).map(([stock, qty]) => (
                      <div key={stock} className="bg-slate-900 p-2.5 rounded border border-slate-800">
                        <p className="text-slate-500 font-bold">{stock}</p>
                        <p className="text-slate-200 mt-1 font-black">{qty} {isAr ? "سهم" : "Shares"}</p>
                        <p className="text-[10px] text-emerald-400 mt-0.5">{busMarketPrices[stock]} EGP</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? "الكمية:" : "Quantity:"}</label>
                      <input
                        type="number"
                        min="1"
                        value={busTradeQty}
                        onChange={(e) => setBusTradeQty(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 text-center font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? "السهم:" : "Select Stock:"}</label>
                      <select
                        value={busTradeStock}
                        onChange={(e) => setBusTradeStock(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-bold font-mono outline-none"
                      >
                        <option value="SGU">SGU Enterprise Group</option>
                        <option value="AAPL">Apple Inc. (AAPL)</option>
                        <option value="BTC">Bitcoin (BTC/USD)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => executeStockTrade("sell")}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded text-xs cursor-pointer transition"
                    >
                      {isAr ? "بيع الأسهم" : "Sell Shares"}
                    </button>
                    <button
                      onClick={() => executeStockTrade("buy")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2 rounded text-xs cursor-pointer transition"
                    >
                      {isAr ? "شراء الأسهم" : "Buy Shares"}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200">📈 {isAr ? "مخطط وبحوث دراسة نقطة التعادل للمشاريع" : "Break-even Analysis Planning Lab"}</h4>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? "التكاليف الثابتة الكلية (ج.م):" : "Total Fixed Costs (EGP):"}</label>
                      <input
                        type="number"
                        step="500"
                        value={busFixedCost}
                        onChange={(e) => setBusFixedCost(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 text-right font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? "التكلفة المتغيرة للوحدة (ج.م):" : "Variable Cost per Unit (EGP):"}</label>
                      <input
                        type="number"
                        step="5"
                        value={busVarCost}
                        onChange={(e) => setBusVarCost(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 text-right font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? "سعر البيع المقدر للوحدة (ج.م):" : "Sales Price per Unit (EGP):"}</label>
                      <input
                        type="number"
                        step="5"
                        value={busUnitPrice}
                        onChange={(e) => setBusUnitPrice(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 text-right font-mono"
                      />
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded border border-slate-800 text-amber-400 font-bold font-mono text-center">
                      {calculateBreakEven}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MEDICINE CLINICAL WARD */}
            {collegeId === "med" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
                <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200">🏥 {isAr ? "العيادة الطبية وجهاز المؤشرات الحيوية Bed-4" : "Bed-4 Patient Vitals Simulator"}</h4>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
                    <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                      <span className={`${medVitals.hr > 100 ? "text-rose-400 font-bold animate-pulse" : "text-emerald-400"}`}>{medVitals.hr} bpm</span>
                      <span className="text-slate-450">{isAr ? "معدل ضربات القلب:" : "Heart Rate:"}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="text-emerald-400">{medVitals.bp} mmHg</span>
                      <span className="text-slate-450">{isAr ? "ضغط الدم:" : "Blood Pressure:"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={`${medVitals.spo2 < 95 ? "text-amber-500 animate-pulse font-bold" : "text-emerald-400"}`}>{medVitals.spo2}%</span>
                      <span className="text-slate-450">{isAr ? "نسبة الأكسجين بالدم (SpO2):" : "Oxygen Saturation:"}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-slate-450 font-bold mb-2">{isAr ? "قائمة الخطوات التشخيصية السريرية (OSCE Checklist):" : "OSCE Clinical Checklist:"}</p>
                    <label className="flex items-center gap-2 justify-end cursor-pointer bg-slate-900/40 p-2 rounded border border-slate-850/60 hover:bg-slate-900 transition">
                      <span>{isAr ? "1. طلب موافقة المريض اللفظية والتعريف بالنفس" : "1. Introduce self and gain verbal consent"}</span>
                      <input
                        type="checkbox"
                        checked={medChecklist.consent}
                        onChange={() => handleMedCheck("consent")}
                        className="rounded accent-blue-500"
                      />
                    </label>
                    <label className="flex items-center gap-2 justify-end cursor-pointer bg-slate-900/40 p-2 rounded border border-slate-850/60 hover:bg-slate-900 transition">
                      <span>{isAr ? "2. فحص وتأكيد سلامة الممرات التنفسية" : "2. Check and clear Patient Airway"}</span>
                      <input
                        type="checkbox"
                        checked={medChecklist.checkAirway}
                        onChange={() => handleMedCheck("checkAirway")}
                        className="rounded accent-blue-500"
                      />
                    </label>
                    <label className="flex items-center gap-2 justify-end cursor-pointer bg-slate-900/40 p-2 rounded border border-slate-850/60 hover:bg-slate-900 transition">
                      <span>{isAr ? "3. سحب عينة دم وتثبيت كانيولا التغذية IV" : "3. Set up peripheral IV line cannula"}</span>
                      <input
                        type="checkbox"
                        checked={medChecklist.ivAccess}
                        onChange={() => handleMedCheck("ivAccess")}
                        className="rounded accent-blue-500"
                      />
                    </label>
                    <label className="flex items-center gap-2 justify-end cursor-pointer bg-slate-900/40 p-2 rounded border border-slate-850/60 hover:bg-slate-900 transition">
                      <span>{isAr ? "4. تقديم الأكسجين العلاجي الفوري 4L" : "4. Deliver 4L therapeutic Oxygen mask"}</span>
                      <input
                        type="checkbox"
                        checked={medChecklist.giveOxygen}
                        onChange={() => handleMedCheck("giveOxygen")}
                        className="rounded accent-blue-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-850 flex flex-col justify-between min-h-64">
                  <h4 className="text-xs font-bold text-slate-200 mb-2">📋 {isAr ? "دفتر السيرة المرضية والملاحظات العيادية" : "Ward Case Notes Logs"}</h4>
                  <div className="bg-black/40 p-3.5 rounded border border-slate-900 flex-1 overflow-y-auto space-y-2 text-xs font-mono">
                    {medCaseLogs.map((lg, i) => (
                      <p key={i} className="text-slate-350 leading-normal">{lg}</p>
                    ))}
                  </div>
                  <div className="border-t border-slate-900 pt-3 mt-3 text-[11px] text-slate-500 flex justify-between font-mono">
                    <span>OSCE STATION #4</span>
                    <span>Evaluation Score: {Object.values(medChecklist).filter(v => v).length * 25}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* PHARMACY FORMULATION */}
            {collegeId === "phr" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
                <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200">💊 {isAr ? "مختبر تصنيع الأقراص واختبار التفكك" : "PharmD Tablet Formulation Lab"}</h4>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-slate-500">{phrWeight} mg</span>
                        <label className="text-slate-450">{isAr ? "وزن المادة الفعالة بالجرعة:" : "Active API Weight:"}</label>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="800"
                        step="50"
                        value={phrWeight}
                        onChange={(e) => setPhrWeight(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-slate-500">{phrForce} kN</span>
                        <label className="text-slate-450">{isAr ? "قوة ضغط كبس الأقراص:" : "Tablet Compaction Force:"}</label>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        value={phrForce}
                        onChange={(e) => setPhrForce(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <button
                      onClick={runDisintegrationTest}
                      disabled={isFormulating}
                      className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black py-2.5 rounded-lg transition"
                    >
                      {isFormulating ? (isAr ? "جاري كبس وفحص التحلل..." : "Testing...") : (isAr ? "تشغيل فحص تفكك الأقراص صيدلانياً" : "Run disintegration testing")}
                    </button>

                    {phrDisintegrationTime !== null && (
                      <div className="bg-slate-900 p-3 rounded border border-slate-800 text-center text-xs font-mono text-emerald-400">
                        {isAr
                          ? `نتائج فحص تفكك الأقراص: تحلل كامل المستحضر في غضون ${phrDisintegrationTime} ثانية. يتوافق مع المعايير!`
                          : `Disintegration completed in ${phrDisintegrationTime} seconds. Pharmacopoeia limits satisfied.`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200">🧪 {isAr ? "حاسبة تصفية الكلى والجرعات السريرية" : "Clinical Renal Clearance (CrCl) Calculator"}</h4>
                  <p className="text-[11px] text-slate-450">
                    {isAr
                      ? "تحديد كفاءة عمل الكلى وتعديل جرعات المضادات الحيوية الصيدلانية (Cockcroft-Gault Equation)."
                      : "Evaluate renal function to correctly adjust dosage parameters."}
                  </p>
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-450 block">{isAr ? "الوزن (كجم):" : "Weight (kg):"}</label>
                        <input
                          type="number"
                          value={phrWeightKg}
                          onChange={(e) => setPhrWeightKg(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-center font-mono text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-450 block">{isAr ? "الكرياتينين Cr:" : "Creatinine Scr:"}</label>
                        <input
                          type="number"
                          step="0.1"
                          value={phrScr}
                          onChange={(e) => setPhrScr(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-center font-mono text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-450 block">{isAr ? "العمر:" : "Age:"}</label>
                        <input
                          type="number"
                          value={phrAge}
                          onChange={(e) => setPhrAge(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-center font-mono text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between items-center text-xs font-mono">
                      <span className="text-amber-400 font-extrabold text-sm">{calculateCrCl}</span>
                      <span className="text-slate-450">{isAr ? "حجم تصفية الكرياتينين المقدر:" : "Calculated Creatinine Clearance:"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DENTISTRY CAD/CAM */}
            {collegeId === "den" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
                <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200">🦷 {isAr ? "منظومة خرط التيجان والجسور ثلاثية الأبعاد" : "3D CAD-CAM Milling Machine Console"}</h4>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? "رقم السن المستهدف بالمعالجة:" : "Target Tooth Code:"}</label>
                      <input
                        type="number"
                        min="11"
                        max="48"
                        value={denSelectedTooth}
                        onChange={(e) => setDenSelectedTooth(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-center font-mono text-slate-250 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? "مادة تصنيع التاج الـ Block:" : "Crown Block Material:"}</label>
                      <select
                        value={denCrownMaterial}
                        onChange={(e: any) => setDenCrownMaterial(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 outline-none"
                      >
                        <option value="Zirconia">Pre-sintered Zirconia Block</option>
                        <option value="Ceramic">Lithium Disilicate Glass Ceramic</option>
                        <option value="Titanium">Pure Grade Titanium Block</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-500">{denRpm.toLocaleString()} RPM</span>
                        <label className="text-slate-400">{isAr ? "سرعة دوران محور الخرط:" : "Milling Spindle Speed:"}</label>
                      </div>
                      <input
                        type="range"
                        min="12000"
                        max="30000"
                        step="2000"
                        value={denRpm}
                        onChange={(e) => setDenRpm(Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <button
                      onClick={runDentalMilling}
                      disabled={isMilling}
                      className="w-full bg-purple-500 hover:bg-purple-450 disabled:opacity-40 text-slate-950 font-black py-2.5 rounded-lg transition"
                    >
                      {isMilling ? (isAr ? "جاري خرط ونحت التاج..." : "Milling...") : (isAr ? "بدء عملية الخرط والميكنة CAD/CAM" : "Start CAD-CAM Milling Machine")}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-850 flex flex-col justify-between min-h-64">
                  <h4 className="text-xs font-bold text-slate-200 mb-2">🤖 {isAr ? "تتبع ذراع النحت الفرن الحراري الصيدلاني" : "Milling Robot & Furnace Telemetry"}</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span>{isMilling ? "ACTIVE" : "READY"}</span>
                        <span>{isAr ? "الحالة:" : "Status:"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{denCrownMaterial === "Zirconia" ? "1450 °C" : "850 °C"}</span>
                        <span>{isAr ? "حرارة فرن تبلد الخزف:" : "Sintering Temperature:"}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{millingProgress}%</span>
                        <span>{isAr ? "تقدم المعالجة والروبوت:" : "Milling Progress:"}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full transition-all duration-300"
                          style={{ width: `${millingProgress}%` }}
                        />
                      </div>
                    </div>

                    {millingProgress === 100 && (
                      <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg text-xs text-emerald-400 font-bold font-mono text-center">
                        {isAr
                          ? "تم نحت التاج الخزفي بنجاح وجاهز للتلميع والتركيب الإكلينيكي المباشر للمريض!"
                          : "Crown milled successfully. Ready for sintering and patient delivery."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PHYSICAL THERAPY */}
            {collegeId === "pt" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
                <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200">🦵 {isAr ? "مخطط التحليل الميكانيكي وزوايا المفاصل" : "Kinesiology Biomechanical Joints Analysis"}</h4>
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-slate-500">{ptKneeAngle}° (Knee Flexion)</span>
                        <label className="text-slate-450">{isAr ? "زاوية ثني المفصل أثناء التأهيل:" : "Knee Flexion Angle:"}</label>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="140"
                        value={ptKneeAngle}
                        onChange={(e) => setPtKneeAngle(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>

                    <div className="bg-slate-900 p-4 rounded border border-slate-800 space-y-2 font-mono">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-cyan-400 font-extrabold">{calculateJointStress}</span>
                        <span className="text-slate-450">{isAr ? "عزم التوتر الميكانيكي على الرباط الصليبي:" : "Calculated ACL Ligament Stress:"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-emerald-400 font-bold">Safe Mode</span>
                        <span className="text-slate-450">{isAr ? "حالة الأمان الهيكلية للمفصل:" : "Joint Structural Safety Status:"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200">📋 {isAr ? "البرنامج العلاجي المقترح لإصابات الملاعب" : "Prescribed Biomechanical Exercises Program"}</h4>
                  <div className="space-y-2 text-xs">
                    {ptExercises.map((ex, i) => (
                      <div key={i} className="bg-slate-900 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold">Phase {i+1}</span>
                        <span className="text-slate-300 text-[11.5px]">{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NURSING ICU CONSOLE */}
            {collegeId === "nur" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
                <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200">🫁 {isAr ? "شاشة الرعاية الحرجة ومراقبة المرضى" : "ICU Critical Care Telemetry Simulator"}</h4>
                  <div className="bg-black/60 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
                    <div className="flex justify-between text-xs border-b border-slate-900 pb-2">
                      <span className={`${icuHeartRate > 100 ? "text-rose-400 font-bold animate-pulse" : "text-emerald-400"}`}>{icuHeartRate} bpm</span>
                      <span className="text-slate-450">{isAr ? "معدل نبضات القلب:" : "ECG Heart Rate:"}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-slate-900 pb-2">
                      <span className="text-emerald-400">115/75 mmHg</span>
                      <span className="text-slate-450">{isAr ? "ضغط الشرايين الغازي:" : "Invasive BP:"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={`${icuOxygen < 90 ? "text-rose-400 animate-bounce font-extrabold" : "text-emerald-400"}`}>{icuOxygen}%</span>
                      <span className="text-slate-450">{isAr ? "الأكسجين النبضي SpO2:" : "Pulse Oximetry:"}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-slate-400 block font-bold mb-2">{isAr ? "خيارات التدخل السريع لإنقاذ المريض:" : "Emergency Nurse Triggers:"}</p>
                    <button
                      onClick={() => triggerIcuAction("oxygen")}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2 rounded text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                    >
                      <span>{isAr ? "توصيل الأكسجين عالي الكثافة (Oxygen Mask)" : "Deliver High-Flow Oxygen Mask"}</span>
                    </button>
                    <button
                      onClick={() => triggerIcuAction("bolus")}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 py-2 rounded text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                    >
                      <span>{isAr ? "حقن محلول ملحي Bolus" : "Infuse Normal Saline Bolus"}</span>
                    </button>
                    <button
                      onClick={() => triggerIcuAction("defib")}
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                    >
                      <span>{isAr ? "تطبيق صدمة كهربائية منسقة" : "Apply Synchronized Defibrillator"}</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-850 flex flex-col justify-between min-h-64">
                  <h4 className="text-xs font-bold text-slate-200 mb-2">🚨 {isAr ? "سجل التنبيهات والأحداث الطبية بالعناية المركزة" : "ICU Critical Events & Telemetry Logs"}</h4>
                  <div className="bg-black/40 p-3.5 rounded border border-slate-900 flex-1 overflow-y-auto space-y-2 text-xs font-mono text-rose-400">
                    {icuLogs.map((lg, i) => (
                      <p key={i} className="leading-normal">{lg}</p>
                    ))}
                  </div>
                  <div className="border-t border-slate-900 pt-3 mt-3 text-[11px] text-slate-500 flex justify-between font-mono">
                    <span>ICU BED CODE BLUE ALERT</span>
                    <span>Status: {icuOxygen > 95 ? "STABILIZED" : "CRITICAL"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. CURRICULUM & PROGRAMS TAB */}
        {activeTab === "structure" && (
          <div className="space-y-6 text-right">
            {/* Introductory Header */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className={`text-sm font-black text-${collegeMeta.color}-400 flex items-center gap-2 justify-end`}>
                  <BookOpen className="w-4 h-4" />
                  {isAr ? "الهيكل الأكاديمي والتخصصات التفاعلية" : "Interactive Academic Structure & Specialties"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isAr 
                    ? "انقر فوق أي بطاقة تخصص أدناه لعرض أحدث الإعلانات، المحاضرات المسجلة، والخطة الدراسية الخاصة بالقسم بشكل حي ومستقل."
                    : "Click any specialty card below to view live department-specific announcements, recorded lectures, and customized curriculum."}
                </p>
              </div>
              <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-3 py-1 rounded-full font-mono font-bold">
                {isAr ? `إجمالي الأقسام: ${collegeMeta.departments.length}` : `TOTAL DEPARTMENTS: ${collegeMeta.departments.length}`}
              </span>
            </div>

            {/* GRID OF SPECIALTY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {collegeMeta.departments.map((dept, idx) => {
                const details = getDeptDetails(collegeId, dept);
                const isSelected = selectedDept === dept;
                
                return (
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={idx}
                    onClick={() => {
                      setSelectedDept(dept);
                      addLog(isAr ? `تم تصفح قسم ${dept} بوابات الكلية` : `Browsed department ${dept} SGU ERP`);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                      isSelected 
                        ? `bg-slate-900 border-${collegeMeta.color}-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]`
                        : "bg-slate-950/80 border-slate-850/60 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    {/* Selected Highlight Overlay */}
                    {isSelected && (
                      <div className={`absolute top-0 right-0 w-1.5 h-full bg-${collegeMeta.color}-500`} />
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected ? `bg-${collegeMeta.color}-950 text-${collegeMeta.color}-400` : "bg-slate-900 text-slate-500"
                        }`}>
                          {dept.includes("(") ? dept.match(/\(([^)]+)\)/)?.[1] || "DEP" : "DEP"}
                        </span>
                        <Info className={`w-3.5 h-3.5 ${isSelected ? `text-${collegeMeta.color}-400 animate-pulse` : "text-slate-600"}`} />
                      </div>
                      
                      <h4 className={`text-xs font-black leading-snug ${isSelected ? "text-white" : "text-slate-300"}`}>
                        {dept}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-850/50 space-y-1.5 text-[10px] text-slate-400 font-bold">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">{isAr ? details.headAr : details.headEn}</span>
                        <span className="text-slate-500">{isAr ? "رئيس القسم" : "HOD"}</span>
                      </div>
                      <div className="flex justify-between items-center font-mono">
                        <span className={`text-${collegeMeta.color}-400 font-bold`}>{details.profCount}</span>
                        <span className="text-slate-500">{isAr ? "أعضاء هيئة التدريس" : "Professors"}</span>
                      </div>
                      <div className="flex justify-between items-center font-mono">
                        <span className="text-slate-300 font-bold">{details.studentsCount}</span>
                        <span className="text-slate-500">{isAr ? "الطلاب المقيدين" : "Enrolled"}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* DYNAMIC DETAIL HUB FOR SELECTED SPECIALTY */}
            {selectedDept && (() => {
              const details = getDeptDetails(collegeId, selectedDept);
              const customList = customAnnouncements[selectedDept] || [];
              const allAnnouncements = isAr 
                ? [...customList, ...details.announcementsAr]
                : [...customList, ...details.announcementsEn];
              const lecturesList = isAr ? details.lecturesAr : details.lecturesEn;

              // Handle post announcement
              const handlePostAnnouncement = () => {
                if (!newAnnText.trim()) return;
                const updated = {
                  ...customAnnouncements,
                  [selectedDept]: [newAnnText, ...(customAnnouncements[selectedDept] || [])]
                };
                setCustomAnnouncements(updated);
                triggerSystemPush(
                  isAr ? `إعلان جديد: قسم ${selectedDept}` : `New Announcement: ${selectedDept}`,
                  newAnnText
                );
                addLog(isAr ? `أضاف الطالب إعلاناً لقسم ${selectedDept}: ${newAnnText}` : `Student posted announcement to ${selectedDept}: ${newAnnText}`);
                setNewAnnText("");
              };

              // Simulated Download Trigger
              const handleDownloadLecture = (title: string) => {
                if (downloadingLecture) return;
                setDownloadingLecture(title);
                setDownloadProgress(0);
                addLog(isAr ? `بدء تحميل ملف المحاضرة: ${title}` : `Started download: ${title}`);
                
                let current = 0;
                const interval = setInterval(() => {
                  current += 10;
                  setDownloadProgress(current);
                  if (current >= 100) {
                    clearInterval(interval);
                    setDownloadingLecture(null);
                    triggerSystemPush(
                      isAr ? "اكتمل التحميل بنجاح" : "Download Complete",
                      isAr ? `تم تحميل ملف المحاضرة ${title} بنجاح.` : `Downloaded ${title} successfully.`
                    );
                    addLog(isAr ? `اكتمل تحميل الملف: ${title}` : `Completed download: ${title}`);
                  }
                }, 150);
              };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  
                  {/* LEFT PANEL: ANNOUNCEMENTS HUB & INTERACTIVE posting */}
                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="border-b border-slate-850 pb-3 flex justify-between items-center">
                        <span className={`text-[10px] bg-${collegeMeta.color}-950 text-${collegeMeta.color}-400 px-2.5 py-0.5 rounded-full font-bold`}>
                          {isAr ? "لوحة الإعلانات الحية" : "Live Announcements Board"}
                        </span>
                        <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          {isAr ? `إعلانات قسم ${selectedDept.split(" ")[0]}` : `${selectedDept.split(" ")[0]} Bulletin`}
                        </h4>
                      </div>

                      {/* List of Announcements */}
                      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                        {allAnnouncements.map((ann, i) => (
                          <div 
                            key={i} 
                            className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-[11px] leading-relaxed text-slate-300 relative"
                          >
                            <span className={`absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-${collegeMeta.color}-500`} />
                            <p className="pl-4">{ann}</p>
                            <span className="text-[9px] text-slate-500 font-mono block mt-1">
                              {i === 0 && customList.includes(ann) ? (isAr ? "منذ ثوانٍ • مشاركة الطالب" : "Just now • Student post") : (isAr ? "نظام ERP معتمد" : "Verified SGU ERP")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive posting form */}
                    <div className="border-t border-slate-900 pt-4 space-y-2">
                      <h5 className="text-[10px] font-black text-slate-400">{isAr ? "مشاركة إعلان سريع (ممثل تخصص):" : "Post Quick Notice (Class Rep):"}</h5>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAnnText}
                          onChange={(e) => setNewAnnText(e.target.value)}
                          placeholder={isAr ? "اكتب الإعلان هنا..." : "Type notice text here..."}
                          className="bg-slate-900 text-xs text-slate-100 placeholder-slate-600 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-slate-700 flex-1 text-right"
                        />
                        <button
                          onClick={handlePostAnnouncement}
                          disabled={!newAnnText.trim()}
                          className={`px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                            newAnnText.trim() 
                              ? `bg-${collegeMeta.color}-600 text-slate-950 hover:bg-${collegeMeta.color}-500` 
                              : "bg-slate-900 text-slate-600 cursor-not-allowed"
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL: LECTURES & DOWNLOADS */}
                  <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                    <div className="border-b border-slate-850 pb-3 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-mono font-bold">
                        {selectedDept.includes("CS") || selectedDept.includes("SE") || selectedDept.includes("AI") ? "SGU-FCIS REPOSITORY" : "SGU CLINICAL DEPT"}
                      </span>
                      <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {isAr ? "أحدث المحاضرات والملفات الدراسية المرفوعة" : "Latest Recorded Lectures & Study Materials"}
                      </h4>
                    </div>

                    {/* Lecture List & Progress Indicators */}
                    <div className="space-y-3">
                      {lecturesList.map((lec, i) => {
                        const isDownloading = downloadingLecture === lec.title;
                        return (
                          <div key={i} className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1.5 text-right flex-1 w-full">
                              <div className="flex items-center justify-end gap-2">
                                <span className={`text-[9px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold`}>
                                  {lec.code}
                                </span>
                                <h5 className="text-xs font-black text-slate-200">{lec.title}</h5>
                              </div>
                              <div className="flex items-center justify-end gap-4 text-[10px] text-slate-450 font-bold">
                                <span>{isAr ? `تاريخ الرفع: ${lec.date}` : `Uploaded: ${lec.date}`}</span>
                                <span>{lec.doctor}</span>
                              </div>

                              {/* Simulated Progress bar */}
                              {isDownloading && (
                                <div className="w-full mt-2 space-y-1">
                                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                                    <span>{downloadProgress}%</span>
                                    <span>{isAr ? "جاري تنزيل الملف الأكاديمي..." : "Downloading academic file..."}</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                                    <div 
                                      className={`bg-${collegeMeta.color}-500 h-full transition-all duration-150`} 
                                      style={{ width: `${downloadProgress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Download Action */}
                            <button
                              disabled={!!downloadingLecture}
                              onClick={() => handleDownloadLecture(lec.title)}
                              className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto justify-center cursor-pointer ${
                                isDownloading
                                  ? `bg-${collegeMeta.color}-950 text-${collegeMeta.color}-400 border border-${collegeMeta.color}-800`
                                  : "bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300"
                              }`}
                            >
                              {isDownloading ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              <span>{isDownloading ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "Download" : "Download")}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Link to Academic Programs */}
                    <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-850/50 mt-2 text-xs flex justify-between items-center">
                      <div className="flex gap-1.5 items-center">
                        {collegeMeta.programs.slice(0, 1).map((prog, i) => (
                          <span key={i} className="text-slate-300 font-bold text-[11px]">{prog}</span>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">{isAr ? "البرنامج المعتمد:" : "Degree Path:"}</span>
                    </div>

                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* 3. COURSES, LECTURES & SCHEDULES TAB */}
        {activeTab === "academics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
            {/* Courses and Lectures Syllabus */}
            <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5 justify-end">
                <BookOpen className={`w-4 h-4 text-${collegeMeta.color}-400`} />
                {isAr ? "المواد والمقررات النشطة هذا الترم" : "Active Semester Courses & Lectures"}
              </h3>

              <div className="space-y-3">
                {collegeMeta.courses.map((c) => (
                  <div key={c.code} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] bg-${collegeMeta.color}-950 text-${collegeMeta.color}-400 border border-${collegeMeta.color}-900/40 px-2 py-0.5 rounded font-mono font-bold`}>
                        {c.code}
                      </span>
                      <span className="text-slate-450 text-[11px] font-mono font-bold">{c.credits} {isAr ? "ساعات معتمدة" : "Credits"}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-200">{isAr ? c.nameAr : c.nameEn}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">{isAr ? `المستوى الدراسي: ${c.level}` : `Curriculum placement: ${c.level}`}</p>
                    <div className="border-t border-slate-850 pt-2 flex justify-between items-center text-[11px] text-slate-400">
                      <span>{isAr ? "عبر منصة SGU" : "via SGU Platform"}</span>
                      <span className="text-emerald-400 font-bold">● {isAr ? "مكتمل التدريس" : "Lectures ongoing"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Schedules */}
            <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5 justify-end">
                <Calendar className={`w-4 h-4 text-${collegeMeta.color}-400`} />
                {isAr ? "الجدول الدراسي الأسبوعي الفعلي بالكلية" : "Weekly Lectures & Labs Class Schedule"}
              </h3>

              <div className="space-y-3">
                {collegeMeta.schedule.map((sch, i) => (
                  <div key={i} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                    <div className={`w-16 text-center border-l border-slate-800 pl-2 shrink-0 text-xs font-bold text-${collegeMeta.color}-400`}>
                      <p>{sch.day}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{sch.time.split(" - ")[0]}</p>
                    </div>
                    <div className="flex-1 space-y-1 text-right">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">{sch.course}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{sch.room}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">{isAr ? `المحاضر: ${sch.instructor}` : `Instructor: ${sch.instructor}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. ADMIN PORTAL & SERVICES TAB */}
        {activeTab === "admin" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Column 1: Biometric Check-in & Assignments */}
              <div className="lg:col-span-6 space-y-6 text-right">
                {/* Attendance Biometric checkin */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    {isAr ? "الحضور والغياب وبصمة الهوية الوطنية البيومترية" : "Biometric Attendance & Absence Logs"}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isAr
                      ? "اضغط لتشغيل ماسح بصمة الوجه الذكي أو NFC لتأكيد حضورك بالمحاضرة أو التدريب العملي بالكلية."
                      : "Trigger simulated biometric analysis scanner to log attendance status."}
                  </p>

                  <div className="flex gap-3 items-center">
                    <button
                      onClick={runBiometricCheckin}
                      disabled={isScanning}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-black py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                      <span>{isScanning ? (isAr ? "جاري المسح..." : "Scanning...") : (isAr ? "تشغيل ماسح البصمة البيومترية" : "Verify FaceID Checkin")}</span>
                    </button>
                  </div>

                  {isScanning && (
                    <div className="bg-slate-900 p-3 rounded border border-slate-800 text-center font-mono text-[11px] text-amber-400 animate-pulse">
                      {scanningMsg}
                    </div>
                  )}

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {attRecord.map((rec) => (
                      <div key={rec.id} className="bg-slate-900 p-2.5 rounded border border-slate-800 flex justify-between items-center text-xs font-mono">
                        <span className="text-emerald-400 font-bold">● Present</span>
                        <span className="text-slate-500">{rec.method} ({rec.time})</span>
                        <span className="text-slate-300 font-bold">{rec.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignments & Project upload */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                    <Upload className="w-4 h-4 text-teal-400" />
                    {isAr ? "التكليفات والواجبات وبوابات مشاريع العمل" : "Assignments & Projects Delivery Hub"}
                  </h4>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    {isAr
                      ? "ارفع ملف الكود البرمجي (ZIP) أو مستند الأبحاث السريرية (PDF) للتقييم الأكاديمي المباشر."
                      : "Submit ZIP or PDF files of projects to receive grading and clinical evaluation."}
                  </p>

                  <form onSubmit={handleAsgSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder={isAr ? "مثال: fcis_ai_model_submission.zip" : "e.g., med_round_evaluation.pdf"}
                        value={asgNameInput}
                        onChange={(e) => setAsgNameInput(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                      <button
                        type="submit"
                        disabled={isUploadingAsg || !asgNameInput.trim()}
                        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-black px-4 py-1.5 rounded text-xs cursor-pointer transition"
                      >
                        {isUploadingAsg ? "..." : (isAr ? "رفع الملف" : "Upload")}
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {asgFiles.map((asg) => (
                      <div key={asg.id} className="bg-slate-900 p-2.5 rounded border border-slate-800 text-xs flex flex-col gap-1 text-right">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-emerald-400 font-bold">{asg.grade}</span>
                          <span className="text-slate-300 font-bold truncate max-w-[200px]">{asg.name}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>{isAr ? `المراجع: ${asg.reviewer}` : `Reviewer: ${asg.reviewer}`}</span>
                          <span>{asg.date} | {asg.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Exams, Certificates, Services & Announcements */}
              <div className="lg:col-span-6 space-y-6 text-right">
                {/* Exams and Grades */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                    <Award className="w-4 h-4 text-yellow-400" />
                    {isAr ? "نتائج امتحانات الكنترول والشهادة والـ GPA" : "Exams & Control Result Logs"}
                  </h4>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    {isAr
                      ? "رصد درجات اختبارات المنتصف، العملي/الإكلينيكي والنهائي المعتمدة من الكنترول المركزي."
                      : "Control certified grades history of active coursework in this college."}
                  </p>

                  <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
                    <div className="flex justify-between border-b border-slate-850 pb-1.5">
                      <span className="text-emerald-400 font-bold">18 / 20</span>
                      <span>{isAr ? "اختبار منتصف الفصل (Midterm):" : "Midterm Exam Grade:"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 pb-1.5">
                      <span className="text-emerald-400 font-bold">19 / 20</span>
                      <span>{isAr ? "الاختبار العملي / الإكلينيكي (Practical):" : "Practical/OSCE Grade:"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 pb-1.5">
                      <span className="text-emerald-400 font-bold">53 / 60</span>
                      <span>{isAr ? "امتحان نهاية الفصل الدراسي (Final):" : "Final Term Exam:"}</span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                      <span>90 / 100 (Grade: A)</span>
                      <span>{isAr ? "النتيجة النهائية للمقرر الرئيسي:" : "Total Subject Grade:"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(isAr 
                        ? `تم توليد وثيقة بيان درجات معتمد بصيغة PDF وتوقيعه رقمياً بنجاح! \nمعرف الهاش: SGU-CR-${Math.random().toString(16).toUpperCase().slice(2, 10)}`
                        : `Certified PDF Transcript generated successfully!`
                      );
                      addLog(`[طلب وثيقة] توليد بيان درجات معتمد وموقع رقمياً للكلية`);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-bold py-2 rounded text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isAr ? "تحميل بيان درجات رسمي موقع رقمياً" : "Download Digitally Signed Transcript PDF"}</span>
                  </button>
                </div>

                {/* Educational Lecture Files */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                    <BookMarked className="w-4 h-4 text-purple-400" />
                    {isAr ? "الملفات التعليمية والمحاضرات للتحميل" : "Educational Materials & Lecture Downloads"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {collegeMeta.files.map((file, i) => (
                      <div key={i} className="bg-slate-900 p-2.5 rounded border border-slate-800 flex justify-between items-center text-right font-mono">
                        <button
                          onClick={() => {
                            alert(isAr ? `بدأ تحميل ملف المحاضرة: ${file.name}` : `Downloading: ${file.name}`);
                            addLog(`[تحميل ملف] تحميل المستند التعليمي: ${file.name}`);
                          }}
                          className="bg-slate-950 hover:bg-slate-800 border border-slate-850 p-1.5 rounded cursor-pointer text-slate-300 hover:text-emerald-400 transition"
                          title="Download File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-right">
                          <p className="text-[11.5px] text-slate-200 font-bold font-sans line-clamp-1">{file.name}</p>
                          <p className="text-[9.5px] text-slate-500 mt-0.5">{file.size} | {file.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dean Announcements & Campus News */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                    {isAr ? "مركز الإعلانات والتعميمات الرسمية للعمادة" : "Dean Official Announcements & Notices"}
                  </h4>
                  <div className="space-y-2.5">
                    {collegeMeta.announcements.map((ann, i) => (
                      <div key={i} className="bg-slate-900/40 p-3 rounded-lg border border-slate-850/60 text-xs text-slate-350 leading-relaxed text-right border-r-4 border-r-amber-500">
                        {ann}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Services: Excuses, Transfers, Withdrawals */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                    <Settings className="w-4 h-4 text-emerald-400" />
                    {isAr ? "الخدمات الطلابية والتماسات العمادة" : "Student Services & Applications"}
                  </h4>
                  <form onSubmit={submitServiceRequest} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? "البيان أو المستند الشارح:" : "Details/Excuses:"}</label>
                        <input
                          type="text"
                          required
                          placeholder={isAr ? "أرفق سبباً أو عذراً إدارياً..." : "Describe request details..."}
                          value={serviceDetails}
                          onChange={(e) => setServiceDetails(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 text-right focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? "نوع الخدمة المطلوبة:" : "Service Type:"}</label>
                        <select
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-bold outline-none"
                        >
                          {isAr ? (
                            <>
                              <option value="طلب عذر طبي رسمي">تقديم عذر طبي رسمي</option>
                              <option value="طلب تحويل تخصص داخلي">طلب تحويل قسم داخلي</option>
                              <option value="طلب انسحاب رسمي من مقرر">طلب انسحاب من مقرر</option>
                            </>
                          ) : (
                            <>
                              <option value="Official Medical Excuse">Submit Official Medical Excuse</option>
                              <option value="Internal Major Transfer">Internal Department Transfer</option>
                              <option value="Course Official Withdrawal">Withdraw from Course</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!serviceDetails.trim()}
                      className="w-full bg-emerald-500 hover:bg-emerald-450 disabled:opacity-40 text-slate-950 py-2 rounded-lg font-black text-xs cursor-pointer transition"
                    >
                      {isAr ? "تقديم الالتماس لشؤون الكلية" : "Submit Petition to College Office"}
                    </button>
                  </form>

                  <div className="space-y-2 max-h-32 overflow-y-auto font-mono text-xs">
                    {serviceRequests
                      .filter(req => req.studentId === student.id && req.collegeId === collegeMeta.id)
                      .map((req) => (
                      <div key={req.id} className="bg-slate-900 p-2.5 rounded border border-slate-800 flex justify-between items-center text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.status.includes("Pending") ? "bg-amber-950 text-amber-400" : "bg-emerald-950 text-emerald-400"
                        }`}>
                          {req.status}
                        </span>
                        <div className="text-right">
                          <p className="text-[11.5px] text-slate-250 font-bold font-sans">{req.type}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{req.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Advisor Communication Chat */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    {isAr ? "التواصل الأكاديمي المباشر مع المرشد العلمي" : "Direct Advisor Academic Chatroom"}
                  </h4>
                  <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800 space-y-3 max-h-56 overflow-y-auto">
                    {chatLog.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                          msg.sender === "advisor"
                            ? "bg-slate-950 border border-slate-850 text-slate-300 ml-auto text-right border-r-4 border-r-emerald-500"
                            : "bg-emerald-600 text-slate-950 mr-auto text-left font-semibold"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    ))}
                    {isAdvisorTyping && (
                      <div className="bg-slate-950 border border-slate-850 text-slate-400 rounded-xl p-3 ml-auto text-right w-fit max-w-[80%] text-xs animate-pulse">
                        {isAr ? "المرشد الأكاديمي يكتب الرد الآن..." : "Academic Advisor is typing..."}
                      </div>
                    )}
                  </div>

                  <form onSubmit={sendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder={isAr ? "اسأل مرشدك بخصوص الخطة، الدرجات، التسجيل..." : "Ask your advisor regarding plans, grades..."}
                      value={chatMsgInput}
                      onChange={(e) => setChatMsgInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 text-right"
                    />
                    <button
                      type="submit"
                      disabled={isAdvisorTyping || !chatMsgInput.trim()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
