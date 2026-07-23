import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  RefreshCw,
  Database,
  Layers,
  Search,
  Key,
  Smartphone,
  Mail,
  Bell,
  HardDriveUpload,
  Download,
  AlertTriangle,
  Play,
  Zap,
  Server,
  FileText,
  CheckCircle2,
  XCircle,
  Code2,
  Table,
  Plus,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
  ArrowRight,
  Sparkles,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Minimal mockup of a Schema type to demonstrate Zod
interface ValidationResult {
  success: boolean;
  errors: Record<string, string>;
}

interface SguSecurityDatabaseSystemProps {
  dbUsers: any[];
  setDbUsers: React.Dispatch<React.SetStateAction<any[]>>;
  lang: "ar" | "en";
  triggerToast: (msg: string) => void;
}

export default function SguSecurityDatabaseSystem({
  dbUsers,
  setDbUsers,
  lang,
  triggerToast
}: SguSecurityDatabaseSystemProps) {
  // Tabs for the 5 pillars + Supabase
  const [activeTab, setActiveTab] = useState<"auth" | "db_opt" | "perf" | "notif" | "backup" | "supabase">("auth");

  // ==========================================
  // PILLAR 6: SUPABASE REST API REALTIME SYNC
  // ==========================================
  const [sbUrl, setSbUrl] = useState<string>(() => {
    return localStorage.getItem("sgu_sb_url") || "https://loiicsmazydsbgglhksa.supabase.co/rest/v1";
  });
  const [sbAnonKey, setSbAnonKey] = useState<string>(() => {
    return localStorage.getItem("sgu_sb_anon_key") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaWljc21henlkc2JnZ2xoa3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTM3MjgsImV4cCI6MjA5NzcyOTcyOH0.Y8IEHt82aEpR7cT7pXpIfHxp-QY8Te91h5ifv_FNCio";
  });
  const [sbSelectedTable, setSbSelectedTable] = useState<string>("students");
  const [sbRows, setSbRows] = useState<any[]>([]);
  const [sbStatus, setSbStatus] = useState<"idle" | "connecting" | "connected" | "error" | "unauthorized">("idle");
  const [sbLogs, setSbLogs] = useState<string[]>([]);
  const [sbLoading, setSbLoading] = useState<boolean>(false);
  const [sbPage, setSbPage] = useState<number>(1);
  const [sbTotalCount, setSbTotalCount] = useState<number>(100000); // 100,000 students mock or loaded total count

  // Auto-connect and execute test/load when accessing the supabase tab
  React.useEffect(() => {
    if (activeTab === "supabase") {
      testSbConnection();
    }
  }, [activeTab]);

  // New Student insertion states
  const [sbNewId, setSbNewId] = useState("");
  const [sbNewNameAr, setSbNewNameAr] = useState("");
  const [sbNewNameEn, setSbNewNameEn] = useState("");
  const [sbNewEmail, setSbNewEmail] = useState("");
  const [sbNewCollege, setSbNewCollege] = useState("fcis");
  const [sbNewGpa, setSbNewGpa] = useState("3.40");

  // ==========================================
  // PILLAR 1: AUTHENTICATION & SECURITY STATES
  // ==========================================
  const [authEmail, setAuthEmail] = useState("youssef.student@sgu.edu.eg");
  const [authPassword, setAuthPassword] = useState("youssef_sgu_2026");
  const [authResetEmail, setAuthResetEmail] = useState("");
  const [authVerifyLogs, setAuthVerifyLogs] = useState<string[]>([]);
  const [authRoleSelection, setAuthRoleSelection] = useState<"student" | "professor" | "admin" | "supervisor">("student");
  
  // MFA simulation
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaSetupStep, setMfaSetupStep] = useState(0); // 0: off, 1: show QR, 2: verify token, 3: active
  const [mfaOtpInput, setMfaOtpInput] = useState("");
  const [totpSecret, setTotpSecret] = useState("SGU-SECURE-MFA-KEY-9941");
  const [totpCode, setTotpCode] = useState("492015");
  const [backupCodes, setBackupCodes] = useState(["8492-1204", "9412-9903", "4592-3101", "8841-5912"]);

  // ==========================================
  // PILLAR 6: SUPABASE REST API REALTIME SYNC FUNCTIONS
  // ==========================================
  const saveSbSettings = (url: string, key: string) => {
    localStorage.setItem("sgu_sb_url", url);
    localStorage.setItem("sgu_sb_anon_key", key);
    triggerToast(lang === "ar" ? "💾 تم حفظ إعدادات Supabase محلياً!" : "💾 Supabase settings saved locally!");
  };

  const addSbLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setSbLogs(prev => [`[${time}] ${msg}`, ...prev]);
  };

  const testSbConnection = async () => {
    setSbLoading(true);
    setSbStatus("connecting");
    addSbLog(`جاري اختبار الاتصال بالخادم المباشر: ${sbUrl}`);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (sbAnonKey) {
        headers["apikey"] = sbAnonKey;
        headers["Authorization"] = `Bearer ${sbAnonKey}`;
      }
      
      const res = await fetch(`${sbUrl.endsWith('/') ? sbUrl : sbUrl + '/'}${sbSelectedTable}?limit=1`, {
        method: "GET",
        headers
      });

      if (res.status === 401 || res.status === 403) {
        setSbStatus("unauthorized");
        addSbLog(`❌ فشل المصادقة (خطأ 401/403): يرجى مراجعة مفتاح API الخاص بـ Supabase.`);
        triggerToast(lang === "ar" ? "🔑 خطأ في صلاحيات مفتاح API الخاص بـ Supabase!" : "🔑 Supabase API Key Invalid/Unauthorized!");
      } else if (!res.ok) {
        setSbStatus("error");
        addSbLog(`❌ فشل الاتصال: كود الحالة ${res.status} - ${res.statusText}`);
        triggerToast(lang === "ar" ? "⚠️ فشل جلب البيانات من Supabase" : "⚠️ Supabase Connection Failed");
      } else {
        setSbStatus("connected");
        addSbLog(`✓ نجح الاتصال بنجاح بـ Supabase! تم الاستجابة بكود 200 OK.`);
        triggerToast(lang === "ar" ? "⚡ تم الاتصال بـ Supabase بنجاح!" : "⚡ Supabase Connected Successfully!");
        // Load data automatically
        loadSbRows();
      }
    } catch (e: any) {
      setSbStatus("error");
      addSbLog(`❌ خطأ في الشبكة: ${e.message}`);
      triggerToast(lang === "ar" ? "🌐 حدث خطأ أثناء الاتصال!" : "🌐 Connection Network Error!");
    } finally {
      setSbLoading(false);
    }
  };

  const loadSbRows = async (targetPage: number = sbPage) => {
    setSbLoading(true);
    const pageSize = 50;
    const offset = (targetPage - 1) * pageSize;
    addSbLog(`جاري جلب الصفحة ${targetPage} (السطر ${offset} إلى ${offset + pageSize}) من جدول: ${sbSelectedTable}...`);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Prefer": "count=exact",
      };
      if (sbAnonKey) {
        headers["apikey"] = sbAnonKey;
        headers["Authorization"] = `Bearer ${sbAnonKey}`;
      }
      
      const baseUrl = sbUrl.endsWith('/') ? sbUrl : sbUrl + '/';
      const url = `${baseUrl}${sbSelectedTable}?limit=${pageSize}&offset=${offset}`;
      const res = await fetch(url, {
        method: "GET",
        headers
      });

      if (res.ok) {
        const data = await res.json();
        setSbRows(Array.isArray(data) ? data : []);
        setSbStatus("connected");
        setSbPage(targetPage);
        
        // Dynamic response header parsing for Content-Range (e.g., 0-49/100000)
        const contentRange = res.headers.get("content-range") || res.headers.get("Content-Range");
        if (contentRange) {
          const match = contentRange.match(/\/(\d+)$/);
          if (match) {
            const total = parseInt(match[1]);
            setSbTotalCount(total);
            addSbLog(`✓ نجح جلب السجلات! تم تحميل الصفحة ${targetPage} بالكامل. إجمالي السطور الحقيقي بقاعدة البيانات: ${total.toLocaleString()}`);
          } else {
            addSbLog(`✓ نجح جلب السجلات! تم تحميل ${Array.isArray(data) ? data.length : 0} سطر.`);
          }
        } else {
          addSbLog(`✓ نجح جلب السجلات! تم تحميل ${Array.isArray(data) ? data.length : 0} سطر. (لم يتم تحديد إجمالي السجلات عبر الرأس بنجاح).`);
        }
        triggerToast(lang === "ar" ? `📋 تم تحميل الصفحة ${targetPage} من Supabase بنجاح!` : `📋 Fetched Page ${targetPage} from Supabase successfully!`);
      } else {
        addSbLog(`❌ فشل استعلام الجدول: ${res.statusText} (${res.status})`);
        triggerToast(lang === "ar" ? "❌ لم نتمكن من جلب السجلات للصحفة المحددة." : "❌ Failed to load requested page rows.");
      }
    } catch (e: any) {
      addSbLog(`❌ فشل تحميل البيانات: ${e.message}`);
    } finally {
      setSbLoading(false);
    }
  };

  const insertSbRow = async () => {
    if (!sbNewNameAr || !sbNewNameEn) {
      triggerToast(lang === "ar" ? "⚠️ الرجاء ملء اسم الطالب باللغة العربية والإنجليزية!" : "⚠️ Please enter Arabic and English names!");
      return;
    }
    setSbLoading(true);
    const idVal = sbNewId.trim() || `SGU-${1000 + Math.floor(Math.random() * 9000)}`;
    const newRecord = {
      id: idVal,
      nameAr: sbNewNameAr,
      nameEn: sbNewNameEn,
      email: sbNewEmail || `${idVal.toLowerCase()}@sgu.edu.eg`,
      phone: `+20 102${Math.floor(1000000 + Math.random() * 9000000)}`,
      role: "student",
      collegeId: sbNewCollege,
      gpaOrSalary: sbNewGpa,
      status: "active",
      nationalId: `3010415${Math.floor(1000000 + Math.random() * 9000000)}`,
      campusBranch: "فرع الصالحية الجديدة الرئيسي",
      createdAt: new Date().toISOString()
    };

    addSbLog(`جاري إدراج سجل جديد بجدول ${sbSelectedTable}: ${newRecord.nameAr}...`);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      };
      if (sbAnonKey) {
        headers["apikey"] = sbAnonKey;
        headers["Authorization"] = `Bearer ${sbAnonKey}`;
      }
      
      const url = `${sbUrl.endsWith('/') ? sbUrl : sbUrl + '/'}${sbSelectedTable}`;
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(newRecord)
      });

      if (res.ok) {
        addSbLog(`✓ تم إدراج الرقم المعرف ${idVal} بنجاح بالـ REST API!`);
        triggerToast(lang === "ar" ? "🎉 تم إدراج السجل في Supabase!" : "🎉 Row inserted in Supabase!");
        // Reset states
        setSbNewId("");
        setSbNewNameAr("");
        setSbNewNameEn("");
        setSbNewEmail("");
        // Reload table
        loadSbRows();
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errMsg = errorData?.message || res.statusText;
        addSbLog(`❌ فشل الإدراج: ${errMsg} (كود ${res.status})`);
        triggerToast(lang === "ar" ? `❌ فشل الإدراج: ${errMsg}` : `❌ Failed: ${errMsg}`);
      }
    } catch (e: any) {
      addSbLog(`❌ خطأ أثناء الإدراج: ${e.message}`);
    } finally {
      setSbLoading(false);
    }
  };

  const deleteSbRow = async (rowId: string) => {
    if (!window.confirm(lang === "ar" ? `هل أنت متأكد من حذف السجل المالي ذو الكود ${rowId} من قاعدة بيانات Supabase؟` : `Are you sure you want to delete row ${rowId} from Supabase?`)) {
      return;
    }
    setSbLoading(true);
    addSbLog(`جاري طلب حذف السجل ذو الرقم المعرّف ${rowId}...`);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (sbAnonKey) {
        headers["apikey"] = sbAnonKey;
        headers["Authorization"] = `Bearer ${sbAnonKey}`;
      }
      
      // PostgREST syntax for filtering: ?id=eq.rowId
      const url = `${sbUrl.endsWith('/') ? sbUrl : sbUrl + '/'}${sbSelectedTable}?id=eq.${rowId}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers
      });

      if (res.ok) {
        addSbLog(`✓ تم حذف السجل بنجاح من Supabase.`);
        triggerToast(lang === "ar" ? "🗑️ تم حذف السجل بنجاح!" : "🗑️ Row deleted successfully!");
        loadSbRows();
      } else {
        addSbLog(`❌ فشل الحذف: ${res.statusText} (كود ${res.status})`);
        triggerToast(lang === "ar" ? "❌ فشل عملية الحذف" : "❌ Delete failed.");
      }
    } catch (e: any) {
      addSbLog(`❌ خطأ أثناء الحذف: ${e.message}`);
    } finally {
      setSbLoading(false);
    }
  };

  const syncToLocalERP = () => {
    if (sbRows.length === 0) {
      triggerToast(lang === "ar" ? "⚠️ لا توجد سجلات Supabase تم جلبها لمزامنتها حالياً." : "⚠️ No loaded Supabase records to sync.");
      return;
    }
    
    // Merge or replace
    setDbUsers(prev => {
      // Find entries loaded from Supabase
      const formatted: any[] = sbRows.map(row => ({
        id: row.id || `SGU-${Math.floor(10000 + Math.random() * 90000)}`,
        nameAr: row.nameAr || row.name || "طالب مزامن",
        nameEn: row.nameEn || row.name_en || "Synced Student",
        email: row.email || "synced@sgu.edu.eg",
        phone: row.phone || "+20 1024040404",
        nationalId: row.nationalId || "30104100000000",
        createdAt: row.createdAt || new Date().toISOString(),
        role: row.role || "student",
        collegeId: row.collegeId || "fcis",
        status: row.status || "active",
        gpaOrSalary: row.gpaOrSalary || row.gva || "3.40",
        campusBranch: row.campusBranch || "فرع الصالحية الجديدة الرئيسي"
      }));

      // We'll merge with current users (matching by id, replacing if matched, or inserting if new)
      const merged = [...prev];
      formatted.forEach(item => {
        const idx = merged.findIndex(u => u.id === item.id);
        if (idx > -1) {
          merged[idx] = item;
        } else {
          merged.unshift(item);
        }
      });

      triggerToast(lang === "ar" ? `✨ تمت مزامنة وجلب ${formatted.length} طالب من Supabase إلى نظام إدارة موارد الجامعة الـ ERP!` : `✨ Synced ${formatted.length} students from Supabase into ERP!`);
      addSbLog(`✓ تم دمج ومزامنة ${formatted.length} سجل بنجاح داخل الـ Local State للـ ERP!`);
      return merged;
    });
  };

  const runFirebaseAuthAction = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    if (action === "reset") {
      if (!authResetEmail.trim()) {
        triggerToast(lang === "ar" ? "⚠️ الرجاء إدخال البريد الإلكتروني" : "⚠️ Please enter email address");
        return;
      }
      setAuthVerifyLogs(prev => [
        `[${timestamp}] Transmitting reset package to Firebase Auth: sendPasswordResetEmail("${authResetEmail}")`,
        `[${timestamp}] Firebase server accepted request. Email sent via SGU SMTP routing: OK.`,
        ...prev
      ]);
      triggerToast(lang === "ar" ? "📧 تم إرسال رابط إعادة التعيين لوحة الكلية!" : "📧 Password reset link sent!");
      setAuthResetEmail("");
    } else if (action === "verify") {
      setAuthVerifyLogs(prev => [
        `[${timestamp}] Triggering email verification: auth.currentUser.sendEmailVerification()`,
        `[${timestamp}] SGU Verification mailer delivered to "${authEmail}": Status Pending verification.`,
        ...prev
      ]);
      triggerToast(lang === "ar" ? "📨 تم إرسال رابط تفعيل البريد!" : "📨 Verification link sent!");
    } else if (action === "google_link") {
      setAuthVerifyLogs(prev => [
        `[${timestamp}] Initializing credential linkage: GoogleAuthProvider.credential()`,
        `[${timestamp}] Linking auth uid with "google.com" provider: Success`,
        ...prev
      ]);
      triggerToast(lang === "ar" ? "🔗 تم ربط الحساب بـ Google بنجاح!" : "🔗 Linked to Google successfully!");
    }
  };

  const handleMfaSetup = () => {
    if (mfaSetupStep === 0) {
      setMfaSetupStep(1);
      // Generate a totp code dynamically
      setTotpCode(String(Math.floor(100000 + Math.random() * 900000)));
    } else if (mfaSetupStep === 1) {
      setMfaSetupStep(2);
    } else if (mfaSetupStep === 2) {
      if (mfaOtpInput === totpCode || mfaOtpInput === "123456") {
        setMfaSetupStep(3);
        setMfaEnabled(true);
        triggerToast(lang === "ar" ? "🔒 تم تفعيل المصادقة الثنائية بنجاح 🟢" : "🔒 MFA Activated successfully!");
      } else {
        triggerToast(lang === "ar" ? "❌ الرمز خاطئ. جرب الرمز الموضح في الدليل أو 123456" : "❌ Invalid token. Try displayed code or 123456");
      }
    }
  };

  const disableMfa = () => {
    setMfaEnabled(false);
    setMfaSetupStep(0);
    setMfaOtpInput("");
    triggerToast(lang === "ar" ? "🔓 تم تعطيل المصادقة الثنائية" : "🔓 MFA Deactivated");
  };

  // ==========================================
  // PILLAR 2: DATABASE OPTIMIZATIONS & SCHEMAS
  // ==========================================
  const [selectedPrismaModel, setSelectedPrismaModel] = useState<"Student" | "Course" | "Grade" | "Backup">("Student");
  
  // Custom interactive validation test using Zod (simulated natively in pure logic)
  const [valEmail, setValEmail] = useState("student.youssef@sgu.edu.eg");
  const [valGpa, setValGpa] = useState("3.8");
  const [valPhone, setValPhone] = useState("+20 1021415050");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [validationOk, setValidationOk] = useState(false);

  const runZodValidation = () => {
    const errors: Record<string, string> = {};
    
    // Email Zod Validation Schema simulation
    if (!valEmail.includes("@") || !valEmail.endsWith(".eg")) {
      errors.email = lang === "ar" 
        ? "❌ صيغة البريد الإلكتروني غير صحيحة، يجب أن ينتهي بنطاق الجامعة المعتمد (.edu.eg) أو (.eg)"
        : "❌ Invalid SGU email format, must end in (.eg) or (.edu.eg)";
    }
    
    // GPA Zod validation
    const parsedGpa = parseFloat(valGpa);
    if (isNaN(parsedGpa) || parsedGpa < 0 || parsedGpa > 4.0) {
      errors.gpa = lang === "ar"
        ? "❌ المعدل التراكمي (GPA) غير صالح، يجب أن يكون قيمة رقمية بين 0.0 و 4.0"
        : "❌ GPA must be a valid numeric float value between 0.0 and 4.0";
    }

    // Egyptian phone Zod validation
    const phoneClean = valPhone.replace(/\s+/g, "");
    if (!phoneClean.startsWith("+20") || phoneClean.length < 11) {
      errors.phone = lang === "ar"
        ? "❌ رقم الهاتف غير صالح. يجب البدء بـ كود مصر الدولي (+20) متبوعاً بـ 10 أرقام"
        : "❌ Invalid Egyptian phone. Must start with (+20) followed by 10 digits";
    }

    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setValidationOk(isValid);
    if (isValid) {
      triggerToast(lang === "ar" ? "✅ تخطت البيانات فحص الأمان لمخطط Zod!" : "✅ Zod schema validation passed!");
    } else {
      triggerToast(lang === "ar" ? "⚠️ فشل فحص Zod للمدخلات!" : "⚠️ Zod schema validation failed!");
    }
  };

  // Search Latency Index simulator
  const [indexSearchQuery, setIndexSearchQuery] = useState("2026-ST-002");
  const [indexingActive, setIndexingActive] = useState(false);
  const [latencyResult, setLatencyResult] = useState<{ time: number; type: string; scans: number } | null>(null);

  const simulateIndexQuery = () => {
    if (indexingActive) {
      setLatencyResult({
        time: 1.8,
        type: "Index Scan using idx_student_id ON students",
        scans: 1
      });
    } else {
      setLatencyResult({
        time: 145.2,
        type: "Sequential Table Scan ON students (Full Disk Sweep)",
        scans: dbUsers.length + 30000
      });
    }
  };

  const toggleDatabaseIndex = () => {
    setIndexingActive(prev => {
      const next = !prev;
      triggerToast(next 
        ? (lang === "ar" ? "⚡ تم محاذاة وتركيب الفهرس الفائق idx_student_id! (أداء أسرع 100x)" : "⚡ Index idx_student_id created! (100x speedup)")
        : (lang === "ar" ? "⚠️ تم تعطيل الفهرسة الفعالة لقاعدة البيانات" : "⚠️ Database index dropped")
      );
      setLatencyResult(null);
      return next;
    });
  };

  // Prisma models map code
  const prismaModelCodes = {
    Student: `// schema.prisma
model Student {
  id                Int          @id @default(autoincrement())
  studentId         String       @unique @map("student_id")
  nationalId        String       @map("national_id")
  fullNameAr        String       @map("full_name_ar")
  email             String       @unique
  phone             String
  gpa               Float        @default(0.0)
  collegeId         Int          @map("college_id")
  
  // Relations
  enrollments       Enrollment[]
  tuitionFees       TuitionFee[]
  
  @@index([studentId]) // Index for instant lookups
  @@index([collegeId])
  @@map("students")
}`,
    Course: `// schema.prisma
model Course {
  id                Int          @id @default(autoincrement())
  courseCode        String       @unique @map("course_code")
  courseNameAr      String       @map("course_name_ar")
  credits           Int          @default(3)
  
  // Relations
  enrollments       Enrollment[]
  sections          CourseSection[]

  @@index([courseCode])
  @@map("courses")
}`,
    Grade: `// schema.prisma
model Grade {
  id                Int          @id @default(autoincrement())
  enrollmentId      Int          @map("enrollment_id")
  midtermGrade      Float        @map("midterm_grade")
  finalGrade        Float        @map("final_grade")
  totalGrade        Float        @map("total_grade")
  gradeLetter       String       @map("grade_letter")
  
  // Relations
  enrollment        Enrollment   @relation(fields: [enrollmentId], references: [id])

  @@index([enrollmentId])
  @@map("grades")
}`,
    Backup: `// schema.prisma
model BackupLog {
  id                Int          @id @default(autoincrement())
  fileName          String       @map("file_name")
  fileSizeMb        Float        @map("file_size_mb")
  triggeredBy       String       @map("triggered_by")
  status            String       @default("completed")
  createdAt         DateTime     @default(now()) @map("created_at")

  @@map("backup_logs")
}`
  };

  // Relational Map student profiles
  const sampleRelations = [
    { stId: "2026-ST-001", name: "يوسف خالد سليمان", course: "هياكل البيانات", prof: "أ.د محمد عبدالمجيد", score: "94/100", letter: "A" },
    { stId: "2026-ST-002", name: "مريم بركات القاضي", course: "التشريح الوصفي للجسم", prof: "د. سامي الجارحي هلال", score: "92/100", letter: "A" },
    { stId: "2026-ST-003", name: "كريم البحيري غالي", course: "السلوك التنظيمي للمؤسسات", prof: "د. يسرا البحيري عثمان", score: "82/100", letter: "B+" }
  ];

  // ==========================================
  // PILLAR 3: PERFORMANCE CACHING & PAGINATION
  // ==========================================
  const [cacheLogs, setCacheLogs] = useState<string[]>([]);
  const [redisStorage, setRedisStorage] = useState<Record<string, { val: any; ttl: number }>>({});
  const [cachingLatency, setCachingLatency] = useState<number | null>(null);

  const fetchWithRedisCache = (studentId: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const cacheKey = `sgu:student:${studentId}`;
    
    if (redisStorage[cacheKey]) {
      // Cache HIT!
      setCachingLatency(0.6); // 0.6ms
      setCacheLogs(prev => [
        `[${timestamp}] 🔴 CACHE HIT! key "${cacheKey}" resolved securely from Redis memory in 0.6ms`,
        ...prev
      ]);
      triggerToast(lang === "ar" ? "⚡ ضربة كاش ناجحة! (Cache HIT) بسرعة 0.6ms" : "⚡ Cache HIT! Resolved in 0.6ms");
    } else {
      // Cache MISS
      setCachingLatency(238.4); // 238ms
      setCacheLogs(prev => [
        `[${timestamp}] ⚪ CACHE MISS! key "${cacheKey}" not in Redis. Pulling from Cloud SQL PostgreSQL database (took 238ms)`,
        `[${timestamp}] 💾 Caching results in Redis under key "${cacheKey}" with TTL 60 seconds...`,
        ...prev
      ]);
      setRedisStorage(prev => ({
        ...prev,
        [cacheKey]: { val: { id: studentId, time: Date.now() }, ttl: 60 }
      }));
      triggerToast(lang === "ar" ? "💾 فقد في الذاكرة المؤقتة (Cache MISS) تم القراءة من القرص للحفظ" : "💾 Cache MISS! Populating from DB");
    }
  };

  const clearRedisCache = () => {
    setRedisStorage({});
    setCacheLogs(prev => [
      `[${new Date().toLocaleTimeString()}] 🧹 CACHE EXPIRED: Command "FLUSHALL" executed on Redis Client server.`,
      ...prev
    ]);
    triggerToast(lang === "ar" ? "🧹 تم تصفية وفرش كاش Redis بالكامل!" : "🧹 Redis cache flushed!");
  };

  // Caching TTL Countdown simulation (pure UI)
  const isKeyCached = (id: string) => !!redisStorage[`sgu:student:${id}`];

  // Pagination states
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);
  
  const paginatedUsers = useMemo(() => {
    const start = pageIndex * pageSize;
    return dbUsers.slice(start, start + pageSize);
  }, [dbUsers, pageIndex, pageSize]);

  const totalPages = Math.ceil(dbUsers.length / pageSize);

  // Lazy loading scrolling simulation
  const [lazyLoadedItems, setLazyLoadedItems] = useState([
    { id: "CS301", name: "هياكل تراكيب البيانات المتقدمة CS", hours: 3 },
    { id: "CS302", name: "مبادئ الذكاء الاصطناعي وهندسة اللغات", hours: 3 },
    { id: "CS303", name: "تصميم وإدارة مستودعات قواعد البيانات SQL", hours: 3 },
  ]);
  const [isLazyLoading, setIsLazyLoading] = useState(false);

  const triggerScrollLoadMore = () => {
    if (lazyLoadedItems.length >= 10) {
      triggerToast(lang === "ar" ? "🏁 اكتمل تحميل جميع البيانات المتاحة!" : "🏁 All items loaded!");
      return;
    }
    setIsLazyLoading(true);
    setTimeout(() => {
      setIsLazyLoading(false);
      setLazyLoadedItems(prev => [
        ...prev,
        { id: `MED-${100 + prev.length}`, name: "التشريح الطبي للجهاز اللمفاوي والقلب", hours: 4 },
        { id: `DEN-${200 + prev.length}`, name: "تكنولوجيا أسطح الأسنان الاصطناعية", hours: 3 },
      ]);
      triggerToast(lang === "ar" ? "⬇️ تم استدعاء وتحميل صفحتين إضافيتين بنظام " : "⬇️ Lazy loaded 2 more courses!");
    }, 1200);
  };

  // ==========================================
  // PILLAR 4: EMAIL & BROWSER NOTIFICATIONS
  // ==========================================
  const [emailLogs, setEmailLogs] = useState<string[]>([]);
  const [emailTarget, setEmailTarget] = useState("youssefeka8lad234@gmail.com");
  const [emailTemplate, setEmailTemplate] = useState<"grade_alert" | "tuition_invoice" | "auth_verification">("grade_alert");
  const [emailSubjectInput, setEmailSubjectInput] = useState("جامعتي SGU: اعتماد ورصد النتيجة الأكاديمية الرسمية");
  
  // Custom subject maps
  React.useEffect(() => {
    if (emailTemplate === "grade_alert") {
      setEmailSubjectInput("جامعتي SGU: اعتماد ورصد النتيجة الأكاديمية الرسمية");
    } else if (emailTemplate === "tuition_invoice") {
      setEmailSubjectInput("إشعار استحقاق مالي: فاتورة الفصل الدراسي الحالي");
    } else {
      setEmailSubjectInput("أمان SGU: رمز المصادقة والتحقق برابط البريد الموحد");
    }
  }, [emailTemplate]);

  const handleSendNodemailerSim = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleTimeString();

    let templateHTML = "";
    if (emailTemplate === "grade_alert") {
      templateHTML = `<div style="font-family: Cairo; direction: rtl;">
  <h2>عزيزي الطالب، يوسف خالد</h2>
  <p>نود إعلامك باعتماد نتائج رصد درجات الكنترول المركزي لـ <strong>هياكل تراكيب البيانات CS301</strong>.</p>
  <p>التقدير المستحق: <span style="color: #10B981; font-weight: bold; font-size: 18px;">امتياز (A)</span></p>
  <hr style="border: 1px solid #eee;" />
  <p style="font-size: 11px; color: #888;">مجلس جامعة الصالحية الجديدة SGU System</p>
</div>`;
    } else if (emailTemplate === "tuition_invoice") {
      templateHTML = `<div style="font-family: Cairo; direction: rtl;">
  <h2>جامعة الصالحية: الفاتورة الأكاديمية رقم #2026-F5</h2>
  <p>المستحقات المعتمدة للفصل الدراسي الثاني 2025/2026:</p>
  <ul>
    <li>الرسوم الأكاديمية: 27,500 جنيه مصري</li>
    <li>طرق السداد: فوري (Fawry API) أو كروت البنك المالي للجامعة</li>
  </ul>
  <p style="color: #FF2E2E; font-weight: bold;">تنبيه: يجب السداد قبل 15 شعبان لتفادي إيقاف فترات التسجيل الإلكتروني.</p>
</div>`;
    } else {
      templateHTML = `<div style="font-family: Cairo; direction: rtl;">
  <h2>تأكيد بريدك الإلكتروني والتحقق الأمني من SGU</h2>
  <p>من أجل إتمام نفاذ بوابات SGU والمصادقة المزدوجة MFA.</p>
  <p>اضغط على الرابط في الأسفل للتحقق الأمني المباشر:</p>
  <a href="#" style="background: #10B981; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">تفعيل الحساب والبريد الجامعي</a>
</div>`;
    }

    setEmailLogs(prev => [
      `[${timestamp}] SMTP CONNECTION ESTABLISHED (sgu.edu.eg:465)`,
      `[${timestamp}] Sending package envelope: from "no-reply@sgu.edu.eg" to "${emailTarget}"`,
      `[${timestamp}] Content-Type: text/html; Subject: "${emailSubjectInput}"`,
      `[${timestamp}] Nodemailer Server: Message Delivered (ID: <${Math.random().toString(36).substring(4)}@sgu.edu.eg>)`,
      ...prev
    ]);
    triggerToast(lang === "ar" ? "📧 تم إرسال الإشعار وتوليد قالب HTML بالنظام!" : "📧 HTML Email Dispatched!");
  };

  const triggerBrowserNativePush = () => {
    if (!("Notification" in window)) {
      triggerToast(lang === "ar" ? "⚠️ المتصفح لا يدعم الإشعارات المباشرة" : "⚠️ Browser does not support push!");
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("جامعتي SGU المطور", {
          body: lang === "ar" ? "🔔 تم تفعيل إشعارات المتصفح الفورية في بيئة الاختبار!" : "🔔 Hello from SGU ERP Server!",
          icon: "https://sgu.edu.eg/wp-content/uploads/2021/03/SGU-Logo-png.png"
        });
        triggerToast(lang === "ar" ? "🔔 تم إرسال إشعار للمتصفح!" : "🔔 Native Browser notification sent!");
      } else {
        triggerToast(lang === "ar" ? "❌ لم يتم منح الأذن للإشعارات في المتصفح" : "❌ Notifications permission denied");
      }
    });
  };

  // ==========================================
  // PILLAR 5: BACKUP SYSTEMS & EXPORT/IMPORT
  // ==========================================
  const [backupSchedule, setBackupSchedule] = useState("Automated Daily (03:00 AM UTC)");
  const [backupLogsList, setBackupLogsList] = useState([
    { id: "bak_001", file: "sgu_cloudsql_prod_2026-06-21.sql", size: 1245.5, triggeredBy: "System CronJob", status: "completed", date: "2026-06-21 03:00" },
    { id: "bak_002", file: "sgu_firestore_auth_2026-06-20.backup", size: 450.8, triggeredBy: "youssef_admin", status: "completed", date: "2026-06-20 11:20" },
    { id: "bak_003", file: "sgu_sqlite_mock_2026-06-19.json", size: 22.4, triggeredBy: "System Scheduled", status: "completed", date: "2026-06-19 03:00" }
  ]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const runOnDemandBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          const newBackup = {
            id: `bak_${Date.now()}`,
            file: `sgu_manual_snapshot_${new Date().toISOString().slice(0, 10)}.sql`,
            size: parseFloat((800 + Math.random() * 500).toFixed(1)),
            triggeredBy: "youssef_admin",
            status: "completed",
            date: new Date().toLocaleString()
          };
          setBackupLogsList(prevLogs => [newBackup, ...prevLogs]);
          triggerToast(lang === "ar" ? "💾 اكتمل توليد وحفظ النسخة الاحتياطية على خوادم السحابة!" : "💾 On-Demand backup snapshot succeeded!");
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Export dataset function
  const handleExportStudentsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbUsers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sgu_students_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast(lang === "ar" ? "📥 تم تصدير وتحميل قاعدة البيانات بصيغة JSON!" : "📥 Exported database to JSON!");
  };

  // Easy CSV Import state
  const [csvPasteInput, setCsvPasteInput] = useState(
    `SGU-10098,خالد ممدوح الجوهري,khaled@sgu.edu.eg,student,3.91\nSGU-10099,يسرا علي الشناوي,yousra@sgu.edu.eg,student,3.75`
  );

  const handleImportCSVData = () => {
    try {
      const lines = csvPasteInput.trim().split("\n");
      let count = 0;
      const newItems: any[] = [];
      
      lines.forEach(line => {
        const parts = line.split(",");
        if (parts.length >= 4) {
          newItems.push({
            id: parts[0].trim(),
            nameAr: parts[1].trim(),
            nameEn: parts[1].trim() + " SGU",
            email: parts[2].trim(),
            role: parts[3].trim(),
            gpaOrSalary: parts[4] ? parts[4].trim() : "3.50",
            collegeId: "fcis",
            phone: "+20 1099" + Math.floor(100000 + Math.random() * 900000)
          });
          count++;
        }
      });

      if (count > 0) {
        setDbUsers(prev => [...newItems, ...prev]);
        triggerToast(lang === "ar" ? `📥 تم دمج وجدولة عدد ${count} سجلات مدخلة بنجاح!` : `📥 Successfully imported ${count} records!`);
      } else {
        triggerToast(lang === "ar" ? "⚠️ صيغة المدخلات غير مطابقة لـ CSV (رقم، اسم، بريد، دور، gpa)" : "⚠️ Invalid CSV row formats!");
      }
    } catch (e) {
      triggerToast("❌ Failed importing data: check formatting!");
    }
  };


  return (
    <div className="space-y-6 text-right">
      
      {/* Premium Header Container */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950/20 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="order-2 md:order-1">
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 via-teal-100 to-amber-300">
              {lang === "ar" ? "البوابة المتطورة لأمان وهيكلية قواعد البيانات | DB Suite" : "Advanced Database Security & Infrastructure Suite"}
            </h1>
            <p className="text-xs text-slate-350 leading-relaxed max-w-3xl mt-1">
              {lang === "ar" 
                ? "لوحة تحكم للمصادقة المزدوجة MFA، ضبط الفهارس وحساب سرعات الاستجابة، التدقيق بمخططات Zod الشاملة، وبث إشعارات SMTP وترتيب مهام النسخ الاحتياطي التلقائي."
                : "Active playground for Multi-Factor Authentication (MFA), search indexing benchmarks, Zod validations, SMTP Nodemailer tests, and automatic JSON/CSV database replication snapshots."}
            </p>
          </div>
          <div className="order-1 md:order-2 bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/25 shrink-0 self-start md:self-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
        
        {/* Dynamic Horizontal Sub Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-800/80 mt-5 pt-4 text-xs font-bold">
          {[
            { id: "auth", labelAr: "المصادقة و MFA لأمان البوابات", labelEn: "Auth & MFA Safety", icon: Key },
            { id: "db_opt", labelAr: "مخططات Prisma ودرجات الحوكمة Zod", labelEn: "Prisma & Zod Validation", icon: Table },
            { id: "perf", labelAr: "استجابة Caching وفهرسة الاستعلامات", labelEn: "Performance Caching & Indexing", icon: Zap },
            { id: "notif", labelAr: "SMTP وتنبيهات المتصفح الهجينة", labelEn: "Email & Browser Alerts", icon: Bell },
            { id: "backup", labelAr: "عمليات Backup وتصدير البيانات", labelEn: "Backups & Data Export", icon: Server },
            { id: "supabase", labelAr: "مزامنة Supabase الحية", labelEn: "Supabase Realtime Sync", icon: Database }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer px-4 py-2 rounded-xl flex items-center gap-2 transition ${
                  isSelected
                    ? "bg-emerald-600 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/10"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span>{lang === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background highlight for the active card */}
          <div className="absolute top-0 right-0 left-0 h-[2px] bg-emerald-500/30" />

          {/* =======================================================
              TAB 1: AUTHENTICATION, ROLES, MFA & PASSWORD RESET
              ====================================================== */}
          {activeTab === "auth" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Auth Setup panel */}
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-black text-slate-100 flex items-center gap-2 leading-none">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>{lang === "ar" ? "حالة بيئة المصادقة الحية (Firebase Auth Status)" : "Firebase Auth Console"}</span>
                    </h3>
                    <p className="text-[11px] text-slate-450 mt-1">
                      {lang === "ar"
                        ? "سيرفر المصادقة يعمل ومعتمد للمشروع tranquil-env-jttsj بمعدل تشفير TLS 1.3"
                        : "Active Firebase production project authenticated on security zones."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                      <div className="flex justify-between items-center text-[11px] border-b border-slate-900 pb-2">
                        <span className="font-mono text-emerald-450 font-bold">active_user: {authEmail}</span>
                        <span className="text-slate-500">{lang === "ar" ? "المستقر الحالي:" : "Current User:"}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-slate-500 block text-[10px]">{lang === "ar" ? "طرق المصادقة المتصلة" : "Linked Providers"}</span>
                          <span className="font-mono text-slate-300 block font-bold mt-0.5">📧 Email, 🔗 Google</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">{lang === "ar" ? "تأكيد التحقق الجامعي" : "Email Verified"}</span>
                          <span className="text-emerald-450 block font-bold mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            {lang === "ar" ? "نعم (Verified)" : "Yes"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Email Verification and Passwords */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-305 mb-1.5">
                          {lang === "ar" ? "إعادة تعيين واستعادة كلمة المرور لـ Firebase:" : "Firebase Password Recovery Console:"}
                        </h4>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder={lang === "ar" ? "أدخل بريد الطالب أو الأستاذ المستهدف" : "Enter target email address"}
                            value={authResetEmail}
                            onChange={(e) => setAuthResetEmail(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 p-2 text-xs rounded-xl text-left outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={() => runFirebaseAuthAction("reset")}
                            className="cursor-pointer bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0"
                          >
                            {lang === "ar" ? "إرسال رابط الاستعادة" : "Send Reset link"}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          onClick={() => runFirebaseAuthAction("verify")}
                          className="cursor-pointer flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lang === "ar" ? "فحص وإعادة إرسال تفعيل البريد" : "Re-trigger Verification Status"}</span>
                        </button>

                        <button
                          onClick={() => runFirebaseAuthAction("google_link")}
                          className="cursor-pointer flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-500" />
                          <span>{lang === "ar" ? "ربط معرّف Google بجامعتي" : "Link Google Identity Credentials"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MFA / Multi-factor Setup Screen */}
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${mfaEnabled ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-slate-900 text-slate-450 border border-slate-800"}`}>
                      {mfaEnabled ? (lang === "ar" ? "🟢 نشط وآمن" : "🟢 ACTIVE") : (lang === "ar" ? "🔴 غير مفعل" : "🔴 INACTIVE")}
                    </span>
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      {lang === "ar" ? "بوابة الأمان والتحقق الثنائي MFA" : "MFA Multi-Factor Setup Gateway"}
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                    </h3>
                  </div>

                  {mfaSetupStep === 0 && (
                    <div className="space-y-4 py-2">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === "ar"
                          ? "لمنع سرقة وثائق الموظفين الحساسة، تفرض سياسة عمادة SGU تمكين الأمان الثنائي MFA. عند تفعيل السياسة، سيلزمك إدخال رمز مرور مؤقت مولد بهاتفك المحمول مع كل جلسة تسجيل دخول."
                          : "Protect your university credentials from scraping. Activating 2FA ensures only authorized mobile OTP tokens can bypass login gates."}
                      </p>
                      
                      <button
                        onClick={handleMfaSetup}
                        className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-2.5 rounded-xl text-xs font-extrabold transition text-center"
                      >
                        {lang === "ar" ? "🔒 تفعيل المصادقة المزدوجة ومسح الرمز" : "🔒 Start MFA Setup Assistant"}
                      </button>
                    </div>
                  )}

                  {mfaSetupStep === 1 && (
                    <div className="text-center space-y-3 py-1">
                      <p className="text-[11px] text-slate-300 font-bold">
                        {lang === "ar" ? "1. امسح رمز الاستجابة السريعة بهاتف تطبيق الحماية (Google Authenticator)" : "1. Scan the SGU Secret QR Code with Authenticator app"}
                      </p>
                      
                      {/* Glowing Vector QR Code Mockup */}
                      <div className="bg-white p-3 rounded-xl inline-block border border-slate-700/65 shadow-lg shadow-emerald-500/5 transition">
                        <div className="w-32 h-32 bg-slate-900 rounded-lg flex flex-col justify-center items-center border border-slate-800 p-1 relative">
                          {/* Simulated QR block layout */}
                          <div className="grid grid-cols-4 gap-1.5 w-full h-full p-2">
                            <div className="bg-emerald-400 rounded-sm"></div>
                            <div className="bg-slate-950 rounded-sm"></div>
                            <div className="bg-emerald-400 rounded-sm"></div>
                            <div className="bg-emerald-400 rounded-sm"></div>
                            <div className="bg-slate-950 rounded-sm"></div>
                            <div className="bg-emerald-400 rounded-sm"></div>
                            <div className="bg-slate-950 rounded-sm"></div>
                            <div className="bg-slate-950 rounded-sm"></div>
                            <div className="bg-emerald-400 rounded-sm"></div>
                            <div className="bg-slate-950 rounded-sm"></div>
                            <div className="bg-emerald-400 rounded-sm"></div>
                            <div className="bg-slate-950 rounded-sm"></div>
                            <div className="bg-emerald-400 rounded-sm"></div>
                            <div className="bg-emerald-400 rounded-sm"></div>
                            <div className="bg-slate-950 rounded-sm"></div>
                            <div className="bg-emerald-400 rounded-sm"></div>
                          </div>
                          <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                            <div className="bg-slate-950 p-1 rounded border border-emerald-500 text-[8px] font-mono font-black text-emerald-450 tracking-wider">SGU</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-450 leading-none">
                        {lang === "ar" ? `مفتاح الحماية اليدوي: ${totpSecret}` : `Setup Key: ${totpSecret}`}
                      </div>

                      <button
                        onClick={handleMfaSetup}
                        className="cursor-pointer w-full bg-slate-800 hover:bg-slate-755 text-slate-100 py-2 rounded-xl text-xs font-bold transition text-center"
                      >
                        {lang === "ar" ? "التالي: أدخل رمز الهاتف للتأكيد" : "Next: Verify OTP Token"}
                      </button>
                    </div>
                  )}

                  {mfaSetupStep === 2 && (
                    <div className="space-y-3.5 py-1 text-right">
                      <p className="text-[11px] text-slate-350 leading-relaxed font-semibold">
                        {lang === "ar"
                          ? `2. أدخل الرمز المكون من 6 أرقام الموجود لتأكيد صحة المزامنة:`
                          : `2. Provide the 6-digit verification code from your mobile screen:`}
                      </p>
                      
                      <div className="bg-slate-900 border border-dashed border-emerald-500/20 p-2.5 rounded-xl space-y-1.5 mb-1 bg-slate-950/65">
                        <span className="text-[9.5px] text-amber-400 font-bold block">{lang === "ar" ? "📱 الرمز المؤقت المولد الآن على هاتفك:" : "📱 Code active right now on phone:"}</span>
                        <button 
                          onClick={() => setMfaOtpInput(totpCode)}
                          className="cursor-pointer bg-emerald-500/20 text-emerald-300 font-mono text-sm px-2.5 py-0.5 rounded font-black border border-emerald-500/30 hover:bg-emerald-500/30 transition text-left" dir="ltr"
                        >
                          {totpCode} ({lang === "ar" ? "اضغط للأنسخ ⚡" : "Tap to autofill ⚡"})
                        </button>
                      </div>

                      <div className="space-y-1">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="e.g., 492015"
                          value={mfaOtpInput}
                          onChange={(e) => setMfaOtpInput(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 p-2 text-center font-mono text-sm tracking-[0.3em] rounded-xl outline-none focus:border-emerald-500 text-slate-200"
                        />
                      </div>

                      <button
                        onClick={handleMfaSetup}
                        className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-2.5 rounded-xl text-xs font-black transition text-center"
                      >
                        {lang === "ar" ? "تأكيد وتفعيل MFA" : "Verify & Enable MFA"}
                      </button>
                    </div>
                  )}

                  {mfaSetupStep === 3 && (
                    <div className="space-y-4 py-1 text-right">
                      <div className="bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded-xl flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-100">{lang === "ar" ? "لقد قمت بحماية حسابك بنجاح!" : "System Protected!"}</h4>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed">
                            {lang === "ar" ? "كل محاولة نفاذ جديدة ستتطلب الرمز المولد بهاتفك المربوط." : "Multi-factor authentication is globally enforced on your university account."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">{lang === "ar" ? "رموز الأمان البديلة للطوارئ (Backup Codes):" : "Emergency Backup Codes (Stored Offline):"}</span>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900 p-2.5 rounded-xl text-center border border-slate-850">
                          {backupCodes.map((code, idx) => (
                            <span key={idx} className="bg-slate-950 text-slate-350 p-1 rounded font-bold border border-slate-900">{code}</span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={disableMfa}
                        className="cursor-pointer w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-900/40 py-2 rounded-xl text-xs font-bold transition text-center"
                      >
                        {lang === "ar" ? "🔓 إلغاء تفعيل الأمان الثنائي" : "🔓 Deactivate 2FA Security"}
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Roles Security MATRIX */}
              <div className="border-t border-slate-800/80 pt-6">
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wild flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    {lang === "ar" ? "مصفوفة الأدوار والصلاحيات المعتمدة للأنظمة" : "Roles and Access Policies Matrix"}
                  </h4>
                  <p className="text-[11px] text-slate-450 mt-1 leading-relaxed">
                    {lang === "ar"
                      ? "الدخول والقدرة على إجراءات التعديل والأوامر بقواعد البيانات يتوقف الصلاحيات الممنوحة لرمز المصادقة كما هو مصاغ بملفات firestore.rules:"
                      : "Strict Attribute-Based Access Control (ABAC) permissions mapping enforced synchronously across backend structures:"}
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-850 rounded-xl">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-850">
                        <th className="p-3">{lang === "ar" ? "دور الكادر (Role)" : "Role"}</th>
                        <th className="p-3">{lang === "ar" ? "التحقق المزدوج" : "MFA Requirement"}</th>
                        <th className="p-3">{lang === "ar" ? "استعلامات العرض" : "Read Queries"}</th>
                        <th className="p-3">{lang === "ar" ? "أعمال السنة والدرجات" : "Write Custom Grades"}</th>
                        <th className="p-3">{lang === "ar" ? "النسخ الاحتياطي" : "Trigger Backups"}</th>
                        <th className="p-3">{lang === "ar" ? "الأمان والهيكلية" : "DB Configurations"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-900 text-slate-350">
                      <tr>
                        <td className="p-3 font-bold text-slate-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {lang === "ar" ? "طالب (Student)" : "Student"}
                        </td>
                        <td className="p-3 text-slate-500">{lang === "ar" ? "موصى به" : "Recommended"}</td>
                        <td className="p-3 text-emerald-450 font-bold">✓ {lang === "ar" ? "سجلاته فقط" : "Schedules & grades"}</td>
                        <td className="p-3 text-slate-600">❌ {lang === "ar" ? "محجوب" : "Restricted"}</td>
                        <td className="p-3 text-slate-600">❌ {lang === "ar" ? "محجوب" : "Restricted"}</td>
                        <td className="p-3 text-slate-600">❌ {lang === "ar" ? "محجوب" : "Restricted"}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                          {lang === "ar" ? "أستاذ مقرر (Professor)" : "Professor"}
                        </td>
                        <td className="p-3 text-amber-500 font-bold">{lang === "ar" ? "مطلوب" : "Required"}</td>
                        <td className="p-3 text-emerald-450 font-bold">✓ {lang === "ar" ? "شعبة التدريس" : "My courses"}</td>
                        <td className="p-3 text-emerald-450 font-bold">✓ {lang === "ar" ? "مواده فقط" : "Enter grades"}</td>
                        <td className="p-3 text-slate-600">❌ {lang === "ar" ? "محجوب" : "Restricted"}</td>
                        <td className="p-3 text-slate-600">❌ {lang === "ar" ? "محجوب" : "Restricted"}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {lang === "ar" ? "مسؤول تسجيل (Registrar)" : "Registrar"}
                        </td>
                        <td className="p-3 text-rose-400 font-bold">{lang === "ar" ? "إلزامي (Enforced)" : "Enforced"}</td>
                        <td className="p-3 text-emerald-450 font-bold">✓ {lang === "ar" ? "كافة السجلات" : "Full Access"}</td>
                        <td className="p-3 text-slate-500">⚠ {lang === "ar" ? "موافقة واعتماد" : "Audit Only"}</td>
                        <td className="p-3 text-slate-600">❌ {lang === "ar" ? "محجوب" : "Restricted"}</td>
                        <td className="p-3 text-slate-600">❌ {lang === "ar" ? "محجوب" : "Restricted"}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                          {lang === "ar" ? "مشرف قاعدة البيانات (DB Admin)" : "DB Administrator"}
                        </td>
                        <td className="p-3 text-rose-450 font-bold">{lang === "ar" ? "بيومتري + OTP" : "MFA Enforced"}</td>
                        <td className="p-3 text-emerald-450 font-bold">✓ {lang === "ar" ? "نفاذ مطلق" : "Root read"}</td>
                        <td className="p-3 text-emerald-450 font-bold">✓ {lang === "ar" ? "تعديل مباشر" : "Root write"}</td>
                        <td className="p-3 text-emerald-450 font-bold">✓ {lang === "ar" ? "تفعيل كلي" : "Active backup"}</td>
                        <td className="p-3 text-emerald-450 font-bold">✓ {lang === "ar" ? "تحكم هيكلي" : "Prisma re-sync"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Logs display */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider font-mono">auth_security_diagnostic_logs.audit</span>
                <div className="max-h-36 overflow-y-auto pt-2 space-y-1 text-[10.5px] font-mono text-slate-400" dir="ltr">
                  {authVerifyLogs.length === 0 ? (
                    <span className="text-slate-600 block">[No recent diagnostic auth streams. Triggers actions above to output logs]</span>
                  ) : (
                    authVerifyLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-slate-900/60 pb-1 text-left">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              TAB 2: DATABASE IMPROVEMENTS, PRISMA SCHEMA & ZOD
              ====================================================== */}
          {activeTab === "db_opt" && (
            <div className="space-y-6">
              
              {/* Prisma Scheme Visualizer */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Prisma Scheme selection and display */}
                <div className="space-y-3">
                  <div className="border-b border-slate-800 pb-2.5">
                    <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span>{lang === "ar" ? "لوحة إنشاء ونمذجة Prisma ORM لجامعتي" : "SGU Prisma ORM Schema Modeler"}</span>
                    </h3>
                    <p className="text-[11px] text-slate-450 mt-1">
                      {lang === "ar"
                        ? "اختر طراز قاعدة البيانات لعرض كود تهيئة Prisma المقابل وصياغة العلاقات:"
                        : "Select entity model to view its relational configuration and export code:"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {["Student", "Course", "Grade", "Backup"].map((model) => (
                      <button
                        key={model}
                        onClick={() => setSelectedPrismaModel(model as any)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition flex-1 ${
                          selectedPrismaModel === model
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-950 text-slate-400 border border-slate-900 hover:text-slate-350"
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>

                  {/* Schema Code Block */}
                  <div className="relative">
                    <span className="absolute top-2 left-2 text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono text-slate-500">Prisma</span>
                    <pre className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[11px] text-emerald-450 overflow-x-auto text-left" dir="ltr">
                      {prismaModelCodes[selectedPrismaModel]}
                    </pre>
                  </div>
                  
                  <div className="flex justify-between items-center bg-slate-950/45 px-3 py-2 rounded-lg text-[10px] text-slate-400 border border-slate-850/80">
                    <span>{lang === "ar" ? "قاعدة البيانات المدعومة: PostgreSQL" : "Provider target: PostgreSQL"}</span>
                    <span className="font-bold text-amber-500">{lang === "ar" ? "✨ محاذاة تلقائية مع العلاقات" : "✨ Cascading delete mapped"}</span>
                  </div>
                </div>

                {/* Zod Schema Validation tester */}
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-5 space-y-4">
                  <div className="border-b border-slate-900 pb-2.5">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-end">
                      {lang === "ar" ? "أداة تدقيق البيانات والامتثال لمخطط Zod" : "Realtime Runtime Zod Validation Monitor"}
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {lang === "ar"
                        ? "أدخل بيانات عشوائية للتحقق من تطابقها لـ Zod Schema الخاص بقواعد بيانات SGU المدمج:"
                        : "Verify instant compliance of inputs according to our strict validation schemas before pushing writes to server."}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    
                    {/* Val Phone */}
                    <div className="space-y-1">
                      <label className="text-slate-405 block font-bold">{lang === "ar" ? "الهاتف بترميز Zod (مصر):" : "Zod Phone Validation (+20):"}</label>
                      <input
                        type="text"
                        value={valPhone}
                        onChange={(e) => setValPhone(e.target.value)}
                        placeholder="+20 1021415050"
                        className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-left outline-none font-mono focus:border-emerald-500 text-slate-200"
                        dir="ltr"
                      />
                      {validationErrors.phone && (
                        <p className="text-[10px] text-rose-400 font-medium">{validationErrors.phone}</p>
                      )}
                    </div>

                    {/* Val GPA */}
                    <div className="space-y-1">
                      <label className="text-slate-405 block font-bold">{lang === "ar" ? "المعدل التراكمي Zod gpa():" : "Zod GPA bounds checked (0.0 to 4.0):"}</label>
                      <input
                        type="text"
                        value={valGpa}
                        onChange={(e) => setValGpa(e.target.value)}
                        placeholder="3.82"
                        className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-left outline-none font-mono focus:border-emerald-500 text-slate-200"
                        dir="ltr"
                      />
                      {validationErrors.gpa && (
                        <p className="text-[10px] text-rose-400 font-medium">{validationErrors.gpa}</p>
                      )}
                    </div>

                    {/* Val Email */}
                    <div className="space-y-1">
                      <label className="text-slate-405 block font-bold">{lang === "ar" ? "البريد الإلكتروني Zod email().endswith():" : "Zod Email format constraint:"}</label>
                      <input
                        type="text"
                        value={valEmail}
                        onChange={(e) => setValEmail(e.target.value)}
                        placeholder="test@sgu.edu.eg"
                        className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-left outline-none font-mono focus:border-emerald-500 text-slate-200"
                        dir="ltr"
                      />
                      {validationErrors.email && (
                        <p className="text-[10px] text-rose-400 font-medium">{validationErrors.email}</p>
                      )}
                    </div>

                    <button
                      onClick={runZodValidation}
                      className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-2.5 rounded-xl text-xs font-black transition text-center"
                    >
                      {lang === "ar" ? "⚡ تشغيل فحص مخطط Zod الأمني" : "⚡ Verify compliance against Zod schema"}
                    </button>

                    {validationOk && Object.keys(validationErrors).length === 0 && (
                      <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-450 p-2.5 rounded-xl text-[10.5px] leading-relaxed flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{lang === "ar" ? "المدخلات متطابقة تماماً ومتطابقة مع نموذج SGU DB بنجاح!" : "All fields complied perfectly with our Prisma relational constraints!"}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Data Relations Visual Map representer */}
              <div className="border-t border-slate-800/80 pt-6">
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-emerald-400" />
                    <span>{lang === "ar" ? "مخطط سحب العلاقات المتقاطعة (CROSS-RELATIONS: Student ↔ Courses)" : "Cross-Relation relational Join view (Student ↔ Course ↔ Professor ↔ Grade)"}</span>
                  </h4>
                  <p className="text-[10.5px] text-slate-450 mt-1 leading-relaxed">
                    {lang === "ar"
                      ? "يوضح الجدول أدناه دمج واستعلام العلاقات المرتبطة بالمفاتيح الخارجية (FOREIGN KEY Relations) في سكيما الجامعة الموحدة:"
                      : "Compiled active SQL Join view showing direct structural cascading relations configured across PostgreSQL records:"}
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-850 rounded-xl">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-850">
                        <th className="p-3">{lang === "ar" ? "الرقم الجامعي" : "Student ID"}</th>
                        <th className="p-3">{lang === "ar" ? "اسم الطالب (Relations)" : "Student Name"}</th>
                        <th className="p-3">{lang === "ar" ? "المادة المسجلة" : "Enrolled Course"}</th>
                        <th className="p-3">{lang === "ar" ? "أستاذ المقرر (Linked Relation)" : "Linked Professor"}</th>
                        <th className="p-3">{lang === "ar" ? "الدرجة والرصد" : "Current Grade"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-900 text-slate-350">
                      {sampleRelations.map((rel, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-mono font-bold text-slate-200">{rel.stId}</td>
                          <td className="p-3 text-slate-100">{rel.name}</td>
                          <td className="p-3 text-slate-300 font-medium">{rel.course}</td>
                          <td className="p-3 text-slate-400 font-medium">{rel.prof}</td>
                          <td className="p-3 font-mono text-emerald-450 font-black">{rel.score} ({rel.letter})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              TAB 3: PERFORMANCE BENCHMARKING, CACHING & PAGINATION
              ====================================================== */}
          {activeTab === "perf" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Latency Index simulator */}
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2.5">
                    <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>{lang === "ar" ? "محاكي سرعة البحث وجودة فهارس الاستعلام (Indexing)" : "Search Query Optimizer & Index Benchmarker"}</span>
                    </h3>
                    <p className="text-[11px] text-slate-450 mt-1">
                      {lang === "ar"
                        ? "اختبر سرعة جلب البيانات من بين 30,000 مستخدم مع تفعيل أو تعطيل الفهارس (Indexes):"
                        : "Test execution speeds with full sequential disc sweep versus lightning-fast indexed hashes:"}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleDatabaseIndex}
                        className={`cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                          indexingActive 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                            : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300"
                        }`}
                      >
                        {indexingActive 
                          ? (lang === "ar" ? "⚡ الفهرس نشط وبسرعة فائقة" : "⚡ INDEXED LOOKUP ACTIVE") 
                          : (lang === "ar" ? "⚠ الفهرس غير نشط (Seq Scan)" : "⚠ INDEX DROPPED (Seq Scan)")}
                      </button>
                      <span className="text-slate-500 text-xs">{lang === "ar" ? "حالة الفهرس:" : "Indexing Status:"}</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block">{lang === "ar" ? "الاستعلام المستهدف:" : "SQL Query Target ID:"}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={indexSearchQuery}
                          onChange={(e) => setIndexSearchQuery(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 p-2 text-xs rounded-lg font-mono text-slate-200 outline-none"
                        />
                        <button
                          onClick={simulateIndexQuery}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                        >
                          <Play className="w-3 h-3 shrink-0" />
                          <span>{lang === "ar" ? "تنفيذ الاستعلام" : "Run Query"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Benchmark latency results display */}
                  {latencyResult && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.95 }}
                      className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-mono text-base font-extrabold ${indexingActive ? "text-emerald-450" : "text-amber-400"}`}>
                          {latencyResult.time} ms
                        </span>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === "ar" ? "وقت الاستجابة (EXPLAIN LATENCY):" : "Execution latency:"}</span>
                      </div>

                      <div className="space-y-1 font-mono text-[10px] text-slate-400 text-left" dir="ltr">
                        <div>&gt; EXPLAIN ANALYZE SELECT * FROM students WHERE student_id = '{indexSearchQuery}';</div>
                        <div className={indexingActive ? "text-emerald-500" : "text-amber-500"}>
                          &gt; {latencyResult.type}
                        </div>
                        <div>&gt; Rows examined block sweep: {latencyResult.scans.toLocaleString()} partitions</div>
                      </div>

                      <div className={`text-[10px] font-bold p-2 rounded ${indexingActive ? "bg-emerald-950/20 text-emerald-400" : "bg-amber-950/20 text-amber-300"}`}>
                        {indexingActive 
                          ? (lang === "ar" ? "🚀 ممتاز! الفهرس يمنع حدوث انخفاض أداء الذاكرة ويوفر 99.1% من استخدام السيرفر." : "🚀 Speed boost achieved! Index mapped via primary hashes.") 
                          : (lang === "ar" ? "⚠️ السيرفر يبذل جهداً في التمحيص داخل الأقراص الصلبة. ينصح بتركيب فهرسة فورية لتفادي الاستهلاك." : "⚠️ High sweep latency. Indexing of studentId field strongly recommended.")}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Redis Caching simulator */}
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-5 space-y-4">
                  <div className="border-b border-slate-900 pb-2.5">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-end">
                      {lang === "ar" ? "محاكي بث الذاكرة المستقرة وكاش الـ Redis الموحد" : "Interactive Redis Cache Server Terminal"}
                      <Server className="w-4 h-4 text-emerald-500" />
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {lang === "ar"
                        ? "اختبر توفير الاستجابة بالذاكرة المؤقتة (Cache Miss/Hit) وتخفيف الضغط على السحابة:"
                        : "Test Redis cluster caching mechanism. Hits pull instantly from RAM, while misses fall back to PostgreSQL records."}
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchWithRedisCache("2026-ST-001")}
                        className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-slate-200 p-2.5 rounded-lg border border-slate-800 text-xs font-bold flex-1 text-center truncate"
                      >
                        {lang === "ar" ? "استدعاء الطالب يوسف (ST-001)" : "Get Student 001"}
                      </button>
                      <button
                        onClick={() => fetchWithRedisCache("2026-ST-002")}
                        className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-slate-200 p-2.5 rounded-lg border border-slate-800 text-xs font-bold flex-1 text-center truncate"
                      >
                        {lang === "ar" ? "استدعاء الطالبة مريم (ST-002)" : "Get Student 002"}
                      </button>
                      <button
                        onClick={clearRedisCache}
                        className="cursor-pointer bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-900/40 px-3.5 py-1 text-xs font-bold rounded-lg transition"
                      >
                        {lang === "ar" ? "تصفية الكاش" : "Flush Cache"}
                      </button>
                    </div>

                    {/* Performance metrics display */}
                    {cachingLatency !== null && (
                      <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center text-xs">
                        <span className={`font-mono font-black ${cachingLatency < 2.0 ? "text-emerald-450 animate-pulse" : "text-amber-400"}`}>
                          {cachingLatency} ms
                        </span>
                        <span className="text-slate-500 text-[10px]">{lang === "ar" ? "زمن المعالجة الفعلي للطلب:" : "Request latency:"}</span>
                      </div>
                    )}

                    {/* Active keys table log */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-black block tracking-wider text-left" dir="ltr">&gt; KEYS sgu:student:*</span>
                      <div className="bg-slate-900 p-2 rounded-lg text-[10px] font-mono text-slate-400 space-y-1 max-h-24 overflow-y-auto text-left" dir="ltr">
                        {Object.keys(redisStorage).length === 0 ? (
                          <span className="text-slate-650 block">EMPTY CACHE SET (Run fetch requests above to write items)</span>
                        ) : (
                          Object.keys(redisStorage).map(key => (
                            <div key={key} className="flex justify-between items-center text-emerald-400 bg-slate-950 px-2 py-1 rounded">
                              <span>TTL: 59s</span>
                              <span>{key}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Pagination & Infinite display demo */}
              <div className="border-t border-slate-800/80 pt-6">
                <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="text-right">
                    <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Table className="w-4 h-4 text-emerald-400" />
                      <span>{lang === "ar" ? "استعراض تصفح الصفحات والتجزئة (PAGINATION: 5 results/page)" : "Interactive Pagination (Table index paging controller)"}</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-450 mt-1">
                      {lang === "ar"
                        ? "تحتوي منظومة الطلاب الموحدة على تحكم في سعة صفحة البحث لضمان عدم استهلاك سعة الـ DOM:"
                        : "Page-per-view slice controls prevent massive layout freezes when querying thousands of nested rows:"}
                    </p>
                  </div>

                  {/* Page sizing selector */}
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                    {[5, 10, 20].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setPageSize(size);
                          setPageIndex(0);
                        }}
                        className={`cursor-pointer px-3 py-1 rounded-lg text-[10.5px] font-bold ${
                          pageSize === size ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-slate-205"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Paginated data display */}
                <div className="overflow-x-auto border border-slate-850 rounded-xl mb-4">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-850">
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">{lang === "ar" ? "الاسم بالعربية" : "Name Arabic"}</th>
                        <th className="p-2.5">{lang === "ar" ? "البريد الإلكتروني الموحد" : "Active Email"}</th>
                        <th className="p-2.5">{lang === "ar" ? "الوظيفة / الدور" : "Primary Role"}</th>
                        <th className="p-2.5">{lang === "ar" ? "معدل gpa" : "GPA / Salary"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-900 text-slate-350 font-mono text-[11px]">
                      {paginatedUsers.map((user, idx) => (
                        <tr key={idx} className={isKeyCached(user.id) ? "bg-emerald-950/10 border-r-2 border-emerald-500" : ""}>
                          <td className="p-2.5 font-bold text-slate-100">{user.id}</td>
                          <td className="p-2.5 font-sans font-bold text-slate-200">{user.nameAr}</td>
                          <td className="p-2.5 tracking-wide text-slate-400">{user.email}</td>
                          <td className="p-2.5 font-sans">
                            <span className="px-2 py-0.5 rounded bg-slate-950 text-neutral-300 font-bold text-[9.5px]">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-2.5 font-bold text-amber-400">{user.gpaOrSalary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                  <div>
                    {lang === "ar"
                      ? `يعرض السيرفر صفحة ${pageIndex + 1} من أصل ${totalPages} (سجلات الطلاب الكلي ${dbUsers.length})`
                      : `Page ${pageIndex + 1} of ${totalPages} (Total student database records: ${dbUsers.length})`}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                      disabled={pageIndex === 0}
                      className="cursor-pointer bg-slate-950 border border-slate-855 px-2.5 py-1 rounded-lg hover:bg-slate-900 transition disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4 shrink-0 inline-block" />
                      <span>{lang === "ar" ? "الصفحة السابقة" : "Prev"}</span>
                    </button>
                    <button
                      onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))}
                      disabled={pageIndex >= totalPages - 1}
                      className="cursor-pointer bg-slate-950 border border-slate-855 px-2.5 py-1 rounded-lg hover:bg-slate-900 transition disabled:opacity-40"
                    >
                      <span>{lang === "ar" ? "الصفحة التالية" : "Next"}</span>
                      <ChevronLeft className="w-4 h-4 shrink-0 inline-block" />
                    </button>
                  </div>
                </div>

                {/* Caching terminal scroll log */}
                <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider font-mono">redis_server_stdout.logs</span>
                  <div className="max-h-32 overflow-y-auto pt-2 space-y-1 text-[10.5px] font-mono text-slate-400" dir="ltr">
                    {cacheLogs.length === 0 ? (
                      <span className="text-slate-650 block">[No caching log sequences. Interact with Student fetchers above]</span>
                    ) : (
                      cacheLogs.map((log, idx) => (
                        <div key={idx} className="border-b border-slate-900/60 pb-1 text-left">{log}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              TAB 4: EMAIL NOTIFICATIONS & BROWSER ALERT TEMPLATES
              ====================================================== */}
          {activeTab === "notif" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Nodemailer mail composer panel */}
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2.5">
                    <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      <span>{lang === "ar" ? "محاكي إرسال بريد Nodemailer الأكاديمي المدمج" : "Nodemailer SMTP Transaction Panel"}</span>
                    </h3>
                    <p className="text-[11px] text-slate-450 mt-1">
                      {lang === "ar"
                        ? "اختر قالب البريد وتعديله لبث تنبيهات حقيقية للمستخدمين فورا"
                        : "Select and dispatch high-fidelity HTML notification templates via direct SMTP gateways:"}
                    </p>
                  </div>

                  <form onSubmit={handleSendNodemailerSim} className="space-y-3.5 text-xs text-right">
                    
                    {/* Template selection */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "grade_alert", ar: "إشعار درجة", en: "Grade Alert" },
                        { id: "tuition_invoice", ar: "فاتورة سداد", en: "Tuition Bill" },
                        { id: "auth_verification", ar: "أمان الحساب", en: "MFA Token" }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEmailTemplate(item.id as any)}
                          className={`cursor-pointer px-2 py-1.5 rounded-lg border text-[11px] font-bold text-center transition ${
                            emailTemplate === item.id 
                              ? "bg-emerald-580/10 text-emerald-400 border-emerald-500/30" 
                              : "bg-slate-950 text-slate-450 border-slate-900"
                          }`}
                        >
                          {lang === "ar" ? item.ar : item.en}
                        </button>
                      ))}
                    </div>

                    {/* Email target output */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 block font-bold">{lang === "ar" ? "البريد الإلكتروني للوجة:" : "Target Recipient (User email):"}</label>
                      <input
                        type="email"
                        required
                        value={emailTarget}
                        onChange={(e) => setEmailTarget(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-xl text-left font-mono outline-none text-slate-200"
                        dir="ltr"
                      />
                    </div>

                    {/* Subject line */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 block font-bold">{lang === "ar" ? "مكون سطر العنوان (Subject):" : "SMTP Subject Header:"}</label>
                      <input
                        type="text"
                        required
                        value={emailSubjectInput}
                        onChange={(e) => setEmailSubjectInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-xl text-slate-200 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-slate-950 w-full py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{lang === "ar" ? "📧 بث وإرسال إشعار SMTP الآمن" : "📧 Dispatch Secure SMTP Mail via Nodemailer"}</span>
                    </button>
                  </form>
                </div>

                {/* Custom Browser alerts & Service Worker simulation */}
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-5 space-y-4">
                  <div className="border-b border-slate-900 pb-2.5">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-end">
                      {lang === "ar" ? "أمان تنبيهات المتصفح وإشعار سطح المكتب" : "Web API Browser Desktop Notifications controller"}
                      <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {lang === "ar"
                        ? "تمكن هذه اللوحة من اختبار استئذان المتصفح لبث النوافذ الساقطة مباشرة على شاشة العميل:"
                        : "Enables direct browser interface mapping to request capabilities and schedule popups across the desktop client."}
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl space-y-2">
                      <span className="text-[10px] text-emerald-450 block font-bold font-mono">browser_permissions_state: ALLOWED</span>
                      <p className="text-xs text-slate-400 leading-relaxed text-right">
                        {lang === "ar"
                          ? "تنبيهات المتصفح تضمن استلام الإعلانات والتنبيهات حتى في حال إغلاق التبويب الحالي بفعل المزامنة مع Service Worker المعتمد."
                          : "Synchronous updates propagate immediately even if you exit the portal tab, utilizing persistent background Web Workers."}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={triggerBrowserNativePush}
                        className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 p-3 rounded-xl text-xs font-bold transition flex-1 flex items-center justify-center gap-1.5"
                      >
                        <Bell className="w-4 h-4 text-yellow-400" />
                        <span>{lang === "ar" ? "تنبيه متصفح مباشر" : "Trigger Native Notification"}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Nodemailer mailer server log */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider font-mono text-left" dir="ltr">nodemailer_mailbox_transaction.log</span>
                <div className="max-h-36 overflow-y-auto pt-2 space-y-1 text-[10.5px] font-mono text-slate-450" dir="ltr">
                  {emailLogs.length === 0 ? (
                    <span className="text-slate-655 block">[No active SMTP transactions in this session. Trigger mail sender above]</span>
                  ) : (
                    emailLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-slate-900/60 pb-1 text-left">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              TAB 5: MANUAL AND AUTOMATIC DATABASE BACKUPS
              ====================================================== */}
          {activeTab === "backup" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* On-Demand Backup Snapshot configuration */}
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2.5">
                    <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                      <HardDriveUpload className="w-4 h-4 text-emerald-400" />
                      <span>{lang === "ar" ? "جدولة النسخ الاحتياطي التلقائي (Automated Snapshots)" : "Automated Database Snapshots & Schemas"}</span>
                    </h3>
                    <p className="text-[11px] text-slate-450 mt-1">
                      {lang === "ar"
                        ? "تحتوي هذه اللوحة على التنبؤ وجدولة مهام النسخ الاحتياطي لـ Cloud SQL و Firestore بالجامعة:"
                        : "Schedules binary replication exports for Postgres and NoSQL documents seamlessly across storage buckets:"}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-xs">
                    <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg">
                      <span className="font-mono text-emerald-450 font-bold">{backupSchedule}</span>
                      <span className="text-slate-500 font-semibold">{lang === "ar" ? "الجدولة المسجلة (Cron Expression):" : "Active Backup Schedule:"}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-550 block font-bold">{lang === "ar" ? "توليد نسخة احتياطية فورية على Сloud Storage:" : "Write manual live database backup inside storage blocks:"}</span>
                      
                      {isBackingUp ? (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                            <span>{backupProgress}%</span>
                            <span>WRITING BINARY SQL REPLICATION BLOCK...</span>
                          </div>
                          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                            <div className="h-full bg-emerald-500" style={{ width: `${backupProgress}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={runOnDemandBackup}
                          className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-2.5 rounded-xl font-black transition text-center"
                        >
                          {lang === "ar" ? "💾 بدء فحص وتصوير وتأمين القواعد الآن" : "💾 Build and Write On-Demand Snapshot Now"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Utilities: Data exports and CSV import panel */}
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-5 space-y-4 text-xs">
                  <div className="border-b border-slate-900 pb-2.5">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-end">
                      {lang === "ar" ? "أدوات التصدير والاستيراد الهجين للجامعة" : "Database CSV / JSON Replicator & Importer"}
                      <Download className="w-4 h-4 text-indigo-400" />
                    </h3>
                  </div>

                  <div className="space-y-3 text-right">
                    <div className="space-y-2">
                      <span className="text-slate-450 font-bold block">{lang === "ar" ? "تصدير فوري لقائمة الطلاب المفلترة:" : "Export filtered list to standard JSON format:"}</span>
                      <button
                        onClick={handleExportStudentsJSON}
                        className="cursor-pointer w-full bg-slate-900 border border-slate-800 hover:border-slate-705 p-2 rounded-xl font-medium text-slate-200 transition flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4 text-indigo-400" />
                        <span>{lang === "ar" ? "تحميل كشوف الطلاب بصيغة (.JSON)" : "Download SGU Database to (.JSON)"}</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-450 block font-bold">{lang === "ar" ? "استيراد ودمج سجلات CSV عشوائية (معرّف,الاسم,البريد,الوظيفة,الأجر):" : "Insert CSV row metadata directly (ID, Name, Email, Role, Ratio):"}</label>
                      <textarea
                        rows={2}
                        value={csvPasteInput}
                        onChange={(e) => setCsvPasteInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-2 font-mono text-[11px] rounded-xl text-left text-slate-300 outline-none focus:border-indigo-500"
                        dir="ltr"
                      />
                      <button
                        onClick={handleImportCSVData}
                        className="cursor-pointer w-full bg-indigo-650 hover:bg-indigo-600 font-sans hover:bg-opacity-90 text-white font-extrabold py-2 rounded-xl transition"
                      >
                        {lang === "ar" ? "📥 دمج ورفع صفوف القائمة المدخلة" : "📥 Validate & Merge CSV Items to DB"}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Backups log files registry list */}
              <div className="border-t border-slate-800/80 pt-6">
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                    <HardDriveUpload className="w-4 h-4 text-emerald-400" />
                    <span>{lang === "ar" ? "سجل كشاف لقطات قواعد البيانات المخزنة" : "Stored Backup Logs Inventory"}</span>
                  </h4>
                </div>

                <div className="overflow-x-auto border border-slate-850 rounded-xl">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-855">
                        <th className="p-3">ID</th>
                        <th className="p-3">{lang === "ar" ? "اسم الملف التراكمي" : "Filename"}</th>
                        <th className="p-3">{lang === "ar" ? "حجم اللقطة" : "Size"}</th>
                        <th className="p-3">{lang === "ar" ? "المولد والموثق" : "Generator"}</th>
                        <th className="p-3">{lang === "ar" ? "التاريخ والجدولة" : "Triggered At"}</th>
                        <th className="p-3">{lang === "ar" ? "الوضعية الأمنية" : "Status"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-900 text-slate-300 font-mono text-[11px]">
                      {backupLogsList.map((log) => (
                        <tr key={log.id}>
                          <td className="p-3 font-bold text-slate-205">{log.id}</td>
                          <td className="p-3 font-sans font-bold text-emerald-450 truncate max-w-xs text-left" dir="ltr">{log.file}</td>
                          <td className="p-3 text-slate-100 font-black">{log.size} MB</td>
                          <td className="p-3 font-sans text-slate-350">{log.triggeredBy}</td>
                          <td className="p-3 text-slate-400">{log.date}</td>
                          <td className="p-3">
                            <span className="bg-emerald-950/10 text-emerald-400 border border-emerald-510/20 px-2 py-0.5 rounded font-sans font-bold text-[9.5px]">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "supabase" && (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 p-5 rounded-xl border border-slate-850">
                <div>
                  <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5 font-sans">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>{lang === "ar" ? "ربط بوابات SGU بـ Supabase REST API مباشرة" : "SGU Live Supabase REST API Bridge"}</span>
                  </h3>
                  <p className="text-[11px] text-slate-450 mt-1 max-w-2xl leading-relaxed">
                    {lang === "ar"
                      ? "يتيح لك هذا القسم سحب وإدراج وتوطين بيانات الطلاب حقيقياً من وبداخل قاعدة بيانات Supabase الخارجية بالـ REST API فورياً ومباشرة."
                      : "Direct real-time endpoint manipulation for student records, attendance, and remote table mutations via safe TLS/HTTPS requests."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition ${
                    sbStatus === "connected"
                      ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20"
                      : sbStatus === "connecting"
                      ? "bg-amber-950/20 text-amber-500 border-amber-500/20 animate-pulse"
                      : sbStatus === "unauthorized"
                      ? "bg-rose-950/20 text-rose-400 border-rose-500/20"
                      : "bg-slate-900 text-slate-500 border-slate-850"
                  }`}>
                    {sbStatus === "connected" ? "✓ LIVE CONNECTED" : sbStatus === "connecting" ? "◌ SYNCING..." : sbStatus === "unauthorized" ? "⚠ UNAUTHORIZED" : "● STANDBY"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Credentials & Connection */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Lock className="w-3.5 h-3.5 text-emerald-450 inline" />
                    <span>{lang === "ar" ? "إعدادات الاتصال الآمن وقناة REST" : "Secure REST Connection Parameters"}</span>
                  </h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 block font-bold">{lang === "ar" ? "رابط الـ REST API لـ Supabase الحقيقي:" : "Supabase REST API Base URL:"}</label>
                      <input
                        type="text"
                        value={sbUrl}
                        onChange={(e) => {
                          setSbUrl(e.target.value);
                          localStorage.setItem("sgu_sb_url", e.target.value);
                        }}
                        placeholder="https://YOUR_PROJECT.supabase.co/rest/v1/"
                        className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-left outline-none font-mono focus:border-emerald-500 text-slate-200"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 block font-bold flex justify-between">
                        <span>{lang === "ar" ? "مفتاح API الخاص بـ Supabase (Anon Key / Service):" : "Supabase Anon Key:"}</span>
                        <span className="text-[10px] text-emerald-500 font-mono">Recommended</span>
                      </label>
                      <input
                        type="password"
                        value={sbAnonKey}
                        onChange={(e) => {
                          setSbAnonKey(e.target.value);
                          localStorage.setItem("sgu_sb_anon_key", e.target.value);
                        }}
                        placeholder="eyJhbGciOi..."
                        className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-left outline-none font-mono focus:border-emerald-500 text-slate-200"
                        dir="ltr"
                      />
                      <p className="text-[10px] text-slate-550 leading-relaxed font-sans">
                        {lang === "ar"
                          ? "💡 يتم حفظ المفتاح بأمان وسرية تامة داخل متصفحك لإجراء الاتصالات مع Supabase مباشرة."
                          : "💡 API key is stored securely in your local browser sandbox to enable direct secure query authorizations."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-slate-400 block font-bold font-sans">{lang === "ar" ? "الجدول المستهدف:" : "Target Table:"}</label>
                        <select
                          value={sbSelectedTable}
                          onChange={(e) => setSbSelectedTable(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-left outline-none font-sans focus:border-emerald-500 text-slate-200"
                        >
                          <option value="students">students</option>
                          <option value="attendance">attendance</option>
                          <option value="sgu_users">sgu_users</option>
                          <option value="sgu_attendance">sgu_attendance</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={testSbConnection}
                          disabled={sbLoading}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${sbLoading ? "animate-spin" : ""}`} />
                          <span>{lang === "ar" ? "اتصال وجلب" : "Test & Get Data"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Logger Console */}
                  <div className="space-y-1.5 mt-4">
                    <div className="flex justify-between items-center text-[10px] text-slate-450">
                      <span className="font-bold">{lang === "ar" ? "لوحة تبادل البيانات الحية (Console):" : "Realtime API Exchange Console:"}</span>
                      <button onClick={() => setSbLogs([])} className="text-rose-450 hover:underline cursor-pointer">{lang === "ar" ? "مسح السجل" : "Clear"}</button>
                    </div>
                    <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[9.5px] text-emerald-450 space-y-1 text-left" dir="ltr">
                      {sbLogs.length === 0 ? (
                        <p className="text-slate-600 italic">{lang === "ar" ? "[بانتظار حركة البيانات والاتصال...]" : "[Idle. Awaiting secure REST API interactions...]"}</p>
                      ) : (
                        sbLogs.map((log, i) => <div key={i}>{log}</div>)
                      )}
                    </div>
                  </div>
                </div>

                {/* Insertion & Operations */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Plus className="w-3.5 h-3.5 text-emerald-455 inline" />
                    <span>{lang === "ar" ? "إدراج سجل طالب جديد لـ Supabase" : "Add Student to Supabase Tab"}</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-405 block font-bold">{lang === "ar" ? "كود الطالب (اختياري):" : "Custom ID (Optional):"}</label>
                        <input
                          type="text"
                          value={sbNewId}
                          onChange={(e) => setSbNewId(e.target.value)}
                          placeholder="SGU-2901"
                          className="w-full bg-slate-900 border border-slate-850 p-2 rounded-xl text-left outline-none font-mono focus:border-emerald-500 text-slate-200"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-405 block font-bold">{lang === "ar" ? "البريد الإلكتروني للكلية:" : "Academic Email:"}</label>
                        <input
                          type="email"
                          value={sbNewEmail}
                          onChange={(e) => setSbNewEmail(e.target.value)}
                          placeholder="std_name@sgu.edu.eg"
                          className="w-full bg-slate-900 border border-slate-850 p-2 rounded-xl text-left outline-none font-mono focus:border-emerald-500 text-slate-200"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-405 block font-bold">{lang === "ar" ? "الاسم الكامل (عربي):" : "Full Name (Arabic):"}</label>
                        <input
                          type="text"
                          value={sbNewNameAr}
                          onChange={(e) => setSbNewNameAr(e.target.value)}
                          placeholder="عمرو دياب المنصوري"
                          className="w-full bg-slate-900 border border-slate-855 p-2 rounded-xl text-right outline-none font-sans focus:border-emerald-500 text-slate-250"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-405 block font-bold">{lang === "ar" ? "الاسم الكامل (إنجليزي):" : "Full Name (English):"}</label>
                        <input
                          type="text"
                          value={sbNewNameEn}
                          onChange={(e) => setSbNewNameEn(e.target.value)}
                          placeholder="Amr Diab El-Mansouri"
                          className="w-full bg-slate-900 border border-slate-855 p-2 rounded-xl text-left outline-none font-sans focus:border-emerald-500 text-slate-250"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-405 block font-bold">{lang === "ar" ? "كلية الانتماء:" : "College Department:"}</label>
                        <select
                          value={sbNewCollege}
                          onChange={(e) => setSbNewCollege(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 p-2 rounded-xl text-left outline-none font-sans focus:border-emerald-500 text-slate-200"
                        >
                          <option value="fcis">Computer & Info Sciences</option>
                          <option value="med">Medicine & Surgery</option>
                          <option value="phr">Pharmacy</option>
                          <option value="bus">Business Administration</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-405 block font-bold">{lang === "ar" ? "المعدل التراكمي GPA:" : "GPA Cumulative:"}</label>
                        <input
                          type="text"
                          value={sbNewGpa}
                          onChange={(e) => setSbNewGpa(e.target.value)}
                          placeholder="3.85"
                          className="w-full bg-slate-900 border border-slate-850 p-2 rounded-xl text-left outline-none font-mono focus:border-emerald-500 text-slate-200"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        onClick={insertSbRow}
                        disabled={sbLoading}
                        className="flex-1 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{lang === "ar" ? "إدراج بالـ Supabase" : "Post to Supabase"}</span>
                      </button>

                      <button
                        onClick={syncToLocalERP}
                        disabled={sbRows.length === 0}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/10"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>{lang === "ar" ? "تصدير السجلات لنظام الـ ERP" : "Pull & Sync to ERP"}</span>
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-slate-500 leading-normal text-center mt-1 font-sans">
                      {lang === "ar"
                        ? "⚡ خيار المزامنة يدمج السجلات المأخوذة فورياً بالصفحة والجدول الحالي لنطاق الـ ERP بالجامعة."
                        : "⚡ Syncing maps remote Supabase records straight onto SGU core local state and layout views."}
                    </p>
                  </div>
                </div>

              </div>

              {/* Retrieved Data Table View */}
              <div className="border-t border-slate-800/80 pt-6 space-y-4 font-sans">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-emerald-450" />
                    <span>{lang === "ar" ? "مستعرض وجدول السجلات للمعاينة والتفاعل" : "Supabase Live Dataset Preview"}</span>
                  </h4>
                  <div className="bg-slate-950 px-2.5 py-1 rounded text-[10px] font-mono text-slate-450 border border-slate-850">
                    {lang === "ar" ? `إجمالي السطور المستردة: ${sbRows.length}` : `Result Count: ${sbRows.length}`}
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-850 rounded-xl">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-855">
                        <th className="p-3">ID</th>
                        <th className="p-3">{lang === "ar" ? "الاسم" : "Name"}</th>
                        <th className="p-3">{lang === "ar" ? "الكلية" : "College"}</th>
                        <th className="p-3">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</th>
                        <th className="p-3">{lang === "ar" ? "المعدل / GPA" : "GPA / Salary"}</th>
                        <th className="p-3 text-center">{lang === "ar" ? "إجراءات الحذف" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-900 text-slate-300 font-mono text-[11px]">
                      {sbRows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 italic font-sans text-xs">
                            {lang === "ar"
                              ? "⚠️ لا يوجد سجلات مستدعاة حالياً. الرجاء كتابة مفتاح الـ API والضغط على مفتاح 'اتصال وجلب' بالأعلى لبدء القراءة."
                              : "⚠️ No available Supabase records. Click 'Test & Get Data' to run active queries."}
                          </td>
                        </tr>
                      ) : (
                        sbRows.map((row, idx) => (
                          <tr key={row.id || idx}>
                            <td className="p-3 font-bold text-slate-200">{row.id || `idx_${idx}`}</td>
                            <td className="p-3 font-sans font-bold text-emerald-455">
                              {lang === "ar" ? (row.nameAr || row.name || "أكاديمي مزامن") : (row.nameEn || row.name || "Academic Sync")}
                            </td>
                            <td className="p-3 text-slate-400 font-sans text-[11px]">{row.collegeId || row.college_id || "FCIS"}</td>
                            <td className="p-3 text-slate-350 text-[11px] truncate max-w-[150px]">{row.email || row.email_address || "std@sgu.edu.eg"}</td>
                            <td className="p-3 text-slate-100 font-black">{row.gpaOrSalary || row.gpa || "-"}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => deleteSbRow(row.id)}
                                className="bg-rose-950/20 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-slate-950 px-2 py-1 rounded text-[10px] font-sans font-bold cursor-pointer transition inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{lang === "ar" ? "حذف السجل" : "Delete"}</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* SGU Pagination Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-850 text-xs font-sans">
                  <div className="text-slate-455 flex flex-wrap items-center gap-1 leading-relaxed">
                    <span>{lang === "ar" ? "عرض السطور:" : "Showing rows:"}</span>
                    <span className="font-mono text-emerald-400 font-extrabold">{((sbPage - 1) * 50 + 1).toLocaleString()}</span>
                    <span>-</span>
                    <span className="font-mono text-emerald-400 font-extrabold">{Math.min(sbPage * 50, sbTotalCount).toLocaleString()}</span>
                    <span>{lang === "ar" ? "من إجمالي" : "of"}</span>
                    <span className="font-mono text-slate-250 font-bold bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">{sbTotalCount.toLocaleString()}</span>
                    <span>{lang === "ar" ? "طالب نشط بالجامعة (مقسمة 50 لكل دفعة)" : "active students (paginated 50 per batch)"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadSbRows(1)}
                      disabled={sbPage <= 1 || sbLoading}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-850 hover:border-emerald-500/50 text-slate-300 disabled:opacity-40 transition cursor-pointer font-bold"
                      title={lang === "ar" ? "الصفحة الأولى" : "First Page"}
                    >
                      &lt;&lt;
                    </button>
                    <button
                      onClick={() => loadSbRows(sbPage - 1)}
                      disabled={sbPage <= 1 || sbLoading}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 hover:border-emerald-500/50 text-slate-300 disabled:opacity-40 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{lang === "ar" ? "السابق" : "Prev"}</span>
                    </button>

                    <div className="bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-lg text-slate-200 font-mono flex items-center gap-1.5">
                      <span>{lang === "ar" ? "صفحة" : "Page"}</span>
                      <input
                        type="number"
                        min={1}
                        max={Math.ceil(sbTotalCount / 50)}
                        value={sbPage}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val >= 1 && val <= Math.ceil(sbTotalCount / 50)) {
                            loadSbRows(val);
                          }
                        }}
                        className="w-14 bg-slate-950 border border-slate-800 text-center rounded text-emerald-400 font-bold text-xs outline-none focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-slate-500 font-sans">/</span>
                      <span className="text-slate-400 font-bold">{Math.max(1, Math.ceil(sbTotalCount / 50)).toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => loadSbRows(sbPage + 1)}
                      disabled={sbPage >= Math.ceil(sbTotalCount / 50) || sbLoading}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 hover:border-emerald-500/50 text-slate-300 disabled:opacity-40 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    >
                      <span>{lang === "ar" ? "التالي" : "Next"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => loadSbRows(Math.ceil(sbTotalCount / 50))}
                      disabled={sbPage >= Math.ceil(sbTotalCount / 50) || sbLoading}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-850 hover:border-emerald-500/50 text-slate-300 disabled:opacity-40 transition cursor-pointer font-bold"
                      title={lang === "ar" ? "الصفحة الأخيرة" : "Last Page"}
                    >
                      &gt;&gt;
                    </button>
                  </div>
                </div>

                {/* Developer Integration Code Help Tab */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4 mt-6">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider font-sans">
                        {lang === "ar" ? "كود التوطين والاستعلام بالـ Prisma والـ Supabase Client" : "Prisma & Supabase Client Paginated Endpoint Code"}
                      </h4>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase">
                      100k Rows Performance Tuning
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs text-left" dir="ltr">
                    
                    {/* Method A: Prisma Backend Query */}
                    <div className="bg-slate-900 border border-slate-855 rounded-xl p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-emerald-400 font-mono">1. Prisma ORM Backend (Next.js/Express)</span>
                        <span className="text-[10px] text-slate-500 font-sans">High Performance skip & take</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[10px] text-emerald-300/90 overflow-x-auto space-y-1 max-h-72">
                        <span className="text-slate-550">// api/students/route.ts</span>
                        <p className="text-slate-400"><span className="text-pink-400">import</span> &#123; PrismaClient &#125; <span className="text-pink-400">from</span> <span className="text-emerald-500">"@prisma/client"</span>;</p>
                        <p className="text-slate-405"><span className="text-pink-400">const</span> prisma = <span className="text-pink-400">new</span> <span className="text-blue-400">PrismaClient</span>();</p>
                        <br />
                        <p className="text-slate-400"><span className="text-pink-400">export async function</span> <span className="text-amber-400">GET</span>(req: Request) &#123;</p>
                        <p className="pl-4 text-slate-400">  <span className="text-pink-400">const</span> &#123; searchParams &#125; = <span className="text-pink-400">new</span> <span className="text-blue-400">URL</span>(req.url);</p>
                        <p className="pl-4 text-slate-400">  <span className="text-pink-400">const</span> page = <span className="text-blue-400">parseInt</span>(searchParams.get(<span className="text-emerald-500">"page"</span>) || <span className="text-emerald-500">"1"</span>);</p>
                        <p className="pl-4 text-slate-400">  <span className="text-pink-400">const</span> limit = 50;</p>
                        <p className="pl-4 text-slate-400">  <span className="text-pink-400">const</span> skip = (page - 1) * limit;</p>
                        <br />
                        <p className="pl-4 text-slate-650">  // Run concurrent queries to prevent API latency locks</p>
                        <p className="pl-4 text-slate-450">  <span className="text-pink-400">const</span> [students, total] = <span className="text-pink-400">await</span> prisma.<span className="text-amber-400">$transaction</span>([</p>
                        <p className="pl-8 text-slate-400">    prisma.student.<span className="text-amber-400">findMany</span>(&#123;</p>
                        <p className="pl-12 text-slate-400">      skip,</p>
                        <p className="pl-12 text-slate-400">      take: limit,</p>
                        <p className="pl-12 text-slate-400">      orderBy: &#123; id: <span className="text-emerald-500">"asc"</span> &#125;</p>
                        <p className="pl-8 text-slate-400">    &#125;),</p>
                        <p className="pl-8 text-slate-400">    prisma.student.<span className="text-amber-400">count</span>()</p>
                        <p className="pl-4 text-slate-400">  ]);</p>
                        <br />
                        <p className="pl-4 text-rose-405">  <span className="text-pink-400">return</span> Response.<span className="text-amber-400">json</span>(&#123;</p>
                        <p className="pl-8 text-slate-400">    students,</p>
                        <p className="pl-8 text-slate-400">    totalCount: total,</p>
                        <p className="pl-8 text-slate-400">    totalPages: Math.ceil(total / limit),</p>
                        <p className="pl-8 text-slate-400">    currentPage: page</p>
                        <p className="pl-4 text-slate-405">  &#125;);</p>
                        <p className="text-slate-400">&#125;</p>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                        {lang === "ar"
                          ? "💡 ميزة $transaction تضمن لك جلب الـ 50 سطر المطلوبين والعد الإجمالي في آن واحد لمنع البطء والـ Database Latency تماماً."
                          : "💡 Fast parallel transaction prevents DB freezing when querying 100,000+ records simultaneously."}
                      </p>
                    </div>

                    {/* Method B: Supabase Client SDK integration */}
                    <div className="bg-slate-900 border border-slate-855 rounded-xl p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-amber-400 font-mono">2. Supabase Client SDK (React Dashboard)</span>
                        <span className="text-[10px] text-slate-500 font-sans">High Performance range queries</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[10px] text-emerald-300/90 overflow-x-auto space-y-1 max-h-72">
                        <span className="text-slate-550">// hook / fetcher inside React component</span>
                        <p className="text-slate-400"><span className="text-pink-400">import</span> &#123; supabase &#125; <span className="text-pink-400">from</span> <span className="text-emerald-500">"../utils/supabaseClient"</span>;</p>
                        <br />
                        <p className="text-slate-400"><span className="text-pink-400">const</span> loadStudents = <span className="text-pink-400">async</span> (pageNo = 1) =&gt; &#123;</p>
                        <p className="pl-4 text-slate-400">  <span className="text-pink-400">const</span> limit = 50;</p>
                        <p className="pl-4 text-slate-400">  <span className="text-pink-400">const</span> from = (pageNo - 1) * limit;</p>
                        <p className="pl-4 text-slate-400">  <span className="text-pink-400">const</span> to = from + limit - 1;</p>
                        <br />
                        <p className="pl-4 text-slate-650">  // Fetch live dataset with exact count headers in 1 hit</p>
                        <p className="pl-4 text-slate-405">  <span className="text-pink-400">const</span> &#123; data, count, error &#125; = <span className="text-pink-400">await</span> supabase</p>
                        <p className="pl-8 text-slate-400">    .<span className="text-amber-400">from</span>(<span className="text-emerald-500">"students"</span>)</p>
                        <p className="pl-8 text-slate-400">    .<span className="text-amber-400">select</span>(<span className="text-emerald-500">"*"</span>, &#123; count: <span className="text-emerald-500">"exact"</span> &#125;)</p>
                        <p className="pl-8 text-slate-400">    .<span className="text-amber-400">order</span>(<span className="text-emerald-500">"id"</span>, &#123; ascending: <span className="text-pink-400">true</span> &#125;)</p>
                        <p className="pl-8 text-slate-400">    .<span className="text-amber-400">range</span>(from, to);</p>
                        <br />
                        <p className="pl-4 text-rose-405">  <span className="text-pink-400">if</span> (error) <span className="text-amber-400">console</span>.<span className="text-amber-400">error</span>(error.message);</p>
                        <p className="pl-4 text-rose-405">  <span className="text-pink-400">else</span> &#123;</p>
                        <p className="pl-8 text-slate-400">    setStudents(data);</p>
                        <p className="pl-8 text-slate-400">    setTotalCount(count || 100000);</p>
                        <p className="pl-4 text-slate-405">  &#125;</p>
                        <p className="text-slate-400">&#125;;</p>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                        {lang === "ar"
                          ? "💡 دالة .range() في عميل Supabase تقوم بإرسال ترويسة المدى الآمنة (Range Headers) لتجلب المندوب بدقة متناهية دون استهلاك باقة خادمك السحابي."
                          : "💡 The .range() call generates optimized low-bandwidth TLS headers directly requesting indices from PostgREST."}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
