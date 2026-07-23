import { supabase } from "../utils/supabaseClient";
import { FinanceRecord } from "../types";

/**
 * MODULE: FINANCE (الإدارة المالية والحسابات)
 * معالج الرسوم الدراسية والمصروفات والمدفوعات البنكية وإيصالات السداد المعتمدة
 */
export const FinanceService = {
  /**
   * جلب كشف حساب الطالب المالي والرسوم المتبقية
   */
  async getStudentFinance(studentId: string): Promise<{ success: boolean; data: FinanceRecord[]; error?: string }> {
    try {
      const apiRes = await fetch(`/api/finance/invoices?studentId=${encodeURIComponent(studentId)}`);
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.success && json.data) {
          const mappedRecords: FinanceRecord[] = json.data.map((f: any) => ({
            id: String(f.id),
            description: f.description || `قسط الرسوم الدراسية للترم ${f.semester_id || 'الحالي'}`,
            amount: Number(f.amount || 18500),
            category: "tuition",
            dueDate: f.due_date || "2026-07-15",
            paid: f.status === "paid",
            paymentDate: f.payment_date,
            paymentMethod: f.payment_method
          }));
          localStorage.setItem("u_finance", JSON.stringify(mappedRecords));
          return { success: true, data: mappedRecords };
        }
      }

      const { data, error } = await supabase
        .from("finance")
        .select("*")
        .eq("student_id", studentId);

      if (error) throw error;
      return { success: true, data: data as FinanceRecord[] };
    } catch (err: any) {
      console.warn("FinanceService.getStudentFinance local fallback:", err.message);
      
      const saved = localStorage.getItem("u_finance");
      const localFinance = saved ? JSON.parse(saved) : [];
      return { success: true, data: localFinance };
    }
  },

  /**
   * سداد قسط مالي أو رسوم دراسية عبر البوابة
   */
  async makePayment(invoiceId: string, amount: number, method: string): Promise<{ success: boolean; error?: string }> {
    try {
      const apiRes = await fetch("/api/finance/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, amount, paymentMethod: method })
      });
      if (apiRes.ok) {
        return { success: true };
      }

      const { error } = await supabase
        .from("finance")
        .update({ paid: true, payment_date: new Date().toISOString(), payment_method: method })
        .eq("id", invoiceId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("FinanceService.makePayment error:", err);
      return { success: false, error: err.message };
    }
  }
};
