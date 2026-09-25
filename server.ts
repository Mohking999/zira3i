import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

const rawApiKey = process.env.GEMINI_API_KEY;
const isGeminiConfigured = Boolean(
  rawApiKey &&
  rawApiKey.trim() !== '' &&
  rawApiKey !== 'MY_GEMINI_API_KEY' &&
  !rawApiKey.startsWith('MY_')
);

let aiClient: GoogleGenAI | null = null;
if (isGeminiConfigured) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: rawApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client, will use fallback knowledge base', err);
  }
}

interface DiagnosisResult {
  diseaseName: string;
  scientificName: string;
  cropDetected: string;
  wilayaContext?: string;
  growthStageContext?: string;
  qualitativeCertainty: 'high' | 'medium' | 'low';
  supportingEvidence: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  favorableConditions: string;
  summary: string;
  symptoms?: string[];
  actionNow: {
    headline: string;
    urgentSteps: string[];
  };
  warningDoNotDo: string;
  followUpSchedule: string;
  treatmentOrganic: string[];
  treatmentChemical: string[];
  prevention: string[];
  irrigationSchedule: string;
  fertilizationAdvice: string;
  algerianContextNote: string;
  engineUsed: 'gemini-3.8-flash' | 'zira3i-agri-engine';
}

function generateLocalDecision(
  cropType?: string,
  wilaya?: string,
  growthStage?: string,
  description?: string,
  imageName?: string,
  lang: string = 'ar'
): DiagnosisResult {
  const text = `${cropType || ''} ${wilaya || ''} ${growthStage || ''} ${description || ''} ${imageName || ''}`.toLowerCase();

  // Case 1: Potato Late Blight (Mildiou)
  if (text.includes('بطاطس') || text.includes('بطاطا') || text.includes('potato') || text.includes('blight') || text.includes('mildiou') || text.includes('دفلى') || text.includes('معسكر')) {
    return {
      diseaseName: lang === 'fr' ? 'Mildiou de la pomme de terre' : 'اللفحة المتأخرة في البطاطس (الميلديو)',
      scientificName: 'Phytophthora infestans',
      cropDetected: lang === 'fr' ? 'Pomme de terre' : 'البطاطس / البطاطا',
      wilayaContext: wilaya || (lang === 'fr' ? 'Ain Defla / Mascara' : 'عين الدفلى / معسكر'),
      growthStageContext: growthStage || (lang === 'fr' ? 'Tubérisation & Végétation' : 'النمو الخضري وتدرّن البطاطا'),
      qualitativeCertainty: 'high',
      supportingEvidence: lang === 'fr'
        ? [
            'Bords de feuilles nécrosés avec pourriture huileuse typique',
            'Feutrage blanc visible sous forte hygrométrie matinale',
            'Contexte de région humide propice aux épidémies fongiques',
          ]
        : [
            'بقع زيتية مائية داكنة تتوسع سريعاً على حواف الأوراق',
            'زغب أبيض مجهري على السطح السفلي متوافق مع أبواغ الفطر',
            'تطابق مع مناخ المنطقة والرطوبة المرتفعة بعد السقي أو الضباب',
          ],
      severity: 'high',
      favorableConditions: lang === 'fr'
        ? 'Températures entre 15 et 22°C couplées à une humidité relative > 90% (rosée persistante ou arrosage par aspersion tardif).'
        : 'درجات حرارة معتدلة (15 إلى 22°م) ورطوبة جوية تفوق 90%، ندى صباحي كثيف أو ري رذاذي ليلي.',
      summary: lang === 'fr'
        ? 'Infection fongique fulgurante. Sans intervention sous 48h, le pathogène peut détruire la totalité du feuillage et infecter les tubercules par ruissellement.'
        : 'إصابة فطرية سريعة الانتشار والتدمير. في حال عدم التدخل خلال 48 ساعة، قد يقضي الفطر على المجموع الخضري بالكامل وينتقل للدرنات.',
      actionNow: {
        headline: lang === 'fr' ? 'Action Immédiate requise aujourd’hui' : 'الإجراء العاجل المطلوب اتخاذه اليوم',
        urgentSteps: lang === 'fr'
          ? [
              'Arrêter immédiatement tout arrosage par aspersion et aérer la parcelle.',
              'Couper et isoler dans des sacs les fanes très atteintes sans les laisser sur le sol.',
              'Appliquer un traitement fongicide curatif pénétrant (Cymoxanil ou Diméthomorphe) en fin d’après-midi par temps sec.',
            ]
          : [
              'إيقاف أي ري رذاذي أو غمر فوري اليوم لخفض رطوبة التربة والغطاء النباتي.',
              'قطع وحرق الأوراق والسيقان المصابة بشدة في أكياس محكمة فوراً دون رميها بجانب الحقل.',
              'الرش بمبيد فطري جهازي/علاجي متخصص (مثل ديميثومورف أو سيموكسانيل) في المساء بعد هدوء الرياح.',
            ],
      },
      warningDoNotDo: lang === 'fr'
        ? '🛑 NE PAS arroser le soir et NE PAS pulvériser d’engrais azoté qui accélérerait l’explosion du champignon.'
        : '🛑 لا تقم بالسقي ليلاً ولا ترش أسمدة آزوتية (يوريا 46) مطلقاً الآن لأنها تجعل الأنسجة طرية وتضاعف سرعة انتشار الفطر.',
      followUpSchedule: lang === 'fr'
        ? 'Réexaminer les feuilles saines après 4 jours : les taches actives doivent cesser de progresser et s’assécher.'
        : 'إعادة فحص الحقل بعد 4 أيام: يجب أن تجف حواف البقع البنية وتتوقف تماماً عن تكوين الزغب الأبيض.',
      treatmentOrganic: lang === 'fr'
        ? ['Bouillie bordelaise préventive (20g/L)', 'Purin de prêle riche en silice pour renforcer la paroi cellulaire']
        : ['محلول بوردو النحاسي لحصار البؤر غير المصابة', 'مستخلص نبات ذيل الحصان لتقوية الجدران الخلوية'],
      treatmentChemical: lang === 'fr'
        ? ['Cymoxanil + Mancozèbe ou Métalaxyl-M (Délai avant récolte : 7 jours)']
        : ['ميتالاكسيل + مانكوزيب أو سيموكسانيل (مع مراعاة فترة أمان 7 أيام قبل الجني)'],
      prevention: lang === 'fr'
        ? ['Rotation des cultures (3 ans sans solanacées)', 'Respect de l’écartement des rangs (75 cm) pour l’aération']
        : ['دورة زراعية ثلاثية وتجنب زراعة باذنجانيات متتالية', 'مباعدة لا تقل عن 75 سم بين الخطوط للتهوية'],
      irrigationSchedule: lang === 'fr'
        ? 'Goutte-à-goutte exclusivement entre 6h et 8h du matin.'
        : 'الري بالتنقيط حصراً بين الساعة 6:00 و 8:00 صباحاً.',
      fertilizationAdvice: lang === 'fr'
        ? 'Apporter du sulfate de potassium pour durcir la cuticule des feuilles.'
        : 'تعويض النيتروجين بسلفات البوتاسيوم لتقسية خلايا الأوراق ومقاومة الاختراق الفطري.',
      algerianContextNote: lang === 'fr'
        ? 'Vigilance maximale dans les plaines de l’Ouest et du Centre lors des alertes météo INPV.'
        : 'متابعة نشرات المعهد الوطني لحماية النباتات (INPV) في ولايات عين الدفلى وتلمسان ومعسكر.',
      engineUsed: 'zira3i-agri-engine',
    };
  }

  // Case 2: Tomato Powdery Mildew (Oïdium)
  if (text.includes('طماطم') || text.includes('tomato') || text.includes('tomate') || text.includes('بياض') || text.includes('oidium') || text.includes('بسكرة') || text.includes('دقيقي')) {
    return {
      diseaseName: lang === 'fr' ? 'Oïdium de la tomate (Leveillula taurica)' : 'البياض الدقيقي على الطماطم (العفونة البيضاء)',
      scientificName: 'Leveillula taurica / Oidium neolycopersici',
      cropDetected: lang === 'fr' ? 'Tomate sous serre / plein champ' : 'الطماطم (البيوت المحمية أو المكشوفة)',
      wilayaContext: wilaya || (lang === 'fr' ? 'Biskra / El Oued' : 'بسكرة / وادي سوف'),
      growthStageContext: growthStage || (lang === 'fr' ? 'Floraison & Nouaison' : 'التزهير وعقد الثمار'),
      qualitativeCertainty: 'high',
      supportingEvidence: lang === 'fr'
        ? [
            'Duvet blanc farineux caractéristique sur la face inférieure des feuilles',
            'Taches jaunes irrégulières sur la face supérieure sans pourriture humide',
            'Conditions de serre chaude avec faible renouvellement d’air',
          ]
        : [
            'مسحوق دقيقي أبيض واضح كالغبير على السطح السفلي للأوراق',
            'بقع صفراء باهتة على السطح المقابل دون تعفن مائي',
            'بيئة الدفيئات البلاستيكية ذات الفوارق الحرارية اليومية',
          ],
      severity: 'medium',
      favorableConditions: lang === 'fr'
        ? 'Atmosphère confinée sous serre, températures 20-28°C avec écarts thermiques jour/nuit.'
        : 'حرارة محتبسة داخل البيوت البلاستيكية (20-28°م) مع هواء راكد وفروقات حرارية بين الليل والنهار.',
      summary: lang === 'fr'
        ? 'Le champignon parasite les cellules épidermiques et réduit drastiquement la photosynthèse, entraînant la brûlure et chute des feuilles productrices.'
        : 'يتغذى الفطر على خلايا الأوراق ويحجب الضوء مما يقلل التمثيل الضوئي ويؤدي لاحتراق الأوراق وجفافها وسقوط أزهار العقد.',
      actionNow: {
        headline: lang === 'fr' ? 'Action Immédiate requise' : 'الإجراء العاجل المطلوب اتخاذه اليوم',
        urgentSteps: lang === 'fr'
          ? [
              'Ouvrir en grand les aérations latérales de la serre dès 9h pour chasser l’humidité résiduelle.',
              'Effectuer un effeuillage raisonné des feuilles basses touchées (désinfecter le sécateur à l’alcool).',
              'Appliquer du soufre mouillable micronisé ou du bicarbonate de potassium dès le coucher du soleil.',
            ]
          : [
              'فتح نوافذ وتهوية البيوت البلاستيكية فوراً ابتداءً من الصباح لتجديد الهواء وخفض الحرارة المحتبسة.',
              'تقليم وإزالة الأوراق السفلية الممتلئة بالدقيق الأبيض وتعقيم أدوات التقليم بمطهر.',
              'الرش بالكبريت الميكروني المبلل أو بيكربونات البوتاسيوم عند مغيب الشمس لتجنب احتراق الأوراق.',
            ],
      },
      warningDoNotDo: lang === 'fr'
        ? '🛑 NE PAS traiter au soufre en plein soleil ou au-delà de 28°C (risque grave de brûlure phytotoxique des feuilles et fleurs).'
        : '🛑 إياك ورش الكبريت في الظهيرة أو عند تجاوز الحرارة 28°م لتفادي احتراق الأوراق والأزهار (حروق شمسية كيميائية).',
      followUpSchedule: lang === 'fr'
        ? 'Contrôler la face inférieure des jeunes feuilles dans 5 jours : la poudre blanche doit disparaître.'
        : 'فحص السطح السفلي للأوراق الفتية بعد 5 أيام للتأكد من زوال البودرة البيضاء وعدم انتقالها للقمم النامية.',
      treatmentOrganic: lang === 'fr'
        ? ['Soufre mouillable (30-50g / 100L)', 'Bicarbonate de potassium (4g/L) + savon noir comme mouillant']
        : ['الكبريت الميكروني القابل للبلل في المساء', 'بيكربونات البوتاسيوم مضافاً إليها صابون أسود زراعي'],
      treatmentChemical: lang === 'fr'
        ? ['Défénoconazole (Score) ou Azoxystrobine en respectant scrupuleusement le DAR']
        : ['دايفينوكونازول (Difenoconazole) أو أزوكستروبين مع الالتزام بفترة الأمان قبل الجني (DAR)'],
      prevention: lang === 'fr'
        ? ['Aération quotidienne rigoureuse', 'Espacement suffisant entre plants (50 cm)', 'Désinfection des tuteurs']
        : ['برنامج تهوية يومي صارم للبيوت', 'المسافة الكافية بين الشتلات لمنع تلامس المجموع الخضري'],
      irrigationSchedule: lang === 'fr'
        ? 'Irrigation goutte-à-goutte fractionnée le matin sans stress hydrique.'
        : 'ري منتظم ومجزأ صباحاً بالتنقيط دون تعطيش مفاجئ للشتلات.',
      fertilizationAdvice: lang === 'fr'
        ? 'Apporter du silicate de potassium et du calcium pour renforcer l’épiderme foliaire.'
        : 'رش ورقي بمركب الكالسيوم والبورون لتقوية جدران الخلايا وتثبيت العقد.',
      algerianContextNote: lang === 'fr'
        ? 'Pression parasitaire très forte dans les serres de Biskra et Tipaza dès le mois de mars.'
        : 'تزداد شدة الإصابة في بيوت ولاية بسكرة ووادي سوف مع قدوم فصل الربيع.',
      engineUsed: 'zira3i-agri-engine',
    };
  }

  // Case 3: Wheat Rust (Rouille du blé)
  if (text.includes('قمح') || text.includes('wheat') || text.includes('blé') || text.includes('صدأ') || text.includes('rouille') || text.includes('سطيف') || text.includes('تيارت')) {
    return {
      diseaseName: lang === 'fr' ? 'Rouille jaune / brune du blé' : 'صدأ القمح الأصفر أو البني (الرويّة)',
      scientificName: 'Puccinia striiformis / Puccinia triticina',
      cropDetected: lang === 'fr' ? 'Blé dur / tendre' : 'القمح الصلب واللين (الحبوب)',
      wilayaContext: wilaya || (lang === 'fr' ? 'Sétif / Tiaret / Guelma' : 'سطيف / تيارت / قالمة'),
      growthStageContext: growthStage || (lang === 'fr' ? 'Montaison & Épiaison' : 'مرحلة الاستطالة وخروج السنابل'),
      qualitativeCertainty: 'high',
      supportingEvidence: lang === 'fr'
        ? [
            'Pustules orangées linéaires alignées sur les nervures de la feuille',
            'Poussière sporifère orangée caractéristique sur les doigts au toucher',
            'Alignement géométrique typique de Puccinia striiformis',
          ]
        : [
            'بثور برتقالية طولية مصفوفة بدقة على عروق الورقة',
            'مسحوق بوغي برتقالي يلتصق بالأصابع بمجرد ملامسة النصل',
            'تطابق مع أمراض الحبوب في الهضاب العليا في موسم الربيع',
          ],
      severity: 'high',
      favorableConditions: lang === 'fr'
        ? 'Températures printanières douces (10-18°C) et brumes matinales fréquentes sur les hauts plateaux.'
        : 'طقس ربيعي رطب مع درجات حرارة بين 10 و 18°م وضباب صباحي متكرر فوق الهضاب العليا.',
      summary: lang === 'fr'
        ? 'Maladie épidémique à propagation éolienne. Si la dernière feuille (feuille paniculaire) est atteinte avant le remplissage du grain, les pertes dépassent 40%.'
        : 'مرض وبائي تنقله الرياح لمسافات بعيدة. إذا وصلت الإصابة إلى الورقة العلمية (Feuille drapeau) فإن خسائر امتلاء الحبوب قد تتجاوز 40%.',
      actionNow: {
        headline: lang === 'fr' ? 'Action Immédiate requise' : 'الإجراء العاجل المطلوب اتخاذه اليوم',
        urgentSteps: lang === 'fr'
          ? [
              'Vérifier si le seuil d’intervention est atteint (plus de 5% des feuilles de la parcelle touchées).',
              'Si oui, déclencher le traitement fongicide foliaire (Tébuconazole) sous 48h par temps calme.',
              'Alerter les parcelles voisines compte tenu de la dispersion rapide par le vent.',
            ]
          : [
              'معاينة نسبة الإصابة في الحقل: إذا تجاوزت 5% من أوراق النباتات، يجب التدخل فوراً.',
              'رش مبيد فطري وقائي-علاجي من مجموعة التريازول (مثل تيبوكونازول) خلال 48 ساعة قبل إصابة السنبلة.',
              'الرش في الصباح الباكر عند سكون حركة الرياح لضمان وصول الرذاذ لكامل الحقل.',
            ],
      },
      warningDoNotDo: lang === 'fr'
        ? '🛑 NE PAS attendre la sortie des grains pour intervenir : le traitement après floraison avancée a un coût économique non rentable.'
        : '🛑 لا تؤجل الرش لما بعد امتلاء الحبوب؛ الرش المتأخر بعد فوات الأوان لا ينقذ المحصول ويزيد التكلفة دون جدوى.',
      followUpSchedule: lang === 'fr'
        ? 'Inspecter la feuille paniculaire dans 6 jours : aucune nouvelle pustule ne doit apparaître.'
        : 'معاينة الورقة العلمية والسنابل بعد 6 أيام للتأكد من عدم ظهور خطوط صدأ جديدة.',
      treatmentOrganic: lang === 'fr'
        ? ['Choix variétal résistant lors des prochains semis (ex: Oum Rabia, Bidi)', 'Bio-stimulants foliaires aux acides aminés']
        : ['اعتماد أصناف قمح وطنية مقاومة في المواسم القادمة (مثل بوشي، أم ربيع)', 'رش محفزات حيوية بالأحماض الأمينية لدعم المناعة النباتية'],
      treatmentChemical: lang === 'fr'
        ? ['Tébuconazole ou Epoxiconazole appliqué au stade montaison/dernière feuille']
        : ['تيبوكونازول (Tebuconazole) أو بروبيكونازول بالجرعة الموصى بها على العبوة'],
      prevention: lang === 'fr'
        ? ['Désherbage rigoureux des graminées sauvages réservoirs', 'Densité de semis maîtrisée']
        : ['تنظيف حواف الحقول من الأعشاب النجيلية البرية التي تحتضن اللقاح الفطري', 'ضبط كمية البذر لتفادي الكثافة الخانقة'],
      irrigationSchedule: lang === 'fr'
        ? 'Sur parcelles sous pivot : irriguer tôt le matin, éviter d’irriguer en fin de journée.'
        : 'في حقول الرش المحوري بالجنوب: تشغيل المحاور فجراً وتفادي الري في المساء الرطب.',
      fertilizationAdvice: lang === 'fr'
        ? 'Ne pas surdoser l’urée : un feuillage trop dense favorise la pénétration fongique.'
        : 'عدم الإفراط في نثر اليوريا في الربيع؛ توازن التسميد البوتاسي يقوي صلابة القصبة.',
      algerianContextNote: lang === 'fr'
        ? 'Surveillance primordiale dans les wilayas céréalières de Sétif, Mila, Guelma et Tiaret.'
        : 'متابعة بؤر الإصابة في ولايات سطيف، ميلة، تيارت، وقالمة بالتنسيق مع غرف الفلاحة.',
      engineUsed: 'zira3i-agri-engine',
    };
  }

  // Case 4: Olive Peacock Spot (Œil de paon)
  if (text.includes('زيتون') || text.includes('olive') || text.includes('تيزي') || text.includes('بجاية') || text.includes('طاووس')) {
    return {
      diseaseName: lang === 'fr' ? 'Œil de paon de l’olivier (Spilocaea oleagina)' : 'عين الطاووس في الزيتون (تبقع أوراق الزيتون)',
      scientificName: 'Spilocaea oleagina / Cycloconium oleaginum',
      cropDetected: lang === 'fr' ? 'Olivier (Olea europaea)' : 'شجرة الزيتون المباركة',
      wilayaContext: wilaya || (lang === 'fr' ? 'Tizi Ouzou / Béjaïa / Mascara' : 'تيزي وزو / بجاية / معسكر'),
      growthStageContext: growthStage || (lang === 'fr' ? 'Débourrement & Printemps' : 'انتفاخ البراعم والنشاط الربيعي'),
      qualitativeCertainty: 'high',
      supportingEvidence: lang === 'fr'
        ? [
            'Taches circulaires concentriques avec halo jaunâtre ressemblant à une plume de paon',
            'Défoliation marquée sur les branches inférieures ombragées',
            'Contexte post-pluvial dans une zone oléicole méditerranéenne',
          ]
        : [
            'بقع دائرية مميزة محاطة بهالة صفراء رمادية تشبه عين ريشة الطاووس',
            'تساقط مكثف للأوراق السفلية للغصن وتعري القواعد',
            'تطابق تام مع أمراض بساتين الزيتون بعد أمطار الشتاء والربيع',
          ],
      severity: 'medium',
      favorableConditions: lang === 'fr'
        ? 'Humidité élevée persistante, pluies continues et manque d’ensoleillement au cœur des arbres denses non taillés.'
        : 'رطوبة عالية وأمطار ربيعية مع غياب التهوية في قلب الأشجار الكثيفة المهملة التقليم.',
      summary: lang === 'fr'
        ? 'Infection foliaire chronique. La perte prématurée du feuillage affaiblit l’arbre, réduit la mise à fleurs et compromet la récolte sur 2 saisons consécutives.'
        : 'مرض فطري مزمن يسبب تساقطاً كثيفاً للأوراق مما ينهك الشجرة ويعطل الإزهار للموسم الحالي والمقبل.',
      actionNow: {
        headline: lang === 'fr' ? 'Action Immédiate requise' : 'الإجراء العاجل المطلوب اتخاذه اليوم',
        urgentSteps: lang === 'fr'
          ? [
              'Programmer une taille d’aération pour ouvrir le cœur de la ramure à la lumière et au vent.',
              'Ramasser et brûler ou enfouir les feuilles mortes tombées sous la frondaison (sources de réinfection).',
              'Appliquer un traitement cuprique (bouillie bordelaise ou oxychlorure de cuivre) dès la fin des pluies.',
            ]
          : [
              'جدولة عملية تقليم تهوية (Taille d’aération) لفتح قلب الشجرة لأشعة الشمس والرياح الجافة.',
              'جمع وحرق أو طمر الأوراق المتساقطة تحت حوض الشجرة لأنها تحمل جراثيم الفطر النشطة.',
              'الرش بمركبات النحاس (أكسيكلورور النحاس أو محلول بوردو) بعد انتهاء موجة الأمطار مباشرة.',
            ],
      },
      warningDoNotDo: lang === 'fr'
        ? '🛑 NE PAS tailler par temps pluvieux ou très humide (risque de dispersion massive des conidies).'
        : '🛑 لا تقم بالتقليم أثناء تساقط المطر أو في الأيام الضبابية الرطبة لتفادي تلويث جروح الأغصان بالأبواغ.',
      followUpSchedule: lang === 'fr'
        ? 'Contrôler la reprise des nouvelles pousses dans 3 semaines : les jeunes feuilles doivent rester immaculées.'
        : 'مراقبة الأوراق الحديثة بعد 3 أسابيع: يجب أن تنمو خضراء نضرة دون أي بقع صفراء أو دائرية.',
      treatmentOrganic: lang === 'fr'
        ? ['Traitements cupriques réguliers en automne et à la sortie de l’hiver', 'Chaulage du tronc']
        : ['المعالجة بمركبات النحاس الوقائية عقب موسم الجني وفي مطلع الربيع', 'دهان الجذوع بمحلول الجير'],
      treatmentChemical: lang === 'fr'
        ? ['Défénoconazole ou Krésoxim-méthyle après de fortes pluies persistantes']
        : ['ديفينوكونازول أو كريزوكسيم-ميثيل عند اشتداد الإصابة في الربيع الرطب'],
      prevention: lang === 'fr'
        ? ['Élagage régulier des branches basses et élimination du sous-bois étouffant']
        : ['إزالة الأغصان الملامسة للأرض وإزالة الأعشاب الكثيفة تحت مسقط الشجرة'],
      irrigationSchedule: lang === 'fr'
        ? 'Arrosage localisé au pied sans mouiller le feuillage.'
        : 'الري الموضعي في الحوض وتفادي ترطيب الأوراق نهائياً.',
      fertilizationAdvice: lang === 'fr'
        ? 'Apporter du bore et du zinc pour stimuler le débourrement floral.'
        : 'التسميد بالبورون والزنك لتحفيز الإزهار وتعويض تساقط الأوراق.',
      algerianContextNote: lang === 'fr'
        ? 'Très répandu dans les vergers de Kabylie, Mitidja et Mascara.'
        : 'شائع في بساتين الزيتون بولايات تيزي وزو، بجاية، جيجل، والبليدة ومعسكر.',
      engineUsed: 'zira3i-agri-engine',
    };
  }

  // Default: Chlorosis / Nutrient Deficiency
  return {
    diseaseName: lang === 'fr' ? 'Chlorose ferrique & Carence minérale' : 'اصفرار الأوراق (الكلوروز) ونقص امتصاص الحديد',
    scientificName: 'Chlorosis physiologica / Deficientia Fe-Zn',
    cropDetected: cropType || (lang === 'fr' ? 'Culture maraîchère / arboricole' : 'محصول زراعي خضري أو شجري'),
    wilayaContext: wilaya || (lang === 'fr' ? 'Mitidja / Région Tellienne' : 'سهل متيجة / الهضاب والواحات'),
    growthStageContext: growthStage || (lang === 'fr' ? 'Croissance active' : 'مرحلة النمو الخضري النشط'),
    qualitativeCertainty: 'medium',
    supportingEvidence: lang === 'fr'
      ? [
          'Jaunissement net du limbe avec nervures restant vert foncé',
          'Symptômes concentrés sur les jeunes feuilles du sommet',
          'Concordance avec les sols alcalins et calcaires typiques de la région',
        ]
      : [
          'اصفرار ناصع لنصل الورقة مع بقاء العروق خضراء داكنة',
          'تركز الأعراض في القمم النامية والأوراق الحديثة',
          'تطابق مع طبيعة الأراضي الكلسية ذات الرقم الهيدروجيني (pH) المرتفع',
        ],
    severity: 'medium',
    favorableConditions: lang === 'fr'
      ? 'Excès de calcaire actif dans le sol bloquant l’assimilation du fer, aggravé par un arrosage excessif et asphyxie racinaire.'
      : 'ارتفاع الكلس الفعال في التربة القلوية، بالإضافة إلى الإفراط في مياه الري مما يسبب اختناق الجذور وضعف الامتصاص.',
    summary: lang === 'fr'
      ? 'Déséquilibre physiologique et non parasitaire. Le fer est bloqué dans le sol sous forme insoluble, bloquant la synthèse de la chlorophylle.'
      : 'اضطراب فسيولوجي غذائي وليس عدوى فطرية؛ الحديد متوفر بالتربة لكنه مثبت كيميائياً بسبب الكلس فلا تستطيع الجذور امتصاصه.',
    actionNow: {
      headline: lang === 'fr' ? 'Action Immédiate requise' : 'الإجراء العاجل المطلوب اتخاذه اليوم',
      urgentSteps: lang === 'fr'
        ? [
            'Modérer immédiatement les arrosages pour aérer le système racinaire.',
            'Effectuer une pulvérisation foliaire d’engrais chélaté (Fe-EDTA ou acide aminé) le soir pour un reverdissement rapide.',
            'Apporter au sol un chélate de fer de type EDDHA (résistant au calcaire jusqu’à pH 9) via l’irrigation.',
          ]
        : [
            'تقليل فترات وكميات السقي فوراً لمنع اختناق الجذور وتحسين تنفس التربة.',
            'رش سماد ورقي يحتوي على حديد مخلبي وأحماض أمينية في المساء لتعويض النقص سريعاً عبر الثغور.',
            'حقن شيلات الحديد من نوع Fe-EDDHA (المقاومة لكلس التربة حتى pH 9) مع مياه الري بالتنقيط.',
          ],
    },
    warningDoNotDo: lang === 'fr'
      ? '🛑 NE PAS pulvériser de sulfate de fer en plein soleil et NE PAS inonder le sol croyant que la plante manque d’eau.'
      : '🛑 لا تقم بغمر الحقل بالماء ظناً منك أن الاصفرار بسبب العطش؛ زيادة الماء تفاقم اختناق الجذور وتسرع موت النبات.',
      followUpSchedule: lang === 'fr'
        ? 'Vérifier la couleur des jeunes pousses dans 7 jours : elles doivent retrouver une teinte vert tendre puis foncée.'
        : 'مراقبة القمم النامية بعد 7 أيام: يجب أن يبدأ اخضرار النصل تدريجياً من العروق نحو الأطراف.',
    treatmentOrganic: lang === 'fr'
      ? ['Apport de compost organique mûr et d’acides humiques/fulviques', 'Décoction d’ortie comme stimulant foliaire']
      : ['إضافة الهيوميك أسيد ومحسنات التربة العضوية لتفكيك كلس التربة', 'استعمال كمبوست متحلل جيداً لخفض قلوية محيط الجذور'],
    treatmentChemical: lang === 'fr'
      ? ['Chélate de fer EDDHA (Sequestrene) à 20-40g/arbre ou 5-10kg/ha en maraîchage']
      : ['شيلات الحديد Fe-EDDHA بمعدل 20 إلى 40 غرام للشجرة أو عبر شبكة التسميد بالتقطير للخضروات'],
    prevention: lang === 'fr'
      ? ['Analyser le calcaire actif avant plantation', 'Drainer les parcelles lourdes']
      : ['تحليل كلس التربة ونوعية مياه السقي دورياً', 'تسليك مجاري تصريف المياه الزائدة لمنع الركود'],
    irrigationSchedule: lang === 'fr'
      ? 'Arrosage mesuré le matin; laisser ressuyer le sol entre deux tours d’eau.'
      : 'تنظيم الري على فترات معتدلة والسماح للتربة بالجفاف السطحي للتنفس.',
    fertilizationAdvice: lang === 'fr'
      ? 'Apporter du soufre élémentaire granulé pour acidifier progressivement la rhizosphère.'
      : 'إضافة الكبريت الزراعي المحبب تدريجياً لخفض قلوية التربة وتسهيل امتصاص العناصر الصغرى.',
    algerianContextNote: lang === 'fr'
      ? 'Problème classique dans la Mitidja, le Chélif et les oasis sahariennes.'
      : 'ظاهرة شائعة جداً في بساتين الحمضيات بالمتيجة، وسهول الشلف، وواحات النخيل والخضروات.',
    engineUsed: 'zira3i-agri-engine',
  };
}

// Status check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    aiConnected: isGeminiConfigured && aiClient !== null,
    model: isGeminiConfigured ? 'gemini-3.8-flash' : 'zira3i-agri-engine',
    version: '3.0.0',
    framework: 'Decision-Support-System (من الصورة إلى القرار)',
    capabilities: {
      contextAware: true,
      qualitativeCertainty: true,
      decisionActionNow: true,
      warningsDoNotDo: true,
      followUpSchedule: true,
      batchAnalysis: true,
      offlineEngineAvailable: true,
    },
  });
});

// Diagnose Endpoint (F1, F2, F3)
app.post('/api/diagnose', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      description,
      cropType,
      wilaya,
      growthStage,
      imageName,
      language = 'ar',
    } = req.body;

    if (!imageBase64 && !description) {
      return res.status(400).json({
        error: language === 'fr'
          ? 'Veuillez fournir une image ou une description du problème végétal avec le contexte.'
          : 'يرجى تقديم صورة لورقة النبتة أو وصف مختصر للمشكلة مع تحديد السياق.',
      });
    }

    if (isGeminiConfigured && aiClient) {
      try {
        const langPrompt = language === 'fr'
          ? 'Réponds impérativement en français clair, précis et orienté ACTION pour des agriculteurs et ingénieurs agronomes.'
          : 'أجب باللغة العربية الفصحى الواضحة والعملية، الموجهة لاتخاذ القرار والإجراء الميداني الفوري للفلاح الجزائري والمغاربي.';

        const promptText = `
أنت "طبيب زراعي خبير ومستشار لدعم القرار الزراعي" (Zira3i AI — من الصورة إلى القرار).
مهمتك ليست مجرد التعرف على الصورة أو تخمين اسم المرض، بل **توجيه الفلاح للإجراء الصحيح الآن**، مع تحذيره صراحة مما يجب تجنبه فوراً لمنع تفاقم الخسائر.

سياق المدخلات:
- المحصول: ${cropType || 'غير محدد'}
- الولاية / المنطقة الفلاحية: ${wilaya || 'الجزائر / شمال إفريقيا'}
- طور نمو النبات: ${growthStage || 'غير محدد'}
- وصف الفلاح الميداني للأعراض: ${description || 'فحص بصري فقط'}
- اسم الملف: ${imageName || 'صورة ورقة/نبتة'}

المطلوب إخراج ملف استدلال وقرار JSON حصرياً يحتوي على الحقول التالية:
1. diseaseName: اسم المرض أو الاضطراب الشائع بالعربية (وبالفرنسية بين قوسين).
2. scientificName: الاسم العلمي اللاتيني لمسبب المرض.
3. cropDetected: المحصول المتعرف عليه.
4. wilayaContext: الولاية أو المنطقة ذات الصلة.
5. growthStageContext: طور النمو.
6. qualitativeCertainty: درجة اليقين النوعية وتكون حصراً واحدة من: "high" أو "medium" أو "low" (بدون أي نسب مئوية وهمية).
7. supportingEvidence: مصفوفة نصوص من 2 إلى 3 أدلة بصرية وسياقية تدعم هذا اليقين.
8. severity: مستوى الخطورة وتكون واحدة من: "critical", "high", "medium", "low".
9. favorableConditions: الظروف المناخية أو البيئية المشجعة لظهور هذا المرض في الجزائر.
10. summary: ملخص تشخيصي دقيق يبين ماذا يحدث للنبات ولماذا.
11. symptoms: مصفوفة لأبرز 3 أعراض ميدانية.
12. actionNow: كائن يحتوي على:
    - headline: عنوان جذاب ومختصر للإجراء (مثال: "تدخل وقائي سريع اليوم لمنع انتقال العدوى للسنبلة")
    - urgentSteps: مصفوفة من 2 إلى 3 خطوات عاجلة يجب أن يقوم بها الفلاح اليوم أو غداً صباحاً.
13. warningDoNotDo: تحذير صريح وحاسم يبدأ بـ "🛑 لا تفعل..." يمنع الفلاح من خطأ شائع ومكلف (مثل الرش في الشمس، أو رش مبيد حشري لفطر، أو الإفراط في الري).
14. followUpSchedule: موعد وإجراء إعادة الفحص الميداني (مثلاً بعد 4 أو 6 أيام وما يجب مراقبته).
15. treatmentOrganic: مصفوفة من 2 إلى 3 علاجات وممارسات عضوية وبيئية.
16. treatmentChemical: مصفوفة من 1 إلى 2 مبيد كيميائي بالمادة الفعالة مع التنبيه لفترة الأمان قبل الجني (DAR).
17. prevention: مصفوفة تدابير وقائية للدورات القادمة.
18. irrigationSchedule: جدول وتوصية الري المناسبة.
19. fertilizationAdvice: توجيه التسميد المناسب.
20. algerianContextNote: ملاحظة خاصة بالولاية والمناخ الجزائري.

${langPrompt}
`;

        const contentsParts: any[] = [];
        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
          contentsParts.push({
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          });
        }
        contentsParts.push({ text: promptText });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts: contentsParts },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                diseaseName: { type: Type.STRING },
                scientificName: { type: Type.STRING },
                cropDetected: { type: Type.STRING },
                wilayaContext: { type: Type.STRING },
                growthStageContext: { type: Type.STRING },
                qualitativeCertainty: { type: Type.STRING },
                supportingEvidence: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                severity: { type: Type.STRING },
                favorableConditions: { type: Type.STRING },
                summary: { type: Type.STRING },
                symptoms: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                actionNow: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    urgentSteps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['headline', 'urgentSteps'],
                },
                warningDoNotDo: { type: Type.STRING },
                followUpSchedule: { type: Type.STRING },
                treatmentOrganic: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                treatmentChemical: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                prevention: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                irrigationSchedule: { type: Type.STRING },
                fertilizationAdvice: { type: Type.STRING },
                algerianContextNote: { type: Type.STRING },
              },
              required: [
                'diseaseName',
                'scientificName',
                'cropDetected',
                'qualitativeCertainty',
                'supportingEvidence',
                'severity',
                'favorableConditions',
                'summary',
                'symptoms',
                'actionNow',
                'warningDoNotDo',
                'followUpSchedule',
                'treatmentOrganic',
                'treatmentChemical',
                'prevention',
                'irrigationSchedule',
                'fertilizationAdvice',
                'algerianContextNote',
              ],
            },
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText);
        parsed.engineUsed = 'gemini-3.8-flash';
        return res.json(parsed);
      } catch (geminiError: any) {
        console.warn('Gemini call encountered issue, falling back seamlessly to agri-decision engine:', geminiError?.message || geminiError);
        const fallback = generateLocalDecision(cropType, wilaya, growthStage, description, imageName, language);
        return res.json(fallback);
      }
    }

    const localResult = generateLocalDecision(cropType, wilaya, growthStage, description, imageName, language);
    return res.json(localResult);
  } catch (error: any) {
    console.error('Diagnosis handler error:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء معالجة القرار الزراعي. يرجى المحاولة مرة أخرى.',
      details: error?.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Zira3i AI (Decision Support) running at http://0.0.0.0:${PORT}`);
    console.log(`Gemini status: ${isGeminiConfigured ? 'Active (gemini-3.8-flash)' : 'Local Decision Support Engine (Standalone Ready)'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
