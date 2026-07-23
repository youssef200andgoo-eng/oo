import { supabase } from "../utils/supabaseClient";

export interface FacultyMember {
  id: string;
  nameAr: string;
  nameEn: string;
  college: string;
  department: string;
  titleAr: string;
  titleEn: string;
  email: string;
}

/**
 * MODULE: FACULTY (إدارة شؤون أعضاء هيئة التدريس)
 * معالجة السجلات الأكاديمية للمدرسين والأساتذة ومساعدي التدريس
 */
export const FacultyService = {
  /**
   * جلب أعضاء هيئة التدريس لكلية معينة
   */
  async getFacultyByCollege(collegeId: string): Promise<{ success: boolean; data: FacultyMember[]; error?: string }> {
    try {
      // 1. محاولة استعلام API من السيرفر
      const apiRes = await fetch(`/api/professors?collegeId=${encodeURIComponent(collegeId)}`);
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.success && json.data) {
          const mappedFaculty: FacultyMember[] = json.data.map((p: any) => ({
            id: String(p.id),
            nameAr: p.full_name_ar,
            nameEn: p.full_name_en,
            college: String(p.college_id),
            department: String(p.department_id),
            titleAr: p.academic_title_ar || "أستاذ دكتور",
            titleEn: p.academic_title_en || "Professor",
            email: p.email
          }));
          return { success: true, data: mappedFaculty };
        }
      }

      // 2. محاولة استعلام من قاعدة البيانات السحابية
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .eq("college", collegeId);

      if (error) throw error;
      return { success: true, data: data as FacultyMember[] };
    } catch (err: any) {
      console.warn("FacultyService.getFacultyByCollege fallback to mock due to:", err.message);
      
      const mockFaculty: FacultyMember[] = [
        { id: "F01", nameAr: "أ.د. عادل توفيق غنيم", nameEn: "Prof. Adel Tawfik Ghoneim", college: "fcis", department: "Computer Science", titleAr: "عميد الكلية", titleEn: "College Dean", email: "adel.ghoneim@sgu.edu.eg" },
        { id: "F02", nameAr: "أ.د. منال محمود الديب", nameEn: "Prof. Manal El-Deeb", college: "fcis", department: "Software Engineering", titleAr: "رئيس قسم هندسة البرمجيات", titleEn: "Head of SE", email: "manal.eldeeb@sgu.edu.eg" },
        { id: "F03", nameAr: "د. شريف يسري الصباغ", nameEn: "Dr. Sherif Youssef", college: "fcis", department: "Artificial Intelligence", titleAr: "أستاذ مساعد", titleEn: "Assistant Professor", email: "sherif.yousry@sgu.edu.eg" }
      ];

      const filtered = mockFaculty.filter(f => f.college === collegeId || collegeId === "all");
      return { success: true, data: filtered };
    }
  },

  /**
   * تحديث الجدول الدراسي لعضو هيئة التدريس
   */
  async updateFacultySchedule(facultyId: string, schedule: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("faculty_schedules")
        .upsert({ faculty_id: facultyId, schedule });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("FacultyService.updateFacultySchedule error wrapped:", err);
      return { success: false, error: err.message };
    }
  }
};
