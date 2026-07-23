import React, { useState, useMemo } from "react";
import {
  Users,
  Building,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Search,
  UserPlus,
  UserCheck,
  UserX,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  BookOpen,
  Layers,
  Sparkles,
  Server,
  Activity,
  AlertTriangle,
  RefreshCw,
  Clock,
  Briefcase,
  Sliders
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { DatabaseUser, SGU_COLLEGES, SGU_ROLES } from "../databaseMock";

interface SguAdminPortalProps {
  dbUsers: DatabaseUser[];
  setDbUsers: React.Dispatch<React.SetStateAction<DatabaseUser[]>>;
  colleges: any[];
  setColleges: React.Dispatch<React.SetStateAction<any[]>>;
  finance: any[];
  lang: "ar" | "en";
  addLog?: (log: string) => void;
  logs?: string[];
  triggerSystemPush: (title: string, message: string) => void;
  courses?: any[];
  setCourses?: any;
  schedules?: any[];
  setSchedules?: any;
}

export default function SguAdminPortal({
  dbUsers,
  setDbUsers,
  colleges,
  setColleges,
  finance,
  lang,
  addLog,
  logs = [],
  triggerSystemPush,
  courses = [],
  setCourses,
  schedules = [],
  setSchedules
}: SguAdminPortalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "colleges" | "users" | "financials">("overview");
  const [comparisonMetric, setComparisonMetric] = useState<"gpa" | "students" | "courses" | "departments" | "revenues">("gpa");

  // User list states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [collegeFilter, setCollegeFilter] = useState("all");

  // New User Form States
  const [newUserNameAr, setNewUserNameAr] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("student");
  const [newUserCollege, setNewUserCollege] = useState("fcis");
  const [newUserGpaOrSalary, setNewUserGpaOrSalary] = useState("3.40");

  // College Editor States
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [newCollegeNameAr, setNewCollegeNameAr] = useState("");
  const [newCollegeNameEn, setNewCollegeNameEn] = useState("");
  const [newCollegeAvgGpa, setNewCollegeAvgGpa] = useState("3.20");

  // Dynamic Colleges & Curriculums Customizer States
  const [selectedColId, setSelectedColId] = useState<string | null>(null);
  const [newDeptInput, setNewDeptInput] = useState("");
  const [newProgInput, setNewProgInput] = useState("");
  const [curriculumLevel, setCurriculumLevel] = useState<"Level 1" | "Level 2" | "Level 3" | "Level 4">("Level 1");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState("3");

  // Add a new user to SGU centralized DB
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserNameAr) return;

    const newId = `2026SGU-${newUserRole === "student" ? "ST" : "EMP"}-${String(
      10000 + dbUsers.length
    ).slice(1)}`;
    const emailDomain = newUserRole === "student" ? "stud.sgu.edu.eg" : "sgu.edu.eg";
    const cleanMail = newUserEmail || `${newUserNameAr.replace(/\s+/g, ".").toLowerCase()}@${emailDomain}`;

    const newUser: DatabaseUser = {
      id: newId,
      nameAr: newUserNameAr,
      nameEn: newUserNameAr, // placeholder for translation
      role: newUserRole,
      collegeId: newUserCollege,
      email: cleanMail,
      phone: "+20 1001234567",
      nationalId: `3010214${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      gpaOrSalary: newUserGpaOrSalary,
      campusBranch: "فرع الصالحية الجديدة الرئيسي"
    };

    setDbUsers(prev => [newUser, ...prev]);

    // reset fields
    setNewUserNameAr("");
    setNewUserEmail("");
    setNewUserGpaOrSalary("3.40");

    const roleName = SGU_ROLES.find(r => r.id === newUserRole)?.nameAr || newUserRole;
    const logMsg = `[التحكم الأمني] قام مسؤول النظام بإنشاء حساب جديد كلياً باسم [${newUser.nameAr}] كود: ${newUser.id} برتبة: ${roleName}`;
    if (addLog) addLog(logMsg);

    triggerSystemPush(
      lang === "ar" ? "🛡️ حساب جديد بالمنصة" : "🛡️ New Platform Account",
      lang === "ar"
        ? `تم إدراج الطالب/الموظف [${newUser.nameAr}] كعضو نشط في الكلية المعنية.`
        : `Created new ${newUserRole} account for [${newUser.nameAr}] in central database.`
    );
  };

  // Toggle user account status (Suspend / Unsuspend)
  const handleToggleUserStatus = (id: string) => {
    setDbUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          const logMsg = `[التحكم الأمني] قام مسؤول النظام بـ (${
            nextStatus === "active" ? "إلغاء حظر" : "حظر مؤقت"
          }) لحساب المستخدم [${u.nameAr}] كود: ${u.id}`;
          if (addLog) addLog(logMsg);

          triggerSystemPush(
            lang === "ar" ? "🚨 تعديل صلاحية حساب" : "🚨 Account Status Change",
            lang === "ar"
              ? `تم تحديث حالة حساب المستخدم [${u.nameAr}] إلى: ${
                  nextStatus === "active" ? "نشط ومفعل" : "معلق ومحجوب"
                }.`
              : `User account for [${u.nameAr}] has been set to: ${nextStatus}.`
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Change user role/permissions in-place
  const handleChangeUserRole = (id: string, newRole: string) => {
    setDbUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const oldRole = u.role;
          const logMsg = `[التحكم الأمني] تم تعديل دور المستخدم [${u.nameAr}] من (${oldRole}) إلى (${newRole})`;
          if (addLog) addLog(logMsg);

          triggerSystemPush(
            lang === "ar" ? "🛡️ تغيير الصلاحيات" : "🛡️ Role Modification",
            lang === "ar"
              ? `تم ترقية/تعديل مستوى الصلاحيات لـ [${u.nameAr}] بموجب أمر الإدارة العليا.`
              : `Access permission level for [${u.nameAr}] changed to: ${newRole}.`
          );
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  // Add College/Faculty
  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeNameAr || !newCollegeNameEn) return;

    const shortId = newCollegeNameEn.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 4);
    const newId = shortId || `col-${Math.floor(Math.random() * 1000)}`;
    
    const spawnedDepts = [
      lang === "ar" ? "قسم العلوم التأسيسية" : "Foundational Sciences",
      lang === "ar" ? "قسم الأنظمة والتطبيقات الذكية" : "Smart Systems & Apps",
      lang === "ar" ? "قسم إدارة الجودة والابتكار" : "Quality & Innovation Management"
    ];
    const spawnedProgs = [
      lang === "ar" ? `بكالوريوس ${newCollegeNameAr} والتقنيات الرقمية` : `B.Sc. of ${newCollegeNameEn}`,
      lang === "ar" ? `دبلوم الابتكار التخصصي لـ ${newCollegeNameAr}` : `Diploma in Specialized ${newCollegeNameEn}`
    ];

    const newCol = {
      id: newId,
      name: newCollegeNameAr, // fallback compatible with defaultColleges
      nameAr: newCollegeNameAr,
      nameEn: newCollegeNameEn,
      studentAvgGpa: parseFloat(newCollegeAvgGpa) || 3.2,
      color: "text-amber-400",
      departments: spawnedDepts,
      programs: spawnedProgs,
      hoursRequired: 136,
      status: "active", // active by default
      curriculum: {
        "Level 1": [lang === "ar" ? "تأسيس التخصص 101" : "Intro to Specialty"],
        "Level 2": [lang === "ar" ? "منهجية التصميم 201" : "Specialized Design"],
        "Level 3": [lang === "ar" ? "تكامل الأنظمة 301" : "Systems Integration"],
        "Level 4": [lang === "ar" ? "مشروع التخرج المبتكر 401" : "Graduation Project"]
      }
    };

    // 1. Save college to list
    setColleges(prev => {
      const updated = [...prev, newCol];
      localStorage.setItem("u_colleges", JSON.stringify(updated));
      return updated;
    });

    // 2. Spawn dynamic template courses
    const templateCourses = [
      { code: `${newId.toUpperCase()}101`, name: lang === "ar" ? `مبادئ وتأسيس في ${newCollegeNameAr}` : `Foundations of ${newCollegeNameEn}`, description: `المقرر التأسيسي القياسي للفرقة الأولى بكلية ${newCollegeNameAr}.`, prerequisites: [], credits: 3, finalGrade: 100, status: "registered" as const },
      { code: `${newId.toUpperCase()}201`, name: lang === "ar" ? `المنهجية التطبيقية لـ ${newCollegeNameAr}` : `Applied Methodologies of ${newCollegeNameEn}`, description: `المساقات التنفيذية وعناصر التصميم الأكاديمي لطلاب الفرقة الثانية بكلية ${newCollegeNameAr}.`, prerequisites: [`${newId.toUpperCase()}101`], credits: 3, finalGrade: 100, status: "registered" as const },
      { code: `${newId.toUpperCase()}301`, name: lang === "ar" ? "تكامل النظم وتطبيقاتها" : "Systems Integration & Applications", description: `دراسة النماذج والتطبيقات العملية والتقنيات بكلية ${newCollegeNameAr}.`, prerequisites: [`${newId.toUpperCase()}201`], credits: 4, finalGrade: 100, status: "registered" as const },
      { code: `${newId.toUpperCase()}401`, name: lang === "ar" ? "مشروع التخرج والابتكار العلمي" : "Graduation & Unified Scientific Project", description: `المشروع البحثي والعملي المتكامل لتخرج طلاب كلية ${newCollegeNameAr}.`, prerequisites: [`${newId.toUpperCase()}301`], credits: 4, finalGrade: 100, status: "registered" as const }
    ];
    if (setCourses) {
      setCourses((prev: any[]) => {
        const updated = [...prev, ...templateCourses];
        localStorage.setItem("u_courses", JSON.stringify(updated));
        return updated;
      });
    }

    // 3. Spawn dynamic schedule items
    const templateSchedules = [
      { day: lang === "ar" ? "الأحد" : "Sunday", timeSlot: "09:00 - 11:00", courseCode: `${newId.toUpperCase()}101`, courseName: lang === "ar" ? `مبادئ وتأسيس في ${newCollegeNameAr}` : `Foundations of ${newCollegeNameEn}`, room: "Hall 1 - Specialized Bldg", instructor: lang === "ar" ? "أ.د. الكادر التأسيسي الرئيسي" : "Prof. Specialty Founder" },
      { day: lang === "ar" ? "الثلاثاء" : "Tuesday", timeSlot: "11:00 - 01:00", courseCode: `${newId.toUpperCase()}301`, courseName: lang === "ar" ? "تكامل النظم وتطبيقاتها" : "Systems Integration & Applications", room: "Lab 2 - Advanced Lab", instructor: lang === "ar" ? "د. منسق الجودة والاعتماد" : "Dr. Accreditation Coordinator" }
    ];
    if (setSchedules) {
      setSchedules((prev: any[]) => {
        const updated = [...prev, ...templateSchedules];
        localStorage.setItem("u_schedules", JSON.stringify(updated));
        return updated;
      });
    }

    // 4. Spawn active mock accounts in central database
    const serialNum = Math.floor(100 + Math.random() * 900);
    const newStudentId = `SGU-ST-${newId.toUpperCase()}-${serialNum}`;
    const newDeanId = `SGU-DEAN-${newId.toUpperCase()}-${serialNum}`;

    const newStudentUser = {
      id: newStudentId,
      nameAr: lang === "ar" ? `ياسين أحمد (طالب ${newCollegeNameAr})` : `Yassin Ahmed (Student of ${newCollegeNameEn})`,
      nameEn: `Yassin Ahmed`,
      role: "student",
      collegeId: newId,
      email: `student_${newId}@stud.sgu.edu.eg`,
      phone: "+20 1098765432",
      nationalId: `2990505120349${Math.floor(Math.random() * 9)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      gpaOrSalary: "3.40",
      campusBranch: lang === "ar" ? "فرع الصالحية الجديدة الرئيسي" : "Main Campus"
    };

    const newDeanUser = {
      id: newDeanId,
      nameAr: lang === "ar" ? `أ.د. سمير زكي (عميد ${newCollegeNameAr})` : `Prof. Samir Zaki (Dean of ${newCollegeNameEn})`,
      nameEn: `Prof. Samir Zaki`,
      role: "dean",
      collegeId: newId,
      email: `dean_${newId}@sgu.edu.eg`,
      phone: "+20 1123456789",
      nationalId: `2700505120349${Math.floor(Math.random() * 9)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      gpaOrSalary: "22,000 ج.م",
      campusBranch: lang === "ar" ? "فرع الصالحية الجديدة الرئيسي" : "Main Campus"
    };

    setDbUsers(prev => {
      const updated = [...prev, newStudentUser, newDeanUser];
      localStorage.setItem("sgu_db_users", JSON.stringify(updated));
      return updated;
    });

    setNewCollegeNameAr("");
    setNewCollegeNameEn("");
    setShowAddCollege(false);

    const logMsg = `[تعديل الهيكل الدراسي] قام مدير النظام بإنشاء كلية جديد باسم [${newCol.nameAr}] وتوليد كامل بيئة عملها الأكاديمية (مقررات، جداول، حساب عميد [${newDeanId}]، حساب طالب [${newStudentId}]).`;
    if (addLog) addLog(logMsg);

    triggerSystemPush(
      lang === "ar" ? "🏛️ تأسيس كلية ذكية جديدة" : "🏛️ Faculty Established",
      lang === "ar"
        ? `تم تأسيس [${newCol.nameAr}] وتوليد حساب العميد [${newDeanId}] بنجاح.`
        : `Successfully established [${newCol.nameEn}]. Dean ID: ${newDeanId}`
    );
  };

  // Dynamic College Customizer Operations
  const selectedCol = colleges.find(c => c.id === selectedColId);

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptInput.trim() || !selectedColId) return;
    setColleges(prev => prev.map(c => {
      if (c.id === selectedColId) {
        const depts = c.departments || [];
        if (depts.includes(newDeptInput.trim())) return c;
        return { ...c, departments: [...depts, newDeptInput.trim()] };
      }
      return c;
    }));
    if (addLog) {
      addLog(`[اللوائح الأكاديمية] تم إضافة قسم جديد [${newDeptInput.trim()}] لكلية [${selectedCol?.nameAr || selectedCol?.name}]`);
    }
    setNewDeptInput("");
  };

  const handleRemoveDept = (deptName: string) => {
    if (!selectedColId) return;
    setColleges(prev => prev.map(c => {
      if (c.id === selectedColId) {
        const depts = c.departments || [];
        return { ...c, departments: depts.filter((d: string) => d !== deptName) };
      }
      return c;
    }));
    if (addLog) {
      addLog(`[اللوائح الأكاديمية] تم إزالة قسم [${deptName}] من كلية [${selectedCol?.nameAr || selectedCol?.name}]`);
    }
  };

  const handleAddProg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgInput.trim() || !selectedColId) return;
    setColleges(prev => prev.map(c => {
      if (c.id === selectedColId) {
        const progs = c.programs || [];
        if (progs.includes(newProgInput.trim())) return c;
        return { ...c, programs: [...progs, newProgInput.trim()] };
      }
      return c;
    }));
    if (addLog) {
      addLog(`[اللوائح الأكاديمية] تم إضافة برنامج دراسي [${newProgInput.trim()}] لكلية [${selectedCol?.nameAr || selectedCol?.name}]`);
    }
    setNewProgInput("");
  };

  const handleRemoveProg = (progName: string) => {
    if (!selectedColId) return;
    setColleges(prev => prev.map(c => {
      if (c.id === selectedColId) {
        const progs = c.programs || [];
        return { ...c, programs: progs.filter((p: string) => p !== progName) };
      }
      return c;
    }));
    if (addLog) {
      addLog(`[اللوائح الأكاديمية] تم إزالة برنامج [${progName}] من كلية [${selectedCol?.nameAr || selectedCol?.name}]`);
    }
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode.trim() || !newCourseName.trim() || !selectedColId) return;
    setColleges(prev => prev.map(c => {
      if (c.id === selectedColId) {
        const currCurriculum = c.curriculum || { "Level 1": [], "Level 2": [], "Level 3": [], "Level 4": [] };
        const levelCourses = currCurriculum[curriculumLevel] || [];
        if (levelCourses.some((crs: any) => crs.code === newCourseCode.trim().toUpperCase())) return c;
        
        const updatedLevelCourses = [...levelCourses, {
          code: newCourseCode.trim().toUpperCase(),
          name: newCourseName.trim(),
          credits: parseInt(newCourseCredits) || 3
        }];
        return {
          ...c,
          curriculum: {
            ...currCurriculum,
            [curriculumLevel]: updatedLevelCourses
          }
        };
      }
      return c;
    }));
    if (addLog) {
      addLog(`[اللوائح الأكاديمية] تم إضافة مقرر [${newCourseCode.trim().toUpperCase()} - ${newCourseName.trim()}] إلى لائحة [${selectedCol?.nameAr || selectedCol?.name}] - ${curriculumLevel}`);
    }
    setNewCourseCode("");
    setNewCourseName("");
  };

  const handleRemoveCourse = (courseCode: string) => {
    if (!selectedColId) return;
    setColleges(prev => prev.map(c => {
      if (c.id === selectedColId) {
        const currCurriculum = c.curriculum || { "Level 1": [], "Level 2": [], "Level 3": [], "Level 4": [] };
        const levelCourses = currCurriculum[curriculumLevel] || [];
        return {
          ...c,
          curriculum: {
            ...currCurriculum,
            [curriculumLevel]: levelCourses.filter((crs: any) => crs.code !== courseCode)
          }
        };
      }
      return c;
    }));
    if (addLog) {
      addLog(`[اللوائح الأكاديمية] تم حذف مقرر [${courseCode}] من لائحة [${selectedCol?.nameAr || selectedCol?.name}] - ${curriculumLevel}`);
    }
  };

  const toggleCollegeStatus = (colId: string) => {
    setColleges(prev => prev.map(c => {
      if (c.id === colId) {
        const newStatus = c.status === "suspended" ? "active" : "suspended";
        if (addLog) {
          addLog(`[إدارة النظام] تم ${newStatus === "suspended" ? "تعطيل ⚠️" : "تنشيط ✅"} خدمات كلية [${c.nameAr || c.name || c.nameEn}] بقرار مجلس الجامعة.`);
        }
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const handleUpdateHoursRequired = (hours: number) => {
    if (!selectedColId) return;
    setColleges(prev => prev.map(c => {
      if (c.id === selectedColId) {
        return { ...c, hoursRequired: hours };
      }
      return c;
    }));
  };

  const handleSimulateCollegeLogin = (col: any) => {
    const testStudentId = `2026SGU-TST-${col.id.toUpperCase()}`;
    const testStudent = {
      id: testStudentId,
      nationalId: "30210150102934",
      nameArabic: `طالب تجريبي - ${col.nameAr || col.name || col.nameEn}`,
      nameEnglish: `Test Student - ${col.nameEn || col.id}`,
      birthDate: "2004-03-12",
      nationality: "مصر",
      address: "الحي الثاني، الصالحية الجديدة، مصر",
      phone: "+201011223344",
      email: `test.${col.id}@stud.sgu.edu.eg`,
      guardianName: "أحمد عبد الرحمن عثمان",
      emergencyPhone: "+201287654321",
      college: col.id.toUpperCase(),
      department: col.departments?.[0] || "الشعبة العامة",
      major: col.programs?.[0] || "بكالوريوس تخصصي متقدم",
      advisor: "أ.د. محمد الشافعي",
      level: "المستوى الأول",
      totalGPA: 3.85,
      completedHours: 12,
      requiredHours: col.hoursRequired || 136,
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
    };

    localStorage.setItem("u_student", JSON.stringify(testStudent));
    localStorage.setItem("sgu_is_logged_in", "true");
    localStorage.setItem("sgu_user_role", "student");

    if (addLog) {
      addLog(`🛡️ [محاكاة الهوية] تم تفويض وتوليد هوية طالب تجريبي (${testStudent.nameArabic}) للكلية الجديدة [${col.nameAr || col.name}]`);
    }

    triggerSystemPush(
      lang === "ar" ? "🛡️ محاكاة الهوية الذكية" : "🛡️ Dynamic Identity Simulation",
      lang === "ar"
        ? `جاري تحويل المسار والولوج التلقائي لبيئة ${col.nameAr || col.name || col.nameEn}...`
        : `Bypassing login to enter ${col.nameEn || col.id} sandbox...`
    );

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Filter central users list
  const filteredUsers = useMemo(() => {
    return dbUsers.filter(u => {
      const matchSearch =
        u.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchCollege = collegeFilter === "all" || u.collegeId === collegeFilter;
      return matchSearch && matchRole && matchCollege;
    });
  }, [dbUsers, searchQuery, roleFilter, collegeFilter]);

  // Aggregate user counts per role for charts
  const chartDataRoles = useMemo(() => {
    const counts: Record<string, number> = {};
    dbUsers.forEach(u => {
      counts[u.role] = (counts[u.role] || 0) + 1;
    });
    return Object.keys(counts).map(k => {
      const roleObj = SGU_ROLES.find(r => r.id === k);
      return {
        name: lang === "ar" ? roleObj?.nameAr || k : roleObj?.nameEn || k,
        المستخدمين: counts[k]
      };
    });
  }, [dbUsers, lang]);

  // Aggregate multi-dimensional comparison metrics per college for charts
  const comparisonChartData = useMemo(() => {
    return colleges.map(c => {
      let val = 0;
      let label = "";
      if (comparisonMetric === "gpa") {
        val = c.studentAvgGpa || 3.2;
        label = lang === "ar" ? "الـGPA المتوسط" : "Avg GPA";
      } else if (comparisonMetric === "students") {
        val = dbUsers.filter(u => u.collegeId === c.id && u.role === "student").length;
        label = lang === "ar" ? "أعداد الطلاب" : "Students";
      } else if (comparisonMetric === "courses") {
        // filter courses
        val = courses ? courses.filter(crs => {
          const code = crs.code.toUpperCase();
          if (c.id === "fcis") return code.startsWith("CS") || code.startsWith("SE") || code.startsWith("AI") || code.startsWith("DB") || code.startsWith("SEC") || code.startsWith("MATH");
          if (c.id === "med") return code.startsWith("MD") || code.startsWith("ANAT") || code.startsWith("PHYS");
          if (c.id === "den") return code.startsWith("DN") || code.startsWith("DENT");
          if (c.id === "phr") return code.startsWith("PH");
          if (c.id === "pt") return code.startsWith("PT") || code.startsWith("KINE");
          if (c.id === "nur") return code.startsWith("NU") || code.startsWith("CRIT");
          if (c.id === "bus") return code.startsWith("BS") || code.startsWith("TRADE") || code.startsWith("MGT");
          return code.startsWith(c.id.toUpperCase());
        }).length : 5;
        label = lang === "ar" ? "المقررات النشطة" : "Active Courses";
      } else if (comparisonMetric === "departments") {
        val = (c.departments || []).length;
        label = lang === "ar" ? "الأقسام العلمية" : "Departments";
      } else if (comparisonMetric === "revenues") {
        val = finance ? finance.filter(f => f.paid && (f.collegeId === c.id || f.studentId?.includes(c.id.toUpperCase()))).reduce((sum, f) => sum + f.amount, 0) : 0;
        if (val === 0) {
          const studentCount = dbUsers.filter(u => u.collegeId === c.id && u.role === "student").length;
          val = studentCount * 12000;
        }
        label = lang === "ar" ? "الإيرادات المحصلة (ج.م)" : "Revenues (EGP)";
      }
      return {
        name: lang === "ar" ? c.nameAr || c.name : c.nameEn || c.id.toUpperCase(),
        [label]: val,
        metricLabel: label,
        metricValue: val
      };
    });
  }, [colleges, comparisonMetric, dbUsers, courses, finance, lang]);

  return (
    <div className="space-y-6 text-right">
      {/* Enterprise Admin Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-end">
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
              <span>{lang === "ar" ? "لوحة المدير المركزي وإدارة النظام الشاملة" : "Central Executive Director & Administrator Panel"}</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </h3>
            <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              Super-Admin
            </span>
          </div>
          <p className="text-xs text-slate-450 leading-relaxed">
            {lang === "ar"
              ? "تفويض الإشراف الهيكلي، رصد إيرادات الخزينة، تهيئة هيكل الكليات، وتعديل صلاحيات المستخدمين والتحكم في حظر الحسابات."
              : "Institutional oversight, general ledger balancing, faculty setup, credentials management, and instant suspension execution."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex gap-1 font-bold text-xs">
          {[
            { id: "overview", labelAr: "الإحصائيات والتقارير", labelEn: "Overview" },
            { id: "colleges", labelAr: "إدارة الكليات والأقسام", labelEn: "Colleges" },
            { id: "users", labelAr: "المستخدمين والصلاحيات", labelEn: "Users Desk" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-slate-950 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lang === "ar" ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== 1. OVERVIEW / BI STATISTICS TAB ==================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-semibold">{lang === "ar" ? "إجمالي الكليات النشطة" : "Active Faculties"}</span>
              <div className="text-xl font-bold text-slate-150 text-slate-200 mt-1">{colleges.length} {lang === "ar" ? "كلية علمية" : "Colleges"}</div>
              <span className="text-[9.5px] text-slate-500">تم تهيئة الأقسام واللوائح السريرية</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-semibold">{lang === "ar" ? "إجمالي المستخدمين المسجلين" : "Seeded Accounts"}</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{dbUsers.length} {lang === "ar" ? "حساب معتمد" : "Members"}</div>
              <span className="text-[9.5px] text-slate-500">منهم {dbUsers.filter(u => u.status === "suspended").length} معلق حالياً</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-semibold">{lang === "ar" ? "معدل سلامة الخادم المباشر" : "Server System Load"}</span>
              <div className="text-xl font-bold text-teal-400 mt-1">99.98%</div>
              <span className="text-[9.5px] text-slate-500">كافة الاتصالات وقواعد البيانات LIVE</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-semibold">{lang === "ar" ? "إجمالي المدفوعات المستلمة" : "TUITION FEE INCOME"}</span>
              <div className="text-xl font-bold text-amber-500 mt-1">
                {finance.filter(f => f.paid).reduce((sum, f) => sum + f.amount, 0).toLocaleString()} ج.م
              </div>
              <span className="text-[9.5px] text-slate-500">تم تحصيلها وإقراره بالخزينة</span>
            </div>
          </div>

          {/* Recharts Data Analytics Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Interactive Multi-College Performance Matrix */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-slate-850 pb-2">
                <h4 className="text-xs font-black text-slate-200 flex items-center justify-end gap-1.5 order-last sm:order-first">
                  <span>{lang === "ar" ? "مصفوفة التحليل والمقارنة الأكاديمية بين الكليات" : "Inter-College Multi-Dimensional Performance Matrix"}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </h4>
                
                {/* Metric Selector Tabs */}
                <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850 self-end">
                  {[
                    { id: "gpa", labelAr: "المعدل (GPA)", labelEn: "GPA" },
                    { id: "students", labelAr: "الطلاب", labelEn: "Students" },
                    { id: "courses", labelAr: "المقررات", labelEn: "Courses" },
                    { id: "departments", labelAr: "الأقسام", labelEn: "Depts" },
                    { id: "revenues", labelAr: "الإيرادات", labelEn: "Revenues" }
                  ].map(metric => (
                    <button
                      key={metric.id}
                      onClick={() => setComparisonMetric(metric.id as any)}
                      className={`cursor-pointer px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        comparisonMetric === metric.id
                          ? "bg-emerald-500 text-slate-950"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {lang === "ar" ? metric.labelAr : metric.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64 font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#fff" }}
                      formatter={(value: any, name: any, props: any) => [
                        comparisonMetric === "revenues" ? `${value.toLocaleString()} ج.م` : value,
                        props.payload.metricLabel
                      ]}
                    />
                    <Bar 
                      name={comparisonChartData[0]?.metricLabel || "Value"} 
                      dataKey="metricValue" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Database User Roles Distribution */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
              <h4 className="text-xs font-black text-slate-200 flex items-center justify-end gap-1.5 border-b border-slate-850 pb-2">
                <span>{lang === "ar" ? "توزيع المستخدمين بالقاعدة المركزية لكل دور" : "Central Database Users per System Role"}</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </h4>
              <div className="h-64 font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataRoles}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#fff" }} />
                    <Bar dataKey="المستخدمين" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Security Logging Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-right">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-[10px] font-mono text-emerald-400 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                LIVE AUDIT STREAM ACTIVE
              </span>
              <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                <span>{lang === "ar" ? "سجلات التدقيق الأمني ومراقبة الدخول الفوري للأنظمة" : "Real-Time Security Audit & Entrance Log Stream"}</span>
                <Server className="w-4 h-4 text-emerald-400" />
              </h4>
            </div>

            <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-850 max-h-72 overflow-y-auto space-y-1.5 text-right">
              {logs.map((logMsg, i) => {
                const isWarning = logMsg.includes("⚠️") || logMsg.includes("🚨") || logMsg.includes("فشل");
                const timestamp = logMsg.match(/\[(.*?)\]/)?.[1] || new Date().toTimeString().split(" ")[0];
                const cleanMsg = logMsg.replace(/\[.*?\]\s?/, "");
                const simulatedIP = `10.45.${(i * 3 + 12) % 254}.${(i * 7 + 85) % 254}`;
                return (
                  <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-b border-slate-900 last:border-b-0 ${isWarning ? "bg-rose-950/10" : ""}`}>
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] order-2 sm:order-1 font-mono">
                      <span>IP: {simulatedIP}</span>
                      <span>•</span>
                      <span>SGU-SSL/1.3</span>
                    </div>
                    <div className="text-right flex-1 font-sans text-xs text-slate-200 order-1 sm:order-2">
                      {isWarning ? (
                        <span className="inline-block bg-rose-500/10 text-rose-400 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1.5">
                          SEC_WARN
                        </span>
                      ) : (
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1.5">
                          OK
                        </span>
                      )}
                      <span>{cleanMsg}</span>
                    </div>
                    <div className="text-slate-500 font-mono text-[10px] order-3">
                      {timestamp}
                    </div>
                  </div>
                );
              })}
              {logs.length === 0 && (
                <div className="text-center py-4 text-slate-500 italic">
                  {lang === "ar" ? "لا توجد عمليات مسجلة حالياً." : "No operations recorded."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. COLLEGES & DEPARTMENTS MANAGER TAB ==================== */}
      {activeTab === "colleges" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <button
              onClick={() => setShowAddCollege(true)}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === "ar" ? "تأسيس كلية/برنامج جديد" : "Found New College"}</span>
            </button>
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>{lang === "ar" ? "لوحة التوجيه الأكاديمي وصناعة اللوائح والمناهج" : "Academics & Curriculums Control Panel"}</span>
              <Building className="w-4 h-4 text-emerald-500" />
            </h4>
          </div>

          {showAddCollege && (
            <form onSubmit={handleAddCollege} className="bg-slate-900 border border-slate-800 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block">{lang === "ar" ? "الاسم بالعربية" : "Name Arabic"}</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كلية الهندسة"
                  value={newCollegeNameAr}
                  onChange={(e) => setNewCollegeNameAr(e.target.value)}
                  className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block">{lang === "ar" ? "الاسم بالإنجليزية" : "Name English"}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Engineering"
                  value={newCollegeNameEn}
                  onChange={(e) => setNewCollegeNameEn(e.target.value)}
                  className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block">{lang === "ar" ? "معدل GPA المستهدف" : "Target Avg GPA"}</label>
                <input
                  type="text"
                  required
                  value={newCollegeAvgGpa}
                  onChange={(e) => setNewCollegeAvgGpa(e.target.value)}
                  className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full font-mono focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-4 py-2 text-xs rounded w-full"
                >
                  {lang === "ar" ? "تأكيد الحفظ" : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCollege(false)}
                  className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 text-xs rounded"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </form>
          )}

          {/* Master-Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Master Side: Colleges list (col-span-5) */}
            <div className="lg:col-span-5 space-y-3">
              <h5 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider text-right block">
                {lang === "ar" ? `مستودع الكليات المعتمدة (${colleges.length})` : `Official Accredited Faculties (${colleges.length})`}
              </h5>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {colleges.map((col) => {
                  const isSelected = selectedColId === col.id;
                  const isSuspended = col.status === "suspended";
                  const collegeName = lang === "ar" ? (col.nameAr || col.name) : (col.nameEn || col.id);
                  
                  return (
                    <div 
                      key={col.id} 
                      className={`transition-all duration-200 bg-slate-900 border text-right rounded-xl p-4 flex flex-col justify-between space-y-3 cursor-pointer ${
                        isSelected 
                          ? "border-emerald-500 ring-1 ring-emerald-500/25 bg-slate-900/90" 
                          : "border-slate-850 hover:border-slate-700"
                      }`}
                      onClick={() => setSelectedColId(col.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                          {isSuspended ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-400 border border-rose-900/40">
                              {lang === "ar" ? "معطل" : "Suspended"}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900/40">
                              {lang === "ar" ? "نشط" : "Active"}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-500">CODE: {col.id}</span>
                        </div>
                        <strong className="text-xs font-bold text-slate-200 block">{collegeName}</strong>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850 text-center">
                        <div>
                          <span className="text-[9px] text-slate-500 block">{lang === "ar" ? "الأقسام العلمية" : "Departments"}</span>
                          <span className="text-xs font-bold text-slate-300">{(col.departments || []).length}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">{lang === "ar" ? "البرامج الأكاديمية" : "Programs"}</span>
                          <span className="text-xs font-bold text-slate-300">{(col.programs || []).length}</span>
                        </div>
                      </div>

                      {/* Immediate Control Strip */}
                      <div className="flex gap-1.5 pt-1.5 border-t border-slate-850 justify-end" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSimulateCollegeLogin(col)}
                          className="cursor-pointer bg-slate-950 text-amber-500 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 font-bold text-[10px] px-2 py-1 rounded flex items-center gap-1"
                          title={lang === "ar" ? "تجربة الدخول الفوري بهوية طالب لهذه الكلية" : "Simulate student identity portal login"}
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{lang === "ar" ? "اختبار الهوية الذكية" : "Identity Test"}</span>
                        </button>
                        
                        <button
                          onClick={() => toggleCollegeStatus(col.id)}
                          className={`cursor-pointer border text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                            isSuspended
                              ? "bg-emerald-950/40 border-emerald-900 text-emerald-400 hover:bg-emerald-900/30"
                              : "bg-rose-950/40 border-rose-900 text-rose-400 hover:bg-rose-900/30"
                          }`}
                        >
                          {isSuspended ? (lang === "ar" ? "تنشيط الخدمة" : "Activate") : (lang === "ar" ? "تعطيل الكلية" : "Deactivate")}
                        </button>
                        
                        <button
                          onClick={() => setSelectedColId(col.id)}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded"
                        >
                          {lang === "ar" ? "تعديل المنهج ⚙️" : "Configure"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Side: Syllabus & Curriculums Customizer (col-span-7) */}
            <div className="lg:col-span-7">
              {selectedCol ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 text-right">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                    <button 
                      onClick={() => setSelectedColId(null)}
                      className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-1 rounded"
                    >
                      {lang === "ar" ? "إغلاق التحرير" : "Close"}
                    </button>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        {lang === "ar" ? `تحرير لائحة ومقررات: ${selectedCol.nameAr || selectedCol.name}` : `Editing Syllabus: ${selectedCol.nameEn || selectedCol.id}`}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">COLLEGE CODE: {selectedCol.id.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* 1. Departments and Majors Section */}
                  <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                    <h5 className="text-[11px] font-bold text-teal-400 flex items-center justify-end gap-1.5">
                      <span>{lang === "ar" ? "الأقسام الأكاديمية بالكلية" : "College Departments"}</span>
                      <Layers className="w-3.5 h-3.5 text-teal-500" />
                    </h5>

                    {/* Department Badges list */}
                    <div className="flex flex-wrap gap-2 justify-end">
                      {(selectedCol.departments || []).map((dept: string, idx: number) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          <button 
                            type="button" 
                            onClick={() => handleRemoveDept(dept)}
                            className="cursor-pointer text-slate-500 hover:text-rose-400 font-black text-xs"
                            title={lang === "ar" ? "إزالة القسم" : "Remove Department"}
                          >
                            ×
                          </button>
                          <span>{dept}</span>
                        </span>
                      ))}
                      {(selectedCol.departments || []).length === 0 && (
                        <span className="text-[10px] text-slate-500">{lang === "ar" ? "لا توجد أقسام مسجلة حالياً." : "No departments registered."}</span>
                      )}
                    </div>

                    {/* Add Department Inline Form */}
                    <form onSubmit={handleAddDept} className="flex gap-2 justify-end pt-2 max-w-md mr-auto">
                      <button
                        type="submit"
                        className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 text-[10.5px] font-bold px-3 py-1.5 rounded"
                      >
                        {lang === "ar" ? "إضافة قسم" : "Add Dept"}
                      </button>
                      <input
                        type="text"
                        placeholder={lang === "ar" ? "اسم القسم الجديد... مثال: الذكاء الاصطناعي" : "New department name..."}
                        value={newDeptInput}
                        onChange={(e) => setNewDeptInput(e.target.value)}
                        className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded px-2.5 py-1.5 w-full focus:outline-none focus:border-slate-700 text-right"
                      />
                    </form>
                  </div>

                  {/* 2. Degree Programs Section */}
                  <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                    <h5 className="text-[11px] font-bold text-blue-400 flex items-center justify-end gap-1.5">
                      <span>{lang === "ar" ? "البرامج والشهادات المعتمدة بالكلية" : "Accredited Degree Programs"}</span>
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    </h5>

                    {/* Program Badges list */}
                    <div className="flex flex-col gap-1.5">
                      {(selectedCol.programs || []).map((prog: string, idx: number) => (
                        <div 
                          key={idx} 
                          className="flex justify-between items-center bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded-lg text-[10.5px] text-slate-300 text-right"
                        >
                          <button 
                            type="button" 
                            onClick={() => handleRemoveProg(prog)}
                            className="cursor-pointer text-slate-500 hover:text-rose-400 font-bold px-1"
                            title={lang === "ar" ? "إزالة البرنامج" : "Remove Program"}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span>{prog}</span>
                        </div>
                      ))}
                      {(selectedCol.programs || []).length === 0 && (
                        <div className="text-[10px] text-slate-500">{lang === "ar" ? "لا توجد برامج مسجلة حالياً." : "No programs registered."}</div>
                      )}
                    </div>

                    {/* Add Program Inline Form */}
                    <form onSubmit={handleAddProg} className="flex gap-2 justify-end pt-2 max-w-md mr-auto">
                      <button
                        type="submit"
                        className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-[10.5px] font-bold px-3 py-1.5 rounded"
                      >
                        {lang === "ar" ? "إضافة برنامج" : "Add Program"}
                      </button>
                      <input
                        type="text"
                        placeholder={lang === "ar" ? "برنامج جديد... مثال: بكالوريوس الأمن السيبراني" : "New program degree..."}
                        value={newProgInput}
                        onChange={(e) => setNewProgInput(e.target.value)}
                        className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded px-2.5 py-1.5 w-full focus:outline-none focus:border-slate-700 text-right"
                      />
                    </form>
                  </div>

                  {/* 3. Credits & Graduation Requirements */}
                  <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block">{lang === "ar" ? "نظام التدريس الإلزامي بالكلية" : "Instruction Delivery Model"}</span>
                      <strong className="text-xs text-slate-300 font-black">{lang === "ar" ? "الساعات المعتمدة (Credit Hours) - لائحة هجينة" : "Credit Hours Syllabus - Hybrid"}</strong>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 block font-bold">{lang === "ar" ? "عدد الساعات المطلوبة للتخرج والاعتماد:" : "Hours Required for Graduation:"}</label>
                      <input
                        type="number"
                        min="120"
                        max="240"
                        value={selectedCol.hoursRequired || 136}
                        onChange={(e) => handleUpdateHoursRequired(parseInt(e.target.value) || 136)}
                        className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-32 text-center font-mono focus:outline-none focus:border-slate-700"
                      />
                    </div>
                  </div>

                  {/* 4. Level study plans & courses */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="text-[10.5px] text-slate-500 font-mono">CURRICULUM MAPPING</span>
                      <h5 className="text-[11.5px] font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{lang === "ar" ? "الخطة الدراسية الموزعة على المستويات الأربعة" : "4-Level Study Plan Mapping"}</span>
                        <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                      </h5>
                    </div>

                    {/* Level Selector Tabs */}
                    <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                      {(["Level 1", "Level 2", "Level 3", "Level 4"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setCurriculumLevel(lvl)}
                          className={`cursor-pointer text-center py-1.5 text-[10.5px] font-bold rounded-md w-full transition-all ${
                            curriculumLevel === lvl 
                              ? "bg-emerald-600 text-slate-950 font-black" 
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                          }`}
                        >
                          {lang === "ar" 
                            ? (lvl === "Level 1" ? "المستوى 1" : lvl === "Level 2" ? "المستوى 2" : lvl === "Level 3" ? "المستوى 3" : "المستوى 4")
                            : lvl}
                        </button>
                      ))}
                    </div>

                    {/* Courses list of active level */}
                    <div className="space-y-2 max-h-[180px] overflow-y-auto bg-slate-950/40 p-2.5 rounded-lg border border-slate-850/60">
                      {((selectedCol.curriculum || {})[curriculumLevel] || []).map((crs: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="flex justify-between items-center bg-slate-900 border border-slate-850 px-3 py-1.5 rounded text-xs text-right"
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-950 text-slate-400 border border-slate-850 font-mono">
                              {crs.credits} CH
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCourse(crs.code)}
                              className="cursor-pointer text-slate-500 hover:text-rose-400 font-bold px-1"
                              title={lang === "ar" ? "حذف المقرر" : "Remove Course"}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div>
                            <span className="text-slate-400 font-mono text-[10px] mr-2">[{crs.code}]</span>
                            <strong className="text-slate-200 font-bold">{crs.name}</strong>
                          </div>
                        </div>
                      ))}

                      {(!selectedCol.curriculum || !selectedCol.curriculum[curriculumLevel] || selectedCol.curriculum[curriculumLevel].length === 0) && (
                        <div className="text-center py-4 text-[10.5px] text-slate-500 italic">
                          {lang === "ar" ? "لا توجد مقررات مدرجة في لائحة هذا المستوى الأكاديمي بعد." : "No courses assigned for this syllabus level yet."}
                        </div>
                      )}
                    </div>

                    {/* Add Course Inline Form */}
                    <form onSubmit={handleAddCourse} className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 space-y-3">
                      <strong className="text-[10px] font-bold text-slate-400 block border-b border-slate-850/50 pb-1">
                        {lang === "ar" ? `إدراج مقرر دراسي جديد لـ (${curriculumLevel})` : `Insert Course to (${curriculumLevel})`}
                      </strong>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 block">{lang === "ar" ? "رمز المقرر:" : "Course Code:"}</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. CS101"
                            value={newCourseCode}
                            onChange={(e) => setNewCourseCode(e.target.value)}
                            className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-1.5 w-full uppercase font-mono focus:outline-none focus:border-slate-700 text-right"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[9px] text-slate-500 block">{lang === "ar" ? "اسم المقرر الدراسي:" : "Course Name:"}</label>
                          <input
                            type="text"
                            required
                            placeholder={lang === "ar" ? "مثال: الرياضيات المتقدمة للمهندسين" : "e.g. Calculus I"}
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-1.5 w-full focus:outline-none focus:border-slate-700 text-right"
                          />
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3 py-2 rounded w-full transition-colors"
                          >
                            {lang === "ar" ? "إدراج المقرّر" : "Insert"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-850 border-dashed rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 min-h-[400px]">
                  <Sliders className="w-10 h-10 text-slate-700 animate-pulse" />
                  <div className="space-y-1">
                    <strong className="text-slate-400 text-xs block font-bold">{lang === "ar" ? "محرر اللوائح الدراسية الذكي" : "Syllabus Curriculum Editor"}</strong>
                    <p className="text-[10px] text-slate-550 leading-relaxed max-w-sm">
                      {lang === "ar" 
                        ? "اختر إحدى كليات الجامعة من القائمة المقابلة للبدء في صياغة الأقسام والبرامج وتوزيع المقررات عبر المستويات الأربعة، أو إجراء اختبار دخول ذكي فوري."
                        : "Select any faculty from the master list to configure academic departments, degree programs, four-year course maps, or perform dynamic identity verification."}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================== 3. USER ROLES & PERMISSIONS DESK TAB ==================== */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Top Bar filtering and creation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* User creation panel */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-slate-200 flex items-center justify-end gap-1.5 border-b border-slate-850 pb-2">
                <span>{lang === "ar" ? "تأسيس حساب مستخدم جديد بالقاعدة المركزية" : "Seed New System Account"}</span>
                <UserPlus className="w-4 h-4 text-emerald-500" />
              </h4>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] text-slate-450 block">{lang === "ar" ? "اسم المستخدم بالكامل (العربية):" : "Full Name (Ar):"}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. مجدي زكريا سليمان"
                    value={newUserNameAr}
                    onChange={(e) => setNewUserNameAr(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2.5 w-full focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] text-slate-450 block">{lang === "ar" ? "البريد الإلكتروني المخصص (اختياري):" : "Custom Email (Optional):"}</label>
                  <input
                    type="email"
                    placeholder="example@sgu.edu.eg"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2.5 w-full focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10.5px] text-slate-450 block">{lang === "ar" ? "الكلية:" : "College:"}</label>
                    <select
                      value={newUserCollege}
                      onChange={(e) => setNewUserCollege(e.target.value)}
                      className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                    >
                      {colleges.map(c => (
                        <option key={c.id} value={c.id}>{c.nameAr}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] text-slate-450 block">{lang === "ar" ? "رتبة الصلاحية الأولى:" : "Primary Role:"}</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                    >
                      {SGU_ROLES.map(r => (
                        <option key={r.id} value={r.id}>{r.nameAr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] text-slate-450 block">{lang === "ar" ? "الـ GPA أو الراتب المقدر:" : "GPA or Est Salary:"}</label>
                  <input
                    type="text"
                    required
                    value={newUserGpaOrSalary}
                    onChange={(e) => setNewUserGpaOrSalary(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2.5 w-full font-mono focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs p-2.5 rounded-lg w-full transition-all flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{lang === "ar" ? "تسجيل الحساب وتفعيل البوابة" : "Register Account"}</span>
                </button>
              </form>
            </div>

            {/* Users lists & permissions control */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-850 pb-2.5">
                <div className="flex flex-wrap gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-400 text-xs p-1.5 rounded focus:outline-none"
                  >
                    <option value="all">{lang === "ar" ? "كل الأدوار" : "All Roles"}</option>
                    {SGU_ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.nameAr}</option>
                    ))}
                  </select>
                  
                  <select
                    value={collegeFilter}
                    onChange={(e) => setCollegeFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-400 text-xs p-1.5 rounded focus:outline-none"
                  >
                    <option value="all">{lang === "ar" ? "كل الكليات" : "All Colleges"}</option>
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>{c.nameAr}</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative w-full sm:w-64">
                  <Search className="absolute right-3 top-2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "ابحث بالاسم أو الكود..." : "Search user or ID..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded pr-9 pl-3 py-1 text-xs text-slate-200 focus:outline-none placeholder:text-slate-650 text-right"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-300 font-medium">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] text-slate-400">
                      <th className="p-3 text-right">{lang === "ar" ? "كود العضو" : "Member ID"}</th>
                      <th className="p-3 text-right">{lang === "ar" ? "الاسم بالعربية" : "Name Arabic"}</th>
                      <th className="p-3 text-right">{lang === "ar" ? "الكلية" : "Faculty"}</th>
                      <th className="p-3 text-center">{lang === "ar" ? "تعديل الصلاحية والدور" : "Change Role"}</th>
                      <th className="p-3 text-center">{lang === "ar" ? "حالة الأمان" : "Security Status"}</th>
                      <th className="p-3 text-center">{lang === "ar" ? "الإجراء" : "Controls"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.slice(0, 15).map((user) => {
                      const isSuspended = user.status === "suspended";
                      return (
                        <tr key={user.id} className="border-b border-slate-850/60 hover:bg-slate-950/25 transition">
                          <td className="p-3 text-right font-mono text-slate-405 text-[10.5px]">{user.id}</td>
                          <td className="p-3 text-right font-bold text-slate-150 text-slate-200">
                            <div className="flex flex-col">
                              <span>{user.nameAr}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{user.email}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right font-semibold text-teal-400 uppercase">{user.collegeId}</td>
                          <td className="p-3 text-center">
                            <select
                              value={user.role}
                              onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                              className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] p-1 rounded font-sans focus:outline-none"
                            >
                              {SGU_ROLES.map(r => (
                                <option key={r.id} value={r.id}>{r.nameAr}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                              isSuspended ? "bg-rose-950 text-rose-400 border border-rose-900/40" : "bg-emerald-950 text-emerald-400 border border-emerald-900/40"
                            }`}>
                              {isSuspended ? (lang === "ar" ? "🚨 حساب محظور" : "Suspended") : (lang === "ar" ? "✓ نشط وموثق" : "Active")}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={`cursor-pointer text-[10.5px] font-bold px-3 py-1 rounded transition ${
                                isSuspended 
                                  ? "bg-emerald-600 text-slate-950 hover:bg-emerald-500" 
                                  : "bg-rose-950 text-rose-350 border border-rose-900/40 hover:bg-rose-900"
                              }`}
                            >
                              {isSuspended ? (lang === "ar" ? "إلغاء الحظر" : "Activate") : (lang === "ar" ? "حظر مؤقت" : "Suspend")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
