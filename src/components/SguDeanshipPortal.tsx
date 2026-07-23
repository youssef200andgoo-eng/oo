import React, { useState, useMemo } from "react";
import {
  Users,
  GraduationCap,
  Building,
  BookOpen,
  Calendar,
  Award,
  Activity,
  FileText,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { motion } from "motion/react";
import { DatabaseUser } from "../databaseMock";
import { Course, ScheduleItem, AttendanceRecord } from "../types";

interface SguDeanshipPortalProps {
  collegeId: string; // e.g. 'fcis', 'med', 'phr', etc.
  dbUsers: DatabaseUser[];
  setDbUsers: React.Dispatch<React.SetStateAction<DatabaseUser[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  schedules: ScheduleItem[];
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  colleges: any[];
  setColleges: React.Dispatch<React.SetStateAction<any[]>>;
  lang: "ar" | "en";
  addLog: (msg: string) => void;
  triggerSystemPush: (title: string, msg: string) => void;
}

export default function SguDeanshipPortal({
  collegeId,
  dbUsers,
  setDbUsers,
  courses,
  setCourses,
  schedules,
  setSchedules,
  attendance,
  setAttendance,
  colleges,
  setColleges,
  lang,
  addLog,
  triggerSystemPush
}: SguDeanshipPortalProps) {
  const isAr = lang === "ar";
  const activeColId = collegeId.toLowerCase();

  // Find active college metadata
  const activeCollege = useMemo(() => {
    return colleges.find(c => c.id === activeColId) || {
      id: activeColId,
      nameAr: isAr ? "كلية منشأة حديثاً" : "Newly Formed College",
      nameEn: "Newly Formed College",
      departments: isAr ? ["قسم تكنولوجيا المعلومات الأساسي"] : ["Core Information Technology"],
      programs: isAr ? ["برنامج بكالوريوس التكنولوجيا المعتمد"] : ["B.Sc. Accredited Technology Program"],
      studentAvgGpa: 3.20,
      color: "text-teal-400"
    };
  }, [colleges, activeColId, isAr]);

  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "faculty" | "departments" | "courses" | "schedules" | "attendance" | "grades" | "reports" | "config" | "petitions"
  >("overview");

  // Load and sync service requests from students
  const [serviceRequests, setServiceRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem("sgu_service_requests");
    if (saved) return JSON.parse(saved);
    const seeds = [
      { id: "S-512", studentId: "SGU-ST-FCIS-10045", studentName: "يوسف شريف الكردي", collegeId: "fcis", type: "تغيير المسار الأكاديمي (Major Transfer)", date: "2026-06-18", status: "Approved" },
      { id: "S-513", studentId: "SGU-ST-MED-20011", studentName: "سارة محمود الجندي", collegeId: "med", type: "طلب عذر طبي رسمي", date: "2026-06-20", status: "Pending Dean Approval" }
    ];
    localStorage.setItem("sgu_service_requests", JSON.stringify(seeds));
    return seeds;
  });

  const saveServiceRequests = (updated: any[]) => {
    setServiceRequests(updated);
    localStorage.setItem("sgu_service_requests", JSON.stringify(updated));
  };

  // Filter central state by this isolated college
  const collegeStudents = useMemo(() => {
    return dbUsers.filter(u => u.collegeId === activeColId && u.role === "student");
  }, [dbUsers, activeColId]);

  const collegeFaculty = useMemo(() => {
    return dbUsers.filter(
      u => u.collegeId === activeColId && 
      (u.role === "faculty" || u.role === "ta" || u.role === "advisor" || u.role === "dept_head" || u.role === "dean")
    );
  }, [dbUsers, activeColId]);

  const collegeCourses = useMemo(() => {
    // Standard system courses matching our collegeId
    // If course starts with appropriate code or has a custom field, or we filter dynamically
    // To support multi-college, we match course code prefixes or store/filter by custom code prefixes
    // fcis -> CS/SE/AI/DB/SEC/MATH, med -> MD/ANAT/PHYS, phr -> PHR, etc.
    return courses.filter(c => {
      const code = c.code.toUpperCase();
      if (activeColId === "fcis") {
        return code.startsWith("CS") || code.startsWith("SE") || code.startsWith("AI") || code.startsWith("DB") || code.startsWith("SEC") || code.startsWith("MATH");
      }
      if (activeColId === "med") {
        return code.startsWith("MD") || code.startsWith("ANAT") || code.startsWith("PHYS");
      }
      if (activeColId === "den") {
        return code.startsWith("DN") || code.startsWith("DENT");
      }
      if (activeColId === "phr") {
        return code.startsWith("PH");
      }
      if (activeColId === "pt") {
        return code.startsWith("PT") || code.startsWith("KINE");
      }
      if (activeColId === "nur") {
        return code.startsWith("NU") || code.startsWith("CRIT");
      }
      if (activeColId === "bus") {
        return code.startsWith("BS") || code.startsWith("TRADE") || code.startsWith("MGT");
      }
      return code.startsWith(activeColId.toUpperCase());
    });
  }, [courses, activeColId]);

  const collegeSchedules = useMemo(() => {
    return schedules.filter(s => {
      const code = s.courseCode.toUpperCase();
      if (activeColId === "fcis") {
        return code.startsWith("CS") || code.startsWith("SE") || code.startsWith("AI") || code.startsWith("DB") || code.startsWith("SEC") || code.startsWith("MATH");
      }
      if (activeColId === "med") {
        return code.startsWith("MD") || code.startsWith("ANAT") || code.startsWith("PHYS");
      }
      if (activeColId === "den") {
        return code.startsWith("DN") || code.startsWith("DENT");
      }
      if (activeColId === "phr") {
        return code.startsWith("PH");
      }
      if (activeColId === "pt") {
        return code.startsWith("PT") || code.startsWith("KINE");
      }
      if (activeColId === "nur") {
        return code.startsWith("NU") || code.startsWith("CRIT");
      }
      if (activeColId === "bus") {
        return code.startsWith("BS") || code.startsWith("TRADE") || code.startsWith("MGT");
      }
      return code.startsWith(activeColId.toUpperCase());
    });
  }, [schedules, activeColId]);

  const collegeAttendance = useMemo(() => {
    return attendance.filter(a => {
      const code = a.courseCode?.toUpperCase() || "";
      if (activeColId === "fcis") {
        return code.startsWith("CS") || code.startsWith("SE") || code.startsWith("AI") || code.startsWith("DB") || code.startsWith("SEC") || code.startsWith("MATH") || !a.courseCode;
      }
      return code.startsWith(activeColId.toUpperCase()) || !a.courseCode;
    });
  }, [attendance, activeColId]);

  // Dashboard Stats
  const stats = useMemo(() => {
    const totalS = collegeStudents.length;
    const totalF = collegeFaculty.length;
    const totalD = activeCollege.departments?.length || 0;
    const totalC = collegeCourses.length;
    const avgGPA = totalS > 0
      ? parseFloat((collegeStudents.reduce((acc, s) => acc + parseFloat(s.gpaOrSalary || "0"), 0) / totalS).toFixed(2))
      : 3.40;
    const totalFeesCollected = totalS * 24000; // base revenue

    return { totalS, totalF, totalD, totalC, avgGPA, totalFeesCollected };
  }, [collegeStudents, collegeFaculty, collegeCourses, activeCollege, activeColId]);

  // Charts Mock Data but derived from Live State
  const gpaChartData = useMemo(() => {
    const ranges = { "A (3.6-4.0)": 0, "B (3.0-3.5)": 0, "C (2.4-2.9)": 0, "Probation (<2.4)": 0 };
    collegeStudents.forEach(s => {
      const val = parseFloat(s.gpaOrSalary) || 0;
      if (val >= 3.6) ranges["A (3.6-4.0)"]++;
      else if (val >= 3.0) ranges["B (3.0-3.5)"]++;
      else if (val >= 2.4) ranges["C (2.4-2.9)"]++;
      else ranges["Probation (<2.4)"]++;
    });
    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [collegeStudents]);

  // Search states
  const [studentSearch, setStudentSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");

  // Student Form states
  const [studName, setStudName] = useState("");
  const [studEmail, setStudEmail] = useState("");
  const [studPhone, setStudPhone] = useState("+20 1");
  const [studNationalId, setStudNationalId] = useState("");
  const [studLevel, setStudLevel] = useState(isAr ? "السنة الأولى - الفصل الدراسي الأول" : "Year 1 - Semester 1");
  const [studDept, setStudDept] = useState(activeCollege.departments?.[0] || "");
  const [studProg, setStudProg] = useState(activeCollege.programs?.[0] || "");
  const [studGpa, setStudGpa] = useState("3.20");

  // Faculty Form states
  const [facName, setFacName] = useState("");
  const [facEmail, setFacEmail] = useState("");
  const [facPhone, setFacPhone] = useState("+20 1");
  const [facRole, setFacRole] = useState<"faculty" | "ta" | "advisor" | "dept_head">("faculty");
  const [facDept, setFacDept] = useState(activeCollege.departments?.[0] || "");

  // Department Form states
  const [deptName, setDeptName] = useState("");
  const [deptProg, setDeptProg] = useState("");

  // Course Form states
  const [crsCode, setCrsCode] = useState("");
  const [crsTitle, setCrsTitle] = useState("");
  const [crsCredits, setCrsCredits] = useState(3);
  const [crsPrereq, setCrsPrereq] = useState("");

  // Schedule Form states
  const [schedDay, setSchedDay] = useState(isAr ? "الأحد" : "Sunday");
  const [schedTime, setSchedTime] = useState("08:30 - 10:00");
  const [schedCourse, setSchedCourse] = useState("");
  const [schedDoctor, setSchedDoctor] = useState("");
  const [schedRoom, setSchedRoom] = useState(isAr ? "المدرج الكبير أ" : "Main Auditorium A");

  // Grading states
  const [selectedCourseForGrades, setSelectedCourseForGrades] = useState("");
  const [gradesLocked, setGradesLocked] = useState<Record<string, boolean>>({});

  // Config target states
  const [targetGpaInput, setTargetGpaInput] = useState(String(activeCollege.studentAvgGpa));
  const [deanWelcomingInput, setDeanWelcomingInput] = useState(
    isAr ? "أهلاً ومرحباً بكم في الصرح التعليمي المتميز لجامعتنا العريقة." : "Welcome to the distinguished educational portal of our university."
  );

  // ADD NEW STUDENT
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studName || !studEmail) return;

    const newId = `2026SGU-ST-${String(10000 + dbUsers.length).slice(1)}`;
    const newStudent: DatabaseUser = {
      id: newId,
      nameAr: studName,
      nameEn: studName,
      role: "student",
      collegeId: activeColId,
      email: studEmail,
      phone: studPhone,
      nationalId: studNationalId || `3031024${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      gpaOrSalary: studGpa,
      campusBranch: isAr ? "فرع الصالحية الجديدة الرئيسي" : "Al-Salihiyah Main Campus"
    };

    setDbUsers(prev => [newStudent, ...prev]);
    localStorage.setItem("sgu_db_users", JSON.stringify([newStudent, ...dbUsers]));

    addLog(`[عمادة الكلية] قام عميد الكلية بإضافة طالب جديد: [${studName}] كود: ${newId} - تخصص: ${studDept}`);
    triggerSystemPush(
      isAr ? "طالب جديد مسجل" : "New Student Registered",
      isAr ? `تم قيد الطالب ${studName} بكنترول شؤون الطلاب.` : `Student ${studName} successfully added to the college registry.`
    );

    // reset
    setStudName("");
    setStudEmail("");
    setStudPhone("+20 1");
    setStudNationalId("");
  };

  // ADD NEW DOCTOR
  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName || !facEmail) return;

    const newId = `2026SGU-EMP-${String(10000 + dbUsers.length).slice(1)}`;
    const newDoc: DatabaseUser = {
      id: newId,
      nameAr: facName,
      nameEn: facName,
      role: facRole,
      collegeId: activeColId,
      email: facEmail,
      phone: facPhone,
      nationalId: `2751024${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      gpaOrSalary: "18,000 ج.م",
      campusBranch: isAr ? "فرع الصالحية الجديدة الرئيسي" : "Al-Salihiyah Main Campus"
    };

    setDbUsers(prev => [newDoc, ...prev]);
    localStorage.setItem("sgu_db_users", JSON.stringify([newDoc, ...dbUsers]));

    addLog(`[عمادة الكلية] تم تعيين عضو هيئة تدريس جديد باسم: [${facName}] رتبة: ${facRole}`);
    triggerSystemPush(
      isAr ? "عضو هيئة تدريس جديد" : "New Faculty Appointed",
      isAr ? `تم قيد الأستاذ ${facName} بالهيئة الأكاديمية.` : `Professor ${facName} successfully added to the faculty board.`
    );

    setFacName("");
    setFacEmail("");
    setFacPhone("+20 1");
  };

  // ADD NEW DEPARTMENT
  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName) return;

    const updatedColleges = colleges.map(c => {
      if (c.id === activeColId) {
        return {
          ...c,
          departments: [...(c.departments || []), deptName],
          programs: deptProg ? [...(c.programs || []), deptProg] : (c.programs || [])
        };
      }
      return c;
    });

    setColleges(updatedColleges);
    localStorage.setItem("u_colleges", JSON.stringify(updatedColleges));

    addLog(`[لوائح الكلية] قام عميد الكلية بإنشاء وتفعيل قسم علمي جديد باسم: [${deptName}]`);
    triggerSystemPush(
      isAr ? "قسم علمي جديد" : "New Department Created",
      isAr ? `تم إدراج لائحة قسم "${deptName}" بالهيكل الإداري.` : `Department "${deptName}" successfully chartered.`
    );

    setDeptName("");
    setDeptProg("");
  };

  // ADD NEW COURSE
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crsCode || !crsTitle) return;

    const newCourse: Course = {
      code: crsCode.toUpperCase(),
      name: crsTitle,
      description: isAr ? `مقرر أكاديمي معتمد باللوائح الأكاديمية لـ ${activeCollege.nameAr}` : `Accredited course syllabus for ${activeCollege.nameEn}`,
      prerequisites: crsPrereq ? [crsPrereq.toUpperCase()] : [],
      credits: crsCredits,
      status: "available",
      finalGrade: 100
    };

    const updatedCourses = [newCourse, ...courses];
    setCourses(updatedCourses);
    localStorage.setItem("u_courses", JSON.stringify(updatedCourses));

    addLog(`[المناهج الأكاديمية] إدراج مادة دراسية جديدة: [${crsTitle}] كود: ${crsCode.toUpperCase()}`);
    triggerSystemPush(
      isAr ? "إدراج مقرر جديد" : "New Course Cataloged",
      isAr ? `تم إضافة مادة ${crsTitle} بنجاح.` : `Course [${crsCode.toUpperCase()}] added to catalog.`
    );

    setCrsCode("");
    setCrsTitle("");
    setCrsPrereq("");
  };

  // ADD NEW SCHEDULE
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedCourse || !schedDoctor) return;

    const selectedCrsObj = courses.find(c => c.code === schedCourse);
    const newSched: ScheduleItem = {
      id: `s-${Date.now()}`,
      courseCode: schedCourse,
      courseName: selectedCrsObj ? selectedCrsObj.name : schedCourse,
      instructor: schedDoctor,
      room: schedRoom,
      building: isAr ? "مبنى الكلية التخصصي" : "Specialized College Building",
      timeSlot: schedTime,
      day: schedDay
    };

    const updatedSchedules = [newSched, ...schedules];
    setSchedules(updatedSchedules);
    localStorage.setItem("u_schedules", JSON.stringify(updatedSchedules));

    addLog(`[الجداول الدراسية] حجز محاضرة جديدة: [${newSched.courseName}] للدكتور: [${schedDoctor}] يوم: ${schedDay} توقيت: ${schedTime}`);
    triggerSystemPush(
      isAr ? "جدولة محاضرة جديدة" : "Lecture Scheduled",
      isAr ? `تم حجز قاعة ${schedRoom} للمقرر بنجاح.` : `Room ${schedRoom} booked for course lectures.`
    );
  };

  // SUSPEND USER TOGGLE
  const toggleStudentStatus = (id: string) => {
    const updatedUsers = dbUsers.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "active" ? "suspended" : "active";
        addLog(`[عمادة الكلية] تم تغيير حالة حساب الطالب [${u.nameAr}] كود: ${u.id} إلى: ${nextStatus === "active" ? "نشط" : "موقوف"}`);
        return { ...u, status: nextStatus as any };
      }
      return u;
    });
    setDbUsers(updatedUsers);
    localStorage.setItem("sgu_db_users", JSON.stringify(updatedUsers));
  };

  // CERTIFY EXAMS GRADES
  const certifyCourseGrades = (code: string) => {
    setGradesLocked(prev => ({ ...prev, [code]: true }));
    addLog(`[الكنترول والنتائج] اعتمد عميد الكلية رسمياً درجات كنترول مادة [${code}] وتم نشرها للطلاب.`);
    triggerSystemPush(
      isAr ? "اعتماد وإعلان نتائج" : "Grades Approved & Released",
      isAr ? `تم بث نتائج المقرر ${code} رسمياً برصيد الطلاب.` : `Exam control sheet for ${code} locked and published.`
    );
  };

  // UPDATE CONFIG
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedColleges = colleges.map(c => {
      if (c.id === activeColId) {
        return {
          ...c,
          studentAvgGpa: parseFloat(targetGpaInput) || 3.20
        };
      }
      return c;
    });
    setColleges(updatedColleges);
    localStorage.setItem("u_colleges", JSON.stringify(updatedColleges));

    addLog(`[إعدادات العمادة] تحديث معايير الجودة والـ GPA المستهدف ليكون: ${targetGpaInput}`);
    alert(isAr ? "تم حفظ إعدادات العمادة وبيانات الجودة بنجاح!" : "Deanship configurations saved successfully!");
  };

  // Simulated Report Download
  const triggerReportDownload = (reportType: string) => {
    addLog(`[تقارير العمادة] استخراج وتصدير تقرير ${reportType} للكلية بصيغة CSV/PDF.`);
    triggerSystemPush(
      isAr ? "تصدير التقرير ناجح" : "Report Export Complete",
      isAr ? `تم تحميل مستند التقرير الخاص بـ ${reportType} بنجاح.` : `Document file for ${reportType} has been prepared.`
    );
    alert(isAr ? `جاري تحميل التقرير الخاص بـ [${reportType}]...` : `Downloading report document [${reportType}]...`);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-850 overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[680px]">
      
      {/* SIDE MENU BAR */}
      <div className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-l border-slate-800 p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3 text-right">
            <span className="text-[9px] font-bold font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
              ERP COLL: {activeColId.toUpperCase()}
            </span>
            <h3 className="text-sm font-black text-slate-100 mt-2">
              {isAr ? activeCollege.nameAr : activeCollege.nameEn}
            </h3>
            <p className="text-[10px] text-slate-450 mt-0.5">
              {isAr ? "منظومة عميد الكلية الاستراتيجية" : "Strategic College Deanship Portal"}
            </p>
          </div>

          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0">
            {[
              { id: "overview", labelAr: "لوحة المراقبة العامة", labelEn: "Overview Dashboard", icon: TrendingUp },
              { id: "students", labelAr: "إدارة شؤون الطلاب", labelEn: "Student Management", icon: Users },
              { id: "faculty", labelAr: "أعضاء هيئة التدريس", labelEn: "Faculty Board", icon: GraduationCap },
              { id: "departments", labelAr: "الأقسام واللوائح", labelEn: "Departments", icon: Building },
              { id: "courses", labelAr: "المقررات الدراسية", labelEn: "Course Syllabus", icon: BookOpen },
              { id: "schedules", labelAr: "جداول المحاضرات", labelEn: "Schedules", icon: Calendar },
              { id: "grades", labelAr: "رصد واعتماد الدرجات", labelEn: "Grading Control", icon: Award },
              { id: "attendance", labelAr: "سجلات الحضور الذكية", labelEn: "Attendance Logs", icon: Activity },
              { id: "petitions", labelAr: "الالتماسات والخدمات الطلابية", labelEn: "Student Petitions", icon: Briefcase },
              { id: "reports", labelAr: "التقارير الإحصائية", labelEn: "Reports & Analytics", icon: FileText },
              { id: "config", labelAr: "إعدادات الكلية الجودة", labelEn: "College Config", icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`cursor-pointer w-full text-right py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 flex-row-reverse shrink-0 ${
                    isSelected
                      ? "bg-emerald-600 text-slate-950 shadow-lg"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-right text-[10px] text-slate-500 hidden lg:block">
          <p>{isAr ? "معايير الاعتماد والجودة" : "Quality Assurance & ABET standards"}</p>
          <p className="font-mono mt-0.5 text-emerald-500">SGU ISO-9001 ACTIVE</p>
        </div>
      </div>

      {/* PORTAL CORE CONTENT SPACE */}
      <div className="flex-1 p-6 space-y-6 text-right">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3 flex-row-reverse">
              <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? "لوحة التحليل والرقابة الرقمية للكلية" : "Isolated College Performance Metrics"}</span>
              </h4>
              <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full flex items-center gap-1.5 flex-row-reverse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {isAr ? "قاعدة البيانات مؤمنة ومعزولة بالكامل" : "Syllabus Core Fully Isolated"}
              </span>
            </div>

            {/* BENTO STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { labelAr: "الطلاب النشطين", labelEn: "Total Students", val: stats.totalS, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/5" },
                { labelAr: "أعضاء هيئة التدريس", labelEn: "Faculty Board", val: stats.totalF, icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-500/5" },
                { labelAr: "الأقسام العلمية", labelEn: "Departments", val: stats.totalD, icon: Building, color: "text-purple-400", bg: "bg-purple-500/5" },
                { labelAr: "المقررات واللوائح", labelEn: "Syllabus Courses", val: stats.totalC, icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/5" },
                { labelAr: "معدل GPA المتوسط", labelEn: "Average GPA", val: stats.avgGPA, icon: Award, color: "text-cyan-400", bg: "bg-cyan-500/5" },
                { labelAr: "الرسوم الأكاديمية ج.م", labelEn: "Fees Coll. EGP", val: stats.totalFeesCollected.toLocaleString(), icon: DollarSign, color: "text-rose-400", bg: "bg-rose-500/5" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-4 rounded-xl border border-slate-850 ${item.bg} space-y-1 text-right`}>
                    <div className="flex justify-between items-center flex-row-reverse">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-[10px] text-slate-500 font-bold">{isAr ? item.labelAr : item.labelEn}</span>
                    </div>
                    <p className="text-lg font-black text-slate-100 font-mono mt-2">{item.val}</p>
                  </div>
                );
              })}
            </div>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* GPA Distribution Chart */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                <h5 className="text-xs font-bold text-slate-350">{isAr ? "منحنى توزيع المعدل التراكمي للطلاب (GPA)" : "Student Cumulative GPA Distribution Chart"}</h5>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gpaChartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                      <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]}>
                        {gpaChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : index === 1 ? "#3b82f6" : index === 2 ? "#f59e0b" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Dean Notice / Quick Actions */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <h5 className="text-xs font-bold text-slate-350">{isAr ? "ركن عميد الكلية وقرارات الساعات المعتمدة" : "Deanship Strategic Directives Desk"}</h5>
                
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-2">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[10px] font-bold text-teal-400 uppercase bg-teal-500/10 px-2 py-0.5 rounded">
                      {isAr ? "الكلمة الترحيبية الرسمية للعمادة" : "Deanship Official Greeting Message"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    "{deanWelcomingInput}"
                  </p>
                </div>

                <div className="space-y-2 text-right">
                  <span className="text-[10px] text-slate-500 font-bold block">{isAr ? "إجراءات لوائح الساعات المعتمدة السريعة" : "Credit-Hours System Quick Actions"}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveTab("students")}
                      className="cursor-pointer bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/30 text-xs font-bold text-slate-300 py-2 rounded-lg"
                    >
                      {isAr ? "إضافة قيد طالب 👤" : "Enroll Student"}
                    </button>
                    <button
                      onClick={() => setActiveTab("faculty")}
                      className="cursor-pointer bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/30 text-xs font-bold text-slate-300 py-2 rounded-lg"
                    >
                      {isAr ? "تعيين دكتور أكاديمي 🎓" : "Appoint Doctor"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 flex justify-between items-center flex-row-reverse">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "نظام إدارة شؤون الطلاب وقيد الرسوم" : "SGU Student Registry Desk"}</h4>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder={isAr ? "البحث بالاسم أو الرقم الجامعي..." : "Search students..."}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 pr-8 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-full text-right"
                />
                <Search className="w-4 h-4 text-slate-500 absolute top-2 right-2.5" />
              </div>
            </div>

            {/* NEW STUDENT FORM */}
            <form onSubmit={handleAddStudent} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
              <h5 className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1.5">
                <span>{isAr ? "تسجيل وقيد طالب جديد كلياً بالكلية" : "Enroll New Academic Student Instance"}</span>
                <Plus className="w-4 h-4 text-emerald-400" />
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "الاسم الرباعي" : "Student Full Name"}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? "أحمد محمد كمال" : "e.g. John Doe"}
                    value={studName}
                    onChange={(e) => setStudName(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "البريد الأكاديمي" : "Academic Email"}</label>
                  <input
                    type="email"
                    required
                    placeholder="student@stud.sgu.edu.eg"
                    value={studEmail}
                    onChange={(e) => setStudEmail(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "القسم الأكاديمي" : "Department"}</label>
                  <select
                    value={studDept}
                    onChange={(e) => setStudDept(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    {activeCollege.departments?.map((d: string, idx: number) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "البرنامج الأكاديمي" : "Program Degree"}</label>
                  <select
                    value={studProg}
                    onChange={(e) => setStudProg(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    {activeCollege.programs?.map((p: string, idx: number) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "الهاتف" : "Phone"}</label>
                  <input
                    type="text"
                    required
                    value={studPhone}
                    onChange={(e) => setStudPhone(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "الرقم القومي" : "National ID"}</label>
                  <input
                    type="text"
                    placeholder="301..."
                    value={studNationalId}
                    onChange={(e) => setStudNationalId(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "معدل GPA المعتمد" : "Inbound GPA"}</label>
                  <input
                    type="text"
                    value={studGpa}
                    onChange={(e) => setStudGpa(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded w-full transition-colors"
                  >
                    {isAr ? "حفظ وإدراج قيد الطالب 👤" : "Confirm Enrollment"}
                  </button>
                </div>
              </div>
            </form>

            {/* STUDENTS LIST TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-3">{isAr ? "إجراءات الحساب" : "Account actions"}</th>
                    <th className="p-3">{isAr ? "معدل GPA" : "GPA"}</th>
                    <th className="p-3">{isAr ? "القسم العلمي" : "Department"}</th>
                    <th className="p-3">{isAr ? "تاريخ الالتحاق" : "Enrollment Date"}</th>
                    <th className="p-3">{isAr ? "الاسم" : "Name"}</th>
                    <th className="p-3">{isAr ? "الكود الجامعي" : "ID"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {collegeStudents
                    .filter(s => s.nameAr.includes(studentSearch) || s.id.includes(studentSearch))
                    .map(st => (
                      <tr key={st.id} className="hover:bg-slate-850/40">
                        <td className="p-3">
                          <button
                            onClick={() => toggleStudentStatus(st.id)}
                            className={`cursor-pointer text-[10px] font-black px-2 py-1 rounded ${
                              st.status === "active"
                                ? "bg-rose-950 text-rose-400 border border-rose-900/40"
                                : "bg-emerald-950 text-emerald-400 border border-emerald-900/40"
                            }`}
                          >
                            {st.status === "active" ? (isAr ? "إيقاف القيد" : "Suspend") : (isAr ? "تنشيط الخدمة" : "Unsuspend")}
                          </button>
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">{st.gpaOrSalary}</td>
                        <td className="p-3 text-slate-300">{st.departmentAr || "الشعبة العامة / إدارة"}</td>
                        <td className="p-3 text-slate-400">{st.createdAt}</td>
                        <td className="p-3 font-bold text-slate-200">
                          <div className="flex items-center gap-2 justify-end">
                            {st.status === "suspended" && (
                              <span className="bg-rose-950 text-rose-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-rose-900/40">
                                {isAr ? "موقوف" : "Suspended"}
                              </span>
                            )}
                            <span>{st.nameAr}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-450">{st.id}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FACULTY */}
        {activeTab === "faculty" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 flex justify-between items-center flex-row-reverse">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "الهيئة التدريسية والأبحاث" : "Faculty Board Ledger"}</h4>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder={isAr ? "البحث بالاسم..." : "Search doctors..."}
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 pr-8 text-xs text-slate-200 focus:outline-none w-full text-right"
                />
                <Search className="w-4 h-4 text-slate-500 absolute top-2 right-2.5" />
              </div>
            </div>

            {/* APPOINT DOCTOR FORM */}
            <form onSubmit={handleAddFaculty} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
              <h5 className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1.5">
                <span>{isAr ? "تعيين وتسمية عضو هيئة تدريس جديد بالكلية" : "Charter New Academic Professor Profile"}</span>
                <Plus className="w-4 h-4 text-emerald-400" />
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "الاسم الأكاديمي" : "Doctor Name"}</label>
                  <input
                    type="text"
                    required
                    placeholder="أ.د. عصام الجوهري"
                    value={facName}
                    onChange={(e) => setFacName(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "البريد الإلكتروني" : "Professor Email"}</label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@faculty.sgu.edu.eg"
                    value={facEmail}
                    onChange={(e) => setFacEmail(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "الرتبة العلمية" : "Rank/Title"}</label>
                  <select
                    value={facRole}
                    onChange={(e) => setFacRole(e.target.value as any)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    <option value="faculty">{isAr ? "أستاذ دكتور (Full Professor)" : "Full Professor"}</option>
                    <option value="dept_head">{isAr ? "رئيس قسم علمي (HOD)" : "Department Head"}</option>
                    <option value="advisor">{isAr ? "مرشد أكاديمي معتمد" : "Academic Advisor"}</option>
                    <option value="ta">{isAr ? "معيد / مدرس مساعد" : "Teaching Assistant"}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "القسم العلمي" : "Syllabus Department"}</label>
                  <select
                    value={facDept}
                    onChange={(e) => setFacDept(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    {activeCollege.departments?.map((d: string, idx: number) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded w-full transition-colors"
                  >
                    {isAr ? "تثبيت وتسمية العضو 🎓" : "Appoint Academic Staff"}
                  </button>
                </div>
              </div>
            </form>

            {/* FACULTY LIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collegeFaculty
                .filter(f => f.nameAr.includes(facultySearch))
                .map(fac => (
                  <div key={fac.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 text-right">
                    <img
                      src={fac.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"}
                      alt={fac.nameAr}
                      className="w-12 h-12 rounded-full border border-slate-800 object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <strong className="text-xs font-bold text-slate-200 block">{fac.nameAr}</strong>
                      <p className="text-[10px] text-teal-400 font-mono">{fac.role.toUpperCase()} • {fac.id}</p>
                      <p className="text-[10.5px] text-slate-400">{fac.departmentAr || (isAr ? "قسم الكلية العام" : "General Department")}</p>
                      <p className="text-[10px] text-slate-500">{fac.email}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: DEPARTMENTS */}
        {activeTab === "departments" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 text-right">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "الأقسام الأكاديمية واللوائح الدراسية بالكلية" : "Chartered College Departments & Degree Programs"}</h4>
            </div>

            {/* ADD DEPT FORM */}
            <form onSubmit={handleAddDept} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
              <h5 className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1.5">
                <span>{isAr ? "إنشاء قسم علمي جديد ولائحته العلمية" : "Charter New Academic Department & Syllabus"}</span>
                <Plus className="w-4 h-4 text-emerald-400" />
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "اسم القسم العلمي" : "Department Title"}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? "مثال: قسم الأمن السيبراني" : "e.g. Cyber Security"}
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "البرنامج الدراسي المقترح" : "Degree Program (Major)"}</label>
                  <input
                    type="text"
                    placeholder={isAr ? "بكالوريوس هندسة الشبكات" : "B.Sc. Networking & Security"}
                    value={deptProg}
                    onChange={(e) => setDeptProg(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded w-full transition-colors"
                  >
                    {isAr ? "حفظ وتأسيس القسم 🏢" : "Establish Department"}
                  </button>
                </div>
              </div>
            </form>

            {/* CURRENT DEPARTMENTS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCollege.departments?.map((dept: string, idx: number) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-right space-y-3">
                  <div className="flex justify-between items-center flex-row-reverse border-b border-slate-850 pb-2">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded">CODE: {activeColId.toUpperCase()}-D{idx + 1}</span>
                    <strong className="text-xs font-black text-slate-200">{dept}</strong>
                  </div>
                  <div className="text-[11px] text-slate-450 space-y-1">
                    <p>{isAr ? "• رئيس القسم الحالي: أستاذ من الهيئة الأكاديمية" : "• Department Head: Professor appointed"}</p>
                    <p>{isAr ? "• البرامج التابعة: بكالوريوس اللائحة الموحدة" : "• Program: Accredited syllabus degree"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COURSES */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 text-right">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "لوائح ومناهج المواد الدراسية" : "Official College Course Syllabus"}</h4>
            </div>

            {/* ADD COURSE FORM */}
            <form onSubmit={handleAddCourse} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
              <h5 className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1.5">
                <span>{isAr ? "إدراج مقرر دراسي معتمد بكتالوج المناهج" : "Add Course to Academic Catalog"}</span>
                <Plus className="w-4 h-4 text-emerald-400" />
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "كود المادة" : "Course Code"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS302"
                    value={crsCode}
                    onChange={(e) => setCrsCode(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "عنوان المادة" : "Course Title"}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? "معالجة اللغات الطبيعية" : "Natural Language Processing"}
                    value={crsTitle}
                    onChange={(e) => setCrsTitle(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "عدد الساعات المعتمدة" : "Credit Hours"}</label>
                  <select
                    value={crsCredits}
                    onChange={(e) => setCrsCredits(parseInt(e.target.value) || 3)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="6">6 Hours</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "المتطلب السابق" : "Prerequisite"}</label>
                  <input
                    type="text"
                    placeholder="e.g. CS102"
                    value={crsPrereq}
                    onChange={(e) => setCrsPrereq(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded w-full transition-colors"
                  >
                    {isAr ? "إدراج وتفعيل المقرر 📚" : "Catalog Course"}
                  </button>
                </div>
              </div>
            </form>

            {/* SYLLABUS LIST TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-3">{isAr ? "الساعات المعتمدة" : "Credits"}</th>
                    <th className="p-3">{isAr ? "المتطلب السابق" : "Prerequisite"}</th>
                    <th className="p-3">{isAr ? "وصف المنهج" : "Description"}</th>
                    <th className="p-3">{isAr ? "اسم المقرر" : "Course Title"}</th>
                    <th className="p-3">{isAr ? "كود المقرر" : "Course Code"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-right">
                  {collegeCourses.map(crs => (
                    <tr key={crs.code} className="hover:bg-slate-850/40">
                      <td className="p-3 font-mono font-bold text-teal-400">{crs.credits} Hours</td>
                      <td className="p-3 text-slate-300 font-mono">{crs.prerequisites?.join(", ") || "—"}</td>
                      <td className="p-3 text-slate-400 max-w-sm text-right leading-relaxed">{crs.description}</td>
                      <td className="p-3 font-black text-slate-200">{crs.name}</td>
                      <td className="p-3 font-mono text-slate-500">{crs.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SCHEDULES */}
        {activeTab === "schedules" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 text-right">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "جدولة وحجز محاضرات الكلية الأسبوعية" : "Weekly SGU College Lecture Timetables"}</h4>
            </div>

            {/* ADD SCHEDULE FORM */}
            <form onSubmit={handleAddSchedule} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
              <h5 className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1.5">
                <span>{isAr ? "حجز قاعة وتعيين موعد محاضرة" : "Schedule Lecture Slot & Allocate Classroom"}</span>
                <Plus className="w-4 h-4 text-emerald-400" />
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "اليوم" : "Day"}</label>
                  <select
                    value={schedDay}
                    onChange={(e) => setSchedDay(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    {[
                      { ar: "الأحد", en: "Sunday" },
                      { ar: "الاثنين", en: "Monday" },
                      { ar: "الثلاثاء", en: "Tuesday" },
                      { ar: "الأربعاء", en: "Wednesday" },
                      { ar: "الخميس", en: "Thursday" }
                    ].map((d, i) => (
                      <option key={i} value={isAr ? d.ar : d.en}>{isAr ? d.ar : d.en}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "الفترة الزمنية" : "Time Slot"}</label>
                  <select
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    <option value="08:30 - 10:00">08:30 - 10:00</option>
                    <option value="10:15 - 12:15">10:15 - 12:15</option>
                    <option value="12:30 - 14:00">12:30 - 14:00</option>
                    <option value="14:15 - 15:45">14:15 - 15:45</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "المقرر العلمي" : "Course Syllabus"}</label>
                  <select
                    value={schedCourse}
                    onChange={(e) => setSchedCourse(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    <option value="">{isAr ? "اختر مقرر..." : "Select course..."}</option>
                    {collegeCourses.map(crs => (
                      <option key={crs.code} value={crs.code}>{crs.name} ({crs.code})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{isAr ? "المحاضر / الدكتور" : "Instructor"}</label>
                  <select
                    value={schedDoctor}
                    onChange={(e) => setSchedDoctor(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2 w-full focus:outline-none"
                  >
                    <option value="">{isAr ? "اختر دكتور..." : "Select instructor..."}</option>
                    {collegeFaculty.map(f => (
                      <option key={f.id} value={f.nameAr}>{f.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded w-full transition-colors"
                  >
                    {isAr ? "حجز وتأكيد الموعد ⏱️" : "Confirm Lecture Slot"}
                  </button>
                </div>
              </div>
            </form>

            {/* SCHEDULES GRID */}
            <div className="space-y-3">
              {collegeSchedules.map((s, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center text-right flex-row-reverse">
                  <div className="w-24 border-r border-slate-800 pr-3">
                    <span className="text-xs font-black text-emerald-400 block">{s.day}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{s.timeSlot}</span>
                  </div>
                  <div className="flex-1 px-4">
                    <strong className="text-xs font-bold text-slate-200 block">{s.courseName}</strong>
                    <span className="text-[9.5px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded">CODE: {s.courseCode}</span>
                  </div>
                  <div className="text-left text-xs space-y-1 text-slate-450">
                    <p>👨‍🏫 {s.instructor}</p>
                    <p>📍 {s.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: GRADES */}
        {activeTab === "grades" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 text-right">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "كنترول ورصد واعتماد نتائج امتحانات المواد" : "Exam Control & Syllabus Grading Approvals"}</h4>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
              <h5 className="text-xs font-bold text-slate-350">{isAr ? "اعتماد نتائج كنترول الفصل الدراسي الثاني" : "End-of-Semester Certified Grading Desk"}</h5>
              <div className="space-y-3">
                {collegeCourses.map(crs => {
                  const isLocked = gradesLocked[crs.code];
                  return (
                    <div key={crs.code} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex justify-between items-center flex-row-reverse">
                      <div className="text-right">
                        <strong className="text-xs font-bold text-slate-200">{crs.name}</strong>
                        <p className="text-[10px] text-slate-500 font-mono">CODE: {crs.code} • {crs.credits} Hours</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {isLocked ? (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{isAr ? "تم نشر واعتماد الدرجات رسمياً" : "Grades Certified & Live"}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => certifyCourseGrades(crs.code)}
                            className="cursor-pointer bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-lg transition-all"
                          >
                            {isAr ? "اعتماد وإغلاق الكنترول 🔐" : "Certify & Publish Result"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ATTENDANCE */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 text-right">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "سجلات الحضور بيومترية والـ RFID" : "Biometric & RFID Lecture Attendance Checkins"}</h4>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-right">
                  <tr>
                    <th className="p-3">{isAr ? "توقيت الحضور" : "Time"}</th>
                    <th className="p-3">{isAr ? "آلية التحقق" : "Method"}</th>
                    <th className="p-3">{isAr ? "حالة القيد" : "Status"}</th>
                    <th className="p-3">{isAr ? "المادة" : "Course"}</th>
                    <th className="p-3">{isAr ? "اسم الطالب" : "Student Name"}</th>
                    <th className="p-3">{isAr ? "التاريخ" : "Date"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-right">
                  {collegeAttendance.map((a, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/40">
                      <td className="p-3 font-mono text-slate-300">{a.time || "09:05"}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 px-2 py-0.5 rounded">
                          {a.method || "Biometric FaceID"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                          a.status === "present"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40"
                            : "bg-rose-950 text-rose-400 border border-rose-900/40"
                        }`}>
                          {a.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-300">{a.courseCode || "SGU_CORE"}</td>
                      <td className="p-3 font-bold text-slate-200">
                        {collegeStudents[idx % collegeStudents.length]?.nameAr || (isAr ? "طالب مقيد" : "SGU Student")}
                      </td>
                      <td className="p-3 font-mono text-slate-450">{a.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: PETITIONS */}
        {activeTab === "petitions" && (
          <div className="space-y-6 text-right animate-fadeIn">
            <div className="border-b border-slate-850 pb-3 flex justify-between items-center flex-row-reverse">
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                {serviceRequests.filter(r => r.collegeId === activeColId && r.status.toLowerCase().includes("pending")).length} PENDING
              </span>
              <h4 className="text-sm font-black text-slate-100">
                {isAr ? "طلبات الخدمات والالتماسات الطلابية المرفوعة للعمادة" : "Student Services & Petitions Board"}
              </h4>
            </div>

            {/* Petitions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-850 text-[10px]">
                    <tr>
                      <th className="p-3 text-center">{isAr ? "الإجراءات والقرار" : "Actions"}</th>
                      <th className="p-3">{isAr ? "الحالة الحالية" : "Status"}</th>
                      <th className="p-3">{isAr ? "تاريخ التقديم" : "Submission Date"}</th>
                      <th className="p-3">{isAr ? "نوع الطلب والخدمة" : "Petition Type"}</th>
                      <th className="p-3">{isAr ? "اسم الطالب / كود القيد" : "Student Details"}</th>
                      <th className="p-3 text-center">ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    {serviceRequests.filter(r => r.collegeId === activeColId).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                          {isAr ? "لا توجد أي طلبات أو التماسات طلابية مرفوعة لهذه الكلية حالياً." : "No student petitions submitted for this college yet."}
                        </td>
                      </tr>
                    ) : (
                      serviceRequests
                        .filter(r => r.collegeId === activeColId)
                        .map(req => {
                          const isPending = req.status.toLowerCase().includes("pending");
                          const isApproved = req.status.toLowerCase().includes("approved");
                          const isRejected = req.status.toLowerCase().includes("rejected");

                          return (
                            <tr key={req.id} className="hover:bg-slate-850/50 transition-colors">
                              <td className="p-3 flex justify-center gap-2">
                                {isPending ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        const updated = serviceRequests.map(s => s.id === req.id ? { ...s, status: "Approved" } : s);
                                        saveServiceRequests(updated);
                                        addLog(`[الالتماسات الأكاديمية] قام العميد باعتماد وبث الموافقة على طلب الخدمة الرقمية [ID: ${req.id}] للطالب [${req.studentName}].`);
                                        triggerSystemPush(
                                          isAr ? "✅ تمت الموافقة على الالتماس" : "✅ Petition Approved",
                                          isAr 
                                            ? `عزيزي الطالب، قام عميد كليتك بالموافقة على طلبك [${req.type}] رسمياً.`
                                            : `Your petition [${req.type}] has been officially approved by the Dean.`
                                        );
                                      }}
                                      className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded transition-all"
                                    >
                                      {isAr ? "موافقة واعتماد" : "Approve"}
                                    </button>
                                    <button
                                      onClick={() => {
                                        const updated = serviceRequests.map(s => s.id === req.id ? { ...s, status: "Rejected" } : s);
                                        saveServiceRequests(updated);
                                        addLog(`[الالتماسات الأكاديمية] قام العميد برفض طلب الخدمة الرقمية [ID: ${req.id}] للطالب [${req.studentName}].`);
                                        triggerSystemPush(
                                          isAr ? "❌ تم رفض الالتماس" : "❌ Petition Rejected",
                                          isAr 
                                            ? `للأسف، تم رفض طلبك [${req.type}] من قبل عميد الكلية لعدم استيفاء الشروط.`
                                            : `Your petition [${req.type}] has been rejected by the Dean.`
                                        );
                                      }}
                                      className="cursor-pointer bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold text-[10px] px-2.5 py-1 rounded transition-all"
                                    >
                                      {isAr ? "رفض الطلب" : "Reject"}
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-bold">
                                    {isAr ? "مغلق ومحفوظ" : "Archived"}
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isApproved 
                                    ? "bg-emerald-500/10 text-emerald-400" 
                                    : isRejected 
                                    ? "bg-red-500/10 text-red-400" 
                                    : "bg-amber-500/10 text-amber-400"
                                }`}>
                                  {isAr 
                                    ? (isApproved ? "تمت الموافقة" : isRejected ? "مرفوض" : "قيد المراجعة")
                                    : req.status
                                  }
                                </span>
                              </td>
                              <td className="p-3 font-mono text-slate-450">{req.date}</td>
                              <td className="p-3 font-semibold text-slate-200">{req.type}</td>
                              <td className="p-3">
                                <div className="font-bold text-slate-100">{req.studentName}</div>
                                <div className="text-[10px] font-mono text-slate-500">{req.studentId}</div>
                              </td>
                              <td className="p-3 font-mono text-center text-slate-400">{req.id}</td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 text-right">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "التقارير الأكاديمية والمالية الشاملة للعمادة" : "Deanship Academic & Auditing Reports Center"}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { titleAr: "تقرير جودة الأداء الأكاديمي والـ GPA", titleEn: "Academics & GPA Quality Report", descAr: "كشوف المعدل العام ونسبة تفوق الطلاب بمستودعات الساعات المعتمدة.", descEn: "Comprehensive transcript and student average performance trends.", type: "Academics" },
                { titleAr: "سجلات حضور المعامل والFaceID", titleEn: "Laboratory Attendance Sheets", descAr: "بيان تتبع رصد حضور الطلاب بالFace scanner ونسبة الحرمان.", descEn: "Check-in rosters including automated AI scanning ratios.", type: "Attendance" },
                { titleAr: "كشف الإيرادات والرسوم والمنح", titleEn: "Financial Revenues & Bursaries", descAr: "سجلات المقبوضات وصندوق الرسوم الأكاديمية ونسب المنح الجزئية والكاملة.", descEn: "Tuition collection ledger and deanery scholarship budgets.", type: "Financials" }
              ].map((rep, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-right space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <strong className="text-xs font-black text-slate-200 block">{isAr ? rep.titleAr : rep.titleEn}</strong>
                    <p className="text-[11px] text-slate-450 leading-relaxed">{isAr ? rep.descAr : rep.descEn}</p>
                  </div>
                  <button
                    onClick={() => triggerReportDownload(rep.type)}
                    className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-emerald-400 hover:text-emerald-350 border border-slate-800 hover:border-emerald-500/30 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? "تحميل التقرير الفعلي" : "Export Live CSV Report"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: CONFIG */}
        {activeTab === "config" && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-3 text-right">
              <h4 className="text-sm font-black text-slate-100">{isAr ? "إعدادات الكلية ومعايير الاعتماد" : "Deanship College Configurations Desk"}</h4>
            </div>

            <form onSubmit={handleSaveConfig} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-6 text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block">{isAr ? "معدل GPA المستهدف للكلية" : "Accreditation Target GPA Limit"}</label>
                  <input
                    type="text"
                    required
                    value={targetGpaInput}
                    onChange={(e) => setTargetGpaInput(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2.5 w-full focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-500 block">{isAr ? "معايير الجودة الدولية الموصى بها: 3.20+" : "Recommended international quality limit: 3.20+"}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block">{isAr ? "الكلمة الترحيبية للعميد" : "Dean Welcoming Letter Prefix"}</label>
                  <textarea
                    rows={2}
                    value={deanWelcomingInput}
                    onChange={(e) => setDeanWelcomingInput(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded p-2.5 w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-850">
                <button
                  type="submit"
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-6 py-2 rounded-lg transition-colors"
                >
                  {isAr ? "حفظ الإعدادات والمعايير" : "Save Deanship Settings"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
