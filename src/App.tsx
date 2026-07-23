import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Users,
  CreditCard,
  Building,
  MapPin,
  Route,
  Sparkles,
  Award,
  BookMarked,
  Layers,
  DollarSign,
  QrCode,
  Upload,
  Send,
  RefreshCw,
  HeartPulse,
  Trash2,
  Database,
  Shuffle,
  Download,
  LogOut,
  Globe,
  Sun,
  Moon,
  Bell,
  Lock,
  ShieldCheck,
  Check,
  Printer,
  Smartphone,
  Bot,
  TrendingUp,
  Cpu,
  Presentation
} from "lucide-react";

import { t, formatString } from "./utils/translations";

import {
  defaultStudent,
  defaultColleges,
  defaultCourses,
  defaultSchedule,
  defaultAttendance,
  defaultAssignments,
  defaultBooks,
  defaultDorms,
  defaultBuses,
  defaultFinance,
  defaultApplications,
  defaultAdminStats,
  coursesByCollege
} from "./mockData";

import {
  generateUsers,
  DatabaseUser,
  SGU_ROLES,
  SGU_COLLEGES,
  SYSTEM_DB_STATS,
  ERP_40_CHAPTERS,
  ERPChapter
} from "./databaseMock";

import { ALL_SGU_SQLITE_TABLES } from "./sqliteMock";
import { generateRSAKeyPair, signWithRSA } from "./utils/crypto";
import { supabase, fetchStudentByEmail } from "./utils/supabaseClient";
import { auth } from "./utils/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import { 
  SGU_CENTRAL_USERS, 
  resolveDynamicRoute
} from "./utils/identityManager";

import {
  Course,
  AttendanceRecord,
  Assignment,
  LibraryBook,
  DormRoom,
  BusRoute,
  FinanceRecord,
  AdmissionApplication,
  ScheduleItem
} from "./types";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

import AccreditationReports from "./components/AccreditationReports";
import SguProSystems from "./components/SguProSystems";
import SguSisLogin from "./components/SguSisLogin";
import SguCollegesPortals from "./components/SguCollegesPortals";
import SguCollegeSystem from "./components/SguCollegeSystem";
import SguStudentPayments from "./components/SguStudentPayments";
import SguFacultyPortal from "./components/SguFacultyPortal";
import SguEmployeePortal from "./components/SguEmployeePortal";
import SguAdminPortal from "./components/SguAdminPortal";
import SguMobileCompanion from "./components/SguMobileCompanion";
import SguAcademicChatbot from "./components/SguAcademicChatbot";
import SguPredictiveAnalytics from "./components/SguPredictiveAnalytics";
import SguBlockchainCertificates from "./components/SguBlockchainCertificates";
import SguHierarchicalErp from "./components/SguHierarchicalErp";
import SguSecurityDatabaseSystem from "./components/SguSecurityDatabaseSystem";
import SguGoogleSlidesManager from "./components/SguGoogleSlidesManager";
import SguApplicantPortal from "./components/SguApplicantPortal";
import SguParentPortal from "./components/SguParentPortal";
import SguIndependentCollegePortal from "./components/SguIndependentCollegePortal";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">(() => {
    return (localStorage.getItem("sgu_language") as "ar" | "en") || "ar";
  });

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("sgu_theme") as "dark" | "light") || "light";
  });

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("sgu_language", lang);
  }, [lang]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("sgu_theme", theme);
  }, [theme]);

  const {
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole,
    employeeRole,
    setEmployeeRole,
    student,
    setStudent,
    activeSegment,
    setActiveSegment,
    subTab,
    setSubTab,
    logout
  } = useAuth();

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("u_courses");
    return saved ? JSON.parse(saved) : defaultCourses;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem("u_attendance");
    return saved ? JSON.parse(saved) : defaultAttendance;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem("u_assignments");
    return saved ? JSON.parse(saved) : defaultAssignments;
  });

  const [books, setBooks] = useState<LibraryBook[]>(() => {
    const saved = localStorage.getItem("u_books");
    return saved ? JSON.parse(saved) : defaultBooks;
  });

  const [finance, setFinance] = useState<FinanceRecord[]>(() => {
    const saved = localStorage.getItem("u_finance");
    return saved ? JSON.parse(saved) : defaultFinance;
  });

  const [applications, setApplications] = useState<AdmissionApplication[]>(() => {
    const saved = localStorage.getItem("u_applications");
    return saved ? JSON.parse(saved) : defaultApplications;
  });

  const [sqliteTables, setSqliteTables] = useState(() => {
    const saved = localStorage.getItem("u_sqlite_tables");
    return saved ? JSON.parse(saved) : ALL_SGU_SQLITE_TABLES;
  });

  const [dorms, setDorms] = useState<DormRoom[]>(() => {
    const saved = localStorage.getItem("u_dorms");
    return saved ? JSON.parse(saved) : defaultDorms;
  });

  const [buses, setBuses] = useState<BusRoute[]>(() => {
    const saved = localStorage.getItem("u_buses");
    return saved ? JSON.parse(saved) : defaultBuses;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem("u_schedules");
    return saved ? JSON.parse(saved) : defaultSchedule;
  });

  const [colleges, setColleges] = useState(() => {
    const saved = localStorage.getItem("u_colleges");
    return saved ? JSON.parse(saved) : defaultColleges;
  });

  const [collegesHubMode, setCollegesHubMode] = useState<"hierarchy" | "sandbox">("hierarchy");

  // DB Central interactive states
  const [dbUsers, setDbUsers] = useState<DatabaseUser[]>(() => {
    const saved = localStorage.getItem("sgu_db_users");
    return saved ? JSON.parse(saved) : generateUsers();
  });
  const [dbSearchQuery, setDbSearchQuery] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("all");
  const [selectedRoleId, setSelectedRoleId] = useState("all");
  const [activeChapterId, setActiveChapterId] = useState(1);
  const [sqlQueryInput, setSqlQueryInput] = useState("SELECT * FROM sgu_users_meta LIMIT 10;");
  const [sqlQueryResultMsg, setSqlQueryResultMsg] = useState("");
  const [dbCustomCount, setDbCustomCount] = useState(30052);

  const [dbDatasetType, setDbDatasetType] = useState<"thirty_thousand" | "sqlite_fifteen">("sqlite_fifteen");
  const [selectedSqliteTable, setSelectedSqliteTable] = useState<string>("students");

  const [newUserNameAr, setNewUserNameAr] = useState("");
  const [newUserRole, setNewUserRole] = useState("student");
  const [newUserCollege, setNewUserCollege] = useState("fcis");
  const [newUserGpaOrSalary, setNewUserGpaOrSalary] = useState("3.40");

  // Navigation Panel Tab State is managed by AuthContext
  const [searchQuery, setSearchQuery] = useState("");

  // Push Notifications States & Simulation Hub
  const [pushPermission, setPushPermission] = useState<"default" | "granted" | "denied">(() => {
    return (localStorage.getItem("sgu_push_permission") as any) || "default";
  });

  const [pushNotifications, setPushNotifications] = useState<{ id: string; title: string; message: string; date: string; read: boolean }[]>(() => {
    const saved = localStorage.getItem("sgu_push_notifications");
    return saved ? JSON.parse(saved) : [
      { id: "p1", title: "مرحباً بك في بوابات SGU المحدثة", message: "تطوير شامل للأنظمة ومخطط الـ 40 قطاعاً ونظام الحضور بالبصمة البيومترية المعزز.", date: "2026-06-20 09:00 ص", read: true },
      { id: "p2", title: "تنبيه المصروفات الدراسية المتبقية", message: "يرجى سداد الرسوم الأكاديمية المستحقة لتفادي حجب فترات تسجيل الساعات المبكر بالفصل الدراسي القادم.", date: "2026-06-21 08:15 ص", read: false }
    ];
  });

  const [lastPushToast, setLastPushToast] = useState<{ id: string; title: string; message: string } | null>(null);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const triggerSystemPush = React.useCallback((title: string, message: string) => {
    const dateStr = new Date().toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' }) + " - " + new Date().toLocaleDateString("ar-EG");
    const newNotif = {
      id: "p_" + Date.now(),
      title,
      message,
      date: dateStr,
      read: false
    };
    setPushNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem("sgu_push_notifications", JSON.stringify(updated));
      return updated;
    });
    setLastPushToast(newNotif);
    setTimeout(() => {
      setLastPushToast(prev => prev?.id === newNotif.id ? null : prev);
    }, 5500);
  }, []);

  useEffect(() => {
    (window as any).triggerSystemPush = triggerSystemPush;
    return () => {
      delete (window as any).triggerSystemPush;
    };
  }, [triggerSystemPush]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("u_student", JSON.stringify(student));
    localStorage.setItem("u_courses", JSON.stringify(courses));
    localStorage.setItem("u_attendance", JSON.stringify(attendance));
    localStorage.setItem("u_assignments", JSON.stringify(assignments));
    localStorage.setItem("u_books", JSON.stringify(books));
    localStorage.setItem("u_finance", JSON.stringify(finance));
    localStorage.setItem("u_applications", JSON.stringify(applications));
    localStorage.setItem("u_dorms", JSON.stringify(dorms));
    localStorage.setItem("u_buses", JSON.stringify(buses));
    localStorage.setItem("u_colleges", JSON.stringify(colleges));
    localStorage.setItem("sgu_db_users", JSON.stringify(dbUsers));
    localStorage.setItem("u_sqlite_tables", JSON.stringify(sqliteTables));
  }, [student, courses, attendance, assignments, books, finance, applications, dorms, buses, colleges, dbUsers, sqliteTables]);

  // Bus stop simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (bus.status === "inactive") return bus;
          const currIdx = bus.stops.indexOf(bus.currentLocationName);
          const nextIdx = (currIdx + 1) % bus.stops.length;
          return { ...bus, currentLocationName: bus.stops[nextIdx] };
        })
      );
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // System audit log state
  const [logs, setLogs] = useState<string[]>([
    "النظام مشفر بالكامل بروتوكول SSL/TLS 1.3 مع حماية ضد هجمات SQL Injection",
    "تحديث معايير الاعتماد الأكاديمي الدولي ABET لكلية الحاسبات والبرمجيات",
    "رصد بصمات الدخول الذكي عبر NFC & Face ID لبوابات القاعات والمباني للطلاب"
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 10));
    
    // Server-Side Live Audit Log Dispatching
    fetch("/api/enterprise/audit-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "youssef_admin",
        action: msg,
        level: msg.includes("⚠️") || msg.includes("🚨") || msg.includes("فشل") ? "WARNING" : "SUCCESS",
        role: "Super Admin"
      })
    }).catch(err => console.warn("Background log sync offline:", err));
  };

  // Supabase real integration state & fetch
  const [supabaseStatus, setSupabaseStatus] = useState<"connecting" | "success" | "error" | "idle">("idle");

  const loadStudentAndUsersFromSupabase = async (userEmail?: string) => {
    const targetEmail = userEmail || auth.currentUser?.email || student?.email;
    if (!targetEmail) {
      console.log("No authenticated user email found to fetch from Supabase yet.");
      return;
    }

    setSupabaseStatus("connecting");
    try {
      // 1. Fetch student from real Supabase "students" table using authentic email matching
      const { data: studentsData, error: studentError } = await fetchStudentByEmail(targetEmail);

      if (studentError) throw studentError;

      if (studentsData && studentsData.length > 0) {
        const realStudent = studentsData[0];
        const updatedStudent = {
          id: realStudent.id || realStudent.student_id || "20235418",
          nationalId: realStudent.national_id || "30204120198472",
          nameArabic: realStudent.name_arabic || "يوسف أحمد عبد الرحمن",
          nameEnglish: realStudent.name_english || "Youssef Ahmed Abdelrahman",
          birthDate: realStudent.birth_date || realStudent.birthDate || "2002-10-15",
          nationality: realStudent.nationality || "مصر",
          address: realStudent.address || "الدقي، الجيزة، مصر",
          phone: realStudent.phone || "+201012345678",
          email: realStudent.email || targetEmail,
          guardianName: realStudent.guardian_name || realStudent.guardianName || "أحمد عبد الرحمن عثمان",
          emergencyPhone: realStudent.emergency_phone || realStudent.emergencyPhone || "+201287654321",
          college: realStudent.college || "كلية الحاسبات والمعلومات",
          department: realStudent.department || "علوم الحاسب",
          major: realStudent.major || "بكالوريوس هندسة البرمجيات والأنظمة الذكية",
          advisor: realStudent.advisor || "أ.د. محمد الشافعي",
          level: realStudent.level || "السنة الثالثة - الفصل الدراسي الثاني",
          totalGPA: parseFloat(realStudent.total_gpa) || 0,
          completedHours: Number(realStudent.completed_hours || realStudent.completedHours) || 94,
          requiredHours: Number(realStudent.required_hours || realStudent.requiredHours) || 136,
          avatarUrl: realStudent.avatar_url || realStudent.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
        };
        setStudent(updatedStudent);
        localStorage.setItem("u_student", JSON.stringify(updatedStudent));
        setSupabaseStatus("success");
        addLog(`✓ [Supabase] تم ربط البوابة والمصادقة لبريد الطالب: "${targetEmail}" وجلب البيانات الحية بنجاح.`);
      } else {
        // If query returned no student but connected fine
        setSupabaseStatus("success");
        addLog(`ℹ️ [Supabase] متصل بنجاح. تم الفحص باستخدام البريد "${targetEmail}"، ولم يُعثر على سجل مطابق في جدول الطلاب. تم الإبقاء على ملف الطالب المحاكي.`);
      }

      // 2. Fetch system users from "students" as central db users
      const { data: usersData, error: usersError } = await supabase
        .from("students")
        .select("*")
        .limit(100);

      if (!usersError && usersData) {
        const mappedUsers = usersData.map((su: any, i: number) => ({
          id: su.id || `2026SGU-ST-${1000 + i}`,
          nameAr: su.name_ar || su.name_arabic || su.name || su.nameArabic || "طالب غير مكتمل البيانات",
          nameEn: su.name_en || su.name_english || su.nameEnglish || "Unnamed Student",
          role: su.role || "student",
          collegeId: su.college_id || su.collegeId || "fcis",
          email: su.email || `student_${i}@sgu.edu.eg`,
          phone: su.phone || `+20 10991${1000 + i}`,
          nationalId: su.national_id || su.nationalId || "29800000000000",
          createdAt: su.created_at || new Date().toISOString().split("T")[0],
          status: "active",
          gpaOrSalary: su.total_gpa || su.gpa || su.totalGPA || "3.40",
          campusBranch: "فرع الصالحية الجديدة الرئيسي"
        }));
        setDbUsers(mappedUsers);
        localStorage.setItem("sgu_db_users", JSON.stringify(mappedUsers));
      }

    } catch (err: any) {
      console.error("Supabase live fetching error:", err);
      setSupabaseStatus("error");
      addLog(`⚠️ فشل جلب بيانات الطلاب المباشرة من Supabase لهويتك: ${err.message}. تم الحفاظ على مستوى الحماية المحاكي.`);
    }
  };

  // Listen to Firebase Auth state for real identity matching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser?.email) {
        addLog(`[Firebase Auth] تم رصد جلسة نشطة للمستفيد: ${firebaseUser.email}`);
        loadStudentAndUsersFromSupabase(firebaseUser.email);
      } else {
        const fallbackEmail = student?.email;
        if (fallbackEmail) {
          loadStudentAndUsersFromSupabase(fallbackEmail);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Chat chatbot integration state
  interface ChatMessage {
    role: "user" | "model" | "system";
    text: string;
    isSandbox?: boolean;
  }
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "أهلاً بك يا يوسف! أنا المساعد الأكاديمي الذكي (جَامِعَتي AI). يمكنني شرح المقررات، تلخيص المحاضرات، توليد كويزات تدريبية مفاجئة،أو التنبؤ بمستوى تعثرك في الساعات المتبقية. كيف يمكنني إعانتك الآن؟"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendChat = async (preset?: string) => {
    const query = preset || chatInput;
    if (!query.trim() || chatLoading) return;

    setChatHistory((p) => [...p, { role: "user", text: query }]);
    if (!preset) setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: chatHistory.map((h) => ({ role: h.role, text: h.text }))
        })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setChatHistory((p) => [...p, { role: "model", text: data.text, isSandbox: data.isSandbox }]);
    } catch {
      setChatHistory((p) => [
        ...p,
        {
          role: "model",
          text: `نمط المحاكاة الفورية: بخصوص سياق "${query}"، لتفادي تدني المعدل التراكمي وتحقيق معايير ABET، ينصح بمراعاة متطلبات المواد السابقة وحل الواجبات التراكمية في مواعيدها المحددة.`,
          isSandbox: true
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Academic registration actions (add, withdraw, freeze, major transfer)
  const [freezeReason, setFreezeReason] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");

  const handleRegisterCourse = (code: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.code === code && c.status === "available") {
          addLog(`تَمْ تسجيل مقرر الجديد ${c.name} (${c.code}) في الجدول الأكاديمي.`);
          return { ...c, status: "registered" };
        }
        return c;
      })
    );
  };

  const handleWithdrawCourse = (code: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.code === code && c.status === "registered") {
          addLog(`طلب انسحاب رسمي من مقرر ${c.name} (${c.code}) قيد مراجعة المرشد.`);
          return { ...c, status: "available" };
        }
        return c;
      })
    );
  };

  const handleFreezeSemester = () => {
    if (!freezeReason.trim()) return;
    setStudent((p) => ({ ...p, level: `مجمد القيد - عذر مقبول (${freezeReason})` }));
    addLog(`تم تجميد القيد لهذا الفصل الدراسي بعذر مقبول: ${freezeReason}`);
    setFreezeReason("");
  };

  const handleUnfreeze = () => {
    setStudent((p) => ({ ...p, level: "السنة الثالثة - الفصل الدراسي الثاني" }));
    addLog("تم إلغاء تجميد قيد الطالب وإعادته لحالة النشاط الكامل.");
  };

  const handleMajorTransfer = () => {
    if (!selectedMajor) return;
    setStudent((p) => ({ ...p, department: selectedMajor }));
    addLog(`تم تعديل وتحويل التخصص الأكاديمي للطالب فورياً لقسم: ${selectedMajor}`);
  };

  // QR Attendance checkin simulation
  const [activeCourseQR, setActiveCourseQR] = useState("");
  const [qrMessage, setQrMessage] = useState("");

  const triggerQRScan = (code: string) => {
    setActiveCourseQR(code);
    setQrMessage("جاري رصد الموقع الجغرافي وبصمة الهوية الوطنية...");
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0].substring(0, 5);
      const course = courses.find((c) => c.code === code);
      const newRec: AttendanceRecord = {
        date: now.toISOString().split("T")[0],
        day: "الجمعة",
        courseCode: code,
        courseName: course?.name || "مقرر جامعي",
        status: "present",
        method: "QR",
        time: timeStr
      };
      setAttendance((prev) => [newRec, ...prev]);
      setQrMessage("تم مسح الـ QR ورصد حضور اليوم لجامعتك بنجاح!");
      addLog(`رصد حضور الطالب بمقرر ${course?.name} رمز الاستجابة السريع.`);
    }, 1500);
  };

  // Homework file upload submission
  const [subAsgId, setSubAsgId] = useState("");
  const [subFileName, setSubFileName] = useState("");
  const [subTeam, setSubTeam] = useState("");

  const handleUploadAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAsgId || !subFileName.trim()) return;

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === subAsgId) {
          return {
            ...a,
            submitted: true,
            fileSubmitted: subFileName,
            feedback: subTeam.trim()
              ? `مشروع مشترك مع فريق العمل: ${subTeam}. بانتظار تصحيح المعيد.`
              : "تم إرسال الملف منفرداً بنجاح."
          };
        }
        return a;
      })
    );
    addLog(`رفع مستند الواجب ${subFileName} للمصادقة عبر المنصة.`);
    setSubAsgId("");
    setSubFileName("");
    setSubTeam("");
  };

  // Financial payments
  const [payTargetId, setPayTargetId] = useState("");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payWallet, setPayWallet] = useState("Visa Credit Card");

  const handleFinancePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTargetId || payAmount <= 0) return;

    setFinance((prev) =>
      prev.map((f) => {
        if (f.id === payTargetId) {
          const updatedAmt = Math.max(0, f.amount - payAmount);
          return {
            ...f,
            amount: updatedAmt,
            paid: updatedAmt <= 0,
            paymentMethod: payWallet,
            paymentDate: new Date().toISOString().split("T")[0]
          };
        }
        return f;
      })
    );
    addLog(`تحصيل دفعة مالية بقيمة ${payAmount} ج.م بآلية ${payWallet}.`);
    setPayTargetId("");
    setPayAmount(0);
  };

  // Library Rent/Renew Books
  const borrowBook = (id: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              available: false,
              borrowedDate: new Date().toISOString().split("T")[0],
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            }
          : b
      )
    );
    addLog(`حجز واستعارة الوعاء المعرفي للجامعة: ${books.find((b) => b.id === id)?.title}`);
  };

  const renewBook = (id: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id && b.dueDate
          ? {
              ...b,
              dueDate: new Date(new Date(b.dueDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            }
          : b
      )
    );
    addLog(`تمديد حيازة استعارة الكتاب لـ 7 أيام بقرار المكتبية.`);
  };

  // Admissions Desk
  const [admName, setAdmName] = useState("");
  const [admNatId, setAdmNatId] = useState("");
  const [admPercentage, setAdmPercentage] = useState<number>(88);
  const [admWishesStr, setAdmWishesStr] = useState("كلية الحاسبات والذكاء الاصطناعي");
  const [admSignatureConsent, setAdmSignatureConsent] = useState(true);
  const [admSignatureName, setAdmSignatureName] = useState("");
  const [selectedAppForSignatureVerification, setSelectedAppForSignatureVerification] = useState<AdmissionApplication | null>(null);

  const submitNewAdmissionsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admName.trim() || !admNatId.trim()) return;

    const now = new Date();
    const formattedDateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours() % 12 || 12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;
    
    // Generate asymmetric keys (RSA)
    const keys = generateRSAKeyPair();
    // Build data payload representing the submitted student papers and files for validation
    const docPayload = `${admName.trim()}|${admNatId.trim()}|${Number(admPercentage)}|highschool_certificate.pdf|scanned_id.png|personal_portrait.jpg`;
    // Create signature using private key
    const sigResult = signWithRSA(docPayload, keys.privateKey);
    // Combine short public key params into electronicSignatureId
    const sigId = `SGU-RSA-SIG-e${keys.publicKey.e}-n${keys.publicKey.n}-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`;

    // Verify signature name matches applicant name (case-insensitive)
    const sigNameInput = (admSignatureName || admName).trim();
    const isSignatureCorrect = sigNameInput.toLowerCase() === admName.trim().toLowerCase();

    const newApp: AdmissionApplication = {
      id: `adm${Math.floor(100 + Math.random() * 900)}`,
      fullName: admName,
      nationalId: admNatId,
      highSchoolPercentage: Number(admPercentage),
      wishes: admWishesStr.split(",").map((s) => s.trim()),
      certificateFile: "highschool_certificate.pdf",
      idCardFile: "scanned_id.png",
      photoFile: "personal_portrait.jpg",
      paidFee: true,
      status: isSignatureCorrect ? "pending" : "modify_required",
      electronicSignatureId: sigId,
      electronicSignatureDate: formattedDateString,
      signatureConsent: admSignatureConsent,
      publicKey: keys.publicKey.pem,
      signatureValue: sigResult.signature,
      documentDataHash: docPayload,
      isTampered: !isSignatureCorrect,
      adminFeedback: isSignatureCorrect 
        ? undefined 
        : `فشل التحقق الرياضي: الاسم الموقع ("${sigNameInput}") لا يطابق اسم صاحب الهوية المدخل بالطلب.`
    };

    setApplications((prev) => [newApp, ...prev]);

    if (isSignatureCorrect) {
      addLog(`تسجيل متقدم جديد ببوابة القبول بالتوقيع الإلكتروني رقم ${sigId} لصالح: ${admName}`);
    } else {
      addLog(`🚨 فشل التحقق من توقيع المتقدم ${admName}! التوقيع ("${sigNameInput}") غير متطابق. تم إصدار تنبيه فوري تلقائي في سلة notifications.`);
      
      // Auto trigger student notification inside SQLite database state for notifications
      setSqliteTables((prevTables) => {
        return prevTables.map((tbl) => {
          if (tbl.tableName === "notifications") {
            const newNotif = {
              id: Math.floor(100 + Math.random() * 900),
              user_type: "Student",
              user_id: newApp.id,
              title: "🚨 فشل التحقق الأمني من توقيعك الإلكتروني بالطلب",
              message: `عذراً يا ${newApp.fullName}، تعذر التحقق الأمني الرقمي من التواقيع والمفاتيح العامة (RSA) لكون الاسم المكتوب في التوقيع ("${sigNameInput}") لا يتوافق مع الاسم المرفق بالملف الأكاديمي. يرجى مراجعة الاسم وإعادة التوقيع فوراً قبل تجميد طلب القبول.`,
              created_at: formattedDateString,
              is_read: 0
            };
            return {
              ...tbl,
              rows: [newNotif, ...tbl.rows]
            };
          }
          return tbl;
        });
      });
    }

    setAdmName("");
    setAdmNatId("");
    setAdmPercentage(88);
    setAdmSignatureName("");
    setAdmSignatureConsent(true);
  };

  const changeAppStatus = (id: string, stat: "accepted" | "rejected" | "modify_required", feedback: string) => {
    setApplications((prev) =>
      prev.map((ap) => (ap.id === id ? { ...ap, status: stat, adminFeedback: feedback } : ap))
    );
    addLog(`تعديل حالة طلب القبول ${id} إلى الأثر: ${stat}`);
  };

  // SGU Oracle Central DB logic handlers
  const handleResetDb = () => {
    const defaultList = generateUsers();
    setDbUsers(defaultList);
    setDbCustomCount(30052);
    setSqlQueryResultMsg("REBUILD SUCCESS: تم بنجاح استرداد وهيكلة القواعد وحقن 30,052 مستخدم مسجل بكشوف الكليات السنوي.");
    addLog("تم إعادة تهيئة قاعدة البيانات وإبرام التهيئة المركزية للـ ERP.");
  };

  const handleInsertDbUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserNameAr.trim()) return;
    
    const serial = String(10000 + dbUsers.length).slice(1);
    const id = `2026SGU-${newUserRole === "student" ? "ST" : "EMP"}-${serial}`;
    
    // determine email
    const cleanMail = `${newUserRole}_${dbUsers.length}@sgu.edu.eg`;
    
    const newUser: DatabaseUser = {
      id,
      nameAr: newUserNameAr,
      nameEn: `Added_${dbUsers.length}_user`,
      role: newUserRole,
      collegeId: newUserCollege,
      email: cleanMail,
      phone: `+20 10991${(1000 + dbUsers.length * 17) % 9999}`,
      nationalId: `2980${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      gpaOrSalary: newUserRole === "student" ? newUserGpaOrSalary : `${(12000 + (dbUsers.length * 150) % 15000).toLocaleString()} ج.م`,
      campusBranch: "فرع الصالحية الجديدة الرئيسي"
    };
    
    setDbUsers((prev) => [newUser, ...prev]);
    setDbCustomCount((prev) => prev + 1);
    setSqlQueryResultMsg(`INSERT INTO sgu_users_meta SUCCESS: تم إدراج العضو الجديد "${newUserNameAr}" بنجاح وتوليد الرقم الجامعي ${id}.`);
    addLog(`إدراج مستخدم جديد بقاعدة البيانات المركزية: ${newUserNameAr}`);
    
    // reset form
    setNewUserNameAr("");
  };

  const handleExecuteSimulatedSQL = (e: React.FormEvent) => {
    e.preventDefault();
    const query = sqlQueryInput.trim().toLowerCase();
    
    // Check if the query asks for one of the 15 SQLite tables
    const tableKeywords = [
      "colleges", "departments", "academic_years", "semesters", "students", 
      "professors", "courses", "course_sections", "enrollments", "grades", 
      "attendance", "exams_schedule", "tuition_fees", "admin_users", "notifications"
    ];
    
    const matchedTable = tableKeywords.find(tbl => query.includes(tbl));
    
    if (matchedTable) {
      setDbDatasetType("sqlite_fifteen");
      setSelectedSqliteTable(matchedTable);
      const tableObj = sqliteTables.find(t => t.tableName === matchedTable);
      const rowCount = tableObj ? tableObj.rows.length : 0;
      setSqlQueryResultMsg(`SELECT * FROM ${matchedTable}; \n-- [SUCCESS]: تم جلب ${rowCount} سجلات حقيقية مفعّلة بنجاح من جدول "${tableObj?.descriptionAr || matchedTable}" طبقاً للمخطط الهيكلي المقر.`);
      addLog(`تشغيل استعلام SQL على جدول ${matchedTable}: نجاح`);
      return;
    }
    
    if (query.includes("select") && query.includes("where")) {
      if (query.includes("suspended")) {
        setSelectedCollegeId("all");
        setSelectedRoleId("all");
        setDbSearchQuery(""); // clear
        const suspendedCount = dbUsers.filter(u => u.status === "suspended").length;
        setSqlQueryResultMsg(`SELECT * FROM sgu_users WHERE status = 'suspended';  -- عثر السيرفر على ${suspendedCount} مستخدم معلق لأسباب إدارية/دراسية.`);
      } else if (query.includes("student")) {
        setSelectedRoleId("student");
        const studentCount = dbUsers.filter(u => u.role === "student").length;
        setSqlQueryResultMsg(`SELECT * FROM sgu_users WHERE role_id = 'student';  -- تم تصفية العرض لفئة الطلاب بنجاح (طابق ${studentCount} سجل).`);
      } else if (query.includes("fcis") || query.includes("حاسبات")) {
        setSelectedCollegeId("fcis");
        const fcisCount = dbUsers.filter(u => u.collegeId === "fcis").length;
        setSqlQueryResultMsg(`SELECT * FROM sgu_users WHERE college_id = 'fcis';  -- تم فرز كوادر وطلاب كليات الحاسبات والمعلومات بنجاح (طابق ${fcisCount} سجل).`);
      } else {
        setSqlQueryResultMsg("SELECT QUERY EXECUTED: تم تنفيذ استعلام دمج القنوات بنجاح. يتم تصفية الجدول أدناه تلقائياً.");
      }
    } else if (query.includes("insert") || query.includes("update") || query.includes("delete")) {
      setSqlQueryResultMsg("WARNING (READ-ONLY PROXIED CLIENT): لتفادي تلف المفاتيح الخارجية للـ DB، يرجى الاستعانة لوحة التحكم التفاعلية بالأسفل لإجراء عمليات الإدراج.");
    } else {
      setSqlQueryResultMsg(`SELECT * FROM sgu_all_users_view;  -- تم جلب سجلات ${dbCustomCount} مستخدم نشط من كليات جامعة الصالحية السبعة بنجاح.`);
    }
  };

  // DB Filter logic
  const filteredDbUsers = dbUsers.filter((u) => {
    const matchesSearch =
      u.nameAr.includes(dbSearchQuery) ||
      u.id.toLowerCase().includes(dbSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(dbSearchQuery.toLowerCase()) ||
      u.phone.includes(dbSearchQuery);
      
    const matchesCollege = selectedCollegeId === "all" || u.collegeId === selectedCollegeId;
    const matchesRole = selectedRoleId === "all" || u.role === selectedRoleId;
    
    return matchesSearch && matchesCollege && matchesRole;
  });

  // Filter lists based on global search query
  const filteredCourses = courses.filter((c) =>
    c.name.includes(searchQuery) || c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("sgu_is_logged_in", "false");
    addLog("تم تسجيل الخروج بنجاح والعودة لبوابة الأمان الموحدة SIS.");
  };

  if (!isLoggedIn) {
    return (
      <SguSisLogin
        lang={lang}
        setLang={setLang}
        dbUsers={dbUsers}
        onLoginSuccess={(role, studentId, empRole) => {
          localStorage.setItem("sgu_is_logged_in", "true");
          setIsLoggedIn(true);

          let matchingDbUser = SGU_CENTRAL_USERS.find((u) => u.id === studentId);
          if (!matchingDbUser && dbUsers) {
            const dbU = dbUsers.find((u) => u.id === studentId);
            if (dbU) {
              matchingDbUser = {
                id: dbU.id,
                universityId: dbU.id,
                nameAr: dbU.nameAr,
                nameEn: dbU.nameEn || dbU.nameAr,
                email: dbU.email,
                roleId: dbU.role as any,
                collegeId: dbU.collegeId,
                departmentAr: "الشعبة العامة / إدارة",
                departmentEn: "General / Admin Dept",
                programAr: "برنامج أكاديمي معتمد",
                programEn: "Accredited Degree Program",
                academicLevelAr: dbU.role === "student" ? "المستوى الأول" : "كادر الجامعة العامل",
                academicLevelEn: dbU.role === "student" ? "Year 1 - Semester 1" : "SGU Active Staff",
                status: dbU.status || "active",
                gpaOrSalary: dbU.gpaOrSalary,
                nationalId: dbU.nationalId,
                phone: dbU.phone,
                campusBranchAr: dbU.campusBranch || "الفرع الرئيسي",
                campusBranchEn: "Main Campus",
                avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
              };
            }
          }

          if (matchingDbUser) {
            const routeInfo = resolveDynamicRoute(matchingDbUser);
            setActiveSegment(routeInfo.activeSegment as any);
            setSubTab(routeInfo.subTab);

            let mappedRole: "student" | "faculty" | "employee" | "admin" | "applicant" | "parent" = "student";
            if (matchingDbUser.roleId === "student") {
              mappedRole = "student";
            } else if (matchingDbUser.roleId === "faculty" || matchingDbUser.roleId === "ta" || matchingDbUser.roleId === "advisor" || matchingDbUser.roleId === "dept_head" || matchingDbUser.roleId === "dean") {
              mappedRole = "faculty";
            } else if (matchingDbUser.roleId === "admin" || matchingDbUser.roleId === "super_admin") {
              mappedRole = "admin";
            } else {
              mappedRole = "employee";
            }

            setUserRole(mappedRole);
            localStorage.setItem("sgu_user_role", mappedRole);

            if (matchingDbUser.roleId === "finance_staff") {
              setEmployeeRole("finance_officer");
              localStorage.setItem("sgu_employee_role", "finance_officer");
            } else if (matchingDbUser.roleId === "library_staff") {
              setEmployeeRole("student_affairs");
              localStorage.setItem("sgu_employee_role", "student_affairs");
            } else if (empRole) {
              setEmployeeRole(empRole);
              localStorage.setItem("sgu_employee_role", empRole);
            }

            const updatedStudent = {
              id: matchingDbUser.id,
              nameArabic: matchingDbUser.nameAr,
              nameEnglish: matchingDbUser.nameEn || "SGU Member",
              email: matchingDbUser.email,
              phone: matchingDbUser.phone,
              nationalId: matchingDbUser.nationalId,
              totalGPA: parseFloat(matchingDbUser.gpaOrSalary) || 3.42,
              level: matchingDbUser.academicLevelAr,
              college: matchingDbUser.collegeId.toUpperCase(),
              birthDate: "2002-10-15",
              nationality: "مصر",
              address: "الدقي، الجيزة، مصر",
              guardianName: "أحمد عبد الرحمن عثمان",
              emergencyPhone: "+201287654321",
              department: matchingDbUser.departmentAr,
              major: matchingDbUser.programAr,
              advisor: "أ.د. محمد الشافعي",
              completedHours: 94,
              requiredHours: 136,
              avatarUrl: matchingDbUser.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
            };

            setStudent(updatedStudent);
            localStorage.setItem("u_student", JSON.stringify(updatedStudent));

            triggerSystemPush(
              lang === "ar" ? "🛡️ بوابة النفاذ الذكي SGU" : "🛡️ SGU Smart Access Gateway",
              lang === "ar" ? routeInfo.messageAr : routeInfo.messageEn
            );

            if (matchingDbUser.email) {
              loadStudentAndUsersFromSupabase(matchingDbUser.email);
            }
          }
          addLog(`نمط التحقق: تم السماح للمستخدم بتسجيل الدخول بصفة: ${role === "student" ? "طالب" : role === "faculty" ? "عضو هيئة تدريس" : role === "employee" ? `موظف (${empRole || "إدارة"})` : "مسؤول نظام"}`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900">
      {/* Dynamic Security & Audit Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-[11px] font-mono px-4 py-2 flex flex-wrap justify-between items-center text-emerald-400 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t("hybSecurity", lang)} (AES-256 + Zero-Trust Enabled)</span>
          </div>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-400">{t("compliance", lang)}</span>
          <span className="text-slate-705 font-light">|</span>
          
          {/* Supabase Real Connection Status */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
            {supabaseStatus === "connecting" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-amber-400 text-[10px]">
                  {lang === "ar" ? "قاعدة بيانات Supabase: جاري المصادقة الأمنية ومطابقة الهوية السحابية..." : "Supabase: Securely pairing cloud credentials..."}
                </span>
              </>
            )}
            {supabaseStatus === "success" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                <span className="text-emerald-300 font-semibold text-[10px]">
                  {lang === "ar" ? "قاعدة بيانات Supabase: متصل بنجاح ومطابق للهوية (عبر المرجع السحابي)" : "Supabase: Connected (Active Student Verified via Cloud)"}
                </span>
              </>
            )}
            {supabaseStatus === "error" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="text-rose-400 text-[10px]">
                  {lang === "ar" ? "قاعدة بيانات Supabase: وضع الأمان المحلي (Failover Mode Active)" : "Supabase: Secured Local Failover Active"}
                </span>
              </>
            )}
            {supabaseStatus === "idle" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span className="text-slate-400 text-[10px]">
                  {lang === "ar" ? "قاعدة بيانات Supabase: خامل (بانتظار هوية المستخدم)" : "Supabase: Dormant (Waiting for active token)"}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 font-medium">
          <span className="text-slate-500">{t("cairoTime", lang)}</span>
          <span className="bg-slate-950 px-2 py-0.5 rounded text-neutral-300">{t("erpVersion", lang)}</span>
        </div>
      </div>

      {/* Main Header Brand & Navigation Segment */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-750 shadow-md shadow-emerald-500/5 shrink-0 overflow-hidden">
            <img 
              src="https://graph.facebook.com/SGU.EG/picture?width=400&height=400" 
              alt="شعار جامعة الصالحية الجديدة SGU" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // SGU stable server URL fallback
                (e.target as HTMLImageElement).src = "https://sgu.edu.eg/wp-content/uploads/2021/03/SGU-Logo-png.png";
              }}
            />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                {t("appName", lang)}
              </h1>
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="cursor-pointer flex items-center gap-1.5 bg-slate-950 hover:bg-slate-850 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border border-slate-800 text-emerald-400 hover:text-emerald-300 transition"
                title="Switch Language / تغيير اللغة"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === "ar" ? "English" : "العربية"}</span>
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="cursor-pointer flex items-center gap-1.5 bg-slate-950 hover:bg-slate-850 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border border-slate-800 text-emerald-400 hover:text-emerald-300 transition"
                title="تغيير المظهر / Dark-Light Switcher"
                aria-label="تغيير مظهر المتصفح بين الداكن والمضيء"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{lang === "ar" ? "مضيء" : "Light"}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{lang === "ar" ? "داكن" : "Dark"}</span>
                  </>
                )}
              </button>

              {/* SGU Live Push Bulletin Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotificationsDropdown(!showNotificationsDropdown);
                    // Mark all as read when opening
                    setPushNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  }}
                  className="cursor-pointer flex items-center gap-1.5 bg-slate-950 hover:bg-slate-850 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border border-slate-800 text-emerald-400 hover:text-emerald-300 transition relative"
                  title="إشعارات النظام الفورية / System Alerts"
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === "ar" ? "الإشعارات" : "Alerts"}</span>
                  {pushNotifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white animate-pulse">
                      {pushNotifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {showNotificationsDropdown && (
                  <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 p-3 text-right">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPushNotifications([]);
                        }}
                        className="text-[9.5px] text-rose-455 hover:underline cursor-pointer"
                      >
                        {lang === "ar" ? "مسح الكل" : "Clear All"}
                      </button>
                      <h4 className="text-xs font-bold text-slate-200">
                        {lang === "ar" ? "مركز الإشعارات الفورية" : "Push Alerts Center"}
                      </h4>
                    </div>

                    <div className="space-y-2 max-h-62 overflow-y-auto">
                      {pushNotifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-500">
                          {lang === "ar" ? "لا توجد تنبيهات نشطة حالياً" : "No active alerts"}
                        </div>
                      ) : (
                        pushNotifications.map(n => (
                          <div key={n.id} className="bg-slate-950 p-2 text-right rounded border border-slate-850 space-y-1">
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[8.5px] text-slate-500 font-mono">{n.date}</span>
                              <span className="text-[10px] font-bold text-emerald-400">{n.title}</span>
                            </div>
                            <p className="text-[9.5px] text-slate-300 leading-normal font-medium">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{t("systemTitle", lang)}</p>
          </div>
        </div>

        {/* Global Dashboard Views switcher (أنواع المستخدمين) */}
        {userRole === "admin" ? (
          <div className="flex flex-wrap items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 gap-1.5 select-none text-xs">
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded font-bold">
              {lang === "ar" ? "🛡️ محاكاة المسؤول" : "🛡️ Admin Simulator"}
            </span>
            <button
              onClick={() => {
                setActiveSegment("student");
                setSubTab("overview");
              }}
              className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeSegment === "student"
                  ? "bg-emerald-600 text-slate-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {t("studentMenu", lang)}
            </button>
            
            <button
              onClick={() => {
                setActiveSegment("faculty");
                setSubTab("faculty_overview");
              }}
              className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeSegment === "faculty"
                  ? "bg-teal-600 text-slate-950"
                  : "text-slate-400 hover:text-slate-250 hover:bg-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-400" />
              {lang === "ar" ? "بوابة التدريس" : "Faculty"}
            </button>
            <button
              onClick={() => {
                setActiveSegment("registrar");
                setSubTab("admissions");
              }}
              className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeSegment === "registrar"
                  ? "bg-emerald-600 text-slate-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {t("registrarMenu", lang)}
            </button>
            <button
              onClick={() => {
                setActiveSegment("executive");
                setSubTab("finances");
              }}
              className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeSegment === "executive"
                  ? "bg-emerald-600 text-slate-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {t("executiveMenu", lang)}
            </button>
            <button
              onClick={() => {
                setActiveSegment("database");
                setSubTab("central_db");
              }}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeSegment === "database"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              {t("databaseMenu", lang)}
            </button>
            <button
              onClick={() => {
                setActiveSegment("pro_systems");
                setSubTab("advanced_systems");
              }}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeSegment === "pro_systems"
                  ? "bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-amber-400 hover:text-amber-250 hover:bg-slate-900 border border-amber-500/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t("systems10Menu", lang)}
            </button>

            <button
              onClick={handleLogout}
              className="cursor-pointer px-3 py-1.5 rounded-lg font-bold bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-slate-950 border border-rose-900/40 hover:border-transparent transition flex items-center gap-1.5 font-sans"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t("logout", lang)}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-bold font-mono">
              {userRole === "student" && (lang === "ar" ? "🎓 بوابة الطالب" : "🎓 Student Portal")}
              {userRole === "faculty" && (lang === "ar" ? "🏫 بوابة كادر التدريس" : "🏫 Faculty Portal")}
              {userRole === "employee" && (
                employeeRole === "registrar" ? (lang === "ar" ? "💼 موظف القبول والتسجيل" : "💼 Registrar Officer") :
                employeeRole === "student_affairs" ? (lang === "ar" ? "💼 موظف شؤون الطلاب" : "💼 Student Affairs Officer") :
                (lang === "ar" ? "💼 موظف الإدارة المالية" : "💼 Financial Officer")
              )}
            </span>
            <button
              onClick={handleLogout}
              className="cursor-pointer px-3.5 py-1.5 rounded-lg font-bold bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-slate-950 border border-rose-900/40 hover:border-transparent transition flex items-center gap-1.5 text-xs font-sans"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t("logout", lang)}
            </button>
          </div>
        )}
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sub-Menu Sidebar (Dynamic based on selected segment) */}
        <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-l border-slate-800 p-4 shrink-0 flex flex-col gap-5">
          {/* Quick Active User Summary Header (Role-Based) */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center gap-3">
            <img
              src={student.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
              alt="Avatar"
              className="w-11 h-11 rounded-lg cover border border-emerald-500/30 object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1 text-right">
              <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded-sm font-semibold truncate block w-fit mb-0.5 font-mono">
                {student.id}
              </span>
              <h4 className="text-xs font-bold text-slate-100 truncate">
                {lang === "ar" ? student.nameArabic : student.nameEnglish}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {lang === "ar" ? student.major : student.department}
              </p>
            </div>
          </div>

          {/* Tab Sub Navigations */}
          <div className="flex flex-col gap-1.5 flex-1 p-0.5">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase px-2">
              {t("activeServices", lang)}
            </span>

            {((userRole === "student") || (userRole === "admin" && activeSegment === "student")) && (
              <>
                <button
                  onClick={() => setSubTab("college_portal")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "college_portal" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    {lang === "ar" ? "🏛️ بيئة الكلية المستقلة" : "🏛️ College Portal"}
                  </span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded-full font-mono shrink-0 font-bold">
                    ACTIVE
                  </span>
                </button>

                <button
                  onClick={() => setSubTab("overview")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "overview" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    {t("profileSchedule", lang)}
                  </span>
                </button>
                <button
                  onClick={() => setSubTab("courses")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "courses" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    {t("courseRegTransfer", lang)}
                  </span>
                </button>
                <button
                  onClick={() => setSubTab("attendance")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "attendance" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    {t("attendanceAbsence", lang)}
                  </span>
                  <span className="text-[9px] bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded-full font-mono shrink-0">
                    {t("faceId", lang)}
                  </span>
                </button>
                <button
                  onClick={() => setSubTab("assignments")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "assignments" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    {t("assignmentsProjects", lang)}
                  </span>
                </button>
                <button
                  onClick={() => setSubTab("library")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "library" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-emerald-400" />
                    {t("centralLibrary", lang)}
                  </span>
                </button>
                
                <button
                  onClick={() => setSubTab("presentations")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "presentations" ? "bg-slate-800 text-emerald-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Presentation className="w-4 h-4 text-amber-500" />
                    {t("presentations", lang)}
                  </span>
                  <span className="text-[8px] bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold shrink-0">
                    SLIDES
                  </span>
                </button>
                
                <button
                  onClick={() => setSubTab("student_payments")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "student_payments" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    {lang === "ar" ? "الرسوم والدفع الإلكتروني" : "Tuition & Online Payments"}
                  </span>
                  {finance.filter(f => !f.paid).length > 0 && (
                    <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full font-mono shrink-0">
                      {lang === "ar" ? "مستحق" : "Due"}
                    </span>
                  )}
                </button>

                <div className="border-t border-slate-850 my-1"></div>

                <button
                  onClick={() => setSubTab("mobile_companion")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "mobile_companion" ? "bg-slate-800 text-teal-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-405 text-cyan-400" />
                    {lang === "ar" ? "المركز المحمول ونظام التراسل" : "SGU Mobile & WhatsApp Hub"}
                  </span>
                  <span className="text-[8px] bg-cyan-950 text-cyan-400 px-1 rounded uppercase font-mono">
                    SIM
                  </span>
                </button>

                <button
                  onClick={() => setSubTab("ai_chatbot")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "ai_chatbot" ? "bg-slate-800 text-teal-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    {lang === "ar" ? "المرشد الأكاديمي الذكي (Gemini)" : "Smart AI Counselor (Gemini)"}
                  </span>
                  <span className="text-[8px] bg-emerald-950 text-emerald-405 text-emerald-400 px-1 rounded uppercase font-mono">
                    AI
                  </span>
                </button>

                <button
                  onClick={() => setSubTab("analytics")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "analytics" ? "bg-slate-800 text-teal-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-400" />
                    {lang === "ar" ? "توقعات ومحاكاة المعدل الـ GPA" : "GPA & Course Predictor"}
                  </span>
                  <span className="text-[8px] bg-teal-950 text-teal-400 px-1 rounded uppercase font-mono animate-pulse">
                    LIVE
                  </span>
                </button>

                <button
                  onClick={() => setSubTab("blockchain_certs")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "blockchain_certs" ? "bg-slate-800 text-teal-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-pink-400" />
                    {lang === "ar" ? "وثائق التخرج بالبلوكتشين" : "Blockchain Degree Ledger"}
                  </span>
                  <span className="text-[8px] bg-pink-950 text-pink-400 px-1 rounded uppercase font-mono">
                    BCD
                  </span>
                </button>
              </>
            )}

            {((userRole === "faculty") || (userRole === "admin" && activeSegment === "faculty")) && (
              <>
                <button
                  onClick={() => setSubTab("faculty_overview")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "faculty_overview" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-teal-400" />
                  {lang === "ar" ? "لوحة الأكاديمي والجدول" : "Advisor Schedule & Stats"}
                </button>

                <button
                  onClick={() => setSubTab("faculty_grades")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "faculty_grades" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    {lang === "ar" ? "رصد وإدخال درجات الطلاب" : "Grade Recording Console"}
                  </span>
                  <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-mono shrink-0">
                    {lang === "ar" ? "الكنترول" : "Control"}
                  </span>
                </button>

                <button
                  onClick={() => setSubTab("faculty_research")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "faculty_research" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Award className="w-4 h-4 text-teal-400" />
                  {lang === "ar" ? "البحوث العلمية والمنح" : "Academic Research & Grants"}
                </button>
              </>
            )}

            {(userRole === "admin" && activeSegment === "registrar") && (
              <>
                <button
                  onClick={() => setSubTab("admissions")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "admissions" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  {t("applicantRequests", lang)}
                </button>
              </>
            )}

            {(userRole === "admin" && activeSegment === "executive") && (
              <>
                <button
                  onClick={() => setSubTab("finances")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "finances" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  {t("feesPayment", lang)}
                </button>
                <button
                  onClick={() => setSubTab("bi_analytics")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "bi_analytics" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  {t("executiveDashboard", lang)}
                </button>
                <button
                  onClick={() => setSubTab("accreditation")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "accreditation" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  {t("accreditationReports", lang)}
                </button>
              </>
            )}

            {((userRole === "admin" && activeSegment === "database")) && (
              <>
                <button
                  onClick={() => setSubTab("central_db")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "central_db" ? "bg-slate-800 text-teal-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  {t("db30kUsers", lang)}
                </button>
                <button
                  onClick={() => setSubTab("chapters_40")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "chapters_40" ? "bg-slate-800 text-amber-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-500" />
                  {t("chapters40", lang)}
                </button>
                <button
                  onClick={() => setSubTab("sec_database")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    subTab === "sec_database" ? "bg-slate-800 text-emerald-400 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {lang === "ar" ? "الأمان وتحسين الهيكلية والنسخ" : "Security, DB & Backups Hub"}
                </button>
              </>
            )}

            {userRole === "employee" && (
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-2.5 text-right">
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  {lang === "ar" ? "بوابة الموظف المعتمدة" : "OFFICIAL EMPLOYEE GATE"}
                </span>
                <p className="text-xs font-bold text-slate-150">
                  {employeeRole === "registrar" ? (lang === "ar" ? "إدارة القبول والتسجيل" : "Admissions & Registrar") :
                   employeeRole === "student_affairs" ? (lang === "ar" ? "شؤون الطلاب والوثائق" : "Student Affairs & Docs") :
                   (lang === "ar" ? "الشؤون المالية والتحصيل" : "Treasury & Finance Department")}
                </p>
                <div className="text-[10.5px] text-slate-400 space-y-1.5 pt-1.5 border-t border-slate-900">
                  <p className="text-amber-400 font-bold">• {lang === "ar" ? "قناة مزامنة حية نشطة" : "Active live database sync"}</p>
                  <p>• {lang === "ar" ? "رصد وقبول الطلبات والمدفوعات" : "Process requests & postings"}</p>
                  <p>• {lang === "ar" ? "صلاحية كتابة كاملة للملفات" : "Write access: Enabled"}</p>
                </div>
              </div>
            )}

            {userRole === "applicant" && (
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-2.5 text-right">
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  {lang === "ar" ? "بوابة المتقدمين الجدد" : "NEW APPLICANTS PORTAL"}
                </span>
                <button
                  onClick={() => setSubTab("overview")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "overview" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    {lang === "ar" ? "طلب التقديم والتوقيع" : "Application & Sign"}
                  </span>
                </button>
              </div>
            )}

            {userRole === "parent" && (
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-2.5 text-right">
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  {lang === "ar" ? "بوابة أولياء الأمور" : "PARENTS MONITOR GATE"}
                </span>
                <button
                  onClick={() => setSubTab("overview")}
                  className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                    subTab === "overview" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    {lang === "ar" ? "متابعة الابن والمصروفات" : "Monitor Academic & Fees"}
                  </span>
                </button>
              </div>
            )}

            {activeSegment === "pro_systems" && userRole === "admin" && (
              <div className="text-right p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl text-amber-300 space-y-1">
                <span className="text-xs font-bold block">{t("extraSystemsTitle", lang)}</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">{t("extraSystemsDesc", lang)}</p>
              </div>
            )}

            {/* General Smart Campus Services */}
            <span className="text-[10px] text-slate-500 font-bold uppercase block px-2 mt-4 mb-2">
              •
            </span>
            <button
              onClick={() => setSubTab("dorms_transport")}
              className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                subTab === "dorms_transport" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              <Building className="w-4 h-4 text-teal-400" />
              {t("dormsTransport", lang)}
            </button>
            <button
              onClick={() => setSubTab("colleges_hub")}
              className={`text-right w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                subTab === "colleges_hub" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              <Award className="w-4 h-4 text-amber-500 animate-pulse" />
              {t("collegesHub", lang)}
            </button>
          </div>

          {/* Quick System Diagnostics */}
          <div className="border-t border-slate-800 pt-3">
            <span className="text-[10px] text-slate-500 font-mono block mb-1.5">{t("systemAuditTrail", lang)}</span>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[10px] font-mono text-slate-400 space-y-1.5">
              {logs.slice(0, 2).map((lg, i) => (
                <p key={i} className="line-clamp-2 leading-relaxed">{lg}</p>
              ))}
            </div>
          </div>
        </aside>

        {/* Dynamic Center Work Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
          {/* Quick Search and status banner (Student Specific) */}
          {((userRole === "student") || (userRole === "admin" && activeSegment === "student")) && (
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute right-3 top-2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={t("activeSearch", lang)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-600"
                />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {formatString(t("activeStudentBanner", lang), {
                  name: lang === "ar" ? student.nameArabic : "Youssef El-Kurdy",
                  major: lang === "ar" ? student.major : "AI & Data Science"
                })}
              </p>
            </div>
          )}

          {/* APPLICANT PORTAL VIEW */}
          {userRole === "applicant" && (
            <SguApplicantPortal
              applications={applications}
              setApplications={setApplications}
              lang={lang}
              triggerSystemPush={triggerSystemPush}
              addLog={addLog}
            />
          )}

          {/* PARENT PORTAL VIEW */}
          {userRole === "parent" && (
            <SguParentPortal
              student={student}
              courses={courses}
              finance={finance}
              setFinance={setFinance}
              lang={lang}
              triggerSystemPush={triggerSystemPush}
              addLog={addLog}
            />
          )}

          {/* INDEPENDENT COLLEGE PORTAL VIEW */}
          {activeSegment === "student" && subTab === "college_portal" && (
            <SguIndependentCollegePortal
              student={student}
              setStudent={setStudent}
              addLog={addLog}
              lang={lang}
              triggerSystemPush={triggerSystemPush}
            />
          )}

          {/* ACADEMIC OVERVIEW DASHBOARD */}
          {activeSegment === "student" && subTab === "overview" && (
            <div className="space-y-6">
              {/* Quick High level stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 text-[11px] block font-medium">المعدل التراكمي العام GPA</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{student.totalGPA}</div>
                  <span className="text-[10px] text-emerald-350">من أصل 4.00 (امتياز مع مرتبة الشرف)</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 text-[11px] block font-medium">الساعات المعتمدة المجتازة</span>
                  <div className="text-2xl font-bold text-teal-400 mt-1">
                    {student.completedHours} / {student.requiredHours}
                  </div>
                  <span className="text-[10px] text-slate-400">باقي للتخرج {student.requiredHours - student.completedHours} ساعة</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 text-[11px] block font-medium">المواد المسجلة هذا الفصل</span>
                  <div className="text-2xl font-bold text-blue-400 mt-1">
                    {courses.filter((c) => c.status === "registered").length} مقرر
                  </div>
                  <span className="text-[10px] text-blue-300">مسجلة بالتوافق مع المرشد العلمي</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 text-[11px] block font-medium">الوضع الأكاديمي والفرقة</span>
                  <div className="text-sm font-bold text-amber-400 truncate mt-2">{student.level}</div>
                  {student.level.includes("مجمد") ? (
                    <button
                      onClick={handleUnfreeze}
                      className="cursor-pointer text-[10px] text-emerald-400 font-bold hover:underline block mt-1"
                    >
                      إلغاء التجميد فوراً
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 block">المرشد الفني: {student.advisor}</span>
                  )}
                </div>
              </div>

              {/* Weekly Schedule & Registered Courses Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Courses detail table */}
                <div className="lg:col-span-7 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-350 tracking-wider">سجل درجات ومقررات الطالب والمستجدات لها</h3>
                  <div className="space-y-2.5 max-h-96 overflow-y-auto">
                    {filteredCourses.map((c) => (
                      <div
                        key={c.code}
                        className={`p-3 rounded-lg border flex justify-between items-center transition ${
                          c.status === "completed"
                            ? "bg-slate-950/30 border-slate-800"
                            : c.status === "registered"
                            ? "bg-emerald-950/15 border-emerald-900/30"
                            : "bg-slate-950/80 border-slate-900"
                        }`}
                      >
                        <div className="text-right">
                          <span className="bg-slate-800 text-slate-350 text-[9px] px-1.5 py-0.5 rounded font-mono">
                            {c.code}
                          </span>
                          <h4 className="text-xs font-bold text-slate-100 mt-1">{c.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{c.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-400 font-mono">{c.credits} ساعة</span>
                          {c.status === "completed" ? (
                            <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                              منتهي بنجاح ({c.gradeObtained})
                            </span>
                          ) : c.status === "registered" ? (
                            <span className="bg-teal-950 border border-teal-800 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded">
                              مسجل حالياً
                            </span>
                          ) : (
                            <span className="bg-slate-900 text-slate-500 text-[10px] px-2 py-0.5 rounded">
                              غير مسجل
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Schedule */}
                <div className="lg:col-span-5 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-350 tracking-wider">الجدول الدراسي الأسبوعي الفعلي للمحاضرات</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {schedules.map((s, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-start gap-2.5">
                        <div className="w-14 text-center shrink-0 border-l border-slate-800 pl-2">
                          <span className="text-xs font-bold text-emerald-400 block">{s.day}</span>
                          <span className="text-[9.5px] text-slate-500 font-mono block mt-0.5">{s.timeSlot.split(" - ")[0]}</span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-200">{s.courseName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{s.courseCode}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">{s.instructor}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>
                              {s.room} - {s.building}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACADEMIC COURSE REGISTRATION & TRANSFERS */}
          {activeSegment === "student" && subTab === "courses" && (
            <div className="space-y-6">
              <div className="bg-emerald-950/25 border border-emerald-900/30 p-5 rounded-xl">
                <h2 className="text-base font-bold text-emerald-400 mb-1">تنمية وتلقي المقررات للفصل الدراسي</h2>
                <p className="text-xs text-slate-350">
                  يرجى تسليم المقررات المرغوبة بالضغط على تسجيل. يمكنك سحب مقرر أو تجميد القائد الجامعي بالنماذج الموضحة أدناه.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Course register block */}
                <div className="lg:col-span-8 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-300">أضف أو انسحب من المواد المتوافرة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((c) => (
                      <div key={c.code} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="bg-slate-900 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                              {c.code}
                            </span>
                            <span className="text-[10px] text-slate-500">{c.credits} ساعات</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 mt-1">{c.name}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mt-1">{c.description}</p>
                        </div>

                        <div className="border-t border-slate-900 pt-2.5 flex justify-between items-center text-xs">
                          <span>
                            {c.status === "completed" && <span className="text-emerald-400">منتهي</span>}
                            {c.status === "registered" && <span className="text-teal-400">مسجل حالياً</span>}
                            {c.status === "available" && <span className="text-slate-400">متاح للتسجيل</span>}
                            {c.status === "locked" && <span className="text-rose-500 text-[10px]">تتطلب مقرر سابق</span>}
                          </span>

                          {c.status === "available" && (
                            <button
                              onClick={() => handleRegisterCourse(c.code)}
                              className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-slate-950 font-bold px-2.5 py-1.5 rounded text-[11px] transition"
                            >
                              تسجيل +
                            </button>
                          )}

                          {c.status === "registered" && (
                            <button
                              onClick={() => handleWithdrawCourse(c.code)}
                              className="bg-rose-950 hover:bg-rose-900 text-rose-350 cursor-pointer px-2.5 py-1.5 rounded text-[11px] transition"
                            >
                              تقديم انسحاب x
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Freeze & Transfers */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Freeze semester */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-slate-3 text-amber-500 flex items-center gap-1 bg-amber-950/20 p-2 rounded">
                      <AlertTriangle className="w-4 h-4" />
                      تجميد القيد الدراسي مؤقتاً
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      طلب تجميد القيد للفصل الجاري في حال وجود موانع أو أعذار قهرية مع الاحتفاظ بالسجلات بالكامل.
                    </p>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="السبب (مثال: عذر طبي أو قضاء واجب)"
                        value={freezeReason}
                        onChange={(e) => setFreezeReason(e.target.value)}
                        className="bg-slate-950 border border-slate-850 rounded p-2 text-xs text-slate-100 w-full focus:outline-none focus:border-amber-600"
                      />
                      <button
                        onClick={handleFreezeSemester}
                        disabled={!freezeReason.trim()}
                        className="cursor-pointer w-full bg-slate-800 hover:bg-slate-705 text-slate-300 font-bold text-xs py-2 rounded transition disabled:opacity-50"
                      >
                        تقديم طلب التجميد للأثر
                      </button>
                    </div>
                  </div>

                  {/* Program Transfer */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-slate-3 text-teal-400 flex items-center gap-1 bg-teal-950/20 p-2 rounded">
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                      تحويل تخصص القسم العلمي
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      طلب النفاذ والتحويل لأي أقسام بديلة داخل الكلية للتخصص العلمي.
                    </p>

                    <div className="space-y-3">
                      <select
                        value={selectedMajor}
                        onChange={(e) => setSelectedMajor(e.target.value)}
                        className="bg-slate-950 border border-slate-850 rounded p-2 text-xs text-slate-100 w-full focus:outline-none"
                      >
                        <option value="">-- اختر القسم المراد --</option>
                        <option value="الذكاء الاصطناعي">الذكاء الاصطناعي (AI)</option>
                        <option value="علوم الحاسب">علوم الحاسب المتقدمة (CS)</option>
                        <option value="الأمن السيبراني">الأمن السيبراني والشبكات</option>
                        <option value="نظم المعلومات">نظم معلومات الحوسبة</option>
                      </select>
                      <button
                        onClick={handleMajorTransfer}
                        disabled={!selectedMajor}
                        className="cursor-pointer w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs py-2 rounded transition disabled:opacity-50"
                      >
                        تقدم بالطلب والتنفيذ التلقائي
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRESENCE & ABSENCE HISTOLOGY SCANNER */}
          {activeSegment === "student" && subTab === "attendance" && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200">بوابة رصد الحضور بصمة الـ QR والوجه الجغرافي</h3>
                <p className="text-xs text-slate-400">
                  اضغط على الزر المقابل لأي مقرر رصد وتأكيد حضور المحاضرات بالزمن الفعلي بناءً على رصد الـ GPS.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses
                    .filter((c) => c.status === "registered")
                    .map((course) => (
                      <div key={course.code} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] bg-slate-900 text-slate-400 p-1 rounded font-mono block w-fit">
                            {course.code}
                          </span>
                          <h4 className="text-xs font-bold text-slate-200 mt-1">{course.name}</h4>
                        </div>
                        <button
                          onClick={() => triggerQRScan(course.code)}
                          className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          مسح كود وتسجيل الحضور
                        </button>
                      </div>
                    ))}
                </div>

                {qrMessage && (
                  <div className="p-3 bg-emerald-950 border border-emerald-900/40 text-emerald-400 rounded-lg text-xs font-semibold animate-pulse text-center">
                    {qrMessage}
                  </div>
                )}
              </div>

              {/* Attendance Log Table */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-350">البيان التاريخي المسجل لحضور المحاضرات</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="pb-2">المقرر العلمي</th>
                        <th className="pb-2">تاريخ اليوم</th>
                        <th className="pb-2">ساعة الرصد البصري</th>
                        <th className="pb-2">الآلية المتبعة</th>
                        <th className="pb-2">حالة الحضور</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {attendance.map((rec, i) => (
                        <tr key={i} className="hover:bg-slate-950/20 text-slate-300">
                          <td className="py-2">{rec.courseName}</td>
                          <td className="py-2">{rec.date} ({rec.day})</td>
                          <td className="py-2 font-mono">{rec.time}</td>
                          <td className="py-2">
                            <span className="bg-slate-950 text-slate-400 text-[10px] p-1 rounded font-mono">
                              {rec.method} Scanner
                            </span>
                          </td>
                          <td className="py-2">
                            {rec.status === "present" ? (
                              <span className="text-emerald-400 font-bold">● حاضر</span>
                            ) : rec.status === "late" ? (
                              <span className="text-amber-400 font-bold">● متأخر</span>
                            ) : (
                              <span className="text-rose-500 font-bold">● غائب</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* HOMEWORK & TEAM PROJECTS UPLOADER */}
          {activeSegment === "student" && subTab === "assignments" && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-100">بوابة تسليم الواجبات وتكليفات فرق العمل</h3>
                <p className="text-xs text-slate-400">
                  ارفع مستندات المشروع أو ملف الأكواد البرمجية (ZIP/PDF) مباشرة لإفادة معيدي المقررات للتصحيح الفوري.
                </p>

                <form onSubmit={handleUploadAssignment} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2 text-right">
                      <label className="text-slate-400 font-semibold block">اختر التكليف المستهدف لتسليمه:</label>
                      <select
                        value={subAsgId}
                        required
                        onChange={(e) => setSubAsgId(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-200 w-full"
                      >
                        <option value="">-- اختر الواجب المستحق --</option>
                        {assignments.map((asg) => (
                          <option key={asg.id} value={asg.id}>
                            {asg.courseCode} - {asg.title} ({asg.submitted ? "تم رفع تكليف سابق" : "معلق لم يسلم"})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 text-right">
                      <label className="text-slate-400 font-semibold block">اسم الملف الشارح للمرفق:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: math_project_submission.pdf"
                        value={subFileName}
                        onChange={(e) => setSubFileName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-200 w-full font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2 text-right">
                      <label className="text-slate-400 font-semibold block">أسماء الزملاء المشتركين (اختياري):</label>
                      <input
                        type="text"
                        placeholder="مثال: علي الشريف، رانية عصمت"
                        value={subTeam}
                        onChange={(e) => setSubTeam(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-200 w-full text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={!subAsgId || !subFileName}
                      className="cursor-pointer font-bold text-xs bg-emerald-600 text-slate-950 px-5  py-2 rounded-lg hover:bg-emerald-500 transition flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Upload className="w-4 h-4" />
                      رفع التكليف وتأكيد الاستلام
                    </button>
                  </div>
                </form>
              </div>

              {/* Assignments status ledger */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300">سجل التكليفات والواجبات المرصودة حالياً</h3>
                <div className="space-y-3">
                  {assignments.map((asg) => (
                    <div key={asg.id} className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-right space-y-1">
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono">
                          {asg.courseCode} - {asg.courseName}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200 mt-1">{asg.title}</h4>
                        <p className="text-[11px] text-slate-450">{asg.description}</p>
                        <p className="text-[10px] text-slate-500 font-mono">موعد التقديم النهائي: {asg.dueDate}</p>
                      </div>

                      <div className="shrink-0 text-right sm:text-left">
                        {asg.submitted ? (
                          <div className="space-y-1">
                            <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-900/40 inline-block">
                              تم الرفع: {asg.fileSubmitted}
                            </span>
                            {asg.grade && <p className="text-emerald-400 text-xs font-bold">الدرجة: {asg.grade}</p>}
                            {asg.feedback && <p className="text-[10px] text-neutral-400 max-w-[240px] leading-relaxed">{asg.feedback}</p>}
                          </div>
                        ) : (
                          <span className="bg-rose-950 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-900/30">
                            معلق لم يسلم بعد
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DIGITAL LIBRARY HUB */}
          {activeSegment === "student" && subTab === "library" && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <BookMarked className="w-5 h-5 text-emerald-400" />
                  المكتبة المركزية وبوابات المراجع والكتب
                </h3>
                <p className="text-xs text-slate-450">
                  يمكن للطلاب البحث الفوري عن الكتب العلمية، استعارتها من الخزانة المركزية إلكترونياً أو تمديد فترة استحقاقها لمدة أسبوع إضافي.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-4">
                      <div className="space-y-1 text-right">
                        <span className="bg-slate-900 text-slate-400 text-[9px] px-2 py-0.5 rounded">
                          {book.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 mt-1">{book.title}</h4>
                        <p className="text-[11px] text-slate-500">الكاتب: {book.author}</p>
                        <p className="text-[10px] text-slate-600 font-mono">موضع الرف: {book.locationCode}</p>
                      </div>

                      <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-xs">
                        <span>
                          {book.available ? (
                            <span className="text-emerald-400 font-bold">● متاح للحجز</span>
                          ) : (
                            <span className="text-amber-500 text-[10px]">
                              مستعار - تاريخ الإعادة: {book.dueDate}
                            </span>
                          )}
                        </span>

                        {book.available ? (
                          <button
                            onClick={() => borrowBook(book.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            احجز واستعر الآن
                          </button>
                        ) : (
                          <button
                            onClick={() => renewBook(book.id)}
                            className="bg-slate-900 hover:bg-slate-850 text-slate-350 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            تجديد المدة
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SGU 7 COLLEGES HUB & ACADEMIC TRANSFERS DECK */}
          {subTab === "colleges_hub" && (
            <div className="space-y-6">
              {/* Modern Segmented Controller */}
              <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-850 flex items-center justify-between gap-2 max-w-2xl mx-auto shadow-md">
                <button
                  onClick={() => setCollegesHubMode("sandbox")}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    collegesHubMode === "sandbox"
                      ? "bg-slate-900 text-teal-400 border border-slate-800 shadow-sm"
                      : "text-slate-450 hover:text-slate-200"
                  }`}
                >
                  🧪 البوابات السريرية ومعامل المحاكاة الذكية
                </button>
                <button
                  onClick={() => setCollegesHubMode("hierarchy")}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    collegesHubMode === "hierarchy"
                      ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-sm animate-pulse-subtle"
                      : "text-slate-450 hover:text-slate-200"
                  }`}
                >
                  🏢 منظومة الـ ERP الأكاديمية الشاملة (الهيكل الهرمي)
                </button>
              </div>

              {collegesHubMode === "hierarchy" ? (
                <SguHierarchicalErp />
              ) : (
                <SguCollegeSystem
                  student={student}
                  setStudent={setStudent}
                  addLog={addLog}
                  coursesByCollege={coursesByCollege}
                  setCourses={setCourses}
                />
              )}
            </div>
          )}

          {/* DORM AND TRANSPORT SECTIONS */}
          {subTab === "dorms_transport" && (
            <div className="space-y-6">
              {/* Dormitory details */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-100">تفاصيل وتتبع غرف السكن والمدينة الجامعية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dorms.map((dorm) => (
                    <div key={dorm.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                      <div className="flex justify-between items-center text-xs text-slate-200">
                        <span className="font-bold">{dorm.buildingName}</span>
                        <span className="font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                          غرفة {dorm.roomNo} - {dorm.bedNo}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span>الرسم الشهري: {dorm.price} ج.م</span>
                        <span>
                          {dorm.status === "available" ? (
                            <span className="text-emerald-400">متاح للحجز</span>
                          ) : (
                            <span className="text-rose-450">ممتلئ الغرفة</span>
                          )}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium text-right">
                        الطلبات النشطة بالغرفة: {dorm.occupied} / {dorm.capacity} نزل سكن
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transportation routes */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Route className="w-5 h-5 text-emerald-400" />
                  محطات تتبع حافلات النقل الجامعي والـ GPS
                </h3>
                <p className="text-xs text-slate-400">
                  تحديث فوري لحدث وقفة الحركية الحالي للحافلات بساحات الجامعة والمحافظات.
                </p>

                <div className="space-y-3">
                  {buses.map((bus) => (
                    <div key={bus.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-3 font-medium">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-100">{bus.busNo}</span>
                        <span className={`text-[10px] font-bold ${bus.status === "active" ? "text-emerald-400" : "text-rose-400"}`}>
                          {bus.status === "active" ? "● يعمل خط السير" : "● للصيانة والإصلاح"}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-right border-t border-slate-900 pt-2 text-[10px]">
                        <p className="text-slate-500">موقع الوقفة النشط بالـ GPS:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {bus.stops.map((stop, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded ${
                                bus.currentLocationName === stop
                                  ? "bg-emerald-600 text-slate-950 font-bold scale-105"
                                  : "bg-slate-900 text-slate-400"
                              }`}
                            >
                              🚍 {stop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECURE ONLINE PAYMENT SUB-TAB FOR STUDENTS */}
          {activeSegment === "student" && subTab === "student_payments" && (
            <SguStudentPayments
              finance={finance}
              setFinance={setFinance}
              triggerSystemPush={triggerSystemPush}
              lang={lang}
            />
          )}

          {/* SGU GOOGLE SLIDES VIEWER AND PRESENTATION MANAGER */}
          {activeSegment === "student" && subTab === "presentations" && (
            <SguGoogleSlidesManager
              courses={courses}
              addSystemLog={addLog}
              lang={lang}
              onSyncWithRecords={(slide) => {
                // Link this presentation with student's academic course lecture materials if desired
                addLog(`✓ تم ربط عرض Google Slides "${slide.title}" بالمقرر ${slide.courseCode} بنجاح.`);
              }}
            />
          )}

          {/* SGU MOBILE COMPANION SIMULATOR GATE */}
          {activeSegment === "student" && subTab === "mobile_companion" && (
            <SguMobileCompanion
              student={student}
              courses={courses}
              finance={finance}
              triggerSystemPush={triggerSystemPush}
              lang={lang}
            />
          )}

          {/* SGU ACADEMIC AI COUNSELOR CHATBOT */}
          {activeSegment === "student" && subTab === "ai_chatbot" && (
            <SguAcademicChatbot
              student={student}
              courses={courses}
              finance={finance}
              lang={lang}
            />
          )}

          {/* SGU GPA & COURSE PREDICTIVE ANALYTICS */}
          {activeSegment === "student" && subTab === "analytics" && (
            <SguPredictiveAnalytics
              courses={courses}
              student={student}
              lang={lang}
            />
          )}

          {/* SGU SECURED BLOCKCHAIN GRADUATION DEGREE SIGNING */}
          {activeSegment === "student" && subTab === "blockchain_certs" && (
            <SguBlockchainCertificates
              courses={courses}
              student={student}
              lang={lang}
            />
          )}

          {/* SYSTEM FACULTY MEMBERS SERVICES PORTAL */}
          {((userRole === "faculty") || (userRole === "admin" && activeSegment === "faculty")) && (
            <SguFacultyPortal
              courses={courses}
              setCourses={setCourses}
              student={student}
              setStudent={setStudent}
              triggerSystemPush={triggerSystemPush}
              lang={lang}
              subTab={subTab}
              addLog={addLog}
              dbUsers={dbUsers}
              setDbUsers={setDbUsers}
              schedules={schedules}
              setSchedules={setSchedules}
              attendance={attendance}
              setAttendance={setAttendance}
              colleges={colleges}
              setColleges={setColleges}
            />
          )}

          {/* SGU ENTERPRISE EMPLOYEE/STAFF SERVICES PORTAL (AUTHENTICATED EMPLOYEE OR SIMULATED) */}
          {((userRole === "employee") || (userRole === "admin" && (activeSegment === "registrar" || (activeSegment === "executive" && subTab !== "bi_analytics" && subTab !== "accreditation")))) && (
            <SguEmployeePortal
              applications={applications}
              setApplications={setApplications}
              finance={finance}
              setFinance={setFinance}
              student={student}
              setStudent={setStudent}
              dbUsers={dbUsers}
              setDbUsers={setDbUsers}
              triggerSystemPush={triggerSystemPush}
              lang={lang}
              addLog={addLog}
              employeeRole={
                userRole === "employee"
                  ? employeeRole
                  : activeSegment === "registrar"
                  ? "registrar"
                  : "finance_officer"
              }
            />
          )}

          {/* ADMISSIONS OFFICE (FOR REGISTRAR AND NEW APPLICANTS) */}
          {false && activeSegment === "registrar" && subTab === "admissions" && (
            <div className="space-y-6">
              {/* New admissions form */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-100">تلقي وتسجيل حسابات قبول المتقدمين الجدد رسمياً</h3>
                <p className="text-xs text-slate-400">
                  يمكن للطلاب الجدد صياغة وتوجيه معلومات الشهادات والنسبة المئوية والثانوية العامة لحفظها بمراجعة الإدارة.
                </p>

                <form onSubmit={submitNewAdmissionsApp} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 text-right">
                      <label className="text-[11px] text-slate-450">اسم المتقدم الثلاثي:</label>
                      <input
                        type="text"
                        required
                        placeholder="يونس أحمد كمال"
                        value={admName}
                        onChange={(e) => setAdmName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 w-full"
                      />
                    </div>

                    <div className="space-y-1 text-right">
                      <label className="text-[11px] text-slate-450 font-mono">الرقم القومي للبلد:</label>
                      <input
                        type="text"
                        required
                        placeholder="30504112019483"
                        value={admNatId}
                        onChange={(e) => setAdmNatId(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 w-full font-mono"
                      />
                    </div>

                    <div className="space-y-1 text-right">
                      <label className="text-[11px] text-slate-450">نسبة الثانوية العامة (%):</label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        required
                        value={admPercentage}
                        onChange={(e) => setAdmPercentage(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 w-full font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-right">
                    <label className="text-[11px] text-slate-450">ترتيب الرغبات والكليات المرغوبة:</label>
                    <input
                      type="text"
                      placeholder="كلية الحاسبات والذكاء الاصطناعي, كلية الهندسة"
                      value={admWishesStr}
                      onChange={(e) => setAdmWishesStr(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 w-full"
                    />
                  </div>

                  {/* Electronic Signature Authentication Section */}
                  <div className="border border-slate-800 bg-slate-900/50 p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                       <span className="font-bold text-amber-500 text-xs flex items-center gap-1.5 leading-none">
                         <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                         التوقيع الإلكتروني الذكي والمصادقة الرقمية للملفات المرفقة
                       </span>
                       <span className="text-[10px] text-slate-500 font-mono">SGU SECURE PORTAL</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Inputs & Consent */}
                      <div className="space-y-3">
                        <div className="space-y-1 text-right">
                          <label className="text-[11px] text-slate-400 block font-medium">اسم صاحب التوقيع الكرتوني والشهادات:</label>
                          <input
                            type="text"
                            required
                            placeholder="اكتب اسمك الثلاثي للتوقيع الإقرار"
                            value={admSignatureName || admName}
                            onChange={(e) => setAdmSignatureName(e.target.value)}
                            className="bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 w-full text-xs font-serif italic tracking-wide text-right"
                          />
                        </div>

                        <div className="flex items-start gap-2.5 text-right">
                          <input
                            type="checkbox"
                            id="sigConsentCheck"
                            checked={admSignatureConsent}
                            onChange={(e) => setAdmSignatureConsent(e.target.checked)}
                            className="mt-1 cursor-pointer accent-emerald-500"
                          />
                          <label htmlFor="sigConsentCheck" className="text-[11.5px] text-slate-400 leading-relaxed select-none cursor-pointer">
                            أوافق على إدراج التوقيع والمصادقة على صحة بيانات شهادات الثانوية العامة المرفقة والملف الثبوتي وربطها بالمعرف الرقمي والأثر للتأكيد القانوني على الطلب.
                          </label>
                        </div>
                      </div>

                      {/* Interactive Visual Preview certificate representation */}
                      <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl flex flex-col justify-between min-h-[110px] border-dashed border-emerald-500/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-900 pb-1.5">
                          <span>SGU CA CERTIFICATE AUTHORITY</span>
                          {admSignatureConsent && (admSignatureName || admName) ? (
                            <span className="text-emerald-400 font-bold font-mono">STATUS: SIGNED</span>
                          ) : (
                            <span className="text-amber-500 font-bold font-mono">STATUS: PENDING</span>
                          )}
                        </div>

                        <div className="py-2.5 text-center text-slate-300">
                          {admSignatureConsent ? (
                            <div className="space-y-1">
                              <p className="font-serif text-lg text-emerald-400 italic tracking-wider font-extrabold" style={{ fontFamily: "Georgia, serif" }}>
                                {admSignatureName || admName || "Signatory Name"}
                              </p>
                              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
                                <span>البصمة المشفرة:</span>
                                <span className="text-slate-400 font-semibold font-mono">
                                  SGU-SIG-{(admSignatureName || admName || "App").trim().split(" ").pop()?.toUpperCase()}-{String(Math.floor(1000 + Math.random() * 9000).toString(16)).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10.5px] text-rose-400 italic font-medium">فضلاً وافق على بند إقرار المسؤولية لتعديل وتوليد التوقيع الإلكتروني</span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-500 flex justify-between border-t border-slate-905 pt-1.5">
                          <span>التاريخ: {new Date().toISOString().split("T")[0]}</span>
                          <span>المصداقية: شهادة مشفرة ثنائية الأبعاد (SHA)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={!admSignatureConsent}
                      className={`cursor-pointer font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                        admSignatureConsent 
                          ? "bg-emerald-600 text-slate-950 hover:bg-emerald-500 shadow-lg shadow-emerald-650/10"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <span>💾 تسجيل طلب المتقدم للجامعة والتوقيع إلكترونياً</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Applicants list and status controls */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-350">الطلبات قيد المراجعة في خوادم القبول</h3>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div className="text-right space-y-1">
                          <h4 className="font-bold text-slate-200">{app.fullName}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">النسبة المدخلة: {app.highSchoolPercentage}%</p>
                          <p className="text-[10px] text-slate-500">الرغبات المفضلة: {app.wishes.join(" ← ")}</p>
                          {app.adminFeedback && (
                            <p className="text-[10px] text-amber-500 italic mt-1">توجيه الإدارة: {app.adminFeedback}</p>
                          )}

                          {/* Electronic Signature Info */}
                          {app.electronicSignatureId ? (
                            <div className="mt-2.5 p-2.5 bg-slate-900 border border-slate-850 rounded-lg flex flex-col gap-1 max-w-md text-right">
                              <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-850 pb-1.5">
                                <span className="text-[10.5px] text-emerald-400 font-bold flex items-center gap-1">
                                  <span>🔏</span> توقيع إلكتروني موثق من الطالب
                                </span>
                                <span className="text-[9.5px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
                                  {app.electronicSignatureId}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 space-y-0.5 pt-0.5">
                                <p><strong>صاحب الإقرار:</strong> {app.fullName}</p>
                                <p><strong>تاريخ الختم الرقمي:</strong> {app.electronicSignatureDate || "2026-06-19 12:00 PM"}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedAppForSignatureVerification(app)}
                                className="cursor-pointer mt-1.5 self-start text-[9.5px] text-amber-400 font-semibold hover:text-amber-300 bg-slate-950 hover:bg-slate-900 border border-slate-850 px-2.5 py-1 rounded transition flex items-center gap-1"
                              >
                                🔍 التحقق من شهادة التوقيع والمطابقة الرقمية
                              </button>
                            </div>
                          ) : (
                            <div className="mt-1.5 text-[10px] text-rose-400 italic">
                              ⚠️ لم يوقع إلكترونياً (طلب قديم قبل تحديث اللائحة الرقمية)
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
                          <button
                            onClick={() => changeAppStatus(app.id, "accepted", "تم القبول بالملف ومطابقة درجات الثانوية.")}
                            className={`cursor-pointer text-[10.5px] font-bold px-2.5 py-1 rounded transition ${
                              app.status === "accepted" ? "bg-emerald-600 text-slate-950" : "bg-slate-900 text-emerald-400 hover:bg-emerald-950/40"
                            }`}
                          >
                            قبول مبدئي
                          </button>
                          <button
                            onClick={() => changeAppStatus(app.id, "modify_required", "المستند باهت ويحتاج لتوضيح.")}
                            className={`cursor-pointer text-[10.5px] font-bold px-2.5 py-1 rounded transition ${
                              app.status === "modify_required" ? "bg-amber-600 text-slate-950" : "bg-slate-900 text-amber-400 hover:bg-amber-950/40"
                            }`}
                          >
                            طالب تعديل
                          </button>
                          <button
                            onClick={() => changeAppStatus(app.id, "rejected", "لا يفي بالحدود الدنيا للقبول.")}
                            className={`cursor-pointer text-[10.5px] font-bold px-2.5 py-1 rounded transition ${
                              app.status === "rejected" ? "bg-rose-650 text-slate-950" : "bg-slate-900 text-rose-500 hover:bg-rose-950/40"
                            }`}
                          >
                            مرفوض
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crypto Certificate Verification Modal Overlay */}
              {selectedAppForSignatureVerification && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
                  onClick={() => setSelectedAppForSignatureVerification(null)}
                >
                  <div 
                    className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl relative text-right text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header bar */}
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <button 
                        onClick={() => setSelectedAppForSignatureVerification(null)}
                        className="cursor-pointer text-slate-400 hover:text-slate-200 text-base font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850"
                      >
                        ✕
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                          وثيقة مؤمنة مصادق عليها
                        </span>
                        <h4 className="text-sm font-bold text-slate-100">
                          تقرير المصادقة الرقمية والتوقيع الإلكتروني (SGU-CS)
                        </h4>
                      </div>
                    </div>

                    {/* Certificate Graphics Body */}
                    <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-4 relative overflow-hidden">
                      {/* Watermark Logo */}
                      <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                        <img 
                          src="https://graph.facebook.com/SGU.EG/picture?width=300&height=300"
                          alt="SGU Background"
                          className="w-48 h-48 object-contain"
                        />
                      </div>

                      {/* Seal status row */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shrink-0">
                          <span className="text-2xl">🛡️</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 block font-mono">SGU CERTIFICATE ID</span>
                          <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {selectedAppForSignatureVerification.electronicSignatureId}
                          </span>
                        </div>
                      </div>

                      {/* Main fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-b border-slate-900 py-3 text-slate-300">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block">اسم الطالب (الموقّع):</span>
                          <strong className="text-slate-100 font-bold text-xs">{selectedAppForSignatureVerification.fullName}</strong>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block">الرقم القومي (ID):</span>
                          <strong className="text-slate-100 font-mono font-bold">{selectedAppForSignatureVerification.nationalId}</strong>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block">بصمة المستندات والوثائق:</span>
                          <span className="text-amber-500 font-mono font-medium block">SHA256-CERT-{(selectedAppForSignatureVerification.fullName).trim().split(" ").pop()?.toUpperCase() || "APP"}-7B2A95</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block">تاريخ وساعة التوقيع والختم:</span>
                          <span className="text-slate-100 font-mono font-bold block">{selectedAppForSignatureVerification.electronicSignatureDate || "2026-06-19 12:00 PM"}</span>
                        </div>
                      </div>

                      {/* Attached Document Integrity list */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 block">سلامة المستندات المرفقة بالطلب والتوقيع:</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-slate-900 border border-slate-850 p-2 rounded-lg flex items-center justify-between text-[11px]">
                            <span className="text-emerald-400">✓ موثق</span>
                            <span className="text-slate-400">شهادة الثانوية</span>
                          </div>
                          <div className="bg-slate-900 border border-slate-850 p-2 rounded-lg flex items-center justify-between text-[11px]">
                            <span className="text-emerald-400">✓ موثق</span>
                            <span className="text-slate-400">الهوية الوطنية</span>
                          </div>
                          <div className="bg-slate-900 border border-slate-850 p-2 rounded-lg flex items-center justify-between text-[11px]">
                            <span className="text-emerald-400">✓ موثق</span>
                            <span className="text-slate-400">الصورة الشخصية</span>
                          </div>
                        </div>
                      </div>

                      {/* Legal & Compliance clause */}
                      <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-900 font-serif">
                        * تم إبرام هذا التوقيع الإلكتروني بموافقة تامة من الطالب بالتوافق مع قانون التوقيع الإلكتروني لوزارة الاتصالات وقواعد القبول في جامعة الصالحية الجديدة SGU. يُعد هذا المستند ثبوتاً هويتياً مقبولاً رسمياً لإتمام دراسة كليات الجامعة والمطابقة السريرية والأكاديمية.
                      </p>
                    </div>

                    {/* Bottom disclaimer action */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[9.5px] text-emerald-500/80 font-mono">
                        ✓ SGU CA-AUTHORITY DEPLOYED
                      </span>
                      <button
                        onClick={() => setSelectedAppForSignatureVerification(null)}
                        className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-1.5 rounded-lg text-xs transition"
                      >
                        إغلاق المستند
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FINANCIAL LEDGER AND BI CHARTS */}
          {activeSegment === "executive" && subTab === "finances" && (
            <div className="space-y-6">
              {/* Financial metrics block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-905 p-4 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 text-[11px] block font-medium">الرسوم الدراسية المحصلة الكلية</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {defaultAdminStats.revenueTuition.toLocaleString()} ج.م
                  </div>
                  <span className="text-[10px] text-slate-500 block">من كافة الكليات والبرامج النشطة</span>
                </div>
                <div className="bg-slate-905 p-4 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 text-[11px] block font-medium">موازنة السكن والمدينة الجامعية</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {defaultAdminStats.revenueDorms.toLocaleString()} ج.م
                  </div>
                  <span className="text-[10px] text-slate-500 block">إجمالي الاشتراكات المسددة</span>
                </div>
                <div className="bg-slate-905 p-4 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 text-[11px] block font-medium">تمويلات الأبحاث العلمية Q1</span>
                  <div className="text-xl font-bold text-teal-400 mt-1">
                    {defaultAdminStats.revenueResearchGrants.toLocaleString()} ج.م
                  </div>
                  <span className="text-[10px] text-slate-500 block">شراكات دولية وجهات علمية مانحة</span>
                </div>
              </div>

              {/* Finance billing payments form */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200">التحصيل الإلكتروني وتسوية القيود المالية</h3>
                <p className="text-xs text-slate-405">
                  رصد دفع المبالغ إلكترونياً للفواتير المستحقة حالياً وإفادة بقية الأنظمة فوراً.
                </p>

                <form onSubmit={handleFinancePayment} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <div className="space-y-1.5 text-right font-medium">
                    <label className="text-[11px] text-slate-500 font-medium font-mono">فاتورة المقرر/الخدمة:</label>
                    <select
                      value={payTargetId}
                      required
                      onChange={(e) => setPayTargetId(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-100 w-full focus:outline-none"
                    >
                      <option value="">-- اختر الفاتورة للتسديد --</option>
                      {finance.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.description} (المتبقي: {f.amount} ج.م)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] text-slate-500 font-medium">المبلغ المراد سداده (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-100 w-full focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] text-slate-500 font-medium font-mono">الوساطة البنكية:</label>
                    <select
                      value={payWallet}
                      onChange={(e) => setPayWallet(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-100 w-full focus:outline-none font-mono"
                    >
                      <option value="Visa Credit Card">فوري | Visa Credit Card</option>
                      <option value="Vodafone Wallet">Vodafone Cash المحفظة الإلكترونية</option>
                      <option value="Fawry Pay">Fawry Gate الدفع الفوري</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={!payTargetId || payAmount <= 0}
                      className="cursor-pointer font-bold text-xs bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-lg w-full hover:bg-emerald-500 transition disabled:opacity-40"
                    >
                      إتمام الدفع وتسوية الفاتورة
                    </button>
                  </div>
                </form>

                {/* Bill ledger layout */}
                <div className="space-y-2">
                  {finance.map((rec) => (
                    <div key={rec.id} className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-xs">
                      <div className="text-right">
                        <span className="font-bold text-slate-200">{rec.description}</span>
                        <p className="text-[10px] text-slate-500">الاستحقاق النهائي: {rec.dueDate}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-200">{rec.amount} ج.م</span>
                        {rec.paid ? (
                          <span className="bg-emerald-950 text-emerald-405 border border-emerald-900/60 font-bold text-[9.5px] px-2 py-0.5 rounded">
                            مسددة بالكامل ({rec.paymentMethod})
                          </span>
                        ) : (
                          <span className="bg-rose-950 text-rose-303 border border-rose-900/40 font-bold text-[9.5px] px-2 py-0.5 rounded">
                            غير مستوفاة الرصيد
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EXECUTIVE HIGH LEVEL BI CHARTS */}
          {activeSegment === "executive" && subTab === "bi_analytics" && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800 flex-wrap gap-2 text-right">
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded">
                    Quality Assurance Board | مجلس ضمان الجودة لجامعة SGU
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">
                    لوحة تحليلات النجاح والتكامل لجميع الكليات السبع لعام 2026/2027
                  </h3>
                </div>
                <p className="text-xs text-slate-400 text-right">
                  يرصد هذا المخطط لمجلس إدارة الجامعة ومكتب الجودة نِسَب مواءمة المقررات، متوسط نسب النجاح، ومعدلات الحضور الفعلي المسجلة في السحابة للـ 7 كليات المعتمدة.
                </p>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={defaultAdminStats.successRatePerDepartment}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={9.5} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderWidth: '1px', borderRadius: '8px', textAlign: 'right', direction: 'rtl' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '11px' }}
                      />
                      <Legend verticalAlign="top" height={36} iconSize={10} style={{ fontSize: '11px' }} />
                      <Bar dataKey="successRate" name="معدل النجاح (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="attendanceRate" name="معدل الحضور (%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SGU 7 Colleges KPI Cards Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 text-right">تقرير الكفاءة التفصيلي لوحدات الجودة بالكليات:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
                  {defaultAdminStats.successRatePerDepartment.map((col, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-right space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-teal-400 font-mono">
                          {col.activeCount * 10} طالب
                        </span>
                        <h5 className="text-xs font-bold text-slate-200">{col.name}</h5>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-950 pt-2 text-[10.5px]">
                        <div>
                          <span className="text-slate-500 block text-[9.5px]">الحضور الفعلي</span>
                          <span className="text-sky-450 font-bold font-mono">{col.attendanceRate}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9.5px]">نسبة النجاح</span>
                          <span className="text-emerald-400 font-bold font-mono">{col.successRate}%</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-950 rounded-full h-1">
                        <div 
                          className="bg-emerald-500 h-1 rounded-full" 
                          style={{ width: `${col.successRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSegment === "executive" && subTab === "accreditation" && (
            <AccreditationReports dbUsers={dbUsers} />
          )}

          {/* SGU CENTRAL ORACLE DATABASE & 30,000 ACTIVE USERS ENGINE */}
          {activeSegment === "database" && subTab === "central_db" && (
            <SguAdminPortal
              dbUsers={dbUsers}
              setDbUsers={setDbUsers}
              colleges={colleges}
              setColleges={setColleges}
              finance={finance}
              lang={lang}
              addLog={addLog}
              logs={logs}
              triggerSystemPush={triggerSystemPush}
              courses={courses}
              setCourses={setCourses}
              schedules={schedules}
              setSchedules={setSchedules}
            />
          )}
          {false && activeSegment === "database" && subTab === "central_db" && (
            <div className="space-y-6">
              {/* Core Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950/15 border border-slate-800 p-5 rounded-xl text-right">
                <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded border border-amber-500/20 font-mono">
                    PostgreSQL Server Live Instance
                  </span>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-500 animate-pulse" />
                    <h2 className="text-base font-bold text-slate-100">بوابة المستكشف المركزي لـ 30,000 مستخدم وكادر لجامعة SGU</h2>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl mr-auto">
                  هذا المحاكي التفاعلي يعرض قاعدة البيانات الرديفة للجامعة والتي تضم بالكامل <strong className="text-amber-400">30,052 مستخدمًا وكادرًا نشطًا</strong> موزعين بطريقة دقيقة وحقيقية على الكليات السبع الـ7 الكبرى. يمكنك الاستعلام، المزامنة، تصفية الموظفين والتعديل الحي الفوري.
                </p>
              </div>

              {/* Server Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-right">
                  <span className="text-slate-500 block text-[10px]">إجمالي السجلات الكلي</span>
                  <span className="text-lg font-bold font-mono text-amber-400">{(dbCustomCount).toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">مستخدم مسجل بالمخدم</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-right">
                  <span className="text-slate-500 block text-[10px]">الطلاب الفعليين</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{(SYSTEM_DB_STATS.activeStudents).toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">تحت قيد الدراسة</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-right">
                  <span className="text-slate-500 block text-[10px]">هيئة التدريس والمعاونة</span>
                  <span className="text-lg font-bold font-mono text-sky-400">{(SYSTEM_DB_STATS.facultyMembers + SYSTEM_DB_STATS.taAndStaff).toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">عضو هيئة تدريس ومعيد</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-right">
                  <span className="text-slate-500 block text-[10px]">الموظفين والخدمات</span>
                  <span className="text-lg font-bold font-mono text-purple-400">{(SYSTEM_DB_STATS.adminsAndSecurity).toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">أكاديمي ومالي وتأمين</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-right">
                  <span className="text-slate-500 block text-[10px]">حجم القواعد المخزن</span>
                  <span className="text-lg font-bold font-mono text-pink-400">{SYSTEM_DB_STATS.dbStorageUsedGb}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">سعة تخزين السحابة</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-right flex flex-col justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10px]">مزامنة وتطهير البيانات</span>
                    <button
                      onClick={handleResetDb}
                      className="mt-1 cursor-pointer w-full bg-slate-950 hover:bg-red-950 text-red-400 text-[10.5px] font-bold py-1.5 rounded-lg border border-red-950 hover:border-red-800 transition flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3 text-red-400" />
                      إعادة تهيئة الـ DB
                    </button>
                  </div>
                </div>
              </div>

              {/* Dataset Selection Tabs */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-right">
                <div className="flex bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setDbDatasetType("sqlite_fifteen");
                      setSqlQueryInput("SELECT * FROM students;");
                      setSelectedSqliteTable("students");
                    }}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-md font-semibold text-xs transition cursor-pointer flex items-center gap-2 justify-center ${
                      dbDatasetType === "sqlite_fifteen" ? "bg-amber-500 text-slate-950 shadow-md font-bold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    مخطط SQLite الجامعي (15 جدولاً)
                  </button>
                  <button
                    onClick={() => {
                      setDbDatasetType("thirty_thousand");
                      setSqlQueryInput("SELECT * FROM sgu_all_users_view;");
                    }}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-md font-semibold text-xs transition cursor-pointer flex items-center gap-2 justify-center ${
                      dbDatasetType === "thirty_thousand" ? "bg-teal-500 text-slate-950 shadow-md font-bold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    قاعدة بيانات كشوف المستخدمين (30,000)
                  </button>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">اختر مستودع البيانات النشط للمحاكاة</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">تبديل فوري لتطبيق هيكلية الجداول واللوائح التي قمت برسمها في نظام SGU</p>
                </div>
              </div>

              {/* SQL Console Simulator */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-[10px] text-slate-500 font-mono">Interactive DB Command Console v1.02</span>
                  <h3 className="text-xs font-bold text-slate-200">الاستعلام المباشر عبر محرك SQL الافتراضي</h3>
                </div>

                <form onSubmit={handleExecuteSimulatedSQL} className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition"
                    >
                      تشغيل الاستعلام (RUN)
                    </button>
                    <input
                      type="text"
                      dir="ltr"
                      value={sqlQueryInput}
                      onChange={(e) => setSqlQueryInput(e.target.value)}
                      placeholder="SELECT * FROM sgu_users WHERE role = 'student';"
                      className="flex-1 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </form>

                {/* Query Quick suggestions */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                  <span>أو اختر استعلاماً سريعاً:</span>
                  <button
                    onClick={() => {
                      setSqlQueryInput("SELECT * FROM sgu_users WHERE role_id = 'student';");
                      setSqlQueryResultMsg("");
                    }}
                    className="cursor-pointer px-2.5 py-1 bg-slate-950 hover:bg-slate-800 rounded border border-slate-850 text-xs font-mono"
                  >
                    SELECT * STUDENTS
                  </button>
                  <button
                    onClick={() => {
                      setSqlQueryInput("SELECT * FROM sgu_users WHERE status = 'suspended';");
                      setSqlQueryResultMsg("");
                    }}
                    className="cursor-pointer px-2.5 py-1 bg-slate-950 hover:bg-slate-800 rounded border border-slate-850 text-xs font-mono"
                  >
                    SELECT * SUSPENDED
                  </button>
                  <button
                    onClick={() => {
                      setSqlQueryInput("SELECT * FROM sgu_users WHERE college_id = 'fcis';");
                      setSqlQueryResultMsg("");
                    }}
                    className="cursor-pointer px-2.5 py-1 bg-slate-950 hover:bg-slate-800 rounded border border-slate-850 text-xs font-mono"
                  >
                    SELECT * INFO_TECH
                  </button>
                </div>

                {/* Console output message if exists */}
                {sqlQueryResultMsg && (
                  <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-xs font-mono text-emerald-400 text-left whitespace-pre-line leading-relaxed">
                    {sqlQueryResultMsg}
                  </div>
                )}
              </div>

              {/* Dynamic Database Engines Explorer */}
              {dbDatasetType === "sqlite_fifteen" ? (
                <div className="space-y-6 text-right">
                  {/* Grid index of 15 tables */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-mono">15 Core Active Tables</span>
                      <h3 className="text-xs font-bold text-slate-250">مخطط وجداول الـ SQLite الـ15 المعتمدة لجامعة SGU</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {sqliteTables.map((table) => {
                        const isSelected = selectedSqliteTable === table.tableName;
                        return (
                          <button
                            key={table.tableName}
                            onClick={() => {
                              setSelectedSqliteTable(table.tableName);
                              setSqlQueryInput(`SELECT * FROM ${table.tableName};`);
                            }}
                            className={`cursor-pointer p-2.5 rounded-lg border text-right transition flex flex-col justify-between h-20 ${
                              isSelected
                                ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm"
                                : "bg-slate-950 border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <span className="text-xs font-bold font-mono">{table.tableName}</span>
                            <div className="mt-1">
                              <span className="text-[10.5px] block font-medium truncate">{table.descriptionAr}</span>
                              <span className="text-[9px] text-slate-500 block font-mono">COUNT: {table.rows.length}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Selected Table Explorer */}
                  {(() => {
                    const tableObj = sqliteTables.find(t => t.tableName === selectedSqliteTable) || sqliteTables[0];
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Schema Creation Script DDL */}
                        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-[9px] bg-slate-950 font-mono text-amber-500 px-2 py-0.5 rounded">AUTOINCREMENT</span>
                            <h4 className="text-xs font-bold text-slate-305">مستند التعريف البرمجي (SQLite DDL)</h4>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-xs text-slate-400 font-medium block">
                              تم تفعيل مخطط الهيكل للجدول <code className="text-amber-300">{tableObj.tableName}</code> من قِبل المشرف:
                            </span>
                            <pre className="p-3 bg-slate-955 text-[10.5px] font-mono text-amber-400 overflow-x-auto rounded-lg text-left border border-slate-850 whitespace-pre scrollbar-thin">
                              {tableObj.createScript}
                            </pre>
                          </div>

                          {/* Columns Breakdown list */}
                          <div className="space-y-2">
                            <h5 className="text-[11px] font-bold text-slate-400">تعريف الحقول ومفاتيح الجدول:</h5>
                            <div className="space-y-1.5 h-44 overflow-y-auto pr-1">
                              {tableObj.columns.map((col, idx) => (
                                <div key={idx} className="bg-slate-950 border border-slate-850 p-2 rounded text-[11px] flex justify-between items-center flex-wrap">
                                  <span className="text-amber-500 font-bold font-mono text-[10px]">{col.type} {col.constraints ? `(${col.constraints})` : ''}</span>
                                  <div className="text-right">
                                    <span className="text-slate-200 font-mono block font-bold">{col.name}</span>
                                    <span className="text-slate-500 text-[10px]">{col.desc}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Live Sample Seed Rows */}
                        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-xs text-emerald-400 font-bold font-mono">
                              Total Rows: {tableObj.rows.length} 🟢 Active
                            </span>
                            <h4 className="text-xs font-bold text-slate-200">
                              مستكشف صفوف وسجلات الجدول الحالي: "{tableObj.descriptionAr}"
                            </h4>
                          </div>

                          <div className="overflow-x-auto border border-slate-850 rounded-lg bg-slate-950 max-h-[420px] overflow-y-auto">
                            <table className="w-full text-[11px] text-right border-collapse">
                              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold sticky top-0 z-10 text-right">
                                <tr>
                                  {Object.keys(tableObj.rows[0] || {}).map((header) => (
                                    <th key={header} className="p-2.5 font-mono text-slate-300 border-b border-slate-800">{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850 text-slate-300">
                                {tableObj.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-900/40 transition">
                                    {Object.values(row).map((val, cIdx) => (
                                      <td key={cIdx} className="p-2.5 font-mono text-slate-300">
                                        {val === null || val === undefined || val === "" ? (
                                          <span className="text-slate-600 italic">NULL</span>
                                        ) : typeof val === "number" && val > 1000 ? (
                                          val.toLocaleString()
                                        ) : (
                                          String(val)
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-2.5 rounded-lg text-[10.5px] leading-relaxed">
                            <strong>ملاحظة السحابة الأكاديمية:</strong> هذه البيانات حية ويتم مزامنتها مع خادم الـ SQL. كليات الطب، الحاسبات، التجارة، الصيدلة، الأسنان، العلاج الطبيعي، والتمريض تم تغذيتها بشكل تطابقي لتمثيل اللائحة الموحدة!
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <>
                  {/* Main Users Table Grid */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-right space-y-4 p-5">
                    <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-800 pb-3">
                      {/* Export Backup CSV/JSON */}
                      <button
                        onClick={() => {
                          setSqlQueryResultMsg(`PROcess EXPORT FILE SGU_BACKUP_SNAPSHOT: تم توليد نسخة احتياطية مكونة من 30,052 ملف JSON لحفظ قنوات الكليات السبعة.`);
                          alert("تم بنجاح تحميل اللفظ الكامل لـ 30,052 عضوًا بصيغة SQL Dump للنسخ الاحتياطي!");
                        }}
                        className="cursor-pointer px-3.5 py-2 bg-slate-950 hover:bg-slate-850 text-xs font-bold text-slate-300 rounded-lg flex items-center gap-2 border border-slate-800"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-500" />
                        تصدير ملف القواعد SQL Backup
                      </button>

                      <h3 className="text-xs font-bold text-slate-200">مستكشف كشوف الأعضاء المسجلين (Live Dataset)</h3>
                    </div>

                    {/* Filter Selector Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="ابحث بالاسم، الكود، البريد الإلكتروني..."
                          value={dbSearchQuery}
                          onChange={(e) => setDbSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 pl-9 pr-3 rounded-lg text-xs text-right focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Filter by College */}
                      <div>
                        <select
                          value={selectedCollegeId}
                          onChange={(e) => setSelectedCollegeId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs justify-end text-right focus:outline-none focus:border-amber-500"
                        >
                          <option value="all">ترشيح لكل الكليات لجامعتنا (سبعة)</option>
                          {SGU_COLLEGES.map((col) => (
                            <option key={col.id} value={col.id}>
                              {col.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Filter by Role */}
                      <div>
                        <select
                          value={selectedRoleId}
                          onChange={(e) => setSelectedRoleId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-right focus:outline-none focus:border-amber-500"
                        >
                          <option value="all">الكل (17 مسمّى وظيفي معتمد)</option>
                          {SGU_ROLES.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.nameAr} ({role.nameEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Filter Statistics label */}
                      <div className="flex items-center justify-end text-slate-400 text-[11.5px] font-bold">
                        <span>متاح للعرض: </span>
                        <strong className="text-emerald-400 font-mono mx-1">{filteredDbUsers.length}</strong>
                        <span>سجل متطابق من أصل {dbCustomCount}</span>
                      </div>
                    </div>

                    {/* Data Table Container */}
                    <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                      <table className="w-full text-xs text-right border-collapse">
                        <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                          <tr>
                            <th className="p-3">صاحب السجل / الكود الجامعي</th>
                            <th className="p-3">الكلية المعينة</th>
                            <th className="p-3">الصفة والصف الدراسي</th>
                            <th className="p-3">البريد الإلكتروني والهاتف</th>
                            <th className="p-3">مؤشر مالي / تحصيلي (GPA)</th>
                            <th className="p-3">حالة السجل</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 text-slate-300">
                          {filteredDbUsers.slice(0, 15).map((user) => {
                            const college = SGU_COLLEGES.find((c) => c.id === user.collegeId);
                            const role = SGU_ROLES.find((r) => r.id === user.role);
                            return (
                              <tr key={user.id} className="hover:bg-slate-900/60 transition duration-150">
                                <td className="p-3">
                                  <div className="font-bold text-slate-100">{user.nameAr}</div>
                                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{user.id}</span>
                                </td>
                                <td className="p-3 text-slate-300 font-medium">
                                  {college?.nameAr || "إدارة مركزية"}
                                  <span className="text-[9px] text-slate-500 block">{user.campusBranch}</span>
                                </td>
                                <td className="p-3 font-semibold text-emerald-400">
                                  {role?.nameAr} - <span className="font-mono text-slate-400 text-[10.5px]">{role?.nameEn}</span>
                                </td>
                                <td className="p-3 font-mono text-slate-450">
                                  <div>{user.email}</div>
                                  <div className="text-[10px] text-slate-500">{user.phone}</div>
                                </td>
                                <td className="p-3">
                                  {user.role === "student" ? (
                                    <span className="font-bold text-emerald-400 font-mono">
                                      {user.gpaOrSalary} GPA
                                    </span>
                                  ) : (
                                    <span className="font-bold text-sky-400 font-mono">
                                      {user.gpaOrSalary} (صافي)
                                    </span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    user.status === "active"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-900/30"
                                      : user.status === "suspended"
                                      ? "bg-rose-500/10 text-rose-400 border border-rose-900/30"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-900/30"
                                  }`}>
                                    {user.status === "active" ? "حالة نشطة" : user.status === "suspended" ? "موقوف " : "قيد التدقيق"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {filteredDbUsers.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                          لا توجد سجلات مطابقة لهذه الفلاتر والبحث في الـ 30,000 مستخدم.
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 text-left font-mono">
                      * تظهر أول 15 نتيجة لمراعاة سرعة استجابة المتصفح. استخدم البحث للاستعلام الدقيق عن أي عضو مفقود.
                    </div>
                  </div>

                  {/* Insertion Database Form Card */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-right space-y-4">
                    <div className="border-b border-slate-800 pb-2 flex justify-between items-center flex-wrap gap-2">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-900/40 px-2.5 py-0.5 rounded font-mono">
                        INSERT INTO sgu_users_meta
                      </span>
                      <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        بوابة إضافة وتوليد عضو جديد حقيقي بقاعدة البيانات (Commit Insert)
                      </h3>
                    </div>

                    <form onSubmit={handleInsertDbUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">اسم العضو الجديد بالكامل (بالعربية)</label>
                        <input
                          type="text"
                          required
                          placeholder="امحمد فتحي الجارحي، د. سليم صبري"
                          value={newUserNameAr}
                          onChange={(e) => setNewUserNameAr(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">مسمى الصفة والصف الفعلي</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-100"
                        >
                          {SGU_ROLES.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.nameAr} ({r.nameEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">الكلية لجامعة SGU</label>
                        <select
                          value={newUserCollege}
                          onChange={(e) => setNewUserCollege(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-right focus:outline-none focus:border-emerald-500 text-slate-100"
                        >
                          {SGU_COLLEGES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">المعدل للأكاديميين / الراتب للموظفين</label>
                        <input
                          type="text"
                          value={newUserGpaOrSalary}
                          onChange={(e) => setNewUserGpaOrSalary(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-left font-mono focus:outline-none focus:border-emerald-500 text-slate-100"
                        />
                      </div>

                      <div className="md:col-span-4 flex justify-end">
                        <button
                          type="submit"
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-2 rounded-lg text-xs transition"
                        >
                          إرسال وتوثيق بقاعدة بيانات الكلية (Insert Record)
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SGU 40 LOGICAL ERP CHAPTERS */}
          {activeSegment === "database" && subTab === "chapters_40" && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950/10 border border-slate-800 p-5 rounded-xl text-right">
                <div className="flex items-center gap-3 justify-end mb-2">
                  <span className="bg-sky-500/10 text-sky-400 border border-sky-400/20 text-[10px] font-bold px-2 py-0.5 rounded">
                    SGU Master Plan 2026
                  </span>
                  <h2 className="text-base font-bold text-slate-100">أطلس الهيكل الكامل لنظام جامعة الصالحية المتكامل (40 مجالاً وقطاعاً)</h2>
                </div>
                <p className="text-xs text-slate-330 leading-relaxed max-w-4xl mr-auto">
                  تضم لوائح وإجراءات جامعة الصالحية السبعة <strong className="text-emerald-400">40 محوراً رئيسياً</strong> تمثل الأعمدة الهيكلية لقاعدة البيانات المعتمدة لإدارة العمل المالي، الإداري، الطبي والأكاديمي. انقر على أي مجال بالعمود العريض لاستعراض المخطط DDL/SQL والحقول وسير عمله.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Chapters Index List */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 border-b border-slate-805 pb-2 text-right">فهرس القطاعات الأربعين لجامعة SGU:</h3>
                  <div className="h-[550px] overflow-y-auto space-y-2 pr-1 text-right">
                    {ERP_40_CHAPTERS.map((chap) => {
                      const isActive = chap.id === activeChapterId;
                      return (
                        <button
                          key={chap.id}
                          onClick={() => setActiveChapterId(chap.id)}
                          className={`cursor-pointer w-full p-2.5 rounded-lg text-right transition flex items-center justify-between border ${
                            isActive
                              ? "bg-slate-950 border-amber-500/60 text-amber-400"
                              : "bg-slate-950/30 border-slate-850 text-slate-300 hover:bg-slate-950/70"
                          }`}
                        >
                          <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-1 py-0.5 rounded">
                            {chap.badge}
                          </span>
                          <span className="text-xs font-bold flex items-center gap-2">
                            <span className="text-[10.5px] font-mono text-slate-500">#{chap.id}</span>
                            {chap.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chapter Deep-dive details */}
                {(() => {
                  const chap = ERP_40_CHAPTERS.find((c) => c.id === activeChapterId) || ERP_40_CHAPTERS[0];
                  return (
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-xl text-right space-y-5">
                      {/* Title block */}
                      <div className="flex justify-between items-center pb-3 border-b border-slate-800 flex-wrap gap-2">
                        <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-900/40 px-3 py-1 rounded-full font-mono font-bold">
                          {chap.badge}
                        </span>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-100">
                            القطاع #{chap.id}: {chap.title}
                          </h4>
                          <span className="text-[10.5px] text-slate-500 block font-mono mt-0.5">{chap.titleEn}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                        <h5 className="text-xs font-bold text-slate-300">سير العمل والغرض الوظيفي:</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {chap.description}
                        </p>
                      </div>

                      {/* Linked Database Tables */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-400">الجداول المترابطة بالموديل:</h5>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {chap.tables.map((tbl, idx) => (
                            <span key={idx} className="bg-slate-950 border border-slate-850 px-2.5 py-1 rounded font-mono text-[11px] text-amber-500">
                              {tbl}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* SQL Shema block */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-400">بنية المخطط البرمجي DDL (SQL Script):</h5>
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-left overflow-x-auto">
                          <pre className="font-mono text-[10.5px] text-amber-400 leading-relaxed whitespace-pre font-bold">
                            {chap.schemaSql}
                          </pre>
                        </div>
                      </div>

                      {/* Sub Fields Descriptor inside Table */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-400">أعمدة وبنود القواعد الأساسية:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {chap.fields.map((fld, idx) => (
                            <div key={idx} className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg space-y-1">
                              <span className="font-mono text-[11px] text-sky-400 block">{fld.name}</span>
                              <span className="bg-slate-900 text-[9px] text-slate-400 px-1 rounded inline-block font-mono">
                                {fld.type}
                              </span>
                              <p className="text-[10.5px] text-slate-300 mt-1">{fld.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {activeSegment === "database" && subTab === "sec_database" && (
            <SguSecurityDatabaseSystem
              dbUsers={dbUsers}
              setDbUsers={setDbUsers}
              lang={lang}
              triggerToast={(msg) => addLog(msg)}
            />
          )}

          {activeSegment === "pro_systems" && (
            <SguProSystems dbUsers={dbUsers} />
          )}
        </main>

        {/* --- DEDICATED RIGHT SIDEWAYS AI COMPANION EXTENSION --- */}
        <section className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-800 p-4 flex flex-col shrink-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-900/45 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  جَامِعَتي AI
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                </h4>
                <p className="text-[10px] text-slate-400">المعلومات والاستشارة الأكاديمية</p>
              </div>
            </div>

            <button
              onClick={() => {
                setChatHistory([
                  {
                    role: "model",
                    text: "تم تصفير جلسة المحادثة بنجاح. ما هو الموضوع الأكاديمي أو الهندسي الذي ترغب في شرحه أو مناقشته الآن؟"
                  }
                ]);
              }}
              className="text-slate-500 hover:text-slate-300 text-[10px] hover:underline"
            >
              مسح السجل
            </button>
          </div>

          {/* Quick preset topics */}
          <div className="bg-slate-950 p-2 text-[10px] text-emerald-400 border border-emerald-900/40 rounded-lg mb-3 leading-relaxed">
            <span className="font-bold">💡 اقتراحات التدريب السريعة:</span>
            <p>انقر على المربعات بالأسفل لتلقي شرح فوري أو كويز تدريبي محاكي.</p>
          </div>

          {/* Chat history stream view */}
          <div className="flex-1 bg-slate-950 border border-slate-850 p-3 rounded-xl overflow-y-auto space-y-3 min-h-[280px] max-h-[420px] text-right text-xs">
            {chatHistory.map((ch, i) => (
              <div
                key={i}
                className={`flex flex-col space-y-1 max-w-[85%] ${
                  ch.role === "user" ? "mr-auto text-left items-end" : "ml-auto"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl text-xs ${
                    ch.role === "user"
                      ? "bg-emerald-600 text-slate-950 rounded-tl-none font-bold"
                      : "bg-slate-900 text-slate-100 rounded-tr-none border border-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{ch.text}</p>
                  {ch.isSandbox && (
                    <span className="text-[9px] text-slate-500 mt-1 block hover:underline">
                      (نموذج محاكاة محلي - لتفعيل الذكاء الحقيقي، يرجى كتابة الـ API Key)
                    </span>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>جاري صياغة الاستشارة الذكية ونمذجة الرد...</span>
              </div>
            )}
          </div>

          {/* Preset Buttons shortcuts */}
          <div className="grid grid-cols-2 gap-2 text-[10px] mt-3">
            <button
              onClick={() => handleSendChat("لخص لي بنود قواعد البيانات SQL ومفهوم ACID المعقد مبسطا")}
              className="bg-slate-950 border border-slate-850 text-slate-400 p-2 rounded-lg text-right hover:text-emerald-400 hover:border-emerald-800 transition cursor-pointer"
            >
              📝 مفهوم ACID وقواعد البيانات
            </button>
            <button
              onClick={() => handleSendChat("أريد 3 أسئلة مراجعة في مقرر الذكاء الاصطناعي مع حلولها المقترحة")}
              className="bg-slate-950 border border-slate-850 text-slate-400 p-2 rounded-lg text-right hover:text-emerald-400 hover:border-emerald-800 transition cursor-pointer"
            >
              ❓ كويز الذكاء الاصطناعي
            </button>
          </div>

          {/* Send Input Panel */}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="اكتب استفسارك للذكاء الاصطناعي..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendChat();
              }}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 pl-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-650"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={chatLoading || !chatInput.trim()}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 p-2.5 rounded-lg transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      {/* 🚀 Live push notification toast alert overlay */}
      {lastPushToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-slate-900 border-l-[5px] border-l-emerald-400 border border-slate-800 rounded-xl p-4 shadow-2xl text-right flex gap-3 flex-row-reverse items-start">
          <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-900/35">
            <Bell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-center flex-row-reverse gap-2">
              <h5 className="text-[11.5px] font-black text-slate-100">{lastPushToast.title}</h5>
              <button 
                onClick={() => setLastPushToast(null)}
                className="text-slate-500 hover:text-slate-350 text-[10.5px] p-0.5"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-slate-300 font-medium leading-normal">{lastPushToast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
