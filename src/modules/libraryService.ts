import { supabase } from "../utils/supabaseClient";
import { LibraryBook } from "../types";

/**
 * MODULE: LIBRARY (إدارة المكتبة الجامعية الرقمية)
 * محرك البحث والاستعارة والحجز للكتب والمصادر التعليمية والمجلات البحثية المعتمدة
 */
export const LibraryService = {
  /**
   * البحث عن كتب في مكتبة الجامعة
   */
  async searchBooks(query: string): Promise<{ success: boolean; data: LibraryBook[]; error?: string }> {
    try {
      const apiRes = await fetch(`/api/library/books?q=${encodeURIComponent(query)}`);
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.success && json.data) {
          const mappedBooks: LibraryBook[] = json.data.map((b: any) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            category: b.category,
            available: b.available,
            locationCode: b.locationCode || "GEN-01",
            borrowedDate: b.borrowedDate,
            dueDate: b.dueDate
          }));
          return { success: true, data: mappedBooks };
        }
      }

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .ilike("title", `%${query}%`);

      if (error) throw error;
      return { success: true, data: data as LibraryBook[] };
    } catch (err: any) {
      console.warn("LibraryService.searchBooks local fallback:", err.message);
      
      const saved = localStorage.getItem("u_books");
      const localBooks: LibraryBook[] = saved ? JSON.parse(saved) : [];
      const filtered = localBooks.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase()) || 
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.category.toLowerCase().includes(query.toLowerCase())
      );
      return { success: true, data: filtered };
    }
  },

  /**
   * استعارة أو حجز كتاب من المكتبة
   */
  async borrowBook(bookId: string, studentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const apiRes = await fetch("/api/library/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, studentId })
      });
      if (apiRes.ok) {
        return { success: true };
      }

      const { error } = await supabase
        .from("books")
        .update({ available: false, borrowed_by: studentId, due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() })
        .eq("id", bookId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("LibraryService.borrowBook error:", err);
      return { success: false, error: err.message };
    }
  }
};
