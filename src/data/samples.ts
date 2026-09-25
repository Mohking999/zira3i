export interface SampleCase {
  id: string;
  nameAr: string;
  nameFr: string;
  cropAr: string;
  cropFr: string;
  cropKey: string;
  wilaya: string;
  growthStageAr: string;
  growthStageFr: string;
  growthStageKey: string;
  descriptionAr: string;
  descriptionFr: string;
  thumbnailSvg: string;
  mockSymptoms: string[];
  keyDecisionAr: string;
  keyDecisionFr: string;
}

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'potato-blight',
    nameAr: 'لفحة البطاطس المتأخرة (الميلديو)',
    nameFr: 'Mildiou de la pomme de terre',
    cropAr: 'بطاطس',
    cropFr: 'Pomme de terre',
    cropKey: 'potato',
    wilaya: 'عين الدفلى',
    growthStageAr: 'النمو الخضري وتدرّن البطاطا',
    growthStageFr: 'Tubérisation & Végétation',
    growthStageKey: 'vegetative',
    descriptionAr: 'بقع بنية داكنة وزيتية على أطراف أوراق البطاطس مع تعفن خفيف في الساق بعد ليلة رطبة وضبابية.',
    descriptionFr: 'Taches foliaires brunes huileuses avec feutrage blanchâtre en sous-face après une période pluvieuse.',
    mockSymptoms: ['بقع زيتية داكنة', 'زغب أبيض على السطح السفلي', 'اسوداد عنق الورقة'],
    keyDecisionAr: 'إيقاف السقي فوراً وتطبيق مبيد جهازي علاجي خلال 48 ساعة لمنع وصول الفطر للدرنات',
    keyDecisionFr: 'Arrêt immédiat de l’arrosage et traitement bloquant curatif sous 48h',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="100%" height="100%">
      <defs>
        <radialGradient id="leafGrad" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stop-color="%234ade80" />
          <stop offset="60%" stop-color="%2316a34a" />
          <stop offset="100%" stop-color="%2314532d" />
        </radialGradient>
        <radialGradient id="blight" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stop-color="%23451a03" />
          <stop offset="70%" stop-color="%2378350f" />
          <stop offset="100%" stop-color="%23b45309" stop-opacity="0.8" />
        </radialGradient>
      </defs>
      <rect width="320" height="240" fill="%23f0fdf4" rx="16"/>
      <path d="M160 220 C160 170 155 120 150 40" stroke="%2315803d" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M150 140 C90 120 60 70 95 35 C130 5 180 50 150 140 Z" fill="url(%23leafGrad)" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.15))" />
      <path d="M155 180 C220 160 250 100 220 65 C185 30 140 85 155 180 Z" fill="url(%23leafGrad)" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.15))" />
      <path d="M125 80 Q105 60 85 55" stroke="%2386efac" stroke-width="2" fill="none"/>
      <path d="M185 125 Q210 100 230 90" stroke="%2386efac" stroke-width="2" fill="none"/>
      <path d="M85 45 C75 55 70 70 85 80 C100 90 115 75 110 60 C105 45 95 38 85 45 Z" fill="url(%23blight)"/>
      <path d="M195 85 C180 95 185 115 200 125 C215 130 235 115 225 95 C215 80 205 78 195 85 Z" fill="url(%23blight)"/>
      <circle cx="102" cy="70" r="14" fill="%23292524" opacity="0.85"/>
      <circle cx="208" cy="108" r="18" fill="%23292524" opacity="0.85"/>
      <circle cx="102" cy="70" r="19" stroke="%23f1f5f9" stroke-dasharray="3 3" stroke-width="2" fill="none" opacity="0.9"/>
      <circle cx="208" cy="108" r="23" stroke="%23f1f5f9" stroke-dasharray="3 3" stroke-width="2" fill="none" opacity="0.9"/>
      <rect x="16" y="16" width="130" height="26" rx="8" fill="%23dc2626" opacity="0.9"/>
      <text x="81" y="33" fill="white" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Phytophthora (خطر)</text>
    </svg>`,
  },
  {
    id: 'tomato-powdery-mildew',
    nameAr: 'البياض الدقيقي على الطماطم',
    nameFr: 'Oïdium de la tomate',
    cropAr: 'طماطم',
    cropFr: 'Tomate',
    cropKey: 'tomato',
    wilaya: 'بسكرة',
    growthStageAr: 'التزهير وعقد الثمار',
    growthStageFr: 'Floraison & Nouaison',
    growthStageKey: 'flowering',
    descriptionAr: 'طبقة تشبه الطحين الأبيض تغطي السطح السفلي لأوراق الطماطم تحت الدفيئة مع اصفرار وتقوس الحواف.',
    descriptionFr: 'Poudre blanche cotonneuse sous les feuilles de tomates de serres avec jaunissement périphérique.',
    mockSymptoms: ['بودرة دقيقية بيضاء', 'اصفرار بين العروق', 'التفاف الأوراق للأعلى'],
    keyDecisionAr: 'فتح تهوية البيوت المحمية صباحاً ورش كبريت ميكروني عند المغيب (تجنب الرش وقت الظهيرة)',
    keyDecisionFr: 'Aérer les serres et traiter au soufre mouillable au coucher du soleil',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="100%" height="100%">
      <defs>
        <radialGradient id="tLeaf" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="%2322c55e" />
          <stop offset="70%" stop-color="%2315803d" />
          <stop offset="100%" stop-color="%2314532d" />
        </radialGradient>
      </defs>
      <rect width="320" height="240" fill="%23fefce8" rx="16"/>
      <path d="M160 230 C155 180 165 100 160 30" stroke="%2315803d" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M160 150 C120 140 80 110 70 85 C85 80 100 85 95 65 C110 65 125 75 120 55 C135 55 150 65 160 40 C170 65 185 55 200 55 C195 75 210 65 225 65 C220 85 235 80 250 85 C240 110 200 140 160 150 Z" fill="url(%23tLeaf)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.12))"/>
      <path d="M100 80 Q130 90 120 115 Q90 110 100 80 Z" fill="%23eab308" opacity="0.6"/>
      <path d="M190 75 Q215 90 205 120 Q175 110 190 75 Z" fill="%23eab308" opacity="0.6"/>
      <ellipse cx="115" cy="95" rx="22" ry="16" fill="%23ffffff" opacity="0.88" filter="blur(2px)"/>
      <ellipse cx="195" cy="98" rx="26" ry="18" fill="%23ffffff" opacity="0.88" filter="blur(2px)"/>
      <circle cx="155" cy="75" r="14" fill="%23ffffff" opacity="0.75" filter="blur(1px)"/>
      <circle cx="140" cy="115" r="10" fill="%23ffffff" opacity="0.8" filter="blur(1px)"/>
      <circle cx="215" cy="185" r="24" fill="%23ef4444" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))"/>
      <path d="M215 161 L211 155 L219 155 Z" fill="%2315803d"/>
      <rect x="16" y="16" width="135" height="26" rx="8" fill="%23f59e0b" opacity="0.95"/>
      <text x="83" y="33" fill="white" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Oïdium (بياض دقيقي)</text>
    </svg>`,
  },
  {
    id: 'wheat-rust',
    nameAr: 'صدأ القمح الأصفر (الرويّة)',
    nameFr: 'Rouille jaune du blé',
    cropAr: 'قمح',
    cropFr: 'Blé',
    cropKey: 'wheat',
    wilaya: 'سطيف',
    growthStageAr: 'الاستطالة وخروج السنابل',
    growthStageFr: 'Montaison & Épiaison',
    growthStageKey: 'flowering',
    descriptionAr: 'بثور صفراء برتقالية مصفوفة على أوراق القمح في مرحلة السنبلة تترك بودرة صفراء عند اللمس.',
    descriptionFr: 'Lignées de pustules orangées le long des nervures des feuilles de blé dur.',
    mockSymptoms: ['بثور خطية برتقالية', 'بودرة الصدأ على الأصابع', 'جفاف الورقة العلمية'],
    keyDecisionAr: 'معاينة عتبة 5% والرش العاجل بتيبوكونازول خلال 48 ساعة لحماية الورقة العلمية والسنبلة',
    keyDecisionFr: 'Traitement urgent au Tébuconazole pour protéger la feuille paniculaire',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="100%" height="100%">
      <rect width="320" height="240" fill="%23ecfdf5" rx="16"/>
      <path d="M120 230 C125 150 140 80 185 20 C155 70 145 150 135 230 Z" fill="%2384cc16"/>
      <path d="M160 230 C165 140 180 70 240 30 C195 80 185 160 175 230 Z" fill="%2365a30d"/>
      <path d="M70 230 L110 50" stroke="%23ca8a04" stroke-width="4"/>
      <ellipse cx="110" cy="50" rx="10" ry="25" fill="%23eab308" transform="rotate(-15 110 50)"/>
      <ellipse cx="102" cy="70" rx="9" ry="20" fill="%23eab308" transform="rotate(-15 102 70)"/>
      <ellipse cx="94" cy="90" rx="9" ry="20" fill="%23eab308" transform="rotate(-15 94 90)"/>
      <g stroke="%23ea580c" stroke-width="3" stroke-linecap="round">
        <line x1="148" y1="90" x2="152" y2="105" />
        <line x1="147" y1="112" x2="150" y2="128" />
        <line x1="145" y1="135" x2="148" y2="152" />
        <line x1="143" y1="160" x2="146" y2="178" />
        <line x1="154" y1="85" x2="157" y2="100" stroke="%23f59e0b" stroke-width="4"/>
        <line x1="153" y1="108" x2="156" y2="124" stroke="%23f59e0b" stroke-width="4"/>
        <line x1="151" y1="130" x2="154" y2="148" stroke="%23f59e0b" stroke-width="4"/>
        <line x1="185" y1="95" x2="188" y2="115" />
        <line x1="184" y1="122" x2="187" y2="140" />
        <line x1="182" y1="148" x2="185" y2="168" />
      </g>
      <rect x="16" y="16" width="130" height="26" rx="8" fill="%23ea580c" opacity="0.95"/>
      <text x="81" y="33" fill="white" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Puccinia (صدأ القمح)</text>
    </svg>`,
  },
  {
    id: 'olive-peacock',
    nameAr: 'عين الطاووس في الزيتون',
    nameFr: 'Œil de paon de l’olivier',
    cropAr: 'زيتون',
    cropFr: 'Olivier',
    cropKey: 'olive',
    wilaya: 'تيزي وزو',
    growthStageAr: 'النشاط الربيعي وانتفاخ البراعم',
    growthStageFr: 'Débourrement printanier',
    growthStageKey: 'vegetative',
    descriptionAr: 'بقع دائرية زيتونية محاطة بهالة صفراء كأنها عين ريشة الطاووس مع تساقط الأوراق السفلية للغصن.',
    descriptionFr: 'Taches foliaires concentriques caractéristiques avec halo jaunâtre causant la défoliation.',
    mockSymptoms: ['بقع دائرية محاطة بهالة', 'تساقط الأوراق القاعدية', 'تعري الأغصان المثمرة'],
    keyDecisionAr: 'جدولة تقليم تهوية وجمع الأوراق المتساقطة ورش مركب نحاسي وقائي بعد توقف الأمطار',
    keyDecisionFr: 'Taille d’aération et pulvérisation cuprique dès l’arrêt des pluies',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="100%" height="100%">
      <rect width="320" height="240" fill="%23f7fee7" rx="16"/>
      <path d="M50 210 Q140 160 270 90" stroke="%23713f12" stroke-width="6" stroke-linecap="round"/>
      <path d="M120 170 C90 140 90 90 120 70 C150 90 150 140 120 170 Z" fill="%234d7c0f" transform="rotate(-30 120 120)"/>
      <path d="M180 135 C150 105 150 55 180 35 C210 55 210 105 180 135 Z" fill="%233f6212" transform="rotate(25 180 85)"/>
      <path d="M210 120 C180 90 190 40 230 25 C260 50 250 100 210 120 Z" fill="%234d7c0f"/>
      <ellipse cx="140" cy="180" rx="9" ry="13" fill="%231e293b" transform="rotate(15 140 180)"/>
      <ellipse cx="155" cy="190" rx="9" ry="13" fill="%23334155" transform="rotate(-10 155 190)"/>
      <circle cx="105" cy="115" r="16" fill="%23ca8a04" opacity="0.9"/>
      <circle cx="105" cy="115" r="11" fill="%231e3a1e"/>
      <circle cx="105" cy="115" r="5" fill="%23a16207"/>
      <circle cx="225" cy="65" r="18" fill="%23eab308" opacity="0.95"/>
      <circle cx="225" cy="65" r="12" fill="%231e3a1e"/>
      <circle cx="225" cy="65" r="6" fill="%23a16207"/>
      <rect x="16" y="16" width="135" height="26" rx="8" fill="%2365a30d" opacity="0.95"/>
      <text x="83" y="33" fill="white" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Spilocaea (عين الطاووس)</text>
    </svg>`,
  },
  {
    id: 'citrus-chlorosis',
    nameAr: 'اصفرار الأوراق ونقص الحديد (الحمضيات)',
    nameFr: 'Chlorose ferrique des agrumes',
    cropAr: 'حمضيات',
    cropFr: 'Agrumes',
    cropKey: 'citrus',
    wilaya: 'البليدة',
    growthStageAr: 'نمو النموات الفتية الحديثة',
    growthStageFr: 'Pousses printanières',
    growthStageKey: 'vegetative',
    descriptionAr: 'اصفرار ناصع يغطي نصل ورقة شجرة البرتقال مع بقاء العروق الرئيسية بلون أخضر داكن (نقص امتصاص الحديد في التربة الكلسية).',
    descriptionFr: 'Feuilles apicales jaunes vives avec nervures principales restant vertes (carence en fer).',
    mockSymptoms: ['اصفرار بين العروق', 'العروق خضراء داكنة', 'ضعف التزهير وتساقط النوار'],
    keyDecisionAr: 'تقليل وتيرة السقي لمنع اختناق الجذور ورش سماد ورقي بالحديد المخلبي Fe-EDTA',
    keyDecisionFr: 'Modérer l’arrosage et pulvérisation foliaire de fer chélaté',
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="100%" height="100%">
      <rect width="320" height="240" fill="%23fffbeb" rx="16"/>
      <circle cx="230" cy="170" r="32" fill="%23f97316" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))"/>
      <circle cx="220" cy="155" r="5" fill="%23fdba74" opacity="0.6"/>
      <path d="M120 220 C130 170 140 120 150 50" stroke="%2315803d" stroke-width="7" stroke-linecap="round"/>
      <path d="M140 180 C80 150 65 90 110 50 C155 10 190 70 170 140 Z" fill="%23fde047" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.12))"/>
      <path d="M140 170 C135 140 135 100 130 65" stroke="%2315803d" stroke-width="4" stroke-linecap="round"/>
      <path d="M136 145 C115 135 100 120 90 105" stroke="%23166534" stroke-width="3"/>
      <path d="M138 125 C160 115 170 100 175 85" stroke="%23166534" stroke-width="3"/>
      <path d="M134 105 C115 95 105 85 98 75" stroke="%23166534" stroke-width="2.5"/>
      <path d="M133 85 C150 78 160 70 165 60" stroke="%23166534" stroke-width="2.5"/>
      <rect x="16" y="16" width="135" height="26" rx="8" fill="%23d97706" opacity="0.95"/>
      <text x="83" y="33" fill="white" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Chlorose (نقص الحديد)</text>
    </svg>`,
  },
];
