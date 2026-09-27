import React, { useEffect, useState } from 'react';
import { Sprout, CheckCircle2, Globe, Sparkles, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../types/diagnosis';

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  onOpenGuide,
}) => {
  const [engineStatus, setEngineStatus] = useState<{
    aiConnected: boolean;
    model: string;
    checked: boolean;
  }>({
    aiConnected: false,
    model: 'zira3i-agri-engine',
    checked: false,
  });

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setEngineStatus({
          aiConnected: Boolean(data.aiConnected),
          model: data.model || 'zira3i-agri-engine',
          checked: true,
        });
      })
      .catch(() => {
        setEngineStatus({
          aiConnected: false,
          model: 'zira3i-agri-engine',
          checked: true,
        });
      });
  }, []);

  return (
    <header className="border-b border-emerald-900/10 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Zira3i <span className="text-emerald-700">AI</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/60 hidden sm:inline-block">
                  من الصورة إلى القرار
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium hidden md:block">
                {language === 'fr'
                  ? 'Système d’Aide à la Décision Agricole pour l’Algérie & le Maghreb'
                  : 'نظام دعم القرار الزراعي والتدخل الميداني للفلاح الجزائري والمغاربي'}
              </p>
            </div>
          </div>

          {/* Right Status & Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Engine Status Badge (PRD Requirement: Ready without API key) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-900 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>
                {engineStatus.aiConnected
                  ? 'محرك AgriChat متصل'
                  : 'محرك التشخيص الزراعي الفوري جاهز 100%'}
              </span>
            </div>

            {/* Farmer Guide Button */}
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="دليل الفلاح البسيط"
              >
                <span>📖</span>
                <span className="hidden sm:inline">
                  {language === 'fr' ? 'Guide Agriculteur' : 'دليل الفلاح'}
                </span>
              </button>
            )}

            {/* Voice Audio Readout Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'إيقاف النطق الصوتي' : 'تفعيل النطق الصوتي للمزارعين'}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                soundEnabled
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">صوت</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">صامت</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => onLanguageChange('ar')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'ar'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'fr'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
