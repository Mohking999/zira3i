import React from 'react';
import { WeatherData, LocationData, SupportedLanguage } from '../types/diagnosis';
import { MapPin, Droplets, Wind, CloudRain, AlertTriangle, CheckCircle2, Activity, Thermometer } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherData;
  location: LocationData;
  language: SupportedLanguage;
}

function getWeatherEmoji(code: number): string {
  if (code === 0)                    return '☀️';
  if (code <= 3)                     return '⛅';
  if (code === 45 || code === 48)    return '🌫️';
  if (code >= 51  && code <= 57)     return '🌦️';
  if (code >= 61  && code <= 67)     return '🌧️';
  if (code >= 71  && code <= 77)     return '❄️';
  if (code >= 80  && code <= 82)     return '🌧️';
  if (code >= 85  && code <= 86)     return '🌨️';
  return '⛈️';
}

const RISK_CONFIG = {
  high: {
    gradient: 'from-red-600 via-red-500 to-rose-600',
    badge:    'bg-red-950/40 text-red-100 border-red-400/40',
    icon:     AlertTriangle,
    labelAr:  'خطر مرتفع للأمراض الفطرية',
    labelFr:  'Risque fongique ÉLEVÉ',
    labelEn:  'HIGH Fungal Disease Risk',
  },
  medium: {
    gradient: 'from-amber-600 via-orange-500 to-amber-600',
    badge:    'bg-amber-950/40 text-amber-100 border-amber-400/40',
    icon:     Activity,
    labelAr:  'خطر متوسط — راقب نباتاتك',
    labelFr:  'Risque MODÉRÉ — Surveillez vos cultures',
    labelEn:  'MODERATE Risk — Monitor crops closely',
  },
  low: {
    gradient: 'from-emerald-600 via-teal-500 to-emerald-600',
    badge:    'bg-emerald-950/40 text-emerald-100 border-emerald-400/40',
    icon:     CheckCircle2,
    labelAr:  'خطر منخفض — طقس مستقر',
    labelFr:  'Risque faible — Conditions stables',
    labelEn:  'LOW Risk — Stable conditions',
  },
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, location, language }) => {
  const rc = RISK_CONFIG[weather.diseaseRiskLevel];
  const RiskIcon = rc.icon;
  const riskLabel = language === 'fr' ? rc.labelFr : language === 'en' ? rc.labelEn : rc.labelAr;

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${rc.gradient} text-white p-4 sm:p-5 shadow-xl shadow-black/20 overflow-hidden`}
      dir="ltr"
    >
      {/* decorative blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

      <div className="relative z-10">
        {/* Location row */}
        {location.displayName && (
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 text-white/70 shrink-0" />
            <span className="text-xs font-bold text-white/90 truncate tracking-wide">
              {location.displayName}
            </span>
            {location.countryCode && (
              <span className="ml-auto text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full tracking-widest">
                {location.countryCode}
              </span>
            )}
          </div>
        )}

        {/* Weather + Stats */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end gap-3">
            <span className="text-5xl leading-none" role="img" aria-label="weather">
              {getWeatherEmoji(weather.weatherCode)}
            </span>
            <div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black leading-none">{weather.temperature}</span>
                <span className="text-xl font-bold text-white/80 mb-0.5">°C</span>
              </div>
              <p className="text-xs text-white/75 mt-0.5 font-semibold">{weather.weatherDescription}</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="space-y-1.5 text-right shrink-0">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs font-bold text-white/90">{weather.humidity}%</span>
              <Droplets className="w-3.5 h-3.5 text-white/70" />
            </div>
            {weather.precipitation > 0 && (
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-bold text-white/90">{weather.precipitation} mm</span>
                <CloudRain className="w-3.5 h-3.5 text-white/70" />
              </div>
            )}
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs font-bold text-white/90">{weather.windSpeed} km/h</span>
              <Wind className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs font-bold text-white/90">{weather.temperature}°C</span>
              <Thermometer className="w-3.5 h-3.5 text-white/70" />
            </div>
          </div>
        </div>

        {/* Disease Risk Banner */}
        <div className={`mt-4 flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl ${rc.badge} border backdrop-blur-sm`}>
          <RiskIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-extrabold block tracking-wide">{riskLabel}</span>
            <span className="text-[11px] text-white/80 font-medium leading-snug">
              {weather.diseaseRiskReason}
            </span>
          </div>
        </div>

        {/* Data source note */}
        <p className="mt-2 text-[10px] text-white/50 text-right font-medium">
          Open-Meteo · {new Date().toLocaleTimeString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-DZ' : 'en', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
