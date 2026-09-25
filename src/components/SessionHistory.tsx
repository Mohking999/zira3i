import React from 'react';
import { History, Clock, ArrowLeft, ArrowRight, Trash2, ShieldAlert } from 'lucide-react';
import { DiagnosisData, SupportedLanguage } from '../types/diagnosis';

interface SessionHistoryProps {
  history: DiagnosisData[];
  onSelect: (item: DiagnosisData) => void;
  onClear: () => void;
  language: SupportedLanguage;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  history,
  onSelect,
  onClear,
  language,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-8">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {language === 'fr' ? 'Historique de la session' : 'سجل تشخيصات الجلسة الحالية'}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
            {history.length}
          </span>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Effacer l’historique' : 'مسح السجل'}</span>
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {history.map((item, index) => {
          return (
            <button
              key={item.id || index}
              onClick={() => onSelect(item)}
              className="shrink-0 w-64 text-start bg-slate-50 hover:bg-emerald-50/50 p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-500">
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {item.cropDetected}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'الآن'}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-emerald-800">
                {item.diseaseName}
              </h4>
              <p className="text-[11px] text-slate-500 italic truncate mt-0.5">
                {item.scientificName}
              </p>
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-semibold text-emerald-800">
                <span>
                  {item.qualitativeCertainty === 'high'
                    ? (language === 'fr' ? 'Certitude élevée' : 'يقين مرتفع')
                    : item.qualitativeCertainty === 'medium'
                    ? (language === 'fr' ? 'Certitude modérée' : 'يقين راجح')
                    : (language === 'fr' ? 'À vérifier' : 'يحتاج تأكيداً')}
                </span>
                {language === 'ar' ? (
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
