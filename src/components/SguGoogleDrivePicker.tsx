import React, { useState, useEffect } from "react";
import { 
  Cloud, 
  HardDrive, 
  FileText, 
  ExternalLink, 
  Trash2, 
  Settings, 
  UserCheck, 
  LogOut, 
  AlertCircle, 
  CheckCircle,
  FileSpreadsheet,
  FileImage,
  FolderOpen
} from "lucide-react";
import { googleSignIn, getAccessToken, logout, initAuth } from "../utils/firebaseAuth";
import { User } from "firebase/auth";

export interface DriveFileAttachment {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;
  iconUrl?: string;
  attachedAt: string;
  associatedFeature: string;
}

interface SguGoogleDrivePickerProps {
  onAttachFile?: (file: DriveFileAttachment) => void;
  addSystemLog: (msg: string) => void;
  activeCollegeName?: string;
}

export default function SguGoogleDrivePicker({ onAttachFile, addSystemLog, activeCollegeName }: SguGoogleDrivePickerProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pickerLoaded, setPickerLoaded] = useState(false);

  // Lists of attached files (stored locally in localStorage to persist across demo sessions)
  const [attachments, setAttachments] = useState<DriveFileAttachment[]>(() => {
    const saved = localStorage.getItem("sgu_picker_attachments");
    return saved ? JSON.parse(saved) : [
      {
        id: "sample-1",
        name: "خطة الاعتماد الأكاديمي لمبنى الحاسبات والذكاء الاصطناعي - SGU.pdf",
        url: "https://drive.google.com/drive/my-drive",
        mimeType: "application/pdf",
        attachedAt: new Date().toLocaleDateString("ar-EG"),
        associatedFeature: "ملف تخطيط البرنامج"
      }
    ];
  });

  const [pickedDraft, setPickedDraft] = useState<DriveFileAttachment | null>(null);
  const [showConfirmAttach, setShowConfirmAttach] = useState(false);

  // Sync attachments to localStorage
  useEffect(() => {
    localStorage.setItem("sgu_picker_attachments", JSON.stringify(attachments));
  }, [attachments]);

  // Handle Firebase Auth status
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAuthToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAuthToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Dynamically load GAPI Picker
  useEffect(() => {
    const checkGapiAndLoad = () => {
      const gapi = (window as any).gapi;
      if (gapi) {
        gapi.load("picker", {
          callback: () => {
            setPickerLoaded(true);
            addSystemLog("تم تحميل مكتبة Google Picker SDK بنجاح.");
          },
          onerror: () => {
            console.error("Failed to load Google Picker SDK");
          }
        });
      }
    };

    if (!(window as any).gapi) {
      const timer = setInterval(() => {
        if ((window as any).gapi) {
          checkGapiAndLoad();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    } else {
      checkGapiAndLoad();
    }
  }, [addSystemLog]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAuthToken(result.accessToken);
        setNeedsAuth(false);
        addSystemLog(`تسجيل الدخول سحابياً بحساب: ${result.user.email}`);
      }
    } catch (err: any) {
      console.error("Authentication failed", err);
      addSystemLog(err.message || "⚠️ فشل الاتصال بخوادم Google Auth.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAuthToken(null);
      setNeedsAuth(true);
      addSystemLog("تسجيل خروج ناجح من بوابة Google Drive.");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  const openPicker = async () => {
    const token = authToken || (await getAccessToken());
    if (!token) {
      addSystemLog("⚠️ خطأ المزامنة: يرجى تسجيل الدخول سحابياً أولاً لتخطي جدار الحماية.");
      setNeedsAuth(true);
      return;
    }

    if (!pickerLoaded) {
      addSystemLog("⏳ مكتبة Picker لا تزال قيد التحميل من خوادم Google...");
      return;
    }

    try {
      const pickerOrigin =
        window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
          ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
          : window.location.origin;

      const picker = new (window as any).google.picker.PickerBuilder()
        .addView((window as any).google.picker.ViewId.DOCS)
        .setOAuthToken(token)
        .setCallback(pickerCallback)
        .setOrigin(pickerOrigin)
        .build();

      picker.setVisible(true);
      addSystemLog("📂 تشغيل واجهة مستكشف Google Picker الآمن...");
    } catch (err) {
      console.error("Error creating Google Picker:", err);
      addSystemLog("⚠️ فشل الاتصال المباشر ببروتوكول Picker.");
    }
  };

  const pickerCallback = (data: any) => {
    const google = (window as any).google;
    if (data.action === google.picker.Action.PICKED) {
      const doc = data.docs[0];
      const newFile: DriveFileAttachment = {
        id: doc.id,
        name: doc.name,
        url: doc.url,
        mimeType: doc.mimeType,
        sizeBytes: doc.sizeBytes,
        iconUrl: doc.iconUrl,
        attachedAt: new Date().toLocaleDateString("ar-EG"),
        associatedFeature: activeCollegeName || "إدارة الكليات السبع"
      };
      
      setPickedDraft(newFile);
      setShowConfirmAttach(true); // present explicit confirmation dialog!
    }
  };

  const confirmAttachment = () => {
    if (!pickedDraft) return;
    setAttachments((prev) => [pickedDraft, ...prev]);
    if (onAttachFile) onAttachFile(pickedDraft);

    addSystemLog(`📂 تم ربط الملف سحابياً: ${pickedDraft.name}`);
    setPickedDraft(null);
    setShowConfirmAttach(false);
  };

  const deleteAttachment = (id: string, fileName: string) => {
    // Explicit user confirmation for destructive actions is MANDATORY!
    const confirmed = window.confirm(
      `منظومة SGU تأكيد الإجراء الكهربائي:\nهل أنت متأكد من رغبتك في إقصاء الملف "${fileName}" من قائمة الارتباط السحابي للجامعة؟`
    );
    if (!confirmed) return;

    setAttachments((prev) => prev.filter((item) => item.id !== id));
    addSystemLog(`🗑️ تم فك ارتباط مستند Drive: ${fileName}`);
  };

  const getMimeIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FileText className="w-5 h-5 text-red-400" />;
    if (mimeType.includes("spreadsheet") || mimeType.includes("sheet")) return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    if (mimeType.includes("image")) return <FileImage className="w-5 h-5 text-blue-400" />;
    return <FolderOpen className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header and Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Cloud className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">بوابة الربط السحابي والـ Google Picker</h3>
            <p className="text-xs text-slate-400 mt-1">
              أرفق ملفات المناهج، مستندات الطلاب الأكاديمية وصور الاعتماد مباشرة من Google Drive
            </p>
          </div>
        </div>
        <div className="font-mono text-[10px] bg-slate-950 px-2.5 py-1 rounded text-indigo-400 border border-slate-850">
          Drive.File v3 (SECURE)
        </div>
      </div>

      {/* Authentication and Connect controls */}
      {needsAuth ? (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 text-center space-y-4">
          <HardDrive className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-slate-300">لم يتم تفعيل الاتصال بـ Google Drive حالياً</h4>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              يحتاج المساعد الأكاديمي SGU إلى إذنك لعرض واجهة Google Picker المعتمدة بالكامل لتسهيل الاختيار الفوري لملفاتك بموثوقية.
            </p>
          </div>
          
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-slate-100 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>تمكين الاتصال السحابي الآمن</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* User Logged in Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-950/70 border border-slate-850 rounded-xl">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-10 h-10 rounded-full border border-indigo-500/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  {(user?.displayName || user?.email || "U").substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200">
                    {user?.displayName || "مستكشف سحابيSGU"}
                  </span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <UserCheck className="w-2.5 h-2.5" /> متصل
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={openPicker}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-slate-100 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                title="افتح واجهة Google Picker لاختيار ملف من درايف"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>إدراج ملف عبر Google Picker</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="px-2 py-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal for attaching new files */}
      {showConfirmAttach && pickedDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-indigo-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h4 className="text-sm font-semibold text-slate-100">تأكيد إرفاق مستند Google Drive</h4>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              لقد اخترت الملف التالي بنجاح عبر بوابة Picker. هل توافق على تضمينه في منظومة ERP للجامعة؟
            </p>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 flex items-center gap-3">
              {getMimeIcon(pickedDraft.mimeType)}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-indigo-300 truncate">{pickedDraft.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 truncate">
                  النوع: {pickedDraft.mimeType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={confirmAttachment}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-100 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                تأكيد ومزامنة
              </button>
              <button
                onClick={() => {
                  setPickedDraft(null);
                  setShowConfirmAttach(false);
                }}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachments ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span>قائمة الوثائق والأوراق السحابية المرتبطة للكلية</span>
          <span className="text-[10px] text-indigo-400">{attachments.length} ملف مرتبط</span>
        </div>

        {attachments.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/50 border border-dashed border-slate-850 rounded-xl text-slate-500 text-xs">
            لا توجد مستندات مرتبطة. استخدم Google Picker لإرفاق المستندات الأكاديمية بنجاح.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attachments.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-start gap-3 hover:border-slate-800 transition-colors"
              >
                <div className="p-1.5 bg-slate-900 rounded-lg">
                  {getMimeIcon(item.mimeType)}
                </div>
                
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs font-semibold text-slate-200 truncate" title={item.name}>
                    {item.name}
                  </p>
                  
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>{item.attachedAt}</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded text-indigo-400">{item.associatedFeature}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noreferrer referrer"
                    className="p-1.5 text-slate-400 hover:text-indigo-400 rounded transition-colors"
                    title="معاينة الملف في Google Drive"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => deleteAttachment(item.id, item.name)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded transition-colors"
                    title="حذف الارتباط السحابي (يتطلب تأكيداً)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
