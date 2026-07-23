import { supabase } from "../utils/supabaseClient";
import { Course } from "../types";

/**
 * MODULE: COURSES (إدارة المقررات والمناهج الأكاديمية)
 * محرك تتبع وتسجيل وتحديث المواد والواجبات والمقررات التخصصية للطلاب
 */
export const CourseService = {
  /**
   * جلب المقررات الأكاديمية المسجلة للطالب
   */
  async getStudentCourses(studentId: string): Promise<{ success: boolean; data: Course[]; error?: string }> {
    try {
      // 1. محاولة استعلام REST API من السيرفر
      const apiRes = await fetch("/api/courses");
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.success && json.data) {
          const mappedCourses: Course[] = json.data.map((c: any) => ({
            code: c.course_code,
            name: c.course_name_ar,
            description: c.description || "مقرر دراسي متقدم معتمد حسب اللائحة",
            prerequisites: c.prerequisites ? c.prerequisites.split(",") : [],
            credits: c.credits,
            finalGrade: 100,
            status: "registered"
          }));
          localStorage.setItem("u_courses", JSON.stringify(mappedCourses));
          return { success: true, data: mappedCourses };
        }
      }

      const { data, error } = await supabase
        .from("student_courses")
        .select("*")
        .eq("student_id", studentId);

      if (error) throw error;
      return { success: true, data: data as Course[] };
    } catch (err: any) {
      console.warn("CourseService.getStudentCourses fallback activated:", err.message);
      
      const saved = localStorage.getItem("u_courses");
      const localCourses = saved ? JSON.parse(saved) : [];
      return { success: true, data: localCourses };
    }
  },

  /**
   * تسجيل مقرر أكاديمي جديد للطالب
   */
  async registerCourse(studentId: string, courseCode: string): Promise<{ success: boolean; error?: string }> {
    try {
      const apiRes = await fetch("/api/courses/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, courseCode })
      });
      if (apiRes.ok) {
        return { success: true };
      }

      const { error } = await supabase
        .from("student_courses")
        .insert({ student_id: studentId, course_code: courseCode, status: "registered" });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("CourseService.registerCourse error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * تقديم واجب دراسي أو تكليف مع ملفات مرفوعة
   */
  async submitAssignment(assignmentId: string, fileUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("assignments")
        .update({ submitted: true, file_submitted: fileUrl, submission_date: new Date().toISOString() })
        .eq("id", assignmentId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("CourseService.submitAssignment error:", err);
      return { success: false, error: err.message };
    }
  }
};
