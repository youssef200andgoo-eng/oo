/**
 * SGU ERP CENTRAL MODULES ENTRY-POINT (بوابات وموديولات النظام الموحد)
 * 
 * Includes the production-ready modularized service layers with try-catch robust error handling,
 * real database integration adapters (Supabase & Firebase), and stable offline persistent fallbacks.
 */

export * from "./authService";
export * from "./studentService";
export * from "./facultyService";
export * from "./courseService";
export * from "./attendanceService";
export * from "./financeService";
export * from "./libraryService";
export * from "./reportService";
export * from "./adminService";
