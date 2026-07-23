import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Printer, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  QrCode, 
  Clock 
} from "lucide-react";
import { FinanceRecord } from "../types";

interface SguStudentPaymentsProps {
  finance: FinanceRecord[];
  setFinance: React.Dispatch<React.SetStateAction<FinanceRecord[]>>;
  triggerSystemPush: (title: string, message: string) => void;
  lang: "ar" | "en";
}

export default function SguStudentPayments({
  finance,
  setFinance,
  triggerSystemPush,
  lang
}: SguStudentPaymentsProps) {
  const [selectedRecord, setSelectedRecord] = useState<FinanceRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "fawry" | "wallet">("card");
  const [step, setStep] = useState<"select" | "pay" | "processing" | "otp" | "success">("select");
  
  // Card Inputs
  const [cardNo, setCardNo] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardBrand, setCardBrand] = useState<"visa" | "mastercard" | "unknown">("unknown");

  // OTP Simulation
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  // Fawry Sim
  const [fawryRef, setFawryRef] = useState("");
  const [fawryTimer, setFawryTimer] = useState(172800); // 48 Hours

  // Loading/Gateway States
  const [secureProgress, setSecureProgress] = useState(0);
  const [gatewayStatus, setGatewayStatus] = useState("");

  // Receipt History
  const [receipt, setReceipt] = useState<{
    id: string;
    description: string;
    amount: number;
    date: string;
    method: string;
    hash: string;
  } | null>(null);

  // Auto-format card number & brand detection
  const handleCardNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.substring(0, 16);
    
    // Brand detection
    if (value.startsWith("4")) {
      setCardBrand("visa");
    } else if (value.startsWith("5")) {
      setCardBrand("mastercard");
    } else {
      setCardBrand("unknown");
    }

    // Add gaps
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += value[i];
    }
    setCardNo(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length >= 2) {
      setCardExpiry(value.substring(0, 2) + "/" + value.substring(2));
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.substring(0, 3);
    setCardCvv(value);
  };

  // Fawry random code generator
  useEffect(() => {
    if (step === "pay" && paymentMethod === "fawry") {
      const randomCode = Math.floor(100000000 + Math.random() * 900000000).toString();
      setFawryRef(randomCode);
    }
  }, [step, paymentMethod]);

  // Fawry Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (step === "pay" && paymentMethod === "fawry") {
      interval = setInterval(() => {
        setFawryTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, paymentMethod]);

  const formatFawryTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startPaymentHandshake = () => {
    if (paymentMethod === "card") {
      if (cardNo.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3 || !cardHolder) {
        alert(lang === "ar" ? "يرجى تعبئة كافة بيانات البطاقة الائتمانية بشكل صحيح!" : "Please fill in all credit card details correctly!");
        return;
      }
    }

    setStep("processing");
    setSecureProgress(5);
    setGatewayStatus(lang === "ar" ? "جاري تعبئة بروتوكول الأمان الموحد وحظر التداخل..." : "Initializing Unified Security Protocol...");

    const intervals = [
      { p: 25, s: lang === "ar" ? "تسجيل ممر دفع مشفر ثلاثي الأبعاد 3D Secure..." : "Establishing encrypted 3D Secure payment canal..." },
      { p: 55, s: lang === "ar" ? "الاتصال ببنك المقاصة المركزي ومطابقة الرصيد والحدود..." : "Connecting to clearing house & verifying account limits..." },
      { p: 85, s: lang === "ar" ? "تبادل المفاتيح العشوائية وتدقيق الهاش الأكاديمي المالي..." : "Exchanging public keys & auditing academic ledger hash..." },
      { p: 100, s: lang === "ar" ? "تم التحقق المشترك! بانتظار تصديق الهوية الثنائية للمستخدم..." : "Security handshake approved! Awaiting dynamic OTP confirmation..." }
    ];

    intervals.forEach((stepItem, idx) => {
      setTimeout(() => {
        setSecureProgress(stepItem.p);
        setGatewayStatus(stepItem.s);
        if (stepItem.p === 100) {
          setTimeout(() => {
            setStep("otp");
          }, 800);
        }
      }, (idx + 1) * 1000);
    });
  };

  const handleOtpVerify = () => {
    if (otpInput !== "1234") {
      setOtpError(lang === "ar" ? "رمز التحقق الثنائي غير صحيح! يرجى الاستعانة بالرمز المؤقت الافتراضي الموحد (1234)" : "Incorrect OTP! Use the universal simulated code (1234)");
      return;
    }

    setOtpError("");
    executePaymentCommit();
  };

  const executePaymentCommit = () => {
    if (!selectedRecord) return;

    const txnId = "SGU-TXN-" + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toISOString().split("T")[0];
    const chosenMethodLabel = 
      paymentMethod === "card" 
        ? `${cardBrand === "visa" ? "Visa" : "Mastercard"} *${cardNo.substring(cardNo.length - 4)}` 
        : paymentMethod === "fawry" 
          ? `فوري / Fawry Ref: ${fawryRef}` 
          : "محفظة InstaPay الرقمية";

    // Update Finance state
    setFinance(prev => prev.map(rec => {
      if (rec.id === selectedRecord.id) {
        return {
          ...rec,
          paid: true,
          paymentDate: today,
          paymentMethod: chosenMethodLabel
        };
      }
      return rec;
    }));

    // Generate Sha256 styled Signature
    const rawData = `${txnId}|${selectedRecord.amount}|${today}|${selectedRecord.description}`;
    const hashSig = "SGU_SHA256_" + btoa(rawData).substring(0, 24).toUpperCase();

    const finalizedReceipt = {
      id: txnId,
      description: selectedRecord.description,
      amount: selectedRecord.amount,
      date: today,
      method: chosenMethodLabel,
      hash: hashSig
    };

    setReceipt(finalizedReceipt);
    setStep("success");

    // Push local alerts & notification
    triggerSystemPush(
      lang === "ar" ? "💳 نجاح السداد الإلكتروني" : "💳 Dynamic Payment Confirmed",
      lang === "ar" 
        ? `تم استلام دفعة مالية بقيمة ${selectedRecord.amount} ج.م لـ [${selectedRecord.description}]. الإيصال: ${txnId}`
        : `Successfully processed ${selectedRecord.amount} EGP for [${selectedRecord.description}]. Receipt: ${txnId}`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const totalDues = finance.filter(f => !f.paid).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Top Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-right space-y-1">
          <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5 justify-end">
            <Lock className="w-4 h-4 text-emerald-400" />
            {lang === "ar" ? "بوابة الخدمات والمدفوعات الإلكترونية المعتمدة" : "SGU Secure Financial & Payments Gateway"}
          </h3>
          <p className="text-[11px] text-slate-400">
            {lang === "ar" 
              ? "مدد دفع آمنة مشفرة متصلة بثلاثة جدران نارية لحفظ بيانات بطاقتك وتحديث ملفك الأكاديمي فورياً." 
              : "SSL Secured tunnel conforming to PCI-DSS standards for real-time university database balance resolution."}
          </p>
        </div>

        <div className="bg-slate-950 px-5 py-3 rounded-xl border border-slate-850 text-right shrink-0">
          <p className="text-[10px] text-slate-500 font-bold">{lang === "ar" ? "إجمالي المطالبات الأكاديمية المستحقة" : "Total Outstanding Academic Fees"}</p>
          <p className="text-xl font-black text-rose-455 font-mono">
            {totalDues.toLocaleString()} <span className="text-xs text-slate-400">ج.م | EGP</span>
          </p>
        </div>
      </div>

      {step === "select" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active unpaid claims */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1.5">
              <span>{lang === "ar" ? "الفواتير والمطالبات المالية النشطة" : "Active Academic Claims"}</span>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            </h4>

            <div className="space-y-3">
              {finance.filter(f => !f.paid).length === 0 ? (
                <div className="bg-emerald-950/10 border border-emerald-900/35 p-8 rounded-xl text-center space-y-2.5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-200 font-bold">
                    {lang === "ar" ? "أنت مسدد بالكامل! لا توجد مطالبات مالية معلقة حالياً." : "All bills paid! No outstanding claims."}
                  </p>
                </div>
              ) : (
                finance.filter(f => !f.paid).map(rec => (
                  <div key={rec.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-slate-700">
                    <div className="text-right space-y-1">
                      <span className="text-[10px] uppercase font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-rose-455">
                        {rec.category === "tuition" ? (lang === "ar" ? "رسوم دراسية" : "Tuition") : 
                         rec.category === "housing" ? (lang === "ar" ? "سكن جامعي" : "Housing") :
                         rec.category === "lab" ? (lang === "ar" ? "معامل علمية" : "Labs") : (lang === "ar" ? "أنشطة ومرافق" : "Activity")}
                      </span>
                      <h5 className="text-xs font-bold text-slate-200">{rec.description}</h5>
                      <div className="flex gap-4 items-center justify-end text-[10px] text-slate-500 font-mono">
                        <span>{lang === "ar" ? `تاريخ الاستحقاق: ${rec.dueDate}` : `Due Value: ${rec.dueDate}`}</span>
                        <span>|</span>
                        <span>ID: {rec.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between border-t border-slate-800 sm:border-0 pt-3 sm:pt-0">
                      <p className="font-mono text-xs font-extrabold text-slate-100">
                        {rec.amount.toLocaleString()} ج.م
                      </p>
                      <button
                        onClick={() => {
                          setSelectedRecord(rec);
                          setStep("pay");
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-lg transition"
                      >
                        {lang === "ar" ? "سدد الفاتورة الآن" : "Settle Balance"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Secured payments history log */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 text-right">{lang === "ar" ? "إيصالات السداد المؤرشفة" : "Payment Ledger History"}</h4>
            
            <div className="bg-slate-900 p-4.5 rounded-xl border border-slate-800 space-y-3">
              {finance.filter(f => f.paid).length === 0 ? (
                <p className="text-[11px] text-slate-505 text-center py-6">{lang === "ar" ? "لا توجد مدفوعات مؤرشفة." : "No archived receipts."}</p>
              ) : (
                finance.filter(f => f.paid).map(rec => (
                  <div key={rec.id} className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2 text-right">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/40">
                        {lang === "ar" ? "مكتمل وسدد" : "Settled"}
                      </span>
                      <h6 className="text-[11px] font-bold text-slate-300">{rec.description}</h6>
                    </div>
                    <div className="border-t border-slate-900 pt-2 flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-mono text-[9px]">{rec.paymentDate}</span>
                      <span className="font-mono text-emerald-300 font-bold">{rec.amount.toLocaleString()} ج.م</span>
                    </div>
                    <p className="text-[8px] text-slate-600 font-mono text-left truncate">{rec.paymentMethod}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pay Form Screen */}
      {step === "pay" && selectedRecord && (
        <div className="bg-slate-905 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="bg-slate-900 px-5 py-4 border-b border-slate-800 flex justify-between items-center flex-row-reverse">
            <h4 className="text-sm font-extrabold text-slate-100">{lang === "ar" ? "تأصيل تسوية الفاتورة إلكترونياً" : "Settle Academic Claim"}</h4>
            <button
              onClick={() => {
                setStep("select");
                setSelectedRecord(null);
              }}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
            {/* Method Selectors */}
            <div className="md:col-span-5 space-y-4 text-right">
              <span className="text-xs font-bold text-slate-400">{lang === "ar" ? "اختر بوابة وممر السداد الملائم:" : "Select Payment Gateway:"}</span>
              
              <div className="space-y-2.5">
                {/* Visual Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-4 rounded-xl border text-right transition flex items-center justify-between cursor-pointer ${
                    paymentMethod === "card" 
                      ? "bg-slate-900 border-emerald-500 shadow shadow-emerald-500/10" 
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-emerald-400" : "text-slate-500"}`} />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-200">{lang === "ar" ? "بطاقة دفع ائتمانية (فورا/فيزا)" : "Credit Card (Visa/Mastercard)"}</p>
                    <p className="text-[10px] text-slate-500">{lang === "ar" ? "بوابة بنك المقاصة المركزي المشفرة" : "PCI-DSS Compliant Handshake Network"}</p>
                  </div>
                </button>

                {/* Fawry Pay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("fawry")}
                  className={`w-full p-4 rounded-xl border text-right transition flex items-center justify-between cursor-pointer ${
                    paymentMethod === "fawry" 
                      ? "bg-slate-900 border-emerald-500 shadow shadow-emerald-500/10" 
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Clock className={`w-5 h-5 ${paymentMethod === "fawry" ? "text-emerald-400" : "text-slate-500"}`} />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-200">{lang === "ar" ? "شبكة فوري للمدفوعات الطائرة" : "Fawry Gateway"}</p>
                    <p className="text-[10px] text-slate-500">{lang === "ar" ? "إصدار رمز سداد فوري موجه لأي كشك" : "Get 9-digit payment reference code"}</p>
                  </div>
                </button>

                {/* SGU Smart Wallet Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`w-full p-4 rounded-xl border text-right transition flex items-center justify-between cursor-pointer ${
                    paymentMethod === "wallet" 
                      ? "bg-slate-900 border-emerald-500 shadow shadow-emerald-500/10" 
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <QrCode className={`w-5 h-5 ${paymentMethod === "wallet" ? "text-emerald-400" : "text-slate-500"}`} />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-200">{lang === "ar" ? "محفظة InstaPay وتطبيق الهاتف" : "InstaPay / Mobile Wallet QR"}</p>
                    <p className="text-[10px] text-slate-500">{lang === "ar" ? "تخليص وتحويل لحظي عبر الرمز المالي" : "Instant payment resolution via wallet QR"}</p>
                  </div>
                </button>
              </div>

              {/* Outstanding claim summary banner */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1.5 pt-3">
                <span className="text-[10px] text-slate-500 font-bold">{lang === "ar" ? "الفاتورة المحددة" : "Bill Summary"}</span>
                <p className="text-xs font-extrabold text-slate-200">{selectedRecord.description}</p>
                <div className="border-t border-slate-900 pt-2 mt-2 flex justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-extrabold">{selectedRecord.amount.toLocaleString()} ج.م</span>
                  <span className="text-slate-500">{lang === "ar" ? "القيمة الصافية" : "Subtotal"}</span>
                </div>
              </div>
            </div>

            {/* Input Details Grid */}
            <div className="md:col-span-7 bg-slate-950/30 p-5 rounded-2xl border border-slate-852 flex flex-col justify-between">
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  {/* Virtual card UI visualization */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border border-slate-800 p-5 rounded-2xl relative overflow-hidden h-40 space-y-3 text-right">
                    <div className="absolute top-2 left-2 flex items-center justify-center p-1 bg-white/5 rounded backdrop-blur">
                      <Lock className="w-4 h-4 text-emerald-400" />
                    </div>

                    <div className="flex justify-between items-center flex-row-reverse border-b border-white/5 pb-2">
                      <p className="text-[13px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-250">SGU SMART CARD</p>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{cardBrand}</span>
                    </div>

                    <p className="text-lg font-mono text-slate-100 tracking-widest leading-none mt-2 text-left font-semibold">
                      {cardNo || "•••• •••• •••• ••••"}
                    </p>

                    <div className="flex justify-between items-center text-[10px] uppercase font-mono text-slate-400 pt-2 flex-row-reverse">
                      <div className="text-right">
                        <p className="text-[8px] text-slate-500">Holder Name</p>
                        <p className="font-semibold text-slate-300 truncate max-w-[150px]">{cardHolder || "YOUSSEF EL KURY"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-500">Expiry</p>
                        <p className="font-semibold text-slate-300">{cardExpiry || "MM/YY"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-500">CVV</p>
                        <p className="font-semibold text-slate-300">•••</p>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-3 text-right" onSubmit={(e) => { e.preventDefault(); startPaymentHandshake(); }}>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">{lang === "ar" ? "رقم بطاقة السداد (16 خانة)" : "Visa / Mastercard Number"}</label>
                      <input
                        type="text"
                        value={cardNo}
                        onChange={handleCardNoChange}
                        placeholder="4211 4452 7990 1205"
                        className="w-full bg-slate-900 border border-slate-800 p-2 text-center text-xs text-slate-100 outline-none rounded-lg focus:border-emerald-500 font-mono tracking-widest"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">{lang === "ar" ? "اسم صاحب البطاقة (كما هو مدون)" : "Cardholder Name"}</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value)}
                        placeholder="YOUSSEF SHARIF EL KURY"
                        className="w-full bg-slate-900 border border-slate-800 p-2 text-center text-xs text-slate-100 outline-none rounded-lg focus:border-emerald-500 font-medium"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={handleCvvChange}
                          placeholder="•••"
                          className="w-full bg-slate-900 border border-slate-800 p-2 text-center text-xs text-slate-100 outline-none rounded-lg focus:border-emerald-500 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">{lang === "ar" ? "صلاحية البطاقة (MM/YY)" : "Expiration Date (MM/YY)"}</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="12/29"
                          className="w-full bg-slate-900 border border-slate-800 p-2 text-center text-xs text-slate-100 outline-none rounded-lg focus:border-emerald-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={startPaymentHandshake}
                      className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-slate-950 text-xs font-black py-2.5 rounded-lg transition"
                    >
                      {lang === "ar" ? "سداد آمن للرصيد الآن" : "Secure Process Transaction"}
                    </button>
                  </form>
                </div>
              )}

              {paymentMethod === "fawry" && (
                <div className="space-y-5 text-right flex flex-col justify-center items-center py-6">
                  <div className="w-16 h-16 rounded-full bg-amber-950/20 text-amber-500 flex items-center justify-center border border-amber-900/30">
                    <Clock className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5 text-center">
                    <p className="text-xs text-slate-400 font-bold">{lang === "ar" ? "تم توليد وتخصيص رمز دفع فوري الرقمي بنجاح" : "Fawry Pay Code Successfully Built"}</p>
                    <p className="text-[10px] text-slate-500">{lang === "ar" ? "توجه لأي ماكينة دفع أو كشك، وأملي رمز الخدمة (SGU-9908) ثم الرمز المرجعي التالي:" : "Confirm payment at any retail POS with code SGU-9908 & Ref number Below"}</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-xl font-mono text-center space-y-1.5 w-full">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">{lang === "ar" ? "الرقم المرجعي المؤقت لفوري" : "Fawry Reference Code"}</span>
                    <span className="text-xl font-black text-amber-400 tracking-widest">{fawryRef.replace(/(\d{3})/g, "$1 ").trim()}</span>
                  </div>

                  {/* Countdown Timer */}
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="font-mono text-amber-400">{formatFawryTime(fawryTimer)}</span>
                    <span>{lang === "ar" ? "ينتهي صلاحية هذا الرمز التلقائي بعد:" : "Ref Code expires in:"}</span>
                  </div>

                  <button
                    type="button"
                    onClick={executePaymentCommit}
                    className="w-full mt-2 bg-amber-500 hover:bg-amber-400 cursor-pointer text-slate-950 text-xs font-black py-2.5 rounded-lg transition"
                  >
                    {lang === "ar" ? "محاكاة تأكيد سداد كود فوري (للاختبار)" : "Simulate Fawry Code Paid Confirm"}
                  </button>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="space-y-4 text-right flex flex-col justify-center items-center py-4">
                  <div className="bg-white p-3 rounded-xl shadow border border-slate-300 relative">
                    <QrCode className="w-28 h-28 text-slate-900" />
                    <div className="absolute inset-0 m-auto w-8 h-8 rounded bg-slate-900 text-emerald-400 text-[10px] font-black flex items-center justify-center font-mono border border-emerald-900/30">
                      SGU
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="text-xs text-slate-200 font-extrabold">{lang === "ar" ? "تفويض وتحويل بالمقاصة اللحظية" : "InstaPay Wallet QR Resolution"}</p>
                    <p className="text-[10px] text-slate-500 leading-normal max-w-sm">
                      {lang === "ar" 
                        ? "قم بفتح تطبيق محفظتك الرقمية أو InstaPay من هاتفك الآن، وامسح الرمز المالي التلقائي الموضح أعلاه لإتمام السند الفوري."
                        : "Scan this dynamic financial code inside InstaPay or any banking companion app to wire-transfer."}
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-center w-full">
                    <span className="text-slate-500 block text-[9px] mb-1">{lang === "ar" ? "حساب المقصد المالي" : "Recipient Account alias"}</span>
                    <span className="text-emerald-400 font-bold">sgu-finance@center-eg</span>
                  </div>

                  <button
                    type="button"
                    onClick={executePaymentCommit}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-slate-950 text-xs font-black py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {lang === "ar" ? "تم سداد التحويل بالفعل (تأكيد التسوية)" : "Confirm Wire Transfer Wired"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Processing Handshake overlay screen */}
      {step === "processing" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-6 flex flex-col items-center justify-center shadow-2xl min-h-[350px]">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin"></div>
            <Lock className="w-8 h-8 text-emerald-400 absolute animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="bg-slate-950 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-mono border border-slate-850">
              {secureProgress}% SECURING TUNNEL
            </span>
            <h4 className="text-sm font-extrabold text-slate-100">{lang === "ar" ? "جاري فحص وتشفير ممر الدفع اللحظي" : "Securing Payment Gateway Handshake"}</h4>
            <p className="text-xs text-slate-400 font-medium max-w-md font-mono">{gatewayStatus}</p>
          </div>
        </div>
      )}

      {/* OTP Double Auth code step */}
      {step === "otp" && selectedRecord && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 bg-emerald-950/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-900/40 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-slate-100">
              {lang === "ar" ? "التحقق المصرفي ثنائي الأبعاد (OTP)" : "3-D Secure OTP Authentication"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === "ar" 
                ? "قام بنك التسوية بإرسال رمز أمان إلكتروني مؤقت عبر رسالة SMS لرقم هاتفك المحمول المسجل بالملف المالي لضمان هويتك." 
                : "Enter the verification password dispatching token sent to your verified mobile line."}
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              placeholder="1234"
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center text-xl font-bold font-mono tracking-[1em] text-emerald-400 outline-none w-full focus:border-emerald-500"
            />
            {otpError && <p className="text-[11px] text-rose-455 font-bold leading-normal">{otpError}</p>}
            <p className="text-[10px] text-slate-500">
              {lang === "ar" ? "(لأغراض المحاكاة والتنشيط، استخدم الرمز الافتراضي: 1234)" : "(System Simulation Token: 1234)"}
            </p>
          </div>

          <div className="flex gap-3 justify-center items-center">
            <button
              onClick={() => {
                setStep("pay");
                setOtpInput("");
              }}
              className="bg-slate-950 hover:bg-slate-850 text-slate-400 text-xs font-bold py-2 px-4 rounded-lg border border-slate-850"
            >
              {lang === "ar" ? "رجوع" : "Back"}
            </button>
            <button
              onClick={handleOtpVerify}
              className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-slate-950 text-xs font-black py-2 px-5 rounded-lg transition"
            >
              {lang === "ar" ? "تأكيد السداد" : "Authorize Payment"}
            </button>
          </div>
        </div>
      )}

      {/* Success printable receipt layout */}
      {step === "success" && receipt && (
        <div className="bg-slate-900 border border-emerald-950/70 rounded-2xl overflow-hidden shadow-2xl max-w-xl mx-auto border-t-[6px] border-t-emerald-500">
          <div className="p-8 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-950/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-900/40 mx-auto scale-110">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {lang === "ar" ? "تم السداد والتسوية الحسابية فورياً" : "Balance Settled Successfully"}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === "ar" 
                  ? "تم قيد وتأصيل إيداعك المالي إلكترونياً، وتوثيقه بنظام السجلات المشترك بجامعة الصالحية الجديدة SGU."
                  : "Transaction finalized and credited inside the ERP centralized student records ledger."}
              </p>
            </div>

            {/* Receipt Printable Card */}
            <div id="sgu-receipt-card" className="bg-slate-950 p-6 rounded-xl border border-slate-850 space-y-4 text-right font-medium relative overflow-hidden">
              {/* Background watermark */}
              <div className="absolute -bottom-8 -left-8 opacity-5 text-slate-300 pointer-events-none text-9xl">SGU</div>

              <div className="flex justify-between items-center border-b border-slate-900 pb-3 flex-row-reverse text-xs">
                <span className="font-bold text-slate-200">SGU UNIVERSITY OFFICIAL RECEIPT</span>
                <span className="font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-900/40">ORIGINAL</span>
              </div>

              <div className="space-y-2 border-b border-slate-900 pb-3">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-300">{receipt.id}</span>
                  <span className="text-slate-500">{lang === "ar" ? "رقم مرجع المعاملة:" : "Transaction ID:"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-bold">{receipt.description}</span>
                  <span className="text-slate-505">{lang === "ar" ? "بند وتخصيص الرسم:" : "Fee Settlement Item:"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-300">{receipt.date}</span>
                  <span className="text-slate-505">{lang === "ar" ? "تاريخ إيداع المدفوعة:" : "Receipt Date:"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{receipt.method}</span>
                  <span className="text-slate-505">{lang === "ar" ? "بوابة وقناة السداد:" : "Payment Processor:"}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 flex-row-reverse">
                <span className="text-slate-400 text-xs">{lang === "ar" ? "بروتوكول المقاصة الموفر" : "Cleared Net Sum"}</span>
                <span className="font-mono text-lg font-black text-emerald-400">{receipt.amount.toLocaleString()} ج.م</span>
              </div>

              {/* SHA256 secure signature string */}
              <div className="border-t border-slate-900 pt-3 flex flex-col gap-1 text-[9px] text-right font-mono text-slate-500 bg-slate-950/50 p-2 rounded">
                <span className="font-bold text-slate-400">SIGNATURE (SHA-256 DIGITAL COMPLIANCE MATRIX)</span>
                <span className="break-all tracking-wider font-semibold text-emerald-500/80 leading-normal">{receipt.hash}</span>
              </div>
            </div>

            {/* Card actions */}
            <div className="flex gap-3 justify-center items-center pt-2">
              <button
                onClick={() => {
                  setStep("select");
                  setSelectedRecord(null);
                  setReceipt(null);
                }}
                className="bg-slate-950 hover:bg-slate-850 cursor-pointer text-slate-300 text-xs font-bold py-2 px-5 rounded-lg border border-slate-850 transition"
              >
                {lang === "ar" ? "العودة للفواتير" : "Back to claims"}
              </button>

              <button
                onClick={handlePrint}
                className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-slate-950 text-xs font-black py-2 px-5 rounded-lg transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                {lang === "ar" ? "طابعة المستند" : "Print Receipt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
