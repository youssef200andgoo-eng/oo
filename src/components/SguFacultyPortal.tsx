import React, { useState } from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Send, 
  Plus, 
  Save, 
  Lock, 
  Clock, 
  FileText 
} from "lucide-react";
import { Course } from "../types";
import SguDeanshipPortal from "./SguDeanshipPortal";

interface SguFacultyPortalProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  student: any;
  setStudent: any;
  triggerSystemPush: (title: string, message: string) => void;
  lang: "ar" | "en";
  subTab: string;
  addLog?: (log: string) => void;
  dbUsers?: any[];
  setDbUsers?: any;
  schedules?: any[];
  setSchedules?: any;
  attendance?: any[];
  setAttendance?: any;
  colleges?: any[];
  setColleges?: any;
}

interface StudentGradeRow {
  studentId: string;
  studentName: string;
  quizScore: number;  // Out of 20
  midScore: number;   // Out of 30
  finalScore: number; // Out of 50
  certified: boolean;
}

export default function SguFacultyPortal({
  courses,
  setCourses,
  student,
  setStudent,
  triggerSystemPush,
  lang,
  subTab,
  addLog,
  dbUsers = [],
  setDbUsers,
  schedules = [],
  setSchedules,
  attendance = [],
  setAttendance,
  colleges = [],
  setColleges
}: SguFacultyPortalProps) {
  // 1. Advisor states
  const advisorName = lang === "ar" ? "أ.د. يوسف خالد النجار" : "Prof. Dr. Youssef Khaled El-Naggar";
  const advisorDept = lang === "ar" ? "قسم هندسة الأنظمة الذكية والبيانات" : "Department of Intelligent Systems & Data Engineering";
  
  // Roster profiles
  const [studentsRoster] = useState<any[]>([
    { id: "SGU-10045", nameAr: student.nameArabic, nameEn: student.nameEnglish || "Youssef El-Kurdy", level: 3, major: student.major },
    { id: "SGU-20119", nameAr: "مصطفى كمال الدين الشربيني", nameEn: "Mustafa Kamal-AlDin", level: 3, major: "علوم الحاسب" },
    { id: "SGU-30441", nameAr: "أمينة يسري فريد", nameEn: "Amina Yousry", level: 3, major: "الذكاء الاصطناعي" }
  ]);

  // Selected Course for grades entry
  const registeredCourses = courses.filter(c => c.status === "registered");
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(registeredCourses[0]?.code || "AI302");
  
  // Grade Entry Table
  const [gradesTable, setGradesTable] = useState<Record<string, StudentGradeRow[]>>({
    "AI302": [
      { studentId: "SGU-10045", studentName: student.nameArabic, quizScore: 18, midScore: 26, finalScore: 45, certified: false },
      { studentId: "SGU-20119", studentName: "مصطفى كمال الدين الشربيني", quizScore: 15, midScore: 22, finalScore: 38, certified: false },
      { studentId: "SGU-30441", studentName: "أمينة يسري فريد", quizScore: 19, midScore: 28, finalScore: 47, certified: false }
    ],
    "DB301": [
      { studentId: "SGU-10045", studentName: student.nameArabic, quizScore: 17, midScore: 24, finalScore: 42, certified: false },
      { studentId: "SGU-20119", studentName: "مصطفى كمال الدين الشربيني", quizScore: 19, midScore: 29, finalScore: 48, certified: false },
      { studentId: "SGU-30441", studentName: "أمينة يسري فريد", quizScore: 16, midScore: 21, finalScore: 35, certified: false }
    ],
    "SWE311": [
      { studentId: "SGU-10045", studentName: student.nameArabic, quizScore: 20, midScore: 29, finalScore: 49, certified: false },
      { studentId: "SGU-20119", studentName: "مصطفى كمال الدين الشربيني", quizScore: 14, midScore: 23, finalScore: 39, certified: false },
      { studentId: "SGU-30441", studentName: "أمينة يسري فريد", quizScore: 18, midScore: 27, finalScore: 43, certified: false }
    ],
    "SEC304": [
      { studentId: "SGU-10045", studentName: student.nameArabic, quizScore: 16, midScore: 25, finalScore: 41, certified: false },
      { studentId: "SGU-20119", studentName: "مصطفى كمال الدين الشربيني", quizScore: 16, midScore: 25, finalScore: 41, certified: false },
      { studentId: "SGU-30441", studentName: "أمينة يسري فريد", quizScore: 17, midScore: 24, finalScore: 40, certified: false }
    ]
  });

  // Calculate grade text based on total score
  const calculateGradeString = (total: number) => {
    if (total >= 95) return "A+";
    if (total >= 90) return "A";
    if (total >= 85) return "B+";
    if (total >= 80) return "B";
    if (total >= 75) return "C+";
    if (total >= 70) return "C";
    if (total >= 60) return "D";
    return "F";
  };

  const handleScoreChange = (courseCode: string, studentId: string, segment: "quiz" | "mid" | "final", val: string) => {
    const rawVal = Math.min(
      segment === "quiz" ? 20 : segment === "mid" ? 30 : 50,
      Math.max(0, parseInt(val) || 0)
    );

    setGradesTable(prev => {
      const rows = prev[courseCode] || [];
      const updatedRows = rows.map(r => {
        if (r.studentId === studentId) {
          return {
            ...r,
            quizScore: segment === "quiz" ? rawVal : r.quizScore,
            midScore: segment === "mid" ? rawVal : r.midScore,
            finalScore: segment === "final" ? rawVal : r.finalScore
          };
        }
        return r;
      });
      return { ...prev, [courseCode]: updatedRows };
    });
  };

  // GPA calculation helper to wire real-time updates back to the currently logged in Student profile
  const recalculateAndSaveStudentGpa = (updatedCourses: Course[]) => {
    const completed = updatedCourses.filter(c => c.status === "completed" && c.gradeObtained);
    if (completed.length === 0) return;
    
    const gradePoints: Record<string, number> = {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "F": 0.0
    };
    
    let totalPoints = 0;
    let totalHours = 0;
    completed.forEach(c => {
      const pts = gradePoints[c.gradeObtained || "B"] || 3.0;
      totalPoints += pts * c.credits;
      totalHours += c.credits;
    });
    
    const calculatedGpa = totalHours > 0 ? parseFloat((totalPoints / totalHours).toFixed(2)) : 3.42;

    setStudent((prev: any) => {
      const updatedProfile = {
        ...prev,
        totalGPA: calculatedGpa,
        gpa: calculatedGpa
      };
      localStorage.setItem("u_student", JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  const handleCertifyGrades = (courseCode: string) => {
    const rows = gradesTable[courseCode] || [];
    const courseObj = courses.find(c => c.code === courseCode);
    if (!courseObj) return;

    // Local student score
    const targetRow = rows.find(r => r.studentId === "SGU-10045");
    if (!targetRow) return;

    const totalScore = targetRow.quizScore + targetRow.midScore + targetRow.finalScore;
    const computedGrade = calculateGradeString(totalScore);

    // Save and Lock inside courses state
    const updatedCoursesList = courses.map(c => {
      if (c.code === courseCode) {
        return {
          ...c,
          status: "completed" as const,
          gradeObtained: computedGrade,
          finalGrade: totalScore
        };
      }
      return c;
    });

    setCourses(updatedCoursesList);
    localStorage.setItem("u_courses", JSON.stringify(updatedCoursesList));

    // Recalculate logged-in student's GPA
    recalculateAndSaveStudentGpa(updatedCoursesList);

    // Mark as certified locally in grades table
    setGradesTable(prev => {
      const updatedRows = (prev[courseCode] || []).map(r => ({ ...r, certified: true }));
      return { ...prev, [courseCode]: updatedRows };
    });

    // Write to central system logs
    const auditMsg = `رصد واعتماد: قام الدكتور يوسف خالد برصد نتائج مقرر [${courseObj.name}] واعتماد الأوراق ونتائج الكنترول للطلاب المقيدين إلكترونياً بالترم الثاني.`;
    if (addLog) addLog(auditMsg);

    // Trigger dynamic Push Notification
    triggerSystemPush(
      lang === "ar" ? "📢 اعتماد درجات المقرر" : "📢 Grades Approved Released",
      lang === "ar" 
        ? `عزيزي الطالب، تم اعتماد إدخال درجات مادة [${courseObj.name}] برصيدك الأكاديمي رسمياً بمعدل: (${computedGrade}).`
        : `Your results for Course [${courseObj.name}] have been released. Final Grade: ${computedGrade}.`
    );

    alert(lang === "ar" ? "تم قيد وبث النتائج واعتمادها رسمياً من لجنة الكنترول بـ SGU!" : "Grades released and registered inside SGU database controller!");
  };

  // 3. Research grant requests states
  const [publications, setPublications] = useState<any[]>([
    { id: "pub1", title: "Optimizing Transformers for Arabic Dialectic Clinical Models", journal: "Egyptian AI Review", date: "2026-03", status: "published" },
    { id: "pub2", title: "Blockchain Consensus for High-Resolution Academic ERP Cryptography", journal: "SCU Tech Journal", date: "2026-05", status: "under_review"}
  ]);

  const [newPubTitle, setNewPubTitle] = useState("");
  const [newPubJournal, setNewPubJournal] = useState("");

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubTitle || !newPubJournal) return;
    const newPub = {
      id: "pub_" + Date.now(),
      title: newPubTitle,
      journal: newPubJournal,
      date: new Date().toISOString().substring(0, 7),
      status: "under_review"
    };
    setPublications(prev => [newPub, ...prev]);
    setNewPubTitle("");
    setNewPubJournal("");
    triggerSystemPush(
      lang === "ar" ? "📚 تم التقديم للنشر العلمي" : "📚 Paper Draft Registered",
      lang === "ar" ? `تم تسجيل بحثك الأول المقترح [${newPub.title}] بلجنة التقييم الموحدة بجامعة الصالحية الجديدة.` : `Paper proposed: [${newPub.title}] has been queued.`
    );
  };

  const [grants, setGrants] = useState<any[]>([
    { id: "g1", title: "تطوير معمل الذكاء الاصطناعي السيبراني لساحات الصالحية", amount: 150000, status: "approved", approvedDate: "2026-04-10" },
    { id: "g2", title: "نظم استشعار حراري للرصد الزراعي بمدن الدلتا ومحافظة الشرقية", amount: 75000, status: "pending" }
  ]);

  const [newGrantTitle, setNewGrantTitle] = useState("");
  const [newGrantAmount, setNewGrantAmount] = useState("50000");

  const handleAddGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrantTitle) return;
    const newG = {
      id: "g_" + Date.now(),
      title: newGrantTitle,
      amount: parseFloat(newGrantAmount) || 50000,
      status: "pending"
    };
    setGrants(prev => [newG, ...prev]);
    setNewGrantTitle("");
    setNewGrantAmount("50000");
    triggerSystemPush(
      lang === "ar" ? "💰 تقديم طلب منحة أكاديمية" : "💰 SGU Grant Application Filed",
      lang === "ar" ? `تم إحالة طلب تمويل المنحة [${newG.title}] بقيمة ${newG.amount} ج.م لمجلس تخطيط الشؤون البحثية.` : `Grant proposal filed: [${newG.title}] for ${newG.amount} EGP.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Advisor Profile Banner */}
      <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 justify-end">
            <h3 className="text-sm font-black text-slate-100">{advisorName}</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
          </div>
          <p className="text-xs text-teal-400">{advisorDept}</p>
          <p className="text-[10px] text-slate-500 font-mono">
            SGU Academic Employee Key ID: EMP-FAC-77319-K2
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-850">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">{lang === "ar" ? "نصاب التدريس الأسبوعي" : "Weekly Credit Hours"}</span>
            <span className="text-sm font-black text-teal-400 font-mono">16 / Hour</span>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-850">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">{lang === "ar" ? "الطلاب المقيدين تحت الإرشاد" : "Advisee Student Count"}</span>
            <span className="text-sm font-black text-emerald-400 font-mono">48 Students</span>
          </div>
        </div>
      </div>

      {/* --- SUBTAB (FACULTY OVERVIEW) --- */}
      {subTab === "faculty_overview" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Calendar schedule */}
          <div className="md:col-span-8 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-350 flex items-center justify-end gap-1.5 border-b border-slate-850 pb-2">
              <span>{lang === "ar" ? "جدول المحاضرات اليومي وكادري الأسبوعي بفضائيات الحرم" : "Weekly Teaching Timetable Slot Grid"}</span>
              <Calendar className="w-4 h-4 text-teal-400" />
            </h4>

            <div className="space-y-3">
              {[
                { day: "الأحد (Sunday)", slots: [
                  { time: "08:30 - 10:00", name: "مبادئ الذكاء الاصطناعي (AI302)", location: "المدرج الكبير أ" },
                  { time: "10:15 - 12:15", name: "أنظمة قواعد البيانات المتقدمة (DB301)", location: "مختبر الحاسب 3" }
                ]},
                { day: "الاثنين (Monday)", slots: [
                  { time: "12:30 - 14:00", name: "الأمن السيبراني والشبكات (SEC304)", location: "قاعة محاضرات 204" }
                ]},
                { day: "الثلاثاء (Tuesday)", slots: [
                  { time: "09:00 - 11:30", name: "تطوير تطبيقات الويب والموبايل (SWE311)", location: "مختبر البرمجيات 5" }
                ]}
              ].map((dayItem, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-2">
                  <span className="text-xs font-black text-teal-400 block border-b border-slate-900 pb-1.5">{dayItem.day}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {dayItem.slots.map((sl, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded border border-slate-850 space-y-1 text-right">
                        <div className="flex gap-2 justify-between items-center flex-row-reverse text-[9.5px] font-mono text-slate-500">
                          <span>⏱️ {sl.time}</span>
                          <span>🏢 {sl.location}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-200">{sl.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick lists */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-right">
              <h4 className="text-xs font-bold text-slate-205 flex items-center justify-end gap-1.5">
                <span>{lang === "ar" ? "قائمة المقيدين للاستشارات" : "Advisee Roster Profile"}</span>
                <Users className="w-4 h-4 text-teal-400" />
              </h4>

              <div className="space-y-2">
                {studentsRoster.map(st => (
                  <div key={st.id} className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[9px] font-mono bg-slate-900 text-slate-500 px-1 py-0.5 rounded">{st.id}</span>
                      <span className="font-bold text-slate-200">{st.nameAr}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 flex-row-reverse">
                      <span>{st.major}</span>
                      <span>Level: {st.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-4.5 rounded-xl border border-slate-800 text-right space-y-3">
              <span className="text-xs font-bold text-slate-250 block">{lang === "ar" ? "لوحة الإعلانات وكتابة التعاميم" : "Broadcast Board Memo"}</span>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                {lang === "ar" 
                  ? "قم ببث المحتوى أو كتابة إعلان عاجل لجميع طلاب الحرم الجامعي مباشرة من وحدة البث الموحد Gateway." 
                  : "Post circular alerts directly to digital boards."}
              </p>
              <div className="border border-yellow-500/10 bg-yellow-500/5 p-3 rounded-lg text-[10px] text-yellow-500 flex gap-2 items-start text-right">
                <p>
                  {lang === "ar" 
                    ? "تنبيه: الكنترول الأكاديمي مفتوح لرصد الدرجات حتى تاريخ 28 يونيو 2026. يرجى توثيق كافة العلامات لتلافي الغرامة الإدارية."
                    : "Grades registry must lock by June 28, 2026. File logs on time."}
                </p>
                <AlertTriangle className="w-4 h-4 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB (GRADE RECORDING CONSOLE) --- */}
      {subTab === "faculty_grades" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 text-right border-b border-slate-850 pb-4">
            <div className="w-full sm:w-auto">
              <label className="block text-[11px] font-bold text-slate-400 mb-1">{lang === "ar" ? "اختر المقرر الدراسي المراد رصده وإقراره:" : "Pick Registered Course to Release:"}</label>
              <select
                value={selectedCourseCode}
                onChange={e => setSelectedCourseCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-right text-slate-200 outline-none"
              >
                {registeredCourses.length === 0 ? (
                  <option>{lang === "ar" ? "لا توجد مقررات مقيدة نشطة حالياً" : "No active courses found"}</option>
                ) : (
                  registeredCourses.map(c => (
                    <option key={c.code} value={c.code}>
                      SGU-{c.code} : {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="text-right space-y-1">
              <h4 className="text-xs font-black text-slate-200 flex items-center gap-2 justify-end">
                <span>{lang === "ar" ? "وحدة الكنترول والتحكيم وإصدار الشهادات المصدقة" : "Academic Grades Registry & Certificate Releases"}</span>
                <Lock className="w-4 h-4 text-teal-400" />
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal max-w-sm">
                {lang === "ar" 
                  ? "تتيح هذه الصفحة للأستاذ تسجل الدرجات الدورية والنهائية ومطابقتها وتصديرها فورياً لملفات الطلاب مع إعادة حساب التقدير والـ GPA تلقائياً."
                  : "Input term parameters. Computes, signs, and dispatches scores instantly into centralized block records."}
              </p>
            </div>
          </div>

          {/* Roster list matrix */}
          <div className="space-y-4">
            <div className="overflow-x-auto text-right">
              <table className="w-full text-xs text-slate-300 font-medium">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] text-slate-400">
                    <th className="p-3 text-right">{lang === "ar" ? "كود الطالب" : "ID"}</th>
                    <th className="p-3 text-right">{lang === "ar" ? "اسم الطالب" : "Candidate Name"}</th>
                    <th className="p-3 text-center">{lang === "ar" ? "أعمال السنة (20)" : "Work/Quiz (20)"}</th>
                    <th className="p-3 text-center">{lang === "ar" ? "امتحان الميدترم (30)" : "Midterm Exam (30)"}</th>
                    <th className="p-3 text-center">{lang === "ar" ? "الامتحان النهائي (50)" : "Final Theory (50)"}</th>
                    <th className="p-3 text-center">{lang === "ar" ? "إجمالي الدرجة (100)" : "Sum (100)"}</th>
                    <th className="p-3 text-center">{lang === "ar" ? "التقدير الأكاديمي" : "Letter Grade"}</th>
                  </tr>
                </thead>
                <tbody>
                  {(gradesTable[selectedCourseCode] || []).map((row) => {
                    const sum = row.quizScore + row.midScore + row.finalScore;
                    const letterGrade = calculateGradeString(sum);
                    const isRowCertified = row.certified || (courses.find(c => c.code === selectedCourseCode)?.status === "completed");

                    return (
                      <tr key={row.studentId} className="border-b border-slate-850 hover:bg-slate-905 transition">
                        <td className="p-3 text-right text-[10px] font-mono text-slate-400">{row.studentId}</td>
                        <td className="p-3 text-right font-black text-slate-200">
                          {row.studentName}
                          {row.studentId === "SGU-10045" && <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/35 rounded-full px-1.5 py-0.2 mx-2 text-[8.5px] font-bold">حسابك الفعلي</span>}
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={row.quizScore}
                            disabled={isRowCertified}
                            onChange={e => handleScoreChange(selectedCourseCode, row.studentId, "quiz", e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded p-1.5 text-center text-xs text-white outline-none w-16 disabled:opacity-40 disabled:bg-slate-900 font-mono focus:border-teal-500"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={row.midScore}
                            disabled={isRowCertified}
                            onChange={e => handleScoreChange(selectedCourseCode, row.studentId, "mid", e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded p-1.5 text-center text-xs text-white outline-none w-16 disabled:opacity-40 disabled:bg-slate-900 font-mono focus:border-teal-500"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={50}
                            value={row.finalScore}
                            disabled={isRowCertified}
                            onChange={e => handleScoreChange(selectedCourseCode, row.studentId, "final", e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded p-1.5 text-center text-xs text-white outline-none w-16 disabled:opacity-40 disabled:bg-slate-900 font-mono focus:border-teal-500"
                          />
                        </td>
                        <td className="p-3 text-center font-mono font-extrabold text-slate-100">{sum}</td>
                        <td className="p-3 text-center font-black">
                          <span className={`px-2 py-0.5 rounded font-mono ${
                            letterGrade.startsWith("A") ? "text-emerald-400 bg-emerald-950/25" : 
                            letterGrade.startsWith("B") ? "text-teal-400 bg-teal-950/25" : "text-amber-400 bg-amber-950/25"
                          }`}>
                            {letterGrade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center bg-slate-950/50 p-4 rounded-xl border border-slate-850 flex-col sm:flex-row gap-3">
              <div className="flex gap-2 items-center flex-row-reverse text-right text-[10px] leading-normal text-slate-500 max-w-sm">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p>
                  {lang === "ar" 
                    ? "إقرار: يؤدي إطلاق رصد النتائج وقرصنتها لخلق إشعار فوري وتثبيت دائم للنتائج لجميع ملفات الطلاب والكنترول، ولا يقبل التوثيق التراجع اليدوي." 
                    : "Certified Grades cannot be manipulated or recalled. Double check entries before saving."}
                </p>
              </div>

              <button
                type="button"
                disabled={courses.find(c => c.code === selectedCourseCode)?.status === "completed"}
                onClick={() => handleCertifyGrades(selectedCourseCode)}
                className="bg-teal-600 hover:bg-teal-500 cursor-pointer disabled:opacity-40 disabled:bg-slate-900 text-slate-950 text-xs font-black px-6 py-2 rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {courses.find(c => c.code === selectedCourseCode)?.status === "completed" 
                  ? (lang === "ar" ? "الرصد معتمد ومغلق حالياً" : "Certified & Locked") 
                  : (lang === "ar" ? "حفظ واعتماد وإطلاق النتائج" : "Approve & Certified Releases")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB (ACADEMIC RESEARCH & GRANTS) --- */}
      {subTab === "faculty_research" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scientific Publications Section */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-850 pb-2 text-right">
              <h4 className="text-xs font-bold text-slate-205 flex items-center justify-end gap-1.5">
                <span>{lang === "ar" ? "الملف الأكاديمي للأبحاث والمقالات العلمية" : "Verified Academic Publications Index"}</span>
                <BookOpen className="w-4 h-4 text-teal-400" />
              </h4>
            </div>

            <form onSubmit={handleAddPublication} className="space-y-3 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{lang === "ar" ? "اسم المجلة الطابعة" : "Publisher / Journal"}</label>
                  <input
                    type="text"
                    value={newPubJournal}
                    onChange={e => setNewPubJournal(e.target.value)}
                    placeholder="IEEE Computer Magazine"
                    className="w-full bg-slate-950 border border-slate-850 p-2 text-right text-xs text-slate-200 outline-none rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{lang === "ar" ? "عنوان ورقة البحث" : "Research Paper Title"}</label>
                  <input
                    type="text"
                    value={newPubTitle}
                    onChange={e => setNewPubTitle(e.target.value)}
                    placeholder="E.g. Arabic Dialects in Transformers"
                    className="w-full bg-slate-950 border border-slate-855 p-2 text-right text-xs text-slate-200 outline-none rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 cursor-pointer text-slate-950 text-xs font-extrabold px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {lang === "ar" ? "تسجيل فكرة ونشر المقال المقترح" : "Publish proposed Paper"}
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              {publications.map((p, idx) => (
                <div key={p.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex justify-between items-center gap-4 text-right">
                  <span className={`text-[9px] font-bold ${p.status === "published" ? "text-emerald-400 bg-emerald-950/20" : "text-amber-500 bg-amber-950/20"} px-2 py-0.5 border border-slate-900 rounded`}>
                    {p.status === "published" ? (lang === "ar" ? "منشور ومفهرس" : "Indexed") : (lang === "ar" ? "تحت التقييم والتدقيق" : "Under Review")}
                  </span>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-slate-200">{p.title}</h5>
                    <p className="text-[10px] text-slate-500">{p.journal} - {p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Grants Section */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-850 pb-2 text-right">
              <h4 className="text-xs font-bold text-slate-205 flex items-center justify-end gap-1.5">
                <span>{lang === "ar" ? "إيراد المنح الأكاديمية والتمويل البحثي" : "SGU Science Grants & Subsidies Funding"}</span>
                <Award className="w-4 h-4 text-teal-400" />
              </h4>
            </div>

            <form onSubmit={handleAddGrant} className="space-y-3 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{lang === "ar" ? "الدعم التمويلي المطلوب (ج.م)" : "Requested Funding Amount (EGP)"}</label>
                  <input
                    type="number"
                    step={1000}
                    value={newGrantAmount}
                    onChange={e => setNewGrantAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2 text-center text-xs text-slate-200 font-mono outline-none rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{lang === "ar" ? "بند وموضوع المنحة التمويلية" : "Subsidies Project Domain Name"}</label>
                  <input
                    type="text"
                    value={newGrantTitle}
                    onChange={e => setNewGrantTitle(e.target.value)}
                    placeholder="E.g. Agricultural Thermal Sensors East Egypt"
                    className="w-full bg-slate-950 border border-slate-855 p-2 text-right text-xs text-slate-200 outline-none rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 cursor-pointer text-slate-950 text-xs font-extrabold px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {lang === "ar" ? "تقديم مقترح المنحة المالية رسمياً" : "Submit Proposal Funding"}
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              {grants.map((g) => (
                <div key={g.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex justify-between items-center gap-4 text-right">
                  <span className={`text-[9px] font-semibold ${g.status === "approved" ? "text-emerald-400" : "text-amber-500"}`}>
                    {g.status === "approved" ? (lang === "ar" ? `تمت الموافقة: ${g.approvedDate}` : "Approved") : (lang === "ar" ? "قيد الدراسة والفرز" : "Pending study")}
                  </span>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-slate-200">{g.title}</h5>
                    <p className="text-[10px] text-teal-400 font-mono font-bold">{g.amount.toLocaleString()} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === "deanship_control" && (
        <SguDeanshipPortal
          collegeId={student.college || "fcis"}
          dbUsers={dbUsers}
          setDbUsers={setDbUsers}
          courses={courses}
          setCourses={setCourses}
          schedules={schedules}
          setSchedules={setSchedules}
          attendance={attendance}
          setAttendance={setAttendance}
          colleges={colleges}
          setColleges={setColleges}
          lang={lang}
          addLog={addLog || (() => {})}
          triggerSystemPush={triggerSystemPush}
        />
      )}
    </div>
  );
}
