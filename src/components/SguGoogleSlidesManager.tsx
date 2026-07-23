import React, { useState, useEffect } from "react";
import {
  Presentation,
  Play,
  RotateCcw,
  Cloud,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Link2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Search,
  PlusCircle,
  Sparkles,
  RefreshCw,
  LogOut,
  Maximize2
} from "lucide-react";
import { googleSignIn, getAccessToken, logout, initAuth } from "../utils/firebaseAuth";
import { User } from "firebase/auth";
import { Course } from "../types";

export interface SguPresentation {
  id: string; // Google Slides file ID
  title: string;
  courseCode?: string; // Associated Course Code
  syncedAt?: string;
  embedUrl: string;
  viewUrl: string;
  lastOpened?: string;
}

interface SguGoogleSlidesManagerProps {
  courses: Course[];
  addSystemLog: (msg: string) => void;
  lang: "ar" | "en";
  onSyncWithRecords?: (slide: SguPresentation) => void;
}

export default function SguGoogleSlidesManager({
  courses,
  addSystemLog,
  lang,
  onSyncWithRecords
}: SguGoogleSlidesManagerProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Default presentations list (pre-seeded for premium educational simulation)
  const [presentations, setPresentations] = useState<SguPresentation[]>(() => {
    const saved = localStorage.getItem("sgu_slides_presentations");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "1H3uUOnZ_qY6FvT7GbyxL28iX8S_NHe0f1lWmsO2qSjE",
        title: "مقرر الذكاء الاصطناعي: الشبكات العصبية وتطبيقات التعلم العميق (AI302)",
        courseCode: "AI302",
        syncedAt: "2026-07-01",
        embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT1T7wK9xH5Y_XjD4n6B2m9N1O6yP9_zN-Gq0D4v0f8L_E7q_B1hO6S9_U/embed?start=false&loop=false&delayms=3000",
        viewUrl: "https://docs.google.com/presentation/d/1H3uUOnZ_qY6FvT7GbyxL28iX8S_NHe0f1lWmsO2qSjE/edit",
        lastOpened: "2026-07-08 14:30"
      },
      {
        id: "1-J_S2Zp1Y3fT6R8KbyxO27iL8W_MHe0f2lWnsP3qSjG",
        title: "مقرر قواعد البيانات المتقدمة: معمارية NoSQL وفهرسة البيانات (DB301)",
        courseCode: "DB301",
        syncedAt: "2026-07-03",
        embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vR6z-R9yH4Y_SjG4n6B3m8N2O6yP8_zN-Gq0D4v0f8L_D7q_A1hO6S8_U/embed?start=false&loop=false&delayms=3000",
        viewUrl: "https://docs.google.com/presentation/d/1-J_S2Zp1Y3fT6R8KbyxO27iL8W_MHe0f2lWnsP3qSjG/edit",
        lastOpened: "2026-07-05 10:15"
      },
      {
        id: "1_R6A2Zp1Y3fT5Q8LbyxO26iJ8X_NHe0f3lWosP4qSjH",
        title: "مقرر الأمن السيبراني: تأمين خوادم النظم السحابية (SEC304)",
        courseCode: "SEC304",
        syncedAt: "2026-07-06",
        embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT_T5wM8xH4Y_Sg4n6B2m7N0O6yP7_zN-Gq0D4v0f8L_C7q_Z1hO5S7_U/embed?start=false&loop=false&delayms=3000",
        viewUrl: "https://docs.google.com/presentation/d/1_R6A2Zp1Y3fT5Q8LbyxO26iJ8X_NHe0f3lWosP4qSjH/edit",
        lastOpened: "2026-07-09 09:12"
      }
    ];
  });

  const [selectedSlideId, setSelectedSlideId] = useState<string>(() => {
    return presentations.length > 0 ? presentations[0].id : "";
  });

  const [manualLink, setManualLink] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedCourseForSync, setSelectedCourseForSync] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("sgu_slides_presentations", JSON.stringify(presentations));
  }, [presentations]);

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

  // Dynamically load Google GAPI Picker SDK
  useEffect(() => {
    const checkGapiAndLoad = () => {
      const gapi = (window as any).gapi;
      if (gapi) {
        gapi.load("picker", {
          callback: () => {
            setPickerLoaded(true);
            addSystemLog(lang === "ar" ? "تم تهيئة بروتوكول Google Picker بنجاح لعروض Slides." : "Google Picker SDK initialized successfully for Slides.");
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
  }, [addSystemLog, lang]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAuthToken(result.accessToken);
        setNeedsAuth(false);
        addSystemLog(lang === "ar" ? `تم الاتصال بحساب Google: ${result.user.email}` : `Connected to Google Account: ${result.user.email}`);
      }
    } catch (err: any) {
      console.error("Google Auth failure:", err);
      addSystemLog(err.message || (lang === "ar" ? "⚠️ فشل ربط حساب Google بمظلة SGU." : "⚠️ Failed to link Google account with SGU framework."));
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
      addSystemLog(lang === "ar" ? "تم تسجيل خروج آمن من سحابة Google Slides." : "Logged out securely from Google Slides cloud.");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  // Helper to extract Google Slides ID from URL
  const extractSlideId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url.trim();
  };

  const openPicker = async () => {
    const token = authToken || (await getAccessToken());
    if (!token) {
      addSystemLog(lang === "ar" ? "⚠️ يرجى تسجيل الدخول سحابياً أولاً لاستدعاء Google Drive Picker." : "⚠️ Please sign in with Google first to open the Drive Picker.");
      setNeedsAuth(true);
      return;
    }

    if (!pickerLoaded) {
      addSystemLog(lang === "ar" ? "⏳ مكتبة Google Slides Picker لا تزال قيد التحميل..." : "⏳ Google Slides Picker SDK is still loading...");
      return;
    }

    try {
      const pickerOrigin =
        window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
          ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
          : window.location.origin;

      const view = new (window as any).google.picker.DocsView((window as any).google.picker.ViewId.PRESENTATIONS)
        .setMimeTypes("application/vnd.google-apps.presentation");

      const picker = new (window as any).google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(token)
        .setCallback(pickerCallback)
        .setOrigin(pickerOrigin)
        .build();

      picker.setVisible(true);
      addSystemLog(lang === "ar" ? "📂 تشغيل بوابة اختيار عروض Google Slides الآمنة..." : "📂 Launching secure Google Slides cloud picker gateway...");
    } catch (err) {
      console.error("Error creating Google Picker:", err);
      addSystemLog(lang === "ar" ? "⚠️ فشل بدء اتصال مباشر مع واجهة Picker." : "⚠️ Failed to establish direct connection with Picker interface.");
    }
  };

  const pickerCallback = (data: any) => {
    const google = (window as any).google;
    if (data.action === google.picker.Action.PICKED) {
      const doc = data.docs[0];
      const slideId = doc.id;
      
      const newSlide: SguPresentation = {
        id: slideId,
        title: doc.name || (lang === "ar" ? "عرض تقديمي مستورد" : "Imported Presentation"),
        embedUrl: `https://docs.google.com/presentation/d/${slideId}/embed?start=false&loop=false&delayms=3000`,
        viewUrl: doc.url || `https://docs.google.com/presentation/d/${slideId}/edit`,
        lastOpened: new Date().toISOString().replace("T", " ").slice(0, 16)
      };

      setPresentations((prev) => {
        if (prev.some(item => item.id === slideId)) return prev;
        return [newSlide, ...prev];
      });
      setSelectedSlideId(slideId);
      addSystemLog(lang === "ar" ? `📂 تم استيراد العرض بنجاح: ${newSlide.title}` : `📂 Presentation imported successfully: ${newSlide.title}`);
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const slideId = extractSlideId(manualLink);
    if (!slideId) {
      alert(lang === "ar" ? "رابط العرض التقديمي غير صالح! يرجى تقديم رابط Google Slides كامل." : "Invalid presentation link! Please provide a valid Google Slides URL.");
      return;
    }

    const title = manualTitle.trim() || (lang === "ar" ? `عرض تقديمي مخصص - ${slideId.slice(0, 6)}` : `Custom Presentation - ${slideId.slice(0, 6)}`);

    const newSlide: SguPresentation = {
      id: slideId,
      title: title,
      embedUrl: `https://docs.google.com/presentation/d/${slideId}/embed?start=false&loop=false&delayms=3000`,
      viewUrl: manualLink.includes("http") ? manualLink : `https://docs.google.com/presentation/d/${slideId}/edit`,
      lastOpened: new Date().toISOString().replace("T", " ").slice(0, 16)
    };

    setPresentations((prev) => {
      if (prev.some(item => item.id === slideId)) return prev;
      return [newSlide, ...prev];
    });
    setSelectedSlideId(slideId);
    setManualLink("");
    setManualTitle("");
    setShowManualForm(false);
    addSystemLog(lang === "ar" ? `📝 تم تسجيل العرض يدوياً: ${title}` : `📝 Custom presentation added manually: ${title}`);
  };

  const handleDelete = (id: string, title: string) => {
    const confirmed = window.confirm(
      lang === "ar"
        ? `هل أنت متأكد من رغبتك في إقصاء العرض التقديمي "${title}"؟`
        : `Are you sure you want to remove the presentation "${title}"?`
    );
    if (!confirmed) return;

    setPresentations((prev) => prev.filter((item) => item.id !== id));
    if (selectedSlideId === id) {
      const remaining = presentations.filter((item) => item.id !== id);
      setSelectedSlideId(remaining.length > 0 ? remaining[0].id : "");
    }
    addSystemLog(lang === "ar" ? `🗑️ تم مسح العرض: ${title}` : `🗑️ Removed presentation: ${title}`);
  };

  const handleSyncWithCourse = () => {
    if (!selectedSlideId || !selectedCourseForSync) return;

    setIsSyncing(true);
    setSyncStatus(null);

    const slide = presentations.find(p => p.id === selectedSlideId);
    if (!slide) return;

    const course = courses.find(c => c.code === selectedCourseForSync);
    const courseName = course ? course.name : selectedCourseForSync;

    setTimeout(() => {
      // Update presentations local state
      const updatedPresentations = presentations.map((p) => {
        if (p.id === selectedSlideId) {
          return {
            ...p,
            courseCode: selectedCourseForSync,
            syncedAt: new Date().toISOString().slice(0, 10)
          };
        }
        return p;
      });

      setPresentations(updatedPresentations);
      setIsSyncing(false);
      setSyncStatus(lang === "ar" ? "تمت المزامنة بنجاح مع السجل الأكاديمي!" : "Successfully synced with Academic Records!");

      // Trigger callback if defined (to save in parent state)
      if (onSyncWithRecords && slide) {
        onSyncWithRecords({
          ...slide,
          courseCode: selectedCourseForSync,
          syncedAt: new Date().toISOString().slice(0, 10)
        });
      }

      addSystemLog(
        lang === "ar"
          ? `🔗 تم ربط العرض التقديمي "${slide.title}" بمقرر ${courseName} (${selectedCourseForSync})`
          : `🔗 Synced presentation "${slide.title}" with course ${courseName} (${selectedCourseForSync})`
      );

      // Auto clear success message after 3 seconds
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1200);
  };

  const activeSlide = presentations.find(p => p.id === selectedSlideId);

  // Filter presentation list based on search query
  const filteredPresentations = presentations.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.courseCode && p.courseCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6" id="sgu-google-slides-manager">
      {/* Title Header banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-right relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Presentation className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-lg font-black text-slate-100 font-sans tracking-wide">
              {lang === "ar" ? "بوابة العروض التقديمية الأكاديمية (Google Slides Hub)" : "Academic Presentations Hub (Google Slides Viewer)"}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {lang === "ar"
              ? "منصة متطورة لاستيراد وتصفح ملفات عروض Google Slides التفاعلية للمحاضرات وربطها الفوري ببطاقات ومواد المقررات المسجلة في السجل الأكاديمي."
              : "An advanced portal for importing, viewing, and organizing interactive Google Slides presentations for your registered courses with live academic record syncing."}
          </p>
        </div>

        {/* Cloud sync connection status */}
        <div className="shrink-0 relative z-10 flex flex-col items-end gap-2 text-xs">
          {needsAuth ? (
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="cursor-pointer bg-slate-950 border border-amber-500/30 hover:border-amber-500 hover:bg-slate-900 px-4 py-2 rounded-xl text-slate-200 font-bold transition flex items-center gap-2"
            >
              <Cloud className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{lang === "ar" ? "ربط Google Drive" : "Connect Google Drive"}</span>
            </button>
          ) : (
            <div className="bg-slate-950/80 border border-emerald-900/40 px-3.5 py-2.5 rounded-xl text-right space-y-1">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleSignOut}
                  className="text-rose-400 hover:text-rose-300 transition text-[10px] font-bold"
                  title={lang === "ar" ? "تسجيل الخروج" : "Disconnect"}
                >
                  <LogOut className="w-3.5 h-3.5 inline-block" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-bold text-emerald-400">{lang === "ar" ? "متصل بسحابة جوجل" : "Google Live Linked"}</span>
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-400 font-medium truncate max-w-[180px]">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: Slide list selector */}
        <div className="lg:col-span-4 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 text-right flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowManualForm(!showManualForm)}
                className="cursor-pointer text-[11px] text-amber-500 font-bold hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {lang === "ar" ? "إضافة رابط يدوياً" : "Add Link Manually"}
              </button>
              <h3 className="text-xs font-black text-slate-350 tracking-wider">
                {lang === "ar" ? "قائمة الشرائح المتوفرة" : "Available Presentations"}
              </h3>
            </div>

            {/* Quick search */}
            <div className="relative">
              <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder={lang === "ar" ? "ابحث عن عرض أو رمز مقرر..." : "Search slides or course code..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg pr-9 pl-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition placeholder:text-slate-600 text-right"
              />
            </div>

            {/* Manual link input form overlay-like */}
            {showManualForm && (
              <form onSubmit={handleAddManual} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3 animate-fade-in text-xs">
                <div className="space-y-1">
                  <label className="text-slate-450 block font-semibold">{lang === "ar" ? "رابط مشاركة Google Slides:" : "Google Slides Share Link:"}</label>
                  <input
                    type="url"
                    required
                    placeholder="https://docs.google.com/presentation/d/..."
                    value={manualLink}
                    onChange={(e) => setManualLink(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-450 block font-semibold">{lang === "ar" ? "عنوان العرض التقديمي:" : "Presentation Title:"}</label>
                  <input
                    type="text"
                    required
                    placeholder={lang === "ar" ? "مثال: مقدمة إلى الأمن السيبراني" : "e.g. Introduction to Cyber Security"}
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="flex justify-between items-center pt-1.5">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(false)}
                    className="text-slate-400 hover:text-slate-200 text-[11px]"
                  >
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded text-[11px] transition"
                  >
                    {lang === "ar" ? "إدراج العرض" : "Insert Slide"}
                  </button>
                </div>
              </form>
            )}

            {/* Presentation Cards List */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
              {filteredPresentations.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/45 rounded-xl border border-slate-850/60">
                  <AlertCircle className="w-5 h-5 text-slate-600 mx-auto mb-2" />
                  <p className="text-[11px] text-slate-500">
                    {lang === "ar" ? "لم يتم العثور على أي عروض تناسب البحث." : "No presentations found."}
                  </p>
                </div>
              ) : (
                filteredPresentations.map((p) => {
                  const isSelected = p.id === selectedSlideId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedSlideId(p.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition text-right group relative overflow-hidden ${
                        isSelected
                          ? "bg-slate-950 border-amber-500/50 shadow-md"
                          : "bg-slate-950/45 border-slate-850 hover:bg-slate-950 hover:border-slate-800"
                      }`}
                    >
                      {/* Highlight accent bar */}
                      {isSelected && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                      )}

                      <div className="flex justify-between items-start gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id, p.title);
                          }}
                          className="text-slate-600 hover:text-rose-450 hover:bg-slate-900 p-1 rounded-md opacity-0 group-hover:opacity-100 transition shrink-0"
                          title={lang === "ar" ? "حذف العرض" : "Delete slide"}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </button>

                        <div className="space-y-1 flex-1">
                          <h4 className={`text-xs font-bold leading-normal truncate ${isSelected ? "text-amber-400" : "text-slate-200 group-hover:text-amber-500/85"}`}>
                            {p.title}
                          </h4>
                          <div className="flex flex-wrap items-center justify-end gap-1.5 mt-1.5">
                            {p.courseCode ? (
                              <span className="bg-emerald-950 border border-emerald-900/50 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 shrink-0" />
                                {p.courseCode}
                              </span>
                            ) : (
                              <span className="bg-slate-900 text-slate-500 text-[9px] px-1.5 py-0.5 rounded-md">
                                {lang === "ar" ? "غير مرتبط بمقرر" : "Not linked"}
                              </span>
                            )}
                            {p.syncedAt && (
                              <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {p.syncedAt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Import Drive picker action */}
          <div className="border-t border-slate-850 pt-4 mt-4">
            <button
              onClick={openPicker}
              className="cursor-pointer w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Presentation className="w-4 h-4 text-amber-500" />
              <span>{lang === "ar" ? "استيراد ملف Slides من Drive" : "Import Slides from Google Drive"}</span>
            </button>
          </div>
        </div>

        {/* Right pane: Interactive Viewer & Sync Console */}
        <div className="lg:col-span-8 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-5 text-right flex flex-col justify-between">
          {activeSlide ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Active Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-850 pb-3 gap-2.5">
                <div className="flex items-center gap-2 justify-end sm:order-2">
                  <h3 className="text-sm font-bold text-slate-100">
                    {activeSlide.title}
                  </h3>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                </div>

                <div className="flex items-center gap-2 sm:order-1">
                  <a
                    href={activeSlide.viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-850"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "تصفح مباشر في Google" : "View on Google Slides"}</span>
                  </a>
                </div>
              </div>

              {/* Embedding iframe block */}
              <div className="relative bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-inner aspect-video group">
                <iframe
                  id="sgu-slides-iframe"
                  src={activeSlide.embedUrl}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  title={activeSlide.title}
                  className="w-full h-full border-0 rounded-2xl"
                ></iframe>

                {/* Simulated Overlay Control (Minimal styling bar) */}
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-between text-xs text-slate-300">
                  <span className="text-[10px] text-slate-500 font-mono">ID: {activeSlide.id.slice(0, 12)}...</span>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-400 hover:text-slate-100 cursor-pointer" onClick={() => {
                      const iframe = document.getElementById("sgu-slides-iframe");
                      if (iframe) {
                        try {
                          iframe.requestFullscreen();
                        } catch (err) {
                          window.open(activeSlide.viewUrl, "_blank");
                        }
                      }
                    }} title={lang === "ar" ? "شاشة كاملة" : "Fullscreen"} />
                    <span className="text-[10px] text-slate-400">{lang === "ar" ? "اضغط F لتكبير الشاشة" : "Press F to toggle fullscreen"}</span>
                  </div>
                </div>
              </div>

              {/* Viewer control panel */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-right space-y-1 md:order-2">
                  <p className="text-xs text-slate-300 font-bold flex items-center gap-1.5 justify-end">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {lang === "ar" ? "جولة عروض SGU التفاعلية" : "Interactive Slide Deck Controls"}
                  </p>
                  <p className="text-[10.5px] text-slate-500">
                    {lang === "ar"
                      ? "المشغّل يعرض البيانات المستقرة على السحابة، استخدم لوحة المفاتيح والأسهم المدمجة للتنقل."
                      : "The slides are served live from Google cloud. Use the built-in player controls or keyboard arrows to navigate."}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:order-1">
                  <button
                    onClick={() => {
                      const iframe: any = document.getElementById("sgu-slides-iframe");
                      if (iframe) {
                        iframe.src = activeSlide.embedUrl; // Refresh slide deck
                        addSystemLog(lang === "ar" ? "تم إعادة تشغيل العرض التقديمي." : "Restarted presentation playback.");
                      }
                    }}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 transition text-xs flex items-center gap-1.5"
                    title={lang === "ar" ? "إعادة تشغيل" : "Restart"}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "البداية" : "Reset"}</span>
                  </button>
                </div>
              </div>

              {/* ACADEMIC RECORD SYNC MODULE INTEGRATION PANEL */}
              <div className="bg-slate-950/65 border border-slate-850 p-4.5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
                    SGU ACADEMIC LEDGER INTEGRATION
                  </span>
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                    <Link2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    {lang === "ar" ? "المزامنة مع السجل الأكاديمي والمقررات" : "Sync Presentation with Academic Ledger"}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-450 leading-relaxed">
                  {lang === "ar"
                    ? "اربط هذا الملف بمادة مسجلة في سجلك الأكاديمي لإتاحتها فورا كمرجع علمي تفاعلي في بوابة الكلية وحقيبة الطالب الذكية."
                    : "Link this slide deck with any of your registered courses. Synced slides instantly appear under study materials for easy revision."}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleSyncWithCourse}
                    disabled={!selectedCourseForSync || isSyncing}
                    className="cursor-pointer w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs px-5 py-2.5 rounded-lg transition shrink-0 flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{lang === "ar" ? "قيد المزامنة..." : "Syncing..."}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{lang === "ar" ? "تأكيد الربط والمزامنة" : "Confirm Sync"}</span>
                      </>
                    )}
                  </button>

                  <select
                    value={selectedCourseForSync}
                    onChange={(e) => setSelectedCourseForSync(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 text-right"
                  >
                    <option value="">{lang === "ar" ? "-- اختر المقرر المستهدف للربط --" : "-- Select Target Course to Link --"}</option>
                    {courses
                      .filter((c) => c.status === "registered")
                      .map((course) => (
                        <option key={course.code} value={course.code}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                  </select>
                </div>

                {syncStatus && (
                  <div className="p-3 bg-emerald-950 border border-emerald-900/40 text-emerald-400 rounded-lg text-[11px] font-bold animate-fade-in flex items-center gap-1.5 justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{syncStatus}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-20 text-center bg-slate-950/20 rounded-2xl border border-slate-850 flex flex-col items-center justify-center space-y-4">
              <Presentation className="w-12 h-12 text-slate-750" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-400">
                  {lang === "ar" ? "لا يوجد أي عرض نشط" : "No Active Presentation"}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  {lang === "ar"
                    ? "يرجى تحديد عرض تقديمي من القائمة الجانبية أو ربط حسابك في جوجل لاستيراد ملفات Slides مخصصة."
                    : "Please select a presentation from the sidebar, or connect your Google account to import slides."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
