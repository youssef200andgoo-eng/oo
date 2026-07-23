import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  GraduationCap,
  Eye,
  Settings,
  Cpu,
  BookOpen,
  Award,
  BarChart3,
  ClipboardList,
  Fingerprint,
  Activity,
  Globe2,
  Briefcase,
  Users,
  MapPin,
  FlaskConical,
  QrCode,
  LineChart,
  MessageSquare,
  Vote,
  Compass,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  FileText,
  AlertTriangle,
  UserCheck,
  Plus,
  Search,
  ChevronRight,
  TrendingUp,
  Download,
  Flame,
  Lightbulb,
  Building2,
  Calendar,
  Layers,
  HeartHandshake,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Navigation,
  Database,
  Lock,
  Smartphone,
  RefreshCw,
  FileCheck,
  Trash2,
  ListFilter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import {
  SGU_RBAC_ROLES,
  getRoleMetadata,
  hasPermission,
  SguAuditLogger,
  SguRoleType,
  SguPermission,
  SecurityAuditLog
} from "../utils/rbac";

interface SguAdvancedSuiteProps {
  dbUsers: any[];
  initialModuleId?: number;
}

export default function SguAdvancedSuite({ dbUsers, initialModuleId }: SguAdvancedSuiteProps) {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  // =========================================================================
  // STAGE 2: RBAC & AUTHENTICATION STATE
  // =========================================================================
  const [activeRole, setActiveRole] = useState<SguRoleType>("Super Admin");
  const [customRolesList, setCustomRolesList] = useState(SGU_RBAC_ROLES);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => SguAuditLogger.getLogs());
  const [searchAuditQuery, setSearchAuditQuery] = useState("");
  const [toastText, setToastText] = useState<string | null>(null);

  const triggerLocalToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3000);
  };

  // Log role changes
  const handleRoleChange = (role: SguRoleType) => {
    setActiveRole(role);
    SguAuditLogger.log(
      "SYS_DEMO_USER",
      "يوسف شريف الكردي",
      role,
      "LOGIN",
      `تم تبديل الجلسة النشطة إلى دور: ${getRoleMetadata(role).nameAr}`,
      `Active session switched to role: ${getRoleMetadata(role).nameEn}`,
      "SUCCESS"
    );
    setAuditLogs(SguAuditLogger.getLogs());
    triggerLocalToast(
      lang === "ar" 
        ? `تم الانتقال لصلاحيات: ${getRoleMetadata(role).nameAr}` 
        : `Switched to role: ${getRoleMetadata(role).nameEn}`
    );
  };

  // Toggle role permissions (Admin Policy Tuner)
  const handleTogglePermission = (roleId: SguRoleType, permission: SguPermission) => {
    if (!hasPermission(activeRole, "manage_rbac_roles")) {
      logUnauthorizedAttempt("manage_rbac_roles", `تعديل صلاحية ${permission} لدور ${roleId}`);
      triggerLocalToast(lang === "ar" ? "❌ غير مصرح لك بتعديل سياسات الـ RBAC" : "❌ Unauthorized to alter RBAC policies");
      return;
    }

    setCustomRolesList(prev => prev.map(r => {
      if (r.id === roleId) {
        const exists = r.permissions.includes(permission);
        const updatedPermissions = exists
          ? r.permissions.filter(p => p !== permission)
          : [...r.permissions, permission];
        
        SguAuditLogger.log(
          "SYS_ADMIN_USER",
          "مشرف النظام المعتمد",
          activeRole,
          "ROLE_UPDATE",
          `تم ${exists ? 'إلغاء' : 'منح'} صلاحية [${permission}] للدور [${r.nameAr}]`,
          `Security permission [${permission}] was ${exists ? 'removed from' : 'granted to'} role [${r.nameEn}]`,
          "SUCCESS"
        );
        return { ...r, permissions: updatedPermissions };
      }
      return r;
    }));
    setAuditLogs(SguAuditLogger.getLogs());
    triggerLocalToast(lang === "ar" ? "✅ تم تحديث السياسات الأمنية للـ RBAC بنجاح" : "✅ RBAC security policies updated successfully");
  };

  // Log unauthorized access attempt helper
  const logUnauthorizedAttempt = (permission: SguPermission, actionDesc: string) => {
    SguAuditLogger.log(
      "SYS_DEMO_USER",
      "يوسف شريف الكردي",
      activeRole,
      "UNAUTHORIZED_ATTEMPT",
      `محاولة غير مصرح بها للقيام بـ [${actionDesc}] دون امتلاك صلاحية [${permission}]`,
      `Unauthorized attempt to execute [${actionDesc}] without [${permission}] permission`,
      "BLOCKED"
    );
    setAuditLogs(SguAuditLogger.getLogs());
  };

  // Filter audit logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const query = searchAuditQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(query) ||
        log.userId.toLowerCase().includes(query) ||
        log.role.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.detailsAr.toLowerCase().includes(query) ||
        log.detailsEn.toLowerCase().includes(query)
      );
    });
  }, [auditLogs, searchAuditQuery]);

  // =========================================================================
  // STAGE 3: CORE ACADEMIC SYSTEM STATE
  // =========================================================================
  const sguColleges = [
    { id: "fcis", nameAr: "كلية الحاسبات والمعلومات", nameEn: "Faculty of Computer & Information Sciences", depts: ["Computer Science", "Software Engineering", "Artificial Intelligence"], programs: ["AI & Data Science B.Sc.", "Software Engineering B.Sc."], requiredHours: 140, avgGpa: 3.42 },
    { id: "med", nameAr: "كلية الطب البشري", nameEn: "Faculty of Medicine", depts: ["Anatomy", "Pediatrics", "Cardiology"], programs: ["Bachelor of Medicine & Surgery (MBBCh)"], requiredHours: 220, avgGpa: 3.75 },
    { id: "phr", nameAr: "كلية الصيدلة", nameEn: "Faculty of Pharmacy", depts: ["Pharmaceutics", "Pharmacology"], programs: ["PharmD (Clinical)"], requiredHours: 175, avgGpa: 3.61 },
    { id: "den", nameAr: "كلية طب الأسنان", nameEn: "Faculty of Dentistry", depts: ["Orthodontics", "Oral Surgery"], programs: ["BDS (Dental Surgery)"], requiredHours: 180, avgGpa: 3.68 },
    { id: "pt", nameAr: "كلية العلاج الطبيعي", nameEn: "Faculty of Physical Therapy", depts: ["Neuromuscular Physical Therapy", "Orthopedic Rehabilitation"], programs: ["Doctor of Physical Therapy (DPT)"], requiredHours: 165, avgGpa: 3.52 },
    { id: "nur", nameAr: "كلية التمريض", nameEn: "Faculty of Nursing", depts: ["Critical Care Nursing", "Midwifery"], programs: ["B.Sc. in Nursing"], requiredHours: 145, avgGpa: 3.21 },
    { id: "bus", nameAr: "كلية إدارة الأعمال", nameEn: "Faculty of Business Administration", depts: ["Accounting", "Marketing", "Management Information Systems (MIS)"], programs: ["BBA in Accounting", "BBA in MIS"], requiredHours: 135, avgGpa: 3.15 }
  ];

  // Academics student directory & profiles
  const [students, setStudents] = useState([
    { id: "SGU-10045", nameAr: "يوسف شريف الكردي", nameEn: "Youssef El-Kurdy", level: "المستوى الرابع", major: "ذكاء اصطناعي", college: "fcis", gpa: 3.84, cgpa: 3.79, completedHours: 114, requiredHours: 140, advisor: "د. شريف يسري", status: "مستمر", registeredCourses: ["CS102", "AI402"] },
    { id: "SGU-10046", nameAr: "سارة محمود زكريا", nameEn: "Sarah Mahmoud", level: "المستوى الثالث", major: "علوم حاسب", college: "fcis", gpa: 3.45, cgpa: 3.52, completedHours: 85, requiredHours: 140, advisor: "أ.د منال الديب", status: "مستمر", registeredCourses: ["CS102", "MA201"] },
    { id: "SGU-10047", nameAr: "أحمد سيد عبد العال", nameEn: "Ahmed Sayed", level: "المستوى الأول", major: "عام", college: "fcis", gpa: 2.12, cgpa: 2.30, completedHours: 24, requiredHours: 140, advisor: "د. هاني عسكر", status: "تحت الإنذار الأكاديمي", registeredCourses: ["CS101"] }
  ]);
  const [selectedStudentId, setSelectedStudentId] = useState("SGU-10045");
  const activeStudent = useMemo(() => students.find(s => s.id === selectedStudentId) || students[0], [students, selectedStudentId]);

  // All core courses dictionary
  const [coursesDict, setCoursesDict] = useState([
    { code: "CS101", nameAr: "أساسيات البرمجة", nameEn: "Fundamentals of Programming", credits: 3, prereq: [] },
    { code: "CS102", nameAr: "هياكل البيانات واللوغاريتمات", nameEn: "Data Structures & Algorithms", credits: 3, prereq: ["CS101"] },
    { code: "MA201", nameAr: "الرياضيات المتقطعة لعلوم الحاسب", nameEn: "Discrete Mathematics", credits: 3, prereq: [] },
    { code: "AI402", nameAr: "النظم الخبيرة والذكاء الاصطناعي", nameEn: "Expert Systems & AI", credits: 4, prereq: ["CS102"] },
    { code: "IS301", nameAr: "منظومة قواعد البيانات وإدارة الملفات", nameEn: "Database Systems", credits: 3, prereq: ["CS101"] },
    { code: "HU111", nameAr: "حقوق الإنسان والقوانين العامة", nameEn: "Human Rights & Laws", credits: 2, prereq: [] }
  ]);

  // Grade lists
  const [studentGrades, setStudentGrades] = useState([
    { studentId: "SGU-10045", courseCode: "CS101", grade: 95, letter: "A" },
    { studentId: "SGU-10045", courseCode: "MA201", grade: 88, letter: "B+" },
    { studentId: "SGU-10046", courseCode: "CS101", grade: 91, letter: "A-" },
    { studentId: "SGU-10047", courseCode: "CS101", grade: 55, letter: "D" }
  ]);

  // Selected course for grade entry
  const [gradingCourse, setGradingCourse] = useState("CS102");
  const [entryGradeInput, setEntryGradeInput] = useState<{[key: string]: number}>({});

  const handleSaveGrade = (studentId: string, score: number) => {
    if (!hasPermission(activeRole, "edit_grades")) {
      logUnauthorizedAttempt("edit_grades", `رصد درجات لمقرر ${gradingCourse} للطالب ${studentId}`);
      triggerLocalToast(lang === "ar" ? "❌ ليس لديك صلاحية تعديل أو رصد الدرجات" : "❌ No permission to enter grades");
      return;
    }

    let letter = "F";
    if (score >= 90) letter = "A";
    else if (score >= 85) letter = "A-";
    else if (score >= 80) letter = "B+";
    else if (score >= 75) letter = "B";
    else if (score >= 70) letter = "B-";
    else if (score >= 65) letter = "C+";
    else if (score >= 60) letter = "C";
    else if (score >= 50) letter = "D";

    // Update grades list
    setStudentGrades(prev => {
      const filtered = prev.filter(g => !(g.studentId === studentId && g.courseCode === gradingCourse));
      return [...filtered, { studentId, courseCode: gradingCourse, grade: score, letter }];
    });

    // Recalculate GPA for student
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        // Simple recalculation of GPA
        const currentScorePoints = score >= 90 ? 4.0 : score >= 85 ? 3.7 : score >= 80 ? 3.3 : score >= 70 ? 2.7 : 2.0;
        const newCgpa = parseFloat(((s.cgpa * 9 + currentScorePoints) / 10).toFixed(2));
        return { ...s, gpa: currentScorePoints, cgpa: newCgpa };
      }
      return s;
    }));

    SguAuditLogger.log(
      "SYS_FACULTY_USER",
      "أ.د. محمد الشافعي",
      activeRole,
      "GRADE_CHANGE",
      `رصد درجة (${score}) بتقدير (${letter}) للطالب ${studentId} بمقرر ${gradingCourse}`,
      `Grade of (${score}) [${letter}] entered for student ${studentId} in course ${gradingCourse}`,
      "SUCCESS"
    );
    setAuditLogs(SguAuditLogger.getLogs());
    triggerLocalToast(lang === "ar" ? "✅ تم رصد وحفظ الدرجة وإعادة حساب المعدلات" : "✅ Grade recorded and GPA recalculated successfully");
  };

  // Add/Drop Courses
  const handleAddDropCourse = (studentId: string, courseCode: string, action: "add" | "drop") => {
    if (!hasPermission(activeRole, "add_drop_courses")) {
      logUnauthorizedAttempt("add_drop_courses", `${action === "add" ? "إضافة" : "حذف"} مقرر ${courseCode} للطالب ${studentId}`);
      triggerLocalToast(lang === "ar" ? "❌ ليس لديك صلاحية تسجيل أو حذف المواد" : "❌ No permission for Add/Drop");
      return;
    }

    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    if (action === "add") {
      // Prerequisite check
      const courseMeta = coursesDict.find(c => c.code === courseCode);
      if (courseMeta && courseMeta.prereq.length > 0) {
        const missingPrereqs = courseMeta.prereq.filter(pCode => {
          // Check if they completed it with non-F grade
          const passed = studentGrades.some(g => g.studentId === studentId && g.courseCode === pCode && g.grade >= 50);
          return !passed;
        });

        if (missingPrereqs.length > 0) {
          triggerLocalToast(
            lang === "ar" 
              ? `❌ خطأ في المتطلبات السابقة: يجب اجتياز مقرر ${missingPrereqs.join(", ")} أولاً` 
              : `❌ Prerequisite Error: You must pass ${missingPrereqs.join(", ")} first`
          );
          return;
        }
      }

      // Check credit hour caps
      const totalHoursRegistered = targetStudent.registeredCourses.reduce((sum, cId) => {
        const cMeta = coursesDict.find(c => c.code === cId);
        return sum + (cMeta?.credits || 0);
      }, 0);

      const addedCourseCredits = courseMeta?.credits || 0;
      if (totalHoursRegistered + addedCourseCredits > 18) {
        triggerLocalToast(
          lang === "ar" 
            ? "❌ خطأ في الساعات المعتمدة: لا يمكن تسجيل أكثر من 18 ساعة أسبوعياً" 
            : "❌ Credit Limit Error: Maximum 18 credit hours per semester exceeded"
        );
        return;
      }

      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          if (s.registeredCourses.includes(courseCode)) return s;
          return { ...s, registeredCourses: [...s.registeredCourses, courseCode] };
        }
        return s;
      }));

      SguAuditLogger.log(
        "SYS_ACADEMIC_REG",
        "مسؤول التسجيل الأكاديمي",
        activeRole,
        "COURSE_REGISTRATION",
        `تسجيل مقرر جديد (${courseCode}) للطالب ${studentId}`,
        `Registered course (${courseCode}) for student ${studentId}`,
        "SUCCESS"
      );
    } else {
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          return { ...s, registeredCourses: s.registeredCourses.filter(c => c !== courseCode) };
        }
        return s;
      }));

      SguAuditLogger.log(
        "SYS_ACADEMIC_REG",
        "مسؤول التسجيل الأكاديمي",
        activeRole,
        "COURSE_REGISTRATION",
        `إسقاط/حذف مقرر (${courseCode}) للطالب ${studentId}`,
        `Dropped course (${courseCode}) for student ${studentId}`,
        "SUCCESS"
      );
    }

    setAuditLogs(SguAuditLogger.getLogs());
    triggerLocalToast(
      lang === "ar" 
        ? "✅ تم تعديل قائمة المقررات الدراسية بنجاح" 
        : "✅ Course list updated successfully"
    );
  };

  // Academic Advising recommendations
  const [advisingNotes, setAdvisingNotes] = useState([
    { id: "1", studentId: "SGU-10045", date: "2026-07-01", advisor: "د. شريف يسري", noteAr: "الطالب متميز ومستمر في الحفاظ على المعدل التراكمي المرتفع. يُوصى بالتسجيل بمجموع الساعات الأقصى 18.", noteEn: "Excellent student maintaining high CGPA. Recommending maximum credit limit registration.", status: "approved" }
  ]);
  const [newAdvNoteAr, setNewAdvNoteAr] = useState("");
  const [newAdvNoteEn, setNewAdvNoteEn] = useState("");

  const handleAddAdvising = () => {
    if (!hasPermission(activeRole, "view_advising")) {
      logUnauthorizedAttempt("view_advising", `إدخال تقرير إرشاد أكاديمي للطالب ${selectedStudentId}`);
      triggerLocalToast(lang === "ar" ? "❌ ليس لديك صلاحية كتابة تقرير إرشاد" : "❌ No permission for academic advising");
      return;
    }

    if (!newAdvNoteAr.trim() || !newAdvNoteEn.trim()) {
      triggerLocalToast(lang === "ar" ? "يرجى تعبئة كلا الحقلين" : "Please fill both text fields");
      return;
    }

    const newAd = {
      id: String(Date.now()),
      studentId: selectedStudentId,
      date: new Date().toISOString().split("T")[0],
      advisor: activeStudent.advisor,
      noteAr: newAdvNoteAr,
      noteEn: newAdvNoteEn,
      status: "approved"
    };

    setAdvisingNotes([newAd, ...advisingNotes]);
    setNewAdvNoteAr("");
    setNewAdvNoteEn("");
    triggerLocalToast(lang === "ar" ? "✅ تم حفظ وإرسال تقرير الإرشاد للفرقة" : "✅ Advising recommendation saved successfully");
  };

  // =========================================================================
  // STAGE 4: COMPREHENSIVE ATTENDANCE SYSTEM STATE
  // =========================================================================
  const [activeSessionCourse, setActiveSessionCourse] = useState("AI402");
  const [activeQrCode, setActiveQrCode] = useState<string | null>(null);
  const [qrTimer, setQrTimer] = useState(0);
  const [liveScannedStudents, setLiveScannedStudents] = useState<any[]>([]);
  const qrIntervalRef = useRef<any>(null);

  // Student device emulator states
  const [simulatedGps, setSimulatedGps] = useState<"inside" | "outside">("inside");
  const [faceAuthPhotoVerified, setFaceAuthPhotoVerified] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [nfcTagDetected, setNfcTagDetected] = useState(false);
  const [studentScanFeedback, setStudentScanFeedback] = useState<string | null>(null);

  // Generate QR code for lecture
  const handleGenerateQr = () => {
    if (!hasPermission(activeRole, "create_lecture_qr")) {
      logUnauthorizedAttempt("create_lecture_qr", `توليد رمز حضور QR لمادة ${activeSessionCourse}`);
      triggerLocalToast(lang === "ar" ? "❌ غير مصرح لك بتوليد حضور المحاضرات" : "❌ Unauthorized to generate QR codes");
      return;
    }

    // Cryptographic signature simulation
    const timestamp = Date.now();
    const signature = `SGU-SECURE-QR-${activeSessionCourse}-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setActiveQrCode(signature);
    setQrTimer(60);

    // Reset list
    setLiveScannedStudents([]);

    SguAuditLogger.log(
      "SYS_LECTURER",
      "أ.د. محمد الشافعي",
      activeRole,
      "create_lecture_qr" as any,
      `إنشاء رمز حضور QR ذكي مشفر وتفعيل عدّاد البث لمادة ${activeSessionCourse}`,
      `Generated secure cryptographic QR code session and active listener for ${activeSessionCourse}`,
      "SUCCESS"
    );
    setAuditLogs(SguAuditLogger.getLogs());

    if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
    qrIntervalRef.current = setInterval(() => {
      setQrTimer(prev => {
        if (prev <= 1) {
          clearInterval(qrIntervalRef.current);
          setActiveQrCode(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    triggerLocalToast(lang === "ar" ? "⚡ تم إنشاء جلسة حضور QR نشطة ومؤمنة بـ 60 ثانية" : "⚡ Active 60s cryptographic QR code generated successfully");
  };

  // Simulate instant background scans
  const simulateRandomScans = () => {
    if (!activeQrCode) {
      triggerLocalToast(lang === "ar" ? "الرجاء توليد رمز الـ QR أولاً" : "Please generate QR session first");
      return;
    }

    const namesAr = ["أحمد ممدوح سليمان", "فاطمة عبد الرحمن", "مصطفى الجندي", "مريم القاضي", "رنا الشافعي"];
    const namesEn = ["Ahmed Mamdouh", "Fatma Abdelrahman", "Mostafa El-Gendy", "Maryam El-Qadi", "Rana El-Shafei"];
    const ids = ["SGU-10088", "SGU-10112", "SGU-10190", "SGU-10255", "SGU-10304"];

    const currentCount = liveScannedStudents.length;
    if (currentCount >= ids.length) {
      triggerLocalToast(lang === "ar" ? "تمت محاكاة جميع الحضور المتاحين" : "All available student simulations completed");
      return;
    }

    const nextStudent = {
      id: ids[currentCount],
      nameAr: namesAr[currentCount],
      nameEn: namesEn[currentCount],
      time: new Date().toLocaleTimeString("ar-EG"),
      gpsStatus: "داخل الحيز المعين (1.4m)",
      authType: Math.random() > 0.5 ? "NFC / RFID SmartCard" : "QR Mobile Scan & Face ID",
      coordinates: "30.4150 N, 31.8123 E"
    };

    setLiveScannedStudents(prev => [...prev, nextStudent]);

    SguAuditLogger.log(
      nextStudent.id,
      nextStudent.nameAr,
      "Student",
      "ATTENDANCE_SUBMIT",
      `تسجيل حضور الطالب ${nextStudent.nameAr} بنجاح عبر (${nextStudent.authType}) وبإحداثيات GPS سليمة`,
      `Attendance logged for student ${nextStudent.nameEn} via (${nextStudent.authType}) with verified GPS coordinates`,
      "SUCCESS"
    );
    setAuditLogs(SguAuditLogger.getLogs());
    triggerLocalToast(lang === "ar" ? `🟢 تم تسجيل حضور الطالب: ${nextStudent.nameAr}` : `🟢 Registered attendance: ${nextStudent.nameEn}`);
  };

  // Student device manual scan simulator
  const handleStudentSelfScan = () => {
    if (!activeQrCode) {
      setStudentScanFeedback(lang === "ar" ? "❌ لا توجد محاضرة نشطة أو رمز الـ QR منتهي الصلاحية" : "❌ No active session found or QR code expired");
      return;
    }

    // Check GPS limits
    if (simulatedGps === "outside") {
      setStudentScanFeedback(
        lang === "ar" 
          ? "⚠️ فشل التحقق الجغرافي: أنت خارج نطاق المدرج بأكثر من 250 متراً!" 
          : "⚠️ GPS Verification Failed: You are 250m outside the lecture room!"
      );
      SguAuditLogger.log(
        "SGU-10045",
        "يوسف شريف الكردي",
        "Student",
        "ATTENDANCE_SUBMIT",
        "فشل تسجيل حضور الطالب بمقرر الذكاء بسبب خروج إحداثيات الـ GPS عن نطاق البث المدرج",
        "GPS validation failed. Student coordinates placed outside lecture hall radial boundaries",
        "BLOCKED"
      );
      setAuditLogs(SguAuditLogger.getLogs());
      return;
    }

    // Check biometric
    if (!faceAuthPhotoVerified) {
      setStudentScanFeedback(
        lang === "ar" 
          ? "⚠️ يرجى التقاط ومطابقة البصمة الحيوية للوجه قبل تأكيد المسح" 
          : "⚠️ Please match biometric Face Recognition before scanning"
      );
      return;
    }

    // Success check
    const alreadyScanned = liveScannedStudents.some(s => s.id === "SGU-10045");
    if (alreadyScanned) {
      setStudentScanFeedback(lang === "ar" ? "⚠️ لقد قمت بتسجيل حضورك مسبقاً في هذه الجلسة" : "⚠️ Attendance already logged for this session");
      return;
    }

    const selfStudent = {
      id: "SGU-10045",
      nameAr: "يوسف شريف الكردي",
      nameEn: "Youssef El-Kurdy",
      time: new Date().toLocaleTimeString("ar-EG"),
      gpsStatus: "داخل الحيز المعين (0.2m)",
      authType: "QR Scan & Face Recognition Checked",
      coordinates: "30.4151 N, 31.8122 E"
    };

    setLiveScannedStudents(prev => [...prev, selfStudent]);
    setStudentScanFeedback(lang === "ar" ? "✅ تم تسجيل الحضور ومطابقة الوجه والـ GPS بنجاح!" : "✅ Attendance logged, face verified and GPS confirmed successfully!");

    SguAuditLogger.log(
      "SGU-10045",
      "يوسف شريف الكردي",
      "Student",
      "ATTENDANCE_SUBMIT",
      `تسجيل الحضور الذاتي لمقرر ${activeSessionCourse} بالتأكيد البيومتري والـ GPS بنجاح`,
      `Self attendance recorded for ${activeSessionCourse} with full GPS & biometric verification`,
      "SUCCESS"
    );
    setAuditLogs(SguAuditLogger.getLogs());
  };

  // Perform face simulation match
  const handleFaceScanSim = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setFaceAuthPhotoVerified(true);
      setIsBiometricScanning(false);
      triggerLocalToast(lang === "ar" ? "🟢 تم التحقق من الوجه ومطابقة الهوية بنسبة 99.4%" : "🟢 Face matched successfully at 99.4% confidence");
    }, 1500);
  };

  // Simulated static stats for charts
  const absenceReportStats = [
    { name: "FCIS", rate: 4.8, attended: 95.2 },
    { name: "MED", rate: 2.1, attended: 97.9 },
    { name: "PHR", rate: 3.5, attended: 96.5 },
    { name: "DEN", rate: 3.1, attended: 96.9 },
    { name: "PT", rate: 5.4, attended: 94.6 },
    { name: "NUR", rate: 6.2, attended: 93.8 },
    { name: "BUS", rate: 8.5, attended: 91.5 }
  ];

  // Warning lists
  const absenceWarningStudents = [
    { id: "SGU-10047", nameAr: "أحمد سيد عبد العال", college: "حاسبات", absenceRate: "22%", lecturesMissed: 4, action: "إنذار أول موجه للبريد الإلكتروني" },
    { id: "SGU-10118", nameAr: "ميادة أحمد شاهين", college: "طب بشري", absenceRate: "18%", lecturesMissed: 3, action: "تنبيه إلكتروني باللوحة" },
    { id: "SGU-10204", nameAr: "طارق عثمان الجندي", college: "صيدلة", absenceRate: "16%", lecturesMissed: 3, action: "تنبيه إلكتروني باللوحة" }
  ];

  const exportAttendanceCSV = () => {
    triggerLocalToast(lang === "ar" ? "📥 تم تصدير تقرير الغياب الموحد كملف Excel/CSV" : "📥 Exported attendance compliance spreadsheet successfully");
  };

  // Module state tabs
  const [activeTab, setActiveTab] = useState<"rbac" | "academic" | "attendance" | "analytics">("rbac");

  // Sync initialModuleId from SguProSystems to activeTab
  useEffect(() => {
    if (initialModuleId === 7) {
      setActiveTab("analytics");
    } else if (initialModuleId === 1 || initialModuleId === 3 || initialModuleId === 4) {
      setActiveTab("academic");
    } else if (initialModuleId === 2) {
      setActiveTab("attendance");
    }
  }, [initialModuleId]);

  // =========================================================================
  // STAGE 7: EXECUTIVE MANAGEMENT BI, KPI ENGINE & FILTERS
  // =========================================================================
  const [selCollege, setSelCollege] = useState<string>("all");
  const [selDept, setSelDept] = useState<string>("all");
  const [selYear, setSelYear] = useState<string>("2025/2026");
  const [selSemester, setSelSemester] = useState<string>("second");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Departments mapped per college
  const deptsByCollege: Record<string, { id: string; nameAr: string; nameEn: string }[]> = {
    all: [{ id: "all", nameAr: "كل الأقسام والأكاديميات", nameEn: "All Departments" }],
    fcis: [
      { id: "all", nameAr: "كل الأقسام", nameEn: "All Departments" },
      { id: "cs", nameAr: "علوم الحاسب (CS)", nameEn: "Computer Science" },
      { id: "se", nameAr: "هندسة البرمجيات (SE)", nameEn: "Software Engineering" },
      { id: "ai", nameAr: "الذكاء الاصطناعي (AI)", nameEn: "Artificial Intelligence" }
    ],
    med: [
      { id: "all", nameAr: "كل الأقسام", nameEn: "All Departments" },
      { id: "anat", nameAr: "التشريح وعلم الأنسجة", nameEn: "Anatomy" },
      { id: "peds", nameAr: "طب الأطفال", nameEn: "Pediatrics" },
      { id: "cardio", nameAr: "أمراض القلب والأوعية", nameEn: "Cardiology" }
    ],
    phr: [
      { id: "all", nameAr: "كل الأقسام", nameEn: "All Departments" },
      { id: "pharmaceutics", nameAr: "الصيدلانيات وتكنولوجيا الدواء", nameEn: "Pharmaceutics" },
      { id: "pharmacology", nameAr: "علم الأدوية والسموم", nameEn: "Pharmacology" }
    ],
    den: [
      { id: "all", nameAr: "كل الأقسام", nameEn: "All Departments" },
      { id: "ortho", nameAr: "تقويم الأسنان الفيدرالي", nameEn: "Orthodontics" },
      { id: "surgery", nameAr: "جراحة الفم والفكين", nameEn: "Oral Surgery" }
    ],
    pt: [
      { id: "all", nameAr: "كل الأقسام", nameEn: "All Departments" },
      { id: "neuro", nameAr: "العلاج الطبيعي للجهاز العصبي", nameEn: "Neuromuscular" },
      { id: "orthopedics", nameAr: "تأهيل العظام والكسور", nameEn: "Orthopedics" }
    ],
    nur: [
      { id: "all", nameAr: "كل الأقسام", nameEn: "All Departments" },
      { id: "critical", nameAr: "تمريض العناية الحرجة والطوارئ", nameEn: "Critical Care" },
      { id: "midwifery", nameAr: "تمريض التوليد والقبالة", nameEn: "Midwifery" }
    ],
    bus: [
      { id: "all", nameAr: "كل الأقسام", nameEn: "All Departments" },
      { id: "accounting", nameAr: "المحاسبة والمراجعة", nameEn: "Accounting" },
      { id: "marketing", nameAr: "التسويق والتجارة الرقمية", nameEn: "Marketing" },
      { id: "mis", nameAr: "نظم المعلومات الإدارية (MIS)", nameEn: "MIS" }
    ]
  };

  // Dynamically compute KPIs based on Active Filters
  const statsSummary = useMemo(() => {
    let baseStudents = 24152;
    let baseFaculty = 1280;
    let baseStaff = 840;
    let baseSuccessRate = 91.5;
    let baseAttendanceRate = 94.6;
    let baseAvgGpa = 3.48;
    
    let baseCollectedFees = 48500000;
    let baseOutstandingFees = 12300000;
    let baseFacultySalaries = 14200000;
    let baseOperationalBudget = 35000000;

    // College adjustment
    if (selCollege !== "all") {
      switch (selCollege) {
        case "fcis":
          baseStudents = 4820; baseFaculty = 240; baseStaff = 110;
          baseSuccessRate = 93.4; baseAttendanceRate = 95.2; baseAvgGpa = 3.42;
          baseCollectedFees = 12500000; baseOutstandingFees = 2800000;
          baseFacultySalaries = 2900000; baseOperationalBudget = 7500000;
          break;
        case "med":
          baseStudents = 3200; baseFaculty = 380; baseStaff = 160;
          baseSuccessRate = 96.1; baseAttendanceRate = 97.9; baseAvgGpa = 3.75;
          baseCollectedFees = 14200000; baseOutstandingFees = 1900000;
          baseFacultySalaries = 4200000; baseOperationalBudget = 9800000;
          break;
        case "phr":
          baseStudents = 2900; baseFaculty = 180; baseStaff = 95;
          baseSuccessRate = 92.8; baseAttendanceRate = 96.5; baseAvgGpa = 3.61;
          baseCollectedFees = 7800000; baseOutstandingFees = 1600000;
          baseFacultySalaries = 1900000; baseOperationalBudget = 4200000;
          break;
        case "den":
          baseStudents = 2400; baseFaculty = 160; baseStaff = 80;
          baseSuccessRate = 94.2; baseAttendanceRate = 96.9; baseAvgGpa = 3.68;
          baseCollectedFees = 6900000; baseOutstandingFees = 1400000;
          baseFacultySalaries = 1800000; baseOperationalBudget = 3900000;
          break;
        case "pt":
          baseStudents = 2100; baseFaculty = 110; baseStaff = 75;
          baseSuccessRate = 89.6; baseAttendanceRate = 94.6; baseAvgGpa = 3.52;
          baseCollectedFees = 4100000; baseOutstandingFees = 1100000;
          baseFacultySalaries = 1200000; baseOperationalBudget = 2900000;
          break;
        case "nur":
          baseStudents = 1800; baseFaculty = 90; baseStaff = 65;
          baseSuccessRate = 88.2; baseAttendanceRate = 93.8; baseAvgGpa = 3.21;
          baseCollectedFees = 2100000; baseOutstandingFees = 950000;
          baseFacultySalaries = 950000; baseOperationalBudget = 1800000;
          break;
        case "bus":
          baseStudents = 6932; baseFaculty = 120; baseStaff = 155;
          baseSuccessRate = 87.5; baseAttendanceRate = 91.5; baseAvgGpa = 3.15;
          baseCollectedFees = 5000000; baseOutstandingFees = 2650000;
          baseFacultySalaries = 1250000; baseOperationalBudget = 4900000;
          break;
      }
    }

    // Department minor multiplier
    if (selDept !== "all") {
      const colMeta = sguColleges.find(c => c.id === selCollege);
      const divisionsCount = colMeta?.depts.length || 3;
      baseStudents = Math.floor(baseStudents / divisionsCount);
      baseFaculty = Math.floor(baseFaculty / divisionsCount);
      baseStaff = Math.floor(baseStaff / divisionsCount);
      
      baseCollectedFees = Math.floor(baseCollectedFees / divisionsCount);
      baseOutstandingFees = Math.floor(baseOutstandingFees / divisionsCount);
      baseFacultySalaries = Math.floor(baseFacultySalaries / divisionsCount);
      baseOperationalBudget = Math.floor(baseOperationalBudget / divisionsCount);

      if (selDept.includes("ai")) {
        baseAvgGpa = Math.min(4.0, baseAvgGpa + 0.14);
        baseSuccessRate = Math.min(100.0, baseSuccessRate + 1.5);
      } else if (selDept.includes("cs")) {
        baseAvgGpa = Math.max(1.0, baseAvgGpa - 0.04);
      } else if (selDept.includes("accounting")) {
        baseSuccessRate = Math.max(50.0, baseSuccessRate - 3.1);
      }
    }

    // Academic Year shift
    if (selYear === "2024/2025") {
      baseStudents = Math.floor(baseStudents * 0.92);
      baseCollectedFees = Math.floor(baseCollectedFees * 0.91);
    } else if (selYear === "2023/2024") {
      baseStudents = Math.floor(baseStudents * 0.85);
      baseCollectedFees = Math.floor(baseCollectedFees * 0.84);
    }

    // Semester shift
    if (selSemester === "summer") {
      baseStudents = Math.floor(baseStudents * 0.16);
      baseFaculty = Math.floor(baseFaculty * 0.28);
      baseStaff = Math.floor(baseStaff * 0.32);
      baseCollectedFees = Math.floor(baseCollectedFees * 0.14);
      baseOutstandingFees = Math.floor(baseOutstandingFees * 0.08);
      baseFacultySalaries = Math.floor(baseFacultySalaries * 0.22);
      baseOperationalBudget = Math.floor(baseOperationalBudget * 0.18);
      baseAttendanceRate = Math.min(100.0, baseAttendanceRate + 1.8);
    } else if (selSemester === "first") {
      baseAttendanceRate = Math.max(50.0, baseAttendanceRate - 0.7);
    }

    return {
      studentsCount: baseStudents,
      facultyCount: baseFaculty,
      staffCount: baseStaff,
      successRate: parseFloat(baseSuccessRate.toFixed(1)),
      failureRate: parseFloat((100.0 - baseSuccessRate).toFixed(1)),
      attendanceRate: parseFloat(baseAttendanceRate.toFixed(1)),
      absenceRate: parseFloat((100.0 - baseAttendanceRate).toFixed(1)),
      avgGpa: parseFloat(baseAvgGpa.toFixed(2)),
      collectedFees: baseCollectedFees,
      outstandingFees: baseOutstandingFees,
      facultySalaries: baseFacultySalaries,
      operationalBudget: baseOperationalBudget
    };
  }, [selCollege, selDept, selYear, selSemester, sguColleges]);

  // Dynamic Grade Distribution chart data
  const gradeDistributionData = useMemo(() => {
    const total = statsSummary.studentsCount;
    const aPct = statsSummary.avgGpa >= 3.65 ? 0.42 : statsSummary.avgGpa >= 3.45 ? 0.32 : 0.22;
    const bPct = statsSummary.avgGpa >= 3.65 ? 0.35 : statsSummary.avgGpa >= 3.45 ? 0.41 : 0.34;
    const cPct = 0.25;
    const dPct = statsSummary.successRate >= 94 ? 0.03 : 0.08;
    const fPct = statsSummary.failureRate / 100;

    return [
      { name: "A+/A/A-", value: Math.floor(total * aPct), color: "#10b981" },
      { name: "B+/B/B-", value: Math.floor(total * bPct), color: "#0ea5e9" },
      { name: "C+/C/C-", value: Math.floor(total * cPct), color: "#eab308" },
      { name: "D+/D", value: Math.floor(total * dPct), color: "#f97316" },
      { name: "F", value: Math.floor(total * fPct), color: "#ef4444" }
    ];
  }, [statsSummary]);

  // Dynamic semesters trend data
  const semestersTrendData = useMemo(() => {
    const multiplier = statsSummary.avgGpa / 3.48;
    return [
      { semester: lang === "ar" ? "خريف 2024" : "Autumn 2024", gpa: parseFloat((3.36 * multiplier).toFixed(2)), attendance: statsSummary.attendanceRate - 1.4 },
      { semester: lang === "ar" ? "ربيع 2025" : "Spring 2025", gpa: parseFloat((3.41 * multiplier).toFixed(2)), attendance: statsSummary.attendanceRate + 0.6 },
      { semester: lang === "ar" ? "خريف 2025" : "Autumn 2025", gpa: parseFloat((3.45 * multiplier).toFixed(2)), attendance: statsSummary.attendanceRate - 0.2 },
      { semester: lang === "ar" ? "الفصل الحالي" : "Current Semester", gpa: statsSummary.avgGpa, attendance: statsSummary.attendanceRate }
    ];
  }, [statsSummary, lang]);

  // Financial status pie chart data
  const financialPieData = useMemo(() => {
    return [
      { name: lang === "ar" ? "الرسوم المحصلة" : "Collected Fees", value: statsSummary.collectedFees },
      { name: lang === "ar" ? "الرسوم المتبقية" : "Pending Fees", value: statsSummary.outstandingFees }
    ];
  }, [statsSummary, lang]);

  // CSV Data Exporter
  const exportExecutiveCSV = () => {
    let csv = "\uFEFF"; // UTF-8 BOM
    csv += "المؤشر الأكاديمي والمالي,القيمة الفعلية بالـ ERP\n";
    csv += `الكلية المحددة,${selCollege.toUpperCase()}\n`;
    csv += `القسم,${selDept === "all" ? "جميع الأقسام" : selDept.toUpperCase()}\n`;
    csv += `العام الأكاديمي,${selYear}\n`;
    csv += `الفصل الدراسي,${selSemester === "first" ? "الاول" : selSemester === "second" ? "الثاني" : "الصيفي"}\n`;
    csv += `إجمالي الطلاب المقيدين,${statsSummary.studentsCount}\n`;
    csv += `إجمالي أعضاء التدريس,${statsSummary.facultyCount}\n`;
    csv += `إجمالي موظفي الإدارة,${statsSummary.staffCount}\n`;
    csv += `متوسط المعدل التراكمي CGPA,${statsSummary.avgGpa}\n`;
    csv += `نسبة النجاح العامة %,${statsSummary.successRate}\n`;
    csv += `نسبة التعثر الأكاديمي %,${statsSummary.failureRate}\n`;
    csv += `نسبة الحضور الموثق %,${statsSummary.attendanceRate}\n`;
    csv += `نسبة الغياب وعقوبات الغياب %,${statsSummary.absenceRate}\n`;
    csv += `الرسوم المحصلة (ج.م),${statsSummary.collectedFees}\n`;
    csv += `الرسوم المتبقية والمتأخرة (ج.م),${statsSummary.outstandingFees}\n`;
    csv += `مجموع رواتب الكادر الشهري (ج.م),${statsSummary.facultySalaries}\n`;
    csv += `الميزانية التشغيلية المرصودة (ج.م),${statsSummary.operationalBudget}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SGU_Executive_BI_Report_${selCollege}_${selDept}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    triggerLocalToast(
      lang === "ar" 
        ? "📥 تم تصدير وتحميل التقرير التنفيذي لـ SGU بصيغة Excel/CSV بنجاح" 
        : "📥 SGU Executive BI CSV Spreadsheet downloaded successfully"
    );
  };

  // PDF Generation Simulation
  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      setIsExportingPDF(false);
      setShowPrintReport(true);
      triggerLocalToast(
        lang === "ar"
          ? "📄 تم تحضير التقرير التنفيذي للطباعة بنجاح"
          : "📄 SGU Executive Report compilation finished. Ready to print!"
      );
    }, 1500);
  };

  // Reset department if college changes
  useEffect(() => {
    setSelDept("all");
  }, [selCollege]);

  // Module state tabs

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative text-slate-100">
      
      {/* Upper premium panel layout */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border-b border-slate-800 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-right">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Cpu className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>SGU Central Core ERP Suite</span>
              <span className="text-[9.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">v4.2-Secure</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === "ar" 
                ? "قاعدة البيانات المركزية، أمن وصلاحيات المستخدمين، والتحقق البيومتري الذكي للحضور" 
                : "Centralized Databases, RBAC Identity Management, and Biometric Attendance Routing"}
            </p>
          </div>
        </div>

        {/* Global toggles */}
        <div className="flex items-center gap-3">
          {/* Dual Language Switcher */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs font-bold text-slate-300 hover:text-emerald-400 transition"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
            {lang === "ar" ? "English" : "العربية"}
          </button>

          {/* Quick Active Role Indicator & Live Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="hidden sm:inline px-2 font-semibold text-slate-500 text-[10.5px]">
              {lang === "ar" ? "الدور الفعلي المختبر:" : "Testing Role:"}
            </span>
            <select
              value={activeRole}
              onChange={(e) => handleRoleChange(e.target.value as SguRoleType)}
              className="bg-slate-900 border-none text-emerald-450 font-bold focus:outline-none cursor-pointer p-1 rounded pr-6"
            >
              {SGU_RBAC_ROLES.map(r => (
                <option key={r.id} value={r.id} className="text-slate-100 bg-slate-950 font-bold">
                  {lang === "ar" ? r.nameAr : r.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabbing */}
      <div className="bg-slate-950/60 px-5 py-2 border-b border-slate-800/80 flex gap-1 scrollbar-none overflow-x-auto text-xs font-bold">
        {[
          { id: "rbac", labelAr: "🔒 الصلاحيات والأمان (RBAC)", labelEn: "🔒 Security & RBAC", icon: Lock },
          { id: "academic", labelAr: "🎓 المنظومة الأكاديمية", labelEn: "🎓 Academic Core", icon: GraduationCap },
          { id: "attendance", labelAr: "⚡ الحضور والانصراف الذكي", labelEn: "⚡ Smart Attendance", icon: QrCode },
          { id: "analytics", labelAr: "📊 التحليلات والتقارير التنفيذية", labelEn: "📊 Executive BI & Analytics", icon: BarChart3 }
        ].map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`cursor-pointer py-2 px-4 rounded-lg flex items-center gap-2 transition shrink-0 ${
                isSelected 
                  ? "bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Suite Content Body */}
      <div className="p-5 min-h-[580px] bg-slate-900/45">
        <AnimatePresence mode="wait">
          
          {/* =========================================================================
              TAB 1: SECURITY, RBAC & AUDIT LOGS MODULE
              ========================================================================= */}
          {activeTab === "rbac" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
              key="rbac-tab"
            >
              {/* Security Shield Summary Header */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-start gap-4 text-right">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/20 font-mono inline-block">
                      ROLE-BASED ACCESS CONTROL (RBAC) ACTIVE
                    </span>
                    <h3 className="text-sm font-black text-slate-100">
                      {lang === "ar" ? "تأمين الجلسات وصلاحيات النفاذ الممنهجة" : "Structured Access Protection policies"}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lang === "ar" 
                        ? "تدعم منصة SGU الموحدة منظومة أمان هجينة مبنية على الأدوار والمستويات الأكاديمية والوظيفية. تتيح لك المنصة حظر الاختراقات أو الإدخالات غير المصرح بها ورصدها أمنياً على مدار الساعة."
                        : "SGU utilizes a zero-trust RBAC model restricting university endpoints based on roles. Any unauthorized access attempts trigger an automated block and security log snapshot."}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex flex-col justify-between text-right">
                  <div className="flex justify-between items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <h4 className="text-xs font-black text-slate-200">
                      {lang === "ar" ? "إحصائيات التدقيق الحالية" : "Active Auditing Stats"}
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mt-3">
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <strong className="text-lg font-black text-emerald-400 font-mono">10</strong>
                      <p className="text-[9px] text-slate-500 mt-0.5">{lang === "ar" ? "أدوار RBAC" : "RBAC Roles"}</p>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <strong className="text-lg font-black text-rose-455 font-mono">
                        {auditLogs.filter(l => l.status === "BLOCKED").length}
                      </strong>
                      <p className="text-[9px] text-slate-500 mt-0.5">{lang === "ar" ? "تنبيهات حظر" : "Blocked Att"}</p>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <strong className="text-lg font-black text-sky-400 font-mono">
                        {auditLogs.length}
                      </strong>
                      <p className="text-[9px] text-slate-500 mt-0.5">{lang === "ar" ? "إجمالي السجلات" : "Total Logs"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Editor Panel (Admin View) */}
              <div className="bg-slate-950/80 border border-slate-850 rounded-xl overflow-hidden text-right">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center flex-row-reverse">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-black text-slate-100">
                      {lang === "ar" ? "منظم سياسات وصلاحيات الأمان (RBAC Policy Tuner)" : "RBAC Security Policy Controller"}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {lang === "ar" ? "متاح فقط للـ Admin و Super Admin" : "Only viewable by Admin / Super Admin"}
                  </span>
                </div>

                <div className="p-4">
                  {/* Lock Screen simulation for Roles Tuner if no permissions */}
                  {!hasPermission(activeRole, "manage_rbac_roles") ? (
                    <div className="p-8 text-center space-y-3 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                      <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
                      <h4 className="text-sm font-black text-slate-200">
                        {lang === "ar" ? "⚠️ الوصول لجدول الصلاحيات محجوب" : "⚠️ Access to RBAC Policy Grid is Blocked"}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        {lang === "ar"
                          ? `دورك الحالي (${getRoleMetadata(activeRole).nameAr}) لا يملك الصلاحية الأمنية [manage_rbac_roles]. يرجى تبديل دورك إلى (Admin أو Super Admin) من الأعلى للتعديل الإداري.`
                          : `Your current role (${getRoleMetadata(activeRole).nameEn}) does not possess [manage_rbac_roles] privilege. Please switch to Admin / Super Admin to interact.`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400">
                        {lang === "ar"
                          ? "قم بتفعيل أو إلغاء علامات الصح أمام الصلاحيات لتحديث صلاحيات النفاذ المتاحة لكل دور أمني على مستوى الكلية في الوقت الفعلي:"
                          : "Toggle checkboxes to dynamically alter security permissions for each role globally on the fly:"}
                      </p>

                      <div className="overflow-x-auto border border-slate-850 rounded-lg">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="bg-slate-900 text-slate-400 border-b border-slate-850 font-bold text-[10.5px]">
                              <th className="p-3 text-right">{lang === "ar" ? "الدور الأمني" : "Role Title"}</th>
                              <th className="p-3 text-center">{lang === "ar" ? "رصد الدرجات" : "Edit Grades"}</th>
                              <th className="p-3 text-center">{lang === "ar" ? "حذف/إضافة مواد" : "Add/Drop"}</th>
                              <th className="p-3 text-center">{lang === "ar" ? "الإرشاد الأكاديمي" : "Advising"}</th>
                              <th className="p-3 text-center">{lang === "ar" ? "توليد QR حضور" : "Gen QR"}</th>
                              <th className="p-3 text-center">{lang === "ar" ? "الوصول للمالية" : "Finance Access"}</th>
                              <th className="p-3 text-center">{lang === "ar" ? "إدارة المكتبة" : "Library Access"}</th>
                              <th className="p-3 text-center">{lang === "ar" ? "التقارير والجودة" : "Reports Hub"}</th>
                              <th className="p-3 text-center">{lang === "ar" ? "تعديل الـ RBAC" : "Edit RBAC"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850/60 font-semibold text-slate-300">
                            {customRolesList.map(r => (
                              <tr key={r.id} className="hover:bg-slate-900/40">
                                <td className="p-3 font-bold text-slate-100 flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full bg-slate-400 ${
                                    r.id.includes("Admin") ? "bg-red-400" : "bg-emerald-400"
                                  }`}></span>
                                  <span>{lang === "ar" ? r.nameAr : r.nameEn}</span>
                                </td>
                                {[
                                  { id: "edit_grades" },
                                  { id: "add_drop_courses" },
                                  { id: "view_advising" },
                                  { id: "create_lecture_qr" },
                                  { id: "manage_finance" },
                                  { id: "manage_library" },
                                  { id: "generate_reports" },
                                  { id: "manage_rbac_roles" }
                                ].map(p => {
                                  const isChecked = r.permissions.includes(p.id as SguPermission) || r.permissions.includes("bypass_security");
                                  const isBypass = r.permissions.includes("bypass_security");
                                  return (
                                    <td key={p.id} className="p-3 text-center">
                                      <input
                                        type="checkbox"
                                        disabled={isBypass && r.id === "Super Admin"}
                                        checked={isChecked}
                                        onChange={() => handleTogglePermission(r.id, p.id as SguPermission)}
                                        className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-950 cursor-pointer disabled:opacity-50"
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Audit Trail Monitor */}
              <div className="bg-slate-950/80 border border-slate-850 rounded-xl overflow-hidden text-right">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center flex-row-reverse">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-black text-slate-100">
                      {lang === "ar" ? "منصة التدقيق والتحقق الأمني الحي (Live Security Audit Trail)" : "Real-time Security Logs & Audit Trail"}
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      SguAuditLogger.clearLogs();
                      setAuditLogs([]);
                      triggerLocalToast(lang === "ar" ? "🧹 تم تصفية سجلات الأحداث الأمنية" : "🧹 Security event log cleared");
                    }}
                    className="cursor-pointer text-[10.5px] text-slate-450 hover:text-red-400 font-bold hover:underline"
                  >
                    {lang === "ar" ? "حذف السجلات" : "Clear Logs"}
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Search bar & filter */}
                  <div className="flex gap-2 items-center flex-row-reverse">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute pr-0.5 right-3 top-3.5" />
                      <input
                        type="text"
                        placeholder={lang === "ar" ? "البحث في أحداث الأمان..." : "Search security audit trails..."}
                        value={searchAuditQuery}
                        onChange={(e) => setSearchAuditQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 pr-10 rounded-lg text-xs text-right font-semibold text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto border border-slate-850 rounded-lg">
                    {filteredAuditLogs.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500">
                        {lang === "ar" ? "لا توجد أحداث مطابقة للبحث حالياً" : "No matching security events found"}
                      </div>
                    ) : (
                      <table className="w-full text-right text-[11px] font-semibold text-slate-300">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-850 text-slate-450 text-[10px]">
                            <th className="p-3 text-right">{lang === "ar" ? "التوقيت" : "Timestamp"}</th>
                            <th className="p-3 text-right">{lang === "ar" ? "الرقم الجامعي/الاسم" : "User / ID"}</th>
                            <th className="p-3 text-right">{lang === "ar" ? "الدور الأمني" : "Role"}</th>
                            <th className="p-3 text-center">{lang === "ar" ? "العملية" : "Action"}</th>
                            <th className="p-3 text-right">{lang === "ar" ? "التفاصيل الأمنية" : "Details"}</th>
                            <th className="p-3 text-center">{lang === "ar" ? "الحالة" : "Status"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850/40">
                          {filteredAuditLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-900/30">
                              <td className="p-3 text-slate-450 font-mono shrink-0">
                                {new Date(log.timestamp).toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US")}
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-100">{log.userName}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{log.userId}</div>
                              </td>
                              <td className="p-3">
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800">
                                  {log.role}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                  log.action === "UNAUTHORIZED_ATTEMPT" ? "bg-rose-950/60 text-rose-300 border border-rose-900/30" : "bg-emerald-950/60 text-emerald-300 border border-emerald-900/30"
                                }`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="p-3 max-w-xs leading-relaxed text-slate-350 text-[10.5px]">
                                {lang === "ar" ? log.detailsAr : log.detailsEn}
                                <div className="text-[9.5px] text-slate-500 font-mono mt-0.5">IP: {log.ipAddress}</div>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`font-black text-[10px] ${
                                  log.status === "SUCCESS" ? "text-emerald-400" : log.status === "BLOCKED" ? "text-rose-500" : "text-amber-500"
                                }`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              TAB 2: CORE ACADEMIC SYSTEM
              ========================================================================= */}
          {activeTab === "academic" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
              key="academic-tab"
            >
              {/* Select Student and Core Header */}
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 items-center text-right">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-100">
                      {lang === "ar" ? "نظام إدارة الشؤون الأكاديمية والطلابية" : "Unified Student Academic Registry & Records"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === "ar" ? "إدارة الكليات، رصد الدرجات، تسجيل المقررات والإرشاد الأكاديمي" : "Oversight of colleges, gradebook registries, Add/Drop overrides and advising plans"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-450">
                    {lang === "ar" ? "اختر السجل الطلابي النشط:" : "Select Student Record:"}
                  </span>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-100 p-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {lang === "ar" ? s.nameAr : s.nameEn} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 1: Colleges & Student Profile Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* 1. Colleges & Departments (Stage 3.1) */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "إدارة كليات وأقسام جامعة الصالحية" : "Colleges & Departments Tree"}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {lang === "ar" ? "مجموع الكليات المعتمدة 7 كليات تفاعلية:" : "Authorized SGU College hierarchies:"}
                    </p>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {sguColleges.map(col => (
                        <div key={col.id} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 hover:border-slate-700 transition">
                          <div className="flex justify-between items-center text-[11.5px] font-bold">
                            <span className="text-slate-500 font-mono font-bold">{col.id.toUpperCase()}</span>
                            <span className="text-slate-100 text-right leading-tight">{lang === "ar" ? col.nameAr : col.nameEn}</span>
                          </div>
                          <div className="mt-1 flex justify-between items-center text-[10px] text-slate-400 flex-wrap gap-1">
                            <span>{col.requiredHours} {lang === "ar" ? "ساعة" : "Credits"}</span>
                            <span>GPA {col.avgGpa}</span>
                            <span>{col.depts.length} {lang === "ar" ? "أقسام رئيسية" : "Depts"}</span>
                          </div>
                          {/* Departments listing */}
                          <div className="mt-1.5 pt-1.5 border-t border-slate-850/40 text-[9.5px] text-slate-500 leading-relaxed text-right">
                            <strong>{lang === "ar" ? "الأقسام:" : "Depts:"} </strong>
                            {col.depts.join(" | ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Registered Student Record & CGPA Summary (Stage 3.2, 3.8) */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "الملف الأكاديمي التفصيلي والمعدل" : "Detailed Student Academic Card"}
                      </h4>
                    </div>

                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-850 space-y-2.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-100 font-bold">{activeStudent.nameAr}</span>
                        <span className="text-slate-450">{lang === "ar" ? "الاسم الكامل:" : "Student Name:"}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300 font-mono font-bold">{activeStudent.id}</span>
                        <span className="text-slate-450">{lang === "ar" ? "الرقم الجامعي:" : "ID Card:"}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-emerald-400 font-bold">{activeStudent.level}</span>
                        <span className="text-slate-450">{lang === "ar" ? "الفرقة الدراسية:" : "Academic Level:"}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300 font-bold">{activeStudent.major}</span>
                        <span className="text-slate-450">{lang === "ar" ? "التخصص:" : "Major Program:"}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300 font-bold">{activeStudent.advisor}</span>
                        <span className="text-slate-450">{lang === "ar" ? "المرشد الأكاديمي:" : "Academic Advisor:"}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-emerald-450 font-bold">{activeStudent.completedHours} / {activeStudent.requiredHours} ساعة</span>
                        <span className="text-slate-450">{lang === "ar" ? "الساعات المجتازة:" : "Completed Hours:"}</span>
                      </div>
                    </div>

                    {/* GPA / CGPA Calculation Display */}
                    <div className="grid grid-cols-2 gap-2 text-center mt-2">
                      <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-lg">
                        <span className="text-[10px] text-slate-500 font-bold block">{lang === "ar" ? "المعدل الفصلي GPA" : "Current GPA"}</span>
                        <strong className="text-lg font-black text-emerald-400 font-mono">{activeStudent.gpa.toFixed(2)}</strong>
                      </div>
                      <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-lg">
                        <span className="text-[10px] text-slate-500 font-bold block">{lang === "ar" ? "المعدل التراكمي CGPA" : "Cumulative CGPA"}</span>
                        <strong className="text-lg font-black text-amber-400 font-mono">{activeStudent.cgpa.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Add/Drop course registry (Stage 3.5) */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "بوابة التسجيل الذكية (Add/Drop Override)" : "Course Add/Drop Registry Panel"}
                      </h4>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {coursesDict.map(co => {
                        const isRegistered = activeStudent.registeredCourses.includes(co.code);
                        return (
                          <div key={co.code} className="bg-slate-900/60 p-2 rounded-lg border border-slate-850 flex items-center justify-between text-right">
                            {isRegistered ? (
                              <button
                                onClick={() => handleAddDropCourse(activeStudent.id, co.code, "drop")}
                                className="cursor-pointer text-[10px] font-bold bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 px-2 py-1 rounded transition"
                              >
                                {lang === "ar" ? "حذف (Drop)" : "Drop"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAddDropCourse(activeStudent.id, co.code, "add")}
                                className="cursor-pointer text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 px-2 py-1 rounded transition"
                              >
                                {lang === "ar" ? "تسجيل (Add)" : "Add"}
                              </button>
                            )}

                            <div>
                              <div className="text-xs font-bold text-slate-200">{lang === "ar" ? co.nameAr : co.nameEn}</div>
                              <div className="text-[9px] text-slate-450 font-mono mt-0.5">
                                {co.code} | {co.credits} {lang === "ar" ? "ساعات" : "CH"} {co.prereq.length > 0 && `| Req: ${co.prereq.join(",")}`}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Grid 2: Study Plan & Grade Entry / Results System */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* 1. Study Plan Tracker (Stage 3.6) */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right">
                  <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-black text-slate-200">
                      {lang === "ar" ? "الخطة الدراسية الاسترشادية للطلاب" : "Student Curriculum & Study Plan Map"}
                    </h4>
                  </div>
                  
                  <div className="space-y-3 text-[11px] font-semibold">
                    <p className="text-slate-400 leading-normal">
                      {lang === "ar"
                        ? `سجل تقدم الطالب بمستويات الخطة الأربعة (إجمالي مسجل حالياً: ${activeStudent.registeredCourses.length} مواد):`
                        : "Visual registration breakdown across the four levels:"}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-850 text-right">
                        <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "المستوى الأول" : "Level 1"}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span className="text-xs text-slate-200 font-bold">CS101 (A)</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-850 text-right">
                        <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "المستوى الثاني" : "Level 2"}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            activeStudent.registeredCourses.includes("CS102") ? "bg-blue-400 animate-pulse" : "bg-slate-600"
                          }`}></span>
                          <span className="text-xs text-slate-200 font-bold">CS102 (DS)</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-850 text-right">
                        <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "المستوى الثالث" : "Level 3"}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            activeStudent.registeredCourses.includes("MA201") ? "bg-blue-400" : "bg-slate-600"
                          }`}></span>
                          <span className="text-xs text-slate-200 font-bold">MA201 (Discrete)</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-850 text-right">
                        <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "المستوى الرابع (أبحاث)" : "Level 4"}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            activeStudent.registeredCourses.includes("AI402") ? "bg-blue-400 animate-pulse" : "bg-rose-500"
                          }`}></span>
                          <span className="text-xs text-slate-200 font-bold">AI402 (Expert Systems)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Grade Entry / Results Registry (Stage 3.7) */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "رصد وإدخال نتائج الامتحانات (Grade Registry)" : "Gradebook & Result Entry Terminal"}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <select
                          value={gradingCourse}
                          onChange={(e) => setGradingCourse(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 cursor-pointer focus:outline-none"
                        >
                          <option value="CS101">CS101</option>
                          <option value="CS102">CS102</option>
                          <option value="AI402">AI402</option>
                          <option value="MA201">MA201</option>
                        </select>
                        <span className="text-slate-450 font-bold">{lang === "ar" ? "اختر المادة للرصد:" : "Course for Grading:"}</span>
                      </div>

                      <div className="space-y-2 border-t border-slate-850/60 pt-2.5 max-h-40 overflow-y-auto">
                        {students.filter(st => st.registeredCourses.includes(gradingCourse)).map(st => {
                          const existingScore = studentGrades.find(g => g.studentId === st.id && g.courseCode === gradingCourse);
                          return (
                            <div key={st.id} className="flex justify-between items-center bg-slate-900/60 p-2 rounded border border-slate-850 text-xs">
                              <button
                                onClick={() => handleSaveGrade(st.id, entryGradeInput[st.id] || 85)}
                                className="cursor-pointer text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 px-2 py-1 rounded transition"
                              >
                                {lang === "ar" ? "حفظ" : "Save"}
                              </button>

                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder={existingScore ? String(existingScore.grade) : "85"}
                                  onChange={(e) => setEntryGradeInput({ ...entryGradeInput, [st.id]: parseInt(e.target.value) })}
                                  className="w-12 bg-slate-950 border border-slate-850 p-1 rounded text-center font-bold text-emerald-450 outline-none focus:border-emerald-500"
                                />
                                <span className="text-[10px] text-slate-500">/100</span>
                              </div>

                              <div className="text-right">
                                <div className="font-bold text-slate-200">{st.nameAr}</div>
                                <div className="text-[9px] text-slate-450 font-mono">{st.id} {existingScore && `| Curr: ${existingScore.letter}`}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Academic Advising Recommendations (Stage 3.9) */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                      <HeartHandshake className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "الإرشاد الأكاديمي والتحذيرات (Academic Advising)" : "Academic Advising & Support recommendations"}
                      </h4>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {advisingNotes.filter(n => n.studentId === selectedStudentId).map(n => (
                        <div key={n.id} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 text-right space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>{n.date}</span>
                            <span className="font-bold text-slate-300">{n.advisor}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                            {lang === "ar" ? n.noteAr : n.noteEn}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Form to submit advising note */}
                    <div className="space-y-1 pt-2 border-t border-slate-850/60">
                      <input
                        type="text"
                        placeholder="أدخل التوصية باللغة العربية..."
                        value={newAdvNoteAr}
                        onChange={(e) => setNewAdvNoteAr(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-right text-slate-100 outline-none focus:border-emerald-500 font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Enter advising recommendation in English..."
                        value={newAdvNoteEn}
                        onChange={(e) => setNewAdvNoteEn(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-right text-slate-100 outline-none focus:border-emerald-500 font-semibold"
                      />
                      <button
                        onClick={handleAddAdvising}
                        className="cursor-pointer w-full mt-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-lg text-xs transition"
                      >
                        {lang === "ar" ? "حفظ وإرسال التوصية للأستاذ" : "Submit Advising Recommendation"}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Management Quality & Accreditation Reports (Stage 3.10) */}
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl text-right space-y-4">
                <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black text-slate-200">
                    {lang === "ar" ? "لوحة الجودة والاعتماد الأكاديمي والتقارير الإدارية (Accreditation QA & BI)" : "Accreditation QA & Administrative BI Dashboard"}
                  </h4>
                </div>

                {!hasPermission(activeRole, "generate_reports") ? (
                  <div className="p-6 text-center space-y-2 bg-slate-900/20 rounded-lg border border-dashed border-slate-800">
                    <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
                    <h5 className="text-xs font-bold text-slate-300">
                      {lang === "ar" ? "الوصول للتقارير الإستراتيجية محجوب" : "Strategic Quality Reports Blocked"}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {lang === "ar" 
                        ? "يتطلب هذا التقرير صلاحية [generate_reports] (عميد، رئيس قسم، أو مدير نظام)." 
                        : "Requires [generate_reports] privilege (Dean, Head of Dept, or Admin)."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-2 text-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">{lang === "ar" ? "نسبة استيفاء معايير NAQAAE" : "NAQAAE Compliance"}</span>
                      <strong className="text-2xl font-black text-emerald-400 font-mono">98.4%</strong>
                      <p className="text-[9.5px] text-emerald-500/70">{lang === "ar" ? "🟢 متوافق بالكامل للدورة الاستقصائية 2026" : "🟢 Fully Compliant for 2026 cycle"}</p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-2 text-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">{lang === "ar" ? "نقاط متطلبات معايير ABET" : "ABET Criteria Score"}</span>
                      <strong className="text-2xl font-black text-sky-400 font-mono">96.2 / 100</strong>
                      <p className="text-[9.5px] text-sky-500/70">{lang === "ar" ? "🟢 متجاوز للمعايير بمجموعات الحاسب" : "🟢 Exceeds standards for computing division"}</p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-2 text-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">{lang === "ar" ? "نسبة تغطية المنهج الدراسي" : "Curriculum Coverage Rate"}</span>
                      <strong className="text-2xl font-black text-amber-400 font-mono">100.0%</strong>
                      <p className="text-[9.5px] text-amber-500/70">{lang === "ar" ? "🟢 جميع التوصيفات والمخرجات مستوفاة" : "🟢 All syllabus outcomes accounted for"}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              TAB 3: COMPREHENSIVE ATTENDANCE & TRACKING SYSTEM (STAGE 4)
              ========================================================================= */}
          {activeTab === "attendance" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
              key="attendance-tab"
            >
              {/* Main Attendance Module Header */}
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-start gap-4 text-right">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 animate-pulse">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] bg-sky-500/10 text-sky-300 font-bold px-2 py-0.5 rounded border border-sky-500/20 font-mono inline-block">
                    PRO ATTENDANCE HUB (SECURE LECTURE LOGGER)
                  </span>
                  <h3 className="text-sm font-black text-slate-100">
                    {lang === "ar" ? "نظام الحضور والغياب الذكي المشفر بالـ QR والموقع الحي" : "Cryptographic Lecture QR Attendance & GPS Radius Verification Hub"}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === "ar" 
                      ? "يدعم نظام SGU تأكيد الحضور المزدوج: توليد رموز QR مشفرة ومؤقتة، مطابقة البصمة الحيوية للوجه للحد من التلاعب، والتأكد من تواجد الهاتف الفعلي للحدود الجغرافية للمدرج (التحقق الـ GPS)."
                      : "SGU enforces double-factor lecture validation: cryptographic dynamic QR timers, biometrics facial recognition to prevent proxy logs, and GPS radius geofencing parameters."}
                  </p>
                </div>
              </div>

              {/* Attendance Workspace Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Panel A: Professor Lecture QR Terminal (Stage 4.1, 4.5) */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-4 text-right flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                      <Cpu className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "بوابة الأستاذ لتوليد رموز الحضور" : "Professor Lecture QR Generator Terminal"}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-400 leading-normal">
                      {lang === "ar"
                        ? "اختر المقرر الدراسي وانقر لتوليد رمز الاستجابة السريع المشفر والمدعم بالتدقيق الزمني التلقائي (60 ثانية):"
                        : "Select course and generate security dynamic QR code with integrated expiration timer:"}
                    </p>

                    <div className="flex gap-2 items-center flex-row-reverse">
                      <select
                        value={activeSessionCourse}
                        onChange={(e) => setActiveSessionCourse(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-100 p-2.5 focus:outline-none cursor-pointer"
                      >
                        <option value="AI402">expert AI & Data Science (AI402)</option>
                        <option value="CS102">Data Structures (CS102)</option>
                        <option value="MA201">Discrete Mathematics (MA201)</option>
                      </select>

                      <button
                        onClick={handleGenerateQr}
                        className="cursor-pointer flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4 shrink-0" />
                        {lang === "ar" ? "توليد كود الحضور المؤقت ⚡" : "Generate Dynamic QR Session ⚡"}
                      </button>
                    </div>

                    {/* QR Code Renders */}
                    {activeQrCode ? (
                      <div className="bg-slate-900 p-5 rounded-xl border border-emerald-500/30 flex flex-col items-center justify-center space-y-3 text-center relative overflow-hidden">
                        
                        {/* Glowing ring */}
                        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse rounded-xl pointer-events-none" />

                        <div className="relative w-40 h-40 bg-white p-3 rounded-lg flex items-center justify-center shadow-2xl">
                          {/* Animated scanner line */}
                          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500/80 shadow-lg shadow-red-500 animate-bounce" />
                          <QrCode className="w-full h-full text-slate-950" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase">{activeQrCode}</div>
                          <div className="flex items-center gap-1.5 justify-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span className="text-xs text-emerald-400 font-mono font-bold">
                              {lang === "ar" ? `تنتهي صلاحية الكود في: ${qrTimer} ثانية` : `Session expires in: ${qrTimer}s`}
                            </span>
                          </div>
                        </div>

                        {/* Simulate Random students button */}
                        <button
                          onClick={simulateRandomScans}
                          className="cursor-pointer px-4 py-1.5 bg-sky-900/30 hover:bg-sky-900 text-sky-400 hover:text-slate-100 border border-sky-500/30 hover:border-transparent text-[11px] font-bold rounded transition"
                        >
                          {lang === "ar" ? "⚡ محاكاة مسح الطلاب عشوائياً" : "⚡ Simulate Random Student Scans"}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-900/40 p-12 rounded-xl border border-dashed border-slate-800 text-center space-y-2 text-slate-500">
                        <QrCode className="w-12 h-12 mx-auto opacity-30" />
                        <h5 className="text-xs font-bold text-slate-400">{lang === "ar" ? "لا توجد جلسة حضور نشطة" : "No active attendance session"}</h5>
                        <p className="text-[10.5px] max-w-xs mx-auto">
                          {lang === "ar" ? "انقر على زر التوليد في الأعلى لبدء تجميع كشف الحضور" : "Click generate above to activate temporary cryptographic scanning"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Panel B: Student Scanner Device Emulator (Stage 4.1.2, 4.3, 4.4) */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-4 text-right flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                      <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "محاكي هاتف الطالب للتحقق الحركي والبيومتري" : "Student Device Simulator (Biometrics & GPS validation)"}
                      </h4>
                    </div>

                    {/* GPS Radius selector */}
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 space-y-2">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSimulatedGps("inside")}
                            className={`px-2 py-0.5 rounded text-[9.5px] font-bold border transition ${
                              simulatedGps === "inside" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-300"
                            }`}
                          >
                            {lang === "ar" ? "متواجد (1.2m)" : "Inside (1.2m)"}
                          </button>
                          <button
                            onClick={() => setSimulatedGps("outside")}
                            className={`px-2 py-0.5 rounded text-[9.5px] font-bold border transition ${
                              simulatedGps === "outside" ? "bg-rose-500/20 text-rose-450 border-rose-500/40" : "bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-300"
                            }`}
                          >
                            {lang === "ar" ? "بعيد (250m)" : "Far (250m)"}
                          </button>
                        </div>
                        <span className="text-slate-400 font-bold">{lang === "ar" ? "1. التحقق من الموقع الجغرافي (GPS Radius Check):" : "1. GPS Radius geofencing:"}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 text-right font-mono">
                        {simulatedGps === "inside" 
                          ? (lang === "ar" ? "🟢 إحداثيات GPS متطابقة: Hall A1, SGU Main Campus" : "🟢 GPS coordinates matched: Hall A1, SGU Main Campus")
                          : (lang === "ar" ? "🔴 إحداثيات GPS خارج نطاق البث: العبور، القليوبية" : "🔴 GPS coordinates placed far: Obour Branch outside bounds")}
                      </p>
                    </div>

                    {/* Biometrics matches */}
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 space-y-2">
                      <div className="flex justify-between items-center text-[10.5px]">
                        {faceAuthPhotoVerified ? (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono">
                            VERIFIED MATCH (99.4%)
                          </span>
                        ) : (
                          <button
                            onClick={handleFaceScanSim}
                            disabled={isBiometricScanning}
                            className="cursor-pointer text-[10px] font-bold bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-slate-950 px-2.5 py-1 rounded transition flex items-center gap-1"
                          >
                            {isBiometricScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                            {lang === "ar" ? "تأكيد بصمة الوجه" : "Scan Face"}
                          </button>
                        )}
                        <span className="text-slate-400 font-bold">{lang === "ar" ? "2. البصمة الحيوية للوجه (Face ID Verification):" : "2. Biometrics Face Scan:"}</span>
                      </div>
                      <div className="flex items-center gap-3 justify-end mt-1">
                        <span className="text-[9.5px] text-slate-500 text-right leading-tight max-w-xs">
                          {lang === "ar"
                            ? "رصد ومقارنة صورة الطالب المسحوبة حالياً من السيرفر بصورته الأكاديمية المقيدة للتأكد من الهوية."
                            : "Match real-time face confidence score to the central student registry photograph."}
                        </span>
                        <div className="w-10 h-10 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
                            alt="biometric placeholder"
                            className="w-full h-full object-cover grayscale"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RFID/NFC Tag emulator support */}
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setNfcTagDetected(true);
                          setFaceAuthPhotoVerified(true);
                          setSimulatedGps("inside");
                          triggerLocalToast(lang === "ar" ? "📟 تم رصد وقراءة شريحة الـ NFC الذكية بالبطاقة" : "📟 NFC chip on university smart card read successfully");
                        }}
                        className={`cursor-pointer px-3 py-1 text-[10px] font-bold border rounded transition ${
                          nfcTagDetected ? "bg-purple-500/20 text-purple-400 border-purple-500/40" : "bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-300"
                        }`}
                      >
                        {lang === "ar" ? "محاكاة تقريب الكارت" : "Tap NFC SmartCard"}
                      </button>
                      <span className="text-xs text-slate-400 font-bold">{lang === "ar" ? "3. دعم قنوات الـ RFID / NFC:" : "3. RFID / NFC Support emulator:"}</span>
                    </div>

                    {/* Simulate scanning action */}
                    <div className="pt-2 border-t border-slate-850/60 text-center">
                      <button
                        onClick={handleStudentSelfScan}
                        className="cursor-pointer w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-slate-950 font-black text-xs rounded-lg transition"
                      >
                        {lang === "ar" ? "مسح الـ QR وتسجيل الحضور المزدوج 📱" : "Confirm QR Scan & Log Presence 📱"}
                      </button>

                      {studentScanFeedback && (
                        <div className={`mt-2.5 p-2.5 rounded-lg text-xs font-semibold border ${
                          studentScanFeedback.includes("✅") ? "bg-emerald-950/40 border-emerald-900/30 text-emerald-400" : "bg-rose-950/40 border-rose-900/30 text-rose-450"
                        }`}>
                          {studentScanFeedback}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Professor tracking logs (Stage 4.5) */}
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right">
                <div className="flex justify-between items-center flex-row-reverse border-b border-slate-850 pb-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-black text-slate-200">
                      {lang === "ar" ? "سجل الحضور اللحظي للمحاضرة الحالية" : "Professor Real-time Lecture Attendance logs"}
                    </h4>
                  </div>
                  <button
                    onClick={exportAttendanceCSV}
                    className="cursor-pointer text-[10.5px] text-emerald-450 hover:text-emerald-350 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {lang === "ar" ? "تصدير الإحصائيات (CSV)" : "Export CSV reports"}
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-850 rounded-lg">
                  {liveScannedStudents.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      {lang === "ar" ? "لا توجد سجلات حضور نشطة بالجلسة الحالية" : "No registered student entries logged for active session"}
                    </div>
                  ) : (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-850 text-slate-450 font-bold text-[10px]">
                          <th className="p-2.5 text-right">{lang === "ar" ? "الرقم الجامعي" : "Student ID"}</th>
                          <th className="p-2.5 text-right">{lang === "ar" ? "الاسم" : "Student Name"}</th>
                          <th className="p-2.5 text-right">{lang === "ar" ? "توقيت الحضور" : "Time recorded"}</th>
                          <th className="p-2.5 text-right">{lang === "ar" ? "طريقة التحقق" : "Scan Method"}</th>
                          <th className="p-2.5 text-right">{lang === "ar" ? "حالة الـ GPS" : "GPS Radius Verified"}</th>
                          <th className="p-2.5 text-right">{lang === "ar" ? "الاحداثيات الجغرافية" : "Raw Coordinates"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/40 text-slate-300 font-semibold">
                        {liveScannedStudents.map(st => (
                          <tr key={st.id} className="hover:bg-slate-900/30">
                            <td className="p-2.5 text-slate-450 font-mono font-bold">{st.id}</td>
                            <td className="p-2.5 text-slate-100 font-bold">{lang === "ar" ? st.nameAr : st.nameEn}</td>
                            <td className="p-2.5 font-mono text-slate-450">{st.time}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 text-[9.5px] bg-slate-900 rounded border border-slate-800 text-sky-400 font-bold">
                                {st.authType}
                              </span>
                            </td>
                            <td className="p-2.5 text-emerald-400">{st.gpsStatus}</td>
                            <td className="p-2.5 font-mono text-slate-500">{st.coordinates}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Administrative Attendance BI & Absences Warning System (Stage 4.6) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Visual absence rates chart */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right lg:col-span-2">
                  <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <h4 className="text-xs font-black text-slate-200">
                      {lang === "ar" ? "نسب الغياب العام حسب كليات الجامعة" : "University College-wide Attendance & Absence rates"}
                    </h4>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={absenceReportStats}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#f8fafc", fontFamily: "sans-serif" }} />
                        <Legend />
                        <Bar dataKey="rate" name={lang === "ar" ? "معدل الغياب (%)" : "Absence Rate (%)"} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="attended" name={lang === "ar" ? "معدل الحضور (%)" : "Attendance Rate (%)"} fill="#10b981" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Absence Warning Alerts List */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 text-right">
                  <div className="flex items-center gap-2 flex-row-reverse border-b border-slate-850 pb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                    <h4 className="text-xs font-black text-rose-400">
                      {lang === "ar" ? "نظام إنذارات الغياب (Absence Warning Alerts)" : "Absence Warning Alarms (>15%)"}
                    </h4>
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                    {lang === "ar"
                      ? "رصد تلقائي للطلاب الذين تجاوزت نسبة غيابهم عتبة الـ 15% المقررة قانوناً لتوجيه الإنذارات الرسمية:"
                      : "System alert tracking of students exceeding legal absence thresholds for disciplinary mailings:"}
                  </p>

                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                    {absenceWarningStudents.map(w => (
                      <div key={w.id} className="bg-slate-900 p-2.5 rounded-lg border border-rose-950/40 space-y-1.5 text-right">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono">{w.absenceRate}</span>
                          <span className="font-bold text-slate-100">{w.nameAr}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9.5px] text-slate-500">
                          <span>{lang === "ar" ? `غياب ${w.lecturesMissed} محاضرات` : `Missed ${w.lecturesMissed} classes`}</span>
                          <span>{w.college}</span>
                        </div>
                        <p className="text-[9.5px] text-amber-500/80 border-t border-slate-850/40 pt-1 text-right">
                          💡 {w.action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* =========================================================================
              TAB 4: EXECUTIVE MANAGEMENT BI & REPORTING DASHBOARD (STAGE 7)
              ========================================================================= */}
          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
              key="analytics-tab"
            >
              {/* Filter and Command Center */}
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl text-right">
                <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
                  {/* Title & Description */}
                  <div className="w-full xl:w-auto space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded font-mono font-black uppercase">
                        SGU EXECUTIVE BUSINESS INTELLIGENCE
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-100">
                      {lang === "ar" ? "منصة دعم القرار والتحليلات الاستراتيجية" : "Strategic Decision & BI Analytics Center"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === "ar" 
                        ? "استعلم وحلل إحصائيات الطلاب والنتائج والبيانات المالية ومعدلات الحضور على مستوى الكليات والأقسام"
                        : "Query and evaluate academic trends, tuition collection rates, and university attendance metrics dynamically."}
                    </p>
                  </div>

                  {/* Actions (CSV & Print PDF) */}
                  <div className="flex items-center gap-2.5 w-full xl:w-auto justify-end">
                    <button
                      onClick={exportExecutiveCSV}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-slate-800 px-3.5 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === "ar" ? "تصدير Excel (CSV)" : "Export CSV"}</span>
                    </button>
                    
                    <button
                      onClick={handleExportPDF}
                      disabled={isExportingPDF}
                      className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-black px-4 py-2 rounded-lg text-xs transition flex items-center gap-1.5"
                    >
                      {isExportingPDF ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{lang === "ar" ? "جاري التجميع..." : "Compiling..."}</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          <span>{lang === "ar" ? "تقرير للطباعة (PDF)" : "Print Executive Report"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 border-t border-slate-850/60 pt-4 text-right">
                  {/* Filter 1: College */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold">
                      {lang === "ar" ? "الكلية / الأكاديمية:" : "College / Faculty:"}
                    </label>
                    <select
                      value={selCollege}
                      onChange={(e) => setSelCollege(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-black text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all">{lang === "ar" ? "كل كليات الجامعة" : "All SGU Colleges"}</option>
                      {sguColleges.map(c => (
                        <option key={c.id} value={c.id}>{lang === "ar" ? c.nameAr : c.nameEn}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 2: Department */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold">
                      {lang === "ar" ? "القسم الأكاديمي:" : "Academic Department:"}
                    </label>
                    <select
                      value={selDept}
                      onChange={(e) => setSelDept(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-black text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      {deptsByCollege[selCollege]?.map(d => (
                        <option key={d.id} value={d.id}>{lang === "ar" ? d.nameAr : d.nameEn}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 3: Academic Year */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold">
                      {lang === "ar" ? "العام الأكاديمي:" : "Academic Year:"}
                    </label>
                    <select
                      value={selYear}
                      onChange={(e) => setSelYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-black text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      <option value="2025/2026">2025 / 2026</option>
                      <option value="2024/2025">2024 / 2025</option>
                      <option value="2023/2024">2023 / 2024</option>
                    </select>
                  </div>

                  {/* Filter 4: Semester */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold">
                      {lang === "ar" ? "الفصل الدراسي الحالي:" : "Academic Semester:"}
                    </label>
                    <select
                      value={selSemester}
                      onChange={(e) => setSelSemester(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-black text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="first">{lang === "ar" ? "الفصل الأول (خريفي)" : "First Semester"}</option>
                      <option value="second">{lang === "ar" ? "الفصل الثاني (ربيعي)" : "Second Semester"}</option>
                      <option value="summer">{lang === "ar" ? "الفصل الصيفي الإضافي" : "Summer Semester"}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic KPI Executive Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
                {/* Students Enrolled */}
                <div className="bg-slate-950/85 border border-slate-850 p-3.5 rounded-xl text-right relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 text-slate-400 pointer-events-none">
                    <Users className="w-16 h-16 -mr-4 -mb-4" />
                  </div>
                  <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "الطلاب المقيدين" : "Enrolled Students"}</span>
                  <strong className="text-xl font-black text-slate-100 font-mono block mt-1">
                    {statsSummary.studentsCount.toLocaleString()}
                  </strong>
                  <p className="text-[9px] text-slate-400 mt-1">
                    {lang === "ar" ? "نشط وله رقم جامعي" : "Active ERP registries"}
                  </p>
                </div>

                {/* Faculty Members */}
                <div className="bg-slate-950/85 border border-slate-850 p-3.5 rounded-xl text-right relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 text-slate-400 pointer-events-none">
                    <GraduationCap className="w-16 h-16 -mr-4 -mb-4" />
                  </div>
                  <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "هيئة التدريس" : "Faculty Staff"}</span>
                  <strong className="text-xl font-black text-sky-400 font-mono block mt-1">
                    {statsSummary.facultyCount.toLocaleString()}
                  </strong>
                  <p className="text-[9px] text-slate-400 mt-1">
                    {lang === "ar" ? "درجة أستاذ ومعيد ومساعد" : "PhD/Masters/TAs"}
                  </p>
                </div>

                {/* Staff / Admins */}
                <div className="bg-slate-950/85 border border-slate-850 p-3.5 rounded-xl text-right relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 text-slate-400 pointer-events-none">
                    <Briefcase className="w-16 h-16 -mr-4 -mb-4" />
                  </div>
                  <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "الهيكل الإداري" : "Support Staff"}</span>
                  <strong className="text-xl font-black text-purple-400 font-mono block mt-1">
                    {statsSummary.staffCount.toLocaleString()}
                  </strong>
                  <p className="text-[9px] text-slate-400 mt-1">
                    {lang === "ar" ? "أمن وشؤون مالية وخدمية" : "Administrative staff"}
                  </p>
                </div>

                {/* Average GPA */}
                <div className="bg-slate-950/85 border border-slate-850 p-3.5 rounded-xl text-right relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 text-slate-400 pointer-events-none">
                    <Award className="w-16 h-16 -mr-4 -mb-4" />
                  </div>
                  <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "متوسط الـ CGPA" : "Average CGPA"}</span>
                  <strong className="text-xl font-black text-amber-500 font-mono block mt-1">
                    {statsSummary.avgGpa}
                  </strong>
                  <span className="text-[9px] font-mono font-bold text-amber-500/80 bg-amber-500/10 px-1 rounded inline-block mt-1">
                    {lang === "ar" ? "من أصل 4.00" : "Out of 4.00"}
                  </span>
                </div>

                {/* Academic Success Rate */}
                <div className="bg-slate-950/85 border border-slate-850 p-3.5 rounded-xl text-right relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 text-slate-400 pointer-events-none">
                    <CheckCircle className="w-16 h-16 -mr-4 -mb-4" />
                  </div>
                  <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "معدل النجاح العام" : "Academic Success"}</span>
                  <strong className="text-xl font-black text-emerald-400 font-mono block mt-1">
                    {statsSummary.successRate}%
                  </strong>
                  {/* Micro Progress bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${statsSummary.successRate}%` }}></div>
                  </div>
                </div>

                {/* Attendance Rate */}
                <div className="bg-slate-950/85 border border-slate-850 p-3.5 rounded-xl text-right relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 text-slate-400 pointer-events-none">
                    <Activity className="w-16 h-16 -mr-4 -mb-4" />
                  </div>
                  <span className="text-[9.5px] text-slate-500 font-bold block">{lang === "ar" ? "الحضور والانضباط" : "Attendance Rate"}</span>
                  <strong className="text-xl font-black text-teal-400 font-mono block mt-1">
                    {statsSummary.attendanceRate}%
                  </strong>
                  {/* Micro Progress bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-teal-400 h-1 rounded-full" style={{ width: `${statsSummary.attendanceRate}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Charts Panel Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                
                {/* Academic Grade Distribution */}
                <div className="xl:col-span-2 bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-4 text-right">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      MCQ & WRITTEN PERFORMANCE CURVE
                    </span>
                    <h4 className="text-xs font-black text-slate-200">
                      {lang === "ar" ? "📊 منحنى توزيع التقديرات للطلاب" : "📊 Student Grade Distribution"}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {lang === "ar" 
                      ? "يوضح الرسم البياني أعداد وتوزيع الطلاب الفعلي وفق التقديرات المعتمدة بنظام الساعات المعتمدة للفصل المحدد."
                      : "Visual distribution of student final letters (A through F) across the selected filters."}
                  </p>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={gradeDistributionData}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#f8fafc" }} />
                        <Bar dataKey="value" name={lang === "ar" ? "عدد الطلاب" : "Students Count"}>
                          {gradeDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Financial Ledger Breakdown */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-4 text-right flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        TUITION LEDGER SNAPSHOT
                      </span>
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "💰 الموقف المالي للمصروفات والرسوم" : "💰 Tuition Ledger & Collection Rate"}
                      </h4>
                    </div>

                    <div className="py-2.5">
                      <div className="h-44 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={financialPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#f43f5e" />
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#f8fafc" }} />
                            <Legend wrapperStyle={{ fontSize: "11px" }} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-850 pt-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-emerald-400">
                        {statsSummary.collectedFees.toLocaleString()} ج.م
                      </span>
                      <span className="text-slate-450">{lang === "ar" ? "إجمالي المحصل:" : "Collected Fees:"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-rose-455">
                        {statsSummary.outstandingFees.toLocaleString()} ج.م
                      </span>
                      <span className="text-slate-450">{lang === "ar" ? "إجمالي المتأخرات:" : "Outstanding Tuition:"}</span>
                    </div>
                    {/* Collection Efficiency Ratio */}
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center mt-2">
                      <span className="text-xs font-black text-emerald-450 font-mono">
                        {((statsSummary.collectedFees / (statsSummary.collectedFees + statsSummary.outstandingFees)) * 100).toFixed(1)}%
                      </span>
                      <span className="text-[10.5px] font-bold text-slate-300">
                        {lang === "ar" ? "كفاءة التحصيل المالي:" : "Collection Efficiency:"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Historical Trend Charts & Faculty Ledger Panel */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Historical GPA Trend Line Chart */}
                <div className="xl:col-span-2 bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-4 text-right">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      ACADEMIC & ATTENDANCE PROGRESS TRACKING
                    </span>
                    <h4 className="text-xs font-black text-slate-200">
                      {lang === "ar" ? "📈 الاتجاه الزمني للأداء الأكاديمي والحضور" : "📈 Semestral GPA & Attendance Trends"}
                    </h4>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={semestersTrendData}>
                        <XAxis dataKey="semester" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#f8fafc" }} />
                        <Legend />
                        <Line type="monotone" dataKey="gpa" name={lang === "ar" ? "متوسط المعدل CGPA" : "Avg GPA"} stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="attendance" name={lang === "ar" ? "نسبة الحضور %" : "Attendance %"} stroke="#14b8a6" strokeWidth={2.5} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Faculty & Administrative Expenses Ledger */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-4 text-right flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        ADMINISTRATIVE BUDGETS
                      </span>
                      <h4 className="text-xs font-black text-slate-200">
                        {lang === "ar" ? "⚖️ الموازنات والرواتب التشغيلية" : "⚖️ Budgets & Staff Salaries Ledger"}
                      </h4>
                    </div>

                    <p className="text-[10.5px] text-slate-400 leading-relaxed mt-2.5">
                      {lang === "ar"
                        ? "تقرير النفقات والرواتب المصادق عليه شهرياً من قسم الحسابات لتمويل الأنشطة والمستحقات المباشرة:"
                        : "Operational ledger auditing verified monthly salaries and functional budgets for the current filtered domain:"}
                    </p>

                    <div className="space-y-3 mt-4">
                      {/* Operational budget item */}
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-850">
                        <span className="font-mono text-xs font-bold text-slate-200">
                          {statsSummary.operationalBudget.toLocaleString()} ج.م
                        </span>
                        <div className="text-right">
                          <span className="text-[10.5px] font-bold text-slate-300 block">
                            {lang === "ar" ? "الميزانية التشغيلية للفصل" : "Semestral Operational Budget"}
                          </span>
                          <span className="text-[8.5px] text-slate-500 font-mono">Allocated Semestral Funds</span>
                        </div>
                      </div>

                      {/* Salaries expense item */}
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-850">
                        <span className="font-mono text-xs font-bold text-rose-400">
                          {statsSummary.facultySalaries.toLocaleString()} ج.م
                        </span>
                        <div className="text-right">
                          <span className="text-[10.5px] font-bold text-slate-300 block">
                            {lang === "ar" ? "مجموع الرواتب الشهري" : "Monthly Salaries Total"}
                          </span>
                          <span className="text-[8.5px] text-slate-500 font-mono">Faculty & Administrative payroll</span>
                        </div>
                      </div>

                      {/* Balance remainder item */}
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-850">
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {(statsSummary.operationalBudget - statsSummary.facultySalaries).toLocaleString()} ج.م
                        </span>
                        <div className="text-right">
                          <span className="text-[10.5px] font-bold text-slate-300 block">
                            {lang === "ar" ? "رصيد الأمان والمكاسب المتوقع" : "Expected Reserve surplus"}
                          </span>
                          <span className="text-[8.5px] text-slate-500 font-mono">Net remaining capital</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation notice */}
                  <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-850 text-right space-y-1 mt-3">
                    <span className="text-[9.5px] font-bold text-amber-500">
                      ⚠️ {lang === "ar" ? "التوصية التلقائية لدعم القرار:" : "AI Strategic Advisory Notification:"}
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {lang === "ar"
                        ? statsSummary.outstandingFees > 2000000 
                          ? "نسبة المتأخرات تتطلب حظر كشوف درجات الطلاب المتعثرين وإرسال إشعار سداد دفع مبرمج."
                          : "الميزانية والتدفقات مستقرة وآمنة تماماً للفصل الحالي. يوصى برصد الفائض للبحث العلمي."
                        : statsSummary.outstandingFees > 2000000
                          ? "Outstanding tuition exceeds safe margins. Automated warning triggers are advised for non-paying IDs."
                          : "Perfect liquidity indices. Advisory recommendation is to allocate surplus funds towards Scopus publication awards."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Printable Modal / Report Window */}
              <AnimatePresence>
                {showPrintReport && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 text-slate-100"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between"
                    >
                      {/* Modal Header */}
                      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-row-reverse">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-sm font-black text-slate-100">
                            {lang === "ar" ? "معاينة التقرير التنفيذي للجامعة قبل الطباعة" : "SGU University Executive Report Print Preview"}
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowPrintReport(false)}
                          className="cursor-pointer text-slate-400 hover:text-white text-xs font-black border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-900"
                        >
                          ✕ {lang === "ar" ? "إغلاق" : "Close"}
                        </button>
                      </div>

                      {/* Modal Body (Printable Paper Sheet) */}
                      <div className="p-8 text-right bg-white text-slate-900 font-sans print:p-0" id="sgu-printable-area">
                        {/* Letterhead */}
                        <div className="border-b-4 border-slate-900 pb-5 flex justify-between items-start">
                          <div className="text-left font-mono text-[10px] text-slate-500">
                            <p>SGU ERP v4.2 Secure</p>
                            <p>Date: {new Date().toLocaleDateString()}</p>
                            <p>System Ref: SGU-EXEC-BI-{selCollege.toUpperCase()}</p>
                          </div>
                          <div className="text-right space-y-1.5">
                            <h1 className="text-xl font-black text-slate-950 tracking-tight">
                              جامعة شرق بورسعيد الأهلية (SGU)
                            </h1>
                            <p className="text-xs font-bold text-slate-600">
                              مكتب رئيس الجامعة - قطاع التخطيط والتحليلات الاستراتيجية
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              EAST PORT SAID UNIVERSITY (SGU) EXECUTIVE LEDGER
                            </p>
                          </div>
                        </div>

                        {/* Title block */}
                        <div className="my-6 text-center bg-slate-100 py-3 rounded-lg border border-slate-250">
                          <h2 className="text-base font-black text-slate-900">
                            {lang === "ar" 
                              ? `تقرير الأداء والتحليلات لـ ${selCollege === "all" ? "كافة كليات الجامعة" : `كلية ${selCollege.toUpperCase()}`} - العام الأكاديمي ${selYear}`
                              : `Executive ERP Balance & Performance Report for ${selCollege.toUpperCase()} Faculty - ${selYear}`}
                          </h2>
                          <p className="text-xs text-slate-650 mt-1">
                            {lang === "ar" 
                              ? `مستخرج رسمي من قاعدة بيانات المنظومة المركزية - الفصل الدراسي: ${selSemester === "second" ? "الثاني" : selSemester === "first" ? "الاول" : "الصيفي"}`
                              : `Official data compilation. Term context: ${selSemester.toUpperCase()}`}
                          </p>
                        </div>

                        {/* Metadata Details Table */}
                        <table className="w-full text-right border-collapse text-xs my-5">
                          <thead>
                            <tr className="bg-slate-900 text-white font-bold">
                              <th className="p-2 border border-slate-300">{lang === "ar" ? "المؤشر الأكاديمي والمالي" : "Academic & Financial Indicator"}</th>
                              <th className="p-2 border border-slate-300">{lang === "ar" ? "القيمة المسجلة بالمنظومة" : "ERP Registered Value"}</th>
                              <th className="p-2 border border-slate-300">{lang === "ar" ? "ملاحظة الحالة والتدقيق" : "Auditing Assessment"}</th>
                            </tr>
                          </thead>
                          <tbody className="font-semibold text-slate-800">
                            <tr>
                              <td className="p-2 border border-slate-300">{lang === "ar" ? "إجمالي الطلاب المقيدين" : "Total Students Enrolled"}</td>
                              <td className="p-2 border border-slate-300 font-mono font-bold text-slate-950">{statsSummary.studentsCount.toLocaleString()}</td>
                              <td className="p-2 border border-slate-300 text-slate-500">{lang === "ar" ? "مسجلين بقوائم الحضور الرسمية" : "Verified registries"}</td>
                            </tr>
                            <tr>
                              <td className="p-2 border border-slate-300">{lang === "ar" ? "أعضاء هيئة التدريس" : "Faculty Staff Count"}</td>
                              <td className="p-2 border border-slate-300 font-mono font-bold text-slate-950">{statsSummary.facultyCount.toLocaleString()}</td>
                              <td className="p-2 border border-slate-300 text-slate-500">{lang === "ar" ? "معيدين وأساتذة ودكاترة" : "Active PhD / Masters"}</td>
                            </tr>
                            <tr>
                              <td className="p-2 border border-slate-300">{lang === "ar" ? "متوسط المعدل التراكمي CGPA" : "University Avg GPA"}</td>
                              <td className="p-2 border border-slate-300 font-mono font-bold text-slate-950">{statsSummary.avgGpa} / 4.00</td>
                              <td className="p-2 border border-slate-300 text-slate-500">
                                {statsSummary.avgGpa >= 3.4 ? (lang === "ar" ? "جيد جداً فما فوق" : "Very Good and above") : (lang === "ar" ? "متوسط ومقبول" : "Acceptable average")}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border border-slate-300">{lang === "ar" ? "نسبة النجاح الأكاديمي %" : "Success Rate %"}</td>
                              <td className="p-2 border border-slate-300 font-mono font-bold text-emerald-700">{statsSummary.successRate}%</td>
                              <td className="p-2 border border-slate-300 text-slate-500">{lang === "ar" ? "نسبة اجتياز الامتحانات المعتمدة" : "Passing metrics"}</td>
                            </tr>
                            <tr>
                              <td className="p-2 border border-slate-300">{lang === "ar" ? "نسبة الانضباط والحضور %" : "Attendance Rate %"}</td>
                              <td className="p-2 border border-slate-300 font-mono font-bold text-slate-950">{statsSummary.attendanceRate}%</td>
                              <td className="p-2 border border-slate-300 text-slate-500">{lang === "ar" ? "مطابقة بالبصمة البيومترية والـ GPS" : "Biometrically verified"}</td>
                            </tr>
                            <tr className="bg-slate-50">
                              <td className="p-2 border border-slate-300">{lang === "ar" ? "الرسوم الدراسية المحصلة" : "Collected Tuition Fees"}</td>
                              <td className="p-2 border border-slate-300 font-mono font-bold text-emerald-700">{statsSummary.collectedFees.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-slate-300 text-slate-500">{lang === "ar" ? "تم التحصيل عبر البوابة الإلكترونية" : "E-portal checkout"}</td>
                            </tr>
                            <tr className="bg-slate-50">
                              <td className="p-2 border border-slate-300">{lang === "ar" ? "الرسوم المتبقية والديون" : "Outstanding Pending Fees"}</td>
                              <td className="p-2 border border-slate-300 font-mono font-bold text-rose-700">{statsSummary.outstandingFees.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-slate-300 text-slate-500">
                                {statsSummary.outstandingFees > 2000000 ? (lang === "ar" ? "تنبيه: متأخرات مرتفعة" : "Warning: High Deficit") : (lang === "ar" ? "حدود متأخرات آمنة" : "Safe levels")}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border border-slate-300">{lang === "ar" ? "الميزانية التشغيلية المرصودة" : "Functional Budget Allocated"}</td>
                              <td className="p-2 border border-slate-300 font-mono font-bold text-slate-950">{statsSummary.operationalBudget.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-slate-300 text-slate-500">{lang === "ar" ? "تمويل مباشر للنفقات والعهدة" : "Functional department ledger"}</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Audit Verification Stamp Footer */}
                        <div className="flex justify-between items-center mt-12 border-t border-slate-200 pt-6">
                          <div className="text-left">
                            <p className="text-[10px] text-slate-400 font-mono">AUTOMATED VERIFIED BY SGU SECURITY SUITE</p>
                            <p className="text-[10px] text-slate-400 font-mono">HASH: 2bc5194f71a9388cbe11</p>
                          </div>
                          <div className="text-right text-xs space-y-1">
                            <p className="font-bold text-slate-950">{lang === "ar" ? "رئيس قطاع التحليلات والدعم الأكاديمي" : "Academic BI & Reporting Registrar"}</p>
                            <p className="text-slate-500 font-bold">{lang === "ar" ? "توقيع معتمد الكترونياً" : "Electronically Signed"}</p>
                            <div className="w-24 h-24 border border-slate-300 rounded p-1 inline-block mt-1 font-mono text-[8px] text-slate-400">
                              [SGU ERP SEAL]
                              <div className="w-full h-full bg-slate-50/50 flex items-center justify-center font-bold text-[9px] text-emerald-700">
                                SGU-ERP-OK
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modal Footer Controls */}
                      <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-between items-center flex-row-reverse">
                        <button
                          onClick={() => {
                            const printContents = document.getElementById("sgu-printable-area")?.innerHTML;
                            const originalContents = document.body.innerHTML;
                            if (printContents) {
                              const printWindow = window.open("", "_blank");
                              if (printWindow) {
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>SGU Executive BI Report</title>
                                      <style>
                                        body { font-family: sans-serif; padding: 20px; direction: rtl; }
                                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                                        th, td { border: 1px solid #ccc; padding: 10px; text-align: right; }
                                        th { background-color: #f0f0f0; }
                                        .text-center { text-align: center; }
                                        .flex { display: flex; }
                                        .justify-between { justify-content: space-between; }
                                        .border-b-4 { border-bottom: 4px solid #000; }
                                        .pb-5 { padding-bottom: 20px; }
                                        .my-6 { margin-top: 30px; margin-bottom: 30px; }
                                        .py-3 { padding-top: 15px; padding-bottom: 15px; }
                                        .bg-slate-100 { background-color: #f7f7f7; }
                                        .rounded-lg { border-radius: 8px; }
                                      </style>
                                    </head>
                                    <body>
                                      ${printContents}
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                                printWindow.focus();
                                printWindow.print();
                                printWindow.close();
                              }
                            }
                          }}
                          className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-2.5 rounded-lg text-xs transition"
                        >
                          {lang === "ar" ? "إرسال إلى الطابعة 🖨️" : "Send to Printer 🖨️"}
                        </button>
                        <button
                          onClick={() => setShowPrintReport(false)}
                          className="cursor-pointer text-slate-300 hover:text-white text-xs font-bold border border-slate-850 px-4 py-2.5 rounded-lg"
                        >
                          {lang === "ar" ? "إلغاء المعاينة" : "Dismiss Preview"}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Embedded visual toast overlay for notifications */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950 text-slate-100 font-bold text-xs border-r-[4.5px] border-r-emerald-500 border border-slate-850 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 max-w-sm text-right"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastText}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
