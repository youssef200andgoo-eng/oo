// Central Identity Provider & Authorization Engine for SGU Smart University ERP
// Compliant with SOLID principles and Clean Code

export interface UserPermission {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface UniversityRole {
  id: "student" | "faculty" | "ta" | "advisor" | "dept_head" | "dean" | "employee" | "finance_staff" | "library_staff" | "admin" | "super_admin";
  nameAr: string;
  nameEn: string;
  permissions: string[];
}

export interface UniversityCollege {
  id: string;
  nameAr: string;
  nameEn: string;
  systemNameAr: string;
  systemNameEn: string;
  themeColor: string;
  accentText: string;
  accentBg: string;
  slots: number;
}

export interface UniversityUser {
  id: string; // University ID (e.g. SGU-ST-10045)
  universityId: string; // University identity card code
  nameAr: string;
  nameEn: string;
  email: string;
  roleId: UniversityRole["id"];
  collegeId: string; // 'fcis', 'med', 'phr', etc., or 'all'
  departmentAr: string;
  departmentEn: string;
  programAr: string;
  programEn: string;
  academicLevelAr: string;
  academicLevelEn: string;
  status: "active" | "suspended" | "pending";
  gpaOrSalary: string;
  nationalId: string;
  phone: string;
  campusBranchAr: string;
  campusBranchEn: string;
  avatarUrl: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  actionEn: string;
  details: string;
  detailsEn: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "warning" | "error" | "blocked";
  collegeId: string;
}

// 1. Core Permissions list
export const SGU_PERMISSIONS = {
  VIEW_GRADES: "view_grades",
  SUBMIT_ASSIGNMENTS: "submit_assignments",
  REGISTER_COURSES: "register_courses",
  PAY_FEES: "pay_fees",
  ENTER_GRADES: "enter_grades",
  MANAGE_ATTENDANCE: "manage_attendance",
  UPLOAD_LECTURES: "upload_lectures",
  APPROVE_REGISTRATIONS: "approve_registrations",
  MANAGE_FACULTY: "manage_faculty",
  SIGN_GRADUATION: "sign_graduation",
  VIEW_COLLEGE_STATS: "view_college_stats",
  MANAGE_FINANCES: "manage_finances",
  MANAGE_LIBRARY: "manage_library",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  MANAGE_DATABASE: "manage_database",
  MANAGE_SYSTEMS: "manage_systems"
};

// 2. Roles mapping
export const SGU_ROLES_REGISTRY: Record<UniversityRole["id"], UniversityRole> = {
  student: {
    id: "student",
    nameAr: "طالب جامعي",
    nameEn: "University Student",
    permissions: [SGU_PERMISSIONS.VIEW_GRADES, SGU_PERMISSIONS.SUBMIT_ASSIGNMENTS, SGU_PERMISSIONS.REGISTER_COURSES, SGU_PERMISSIONS.PAY_FEES]
  },
  faculty: {
    id: "faculty",
    nameAr: "عضو هيئة التدريس (أستاذ)",
    nameEn: "Faculty Member (Professor)",
    permissions: [SGU_PERMISSIONS.ENTER_GRADES, SGU_PERMISSIONS.MANAGE_ATTENDANCE, SGU_PERMISSIONS.UPLOAD_LECTURES]
  },
  ta: {
    id: "ta",
    nameAr: "معيد / مدرس مساعد",
    nameEn: "Teaching Assistant (TA)",
    permissions: [SGU_PERMISSIONS.MANAGE_ATTENDANCE, SGU_PERMISSIONS.UPLOAD_LECTURES]
  },
  advisor: {
    id: "advisor",
    nameAr: "مرشد أكاديمي معتمد",
    nameEn: "Academic Advisor",
    permissions: [SGU_PERMISSIONS.VIEW_GRADES, SGU_PERMISSIONS.APPROVE_REGISTRATIONS]
  },
  dept_head: {
    id: "dept_head",
    nameAr: "رئيس القسم العلمي",
    nameEn: "Department Head",
    permissions: [SGU_PERMISSIONS.ENTER_GRADES, SGU_PERMISSIONS.APPROVE_REGISTRATIONS, SGU_PERMISSIONS.MANAGE_FACULTY, SGU_PERMISSIONS.VIEW_COLLEGE_STATS]
  },
  dean: {
    id: "dean",
    nameAr: "عميد الكلية",
    nameEn: "Dean of Faculty",
    permissions: [SGU_PERMISSIONS.VIEW_COLLEGE_STATS, SGU_PERMISSIONS.MANAGE_FACULTY, SGU_PERMISSIONS.SIGN_GRADUATION, SGU_PERMISSIONS.APPROVE_REGISTRATIONS]
  },
  employee: {
    id: "employee",
    nameAr: "موظف إداري",
    nameEn: "Administrative Staff",
    permissions: [SGU_PERMISSIONS.MANAGE_ATTENDANCE]
  },
  finance_staff: {
    id: "finance_staff",
    nameAr: "موظف الإدارة المالية",
    nameEn: "Finance Officer",
    permissions: [SGU_PERMISSIONS.MANAGE_FINANCES, SGU_PERMISSIONS.PAY_FEES]
  },
  library_staff: {
    id: "library_staff",
    nameAr: "أمين المكتبة المركزية",
    nameEn: "Chief Librarian",
    permissions: [SGU_PERMISSIONS.MANAGE_LIBRARY]
  },
  admin: {
    id: "admin",
    nameAr: "مدير أنظمة تقنية المعلومات",
    nameEn: "IT Systems Administrator",
    permissions: [SGU_PERMISSIONS.VIEW_AUDIT_LOGS, SGU_PERMISSIONS.MANAGE_DATABASE, SGU_PERMISSIONS.MANAGE_SYSTEMS]
  },
  super_admin: {
    id: "super_admin",
    nameAr: "رئيس الجامعة / المسؤول الأعلى",
    nameEn: "Super Administrator / Chancellor",
    permissions: Object.values(SGU_PERMISSIONS)
  }
};

// 3. Extensible Multi-College Registry
export const INITIAL_COLLEGES: UniversityCollege[] = [
  {
    id: "fcis",
    nameAr: "كلية الحاسبات والمعلومات",
    nameEn: "Faculty of Computer & Information Sciences",
    systemNameAr: "منظومة الحاسبات المتطورة والذكاء الاصطناعي (SGU AI & DevLab Sandbox)",
    systemNameEn: "Advanced Computing & Artificial Intelligence Hub",
    themeColor: "from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/40",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/10 border-emerald-500/30",
    slots: 1450
  },
  {
    id: "med",
    nameAr: "كلية الطب البشري",
    nameEn: "Faculty of Medicine",
    systemNameAr: "المنصة السريرية ونظام الكنترول الطبي (OSCE Medical Hub)",
    systemNameEn: "Clinical Medicine & Control OSCE Center",
    themeColor: "from-blue-500/10 to-indigo-500/5 hover:border-blue-500/40",
    accentText: "text-blue-400",
    accentBg: "bg-blue-500/10 border-blue-500/30",
    slots: 980
  },
  {
    id: "den",
    nameAr: "كلية طب الأسنان",
    nameEn: "Faculty of Dentistry",
    systemNameAr: "مركز طب وجراحة الأسنان وعيادات كاد-كام (3D Dental CAD-CAM)",
    systemNameEn: "Dental Surgery & 3D CAD-CAM Center",
    themeColor: "from-purple-500/10 to-fuchsia-500/5 hover:border-purple-500/40",
    accentText: "text-purple-400",
    accentBg: "bg-purple-500/10 border-purple-500/30",
    slots: 750
  },
  {
    id: "phr",
    nameAr: "كلية الصيدلة",
    nameEn: "Faculty of Pharmacy",
    systemNameAr: "نظام تصنيع الجرعات الدوائية والتحليل الإكلينيكي (PharmD Formulation)",
    systemNameEn: "PharmD Formulation & Clinical Pharmacology Systems",
    themeColor: "from-amber-500/10 to-orange-500/5 hover:border-amber-500/40",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500/10 border-amber-500/30",
    slots: 1100
  },
  {
    id: "pt",
    nameAr: "كلية العلاج الطبيعي",
    nameEn: "Faculty of Physical Therapy",
    systemNameAr: "مخطط التأهيل الحركي والتحليل المفصلي (Kinesiology Rehab Planner)",
    systemNameEn: "Rehab Kinematics & Physical Therapy Management",
    themeColor: "from-sky-500/10 to-cyan-500/5 hover:border-sky-500/40",
    accentText: "text-sky-400",
    accentBg: "bg-sky-500/10 border-sky-500/30",
    slots: 850
  },
  {
    id: "nur",
    nameAr: "كلية التمريض",
    nameEn: "Faculty of Nursing",
    systemNameAr: "منظومة الرعاية الصحية والتدريب التمريضي التفاعلي (Nursing Care Portal)",
    systemNameEn: "Nursing Care System & Clinical Training Engine",
    themeColor: "from-rose-500/10 to-pink-500/5 hover:border-rose-500/40",
    accentText: "text-rose-400",
    accentBg: "bg-rose-500/10 border-rose-500/30",
    slots: 640
  },
  {
    id: "bus",
    nameAr: "كلية إدارة الأعمال",
    nameEn: "Faculty of Business Administration",
    systemNameAr: "منصة التحليل المالي ونظم الأعمال الذكية (Business & Finance Sandbox)",
    systemNameEn: "Business Analytics & Smart Management Portal",
    themeColor: "from-teal-500/10 to-emerald-500/5 hover:border-teal-500/40",
    accentText: "text-teal-400",
    accentBg: "bg-teal-500/10 border-teal-500/30",
    slots: 1200
  }
];

// 4. Central Seeded Enterprise User Identities Database (with hashed password check simulated)
export const SGU_CENTRAL_USERS: UniversityUser[] = [
  // STUDENTS
  {
    id: "SGU-ST-10045",
    universityId: "SGU-ST-10045",
    nameAr: "يوسف شريف الكردي",
    nameEn: "Youssef Sherif El-Kurdy",
    email: "youssef.student@stud.sgu.edu.eg",
    roleId: "student",
    collegeId: "fcis",
    departmentAr: "الذكاء الاصطناعي (AI)",
    departmentEn: "Artificial Intelligence (AI)",
    programAr: "بكالوريوس هندسة البرمجيات والأنظمة الذكية",
    programEn: "B.Sc. Software Engineering & Intelligent Systems",
    academicLevelAr: "السنة الثالثة - الفصل الدراسي الثاني",
    academicLevelEn: "Year 3 - Semester 2",
    status: "active",
    gpaOrSalary: "3.88",
    nationalId: "30210150102431",
    phone: "+20 1023456789",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "SGU-ST-20011",
    universityId: "SGU-ST-20011",
    nameAr: "سارة محمود الجندي",
    nameEn: "Sarah Mahmoud El-Gendy",
    email: "sarah.student@stud.sgu.edu.eg",
    roleId: "student",
    collegeId: "med",
    departmentAr: "التشريح وعلم الأنسجة",
    departmentEn: "Anatomy & Histology",
    programAr: "دكتور في الطب والجراحة العامة (MD)",
    programEn: "Doctor of Medicine & Surgery (MD)",
    academicLevelAr: "الفرقة الثانية - الفصل الأول",
    academicLevelEn: "Year 2 - Semester 1",
    status: "active",
    gpaOrSalary: "3.92",
    nationalId: "30302120104822",
    phone: "+20 1148923410",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "SGU-ST-30044",
    universityId: "SGU-ST-30044",
    nameAr: "أحمد سليمان هلال",
    nameEn: "Ahmed Soliman Helal",
    email: "ahmed.student@stud.sgu.edu.eg",
    roleId: "student",
    collegeId: "phr",
    departmentAr: "الصيدلانيات والتكنولوجيا الصيدلية",
    departmentEn: "Pharmaceutics & Pharmacy Tech",
    programAr: "دكتور صيدلة إكلينيكية (PharmD)",
    programEn: "Doctor of Clinical Pharmacy (PharmD)",
    academicLevelAr: "السنة الأولى - الفصل الثاني",
    academicLevelEn: "Year 1 - Semester 2",
    status: "active",
    gpaOrSalary: "3.45",
    nationalId: "30511030103953",
    phone: "+20 1289123456",
    campusBranchAr: "فرع العبور الجديد (شراكة SGU)",
    campusBranchEn: "El-Obour New Campus",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // PROFESSORS
  {
    id: "SGU-FAC-7731",
    universityId: "SGU-FAC-7731",
    nameAr: "أ.د. محمد الشافعي",
    nameEn: "Prof. Mohamed El-Shafei",
    email: "m.shafei@faculty.sgu.edu.eg",
    roleId: "faculty",
    collegeId: "fcis",
    departmentAr: "علوم الحاسب (CS)",
    departmentEn: "Computer Science (CS)",
    programAr: "كلية الحاسبات والمعلومات",
    programEn: "Faculty of Computer Sciences",
    academicLevelAr: "أستاذ كامل البروفيسور",
    academicLevelEn: "Full Professor",
    status: "active",
    gpaOrSalary: "22,500 ج.م",
    nationalId: "27511050100483",
    phone: "+20 1004829311",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "SGU-FAC-8842",
    universityId: "SGU-FAC-8842",
    nameAr: "أ.د. جيهان كمال شاكر",
    nameEn: "Prof. Jihan Kamal Shaker",
    email: "jihan.shaker@faculty.sgu.edu.eg",
    roleId: "faculty",
    collegeId: "med",
    departmentAr: "علم وظائف الأعضاء (Physiology)",
    departmentEn: "Physiology Department",
    programAr: "كلية الطب البشري",
    programEn: "Faculty of Medicine",
    academicLevelAr: "أستاذ كامل رئيس مختبرات",
    academicLevelEn: "Full Professor",
    status: "active",
    gpaOrSalary: "24,000 ج.م",
    nationalId: "27812030103942",
    phone: "+20 1228493104",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // TEACHING ASSISTANTS
  {
    id: "SGU-TA-1234",
    universityId: "SGU-TA-1234",
    nameAr: "م. رنا الشرقاوي",
    nameEn: "Eng. Rana El-Sharkawy",
    email: "rana.ta@faculty.sgu.edu.eg",
    roleId: "ta",
    collegeId: "fcis",
    departmentAr: "هندسة البرمجيات (SE)",
    departmentEn: "Software Engineering (SE)",
    programAr: "كلية الحاسبات والمعلومات",
    programEn: "Faculty of Computer Sciences",
    academicLevelAr: "معيد بالقسم",
    academicLevelEn: "Teaching Assistant",
    status: "active",
    gpaOrSalary: "9,800 ج.م",
    nationalId: "29905200104832",
    phone: "+20 1114829302",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // ACADEMIC ADVISORS
  {
    id: "SGU-ADV-5561",
    universityId: "SGU-ADV-5561",
    nameAr: "د. رامي رياض الحفناوي",
    nameEn: "Dr. Ramy El-Hefnawy",
    email: "ramy.hefnawy@faculty.sgu.edu.eg",
    roleId: "advisor",
    collegeId: "fcis",
    departmentAr: "الذكاء الاصطناعي (AI)",
    departmentEn: "Artificial Intelligence (AI)",
    programAr: "كلية الحاسبات والمعلومات",
    programEn: "Faculty of Computer Sciences",
    academicLevelAr: "مدرس أكاديمي معتمد",
    academicLevelEn: "Academic Lecturer",
    status: "active",
    gpaOrSalary: "14,200 ج.م",
    nationalId: "28210140103942",
    phone: "+20 1009123841",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // DEPT HEADS
  {
    id: "SGU-HOD-9921",
    universityId: "SGU-HOD-9921",
    nameAr: "أ.د. سمير عبد الرؤوف",
    nameEn: "Prof. Samir Abdelraouf",
    email: "samir.abdelraouf@faculty.sgu.edu.eg",
    roleId: "dept_head",
    collegeId: "fcis",
    departmentAr: "علوم الحاسب (CS)",
    departmentEn: "Computer Science (CS)",
    programAr: "كلية الحاسبات والمعلومات",
    programEn: "Faculty of Computer Sciences",
    academicLevelAr: "أستاذ ورئيس القسم",
    academicLevelEn: "Professor & Department Head",
    status: "active",
    gpaOrSalary: "26,000 ج.م",
    nationalId: "27003120102452",
    phone: "+20 1024391204",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // DEANS
  {
    id: "SGU-DEAN-1100",
    universityId: "SGU-DEAN-1100",
    nameAr: "أ.د. منال محمود الديب",
    nameEn: "Prof. Manal El-Deeb",
    email: "manal.eldeeb@faculty.sgu.edu.eg",
    roleId: "dean",
    collegeId: "fcis",
    departmentAr: "إدارة الكلية والأبحاث",
    departmentEn: "Faculty Deanship",
    programAr: "كلية الحاسبات والمعلومات",
    programEn: "Faculty of Computer Sciences",
    academicLevelAr: "عميد الكلية الموقر",
    academicLevelEn: "Dean of Faculty",
    status: "active",
    gpaOrSalary: "35,000 ج.م",
    nationalId: "27205120102431",
    phone: "+20 1024831204",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "SGU-DEAN-2200",
    universityId: "SGU-DEAN-2200",
    nameAr: "أ.د. يحيى زكريا سليمان",
    nameEn: "Prof. Yehia Zakaria Soliman",
    email: "yehia.soliman@faculty.sgu.edu.eg",
    roleId: "dean",
    collegeId: "med",
    departmentAr: "إدارة كلية الطب",
    departmentEn: "Medical Deanship",
    programAr: "كلية الطب البشري",
    programEn: "Faculty of Medicine",
    academicLevelAr: "عميد كلية الطب البشري",
    academicLevelEn: "Dean of Medicine",
    status: "active",
    gpaOrSalary: "38,000 ج.م",
    nationalId: "26912040102941",
    phone: "+20 1114892301",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // ADMISSIONS EMPLOYEES
  {
    id: "SGU-EMP-1002",
    universityId: "SGU-EMP-1002",
    nameAr: "أ. عبد الرحمن مصطفى",
    nameEn: "Mr. Abdelrahman Mostafa",
    email: "abdelrahman@sgu.edu.eg",
    roleId: "employee",
    collegeId: "all",
    departmentAr: "شؤون التسجيل والقبول الموحد",
    departmentEn: "Admissions & Registration Office",
    programAr: "شؤون الطلاب المركزية",
    programEn: "Central Student Affairs",
    academicLevelAr: "مسجل عام الكلية",
    academicLevelEn: "Registrar Officer",
    status: "active",
    gpaOrSalary: "8,500 ج.م",
    nationalId: "28804150102432",
    phone: "+20 1284920145",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // FINANCE EMPLOYEES
  {
    id: "SGU-FIN-5001",
    universityId: "SGU-FIN-5001",
    nameAr: "أ. كريم الهلالي",
    nameEn: "Mr. Karim El-Hilaly",
    email: "karim.finance@sgu.edu.eg",
    roleId: "finance_staff",
    collegeId: "all",
    departmentAr: "الحسابات والموازنة المركزية",
    departmentEn: "Central Treasury & Auditing",
    programAr: "الشؤون المالية والإدارية",
    programEn: "Central Financial Affairs",
    academicLevelAr: "أمين الخزينة المعتمد",
    academicLevelEn: "Chief Treasury Officer",
    status: "active",
    gpaOrSalary: "11,200 ج.م",
    nationalId: "28510120102431",
    phone: "+20 1024923105",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // LIBRARY EMPLOYEES
  {
    id: "SGU-LIB-4001",
    universityId: "SGU-LIB-4001",
    nameAr: "أ. فاطمة الزهراء الشافعي",
    nameEn: "Mrs. Fatima El-Shafei",
    email: "fatima.library@sgu.edu.eg",
    roleId: "library_staff",
    collegeId: "all",
    departmentAr: "المكتبات والتوثيق الأكاديمي",
    departmentEn: "Central Libraries & Archiving",
    programAr: "إدارة المعرفة والمستندات",
    programEn: "Information Science Desk",
    academicLevelAr: "أمين المكتبة العامة",
    academicLevelEn: "Senior Librarian",
    status: "active",
    gpaOrSalary: "9,100 ج.م",
    nationalId: "28704020104932",
    phone: "+20 1148293104",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // ADMINISTRATORS
  {
    id: "SGU-ADM-9999",
    universityId: "SGU-ADM-9999",
    nameAr: "مهندس يوسف أحمد",
    nameEn: "Eng. Youssef Ahmed",
    email: "youssef.admin@sgu.edu.eg",
    roleId: "admin",
    collegeId: "all",
    departmentAr: "مركز تكنولوجيا المعلومات (IT)",
    departmentEn: "Information Technology Center",
    programAr: "إدارة البنى التحتية والشبكات",
    programEn: "IT Infrastructure Management",
    academicLevelAr: "مدير أمن معلومات رئيسي",
    academicLevelEn: "Chief Security Officer",
    status: "active",
    gpaOrSalary: "28,500 ج.م",
    nationalId: "29202040103942",
    phone: "+20 1004829312",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "SGU-SADM-777",
    universityId: "SGU-SADM-777",
    nameAr: "المستشار د. حاتم عثمان",
    nameEn: "Chancellor Dr. Hatem Osman",
    email: "chancellor@sgu.edu.eg",
    roleId: "super_admin",
    collegeId: "all",
    departmentAr: "المجلس الأعلى لإدارة الجامعة",
    departmentEn: "Supreme University Council",
    programAr: "رئاسة الجامعة والقيادة الاستراتيجية",
    programEn: "Strategic Academic Leadership",
    academicLevelAr: "رئيس مجلس أمناء الجامعة",
    academicLevelEn: "Chairman & Chancellor",
    status: "active",
    gpaOrSalary: "50,000 ج.م",
    nationalId: "26203120102431",
    phone: "+20 1024931204",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // SUSPENDED ACCOUNT TEST CASE
  {
    id: "SGU-ST-99900",
    universityId: "SGU-ST-99900",
    nameAr: "مروان محمود الجارحي",
    nameEn: "Marwan Mahmoud El-Garhy",
    email: "marwan.suspended@stud.sgu.edu.eg",
    roleId: "student",
    collegeId: "fcis",
    departmentAr: "هندسة البرمجيات",
    departmentEn: "Software Engineering",
    programAr: "بكالوريوس الحاسبات",
    programEn: "B.Sc. Computing",
    academicLevelAr: "المستوى الأول",
    academicLevelEn: "Level 1",
    status: "suspended",
    gpaOrSalary: "1.24",
    nationalId: "30511120102431",
    phone: "+20 1204812304",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80"
  },
  // PENDING ACCOUNT TEST CASE
  {
    id: "SGU-ST-99901",
    universityId: "SGU-ST-99901",
    nameAr: "فادي شريف الجيار",
    nameEn: "Fady Sherif El-Gayar",
    email: "fady.pending@stud.sgu.edu.eg",
    roleId: "student",
    collegeId: "med",
    departmentAr: "التشريح",
    departmentEn: "Anatomy",
    programAr: "بكالوريوس الطب",
    programEn: "B.Sc. Medicine",
    academicLevelAr: "المستوى الأول",
    academicLevelEn: "Level 1",
    status: "pending",
    gpaOrSalary: "0.00",
    nationalId: "30612040103942",
    phone: "+20 1024823910",
    campusBranchAr: "فرع الصالحية الجديدة الرئيسي",
    campusBranchEn: "Al-Salihiyah Main Campus",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

// Helper to simulate secure logging in localStorage
export const getAuditLogs = (): AuditLogEntry[] => {
  const saved = localStorage.getItem("sgu_security_audit_logs");
  if (saved) return JSON.parse(saved);
  
  // Seed initial high-quality audit log entries
  const initialLogs: AuditLogEntry[] = [
    {
      id: "log_1",
      timestamp: new Date(Date.now() - 3600000 * 2.5).toLocaleString("ar-EG"),
      userId: "SGU-ST-10045",
      userName: "يوسف شريف الكردي",
      action: "تسجيل دخول ومطابقة هوية",
      actionEn: "Identity Authenticated",
      details: "نجاح التحقق الثنائي MFA ومطابقة الهوية بجامعة الصالحية عبر بوابة الدخول الموحدة.",
      detailsEn: "MFA success & university ID verification through unified portal.",
      ipAddress: "197.34.120.44",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0",
      status: "success",
      collegeId: "fcis"
    },
    {
      id: "log_2",
      timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString("ar-EG"),
      userId: "SGU-DEAN-1100",
      userName: "أ.د. منال محمود الديب",
      action: "دخول عميد الكلية",
      actionEn: "Deanship Authentication",
      details: "دخول عميد الكلية للحاسبات لمراجعة طلبات التسجيل الأكاديمي والتحقق من الصلاحيات المعزولة.",
      detailsEn: "Dean of FCIS authenticated to review academic registrations and isolated metrics.",
      ipAddress: "197.34.120.10",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      status: "success",
      collegeId: "fcis"
    },
    {
      id: "log_3",
      timestamp: new Date(Date.now() - 3600000 * 8).toLocaleString("ar-EG"),
      userId: "SGU-ST-99900",
      userName: "مروان محمود الجارحي",
      action: "حظر تسجيل دخول",
      actionEn: "Login Blocked",
      details: "تم منع الدخول الموحد لأن الحساب موقوف بسبب عدم تسديد الرسوم أو القرار التأديبي.",
      detailsEn: "Unified login blocked: Account is suspended due to outstanding fees or disciplinary action.",
      ipAddress: "102.43.12.80",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X)",
      status: "blocked",
      collegeId: "fcis"
    }
  ];
  localStorage.setItem("sgu_security_audit_logs", JSON.stringify(initialLogs));
  return initialLogs;
};

export const addAuditLog = (
  userId: string,
  userName: string,
  action: string,
  actionEn: string,
  details: string,
  detailsEn: string,
  status: AuditLogEntry["status"] = "success",
  collegeId: string = "all"
) => {
  const logs = getAuditLogs();
  
  // Random Egyptian ISP mock IPs
  const EgyptianIPs = ["197.34.120.44", "197.43.20.12", "102.43.11.89", "102.40.122.3", "197.39.204.11"];
  const randomIp = EgyptianIPs[Math.floor(Math.random() * EgyptianIPs.length)];
  
  const newEntry: AuditLogEntry = {
    id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    timestamp: new Date().toLocaleString("ar-EG"),
    userId,
    userName,
    action,
    actionEn,
    details,
    detailsEn,
    ipAddress: randomIp,
    userAgent: navigator.userAgent || "Mozilla/5.0 ERP Secure Client",
    status,
    collegeId
  };
  
  logs.unshift(newEntry);
  localStorage.setItem("sgu_security_audit_logs", JSON.stringify(logs.slice(0, 200))); // keep top 200
  
  // Also push to standard system logs if available
  const sysLogsKey = "sgu_system_activity_logs";
  const savedSys = localStorage.getItem(sysLogsKey);
  const sysLogs = savedSys ? JSON.parse(savedSys) : [];
  sysLogs.unshift(`[AUDIT ${status.toUpperCase()}] ${actionEn} for user ${userId}: ${detailsEn}`);
  localStorage.setItem(sysLogsKey, JSON.stringify(sysLogs.slice(0, 100)));
};

// 5. Authorization Check Middleware (Checks status and validates permissions)
export const validateUserAccess = (
  user: UniversityUser,
  requiredPermission?: string,
  requiredCollegeId?: string
): { allowed: boolean; reasonAr: string; reasonEn: string } => {
  // Check Account Status first
  if (user.status === "suspended") {
    return {
      allowed: false,
      reasonAr: "⚠️ عذراً، حسابك الجامعي معطل أو موقوف حالياً. يرجى مراجعة إدارة شؤون الطلاب والقبول لتسوية الحالة.",
      reasonEn: "⚠️ Access Denied: Your university account is currently suspended. Please contact Student Affairs."
    };
  }
  
  if (user.status === "pending") {
    return {
      allowed: false,
      reasonAr: "⚠️ عذراً، حسابك في انتظار مراجعة الوثائق المرفوعة والاعتماد النهائي من عميد الكلية وموظف القبول والتسجيل.",
      reasonEn: "⚠️ Access Denied: Your account is pending document verification and registrar approval."
    };
  }
  
  // Check College Isolation (if applicable and user is not Admin/SuperAdmin/Finance)
  if (
    requiredCollegeId && 
    requiredCollegeId !== "all" && 
    user.collegeId !== "all" && 
    user.collegeId !== requiredCollegeId && 
    user.roleId !== "admin" && 
    user.roleId !== "super_admin" &&
    user.roleId !== "finance_staff" &&
    user.roleId !== "library_staff"
  ) {
    return {
      allowed: false,
      reasonAr: `⚠️ حظر أمني: لا تملك صلاحية الوصول لقاعدة بيانات الكلية المعزولة (${requiredCollegeId.toUpperCase()}). نظام SGU يضمن عزل البيانات التام بين الكليات.`,
      reasonEn: `⚠️ Security Violation: You do not have permissions to access the isolated databases of ${requiredCollegeId.toUpperCase()} college.`
    };
  }
  
  // Check Role Permissions
  if (requiredPermission) {
    const roleConfig = SGU_ROLES_REGISTRY[user.roleId];
    if (!roleConfig || !roleConfig.permissions.includes(requiredPermission)) {
      return {
        allowed: false,
        reasonAr: `⚠️ عذراً، لا تملك الصلاحية الأمنية الكافية للقيام بهذا الإجراء (${requiredPermission}). يرجى تقديم طلب ترقية أو تواصل مع الدعم الفني.`,
        reasonEn: `⚠️ Insufficient Permissions: This action requires the (${requiredPermission}) permission which is not granted to your role.`
      };
    }
  }
  
  return {
    allowed: true,
    reasonAr: "مسموح",
    reasonEn: "Allowed"
  };
};

// Helper function to resolve dynamic destination route based on User Identity
export const resolveDynamicRoute = (
  user: UniversityUser
): { activeSegment: string; subTab: string; messageAr: string; messageEn: string } => {
  const role = user.roleId;
  const colId = user.collegeId;
  
  // Set up details based on user identity mapping
  let activeSegment: any = "student";
  let subTab = "college_portal";
  let messageAr = "";
  let messageEn = "";
  
  switch (role) {
    case "student":
      activeSegment = "student";
      // Auto routing based on college
      subTab = "college_portal";
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "طالب" بالكلية (${colId.toUpperCase()}). تم توجيهك لبيئة كليتك المعزولة وبوابتك الطلابية تلقائياً.`;
      messageEn = `Smart Route: Student identity detected at college (${colId.toUpperCase()}). Directed to your isolated College Portal automatically.`;
      break;
      
    case "faculty":
      activeSegment = "faculty";
      subTab = "faculty_overview";
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "أستاذ دكتور" بقسم (${user.departmentAr}). تم تشغيل بوابة الأكاديميين الخاصة بك.`;
      messageEn = `Smart Route: Professor identity detected at (${user.departmentEn}). Activated your Academic Faculty Portal.`;
      break;
      
    case "ta":
      activeSegment = "faculty";
      subTab = "attendance_sheets"; // let's route to sheets or similar
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "معيد / مدرس مساعد" بالكلية (${colId.toUpperCase()}). تم توجيهك لنظام التدريس العملي.`;
      messageEn = `Smart Route: Teaching Assistant identity detected at (${colId.toUpperCase()}). Routed to the practical teaching portal.`;
      break;
      
    case "advisor":
      activeSegment = "faculty";
      subTab = "academic_advising"; // route to advising tab
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "مرشد أكاديمي معتمد". تم تفعيل نظام التوجيه والتسجيل المعتمد للطلاب.`;
      messageEn = `Smart Route: Academic Advisor identity detected. Activated student guidance and registration panels.`;
      break;
      
    case "dept_head":
      activeSegment = "faculty";
      subTab = "dept_head_dashboard"; // special dashboard tab
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "رئيس القسم العلمي" بقسم (${user.departmentAr}). تم فتح لوحة التحكم القيادية للقسم.`;
      messageEn = `Smart Route: Department Head identity detected at (${user.departmentEn}). Routed to your Department Leadership Dashboard.`;
      break;
      
    case "dean":
      activeSegment = "faculty";
      subTab = "deanship_control"; // special deanship control
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "عميد كلية" (${colId.toUpperCase()}). تم توجيهك للوحة التحكم الاستراتيجية وعزل البيانات الكلية للعميد.`;
      messageEn = `Smart Route: College Dean identity detected for (${colId.toUpperCase()}). Routed to the isolated College Strategic Deanship Dashboard.`;
      break;
      
    case "employee":
      activeSegment = "registrar";
      subTab = "admissions";
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "موظف تسجيل وقبول". تم تفعيل لوحة معالجة طلبات الطلاب والمتقدمين بالجامعة.`;
      messageEn = `Smart Route: Admissions Registrar identity detected. Activated student applications process engine.`;
      break;
      
    case "finance_staff":
      activeSegment = "executive";
      subTab = "finances";
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "موظف الإدارة المالية". تم توجيهك للخزانة المركزية وتقارير التدفق المالي بجامعة الصالحية.`;
      messageEn = `Smart Route: Finance Officer identity detected. Routed to Central Treasury and Al-Salihiyah financial dashboards.`;
      break;
      
    case "library_staff":
      activeSegment = "student"; // standard library tab under student section or similar
      subTab = "library_management_desk"; // special desk tab
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "أمين المكتبة المركزية". تم تفعيل نظام الاستعارات والمخزون المعرفي للكتب الموحد.`;
      messageEn = `Smart Route: Central Chief Librarian identity detected. Routed to unified catalogs and loans management systems.`;
      break;
      
    case "admin":
    case "super_admin":
      activeSegment = "database";
      subTab = "central_db";
      messageAr = `توجيه ذكي: تم الكشف عن الهوية "مدير أنظمة" أو "المشرف الأعلى لـ SGU". تم فتح المنصة الأمنية ومراقبة قواعد البيانات كاملة.`;
      messageEn = `Smart Route: Systems Administrator / Supreme SGU Supervisor detected. Enabled central security sandbox & full databases.`;
      break;
      
    default:
      activeSegment = "student";
      subTab = "college_portal";
      messageAr = "توجيه افتراضي: لم يتم تحديد الهوية بشكل خاص، تم توجيهك لبوابة الكلية المفتوحة.";
      messageEn = "Default Route: Identity resolved to guest, routed to main campus dashboard.";
      break;
  }
  
  return { activeSegment, subTab, messageAr, messageEn };
};
