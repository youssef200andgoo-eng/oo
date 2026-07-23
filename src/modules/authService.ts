import { auth } from "../utils/firebaseAuth";
import { signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword } from "firebase/auth";

export interface SguAuthResult {
  success: boolean;
  user?: any;
  error?: string;
  errorMessageAr?: string;
  errorMessageEn?: string;
}

/**
 * MODULE: AUTHENTICATION (إدارة الهوية والتحقق)
 * معالج أمان عمليات تسجيل الدخول والخروج والتحقق من حسابات الجامعة
 */
export const AuthService = {
  /**
   * تسجيل دخول موحد لنظام ERP وجلب بيانات الصلاحيات
   */
  async login(email: string, password: string): Promise<SguAuthResult> {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: "Missing credentials",
          errorMessageAr: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
          errorMessageEn: "Please enter your email and password."
        };
      }

      // محاولة تسجيل الدخول عبر Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error: any) {
      console.error("AuthService.login error: ", error);
      
      // تفصيل رسائل الخطأ تبعا للمعايير الأمنية لـ Production
      let errAr = "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد والاتصال بالإنترنت.";
      let errEn = "Login failed. Please verify your credentials and connection.";

      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        errAr = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        errEn = "Incorrect email or password.";
      } else if (error.code === "auth/invalid-email") {
        errAr = "صيغة البريد الإلكتروني المدخل غير صالحة.";
        errEn = "Invalid email address format.";
      } else if (error.code === "auth/too-many-requests") {
        errAr = "تم حظر الحساب مؤقتاً بسبب محاولات خاطئة متعددة. حاول لاحقاً.";
        errEn = "Account temporarily locked due to too many failed attempts. Try again later.";
      }

      return {
        success: false,
        error: error.message,
        errorMessageAr: errAr,
        errorMessageEn: errEn
      };
    }
  },

  /**
   * تسجيل خروج آمن وإلغاء الجلسة الحالية
   */
  async logout(): Promise<SguAuthResult> {
    try {
      await firebaseSignOut(auth);
      // تنظيف الجلسة المحلية بأمان
      localStorage.removeItem("sgu_is_logged_in");
      return { success: true };
    } catch (error: any) {
      console.error("AuthService.logout error: ", error);
      return {
        success: false,
        error: error.message,
        errorMessageAr: "حدث خطأ أثناء محاولة تسجيل الخروج.",
        errorMessageEn: "An error occurred during logout process."
      };
    }
  },

  /**
   * إنشاء مستخدم جديد (متقدم)
   */
  async registerUser(email: string, password: string): Promise<SguAuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error: any) {
      console.error("AuthService.registerUser error: ", error);
      return {
        success: false,
        error: error.message,
        errorMessageAr: "فشل إنشاء الحساب الجديد في نظام الجامعة.",
        errorMessageEn: "Failed to create a new university account."
      };
    }
  }
};
