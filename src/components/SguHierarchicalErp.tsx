import React, { useState, useMemo } from "react";
import {
  GraduationCap, Building2, Calendar, Users, BookOpen, Award, Activity, Clock,
  ArrowRight, ChevronRight, TrendingUp, BarChart2, FileText, Settings, AlertTriangle,
  CheckCircle2, ClipboardList, Cpu, Fingerprint, MapPin, FlaskConical, QrCode,
  MessageSquare, Vote, Compass, Search, Plus, Trash2, RefreshCw, Play, Send,
  Printer, Download, UserCheck, FileCheck, X, DollarSign, ListFilter, Sliders
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

// ==========================================
// DATA UTILITIES & TYPES Definition
// ==========================================
export interface StudentRecord {
  id: string;
  nameAr: string;
  nameEn: string;
  gpa: number;
  cgpa: number;
  status: "Active" | "Probation" | "Graduated";
  attendanceRate: number; // %
  absences: number;
  warnings: number;
  midtermGrade: number; // max 30
  practicalGrade: number; // max 25
  finalGrade: number; // max 45
  totalGrade: number; // max 100
  financialStatus: {
    totalPaid: number;
    totalAmount: number;
    status: "paid" | "partial" | "debt";
  };
  phone: string;
  email: string;
  studyPlan: string[];
  registeredCourses: string[];
}

export interface SectionRecord {
  id: string;
  name: string;
  students: StudentRecord[];
}

export interface AcademicYearRecord {
  id: string; // "y1", "y2", "y3", "y4"
  nameAr: string;
  nameEn: string;
  sections: SectionRecord[];
}

export interface DepartmentRecord {
  code: string;
  nameAr: string;
  nameEn: string;
}

export interface AcademicProgramRecord {
  code: string;
  nameAr: string;
  nameEn: string;
  duration: string;
}

export interface CollegeRecord {
  id: string;
  nameAr: string;
  nameEn: string;
  themeColor: string; // Tailwind color class
  accentBg: string;
  accentText: string;
  departments: DepartmentRecord[];
  programs: AcademicProgramRecord[];
  years: AcademicYearRecord[];
}

// Global Colleges configuration matching the 7 requested Colleges
const COLLEGES_CATALOG: Omit<CollegeRecord, "years">[] = [
  {
    id: "fcis",
    nameAr: "كلية الحاسبات والمعلومات والذكاء الاصطناعي",
    nameEn: "Faculty of Computer Science and Artificial Intelligence",
    themeColor: "emerald",
    accentBg: "bg-emerald-500/10 border-emerald-500/30",
    accentText: "text-emerald-400",
    departments: [
      { code: "CS", nameAr: "علوم الحاسب", nameEn: "Computer Science" },
      { code: "AI", nameAr: "الذكاء الاصطناعي", nameEn: "Artificial Intelligence" },
      { code: "IS", nameAr: "نظم المعلومات", nameEn: "Information Systems" },
      { code: "SE", nameAr: "هندسة البرمجيات", nameEn: "Software Engineering" }
    ],
    programs: [
      { code: "CS-AI", nameAr: "برنامج علوم الحاسب والذكاء الاصطناعي", nameEn: "Computer Science & AI", duration: "4 سنوات" },
      { code: "BI", nameAr: "برنامج المعلوماتية الحيوية", nameEn: "Bioinformatics", duration: "4 سنوات" },
      { code: "SWE", nameAr: "برنامج هندسة البرمجيات المبتكرة", nameEn: "Software Engineering", duration: "4 سنوات" }
    ]
  },
  {
    id: "med",
    nameAr: "كلية الطب البشري",
    nameEn: "Faculty of Human Medicine",
    themeColor: "rose",
    accentBg: "bg-rose-500/10 border-rose-500/30",
    accentText: "text-rose-400",
    departments: [
      { code: "ANA", nameAr: "التشريح وعلم الأجنة", nameEn: "Human Anatomy & Embryology" },
      { code: "PHY", nameAr: "علم وظائف الأعضاء", nameEn: "Physiology" },
      { code: "SURG", nameAr: "الجراحة العامة", nameEn: "General Surgery" },
      { code: "PED", nameAr: "طب الأطفال ورعاية الطفولة", nameEn: "Pediatrics" }
    ],
    programs: [
      { code: "MBBCh", nameAr: "برنامج بكالوريوس الطب البشري والجراحة (MBBCh)", nameEn: "Bachelor of Medicine & Surgery", duration: "5 سنوات + سنتين امتياز" }
    ]
  },
  {
    id: "phr",
    nameAr: "كلية الصيدلة",
    nameEn: "Faculty of Pharmacy",
    themeColor: "purple",
    accentBg: "bg-purple-500/10 border-purple-500/30",
    accentText: "text-purple-400",
    departments: [
      { code: "CLIN", nameAr: "الصيدلة الإكلينيكية والسموم", nameEn: "Clinical Pharmacy & Toxicology" },
      { code: "PCEUT", nameAr: "الصيدلانيات والتكنولوجيا الصيدلية", nameEn: "Pharmaceutics" },
      { code: "MCHM", nameAr: "الكيمياء الدوائية والعقاقير", nameEn: "Medicinal Chemistry" }
    ],
    programs: [
      { code: "PharmD", nameAr: "برنامج دكتور صيدلي (PharmD)", nameEn: "Doctor of Pharmacy", duration: "5 سنوات + سنة امتياز" }
    ]
  },
  {
    id: "den",
    nameAr: "كلية طب الأسنان",
    nameEn: "Faculty of Dentistry",
    themeColor: "teal",
    accentBg: "bg-teal-500/10 border-teal-500/30",
    accentText: "text-teal-400",
    departments: [
      { code: "OMFS", nameAr: "جراحة الفم والوجوه والفكين", nameEn: "Oral & Maxillofacial Surgery" },
      { code: "PEDO", nameAr: "تقويم الأسنان وطب أسنان الأطفال", nameEn: "Orthodontics & Pediatric Dentistry" },
      { code: "CONS", nameAr: "علاج الجذور والتحفظي التجميلي", nameEn: "Endodontics & Restorative" }
    ],
    programs: [
      { code: "BDS", nameAr: "بكالوريوس طب وجراحة الفم والأسنان (BDS)", nameEn: "BDS - Bachelor of Dental Surgery", duration: "5 سنوات + سنة امتياز" }
    ]
  },
  {
    id: "pt",
    nameAr: "كلية العلاج الطبيعي",
    nameEn: "Faculty of Physical Therapy",
    themeColor: "amber",
    accentBg: "bg-amber-500/10 border-amber-500/30",
    accentText: "text-amber-400",
    departments: [
      { code: "ORTH", nameAr: "تأهيل العظام والعمود الفقري", nameEn: "Orthopedic Rehab" },
      { code: "NEUR", nameAr: "تأهيل الأعصاب والعماد", nameEn: "Neurological Rehab" },
      { code: "PEDP", nameAr: "تأهيل الأطفال الرياضي", nameEn: "Pediatrics Physical Therapy" }
    ],
    programs: [
      { code: "BScPT", nameAr: "بكالوريوس العلاج الطبيعي والتأهيل الطبي", nameEn: "BSc in Physical Therapy", duration: "5 سنوات" }
    ]
  },
  {
    id: "bus",
    nameAr: "كلية الإدارة وإدارة الأعمال",
    nameEn: "Faculty of Business Administration",
    themeColor: "blue",
    accentBg: "bg-blue-500/10 border-blue-500/30",
    accentText: "text-blue-400",
    departments: [
      { code: "ACC", nameAr: "المحاسبة والمراجعة", nameEn: "Accounting" },
      { code: "FIN", nameAr: "التمويل والاستثمار والمصارف", nameEn: "Finance & Investment" },
      { code: "BIS", nameAr: "نظم معلومات الأعمال الرقمية", nameEn: "Business Info Systems" },
      { code: "MKT", nameAr: "إدارة الأعمال والتسويق الدولي", nameEn: "Management & International Marketing" }
    ],
    programs: [
      { code: "BBA", nameAr: "برنامج التكنولوجيا المالية وإدارة الأعمال", nameEn: "FinTech & Business Admin", duration: "4 سنوات" }
    ]
  },
  {
    id: "nur",
    nameAr: "كلية التمريض",
    nameEn: "Faculty of Nursing",
    themeColor: "sky",
    accentBg: "bg-sky-500/10 border-sky-500/30",
    accentText: "text-sky-400",
    departments: [
      { code: "NURS", nameAr: "التمريض الجراحي والباطني", nameEn: "Surgical & Medical Nursing" },
      { code: "NURC", nameAr: "تمريض الرعاية الحرجة والطوارئ", nameEn: "Critical Care Nursing" }
    ],
    programs: [
      { code: "BScN", nameAr: "برنامج بكالوريوس علوم التمريض", nameEn: "BSc in Nursing", duration: "4 سنوات + سنة امتياز" }
    ]
  }
];

// Seed generator for random Arabic Student names
const FIRST_NAMES = ["يوسف", "أحمد", "عمر", "محمد", "عبدالرحمن", "كريم", "خالد", "علي", "محمود", "ليلى", "سارة", "نور", "فاطمة", "مريم", "رنا", "سلمى", "آية", "ندى", "أمجد", "مصطفى"];
const LAST_NAMES = ["الشيخ", "المهدي", "عبدالعزيز", "الكردي", "الهاشمي", "سليم", "زهران", "الشناوي", "عبدالهادي", "جاد", "بكر", "نصر", "القاضي", "منصور", "شاهين", "عامر", "سعد", "الغنيمي"];

export function generateSeedStudents(collegeId: string, yearId: string, sectionName: string): StudentRecord[] {
  const students: StudentRecord[] = [];
  const levelText = yearId === "y1" ? "First Year" : yearId === "y2" ? "Second Year" : yearId === "y3" ? "Third Year" : "Fourth Year";
  
  for (let i = 1; i <= 15; i++) {
    const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const idNum = String(Math.floor(Math.random() * 9000) + 1000);
    const id = `2026SGU-${collegeId.toUpperCase()}-${yearId.toUpperCase()}-${sectionName}-${idNum}`;
    
    // Grades distribution
    const midterm = Math.floor(Math.random() * 11) + 20; // 20-30
    const practical = Math.floor(Math.random() * 8) + 18; // 18-25
    const finalEx = Math.floor(Math.random() * 15) + 30; // 30-45
    const total = midterm + practical + finalEx;
    
    // GPA derivation
    let gpa = 2.0;
    if (total >= 90) gpa = 3.8 + Math.random() * 0.2;
    else if (total >= 80) gpa = 3.3 + Math.random() * 0.5;
    else if (total >= 70) gpa = 2.8 + Math.random() * 0.5;
    else if (total >= 60) gpa = 2.0 + Math.random() * 0.8;
    else gpa = 1.0 + Math.random() * 1.0;
    
    const cgpa = Math.min(4.0, Number((gpa - 0.1 + Math.random() * 0.2).toFixed(2)));
    const abs = Math.floor(Math.random() * 6);
    const attRate = Math.max(70, 100 - Math.floor((abs / 30) * 100));

    students.push({
      id,
      nameAr: `${fName} ${lName} الثاني`,
      nameEn: `${fName} ${lName} Junior`,
      gpa: Number(gpa.toFixed(2)),
      cgpa,
      status: gpa < 2.0 ? "Probation" : "Active",
      attendanceRate: attRate,
      absences: abs,
      warnings: abs > 4 ? 1 : 0,
      midtermGrade: midterm,
      practicalGrade: practical,
      finalGrade: finalEx,
      totalGrade: total,
      financialStatus: {
        totalAmount: 18000,
        totalPaid: Math.random() > 0.5 ? 18000 : Math.random() > 0.6 ? 9000 : 0,
        status: "partial" // will compute dynamically
      },
      phone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${id.toLowerCase()}@sgu.edu.eg`,
      studyPlan: ["هياكل البيانات والبرمجة الأكاديمية", "مناهج البحث العلمي وتطبيقاته", "الذكاء الاصطناعي والحاسوب الفلكي"],
      registeredCourses: ["Course A101", "Course B202", "Course C303"]
    });
  }
  
  // Sort by totalGrade initially to make rankings look wonderful
  return students.sort((a, b) => b.totalGrade - a.totalGrade);
}

// Generate complete SGU university structure with academic years, sections and students
export function constructUniversityHierarchy(): CollegeRecord[] {
  const yearBlueprints = [
    { id: "y1", nameAr: "الفرقة الدراسية الأولى", nameEn: "First Year" },
    { id: "y2", nameAr: "الفرقة الدراسية الثانية", nameEn: "Second Year" },
    { id: "y3", nameAr: "الفرقة الدراسية الثالثة", nameEn: "Third Year" },
    { id: "y4", nameAr: "الفرقة الدراسية الرابعة", nameEn: "Fourth Year" }
  ];

  return COLLEGES_CATALOG.map((col) => {
    const years: AcademicYearRecord[] = yearBlueprints.map((yr) => {
      const sections: SectionRecord[] = ["A", "B", "C"].map((sec) => {
        return {
          id: `${col.id}-${yr.id}-${sec}`,
          name: `الشعبة (${sec})`,
          students: generateSeedStudents(col.id, yr.id, sec)
        };
      });
      return {
        id: yr.id,
        nameAr: yr.nameAr,
        nameEn: yr.nameEn,
        sections
      };
    });

    return {
      ...col,
      years
    };
  });
}

export default function SguHierarchicalErp() {
  // Global ERP Database State
  const [universityData, setUniversityData] = useState<CollegeRecord[]>(() => constructUniversityHierarchy());

  // Deep Navigation breadcrumb levels: "university" | "college" | "year" | "section" | "student"
  const [navLevel, setNavLevel] = useState<"university" | "college" | "year" | "section" | "student">("university");
  
  // Selection ids
  const [selectedCollege, setSelectedCollege] = useState<CollegeRecord | null>(null);
  const [selectedYear, setSelectedYear] = useState<AcademicYearRecord | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionRecord | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Active Sub-System inside selected Section (1 to 10)
  const [activeSubTab, setActiveSubTab] = useState<number>(1);

  // Search filter and temporary states inside the 10 systems
  const [studentSearchInput, setStudentSearchInput] = useState("");
  const [attRecordDate, setAttRecordDate] = useState("2026-06-21");
  const [appealNotes, setAppealNotes] = useState("");
  const [appealCourseCode, setAppealCourseCode] = useState("CS-202");
  const [appealList, setAppealList] = useState([
    { id: "APP-901", stId: "2026SGU-ST-991", name: "محمود عبدالعزيز", course: "الذكاء الاصطناعي", status: "تحت المراجعة والكنترول", type: "إعادة تصحيح الورقة" },
    { id: "APP-902", stId: "2026SGU-ST-712", name: "ليلى شاهين", course: "ميكانيكا السيارات", status: "مقبول - تعديل الدرجة +3", type: "رصد درجات العملي" }
  ]);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState("الآن");

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTimestamp(new Date().toLocaleTimeString("ar-EG"));
    }, 1200);
  };

  // ===================================
  // RECHARTS DERIVED ANALYTICS (GLOBAL & SPECIFIC)
  // ===================================
  // Collated College Success Rates
  const collegeKpiChartData = useMemo(() => {
    return universityData.map((col) => {
      // Calculate overall average GPA and attendance for each college
      let totalGpa = 0;
      let totalAtt = 0;
      let count = 0;
      col.years.forEach((yr) => {
        yr.sections.forEach((sec) => {
          sec.students.forEach((st) => {
            totalGpa += st.gpa;
            totalAtt += st.attendanceRate;
            count++;
          });
        });
      });
      const avgGpa = Number((totalGpa / (count || 1)).toFixed(2));
      const avgAtt = Number((totalAtt / (count || 1)).toFixed(2));
      return {
        name: col.id.toUpperCase(),
        fullName: col.nameAr,
        gpa: avgGpa,
        attendance: avgAtt,
        studentsCount: count
      };
    });
  }, [universityData]);

  // Department enrollment chart (College contextual)
  const departmentEnrollmentData = useMemo(() => {
    if (!selectedCollege) return [];
    return selectedCollege.departments.map((dept, i) => {
      // simulate random enrollment for depth
      return {
        name: dept.nameAr,
        code: dept.code,
        students: 210 + (i * 45)
      };
    });
  }, [selectedCollege]);

  // Section Attendance and grades spread
  const sectionGradesDistribution = useMemo(() => {
    if (!selectedSection) return [];
    const stats = { excellent: 0, vgood: 0, good: 0, pass: 0, fail: 0 };
    selectedSection.students.forEach((st) => {
      if (st.gpa >= 3.6) stats.excellent++;
      else if (st.gpa >= 3.0) stats.vgood++;
      else if (st.gpa >= 2.4) stats.good++;
      else if (st.gpa >= 2.0) stats.pass++;
      else stats.fail++;
    });
    return [
      { name: "امتياز (A)", value: stats.excellent, color: "#10b981" },
      { name: "جيد جداً (B)", value: stats.vgood, color: "#06b6d4" },
      { name: "جيد (C)", value: stats.good, color: "#f59e0b" },
      { name: "مقبول (D)", value: stats.pass, color: "#a855f7" },
      { name: "تعثر أكاديمي (F)", value: stats.fail, color: "#ef4444" }
    ];
  }, [selectedSection]);

  // Top overall students in the entire university (Leaderboards)
  const topUniversityStudents = useMemo(() => {
    const list: { name: string; college: string; gpa: number; id: string }[] = [];
    universityData.forEach((col) => {
      col.years.forEach((yr) => {
        yr.sections.forEach((sec) => {
          sec.students.forEach((st) => {
            list.push({
              name: st.nameAr,
              college: col.nameAr,
              gpa: st.gpa,
              id: st.id
            });
          });
        });
      });
    });
    return list.sort((a, b) => b.gpa - a.gpa).slice(0, 5);
  }, [universityData]);

  // Helper selectors to easily drill down
  const enterCollege = (col: CollegeRecord) => {
    const freshCol = universityData.find((c) => c.id === col.id) || col;
    setSelectedCollege(freshCol);
    setNavLevel("college");
  };

  const enterYear = (yr: AcademicYearRecord) => {
    setSelectedYear(yr);
    setNavLevel("year");
  };

  const enterSection = (sec: SectionRecord) => {
    setSelectedSection(sec);
    setNavLevel("section");
    setActiveSubTab(1); // default to attendance
  };

  const enterStudent = (st: StudentRecord) => {
    setSelectedStudent(st);
    setNavLevel("student");
  };

  const navigateBackTo = (target: "university" | "college" | "year" | "section") => {
    if (target === "university") {
      setSelectedCollege(null);
      setSelectedYear(null);
      setSelectedSection(null);
      setSelectedStudent(null);
      setNavLevel("university");
    } else if (target === "college") {
      setSelectedYear(null);
      setSelectedSection(null);
      setSelectedStudent(null);
      setNavLevel("college");
    } else if (target === "year") {
      setSelectedSection(null);
      setSelectedStudent(null);
      setNavLevel("year");
    } else if (target === "section") {
      setSelectedStudent(null);
      setNavLevel("section");
    }
  };

  // Mutator functions for interactive live values
  // Toggle Student Attendance for active record
  const toggleAttendanceStatus = (stId: string) => {
    if (!selectedSection) return;
    setUniversityData((prevData) => {
      return prevData.map((col) => {
        if (col.id !== selectedCollege?.id) return col;
        return {
          ...col,
          years: col.years.map((yr) => {
            if (yr.id !== selectedYear?.id) return yr;
            return {
              ...yr,
              sections: yr.sections.map((sec) => {
                if (sec.id !== selectedSection.id) return sec;
                return {
                  ...sec,
                  students: sec.students.map((st) => {
                    if (st.id !== stId) return st;
                    const isNowAbsent = st.attendanceRate > 95;
                    const newAbs = isNowAbsent ? st.absences + 1 : Math.max(0, st.absences - 1);
                    return {
                      ...st,
                      absences: newAbs,
                      attendanceRate: isNowAbsent ? 85 : 100,
                      warnings: newAbs > 4 ? 1 : 0
                    };
                  })
                };
              })
            };
          })
        };
      });
    });

    // Update active view selector as well
    setSelectedSection((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        students: prev.students.map((st) => {
          if (st.id !== stId) return st;
          const isNowAbsent = st.attendanceRate > 95;
          const newAbs = isNowAbsent ? st.absences + 1 : Math.max(0, st.absences - 1);
          return {
            ...st,
            absences: newAbs,
            attendanceRate: isNowAbsent ? 85 : 100,
            warnings: newAbs > 4 ? 1 : 0
          };
        })
      };
    });
  };

  // Modify Grades in realtime
  const saveStudentGrades = (stId: string, midterm: number, practical: number, finalEx: number) => {
    const total = Number(midterm) + Number(practical) + Number(finalEx);
    let gpa = 2.0;
    if (total >= 90) gpa = 4.0;
    else if (total >= 80) gpa = 3.4;
    else if (total >= 70) gpa = 2.8;
    else if (total >= 60) gpa = 2.0;
    else gpa = 1.0;

    setUniversityData((prevData) => {
      return prevData.map((col) => {
        if (col.id !== selectedCollege?.id) return col;
        return {
          ...col,
          years: col.years.map((yr) => {
            if (yr.id !== selectedYear?.id) return yr;
            return {
              ...yr,
              sections: yr.sections.map((sec) => {
                if (sec.id !== selectedSection?.id) return sec;
                return {
                  ...sec,
                  students: sec.students.map((st) => {
                    if (st.id !== stId) return st;
                    return {
                      ...st,
                      midtermGrade: Number(midterm),
                      practicalGrade: Number(practical),
                      finalGrade: Number(finalEx),
                      totalGrade: total,
                      gpa: Number(gpa.toFixed(2))
                    };
                  })
                };
              })
            };
          })
        };
      });
    });

    // Sync current active references
    if (selectedSection) {
      setSelectedSection((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          students: prev.students.map((st) => {
            if (st.id !== stId) return st;
            return {
              ...st,
              midtermGrade: Number(midterm),
              practicalGrade: Number(practical),
              finalGrade: Number(finalEx),
              totalGrade: total,
              gpa: Number(gpa.toFixed(2))
            };
          })
        };
      });
    }
  };

  // Submit appeals
  const handleAddAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const newAppeal = {
      id: `APP-${Math.floor(100 + Math.random() * 900)}`,
      stId: selectedStudent.id,
      name: selectedStudent.nameAr,
      course: appealCourseCode,
      status: "تم استلام الطلب وبانتظار جلسة الكنترول",
      type: appealNotes || "مراجعة ورقة الامتحان والدرجة المرصودة"
    };
    setAppealList([newAppeal, ...appealList]);
    setAppealNotes("");
    alert("تم قيد التماس الطالب بنجاح وإرسال الرمز للبروتوكول الأمني للطباعة!");
  };

  // Filtered student search list in section
  const sectionSearchedStudents = useMemo(() => {
    if (!selectedSection) return [];
    return selectedSection.students.filter((st) => {
      const targetQuery = studentSearchInput.toLowerCase();
      return (
        st.nameAr.toLowerCase().includes(targetQuery) ||
        st.id.toLowerCase().includes(targetQuery)
      );
    });
  }, [selectedSection, studentSearchInput]);

  return (
    <div id="SguUniversityHierarchicalErp" className="space-y-6 text-slate-100 font-sans text-right" dir="rtl">
      
      {/* SECTION 1: HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950/20 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="z-10 text-right">
          <div className="flex items-center gap-2 mb-2 justify-start flex-row-reverse">
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Database Active
            </span>
            <span className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-md text-slate-400 font-semibold">
              SGU-ERP Enterprise Suite v10.2
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2 mb-2">
            <Building2 className="w-6 h-6 text-emerald-400 shrink-0" />
            نظام الميكنة الشامل والهرم الأكاديمي الموحد لجامعة SGU
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            محرك التصفح والتحكم المتكامل لـ <span className="text-emerald-400 font-bold">7 كليات معتمدة</span> بدءاً من لوحة الجامعة العليا، صعوداً للفرق والمجموعات الدراسية، والوصول لأعمق تفاصيل كابلات ملفات الطلاب اليومية والمالية.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10 w-full md:w-auto justify-end">
          <span className="text-[10.5px] font-mono text-slate-500 hidden sm:block">
            آخر تحديث مركز المزامنة: {syncTimestamp}
          </span>
          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "جاري المطابقة..." : "تحديث قواعد البيانات الفوري"}
          </button>
        </div>
      </div>

      {/* SECTION 2: BREADCRUMBS NAVIGATION DECK */}
      <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex flex-wrap items-center gap-2.5 shadow-md">
        <button
          onClick={() => navigateBackTo("university")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            navLevel === "university" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:text-slate-100"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          مقر الجامعة الرئيسي (الـ 7 كليات)
        </button>

        {selectedCollege && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => navigateBackTo("college")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                navLevel === "college" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:text-slate-100"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {selectedCollege.nameAr}
            </button>
          </>
        )}

        {selectedYear && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => navigateBackTo("year")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                navLevel === "year" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:text-slate-100"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {selectedYear.nameAr}
            </button>
          </>
        )}

        {selectedSection && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => navigateBackTo("section")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                navLevel === "section" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:text-slate-100"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {selectedSection.name}
            </button>
          </>
        )}

        {selectedStudent && navLevel === "student" && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="px-3 py-1.5 rounded-lg text-xs font-black bg-slate-900 border border-slate-800 text-teal-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              {selectedStudent.nameAr} ({selectedStudent.id})
            </span>
          </>
        )}
      </div>

      {/* SECTION 3: LEVEL RENDERINGS */}
      
      {/* -------------------------------------
          LEVEL 1: UNIVERSITY WIDE OVERVIEW
          ------------------------------------- */}
      {navLevel === "university" && (
        <div className="space-y-6">
          {/* Main Key Stats Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">الكليات المعتمدة</span>
              <span className="text-xl font-bold font-mono text-emerald-400">7</span>
              <p className="text-[10px] text-slate-500 mt-0.5">مكتملة الهيكل الإداري والطلابي</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">الطلاب المسجلين بالـ ERP</span>
              <span className="text-xl font-bold font-mono text-blue-400">1,260</span>
              <p className="text-[10px] text-slate-500 mt-0.5">في جميع الشعب والفرق السريرية</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">معدل الحضور الجامعي العام</span>
              <span className="text-xl font-bold font-mono text-pink-400">92.4%</span>
              <p className="text-[10px] text-slate-500 mt-0.5">متوسط المجموعات الـ 84</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">نسبة النجاح المتوقعة</span>
              <span className="text-xl font-bold font-mono text-amber-500">89.7%</span>
              <p className="text-[10px] text-slate-500 mt-0.5">لائحة الكنترول المركزي لـ 2026/2027</p>
            </div>
          </div>

          {/* Core Analytics: Chart and Top Leaderboards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-1.5 flex-row-reverse text-right">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                توزيع كفاءة الحضور ومتوسط الـ GPA التراكمي للكليات السبع
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collegeKpiChartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }} />
                    <Legend />
                    <Bar dataKey="studentsCount" name="عدد الطلاب (عشرات)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attendance" name="متوسط الحضور (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 text-right space-y-4">
              <div>
                <h4 className="text-xs font-black text-slate-300 mb-1">👑 كشف أوائل الجامعة (متصدري الـ GPA)</h4>
                <p className="text-[10.5px] text-slate-500">الترتيب الشامل لقيد أوائل الكليات السبعة الكبرى لعام 2026</p>
              </div>
              <div className="space-y-2.5">
                {topUniversityStudents.map((st, i) => (
                  <div key={st.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                    <div className="text-right">
                      <span className="font-bold text-slate-200 block">{st.name}</span>
                      <span className="text-[10px] text-slate-500">{st.college}</span>
                    </div>
                    <span className="font-mono font-bold bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded">
                      GPA {st.gpa}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colleges Selection Menu Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 flex-row-reverse">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 flex-row-reverse">
                <Building2 className="w-4 h-4 text-emerald-400" />
                اختر الكلية لاستكشاف الهيكل الداخلي
              </h3>
              <p className="text-xs text-slate-500">تصفح الفروع وأقسام ولجان التدريس والفرق الأربعة لكل كلية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {universityData.map((col) => {
                const totalStudents = col.years.reduce((accY, y) => accY + y.sections.reduce((accS, s) => accS + s.students.length, 0), 0);
                const avgGpa = Number((col.years.reduce((accY, y) => accY + y.sections.reduce((accS, s) => accS + s.students.reduce((accSt, st) => accSt + st.gpa, 0), 0), 0) / totalStudents).toFixed(2));
                return (
                  <button
                    key={col.id}
                    onClick={() => enterCollege(col)}
                    className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl text-right transition-all transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between h-44 group"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{col.id}</span>
                        <span className={`p-1.5 rounded-lg bg-emerald-900/10 text-emerald-400`}>
                          <GraduationCap className="w-4 h-4" />
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition">{col.nameAr}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">{col.nameEn}</p>
                    </div>

                    <div className="border-t border-slate-950 pt-2 mt-3 text-[10.5px] grid grid-cols-2 text-right">
                      <div>
                        <span className="text-slate-500 block">إجمالي المقيدين</span>
                        <span className="font-bold text-slate-300 font-mono">{totalStudents} طالب</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">معدل الـ GPA</span>
                        <span className="font-bold text-emerald-400 font-mono">{avgGpa}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------
          LEVEL 2: COLLEGE DASHBOARD VIEW
          ------------------------------------- */}
      {navLevel === "college" && selectedCollege && (
        <div className="space-y-6 animate-fade-in">
          {/* College Info Header Profile */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
            <div>
              <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900/50 px-2.5 py-1 rounded font-bold uppercase tracking-wider mb-2 inline-block">
                كلية جامعية معتمدة بالكامل
              </span>
              <h2 className="text-lg font-extrabold text-slate-100">{selectedCollege.nameAr}</h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">{selectedCollege.nameEn}</p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => navigateBackTo("university")}
                className="cursor-pointer bg-slate-950/80 hover:bg-slate-850 border border-slate-850 text-slate-300 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                العودة للرئيسية
              </button>
            </div>
          </div>

          {/* Departments & Programs Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-350 border-b border-slate-800 pb-2 flex items-center justify-between flex-row-reverse">
                <span>توزيع وتوصيف الأقسام العلمية للكلية</span>
                <span className="text-[9.5px] bg-slate-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  {selectedCollege.departments.length} أقسام
                </span>
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {selectedCollege.departments.map((dept) => (
                  <div key={dept.code} className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-right flex justify-between items-center text-xs">
                    <span className="font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-bold">
                      {dept.code}
                    </span>
                    <div>
                      <span className="font-black text-slate-205 block">{dept.nameAr}</span>
                      <span className="text-[10px] text-slate-500">{dept.nameEn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 font-sans text-right">
              <h3 className="text-xs font-bold text-slate-350 border-b border-slate-800 pb-2">📂 البرامج الأكاديمية ونظام اللائحة (Syllabus)</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {selectedCollege.programs.map((prog) => (
                  <div key={prog.code} className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-[5px] text-[10px] font-bold">
                      مدة القيد: {prog.duration}
                    </span>
                    <div>
                      <strong className="text-slate-200 block text-[11px]">{prog.nameAr}</strong>
                      <span className="text-[10px] text-slate-500 font-mono lowercase">{prog.nameEn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 text-right space-y-3">
              <h4 className="text-xs font-black text-slate-300">📊 تحليل وتوزيع GPA الكلية الحالي</h4>
              <p className="text-[10.5px] text-slate-500">رصد لجان الامتحانات لمستوى التحصيل الفعلي الحالي</p>
              
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "GPA > 3.0", value: 65, color: "#10b981" },
                        { name: "GPA 2.0-3.0", value: 45, color: "#06b6d4" },
                        { name: "GPA < 2.0", value: 12, color: "#ef4444" }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#06b6d4" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[9.5px]">
                <span className="text-emerald-400">ممتاز (65%)</span>
                <span className="text-cyan-400">مستوفى (45)</span>
                <span className="text-rose-500">إنذار (12)</span>
              </div>
            </div>
          </div>

          {/* Academic Years Selector (Level 3 transition) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 flex-row-reverse pb-2 border-b border-slate-800">
              <Calendar className="w-4 h-4 text-emerald-400" />
              الفرق الدراسية المقررة بالبرامج
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedCollege.years.map((blueprint) => {
                const yrTotalStudents = blueprint.sections.reduce((ac, s) => ac + s.students.length, 0);
                const yrAvgGpa = Number((blueprint.sections.reduce((ac, s) => ac + s.students.reduce((acst, st) => acst + st.gpa, 0), 0) / yrTotalStudents).toFixed(2));
                return (
                  <button
                    key={blueprint.id}
                    onClick={() => enterYear(blueprint)}
                    className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl text-right transition-all transform hover:-translate-y-1 block space-y-3"
                  >
                    <div className="flex justify-between items-center flex-row-reverse">
                      <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400">
                        <Calendar className="w-4 h-4" />
                      </span>
                      <strong className="text-xs font-black text-slate-200">{blueprint.nameAr}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-950 pt-2.5">
                      <div>
                        <span>عدد الشُعب</span>
                        <span className="block font-bold text-slate-250 mt-0.5">{blueprint.sections.length} مجموعات</span>
                      </div>
                      <div>
                        <span>متوسط التحصيل</span>
                        <span className="block font-bold mt-0.5 text-emerald-400">GPA {yrAvgGpa}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------
          LEVEL 3: ACADEMIC YEAR VIEW
          ------------------------------------- */}
      {navLevel === "year" && selectedYear && selectedCollege && (
        <div className="space-y-6 animate-fade-in">
          {/* Breadcrumb Info Deck */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
            <div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider mb-2 inline-block">
                {selectedCollege.nameAr}
              </span>
              <h2 className="text-base font-extrabold text-slate-100">
                {selectedYear.nameAr} — الـ SGU-SIS Portal
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedYear.nameEn}</p>
            </div>

            <div className="flex gap-2 justify-end w-full md:w-auto">
              <button
                onClick={() => navigateBackTo("college")}
                className="cursor-pointer bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                الكلية
              </button>
            </div>
          </div>

          {/* Statistics, Attendance, Rankings at year level */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">📈 إحصائيات ومنحنيات نجاح مجموعات الفرقة</h3>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">الحضور التراكمي للفرقة</span>
                  <strong className="text-sky-400 text-sm font-mono">94.3%</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">الحالات المهددة بالفصل</span>
                  <strong className="text-amber-500 text-sm font-mono">1 معاقبة</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">معدل التحقق المقارن</span>
                  <strong className="text-emerald-400 text-sm font-mono">99.2%</strong>
                </div>
              </div>

              {/* Attendance Bar comparing sections */}
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedYear.sections.map(s => ({ name: s.name, count: s.students.length, gpa: Number((s.students.reduce((ac, st) => ac + st.gpa, 0) / s.students.length).toFixed(2)) }))}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="gpa" name="متوسط التحصيل GPA" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div>
                <h4 className="text-xs font-black text-slate-300">🏅 كشف أوائل هذه الفرقة الدراسية</h4>
                <p className="text-[10px] text-slate-500">متصدري الأقراص وفق النتائج المنشورة للائحة</p>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedYear.sections.flatMap(s => s.students)
                  .sort((a,b) => b.gpa - a.gpa)
                  .slice(0, 4)
                  .map((st, i) => (
                    <div key={st.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                      <span className="font-mono text-emerald-400 font-bold">GPA {st.gpa}</span>
                      <div className="text-right">
                        <strong className="text-slate-100 block">{st.nameAr}</strong>
                        <span className="text-[9.5px] text-slate-500">كود: {st.id.split("-").pop()}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Sections List Selector (Level 4 transition) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">الشُعب والمجموعات الدراسية (Sections)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedYear.sections.map((sec) => {
                const totalInSec = sec.students.length;
                const secAvgAtt = Number((sec.students.reduce((ac, st) => ac + st.attendanceRate, 0) / totalInSec).toFixed(1));
                return (
                  <button
                    key={sec.id}
                    onClick={() => enterSection(sec)}
                    className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl text-right transition-all text-xs space-y-3 block"
                  >
                    <div className="flex justify-between items-center">
                      <span className="bg-slate-950 px-2 py-0.5 rounded font-mono text-slate-400 text-[10px]">
                        ID: {sec.id.toUpperCase()}
                      </span>
                      <strong className="text-slate-100 font-bold block">{sec.name}</strong>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-950 pt-2">
                      <span>إجمالي المقيدين: <strong className="text-slate-200">{totalInSec} طالب</strong></span>
                      <span>نسبة الحضور: <strong className="text-emerald-400">{secAvgAtt}%</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------
          LEVEL 4: THE 10 DEDICATED SMART SYSTEMS
          ------------------------------------- */}
      {navLevel === "section" && selectedSection && selectedYear && selectedCollege && (
        <div className="space-y-6 animate-fade-in text-right">
          
          {/* Main Context Card */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-right">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 justify-start flex-row-reverse mb-1.5">
                <span className="text-[9.5px] bg-slate-950 text-emerald-400 border border-slate-850 px-2 py-0.5 rounded font-bold">{selectedCollege.nameAr}</span>
                <span className="text-[9.5px] bg-slate-950 text-indigo-400 border border-slate-850 px-2 py-0.5 rounded font-bold">{selectedYear.nameAr}</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-100">
                منظومة عمل {selectedSection.name}
              </h2>
              <p className="text-[10px] text-slate-500 leading-normal">
                استعمل اللوحة الفرعية بالأسفل للمشاهدة الفورية لـ 10 مستويات محاكاة تامة لكافة الأنظمة الذكية بالقسم.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => navigateBackTo("year")}
                className="cursor-pointer bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-350 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                تراجع للفرقة
              </button>
            </div>
          </div>

          {/* Grid Layout containing Tab selection of the 10 Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar with the List of the 10 Smart Systems */}
            <div className="lg:col-span-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-850 space-y-2">
              <span className="text-[9.5px] text-slate-500 block mb-2 font-bold px-1 uppercase tracking-wider">الأنظمة والأبواب العشر الذكية:</span>
              {[
                { id: 1, label: "📅 1. نظام الحضور والغياب" },
                { id: 2, label: "📝 2. نظام رصد الدرجات" },
                { id: 3, label: "📂 3. نظام النتائج الجامعية" },
                { id: 4, label: "👑 4. منصة الأوائل والترتيب" },
                { id: 5, label: "🏫 5. منظومة الامتحانات واللجان" },
                { id: 6, label: "📜 6. بوابة الالتماسات والمراجعة" },
                { id: 7, label: "👥 7. قيد وملفات الطلاب الشهب" },
                { id: 8, label: "📚 8. المحاضرات والمحتوى العلمي" },
                { id: 9, label: "🎓 9. الإرشاد الأكاديمي والخطط" },
                { id: 10, label: "📋 10. بوابة التقارير والكشوف" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id);
                    setSelectedStudent(null); // click out st edit logs
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs text-right transition cursor-pointer flex items-center justify-between font-bold ${
                    activeSubTab === tab.id
                      ? "bg-slate-900 border-r-2 border-emerald-500 text-emerald-400"
                      : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Workplace Content panels supporting each of the 10 Systems */}
            <div className="lg:col-span-9 bg-slate-900 p-5 rounded-2xl border border-slate-800 min-h-[460px]">
              
              {/* SYSTEM 1: ATTENDANCE */}
              {activeSubTab === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center text-right flex-row-reverse">
                    <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded font-mono">Realtime Check-In</span>
                    <h3 className="text-xs font-black text-slate-100">سجل التحقق من الغياب اليومي للشعبة</h3>
                  </div>
                  
                  <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg flex-row-reverse gap-4">
                    <span className="text-slate-400 text-xs text-right leading-relaxed">
                      انقر على مفتاح الغياب لتسجيل الطالب <strong className="text-rose-455">حاضر/غائب</strong> وتعديل المعدل السحابي وموجات التحذير تلقائياً.
                    </span>
                    <input
                      type="date"
                      value={attRecordDate}
                      onChange={(e) => setAttRecordDate(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-mono text-center outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                    {selectedSection.students.map((st) => (
                      <div key={st.id} className="bg-slate-950 p-2.5 border border-slate-855 rounded-xl flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">
                            {st.attendanceRate}% حضور
                          </span>
                          <button
                            onClick={() => toggleAttendanceStatus(st.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              st.attendanceRate > 95
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-900/60"
                                : "bg-rose-955 text-red-400 border border-red-950"
                            }`}
                          >
                            {st.attendanceRate > 95 ? "🟢 حاضر" : "🔴 غائب"}
                          </button>
                        </div>

                        <div className="text-right">
                          <strong className="text-slate-100 block">{st.nameAr}</strong>
                          <span className="text-[9.5px] text-slate-500 font-mono">ID: {st.id.split("-").pop()} | الغيابات: {st.absences}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SYSTEM 2: GRADES */}
              {activeSubTab === 2 && (
                <div className="space-y-4 text-right">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center flex-row-reverse text-right">
                    <span className="text-[10px] bg-purple-950 text-purple-400 px-2 py-0.5 rounded font-mono">Control Sheet</span>
                    <h3 className="text-xs font-black text-slate-100">رصد وحفظ الدرجات التفصيلية للطلاب</h3>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs leading-relaxed text-slate-300">
                    رصد مباشر للدرجات وفق الكشوف المعتمدة (أعمال السنة [30]، العملي والتطبيقات [25]، الامتحان النهائي [45]). المجموع الكلي من [100 درجة].
                  </div>

                  {/* Editable table representation */}
                  <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-900 text-slate-405 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">اسم الطالب</th>
                          <th className="p-2.5 text-center font-mono">أعمال السنة(/30)</th>
                          <th className="p-2.5 text-center font-mono">العملي(/25)</th>
                          <th className="p-2.5 text-center font-mono">النهائي(/45)</th>
                          <th className="p-2.5 text-center font-mono">المجموع (/100)</th>
                          <th className="p-2.5 text-center">التقدير</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {selectedSection.students.map((st) => (
                          <tr key={st.id} className="hover:bg-slate-900/40">
                            <td className="p-2.5 font-bold text-slate-150">
                              {st.nameAr}
                              <span className="text-[9.5px] text-slate-505 block mt-0.5 font-mono">{st.id.split("-").pop()}</span>
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                defaultValue={st.midtermGrade}
                                onBlur={(e) => saveStudentGrades(st.id, e.target.value as any, st.practicalGrade, st.finalGrade)}
                                className="w-12 bg-slate-900 border border-slate-800 rounded p-1 text-center font-mono text-slate-200 outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                defaultValue={st.practicalGrade}
                                onBlur={(e) => saveStudentGrades(st.id, st.midtermGrade, e.target.value as any, st.finalGrade)}
                                className="w-12 bg-slate-900 border border-slate-800 rounded p-1 text-center font-mono text-slate-200 outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                defaultValue={st.finalGrade}
                                onBlur={(e) => saveStudentGrades(st.id, st.midtermGrade, st.practicalGrade, e.target.value as any)}
                                className="w-12 bg-slate-900 border border-slate-800 rounded p-1 text-center font-mono text-slate-200 outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold text-slate-300">
                              {st.totalGrade}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                                st.totalGrade >= 90 ? "bg-emerald-950 text-emerald-400" :
                                st.totalGrade >= 80 ? "bg-cyan-950 text-cyan-400" :
                                st.totalGrade >= 60 ? "bg-amber-950 text-amber-500" :
                                "bg-rose-955 text-red-500"
                              }`}>
                                {st.totalGrade >= 90 ? "A (امتياز)" : st.totalGrade >= 80 ? "B (جيد جداً)" : st.totalGrade >= 60 ? "C (مستوفى)" : "F (راسب)"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SYSTEM 3: RESULTS SUMMARY */}
              {activeSubTab === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center flex-row-reverse text-right">
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-900/60">Official Results Page</span>
                    <h3 className="text-xs font-black text-slate-100">تقرير كشف ومعادلات النتائج الأكاديمية للشعبة</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Visual Pie Chart distribution for grades Spread */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-2">
                      <span className="text-xs font-bold text-slate-400">توزيع التقديرات الحالية للشعبة</span>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={sectionGradesDistribution}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              dataKey="value"
                            >
                              {sectionGradesDistribution.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        {sectionGradesDistribution.map((entry, idx) => (
                          <span key={idx} style={{ color: entry.color }} className="font-bold">
                            {entry.name}: {entry.value}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-3">
                      <div>
                        <strong className="text-xs text-slate-200 block">لائحة الترشيح والوضع الأكاديمي</strong>
                        <p className="text-[10px] text-slate-500">تم تسجيل كشوف الوضع الأكاديمي لشعب الامتحان والـ CGPA العادي</p>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-emerald-400 font-bold">12 طلاب</span>
                          <span>الوضع سليم ونشط</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-amber-500 font-bold">2 طلاب</span>
                          <span>تحت قيد المراقبة (Probation)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-red-500 font-bold">1 طالب</span>
                          <span>معرض لإنذار التحصيل الثاني</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM 4: TOP STUDENTS LEADERBOARD */}
              {activeSubTab === 4 && (
                <div className="space-y-4 leading-relaxed text-right">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center text-right flex-row-reverse">
                    <span className="text-[10px] bg-amber-950 text-amber-500 border border-amber-900 px-2 py-0.5 rounded font-mono font-bold">Honor Roll</span>
                    <h3 className="text-xs font-black text-slate-100">لوحات التميز وترتيب أوائل الدفعة والكليات</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Roll inside Section */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5 text-right">
                      <span className="text-xs font-black text-slate-300 block">🏆 أوائل الشعبة الحالية ({selectedSection.name})</span>
                      <div className="space-y-2">
                        {selectedSection.students.slice(0, 3).map((st, idx) => (
                          <div key={st.id} className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center text-xs">
                            <span className="font-mono font-bold text-amber-400">#{idx + 1} | GPA {st.gpa}</span>
                            <span>{st.nameAr}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Roll inside Year */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5 text-right">
                      <span className="text-xs font-black text-slate-300 block">🎓 أوائل الكلية ({selectedCollege.nameAr})</span>
                      <div className="space-y-2">
                        {selectedYear.sections.flatMap(s => s.students).sort((a,b)=>b.gpa-a.gpa).slice(0, 3).map((st, idx) => (
                          <div key={st.id} className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center text-xs">
                            <span className="font-mono font-bold text-teal-400">#{idx + 1} | GPA {st.gpa}</span>
                            <span>{st.nameAr}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM 5: EXAMINATION */}
              {activeSubTab === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center flex-row-reverse text-right">
                    <span className="text-[10px] bg-teal-950 text-teal-405 border border-teal-900/60 px-2 py-0.5 rounded font-mono">Exam Surveillance</span>
                    <h3 className="text-xs font-black text-slate-100">جدول الامتحانات وتوزيع اللجان والمراقبين</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-right space-y-1">
                      <span className="text-slate-500 text-[10.5px] block font-mono">المراقب المعين</span>
                      <strong className="text-emerald-400 text-xs">أ.د. رأفت عبدالقادر السواح</strong>
                      <p className="text-[9.5px] text-slate-600">عضو هيئة تدريس معتمد</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-right space-y-1">
                      <span className="text-slate-500 text-[10.5px] block font-mono">مقر وتوقيت اللجنة</span>
                      <strong className="text-slate-200 text-xs">القاعة (C1-02) / الساعة 09:00 ص</strong>
                      <p className="text-[9.5px] text-slate-600">الفترة الصباحية الأولى</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-right space-y-1">
                      <span className="text-slate-500 text-[10.5px] block font-mono">حالة رصد الحضور الفعلي باللجنة</span>
                      <strong className="text-cyan-400 text-xs">مكتمل التدقيق وحفظ الكشوف</strong>
                      <p className="text-[9.5px] text-slate-600">بصمة الوجه المزدوجة</p>
                    </div>
                  </div>

                  {/* Mock Scheduled Exams list */}
                  <div className="bg-slate-950 p-4 rounded-xl text-right space-y-3">
                    <span className="text-xs font-bold text-slate-300 block">📅 المواعيد المقررة لبقية امتحانات الترم الحالي</span>
                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center">
                        <span className="text-slate-550">تاريخ: 24 يونيو / القاعة التكنولوجية مدرج 12</span>
                        <strong>1. مقرر الذكاء الاصطناعي وهندسة اللغات (AI102)</strong>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center">
                        <span className="text-slate-550">تاريخ: 26 يونيو / القاعات السريرية</span>
                        <strong>2. مقرر الكيمياء الحيوية الإكلينيكية وتفاعلات الدواجن</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM 6: APPEALS OR RE-CORRECTION */}
              {activeSubTab === 6 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center text-right flex-row-reverse">
                    <span className="text-[10px] bg-rose-955 text-rose-400 px-2 py-0.5 rounded font-mono font-bold">Appeals System</span>
                    <h3 className="text-xs font-black text-slate-100">منظومة الالتماسات وإصدار أوامر تعديل الكنترول</h3>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <form onSubmit={handleAddAppeal} className="space-y-3 text-right">
                      <span className="text-xs font-bold text-slate-350 block">تقديم وبث التماس مراجع رسمي لطالب بالشعبة</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block">كود ومسمّى التماس المقرر:</label>
                          <select
                            value={appealCourseCode}
                            onChange={(e) => setAppealCourseCode(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                          >
                            <option value="CS-202">الذكاء الاصطناعي وشبكات العصبون</option>
                            <option value="ENG-301">التطبيقات الإنشائية الخرسانية</option>
                            <option value="BUS-110">المحاسبة المتقدمة للمنشأة</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block">تحديد الطالب المعني بالشعبة:</label>
                          <select
                            onChange={(e) => {
                              const found = selectedSection.students.find(s => s.id === e.target.value);
                              if (found) setSelectedStudent(found);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                          >
                            <option value="">-- اختر طالباً --</option>
                            {selectedSection.students.map(s => (
                              <option key={s.id} value={s.id}>{s.nameAr}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 block">مبرر وسبب التعديل والالتماس:</label>
                        <input
                          type="text"
                          value={appealNotes}
                          onChange={(e) => setAppealNotes(e.target.value)}
                          placeholder="مثال: رصد خاطئ لدرجة امتحان الميدترم بالورقة"
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 outline-none focus:border-red-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!selectedStudent}
                        className="cursor-pointer bg-red-600 hover:bg-red-500 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition w-full disabled:opacity-40"
                      >
                        قيد الطلب وإرساله لوكيل شؤون التعليم والطلاب بالكلية
                      </button>
                    </form>
                  </div>

                  {/* Appeal Logs list */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 block text-right">أرشيف قضايا تعديلات الكنترول المسجلة:</span>
                    <div className="space-y-1.5">
                      {appealList.map((app) => (
                        <div key={app.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center text-xs">
                          <span className="text-rose-422 text-[10px] bg-slate-900 text-rose-400 px-2 py-0.5 rounded font-mono font-bold leading-none">{app.status}</span>
                          <div className="text-right">
                            <strong>{app.name} — {app.course}</strong>
                            <p className="text-[10px] text-slate-500">{app.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM 7: STUDENT PROFILE PORTFOLIOS (LIST OF STUDENTS) */}
              {activeSubTab === 7 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center flex-row-reverse text-right">
                    <span className="text-[10px] bg-slate-950 text-indigo-400 border border-slate-850 px-2 py-0.5 rounded font-mono">Section Students File</span>
                    <h3 className="text-xs font-black text-slate-100">سجل كشوف وملفات شُعَب الطلاب</h3>
                  </div>

                  {/* Search query box */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="ابحث بالاسم أو الرقم الأكاديمي..."
                      value={studentSearchInput}
                      onChange={(e) => setStudentSearchInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-right focus:outline-none focus:border-emerald-500 rounded-xl pl-9"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* List */}
                    <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2 h-[290px] overflow-y-auto">
                      {sectionSearchedStudents.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => enterStudent(st)}
                          className="w-full text-right p-2.5 rounded-xl border border-slate-900 hover:border-emerald-505 bg-slate-900/60 hover:bg-slate-900 hover:text-emerald-400 hover:scale-[1.01] transition-all flex justify-between items-center cursor-pointer text-xs"
                        >
                          <span className="font-mono text-[10.5px]">GPA {st.gpa}</span>
                          <div>
                            <strong className="block text-slate-200">{st.nameAr}</strong>
                            <span className="text-[10px] text-slate-500 block">ID: {st.id.split("-").pop()}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Quick highlight overview */}
                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 flex flex-col justify-between text-right leading-relaxed text-xs">
                      <div className="space-y-2">
                        <strong className="text-slate-300 block">💡 تصفح الكشوف والملفات:</strong>
                        <p className="text-slate-500 text-[11px]">
                          انقر على أي ملف طالب لفتح السجل الفولدر الرئيسي الكامل. يمنحك ذلك رؤية شاملة حول التقديرات والوضع المالي والمساقات المسجلة.
                        </p>
                      </div>

                      <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-400 space-y-1">
                        <p>✓ تم ربط 15 ملف طالب لهذا السكشن.</p>
                        <p>✓ الأرشيف متزامن مع الخادم المركزي للوزارة.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM 8: ACADEMIC CONTENT (LECTURES & PRESETS) */}
              {activeSubTab === 8 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center text-right flex-row-reverse">
                    <span className="text-[10px] bg-slate-950 text-emerald-400 border border-slate-850 px-2 py-0.5 rounded font-mono">Academic Content Hub</span>
                    <h3 className="text-xs font-black text-slate-100">إدارة المحاضرات والمراجع والمحتوى العلمي</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-3 text-xs leading-relaxed">
                      <strong className="text-slate-250 block">📽️ المحاضرات والـ Video Streams المسجلة</strong>
                      <div className="space-y-2">
                        <div className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center">
                          <span className="text-slate-550">توقيت: ساعتين / PDF متوفر</span>
                          <strong>المحاضرة 1: مدخل البرمجة الكبسولية</strong>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center">
                          <span className="text-slate-550">توقيت: ساعة ونصف / فيديو</span>
                          <strong>المحاضرة 2: هياكل التكرار والمكدسات</strong>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-3 text-xs leading-relaxed">
                      <strong className="text-slate-250 block">📃 التكليفات والـ Quizzes الأسبوعية</strong>
                      <div className="space-y-2">
                        <div className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center">
                          <span className="text-rose-400">تاريخ التسليم: غداً</span>
                          <strong>التكليف الأول: بناء دالة الفيبوناتشي التكرارية</strong>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center">
                          <span className="text-emerald-400">مقبول ومصحح</span>
                          <strong>الكويز الأول: مصفوفات الأحجام المتعددة</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM 9: ACADEMIC ADVISING */}
              {activeSubTab === 9 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center text-right flex-row-reverse">
                    <span className="text-[10px] bg-slate-950 text-amber-500 border border-slate-850 px-2 py-0.5 rounded font-mono">Academic Advising Portal</span>
                    <h3 className="text-xs font-black text-slate-100">بوابة الإرشاد الأكاديمي والخطط المقررة</h3>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl text-right leading-relaxed space-y-3 text-xs">
                    <strong className="text-slate-200 block">📋 الخطة الدراسية الاسترشادية للفرقة الدراسية الحالية</strong>
                    <p className="text-slate-400 text-[11px]">
                      توضح هذه المنصة المسارات المسجلة لمرشد التعليم والطلاب للشعبة وحالة الإنذار الأكاديمي المسحوبة.
                    </p>

                    <div className="border-t border-slate-900 pt-3 space-y-2 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-400 font-mono">3 ساعات معتمدة (Credit Hours)</span>
                        <span>1. تراكيب البيانات المتطورة (Advanced Data Structures)</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-teal-400">
                        <span className="text-teal-400 font-mono">3 ساعات معتمدة (Credit Hours)</span>
                        <span>2. لغات الذكاء الاصطناعي الأفعوانية (Python & AI Core)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-400 font-mono">2 ساعات معتمدة (Credit Hours)</span>
                        <span>3. حقوق واستدامة المنشأة وحقوق الإنسان المقررة</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM 10: REPORTS GENERATION */}
              {activeSubTab === 10 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 flex justify-between items-center flex-row-reverse text-right">
                    <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900/60 px-2' py-0.5 rounded font-mono">Academic Prints</span>
                    <h3 className="text-xs font-black text-slate-100">بوابة طباعة وتصدير التقارير للشعبة</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-3 text-xs">
                      <strong className="text-slate-250 block">📄 وثيقة كشف درجات الشعبة (PDF Print)</strong>
                      <p className="text-slate-500">توليد ملف كامل يحتوي على درجات الميدترم، العملي والنهائي لجميع طلاب الشعبة.</p>
                      <button
                        onClick={() => alert("تم توليد وتنزيل وثيقة كشوف درجات الشعبة PDF بنجاح!")}
                        className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold px-3 py-2 rounded-xl transition flex items-center justify-center gap-1.5 w-full"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        طباعة كشوف الدرجات والنتائج
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-3 text-xs">
                      <strong className="text-slate-250 block">📋 تقرير الحلا والغرامة المالي (Financial Check)</strong>
                      <p className="text-slate-500">سحب الإحصائيات الشاملة للديون والمسددات لأقساط طلاب الشعبة.</p>
                      <button
                        onClick={() => alert("تم تصدير ملف الاكسل الخاص بالتحصيلات المالية للشعبة بنجاح!")}
                        className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold px-3 py-2 rounded-xl transition flex items-center justify-center gap-1.5 w-full"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                        تنزيل شيت مالية الطلاب (Excel)
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------
          LEVEL 5: DETAILED STUDENT PORTFOLIO (DOSSIER)
          ------------------------------------- */}
      {navLevel === "student" && selectedStudent && selectedCollege && (
        <div className="space-y-6 animate-fade-in text-right">
          
          {/* Main Dossier Header */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 justify-start flex-row-reverse mb-1.5">
                <span className="text-[10px] bg-slate-950 text-emerald-400 border border-slate-850 px-2 py-0.5 rounded font-mono font-bold">
                  {selectedStudent.id}
                </span>
                <span className="text-[10px] bg-slate-950 text-indigo-400 border border-slate-850 px-2 py-0.5 rounded font-mono font-bold">
                  {selectedCollege.nameAr}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-100">{selectedStudent.nameAr}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedStudent.nameEn}</p>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => navigateBackTo("section")}
                className="cursor-pointer bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                تراجع للشعبة
              </button>
            </div>
          </div>

          {/* Core Grid information */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Column Left: Personal & Academic State */}
            <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">📂 الملف التعريفي والاتصال</h3>
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-slate-500 block text-[10.5px]">الهاتف الجوال:</span>
                  <span className="font-mono text-slate-200 block">{selectedStudent.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">البريد الأكاديمي:</span>
                  <span className="font-mono text-slate-200 block truncate">{selectedStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">الوضع التراكمي للائحة:</span>
                  <span className="font-bold text-emerald-400 block">{selectedStudent.gpa >= 2.0 ? "سليم - نشط بالكامل" : "خاضع لإنذار التحصيل"}</span>
                </div>
              </div>
            </div>

            {/* Column Middle: Academic Stats & Grades dossier */}
            <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 font-sans text-right">
              <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">📊 كشف الدرجات التفصيلي والـ GPA</h3>
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-slate-550 block text-[10px]">GPA الفصل الدراسي</span>
                    <strong className="text-emerald-400 font-mono text-sm">{selectedStudent.gpa}</strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-slate-550 block text-[10px]">CGPA التراكمي العام</span>
                    <strong className="text-indigo-400 font-mono text-sm">{selectedStudent.cgpa}</strong>
                  </div>
                </div>

                <div className="border-t border-slate-950 pt-3 space-y-2 text-[11px] leading-normal">
                  <div className="flex justify-between">
                    <strong className="text-slate-350">{selectedStudent.midtermGrade}/30</strong>
                    <span>أعمال السنة والـ Midterm:</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-slate-355">{selectedStudent.practicalGrade}/25</strong>
                    <span>أعمال المعمل والتطبيقات:</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-slate-355">{selectedStudent.finalGrade}/45</strong>
                    <span>ورقة الامتحان النهائي:</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-1.5 font-bold">
                    <strong className="text-emerald-400">{selectedStudent.totalGrade}/100</strong>
                    <span>المجموع الكلي:</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column Right: Financial status */}
            <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 text-right space-y-4">
              <h3 className="text-xs font-black text-slate-300 border-b border-slate-800 pb-2">💰 المحاسبة والرسوم الدراسية</h3>
              <div className="space-y-3 leading-normal text-xs">
                <div>
                  <span className="text-slate-500 block text-[10.5px]">إجمالي الرسوم المقررة:</span>
                  <strong className="text-slate-200 font-mono block">18,000 ج.م</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">المبلغ المسدد وموثق بالمالية:</span>
                  <strong className="text-emerald-400 font-mono block">
                    {selectedStudent.financialStatus.totalPaid.toLocaleString()} ج.م
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">الرصيد المتبقي مستحق الدفع:</span>
                  <strong className="text-rose-500 font-mono block">
                    {(selectedStudent.financialStatus.totalAmount - selectedStudent.financialStatus.totalPaid).toLocaleString()} ج.م
                  </strong>
                </div>

                <div className="pt-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    selectedStudent.financialStatus.totalPaid === 18000
                      ? "bg-emerald-950 text-emerald-400"
                      : "bg-amber-950 text-amber-500"
                  }`}>
                    {selectedStudent.financialStatus.totalPaid === 18000 ? "✓ مسدد بالكامل" : "⚠ جزء متبقي"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
