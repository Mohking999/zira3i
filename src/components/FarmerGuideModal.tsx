import React from 'react';
import {
  X,
  Camera,
  Sprout,
  Zap,
  Volume2,
  Share2,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { SupportedLanguage } from '../types/diagnosis';

interface FarmerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onTrySample: () => void;
}

export const FarmerGuideModal: React.FC<FarmerGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  onTrySample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 backdrop-blur-xs shadow-inner">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {language === 'fr' ? 'Guide Simplifié de l’Agriculteur' : 'دليل الفلاح البسيط : كيف يعمل التطبيق؟'}
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {language === 'fr' ? 'Pas à pas' : 'خطوة بخطوة'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                {language === 'fr'
                  ? 'Vous n’avez besoin d’aucune compétence technique : prenez la photo, suivez le conseil !'
                  : 'لا تحتاج لأي خبرة في التكنولوجيا؛ صُمم هذا الدليل ليشرح لك كيف تحمي محصولك في 3 خطوات بسيطة.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800">
          
          {/* Welcome Message in Simple Words */}
          <div className="p-4.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3.5">
            <span className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 font-bold text-lg">
              👋
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-900 mb-1">
                {language === 'fr'
                  ? 'Bienvenue ! Ce service a été créé pour vous accompagner dans votre champ'
                  : 'مرحباً بك يا عمّي الفلاح! هذا التطبيق معمول خصيصاً لمساعدتك في حقلك'}
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                {language === 'fr'
                  ? 'Vous remarquez des taches sur les feuilles, un jaunissement ou un duvet blanc ? Vous n’avez pas besoin d’attendre un expert. En quelques secondes sur votre téléphone, vous saurez exactement quoi faire pour sauver votre récolte.'
                  : 'إذا لاحظت بقعاً غريبة، اصفراراً في الأوراق، أو مسحوقاً أبيض وخشيت على زرعك، لست مضطراً للانتظار أو التردد. بهاتفك فقط، ستعرف ماذا تفعل فوراً وما الذي يجب أن تتجنبه حتى لا تزيد الخسائر.'}
              </p>
            </div>
          </div>

          {/* 3 Simple Steps */}
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span>{language === 'fr' ? 'Comment utiliser l’application en 3 étapes ?' : 'كيف تستخدم التطبيق في 3 خطوات سهلة؟'}</span>
            </h3>

            <div className="space-y-4">
              
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {language === 'fr' ? '1. Prenez une photo nette de la feuille malade' : '1. صوّر الورقة المريضة بهاتفك'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {language === 'fr'
                      ? 'Approchez votre téléphone de la zone infectée (taches, jaunissement). Prenez la photo en plein jour en évitant les ombres.'
                      : 'اضغط على زر الكاميرا واقترب من الورقة أو الساق التي ظهرت عليها الأعراض (بقع، تعفن، أو اصفرار) في ضوء النهار الطبيعي.'}
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 px-2.5 py-1 rounded-lg inline-block">
                    💡 نصيحة: إذا لم تكن في الحقل الآن، يمكنك تجربة واحدة من العينات الجاهزة الموضحة في الأسفل بنقرة واحدة!
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {language === 'fr' ? '2. Choisissez votre culture et votre wilaya' : '2. اختر نوع نبتتك وولايتك بضغطة زر'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {language === 'fr'
                      ? 'Sélectionnez simplement votre plante (Pomme de terre, Tomate, Blé, Olivier...) et votre région. Cela aide à croiser avec le climat local.'
                      : 'حدد نوع المحصول (بطاطس، طماطم، قمح، زيتون...) وولايتك (عين الدفلى، بسكرة، معسكر...). هذا يساعد النظام ليعرف مناخ منطقتك والأمراض الشائعة فيها.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {language === 'fr' ? '3. Recevez la décision et le plan d’action' : '3. استلم الحل فوراً: ماذا تفعل وماذا تتجنب'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {language === 'fr'
                      ? 'L’application ne vous donne pas un nom savant incompréhensible : elle vous donne l’action à faire aujourd’hui, un avertissement clair sur ce qu’il NE faut PAS faire, et un calendrier d’arrosage.'
                      : 'لن نكتفي بذكر اسم المرض باللاتينية؛ بل سنخبرك بالخطوة العملية المباشرة: هل توقف السقي؟ ما هو الدواء العضوي أو الكيميائي المطلوب؟ وما الذي يجب أن تحذر منه (مثل عدم الرش في الشمس الحارقة).'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Special Farmer Features */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>{language === 'fr' ? 'Fonctionnalités pensées pour le terrain :' : 'ميزات مصممة خصيصاً لراحتك في الحقل :'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                <Volume2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">النطق الصوتي للنصائح :</strong>
                  إذا كنت تفضل السماع بدل القراءة، اضغط على زر "استماع" وسيقوم الهاتف بقراءة التعليمات بصوت واضح.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                <Share2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">مشاركة عبر واتساب أو PDF :</strong>
                  يمكنك إرسال التقرير بنقرة واحدة لمهندس الحماية أو لصديقك الفلاح لاستشارته.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium text-center sm:text-start">
            جاهز للاستخدام مجاناً وفوراً دون الحاجة لأي تسجيل معقد.
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
            >
              {language === 'fr' ? 'Fermer' : 'فهمت، شكراً'}
            </button>
            <button
              onClick={() => {
                onClose();
                onTrySample();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>{language === 'fr' ? 'Tester une feuille exemple' : 'جرّب فحص عينة نموذجية الآن'}</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
