import { createClient } from "@supabase/supabase-js";

// دالة مساعدة لتنظيف رابط Supabase وإزالة أي لاحقة /rest/v1 زائدة قد تسبب أخطاء في مكتبة العميل
const cleanSupabaseUrl = (url: string): string => {
  if (!url) return "";
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
};

// 1. رابط السيرفر السحابي لـ Supabase المأخوذ من البيئة أو الذاكرة المحلية
const supabaseUrl = 
  (typeof window !== "undefined" && localStorage.getItem("sgu_sb_url")) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) || 
  "https://loiicsmazydsbgglhksa.supabase.co";

// 2. المفتاح العام (Anon Key) لـ Supabase المأخوذ من البيئة أو الذاكرة المحلية
const supabaseKey = 
  (typeof window !== "undefined" && localStorage.getItem("sgu_sb_anon_key")) || 
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaWljc21henlkc2JnZ2xoa3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTM3MjgsImV4cCI6MjA5NzcyOTcyOH0.Y8IEHt82aEpR7cT7pXpIfHxp-QY8Te91h5ifv_FNCio";

/**
 * تهيئة العميل للربط الحقيقي بـ Supabase فوراً وبشكل آمن
 */
export const supabase = createClient(cleanSupabaseUrl(supabaseUrl), supabaseKey);

/**
 * دالة مساعدة لتحديث اتصال Supabase ديناميكياً عند حفظ الإعدادات من واجهة المستخدم
 */
export function getUpdatedSupabaseClient(customUrl?: string, customKey?: string) {
  const url = customUrl || localStorage.getItem("sgu_sb_url") || supabaseUrl;
  const key = customKey || localStorage.getItem("sgu_sb_anon_key") || supabaseKey;
  return createClient(cleanSupabaseUrl(url), key);
}

/**
 * دالة جلب بيانات الطالب بناءً على بريده الإلكتروني الموثق من Firebase Auth ومطابقته رقمياً
 */
export async function fetchStudentByEmail(email: string) {
  return await supabase
    .from("students")
    .select("*")
    .eq("email", email);
}

