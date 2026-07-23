import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";
import appletConfig from "../../firebase-applet-config.json";

// إعدادات الاتصال بـ Firebase (تُقرأ من ملف البيئة .env أو من ملف الكوادر الافتراضي للمشروع)
const firebaseConfig = {
  apiKey: (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FIREBASE_API_KEY) || appletConfig.apiKey,
  authDomain: (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN) || appletConfig.authDomain,
  projectId: (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID) || appletConfig.projectId,
  storageBucket: (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET) || appletConfig.storageBucket,
  messagingSenderId: (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || appletConfig.messagingSenderId,
  appId: (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FIREBASE_APP_ID) || appletConfig.appId
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://www.googleapis.com/auth/drive.metadata.readonly");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Load any cached token during active session if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    cachedAccessToken = null;
  }
});

/**
 * دالة تسجيل الدخول الآمن للجامعة ببريد السلسال الأكاديمي
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error("خطأ في بيانات تسجيل الدخول: " + error.message);
  }
};

/**
 * دالة تسجيل الخروج الآمن وتدمير الجلسة في Firebase
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    cachedAccessToken = null;
  } catch (error: any) {
    console.error("خطأ أثناء تسجيل الخروج", error);
  }
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get access token from Firebase Auth");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Sign in error:", error);
    if (error?.code === "auth/popup-blocked" || error?.message?.includes("popup-blocked")) {
      const friendlyError = new Error(
        "⚠️ تم حظر النافذة المنبثقة من المتصفح! للتغلب على قيود الأمان في الإطار التجريبي، اضغط على زر 'الفتح في نافذة جديدة' أعلى اليمين لتسجيل الدخول السحابي ومزامنة حسابك الحقيقي مع Google Drive / Slides بأمان."
      );
      (friendlyError as any).code = "auth/popup-blocked";
      throw friendlyError;
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async (): Promise<void> => {
  await logoutUser();
};
