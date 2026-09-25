import React from 'react';
import { SAMPLE_CASES, SampleCase } from '../data/samples';
import { Sparkles, MapPin, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { SupportedLanguage } from '../types/diagnosis';

interface SampleCarouselProps {
  language: SupportedLanguage;
  onSelectSample: (sample: SampleCase) => void;
  selectedSampleId?: string;
  isProcessing: boolean;
}

export const SampleCarousel: React.FC<SampleCarouselProps> = ({
  language,
  onSelectSample,
  selectedSampleId,
  isProcessing,
}) => {
  return (
    <div className="bg-emerald-900/5 rounded-3xl p-5 border border-emerald-800/10 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-600 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {language === 'fr'
                ? 'Cas d’école & Décisions Types (Démo 1-Clic)'
                : 'عينات فحص وسيناريوهات قرار جاهزة (عرض الهاكاثون بنقرة واحدة)'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'fr'
              ? 'Sélectionnez un cas réel avec son contexte (Wilaya, stade, symptômes) pour tester le système de décision.'
              : 'اختر عينة حقيقية بسياقها الكامل (الولاية، طور النمو، والأعراض) لمشاهدة الاستدلال والقرار الفوري.'}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
          5 حالات نموذجية
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {SAMPLE_CASES.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          return (
            <button
              key={sample.id}
              disabled={isProcessing}
              onClick={() => onSelectSample(sample)}
              className={`group text-start rounded-2xl p-3 bg-white border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:border-emerald-500 ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm bg-emerald-50/30'
                  : 'border-slate-200/80 shadow-xs'
              } ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div>
                {/* SVG Visual preview */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-slate-50 border border-slate-100 relative group-hover:scale-[1.02] transition-transform">
                  <img
                    src={sample.thumbnailSvg}
                    alt={language === 'fr' ? sample.nameFr : sample.nameAr}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1.5 inset-x-1.5 px-2 py-0.5 rounded-md bg-slate-950/75 text-white text-[10px] font-medium backdrop-blur-xs flex items-center justify-between">
                    <span>{language === 'fr' ? sample.cropFr : sample.cropAr}</span>
                    <span className="flex items-center gap-0.5 text-amber-300">
                      <MapPin className="w-2.5 h-2.5" />
                      <span className="truncate max-w-[80px]">{sample.wilaya}</span>
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1 group-hover:text-emerald-700 leading-snug">
                  {language === 'fr' ? sample.nameFr : sample.nameAr}
                </h4>

                {/* Growth stage pill */}
                <div className="text-[10px] text-slate-500 font-medium mt-1 truncate">
                  🌱 {language === 'fr' ? sample.growthStageFr : sample.growthStageAr}
                </div>

                {/* Key Decision Preview */}
                <div className="mt-2 p-1.5 rounded-lg bg-emerald-50 text-[10px] text-emerald-900 font-medium line-clamp-2 border border-emerald-100/80">
                  <span className="font-bold text-emerald-800">⚡ {language === 'fr' ? 'Décision : ' : 'القرار : '}</span>
                  {language === 'fr' ? sample.keyDecisionFr : sample.keyDecisionAr}
                </div>
              </div>

              {/* Action pill */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                <span>{language === 'fr' ? 'Simuler le cas' : 'تشخيص الحالة'}</span>
                {language === 'ar' ? (
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
