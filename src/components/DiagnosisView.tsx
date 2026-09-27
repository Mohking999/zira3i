import React, { useState } from 'react';
import { DiagnosisData, SupportedLanguage, QualitativeCertainty } from '../types/diagnosis';
import { PdfExportModal } from './PdfExportModal';
import {
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  Download,
  Copy,
  Printer,
  Volume2,
  Droplets,
  Leaf,
  FlaskConical,
  Shield,
  Calendar,
  Sparkles,
  MapPin,
  Check,
  Zap,
  Ban,
  Clock,
  HelpCircle,
  Sprout,
  ShieldAlert,
  FileText,
  MessageCircle,
  Share2,
} from 'lucide-react';

interface DiagnosisViewProps {
  data: DiagnosisData;
  language: SupportedLanguage;
  soundEnabled: boolean;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({
  data,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const getCertaintyBadge = (certainty: QualitativeCertainty) => {
    switch (certainty) {
      case 'high':
        return {
          label: language === 'fr' ? 'Certitude Élevée (Preuves concordantes)' : 'درجة يقين مرتفعة (أدلة مطابقة قوية)',
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'medium':
        return {
          label: language === 'fr' ? 'Certitude Modérée (Probable)' : 'درجة يقين متوسطة (تشخيص راجح)',
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
        };
      default:
        return {
          label: language === 'fr' ? 'Certitude Faible (À confirmer au champ)' : 'درجة يقين منخفضة (تحتاج تأكيداً مخبرياً/ميدانياً)',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500',
        };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          label: language === 'fr' ? 'Gravité Critique' : 'خطورة حرجة جداً',
          badge: 'bg-red-600 text-white',
          border: 'border-red-600',
          bgLight: 'bg-red-50/70',
          icon: AlertOctagon,
        };
      case 'high':
        return {
          label: language === 'fr' ? 'Gravité Élevée' : 'خطورة مرتفعة',
          badge: 'bg-orange-600 text-white',
          border: 'border-orange-500',
          bgLight: 'bg-orange-50/70',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          label: language === 'fr' ? 'Gravité Modérée' : 'خطورة متوسطة',
          badge: 'bg-amber-600 text-white',
          border: 'border-amber-500',
          bgLight: 'bg-amber-50/70',
          icon: AlertTriangle,
        };
      default:
        return {
          label: language === 'fr' ? 'Faible gravité' : 'خطورة منخفضة',
          badge: 'bg-emerald-600 text-white',
          border: 'border-emerald-500',
          bgLight: 'bg-emerald-50/70',
          icon: CheckCircle,
        };
    }
  };

  const cert = getCertaintyBadge(data.qualitativeCertainty);
  const sev = getSeverityBadge(data.severity);
  const SeverityIcon = sev.icon;

  const handleDownloadReport = () => {
    const reportText = `=====================================================
🌾 ZIRA3I AI — تقرير دعم القرار الزراعي (من الصورة إلى القرار)
تاريخ التقرير: ${new Date().toLocaleString('ar-DZ')}
=====================================================

1. سياق الحالة:
- المحصول: ${data.cropDetected}
- الولاية/المنطقة: ${data.wilayaContext || 'غير محددة'}
- طور النمو: ${data.growthStageContext || 'غير محدد'}

2. التشخيص والاستدلال:
- التشخيص المحتمل: ${data.diseaseName}
- الاسم العلمي: ${data.scientificName}
- درجة اليقين النوعية: ${cert.label}
- الأدلة الداعمة:
${data.supportingEvidence.map((e, i) => `  [+] ${e}`).join('\n')}
- مستوى الخطورة: ${sev.label}
- الظروف المشجعة: ${data.favorableConditions}

3. ⚡ الإجراء المطلوب تنفيذه الآن:
العنوان: ${data.actionNow.headline}
الخطوات العاجلة:
${data.actionNow.urgentSteps.map((s, i) => `  (${i + 1}) ${s}`).join('\n')}

4. 🛑 تحذير صريح (ما يجب تجنبه فوراً):
${data.warningDoNotDo}

5. 📅 موعد وإجراء إعادة الفحص الميداني:
${data.followUpSchedule}

6. بروتوكول العلاج والتغذية:
أ) المعاملات العضوية والبيئية:
${data.treatmentOrganic.map((t) => `  - ${t}`).join('\n')}

ب) المكافحة الكيميائية المرشّدة (عند الضرورة مع مراعاة DAR):
${data.treatmentChemical.map((t) => `  - ${t}`).join('\n')}

7. جدول وإرشادات الري:
${data.irrigationSchedule}

8. توجيهات التسميد:
${data.fertilizationAdvice}

9. تدابير الوقاية للمواسم القادمة:
${data.prevention.map((p) => `  - ${p}`).join('\n')}

10. ملاحظة المناخ الجزائري:
${data.algerianContextNote}

-----------------------------------------------------
⚠️ إفصاح قانوني وأخلاقي: هذا التقرير استرشادي لدعم القرار مبني على الذكاء الاصطناعي (AgriChat)، ولا يُغني عن الفحص الميداني للمرشد الزراعي أو المستشار الفلاحي المعتمد.
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Zira3i_Decision_${data.cropDetected.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const text = `🌾 قرار زراعي: ${data.diseaseName}\nالإجراء المطلوب الآن: ${data.actionNow.headline}\n${data.actionNow.urgentSteps.join('\n')}\nتحذير: ${data.warningDoNotDo}\nموعد الفحص القادم: ${data.followUpSchedule}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const speechText = language === 'fr'
      ? `Décision agricole pour ${data.cropDetected} : ${data.diseaseName}. Action immédiate requise : ${data.actionNow.headline}. Attention : ${data.warningDoNotDo}`
      : `قرار زراعي لمحصول ${data.cropDetected} : ${data.diseaseName}. الإجراء المطلوب تنفيذه الآن : ${data.actionNow.headline}. تحذير : ${data.warningDoNotDo}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language === 'fr' ? 'fr-FR' : 'ar-SA';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-emerald-950/5 overflow-hidden transition-all duration-300">
      
      {/* 1. Header: Context, Diagnosis, Certainty & Severity */}
      <div className={`p-6 sm:p-7 border-b border-slate-200/80 ${sev.bgLight}`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl ${sev.badge} shadow-md shrink-0`}>
              <SeverityIcon className="w-8 h-8" />
            </div>

            <div>
              {/* Context badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center gap-1">
                  <Sprout className="w-3 h-3" />
                  <span>{data.cropDetected}</span>
                </span>

                {data.wilayaContext && (
                  <span className="px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 shadow-2xs">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    <span>{data.wilayaContext}</span>
                  </span>
                )}

                {data.growthStageContext && (
                  <span className="px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-700 text-xs font-medium">
                    {data.growthStageContext}
                  </span>
                )}

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${sev.badge}`}>
                  {sev.label}
                </span>
              </div>

              {/* Disease name */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {data.diseaseName}
              </h2>
              <p className="text-xs sm:text-sm font-mono italic text-emerald-900 font-semibold mt-0.5">
                {data.scientificName}
              </p>

              {/* Qualitative Certainty Badge (PRD F3: Replaces fake %) */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-bold shadow-2xs bg-white">
                <span className={`w-2 h-2 rounded-full ${cert.dot}`}></span>
                <span className="text-slate-800">{cert.label}</span>
              </div>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer ring-2 ring-emerald-500/20"
              title="تصدير كملف PDF منظم للطباعة والمشاركة"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>{language === 'fr' ? 'Exporter PDF' : 'تصدير كملف PDF'}</span>
            </button>

            <button
              onClick={() => {
                const text = language === 'fr'
                  ? `🌾 *Rapport Zira3i AI* 🌾\n*Culture :* ${data.cropDetected} (${data.wilayaContext || 'Algérie'})\n*Diagnostic :* ${data.diseaseName}\n⚡ *Action requise :* ${data.actionNow.headline}\n⚠️ *Attention :* ${data.warningDoNotDo}\n📅 *Contrôle :* ${data.followUpSchedule}`
                  : `🌾 *تقرير القرار الزراعي — Zira3i AI* 🌾\n*المحصول :* ${data.cropDetected} (${data.wilayaContext || 'الجزائر'})\n*التشخيص :* ${data.diseaseName}\n⚡ *الإجراء المطلوب الآن :* ${data.actionNow.headline}\n🛑 *تحذير هام (لا تفعل) :* ${data.warningDoNotDo}\n📅 *موعد إعادة الفحص :* ${data.followUpSchedule}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="مشاركة عبر واتساب"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">واتساب</span>
            </button>

            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="استماع صوتي للقرار"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSpeaking ? (language === 'fr' ? 'Lecture...' : 'قراءة...') : (language === 'fr' ? 'Écouter' : 'استماع')}
              </span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="نسخ القرار"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {copied ? (language === 'fr' ? 'Copié' : 'تم النسخ') : (language === 'fr' ? 'Copier' : 'نسخ')}
              </span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="تحميل وثيقة القرار نصياً (.TXT)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">TXT</span>
            </button>
          </div>

        </div>

        {/* Supporting Evidence Chips (PRD F3) */}
        {data.supportingEvidence && data.supportingEvidence.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-slate-200/60">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              {language === 'fr' ? '🔍 Preuves diagnostiques & morphologiques :' : '🔍 الأدلة البصرية والسياقية الداعمة لهذا التشخيص :'}
            </span>
            <div className="flex flex-wrap gap-2">
              {data.supportingEvidence.map((ev, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-white/90 border border-slate-200 text-xs text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>{ev}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* 2. CORE PRD HIGHLIGHT: ACTION REQUIRED NOW (الإجراء المطلوب الآن) */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-md relative overflow-hidden border border-emerald-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
                <Zap className="w-5 h-5 fill-current" />
              </span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200 block">
                  {language === 'fr' ? 'Protocole Décisionnel Immédiat' : 'خطة القرار والتدخل الميداني'}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {data.actionNow.headline}
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {data.actionNow.urgentSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-semibold">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. CORE PRD HIGHLIGHT: WARNING "DO NOT DO" (تحذير صريح مما يجب تجنبه) */}
        {data.warningDoNotDo && (
          <div className="rounded-2xl p-5 bg-red-50 border-2 border-red-300 text-red-950 flex items-start gap-3.5 shadow-xs">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 mt-0.5 shadow-xs">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-red-900 mb-1 flex items-center gap-1.5">
                <span>{language === 'fr' ? 'Mise en garde stricte (À NE PAS FAIRE)' : 'تحذير هام ومباشر (تجنب هذا الإجراء تماماً)'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-red-900 font-medium leading-relaxed">
                {data.warningDoNotDo}
              </p>
            </div>
          </div>
        )}

        {/* 4. FOLLOW-UP SCHEDULE (موعد وإجراء إعادة الفحص) */}
        {data.followUpSchedule && (
          <div className="rounded-2xl p-4.5 bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-amber-900 mb-0.5">
                {language === 'fr' ? 'Échéancier de suivi & réévaluation au champ :' : 'موعد وإجراء إعادة الفحص الميداني :'}
              </h5>
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                {data.followUpSchedule}
              </p>
            </div>
          </div>
        )}

        {/* 5. Favorable Conditions & Pathogen Mechanism */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 space-y-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Mécanisme & Circonstances Déclenchantes :' : 'كيف حدثت الإصابة وما هي الظروف المشجعة :'}
              </h4>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-2 font-medium">
                {data.summary}
              </p>
              {data.favorableConditions && (
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700">
                  <span className="font-bold text-emerald-900">
                    {language === 'fr' ? 'Facteurs favorables : ' : 'الظروف المشجعة : '}
                  </span>
                  <span>{data.favorableConditions}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. Dual Treatment Table (Organic vs Chemical) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Organic / Mechanical */}
          <div className="bg-emerald-950/5 rounded-2xl p-5 border border-emerald-900/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {language === 'fr' ? 'Solutions Biologiques & Pratiques Agronomiques' : 'المكافحة البيولوجية والممارسات الزراعية'}
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    {language === 'fr' ? 'Préservation du sol et des auxiliaires' : 'حلول آمنة بيئياً وبدون متبقيات سمية'}
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {data.treatmentOrganic.map((treat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{treat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chemical Controlled */}
          <div className="bg-amber-950/5 rounded-2xl p-5 border border-amber-900/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-amber-600 text-white">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {language === 'fr' ? 'Intervention Chimique Raisonnée' : 'التدخل الكيميائي الموجه (عند تجاوز العتبة)'}
                  </h4>
                  <p className="text-[11px] text-amber-800 font-medium">
                    {language === 'fr' ? 'Matières actives homologuées avec respect du DAR' : 'بالمادة الفعالة مع الالتزام التام بفترة الأمان قبل الجني (DAR)'}
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {data.treatmentChemical.map((treat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{treat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* 7. Irrigation & Fertilization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4.5 bg-sky-50/60 border border-sky-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-500 text-white shrink-0 mt-0.5">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                {language === 'fr' ? 'Gestion de l’Arrosage :' : 'جدول وإرشادات الري :'}
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {data.irrigationSchedule}
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-4.5 bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                {language === 'fr' ? 'Orientation de Fertilisation :' : 'توجيهات التغذية والتسميد :'}
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {data.fertilizationAdvice}
              </p>
            </div>
          </div>
        </div>

        {/* 8. Prevention */}
        {data.prevention && data.prevention.length > 0 && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-2.5 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>{language === 'fr' ? 'Mesures de Prévention pour les prochains cycles :' : 'إجراءات الوقاية للدورات والمواسم الزراعية القادمة :'}</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.prevention.map((prev, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                  <span>{prev}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Algerian Climate Note */}
        {data.algerianContextNote && (
          <div className="rounded-2xl p-4 bg-slate-900 text-white flex items-start gap-3 shadow-xs">
            <div className="p-1.5 rounded-lg bg-white/10 text-emerald-400 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <span className="font-bold text-emerald-300 block mb-0.5">
                {language === 'fr' ? 'Contexte Régional & Météo Agricole :' : 'ملاحظة خاصة بالبيئة والمناخ الفلاحي الجزائري :'}
              </span>
              {data.algerianContextNote}
            </p>
          </div>
        )}

        {/* 10. Dedicated PDF Export & Share Action Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                <FileText className="w-4 h-4" />
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {language === 'fr' ? 'Conserver ou Partager cette Décision Agricole' : 'الاحتفاظ بوثيقة القرار الزراعي أو مشاركتها'}
              </h4>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'fr'
                ? 'Exportez une fiche PDF officielle prête à l’impression ou partagez le résumé directement avec vos collègues.'
                : 'احصل على بطاقة PDF رسمية منظمة تحتوي على التشخيص والإجراء والتحذيرات، أو شاركها مباشرة عبر واتساب مع المرشد الفلاحي.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'fr' ? 'Générer le PDF' : 'تصدير وثيقة PDF'}</span>
            </button>

            <button
              onClick={() => {
                const text = language === 'fr'
                  ? `🌾 *Rapport Zira3i AI* 🌾\n*Culture :* ${data.cropDetected} (${data.wilayaContext || 'Algérie'})\n*Diagnostic :* ${data.diseaseName}\n⚡ *Action :* ${data.actionNow.headline}\n⚠️ *Attention :* ${data.warningDoNotDo}`
                  : `🌾 *قرار Zira3i AI* 🌾\n*المحصول :* ${data.cropDetected} (${data.wilayaContext || 'الجزائر'})\n*التشخيص :* ${data.diseaseName}\n⚡ *الإجراء الآن :* ${data.actionNow.headline}\n🛑 *تحذير :* ${data.warningDoNotDo}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>واتساب</span>
            </button>
          </div>
        </div>

        {/* 11. PRD F12 MANDATORY DISCLAIMER (إفصاح دائم وأخلاقي) */}
        <div className="rounded-2xl p-4 bg-slate-100 border border-slate-300 text-slate-700 text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-900">
              {language === 'fr' ? 'Avis de non-responsabilité :' : 'إفصاح استرشادي دائم :'}
            </strong>{' '}
            {language === 'fr'
              ? 'Ce rapport est un outil d’aide à la décision agronomique généré par intelligence artificielle. Il ne remplace pas l’avis d’un ingénieur agronome ou d’un conseiller de protection des végétaux (INPV).'
              : 'هذا التقرير هو أداة ذكية استرشادية لدعم القرار الزراعي؛ ولا يُغني عن الفحص الميداني والمباشر للمهندس الزراعي أو المرشد المعتمد لدى المعهد الوطني لحماية النباتات (INPV).'}
          </p>
        </div>

      </div>

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={data}
        language={language}
      />

    </div>
  );
};
