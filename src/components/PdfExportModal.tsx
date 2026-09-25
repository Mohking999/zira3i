import React, { useRef } from 'react';
import { DiagnosisData, SupportedLanguage } from '../types/diagnosis';
import {
  X,
  Printer,
  Download,
  Share2,
  Check,
  Zap,
  Ban,
  Clock,
  MapPin,
  Calendar,
  Sprout,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DiagnosisData;
  language: SupportedLanguage;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  data,
  language,
}) => {
  const [copied, setCopied] = React.useState(false);
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = language === 'fr'
      ? `🌾 *Rapport Agricole Zira3i AI* 🌾\n*Culture :* ${data.cropDetected} (${data.wilayaContext || 'Algérie'})\n*Diagnostic :* ${data.diseaseName} (${data.scientificName})\n*Action immédiate :* ${data.actionNow.headline}\n⚠️ *À éviter :* ${data.warningDoNotDo}\n📅 *Prochain contrôle :* ${data.followUpSchedule}`
      : `🌾 *تقرير القرار الزراعي — Zira3i AI* 🌾\n*المحصول :* ${data.cropDetected} (${data.wilayaContext || 'الجزائر'})\n*التشخيص :* ${data.diseaseName} (${data.scientificName})\n⚡ *الإجراء المطلوب الآن :* ${data.actionNow.headline}\n${data.actionNow.urgentSteps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}\n🛑 *تحذير هام (لا تفعل) :* ${data.warningDoNotDo}\n📅 *موعد إعادة الفحص :* ${data.followUpSchedule}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopySummary = () => {
    const text = `🌾 تقرير Zira3i AI : ${data.diseaseName}\nالمحصول: ${data.cropDetected} - ${data.wilayaContext || ''}\nالإجراء المطلوب الآن: ${data.actionNow.headline}\nتحذير: ${data.warningDoNotDo}\nإعادة الفحص: ${data.followUpSchedule}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date().toLocaleDateString(language === 'fr' ? 'fr-DZ' : 'ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* Modal Card */}
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Modal Top Action Bar (Hidden during Print) */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <Download className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'fr' ? 'Exportation du Rapport PDF' : 'تصدير وثيقة القرار الزراعي كملف PDF'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'fr' ? 'Format A4 prêt à l’impression et au partage' : 'تنسيق A4 مجهّز للطباعة المباشرة والمشاركة الميدانية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
              title="مشاركة عبر واتساب"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">واتساب</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
              title="نسخ ملخص القرار"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'fr' ? 'Imprimer / Sauvegarder PDF' : 'حفظ كـ PDF / طباعة'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Sheet Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/50 print:p-0 print:bg-white print:overflow-visible">
          
          {/* Official A4 Sheet */}
          <div
            ref={printContentRef}
            id="printable-report"
            className="bg-white mx-auto max-w-[794px] min-h-[1050px] p-8 sm:p-10 shadow-md print:shadow-none border border-slate-200/80 print:border-none print:p-6 rounded-2xl print:rounded-none text-slate-800 space-y-6"
            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          >
            
            {/* 1. Official Header */}
            <div className="border-b-2 border-emerald-700 pb-5">
              <div className="flex items-center justify-between gap-4">
                
                {/* Brand & Crest */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                    <Sprout className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="font-black text-xl text-slate-900 tracking-tight">
                      Zira3i <span className="text-emerald-700">AI</span>
                    </h1>
                    <p className="text-xs font-bold text-emerald-900">
                      {language === 'fr' ? 'Système d’Aide à la Décision Agricole' : 'نظام دعم القرار وحماية المحاصيل الفلاحية'}
                    </p>
                  </div>
                </div>

                {/* Document Metadata Box */}
                <div className="text-end text-xs space-y-1 text-slate-600 font-medium">
                  <div className="font-bold text-slate-900">
                    رقم الوثيقة: <span className="font-mono text-emerald-800">ZR-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div>التاريخ: <span className="font-semibold">{formattedDate}</span></div>
                  <div className="text-[11px] text-emerald-700 font-semibold">استدلال متعدد الوسائط (Gemini AI)</div>
                </div>

              </div>
            </div>

            {/* 2. Context Metadata Grid (F1) */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">نوع المحصول</span>
                <span className="font-bold text-slate-900 text-sm">{data.cropDetected}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">الولاية الفلاحية</span>
                <span className="font-bold text-emerald-900 text-sm">{data.wilayaContext || 'غير محددة'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">طور النمو</span>
                <span className="font-bold text-slate-800 text-sm">{data.growthStageContext || 'مرحلة خضرية'}</span>
              </div>
            </div>

            {/* 3. Primary Identification & Certainty */}
            <div className="p-4 rounded-xl border border-slate-200/90 bg-emerald-50/40 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  التشخيص والاستدلال المحتمل
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {data.diseaseName}
                </h2>
                <p className="text-xs font-mono italic text-emerald-900 font-semibold">
                  {data.scientificName}
                </p>
              </div>

              <div className="text-end shrink-0">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  data.qualitativeCertainty === 'high'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  {data.qualitativeCertainty === 'high' ? 'يقين مرتفع' : 'يقين راجح'}
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">
                  درجة الخطورة: {data.severity}
                </span>
              </div>
            </div>

            {/* 4. Supporting Evidence */}
            {data.supportingEvidence && (
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-800 text-[11px] block">الأدلة المورفولوجية والسياقية الداعمة :</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.supportingEvidence.map((ev, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                      • {ev}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CORE ACTION NOW (الإجراء المطلوب الآن) */}
            <div className="rounded-2xl p-5 bg-emerald-900 text-white shadow-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-400 text-slate-950 font-black">
                  <Zap className="w-4 h-4 fill-current" />
                </span>
                <h3 className="font-black text-base text-amber-300">
                  {data.actionNow.headline}
                </h3>
              </div>

              <div className="space-y-1.5 pt-1">
                {data.actionNow.urgentSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-emerald-50">
                    <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. WARNING "DO NOT DO" (تحذير صريح) */}
            {data.warningDoNotDo && (
              <div className="rounded-xl p-4 bg-red-50 border-2 border-red-300 text-red-950 text-xs flex items-start gap-2.5">
                <Ban className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-red-900 text-xs mb-0.5">
                    تحذير حاسم (ما يجب تجنبه فوراً لتفادي تفاقم الضرر) :
                  </strong>
                  <p className="font-semibold leading-relaxed text-red-900">
                    {data.warningDoNotDo}
                  </p>
                </div>
              </div>
            )}

            {/* 7. FOLLOW-UP SCHEDULE (موعد وإجراء إعادة الفحص) */}
            {data.followUpSchedule && (
              <div className="rounded-xl p-3.5 bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-900 block text-[11px]">
                    موعد وإجراء إعادة الفحص الميداني :
                  </strong>
                  <span className="font-medium text-amber-950">
                    {data.followUpSchedule}
                  </span>
                </div>
              </div>
            )}

            {/* 8. Dual Treatment & Management */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30">
                <span className="font-bold text-emerald-900 block mb-1.5 flex items-center gap-1">
                  <span>🌿 الحلول العضوية والبيئية :</span>
                </span>
                <ul className="space-y-1 text-slate-700 font-medium">
                  {data.treatmentOrganic.map((t, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30">
                <span className="font-bold text-amber-900 block mb-1.5 flex items-center gap-1">
                  <span>🧪 المكافحة الكيميائية (مع مراعاة DAR) :</span>
                </span>
                <ul className="space-y-1 text-slate-700 font-medium">
                  {data.treatmentChemical.map((t, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* 9. Irrigation & Fertilization */}
            <div className="grid grid-cols-2 gap-4 text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block mb-1">💧 إرشادات وجدول الري :</span>
                <p className="text-slate-700 font-medium leading-relaxed">{data.irrigationSchedule}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">🌾 توجيهات التسميد :</span>
                <p className="text-slate-700 font-medium leading-relaxed">{data.fertilizationAdvice}</p>
              </div>
            </div>

            {/* 10. Official Stamp & Disclaimer Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <div>
                <p className="font-bold text-slate-700">
                  صادر عن نظام Zira3i AI للدعم الفلاحي
                </p>
                <p>
                  ⚠️ إفصاح: وثيقة استرشادية مبنية على الذكاء الاصطناعي — لا تلغي الفحص الميداني لمفتشي حماية النباتات (INPV).
                </p>
              </div>

              <div className="border border-emerald-600/40 rounded-lg p-2 text-center text-emerald-800 font-mono text-[9px] uppercase tracking-wider bg-emerald-50/50 shrink-0">
                <span className="block font-bold">CERTIFIED DECISION</span>
                <span>ZIRA3I-ALGERIA</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50 print:hidden shrink-0">
          <span className="text-xs text-slate-500">
            💡 نصيحة: اختر "Save as PDF" أو "حفظ بتنسيق PDF" في نافذة الطباعة لاكتمال الألوان والخطوط.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              إغلاق
            </button>
            <button
              onClick={handlePrintPdf}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>تأكيد تصدير PDF</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
