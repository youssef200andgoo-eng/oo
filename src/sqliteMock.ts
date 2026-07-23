export interface SQLiteTableDef {
  tableName: string;
  descriptionAr: string;
  descriptionEn: string;
  createScript: string;
  columns: { name: string; type: string; constraints?: string; desc: string }[];
  rows: Record<string, any>[];
}

export const SGU_SQLITE_COLLEGES = [
  { id: 1, name_ar: "كلية الطب البشري", name_en: "Faculty of Medicine", code: "MED", dean_name: "أ.د. حسام الجوهري", established_year: 2023, location: "مبنى أ - الدور الرابع", contact_email: "medicine.dean@sgu.edu.eg", contact_phone: "+20 1011110022" },
  { id: 2, name_ar: "كلية الحاسبات والمعلومات", name_en: "Faculty of Computer & Information Sciences", code: "CS", dean_name: "أ.د. يوسف خالد", established_year: 2023, location: "مبنى ب - الطابق الثاني", contact_email: "cs.dean@sgu.edu.eg", contact_phone: "+20 1022220033" },
  { id: 3, name_ar: "كلية إدارة الأعمال", name_en: "Faculty of Business Administration", code: "BUS", dean_name: "أ.د. يمنى منير", established_year: 2024, location: "مبنى ج - الدور الأول", contact_email: "business.dean@sgu.edu.eg", contact_phone: "+20 1033330044" },
  { id: 4, name_ar: "كلية الصيدلة", name_en: "Faculty of Pharmacy", code: "PHR", dean_name: "أ.د. رانيا الشناوي", established_year: 2023, location: "مبنى د - الطابق الأرضي", contact_email: "pharmacy.dean@sgu.edu.eg", contact_phone: "+20 1044440055" },
  { id: 5, name_ar: "كلية طب الأسنان", name_en: "Faculty of Dentistry", code: "DEN", dean_name: "أ.د. مراد السيوفي", established_year: 2024, location: "مبنى هـ - الطابق الثالث ورش العمل", contact_email: "dentistry.dean@sgu.edu.eg", contact_phone: "+20 1055550066" },
  { id: 6, name_ar: "كلية العلاج الطبيعي", name_en: "Faculty of Physical Therapy", code: "PT", dean_name: "أ.د. عزمي عبدالمولى", established_year: 2024, location: "مبنى و - الصالة العلاجية الكبرى", contact_email: "pt.dean@sgu.edu.eg", contact_phone: "+20 1066660077" },
  { id: 7, name_ar: "كلية التمريض", name_en: "Faculty of Nursing", code: "NUR", dean_name: "أ.د. ميرفت الرفاعي", established_year: 2024, location: "مبنى ز - الطابق الأول", contact_email: "nursing.dean@sgu.edu.eg", contact_phone: "+20 1077770088" }
];

export const SGU_SQLITE_DEPARTMENTS = [
  { id: 1, college_id: 1, name_ar: "الترشيح والتشريح البشري", name_en: "Human Anatomy", code: "MED-ANA", head_name: "د. سامي الجارحي" },
  { id: 2, college_id: 1, name_ar: "علم وظائف الأعضاء", name_en: "Physiology", code: "MED-PHY", head_name: "د. نجوى فريد" },
  { id: 3, college_id: 2, name_ar: "علوم الحاسب", name_en: "Computer Science", code: "CS-CS", head_name: "د. محمود سليمان" },
  { id: 4, college_id: 2, name_ar: "هندسة البرمجيات", name_en: "Software Engineering", code: "CS-SE", head_name: "د. آية الراضي" },
  { id: 5, college_id: 2, name_ar: "نظام المعلومات الكلي", name_en: "Information Systems", code: "CS-IS", head_name: "د. طارق الشافعي" },
  { id: 6, college_id: 3, name_ar: "إدارة الأعمال والتمويل", name_en: "Business & Finance", code: "BUS-MGT", head_name: "د. يسرا البحيري" },
  { id: 7, college_id: 3, name_ar: "المحاسبة المتقدمة", name_en: "Advanced Accounting", code: "BUS-ACC", head_name: "د. شريف القاضي" },
  { id: 8, college_id: 4, name_ar: "الصيدلانيات وتكنولوجيا الصيدلة", name_en: "Pharmaceutics", code: "PHR-PHR", head_name: "د. رنا الجندي" },
  { id: 9, college_id: 5, name_ar: "جراحة الفم واللثة", name_en: "Oral Surgery", code: "DEN-SUR", head_name: "د. زياد هلال" },
  { id: 10, college_id: 6, name_ar: "تأهيل العظام والعمود الفقري", name_en: "Orthopedic Rehab", code: "PT-ORT", head_name: "د. عاصم الشرقاوي" }
];

export const SGU_SQLITE_ACADEMIC_YEARS = [
  { id: 1, year_name: "العام الأكاديمي 2024-2025", start_date: "2024-09-15", end_date: "2025-06-30", status: "completed" },
  { id: 2, year_name: "العام الأكاديمي الحالي 2025-2026", start_date: "2025-09-14", end_date: "2026-06-25", status: "active" }
];

export const SGU_SQLITE_SEMESTERS = [
  { id: 1, academic_year_id: 2, semester_name: "الفصل الدراسي الأول (الخريف)", start_date: "2025-09-14", end_date: "2026-01-20", registration_start: "2025-09-01", registration_end: "2025-09-12", status: "completed" },
  { id: 2, academic_year_id: 2, semester_name: "الفصل الدراسي الحالي (الربيع)", start_date: "2026-02-08", end_date: "2026-06-18", registration_start: "2026-01-25", registration_end: "2026-02-06", status: "active" },
  { id: 3, academic_year_id: 2, semester_name: " الفصل الدراسي الصيفي المفتوح (Summer)", start_date: "2026-07-05", end_date: "2026-08-25", registration_start: "2026-06-20", registration_end: "2026-07-02", status: "upcoming" }
];

export const SGU_SQLITE_STUDENTS = [
  { id: 1, student_id: "2026-ST-001", national_id: "29801021405934", first_name: "يوسف", last_name: "خالد", full_name_ar: "يوسف خالد سليمان", email: "yousef.stud@sgu.edu.eg", phone: "+20 1021415050", gender: "Male", birth_date: "1998-10-15", address: "الشرقية - الزقازيق حي الكوثر", college_id: 2, department_id: 4, academic_year_id: 2, semester_id: 2, enrollment_date: "2023-09-15", status: "active", gpa: 3.82, total_credits: 132, completed_credits: 96, tuition_fees: 55000.0, paid_fees: 55000.0 },
  { id: 2, student_id: "2026-ST-002", national_id: "29903121503923", first_name: "مريم", last_name: "بركات", full_name_ar: "مريم بركات القاضي", email: "maryam.stud@sgu.edu.eg", phone: "+20 1149231201", gender: "Female", birth_date: "1999-03-12", address: "الشرقية - الصالحية الجديدة مجاورة 12", college_id: 1, department_id: 1, academic_year_id: 2, semester_id: 2, enrollment_date: "2023-09-15", status: "active", gpa: 3.94, total_credits: 180, completed_credits: 120, tuition_fees: 85000.0, paid_fees: 42500.0 },
  { id: 3, student_id: "2026-ST-003", national_id: "30005081804921", first_name: "كريم", last_name: "البحيري", full_name_ar: "كريم البحيري غالي", email: "karim.stud@sgu.edu.eg", phone: "+20 1284920192", gender: "Male", birth_date: "2000-05-08", address: "الدقهلية - المنصورة المشاية", college_id: 3, department_id: 6, academic_year_id: 2, semester_id: 2, enrollment_date: "2024-09-15", status: "active", gpa: 3.12, total_credits: 128, completed_credits: 64, tuition_fees: 40000.0, paid_fees: 40000.0 },
  { id: 4, student_id: "2026-ST-004", national_id: "30107191204918", first_name: "نورهان", last_name: "شاهين", full_name_ar: "نورهان شاهين هلال", email: "nourhan.stud@sgu.edu.eg", phone: "+20 1092381284", gender: "Female", birth_date: "2001-07-19", address: "القاهرة - مصر الجديدة شارع الأهرام", college_id: 5, department_id: 9, academic_year_id: 2, semester_id: 2, enrollment_date: "2023-09-15", status: "active", gpa: 3.65, total_credits: 170, completed_credits: 102, tuition_fees: 72000.0, paid_fees: 72000.0 },
  { id: 5, student_id: "2026-ST-005", national_id: "30008031502931", first_name: "زياد", last_name: "نعمان", full_name_ar: "زياد نعمان الجندي", email: "ziad.stud@sgu.edu.eg", phone: "+20 1550921029", gender: "Male", birth_date: "2000-08-03", address: "الإسماعيلية - الشيخ زايد مج تالت", college_id: 4, department_id: 8, academic_year_id: 2, semester_id: 2, enrollment_date: "2023-09-15", status: "suspended", gpa: 2.34, total_credits: 140, completed_credits: 78, tuition_fees: 60000.0, paid_fees: 15000.0 },
  { id: 6, student_id: "2026-ST-006", national_id: "30209111409381", first_name: "سارة", last_name: "الحداّد", full_name_ar: "سارة الحداد زكريا", email: "sara.stud@sgu.edu.eg", phone: "+20 1019283742", gender: "Female", birth_date: "2002-09-11", address: "الشرقية - الصالحية الجديدة حي النور", college_id: 2, department_id: 4, academic_year_id: 2, semester_id: 2, enrollment_date: "2024-09-15", status: "active", gpa: 3.51, total_credits: 132, completed_credits: 66, tuition_fees: 55000.0, paid_fees: 55000.0 }
];

export const SGU_SQLITE_PROFESSORS = [
  { id: 1, professor_id: "EMP-PRF-001", national_id: "27005081203948", first_name: "سامي", last_name: "الجارحي", full_name_ar: "د. سامي الجارحي هلال", email: "s.garhi@sgu.edu.eg", phone: "+20 1029341029", gender: "Male", birth_date: "1970-05-08", address: "القاهرة - التجمع الخامس", college_id: 1, department_id: 1, specialization: "التشريح الدقيق والأنسجة", degree: "Ph.D. in Medicine (Edin)", hire_date: "2023-06-15", status: "active", salary: 28000.0, office_location: "مبنى طب - مكتب 202" },
  { id: 2, professor_id: "EMP-PRF-002", national_id: "27802111405948", first_name: "محمود", last_name: "سليمان", full_name_ar: "د. محمود سليمان بركات", email: "m.soliman@sgu.edu.eg", phone: "+20 1149301928", gender: "Male", birth_date: "1978-02-11", address: "الشرقية - الزقازيق كفور الغراب", college_id: 2, department_id: 3, specialization: "هندسة الخوارزميات وتنقيب البيانات", degree: "Ph.D. in CS (Manchester)", hire_date: "2023-07-01", status: "active", salary: 22000.0, office_location: "مبنى حاسبات - مكتب 103" },
  { id: 3, professor_id: "EMP-PRF-003", national_id: "28203151309283", first_name: "يسرا", last_name: "البحيري", full_name_ar: "د. يسرا البحيري عثمان", email: "y.behairi@sgu.edu.eg", phone: "+20 1283921029", gender: "Female", birth_date: "1982-03-15", address: "الدقهلية - المنصورة شارع النخلة", college_id: 3, department_id: 6, specialization: "الإدارة الاستراتيجية الدولية", degree: "Ph.D. in Business (LSE)", hire_date: "2024-01-10", status: "active", salary: 18000.0, office_location: "مبنى إدارة - مكتب 14" }
];

export const SGU_SQLITE_COURSES = [
  { id: 1, course_code: "MED-101", course_name_ar: "التشريح الوصفي للجهاز الحركي", course_name_en: "Anatomy of Musculoskeletal System", college_id: 1, department_id: 1, credits: 4, hours_per_week: 5, semester_id: 2, academic_year_id: 2, prerequisites: "None", description: "شرح واف لتشريح العظام والمفاصل والعضلات للجذع والأطراف لجسم الإنسان", course_type: "theoretical_and_practical", max_students: 120 },
  { id: 2, course_code: "CS-211", course_name_ar: "هياكل وتراكيب البيانات الكبرى", course_name_en: "Advanced Data Structures", college_id: 2, department_id: 3, credits: 3, hours_per_week: 4, semester_id: 2, academic_year_id: 2, prerequisites: "CS-101", description: "دراسة وتطبيق تراكيب البيانات الشجرية والمكدسات والرسومات الخوارزمية", course_type: "theoretical_and_practical", max_students: 80 },
  { id: 3, course_code: "BUS-302", course_name_ar: "إدارة المؤسسات والسلوك التنظيمي", course_name_en: "Organizational Behavior", college_id: 3, department_id: 6, credits: 3, hours_per_week: 3, semester_id: 2, academic_year_id: 2, prerequisites: "None", description: "تحليل نفسية الأفراد وتوجيه السلوك البشري داخل الهياكل الادارية الكبرى", course_type: "theoretical", max_students: 150 }
];

export const SGU_SQLITE_COURSE_SECTIONS = [
  { id: 1, course_id: 1, section_number: "SEC-A1", professor_id: 1, max_capacity: 50, current_enrolled: 42, schedule_days: "أحد، ثلاثاء", schedule_time: "09:00 - 11:00", room: "مدرج د. سامي" },
  { id: 2, course_id: 2, section_number: "SEC-B1", professor_id: 2, max_capacity: 40, current_enrolled: 38, schedule_days: "إثنين، أربعاء", schedule_time: "11:00 - 13:00", room: "معمل الكمبيوتر 4" },
  { id: 3, course_id: 3, section_number: "SEC-C1", professor_id: 3, max_capacity: 60, current_enrolled: 55, schedule_days: "خميس", schedule_time: "10:00 - 13:00", room: "قاعة سيمينار إدارة" }
];

export const SGU_SQLITE_ENROLLMENTS = [
  { id: 1, student_id: 2, course_id: 1, section_id: 1, semester_id: 2, enrollment_date: "2026-02-07", status: "active", grade: "A", grade_points: 4.0, attendance_percent: 94.2 },
  { id: 2, student_id: 1, course_id: 2, section_id: 2, semester_id: 2, enrollment_date: "2026-02-07", status: "active", grade: "A-", grade_points: 3.7, attendance_percent: 96.5 },
  { id: 3, student_id: 6, course_id: 2, section_id: 2, semester_id: 2, enrollment_date: "2026-02-07", status: "active", grade: "B+", grade_points: 3.3, attendance_percent: 88.0 }
];

export const SGU_SQLITE_GRADES = [
  { id: 1, enrollment_id: 1, student_id: 2, course_id: 1, semester_id: 2, midterm_grade: 18.5, final_grade: 55.0, practical_grade: 19.0, quiz_grade: 4.5, homework_grade: 5.0, total_grade: 92.5, grade_letter: "A", grade_points: 4.0, entered_by: 1, entry_date: "2026-06-18" },
  { id: 2, enrollment_id: 2, student_id: 1, course_id: 2, semester_id: 2, midterm_grade: 19.0, final_grade: 51.0, practical_grade: 17.5, quiz_grade: 4.0, homework_grade: 4.5, total_grade: 85.0, grade_letter: "A-", grade_points: 3.7, entered_by: 2, entry_date: "2026-06-18" }
];

export const SGU_SQLITE_ATTENDANCE = [
  { id: 1, enrollment_id: 1, student_id: 2, course_id: 1, section_id: 1, date: "2026-05-12", status: "Present", notes: "مشاركتها ممتازة في المعمل الطبي" },
  { id: 2, enrollment_id: 2, student_id: 1, course_id: 2, section_id: 2, date: "2026-05-12", status: "Present", notes: "حاضر مبكراً" },
  { id: 3, enrollment_id: 3, student_id: 6, course_id: 2, section_id: 2, date: "2026-05-12", status: "Absent", notes: "تغيبت بعذر مرضي معتمد" }
];

export const SGU_SQLITE_EXAMS_SCHEDULE = [
  { id: 1, course_id: 1, semester_id: 2, exam_type: "Final Written Exam", exam_date: "2026-06-12", exam_time: "09:00 - 12:00", duration_minutes: 180, room: "مدرج د. سامي" },
  { id: 2, course_id: 2, semester_id: 2, exam_type: "Final Practical", exam_date: "2026-06-15", exam_time: "10:00 - 12:00", duration_minutes: 120, room: "معمل الكمبيوتر 4" }
];

export const SGU_SQLITE_TUITION_FEES = [
  { id: 1, student_id: 1, semester_id: 2, amount: 27500.0, due_date: "2026-02-15", paid_amount: 27500.0, payment_date: "2026-02-10", payment_method: "Fawry Pay", status: "paid" },
  { id: 2, student_id: 2, semester_id: 2, amount: 42500.0, due_date: "2026-02-15", paid_amount: 21250.0, payment_date: "2026-02-12", payment_method: "Credit Card (CIB API)", status: "partial" },
  { id: 3, student_id: 5, semester_id: 2, amount: 30000.0, due_date: "2026-02-15", paid_amount: 0.0, payment_date: "", payment_method: "None", status: "unpaid" }
];

export const SGU_SQLITE_ADMIN_USERS = [
  { id: 1, username: "youssef_admin", password: "encrypted_abc", full_name: "المهندس يوسف خالد", email: "youssef.admin@sgu.edu.eg", role: "super_admin", status: "active" },
  { id: 2, username: "rashad_registrar", password: "encrypted_123", full_name: "رشاد فكري المنصوري", email: "rashad@sgu.edu.eg", role: "registrar_director", status: "active" }
];

export const SGU_SQLITE_NOTIFICATIONS = [
  { id: 1, user_type: "Student", user_id: 1, title: "اعتماد نتائج ختام خريف 2025", message: "تم رصد واعتماد السجل الدراسي لدرجات هياكل تراكيب البيانات وبورصة المعالجة والمصادقة للـ GPA.", created_at: "2026-06-19 12:00:00", is_read: 0 },
  { id: 2, user_type: "Professor", user_id: 2, title: "انعقاد مجلس كلية الحاسبات الدوري", message: "يرجى العلم بانعقاد مجلس الكلية غداً بمكتب السيد العميد أ.د. يوسف خالد بالدور الثاني بمقر الصالحية.", created_at: "2026-06-19 14:30:00", is_read: 1 }
];

export const ALL_SGU_SQLITE_TABLES: SQLiteTableDef[] = [
  {
    tableName: "colleges",
    descriptionAr: "الكليات السبع المعتمدة لجامعة الصالحية",
    descriptionEn: "Colleges registry for the 7 active colleges",
    createScript: `CREATE TABLE colleges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    dean_name TEXT,
    established_year INTEGER,
    location TEXT,
    contact_email TEXT,
    contact_phone TEXT
);`,
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY AUTOINCREMENT", desc: "المعرف الفريد التلقائي للكلية" },
      { name: "name_ar", type: "TEXT", constraints: "NOT NULL", desc: "الاسم العربي الرسمي للكلية" },
      { name: "name_en", type: "TEXT", constraints: "NOT NULL", desc: "الاسم الإنجليزي الرسمي للكلية" },
      { name: "code", type: "TEXT", constraints: "UNIQUE", desc: "الرمز الكودي للكلية" },
      { name: "dean_name", type: "TEXT", desc: "اسم عميد الكلية الحالي" },
      { name: "established_year", type: "INTEGER", desc: "عام التأسيس والقرار الوزاري" },
      { name: "location", type: "TEXT", desc: "الموقع الجغرافي للمبنى داخل الحرم" }
    ],
    rows: SGU_SQLITE_COLLEGES
  },
  {
    tableName: "departments",
    descriptionAr: "الأقسام العلمية والأكاديمية التابعة للكليات",
    descriptionEn: "Academic departments mapping under each college",
    createScript: `CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    code TEXT NOT NULL,
    head_name TEXT,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);`,
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY", desc: "المعرف للأقسام" },
      { name: "college_id", type: "INTEGER", constraints: "FOREIGN KEY", desc: "محاذاة كود الكلية للربط" },
      { name: "name_ar", type: "TEXT", constraints: "NOT NULL", desc: "الاسم العربي للقسم" },
      { name: "code", type: "TEXT", desc: "الرمز الكودي للأقسام" },
      { name: "head_name", type: "TEXT", desc: "رئيس القسم الحالي" }
    ],
    rows: SGU_SQLITE_DEPARTMENTS
  },
  {
    tableName: "academic_years",
    descriptionAr: "الأعوام الأكاديمية والجدولة الزمنية الكلية",
    descriptionEn: "Academic years cycles setup and history",
    createScript: `CREATE TABLE academic_years (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year_name TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'active'
);`,
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY", desc: "الرقم المسلسل للعام" },
      { name: "year_name", type: "TEXT", desc: "مثال العام الأكاديمي 2025-2026" },
      { name: "status", type: "TEXT", desc: "الحالة (نشط active، منتهي completed)" }
    ],
    rows: SGU_SQLITE_ACADEMIC_YEARS
  },
  {
    tableName: "semesters",
    descriptionAr: "الفصول الدراسية وتواريخ القيد والاضافة",
    descriptionEn: "Semesters structure linked to academic years",
    createScript: `CREATE TABLE semesters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    academic_year_id INTEGER,
    semester_name TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    registration_start TEXT,
    registration_end TEXT,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);`,
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY", desc: "رقم الفصل الدراسي" },
      { name: "semester_name", type: "TEXT", desc: "الربيع، الخريف، الصيفي" },
      { name: "registration_start", type: "TEXT", desc: "بداية فتح باب سحب المواد" },
      { name: "status", type: "TEXT", desc: "الحالة للفصل" }
    ],
    rows: SGU_SQLITE_SEMESTERS
  },
  {
    tableName: "students",
    descriptionAr: "سجلات كشوف الطلاب الأكاديمية والمالية الشاملة",
    descriptionEn: "Student rosters with comprehensive CGPA & fees fields",
    createScript: `CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL UNIQUE,
    national_id TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name_ar TEXT,
    email TEXT,
    phone TEXT,
    password TEXT DEFAULT '123456',
    gender TEXT,
    birth_date TEXT,
    address TEXT,
    college_id INTEGER,
    department_id INTEGER,
    academic_year_id INTEGER,
    semester_id INTEGER,
    enrollment_date TEXT,
    status TEXT DEFAULT 'active',
    gpa REAL DEFAULT 0.0,
    total_credits INTEGER DEFAULT 0,
    completed_credits INTEGER DEFAULT 0,
    tuition_fees REAL DEFAULT 0.0,
    paid_fees REAL DEFAULT 0.0,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);`,
    columns: [
      { name: "student_id", type: "TEXT", constraints: "UNIQUE", desc: "الرقم الجامعي المميز للطالب" },
      { name: "full_name_ar", type: "TEXT", desc: "الاسم الرباعي الرسمي بالعربية" },
      { name: "gpa", type: "REAL", desc: "المعدل التراكمي للطالب (حتى 4.0)" },
      { name: "completed_credits", type: "INTEGER", desc: "الساعات المعتمدة المجتازة بنجاح" },
      { name: "tuition_fees", type: "REAL", desc: "المصاريف السنوية المطلوبة للعام" },
      { name: "paid_fees", type: "REAL", desc: "إجمالي المبالغ المدفوعة الفعلي" },
      { name: "status", type: "TEXT", desc: "حالة القيد (نشط، موقوف، معلق)" }
    ],
    rows: SGU_SQLITE_STUDENTS
  },
  {
    tableName: "professors",
    descriptionAr: "كشاف أعضاء هيئة التدريس وسوابق الكوادر",
    descriptionEn: "Professors ledger, specializations and financial data",
    createScript: `CREATE TABLE professors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professor_id TEXT NOT NULL UNIQUE,
    national_id TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name_ar TEXT,
    email TEXT,
    phone TEXT,
    password TEXT DEFAULT '123456',
    gender TEXT,
    birth_date TEXT,
    address TEXT,
    college_id INTEGER,
    department_id INTEGER,
    specialization TEXT,
    degree TEXT,
    hire_date TEXT,
    status TEXT DEFAULT 'active',
    salary REAL,
    office_location TEXT,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);`,
    columns: [
      { name: "professor_id", type: "TEXT", constraints: "UNIQUE", desc: "الرقم الوظيفي الفريد" },
      { name: "full_name_ar", type: "TEXT", desc: "الاسم بالكامل واللقب الأكاديمي" },
      { name: "specialization", type: "TEXT", desc: "التخصص الدقيق وعنوان المحاضرات" },
      { name: "salary", type: "REAL", desc: "الراتب الشهري الأساسي بالجنيه" }
    ],
    rows: SGU_SQLITE_PROFESSORS
  },
  {
    tableName: "courses",
    descriptionAr: "أطلس المقررات والمواد ولائحة الكليات",
    descriptionEn: "Curriculum courses structure with credit hours specs",
    createScript: `CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL UNIQUE,
    course_name_ar TEXT,
    course_name_en TEXT,
    college_id INTEGER,
    department_id INTEGER,
    credits INTEGER DEFAULT 3,
    hours_per_week INTEGER DEFAULT 3,
    semester_id INTEGER,
    academic_year_id INTEGER,
    prerequisites TEXT,
    description TEXT,
    course_type TEXT DEFAULT 'theoretical',
    max_students INTEGER DEFAULT 50,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);`,
    columns: [
      { name: "course_code", type: "TEXT", constraints: "UNIQUE", desc: "الرمز الكودي الموحد للمادة" },
      { name: "course_name_ar", type: "TEXT", desc: "اسم المادة بالعربية" },
      { name: "credits", type: "INTEGER", desc: "الوزن الأكاديمي بالساعات المعتمدة" },
      { name: "prerequisites", type: "TEXT", desc: "المتطلبات السابقة الكودية للتسجيل" }
    ],
    rows: SGU_SQLITE_COURSES
  },
  {
    tableName: "course_sections",
    descriptionAr: "شعب المواد والسكاشن وجداول القاعات",
    descriptionEn: "Course sections with timing allocation and capacities",
    createScript: `CREATE TABLE course_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    section_number TEXT,
    professor_id INTEGER,
    max_capacity INTEGER DEFAULT 30,
    current_enrolled INTEGER DEFAULT 0,
    schedule_days TEXT,
    schedule_time TEXT,
    room TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);`,
    columns: [
      { name: "section_number", type: "TEXT", desc: "رقم المجموعة أو السكشن (SEC-A1)" },
      { name: "max_capacity", type: "INTEGER", desc: "الحد الأقصى لعدد الطلاب بالشعبة" },
      { name: "schedule_days", type: "TEXT", desc: "الأيام المخصصة للمحاضرة" },
      { name: "room", type: "TEXT", desc: "القاعة أو المدرج المخصص لمنع التداخل" }
    ],
    rows: SGU_SQLITE_COURSE_SECTIONS
  },
  {
    tableName: "enrollments",
    descriptionAr: "عمليات تسجيل الطلاب بالشعب والمواد الجارية",
    descriptionEn: "Student active semester enrollments and attendance percent",
    createScript: `CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    course_id INTEGER,
    section_id INTEGER,
    semester_id INTEGER,
    enrollment_date TEXT,
    status TEXT DEFAULT 'active',
    grade TEXT,
    grade_points REAL,
    attendance_percent REAL DEFAULT 0.0
);`,
    columns: [
      { name: "id", type: "INTEGER", desc: "مسلسل التسجيل" },
      { name: "attendance_percent", type: "REAL", desc: "نسبة حضور الطالب التراكمية بالمقرر" },
      { name: "grade", type: "TEXT", desc: "التقدير النهائي الفوري (A, B+, C)" }
    ],
    rows: SGU_SQLITE_ENROLLMENTS
  },
  {
    tableName: "grades",
    descriptionAr: "كشوف تفصيل درجات أعمال السنة والنهائي ورصد الدرجات",
    descriptionEn: "Granular breakdown of exams, homework, and total scores",
    createScript: `CREATE TABLE grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id INTEGER,
    student_id INTEGER,
    course_id INTEGER,
    semester_id INTEGER,
    midterm_grade REAL,
    final_grade REAL,
    practical_grade REAL,
    quiz_grade REAL,
    homework_grade REAL,
    total_grade REAL,
    grade_letter TEXT,
    grade_points REAL,
    entered_by INTEGER,
    entry_date TEXT
);`,
    columns: [
      { name: "id", type: "INTEGER", desc: "كود الرصد الفريد" },
      { name: "midterm_grade", type: "REAL", desc: "درجة اختبار منتصف الفصل الدراسي" },
      { name: "final_grade", type: "REAL", desc: "درجة الاختبار النهائي التحريري" },
      { name: "total_grade", type: "REAL", desc: "المجموع التراكمي لدرجات المادة" },
      { name: "grade_letter", type: "TEXT", desc: "حرف التقدير الحسابي" }
    ],
    rows: SGU_SQLITE_GRADES
  },
  {
    tableName: "attendance",
    descriptionAr: "دفاتر حضور وغياب الطلاب اليومي للمحاضرات",
    descriptionEn: "Daily lecture attendance tracking metadata",
    createScript: `CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id INTEGER,
    student_id INTEGER,
    course_id INTEGER,
    section_id INTEGER,
    date TEXT,
    status TEXT,
    notes TEXT
);`,
    columns: [
      { name: "date", type: "TEXT", desc: "تاريخ رصد الحضور" },
      { name: "status", type: "TEXT", desc: "الحالة (Present حاضر، Absent غائب)" },
      { name: "notes", type: "TEXT", desc: "ملاحظات إضافية أو أعذار طبية معتمدة" }
    ],
    rows: SGU_SQLITE_ATTENDANCE
  },
  {
    tableName: "exams_schedule",
    descriptionAr: "جداول ومواعيد امتحانات الفصول الدراسية",
    descriptionEn: "Semester exams scheduler and assigned halls",
    createScript: `CREATE TABLE exams_schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    semester_id INTEGER,
    exam_type TEXT,
    exam_date TEXT,
    exam_time TEXT,
    duration_minutes INTEGER,
    room TEXT
);`,
    columns: [
      { name: "exam_type", type: "TEXT", desc: "نوع الاختبار (نهائي، عملي)" },
      { name: "exam_date", type: "TEXT", desc: "التاريخ المقر للمهمة" },
      { name: "duration_minutes", type: "INTEGER", desc: "زمن الامتحان الفعلي بالدقائق" }
    ],
    rows: SGU_SQLITE_EXAMS_SCHEDULE
  },
  {
    tableName: "tuition_fees",
    descriptionAr: "حسابات وفواتير مدفوعات الرسوم والربط البنكي",
    descriptionEn: "Tuition collection gateway transactions ledger",
    createScript: `CREATE TABLE tuition_fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    semester_id INTEGER,
    amount REAL,
    due_date TEXT,
    paid_amount REAL DEFAULT 0.0,
    payment_date TEXT,
    payment_method TEXT,
    status TEXT DEFAULT 'unpaid'
);`,
    columns: [
      { name: "amount", type: "REAL", desc: "المبلغ الإجمالي المستحق للفصل" },
      { name: "paid_amount", type: "REAL", desc: "مجموع الدفع الفعلي" },
      { name: "payment_method", type: "TEXT", desc: "وسيلة القبول وسداد الرسوم" },
      { name: "status", type: "TEXT", desc: "الوضعية المالية (paid مسددة بالكامل، unpaid، partial)" }
    ],
    rows: SGU_SQLITE_TUITION_FEES
  },
  {
    tableName: "admin_users",
    descriptionAr: "مستخدمي ومسؤولي لوحة التحكم الإدارية والنظام",
    descriptionEn: "Internal system administrators and registrars database",
    createScript: `CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT DEFAULT 'admin123',
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'admin',
    status TEXT DEFAULT 'active'
);`,
    columns: [
      { name: "username", type: "TEXT", desc: "اسم المستخدم المعتمد للدخول" },
      { name: "full_name", type: "TEXT", desc: "الاسم الرباعي للموظف المسؤول" },
      { name: "role", type: "TEXT", desc: "الدور والصلاحيات الإدارية الممنوحة له" }
    ],
    rows: SGU_SQLITE_ADMIN_USERS
  },
  {
    tableName: "notifications",
    descriptionAr: "سجل الإخطارات والرسائل التنبيهية للمستخدمين",
    descriptionEn: "System generated notifications and message queues",
    createScript: `CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_type TEXT,
    user_id INTEGER,
    title TEXT,
    message TEXT,
    created_at TEXT,
    is_read INTEGER DEFAULT 0
);`,
    columns: [
      { name: "title", type: "TEXT", desc: "عنوان الإخطار التوجيهي" },
      { name: "message", type: "TEXT", desc: "الملخص والبيان النصي المرسل" },
      { name: "is_read", type: "INTEGER", desc: "حالة القراءة الفورية (0 غير مقروء، 1 مقروء)" }
    ],
    rows: SGU_SQLITE_NOTIFICATIONS
  }
];
