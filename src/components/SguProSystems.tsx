import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Layers,
  ShieldCheck,
  Bell,
  Cpu,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  Download,
  Terminal,
  Wifi,
  MapPin,
  QrCode,
  Radio,
  Send,
  Database,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building,
  DollarSign,
  Globe2,
  Nfc,
  Clock,
  Settings,
  ShieldAlert,
  HelpCircle,
  Code,
  GraduationCap,
  Eye,
  ClipboardList,
  Fingerprint,
  Activity,
  FlaskConical,
  MessageSquare,
  Vote,
  Compass,
  BarChart3,
  Cloud
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
  PieChart,
  Pie,
  Cell
} from "recharts";

import { DatabaseUser } from "../databaseMock";
import { AdmissionApplication } from "../types";
import SguAdvancedSuite from "./SguAdvancedSuite";
import SguGoogleDrivePicker from "./SguGoogleDrivePicker";
import SguAdmissionSystem from "./SguAdmissionSystem";
import SguCommunicationSystem from "./SguCommunicationSystem";
import SguHrSystem from "./SguHrSystem";
import SguResearchGraduateSystem from "./SguResearchGraduateSystem";
import SguAlumniPortal from "./SguAlumniPortal";
import SguEngineeringHub from "./SguEngineeringHub";

interface SguProSystemsProps {
  dbUsers: DatabaseUser[];
}

// 12 Systems tabs identifiers
type SystemTab =
  | "sis"
  | "lms"
  | "erp"
  | "hr"
  | "finance"
  | "research"
  | "library"
  | "dorm"
  | "transport"
  | "alumni"
  | "ai_assistant"
  | "qa"
  | "gdrive_picker"
  | "admission"
  | "communication"
  | "adv_results"
  | "adv_exam_mon"
  | "adv_grading"
  | "adv_appeals"
  | "adv_cms"
  | "adv_ranking"
  | "adv_analytics"
  | "adv_smart_exams"
  | "adv_integrity"
  | "adv_accreditation"
  | "adv_research"
  | "adv_internship"
  | "adv_alumni"
  | "adv_campus_booking"
  | "adv_lab"
  | "adv_digital_cert"
  | "adv_decision"
  | "adv_complaints"
  | "adv_elections"
  | "adv_recommendations"
  | "engineering_hub";

export default function SguProSystems({ dbUsers }: SguProSystemsProps) {
  // Local state for users and admission applications
  const [dbUsersState, setDbUsersState] = useState<DatabaseUser[]>(dbUsers);
  const [applications, setApplications] = useState<AdmissionApplication[]>([
    {
      id: "APP-2026-001",
      fullName: "محمد أحمد علي",
      nationalId: "29905140101234",
      highSchoolPercentage: 94.5,
      wishes: ["هندسة الحاسبات", "علوم الحاسب"],
      certificateFile: "شهادة_الثانوية.pdf",
      idCardFile: "بطاقة_الرقم_القومي.pdf",
      photoFile: "صورة_شخصية.jpg",
      paidFee: true,
      status: "pending",
    },
    {
      id: "APP-2026-002",
      fullName: "سارة محمود حسن",
      nationalId: "30109210104321",
      highSchoolPercentage: 98.2,
      wishes: ["كلية الطب البشري"],
      certificateFile: "cert_high_school.pdf",
      idCardFile: "national_id.pdf",
      photoFile: "personal_pic.jpg",
      paidFee: true,
      status: "accepted",
      electronicSignatureId: "SIG-83492",
      electronicSignatureDate: "2026-07-01",
      signatureValue: "MEYCIQCcPj8f3XqW...",
      documentDataHash: "sha256-8a9d12c..."
    },
    {
      id: "APP-2026-003",
      fullName: "خالد وليد يسري",
      nationalId: "29811050209876",
      highSchoolPercentage: 88.0,
      wishes: ["كلية الهندسة", "علوم الحاسب"],
      certificateFile: "cert.pdf",
      idCardFile: "id.pdf",
      photoFile: "photo.jpg",
      paidFee: false,
      status: "modify_required",
      adminFeedback: "يرجى إعادة رفع شهادة الثانوية العامة بوضوح أعلى"
    }
  ]);

  // Activated Tab - defaults to local AI Assistant module
  const [activeSystemTab, setActiveSystemTab] = useState<SystemTab>("ai_assistant");

  // Systems filtering & Search states
  const [selectedCategory, setSelectedCategory] = useState<"all" | "core" | "academic" | "finance" | "research">("all");
  const [systemSearch, setSystemSearch] = useState("");

  // Complete List of the 30 Professional SGU Systems
  const systemsArray = [
    { id: "sis", name: "نظام معلومات الطلاب SIS", desc: "Student Registry", icon: GraduationCap, color: "text-emerald-400", bgSelected: "border-emerald-500/40 shadow-emerald-500/5 bg-slate-800", category: "core" },
    { id: "lms", name: "إدارة التعلم LMS", desc: "Learning Portal", icon: BookOpen, color: "text-sky-400", bgSelected: "border-sky-500/40 shadow-sky-500/5 bg-slate-800", category: "core" },
    { id: "admission", name: "بوابة القبول والتسجيل الموحدة", desc: "Admission Portal", icon: GraduationCap, color: "text-amber-400 animate-pulse", bgSelected: "border-amber-500/40 shadow-amber-500/5 bg-slate-800", category: "core" },
    { id: "communication", name: "مركز الاتصالات والتبليغ الموحد", desc: "Broadcast Hub", icon: Bell, color: "text-teal-400 animate-pulse", bgSelected: "border-teal-500/40 shadow-teal-500/5 bg-slate-800", category: "core" },
    { id: "erp", name: "تكامل الـ ERP والـ APIs", desc: "Corporate System", icon: Code, color: "text-purple-400", bgSelected: "border-purple-500/40 shadow-purple-500/5 bg-slate-800", category: "finance" },
    { id: "hr", name: "شؤون الموظفين والرواتب HR", desc: "Staff Directory", icon: Users, color: "text-rose-455", bgSelected: "border-rose-500/40 shadow-rose-500/5 bg-slate-800", category: "finance" },
    { id: "finance", name: "المالية والخزنة", desc: "Treasury Suite", icon: DollarSign, color: "text-amber-450", bgSelected: "border-amber-500/40 shadow-amber-500/5 bg-slate-800", category: "finance" },
    { id: "research", name: "نظام الدراسات العليا والبحث العلمي", desc: "Graduate Research", icon: Globe2, color: "text-indigo-400", bgSelected: "border-indigo-500/40 shadow-indigo-500/5 bg-slate-800", category: "research" },
    { id: "alumni", name: "رابطة وبوابة الخريجين والتوظيف", desc: "Alumni Network & Jobs", icon: Users, color: "text-lime-400", bgSelected: "border-lime-500/40 shadow-lime-500/5 bg-slate-800", category: "research" },
    { id: "library", name: "المكتبة الإلكترونية الموحدة", desc: "Library Catalog", icon: FileCheck, color: "text-blue-450", bgSelected: "border-blue-500/40 shadow-blue-500/5 bg-slate-800", category: "core" },
    { id: "dorm", name: "السكن والمدينة الجامعية", desc: "Housing Board", icon: Building, color: "text-indigo-450", bgSelected: "border-indigo-500/40 shadow-indigo-500/5 bg-slate-800", category: "finance" },
    { id: "transport", name: "النقل وحافلات الـ GPS", desc: "GPS Fleet", icon: Radio, color: "text-cyan-455", bgSelected: "border-cyan-500/40 shadow-cyan-500/5 bg-slate-800", category: "finance" },
    { id: "ai_assistant", name: "البرنامج الذكي ليوسف (AI)", desc: "Counseling chatbot", icon: Cpu, color: "text-amber-500 animate-pulse", bgSelected: "border-amber-550 shadow-amber-500/10 bg-slate-800", category: "core" },
    { id: "gdrive_picker", name: "مستندات Google Drive & Picker", desc: "Cloud Drive & Picker", icon: Cloud, color: "text-indigo-400 animate-pulse", bgSelected: "border-indigo-500/45 shadow-indigo-500/10 bg-slate-800", category: "core" },
    { id: "qa", name: "الجودة والاعتماد الأكاديمي", desc: "QA & Block Audit", icon: FileCheck, color: "text-violet-450", bgSelected: "border-violet-500/40 shadow-violet-500/5 bg-slate-800", category: "academic" },
    { id: "engineering_hub", name: "مركز هندسة النظم وإدارة الإصدارات والبيانات", desc: "DevOps & Engineering Hub", icon: Terminal, color: "text-indigo-400 animate-pulse", bgSelected: "border-indigo-550 shadow-indigo-500/10 bg-slate-800", category: "academic" },

    // Advanced modular systems (20 systems)
    { id: "adv_results", name: "إدارة النتائج والمعدلات GPA", desc: "Results Analytics", icon: Award, color: "text-emerald-450", bgSelected: "border-emerald-500/40 shadow-emerald-500/5 bg-slate-800", category: "academic" },
    { id: "adv_exam_mon", name: "مراقبة الامتحانات وضبط اللجان", desc: "Exam Surveillance", icon: Eye, color: "text-red-400", bgSelected: "border-red-500/40 shadow-red-500/5 bg-slate-800", category: "academic" },
    { id: "adv_grading", name: "التصحيح التلقائي واعتماد الدرجات", desc: "MCQ Grading Engine", icon: Settings, color: "text-sky-400", bgSelected: "border-sky-500/40 shadow-sky-500/5 bg-slate-800", category: "academic" },
    { id: "adv_appeals", name: "الالتماسات والمراجعات الأكاديمية", desc: "Appeals Register", icon: ClipboardList, color: "text-amber-400", bgSelected: "border-amber-500/40 shadow-amber-500/5 bg-slate-800", category: "academic" },
    { id: "adv_cms", name: "إدارة المحتوى والمراجع العلمية", desc: "Academic Content CMS", icon: BookOpen, color: "text-indigo-400", bgSelected: "border-indigo-500/40 shadow-indigo-500/5 bg-slate-800", category: "core" },
    { id: "adv_ranking", name: "لوحات التميز وترتيب الكليات", desc: "Rankings & Leaderboards", icon: TrendingUp, color: "text-yellow-400", bgSelected: "border-yellow-500/40 shadow-yellow-500/5 bg-slate-800", category: "research" },
    { id: "adv_analytics", name: "تحليلات الأداء والإنذار المبكر", desc: "Risk Predictor Analytics", icon: BarChart3, color: "text-pink-400", bgSelected: "border-pink-500/40 shadow-pink-500/5 bg-slate-800", category: "academic" },
    { id: "adv_smart_exams", name: "بنك الأسئلة والامتحانات الذكية", desc: "Smart Exams & Q-Bank", icon: Cpu, color: "text-purple-400", bgSelected: "border-purple-500/40 shadow-purple-500/5 bg-slate-800", category: "academic" },
    { id: "adv_integrity", name: "كشف الانتحال وسلامة المشاريع", desc: "Academic Plagiarism AI", icon: Fingerprint, color: "text-emerald-500", bgSelected: "border-emerald-500/40 shadow-emerald-500/5 bg-slate-800", category: "academic" },
    { id: "adv_accreditation", name: "الجودة والاعتماد وبناء القدرات", desc: "NAQAAE Accreditation", icon: Activity, color: "text-teal-400", bgSelected: "border-teal-500/40 shadow-teal-500/5 bg-slate-800", category: "academic" },
    { id: "adv_research", name: "أبحاث Scopus وبراءات الفندقة", desc: "Scopus Research Hub", icon: Globe2, color: "text-violet-400", bgSelected: "border-violet-500/40 shadow-violet-500/5 bg-slate-800", category: "research" },
    { id: "adv_internship", name: "التدريب الميداني والشركاء", desc: "Internship Coordinator", icon: Briefcase, color: "text-blue-500", bgSelected: "border-blue-500/40 shadow-blue-500/5 bg-slate-800", category: "research" },
    { id: "adv_alumni", name: "رابطة شؤون الخريجين والتوظيف", desc: "Alumni Network Portal", icon: Users, color: "text-lime-400", bgSelected: "border-lime-500/40 shadow-lime-500/5 bg-slate-800", category: "research" },
    { id: "adv_campus_booking", name: "الإدارة الجغرافية وحجز القاعات", desc: "Smart Campus & Room Book", icon: MapPin, color: "text-orange-400", bgSelected: "border-orange-500/40 shadow-orange-500/5 bg-slate-800", category: "finance" },
    { id: "adv_lab", name: "إدارة المختبرات والعهدة العلمية", desc: "Lab Inventory & Health", icon: FlaskConical, color: "text-rose-455", bgSelected: "border-rose-500/40 shadow-rose-500/5 bg-slate-800", category: "finance" },
    { id: "adv_digital_cert", name: "قبو الشهادات الرقمية والـ QR", desc: "Degree blockchain QR", icon: QrCode, color: "text-indigo-500", bgSelected: "border-indigo-500/40 shadow-indigo-500/5 bg-slate-800", category: "core" },
    { id: "adv_decision", name: "دعم القرار والتنبؤ الاستراتيجي", desc: "Strategic Decision System", icon: TrendingUp, color: "text-amber-500", bgSelected: "border-amber-500/40 shadow-amber-500/5 bg-slate-800", category: "research" },
    { id: "adv_complaints", name: "بوابة المقترحات والشكاوى المصلحية", desc: "Anonymous Complaint board", icon: MessageSquare, color: "text-teal-400", bgSelected: "border-teal-500/40 shadow-teal-500/5 bg-slate-800", category: "core" },
    { id: "adv_elections", name: "الاقتراع والانتخابات الطلابية", desc: "Student Union Ballot", icon: Vote, color: "text-sky-500", bgSelected: "border-sky-500/40 shadow-sky-500/5 bg-slate-800", category: "core" },
    { id: "adv_recommendations", name: "محرك التوصيات والمسار الذكي AI", desc: "Career Pathway Advisor", icon: Compass, color: "text-purple-500", bgSelected: "border-purple-500/40 shadow-purple-500/5 bg-slate-800", category: "research" }
  ];

  // Advanced modules index mapping
  const advancedModuleMap: Record<string, number> = {
    adv_results: 1,
    adv_exam_mon: 2,
    adv_grading: 3,
    adv_appeals: 4,
    adv_cms: 5,
    adv_ranking: 6,
    adv_analytics: 7,
    adv_smart_exams: 8,
    adv_integrity: 9,
    adv_accreditation: 10,
    adv_research: 11,
    adv_internship: 12,
    adv_alumni: 13,
    adv_campus_booking: 14,
    adv_lab: 15,
    adv_digital_cert: 16,
    adv_decision: 17,
    adv_complaints: 18,
    adv_elections: 19,
    adv_recommendations: 20
  };

  // Notifications feedback toast state
  const [alertText, setAlertText] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setAlertText(msg);
    setTimeout(() => setAlertText(null), 4000);
  };

  // Filter students from DB database
  const sampleStudents = useMemo(() => {
    return dbUsers.filter(u => u.role === "student").slice(0, 30);
  }, [dbUsers]);

  // Filter faculty/admin staff from DB
  const filterStaff = useMemo(() => {
    return dbUsers.filter(u => u.role === "faculty" || u.role === "ta" || u.role === "admin" || u.role === "finance_officer").slice(0, 30);
  }, [dbUsers]);


  // ==========================================
  // MODULE 1: SIS (STUDENT INFORMATION SYSTEM)
  // ==========================================
  const [sisSearch, setSisSearch] = useState("");
  const [selectedSisStudentId, setSelectedSisStudentId] = useState<string | null>("2026SGU-ST-0000");
  
  // Search Parents-Student database
  const [parentSearchId, setParentSearchId] = useState("2026SGU-ST-0000");
  const [parentNotes, setParentNotes] = useState("");
  const [parentStudentMatch, setParentStudentMatch] = useState<DatabaseUser | null>(null);

  useEffect(() => {
    if (dbUsers.length > 0) {
      const firstStudent = dbUsers.find(u => u.role === "student");
      if (firstStudent) {
        setSelectedSisStudentId(firstStudent.id);
        setParentSearchId(firstStudent.id);
        setParentStudentMatch(firstStudent);
      }
    }
  }, [dbUsers]);

  const activeSisStudent = useMemo(() => {
    return dbUsers.find(u => u.id === selectedSisStudentId) || dbUsers.find(u => u.role === "student") || null;
  }, [selectedSisStudentId, dbUsers]);

  const filteredSisStudents = useMemo(() => {
    if (!sisSearch.trim()) return sampleStudents;
    return dbUsers.filter(
      u =>
        u.role === "student" &&
        (u.nameAr.includes(sisSearch) || u.id.toLowerCase().includes(sisSearch.toLowerCase()))
    ).slice(0, 15);
  }, [sisSearch, dbUsers, sampleStudents]);

  const handleParentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = dbUsers.find(u => u.id.trim() === parentSearchId.trim() && u.role === "student");
    if (found) {
      setParentStudentMatch(found);
      triggerToast(`تم استرداد سجل الطالب لولي الأمر: ${found.nameAr}`);
    } else {
      triggerToast("عذراً، لم يتم العثور على رمز جامعي مطابق بالكنترول الأكاديمي.");
    }
  };

  const handleSendParentSms = () => {
    if (!parentStudentMatch) return;
    triggerToast(`تم بث رسالة SMS حرجة لهاتف والد الطالب: ${parentStudentMatch.nameAr} لإخطاره بالنتائج وتقرير السلوك.`);
  };


  // ==========================================
  // MODULE 2: LMS (LEARNING MANAGEMENT SYSTEM)
  // ==========================================
  const initialLectures = [
    { id: "L1", code: "SWE311", title: "تطوير تطبيقات الويب الحديثة بـ React", instructor: "د. شريف علوان", day: "الاثنين", time: "09:00 - 11:30", type: "Virtual Teams" },
    { id: "L2", code: "AI302", title: "الشبكات العصبية العميقة والتدريب العملي", instructor: "م. رانية السعدني", day: "الثلاثاء", time: "12:00 - 14:00", type: "Hybrid Hall 5" },
    { id: "L3", code: "DB301", title: "أنظمة قواعد البيانات وعلاقات الفهرسة SQL", instructor: "د. هدى محمود غانم", day: "الأربعاء", time: "08:30 - 10:00", type: "Amphitheater A" },
  ];
  const [lectures, setLectures] = useState(initialLectures);
  const [newLmsLectCode, setNewLmsLectCode] = useState("FCIS401");
  const [newLmsLectTitle, setNewLmsLectTitle] = useState("");
  const [newLmsLectTime, setNewLmsLectTime] = useState("10:00 - 12:00");
  const [newLmsLectDay, setNewLmsLectDay] = useState("الأحد");

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLmsLectTitle.trim()) return;
    const item = {
      id: `L${Date.now()}`,
      code: newLmsLectCode,
      title: newLmsLectTitle,
      instructor: "مدرس زائر / د. يوسف خالد",
      day: newLmsLectDay,
      time: newLmsLectTime,
      type: "Virtual Classroom"
    };
    setLectures([...lectures, item]);
    setNewLmsLectTitle("");
    triggerToast("تم جدولة المحاضرة الافتراضية بنظام LMS وإبلاغ الطلبة تلقائياً!");
  };

  const [erpLang, setErpLang] = useState<"ar" | "en">("ar");

  // Phase 5: Expanded LMS States
  const [selectedLmsCourse, setSelectedLmsCourse] = useState("SWE311");
  const [activeCourseTab, setActiveCourseTab] = useState<"desc" | "prof" | "content" | "assignments" | "exams" | "grades" | "announcements">("desc");

  // Initial rich course database
  const [lmsCoursesData, setLmsCoursesData] = useState<Record<string, {
    nameAr: string;
    nameEn: string;
    descAr: string;
    descEn: string;
    instructorAr: string;
    instructorEn: string;
    instructorOfficeAr: string;
    instructorOfficeEn: string;
    files: Array<{ name: string; size: string; type: string }>;
    videos: Array<{ title: string; duration: string; url: string }>;
    assignments: Array<{ id: string; titleAr: string; titleEn: string; due: string; status: "pending" | "submitted"; grade: string; feedback: string }>;
    exams: Array<{
      id: string;
      titleAr: string;
      titleEn: string;
      questions: Array<{ qAr: string; qEn: string; optionsAr: string[]; optionsEn: string[]; correct: number }>;
      submitted: boolean;
      grade: string | null;
    }>;
    grades: Array<{ itemAr: string; itemEn: string; grade: string }>;
    announcements: Array<{ textAr: string; textEn: string; date: string }>;
    progress: number;
  }>>({
    SWE311: {
      nameAr: "هندسة الويب وتطبيقاته الذكية",
      nameEn: "Web Engineering & Smart Applications",
      descAr: "دراسة شاملة لهندسة برمجيات الويب الحديثة، ومحاكاة الربط السحابي، وبناء واجهات تفاعلية متجاوبة باستخدام React ومكتبات Tailwind.",
      descEn: "Comprehensive study of modern web engineering, cloud API integration, and building highly interactive responsive interfaces using React and Tailwind CSS.",
      instructorAr: "د. شريف علوان",
      instructorEn: "Dr. Sherif Alwan",
      instructorOfficeAr: "الأحد والثلاثاء (10:00 - 12:00) بمبنى الحاسبات مكتب 204",
      instructorOfficeEn: "Sun & Tue (10:00 - 12:00) at FCIS Building, Office 204",
      files: [
        { name: "Syllabus_SWE311_Spring_2026.pdf", size: "1.4 MB", type: "Syllabus" },
        { name: "Lecture_01_Architecture_of_Web.pdf", size: "2.1 MB", type: "Lecture Notes" },
        { name: "Lab_01_Vite_Setup_And_CSS.pdf", size: "940 KB", type: "Lab Guide" }
      ],
      videos: [
        { title: "مقدمة في هندسة الويب الحديثة وتأسيس الحاويات", duration: "12:45", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ],
      assignments: [
        { id: "as-swe-1", titleAr: "تصميم واجهة لوحة تحكم الأكاديميين الموحدة SGU", titleEn: "Design SGU Academic Dashboard Interface", due: "2026-06-30", status: "pending", grade: "N/A", feedback: "بانتظار التسليم والمراجعة الأكاديمية." }
      ],
      exams: [
        {
          id: "ex-swe-1",
          titleAr: "الاختبار القصير الأول: أساسيات معمارية الويب",
          titleEn: "Quiz 1: Fundamentals of Web Architecture",
          questions: [
            {
              qAr: "ما هي دالة ربط المكونات (Hook) المخصصة للتعامل مع الآثار الجانبية في React؟",
              qEn: "Which React hook is used for handling side effects?",
              optionsAr: ["useState", "useEffect", "useMemo", "useContext"],
              optionsEn: ["useState", "useEffect", "useMemo", "useContext"],
              correct: 1
            },
            {
              qAr: "أي بروتوكول يُستخدم لنقل البيانات الآمن والمشفر بين المتصفح والخادم؟",
              qEn: "Which protocol is used for secure encrypted data transmission between client and server?",
              optionsAr: ["HTTP", "FTP", "HTTPS", "SMTP"],
              optionsEn: ["HTTP", "FTP", "HTTPS", "SMTP"],
              correct: 2
            }
          ],
          submitted: false,
          grade: null
        }
      ],
      grades: [
        { itemAr: "الحضور والتفاعل النشط", itemEn: "Attendance & Active Participation", grade: "10 / 10" },
        { itemAr: "الواجب العملي الأول React", itemEn: "Assignment 1: React Basics", grade: "15 / 15" }
      ],
      announcements: [
        { textAr: "أعزائي الطلاب، يرجى تجهيز بيئة العمل وتثبيت Node.js v20 استعداداً للمشروع الفصلي.", textEn: "Dear students, please setup your local environment with Node.js v20 for the term project.", date: "2026-06-05" }
      ],
      progress: 65
    },
    AI302: {
      nameAr: "الذكاء الاصطناعي التطبيقي",
      nameEn: "Applied Artificial Intelligence",
      descAr: "نمذجة وفهم خوارزميات الذكاء الاصطناعي، والتعامل مع المكتبات المتقدمة مثل PyTorch لتدريب الشبكات العصبية العميقة.",
      descEn: "Modeling and understanding artificial intelligence algorithms, handling advanced libraries like PyTorch to train deep neural networks.",
      instructorAr: "م. رانية السعدني",
      instructorEn: "Eng. Rania El-Saadany",
      instructorOfficeAr: "الاثنين والأربعاء (12:00 - 14:00) بمبنى الذكاء الاصطناعي مكتب 102",
      instructorOfficeEn: "Mon & Wed (12:00 - 14:00) at AI Building, Office 102",
      files: [
        { name: "Syllabus_AI302_Applied_Intelligence.pdf", size: "2.8 MB", type: "Syllabus" },
        { name: "Lecture_02_Deep_Learning_Intro.pdf", size: "3.5 MB", type: "Lecture Notes" }
      ],
      videos: [
        { title: "مقدمة في التعلم العميق والشبكات العصبية الالتفافية CNN", duration: "18:20", url: "https://www.w3schools.com/html/movie.mp4" }
      ],
      assignments: [
        { id: "as-ai-1", titleAr: "تدريب مصنف صور بسيط باستعمال PyTorch", titleEn: "Train a simple image classifier using PyTorch", due: "2026-06-20", status: "submitted", grade: "9.5 / 10", feedback: "تفكير رائع ودقة تنبؤ عالية في مصنف الصور، عمل ممتاز!" }
      ],
      exams: [
        {
          id: "ex-ai-1",
          titleAr: "الاختبار النصفي: الشبكات العصبية العميقة والتحسين",
          titleEn: "Midterm Exam: Deep Neural Networks & Optimization",
          questions: [
            {
              qAr: "ما هي دالة التنشيط (Activation Function) الأكثر شيوعاً لحل مشكلة تلاشي التدرجات؟",
              qEn: "Which activation function is most commonly used to mitigate the vanishing gradient problem?",
              optionsAr: ["Sigmoid", "ReLU", "Tanh", "Linear"],
              optionsEn: ["Sigmoid", "ReLU", "Tanh", "Linear"],
              correct: 1
            }
          ],
          submitted: false,
          grade: null
        }
      ],
      grades: [
        { itemAr: "الواجب العملي الأول PyTorch", itemEn: "Assignment 1: PyTorch training", grade: "9.5 / 10" }
      ],
      announcements: [
        { textAr: "تم تمديد تسليم الواجب الأول لمدة يومين بناءً على رغبة الزملاء.", textEn: "Assignment 1 deadline extended by 2 days upon student request.", date: "2026-06-18" }
      ],
      progress: 45
    },
    DB301: {
      nameAr: "أنظمة قواعد البيانات وعلاقات الفهرسة SQL",
      nameEn: "Database Systems & Indexing Relations",
      descAr: "تصميم المخططات العلائقية وكتابة استعلامات SQL المعقدة وتوثيق هياكل الفهرسة المتقدمة لحفظ البيانات واسترجاعها بكفاءة عالية.",
      descEn: "Designing relational schemas, writing complex SQL queries, and documenting advanced indexing structures for high-performance data storage and retrieval.",
      instructorAr: "د. هدى محمود غانم",
      instructorEn: "Dr. Hoda Mahmoud Ghanem",
      instructorOfficeAr: "الخميس (09:00 - 13:00) بمكتب معمل قواعد البيانات المتقدمة 301",
      instructorOfficeEn: "Thursday (09:00 - 13:00) at Advanced Database Lab, Office 301",
      files: [
        { name: "Syllabus_DB301_Relational_Databases.pdf", size: "1.2 MB", type: "Syllabus" },
        { name: "Lecture_03_Normal_Forms_Indexing.pdf", size: "1.9 MB", type: "Lecture Notes" }
      ],
      videos: [],
      assignments: [
        { id: "as-db-1", titleAr: "تصميم مخطط الكيانات والعلاقات (ERD) لنظام ERP جامعي", titleEn: "Design Entity-Relationship Diagram (ERD) for a University ERP", due: "2026-06-25", status: "submitted", grade: "10 / 10", feedback: "تصميم ممتاز ومراعاة جميع العلاقات المتشعبة والأطراف بنجاح." }
      ],
      exams: [],
      grades: [
        { itemAr: "تصميم مخطط ERD للمستشفى الجامعي", itemEn: "Hospital ERD Schema Design", grade: "10 / 10" }
      ],
      announcements: [],
      progress: 80
    }
  });

  const lmsAssignments = [
    { id: "as1", code: "DB301", title: "تصميم مخطط الكيانات والعلاقات (ERD)", due: "2026-06-25", status: "submitted", grade: "10/10", feedback: "تصميم نموذج متكامل يشمل العلاقات المتشعبة بنجاح." },
    { id: "as2", code: "SWE311", title: "تطوير لوحة تحكم ذكية للأكاديميين", due: "2026-06-30", status: "pending", grade: "N/A", feedback: "بانتظار التسليم والمراجعة." },
    { id: "as3", code: "AI302", title: "تدريب مصنف صور بسيط باستعمال PyTorch", due: "2026-06-20", status: "submitted", grade: "9.5/10", feedback: "تفكير رائع ودقة تنبؤ عالية في المصنف." }
  ];

  // Question Bank
  const [questionBank, setQuestionBank] = useState([
    { id: "qb1", course: "SWE311", qAr: "ما هو معيار الاتصال الخفيف والمفضل لتصميم الـ API؟", qEn: "What is the lightweight standard for API design?", answer: "REST / JSON" },
    { id: "qb2", course: "AI302", qAr: "أي من الخوارزميات التالية تُستخدم لتصنيف البيانات غير الخاضعة للإشراف؟", qEn: "Which of the following is an unsupervised learning algorithm?", answer: "K-Means Clustering" },
    { id: "qb3", course: "DB301", qAr: "ما هو المفتاح الذي يُستخدم لربط جدول بجدول آخر في بيئة SQL العلائقية؟", qEn: "What is the key used to link one table to another in a relational SQL environment?", answer: "Foreign Key (المفتاح الأجنبي)" }
  ]);

  // Forms for LMS
  const [newFileForm, setNewFileForm] = useState({ name: "", type: "Lecture Notes", size: "1.5 MB" });
  const [newVideoForm, setNewVideoForm] = useState({ title: "", duration: "10:00", url: "https://www.w3schools.com/html/mov_bbb.mp4" });
  const [newAssignmentForm, setNewAssignmentForm] = useState({ titleAr: "", titleEn: "", due: "2026-07-15" });
  const [newAnnouncementForm, setNewAnnouncementForm] = useState({ textAr: "", textEn: "" });
  const [newExamForm, setNewExamForm] = useState({
    titleAr: "",
    titleEn: "",
    qAr: "",
    qEn: "",
    optAr0: "",
    optAr1: "",
    optAr2: "",
    optAr3: "",
    optEn0: "",
    optEn1: "",
    optEn2: "",
    optEn3: "",
    correct: 0
  });

  // Quiz active exam taking state
  const [activeQuizExam, setActiveQuizExam] = useState<any | null>(null);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState<Record<number, number>>({});

  // Question bank creator form
  const [newQbForm, setNewQbForm] = useState({ course: "SWE311", qAr: "", qEn: "", answer: "" });

  // Phase 6 States

  // 6.1 Library additional states
  const [borrowedBooks, setBorrowedBooks] = useState<Array<{ id: string; title: string; author: string; borrowDate: string; dueDate: string; fine: number }>>([
    { id: "b2", title: "مقدمة في الجداول وخوارزميات البحث السريع", author: "Thomas H. Cormen", borrowDate: "2026-06-01", dueDate: "2026-06-15", fine: 250 }
  ]);
  const [newBookForm, setNewBookForm] = useState({ title: "", author: "", category: "علوم الحاسب", copies: 5, location: "رف D-12" });

  // 6.2 Finance additional states
  const [financeInvoices, setFinanceInvoices] = useState([
    { id: "INV-2026-001", descriptionAr: "المصروفات الدراسية للفصل الدراسي الثاني", descriptionEn: "Academic Tuition Fees - Term 2", amount: 25000, paidAmount: 25000, status: "paid", dueDate: "2026-03-15", datePaid: "2026-03-12" },
    { id: "INV-2026-002", descriptionAr: "رسوم معمل حوسبة الذكاء الاصطناعي وبحوث النانو", descriptionEn: "AI Computing Lab & Nano Research Fees", amount: 4500, paidAmount: 0, status: "unpaid", dueDate: "2026-07-20", datePaid: "N/A" },
    { id: "INV-2026-003", descriptionAr: "اشتراك سكن الطلاب المتميز - مبنى (أ) السنوي", descriptionEn: "Premium Student Dormitory Subscription - Building A Annual", amount: 15000, paidAmount: 5000, status: "partial", dueDate: "2026-06-30", datePaid: "2026-06-25" }
  ]);
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<any | null>(null);
  const [creditCardForm, setCreditCardForm] = useState({ cardholder: "يوسف خالد الكردي", number: "4000 1234 5678 9010", expiry: "12/29", cvv: "382" });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeInstallmentPlan, setActiveInstallmentPlan] = useState<Record<string, Array<{ id: string; term: string; amount: number; status: "paid" | "unpaid"; due: string }>>>({
    "INV-2026-003": [
      { id: "inst-1", term: "القسط الأول - خريف 2025", amount: 5000, status: "paid", due: "2025-10-15" },
      { id: "inst-2", term: "القسط الثاني - ربيع 2026", amount: 5000, status: "unpaid", due: "2026-06-30" },
      { id: "inst-3", term: "القسط الثالث - صيف 2026", amount: 5000, status: "unpaid", due: "2026-09-15" }
    ]
  });

  // 6.3 Hostel (Dorm) additional states
  const [housingRequests, setHousingRequests] = useState([
    { id: "req-1", studentId: "2026SGU-ST-0001", studentName: "عبد الله أحمد محمد", roomType: "فردية متميزة Single", building: "المبنى الفاخر المغتربين (أ)", notes: "أسباب طبية تتطلب الهدوء والتهوية الخاصة", status: "pending", date: "2026-06-19" },
    { id: "req-2", studentId: "2026SGU-ST-0003", studentName: "كريم البحيري غالي", roomType: "ثنائية مشتركة Shared", building: "المبنى الاقتصادي المنظم (ب)", notes: "رغبة في مشاركة السكن لتقليل النفقات", status: "approved", date: "2026-06-15" }
  ]);
  const [newHousingRequestForm, setNewHousingRequestForm] = useState({ roomType: "فردية متميزة Single", building: "المبنى الفاخر المغتربين (أ)", notes: "" });
  const [newDormRoomForm, setNewDormRoomForm] = useState({ buildingName: "المبنى الفاخر المغتربين (أ)", roomNo: "105", beds: "سرير مستقل", price: 1200, capacity: 2 });

  // 6.4 Transportation additional states
  const [transportRoutes, setTransportRoutes] = useState([
    { id: "tr1", routeAr: "خط القاهرة (مدينة نصر - مصر الجديدة) إلى مقر الجامعة الرئيسي", routeEn: "Cairo Line (Nasr City - Heliopolis) to SGU Campus", driver: "أبو حجر الشناوي", phone: "01034567812", plate: "ر س ج 9034", seats: 45, reserved: 22, departure: "07:00 AM", returnTime: "04:30 PM" },
    { id: "tr2", routeAr: "خط الزقازيق (ميدان الصاغة - الجامعة) إلى مقر الجامعة الرئيسي", routeEn: "Zagazig Line (Al-Saghah - University) to SGU Campus", driver: "مصطفى البحراوي", phone: "01239845722", plate: "ط ن د 1238", seats: 28, reserved: 28, departure: "07:30 AM", returnTime: "04:30 PM" },
    { id: "tr3", routeAr: "خط بلبيس والعاشر من رمضان إلى مقر الجامعة الرئيسي", routeEn: "Bilbeis & 10th of Ramadan Line to SGU Campus", driver: "عاطف الجبالي", phone: "01511223344", plate: "ن د ب 4412", seats: 30, reserved: 15, departure: "08:00 AM", returnTime: "04:30 PM" }
  ]);
  const [studentReservedRouteId, setStudentReservedRouteId] = useState<string | null>(null);



  // ==========================================
  // MODULE 3: ERP (ENTERPRISE RESOURCE PLANNING)
  // ==========================================
  const [devApiVisible, setDevApiVisible] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://ministry.of.education.gov.eg/sgu/v1/sync");
  const [developerLang, setDeveloperLang] = useState<"curl" | "python" | "node">("curl");
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);
  const [loadingWebhook, setLoadingWebhook] = useState(false);

  const fetchSnippets = {
    curl: `curl -X POST "${webhookUrl}" \\\n  -H "Authorization: Bearer sgu_live_tok_9fc218bfa" \\\n  -H "Content-Type: application/json" \\\n  -d '{"student_id": "${selectedSisStudentId || "2026SGU-ST-0000"}", "sync_action": "gpa_audit"}'`,
    python: `import requests\n\nurl = "${webhookUrl}"\nheaders = {\n    "Authorization": "Bearer sgu_live_tok_9fc218bfa",\n    "Content-Type": "application/json"\n}\ndata = {\n    "student_id": "${selectedSisStudentId || "2026SGU-ST-0000"}",\n    "sync_action": "gpa_audit"\n}\n\nresponse = requests.post(url, json=data, headers=headers)\nprint(response.status_code)`,
    node: `const axios = require('axios');\n\nasync function syncGpa() {\n  const res = await axios.post('${webhookUrl}', {\n    student_id: '${selectedSisStudentId || "2026SGU-ST-0000"}',\n    sync_action: 'gpa_audit'\n  }, {\n    headers: { Authorization: 'Bearer sgu_live_tok_9fc218bfa' }\n  });\n  console.log(res.data);\n}`
  };

  const handleTriggerWebhookSimulation = () => {
    setLoadingWebhook(true);
    setWebhookLogs(prev => [`[${new Date().toLocaleTimeString()}] 🚀 صياغة حزمة المخطط الأكاديمي المشفرة...`, ...prev]);
    
    setTimeout(() => {
      setLoadingWebhook(false);
      const studentName = activeSisStudent ? activeSisStudent.nameAr : "يوسف الكردي";
      const studentGpa = activeSisStudent ? activeSisStudent.gpaOrSalary : "3.81";
      const jsonStr = JSON.stringify({
        status: "success",
        event: "sgu_academic_grades_synced",
        server_ip: "197.45.18.29",
        data: {
          uid: selectedSisStudentId,
          nameAr: studentName,
          gpa: studentGpa,
          timestamp: Date.now()
        }
      }, null, 2);
      setWebhookLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✅ استجابة بوابة التحول الرقمي للوزارة: 200 OK\n${jsonStr}`,
        ...prev
      ]);
      triggerToast("تم استلام إثبات المزامنة الفيدرالية للوزارة بنجاح!");
    }, 1200);
  };


  // ==========================================
  // MODULE 4: HR (HUMAN RESOURCES)
  // ==========================================
  const [hrSearch, setHrSearch] = useState("");
  const [teachingApplicationReview, setTeachingApplicationReview] = useState([
    { id: "AP-101", candidate: "أ. منى زكريا سليمان", degree: "ماجستير حوسبة سحابية", position: "معيد متعاقد", status: "pending", college: "fcis" },
    { id: "AP-102", candidate: "د. هلال البحيري منصور", degree: "دكتوراه طب باطني", position: "مدرس سريري مساعد", status: "approved", college: "med" },
    { id: "AP-103", candidate: "أ. كريم الجندي الفيومي", degree: "بكالوريوس طب أسنان", position: "طبيب تدريب عملي", status: "pending", college: "den" }
  ]);

  const filteredStaffList = useMemo(() => {
    if (!hrSearch.trim()) return filterStaff;
    return dbUsers.filter(
      u =>
        (u.role === "faculty" || u.role === "ta" || u.role === "admin" || u.role === "finance_officer") &&
        (u.nameAr.includes(hrSearch) || u.id.toLowerCase().includes(hrSearch.toLowerCase()))
    ).slice(0, 15);
  }, [hrSearch, dbUsers, filterStaff]);

  const handleUpdateApplicationStatus = (id: string, decision: "approved" | "rejected") => {
    setTeachingApplicationReview(prev =>
      prev.map(app => (app.id === id ? { ...app, status: decision } : app))
    );
    triggerToast(decision === "approved" ? "تم قبول طلب المعيد ونقل الملف للعقود والمالية" : "تم رفض الطلب وحفظه بالأرشيف");
  };


  // ==========================================
  // MODULE 5: FINANCE & TREASURY
  // ==========================================
  const tuitionItems = [
    { id: "f1", description: "المصروفات الدراسية الأساسية - الفصل الثاني", amount: "12,500 ج.م", dueDate: "2026-03-31", paid: true, date: "2026-03-12" },
    { id: "f2", description: "اشتراك السكن الجامعي الممتاز - مبنى (أ)", amount: "3,600 ج.م", dueDate: "2026-06-30", paid: false, date: "N/A" },
    { id: "f3", description: "رسوم معمل كيمياء وبحوث النانوتكنولوجي", amount: "1,200 ج.م", dueDate: "2026-06-20", paid: true, date: "2026-06-11" },
  ];

  const [calcHighschool, setCalcHighschool] = useState<number>(94);
  const [calcGpa, setCalcGpa] = useState<number>(3.85);
  const [calculatedResult, setCalculatedResult] = useState<string | null>(null);

  // Meta Whatsapp Integration
  const [whatsappTo, setWhatsappTo] = useState("01123456789");
  const [whatsappStudentName, setWhatsappStudentName] = useState("يونس أحمد كمال");
  const [whatsappAmount, setWhatsappAmount] = useState("18,500 EGP");
  const [whatsappResult, setWhatsappResult] = useState<any>(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  const calculateScholarshipEligibility = () => {
    if (calcHighschool >= 97 || calcGpa >= 3.9) {
      setCalculatedResult("مؤهل لمنحة كاملة (100%): منحة نوابغ الصالحية الرئاسية مع سكن مجاني شامل.");
    } else if (calcHighschool >= 92 || calcGpa >= 3.65) {
      setCalculatedResult("مؤهل لمنحة التفوق والأمناء (50%): خصم 50% من الرسوم الأساسية السنوية.");
    } else if (calcHighschool >= 85 || calcGpa >= 3.20) {
      setCalculatedResult("مؤهل منحة الموهبة الرياضية والتكافؤ (25%): خصم ربع سنوي تقديراً للتألق.");
    } else {
      setCalculatedResult("المعدل أو السجل الحالي غير كافٍ لاستحقاق المنح. ننصح بطلب التماس تمويل مالي اجتماعي.");
    }
  };

  const handleSendWhatsappDues = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappLoading(true);
    setWhatsappResult(null);

    setTimeout(() => {
      setWhatsappLoading(false);
      const mockResult = {
        status: "success",
        provider: "Meta WhatsApp Cloud API Gateway",
        messageId: "wamid.sgu_fallback_" + Math.floor(1000000 + Math.random() * 9000000),
        timestamp: Date.now(),
        payload: {
          recipient: "+2" + whatsappTo,
          template: "sgu_outstanding_dues_alert",
          parameters: [whatsappStudentName, whatsappAmount]
        }
      };
      setWhatsappResult(mockResult);
      triggerToast("تم بث رسالة التنبيه بالمديونية لـ Meta Cloud WhatsApp API!");
    }, 1000);
  };


  // ==========================================
  // MODULE 6: RESEARCH PORTAL & PUBLICATIONS
  // ==========================================
  const researchPapers = [
    { title: "علاجات النانو الفعالة بمستخلصات الصيدلة الخضراء", author: "د. يسرا رشاد سليمان", field: "الطب والصيدلة", journal: "Egyptian Clinical Reviews", impact: "4.82", rank: "Q1" },
    { title: "مصنفات الـ Transformers لفك شفرات الهوية اللاسلكية", author: "أ.د. يوسف خالد الكردي", field: "الحاسبات والذكاء الاصطناعي", journal: "IEEE Smart Systems", impact: "6.12", rank: "Q1" },
    { title: "تحليل الأحمال الهيكلية للمباني الخرسانية بالصالحية الجديدة", author: "د. طارق هلال شاهين", field: "الهندسة وتصميم المدن", journal: "Journal of Urban Planning", impact: "2.14", rank: "Q2" },
  ];

  const [researchTitle, setResearchTitle] = useState("");
  const [researchFund, setResearchFund] = useState("50,000");
  const [researchLogs, setResearchLogs] = useState<string[]>([]);

  const handleGrantFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchTitle.trim()) return;
    const logMsg = `[${new Date().toLocaleTimeString()}] 💰 تمت التوصية بالموافقة على تمويل مقترح البحث: "${researchTitle}" بقيمة ${researchFund} ج.م وتمويله من موازنة البحث الأكاديمي لعام 2026.`;
    setResearchLogs(prev => [logMsg, ...prev]);
    setResearchTitle("");
    triggerToast("تم تسجيل وحجز رصيد تمويل البحث الأكاديمي!");
  };


  // ==========================================
  // MODULE 7: LIBRARY (CENTRAL ARCHIVE)
  // ==========================================
  const initialBooks = [
    { id: "b1", title: "الذكاء الاصطناعي: مقاربة حديثة (A Modern Approach)", author: "Stuart Russell & Peter Norvig", category: "الذكاء الاصطناعي", copies: 8, location: "رف A-12" },
    { id: "b2", title: "مقدمة في الجداول وخوارزميات البحث السريع", author: "Thomas H. Cormen", category: "علوم الحاسب", copies: 3, location: "رف B-5" },
    { id: "b3", title: "أسس هندسة البرمجيات المتقدمة (Software Engineering)", author: "Ian Sommerville", category: "هندسة البرمجيات", copies: 5, location: "رف A-15" },
    { id: "b4", title: "تطوير تطبيقات الويب السريعة باستعمال المفاعلات React", author: "د. يوسف الشناوي", category: "برمجة الويب", copies: 4, location: "رف C-01" },
  ];
  const [libraryBooks, setLibraryBooks] = useState(initialBooks);
  const [bookSearch, setBookSearch] = useState("");

  const filteredLibraryBooks = useMemo(() => {
    if (!bookSearch.trim()) return libraryBooks;
    return libraryBooks.filter(
      b => b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase())
    );
  }, [bookSearch, libraryBooks]);

  const handleBorrowBook = (id: string) => {
    setLibraryBooks(prev =>
      prev.map(b => (b.id === id && b.copies > 0 ? { ...b, copies: b.copies - 1 } : b))
    );
    triggerToast("تهانينا! تم حجز النسخة بنجاح، يرجى الاستلام من أمين المكتبة خلال 48 ساعة.");
  };

  const handleRenewBook = (id: string) => {
    triggerToast("تم تمديد فترة استعارة الكتاب لـ 14 يوماً إضافية بلا غرامات.");
  };


  // ==========================================
  // MODULE 8: DORMITORY (HOUSING REGISTRY)
  // ==========================================
  const initialDorms = [
    { id: "d1", buildingName: "المبنى الفاخر المغتربين (أ)", roomNo: "101", beds: "سرير (أ)", price: 1200, occupied: 1, capacity: 2, status: "available" },
    { id: "d2", buildingName: "المبنى الفاخر المغتربين (أ)", roomNo: "102", beds: "سرير (ب)", price: 1200, occupied: 2, capacity: 2, status: "full" },
    { id: "d3", buildingName: "المبنى الاقتصادي المنظم (ب)", roomNo: "305", beds: "سرير (أ)", price: 600, occupied: 2, capacity: 4, status: "available" },
    { id: "d4", buildingName: "مبنى كبار الشخصيات والشراكات (ج)", roomNo: "401", beds: "جناح فردي مستقل", price: 2000, occupied: 0, capacity: 1, status: "available" },
  ];
  const [dormList, setDormList] = useState(initialDorms);
  const [inputResidentStudentId, setInputResidentStudentId] = useState("");
  const [inputResidentRoom, setInputResidentRoom] = useState("101");
  const [housingLogs, setHousingLogs] = useState<string[]>([]);

  const handleAssignResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputResidentStudentId.trim()) return;
    const matchingStudent = dbUsers.find(u => u.id === inputResidentStudentId && u.role === "student");
    if (!matchingStudent) {
      triggerToast("خطأ: لم يتم رصد طالب مسجل بالمعرف المدخل!");
      return;
    }

    setDormList(prev =>
      prev.map(d =>
        d.roomNo === inputResidentRoom && d.occupied < d.capacity
          ? { ...d, occupied: d.occupied + 1, status: d.occupied + 1 === d.capacity ? "full" : "available" }
          : d
      )
    );

    const logMsg = `[${new Date().toLocaleTimeString()}] 🏢 تسكين ناجح: الطالب ${matchingStudent.nameAr} (${matchingStudent.id}) بالغرفة ${inputResidentRoom}.`;
    setHousingLogs(prev => [logMsg, ...prev]);
    setInputResidentStudentId("");
    triggerToast("تم تخصيص السكن الجامعي وإرسال الكود الأمني للطالب!");
  };


  // ==========================================
  // MODULE 9: TRANSPORTATION & GPS BUS FLEET
  // ==========================================
  const [busDriving, setBusDriving] = useState(false);
  const [busProgress, setBusProgress] = useState(15);
  const [busSpeed, setBusSpeed] = useState(0);
  const [busTelemetry, setBusTelemetry] = useState<string[]>([]);

  useEffect(() => {
    let timer: any = null;
    if (busDriving) {
      setBusSpeed(68);
      timer = setInterval(() => {
        setBusProgress(prev => {
          if (prev >= 98) {
            setBusDriving(false);
            setBusSpeed(0);
            setBusTelemetry(t => [
              `[${new Date().toLocaleTimeString()}] 🏢 وصل أتوبيس SGU بنجاح وبأمان إلى محطة الحرم بالصالحية!`,
              ...t
            ]);
            triggerToast("وصل أسطول باصات الطلاب بسلام للحرم العسكري بالصالحية!");
            return 100;
          }
          const increment = Math.floor(Math.random() * 5) + 3;
          const currentSpeed = 60 + Math.floor(Math.random() * 20);
          setBusSpeed(currentSpeed);
          
          let alertTrigger = "";
          if (currentSpeed > 78) {
            alertTrigger = " ⚠️ تحذير: تجاوز حد الأمان اللطيف 80 كم/س!";
          }

          setBusTelemetry(t => [
            `[${new Date().toLocaleTimeString()}] حافلة خط القاهرة الكبرى - الصالحية: الإحداثيات ${prev + increment}% - سرعة الحافلة الحالية: ${currentSpeed} كم/س.${alertTrigger}`,
            ...t
          ]);
          return prev + increment;
        });
      }, 1500);
    } else {
      setBusSpeed(0);
    }
    return () => clearInterval(timer);
  }, [busDriving]);

  const toggleBusEngine = () => {
    if (busProgress >= 100) {
      setBusProgress(10);
    }
    setBusDriving(!busDriving);
    setBusTelemetry(t => [
      `[${new Date().toLocaleTimeString()}] تشغيل المحرك والارتباط السلكي بأقمار GPS الوطنية: خط القاهرة - الصالحية`,
      ...t
    ]);
  };


  // ==========================================
  // MODULE 10: ALUMNI (GRADUATE NETWORK)
  // ==========================================
  const alumniCohorts = [
    { year: 2023, count: 1204, employed: 94.2, avgSalary: 18000 },
    { year: 2024, count: 1450, employed: 96.1, avgSalary: 22000 },
    { year: 2025, count: 1820, employed: 97.5, avgSalary: 26500 },
    { year: 2026, count: 2105, employed: 98.2, avgSalary: 31000 },
  ];

  const [alumniMembers, setAlumniMembers] = useState([
    { id: "ALUM-2201", name: "م. كريم طارق فهمي", year: 2024, company: "Valeo Automotive Egypt", title: "Senior AI Deep Learning Engineer" },
    { id: "ALUM-2202", name: "أ. شيماء رأفت النجار", year: 2023, company: "مستشفى القصر العيني", title: "مقيم رعاية مركزية أطفال" },
    { id: "ALUM-2203", name: "م. محمد كمال الشافي", year: 2025, company: "Instabug Solutions", title: "Senior Full Stack Dev" },
  ]);

  const [alumRegisterName, setAlumRegisterName] = useState("");
  const [alumRegisterCompany, setAlumRegisterCompany] = useState("");
  const [alumRegisterTitle, setAlumRegisterTitle] = useState("");
  const [alumRegisterYear, setAlumRegisterYear] = useState(2025);

  const handleRegisterAlumnus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumRegisterName.trim()) return;
    const newItem = {
      id: `ALUM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: alumRegisterName,
      year: alumRegisterYear,
      company: alumRegisterCompany || "مجموعة شركات الصالحية المعتمدة",
      title: alumRegisterTitle || "مهني وأخصائي تطبيقي"
    };
    setAlumniMembers([newItem, ...alumniMembers]);
    setAlumRegisterName("");
    setAlumRegisterCompany("");
    setAlumRegisterTitle("");
    triggerToast("تم وتوثيق تسجيل الخريج الجديد برابطة SGU الدائمة!");
  };


  // ==========================================
  // MODULE 11: SGU AI ASSISTANT (CHAT SUITE)
  // ==========================================
  const [ysfModelType, setYsfModelType] = useState<"gemini" | "chatgpt" | "claude">("gemini");
  const [ysfChatHistory, setYsfChatHistory] = useState<any[]>([
    {
      role: "model",
      text: "مرحباً بك يا يوسف! أنا دليل الذكاء الاصطناعي الأكاديمي المتكامل لجامعة SGU.\nلقد دمجت قدرات نماذج ذكية رائدة لتقديم أرقى خدمات الرشد الأكاديمي والمهني:\n\n1. 🔮 **جوجل جيميناي (Gemini 2.5)** - فائق السرعة للتوجيه والإحصاء الدراسي ومراجعة اللوائح.\n2. 🤖 **أوبن إيه آي شات جي بي تي (ChatGPT 4o)** - فائق الجودة في صياغة الأكواد وخطط الدراسة والتعديل السريع.\n3. 🧠 **أنثروبيك كلود (Claude 3.5 Sonnet)** - ذو بصيرة فلسفية عميقة ومنطق برمجي وأمان وتفقد أداء الطلاب.\n\nاختر المحرك المناسب من الأعلى وابدأ طرح تساؤلك!"
    }
  ]);
  const [ysfChatInput, setYsfChatInput] = useState("");
  const [ysfChatLoading, setYsfChatLoading] = useState(false);

  const handleSendYsfChat = async (presetText?: string) => {
    const textQuery = presetText || ysfChatInput;
    if (!textQuery.trim() || ysfChatLoading) return;

    const userMsg = { role: "user", text: textQuery };
    setYsfChatHistory(prev => [...prev, userMsg]);
    if (!presetText) setYsfChatInput("");
    setYsfChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textQuery,
          modelType: ysfModelType,
          history: ysfChatHistory.map(ch => ({ role: ch.role, text: ch.text }))
        })
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setYsfChatHistory(prev => [...prev, { role: "model", text: data.text }]);
    } catch {
      // Offline simulation response fallback
      let responseText = "";
      if (ysfModelType === "chatgpt") {
        responseText = `🤖 [محاكي ChatGPT 4o الأكاديمي]: بخصوص تساؤلك حول "${textQuery}".. يُنصح بتصميم كود هيكلي سليم مع مراعاة فهارس العلاقات وصقل المخرجات للحصول على أداء لائق ومثقل بالتفاصيل.`;
      } else if (ysfModelType === "claude") {
        responseText = `🧠 [محاكي Claude 3.5 Sonnet - التدقيق الأمني]: رصدت طلبك لـ "${textQuery}". منطقياً، ينبغي التحقق أمنياً من مصادقة المستخدم وتجنب الثغرات المحتملة في التبادل الخارجي للمخدم.`;
      } else {
        responseText = `✨ [محاكي Gemini 2.5 الأكاديمي]: للإجابة على "${textQuery}"، ننصحك بمراجعة جدول الساعات المعتمدة لكليتك أو التصفح السليم لقنوات الدفع ومراجعة معدل GPA بالـ ERP الموحد.`;
      }
      setYsfChatHistory(prev => [...prev, { role: "model", text: responseText, isSandbox: true }]);
    } finally {
      setYsfChatLoading(false);
    }
  };


  // ==========================================
  // MODULE 12: QUALITY ASSURANCE (QA & AUDIT)
  // ==========================================
  // ==========================================
  // MODULE 12: QUALITY ASSURANCE (QA & AUDIT) - SERVER BACKED CRYPTOGRAPHIC INTELLIGENCE
  // ==========================================
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [blockchainState, setBlockchainState] = useState<any>({
    integrityCheck: "PASSED",
    lastBlockHeight: 0,
    headHash: "000000000"
  });

  const [workflows, setWorkflows] = useState<any[]>([]);
  const [cloudFiles, setCloudFiles] = useState<any[]>([]);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [serverSettingsState, setServerSettingsState] = useState<any>({
    universityNameAr: "جامعة الصالحية الجديدة SGU",
    currentAcademicSemester: "Spring 2026",
    is2faEnforced: true,
    systemSecurityLevel: "Maximum Cryptography Enabled"
  });

  // Action interactive states
  const [mfaVerifyPin, setMfaVerifyPin] = useState("");
  const [mfaVerifyStatus, setMfaVerifyStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [mfaVerifyMsg, setMfaVerifyMsg] = useState("");
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [workflowDecisionNote, setWorkflowDecisionNote] = useState("");

  const [activeAuditInspector, setActiveAuditInspector] = useState<any | null>(null);

  const naqaaeChecklist = [
    { id: 1, text: "تحديث توصيف المقررات لجميع كليات SGU طبقا لمعايير NAQAAE لعام 2026", status: "completed" },
    { id: 2, text: "توثيق مخرجات الفحص الأمني للشبكات مع جدار الحماية الحكومي المشفر", status: "completed" },
    { id: 3, text: "تدقيق معايير الجودة والاستقرار لخوادم ERP الحرم وسيرفرات Cloud Run المركزية", status: "completed" },
  ];

  // REST API Loader Synchronizers
  const fetchAuditLogs = React.useCallback(() => {
    fetch("/api/enterprise/audit-logs")
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setAuditLogs(d.logs);
          setBlockchainState(d.blockchainState);
        }
      })
      .catch(e => console.warn("Live audit logs fetch warning:", e));
  }, []);

  const fetchWorkflows = React.useCallback(() => {
    fetch("/api/enterprise/workflows")
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setWorkflows(d.workflows);
        }
      })
      .catch(e => console.warn("Live workflows fetch warning:", e));
  }, []);

  const fetchFiles = React.useCallback(() => {
    fetch("/api/enterprise/files")
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setCloudFiles(d.files);
        }
      })
      .catch(e => console.warn("Live vault file manager fetch warning:", e));
  }, []);

  const fetchTelemetry = React.useCallback(() => {
    fetch("/api/enterprise/telemetry")
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setTelemetry(d.metrics);
        }
      })
      .catch(e => console.warn("Live system telemetry fetch warning:", e));
  }, []);

  const fetchSettingsState = React.useCallback(() => {
    fetch("/api/enterprise/settings")
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setServerSettingsState(d.settings);
        }
      })
      .catch(e => console.warn("Live administrative settings fetch warning:", e));
  }, []);

  // Sync state initially and on tab switches to ensure the view stays fresh
  React.useEffect(() => {
    fetchAuditLogs();
    fetchWorkflows();
    fetchFiles();
    fetchTelemetry();
    fetchSettingsState();

    // Set real-time poller for audit logs and system resources
    const tTimer = setInterval(() => {
      fetchTelemetry();
      fetchAuditLogs();
    }, 7000);

    return () => clearInterval(tTimer);
  }, [activeSystemTab, fetchAuditLogs, fetchWorkflows, fetchFiles, fetchTelemetry, fetchSettingsState]);

  // REST Post actions triggers
  const handleDecideWorkflow = async (id: string, decision: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/enterprise/workflows/${id}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          decidedBy: "youssef_admin",
          decisionNote: workflowDecisionNote.trim() || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast(decision === "approved" ? `✓ تم اعتماد وقبول طلب الـ Workflow كود ${id} بنجاح!` : `🚨 تم رفض الطلب ${id} وحفظ القرار بالأرشيف السيرفري.`);
        setWorkflowDecisionNote("");
        fetchWorkflows();
        fetchAuditLogs();
      } else {
        triggerToast(`خطأ: ${data.error || "فشل معالجة سلك المراجعة"}`);
      }
    } catch (e) {
      triggerToast("حدثت مشكلة أثناء إرسال قرار الحسم السيرفري.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploadLoading(true);
    triggerToast(`جاري تشفير وحساب SHA-256 ورفع الملف: ${file.name}...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = reader.result as string;
        try {
          const res = await fetch("/api/enterprise/files/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              uploadedBy: "youssef_admin",
              fileContentBase64: base64Content.split(",")[1] || base64Content
            })
          });
          const data = await res.json();
          if (res.ok) {
            triggerToast(`✓ تم رفع وتوثيق الملف ${file.name} في قبو البيانات الآمن!`);
            fetchFiles();
            fetchAuditLogs();
          } else {
            triggerToast(`خطأ في الرفع: ${data.error}`);
          }
        } catch (err) {
          triggerToast("حدث خطأ عند رفع الملف للسيرفر.");
        } finally {
          setFileUploadLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (fileErr) {
      triggerToast("عذرًا، حدث خطأ أثناء تشفير الملف.");
      setFileUploadLoading(false);
    }
  };

  const handleVerify2faMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaVerifyPin.trim()) return;

    setMfaVerifyStatus("loading");
    setMfaVerifyMsg("جاري التحويل والمصادقة على خادم الأمن الموحد...");

    try {
      const res = await fetch("/api/enterprise/auth/2fa-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "youssef_admin",
          pinCode: mfaVerifyPin
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMfaVerifyStatus("success");
        setMfaVerifyMsg("✓ تم إمضاء توقيع المصادقة الثنائي وجلسة الأمان (MFA Approved)!");
        triggerToast("أهلاً بك! تم إمضاء جلسة الدخول الثنائي بنجاح.");
        fetchAuditLogs();
      } else {
        setMfaVerifyStatus("error");
        setMfaVerifyMsg(data.error || "فشل التحقق من كود الأمان.");
      }
    } catch (err) {
      setMfaVerifyStatus("error");
      setMfaVerifyMsg("حدث انقطاع بالشبكة أو خطأ غير متوقع بالجلسة.");
    }
  };

  const handleUpdateSettings = async (field: string, val: any) => {
    try {
      const payload: any = { updatedBy: "youssef_admin" };
      payload[field] = val;

      const res = await fetch("/api/enterprise/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerToast("تمت مزامنة وحفظ التكوينات الإدارية للسيرفر بنجاح!");
        fetchSettingsState();
        fetchAuditLogs();
      }
    } catch (e) {
      triggerToast("فشل تحديث إعدادات الجامعة.");
    }
  };


  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Dynamic Alert Feedback toast */}
      {alertText && (
        <div className="fixed top-24 left-6 z-50 max-w-sm bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-xl shadow-2xl border border-amber-400 font-bold flex items-center gap-3 animate-bounce">
          <ShieldAlert className="w-5 h-5 shrink-0 animate-spin" />
          <span className="text-xs leading-relaxed font-sans">{alertText}</span>
        </div>
      )}

      {/* Main Switcher Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <Layers className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 font-sans leading-tight">المنصة الشاملة للأنظمة الثلاثين المتكاملة (30 Systems Portal)</h3>
            <p className="text-xs text-slate-400 mt-1">باقة متكاملة تغطي كافة القطاعات: الأكاديمية والمالية والإدارية والبحثية والتحكم المستند للذكاء الاصطناعي بنسبة 100%</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-full font-mono font-bold">
            PRO SUITE VERSION 3.0
          </span>
          <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1.5 rounded-full font-mono font-bold">
            30 CORE SYSTEMS ACTIVE
          </span>
        </div>
      </div>

      {/* Categories Switcher & Live Search to prevent clutter */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "الكل (30)" },
            { id: "core", label: "شؤون الطلاب والتعليم" },
            { id: "finance", label: "المالية والإدارية" },
            { id: "academic", label: "الامتحانات والكنترول" },
            { id: "research", label: "الأبحاث والريادة المستدامة" }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`cursor-pointer px-3 py-1.5 text-[11px] font-bold rounded-lg transition ${
                selectedCategory === cat.id
                  ? "bg-slate-800 text-amber-400 border border-slate-705"
                  : "text-slate-400 hover:text-slate-205 hover:bg-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="ابحث عن نظام من الـ 30 موديول..."
            value={systemSearch}
            onChange={e => setSystemSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 py-1.5 pr-8 pl-3 text-[11px] rounded text-right text-slate-200 outline-none outline-0 font-bold"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2 right-2.5" />
        </div>
      </div>

      {/* Grid of System Tabs (Polished, responsive design, up to 30 active systems) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {systemsArray
          .filter(sys => {
            const matchCategory = selectedCategory === "all" || sys.category === selectedCategory;
            const matchSearch =
              sys.name.toLowerCase().includes(systemSearch.toLowerCase()) ||
              sys.desc.toLowerCase().includes(systemSearch.toLowerCase());
            return matchCategory && matchSearch;
          })
          .map(sys => {
            const isSelected = activeSystemTab === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => {
                  setActiveSystemTab(sys.id as SystemTab);
                }}
                className={`cursor-pointer p-3 rounded-xl border text-right transition flex flex-col justify-between h-24 hover:scale-102 hover:bg-slate-850 ${
                  isSelected
                    ? sys.bgSelected + " text-slate-100 font-bold border-2"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <sys.icon className={`w-5 h-5 ${sys.color}`} />
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>}
                </div>
                <div className="space-y-0.5 mt-2 overflow-hidden w-full">
                  <span className="text-[10.5px] font-black block truncate leading-tight">{sys.name}</span>
                  <span className="text-[8.5px] text-slate-500 font-mono block truncate uppercase">{sys.desc}</span>
                </div>
              </button>
            );
          })}
      </div>

      {/* DYNAMIC MODULE DISPLAY SCREEN */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[460px] relative overflow-hidden">
        
        {/* TAB 1: SIS (STUDENT INFORMATION SYSTEM) */}
        {activeSystemTab === "sis" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <span className="text-xs font-bold font-mono text-emerald-400">STUDENT INFORMATION CENTRAL</span>
              <h4 className="text-sm font-black text-slate-200">النافذة الموحدة لنظم معلومات الطلاب والتحقق الأكاديمي</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Search sidebar list of Students */}
              <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو المعرف الجامعي..."
                    value={sisSearch}
                    onChange={e => setSisSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 py-1.5 pr-8 pl-3 text-xs rounded text-right text-slate-200 outline-none outline-0"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute top-2 right-2.5" />
                </div>

                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {filteredSisStudents.length === 0 ? (
                    <div className="text-center text-slate-600 py-6 text-xs">لا يوجد نتائج بحث مطابقة</div>
                  ) : (
                    filteredSisStudents.map(studentItem => (
                      <button
                        key={studentItem.id}
                        onClick={() => {
                          setSelectedSisStudentId(studentItem.id);
                          setParentSearchId(studentItem.id);
                          setParentStudentMatch(studentItem);
                          triggerToast(`تم اختيار ملف الطالب: ${studentItem.nameAr}`);
                        }}
                        className={`w-full text-right p-2.5 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                          selectedSisStudentId === studentItem.id
                            ? "bg-emerald-600/15 border-l-2 border-emerald-500 text-slate-100"
                            : "hover:bg-slate-900 text-slate-400"
                        }`}
                      >
                        <span className="font-mono text-[9px] text-slate-500">{studentItem.id}</span>
                        <span className="truncate">{studentItem.nameAr}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Comprehensive Student details profile & Parent Trust */}
              <div className="lg:col-span-8 space-y-6">
                {activeSisStudent ? (
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-right">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                        {activeSisStudent.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-1 py-1">{activeSisStudent.nameAr}</h4>
                      <div className="text-xs space-y-1 text-slate-400 font-semibold">
                        <p>الشعبة / الكلية: {activeSisStudent.collegeId.toUpperCase()}</p>
                        <p>الفرع: {activeSisStudent.campusBranch}</p>
                        <p>الرقم القومي: {activeSisStudent.nationalId}</p>
                        <p>البريد الأكاديمي: {activeSisStudent.email}</p>
                        <p>الهاتف: {activeSisStudent.phone}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between text-right space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-500">حالة السجل بالكنترول</span>
                        <div className="flex justify-between items-center mt-1">
                          <strong className="text-slate-100 text-sm">المعدل الأكاديمي: GPA {activeSisStudent.gpaOrSalary}</strong>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            activeSisStudent.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-455"
                          }`}>
                            {activeSisStudent.status === "active" ? "حساب نشط" : "موقوف إدارياً"}
                          </span>
                        </div>
                      </div>

                      {/* Mini visual grades chart */}
                      <div className="w-full h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[{ name: "GPA", val: parseFloat(activeSisStudent.gpaOrSalary) || 3.0, max: 4.0 }]}>
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[0, 4.0]} hide />
                            <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]}>
                              {[{ name: "GPA", val: parseFloat(activeSisStudent.gpaOrSalary) || 3.0, max: 4.0 }].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={parseFloat(activeSisStudent.gpaOrSalary) >= 3.0 ? "#10b981" : "#f59e0b"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        <span className="text-[9px] text-slate-500 block text-center mt-1">نسبة التميز التراكمي الأكاديمي</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-850 text-slate-500 text-xs">
                    لم يتم تحديد أي سجل طالب. يرجى اختيار طالب من القائمة الجانبية
                  </div>
                )}

                {/* Parents Portal Link */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h5 className="text-xs font-bold text-slate-205">بوابة أولياء الأمور للتحقق والاتصال المباشر</h5>
                  <form onSubmit={handleParentSearch} className="flex gap-2">
                    <button
                      type="submit"
                      className="cursor-pointer bg-slate-900 border border-slate-800 text-slate-350 hover:text-slate-100 text-xs px-4 py-2 rounded font-sans shrink-0 hover:bg-slate-850"
                    >
                      استعلام ولي الأمر
                    </button>
                    <input
                      type="text"
                      placeholder="أدخل المعرف الجامعي للطالب للاستعلام كولي أمر..."
                      value={parentSearchId}
                      onChange={e => setParentSearchId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs rounded px-3 py-1.5 text-right text-slate-200 outline-none outline-0 font-mono"
                    />
                  </form>

                  {parentStudentMatch && (
                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500">الطالب المستعلم عنه:</span>
                        <p className="text-xs font-bold text-slate-200 mt-0.5">{parentStudentMatch.nameAr} ({parentStudentMatch.id})</p>
                        <p className="text-[10px] text-slate-450 mt-1">حالة الـ GPA الحالية: {parentStudentMatch.gpaOrSalary} / 4.0</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSendParentSms}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded transition block select-none"
                        >
                          إرسال تقرير فوري بـ SMS لهاتف الوالد
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSystemTab === "lms" && (
          <div className="space-y-6 animate-fadeIn" dir={erpLang === "ar" ? "rtl" : "ltr"}>
            {/* Header with Title and Language Toggle */}
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold font-mono text-sky-400">
                  {erpLang === "ar" ? "نظام إدارة التعلم الذكي • SGU LMS" : "SMART LEARNING MANAGEMENT SYSTEM • SGU LMS"}
                </span>
                <h4 className="text-lg font-black text-slate-100 mt-1">
                  {erpLang === "ar" ? "بوابة المقررات الإلكترونية والمحاضرات الهجينة" : "E-Courses & Hybrid Lecture Portal"}
                </h4>
              </div>
              
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={() => setErpLang(prev => prev === "ar" ? "en" : "ar")}
                  className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-sky-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 transition"
                >
                  {erpLang === "ar" ? "Switch to English 🇬🇧" : "التحويل للعربية 🇪🇬"}
                </button>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {erpLang === "ar" ? "بث نشط" : "LIVE FEED"}
                </span>
              </div>
            </div>

            {/* Course Selector Tabs & General Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 flex flex-wrap gap-2">
                {Object.keys(lmsCoursesData).map(courseCode => {
                  const isActive = selectedLmsCourse === courseCode;
                  const cInfo = lmsCoursesData[courseCode];
                  return (
                    <button
                      key={courseCode}
                      onClick={() => {
                        setSelectedLmsCourse(courseCode);
                        setActiveQuizExam(null); // Reset active quiz
                      }}
                      className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                        isActive
                          ? "bg-sky-650 text-slate-950 border-sky-400 font-black shadow-lg shadow-sky-500/10"
                          : "bg-slate-950 text-slate-400 border-slate-900 hover:bg-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>{courseCode} - {erpLang === "ar" ? cInfo.nameAr : cInfo.nameEn}</span>
                    </button>
                  );
                })}
              </div>
              <div className="md:col-span-4 bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                <span className="text-slate-400">{erpLang === "ar" ? "معدل الإنجاز العام للمقرر:" : "Course Completion Progress:"}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sky-400 font-mono">{lmsCoursesData[selectedLmsCourse]?.progress || 0}%</span>
                  <div className="w-16 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-sky-500 h-full transition-all duration-500"
                      style={{ width: `${lmsCoursesData[selectedLmsCourse]?.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Course Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* SIDEBAR: Management Actions & Creation Panel (Available for Faculty/Admins) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Course Metadata Summary Card */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
                    <div className="p-2 bg-sky-500/10 rounded-lg">
                      <Layers className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-100 font-black block">{selectedLmsCourse}</strong>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {erpLang === "ar" ? "تفاصيل المقرر المسجلة بالكلية" : "Course Academic Info"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-900/40">
                      <span className="text-slate-500">{erpLang === "ar" ? "أستاذ المادة:" : "Responsible Doctor:"}</span>
                      <strong className="text-slate-300">
                        {erpLang === "ar" ? lmsCoursesData[selectedLmsCourse]?.instructorAr : lmsCoursesData[selectedLmsCourse]?.instructorEn}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-900/40">
                      <span className="text-slate-500">{erpLang === "ar" ? "عدد الملفات:" : "Course Files Count:"}</span>
                      <strong className="text-slate-300 font-mono">
                        {lmsCoursesData[selectedLmsCourse]?.files.length || 0} {erpLang === "ar" ? "ملفات" : "files"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-900/40">
                      <span className="text-slate-500">{erpLang === "ar" ? "المحاضرات المرئية:" : "Video lectures:"}</span>
                      <strong className="text-slate-300 font-mono">
                        {lmsCoursesData[selectedLmsCourse]?.videos.length || 0} {erpLang === "ar" ? "فيديو" : "videos"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-900/40">
                      <span className="text-slate-500">{erpLang === "ar" ? "الامتحانات النشطة:" : "Active Exams:"}</span>
                      <strong className="text-emerald-450 font-mono font-bold">
                        {lmsCoursesData[selectedLmsCourse]?.exams.length || 0} {erpLang === "ar" ? "اختبارات" : "exams"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Faculty Control Hub - Collapsible Uploaders & Creation forms */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase">Faculty ERP Core</span>
                    <h5 className="text-xs font-black text-slate-200 mt-0.5">
                      {erpLang === "ar" ? "لوحة الأستاذ والتحكم بالمقرر الدراسي:" : "Professor's Control & Course Upload Panel:"}
                    </h5>
                  </div>

                  {/* Upload File / Video Form */}
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                      <span className="text-[10px] font-bold text-sky-400 block border-b border-slate-850 pb-1">
                        {erpLang === "ar" ? "📁 رفع محاضرة أو ملف PDF جديد:" : "📁 Upload New Syllabus / PDF Lecture:"}
                      </span>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder={erpLang === "ar" ? "اسم المستند العلمي..." : "Document title..."}
                          value={newFileForm.name}
                          onChange={e => setNewFileForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-xs text-right outline-none text-slate-250 font-sans"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={newFileForm.type}
                            onChange={e => setNewFileForm(prev => ({ ...prev, type: e.target.value }))}
                            className="bg-slate-950 border border-slate-850 p-1.5 rounded text-[11px] text-slate-300 outline-none"
                          >
                            <option value="Lecture Notes">Lecture Notes</option>
                            <option value="Syllabus">Syllabus</option>
                            <option value="Lab Guide">Lab Guide</option>
                          </select>
                          <button
                            onClick={() => {
                              if (!newFileForm.name.trim()) return;
                              const updatedCourses = { ...lmsCoursesData };
                              updatedCourses[selectedLmsCourse].files.push({
                                name: newFileForm.name.endsWith(".pdf") ? newFileForm.name : `${newFileForm.name}.pdf`,
                                size: newFileForm.size,
                                type: newFileForm.type
                              });
                              updatedCourses[selectedLmsCourse].progress = Math.min(100, updatedCourses[selectedLmsCourse].progress + 5);
                              setLmsCoursesData(updatedCourses);
                              setNewFileForm({ name: "", type: "Lecture Notes", size: "1.5 MB" });
                              triggerToast(erpLang === "ar" ? "تم رفع وتوصيل الملف العلمي لصفحة المقرر بنجاح!" : "Document uploaded successfully!");
                            }}
                            className="cursor-pointer bg-sky-600 hover:bg-sky-500 text-slate-950 text-[10.5px] font-black px-2 py-1 rounded transition"
                          >
                            {erpLang === "ar" ? "رفع وتوصيل" : "Upload File"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Upload Video lecture */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                      <span className="text-[10px] font-bold text-teal-400 block border-b border-slate-850 pb-1">
                        {erpLang === "ar" ? "🎥 إضافة رابط فيديو المحاضرة المسجلة:" : "🎥 Publish Video Lecture Link:"}
                      </span>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder={erpLang === "ar" ? "عنوان درس الفيديو..." : "Video lecture topic..."}
                          value={newVideoForm.title}
                          onChange={e => setNewVideoForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-xs text-right outline-none text-slate-250 font-sans"
                        />
                        <button
                          onClick={() => {
                            if (!newVideoForm.title.trim()) return;
                            const updatedCourses = { ...lmsCoursesData };
                            updatedCourses[selectedLmsCourse].videos.push({
                              title: newVideoForm.title,
                              duration: newVideoForm.duration,
                              url: newVideoForm.url
                            });
                            updatedCourses[selectedLmsCourse].progress = Math.min(100, updatedCourses[selectedLmsCourse].progress + 8);
                            setLmsCoursesData(updatedCourses);
                            setNewVideoForm({ title: "", duration: "10:00", url: "https://www.w3schools.com/html/mov_bbb.mp4" });
                            triggerToast(erpLang === "ar" ? "تم تسجيل ونشر محاضرة الفيديو التفاعلية!" : "Video lecture posted successfully!");
                          }}
                          className="cursor-pointer bg-teal-600 hover:bg-teal-500 text-slate-950 text-[10.5px] font-black w-full py-1.5 rounded transition"
                        >
                          {erpLang === "ar" ? "نشر درس الفيديو" : "Publish Video"}
                        </button>
                      </div>
                    </div>

                    {/* Add Assignment form */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                      <span className="text-[10px] font-bold text-amber-400 block border-b border-slate-850 pb-1">
                        {erpLang === "ar" ? "📝 طرح تكليف وواجب فصلي جديد:" : "📝 Issue New Assignment Task:"}
                      </span>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="العنوان باللغة العربية..."
                          value={newAssignmentForm.titleAr}
                          onChange={e => setNewAssignmentForm(prev => ({ ...prev, titleAr: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-xs text-right outline-none text-slate-250 font-sans"
                        />
                        <input
                          type="text"
                          placeholder="Title in English..."
                          value={newAssignmentForm.titleEn}
                          onChange={e => setNewAssignmentForm(prev => ({ ...prev, titleEn: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-xs text-left outline-none text-slate-250 font-sans"
                        />
                        <button
                          onClick={() => {
                            if (!newAssignmentForm.titleAr.trim()) return;
                            const updatedCourses = { ...lmsCoursesData };
                            updatedCourses[selectedLmsCourse].assignments.push({
                              id: `as-swe-${Date.now()}`,
                              titleAr: newAssignmentForm.titleAr,
                              titleEn: newAssignmentForm.titleEn || newAssignmentForm.titleAr,
                              due: newAssignmentForm.due,
                              status: "pending",
                              grade: "N/A",
                              feedback: "بانتظار التسليم والمراجعة الأكاديمية."
                            });
                            setLmsCoursesData(updatedCourses);
                            setNewAssignmentForm({ titleAr: "", titleEn: "", due: "2026-07-15" });
                            triggerToast(erpLang === "ar" ? "تم نشر وتعميم الواجب العملي لجميع طلاب الدفعة!" : "Assignment posted successfully!");
                          }}
                          className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10.5px] font-black w-full py-1.5 rounded transition"
                        >
                          {erpLang === "ar" ? "تعميم وطرح التكليف" : "Post Assignment"}
                        </button>
                      </div>
                    </div>

                    {/* Add Quiz Exam */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-right">
                      <span className="text-[10px] font-bold text-rose-455 block border-b border-slate-850 pb-1">
                        {erpLang === "ar" ? "📝 صياغة اختبار وإضافة سؤال:" : "📝 Draft Quiz & Add MCQ:"}
                      </span>
                      <div className="space-y-1.5 text-[10px]">
                        <input
                          type="text"
                          placeholder="عنوان الكويز (مثال: كويز مفاهيم الويب)"
                          value={newExamForm.titleAr}
                          onChange={e => setNewExamForm(prev => ({ ...prev, titleAr: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="السؤال بالعربية..."
                          value={newExamForm.qAr}
                          onChange={e => setNewExamForm(prev => ({ ...prev, qAr: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-[11px]"
                        />
                        <div className="grid grid-cols-2 gap-1 font-mono">
                          <input
                            type="text"
                            placeholder="خيار 1"
                            value={newExamForm.optAr0}
                            onChange={e => setNewExamForm(prev => ({ ...prev, optAr0: e.target.value }))}
                            className="bg-slate-950 border border-slate-850 p-1 rounded"
                          />
                          <input
                            type="text"
                            placeholder="خيار 2 (الإجابة الصحيحة)"
                            value={newExamForm.optAr1}
                            onChange={e => setNewExamForm(prev => ({ ...prev, optAr1: e.target.value }))}
                            className="bg-slate-950 border border-slate-850 p-1 rounded"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (!newExamForm.titleAr.trim() || !newExamForm.qAr.trim()) return;
                            const updatedCourses = { ...lmsCoursesData };
                            
                            // Check if exam already exists
                            let existingExam = updatedCourses[selectedLmsCourse].exams.find(ex => ex.titleAr === newExamForm.titleAr);
                            if (existingExam) {
                              existingExam.questions.push({
                                qAr: newExamForm.qAr,
                                qEn: newExamForm.qEn || newExamForm.qAr,
                                optionsAr: [newExamForm.optAr0 || "خيار 1", newExamForm.optAr1 || "خيار 2", newExamForm.optAr2 || "خيار 3", newExamForm.optAr3 || "خيار 4"],
                                optionsEn: [newExamForm.optEn0 || "Opt 1", newExamForm.optEn1 || "Opt 2", newExamForm.optEn2 || "Opt 3", newExamForm.optEn3 || "Opt 4"],
                                correct: parseInt(newExamForm.correct as any) || 0
                              });
                            } else {
                              updatedCourses[selectedLmsCourse].exams.push({
                                id: `ex-${Date.now()}`,
                                titleAr: newExamForm.titleAr,
                                titleEn: newExamForm.titleEn || newExamForm.titleAr,
                                questions: [
                                  {
                                    qAr: newExamForm.qAr,
                                    qEn: newExamForm.qEn || newExamForm.qAr,
                                    optionsAr: [newExamForm.optAr0 || "أ ب", newExamForm.optAr1 || "ج د", "غير ذلك", "جميع ما سبق"],
                                    optionsEn: ["A B", "C D", "None", "All of above"],
                                    correct: 1
                                  }
                                ],
                                submitted: false,
                                grade: null
                              });
                            }
                            setLmsCoursesData(updatedCourses);
                            triggerToast(erpLang === "ar" ? "تم حفظ وتوليد السؤال بالاختبار الإلكتروني وجارٍ التحديث..." : "Question added to exam!");
                            setNewExamForm({
                              titleAr: "", titleEn: "", qAr: "", qEn: "",
                              optAr0: "", optAr1: "", optAr2: "", optAr3: "",
                              optEn0: "", optEn1: "", optEn2: "", optEn3: "", correct: 0
                            });
                          }}
                          className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-slate-950 font-black w-full py-1.5 rounded transition mt-1"
                        >
                          {erpLang === "ar" ? "حفظ وتوليد الكويز" : "Create Exam"}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* COURSE HOMEPAGE WORKSPACE AREA (8/12 cols) */}
              <div className="lg:col-span-8 bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-5">
                
                {/* Course Header Banner */}
                <div className="bg-gradient-to-l from-sky-950/40 to-slate-950 p-5 rounded-2xl border border-sky-900/30 flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <span className="text-[9.5px] font-mono text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded">
                      {selectedLmsCourse}
                    </span>
                    <h5 className="text-sm font-black text-slate-100 mt-1">
                      {erpLang === "ar" ? lmsCoursesData[selectedLmsCourse]?.nameAr : lmsCoursesData[selectedLmsCourse]?.nameEn}
                    </h5>
                    <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">
                      {erpLang === "ar" ? "قسم علوم الحاسب • كلية الحاسبات والمعلومات" : "Computer Science Dept • Faculty of Computers & AI"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">82</span> {erpLang === "ar" ? "طالباً" : "students"}
                    </span>
                  </div>
                </div>

                {/* Sub-tabs inside Course Workspace */}
                <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-slate-850">
                  <button
                    onClick={() => { setActiveCourseTab("desc"); setActiveQuizExam(null); }}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      activeCourseTab === "desc" ? "bg-sky-600 text-slate-950 font-black" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {erpLang === "ar" ? "الوصف والأهداف" : "Description"}
                  </button>
                  <button
                    onClick={() => { setActiveCourseTab("prof"); setActiveQuizExam(null); }}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      activeCourseTab === "prof" ? "bg-sky-600 text-slate-950 font-black" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {erpLang === "ar" ? "الدكتور المسؤول" : "Instructor"}
                  </button>
                  <button
                    onClick={() => { setActiveCourseTab("content"); setActiveQuizExam(null); }}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      activeCourseTab === "content" ? "bg-sky-600 text-slate-950 font-black" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {erpLang === "ar" ? "المحتوى والملفات" : "Content & PDFs"}
                  </button>
                  <button
                    onClick={() => { setActiveCourseTab("assignments"); setActiveQuizExam(null); }}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      activeCourseTab === "assignments" ? "bg-sky-600 text-slate-950 font-black" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {erpLang === "ar" ? "الواجبات والتسليم" : "Assignments"}
                  </button>
                  <button
                    onClick={() => { setActiveCourseTab("exams"); }}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      activeCourseTab === "exams" ? "bg-sky-600 text-slate-950 font-black" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {erpLang === "ar" ? "الاختبارات الأونلاين" : "Online Exams"}
                  </button>
                  <button
                    onClick={() => { setActiveCourseTab("grades"); setActiveQuizExam(null); }}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      activeCourseTab === "grades" ? "bg-sky-600 text-slate-950 font-black" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {erpLang === "ar" ? "رصد الدرجات" : "Grades"}
                  </button>
                  <button
                    onClick={() => { setActiveCourseTab("announcements"); setActiveQuizExam(null); }}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      activeCourseTab === "announcements" ? "bg-sky-600 text-slate-950 font-black" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {erpLang === "ar" ? "الإعلانات" : "Announcements"}
                  </button>
                </div>

                {/* TAB RENDERING */}
                <div className="min-h-[220px] transition-all">
                  
                  {/* TAB: Course Description */}
                  {activeCourseTab === "desc" && (
                    <div className="space-y-4 animate-fadeIn text-right">
                      <h6 className="text-xs font-bold text-slate-200 border-b border-slate-900 pb-1.5">
                        {erpLang === "ar" ? "توصيف ومخرجات التعلم للمادة:" : "Course Description & Outcomes:"}
                      </h6>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        {erpLang === "ar" ? lmsCoursesData[selectedLmsCourse]?.descAr : lmsCoursesData[selectedLmsCourse]?.descEn}
                      </p>
                      
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-2">
                        <span className="text-[10.5px] font-bold text-sky-400 block">
                          {erpLang === "ar" ? "🎯 معايير الجودة الدولية المعتمدة (ABET Standards):" : "🎯 Accredited Quality Standards (ABET):"}
                        </span>
                        <ul className="text-[11px] text-slate-500 space-y-1 font-semibold">
                          <li>• Ability to analyze a complex computing problem and to apply principles of computing (Outcome 1).</li>
                          <li>• Design, implement, and evaluate a computing-based solution to meet requirements (Outcome 2).</li>
                          <li>• Apply computer science theory and software development fundamentals (Outcome 6).</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB: Instructor Bio */}
                  {activeCourseTab === "prof" && (
                    <div className="space-y-4 animate-fadeIn flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <Users className="w-8 h-8 text-sky-400" />
                      </div>
                      <div className="flex-1 text-right space-y-1.5">
                        <h6 className="text-xs font-black text-slate-200">
                          {erpLang === "ar" ? lmsCoursesData[selectedLmsCourse]?.instructorAr : lmsCoursesData[selectedLmsCourse]?.instructorEn}
                        </h6>
                        <p className="text-[11px] text-sky-400 font-bold font-mono">
                          Senior CS Consultant & SGU Faculty Core
                        </p>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 text-xs space-y-1">
                          <span className="text-slate-500 block">
                            {erpLang === "ar" ? "الساعات المكتبية المعتمدة للإرشاد:" : "Approved Office Hours & Advisory Sessions:"}
                          </span>
                          <strong className="text-slate-350">
                            {erpLang === "ar" ? lmsCoursesData[selectedLmsCourse]?.instructorOfficeAr : lmsCoursesData[selectedLmsCourse]?.instructorOfficeEn}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: Content & Video player */}
                  {activeCourseTab === "content" && (
                    <div className="space-y-5 animate-fadeIn">
                      
                      {/* PDF Documents and Files */}
                      <div className="space-y-3">
                        <h6 className="text-xs font-bold text-slate-200 border-b border-slate-900 pb-1.5 flex justify-between items-center">
                          <span>{erpLang === "ar" ? "الملفات والمناهج الدراسية المعتمدة (PDF / Docs):" : "Approved Syllabus & PDFs:"}</span>
                        </h6>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {lmsCoursesData[selectedLmsCourse]?.files.map((file, idx) => (
                            <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-850 flex justify-between items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Download className="w-4 h-4 text-sky-400 cursor-pointer" onClick={() => triggerToast(`جاري تحميل ملف: ${file.name}...`)} />
                                <span className="text-[9px] bg-slate-950 text-slate-500 font-mono px-1.5 py-0.5 rounded">{file.size}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-slate-200 block truncate max-w-44 font-semibold">{file.name}</span>
                                <span className="text-[9px] text-sky-500 font-bold block">{file.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Video lectures player simulation */}
                      <div className="space-y-3">
                        <h6 className="text-xs font-bold text-slate-200 border-b border-slate-900 pb-1.5">
                          {erpLang === "ar" ? "المحاضرات المرئية والـ Video Tutorials:" : "Interactive Video Tutorials & Demos:"}
                        </h6>

                        {lmsCoursesData[selectedLmsCourse]?.videos.length === 0 ? (
                          <div className="text-center py-6 text-slate-600 text-xs">
                            {erpLang === "ar" ? "لا يوجد محاضرات مرئية مسجلة لهذا المقرر بعد." : "No recorded video lectures available yet."}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {lmsCoursesData[selectedLmsCourse]?.videos.map((vid, idx) => (
                              <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-mono text-teal-400 font-bold">{vid.duration}</span>
                                  <strong className="text-slate-200 text-right">{vid.title}</strong>
                                </div>
                                
                                {/* Mock Embedded SGU Video Player */}
                                <div className="aspect-video bg-slate-950 rounded-lg border border-slate-850 overflow-hidden flex flex-col justify-center items-center relative">
                                  <video
                                    src={vid.url}
                                    controls
                                    className="w-full h-full object-cover"
                                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB: Assignments & Upload gate */}
                  {activeCourseTab === "assignments" && (
                    <div className="space-y-4 animate-fadeIn">
                      <h6 className="text-xs font-bold text-slate-200 border-b border-slate-900 pb-1.5">
                        {erpLang === "ar" ? "قائمة الواجبات الأكاديمية والتسليمات المصدقة:" : "Active Course Assignment Submissions:"}
                      </h6>

                      <div className="space-y-3">
                        {lmsCoursesData[selectedLmsCourse]?.assignments.map((asg) => (
                          <div key={asg.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-3 text-right">
                            <div className="flex justify-between items-start leading-normal">
                              <span className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded ${
                                asg.status === "submitted" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-500 animate-pulse"
                              }`}>
                                {asg.status === "submitted" ? `${erpLang === "ar" ? "تم التسليم" : "Submitted"} (${asg.grade})` : (erpLang === "ar" ? "بانتظار الإيداع" : "Pending Submission")}
                              </span>
                              <div>
                                <strong className="text-xs text-slate-200 block">
                                  {erpLang === "ar" ? asg.titleAr : asg.titleEn}
                                </strong>
                                <span className="text-[10px] text-slate-500 block mt-0.5">
                                  {erpLang === "ar" ? `تاريخ الاستحقاق الأقصى: ${asg.due}` : `Deadline: ${asg.due}`}
                                </span>
                              </div>
                            </div>

                            {/* Drop & Text submission form */}
                            {asg.status !== "submitted" && (
                              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
                                <label className="block text-[10px] text-slate-500 text-right">
                                  {erpLang === "ar" ? "اكتب كود الحل أو ارفق نص الإيداع الأكاديمي:" : "Type your code answer or drop files:"}
                                </label>
                                <textarea
                                  placeholder={erpLang === "ar" ? "ألصق الكود البرمجي أو تقرير الإجابة هنا..." : "Paste your project code or answer here..."}
                                  className="w-full h-16 bg-slate-900 border border-slate-800 p-2 rounded text-[10.5px] outline-none text-slate-200 text-left font-mono"
                                />
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] text-slate-600 font-bold">Files supported: PDF, JS, PY, ZIP</span>
                                  <button
                                    onClick={() => {
                                      const updatedCourses = { ...lmsCoursesData };
                                      const matchedAsg = updatedCourses[selectedLmsCourse].assignments.find(a => a.id === asg.id);
                                      if (matchedAsg) {
                                        matchedAsg.status = "submitted";
                                        matchedAsg.grade = "10 / 10 (رصد آلي)";
                                        matchedAsg.feedback = erpLang === "ar" ? "تم استلام الكود البرمجي وفحصه ذاتياً ضد الانتحال بنجاح." : "Submitted and automatically graded with 100% test case pass.";
                                      }
                                      setLmsCoursesData(updatedCourses);
                                      triggerToast(erpLang === "ar" ? "تم إيداع كود الواجب بالنظام وسيتم تصحيحه تلقائياً!" : "Assignment submitted successfully!");
                                    }}
                                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded transition"
                                  >
                                    {erpLang === "ar" ? "إيداع الواجب الآن" : "Submit Assignment"}
                                  </button>
                                </div>
                              </div>
                            )}

                            {asg.status === "submitted" && (
                              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 text-[11px] text-slate-400 leading-normal">
                                <span className="text-[10px] font-bold text-sky-400 block mb-0.5">
                                  {erpLang === "ar" ? "تعليق وتقييم الدكتور:" : "Feedback:"}
                                </span>
                                {asg.feedback}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: Online Quizzes with MCQ Auto-grader */}
                  {activeCourseTab === "exams" && (
                    <div className="space-y-4 animate-fadeIn">
                      
                      {/* List of Exams if none is active */}
                      {!activeQuizExam ? (
                        <div className="space-y-3 text-right">
                          <h6 className="text-xs font-bold text-slate-200 border-b border-slate-900 pb-1.5">
                            {erpLang === "ar" ? "الاختبارات الذكية والتقييمات المتاحة:" : "Available Online Quizzes & Exams:"}
                          </h6>

                          {lmsCoursesData[selectedLmsCourse]?.exams.length === 0 ? (
                            <div className="text-center py-8 text-slate-650 text-xs">
                              {erpLang === "ar" ? "لا يوجد اختبارات أونلاين مجدولة حالياً." : "No online exams scheduled currently."}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {lmsCoursesData[selectedLmsCourse]?.exams.map((exam) => (
                                <div key={exam.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex justify-between items-center gap-3">
                                  <div className="flex gap-2">
                                    {exam.submitted ? (
                                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                                        {erpLang === "ar" ? "تم تسليم الاختبار" : "Exam Taken"} ({exam.grade})
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setActiveQuizExam(exam);
                                          setQuizSelectedAnswers({});
                                        }}
                                        className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-slate-950 text-xs font-black px-3 py-1.5 rounded transition"
                                      >
                                        {erpLang === "ar" ? "بدء الاختبار الآلي" : "Start Exam"}
                                      </button>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <strong className="text-xs text-slate-200 block">
                                      {erpLang === "ar" ? exam.titleAr : exam.titleEn}
                                    </strong>
                                    <span className="text-[10px] text-slate-500 block">
                                      {exam.questions.length} {erpLang === "ar" ? "أسئلة اختيار من متعدد" : "Multiple choice questions"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* ACTIVE EXAM ENGINE CONTAINER */
                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 text-right">
                          <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                            <button
                              onClick={() => setActiveQuizExam(null)}
                              className="cursor-pointer text-xs text-slate-500 hover:text-slate-350"
                            >
                              {erpLang === "ar" ? "إلغاء والعودة" : "Cancel & Go Back"}
                            </button>
                            <span className="text-xs font-bold text-rose-455 font-mono">
                              {erpLang === "ar" ? "⏱️ مؤقت الجلسة النشط: 15 دقيقة" : "⏱️ Live session: 15 mins"}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h5 className="text-sm font-black text-slate-100">
                              {erpLang === "ar" ? activeQuizExam.titleAr : activeQuizExam.titleEn}
                            </h5>
                            <span className="text-[9.5px] text-slate-500 font-mono block">
                              SGU Auto-Grading Engine Active
                            </span>
                          </div>

                          {/* Render Exam Questions */}
                          <div className="space-y-5 pt-3">
                            {activeQuizExam.questions.map((quest: any, qIdx: number) => (
                              <div key={qIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                                <span className="text-[10px] font-bold text-sky-400 block">
                                  {erpLang === "ar" ? `سؤال ${qIdx + 1}:` : `Question ${qIdx + 1}:`}
                                </span>
                                <p className="text-xs text-slate-200 leading-normal">
                                  {erpLang === "ar" ? quest.qAr : quest.qEn}
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
                                  {(erpLang === "ar" ? quest.optionsAr : quest.optionsEn).map((opt: string, oIdx: number) => {
                                    const isSelected = quizSelectedAnswers[qIdx] === oIdx;
                                    return (
                                      <button
                                        key={oIdx}
                                        onClick={() => {
                                          setQuizSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
                                        }}
                                        className={`cursor-pointer p-2.5 rounded-lg text-xs transition border text-right flex items-center justify-between ${
                                          isSelected
                                            ? "bg-rose-500/10 text-rose-400 border-rose-500/40 font-bold"
                                            : "bg-slate-900 text-slate-400 border-slate-850 hover:bg-slate-850"
                                        }`}
                                      >
                                        <span className="font-mono text-[10px] bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded">{oIdx + 1}</span>
                                        <span>{opt}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Submit Quiz button and Auto-correction */}
                          <button
                            onClick={() => {
                              // Auto correction logic
                              let correctCount = 0;
                              activeQuizExam.questions.forEach((quest: any, qIdx: number) => {
                                if (quizSelectedAnswers[qIdx] === quest.correct) {
                                  correctCount++;
                                }
                              });
                              const finalGrade = `${correctCount} / ${activeQuizExam.questions.length}`;
                              
                              // Update course data in state
                              const updatedCourses = { ...lmsCoursesData };
                              const matchedExam = updatedCourses[selectedLmsCourse].exams.find(e => e.id === activeQuizExam.id);
                              if (matchedExam) {
                                matchedExam.submitted = true;
                                matchedExam.grade = finalGrade;
                              }
                              // Increment general progress
                              updatedCourses[selectedLmsCourse].progress = Math.min(100, updatedCourses[selectedLmsCourse].progress + 15);
                              
                              setLmsCoursesData(updatedCourses);
                              setActiveQuizExam(null); // Return to exams list
                              triggerToast(erpLang === "ar" 
                                ? `تم تصحيح امتحانك تلقائياً! النتيجة: ${finalGrade}` 
                                : `Exam auto-graded! Score: ${finalGrade}`);
                            }}
                            className="cursor-pointer w-full bg-rose-500 hover:bg-rose-600 text-slate-950 font-black py-2.5 rounded-xl transition text-xs text-center"
                          >
                            {erpLang === "ar" ? "إرسال وتصحيح تلقائي فوري للأجوبة" : "Submit & Instant Auto-Grade Exam"}
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB: Grades Sheet */}
                  {activeCourseTab === "grades" && (
                    <div className="space-y-4 animate-fadeIn">
                      <h6 className="text-xs font-bold text-slate-200 border-b border-slate-900 pb-1.5 text-right">
                        {erpLang === "ar" ? "رصد الدرجات وكشف التقييمات التراكمية:" : "Academic Grade Book Standing:"}
                      </h6>

                      <div className="bg-slate-900 rounded-xl border border-slate-850 overflow-hidden">
                        <table className="w-full text-xs text-right font-medium">
                          <thead>
                            <tr className="bg-slate-950 text-slate-500 text-[10px] font-bold border-b border-slate-850">
                              <th className="p-3">{erpLang === "ar" ? "البند والتقييم الأكاديمي" : "Assessment Item"}</th>
                              <th className="p-3 text-center">{erpLang === "ar" ? "الوزن النسبي" : "Weight"}</th>
                              <th className="p-3 text-left">{erpLang === "ar" ? "الدرجة المرصودة" : "Obtained Grade"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {lmsCoursesData[selectedLmsCourse]?.grades.map((gradeItem, idx) => (
                              <tr key={idx} className="hover:bg-slate-850/50">
                                <td className="p-3 text-slate-200">
                                  {erpLang === "ar" ? gradeItem.itemAr : gradeItem.itemEn}
                                </td>
                                <td className="p-3 text-center text-slate-500 font-mono">15%</td>
                                <td className="p-3 text-left text-sky-400 font-bold font-mono">{gradeItem.grade}</td>
                              </tr>
                            ))}
                            <tr className="bg-slate-950 font-black border-t border-slate-800">
                              <td className="p-3 text-slate-300">{erpLang === "ar" ? "المجموع الكلي التراكمي" : "Cumulative Term Grade"}</td>
                              <td className="p-3 text-center text-slate-500 font-mono">100%</td>
                              <td className="p-3 text-left text-emerald-450 font-mono">A (Elite Standing)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB: Course Announcements */}
                  {activeCourseTab === "announcements" && (
                    <div className="space-y-4 animate-fadeIn text-right">
                      
                      {/* Broadcast Announcement Form */}
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-850 space-y-2.5">
                        <span className="text-[10px] font-bold text-sky-400 block border-b border-slate-850 pb-1">
                          {erpLang === "ar" ? "📢 بث إشعار وإعلان عاجل للمقرر:" : "📢 Broadcast Course Notification:"}
                        </span>
                        <input
                          type="text"
                          placeholder={erpLang === "ar" ? "اكتب الإعلان هنا..." : "Type announcement here..."}
                          value={newAnnouncementForm.textAr}
                          onChange={e => setNewAnnouncementForm(prev => ({ ...prev, textAr: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-xs text-right outline-none text-slate-200 font-sans"
                        />
                        <button
                          onClick={() => {
                            if (!newAnnouncementForm.textAr.trim()) return;
                            const updatedCourses = { ...lmsCoursesData };
                            updatedCourses[selectedLmsCourse].announcements.unshift({
                              textAr: newAnnouncementForm.textAr,
                              textEn: newAnnouncementForm.textEn || newAnnouncementForm.textAr,
                              date: new Date().toISOString().split("T")[0]
                            });
                            setLmsCoursesData(updatedCourses);
                            setNewAnnouncementForm({ textAr: "", textEn: "" });
                            triggerToast(erpLang === "ar" ? "تم بث وتوصيل الإشعار لهواتف الطلاب المسجلين!" : "Announcement broadcasted successfully!");
                          }}
                          className="cursor-pointer bg-sky-600 hover:bg-sky-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded transition"
                        >
                          {erpLang === "ar" ? "إطلاق البث المصلحي" : "Broadcast Announcement"}
                        </button>
                      </div>

                      {/* Announcements list */}
                      <div className="space-y-2">
                        {lmsCoursesData[selectedLmsCourse]?.announcements.length === 0 ? (
                          <div className="text-center py-6 text-slate-650 text-xs">
                            {erpLang === "ar" ? "لا يوجد إعلانات منشورة مؤخراً." : "No course announcements posted recently."}
                          </div>
                        ) : (
                          lmsCoursesData[selectedLmsCourse]?.announcements.map((ann, idx) => (
                            <div key={idx} className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 space-y-1.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500 font-mono">{ann.date}</span>
                                <span className="text-sky-400 font-bold">{erpLang === "ar" ? "تبليغ أكاديمي عاجل" : "Academic Alert"}</span>
                              </div>
                              <p className="text-xs text-slate-250 leading-relaxed font-semibold">
                                {erpLang === "ar" ? ann.textAr : ann.textEn}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}

                </div>

                {/* Central Question Bank Section */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-3 mt-4 text-right">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <span className="font-mono text-[9px] text-purple-400 font-bold">ERP UNIVERSITY BANK</span>
                    <h6 className="text-xs font-bold text-slate-205">
                      {erpLang === "ar" ? "قاعدة بيانات بنك الأسئلة المركزي SGU Question Bank:" : "SGU Central Question Bank Registry:"}
                    </h6>
                  </div>

                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                    {questionBank.map((qb) => (
                      <div key={qb.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-855 text-[11px] flex justify-between items-center gap-3">
                        <span className="text-[10px] text-emerald-455 font-bold font-mono">Ans: {qb.answer}</span>
                        <div className="text-right">
                          <strong className="text-slate-300 block leading-tight">
                            {erpLang === "ar" ? qb.qAr : qb.qEn}
                          </strong>
                          <span className="text-[9px] text-purple-400 font-bold font-mono">{qb.course}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add question to bank */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 items-end">
                    <div className="sm:col-span-3">
                      <select
                        value={newQbForm.course}
                        onChange={e => setNewQbForm(prev => ({ ...prev, course: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-[11px] text-slate-300 outline-none"
                      >
                        <option value="SWE311">SWE311</option>
                        <option value="AI302">AI302</option>
                        <option value="DB301">DB301</option>
                      </select>
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="السؤال بالعربية..."
                        value={newQbForm.qAr}
                        onChange={e => setNewQbForm(prev => ({ ...prev, qAr: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-[11px] outline-none text-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="الإجابة الصحيحة النموذجية..."
                        value={newQbForm.answer}
                        onChange={e => setNewQbForm(prev => ({ ...prev, answer: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 p-1.5 rounded text-[11px] outline-none text-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        onClick={() => {
                          if (!newQbForm.qAr.trim() || !newQbForm.answer.trim()) return;
                          setQuestionBank(prev => [
                            ...prev,
                            {
                              id: `qb-${Date.now()}`,
                              course: newQbForm.course,
                              qAr: newQbForm.qAr,
                              qEn: newQbForm.qAr,
                              answer: newQbForm.answer
                            }
                          ]);
                          setNewQbForm({ course: "SWE311", qAr: "", qEn: "", answer: "" });
                          triggerToast(erpLang === "ar" ? "تم ترحيل السؤال إلى بنك الأسئلة المركزي بنجاح!" : "Question added to bank!");
                        }}
                        className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold text-[10.5px] w-full py-1.5 rounded transition"
                      >
                        {erpLang === "ar" ? "ترحيل للبنك" : "Add to Bank"}
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: ERP SYSTEM (INTEGRATED ENTERPRISE DRIVEN CORE) */}
        {activeSystemTab === "erp" && (
          <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
            
            {/* Header section */}
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
                <span className="text-[10px] font-bold font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">LIVE SERVER SYNC ACTIVE</span>
              </div>
              <h4 className="text-sm font-black text-slate-200">
                لوحة تكامل الموارد الإدارية والمالية والأكاديمية والربط الفعلي الموحد SGU Enterprise
              </h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              ترتبط هذه اللوحة مركزياً بخادم البوابة الأمن الذكي لجامعة الصالحية الجديدة. تعمل العمليات والتقاطعات والملفات هنا على ترحيل البيانات وحفظها في قاعدة بيانات السيرفر الحقيقية مع تدقيق المعاملات بطريقة SHA-256 block ledger.
            </p>

            {/* FIRST ROW: SYSTEM HARDWARE TELEMETRY & RESOURCES LOAD (REAL BACKEND METRICS) */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-[9.5px] font-mono text-slate-500">LIVE PROCESSOR & HEAP MEMORY RESOURCE TELEMETRY</span>
                <span className="text-xs font-bold text-slate-300">مراقبة كفاءة خادم الـ ERP والمكونات السيرفرية الفورية:</span>
              </div>

              {telemetry ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* CPU Usage */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div className="text-left font-mono">
                      <span className="text-purple-400 font-bold text-lg block">{telemetry.cpuLoadPercent}%</span>
                      <span className="text-[9px] text-slate-500 block">نواة المعالج المركزي SGU</span>
                    </div>
                    <div className="bg-purple-500/5 p-2 rounded-lg border border-purple-500/10">
                      <Cpu className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>

                  {/* Heap Memory */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div className="text-left font-mono">
                      <span className="text-violet-400 font-bold text-lg block">{telemetry.memoryUsedMb} MB</span>
                      <span className="text-[9px] text-slate-500 block">من {telemetry.memoryTotalMb} MB الكلية</span>
                    </div>
                    <div className="bg-violet-500/5 p-2 rounded-lg border border-violet-500/10">
                      <Database className="w-5 h-5 text-violet-400" />
                    </div>
                  </div>

                  {/* Database Latency */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div className="text-left font-mono">
                      <span className="text-emerald-400 font-bold text-lg block">{telemetry.dbServerLatencyMs} ms</span>
                      <span className="text-[9px] text-slate-500 block">زمن استجابة اللوائح الأفقية</span>
                    </div>
                    <div className="bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                      <Wifi className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Backup Scheduler */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div className="text-right">
                      <span className="text-amber-500 font-extrabold text-[10.5px] block">نسخة احتياطية مشفرة</span>
                      <span className="text-[9.5px] text-slate-450 font-mono block mt-0.5">{telemetry.lastBackupTimestamp}</span>
                    </div>
                    <div className="bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                      <ShieldCheck className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 font-mono text-xs">
                  جاري جلب مؤشرات النظام والذاكرة العنقودية من السيرفر الرئيسي...
                </div>
              )}

              {/* Security parameters */}
              {telemetry && (
                <div className="pt-2 flex flex-wrap justify-between items-center text-[10px] text-slate-500 font-bold gap-2">
                  <p>توزيع المنافذ الفدرالية: <span className="font-mono text-purple-400">0.0.0.0:{telemetry.serverPort}</span></p>
                  <p>جدار الحماية الفوري للشبكة الخارجية: <span className="text-emerald-405">🟢 نشط ومحمي ضد هجمات DDoS</span></p>
                  <p>شهادة الأمان المشفرة (SSL): <span className="text-emerald-400">صالحة لمزيد من {telemetry.sslCertificateExpiryDays} يوماً</span></p>
                </div>
              )}
            </div>

            {/* SECOND ROW: ENTERPRISE DISPATCH WORKFLOWS APPROVAL SYSTEM (STUDENTS, LEAVES, ACADEMICS, FINANCES) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Active Workflows Queue Dashboard */}
              <div className="lg:col-span-8 bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-mono text-purple-450">PENDING & DECIDED UNIVERSITY WORKFLOWS</span>
                  <p className="text-xs font-black text-slate-200">سلك طلبات الموظفين والطلاب وتدفق الموافقات الإدارية الموحدة:</p>
                </div>

                <div className="space-y-3.5">
                  {workflows.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">لا يوجد طلبات سلك موافقات مسجلة على السيرفر حالياً.</div>
                  ) : (
                    workflows.map(item => (
                      <div key={item.id} className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-3 text-right">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                              item.status === "pending"
                                ? "bg-amber-500/10 text-amber-500 animate-pulse border border-amber-500/20"
                                : item.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-455 border border-rose-500/20"
                            }`}>
                              {item.status === "pending" ? "قيد التدقيق" : item.status === "approved" ? "تم قبول الطلب" : "تم إلغاء واستبعاد الطلب"}
                            </span>
                            
                            <span className="text-xs font-bold text-slate-200">{item.studentName} ({item.studentId})</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-purple-400">
                            <span>{item.id}</span>
                            <span className="text-slate-600">|</span>
                            <span className="uppercase text-slate-450">{item.type} request</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                          {item.details}
                        </p>

                        {item.amount && (
                          <div className="text-xs font-bold text-amber-450">
                            القيمة المالية المرصودة للجدولة: {item.amount.toLocaleString("ar-EG")} ج.م
                          </div>
                        )}

                        {item.status === "pending" ? (
                          <div className="pt-2 border-t border-slate-850 flex flex-col sm:flex-row gap-3 items-end sm:items-center justify-between">
                            <input
                              type="text"
                              placeholder="أضف تعليقاً أو ملاحظة لتبرير القرار الإداري..."
                              value={workflowDecisionNote}
                              onChange={e => setWorkflowDecisionNote(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-right text-slate-300 outline-none placeholder-slate-600 font-sans"
                            />
                            
                            <div className="flex gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleDecideWorkflow(item.id, "approved")}
                                className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-3.5 py-1.5 rounded transition font-sans"
                              >
                                قبول واعتماد ✓
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDecideWorkflow(item.id, "rejected")}
                                className="cursor-pointer bg-rose-950 hover:bg-rose-900 text-rose-455 hover:text-rose-400 border border-rose-900/50 font-bold text-[11px] px-3.5 py-1.5 rounded transition font-sans"
                              >
                                رفض إلغاء ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-505 font-bold">
                            <p>المشرف المسؤول: <span className="text-slate-350 font-mono">{item.decidedBy}</span></p>
                            <p>قرار التبرير: <span className="text-slate-300">{item.decisionNote}</span></p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* MFA 2FA Authentication Test & System Config Block */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 2FA Verification Gate Widget */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-855 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[9.5px] font-mono text-purple-400 block">CYBER AUTHENTICATION PROTOCOL</span>
                    <h5 className="text-xs font-bold text-slate-205 mt-0.5">التحقق الإجباري ثنائي العوامل 2FA للرواتب والدرجات:</h5>
                  </div>

                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    يتطلب تعديل البيانات الحساسة أو قبول طلبات الـ workflow مطابقة رمز الأمان المتولد من Google Authenticator للـ Super Admin.
                  </p>

                  <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl space-y-2.5 text-right">
                    <span className="text-[10.5px] text-indigo-400 font-bold block">مفتاح الحساب التجريبي المصدّر:</span>
                    <code className="text-xs block font-mono text-indigo-305 text-left bg-slate-950 p-1.5 rounded">
                      YOUS SEFK HALD SGUY
                    </code>
                    <p className="text-[9px] text-slate-500 leading-normal font-medium">
                      أدخل كود الأمان المكون من 6 أرقام (الكود التجريبي الحالي للسيرفر: <span className="font-mono text-amber-500 font-extrabold">123456</span>) للبث والمطابقة الفورية.
                    </p>
                  </div>

                  <form onSubmit={handleVerify2faMfa} className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={mfaVerifyStatus === "loading"}
                        className="cursor-pointer bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded shrink-0 transition"
                      >
                        بث للتحقق من المفتاح
                      </button>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="أدخل الـ 6 أرقام الـ Pin..."
                        value={mfaVerifyPin}
                        onChange={e => setMfaVerifyPin(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-center font-mono rounded px-3 py-1.5 text-slate-200 outline-none"
                      />
                    </div>
                    
                    {mfaVerifyStatus !== "idle" && (
                      <div className={`p-2.5 rounded text-[10px] font-bold text-center border ${
                        mfaVerifyStatus === "success"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                          : mfaVerifyStatus === "loading"
                          ? "bg-slate-900 border-slate-800 text-slate-400"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-455"
                      }`}>
                        {mfaVerifyMsg}
                      </div>
                    )}
                  </form>
                </div>

                {/* SGU System General Config Panel */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-855 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[9.5px] font-mono text-purple-400 block">ERP UNIVERSITY METRIC SYSTEM</span>
                    <h5 className="text-xs font-bold text-slate-205 mt-0.5">تعديل بارامترات إدارة الجامعة والحفظ الفوري:</h5>
                  </div>

                  {serverSettingsState ? (
                    <div className="space-y-3.5 text-right">
                      {/* Name Ar */}
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">اسم الجامعة المعتمد (بالعربية):</label>
                        <input
                          type="text"
                          value={serverSettingsState.universityNameAr}
                          onChange={e => handleUpdateSettings("universityNameAr", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-right text-slate-200 outline-none font-sans font-bold"
                        />
                      </div>

                      {/* Semester */}
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">الفصل الأكاديمي النشط للقرارات والترحيل:</label>
                        <select
                          value={serverSettingsState.currentAcademicSemester}
                          onChange={e => handleUpdateSettings("currentAcademicSemester", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-right text-slate-350 outline-none"
                        >
                          <option value="Spring 2026">الربيع الحالي Spring 2026</option>
                          <option value="Summer 2026">الصيفي المكثف Summer 2026</option>
                          <option value="Fall 2026">الخريف القادم Fall 2026</option>
                        </select>
                      </div>

                      {/* MFA enforced */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-bold border-l border-slate-900 pl-2">تفعيل بروتوكول MFA كشرط ملزم</span>
                        <input
                          type="checkbox"
                          checked={serverSettingsState.is2faEnforced}
                          onChange={e => handleUpdateSettings("is2faEnforced", e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded bg-slate-900 border-slate-805"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-550 text-xs py-4 font-mono">جاري تحميل إعدادات السيرفر...</div>
                  )}
                </div>

                {/* File manual uploader block */}
                <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-200 block">رفع مستند جديد إلى السحابة الآمنة</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">يقبل المستندات الرقمية والصور والصيغ الأكاديمية المختلفة</span>
                  </div>

                  <div className="relative shrink-0">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={fileUploadLoading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:opacity-0"
                    />
                    <button
                      type="button"
                      disabled={fileUploadLoading}
                      className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition"
                    >
                      {fileUploadLoading ? "جاري التشفير والرفع..." : "اختر ملفاً لرفعه الآن"}
                    </button>
                  </div>
                </div>
              </div>

              {/* DOWNLOAD REPORT SPREADSHEETS OFFICE SYSTEM */}
              <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 text-right">
                <div className="border-b border-slate-900 pb-2">
                  <span className="text-[9.5px] font-mono text-purple-400 block">ADMINISTRATIVE REPORT CONVERTER SYSTEM</span>
                  <h5 className="text-xs font-bold text-slate-205 mt-0.5">تفريغ وتحميل التقارير الأكاديمية والمالية بصيغة المجدول (CSV / Excel):</h5>
                </div>

                <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                  بث مباشر لتوليد تقارير الجداول الحقيقية للطلاب والتدقيق والترحيل الكاشف، بالتحويل التلقائي للترميز العربي المعتمد (مع حشو Excel BOM لدعم اللغة العربية بالأوفيس):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href="/api/enterprise/reports/download?type=audit_logs"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast("جاري تجميع حزم التوقيع وتوليد CSV لتدقيق التعديلات...")}
                    className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-850 rounded-xl hover:border-purple-500/40 hover:bg-slate-850 transition cursor-pointer text-center"
                  >
                    <Download className="w-6 h-6 text-purple-400 mb-2" />
                    <span className="text-xs font-bold text-slate-200">سجل المدقق المعاملاتي الفيدرالي</span>
                    <span className="text-[9px] text-slate-500 mt-1">Audit Trail ledger (CSV)</span>
                  </a>

                  <a
                    href="/api/enterprise/reports/download?type=financial_invoices"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast("جاري استخلاص كشف الحسابات ومبالغ السكن الطلابي والمقاصة...")}
                    className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-850 rounded-xl hover:border-violet-500/40 hover:bg-slate-850 transition cursor-pointer text-center"
                  >
                    <Download className="w-6 h-6 text-violet-400 mb-2" />
                    <span className="text-xs font-bold text-slate-200">دفتر الحسابات والمدفوعات</span>
                    <span className="text-[9px] text-slate-500 mt-1">Finance Ledger (CSV)</span>
                  </a>

                  <a
                    href="/api/enterprise/reports/download?type=student_roster"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast("جاري تفريغ سجل القيد الأكاديمي وساعات المقررات المنجزة...")}
                    className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-850 rounded-xl hover:border-emerald-500/40 hover:bg-slate-850 transition cursor-pointer text-center sm:col-span-2"
                  >
                    <Download className="w-6 h-6 text-emerald-400 mb-2" />
                    <span className="text-xs font-bold text-slate-200">كشوف المقيدين بالمستوى التعليمي</span>
                    <span className="text-[9px] text-slate-500 mt-1">Student Roster MFA (CSV)</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: HR (HUMAN RESOURCES) */}
        {activeSystemTab === "hr" && (
          <div className="space-y-6 animate-fadeIn">
            <SguHrSystem
              lang={erpLang}
              triggerSystemPush={(title, msg) => triggerToast(`${title}: ${msg}`)}
              addLog={(msg) => triggerToast(msg)}
            />
          </div>
        )}

        {/* Phase 10: Admission System */}
        {activeSystemTab === "admission" && (
          <div className="space-y-6 animate-fadeIn">
            <SguAdmissionSystem
              lang={erpLang}
              applications={applications}
              setApplications={setApplications}
              dbUsers={dbUsersState}
              setDbUsers={setDbUsersState}
              triggerSystemPush={(title, msg) => triggerToast(`${title}: ${msg}`)}
              addLog={(msg) => triggerToast(msg)}
            />
          </div>
        )}

        {/* Phase 11: Communication Hub */}
        {activeSystemTab === "communication" && (
          <div className="space-y-6 animate-fadeIn">
            <SguCommunicationSystem
              lang={erpLang}
              student={activeSisStudent}
              triggerSystemPush={(title, msg) => triggerToast(`${title}: ${msg}`)}
              addLog={(msg) => triggerToast(msg)}
            />
          </div>
        )}

        {/* Phase 14: Graduate Studies & Research */}
        {activeSystemTab === "research" && (
          <div className="space-y-6 animate-fadeIn">
            <SguResearchGraduateSystem
              lang={erpLang}
              triggerSystemPush={(title, msg) => triggerToast(`${title}: ${msg}`)}
              addLog={(msg) => triggerToast(msg)}
            />
          </div>
        )}

        {/* TAB 5: FINANCE & OUTSTANDING DUES */}
        {activeSystemTab === "finance" && (
          <div className="space-y-6 animate-fadeIn" dir={erpLang === "ar" ? "rtl" : "ltr"}>
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold font-mono text-amber-500">COE TUITION & FINANCIAL DECK</span>
                <h4 className="text-sm font-black text-slate-200 mt-1">
                  {erpLang === "ar" ? "المالية والمدفوعات والمستندات الرسمية" : "Finance, Payments & Official Documents"}
                </h4>
              </div>
              <button
                onClick={() => setErpLang(prev => prev === "ar" ? "en" : "ar")}
                className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 transition"
              >
                {erpLang === "ar" ? "Switch to English 🇬🇧" : "التحويل للعربية 🇪🇬"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN (Invoices, CC Payments, Installments) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Tuition Invoices Table */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">Student Ledger</span>
                    <h5 className="text-xs font-black text-slate-200 mt-0.5">
                      {erpLang === "ar" ? "الفواتير والمطالبات المالية المستحقة:" : "Outstanding Student Invoices & Bills:"}
                    </h5>
                  </div>

                  <div className="space-y-3">
                    {financeInvoices.map(invoice => (
                      <div
                        key={invoice.id}
                        className={`p-4 rounded-xl border transition ${
                          selectedInvoiceToPay?.id === invoice.id
                            ? "bg-amber-550/5 border-amber-500/40"
                            : "bg-slate-900 border-slate-850 hover:border-slate-800"
                        } text-xs text-right`}
                        dir={erpLang === "ar" ? "rtl" : "ltr"}
                      >
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <strong className="text-slate-100 block text-xs">
                              {erpLang === "ar" ? invoice.descriptionAr : invoice.descriptionEn}
                            </strong>
                            <span className="text-[10px] text-slate-500 block font-mono mt-1">
                              ID: {invoice.id} • {erpLang === "ar" ? `تاريخ الاستحقاق: ${invoice.dueDate}` : `Due date: ${invoice.dueDate}`}
                            </span>
                          </div>
                          
                          <div className="text-left">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              invoice.status === "paid"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : invoice.status === "partial"
                                ? "bg-amber-500/10 text-amber-450"
                                : "bg-rose-500/10 text-rose-455 animate-pulse"
                            }`}>
                              {invoice.status === "paid"
                                ? (erpLang === "ar" ? "تم السداد بالكامل" : "Fully Paid")
                                : invoice.status === "partial"
                                ? (erpLang === "ar" ? "مسدد جزئياً" : "Partially Paid")
                                : (erpLang === "ar" ? "غير مسدد" : "Unpaid")}
                            </span>
                            <span className="block text-slate-200 font-mono font-bold mt-1 text-xs">
                              {invoice.amount.toLocaleString()} EGP
                            </span>
                          </div>
                        </div>

                        {invoice.status !== "paid" && (
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-900/60">
                            <span className="text-[10px] text-slate-500">
                              {erpLang === "ar" ? `المسدد حتى الآن: ${invoice.paidAmount.toLocaleString()} EGP` : `Paid so far: ${invoice.paidAmount.toLocaleString()} EGP`}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedInvoiceToPay(invoice);
                              }}
                              className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded transition"
                            >
                              {erpLang === "ar" ? "سدد هذه المطالبة الآن" : "Pay Bill"}
                            </button>
                          </div>
                        )}

                        {/* Installments Plan Accordion for Partial Bills */}
                        {invoice.id === "INV-2026-003" && activeInstallmentPlan[invoice.id] && (
                          <div className="mt-3 pt-3 border-t border-slate-900 space-y-2 text-right bg-slate-950 p-2.5 rounded-lg">
                            <span className="text-[10px] font-bold text-amber-400 block mb-1">
                              {erpLang === "ar" ? "📅 خطة تقسيط المطالبة المجدولة:" : "📅 Installment Payment Plan Schedule:"}
                            </span>
                            {activeInstallmentPlan[invoice.id].map(inst => (
                              <div key={inst.id} className="flex justify-between items-center text-[10px] py-1 border-b border-slate-900 last:border-0">
                                <div>
                                  <span className={`inline-block px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                                    inst.status === "paid" ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-900 text-slate-450 border border-slate-800"
                                  }`}>
                                    {inst.status === "paid" ? (erpLang === "ar" ? "مسدد" : "Paid") : (erpLang === "ar" ? "مستحق" : "Due")}
                                  </span>
                                  <span className="text-slate-500 font-mono ml-2">Due: {inst.due}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-300 font-mono font-bold">{inst.amount.toLocaleString()} EGP</span>
                                  {inst.status !== "paid" && (
                                    <button
                                      onClick={() => {
                                        // Pay installment
                                        const updatedPlan = { ...activeInstallmentPlan };
                                        const matched = updatedPlan[invoice.id].find(i => i.id === inst.id);
                                        if (matched) {
                                          matched.status = "paid";
                                        }
                                        setActiveInstallmentPlan(updatedPlan);

                                        // Update invoice paid amount
                                        setFinanceInvoices(prev =>
                                          prev.map(inv => {
                                            if (inv.id === invoice.id) {
                                              const newPaid = inv.paidAmount + inst.amount;
                                              const newStatus = newPaid >= inv.amount ? "paid" : "partial";
                                              return { ...inv, paidAmount: newPaid, status: newStatus };
                                            }
                                            return inv;
                                          })
                                        );
                                        triggerToast(erpLang === "ar" ? `تم سداد قسط بقيمة ${inst.amount} EGP بنجاح!` : "Installment paid successfully!");
                                      }}
                                      className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-slate-300 text-[9px] px-2 py-0.5 rounded font-black border border-slate-800"
                                    >
                                      {erpLang === "ar" ? "سدد القسط" : "Pay"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secure Credit Card Payment Simulator */}
                {selectedInvoiceToPay && (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-4 animate-slideUp">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <button
                        onClick={() => setSelectedInvoiceToPay(null)}
                        className="cursor-pointer text-[10.5px] text-slate-500 hover:text-slate-300"
                      >
                        {erpLang === "ar" ? "إلغاء المطالبة" : "Cancel Payment"}
                      </button>
                      <h6 className="text-xs font-black text-slate-200">
                        {erpLang === "ar" ? "بوابة السداد الإلكتروني الآمن للمطالبة:" : "Secure Student Card Gateway Processing:"}
                      </h6>
                    </div>

                    {/* Credit Card Mockup */}
                    <div className="relative h-40 w-full bg-gradient-to-tr from-amber-600 via-yellow-600 to-amber-850 rounded-2xl p-5 text-slate-950 shadow-xl overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                      
                      <div className="flex justify-between items-start">
                        <div className="text-left font-black tracking-widest text-xs uppercase font-mono text-slate-950/80">
                          SGU Central Treasury Card
                        </div>
                        <div className="h-7 w-11 bg-slate-900/10 rounded-md border border-white/20 flex items-center justify-center font-bold text-xs italic">
                          VISA
                        </div>
                      </div>

                      <div className="text-center font-mono text-base tracking-widest font-bold my-2 select-all">
                        {creditCardForm.number || "•••• •••• •••• ••••"}
                      </div>

                      <div className="flex justify-between items-end font-mono">
                        <div className="text-right">
                          <span className="text-[8px] text-slate-950/60 block leading-none">CARDHOLDER</span>
                          <span className="text-xs font-bold uppercase truncate max-w-40 block">{creditCardForm.cardholder || "STUDENT NAME"}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[8px] text-slate-950/60 block leading-none">VALID THRU</span>
                          <span className="text-xs font-bold">{creditCardForm.expiry || "MM/YY"}</span>
                        </div>
                      </div>
                    </div>

                    {/* CC Form inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "اسم حامل البطاقة:" : "Cardholder Name:"}</label>
                        <input
                          type="text"
                          value={creditCardForm.cardholder}
                          onChange={e => setCreditCardForm(prev => ({ ...prev, cardholder: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-right text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "رقم البطاقة الائتمانية:" : "Credit Card Number:"}</label>
                        <input
                          type="text"
                          value={creditCardForm.number}
                          onChange={e => setCreditCardForm(prev => ({ ...prev, number: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-left font-mono text-slate-200 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">CVV:</label>
                          <input
                            type="text"
                            maxLength={3}
                            value={creditCardForm.cvv}
                            onChange={e => setCreditCardForm(prev => ({ ...prev, cvv: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-center font-mono text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "تاريخ الانتهاء:" : "Expiration (MM/YY):"}</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={creditCardForm.expiry}
                            onChange={e => setCreditCardForm(prev => ({ ...prev, expiry: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-center font-mono text-slate-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setPaymentLoading(true);
                        setTimeout(() => {
                          setPaymentLoading(false);
                          
                          // Update invoice to paid
                          setFinanceInvoices(prev =>
                            prev.map(inv =>
                              inv.id === selectedInvoiceToPay.id
                                ? { ...inv, status: "paid", paidAmount: inv.amount }
                                : inv
                            )
                          );

                          // Update installment plan if any
                          if (activeInstallmentPlan[selectedInvoiceToPay.id]) {
                            const updatedPlan = { ...activeInstallmentPlan };
                            updatedPlan[selectedInvoiceToPay.id] = updatedPlan[selectedInvoiceToPay.id].map(inst => ({
                              ...inst, status: "paid"
                            }));
                            setActiveInstallmentPlan(updatedPlan);
                          }

                          triggerToast(erpLang === "ar" ? "تم معالجة السداد وتثبيت الاعتماد البنكي بنجاح!" : "Payment processed and confirmed!");
                          setSelectedInvoiceToPay(null);
                        }, 1200);
                      }}
                      disabled={paymentLoading}
                      className="cursor-pointer w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs transition flex justify-center items-center"
                    >
                      {paymentLoading ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-950 border-t-transparent animate-spin"></span>
                          {erpLang === "ar" ? "جاري الاتصال الآمن بالمصرف..." : "Securing bank handshakes..."}
                        </span>
                      ) : (
                        erpLang === "ar" ? `تأكيد دفع فوري ${selectedInvoiceToPay.amount.toLocaleString()} EGP` : `Process Payment of ${selectedInvoiceToPay.amount.toLocaleString()} EGP`
                      )}
                    </button>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN (Financial Statements, Calculator & Alerts) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Printable Financial Statement Card */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono text-sky-400 font-bold block uppercase">Official Documents</span>
                    <h5 className="text-xs font-black text-slate-200 mt-0.5">
                      {erpLang === "ar" ? "كشف حساب مالي وقيد السداد التراكمي:" : "SGU Tuition Financial Statement:"}
                    </h5>
                  </div>

                  {/* Document Box Representation */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-350 text-[11px] leading-normal space-y-3 font-sans">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2 font-black text-slate-100">
                      <span>SGU CENTRAL FEES STATEMENT</span>
                      <QrCode className="w-7 h-7 text-slate-400" />
                    </div>

                    <div className="space-y-1 text-right text-[10px] font-mono">
                      <div>Student ID: 2026SGU-ST-0000</div>
                      <div>Academic Year: Spring Semester 2026</div>
                      <div>Issuer: Dean of Admission & Treasury</div>
                    </div>

                    <div className="border-t border-b border-slate-800 py-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Total Incurred Bills:</span>
                        <strong className="font-mono text-slate-200">
                          {financeInvoices.reduce((acc, c) => acc + c.amount, 0).toLocaleString()} EGP
                        </strong>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Paid amount:</span>
                        <strong className="font-mono">
                          {financeInvoices.filter(i => i.status === "paid").reduce((acc, c) => acc + c.amount, 0).toLocaleString()} EGP
                        </strong>
                      </div>
                      <div className="flex justify-between text-amber-500">
                        <span>Remaining Balance:</span>
                        <strong className="font-mono">
                          {financeInvoices.filter(i => i.status !== "paid").reduce((acc, c) => acc + c.amount, 0).toLocaleString()} EGP
                        </strong>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-550 font-mono pt-1">
                      <span>ST-STATUS: FINANCIALLY CLEAR</span>
                      <span>SGU ERP SECURITY VERIFIED</span>
                    </div>

                  </div>
                </div>

                {/* Installment / Payment Planner Calculator */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">Installment Planner</span>
                    <h5 className="text-xs font-black text-slate-200 mt-0.5">
                      {erpLang === "ar" ? "حاسبة جدولة الأقساط الجامعية:" : "Tuition Installment Scheduler:"}
                    </h5>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 text-right space-y-2">
                      <div className="text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "حدد الفاتورة لجدولتها كأقساط:" : "Select Invoice to Schedule:"}</div>
                      <select
                        onChange={(e) => {
                          const inv = financeInvoices.find(i => i.id === e.target.value);
                          if (inv) {
                            // Automatically generate a 3-month installment plan
                            const installmentAmount = Math.round(inv.amount / 3);
                            const plan = [
                              { id: `inst-1-${inv.id}`, dueDate: "2026-07-01", amount: installmentAmount, status: "pending" },
                              { id: `inst-2-${inv.id}`, dueDate: "2026-08-01", amount: installmentAmount, status: "pending" },
                              { id: `inst-3-${inv.id}`, dueDate: "2026-09-01", amount: installmentAmount, status: "pending" },
                            ];
                            setActiveInstallmentPlan(prev => ({
                              ...prev,
                              [inv.id]: plan
                            }));
                            triggerToast(erpLang === "ar" ? "تم إنشاء خطة أقساط مدتها 3 أشهر!" : "3-month installment plan generated!");
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-200 outline-none"
                      >
                        <option value="">-- {erpLang === "ar" ? "اختر الفاتورة" : "Choose Invoice"} --</option>
                        {financeInvoices.filter(i => i.status !== "paid").map(i => (
                          <option key={i.id} value={i.id}>{i.title} ({i.amount.toLocaleString()} EGP)</option>
                        ))}
                      </select>
                    </div>

                    {/* Render active plans */}
                    {Object.keys(activeInstallmentPlan).map(invId => {
                      const parentInvoice = financeInvoices.find(i => i.id === invId);
                      if (!parentInvoice) return null;
                      return (
                        <div key={invId} className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-right space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 text-xs">
                            <span className="text-slate-450">{erpLang === "ar" ? "جدول أقساط:" : "Installments for:"}</span>
                            <span className="font-bold text-slate-200">{parentInvoice.title}</span>
                          </div>
                          <div className="space-y-1.5">
                            {activeInstallmentPlan[invId].map((inst, index) => (
                              <div key={inst.id} className="flex justify-between items-center text-[10.5px]">
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  inst.status === "paid" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                                }`}>
                                  {inst.status === "paid" ? (erpLang === "ar" ? "مسدد" : "Paid") : (erpLang === "ar" ? "قيد السداد" : "Pending")}
                                </span>
                                <div className="text-right">
                                  <span className="font-mono font-bold text-slate-300">{inst.amount.toLocaleString()} EGP</span>
                                  <span className="text-[8.5px] text-slate-550 block font-mono">Due: {inst.dueDate}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 7: LIBRARY CATALOG */}
        {activeSystemTab === "library" && (
          <div className="space-y-6 animate-fadeIn" dir={erpLang === "ar" ? "rtl" : "ltr"}>
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold font-mono text-blue-400">SMART LIBRARY SYSTEM</span>
                <h4 className="text-sm font-black text-slate-200 mt-1">
                  {erpLang === "ar" ? "المكتبة المركزية والأوعية الورقية والرقمية لطلاب SGU" : "SGU Central Library, Journals & Digital Repositories"}
                </h4>
              </div>
              <button
                onClick={() => setErpLang(prev => prev === "ar" ? "en" : "ar")}
                className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 transition"
              >
                {erpLang === "ar" ? "Switch to English 🇬🇧" : "التحويل للعربية 🇪🇬"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: Books Catalog & Search, and Admin additions */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Search Bar */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={erpLang === "ar" ? "ابحث باسم الكتاب، المؤلف أو التصنيف العلمي للمستودع..." : "Search by title, author, category or call number..."}
                      value={bookSearch}
                      onChange={e => setBookSearch(e.target.value)}
                      className={`w-full bg-slate-900 border border-slate-800 py-2.5 rounded-xl text-xs text-slate-200 outline-none ${
                        erpLang === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                      }`}
                    />
                    <Search className={`w-4 h-4 text-slate-500 absolute top-3.5 ${erpLang === "ar" ? "right-3.5" : "left-3.5"}`} />
                  </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredLibraryBooks.map(book => (
                    <div key={book.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-850 hover:border-slate-800 transition flex flex-col justify-between space-y-3 text-right">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start leading-normal">
                          <span className="bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono text-[9px] uppercase border border-slate-850">
                            {book.location}
                          </span>
                          <div className={erpLang === "ar" ? "text-right" : "text-left"}>
                            <strong className="text-xs text-slate-100 block truncate max-w-[180px]">{book.title}</strong>
                            <span className="text-[10px] text-slate-500 block mt-0.5 font-semibold">
                              {erpLang === "ar" ? `بواسطة: ${book.author}` : `By: ${book.author}`}
                            </span>
                          </div>
                        </div>

                        <div className={`flex justify-between items-center border-t border-slate-900/60 pt-2 text-[10px] text-slate-400 font-semibold ${
                          erpLang === "ar" ? "flex-row" : "flex-row-reverse"
                        }`}>
                          <span>{erpLang === "ar" ? `التصنيف: ${book.category}` : `Category: ${book.category}`}</span>
                          <span className={book.copies > 0 ? "text-emerald-400" : "text-rose-455"}>
                            {book.copies > 0 
                              ? (erpLang === "ar" ? `النسخ: ${book.copies}` : `Copies: ${book.copies}`) 
                              : (erpLang === "ar" ? "معار بالكامل" : "Fully Borrowed")}
                          </span>
                        </div>
                      </div>

                      <div className={`flex gap-2 pt-2 border-t border-slate-900/40 justify-end ${
                        erpLang === "ar" ? "flex-row" : "flex-row-reverse"
                      }`}>
                        <button
                          onClick={() => handleRenewBook(book.id)}
                          className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-800 transition"
                        >
                          {erpLang === "ar" ? "تجديد المدة" : "Renew Period"}
                        </button>
                        
                        {book.copies > 0 && (
                          <button
                            onClick={() => handleBorrowBook(book.id)}
                            className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-slate-100 text-[10.5px] font-black px-3.5 py-1.5 rounded-lg transition"
                          >
                            {erpLang === "ar" ? "استعارة فورية" : "Borrow Now"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Library Admin: Add New Book form (Only for Library staff/Admins/Faculty) */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono text-blue-400 font-bold block uppercase">Librarian Access Only</span>
                    <h5 className="text-xs font-black text-slate-200 mt-0.5">
                      {erpLang === "ar" ? "إضافة كتاب أو أطروحة بحثية جديدة:" : "Add New Book or Scientific Journal:"}
                    </h5>
                  </div>

                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (!newBookForm.title || !newBookForm.author) {
                        triggerToast(erpLang === "ar" ? "يرجى ملء الحقول الأساسية" : "Please fill in essential fields");
                        return;
                      }
                      const newId = `BK-${Date.now()}`;
                      const bookObj = {
                        id: newId,
                        title: newBookForm.title,
                        author: newBookForm.author,
                        category: newBookForm.category,
                        copies: parseInt(newBookForm.copies) || 1,
                        location: newBookForm.location,
                      };
                      setLibraryBooks(prev => [bookObj, ...prev]);
                      setNewBookForm({ title: "", author: "", category: "Computer Science", copies: "3", location: "ST-4" });
                      triggerToast(erpLang === "ar" ? "تم فهرسة الكتاب بنجاح وإتاحته للجمهور!" : "Book cataloged and published successfully!");
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right"
                  >
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "عنوان المجلد أو البحث العلمي:" : "Title of the volume/journal:"}</label>
                      <input
                        type="text"
                        required
                        value={newBookForm.title}
                        onChange={e => setNewBookForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-right text-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "اسم المؤلف أو الباحث:" : "Author or Principal Researcher:"}</label>
                      <input
                        type="text"
                        required
                        value={newBookForm.author}
                        onChange={e => setNewBookForm(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-right text-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "التصنيف والفرع المعرفي:" : "Category Classification:"}</label>
                      <select
                        value={newBookForm.category}
                        onChange={e => setNewBookForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-right text-slate-200 outline-none"
                      >
                        <option value="Computer Science">Computer Science & AI</option>
                        <option value="Business Administration">Business & Accounting</option>
                        <option value="Medicine & Biotech">Medicine & Biotech</option>
                        <option value="Engineering & Architecture">Engineering & Architecture</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "الرف/الموقع:" : "Shelf Location:"}</label>
                        <input
                          type="text"
                          value={newBookForm.location}
                          onChange={e => setNewBookForm(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-center font-mono text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">{erpLang === "ar" ? "عدد النسخ:" : "Copies:"}</label>
                        <input
                          type="number"
                          min="1"
                          value={newBookForm.copies}
                          onChange={e => setNewBookForm(prev => ({ ...prev, copies: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-center font-mono text-slate-200 outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="cursor-pointer sm:col-span-2 bg-blue-600 hover:bg-blue-500 text-slate-100 font-bold py-2 rounded-xl text-xs transition"
                    >
                      {erpLang === "ar" ? "تأكيد إدخال وفهرسة الكتاب" : "Confirm Entry & Publish to SGU Catalog"}
                    </button>
                  </form>
                </div>

              </div>

              {/* RIGHT COLUMN: Electronic SGU Card, Active Borrowings & Dynamic Fine Calculator */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. SGU Electronic Smart Library Card */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono text-blue-400 font-bold block uppercase">Digital Pass</span>
                    <h5 className="text-xs font-black text-slate-200 mt-0.5">
                      {erpLang === "ar" ? "بطاقة الهوية والخدمات الذكية للمكتبة SGU:" : "Electronic Library SGU Identity Card:"}
                    </h5>
                  </div>

                  {/* Card Pass UI */}
                  <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border-2 border-blue-500/40 text-right space-y-4 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                    
                    <div className="flex justify-between items-start">
                      <QrCode className="w-9 h-9 text-blue-400/80" />
                      <div className="text-right">
                        <strong className="text-xs text-slate-100 block">SGU CENTRAL LIBRARY CARD</strong>
                        <span className="text-[9px] font-bold text-blue-400 font-mono tracking-widest block uppercase">Smart Member ID</span>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center justify-end">
                      <div className="text-right">
                        <strong className="text-xs text-slate-200 block">أحمد محمد الرفاعي</strong>
                        <span className="text-[9.5px] text-slate-550 block font-semibold font-mono">ID: 2026SGU-ST-0000 • STUDENT</span>
                        <div className="flex gap-3 justify-end items-center mt-1 text-[9.5px]">
                          <span className="text-emerald-400">
                            {erpLang === "ar" ? `الكتب المعارة: ${borrowedBooks.length}` : `Borrowed: ${borrowedBooks.length}`}
                          </span>
                          <span className="text-slate-650">|</span>
                          <span className="text-amber-400 font-bold">
                            {erpLang === "ar" 
                              ? `الغرامات: ${borrowedBooks.reduce((sum, b) => sum + (b.overdueDays > 0 ? b.overdueDays * 5 : 0), 0)} EGP` 
                              : `Fines: ${borrowedBooks.reduce((sum, b) => sum + (b.overdueDays > 0 ? b.overdueDays * 5 : 0), 0)} EGP`}
                          </span>
                        </div>
                      </div>
                      <div className="w-11 h-11 bg-slate-900 rounded-full border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400 font-mono">
                        SGU
                      </div>
                    </div>

                    <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-[8.5px] text-slate-500 font-mono">
                      <span>VERIFIED PASS PORTAL v2.1</span>
                      <span>EXPIRES: SEPT 2027</span>
                    </div>
                  </div>
                </div>

                {/* 2. Active Borrowings & Dynamic Return/Fine calculations */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">Active Rentals</span>
                    <h5 className="text-xs font-black text-slate-200 mt-0.5">
                      {erpLang === "ar" ? "عمليات الاستعارة النشطة وتاريخ الإرجاع:" : "Active Book Rentals & Return Status:"}
                    </h5>
                  </div>

                  {borrowedBooks.length === 0 ? (
                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-850 text-center text-xs text-slate-500 font-semibold">
                      {erpLang === "ar" ? "لا توجد كتب مستعارة حالياً باسمك." : "No books currently checked out."}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {borrowedBooks.map(item => {
                        const fine = item.overdueDays > 0 ? item.overdueDays * 5 : 0;
                        return (
                          <div key={item.id} className="p-3.5 bg-slate-900 rounded-xl border border-slate-850 text-right space-y-2">
                            <div className="flex justify-between items-start">
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                item.overdueDays > 0 ? "bg-rose-500/15 text-rose-400 animate-pulse" : "bg-emerald-500/15 text-emerald-400"
                              }`}>
                                {item.overdueDays > 0 
                                  ? (erpLang === "ar" ? `متأخر ${item.overdueDays} يوم` : `${item.overdueDays} days late`)
                                  : (erpLang === "ar" ? "نشط ومؤمّن" : "Healthy status")}
                              </span>
                              <div>
                                <strong className="text-xs text-slate-250 block">{item.title}</strong>
                                <span className="text-[9.5px] text-slate-500 block font-semibold font-mono mt-0.5">
                                  {erpLang === "ar" ? `تاريخ الإرجاع: ${item.returnDate}` : `Return date: ${item.returnDate}`}
                                </span>
                              </div>
                            </div>

                            {fine > 0 && (
                              <div className="bg-rose-950/20 p-2 rounded border border-rose-900/40 text-[10px] text-rose-400 flex justify-between items-center font-mono font-bold">
                                <span>{erpLang === "ar" ? "الغرامة المتراكمة للتأخير:" : "Late Return Fine:"}</span>
                                <span>{fine} EGP</span>
                              </div>
                            )}

                            <div className={`flex gap-2 pt-1 border-t border-slate-950/80 justify-end ${
                              erpLang === "ar" ? "flex-row" : "flex-row-reverse"
                            }`}>
                              <button
                                onClick={() => {
                                  // Renew rent
                                  setBorrowedBooks(prev =>
                                    prev.map(b =>
                                      b.id === item.id
                                        ? { ...b, returnDate: "2026-06-30", overdueDays: 0 }
                                        : b
                                    )
                                  );
                                  triggerToast(erpLang === "ar" ? "تم تمديد فترة الاستعارة بنجاح!" : "Borrowing window extended!");
                                }}
                                className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded transition"
                              >
                                {erpLang === "ar" ? "تمديد" : "Extend"}
                              </button>
                              <button
                                onClick={() => {
                                  // Return book
                                  setBorrowedBooks(prev => prev.filter(b => b.id !== item.id));
                                  setLibraryBooks(prev =>
                                    prev.map(b => (b.id === item.id ? { ...b, copies: b.copies + 1 } : b))
                                  );
                                  triggerToast(erpLang === "ar" ? "تم إرجاع الكتاب وإغلاق العهدة المكتبية!" : "Book returned successfully!");
                                }}
                                className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded transition"
                              >
                                {erpLang === "ar" ? "إرجاع الكتاب" : "Return Book"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 8: DORMITORY & HOUSING REGISTRY */}
        {activeSystemTab === "dorm" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <span className="text-xs font-bold font-mono text-indigo-400">DORMITORY ASSIGNMENT SYSTEM</span>
              <h4 className="text-sm font-black text-slate-200">المدينة الجامعية والمدينة الفندقية السكنية لجامعة الصالحية SGU</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Resident Check-in Allocator form */}
              <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-200 block border-b border-slate-900 pb-2">حجز وتخصيص سرير جديد لطالب مغترب:</span>
                
                <form onSubmit={handleAssignResident} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">الرقم الجامعي للطالب المغترب:</label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل كود المعرف (ST)..."
                      value={inputResidentStudentId}
                      onChange={e => setInputResidentStudentId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-left text-slate-200 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">تحديد الغرفة السكنية المستهدفة:</label>
                    <select
                      value={inputResidentRoom}
                      onChange={e => setInputResidentRoom(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-right text-slate-200 outline-none"
                    >
                      <option value="101">غرفة 101 - مبنى (أ) (1200 ج.م)</option>
                      <option value="305">غرفة 305 - مبنى (ب) (600 ج.م)</option>
                      <option value="401">غرفة 401 - مبنى (ج) (2000 ج.م)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-505 text-slate-100 font-bold py-2 rounded text-xs transition"
                  >
                    توثيق التسكين وإقرار العقد السكني
                  </button>
                </form>

                <div className="bg-slate-900 p-3 rounded border border-slate-850 h-28 overflow-y-auto font-mono text-[9px] text-indigo-400 text-right space-y-1">
                  <span className="text-slate-500 block">تغذية المعطيات السكنية الأخيرة (Dorm Audit Logs):</span>
                  {housingLogs.length === 0 ? (
                    <div className="text-center py-6 text-slate-650 font-sans">لا يوجد عمليات سكنية اليوم.</div>
                  ) : (
                    housingLogs.map((l, i) => <div key={i} className="border-b border-slate-850 pb-1">{l}</div>)
                  )}
                </div>
              </div>

              {/* Dormitory building rooms listings */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold text-slate-350 block">حالة الغرف وقدرات النزل والساحات السكنية بالـ ERP:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dormList.map(dorm => (
                    <div key={dorm.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5 text-right font-medium">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-100 font-bold">{dorm.buildingName}</span>
                        <span className="font-mono bg-slate-900 text-slate-450 px-2 py-0.5 rounded">
                          غرفة {dorm.roomNo} - {dorm.beds}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10.5px] text-slate-500 font-semibold border-b border-slate-900 pb-2">
                        <span>الرسم المالي: {dorm.price} ج.م / شهر</span>
                        <span className={dorm.status === "available" ? "text-emerald-440" : "text-rose-455"}>
                          {dorm.status === "available" ? "متاح" : "ممتلئ الغرفة"}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 font-bold flex justify-between items-center">
                        <span className="text-slate-400">القدرة: {dorm.occupied} / {dorm.capacity} نزل سكن</span>
                        <div className="w-20 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-indigo-500 h-full transition-all"
                            style={{ width: `${(dorm.occupied / dorm.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: TRANSPORTATION & GPS BUS FLEET */}
        {activeSystemTab === "transport" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <span className="text-xs font-bold font-mono text-cyan-455">TRANSPORT & GPS TELEMETRY SYSTEM</span>
              <h4 className="text-sm font-black text-slate-200">أسطول الحافلات الجامعية وتتبع مسارات الـ GPS بالديرب نجم والقاهرة</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Moving bus graphic SVG map */}
              <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4 text-right">
                <span className="text-xs font-bold text-slate-300 block border-b border-slate-900 pb-2 font-sans">محاكاة مسار اتوبيس القاهرة والشرقية بالـ GPS الآني:</span>
                
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-855 relative">
                  <div className="flex justify-between text-[9.5px] text-slate-500 font-mono mb-2">
                    <span>الشرقية / بلبيس</span>
                    <span>خط سير الحافلة القاهرة - الصالحية</span>
                    <span>جامعة SGU الصالحية</span>
                  </div>

                  {/* SVG Map visual pathway with moving dot */}
                  <svg className="w-full h-16 bg-slate-950 rounded-lg border border-slate-800" viewBox="0 0 500 80">
                    <path d="M 30,40 Q 150,15 250,45 T 470,40" fill="none" stroke="#2c3c50" strokeWidth="4" strokeDasharray="6,4" />
                    
                    <path
                      d="M 30,40 Q 150,15 250,45 T 470,40"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="4"
                      strokeDasharray="500"
                      strokeDashoffset={500 - (busProgress / 100) * 440}
                    />

                    <circle cx="30" cy="40" r="6" fill="#0ea5e9" />
                    <text x="30" y="62" fill="#57534e" fontSize="9" textAnchor="middle">بلبيس</text>

                    <circle cx="210" cy="30" r="5" fill="#eab308" />
                    <text x="210" y="52" fill="#57534e" fontSize="9" textAnchor="middle" fontWeight="medium">ديرب نجم</text>

                    <circle cx="470" cy="40" r="6" fill="#10b981" />
                    <text x="470" y="62" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">SGU Campus</text>

                    {/* Glowing moving bus marker */}
                    <g transform={`translate(${30 + (busProgress / 100) * 440}, ${35 + Math.sin((busProgress / 100) * Math.PI) * 10})`}>
                      <circle r="9" fill="#06b6d4" className="animate-ping" opacity={0.6} />
                      <circle r="6" fill="#0891b2" stroke="#ffffff" strokeWidth="1.5" />
                    </g>
                  </svg>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-[10px] font-semibold">
                    <div className="bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-slate-500 block">إحداثيات التتبع الجغرافي:</span>
                      <strong className="text-slate-300 font-mono">Distance Done: {busProgress}%</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-slate-500 block">السرعة ومعدل التجاوز:</span>
                      <strong className={`font-mono block ${busSpeed > 78 ? "text-rose-455 animate-pulse" : "text-emerald-455"}`}>
                        {busSpeed} كم/س {busSpeed > 78 && "⚠️ تسرّع الأمان"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={toggleBusEngine}
                    className={`cursor-pointer text-xs font-bold px-4 py-2 rounded-lg transition flex-1 select-none text-center ${
                      busDriving
                        ? "bg-rose-500 text-slate-950 hover:bg-rose-600"
                        : "bg-cyan-600 text-slate-950 hover:bg-cyan-500"
                    }`}
                  >
                    {busDriving ? "تشغيل مكابح الأمان الطوارئ" : "بدء الحركة ومحاكاة GPS الأوتوبيسات"}
                  </button>
                  <button
                    onClick={() => {
                      setBusProgress(15);
                      setBusDriving(false);
                      setBusTelemetry([]);
                      triggerToast("تم تصفير عدادات الحافلة الكبرى");
                    }}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 text-xs px-3 py-2 rounded-lg transition"
                  >
                    تفريغ
                  </button>
                </div>
              </div>

              {/* Fleet telemetry logs */}
              <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-200 block border-b border-slate-900 pb-2 text-right">تدفق إفادات الـ Telemetry (Fleet Live):</span>
                
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-855 h-56 overflow-y-auto font-mono text-left text-[9.5px] text-cyan-300 leading-normal scrollbar-thin">
                  {busTelemetry.length === 0 ? (
                    <div className="text-center text-slate-600 py-16 font-sans">ابدأ حركة باصات الطلاب أعلاه لتلقيم ملقم الـ GPS بالحزم...</div>
                  ) : (
                    busTelemetry.map((t, idx) => <div key={idx} className="border-b border-slate-905 pb-1 mb-1">{t}</div>)
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 10: ALUMNI HOOD & NETWORK */}
        {activeSystemTab === "alumni" && (
          <div className="space-y-6 animate-fadeIn">
            <SguAlumniPortal
              lang={erpLang}
              triggerSystemPush={(title, msg) => triggerToast(`${title}: ${msg}`)}
              addLog={(msg) => triggerToast(msg)}
            />
          </div>
        )}

        {/* TAB 11: AI ASSISTANT (COUNSELING SUITE & PREDICTIVE LLM) */}
        {activeSystemTab === "ai_assistant" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-bold font-mono text-amber-500">YOUSSEF KHALED SMART AI SUITE</span>
              <span className="text-sm font-black text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-5 h-5 text-amber-500 animate-spin" />
                برنامج يوسف خالد الذكي المتكامل للذكاء الاصطناعي الأكاديمي
              </span>
            </div>

            {/* AI Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-850 relative overflow-hidden text-right">
              <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="space-y-1.5 relative z-10">
                <span className="text-[9.5px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/20 leading-none">
                  دمج فريد فائق لتسريع التوجيه واللوائح وحوسبة الأهداف
                </span>
                <h4 className="text-sm font-black text-slate-100 mt-1">المحاور المتكاملة للذكاء الاصطناعي الأكاديمي والمهني لـ SGU</h4>
                <p className="text-[11px] text-slate-450 leading-relaxed font-medium">
                  يجمع هذا النظام الذكي أفضل تقنيات معالجة اللغات الطبيعية لدعم استفساراتك اليومية: <strong className="text-purple-400">Gemini 2.5</strong>، <strong className="text-emerald-400">ChatGPT 4o</strong>، والدقة الصارمة لـ <strong className="text-amber-505 font-bold">Claude 3.5 Sonnet</strong>. اختر محركك المفضل وابدأ الطرح!
                </p>
              </div>
            </div>

            {/* Engine switcher bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: "gemini", name: "🔮 جوجل جيميناي (Gemini 2.5)", desc: "السرعة وتلخيص اللوائح وسجلات رصد الـ GPA", color: "border-purple-500/40 text-purple-300 bg-purple-950/20", unselColor: "text-slate-400" },
                { id: "chatgpt", name: "🤖 شات جي بي تي (ChatGPT 4o)", desc: "خطط الدراسة المعقدة وبناء السيرة الذاتية البرمجية", color: "border-emerald-500/40 text-emerald-300 bg-emerald-950/20", unselColor: "text-slate-400" },
                { id: "claude", name: "🧠 أنثروبيك كلود (Claude 3.5 Sonnet)", desc: "التدقيق الأمني والأكاديمي والمنطق البرمجي والمنهجي", color: "border-amber-500/40 text-amber-300 bg-amber-950/20", unselColor: "text-slate-400" }
              ].map(model => {
                const isSelected = ysfModelType === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      setYsfModelType(model.id as any);
                      triggerToast(`تم تفعيل وتحويل المحاكي الذكي لـ ${model.name}`);
                    }}
                    className={`cursor-pointer p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
                      isSelected ? model.color : "bg-slate-950/50 border-slate-855 hover:bg-slate-950"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold">{model.name}</span>
                      <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-amber-400 animate-ping" : "bg-slate-800"}`} />
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-1 font-semibold">{model.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* suggestion chips selection and chat space */}
            <div className="space-y-4">
              <div className="space-y-1.5 text-right text-[10px]">
                <span className="text-slate-500 block font-bold font-sans">اختر موضوع للتجربة السريعة والمحاكاة:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "شرح نظام السير الأكاديمي والساعات المعتمدة في SGU وحساب الـ GPA",
                    "ابني لي خطة اختبار برمجية بلغة بايثون للتحقق من RFID البوابات",
                    "تلخيص متطلبات مشاريع تخرج الذكاء الاصطناعي مع يوسف خالد مع لوائح الاعتماد",
                    "اكتب لي مسودة بريد إلكتروني رسمي لطلب إعفاء وتأجيل المصروفات من عميد الكلية"
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendYsfChat(chip)}
                      disabled={ysfChatLoading}
                      className="cursor-pointer bg-slate-950 text-slate-350 hover:bg-slate-850 hover:text-slate-100 px-3 py-1.5 rounded-lg border border-slate-855 text-[10px] transition text-right font-semibold"
                    >
                      ✨ {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Canvas console console */}
              <div className="border border-slate-850 rounded-2xl bg-slate-950 flex flex-col h-[380px] overflow-hidden">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-slate-500 font-mono font-bold">
                      ACTIVE AI SESSION: {ysfModelType.toUpperCase()} MODE
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setYsfChatHistory([
                        { role: "model", text: "تم إعادة تهيئة ذكاء يوسف المساعد الأكاديمي وإخلاء الذاكرة بنجاح." }
                      ]);
                      triggerToast("تم تصفير المحادثة");
                    }}
                    className="cursor-pointer text-[9px] text-slate-500 hover:text-rose-450 font-bold transition font-sans"
                  >
                    تفريغ المحادثة 🗑️
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col scrollbar-thin text-xs">
                  {ysfChatHistory.map((chat, idx) => {
                    const isUser = chat.role === "user";
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[85%] p-3 rounded-2xl leading-relaxed font-semibold ${
                          isUser
                            ? "self-start text-left bg-slate-900 border border-slate-800 text-slate-202"
                            : "self-end text-right bg-slate-900/40 border border-slate-850 text-slate-100"
                        }`}
                      >
                        <span className="text-[8.5px] text-slate-500 font-mono mb-1 leading-none">
                          {isUser ? "أنت (طالب/أستاذ)" : `مساعد الذكاء الاصطناعي - ${ysfModelType.toUpperCase()}`}
                        </span>
                        <div className="whitespace-pre-wrap">{chat.text}</div>
                      </div>
                    );
                  })}
                  {ysfChatLoading && (
                    <div className="self-end bg-slate-900/20 text-slate-450 text-[11px] p-3 rounded-xl border border-slate-850 animate-pulse text-right w-44">
                      ⏳ جاري معالجة الكلمات وتوليد الرد...
                    </div>
                  )}
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendYsfChat();
                  }}
                  className="bg-slate-900 p-2.5 border-t border-slate-850 flex gap-2"
                >
                  <button
                    type="submit"
                    disabled={ysfChatLoading}
                    className="cursor-pointer bg-amber-500 hover:bg-amber-605 text-slate-950 font-black px-4.5 py-2 rounded-xl text-xs transition"
                  >
                    إرسال
                  </button>
                  <input
                    type="text"
                    placeholder="اكتب استفسارك عن اللوائح وموازنات السكن والمواد هنا..."
                    value={ysfChatInput}
                    onChange={e => setYsfChatInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-xl text-xs text-right text-slate-200 outline-none outline-0"
                  />
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 12: QUALITY ASSURANCE (CRITICAL AUDIT & BLOCKS) */}
        {activeSystemTab === "qa" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <span className="text-xs font-bold font-mono text-violet-400">DATABASE INTEGRITY & ACCREDITATION</span>
              <h4 className="text-sm font-black text-slate-200">تدقيق مراجعات الجودة وسجلات التعديل لمنع تلاعب الدرجات والأقساط</h4>
            </div>

            <p className="text-xs text-slate-500 font-semibold leading-relaxed text-right">
              يرصد هذا المحور الاستراتيجي سجلات التعديل والتغيرات بالدرجات بأسلوب التوقيع الرياضي (SHA-256 block hashes) لضمان عدم تسريب الفواتير أو العبث باللوائح الأكاديمية بالتحول الرقمي لـ SGU.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* NAQAAE checklist and standard */}
              <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4 text-right">
                <span className="text-xs font-bold text-slate-200 block border-b border-slate-900 pb-1.5">معايير ومتطلبات جودة الهيئة القومية للاعتماد بمصر (NAQAAE):</span>
                
                <div className="space-y-3.5">
                  {naqaaeChecklist.map(chk => (
                    <div key={chk.id} className="flex items-start gap-2.5 text-xs text-right leading-relaxed text-slate-350">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] ${
                        chk.status === "completed" ? "bg-emerald-600" : "bg-amber-600 animate-pulse"
                      }`}>
                        {chk.status === "completed" ? "✓" : "!"}
                      </span>
                      <p className="font-semibold">{chk.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mutation Audit list */}
              <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4 text-right">
                <span className="text-xs font-bold text-slate-350 block border-b border-slate-900 pb-1.5">أحدث حزم التعديل الأكاديمي والمالي الموقعة (Critical Cryptographic Audit):</span>
                
                <div className="border border-slate-800 rounded-xl overflow-hidden text-[10.5px]">
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">المرجع</th>
                        <th className="p-2.5">المشرف</th>
                        <th className="p-2.5">العملية الإدارية</th>
                        <th className="p-2.5 text-center">التصنيف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300 font-semibold font-sans">
                      {auditLogs.map(log => (
                        <tr
                          key={log.id}
                          onClick={() => {
                            setActiveAuditInspector(log);
                            triggerToast(`تم تفكيك كود ومصدقة السجل المالي: ${log.id}`);
                          }}
                          className="hover:bg-slate-920 cursor-pointer transition"
                        >
                          <td className="p-2.5 font-mono text-purple-400">{log.id}</td>
                          <td className="p-2.5 text-slate-400 font-bold">{log.user}</td>
                          <td className="p-2.5 truncate max-w-44 block">{log.action}</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              log.level === "EMERGENCY" ? "bg-rose-500/10 text-rose-455" : log.level === "WARNING" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-400"
                            }`}>
                              {log.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Crypto block details details */}
                {activeAuditInspector && (
                  <div className="bg-slate-900/60 p-4 border border-violet-500/30 rounded-xl space-y-2 text-right animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1 text-[10.5px]">
                      <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-900/30 px-2 py-0.2 rounded font-mono font-bold">
                        BLOCK DEBUGGER: {activeAuditInspector.id}
                      </span>
                      <button
                        onClick={() => setActiveAuditInspector(null)}
                        className="cursor-pointer text-[10px] text-slate-500 hover:text-slate-200"
                      >
                        إغلاق ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-semibold mt-1">
                      <div className="bg-slate-950 p-2 rounded">
                        <span className="text-slate-500">البصمة الموقعة (SHA-256 Block Hash):</span>
                        <code className="text-purple-400 block truncate mt-0.5">{activeAuditInspector.hash}3adff8bc41cc29</code>
                      </div>
                      <div className="bg-slate-950 p-2 rounded">
                        <span className="text-slate-500">حالة التثبت المالي والمنهجي:</span>
                        <strong className="text-emerald-450 block mt-0.5">🟢 سجل سليم ومعتمد برمجياً</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {activeSystemTab === "gdrive_picker" && (
          <div className="space-y-6 animate-fadeIn">
            <SguGoogleDrivePicker 
              onAttachFile={(file) => triggerToast(`📂 تم مزامة وربط مستند: ${file.name}`)} 
              addSystemLog={(msg) => triggerToast(msg)} 
              activeCollegeName="منظومة SGU"
            />
          </div>
        )}

        {activeSystemTab === "engineering_hub" && (
          <div className="space-y-6 animate-fadeIn">
            <SguEngineeringHub
              lang={erpLang}
              dbUsers={dbUsersState}
              setDbUsers={setDbUsersState}
              applications={applications}
              setApplications={setApplications}
              triggerSystemPush={(title, msg) => triggerToast(`${title}: ${msg}`)}
              addLog={(msg) => triggerToast(msg)}
            />
          </div>
        )}

        {activeSystemTab in advancedModuleMap && (
          <SguAdvancedSuite dbUsers={dbUsers} initialModuleId={advancedModuleMap[activeSystemTab]} />
        )}

      </div>
    </div>
  );
}
