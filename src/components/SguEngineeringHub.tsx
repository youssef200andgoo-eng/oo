import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Cpu,
  Database,
  GitBranch,
  Terminal,
  Activity,
  Server,
  FileCode,
  Download,
  Upload,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Search,
  Eye,
  Settings,
  Flame,
  FileText,
  UserCheck,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Clock,
  Compass,
  ArrowRight,
  GitCommit,
  Layers,
  Key,
  Globe,
  Trash2,
  ListFilter
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { DatabaseUser } from "../databaseMock";
import { AdmissionApplication } from "../types";

interface SguEngineeringHubProps {
  lang: "ar" | "en";
  dbUsers: DatabaseUser[];
  setDbUsers: React.Dispatch<React.SetStateAction<DatabaseUser[]>>;
  applications: AdmissionApplication[];
  setApplications: React.Dispatch<React.SetStateAction<AdmissionApplication[]>>;
  triggerSystemPush: (title: string, msg: string) => void;
  addLog: (msg: string) => void;
}

// Sub-tabs for the DevOps and Engineering Hub
type HubTab =
  | "architecture"
  | "testing"
  | "versioning"
  | "deployment"
  | "backup"
  | "security"
  | "performance"
  | "documentation"
  | "roadmap";

export default function SguEngineeringHub({
  lang,
  dbUsers,
  setDbUsers,
  applications,
  setApplications,
  triggerSystemPush,
  addLog,
}: SguEngineeringHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>("architecture");

  const triggerToast = (msg: string) => {
    triggerSystemPush("هندسة النظم", msg);
  };

  // ==========================================
  // STATE MANAGEMENT & DATA SNAPSHOTS (PHASE 28)
  // ==========================================
  // Keep track of user-defined backups/snapshots for "Back-in-time" rollback
  const [snapshots, setSnapshots] = useState<Array<{
    id: string;
    timestamp: string;
    description: string;
    usersCount: number;
    appsCount: number;
    dbUsersData: string; // JSON stringified snapshot
    applicationsData: string;
  }>>([
    {
      id: "SNAP-V2.3.1-INIT",
      timestamp: "2026-07-01 04:00:00",
      description: "نقطة استرجاع تلقائية عند ترقية النظام إلى الإصدار 2.3.1",
      usersCount: dbUsers.length,
      appsCount: applications.length,
      dbUsersData: JSON.stringify(dbUsers),
      applicationsData: JSON.stringify(applications)
    }
  ]);
  const [snapshotDesc, setSnapshotDesc] = useState("");

  const handleCreateSnapshot = (descText?: string) => {
    const desc = descText || snapshotDesc || "نسخة احتياطية يدوية للنظام";
    const newSnap = {
      id: `SNAP-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      description: desc,
      usersCount: dbUsers.length,
      appsCount: applications.length,
      dbUsersData: JSON.stringify(dbUsers),
      applicationsData: JSON.stringify(applications)
    };
    setSnapshots(prev => [newSnap, ...prev]);
    setSnapshotDesc("");
    triggerSystemPush("نظام إدارة الحالات", "تم التقاط نسخة مطابقة كاملة لقاعدة البيانات والترحيل بنجاح.");
    addLog(`تم أرشفة الحالة الحالية بترميز معرف: ${newSnap.id}`);
  };

  const handleRollbackToSnapshot = (snapId: string) => {
    const targetSnap = snapshots.find(s => s.id === snapId);
    if (!targetSnap) return;

    try {
      const restoredUsers = JSON.parse(targetSnap.dbUsersData) as DatabaseUser[];
      const restoredApps = JSON.parse(targetSnap.applicationsData) as AdmissionApplication[];
      
      setDbUsers(restoredUsers);
      setApplications(restoredApps);
      
      triggerSystemPush("استعادة البيانات", `تمت الاستعادة بنجاح إلى النقطة الزرقاء: ${snapId}`);
      addLog(`تم تصفير واستعادة سجل الجامعة بالكامل للحالة المسجلة بـ ${targetSnap.timestamp}`);
    } catch (err) {
      triggerSystemPush("خطأ بالاستعادة", "فشلت قراءة التشفير للبيانات المنسوخة.");
    }
  };

  // ==========================================
  // TEST SUITE SIMULATOR (PHASE 27)
  // ==========================================
  const [testSuiteLoading, setTestSuiteLoading] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{
    unit: "idle" | "running" | "passed" | "failed";
    integration: "idle" | "running" | "passed" | "failed";
    e2e: "idle" | "running" | "passed" | "failed";
    totalTests: number;
    passed: number;
    failed: number;
  }>({
    unit: "idle",
    integration: "idle",
    e2e: "idle",
    totalTests: 48,
    passed: 0,
    failed: 0,
  });

  const runFullTestSuite = async () => {
    setTestSuiteLoading(true);
    setTestProgress(0);
    setTestLogs(["🚦 البدء في تهيئة محاكاة بيئة الاختبارات الأوتوماتيكية Jest/Cypress..."]);
    setTestResults({
      unit: "running",
      integration: "idle",
      e2e: "idle",
      totalTests: 48,
      passed: 0,
      failed: 0,
    });

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Unit testing stage
    await sleep(800);
    setTestProgress(20);
    setTestLogs(prev => [
      ...prev,
      "🧪 [UNIT TESTS] تشغيل اختبار وحدة التشفير الثنائي SHA-256...",
      "✓ [PASS] crypto.ts: حساب البصمات وتأكيد المطابقة الرقمية للمستندات متطابق.",
      "🧪 [UNIT TESTS] التحقق من سلامة معادلات حساب الـ GPA التراكمي الأكاديمي...",
      "✓ [PASS] gpaCalculator: موازنة الساعات المعتمدة تعطي نتائج متطابقة تماماً مع اللائحة الأكاديمية."
    ]);
    setTestResults(prev => ({ ...prev, unit: "passed", passed: 15 }));

    // Integration testing stage
    await sleep(1000);
    setTestProgress(50);
    setTestLogs(prev => [
      ...prev,
      "🔗 [INTEGRATION TESTS] مراجعة الترابط والتنسيق بين نظام القبول SIS وبوابة المالية...",
      "✓ [PASS] integration_finance_admission: دفع الرسوم يغير تلقائياً حالة المتقدم بمحاكي القبول الموحد.",
      "🔗 [INTEGRATION TESTS] تدقيق ترحيل الشهادات وصور المستندات إلى مستندات Google Drive...",
      "✓ [PASS] integration_gdrive_picker: استلام الروابط من Cloud File Manager يثبت البيانات بقاعدة البيانات."
    ]);
    setTestResults(prev => ({ ...prev, integration: "passed", passed: 32 }));

    // E2E testing stage
    await sleep(1200);
    setTestProgress(85);
    setTestLogs(prev => [
      ...prev,
      "🎭 [E2E TESTS] محاكاة سيناريو مستخدم كامل: قيد طالب جديد -> تسديد المصروفات -> رصد GPA في الكنترول...",
      "⏳ [SIMULATION] تشغيل المتصفح الخفي Chromium لفتح بوابة SGU للطلاب وتسجيل الدخول...",
      "✓ [PASS] user_scenario_registration_to_gpa_flow: تمت محاكاة تسجيل الدخول بنجاح برقم قومي صحيح.",
      "✓ [PASS] check_attendance_and_reports: توليد التقارير الإدارية والمالية CSV متوافق تماماً."
    ]);
    setTestResults(prev => ({ ...prev, e2e: "passed", passed: 48 }));

    await sleep(500);
    setTestProgress(100);
    setTestSuiteLoading(false);
    triggerSystemPush("جناح الاختبارات الأوتوماتيكية", "اكتمل تشغيل 48 اختبار بنجاح 100% وبدون أخطاء!");
    addLog("تم تشغيل محاكي الاختبارات الأوتوماتيكية بنجاح وتوثيق مطابقة اللوائح.");
  };

  // E2E Scenario trigger
  const [e2eScenario, setE2eScenario] = useState<string | null>(null);
  const [e2eLogs, setE2eLogs] = useState<string[]>([]);
  const triggerE2EScenario = async (scenarioKey: string) => {
    setE2eScenario(scenarioKey);
    setE2eLogs(["🎭 بدء محاكاة سيناريو الاستخدام للمستخدم النهائي..."]);
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    if (scenarioKey === "student_lifecycle") {
      await sleep(500);
      setE2eLogs(prev => [...prev, "👤 خطوة 1: يزور المتقدم بوابة القبول الموحدة ويدخل الرغبات (هندسة حاسبات)..."]);
      await sleep(600);
      setE2eLogs(prev => [...prev, "💳 خطوة 2: يقوم بدفع رسوم القبول عبر الخزنة الأكاديمية بنجاح..."]);
      await sleep(600);
      setE2eLogs(prev => [...prev, "📂 خطوة 3: يرفع المستندات (شهادة الثانوية، البطاقة) ويفحصها النظام بـ SHA-255..."]);
      await sleep(700);
      setE2eLogs(prev => [...prev, "🎓 خطوة 4: يتم الموافقة عليه إدارياً، ويولد له النظام كود الطالب وقيد رسمي..."]);
      await sleep(500);
      setE2eLogs(prev => [...prev, "✨ [اكتمال السيناريو] الطالب مسجل ومقيد الآن بنشاط كامل!"]);
    } else if (scenarioKey === "faculty_grading") {
      await sleep(500);
      setE2eLogs(prev => [...prev, "👨‍🏫 خطوة 1: يسجل الدكتور الدخول لبوابة أعضاء التدريس ويدخل لمقرر البرمجة الذكية..."]);
      await sleep(600);
      setE2eLogs(prev => [...prev, "📝 خطوة 2: يقوم برفع نموذج الامتحان MCQ الذكي وتوزيع الدرجات على الأسئلة..."]);
      await sleep(700);
      setE2eLogs(prev => [...prev, "🤖 خطوة 3: تشغيل محرك التصحيح التلقائي للأوراق الممسوحة ضوئياً ومعالجة النتائج..."]);
      await sleep(600);
      setE2eLogs(prev => [...prev, "🛡️ خطوة 4: التوقيع الرقمي على محضر الدرجات بشفرة البلوك تشين وتمريره للاعتماد..."]);
      await sleep(500);
      setE2eLogs(prev => [...prev, "✨ [اكتمال السيناريو] تم ترحيل الدرجات للـ GPA وإعلان نتائج المقررات!"]);
    } else {
      await sleep(500);
      setE2eLogs(prev => [...prev, "🔒 خطوة 1: يحاول مستخدم تسجيل الدخول بحساب مميز لإدارة المالية والرواتب..."]);
      await sleep(600);
      setE2eLogs(prev => [...prev, "🔑 خطوة 2: يطلب النظام رمز التحقق الثنائي المؤقت (MFA/TOTP)..."]);
      await sleep(600);
      setE2eLogs(prev => [...prev, "🛡️ خطوة 3: يدخل الموظف الرمز الصحيح، ويسمح له السيرفر بالوصول الآمن بصلاحيات RBAC..."]);
      await sleep(600);
      setE2eLogs(prev => [...prev, "💵 خطوة 4: يسجل ترحيل رواتب الهيئات المعاونة، ويولد كشف الرواتب المشفر بالكامل..."]);
      await sleep(500);
      setE2eLogs(prev => [...prev, "✨ [اكتمال السيناريو] تم الدفع والتدقيق بحماية التشفير الفيدرالي!"]);
    }
  };

  // ==========================================
  // CYBERSECURITY SIMULATOR (PHASE 31)
  // ==========================================
  const [sqlPayload, setSqlPayload] = useState("");
  const [sqlBlocked, setSqlBlocked] = useState<boolean | null>(null);
  const [sqlExplanation, setSqlExplanation] = useState("");

  const [xssPayload, setXssPayload] = useState("");
  const [xssBlocked, setXssBlocked] = useState<boolean | null>(null);
  const [xssExplanation, setXssExplanation] = useState("");

  const [securityAlerts, setSecurityAlerts] = useState<Array<{
    id: string;
    time: string;
    ip: string;
    event: string;
    severity: "low" | "medium" | "critical";
  }>>([
    { id: "SEC-483", time: "09:12:44", ip: "197.34.120.44", event: "محاولة حقن كود XSS ببيانات كرت الطالب وتم تصفير المدخلات أوتوماتيكياً", severity: "medium" },
    { id: "SEC-482", time: "08:44:02", ip: "105.110.45.21", event: "طلب وصول مالي بدون رمز MFA النشط وتم حجب الـ IP لمدة 15 دقيقة", severity: "critical" },
    { id: "SEC-481", time: "08:30:11", ip: "197.34.120.44", event: "تسجيل دخول ناجح للمشرف يوسف خالد مع تطابق شهادة التعمية", severity: "low" }
  ]);

  const handleTestSqlInjection = () => {
    if (!sqlPayload.trim()) return;
    
    // Check for common SQL Injection signatures
    const malicious = /('|"|--|union|select|insert|update|delete|drop|or\s+1\s*=\s*1)/i.test(sqlPayload);
    
    if (malicious) {
      setSqlBlocked(true);
      setSqlExplanation("🚫 تم حظر الطلب فورياً بواسطة جدار الحماية (WAF) وقواعد الاستعلامات البارامترية الآمنة (Prepared Statements / ORM).");
      
      // Add to security alerts log
      const newAlert = {
        id: `SEC-${Math.floor(Math.random() * 900) + 100}`,
        time: new Date().toTimeString().slice(0, 8),
        ip: "197.102.33.15",
        event: `محاولة حقن SQL Injection بحقل الاستعلام: "${sqlPayload.slice(0, 30)}..."`,
        severity: "critical" as const
      };
      setSecurityAlerts(prev => [newAlert, ...prev]);
      triggerSystemPush("تنبيه أمني عاجل", "تم صد محاولة اختراق SQL Injection وتسجيلها بنظام التدقيق الرياضي.");
    } else {
      setSqlBlocked(false);
      setSqlExplanation("🟢 تم معالجة الاستعلام كحقل نصي عادي آمن بدون أي تأثير على هيكل الجداول.");
    }
  };

  const handleTestXss = () => {
    if (!xssPayload.trim()) return;

    // Check for script tags or event handlers
    const malicious = /(<script|javascript:|onerror|onload|alert|document\.cookie)/i.test(xssPayload);

    if (malicious) {
      setXssBlocked(true);
      setXssExplanation("🚫 تم تطهير المدخلات (HTML Sanitization) وتحويل الرموز التعبيرية لمنع تفسيرها كأكواد تنفيذية بالمتصفح.");

      const newAlert = {
        id: `SEC-${Math.floor(Math.random() * 900) + 100}`,
        time: new Date().toTimeString().slice(0, 8),
        ip: "105.90.112.54",
        event: `محاولة حقن كود خبيث XSS بحقل الاسم: "${xssPayload.slice(0, 35)}..."`,
        severity: "medium" as const
      };
      setSecurityAlerts(prev => [newAlert, ...prev]);
      triggerSystemPush("تنبيه أمني", "تم كشف وتطهير محاولة حقن نصوص برمجية خبيثة (XSS).");
    } else {
      setXssBlocked(false);
      setXssExplanation("🟢 تم قبول النص وتطهيره بنجاح للعرض الآمن داخل واجهة المستخدم.");
    }
  };

  // ==========================================
  // DISASTER RECOVERY & CRASH SIMULATION (PHASE 30)
  // ==========================================
  const [isServerCrashed, setIsServerCrashed] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const simulateServerCrash = () => {
    setIsServerCrashed(true);
    triggerSystemPush("إنذار طوارئ", "تنبيه: محاكاة انهيار السيرفر وفقدان اتصال الخوادم الأكاديمية!");
    addLog("تم إطلاق سيناريو انهيار خوادم الجامعة لغرض اختبار Disaster Recovery.");
  };

  const runDisasterRecovery = async () => {
    setRecoveryLoading(true);
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    await sleep(800);
    addLog("DR: جاري تشغيل بيئة الحاويات الاحتياطية سريعة الإقلاع على GCP Cloud Run...");
    await sleep(800);
    addLog("DR: استرجاع أحدث نسخة تخزين سحابية مأرشفة أوتوماتيكياً (منذ ساعة)...");
    
    // Auto restore to initial or latest snapshot
    if (snapshots.length > 0) {
      const restoredUsers = JSON.parse(snapshots[snapshots.length - 1].dbUsersData);
      const restoredApps = JSON.parse(snapshots[snapshots.length - 1].applicationsData);
      setDbUsers(restoredUsers);
      setApplications(restoredApps);
    }
    
    await sleep(1000);
    setIsServerCrashed(false);
    setRecoveryLoading(false);
    triggerSystemPush("استعادة الكوارث الناجحة", "تم إعادة تشغيل السيرفر بالكامل واسترجاع 100% من بيانات الجامعة بنجاح!");
    addLog("تم اكتمال سيناريو Disaster Recovery بدون فقد أي سجلات ماليّة أو أكاديمية.");
  };

  // ==========================================
  // PERFORMANCE & STRESS TESTING (PHASE 32)
  // ==========================================
  const [redisCached, setRedisCached] = useState(true);
  const [stressLoad, setStressLoad] = useState<"low" | "medium" | "high">("medium");
  const [perfRunning, setPerfRunning] = useState(false);

  // Generate simulated chart data based on cache & stress settings
  const performanceData = useMemo(() => {
    const points = [];
    const baseLatency = redisCached ? 4 : 145;
    const stressMultiplier = stressLoad === "low" ? 1.0 : stressLoad === "medium" ? 1.5 : 2.8;

    for (let i = 1; i <= 10; i++) {
      // Add random jitter
      const jitter = Math.floor(Math.random() * (redisCached ? 3 : 45));
      const responseTime = Math.round((baseLatency + jitter) * stressMultiplier);
      const concurrentUsers = stressLoad === "low" ? 450 + i * 20 : stressLoad === "medium" ? 2200 + i * 150 : 8500 + i * 400;
      const cpuUsage = Math.min(99, Math.round((stressLoad === "low" ? 15 : stressLoad === "medium" ? 42 : 84) + Math.random() * 8));
      const cacheHitRatio = redisCached ? 94 + Math.round(Math.random() * 4) : 0;

      points.push({
        second: `${i}s`,
        latency: responseTime,
        users: concurrentUsers,
        cpu: cpuUsage,
        cacheHit: cacheHitRatio,
      });
    }
    return points;
  }, [redisCached, stressLoad, perfRunning]);

  return (
    <div className="space-y-6 text-right">
      
      {/* SERVER EMERGENCY OVERLAY (PHASE 30) */}
      {isServerCrashed && (
        <div className="bg-rose-950/90 border-2 border-rose-500 rounded-3xl p-8 text-center space-y-6 animate-pulse z-40 relative">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/30">
              <AlertTriangle className="w-10 h-10 animate-bounce" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-rose-400">🚨 محاكاة حالة الانهيار الكامل للسيرفر (Server Crash Simulation)</h3>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
              تم قطع الاتصال بقاعدة البيانات وإيقاف كافة الخدمات الأكاديمية والمالية لمحاكاة كارثة تقنية واختبار متانة خطة استرجاع البيانات ومستوى الاستعداد الأمني بالجامعة.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={runDisasterRecovery}
              disabled={recoveryLoading}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition flex items-center gap-2"
            >
              {recoveryLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري تشغيل خوادم الاستعادة السريعة...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  تشغيل سيناريو استعادة الكوارث (Disaster Recovery Blueprint)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-850 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-mono text-xs font-bold">
            <Server className="w-4 h-4" />
            <span>SGU ENTERPRISE DEVOPS & SYSTEMS CENTER</span>
          </div>
          <h2 className="text-lg font-black text-slate-100 mt-1">مركز هندسة النظم وإدارة الإصدارات والأمان الأكاديمي</h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            لوحة المطورين لتوثيق معايير الأكواد، الاختبارات الأوتوماتيكية، حماية الاختراق، والتحليل المستمر لأداء منصة SGU.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => {
              runFullTestSuite();
              setActiveTab("testing");
            }}
            className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-indigo-400 border border-indigo-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>تشغيل الاختبارات الأوتوماتيكية</span>
          </button>
          <button
            onClick={simulateServerCrash}
            disabled={isServerCrashed}
            className="cursor-pointer bg-slate-900 hover:bg-rose-955 text-rose-500 border border-rose-950/40 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>محاكاة انهيار خادم SGU</span>
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* NAVIGATION SIDEBAR */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: "architecture", name: "🏛️ معايير الكود وبنية الـ SOLID", desc: "Clean Code & Software Layout" },
            { id: "testing", name: "🧪 محاكي الاختبارات البرمجية", desc: "Unit, Integration & E2E Tests" },
            { id: "versioning", name: "🌿 الإصدارات والرجوع بالزمن", desc: "Git & Back-in-Time Snapshots" },
            { id: "deployment", name: "🚀 خوادم الإنتاج والـ DNS", desc: "Cloud Run Production Specs" },
            { id: "backup", name: "🗄️ الأرشفة واستعادة الكوارث", desc: "Automated Daily Backups" },
            { id: "security", name: "🛡️ جناح الأمان وصد الاختراقات", desc: "Security Shield & WAF Audits" },
            { id: "performance", name: "⚡ اختبارات الضغط والأداء وبايت كاش", desc: "Performance & Stress Testing" },
            { id: "documentation", name: "📚 الوثائق الشاملة وكتيبات التشغيل", desc: "Bilingual Playbook Hub" },
            { id: "roadmap", name: "🗺️ خارطة الطريق والـ SLA", desc: "SGU Smart Roadmap & KPI" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as HubTab)}
              className={`w-full text-right p-3 rounded-2xl border transition flex flex-col justify-between ${
                activeTab === tab.id
                  ? "bg-slate-900 border-indigo-500/40 text-slate-100 shadow-indigo-500/5"
                  : "bg-slate-950/60 border-slate-855 hover:bg-slate-900/65 text-slate-400"
              }`}
            >
              <span className="text-xs font-bold">{tab.name}</span>
              <span className="text-[9px] text-slate-500 block leading-none mt-1 font-mono font-bold uppercase">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* DETAILS CANVAS */}
        <div className="lg:col-span-9 bg-slate-950 p-6 rounded-3xl border border-slate-850 min-h-[500px]">

          {/* TAB 1: ARCHITECTURE & SOLID (PHASE 26) */}
          {activeTab === "architecture" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-3">
                <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 26: CLEAN CODE & SOLID ARCHITECTURE</span>
                <h4 className="text-sm font-black text-slate-200 mt-1">تطبيق معايير البرمجة النظيفة وهندسة الـ SOLID بالنظام الفيدرالي</h4>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                تم صياغة المنظومة البرمجية لجامعة SGU لتتوافق مع فلسفة <strong className="text-slate-350">Clean Code</strong> وأقوى معايير النظم السحابية. تم فصل منطق الأعمال (Business Logic) تماماً عن طبقة العرض (UI Render)، وتوفير معايير مطابقة تامة لكل عنصر بنظام حقن الاعتمادات اليدوي وتعددية المستويات.
              </p>

              {/* SOLID STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { title: "S - المسؤولية المفردة", letter: "S", desc: "كل موديول (LMS, Admission, HR, Finance) يعمل بشكل مستقل تماماً وله ملف منطق خاص به.", border: "border-emerald-500/20 text-emerald-450" },
                  { title: "O - المفتوح المغلق", letter: "O", desc: "النظام مهيأ لإضافة كليات جديدة وموديولات متطورة بـ SguAdvancedSuite دون المساس بالنظام الأساسي.", border: "border-sky-500/20 text-sky-450" },
                  { title: "L - استبدال ليسكوف", letter: "L", desc: "التعريف الموحد لجميع أدوار الهيئة والطلاب والمتقدمين يتطابق تماماً في قواعد البيانات وصلاحيات RBAC.", border: "border-indigo-500/20 text-indigo-450" },
                  { title: "I - فصل الواجهات", letter: "I", desc: "المستخدم (طالب، دكتور، مالي) يحصل فقط على الصلاحيات والواجهات المخصصة له لمنع التشتت البرمجي.", border: "border-purple-500/20 text-purple-450" },
                  { title: "D - عكس الاعتمادات", letter: "D", desc: "تعتمد الكليات وأجنحة الامتحان على الموديول الموحد عبر Props وحقن الاعتماد الأوتوماتيكي State Injection.", border: "border-amber-500/20 text-amber-450" },
                ].map((s, idx) => (
                  <div key={idx} className={`bg-slate-900/60 p-3 rounded-xl border ${s.border} text-right space-y-1.5`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black">{s.title}</span>
                      <span className="text-base font-mono font-black">{s.letter}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-semibold">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* MODULAR CODE EXPLAINER */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3">
                <span className="text-xs font-bold text-slate-350 block">مستكشف معمارية الملفات والوحدات البرمجية للمطورين:</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-semibold">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <strong className="text-emerald-400 block mb-1">🗄️ موديول البيانات المشترك</strong>
                    <span className="text-slate-500">`/src/databaseMock.ts`</span>
                    <p className="text-slate-550 mt-1 leading-normal">يحفظ البيانات الأساسية مع ترحيل تلقائي لتغيرات الـ GPA، وتعديلات المالية، وسجل المعاملات المشفر بـ SHA-256.</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <strong className="text-sky-400 block mb-1">🔗 الوحدات المستقلة (Subsystems)</strong>
                    <span className="text-slate-500">`/src/components/SguHrSystem.tsx`</span>
                    <p className="text-slate-550 mt-1 leading-normal">كل نظام (Admission, HR, Communication) يحتوي على ملف برمجيات مستقل تماماً لتعظيم التوازي البرمجي للفرق الكبيرة.</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <strong className="text-purple-400 block mb-1">🛡️ التشفير ومطابقة الحماية</strong>
                    <span className="text-slate-500">`/src/utils/crypto.ts`</span>
                    <p className="text-slate-550 mt-1 leading-normal">تتحكم الدالات الرياضية بحساب التوقيع الرقمي للدرجات والشهادات، وتوثق المعاملات لمنع أي هجوم SQLi أو تلاعب.</p>
                  </div>
                </div>
              </div>

              {/* ANTI-DUPLICATION COMPLIANCE SCANNER */}
              <div className="p-4 bg-indigo-950/15 border border-indigo-900/30 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-400 block">فاحص مطابقة معايير DRY (Don't Repeat Yourself) لـ SGU</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    محاكي فحص الأكواد للتأكد من عدم تكرار الدوال واستغلال الـ Custom Hooks والـ Shared Components.
                  </span>
                </div>
                <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-indigo-900/40 text-center shrink-0">
                  <span className="text-[10px] text-slate-500 block">نسبة المطابقة ونقاء الكود</span>
                  <strong className="text-emerald-450 text-sm font-black font-mono">99.4% DRY Score</strong>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TESTING SYSTEM (PHASE 27) */}
          {activeTab === "testing" && (
            <div className="space-y-6 animate-fadeIn text-right">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 27: COMPREHENSIVE AUTOMATED TESTING SUITE</span>
                  <h4 className="text-sm font-black text-slate-200 mt-1">منظومة تدقيق واختبارات الجودة (Unit, Integration & E2E)</h4>
                </div>
                <button
                  onClick={runFullTestSuite}
                  disabled={testSuiteLoading}
                  className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{testSuiteLoading ? "جاري تشغيل الاختبارات..." : "إطلاق كامل الاختبارات"}</span>
                </button>
              </div>

              {/* TEST SUITE PROGRESS */}
              {testSuiteLoading && (
                <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-indigo-900/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-indigo-400 font-mono font-bold">Progress: {testProgress}%</span>
                    <span className="text-slate-300 font-bold">جاري تشغيل محاكاة الاختبارات لجميع وحدات المنظومة...</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${testProgress}%` }} />
                  </div>
                </div>
              )}

              {/* TEST STAGES CARD SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* UNIT TESTS */}
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">1. UNIT TESTS</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      testResults.unit === "passed" ? "bg-emerald-500" : testResults.unit === "running" ? "bg-amber-500 animate-ping" : "bg-slate-700"
                    }`} />
                  </div>
                  <strong className="text-xs text-slate-200 block">اختبار الوحدات والدوال الفردية</strong>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    يفحص موازنات حسابات الخزنة، تطهير المدخلات الأمنية، عمليات فك التشفير، ودوال مخرجات الـ GPA بدقة حتمية صارمة.
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>حالة المفسر:</span>
                    <strong className={testResults.unit === "passed" ? "text-emerald-400" : "text-slate-500"}>
                      {testResults.unit === "passed" ? "✓ PASSED (15/15)" : "IDLE"}
                    </strong>
                  </div>
                </div>

                {/* INTEGRATION TESTS */}
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">2. INTEGRATION TESTS</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      testResults.integration === "passed" ? "bg-emerald-500" : testResults.integration === "running" ? "bg-amber-500 animate-ping" : "bg-slate-700"
                    }`} />
                  </div>
                  <strong className="text-xs text-slate-200 block">اختبار ترابط الأنظمة المدمجة</strong>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    التحقق من تزامن البيانات بين بوابة القبول والقبول الأوتوماتيكي بالـ SIS، وتحديث كشوف الطلاب في الكنترول مع استلام دفع المالية.
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>حالة المفسر:</span>
                    <strong className={testResults.integration === "passed" ? "text-emerald-400" : "text-slate-500"}>
                      {testResults.integration === "passed" ? "✓ PASSED (17/17)" : "IDLE"}
                    </strong>
                  </div>
                </div>

                {/* END-TO-END TESTS */}
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">3. END-TO-END TESTS</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      testResults.e2e === "passed" ? "bg-emerald-500" : testResults.e2e === "running" ? "bg-amber-500 animate-ping" : "bg-slate-700"
                    }`} />
                  </div>
                  <strong className="text-xs text-slate-200 block">اختبار سيناريوهات الطالب والمستخدم</strong>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    محاكاة تصفح كاملة بالخلفية للمستخدمين: تسجيل قيد طالب، ثم دفع الرسوم، ثم رصد درجات، ثم مراجعة الاعتماد NAQAAE.
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>حالة المفسر:</span>
                    <strong className={testResults.e2e === "passed" ? "text-emerald-400" : "text-slate-500"}>
                      {testResults.e2e === "passed" ? "✓ PASSED (16/16)" : "IDLE"}
                    </strong>
                  </div>
                </div>

              </div>

              {/* LIVE CONSOLE LOGS */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-350 block">مخرجات مفسر الاختبارات الأوتوماتيكي (Automated Test Execution Log):</span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 h-36 overflow-y-auto font-mono text-[10px] text-emerald-400/80 space-y-1.5 text-left scrollbar-thin">
                  {testLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                  ))}
                  {testLogs.length === 0 && (
                    <div className="text-slate-600 text-center py-10 font-sans font-bold">أنقر على "إطلاق كامل الاختبارات" لتشغيل مفسر الاختبارات الفيدرالي.</div>
                  )}
                </div>
              </div>

              {/* USER SCENARIO SIMULATOR PLAYGROUND */}
              <div className="bg-slate-900/30 p-4 rounded-2xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-200 block">مكتبة سيناريوهات تجارب المستخدم النهائي (E2E Client Simulation):</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { key: "student_lifecycle", title: "👤 دورة حياة الطالب الكاملة", desc: "محاكاة قيد طالب جديد في SGU وتسديد الرسوم والأقساط حتى رصد الـ GPA." },
                    { key: "faculty_grading", title: "👨‍🏫 تصحيح ورصد درجات الكنترول", desc: "محاكاة رفع الدكتور نموذج الإجابة، التصحيح التلقائي، والتوقيع الرقمي للدرجات." },
                    { key: "finance_mfa", title: "🔒 تدقيق مالي مع أمان الـ MFA", desc: "محاكاة اعتماد كشف المرتبات، التحقق من TOTP Pin للـ HR والترحيل المالي." }
                  ].map(scenario => (
                    <button
                      key={scenario.key}
                      onClick={() => triggerE2EScenario(scenario.key)}
                      className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
                        e2eScenario === scenario.key ? "bg-slate-900 border-indigo-500/40 text-indigo-400" : "bg-slate-950 border-slate-855 hover:bg-slate-900"
                      }`}
                    >
                      <strong className="text-xs block text-slate-200">{scenario.title}</strong>
                      <span className="text-[10px] text-slate-500 block leading-normal mt-1.5 font-semibold">{scenario.desc}</span>
                      <span className="text-[9.5px] text-indigo-400 font-bold block mt-3 font-mono">RUN SIMULATION →</span>
                    </button>
                  ))}
                </div>

                {e2eScenario && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-indigo-950/30 space-y-1 animate-fadeIn">
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-450 border border-indigo-950 px-2 py-0.2 rounded font-mono font-bold">
                      ACTIVE E2E CYPRESS EXECUTION STATE
                    </span>
                    <div className="space-y-1.5 mt-2 max-h-32 overflow-y-auto text-[10px] font-mono text-slate-350 text-right leading-relaxed pr-1">
                      {e2eLogs.map((log, idx) => (
                        <div key={idx} className={idx === e2eLogs.length - 1 ? "text-emerald-400 font-extrabold" : "text-slate-400"}>{log}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: VERSIONING & ROLLBACK (PHASE 28) */}
          {activeTab === "versioning" && (
            <div className="space-y-6 animate-fadeIn text-right">
              <div className="border-b border-slate-900 pb-3">
                <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 28: VERSION CONTROL & STATE ROLLBACK Blueprints</span>
                <h4 className="text-sm font-black text-slate-200 mt-1">إدارة خط التحديثات والمطابقة الفورية واستعادة النسخ السابقة</h4>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                يدعم نظام SGU أرشفة هيكلية البيانات بصورة فورية. يمكنك إنشاء <strong className="text-indigo-400">"نقطة استرجاع برمجية"</strong> لحفظ الحالة الكاملة لقواعد البيانات (المستخدمين، كشوف المقررات، سجلات القبول، موازنات الخزنة)، وإجراء التعديلات والتعامل بالمنظومة، ثم الرجوع بالزمن لتلك النقطة فوراً وبدون خسارة أي مخرجات!
              </p>

              {/* GIT BRANCH GRAPH VISUAL */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3">
                <span className="text-xs font-bold text-slate-350 block">مخطط تفرع إصدارات البيئات (SGU Git Deployment Branching Model):</span>
                
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 flex flex-col md:flex-row justify-between gap-4">
                  {[
                    { branch: "🌿 PRODUCTION", status: "v2.3.1 (Active)", desc: "البيئة المعتمدة رسمياً بالجامعة لخدمة الطلاب ومراقبة الامتحانات.", color: "text-emerald-400 border-emerald-500/20" },
                    { branch: "🧪 STAGING / TESTING", status: "v2.4.0-rc2", desc: "بيئة الجودة والاعتماد لمراجعة دمج ميزات HR الجدد والاختبارات.", color: "text-indigo-400 border-indigo-500/20" },
                    { branch: "⚙️ DEVELOPMENT", status: "v2.5.0-alpha", desc: "بيئة المطورين لابتكار حلول الذكاء الاصطناعي وبلوتوث الحضور.", color: "text-purple-400 border-purple-500/20" },
                  ].map((b, idx) => (
                    <div key={idx} className={`flex-1 p-3 bg-slate-900/60 rounded-xl border ${b.color} text-right`}>
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-xs font-black">{b.branch}</strong>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 font-bold">{b.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal font-semibold">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROLLBACK CREATOR & SNAPSHOT HISTORY */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Save Rollback Point */}
                <div className="md:col-span-5 bg-slate-900/60 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <span className="text-xs font-bold text-slate-200 block border-b border-slate-950 pb-2">حفظ حالة الجامعة الحالية (Create State Backup):</span>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">وصف مبرر الحفظ والنسخة الأرشيفية:</label>
                      <input
                        type="text"
                        placeholder="مثال: قبل مراجعة طلبات التعيين الجدد للكلية..."
                        value={snapshotDesc}
                        onChange={e => setSnapshotDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-xs text-right text-slate-200 outline-none"
                      />
                    </div>

                    <button
                      onClick={() => handleCreateSnapshot()}
                      className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-black py-2 rounded text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>التقاط نسخة مطابقة للبيانات (Capture State)</span>
                    </button>
                  </div>

                  <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl text-[10px] text-indigo-400 leading-relaxed font-semibold">
                    💡 <strong>كيف تعمل؟</strong> تسحب هذه الميزة لقطة (Deep Copy Snapshot) لكافة التغييرات التي تجريها في قواعد بيانات الطلاب والمالية والقبول، لتسمح لك باختبار التعديلات بحرية ثم الرجوع بالزمن بضغطة زر.
                  </div>
                </div>

                {/* Restore / Rollback List */}
                <div className="md:col-span-7 bg-slate-900/60 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <span className="text-xs font-bold text-slate-350 block border-b border-slate-950 pb-2">أرشيف وحالات تراجع النظام المعتمدة (State Backups Archive):</span>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs">
                    {snapshots.map(snap => (
                      <div key={snap.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center gap-2">
                        <div className="text-left shrink-0">
                          <button
                            onClick={() => handleRollbackToSnapshot(snap.id)}
                            className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded transition"
                          >
                            استرجاع فوري 🔄
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.2 rounded font-mono font-bold">{snap.id}</span>
                            <span className="text-[10.5px] text-slate-500 font-semibold">{snap.timestamp}</span>
                          </div>
                          <strong className="text-[11.5px] text-slate-100 block mt-1 leading-normal">{snap.description}</strong>
                          <div className="flex items-center justify-end gap-2 text-[9px] text-slate-500 mt-1 font-mono font-semibold">
                            <span>Students & Staff: {snap.usersCount}</span>
                            <span>•</span>
                            <span>Applications: {snap.appsCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: DEPLOYMENT & PRODUCTION INFRA (PHASE 29) */}
          {activeTab === "deployment" && (
            <div className="space-y-6 animate-fadeIn text-right">
              <div className="border-b border-slate-900 pb-3">
                <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 29: GCP CLOUD RUN CONTAINER DEPLOYMENT SYSTEM</span>
                <h4 className="text-sm font-black text-slate-200 mt-1">بنية تشغيل الـ Production والـ SSL ومصفوفة البيئات الآمنة</h4>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                تعمل خوادم SGU في بيئة حاويات سحابية مشفرة بـ <strong className="text-indigo-400">Docker</strong> ومثبتة بـ <strong className="text-slate-300">GCP Cloud Run</strong>. يتم إدارة التوجيه الجغرافي وحشو الكاش بالكامل لتأمين الوصول لآلاف الطلاب بحد أقصى للجهد والتحميل بأوقات الامتحانات.
              </p>

              {/* LIVE SERVER METRICS METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Server Status", value: "ONLINE (99.99% SLA)", desc: "خوادم الاستضافة في بلجيكا europe-west1 تعمل بنشاط مميز.", color: "text-emerald-450" },
                  { label: "SSL let's encrypt", value: "ACTIVE (SSL/TLS 1.3)", desc: "شهادة Let's Encrypt آمنة ومجددة تلقائياً كل 90 يوم.", color: "text-indigo-455" },
                  { label: "Database Ingress", value: "Firestore Serverless", desc: "قاعدة بيانات بدون خادم تتوسع لتأمين وتخزين المدفوعات.", color: "text-sky-450" },
                  { label: "Reverse Proxy", value: "Nginx Ingress (Port 3000)", desc: "تمر كافة الطلبات ببروكسي آمن مغلق لمنع تسريب الهويات.", color: "text-purple-450" }
                ].map((m, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">{m.label}</span>
                    <strong className={`text-xs block font-bold ${m.color}`}>{m.value}</strong>
                    <p className="text-[10px] text-slate-500 leading-normal font-semibold mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>

              {/* ENV VARIABLES VAULT SECRETS (PHASE 29) */}
              <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-950 pb-2">
                  <div className="flex items-center gap-2 text-indigo-450 text-[10px] font-mono">
                    <Lock className="w-3.5 h-3.5 text-indigo-455" />
                    <span>MASKED ENVIRONMENT VARIABLES</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200">الخزنة المشفرة لبيئة الإعدادات السريّة (.env Vault):</h5>
                </div>

                <div className="space-y-2.5 text-[10.5px] font-mono">
                  {[
                    { key: "PORT", val: "3000", desc: "منفذ خادم الويب الإلزامي (Hardcoded Container Port)", secure: false },
                    { key: "GEMINI_API_KEY", val: "AI_STUDIO_SERVER_SECRET_*****_YSF", desc: "مفتاح خادم جيميناي السري الآمن بالخلفية لـ AI Chatbot", secure: true },
                    { key: "FIREBASE_PROJECT_ID", val: "remix-university-system", desc: "معرف مشروع قواعد البيانات المصدّق لتوثيق التسجيل", secure: false },
                    { key: "DATABASE_ENCRYPTION_KEY", val: "SHA256_HASH_KEY_YOUSSEF_F72G8391K_SGU", desc: "مفتاح البصمات وتوقيع شهادات الكنترول والبلوك تشين للطلاب", secure: true }
                  ].map((env, idx) => (
                    <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-900 flex justify-between items-center gap-2">
                      <span className="text-slate-500 text-[10px] hidden md:inline">{env.desc}</span>
                      <div className="flex items-center gap-2">
                        <code className="text-slate-300 font-bold bg-slate-900 px-1.5 py-0.5 rounded">{env.val}</code>
                        <span className="text-indigo-450 font-bold text-[10px]">{env.secure ? "🔒 SECURE SECRET" : "⚙️ PUBLIC CONFIG"}</span>
                        <code className="text-slate-500 font-extrabold">{env.key}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DOMAIN CONFIG AND CHECKLIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 text-right space-y-3">
                  <strong className="text-slate-200 block border-b border-slate-900 pb-1.5">توجيه النطاق والسجلات الرقمية (DNS Mapping):</strong>
                  <div className="space-y-2 font-mono text-[10.5px]">
                    <div className="flex justify-between p-1 bg-slate-950 rounded">
                      <span className="text-emerald-450">A Record → 105.42.110.12</span>
                      <span className="text-slate-500">sgu.edu.eg</span>
                    </div>
                    <div className="flex justify-between p-1 bg-slate-950 rounded">
                      <span className="text-emerald-450">CNAME → gcp.cloud.run</span>
                      <span className="text-slate-500">portal.sgu.edu.eg</span>
                    </div>
                    <div className="flex justify-between p-1 bg-slate-950 rounded">
                      <span className="text-emerald-450">TXT Record → v=spf1 include:mail.sgu</span>
                      <span className="text-slate-500">mail.sgu.edu.eg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 text-right space-y-2.5">
                  <strong className="text-slate-200 block border-b border-slate-900 pb-1.5">خطوات وكتيب النشر للمشرفين (Production Checklist):</strong>
                  {[
                    "1. تجميع الأكواد وإجراء الـ Minification لسرعة تحميل الواجهة.",
                    "2. فحص وتطهير حزم NPM لمنع ثغرات سلاسل التوريد (Audit npm).",
                    "3. إغلاق الوصول المباشر للخارج وحجب منافذ قواعد البيانات بـ GCP Firewall.",
                    "4. اختبار سعة النطاق الجغرافي وتوجيه Let's Encrypt لمنع إشعارات التحذير."
                  ].map((step, i) => (
                    <div key={i} className="text-slate-450 text-[10.5px] leading-relaxed flex items-center gap-2 justify-end">
                      <span>{step}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: BACKUP & RECOVERY (PHASE 30) */}
          {activeTab === "backup" && (
            <div className="space-y-6 animate-fadeIn text-right">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 30: STRUCTURAL BACKUP & DISASTER RECOVERY HUB</span>
                  <h4 className="text-sm font-black text-slate-200 mt-1">منظومة الحماية من الكوارث والأرشفة التلقائية اليومية</h4>
                </div>
                <button
                  onClick={simulateServerCrash}
                  className="cursor-pointer bg-rose-950 hover:bg-rose-900 border border-rose-500 text-rose-455 font-black px-4 py-2 rounded-xl text-xs transition"
                >
                  محاكاة انهيار خادم SGU
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                يحفظ نظام SGU نسخاً احتياطية مشفرة بصفة تلقائية يومياً في قبو خارجي آمن <strong className="text-indigo-400">(Cold Storage GCS)</strong>. يدعم محاكي الطوارئ إمكانية استرجاع البيانات الفوري عند حدوث أخطاء تقنية، لضمان استقرار العملية التعليمية بالكامل ومستحقات الطلاب.
              </p>

              {/* AUTOMATED LOG SCHEDULE */}
              <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-350 block border-b border-slate-950 pb-1.5">جدول الأرشفة والنسخ المشفر المولد (Automated Backup Log Schedule):</span>
                
                <div className="border border-slate-800 rounded-xl overflow-hidden text-[10.5px]">
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">رقم النسخة والترميز</th>
                        <th className="p-2.5">تاريخ التوليد</th>
                        <th className="p-2.5">التصنيف</th>
                        <th className="p-2.5">حجم الأرشيف</th>
                        <th className="p-2.5">بصمة التحقق الجغرافي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300 font-semibold font-sans">
                      {[
                        { id: "SGU-BACKUP-DAILY-44", date: "اليوم 03:00:00", type: "تلقائي يومي", size: "48.2 MB", hash: "sha256-4b9d038...1a", status: "🟢 سليم وآمن" },
                        { id: "SGU-BACKUP-WEEKLY-21", date: "الأحد الماضي", type: "أسبوعي رئيسي", size: "142.5 MB", hash: "sha256-d8f921a...4d", status: "🟢 سليم وآمن" },
                        { id: "SGU-BACKUP-MONTHLY-06", date: "1 يوليو 2026", type: "شهري شامل", size: "512.1 MB", hash: "sha256-ff40a23...01", status: "🟢 سليم وآمن" }
                      ].map((b, idx) => (
                        <tr key={idx} className="hover:bg-slate-920">
                          <td className="p-2.5 font-mono text-purple-400">{b.id}</td>
                          <td className="p-2.5 text-slate-400">{b.date}</td>
                          <td className="p-2.5 text-indigo-400 font-bold">{b.type}</td>
                          <td className="p-2.5 font-mono text-slate-400">{b.size}</td>
                          <td className="p-2.5 font-mono text-slate-500 truncate max-w-32">{b.hash}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MANUAL TRIGGER AND RESTORE ADVISORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3 text-right">
                  <strong className="text-slate-200 block border-b border-slate-900 pb-1.5">كتيب خطة التعافي السريع (RTO / RPO Guidelines):</strong>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    - <strong>زمن التعافي المستهدف (RTO):</strong> أقل من 15 ثانية للتحول للخادم الاحتياطي بنظام GCP Traffic Steering.<br />
                    - <strong>نقطة التعافي المستهدفة (RPO):</strong> استعادة آخر 15 دقيقة من المعاملات الماليّة باستخدام سجلات التدقيق المشفرة.<br />
                    - <strong>التكرار التخزيني:</strong> تحفظ ثلاث نسخ مطابقة في مناطق جغرافية مختلفة (بلجيكا، هولندا، فرانكفورت) لضمان حماية مطلقة.
                  </p>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3 flex flex-col justify-between">
                  <div className="text-right">
                    <strong className="text-slate-200 block border-b border-slate-900 pb-1.5">إرسال وتزامن نسخة أرشيفية يدوية الآن:</strong>
                    <p className="text-[10px] text-slate-500 mt-1">تفريغ فوري وتصدير البيانات الحالية كـ Snapshot صلب لقاعدة البيانات.</p>
                  </div>
                  <button
                    onClick={() => handleCreateSnapshot("نسخة احتياطية يدوية للتعافي الطارئ")}
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-black py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>توليد وأرشفة نسخة مشفرة الآن</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: CYBERSECURITY SHIELD (PHASE 31) */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fadeIn text-right">
              <div className="border-b border-slate-900 pb-3">
                <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 31: ADVANCED CYBER SECURITY & WAF SIMULATOR</span>
                <h4 className="text-sm font-black text-slate-200 mt-1">أنظمة الحماية الذكية وتدقيق حزم الاختراق (SQLi, XSS, MFA)</h4>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                تحرص جامعة SGU على حماية هوية الطلاب والسرية التامة للبيانات الأكاديمية والمالية. يتم تطهير وتأمين كافة منافذ الـ API والـ Webhooks بأساليب التشفير الفيدرالي لردع أي محاولات اختراق أو عبث.
              </p>

              {/* SECURITY SCANNER PLAYGROUND */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SQL INJECTION TESTBED */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-950 pb-2">
                    <span className="text-[9.5px] text-rose-500 font-mono font-bold animate-pulse">SQLi ATTACK SIMULATOR</span>
                    <strong className="text-xs text-slate-200">1. محاكي صد حقن الاستعلامات SQL Injection:</strong>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                    أدخل هجوم حقن استعلام شهير (مثل <code className="text-rose-400 font-mono">' OR 1=1 --</code>) لترى كيف يصد النظام الاستفسار فورياً.
                  </p>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={handleTestSqlInjection}
                        className="cursor-pointer bg-rose-650 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shrink-0"
                      >
                        اختبار الحقن ⚔️
                      </button>
                      <input
                        type="text"
                        placeholder="أدخل كود الاستعلام الخبيث..."
                        value={sqlPayload}
                        onChange={e => setSqlPayload(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-xl text-xs text-right text-slate-200 outline-none font-mono"
                      />
                    </div>

                    {sqlBlocked !== null && (
                      <div className={`p-3 rounded-xl text-[10.5px] font-bold border ${
                        sqlBlocked 
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-455"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}>
                        {sqlExplanation}
                      </div>
                    )}
                  </div>
                </div>

                {/* XSS PROTECTION TESTBED */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-950 pb-2">
                    <span className="text-[9.5px] text-rose-500 font-mono font-bold animate-pulse">XSS FILTER AUDIT</span>
                    <strong className="text-xs text-slate-200">2. محاكي صد حقن النصوص الخبيثة XSS:</strong>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                    أدخل نصاً تفاعلياً خبيثاً (مثل <code className="text-rose-400 font-mono">&lt;script&gt;alert('XSS')&lt;/script&gt;</code>) لرؤية التطهير الفوري.
                  </p>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={handleTestXss}
                        className="cursor-pointer bg-rose-650 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shrink-0"
                      >
                        اختبار الحقن ⚔️
                      </button>
                      <input
                        type="text"
                        placeholder="أدخل كود الحقن التفاعلي..."
                        value={xssPayload}
                        onChange={e => setXssPayload(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-xl text-xs text-right text-slate-200 outline-none font-mono"
                      />
                    </div>

                    {xssBlocked !== null && (
                      <div className={`p-3 rounded-xl text-[10.5px] font-bold border ${
                        xssBlocked 
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-455"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}>
                        {xssExplanation}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* SECURITY ALERTS REGISTER */}
              <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-350 block border-b border-slate-950 pb-1.5">سجل التدقيق الأمني ومراقبة الدخول (Security Audit Trail Ledger):</span>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-xs">
                  {securityAlerts.map(alert => (
                    <div key={alert.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center gap-2">
                      <div className="text-left font-mono">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          alert.severity === "critical" ? "bg-rose-500/10 text-rose-455" : alert.severity === "medium" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded font-mono font-bold">{alert.ip}</span>
                          <span className="text-[10.5px] text-slate-500 font-semibold">{alert.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-bold mt-1 leading-normal">{alert.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RATE LIMITING INFORMATION */}
              <div className="p-4 bg-violet-950/15 border border-violet-900/30 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 text-right">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-violet-400 block">نظام تحديد معدلات الاستعلام النشط (Rate Limiting Shield)</span>
                  <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                    محدد حرج يحظر عناوين الـ IP عند زيادة الاستعلامات عن 100 طلب بالدقيقة لحماية خوادم SGU من هجمات الحرمان من الخدمة الموزعة DDoS.
                  </p>
                </div>
                <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-violet-900/40 text-center shrink-0">
                  <span className="text-[10px] text-slate-500 block">حالة درع الـ API</span>
                  <strong className="text-emerald-450 text-xs font-black font-mono">ACTIVE (0 Blocked IPs)</strong>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: PERFORMANCE & LATENCY (PHASE 32) */}
          {activeTab === "performance" && (
            <div className="space-y-6 animate-fadeIn text-right">
              <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row justify-between md:items-center gap-2">
                <div>
                  <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 32: LIVE PERFORMANCE OPTIMIZATION CONTROL</span>
                  <h4 className="text-sm font-black text-slate-200 mt-1">تحليل سرعة تحميل الصفحات واستهلاك السيرفر وحشو الـ Cache</h4>
                </div>

                {/* Performance switches */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setRedisCached(prev => !prev);
                      triggerToast(redisCached ? "تم إيقاف ذاكرة Redis المؤقتة!" : "تم تفعيل حشو Redis المؤقت وسرعة استجابة فائقة!");
                    }}
                    className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      redisCached ? "bg-emerald-600 text-slate-950" : "bg-slate-900 border border-slate-800 text-slate-400"
                    }`}
                  >
                    🚀 Redis Cache: {redisCached ? "تلقائي نشط" : "معطل"}
                  </button>

                  <select
                    value={stressLoad}
                    onChange={e => {
                      setStressLoad(e.target.value as any);
                      triggerToast(`تم تحويل محاكاة التحميل إلى: ${e.target.value.toUpperCase()}`);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
                  >
                    <option value="low">حمل خفيف (450 طالب)</option>
                    <option value="medium">حمل معتدل (2200 طالب)</option>
                    <option value="high">ضغط الامتحانات (8500 طالب متزامن)</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                يقدم هذا الجناح مراقبة حية لأداء النظام بالتعاطي مع آلاف الاستفسارات المتزامنة. يسمح لك بتبديل <strong className="text-indigo-400">"ذاكرة التخزين المؤقت Redis"</strong> لمعاينة الانهيار الفوري في تأخير زمن الاستجابة للمقررات من 150 مللي ثانية إلى 4 مللي ثانية فقط!
              </p>

              {/* GRAPH PLOT PERFORMANCE RECHARTS */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-350 block border-b border-slate-950 pb-1.5">مخطط الاستجابة ومراقبة الجهد الفيدرالي (Simulated Server Response & Metric Timeline):</span>
                
                <div className="h-48 w-full font-mono text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="second" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b" }} />
                      <Legend />
                      <Area type="monotone" dataKey="latency" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLatency)" name="زمن استجابة السيرفر (ms)" />
                      <Area type="monotone" dataKey="cpu" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCpu)" name="جهد المعالج CPU %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DATABASE INDEXING AUDIT REPORT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-3 text-right">
                  <strong className="text-slate-200 block border-b border-slate-900 pb-1.5">فحص موازنة وفهارس قواعد البيانات (Database Indexing Optimization):</strong>
                  <div className="space-y-2 text-[10.5px]">
                    <div className="flex justify-between items-center bg-slate-950 p-2 rounded">
                      <span className="text-emerald-450 font-mono">🟢 ACTIVE (450x faster)</span>
                      <span className="text-slate-400 font-mono">idx_users_national_id</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-2 rounded">
                      <span className="text-emerald-450 font-mono">🟢 ACTIVE (380x faster)</span>
                      <span className="text-slate-400 font-mono">idx_applications_status</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-2 rounded">
                      <span className="text-emerald-450 font-mono">🟢 ACTIVE (300x faster)</span>
                      <span className="text-slate-400 font-mono">idx_invoices_paid_date</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-2 text-right">
                  <strong className="text-slate-200 block border-b border-slate-900 pb-1.5">آلية التطهير والضغط لملفات الواجهات (Frontend Payload Optimization):</strong>
                  {[
                    "• تحزيم وتطهير الأكواد ببرنامج Esbuild لخفض الحجم الكلي بـ 72%.",
                    "• ضغط صور كروت الطلاب وبطاقات الرقم القومي تلقائياً بنظام WebP.",
                    "• حشو ملفات المجدولات والوثائق بصيغة GZIP على السيرفر لسرعة البث.",
                    "• التوجيه المسبق (Prefetching) لبيانات الـ SIS لسرعة تنقل الطلاب."
                  ].map((doc, idx) => (
                    <p key={idx} className="text-slate-500 text-[10.5px] leading-relaxed">{doc}</p>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* TAB 8: SMART CAMPUS ROADMAP (PHASE 34) */}
          {activeTab === "roadmap" && (
            <div className="space-y-6 animate-fadeIn text-right">
              <div className="border-b border-slate-900 pb-3">
                <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 34: SGU SMART CAMPUS FUTURE ROADMAP</span>
                <h4 className="text-sm font-black text-slate-200 mt-1">خارطة التطوير المستقبلي والتحولات التكنولوجية لـ SGU</h4>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold text-right">
                تسعى جامعة SGU لريادة التعليم الجامعي الذكي بمصر والعالم العربي. نقدم تطلعاً هيكلياً لخارطة الطريق في السنوات القادمة لتوظيف مخرجات الثورة الصناعية الرابعة بخدمة المنسوبين.
              </p>

              {/* ROADMAP TIMELINE BENTO */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { phase: "المرحلة الأولى: الربع الثالث 2026", title: "🤖 دمج أجهزة الـ IoT", desc: "ربط بوابات الكليات الذكية ببلوتوث الهاتف وRFID لتوثيق الحضور والغياب بصمت دون تدخل بشري." },
                  { phase: "المرحلة الثانية: الربع الأول 2027", title: "🔮 التنبؤ الأكاديمي المبكر", desc: "تفعيل نماذج تعلم الآلة للتنبؤ التلقائي باحتمالات تعثر الطلاب الأكاديمي واقتراح مسارات مراجعة مخصصة." },
                  { phase: "المرحلة الثالثة: الربع الرابع 2027", title: "🌐 الهوية اللامركزية الشهادات", desc: "أرشفة وتوثيق كافة شهادات التخرج بـ Blockchain دائم غير قابل للعبث لمنع تزوير الأوراق رسمياً." },
                  { phase: "المرحلة الرابعة: عام 2028 وما بعده", title: "🏥 الميتافيرس والفصول التفاعلية", desc: "بناء غرف جراحة ومحاكاة هندسية تفاعلية بتقنيات VR لطلاب الطب والهندسة بـ SGU لتلقي المناهج المتقدمة." }
                ].map((r, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-2 text-right">
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.2 rounded font-bold">{r.phase}</span>
                    <strong className="text-xs block text-slate-200 mt-1">{r.title}</strong>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{r.desc}</p>
                  </div>
                ))}
              </div>

              {/* SLA AVAILABILITY AND MAINTENANCE KPI */}
              <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 space-y-4">
                <span className="text-xs font-bold text-slate-350 block border-b border-slate-950 pb-1.5">مؤشرات الأداء التشغيلي (SGU SLA Operational Dashboard):</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">توافرية الخدمات (Target SLA)</span>
                    <strong className="text-emerald-450 text-base font-black font-mono">99.99% Up-time</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">زمن مراجعة الاستفسارات بالذكاء</span>
                    <strong className="text-indigo-455 text-base font-black font-mono">&lt; 1.5 Seconds</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">سلامة المستندات والقبول</span>
                    <strong className="text-sky-450 text-base font-black font-mono">100% SHA-256 Validated</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: DOCUMENTATION & PLAYBOOKS (PHASE 33) */}
          {activeTab === "documentation" && (
            <div className="space-y-6 animate-fadeIn text-right">
              <div className="border-b border-slate-900 pb-3">
                <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 33: SGU INTERACTIVE SYSTEM DOCUMENTATION & PLAYBOOKS</span>
                <h4 className="text-sm font-black text-slate-200 mt-1">الكتيبات الموحدة للتشغيل (للمطورين، الإدارة، وأعضاء هيئة التدريس والطلاب)</h4>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold text-right">
                كتيب توثيق وإرشاد شامل ثنائي اللغة يوضح بنية النظام وأساليب تشغيل موديولات منصة SGU الموحدة بالتفصيل لسهولة الاستيعاب البرمجي.
              </p>

              {/* THREE COLUMN DOCUMENT MATRIX */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* DEVELOPER PLAYBOOK */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-3">
                  <strong className="text-xs text-emerald-400 block border-b border-slate-950 pb-1.5">💻 دليل المطورين والمهندسين:</strong>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed">
                    - <strong>قاعدة البيانات:</strong> يعمل النظام بالكامل على محاكي قواعد البيانات السريعة والترحيل الفوري `databaseMock`.<br />
                    - <strong>الأمان:</strong> يتم استخدام تشفير التواقيع بـ `crypto.ts` ومطابقة مفتاح الحساب للتراجع بالزمن بنقاء SOLID.<br />
                    - <strong>التطوير:</strong> لتهيئة النظام محلياً، اكتب `npm run dev` للتشغيل الفوري على منفذ container الإلزامي (Port 3000).
                  </p>
                </div>

                {/* ADMIN PLAYBOOK */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-3">
                  <strong className="text-xs text-indigo-400 block border-b border-slate-950 pb-1.5">👑 دليل الإدارة والمشرفين:</strong>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed">
                    - <strong>النسخ الاحتياطي:</strong> يمكن المشرف توليد نسخة تخزين طارئة بكامل بيانات القبول والمالية أوتوماتيكياً.<br />
                    - <strong>مراجعة الأمان:</strong> يعرض سجل `Security Audit Log` كافة محاولات التلاعب بالمدخلات أو الاختراقات بنقاط زمنية.<br />
                    - <strong>استرجاع الكوارث:</strong> يتم الاستعانة بـ Disaster Recovery في حالة انهيار السيرفر لاستدعاء خوادم GCP الحيوية.
                  </p>
                </div>

                {/* USER PLAYBOOK */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-3">
                  <strong className="text-xs text-amber-400 block border-b border-slate-950 pb-1.5">🎓 دليل الطالب وعضو التدريس:</strong>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed">
                    - <strong>الطلاب:</strong> تسجيل المواد ودفع المصروفات وتنزيل كشوف الـ GPA من البوابة الخاصة بـ SIS.<br />
                    - <strong>هيئة التدريس:</strong> رصد الدرجات وإطلاق الامتحانات MCQ وأرشفة الأبحاث Scopus للترقية المصلحية.<br />
                    - <strong>المتقدمين:</strong> تقديم الملفات ورفع شهادات الثانوية ببوابة القبول ومراجعة ردود الموظفين الفورية.
                  </p>
                </div>

              </div>

              {/* BILINGUAL API REFERENCE GUIDE */}
              <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 space-y-3">
                <span className="text-xs font-bold text-slate-350 block border-b border-slate-950 pb-1.5">المرجع السريع لواجهات برمجة التطبيقات (SGU API Route Specifications):</span>
                
                <div className="space-y-2 font-mono text-[10.5px]">
                  <div className="p-2 bg-slate-950 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
                    <span className="text-slate-500">سجل المدقق المعاملاتي وطلبات الـ REST</span>
                    <div className="flex gap-2 items-center">
                      <span className="text-emerald-450 font-bold">GET</span>
                      <code className="text-indigo-400 font-bold">/api/enterprise/reports/download?type=audit_logs</code>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-950 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
                    <span className="text-slate-500">جلب كشوف المعاملات المالية وفواتير السكن</span>
                    <div className="flex gap-2 items-center">
                      <span className="text-emerald-450 font-bold">GET</span>
                      <code className="text-indigo-400 font-bold">/api/enterprise/reports/download?type=financial_invoices</code>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-950 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
                    <span className="text-slate-500">تفريغ وسحب كشوف المقيدين الأكاديمية</span>
                    <div className="flex gap-2 items-center">
                      <span className="text-emerald-450 font-bold">GET</span>
                      <code className="text-indigo-400 font-bold">/api/enterprise/reports/download?type=student_roster</code>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
