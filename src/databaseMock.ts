export interface DatabaseUser {
  id: string;
  nameAr: string;
  nameEn: string;
  role: string;
  collegeId: string;
  email: string;
  phone: string;
  nationalId: string;
  createdAt: string;
  status: "active" | "suspended" | "pending";
  gpaOrSalary: string;
  campusBranch: string;
}

export const SGU_ROLES = [
  { id: "student", nameAr: "الطالب", nameEn: "Student", countPercent: 65 },
  { id: "faculty", nameAr: "عضو هيئة التدريس", nameEn: "Faculty Member", countPercent: 10 },
  { id: "ta", nameAr: "المعيد", nameEn: "Teaching Assistant", countPercent: 5 },
  { id: "advisor", nameAr: "المرشد الأكاديمي", nameEn: "Academic Advisor", countPercent: 2 },
  { id: "dept_head", nameAr: "رئيس القسم", nameEn: "Department Head", countPercent: 1 },
  { id: "dean", nameAr: "عميد الكلية", nameEn: "Dean of Faculty", countPercent: 0.1 },
  { id: "student_affairs", nameAr: "موظف شؤون الطلاب", nameEn: "Student Affairs Officer", countPercent: 2 },
  { id: "hr_staff", nameAr: "موظف شؤون العاملين", nameEn: "HR Officer", countPercent: 1 },
  { id: "finance_officer", nameAr: "موظف المالية", nameEn: "Financial Officer", countPercent: 1 },
  { id: "librarian", nameAr: "موظف المكتبة", nameEn: "Librarian", countPercent: 0.5 },
  { id: "housing_officer", nameAr: "موظف السكن", nameEn: "Housing Coordinator", countPercent: 0.4 },
  { id: "security_guard", nameAr: "موظف الأمن", nameEn: "Security Officer", countPercent: 2 },
  { id: "parent", nameAr: "ولي الأمر", nameEn: "Parent", countPercent: 6 },
  { id: "alumni", nameAr: "الخريج", nameEn: "Alumnus", countPercent: 3 },
  { id: "applicant", nameAr: "المتقدم الجديد", nameEn: "New Applicant", countPercent: 1.5 },
  { id: "admin", nameAr: "مسؤول النظام", nameEn: "System Administrator", countPercent: 0.4 },
  { id: "super_admin", nameAr: "Super Admin", nameEn: "Super Administrator", countPercent: 0.1 }
];

export const SGU_COLLEGES = [
  { id: "med", nameAr: "كلية الطب البشري", nameEn: "Faculty of Medicine", studentAvgGpa: 3.75, color: "text-red-400" },
  { id: "fcis", nameAr: "كلية الحاسبات والمعلومات", nameEn: "Faculty of Computer & Information Sciences", studentAvgGpa: 3.42, color: "text-emerald-400" },
  { id: "nur", nameAr: "كلية التمريض", nameEn: "Faculty of Nursing", studentAvgGpa: 3.21, color: "text-sky-400" },
  { id: "pt", nameAr: "كلية العلاج الطبيعي", nameEn: "Faculty of Physical Therapy", studentAvgGpa: 3.52, color: "text-amber-400" },
  { id: "phr", nameAr: "كلية الصيدلة", nameEn: "Faculty of Pharmacy", studentAvgGpa: 3.61, color: "text-purple-400" },
  { id: "den", nameAr: "كلية طب الأسنان", nameEn: "Faculty of Dentistry", studentAvgGpa: 3.68, color: "text-teal-400" },
  { id: "bus", nameAr: "كلية إدارة الأعمال", nameEn: "Faculty of Business Administration", studentAvgGpa: 3.15, color: "text-blue-400" }
];

// Arabic names dictionary for seeded random generator
const FIRST_NAMES = [
  "أحمد", "يوسف", "محمد", "محمود", "عمرو", "علي", "كريم", "خالد", "هاني", "مصطفى",
  "سارة", "فاطمة", "آية", "منى", "نورهان", "يسرا", "شريف", "طارق", "مريم", "إبراهيم",
  "بلال", "عمر", "حمزة", "زياد", "عبدالرحمن", "عاصم", "رنا", "ريهام", "دينا", "أمل"
];

const LAST_NAMES = [
  "خالد", "أحمد", "سليمان", "محمود", "الجندي", "الراضي", "عثمان", "زكريا", "الفيومي", "بركات",
  "منصور", "شاهين", "هلال", "الحداد", "نعمان", "الجارحي", "الشرقاوي", "الشافعي", "القاضي", "البحيري"
];

const EMAIL_DOMAINS = ["sgu.edu.eg", "faculty.sgu.edu.eg", "stud.sgu.edu.eg"];

// Seeding standard users
export function generateUsers(seed: string = "sgu_db"): DatabaseUser[] {
  const list: DatabaseUser[] = [];
  
  // Create 120 high-quality seeded records
  for (let i = 0; i < 180; i++) {
    // Deterministic random generator based on indices
    const fIdx = (i * 7 + 13) % FIRST_NAMES.length;
    const lIdx1 = (i * 3 + 29) % LAST_NAMES.length;
    const lIdx2 = (i * 11 + 7) % LAST_NAMES.length;
    
    const nameAr = `${FIRST_NAMES[fIdx]} ${LAST_NAMES[lIdx1]} ${LAST_NAMES[lIdx2]}`;
    // Simulating English Romanization
    const nameEn = `User_${i} SGU_Member`;
    
    // Distribute roles
    let roleIdx = i % SGU_ROLES.length;
    // heavily weight towards students (so let's make 60% students)
    const rollChance = i % 10;
    let role = SGU_ROLES[roleIdx].id;
    if (rollChance < 6) {
      role = "student";
    } else if (rollChance < 8) {
      role = "faculty";
    }
    
    const collegeId = SGU_COLLEGES[i % SGU_COLLEGES.length].id;
    const campusBranch = i % 5 === 0 ? "فرع الصالحية الجديدة الرئيسي" : "فرع العبور الجديد (شراكة SGU)";
    
    const serial = String(10000 + i).slice(1);
    const id = `2026SGU-${role === "student" ? "ST" : "EMP"}-${serial}`;
    
    const isEmp = role !== "student" && role !== "parent" && role !== "applicant";
    const gpaOrSalary = isEmp
      ? `${(5000 + (i * 123) % 18000).toLocaleString()} ج.م`
      : `${(2.1 + (i * 0.11) % 1.9).toFixed(2)}`;
      
    const emailDomain = role === "student" ? EMAIL_DOMAINS[2] : (role === "faculty" || role === "Ta" ? EMAIL_DOMAINS[1] : EMAIL_DOMAINS[0]);
    const cleanMail = `user_${i}_${role}@${emailDomain}`;
    
    list.push({
      id,
      nameAr,
      nameEn: nameAr.split(" ").map(n => n + " ").join(""), // mock translation
      role,
      collegeId,
      email: cleanMail,
      phone: `+20 1${(i % 3 === 0 ? "0" : (i % 3 === 1 ? "1" : "2"))}${(10000000 + i * 49231) % 99999999}`,
      nationalId: `298${String(10000000000 + i * 1928731).slice(1)}`,
      createdAt: `202${3 + (i % 4)}-0${1 + (i % 9)}-${10 + (i % 18)}`,
      status: i % 25 === 0 ? "suspended" : (i % 30 === 0 ? "pending" : "active"),
      gpaOrSalary,
      campusBranch
    });
  }
  
  return list;
}

// System-wide comprehensive DB statistics
export const SYSTEM_DB_STATS = {
  totalCount: 30052,
  activeStudents: 19420,
  facultyMembers: 1980,
  taAndStaff: 1240,
  adminsAndSecurity: 840,
  parentsAndAlumni: 6572,
  dailyOperationsLogs: 130520,
  databasePort: "3000 (Proxy Reverse Nginx)",
  activeDatabaseModel: "PostgreSQL PostgreSQL Cloud SQL Engine SGU",
  backupSnapshotId: "SGU_DB_DUMP_19_06_2026_V10",
  activeTablesCount: 112,
  dbStorageUsedGb: "128.4 GB"
};

export interface ERPChapter {
  id: number;
  title: string;
  titleEn: string;
  badge: string;
  tables: string[];
  schemaSql: string;
  fields: { name: string; type: string; desc: string }[];
  description: string;
  operationalStatus: string;
}

export const ERP_40_CHAPTERS: ERPChapter[] = [
  {
    id: 1,
    title: "التعريف بالمشروع وهيكل SGU",
    titleEn: "Project Definition & Org Structure",
    badge: "🏛️ الأساس والتنظيم",
    tables: ["sgu_university_info", "sgu_branches", "sgu_academic_regulations"],
    schemaSql: `CREATE TABLE sgu_university_info (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) DEFAULT 'جامعة الصالحية الجديدة',
  name_en VARCHAR(255) DEFAULT 'El Saleheya El Gadida University',
  accreditation_number VARCHAR(100),
  established_year INT DEFAULT 2023,
  address_text TEXT,
  cairo_offset_hours INT DEFAULT 2
);`,
    fields: [
      { name: "name_ar", type: "VARCHAR", desc: "الاسم العربي للجامعة" },
      { name: "accreditation_number", type: "VARCHAR", desc: "رقم قرار المجلس الأعلى للجامعات" },
      { name: "established_year", type: "INTEGER", desc: "سنة التأسيس والاعتماد" }
    ],
    description: "يتضمن اللوائح الاستراتيجية العامة لجامعة SGU لتنظيم الفروع والهيكل التنظيمي المعتمد من المجلس القومي للجامعات بمصر لعام 2026.",
    operationalStatus: "مكتمل في الواجهة والتحكم"
  },
  {
    id: 2,
    title: "إدارة المستخدمين والصلاحيات والمصادقة",
    titleEn: "User Identity Access Management (RBAC)",
    badge: "🔑 الأمن والمصادقة",
    tables: ["sgu_users", "sgu_roles", "sgu_sessions", "sgu_audit_logs"],
    schemaSql: `CREATE TABLE sgu_users (
  id VARCHAR(50) PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  role_id VARCHAR(30) REFERENCES sgu_roles(id),
  two_factor_secret VARCHAR(100),
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    fields: [
      { name: "password_hash", type: "VARCHAR(255)", desc: "كلمة المرور المشفرة" },
      { name: "role_id", type: "VARCHAR", desc: "كود الأدوار من 17 دور معتمد" },
      { name: "two_factor_secret", type: "VARCHAR", desc: "مفتاح التحقق الثنائي المؤقت" }
    ],
    description: "تأمين شامل والتحكم بمسؤوليات الـ 17 دوراً للمستخدمين (طالب، أستاذ، عميد، مالي، أمن، إلخ...) مع تشفير SHA-256 وسجل مراقبة العمليات.",
    operationalStatus: "مفعل ومؤمن بالصلاحيات"
  },
  {
    id: 3,
    title: "بوابة القبول للمتقدمين والمفاضلة",
    titleEn: "Admissions Gateway & Multi-branch Intake",
    badge: "🎯 القبول والترشيح",
    tables: ["sgu_admissions_applications", "sgu_requirements", "sgu_documents_vault"],
    schemaSql: `CREATE TABLE sgu_admissions_applications (
  application_no VARCHAR(50) PRIMARY KEY,
  student_national_id VARCHAR(14) UNIQUE,
  high_school_percent NUMERIC(5,2),
  preferred_college_id VARCHAR(20),
  review_status VARCHAR(30) DEFAULT 'UnderReview',
  paid_admission_fee BOOLEAN DEFAULT FALSE
);`,
    fields: [
      { name: "high_school_percent", type: "NUMERIC", desc: "مجموع الثانوية العامة الكلي" },
      { name: "preferred_college_id", type: "VARCHAR", desc: "الكلية المرغوبة الأولى" },
      { name: "review_status", type: "VARCHAR", desc: "حالة الترشيح والفرز من شؤون الطلاب" }
    ],
    description: "بوابة سحب الملفات للمستجدين ورفع المستندات (الثانوية، شهادة الميلاد) ومقارنة التنسيق الإلكتروني التلقائي وإصدار الأرقام الجامعية.",
    operationalStatus: "كاملة التشغيل ومربوطة بالمالية"
  },
  {
    id: 4,
    title: "نظام معلومات الطالب (SIS) والأقسام",
    titleEn: "Student Information System (SIS)",
    badge: "📊 بيانات الطالب",
    tables: ["sgu_student_profile", "sgu_disciplinary_records", "sgu_health_records"],
    schemaSql: `CREATE TABLE sgu_student_profile (
  student_id VARCHAR(50) PRIMARY KEY REFERENCES sgu_users(id),
  completed_credits INT DEFAULT 0,
  gpa NUMERIC(3,2) DEFAULT 0.00,
  tuition_status VARCHAR(20) DEFAULT 'paid_full',
  academic_warning_count INT DEFAULT 0
);`,
    fields: [
      { name: "completed_credits", type: "INTEGER", desc: "إجمالي الساعات المعتمدة المجتازة" },
      { name: "gpa", type: "NUMERIC(3,2)", desc: "المعدل التراكمي الإجمالي للطالب" },
      { name: "tuition_status", type: "VARCHAR", desc: "حالة سداد الرسوم السنوية" }
    ],
    description: "الحقيبة الالكترونية المركزية للطالب: السجل التأديبي، الملف الصحي، سجلات السكن والوثائق المصدقة إلكترونياً بكود الـ QR.",
    operationalStatus: "نشط ومتكامل مع الكليات"
  },
  {
    id: 5,
    title: "إدارة الكليات السبع والاعتماد الأكاديمي",
    titleEn: "Colleges Hub & Accreditation (NAQAAE)",
    badge: "🎓 كليات SGU",
    tables: ["sgu_colleges", "sgu_departments", "sgu_programs"],
    schemaSql: `CREATE TABLE sgu_colleges (
  college_id VARCHAR(20) PRIMARY KEY,
  name_ar VARCHAR(100),
  scu_accreditation_number VARCHAR(100),
  naqaae_certification_date DATE,
  required_credits INT DEFAULT 132
);`,
    fields: [
      { name: "college_id", type: "VARCHAR", desc: "اسم الكود (med, fcis, PT, etc.)" },
      { name: "required_credits", type: "INTEGER", desc: "الساعات المطلوبة للتخرج" }
    ],
    description: "بوابة الساعات المعتمدة للكليات السبع المعتمدة رسمياً بالقرار الوزاري لجامعة الصالحية الجديدة.",
    operationalStatus: "مكتملة بالكامل مع البرمجة الطبية"
  },
  {
    id: 6,
    title: "المقررات الدراسية والتوصيف الأكاديمي",
    titleEn: "Courses Curriculum & Syllabi",
    badge: "📚 اللائحة والمقررات",
    tables: ["sgu_courses", "sgu_prerequisites", "sgu_co_requisites"],
    schemaSql: `CREATE TABLE sgu_courses (
  course_code VARCHAR(15) PRIMARY KEY,
  course_name_ar VARCHAR(200),
  credit_hours INT,
  syllabus_pdf_path TEXT,
  level INT DEFAULT 1
);`,
    fields: [
      { name: "course_code", type: "VARCHAR", desc: "كود المادة بترميز مجلس الجامعة" },
      { name: "credit_hours", type: "INTEGER", desc: "عدد الساعات المعتمدة وزن المادة" }
    ],
    description: "تفاصيل نواتج التعلّم المستهدفة والمستندات الأكاديمية والمتطلبات السابقة لكل مقرر دراسي في الكليات السبع.",
    operationalStatus: "مربوطة بنظام التسجيل والدفع"
  },
  {
    id: 7,
    title: "التسجيل الأكاديمي والتسجيل والتحويل",
    titleEn: "Academic Registration & Drop-Add Engine",
    badge: "🔄 الحذف والإضافة والتحويل",
    tables: ["sgu_course_registrations", "sgu_academic_freezes", "sgu_faculty_transfers"],
    schemaSql: `CREATE TABLE sgu_course_registrations (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50),
  course_code VARCHAR(15),
  semester_code VARCHAR(10),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'registered'
);`,
    fields: [
      { name: "semester_code", type: "VARCHAR", desc: "ترم الدراسي (خريف، ربيع، صيفي)" },
      { name: "status", type: "VARCHAR", desc: "حالة القيد (مسجل، منسحب، حرمان)" }
    ],
    description: "محاكاة الحذف والإضافة، وطلبات تغيير المسار والكلية السريعة مع إعادة هيكلة وحساب الساعات المعتمدة لبرامج الكومبيوتر والمجالات الطبية.",
    operationalStatus: "نشط 100% لتحديث جداول الطلاب"
  },
  {
    id: 8,
    title: "جداول المحاضرات وحل التعارضات الزمنية",
    titleEn: "Lecture Rosters & Conflict Resolution",
    badge: "⏰ الجداول الزمنية",
    tables: ["sgu_lecture_schedules", "sgu_time_slots", "sgu_instructor_allocations"],
    schemaSql: `CREATE TABLE sgu_lecture_schedules (
  id SERIAL PRIMARY KEY,
  course_code VARCHAR(15),
  instructor_id VARCHAR(50),
  hall_id INT,
  day_of_week INT,
  start_time TIME,
  end_time TIME
);`,
    fields: [
      { name: "hall_id", type: "INTEGER", desc: "كود القاعة أو المعمل لمنع التضارب" },
      { name: "day_of_week", type: "INTEGER", desc: "يوم الأسبوع من 1 إلى 7" }
    ],
    description: "تنسيق الجداول الأكاديمية تلقائياً ومنع التعارض لضمان عدم تخصيص نفس القاعة أو الدكتور في وقتين متماثلين.",
    operationalStatus: "مدعوم بنظام تنبيه آلي"
  },
  {
    id: 9,
    title: "إدارة القاعات والمعامل والصيانة الوقائية",
    titleEn: "Halls, Laboratories & Resource Tracking",
    badge: "🔬 المعامل والقاعات",
    tables: ["sgu_halls", "sgu_equipments", "sgu_maintenance_logs"],
    schemaSql: `CREATE TABLE sgu_halls (
  hall_id SERIAL PRIMARY KEY,
  hall_name VARCHAR(100),
  capacity INT,
  hall_type VARCHAR(30) DEFAULT 'LectureHall',
  building_no VARCHAR(10)
);`,
    fields: [
      { name: "capacity", type: "INTEGER", desc: "القدرة الاستيعابية للطلاب بالقاعة" },
      { name: "hall_type", type: "VARCHAR", desc: "مسرح كبير، قاعة نقاش، معمل ذكاء اصطناعي" }
    ],
    description: "إدارة مباني SGU، قاعات التشريح ومختبرات الكومبيوتر وعيادات الأسنان المجهزة ومخططات الصيانة الدورية للأجهزة.",
    operationalStatus: "نشط"
  },
  {
    id: 10,
    title: "شؤون أعضاء هيئة التدريس والأبحاث",
    titleEn: "Academic Staff Profiler & Research Fund",
    badge: "👔 الكوادر والبحوث",
    tables: ["sgu_faculty_profiles", "sgu_scientific_papers", "sgu_grants_allocations"],
    schemaSql: `CREATE TABLE sgu_faculty_profiles (
  instructor_id VARCHAR(50) PRIMARY KEY,
  academic_rank VARCHAR(50) DEFAULT 'Professor',
  specialization VARCHAR(100),
  h_index INT DEFAULT 0,
  office_hours_text TEXT
);`,
    fields: [
      { name: "academic_rank", type: "VARCHAR", desc: "الدرجة (مدرس، أستاذ مشارك، بروفيسور)" },
      { name: "h_index", type: "INTEGER", desc: "مؤشر النشر العلمي وقيمة الأبحاث" }
    ],
    description: "إدارة أوراق المؤهلات لـ 5,000 دكتور بالجامعة، وسجلات المنح الدولية وجوائز البحار العلمية للأبحاث المصنفة Q1.",
    operationalStatus: "متكامل"
  },
  {
    id: 11,
    title: "المعيدون والمحاضرون والعبء الأكاديمي",
    titleEn: "Teaching Assistants & Workload Ledger",
    badge: "🎓 الهيئة المعاونة",
    tables: ["sgu_ta_assignments", "sgu_workload_ledger"],
    schemaSql: `CREATE TABLE sgu_ta_assignments (
  ta_id VARCHAR(50) REFERENCES sgu_users(id),
  assigned_section_id VARCHAR(50),
  weekly_hours INT,
  salary_bonus NUMERIC(10,2) DEFAULT 0.00
);`,
    fields: [
      { name: "weekly_hours", type: "INTEGER", desc: "عدد ساعات السكاشن والمراقبة" },
      { name: "salary_bonus", type: "NUMERIC", desc: "حافز إضافي للساعات الزائدة" }
    ],
    description: "تنظيم مهام وجداول المعيدين وتكليفات الإشراف على المعامل وحراسة الامتحانات.",
    operationalStatus: "نشط"
  },
  {
    id: 12,
    title: "نظام إدارة التعلم والمحاضرات (LMS)",
    titleEn: "Learning Management System (LMS) & Virtuals",
    badge: "💻 الفصول والتعليم الرقمي",
    tables: ["sgu_lms_courses", "sgu_lectures_media", "sgu_lms_forums"],
    schemaSql: `CREATE TABLE sgu_lectures_media (
  lecture_id SERIAL PRIMARY KEY,
  course_code VARCHAR(15),
  title VARCHAR(200),
  video_url TEXT,
  file_name VARCHAR(255),
  uploaded_by VARCHAR(50)
);`,
    fields: [
      { name: "video_url", type: "VARCHAR", desc: "رابط الحث الرقمي المرفوع على خادم التدفق" },
      { name: "file_name", type: "VARCHAR", desc: "محاضرة PDF المعتمدة" }
    ],
    description: "الفصول الافتراضية، وبث الفيديوهات والملفات الدراسية لجميع مواد الكليات السبع لتعظيم تجربة التعليم الهجين.",
    operationalStatus: "نشط بالكامل بمرفوعات الطلاب"
  },
  {
    id: 13,
    title: "إدارة الواجبات والفرز والتقييمات",
    titleEn: "Assignments Submission Portal",
    badge: "📝 التقييمات والواجبات",
    tables: ["sgu_assignments_meta", "sgu_submissions_ledger", "sgu_grades_draft"],
    schemaSql: `CREATE TABLE sgu_submissions_ledger (
  submission_id SERIAL PRIMARY KEY,
  assignment_id INT,
  student_id VARCHAR(50),
  file_attachment TEXT,
  submitted_time TIMESTAMP,
  feedback TEXT,
  grade NUMERIC(4,1)
);`,
    fields: [
      { name: "file_attachment", type: "TEXT", desc: "ملف التسليم (PDF, Zip)" },
      { name: "grade", type: "NUMERIC", desc: "العلامة المستحقة من الدكتور أو المعيد" }
    ],
    description: "بوابة تسليم الطالب لواجباته والمشاريع مع إخطارات بريدية تعليقاً على درجته ومحاكاة درجات الواجبات التفاعلية.",
    operationalStatus: "نشط ومربوط ببيانات الطالب"
  },
  {
    id: 14,
    title: "مشاريع التخرج والفرق البرمجية والسريرية",
    titleEn: "Senior Projects & Team Collaborations",
    badge: "🚀 مشاريع التخرج",
    tables: ["sgu_sc_projects", "sgu_project_teams", "sgu_milestones"],
    schemaSql: `CREATE TABLE sgu_sc_projects (
  project_id SERIAL PRIMARY KEY,
  project_title VARCHAR(255),
  advisor_id VARCHAR(50),
  college_id VARCHAR(20),
  final_eval_grade NUMERIC(5,2),
  github_repo TEXT
);`,
    fields: [
      { name: "project_title", type: "VARCHAR", desc: "عنوان مشروع التخرج للطلاب" },
      { name: "final_eval_grade", type: "NUMERIC", desc: "التقييم الكلي للجنة التحكيم" }
    ],
    description: "بوابة تنسيق مشاريع التخصّص وهندسة البرمجيات ومشاريع التوعية والمشورة لطلبة الطب والأسنان والصيدلة.",
    operationalStatus: "نشط"
  },
  {
    id: 15,
    title: "الامتحانات وبنوك الأسئلة والتقييم الذكي",
    titleEn: "Exams Engine, Question Bank & Proctored Tests",
    badge: "✍️ الامتحانات والتقييس",
    tables: ["sgu_exams", "sgu_question_bank", "sgu_exam_attempts"],
    schemaSql: `CREATE TABLE sgu_exams (
  exam_id SERIAL PRIMARY KEY,
  course_code VARCHAR(15),
  exam_date DATE,
  duration_minutes INT,
  questions_json JSONB,
  is_published BOOLEAN DEFAULT FALSE
);`,
    fields: [
      { name: "duration_minutes", type: "INTEGER", desc: "مدة الامتحان الكلية بالدقائق" },
      { name: "questions_json", type: "JSON", desc: "بنك الأسئلة المهيكلة والتقييم التلقائي" }
    ],
    description: "بنك شامل لأسئلة المقررات والامتحانات الفصلية وبراكتورينج الكتروني لمكافحة الغش تلقائياً بالذكاء الاصطناعي.",
    operationalStatus: "جاهز ومربوط بجداول الامتحانات"
  },
  {
    id: 16,
    title: "رصد الدرجات التفصيلي والمعدل GPA",
    titleEn: "Grades Ledger & GPA Engine",
    badge: "📈 رصد الدرجات الأكاديمية",
    tables: ["sgu_student_grades", "sgu_gpa_history"],
    schemaSql: `CREATE TABLE sgu_student_grades (
  student_id VARCHAR(50),
  course_code VARCHAR(15),
  classwork_score INT,
  practical_score INT,
  oral_score INT,
  final_score INT,
  total_score INT DEFAULT 0,
  grade_letter VARCHAR(3)
);`,
    fields: [
      { name: "classwork_score", type: "INTEGER", desc: "علامة أعمال السنة (من 40 عادة)" },
      { name: "final_score", type: "INTEGER", desc: "درجة الامتحان النهائي التحريري" },
      { name: "total_score", type: "INTEGER", desc: "المجموع الكلي للمقرر" }
    ],
    description: "لوحة درجات تفصيلية تحسب المعدل الفصلي GPA والتراكمي CGPA تلقائياً وتحدث القيمة فور تسجيل أي مادة جديدة.",
    operationalStatus: "نشط بالكامل"
  },
  {
    id: 17,
    title: "الحضور والغياب والتقنيات الرقمية QR",
    titleEn: "Card QR Transit & Face-Bio Attendance",
    badge: "📱 الحضور والغياب",
    tables: ["sgu_attendance_logs", "sgu_qr_tokens", "sgu_transit_scans"],
    schemaSql: `CREATE TABLE sgu_attendance_logs (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50),
  lecture_id INT,
  scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scanning_method VARCHAR(20) DEFAULT 'QR_Mobile',
  attendance_status VARCHAR(15) DEFAULT 'Present'
);`,
    fields: [
      { name: "scanning_method", type: "VARCHAR", desc: "طريقة التسجيل: بصمة وجه، QR، كارت ممغنط" },
      { name: "attendance_status", type: "VARCHAR", desc: "حالة حضور المحاضر (مبكر، متأخر، غياب بإنذار)" }
    ],
    description: "تطبيق بصمة وجه للطالب ورصد آلي عبر الموبايل وكبائن الحضور بالقاعات بحد حرمان أقصى 15%.",
    operationalStatus: "نشط ويعرض البصمة الفورية"
  },
  {
    id: 18,
    title: "محرك الذكاء الاصطناعي وتوصيات المواد",
    titleEn: "Artificial Intelligence & Predictive Analytics",
    badge: "🧠 الذكاء الاصطناعي",
    tables: ["sgu_ai_predictions", "sgu_course_recommendations"],
    schemaSql: `CREATE TABLE sgu_ai_predictions (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50),
  gpa_prediction NUMERIC(3,2),
  dropout_risk_index NUMERIC(3,2),
  suggested_elective_codes TEXT[],
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    fields: [
      { name: "dropout_risk_index", type: "NUMERIC", desc: "مؤشر خطورة التعثر والانسحاب المبكر" },
      { name: "suggested_elective_codes", type: "ARRAY", desc: "أكواد المواد الاختيارية الموصى بها" }
    ],
    description: "يتنبأ بالأداء المستقبلي ومقاومة التعثر ومساعدة المرشد الأكاديمي في تقديم خطط استباقية للطلبة.",
    operationalStatus: "مكتمل في محاكاة التقارير"
  },
  {
    id: 19,
    title: "المكتبة الرقمية المركزية وحجز الأوعية",
    titleEn: "Smart Library Catalog & Assets Ledger",
    badge: "📖 المكتبة الاستعارة",
    tables: ["sgu_library_books", "sgu_book_borrows", "sgu_digital_theses"],
    schemaSql: `CREATE TABLE sgu_library_books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  authors VARCHAR(255),
  isbn VARCHAR(30) UNIQUE,
  total_copies INT,
  available_copies INT
);`,
    fields: [
      { name: "isbn", type: "VARCHAR", desc: "الرقم الدولي الموحد للنسخ المعتمدة" },
      { name: "available_copies", type: "INTEGER", desc: "النسخ الرقمية والورقية المتوفرة حالياً" }
    ],
    description: "دليل حجز واستعارة رسائل الدكتوراة، وفهرس الكتب الطبي والحوسبي، وإخطار تسوية الغرامات المالية للمكتبة الجامعية.",
    operationalStatus: "نشط 100% ويحدث نسخ الكتب"
  },
  {
    id: 20,
    title: "البحث العلمي والنشر الدولي وبوابات التمويل",
    titleEn: "Academic Publishing, Q1 Journals & Grants",
    badge: "🔬 البحوث العلمية",
    tables: ["sgu_research_projects", "sgu_journal_publications", "sgu_patents"],
    schemaSql: `CREATE TABLE sgu_journal_publications (
  id SERIAL PRIMARY KEY,
  paper_title VARCHAR(255),
  lead_author_id VARCHAR(50),
  journal_name VARCHAR(150),
  impact_factor NUMERIC(5,2),
  publication_date DATE,
  fund_amount NUMERIC(12,2)
);`,
    fields: [
      { name: "impact_factor", type: "NUMERIC", desc: "عامل تأثير المجلة المعتمدة للترقية" },
      { name: "fund_amount", type: "NUMERIC", desc: "قيمة الدعم المالي المصروف من الجامعة للأبحاث" }
    ],
    description: "متابعة الميزانيات وقيمة منحة البحث العلمي المخصصة لأمراض الكبد وعلاجات الأسنان وبرمجيات الذكاء الاصطناعي.",
    operationalStatus: "نشط للأبحاث والتمويلات"
  },
  {
    id: 21,
    title: "بوابة الدراسات العليا والماجستير والدكتوراه",
    titleEn: "Postgraduate & Doctorates Board",
    badge: "🎓 الدراسات العليا",
    tables: ["sgu_pg_students", "sgu_thesis_defense"],
    schemaSql: `CREATE TABLE sgu_thesis_defense (
  defense_id SERIAL PRIMARY KEY,
  thesis_title VARCHAR(200),
  committee_members TEXT[],
  grade_assigned VARCHAR(20),
  defense_date DATE
);`,
    fields: [
      { name: "thesis_title", type: "VARCHAR", desc: "عنوان الرسالة العلمية (ماجستير/دكتوراه)" },
      { name: "committee_members", type: "ARRAY", desc: "أسماء اللجنة المحكمة والمشرفين" }
    ],
    description: "إدارة رغبات وشعب دراسات الماجستير المهني والأكاديمي والدكتوراة ببرمجيات الحاسب ومناهج كليات الطب الباطني والجراحي.",
    operationalStatus: "متكامل"
  },
  {
    id: 22,
    title: "الشؤون المالية الإلكترونية وتسوية الرسوم",
    titleEn: "Tuition, Electronic Invoices & Scholarships",
    badge: "💰 المالية والرسوم",
    tables: ["sgu_finance_ledgers", "sgu_tuition_fees", "sgu_scholarships"],
    schemaSql: `CREATE TABLE sgu_finance_ledgers (
  invoice_id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES sgu_users(id),
  item_description VARCHAR(255),
  amount_egp NUMERIC(10,2),
  paid_amount NUMERIC(10,2) DEFAULT 0.00,
  due_date DATE,
  payment_gateway_ref VARCHAR(100),
  status VARCHAR(20) DEFAULT 'unpaid'
);`,
    fields: [
      { name: "amount_egp", type: "NUMERIC", desc: "المبلغ الإجمالي بالجنيه المصري" },
      { name: "status", type: "VARCHAR", desc: "حالة السداد (مدفوعة، جزئية، متأخرة)" }
    ],
    description: "ماتشينج فوري لفواتير السداد للخدمات ومحاكاة التحصيل المربوطة بإرسال الإفادة الفورية لنظام معلومات الطالب.",
    operationalStatus: "نشط 100% مع المدفوعات التفاعلية"
  },
  {
    id: 23,
    title: "الموارد البشرية وكشوف رواتب الموظفين",
    titleEn: "Human Resources (HR) & Payroll Ledger",
    badge: "👥 الموظفون والعقود",
    tables: ["sgu_employees", "sgu_contracts", "sgu_payroll_items"],
    schemaSql: `CREATE TABLE sgu_payroll_items (
  pay_period VARCHAR(10),
  employee_id VARCHAR(50),
  base_salary NUMERIC(10,2),
  allowances NUMERIC(10,2),
  deductions NUMERIC(10,2),
  net_payable NUMERIC(10,2),
  is_disbursed BOOLEAN DEFAULT FALSE
);`,
    fields: [
      { name: "base_salary", type: "NUMERIC", desc: "الراتب الأساسي للموظف" },
      { name: "net_payable", type: "NUMERIC", desc: "صافي الراتب المستحق للصرف" }
    ],
    description: "شؤون كوادر الموظفين الإداريين، وتنظيم الإجازات السنوية، وهندسة كشوف المرتبات وربطها بالمالية.",
    operationalStatus: "نشط"
  },
  {
    id: 24,
    title: "السكن الجامعي و تسكين وتوزيع الأسرّة",
    titleEn: "Campus Dormitories & Housing Board",
    badge: "🏢 السكن الجامعي",
    tables: ["sgu_housing_buildings", "sgu_housing_allocations"],
    schemaSql: `CREATE TABLE sgu_housing_allocations (
  allocation_id SERIAL PRIMARY KEY,
  building_no VARCHAR(10),
  room_no VARCHAR(10),
  bed_no INT,
  student_id VARCHAR(50),
  allocated_date DATE,
  annual_rent NUMERIC(10,2)
);`,
    fields: [
      { name: "room_no", type: "VARCHAR", desc: "رقم الغرفة السكنية المخصصة للطالب" },
      { name: "annual_rent", type: "NUMERIC", desc: "تكلفة السكن السنوية المضافة للمالية" }
    ],
    description: "تسكين المغتربين والطلبة الدوليين وحساب التغذية وتخصيص الغرف وصيانة المعدات والأجهزة السكنية.",
    operationalStatus: "نشط ويعرض حالة الأسرّة"
  },
  {
    id: 25,
    title: "النقل الجامعي وتتبع مسارات الحافلات GPS",
    titleEn: "Bus Fleets, Drivers & GPS Telemetry",
    badge: "🚌 حافلات SGU",
    tables: ["sgu_bus_fleets", "sgu_bus_stops", "sgu_bus_subscriptions"],
    schemaSql: `CREATE TABLE sgu_bus_fleets (
  bus_id VARCHAR(20) PRIMARY KEY,
  driver_name VARCHAR(100),
  driver_phone VARCHAR(20),
  gps_latitude NUMERIC(9,6),
  gps_longitude NUMERIC(9,6),
  capacity INT,
  subscribers_count INT DEFAULT 0
);`,
    fields: [
      { name: "gps_latitude", type: "NUMERIC", desc: "إحداثيات خط العرض من التتبع مأخوذ من الجوال" },
      { name: "subscribers_count", type: "INTEGER", desc: "عدد المشتركين الفعلي بالحافلة" }
    ],
    description: "إدارة خطوط حافلات SGU لنقل الطلاب من القاهرة، الزقازيق، والمنصورة إلى الحرم بالصالحية وتتبع GPS فوري.",
    operationalStatus: "نشط ومربوط ببيانات الطالب"
  },
  {
    id: 26,
    title: "العيادة الطبية الجامعية والسجلات الطبية للطلاب",
    titleEn: "Smart University Clinic & Health Ledger",
    badge: "🩺 النظم الطبية والعيادة",
    tables: ["sgu_clinic_visits", "sgu_prescriptions_ledger", "sgu_vaccines_log"],
    schemaSql: `CREATE TABLE sgu_clinic_visits (
  visit_id SERIAL PRIMARY KEY,
  student_id VARCHAR(50),
  diagnosed_condition VARCHAR(150),
  urgency_level VARCHAR(20) DEFAULT 'Normal',
  prescribed_medications TEXT,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    fields: [
      { name: "diagnosed_condition", type: "VARCHAR", desc: "التشخيص الطبي السريري للحالة" },
      { name: "urgency_level", type: "VARCHAR", desc: "مستوى الخطورة (طوارئ عاجلة، كشف دوري)" }
    ],
    description: "بوابة العيادة المركزية لحفظ التاريخ المرضي للطلاب والتلقيحات الإلزامية وعمليات الطوارئ الفورية.",
    operationalStatus: "نشط ومترجم بالكامل"
  },
  {
    id: 27,
    title: "الأمن والسلامة وتصاريح البوابات والكاميرات",
    titleEn: "Campus Security, Gate Badges & CCTV",
    badge: "🛡️ الأمن والتصاريح",
    tables: ["sgu_security_permits", "sgu_visitor_logs", "sgu_incident_reports"],
    schemaSql: `CREATE TABLE sgu_security_permits (
  badge_id VARCHAR(50) PRIMARY KEY,
  holder_id VARCHAR(50),
  permit_type VARCHAR(30) DEFAULT 'CarGatePass',
  is_active BOOLEAN DEFAULT TRUE,
  expires_at DATE
);`,
    fields: [
      { name: "permit_type", type: "VARCHAR", desc: "نوع التصريح (دخول سيارة، دخول معمل الأبحاث، إلخ)" },
      { name: "expires_at", type: "DATE", desc: "تاريخ انتهاء صلاحية الكارت الذكي" }
    ],
    description: "رصد دخول وخروج الزوار والمركبات وتوثيق تقارير الحوادث والتصاريح الرقمية عبر البوابات الأمنية الممغنطة.",
    operationalStatus: "نشط"
  },
  {
    id: 28,
    title: "بوابة الخريجين والتحقق من الشهادات والتوظيف",
    titleEn: "Alumni Directory & Verification Lock",
    badge: "🎓 كادير الخريجين والتوظيف",
    tables: ["sgu_alumni_profiles", "sgu_verified_credentials"],
    schemaSql: `CREATE TABLE sgu_verified_credentials (
  verification_hash VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(50),
  graduation_year INT,
  degree_title VARCHAR(150),
  accredited_gpa NUMERIC(3,2),
  smart_qr_code_ref TEXT
);`,
    fields: [
      { name: "verification_hash", type: "VARCHAR(64)", desc: "كود التشفير للتأكد من هوية الشهادة ومنع التزوير" },
      { name: "graduation_year", type: "INTEGER", desc: "عام تخرج الطالب ودفعته" }
    ],
    description: "بوابة للوزارات والشركات للتحقق ومصادقة شهادات تخرج طلاب SGU عبر الـ QR وفتح شبكات توظيف لخريجينا.",
    operationalStatus: "كامل التكويد وبإفادة تخرج"
  },
  {
    id: 29,
    title: "بوابة أولياء الأمور ورصد التقدم",
    titleEn: "Parents Portal & Progress Tracking",
    badge: "👨‍👩‍👦 بوابة أولياء الأمور",
    tables: ["sgu_parent_link", "sgu_tuition_orders"],
    schemaSql: `CREATE TABLE sgu_parent_link (
  parent_id VARCHAR(50),
  student_id VARCHAR(50),
  relationship_type VARCHAR(20) DEFAULT 'Father',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (parent_id, student_id)
);`,
    fields: [
      { name: "relationship_type", type: "VARCHAR", desc: "صلة القرابة (أب، أم، وصي شرعي)" },
      { name: "notifications_enabled", type: "BOOLEAN", desc: "استقبال تنبيه السلوك والدرجات فورياً" }
    ],
    description: "نظام خاص لمتابعة أولياء الأمور لحضور أبنائهم بـ SGU، ورصد درجات ومعدل GPA ودفع المصاريف مباشرة.",
    operationalStatus: "نشط ويعرض الإشارات الأكاديمية"
  },
  {
    id: 30,
    title: "نظام التنبيهات والاتصالات وبدائل النقل",
    titleEn: "Internal Messaging & SMS Gateway",
    badge: "✉️ الإشعارات والاتصال",
    tables: ["sgu_internal_messages", "sgu_notifications_ledger", "sgu_sms_queue"],
    schemaSql: `CREATE TABLE sgu_sms_queue (
  id SERIAL PRIMARY KEY,
  recipient_phone VARCHAR(20),
  message_content TEXT,
  sent_status VARCHAR(20) DEFAULT 'Pending',
  retry_count INT DEFAULT 0
);`,
    fields: [
      { name: "recipient_phone", type: "VARCHAR", desc: "هاتف المستقبل لرسائل الـ SMS" },
      { name: "message_content", type: "TEXT", desc: "محتوى الرسالة النصية الموجهة للمستخدم" }
    ],
    description: "توجيه تنبيهات فورية بالبريد والـ SMS للهواتف، والرسائل الداخلية والجروبات الأكاديمية لتبادل الأبحاث.",
    operationalStatus: "نشط"
  },
  {
    id: 31,
    title: "نظام التقارير الأكاديمية والإحصائية المؤتمتة",
    titleEn: "Academic Reports & Automated PDF Engine",
    badge: "📊 التقارير الأكاديمية",
    tables: ["sgu_report_templates", "sgu_generated_reports_log"],
    schemaSql: `CREATE TABLE sgu_generated_reports_log (
  report_id SERIAL PRIMARY KEY,
  requester_id VARCHAR(50),
  report_type VARCHAR(50) DEFAULT 'Transcript',
  generation_params JSON,
  pdf_storage_url TEXT
);`,
    fields: [
      { name: "report_type", type: "VARCHAR", desc: "نوع الكشف (درجات، حضور، تقييس، ميزانية)" },
      { name: "pdf_storage_url", type: "TEXT", desc: "مسار تخزين الملف المطبوع الكترونياً" }
    ],
    description: "مولد التقارير الشامل للإدارة وشؤون الطلاب لطباعة بيانات السجل الدراسي وكتاب الكلية والمجلس الجامعي.",
    operationalStatus: "نشط"
  },
  {
    id: 32,
    title: "لوحة تحكم مؤشرات الأداء الكبرى القيادية",
    titleEn: "Executive KPI Dashboard & Real-time Metrics",
    badge: "📈 مؤشرات القيادة الـ KPI",
    tables: ["sgu_kpi_metrics", "sgu_snapshot_history"],
    schemaSql: `CREATE TABLE sgu_kpi_metrics (
  metric_id VARCHAR(50) PRIMARY KEY,
  metric_value NUMERIC(15,2),
  target_value NUMERIC(15,2),
  deviation_index NUMERIC(5,2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    fields: [
      { name: "metric_id", type: "VARCHAR", desc: "معرف المؤشر (مثال: gpa_average, enrollment_rate)" },
      { name: "deviation_index", type: "NUMERIC", desc: "معامل الانحراف عن الخطط والموازنات" }
    ],
    description: "صورة شاملة فورية لكبار الإدارة ومجلس الجامعة لرصد ميزانيات SGU ونسب التسرب والغياب والتوجه العام.",
    operationalStatus: "نشط 100% بالتحليلات الحية"
  },
  {
    id: 33,
    title: "بوابات الدفع والتكاملات البرمجية LMS",
    titleEn: "Payment Gateways & API Ecosystem Integrations",
    badge: "⚙️ الربط والـ APIs",
    tables: ["sgu_payment_gateway_logs", "sgu_oauth_configurations"],
    schemaSql: `CREATE TABLE sgu_payment_gateway_logs (
  transaction_id VARCHAR(100) PRIMARY KEY,
  gateway_name VARCHAR(50) DEFAULT 'Fawry_Egypt',
  amount_collected NUMERIC(10,2),
  response_code VARCHAR(10)
);`,
    fields: [
      { name: "gateway_name", type: "VARCHAR", desc: "بوابة الربط (فوري، ميزة، فيزا، ماستركارد، بنك مصر)" },
      { name: "response_code", type: "VARCHAR", desc: "كود الاسترداد وتأكيد التسوية من Fawry API" }
    ],
    description: "بوابة الدمج لـ MS 365, Google Workspaces ومحاكاة الربط مع أنظمة التعليم عن بعد وبصمة فواتير البنوك وصرف الرواتب.",
    operationalStatus: "نشط"
  },
  {
    id: 34,
    title: "تشفير البيانات والنسخ الاحتياطي السحابي",
    titleEn: "Data Cryptography & Backup Recovery",
    badge: "🔒 الأمان والتشفير",
    tables: ["sgu_backups_metadata", "sgu_encryption_keys"],
    schemaSql: `CREATE TABLE sgu_backups_metadata (
  backup_id VARCHAR(100) PRIMARY KEY,
  backup_size_bytes BIGINT,
  storage_bucket_url TEXT,
  checksum_sha256 VARCHAR(64),
  completed_at TIMESTAMP
);`,
    fields: [
      { name: "backup_id", type: "VARCHAR", desc: "معرف النسخة الاحتياطية السحابية" },
      { name: "checksum_sha256", type: "VARCHAR", desc: "هاش التثبت لسلامة النسخة المرفوعة" }
    ],
    description: "تشفير وحماية سرية بيانات الطلاب واللوائح وعملاء الـ ERP ببروتوكولات التخزين والمزامنة السحابية اليومية.",
    operationalStatus: "كامل التفعيل"
  },
  {
    id: 35,
    title: "البنية التحتية والربط الشبكي المتعدد النطاق",
    titleEn: "Cloud Architecture & Server Ingress Monitoring",
    badge: "🌐 نظام السيرفرات",
    tables: ["sgu_server_nodes", "sgu_traffic_logs"],
    schemaSql: `CREATE TABLE sgu_server_nodes (
  ip_address VARCHAR(45) PRIMARY KEY,
  node_role VARCHAR(30) DEFAULT 'WebAppFrontend',
  average_cpu_load NUMERIC(5,2),
  online_status BOOLEAN DEFAULT TRUE,
  ping_latency_ms INT
);`,
    fields: [
      { name: "ip_address", type: "VARCHAR", desc: "عنوان الشبكة الداخلي للمخدم" },
      { name: "ping_latency_ms", type: "INTEGER", desc: "سرعة زمن الاستجابة لمقاومة الضغط" }
    ],
    description: "توزيع الأحمال وضمان التشغيل الفوري لخوادم SGU المستضافة على Cloud Run وموازنات الحوسبة المركزية.",
    operationalStatus: "مفعل فوري بجدار ناري"
  },
  {
    id: 36,
    title: "محرك ربط موقع الويب وتطبيقات الهاتف والجوال",
    titleEn: "Web Portal, Mobile Apps API Ingress",
    badge: "📱 التطبيقات والجوال",
    tables: ["sgu_api_keys", "sgu_mobile_push_tokens"],
    schemaSql: `CREATE TABLE sgu_api_keys (
  client_id VARCHAR(100) PRIMARY KEY,
  secret_hash VARCHAR(64),
  client_type VARCHAR(20) DEFAULT 'AndroidStudentApp',
  api_requests_quota INT DEFAULT 500000
);`,
    fields: [
      { name: "client_id", type: "VARCHAR", desc: "معرف العميل (اندرويد، ايفون، لوحة ادارة)" },
      { name: "api_requests_quota", type: "INTEGER", desc: "كوتة استهلاك الـ Endpoint اليومية" }
    ],
    description: "دمج متناسق مع تطبيقات يوسف خالد للجوال والأندرويد وبث إشعارات الدفع والواجبات وإصدار هويات الطلاب الرقمية.",
    operationalStatus: "جاهز للمزامنة"
  },
  {
    id: 37,
    title: "مخزن البيانات والمستودع التحليلي للذكاء BI",
    titleEn: "SGU Data Warehousing & OLAP Business Intelligence",
    badge: "⚙️ مستودع البيانات",
    tables: ["sgu_dw_fact_enrolment", "sgu_dw_dim_colleges", "sgu_dw_dim_time"],
    schemaSql: `CREATE TABLE sgu_dw_fact_enrolment (
  dw_id SERIAL PRIMARY KEY,
  student_key INT,
  college_key INT,
  time_key INT,
  term_gpa NUMERIC(3,2),
  fees_billed NUMERIC(12,2),
  fees_paid NUMERIC(12,2)
);`,
    fields: [
      { name: "student_key", type: "INTEGER", desc: "المفتاح البعدي لسجلات الطالب" },
      { name: "fees_billed", type: "NUMERIC", desc: "الفواتير المالية المفوترة للعام" }
    ],
    description: "مستودع تحليلي متقدم OLAP يجمع البيانات التاريخية لدلائل ومؤشرات نجاح المناهج على مدى خمس سنوات ماضية لـ SGU.",
    operationalStatus: "نشط بالتحليلات الكبرى"
  },
  {
    id: 38,
    title: "وحدات الجودة وضمان الاعتماد والاختبارات الشاملة",
    titleEn: "Quality Assurance, Unit & Load Testing Suite",
    badge: "🧪 الجودة وضمان الكفاءة",
    tables: ["sgu_qa_inspections", "sgu_course_feedback_polls"],
    schemaSql: `CREATE TABLE sgu_course_feedback_polls (
  poll_id SERIAL PRIMARY KEY,
  course_code VARCHAR(15),
  student_id VARCHAR(50),
  feedback_score_stars INT CHECK (feedback_score_stars BETWEEN 1 AND 5),
  written_comments TEXT
);`,
    fields: [
      { name: "course_code", type: "VARCHAR", desc: "المادة الخاضعة لتقييم جودة التدريس" },
      { name: "feedback_score_stars", type: "INTEGER", desc: "نتيجة رضا الطالب عن أداء الدكتور والمنهج" }
    ],
    description: "استطلاعات رأي شاملة من الطلاب لتقييم المحتوى ومستوى الرضا لتأهيل كلية الحاسبات والطب للاعتمادات الدورية.",
    operationalStatus: "نشط 100%"
  },
  {
    id: 39,
    title: "التشغيل والتشخيص وإصلاح الأعطال الطارئة",
    titleEn: "System Health Operations & Diagnosis logs",
    badge: "🛠️ الصيانة والتشخيص",
    tables: ["sgu_system_err_logs", "sgu_technical_tickets"],
    schemaSql: `CREATE TABLE sgu_system_err_logs (
  err_id SERIAL PRIMARY KEY,
  subsystem_name VARCHAR(50),
  err_message TEXT,
  severity VARCHAR(10) DEFAULT 'ERROR',
  occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    fields: [
      { name: "subsystem_name", type: "VARCHAR", desc: "اسم النظام الفرعي الذي واجه خللاً" },
      { name: "err_message", type: "TEXT", desc: "السبب أو رسالة الخطأ لتوجيه المطور" }
    ],
    description: "تسجيل فوري للأخطاء البرمجية وخوادم الـ API لضمان استجابة وتوافر 99.99% لقمر نظام SGU UniPilot ERP.",
    operationalStatus: "نشط ويراقب الأخطاء"
  },
  {
    id: 40,
    title: "التوسع المستقبلي والمؤسسات المتعددة SaaS",
    titleEn: "Multi-Tenancy SaaS & Future Cloud Scaling",
    badge: "🚀 التوسع المستقبلي",
    tables: ["sgu_tenants_info", "sgu_cloud_scaling_plans"],
    schemaSql: `CREATE TABLE sgu_tenants_info (
  tenant_id VARCHAR(50) PRIMARY KEY,
  university_alias VARCHAR(100),
  custom_domain VARCHAR(100),
  active_license_key VARCHAR(100),
  license_expiry DATE
);`,
    fields: [
      { name: "university_alias", type: "VARCHAR", desc: "اسم المؤسسة الجديدة المنضمة للنظام المستقل" },
      { name: "license_expiry", type: "DATE", desc: "تاريخ انتهاء عقد الترخيص السحابي" }
    ],
    description: "توسيع مهيكلة النظام ليدعم فروع جامعة الصالحية الجديدة والجامعات الشقيقة بنظام SaaS متعدد السحائب والمستأجرين.",
    operationalStatus: "مخطط ومهيكل هندسياً"
  }
];
