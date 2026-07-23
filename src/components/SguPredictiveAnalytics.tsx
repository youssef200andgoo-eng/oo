import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Award, 
  BookOpen, 
  Clock, 
  Compass, 
  Sparkles, 
  HelpCircle, 
  Activity, 
  AlertTriangle 
} from "lucide-react";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts";
import { Course } from "../types";

interface SguPredictiveAnalyticsProps {
  courses: Course[];
  student: any;
  lang: "ar" | "en";
}

export default function SguPredictiveAnalytics({
  courses,
  student,
  lang
}: SguPredictiveAnalyticsProps) {
  // Extract completed and registered courses
  const completedCourses = courses.filter(c => c.status === "completed" && c.gradeObtained);
  const registeredCourses = courses.filter(c => c.status === "registered");

  // Local state for registered course mock grades
  const [mockGrades, setMockGrades] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    registeredCourses.forEach(c => {
      initial[c.code] = "A"; // default expectation
    });
    return initial;
  });

  // Mock study hours per week multiplier
  const [studyHours, setStudyHours] = useState<number>(15);

  // Grade points mapping
  const gradePoints: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0
  };

  const handleGradeChange = (code: string, val: string) => {
    setMockGrades(prev => ({ ...prev, [code]: val }));
  };

  // Live calculation of projected GPA
  const [projectedGpa, setProjectedGpa] = useState<number>(3.82);
  const [unlockedHoursNum, setUnlockedHoursNum] = useState<number>(17);

  useEffect(() => {
    let completedPointsSum = 0;
    let completedHoursSum = 0;

    completedCourses.forEach(c => {
      const gp = gradePoints[c.gradeObtained || "B"] || 3.0;
      completedPointsSum += gp * c.credits;
      completedHoursSum += c.credits;
    });

    let mockPointsSum = 0;
    let mockHoursSum = 0;

    registeredCourses.forEach(c => {
      const selectedGrade = mockGrades[c.code] || "A";
      // Adjust slightly based on study hours filter (if very low, penalize grade)
      let calculatedGrade = selectedGrade;
      if (studyHours < 8 && selectedGrade.startsWith("A")) {
        calculatedGrade = "B";
      } else if (studyHours > 25 && selectedGrade.startsWith("B")) {
        calculatedGrade = "A";
      }

      const gp = gradePoints[calculatedGrade] || 3.0;
      mockPointsSum += gp * c.credits;
      mockHoursSum += c.credits;
    });

    const totalHours = completedHoursSum + mockHoursSum;
    const totalPoints = completedPointsSum + mockPointsSum;

    const finalProjected = totalHours > 0 ? parseFloat((totalPoints / totalHours).toFixed(2)) : 3.82;
    setProjectedGpa(finalProjected);
    setUnlockedHoursNum(totalHours);
  }, [mockGrades, studyHours, courses]);

  // Generate data points for Recharts curve representing GPA progress over semesters
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Generate linear term GPA progress
    const data = [
      { name: "خريف 2024", gpa: 3.50, cumulative: 3.50 },
      { name: "ربيع 2025", gpa: 3.65, cumulative: 3.58 },
      { name: "خريف 2025", gpa: 3.78, cumulative: 3.64 },
      { name: "الأكاديمي الحالي", gpa: student.totalGPA || student.gpa || 3.82, cumulative: student.totalGPA || student.gpa || 3.82 },
      { name: "الترم القادم المتوقع", gpa: projectedGpa, cumulative: parseFloat(((projectedGpa * 0.4) + (student.gpa * 0.6)).toFixed(2)) }
    ];
    setChartData(data);
  }, [projectedGpa, student]);

  // Determine honor degree classification based on simulated cumulative gpa
  const getClassificationAr = (gpa: number) => {
    if (gpa >= 3.85) return { text: "مرتبة الشرف الأولى الفيدرالية 👑", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5", desc: "أعلى تطلع ريادي لـ SGU" };
    if (gpa >= 3.50) return { text: "مرتبة الشرف الثانية 🎖️", color: "text-teal-400 border-teal-500/30 bg-teal-500/5", desc: "أداء نخبوي رابح" };
    if (gpa >= 3.00) return { text: "تقدير أكاديمي جيد جداً ✨", color: "text-sky-400 border-sky-500/30 bg-sky-500/5", desc: "نمو مستقر ومستمر" };
    if (gpa >= 2.00) return { text: "مستوفي الشروط الأكاديمية 👍", color: "text-amber-500 border-amber-500/30 bg-amber-500/5", desc: "النجاح القياسي المعتمد" };
    return { text: "تحت الملاحظة والإنذار الأكاديمي ⚠️", color: "text-rose-400 border-rose-500/30 bg-rose-500/5", desc: "يرجى الالتزام الإرشادي بالتكليفات" };
  };

  const getClassificationEn = (gpa: number) => {
    if (gpa >= 3.85) return { text: "Summa Cum Laude (First Class Honors) 👑", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5", desc: "Top 2% of SGU elite candidates" };
    if (gpa >= 3.50) return { text: "Magna Cum Laude (Second Class Honors) 🎖️", color: "text-teal-400 border-teal-500/30 bg-teal-500/5", desc: "Exceptional mastery achieved" };
    if (gpa >= 3.00) return { text: "Very Good Dean's List standing ✨", color: "text-sky-400 border-sky-500/30 bg-sky-500/5", desc: "Stable study routine" };
    if (gpa >= 2.00) return { text: "Good Academic Standing 👍", color: "text-amber-500 border-amber-500/30 bg-amber-500/5", desc: "Meets standard graduation goals" };
    return { text: "Academic Warning / Probation Status ⚠️", color: "text-rose-400 border-rose-500/30 bg-rose-500/5", desc: "Advising session highly recommended" };
  };

  const classification = lang === "ar" ? getClassificationAr(projectedGpa) : getClassificationEn(projectedGpa);

  // Career/Major track forecasting based on high scores
  const getSimulatedCareerPath = (gpa: number) => {
    if (gpa >= 3.75) {
      return lang === "ar" 
        ? "مهندس حوسبة سحابية ومعالجة لغات ذكية لدى مركز الصالحية الرقمي (AI Pioneer)"
        : "Lead Cloud ML Infrastructure Developer - SCU Enterprise Hub";
    }
    if (gpa >= 3.30) {
      return lang === "ar"
        ? "مطور برمجيات ذكية متكامل المهام (Full-Stack SWE Expert)"
        : "Senior Full-Stack Web & Mobile Engineer";
    }
    return lang === "ar"
      ? "محلل معلومات وقواعد بيانات معتمد (Data System Analyst)"
      : "Database Design Controller & Security Engineer";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 text-right border-b border-slate-850 pb-4">
        <div>
          <div className="flex items-center gap-1 bg-teal-950 border border-teal-900/30 px-3 py-1 rounded-full text-[10px] text-teal-400 font-bold font-mono w-fit ml-auto mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Engine v1.0</span>
          </div>
          <h4 className="text-sm font-black text-slate-100 flex items-center gap-2 justify-end">
            <span>{lang === "ar" ? "أداة النمذجة الإحصائية والتنبؤ بالمعدل التراكمي" : "SGU GPA Simulator & Predictive Modeling"}</span>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </h4>
        </div>

        <p className="text-[11px] text-slate-500 max-w-sm">
          {lang === "ar" 
            ? "قم بمحاكاة واختبار درجات الفترات المتبقية، وساعات الدراسة الأسبوعية للوقوف فورياً وديناميكياً على معدلك المتوقع ومستواك الأكاديمي والمهني للتخرج."
            : "Estimate future semesters. Tweak scores to model cumulative GPA changes, graduation honors, and career alignments."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Simulation Tweak Column */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-850 text-right space-y-5">
          <h5 className="text-xs font-bold text-teal-400 border-b border-slate-900 pb-2">
            {lang === "ar" ? "تغيير الفرضيات ومحاكاة التفوق" : "Interactive Parameter Sandbox"}
          </h5>

          {/* Registered Courses Loop to assign mock grades */}
          <div className="space-y-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">
              {lang === "ar" ? "تقدير مواد الترم الثاني الافتراضية:" : "Active Course Target Grades:"}
            </span>

            {registeredCourses.length === 0 ? (
              <p className="text-[11px] text-slate-500 text-center py-2">
                {lang === "ar" ? "لا توجد مساقات مسجلة للتثبيت" : "No active subjects registered"}
              </p>
            ) : (
              <div className="space-y-3">
                {registeredCourses.map(c => (
                  <div key={c.code} className="flex justify-between items-center gap-4 bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                    <select
                      value={mockGrades[c.code] || "A"}
                      onChange={e => handleGradeChange(c.code, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-205 font-mono text-center focus:border-teal-500 focus:outline-none"
                    >
                      {["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"].map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-200 block truncate max-w-[150px]">{c.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">SGU-{c.code} • {c.credits} Hrs</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly study hours dynamic factor */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="font-mono text-teal-400 font-bold">{studyHours} {lang === "ar" ? "ساعة" : "Hrs"} / wk</span>
              <span className="text-slate-500 font-bold">{lang === "ar" ? "معدل المذاكرة الأسبوعية:" : "Weekly Study commitment:"}</span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={1}
              value={studyHours}
              onChange={e => setStudyHours(parseInt(e.target.value))}
              className="w-full accent-teal-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
            />
            <p className="text-[9.5px] text-slate-500 leading-normal">
              {studyHours < 12 
                ? (lang === "ar" ? "🛑 تحذير: نصاب منخفض، قد يعرّض درجات التفوق للهبوط التلقائي للمستوى B." : "🛑 Alert: Low hours may limit top grade thresholds automatically.")
                : (lang === "ar" ? "🚀 ممتاز: كفاءة زمنية كافية لتأمين أعلى النقاط." : "🚀 Optimal: Enough time committed to unlock and lock top grades.")}
            </p>
          </div>
        </div>

        {/* Right Dashboard Visualization Metrics Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-1">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">{lang === "ar" ? "معدلك المتوقع" : "Projected GPA"}</span>
              <span className="text-2xl font-black text-teal-400 font-mono">{projectedGpa.toFixed(2)}</span>
              <p className="text-[9.5px] text-slate-500">
                {lang === "ar" ? "حساب فوري من التراكم تزامناً" : "Real-time recalculation of all hours"}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-1">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">{lang === "ar" ? "الرتبة الأكاديمية المتوقعة" : "Class Rank standing"}</span>
              <span className="text-xs font-black text-slate-100 block py-1">{classification.text}</span>
              <span className="text-[9.5px] text-slate-500 block leading-tight">{classification.desc}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-right space-y-1">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">{lang === "ar" ? "المسار المهني المستشرف" : "Forecasted Career Major"}</span>
              <span className="text-xs font-black text-teal-400 block py-1 truncate">{getSimulatedCareerPath(projectedGpa)}</span>
              <span className="text-[9.5px] text-slate-500 block">
                {lang === "ar" ? "توصية ذكية طبقاً لتقديرات الحاسب والـ AI" : "AI career path alignment recommendations"}
              </span>
            </div>
          </div>

          {/* Recharts Area Curve */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3">
            <h6 className="text-xs font-bold text-slate-205 text-right flex items-center justify-end gap-1.5">
              <span>{lang === "ar" ? "منحنى تقدم المعدل التراكمي وتأثير الفصل الجديد" : "Semester-by-Semester Cumulative GPA trajectory"}</span>
              <Activity className="w-4 h-4 text-teal-400" />
            </h6>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[2.0, 4.0]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '11px', textAlign: 'right' }} 
                  />
                  <Area type="monotone" dataKey="cumulative" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGpa)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic AI Study Recommendations */}
          <div className="bg-slate-950/40 p-4.5 rounded-xl border border-slate-850 flex gap-3 text-right">
            <div className="flex-1 space-y-1">
              <h6 className="text-[11.5px] font-bold text-teal-400">{lang === "ar" ? "توصية المرشد الأكاديمي الإرشادية (AI Insight)" : "Predictive Advisor Insights:"}</h6>
              <p className="text-[10.5px] text-slate-350 leading-relaxed">
                {projectedGpa >= 3.8
                  ? (lang === "ar" 
                    ? `رائع جداً! معدلك المتوقع (${projectedGpa}) يضعك رسمياً في المرتبة الشرفية الأعلى. يوصى بالتركيز على مادة [SGU-AI302] للحفاظ على المستوى المتقدم، والتقديم فورياً كمساعد باحث بالكلية.`
                    : `Incredible! A projected GPA of (${projectedGpa}) cements you firmly in the Summa Cum Laude tier. Recommend pursuing academic assistant roles or peer tutoring in DB301 next term.`)
                  : (lang === "ar"
                    ? `معدلك المحاكي (${projectedGpa}) مستقر في النطاق فوق المتوسط. لرفع المعدل وتأمين مرتبة شرف أولى، ننصح بزيادة وتيرة التحضير لمجالات الـ Mobile والويب بمعدل 4 ساعات إضافية أسبوعياً.`
                    : `A simulated performance of (${projectedGpa}) keeps you highly competitive. Tweak class efforts by adding 4 extra hours specifically dedicated to software systems (SWE311) to breach the 3.80 target threshold.`)}
              </p>
            </div>
            <Award className="w-8 h-8 text-teal-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
