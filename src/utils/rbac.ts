/**
 * SGU ERP ROLE-BASED ACCESS CONTROL (RBAC) SECURITY ENGINE
 * إدارة الهوية والتحقق وصلاحيات المستخدمين والتدقيق الأمني
 */

export type SguRoleType =
  | "Student"
  | "Professor"
  | "Teaching Assistant"
  | "Academic Advisor"
  | "Head of Department"
  | "Dean"
  | "Finance Employee"
  | "Library Employee"
  | "Admin"
  | "Super Admin";

export type SguPermission =
  | "view_personal_grades"
  | "edit_grades"
  | "manage_users"
  | "view_advising"
  | "edit_advising"
  | "add_drop_courses"
  | "manage_courses_depts"
  | "manage_finance"
  | "manage_library"
  | "generate_reports"
  | "create_lecture_qr"
  | "submit_attendance"
  | "view_attendance_reports"
  | "manage_rbac_roles"
  | "bypass_security";

export interface SguRoleMetadata {
  id: SguRoleType;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  permissions: SguPermission[];
  color: string; // Tailwind class
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: SguRoleType;
  action: "LOGIN" | "LOGOUT" | "UNAUTHORIZED_ATTEMPT" | "ROLE_UPDATE" | "GRADE_CHANGE" | "COURSE_REGISTRATION" | "ATTENDANCE_SUBMIT";
  detailsAr: string;
  detailsEn: string;
  ipAddress: string;
  status: "SUCCESS" | "FAILED" | "BLOCKED";
}

// 1. Definition of Roles and their precise Permissions (الحدود والصلاحيات الأمنية لكل دور)
export const SGU_RBAC_ROLES: SguRoleMetadata[] = [
  {
    id: "Student",
    nameAr: "طالب مقيد",
    nameEn: "Enrolled Student",
    descriptionAr: "الوصول للملف الأكاديمي، تسجيل المقررات، الحضور بالـ QR، واستعارة الكتب.",
    descriptionEn: "Access academic profile, course registration, QR attendance, and library borrowing.",
    permissions: ["view_personal_grades", "add_drop_courses", "submit_attendance"],
    color: "from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30"
  },
  {
    id: "Professor",
    nameAr: "أستاذ مادة",
    nameEn: "Professor",
    descriptionAr: "إدخال وتعديل درجات المقررات، تسجيل الحضور عبر QR، ومتابعة الإرشاد الأكاديمي.",
    descriptionEn: "Grade entry, lecture attendance QR generation, and academic advising.",
    permissions: ["edit_grades", "view_advising", "create_lecture_qr", "view_attendance_reports"],
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30"
  },
  {
    id: "Teaching Assistant",
    nameAr: "معيد بالكلية",
    nameEn: "Teaching Assistant",
    descriptionAr: "متابعة الحضور والغياب للسكاشن وتوليد رموز QR للمجموعات المسندة.",
    descriptionEn: "Track section attendance and generate QR codes for assigned student labs.",
    permissions: ["create_lecture_qr", "view_attendance_reports"],
    color: "from-sky-500/20 to-cyan-500/20 text-sky-300 border-sky-500/30"
  },
  {
    id: "Academic Advisor",
    nameAr: "مرشد أكاديمي",
    nameEn: "Academic Advisor",
    descriptionAr: "استعراض السجل الأكاديمي للطلاب، اقتراح الخطط الدراسية، والتحكم في Add/Drop.",
    descriptionEn: "Inspect student academic records, recommend course plans, and manage Add/Drop overrides.",
    permissions: ["view_advising", "edit_advising", "add_drop_courses"],
    color: "from-purple-500/20 to-fuchsia-500/20 text-purple-300 border-purple-500/30"
  },
  {
    id: "Head of Department",
    nameAr: "رئيس القسم الأكاديمي",
    nameEn: "Head of Department (HOD)",
    descriptionAr: "إدارة المقررات الدراسية والأقسام بالكلية، اعتماد الدرجات والنتائج، وتقارير القسم.",
    descriptionEn: "Manage courses and department schedules, approve results, and inspect quality reports.",
    permissions: ["edit_grades", "view_advising", "manage_courses_depts", "generate_reports", "view_attendance_reports"],
    color: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30"
  },
  {
    id: "Dean",
    nameAr: "عميد الكلية",
    nameEn: "College Dean",
    descriptionAr: "سلطة إشرافية كاملة على شؤون الكلية، اعتماد النتائج والتقارير الاستراتيجية والاعتماد.",
    descriptionEn: "Full oversight of the faculty, approval of academic outcomes, quality assurance, and accreditation reports.",
    permissions: ["edit_grades", "view_advising", "manage_courses_depts", "generate_reports", "view_attendance_reports"],
    color: "from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30"
  },
  {
    id: "Finance Employee",
    nameAr: "مسؤول الشؤون المالية",
    nameEn: "Finance Employee",
    descriptionAr: "إدارة إيصالات الرسوم الدراسية، فحص السداد الإلكتروني، وإعداد التقارير المالية.",
    descriptionEn: "Manage tuition invoices, audit digital payments, and prepare financial cashflow reports.",
    permissions: ["manage_finance", "generate_reports"],
    color: "from-lime-500/20 to-yellow-500/20 text-lime-300 border-lime-500/30"
  },
  {
    id: "Library Employee",
    nameAr: "أمين مكتبة الجامعة",
    nameEn: "Library Administrator",
    descriptionAr: "إدارة فهرس الكتب الرقمي، تسجيل الاستعارات الذكية وعمليات الإرجاع.",
    descriptionEn: "Manage digital books catalog, record loans, and handle book returns.",
    permissions: ["manage_library"],
    color: "from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30"
  },
  {
    id: "Admin",
    nameAr: "مدير النظام المركزي",
    nameEn: "System Administrator",
    descriptionAr: "الوصول الكامل لإدارة المستخدمين، البوابات، مراقبة قواعد البيانات وسجلات التدقيق.",
    descriptionEn: "Full access to user accounts, portals, system logs, database adapters, and auditing.",
    permissions: [
      "view_personal_grades",
      "edit_grades",
      "manage_users",
      "view_advising",
      "edit_advising",
      "add_drop_courses",
      "manage_courses_depts",
      "manage_finance",
      "manage_library",
      "generate_reports",
      "create_lecture_qr",
      "submit_attendance",
      "view_attendance_reports",
      "manage_rbac_roles"
    ],
    color: "from-slate-500/20 to-slate-700/20 text-slate-300 border-slate-500/30"
  },
  {
    id: "Super Admin",
    nameAr: "المدير الخارق للمنظومة",
    nameEn: "Super Administrator",
    descriptionAr: "كامل الصلاحيات الأمنية والتحكم في جدران الحماية، والنسخ الاحتياطي وتعديل أدوار الـ RBAC.",
    descriptionEn: "Absolute authority, firewall control, raw backups, bypass rules, and RBAC policy tuning.",
    permissions: [
      "view_personal_grades",
      "edit_grades",
      "manage_users",
      "view_advising",
      "edit_advising",
      "add_drop_courses",
      "manage_courses_depts",
      "manage_finance",
      "manage_library",
      "generate_reports",
      "create_lecture_qr",
      "submit_attendance",
      "view_attendance_reports",
      "manage_rbac_roles",
      "bypass_security"
    ],
    color: "from-red-500/20 to-rose-600/20 text-rose-200 border-red-500/40 animate-pulse"
  }
];

// Helper to get active user role configuration
export function getRoleMetadata(role: SguRoleType): SguRoleMetadata {
  return SGU_RBAC_ROLES.find((r) => r.id === role) || SGU_RBAC_ROLES[0];
}

// 2. Check Permissions (التحقق الآمن لمنع الدخول غير المصرح به)
export function hasPermission(role: SguRoleType, permission: SguPermission): boolean {
  const meta = getRoleMetadata(role);
  return meta.permissions.includes(permission) || meta.permissions.includes("bypass_security");
}

// 3. Persistent Security Audit Logging Engine
export const SguAuditLogger = {
  getLogs(): SecurityAuditLog[] {
    const saved = localStorage.getItem("sgu_security_audit_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    
    // Seed initial high quality logs for display
    const seedLogs: SecurityAuditLog[] = [
      {
        id: "AUD-1012-PROD",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        userId: "2026SGU-EMP-0012",
        userName: "أ.د. يوسف خالد النجار",
        role: "Professor",
        action: "LOGIN",
        detailsAr: "تسجيل دخول آمن وتأكيد رمز التحقق المزدوج MFA من عنوان IP معتمد.",
        detailsEn: "Secure login completed and MFA code verified from registered IP address.",
        ipAddress: "197.34.120.12",
        status: "SUCCESS"
      },
      {
        id: "AUD-1013-PROD",
        timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        userId: "2026SGU-EMP-0012",
        userName: "أ.د. يوسف خالد النجار",
        role: "Professor",
        action: "GRADE_CHANGE",
        detailsAr: "تعديل درجات مقرر الذكاء الاصطناعي (FCIS-402) للطالب يوسف شريف الكردي.",
        detailsEn: "Modified grades for Artificial Intelligence (FCIS-402) for student Youssef El-Kurdi.",
        ipAddress: "197.34.120.12",
        status: "SUCCESS"
      },
      {
        id: "AUD-1014-PROD",
        timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(),
        userId: "2026SGU-ST-10045",
        userName: "يوسف شريف الكردي",
        role: "Student",
        action: "UNAUTHORIZED_ATTEMPT",
        detailsAr: "محاولة غير مصرح بها للوصول إلى لوحة الشؤون المالية وتعديل حالة إيصالات الدفع.",
        detailsEn: "Unauthorized attempt to access Finance Dashboard and modify payment invoices.",
        ipAddress: "102.43.18.254",
        status: "BLOCKED"
      },
      {
        id: "AUD-1015-PROD",
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        userId: "db_architect",
        userName: "مسؤول النظام الرئيسي",
        role: "Super Admin",
        action: "ROLE_UPDATE",
        detailsAr: "تحديث الصلاحيات الأمنية لمجموعة أدوار 'Academic Advisor' للعمل بالرقم الجامعي.",
        detailsEn: "Updated security permissions for role group 'Academic Advisor' to process university IDs.",
        ipAddress: "10.0.4.15",
        status: "SUCCESS"
      }
    ];
    localStorage.setItem("sgu_security_audit_logs", JSON.stringify(seedLogs));
    return seedLogs;
  },

  log(
    userId: string,
    userName: string,
    role: SguRoleType,
    action: SecurityAuditLog["action"],
    detailsAr: string,
    detailsEn: string,
    status: SecurityAuditLog["status"] = "SUCCESS"
  ): void {
    const logs = this.getLogs();
    const newLog: SecurityAuditLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}-PROD`,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      role,
      action,
      detailsAr,
      detailsEn,
      ipAddress: `197.34.${Math.floor(20 + Math.random() * 100)}.${Math.floor(10 + Math.random() * 200)}`,
      status
    };
    logs.unshift(newLog);
    // Keep last 150 records
    localStorage.setItem("sgu_security_audit_logs", JSON.stringify(logs.slice(0, 150)));
  },

  clearLogs(): void {
    localStorage.removeItem("sgu_security_audit_logs");
  }
};
