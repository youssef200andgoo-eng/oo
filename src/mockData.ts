import {
  StudentProfile,
  Course,
  ScheduleItem,
  Exam,
  AttendanceRecord,
  Assignment,
  LectureMaterial,
  LibraryBook,
  DormRoom,
  BusRoute,
  MedicalRecord,
  FinanceRecord,
  AdmissionApplication,
  College
} from "./types";

export const defaultStudent: StudentProfile = {
  id: "20235418",
  nationalId: "30204120198472",
  nameArabic: "يوسف أحمد عبد الرحمن",
  nameEnglish: "Youssef Ahmed Abdelrahman",
  birthDate: "2002-10-15",
  nationality: "مصر",
  address: "الدقي، الجيزة، مصر",
  phone: "+201012345678",
  email: "youssef.ahmed@univ.edu",
  guardianName: "أحمد عبد الرحمن عثمان",
  emergencyPhone: "+201287654321",
  college: "كلية الحاسبات والمعلومات",
  department: "علوم الحاسب",
  major: "بكالوريوس هندسة البرمجيات والأنظمة الذكية",
  advisor: "أ.د. محمد الشافعي",
  level: "السنة الثالثة - الفصل الدراسي الثاني",
  totalGPA: 3.82,
  completedHours: 94,
  requiredHours: 136,
  avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
};

export const defaultColleges: College[] = [
  {
    id: "med",
    name: "كلية الطب البشري",
    departments: ["الطب الباطني", "الجراحة العامة", "الأطفال", "النساء والتوليد", "التشريح وعلم وظائف الأعضاء"],
    programs: ["بكالوريوس الطب البشري والجراحة (MBBCh)", "دبلوم الجراحة العامة الإكلينيكي"],
    hoursRequired: 250
  },
  {
    id: "fcis",
    name: "كلية الحاسبات والمعلومات",
    departments: ["علوم الحاسب", "الذكاء الاصطناعي", "نظم المعلومات", "هندسة البرمجيات", "الأمن السيبراني", "علم البيانات", "الشبكات"],
    programs: ["بكالوريوس علوم الحاسب المتقدمة", "بكالوريوس هندسة البرمجيات والأنظمة الذكية", "بكالوريوس الأمن السيبراني والشبكات"],
    hoursRequired: 136
  },
  {
    id: "pt",
    name: "كلية العلاج الطبيعي",
    departments: ["العلاج الطبيعي العظمي", "العلاج الطبيعي العصبي", "العلاج الطبيعي للأطفال", "العلاج الطبيعي الرياضي", "العلاج الوظيفي"],
    programs: ["بكالوريوس العلاج الطبيعي والتأهيل"],
    hoursRequired: 144
  },
  {
    id: "phr",
    name: "كلية الصيدلة",
    departments: ["الصيدلة الإكلينيكية", "علم الأدوية والسموم", "الصيدلانيات وتكنولوجيا الصيدلة", "الكيمياء العقاقير والمنتجات الطبيعية"],
    programs: ["برنامج دكتور صيدلي (PharmD)", "برنامج الصيدلة الإكلينيكية المتميز"],
    hoursRequired: 180
  },
  {
    id: "nur",
    name: "كلية التمريض",
    departments: ["التمريض الباطني والجراحي", "تمريض الأطفال", "تمريض النساء والتوليد", "التمريض الحرج والطوارئ"],
    programs: ["بكالوريوس علوم التمريض"],
    hoursRequired: 144
  },
  {
    id: "den",
    name: "كلية طب الأسنان",
    departments: ["طب أسنان الأطفال", "تقويم الأسنان", "جراحة الفم والفكين", "علاج الجذور والتحفظي"],
    programs: ["بكالوريوس طب وجراحة الفم والأسنان (BDS)"],
    hoursRequired: 180
  },
  {
    id: "bus",
    name: "كلية إدارة الأعمال",
    departments: ["المحاسبة والتمويل", "إدارة الأعمال", "التسويق الرقمي", "إدارة الموارد البشرية", "سلاسل الإمداد واللوجستيات"],
    programs: ["بكالوريوس المحاسبة الرقمية", "بكالوريوس إدارة الأعمال الدولية والتسويق", "ماجستير إدارة الأعمال المصغر (Mini-MBA)"],
    hoursRequired: 132
  }
];

export const defaultCourses: Course[] = [
  // Completed Courses
  { code: "CS101", name: "مقدمة في علوم الحاسب", description: "أساسيات البرمجة، الخوارزميات، وتأهيل مهارات التفكير المنطقي باستخدام C++.", prerequisites: [], credits: 3, finalGrade: 100, status: "completed", gradeObtained: "A+" },
  { code: "MATH101", name: "رياضيات عامة 1", description: "التفاضل والتكامل الأساسي، الجبر الخطي والمصفوفات.", prerequisites: [], credits: 3, finalGrade: 100, status: "completed", gradeObtained: "A" },
  { code: "CS102", name: "البرمجة كائنية التوجه", description: "مفاهيم الكبسلة، الوراثة، وتعدد الأشكال باستخدام Java.", prerequisites: ["CS101"], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "B+" },
  { code: "CS201", name: "هياكل البيانات والخوازميات", description: "المصفوفات، القوائم المتصلة، الأشجار، وطرق البحث والترتيب المعقدة.", prerequisites: ["CS102"], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "A" },
  { code: "SWE201", name: "هندسة البرمجيات 1", description: "تحليل النظم، لغة النمذجة الموحدة (UML)، واكتشاف متطلبات المستخدمين.", prerequisites: ["CS102"], credits: 3, finalGrade: 100, status: "completed", gradeObtained: "A-" },
  
  // Currently Registered Courses (Semester 2)
  { code: "AI302", name: "مبادئ الذكاء الاصطناعي", description: "التعلم الآلي، الشبكات العصبية، ومحركات البحث الذكية للبيانات.", prerequisites: ["CS201"], credits: 3, finalGrade: 100, status: "registered" },
  { code: "DB301", name: "أنظمة قواعد البيانات المتقدمة", description: "تصميم قواعد البيانات الضخمة SQL/NoSQL، واستخدام محركات التخزين وتكامل API.", prerequisites: ["CS201"], credits: 3, finalGrade: 100, status: "registered" },
  { code: "SWE311", name: "تطوير تطبيقات الويب والموبايل", description: "الأنظمة الحديثة متكاملة المهام فرونت اند وباك اند باستخدام React و Node Express.", prerequisites: ["CS102"], credits: 4, finalGrade: 100, status: "registered" },
  { code: "SEC304", name: "الأمن السيبراني والشبكات", description: "تشفير البيانات، البروتوكولات الشبكية الآمنة، وحماية الأنظمة من الثغرات البرمجية.", prerequisites: ["CS101"], credits: 3, finalGrade: 100, status: "registered" },
  
  // Available, not registered yet
  { code: "CS401", name: "مشروع التخرج 1", description: "دراسة وتأسيس الفكرة الهندسية والمخططات الأولية للمشروع النهائي المبتكر.", prerequisites: ["SWE201", "CS201"], credits: 3, finalGrade: 100, status: "available" },
  { code: "AI405", name: "معالجة اللغات الطبيعية (NLP)", description: "تدريب النماذج اللغوية لفهم النصوص باللغة العربية والإنجليزية وبنية المحادثات الذكية.", prerequisites: ["AI302"], credits: 3, finalGrade: 100, status: "available" },
  { code: "SWE422", name: "إدارة المشاريع البرمجية وعقودها", description: "منهجيات الـ Agile والـ Scrum في توجيه جودة فرق التطوير والالتزامات الزمنية.", prerequisites: ["SWE201"], credits: 2, finalGrade: 100, status: "available" },
  
  // Locked Prerequisites not met
  { code: "AI444", name: "رؤية الحاسب وتحليل الصور", description: "خوارزميات التعرف المتقدم على الوجوه والنصوص والسيارات ذاتية القيادة.", prerequisites: ["AI405"], credits: 3, finalGrade: 100, status: "locked" }
];

export const defaultSchedule: ScheduleItem[] = [
  { id: "s1", courseCode: "AI302", courseName: "مبادئ الذكاء الاصطناعي", instructor: "أ.د. عصام الدين الجوهرى", room: "المدرج الكبير أ (Auditorium A)", building: "مبنى ابن سينا (A)", timeSlot: "08:30 - 10:00", day: "الأحد" },
  { id: "s2", courseCode: "DB301", courseName: "أنظمة قواعد البيانات المتقدمة", instructor: "د. هدى محمود غانم", room: "مختبر الحاسب 3", building: "مبنى الخوارزمي للأبحاث (B)", timeSlot: "10:15 - 12:15", day: "الأحد" },
  { id: "s3", courseCode: "SEC304", courseName: "الأمن السيبراني والشبكات", instructor: "د. شريف العمدة", room: "قاعة المحاضرات 204", building: "مبنى ابن سينا (A)", timeSlot: "12:30 - 14:00", day: "الاثنين" },
  { id: "s4", courseCode: "SWE311", courseName: "تطوير تطبيقات الويب والموبايل", instructor: "م. كريم عبد الكريم", room: "مختبر البرمجيات 5", building: "مبنى الخوارزمي للأبحاث (B)", timeSlot: "09:00 - 11:30", day: "الثلاثاء" },
  { id: "s5", courseCode: "AI302", courseName: "مبادئ الذكاء الاصطناعي (تدريب عملي)", instructor: "م. رانية السعدني", room: "مختبر الذكاء الاصطناعي 1", building: "مبنى الخوارزمي للأبحاث (B)", timeSlot: "12:00 - 14:00", day: "الثلاثاء" },
  { id: "s6", courseCode: "DB301", courseName: "أنظمة قواعد البيانات المتقدمة", instructor: "د. هدى محمود غانم", room: "قاعة الدراسات 102", building: "مبنى ابن سينا (A)", timeSlot: "08:30 - 10:00", day: "الأربعاء" },
  { id: "s7", courseCode: "SWE311", courseName: "تطوير تطبيقات الويب والموبايل (محاضرة)", instructor: "د. علاء الدين عزمي", room: "المدرج الكبير ب", building: "مبنى ابن سينا (A)", timeSlot: "10:15 - 11:45", day: "الخميس" }
];

export const defaultExams: Exam[] = [
  { id: "ex1", type: "Midterm", courseCode: "AI302", courseName: "مبادئ الذكاء الاصطناعي", dateTime: "2026-06-25 09:00", room: "قاعة الامتحانات الكبرى 1", status: "scheduled", gradeMax: 30 },
  { id: "ex2", type: "Quiz", courseCode: "DB301", courseName: "أنظمة قواعد البيانات المتقدمة", dateTime: "2026-06-12 10:15", room: "مختبر 3", status: "completed", gradeMax: 15, gradeScore: 14.5 },
  { id: "ex3", type: "Practical", courseCode: "SWE311", courseName: "تطوير تطبيقات الويب والموبايل", dateTime: "2026-06-28 11:00", room: "مختبر الحاسب المركزي", status: "scheduled", gradeMax: 20 },
  { id: "ex4", type: "Oral", courseCode: "SEC304", courseName: "الأمن السيبراني والشبكات", dateTime: "2026-06-18 12:30", room: "مكتب رئيس القسم", status: "completed", gradeMax: 10, gradeScore: 9.5 },
  { id: "ex5", type: "Final", courseCode: "AI302", courseName: "مبادئ الذكاء الاصطناعي", dateTime: "2026-07-05 09:00", room: "صالة ابن تيمية للألعاب المغطاة", status: "scheduled", gradeMax: 50 },
  { id: "ex6", type: "Final", courseCode: "DB301", courseName: "أنظمة قواعد البيانات المتقدمة", dateTime: "2026-07-08 09:00", room: "صالة ابن تيمية للألعاب المغطاة", status: "scheduled", gradeMax: 50 }
];

export const defaultAttendance: AttendanceRecord[] = [
  { date: "2026-06-15", day: "الاثنين", courseCode: "SEC304", courseName: "الأمن السيبراني والشبكات", status: "present", method: "QR", time: "12:32" },
  { date: "2026-06-14", day: "الأحد", courseCode: "AI302", courseName: "مبادئ الذكاء الاصطناعي", status: "present", method: "Face", time: "08:28" },
  { date: "2026-06-14", day: "الأحد", courseCode: "DB301", courseName: "أنظمة قواعد البيانات المتقدمة", status: "late", method: "GPS", time: "10:22" },
  { date: "2026-06-09", day: "الثلاثاء", courseCode: "SWE311", courseName: "تطوير تطبيقات الويب والموبايل", status: "present", method: "RFID", time: "08:55" },
  { date: "2026-06-08", day: "الاثنين", courseCode: "SEC304", courseName: "الأمن السيبراني والشبكات", status: "absent", method: "QR", time: "--:--" },
  { date: "2026-06-07", day: "الأحد", courseCode: "AI302", courseName: "مبادئ الذكاء الاصطناعي", status: "present", method: "NFC", time: "08:29" }
];

export const defaultAssignments: Assignment[] = [
  { id: "as1", courseCode: "DB301", courseName: "أنظمة قواعد البيانات المتقدمة", title: "تصميم المخطط الهيكلي (ERD)", description: "قم برسم مخطط ER-Diagram متكامل لنظام حجز كليات طبي وسكني، وتوليد جداول SQL المناسبة.", dueDate: "2026-06-24", submitted: true, fileSubmitted: "db_project_erd.pdf", fileType: "PDF", grade: "10/10", feedback: "تصميم ممتاز ومراعاة العلاقات الفردية والمتعددة وحالات التعميم والخصوصية." },
  { id: "as2", courseCode: "SWE311", courseName: "تطوير تطبيقات الويب والموبايل", title: "موقع لوحة تحكم ذكية بالـ React", description: "بناء لوحة تحكم إسلامية وعامة للطلاب تتصل بـ API خارجي وتعرض الطقس وأوقات الصلاة مع خيار الوضع المظلم.", dueDate: "2026-06-30", submitted: false },
  { id: "as3", courseCode: "AI302", courseName: "مبادئ الذكاء الاصطناعي", title: "مشروع تطبيق مصنف الصور (Image Classifier)", description: "تدريب نموذج تيار شبكة عصبية مبسطة للتعرف على الأرقام الحسابية وتطبيقه باستعمال PyTorch مع كتابة الكود البرمجي في ملف Jupyter Jupyter.", dueDate: "2026-06-20", submitted: true, fileSubmitted: "neural_digits_colab.ipynb", fileType: "ZIP", grade: "أقرب للمثالي", feedback: "تقييم أولي رائع، الأداء ونسبة الدقة فوق 96%." }
];

export const defaultLectures: LectureMaterial[] = [
  { id: "l1", courseCode: "AI302", title: "المحاضرة الأولى: مقدمة للشبكات العصبية والتعلم العميق", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "12:45" },
  { id: "l2", courseCode: "AI302", title: "سلايدات المحاضرة: خوارزميات الاستنباط الخطي والتصنيف", type: "slide", url: "https://www.w3schools.com/html/movie.mp4" },
  { id: "l3", courseCode: "DB301", title: "ملخص كامل: قواعد البيانات اللامركزية NoSQL", type: "pdf", url: "#" },
  { id: "l4", courseCode: "SEC304", title: "المعمل التطبيقي: اختبار اختراق أنظمة وحماية الخوادم", type: "zip", url: "#" }
];

export const defaultBooks: LibraryBook[] = [
  { id: "b1", title: "الذكاء الاصطناعي: مقاربة حديثة (Artificial Intelligence: A Modern Approach)", author: "Stuart Russell & Peter Norvig", category: "علوم الحاسب والذكاء الاصطناعي", available: true, locationCode: "A-124" },
  { id: "b2", title: "مقدمة في الجداول وخوارزميات البحث (Introduction to Algorithms)", author: "Thomas H. Cormen", category: "علوم الحاسب والذكاء الاصطناعي", available: false, locationCode: "B-205", borrowedDate: "2026-06-10", dueDate: "2026-06-24" },
  { id: "b3", title: "أسس هندسة البرمجيات المتقدمة (Software Engineering)", author: "Ian Sommerville", category: "برمجيات ونظم", available: true, locationCode: "A-54" },
  { id: "b4", title: "تطوير الويب الحديث باستخدام React و Node.js", author: "أ.د. يوسف الشناوي", category: "البرمجة وتقنيات الويب", available: true, locationCode: "C-11" },
  { id: "b5", title: "مباني السكن والأمن السيبراني للأبنية الذكية", author: "أحمد بن زاهر", category: "الهندسة المعمارية والأمن", available: true, locationCode: "D-99" }
];

export const defaultDorms: DormRoom[] = [
  { id: "d1", buildingName: "المبنى الممتاز (أ)", roomNo: "101", bedNo: "سرير (أ)", capacity: 2, occupied: 1, price: 1200, status: "available" },
  { id: "d2", buildingName: "المبنى الممتاز (أ)", roomNo: "102", bedNo: "سرير (ب)", capacity: 2, occupied: 2, price: 1200, status: "full" },
  { id: "d3", buildingName: "المبنى الاقتصادي (ب)", roomNo: "305", bedNo: "سرير (أ)", capacity: 4, occupied: 2, price: 600, status: "available" },
  { id: "d4", buildingName: "مبنى هيبة الجديد (ج)", roomNo: "401", bedNo: "سرير مستقل حجز فردى", capacity: 1, occupied: 0, price: 2000, status: "available" }
];

export const defaultBuses: BusRoute[] = [
  { id: "bus1", busNo: "حافلة رقم 12 (الجيزة والمهندسين)", driverName: "عم صبحي السكناوي", driverPhone: "+201149834222", startPoint: "ميدان الجيزة", endPoint: "البوابة الرئيسية للجامعة", stops: ["ميدان الجيزة", "ش جامعة الدول", "جامد مصطفى محمود", "البوابة الغربية"], currentLocationName: "ش جامعة الدول", status: "active" },
  { id: "bus2", busNo: "حافلة رقم 08 (مصر الجديدة والتجمع)", driverName: "كابتن محمود أبو العلا", driverPhone: "+201088734612", startPoint: "صينية التجمع الأول", endPoint: "البوابة الرئيسية للجامعة", stops: ["التجمع الأول", "ش التسعين", "المحور", "النادي الأهلي", "البوابة الرئيسية"], currentLocationName: "ش التسعين", status: "active" },
  { id: "bus3", busNo: "حافلة رقم 15 (المعادي وحلوان)", driverName: "مجدى الشبراوي", driverPhone: "+201555621434", startPoint: "حلوان البلد", endPoint: "المبنى السكني ب", stops: ["حلوان", "كورنيش المعادي", "المنيل", "جامعة القاهرة", "البوابة الجنوبية"], currentLocationName: "عطل طارئ - الورشة", status: "inactive" }
];

export const defaultMedical: MedicalRecord[] = [
  { id: "m1", visitDate: "2026-06-02", reason: "نزلة برد حادة وإرهاق موسمي بسبب المذاكرة دقيقة", diagnosis: "نزلة شعبية خفيفة وإرهاق كلي", prescription: "مضاد حيوي زيثروكان 500مغ 1 قرص يومياً لمدة 3 أيام، بنادول اكسترا عند اللزوم، راحة تامة بالسرير ليومين.", doctor: "د. هاني الورداني (العيادة العامة)" },
  { id: "m2", visitDate: "2026-05-10", reason: "فحص طب العيون الدوري للمستجدين والمكتبات", diagnosis: "ضعف نظر بسيط بالعين اليمنى (-0.75 -0.50)", prescription: "نظارة طبية للقراءة واستعمال شاشات وبرمجة الحاسب اليدوي، قطرة مرطبة هيلو-جيل.", doctor: "د. سهام توفيق (طب وجراحة العيون)" }
];

export const defaultFinance: FinanceRecord[] = [
  { id: "f1", description: "المصروفات الدراسية الأساسية - الفصل الثاني", amount: 12500, category: "tuition", dueDate: "2026-03-31", paid: true, paymentDate: "2026-03-12", paymentMethod: "فودافون كاش | Vodafone Cash" },
  { id: "f2", description: "اشتراك السكن الجامعي الممتاز - مبنى (أ)", amount: 3600, category: "housing", dueDate: "2026-06-30", paid: false },
  { id: "f3", description: "رسوم معمل كيمياء المواد والنانوتكنولوجي", amount: 1200, category: "lab", dueDate: "2026-06-20", paid: true, paymentDate: "2026-06-11", paymentMethod: "بطاقة فيزا | Visa Card *4211" },
  { id: "f4", description: "رسوم النشاط الفني والرياضي والرحلات والمظلات", amount: 500, category: "activity", dueDate: "2026-06-15", paid: false }
];

export const defaultApplications: AdmissionApplication[] = [
  { 
    id: "adm101", 
    fullName: "مصطفى كمال الدين الشربيني", 
    nationalId: "30511011504938", 
    highSchoolPercentage: 94.22, 
    wishes: ["كلية الحاسبات والذكاء الاصطناعي", "كلية الهندسة"], 
    certificateFile: "highschool_cert_mustafa.pdf", 
    idCardFile: "mustafa_id.png", 
    photoFile: "mustafa_portrait.jpg", 
    paidFee: true, 
    status: "accepted", 
    adminFeedback: "تم القبول ومطابقة شهادة الثانوية العامة، مرحبًا بك في جامعتنا!", 
    electronicSignatureId: "SGU-RSA-SIG-e17-n3233-75B2", 
    electronicSignatureDate: "2026-06-15 10:24 AM", 
    signatureConsent: true,
    publicKey: "-----BEGIN PUBLIC KEY-----\nMIIB_SGU_ZT0xNyxuPTMyMzM=A\n-----END PUBLIC KEY-----",
    signatureValue: "Uz0xNzEzLEg9MTUyMw==",
    documentDataHash: "مصطفى كمال الدين الشربيني|30511011504938|94.22|highschool_cert_mustafa.pdf|mustafa_id.png|mustafa_portrait.jpg",
    isTampered: false
  },
  { 
    id: "adm102", 
    fullName: "نهى سامر الهاشمي", 
    nationalId: "30409152309485", 
    highSchoolPercentage: 88.5, 
    wishes: ["كلية الحاسبات والذكاء الاصطناعي", "كلية العلوم الإدارية والأعمال"], 
    certificateFile: "nohaa_highschool.pdf", 
    idCardFile: "nohaa_id.png", 
    photoFile: "nohaa_photo.jpg", 
    paidFee: true, 
    status: "pending", 
    electronicSignatureId: "SGU-RSA-SIG-e17-n2773-F9E4", 
    electronicSignatureDate: "2026-06-18 03:45 PM", 
    signatureConsent: true,
    publicKey: "-----BEGIN PUBLIC KEY-----\nMIIB_SGU_ZT0xNyxuPTI3NzM=A\n-----END PUBLIC KEY-----",
    signatureValue: "Uz0xMTUyLEg9Mjc0Mg==",
    documentDataHash: "نهى سامر الهاشمي|30409152309485|88.5|nohaa_highschool.pdf|nohaa_id.png|nohaa_photo.jpg",
    isTampered: false
  },
  { 
    id: "adm103", 
    fullName: "عادل سمير عبد المغيث", 
    nationalId: "30502181509388", 
    highSchoolPercentage: 76.1, 
    wishes: ["كلية العلوم الإدارية والأعمال"], 
    certificateFile: "adel_highschool_unreadable.pdf", 
    idCardFile: "adel_id.png", 
    photoFile: "", 
    paidFee: false, 
    status: "modify_required", 
    adminFeedback: "يرجى دفع رسم التقديم وإعادة رفع صورة بطاقة الهوية الوطنية والشهادة بصورة واضحة كاملة.", 
    electronicSignatureId: "SGU-RSA-SIG-e13-n3053-12D8", 
    electronicSignatureDate: "2026-06-19 11:12 AM", 
    signatureConsent: true,
    publicKey: "-----BEGIN PUBLIC KEY-----\nMIIB_SGU_ZT0xMyxuPTMwNTM=A\n-----END PUBLIC KEY-----",
    signatureValue: "Uz0xMjI1LEg9MTA0Mw==",
    documentDataHash: "عادل سمير عبد المغيث|30502181509388|76.1|adel_highschool_unreadable.pdf|adel_id.png|",
    isTampered: true // This one is simulated as "Tampered" so we can test the verification panels and active notifications!
  }
];

export const defaultAdminStats = {
  totalStudentsCount: 14850,
  totalGraduatesCount: 3680,
  totalFacultyCount: 412,
  parentAccountsActive: 8250,
  activeAdmissionsCount: 1240,
  revenueTuition: 45200000,
  revenueDorms: 2850000,
  revenueResearchGrants: 12000000,
  avgAttendanceRate: 88.4,
  successRatePerDepartment: [
    { name: "الطب البشري", successRate: 98, attendanceRate: 97, activeCount: 68 },
    { name: "الحاسبات والمعلومات", successRate: 94, attendanceRate: 92, activeCount: 112 },
    { name: "العلاج الطبيعي", successRate: 91, attendanceRate: 89, activeCount: 74 },
    { name: "الصيدلة", successRate: 93, attendanceRate: 91, activeCount: 88 },
    { name: "التمريض", successRate: 95, attendanceRate: 93, activeCount: 52 },
    { name: "طب الأسنان", successRate: 92, attendanceRate: 90, activeCount: 65 },
    { name: "إدارة الأعمال", successRate: 90, attendanceRate: 88, activeCount: 94 }
  ],
  genderRatio: [
    { name: "طلاب ذكور", value: 62 },
    { name: "طالبات إناث", value: 38 }
  ]
};

export const coursesByCollege: Record<string, Course[]> = {
  med: [
    { code: "MED101", name: "مقدمة في التشريح البشري ومصطلحاته", description: "دراسة وتوصيف الأعضاء وعلم التشريح الإقليمي والسريري لجسم الإنسان المتقدم.", prerequisites: [], credits: 5, finalGrade: 100, status: "completed", gradeObtained: "A" },
    { code: "MED102", name: "علم وظائف الأعضاء المكروسكوبي (Physiology)", description: "دراسة آليات عمل الخلايا، فصائل الدم، الجهاز العصبي المركزي والجهاز البولي.", prerequisites: [], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "A-" },
    { code: "MED204", name: "علم الأدوية الأساسي والسموم الإكلينيكية", description: "تصنيف المجموعات الدوائية، حركية الدواء وأثره وتفاعلاته الحيوية.", prerequisites: ["MED101"], credits: 4, finalGrade: 100, status: "registered" },
    { code: "MED305", name: "الطب الباطني السريري والجراحي الأول", description: "تدريب عملي مكثف في المستشفيات الجامعية بمصر وطب الطوارئ وأعراض الباطنة.", prerequisites: ["MED102"], credits: 6, finalGrade: 100, status: "registered" },
    { code: "MED410", name: "جراحة القلب والصدر المتطورة والتدخل العاجل", description: "تأهيل طبي وجراحي متكامل لأمراض الصدر والصمام ورعاية حالات الـ ICU السريرية.", prerequisites: ["MED305"], credits: 5, finalGrade: 100, status: "available" }
  ],
  fcis: [
    { code: "CS101", name: "مقدمة في علوم الحاسب والخوارزميات", description: "أساسيات البرمجة، الخوارزميات، وتأهيل مهارات التفكير المنطقي باستخدام C++.", prerequisites: [], credits: 3, finalGrade: 100, status: "completed", gradeObtained: "A+" },
    { code: "CS201", name: "هياكل البيانات والخوازميات وهندستها", description: "المصفوفات، القوائم المتصلة، الأشجار، وطرق البحث والترتيب المعقدة.", prerequisites: ["CS101"], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "A" },
    { code: "AI302", name: "مبادئ الذكاء الاصطناعي والتعلم الآلي", description: "التعلم الآلي، الشبكات العصبية، ومحركات البحث الذكية للبيانات.", prerequisites: ["CS201"], credits: 3, finalGrade: 100, status: "registered" },
    { code: "SWE311", name: "تطوير تطبيقات الويب والموبايل بالـ React", description: "الأنظمة الحديثة متكاملة المهام فرونت اند وباك اند باستخدام React و Node Express.", prerequisites: ["CS101"], credits: 4, finalGrade: 100, status: "registered" },
    { code: "AI405", name: "معالجة اللغات الطبيعية ونمذجة النصوص (NLP)", description: "تدريب النماذج اللغوية للتعامل مع النصوص العربية والإنجليزية.", prerequisites: ["AI302"], credits: 3, finalGrade: 100, status: "available" }
  ],
  pt: [
    { code: "PT101", name: "مدخل في علوم العلاج الطبيعي والتأهيل", description: "مبادئ العلاج الفيزيائي، الفحص السريري وطرق تحفيز العضلات والأعصاب.", prerequisites: [], credits: 3, finalGrade: 100, status: "completed", gradeObtained: "A" },
    { code: "PT202", name: "علم الحركة والميكانيكا الحيوية (Kinesiology)", description: "دراسة ميكانيكية حركة المفاصل ومرونة الأنسجة العظمية والعضلية.", prerequisites: ["PT101"], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "A-" },
    { code: "PT304", name: "التمرينات العلاجية وتأهيل الحركة السريري", description: "تصميم وإجراء التمرينات السريرية الموجهة لأمراض الحركة والعمود الفقري.", prerequisites: ["PT202"], credits: 4, finalGrade: 100, status: "registered" },
    { code: "PT405", name: "تأهيل إصابات الملاعب والطب الرياضي", description: "تقنيات التأهيل الفوري لإصابات الركبة، الرباط الصليبي والخلع العضلي.", prerequisites: ["PT304"], credits: 3, finalGrade: 100, status: "registered" },
    { code: "PT412", name: "العلاج الوظيفي والتنسيق العصبي الحركي", description: "تأهيل حالات الشلل النصفي والجلطات الدماغية لاسترجاع وظائف اليد والأطراف.", prerequisites: ["PT304"], credits: 3, finalGrade: 100, status: "available" }
  ],
  phr: [
    { code: "PHR101", name: "مدخل للصيدلانيات وحساب الجرعات", description: "حساب وتصنيع الجرعات الدوائية والأقراص والمحاليل الطبية المعقمة.", prerequisites: [], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "A" },
    { code: "PHR202", name: "الكيمياء العضوية والتحليل الصيدلاني", description: "المركبات الحلقية والعطرية والتفاعلات الطبية ومقاييس جودة نقاء الغذاء والدواء.", prerequisites: ["PHR101"], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "B+" },
    { code: "PHR304", name: "الحركية الدوائية والسموم (Pharmacokinetics)", description: "دراسة امتصاص الدواء وتوزيعه والتمثيل الغذائي وإخراجه من الكبد والكلى.", prerequisites: ["PHR202"], credits: 3, finalGrade: 100, status: "registered" },
    { code: "PHR408", name: "الصيدلة الإكلينيكية ومهارات المشورة", description: "التدريب المباشر للرعاية الدوائية المركزة بغرف العناية ومتابعة المريض.", prerequisites: ["PHR304"], credits: 4, finalGrade: 100, status: "registered" },
    { code: "PHR420", name: "تكنولوجيا التصنيع الصيدلي وحفظ اللقاحات", description: "مبادئ العمل بالمصانع الطبية الضخمة، التعقيم ومعايير GMP العالمية.", prerequisites: ["PHR304"], credits: 3, finalGrade: 100, status: "available" }
  ],
  nur: [
    { code: "NUR101", name: "أساسيات ومفاهيم الرعاية التمريضية", description: "المهارات التمريضية الأولية، قياس العلامات الحيوية والتعاطي مع شكوى المريض.", prerequisites: [], credits: 3, finalGrade: 100, status: "completed", gradeObtained: "A+" },
    { code: "NUR202", name: "التدريب السريري التمريضي لأمراض الباطنة والجراحة", description: "تدريب سريري مكثف بغرف العمليات ومتابعة المحاليل والتطهير الوقائي.", prerequisites: ["NUR101"], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "A" },
    { code: "NUR304", name: "تمريض الرعاية الحرجة والطوارئ (ICU)", description: "تمريض حالات الغيبوبة، الصدمات، التعامل مع أجهزة التنفس الصناعي والمنع الجرثومي.", prerequisites: ["NUR202"], credits: 4, finalGrade: 100, status: "registered" },
    { code: "NUR308", name: "تمريض صحة الأم والطفل وحديثي الولادة", description: "رعاية ما قبل وبالمستشفى أثناء مرحلة الولادة، الحواضن، وعلم الطفولة المبكر.", prerequisites: ["NUR202"], credits: 3, finalGrade: 100, status: "registered" },
    { code: "NUR410", name: "تمريض صحة المجتمع وبرامج التوعية", description: "إجراء المسوح الميدانية الوقائية، اللقاحات ومكافحة الأوبئة.", prerequisites: ["NUR304"], credits: 3, finalGrade: 100, status: "available" }
  ],
  den: [
    { code: "DEN101", name: "تشريح الأسنان الشامل وخصائص المواد", description: "تشريحات الفم وتكوينات الأسنان اللبنية والدائمة ومواد الحشو المركبة ومواصفاتها.", prerequisites: [], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "A" },
    { code: "DEN202", name: "علاج الجذور والوقاية التحفظية (Endodontics)", description: "تقنيات تنظيف الأقنية العصبية وحشوها الوقائي وإصلاح تسوسات النخر المتأخر.", prerequisites: ["DEN101"], credits: 4, finalGrade: 100, status: "completed", gradeObtained: "B+" },
    { code: "DEN304", name: "جراحة الفم والخلع والتدخلات اللثوية", description: "تأهيل سريري لجراحة الأسنان المطمورة وعلاج التهابات اللثة المتقدمة وعظوم الفك.", prerequisites: ["DEN202"], credits: 4, finalGrade: 100, status: "registered" },
    { code: "DEN408", name: "التركيبات السنية الثابتة والمتحركة ونمذجتها", description: "تصميم التيجان والجسور والمقاطع وأطقم الأسنان الكاملة بالتعمل الرقمي CAD-CAM.", prerequisites: ["DEN304"], credits: 4, finalGrade: 100, status: "registered" },
    { code: "DEN415", name: "تقويم الأسنان وجماليات الفك للأطفال", description: "أطوار نمو الفك وعلاج التطابق غير المتناسق ومعايير الجاذبية والوجه اللبق.", prerequisites: ["DEN304"], credits: 3, finalGrade: 100, status: "available" }
  ],
  bus: [
    { code: "BUS101", name: "مبادئ وأصول الإدارة الحديثة", description: "وظائف التخطيط، القيادة، الرقابة، وإدارة فرق العمل المنسقة بالمؤسسات.", prerequisites: [], credits: 3, finalGrade: 100, status: "completed", gradeObtained: "A" },
    { code: "BUS202", name: "المحاسبة المالية وتدقيق الدفاتر", description: "إعداد قائمة الدخل، الميزانيات العمومية وعقود المنشأة وتحليل المركز المالي الرقمي.", prerequisites: ["BUS101"], credits: 3, finalGrade: 100, status: "completed", gradeObtained: "A" },
    { code: "BUS304", name: "التسويق الرقمي وبناء العلامة (SEO)", description: "مبادئ الاستهداف اللبق، الإعلان الإلكتروني وحملات التوعية وبناء الهوية.", prerequisites: ["BUS202"], credits: 3, finalGrade: 100, status: "registered" },
    { code: "BUS312", name: "إدارة الموارد البشرية والرواتب وعقودها", description: "تقنيات قياس كفاءة الموظف، التوظيف، الأجور، وتأطير الولاء الوظيفي بالقانون.", prerequisites: ["BUS101"], credits: 3, finalGrade: 100, status: "registered" },
    { code: "BUS420", name: "إدارة سلاسل الإمداد العالمية والتوريد واللوجستيات", description: "العمليات اللوجستية لنفاذ البضائع وتقليل الهدر والموازنة التنافسية للأرباح.", prerequisites: ["BUS304"], credits: 3, finalGrade: 100, status: "available" }
  ]
};
