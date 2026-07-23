import { supabase } from "../utils/supabaseClient";
import { AttendanceRecord } from "../types";

/**
 * MODULE: ATTENDANCE (إدارة الحضور والغياب الذكي)
 * معالج عمليات تسجيل الحضور والمراقبة الحية بالتعاون مع البوابات والـ QR الذكي
 */
export const AttendanceService = {
  /**
   * جلب سجلات حضور الطالب
   */
  async getAttendanceLogs(studentId: string): Promise<{ success: boolean; data: AttendanceRecord[]; error?: string }> {
    try {
      const apiRes = await fetch(`/api/attendance?studentId=${encodeURIComponent(studentId)}`);
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.success && json.data) {
          const mapped: AttendanceRecord[] = json.data.map((a: any) => ({
            date: a.date || new Date().toISOString().split("T")[0],
            day: "اليوم",
            courseCode: "CS-211",
            courseName: "هياكل وتراكيب البيانات",
            status: a.status === "Present" ? "present" : "absent",
            method: "QR",
            time: "09:15 AM"
          }));
          return { success: true, data: mapped };
        }
      }

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentId);

      if (error) throw error;
      return { success: true, data: data as AttendanceRecord[] };
    } catch (err: any) {
      console.warn("AttendanceService.getAttendanceLogs local fallback:", err.message);
      
      const saved = localStorage.getItem("u_attendance");
      const localAttendance = saved ? JSON.parse(saved) : [];
      return { success: true, data: localAttendance };
    }
  },

  /**
   * تسجيل عملية حضور ذكية لدرس أو محاضرة
   */
  async recordAttendance(record: AttendanceRecord): Promise<{ success: boolean; error?: string }> {
    try {
      const apiRes = await fetch("/api/attendance/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "2026-ST-001",
          courseId: record.courseCode,
          status: record.status === "present" ? "Present" : "Absent",
          notes: `الحضور تم عبر ${record.method}`
        })
      });
      if (apiRes.ok) {
        return { success: true };
      }

      const { error } = await supabase
        .from("attendance")
        .insert(record);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("AttendanceService.recordAttendance error caught:", err);
      return { success: false, error: err.message };
    }
  }
};
