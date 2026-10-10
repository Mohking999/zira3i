import { LocationData, WeatherData } from '../types/diagnosis';

// ─── GPS Coordinates ──────────────────────────────────────────────────────────

export async function getGPSCoordinates(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('GPS_UNSUPPORTED'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 15000, maximumAge: 600_000, enableHighAccuracy: false },
    );
  });
}

// ─── WMO Weather Codes → Description ─────────────────────────────────────────

interface WmoDesc { ar: string; fr: string; en: string }

const WMO_MAP: Record<number, WmoDesc> = {
  0:  { ar: 'سماء صافية',          fr: 'Ciel dégagé',           en: 'Clear sky' },
  1:  { ar: 'صافٍ في الغالب',      fr: 'Principalement dégagé', en: 'Mainly clear' },
  2:  { ar: 'غائم جزئياً',         fr: 'Partiellement nuageux',  en: 'Partly cloudy' },
  3:  { ar: 'غائم',                fr: 'Nuageux',                en: 'Overcast' },
  45: { ar: 'ضبابي',               fr: 'Brouillard',             en: 'Foggy' },
  48: { ar: 'ضباب كثيف جليدي',     fr: 'Brouillard givrant',     en: 'Freezing fog' },
  51: { ar: 'رذاذ خفيف',           fr: 'Bruine légère',          en: 'Light drizzle' },
  53: { ar: 'رذاذ معتدل',          fr: 'Bruine modérée',         en: 'Moderate drizzle' },
  55: { ar: 'رذاذ كثيف',           fr: 'Bruine dense',           en: 'Dense drizzle' },
  61: { ar: 'مطر خفيف',            fr: 'Pluie légère',           en: 'Slight rain' },
  63: { ar: 'مطر معتدل',           fr: 'Pluie modérée',          en: 'Moderate rain' },
  65: { ar: 'مطر غزير',            fr: 'Pluie forte',            en: 'Heavy rain' },
  66: { ar: 'مطر جليدي خفيف',      fr: 'Pluie verglaçante légère', en: 'Light freezing rain' },
  67: { ar: 'مطر جليدي غزير',      fr: 'Pluie verglaçante forte', en: 'Heavy freezing rain' },
  71: { ar: 'تساقط ثلج خفيف',      fr: 'Chute de neige légère',  en: 'Slight snow' },
  73: { ar: 'تساقط ثلج معتدل',     fr: 'Chute de neige modérée', en: 'Moderate snow' },
  75: { ar: 'ثلج كثيف',            fr: 'Neige forte',            en: 'Heavy snow' },
  80: { ar: 'زخات مطر خفيفة',      fr: 'Averses légères',        en: 'Slight showers' },
  81: { ar: 'زخات مطر معتدلة',     fr: 'Averses modérées',       en: 'Moderate showers' },
  82: { ar: 'زخات مطر عاتية',      fr: 'Averses violentes',      en: 'Violent showers' },
  95: { ar: 'عاصفة رعدية',         fr: 'Orage',                  en: 'Thunderstorm' },
  96: { ar: 'عاصفة مع بَرَد',      fr: 'Orage avec grêle',       en: 'Thunderstorm + hail' },
  99: { ar: 'عاصفة مع بَرَد غزير', fr: 'Orage avec forte grêle', en: 'Thunderstorm + heavy hail' },
};

function wmoDescription(code: number, lang: string): string {
  const keys = Object.keys(WMO_MAP).map(Number).sort((a, b) => a - b);
  let best = 0;
  for (const k of keys) { if (k <= code) best = k; }
  const d = WMO_MAP[best] ?? WMO_MAP[0];
  return lang === 'fr' ? d.fr : lang === 'en' ? d.en : d.ar;
}

// ─── Disease Risk Assessment ──────────────────────────────────────────────────

const WET_CODES = new Set([45,48,51,53,55,56,57,61,63,65,66,67,80,81,82,85,86,95,96,99]);

function assessRisk(
  temp: number, humidity: number, precipitation: number, code: number, lang: string,
): { level: 'high' | 'medium' | 'low'; reason: string } {
  const isFog      = code === 45 || code === 48;
  const isWet      = WET_CODES.has(code);
  const highHum    = humidity >= 80;
  const modhHum    = humidity >= 60;
  const fungalTemp = temp >= 13 && temp <= 27;
  const hasRain    = precipitation > 0.5;
  const hotDry     = temp > 34 && humidity < 40;

  if ((isFog || isWet || (highHum && fungalTemp)) && (hasRain || highHum)) {
    const reason = { ar: 'رطوبة عالية وحرارة مثالية — ظروف مثلى لانتشار الأمراض الفطرية الآن', fr: 'Humidité élevée + température optimale — risque fongique immédiat', en: 'High humidity + optimal temp — immediate fungal outbreak risk' };
    return { level: 'high', reason: lang === 'fr' ? reason.fr : lang === 'en' ? reason.en : reason.ar };
  }
  if (modhHum || precipitation > 0 || isWet || hotDry) {
    const reason = { ar: 'ظروف متوسطة الخطورة — راقب نباتاتك باستمرار', fr: 'Risque modéré — surveillez vos cultures', en: 'Moderate risk — monitor your crops closely' };
    return { level: 'medium', reason: lang === 'fr' ? reason.fr : lang === 'en' ? reason.en : reason.ar };
  }
  const reason = { ar: 'طقس جاف ومستقر — خطر منخفض في الوقت الحالي', fr: 'Conditions sèches et stables — faible risque fongique', en: 'Dry and stable — low disease risk currently' };
  return { level: 'low', reason: lang === 'fr' ? reason.fr : lang === 'en' ? reason.en : reason.ar };
}

// ─── Reverse Geocode (Nominatim, free, no key) ───────────────────────────────

export async function reverseGeocode(lat: number, lon: number): Promise<LocationData> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ar,fr,en`,
      { headers: { 'User-Agent': 'Zira3i-AgriApp/2.0 (plant-disease-ai)' } },
    );
    if (!res.ok) throw new Error('Nominatim error');
    const data = await res.json();
    const addr = (data.address as Record<string, string>) || {};
    const city   = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
    const region = addr.state || addr.region || addr.county || '';
    const country     = addr.country || '';
    const countryCode = (addr.country_code || '').toUpperCase();
    return {
      latitude: lat,
      longitude: lon,
      country,
      countryCode,
      region,
      city,
      displayName: [city, region, country].filter(Boolean).join(', '),
    };
  } catch {
    return {
      latitude: lat, longitude: lon,
      country: '', countryCode: '', region: '', city: '',
      displayName: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`,
    };
  }
}

// ─── Forward Geocode by name (Nominatim) ─────────────────────────────────────
// Used when user types a location manually and wants weather without GPS

export async function geocodeByName(
  query: string
): Promise<{ lat: number; lon: number; locationData: LocationData } | null> {
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&accept-language=ar,fr,en`,
      { headers: { 'User-Agent': 'Zira3i-AgriApp/2.0 (plant-disease-ai)' } },
    );
    if (!res.ok) return null;
    const results = await res.json() as Array<{ lat: string; lon: string }>;
    if (!results.length) return null;
    const lat = parseFloat(results[0].lat);
    const lon = parseFloat(results[0].lon);
    const locationData = await reverseGeocode(lat, lon);
    return { lat, lon, locationData };
  } catch {
    return null;
  }
}

// ─── Weather Fetch (Open-Meteo, free, no key) ────────────────────────────────
// Note: Open-Meteo v1 API renamed fields to wind_speed_10m and weather_code.
// We request both naming conventions and fall back gracefully.

export async function fetchWeather(lat: number, lon: number, lang = 'ar'): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=auto&wind_speed_unit=kmh`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('Network error — cannot reach Open-Meteo');
  }

  if (!res.ok) {
    throw new Error(`Open-Meteo API error: HTTP ${res.status}`);
  }

  const data = await res.json();
  // current is the v1 wrapper; fall back to current_weather for legacy responses
  const c = (data.current ?? data.current_weather ?? {}) as Record<string, number>;

  // Support both new (wind_speed_10m, weather_code) and legacy (windspeed_10m, weathercode) field names
  const temperature   = Math.round(c['temperature_2m']        ?? c['temperature']         ?? 20);
  const humidity      = Math.round(c['relative_humidity_2m']  ?? c['relativehumidity_2m'] ?? 50);
  const precipitation =             c['precipitation']        ?? 0;
  const windSpeed     = Math.round(c['wind_speed_10m']        ?? c['windspeed_10m']        ?? 0);
  const weatherCode   = Math.round(c['weather_code']          ?? c['weathercode']          ?? 0);

  const weatherDescription = wmoDescription(weatherCode, lang);
  const risk = assessRisk(temperature, humidity, precipitation, weatherCode, lang);

  return {
    temperature,
    humidity,
    precipitation,
    windSpeed,
    weatherCode,
    weatherDescription,
    diseaseRiskLevel: risk.level,
    diseaseRiskReason: risk.reason,
  };
}
