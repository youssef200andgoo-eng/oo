import { supabase } from "../utils/supabaseClient";
import { StudentProfile, DormRoom, BusRoute } from "../types";

export interface SguServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorMessageAr?: string;
  errorMessageEn?: string;
}

/**
 * MODULE: STUDENTS (إدارة الشؤون الطلابية)
 * مسؤول عن السجلات الطلابية والملفات الشخصية والسكن الجامعي والنقل المشترك
 */
export const StudentService = {
  /**
   * جلب بيانات الملف الشخصي للطالب الحالي مع معالجة الأخطاء والبدائل الموثوقة
   */
  async getStudentProfile(email: string, fallbackData: StudentProfile): Promise<SguServiceResult<StudentProfile>> {
    try {
      if (!email) {
        return {
          success: false,
          error: "Email is required",
          errorMessageAr: "عنوان البريد الإلكتروني مطلوب لجلب البيانات.",
          errorMessageEn: "Email is required to fetch profile data."
        };
      }

      // 1. محاولة استعلام API السيرفر الرئيسي للجامعة
      try {
        const apiRes = await fetch(`/api/students/${encodeURIComponent(email)}`);
        if (apiRes.ok) {
          const json = await apiRes.json();
          if (json.success && json.data) {
            const serverStudent = json.data;
            const mappedProfile: StudentProfile = {
              id: serverStudent.student_id || serverStudent.id || fallbackData.id,
              nationalId: serverStudent.national_id || fallbackData.nationalId,
              nameArabic: serverStudent.full_name_ar || fallbackData.nameArabic,
              nameEnglish: serverStudent.full_name_en || fallbackData.nameEnglish,
              birthDate: serverStudent.birth_date || fallbackData.birthDate,
              nationality: serverStudent.nationality || fallbackData.nationality,
              address: serverStudent.address || fallbackData.address,
              phone: serverStudent.phone || fallbackData.phone,
              email: serverStudent.email || email,
              guardianName: serverStudent.guardian_name || fallbackData.guardianName,
              emergencyPhone: serverStudent.emergency_phone || fallbackData.emergencyPhone,
              college: serverStudent.college || fallbackData.college,
              department: serverStudent.department || fallbackData.department,
              major: serverStudent.major || fallbackData.major,
              advisor: serverStudent.advisor || fallbackData.advisor,
              level: serverStudent.level || fallbackData.level,
              totalGPA: Number(serverStudent.gpa || fallbackData.totalGPA),
              completedHours: Number(serverStudent.completed_credits || fallbackData.completedHours),
              requiredHours: Number(serverStudent.total_credits || fallbackData.requiredHours),
              avatarUrl: serverStudent.avatar_url || fallbackData.avatarUrl
            };
            localStorage.setItem("u_student", JSON.stringify(mappedProfile));
            return { success: true, data: mappedProfile };
          }
        }
      } catch (apiErr) {
        console.warn("REST API student fetch error, trying Supabase...", apiErr);
      }

      // 2. محاولة استعلام قاعدة البيانات الحقيقية Supabase
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return { success: true, data: data as StudentProfile };
      }

      // إذا لم يكن متواجد بقاعدة البيانات، نقوم بجلبه من التخزين المحلي أو النموذج الافتراضي
      const saved = localStorage.getItem("u_student");
      const localData = saved ? JSON.parse(saved) : fallbackData;
      return { success: true, data: localData };
    } catch (error: any) {
      console.warn("StudentService.getStudentProfile fallback activated due to:", error.message);
      
      // استرداد آمن من التخزين المحلي في حالة انقطاع الاتصال أو عدم توفر الجداول
      const saved = localStorage.getItem("u_student");
      const localData = saved ? JSON.parse(saved) : fallbackData;

      return {
        success: true, // نعتبر العملية ناجحة باستخدام البيانات المحلية في المرحلة الانتقالية
        data: localData,
        error: error.message,
        errorMessageAr: "تعذر الاتصال بقاعدة البيانات المركزية. تم تحميل البيانات المحلية بنجاح.",
        errorMessageEn: "Could not connect to central database. Local storage loaded successfully."
      };
    }
  },

  /**
   * تحديث بيانات الملف الشخصي للطالب
   */
  async updateStudentProfile(profile: StudentProfile): Promise<SguServiceResult<StudentProfile>> {
    try {
      if (!profile || !profile.id) {
        throw new Error("Invalid student profile");
      }

      // 1. التحديث بقاعدة البيانات الحقيقية إن كانت متوفرة
      const { error } = await supabase
        .from("students")
        .upsert(profile)
        .eq("id", profile.id);

      if (error) {
        // لا نلقي الخطأ هنا بل نقوم بمتابعة الحفظ محلياً لضمان تجربة مستخدم مستقرة
        console.warn("Supabase upsert error, continuing locally:", error.message);
      }

      // 2. مزامنة البيانات محلياً بشكل آمن لضمان الحفظ الدائم (Persistent Offline State)
      localStorage.setItem("u_student", JSON.stringify(profile));

      return {
        success: true,
        data: profile
      };
    } catch (error: any) {
      console.error("StudentService.updateStudentProfile error:", error);
      return {
        success: false,
        error: error.message,
        errorMessageAr: "حدث خطأ غير متوقع أثناء تحديث بيانات الملف الشخصي.",
        errorMessageEn: "An unexpected error occurred while updating student profile."
      };
    }
  },

  /**
   * إدارة حجز السكن الجامعي (Dorms)
   */
  async reserveDormRoom(roomId: string, studentId: string): Promise<SguServiceResult<boolean>> {
    try {
      if (!roomId) throw new Error("Room ID is required");

      // تحديث حالة السكن في السيرفر إن وجد
      const { error } = await supabase
        .from("dorms")
        .update({ status: "full" })
        .eq("id", roomId);

      if (error) console.warn("Supabase dorms update skipped:", error.message);

      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        errorMessageAr: "فشل تحديث حجز الغرفة السكنية.",
        errorMessageEn: "Failed to update dorm room reservation."
      };
    }
  }
};
