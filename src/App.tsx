import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SampleCarousel } from './components/SampleCarousel';
import { DiagnosisView } from './components/DiagnosisView';
import { BatchUploader } from './components/BatchUploader';
import { SessionHistory } from './components/SessionHistory';
import { SAMPLE_CASES, SampleCase } from './data/samples';
import { DiagnosisData, SupportedLanguage } from './types/diagnosis';
import { compressImage, requestDiagnosis } from './utils/api';
import { FarmerGuideModal } from './components/FarmerGuideModal';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  FileText,
  Layers,
  Wheat,
  AlertCircle,
  RefreshCw,
  X,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Info,
  ShieldAlert,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

const COMMON_CROPS = [
  { id: 'potato', ar: 'بطاطس / بطاطا', fr: 'Pomme de terre', en: 'Potato' },
  { id: 'tomato', ar: 'طماطم', fr: 'Tomate', en: 'Tomato' },
  { id: 'wheat', ar: 'قمح وحبوب', fr: 'Blé & Céréales', en: 'Wheat' },
  { id: 'olive', ar: 'شجرة الزيتون', fr: 'Olivier', en: 'Olive' },
  { id: 'citrus', ar: 'حمضيات وبرتقال', fr: 'Agrumes', en: 'Citrus' },
  { id: 'pepper', ar: 'فلفل وحار', fr: 'Poivron / Piment', en: 'Pepper' },
  { id: 'date-palm', ar: 'نخيل التمر (دقلة نور)', fr: 'Palmier Dattier', en: 'Date Palm' },
  { id: 'other', ar: 'محصول آخر', fr: 'Autre culture', en: 'Other' },
];

const ALGERIAN_WILAYAS = [
  'عين الدفلى',
  'بسكرة',
  'معسكر',
  'سطيف',
  'البليدة / متيجة',
  'تيزي وزو',
  'تيارت',
  'وادي سوف',
  'مستغانم',
  'قالمة',
  'تلمسان',
  'ميلة',
  'الشلف',
  'بجاية',
  'ولاية أخرى',
];

const GROWTH_STAGES = [
  { id: 'seedling', ar: 'الشتل والإنبات الأولي', fr: 'Semis & Levée' },
  { id: 'vegetative', ar: 'النمو الخضري والتفرع', fr: 'Croissance Végétative' },
  { id: 'flowering', ar: 'التزهير وعقد الثمار', fr: 'Floraison & Nouaison' },
  { id: 'fruiting', ar: 'نضج المحصول واقتراب الجني', fr: 'Grossissement & Récolte' },
];

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>('ar');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'text-only'>('single');

  // PRD F1: Context form states
  const [selectedCrop, setSelectedCrop] = useState<string>('potato');
  const [wilaya, setWilaya] = useState<string>('عين الدفلى');
  const [growthStage, setGrowthStage] = useState<string>('vegetative');
  const [description, setDescription] = useState<string>('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(undefined);

  // Processing & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<DiagnosisData[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSelectedSampleId(undefined);
    setImageFile(file);

    try {
      const compressed = await compressImage(file, 1200, 1200, 0.82);
      setImagePreview(compressed.base64);
    } catch {
      const reader = new FileReader();
      reader.onload = (evt) => setImagePreview(evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setSelectedSampleId(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 1-Click sample selection with full context (PRD F5)
  const handleSelectSample = (sample: SampleCase) => {
    setSelectedSampleId(sample.id);
    setSelectedCrop(sample.cropKey);
    setWilaya(sample.wilaya);
    setGrowthStage(sample.growthStageKey);
    setImagePreview(sample.thumbnailSvg);
    setImageFile(null);
    setDescription(language === 'fr' ? sample.descriptionFr : sample.descriptionAr);
    setErrorMsg(null);

    const stageObj = GROWTH_STAGES.find((s) => s.id === sample.growthStageKey);
    const stageLabel = stageObj ? (language === 'fr' ? stageObj.fr : stageObj.ar) : sample.growthStageKey;

    // Trigger full context reasoning
    runDiagnosis({
      imageBase64: sample.thumbnailSvg,
      mimeType: 'image/svg+xml',
      description: language === 'fr' ? sample.descriptionFr : sample.descriptionAr,
      cropType: language === 'fr' ? sample.cropFr : sample.cropAr,
      wilaya: sample.wilaya,
      growthStage: stageLabel,
      imageName: sample.id,
      language,
    });
  };

  const handleRunDiagnosis = async () => {
    if (!imagePreview && !description.trim()) {
      setErrorMsg(
        language === 'fr'
          ? 'Veuillez téléverser une photo ou rédiger une description brève des symptômes.'
          : 'يرجى تقديم صورة لورقة النبتة المصابة أو كتابة وصف مختصر للأعراض.'
      );
      return;
    }

    const currentCropObj = COMMON_CROPS.find((c) => c.id === selectedCrop);
    const cropLabel = currentCropObj ? (language === 'fr' ? currentCropObj.fr : currentCropObj.ar) : selectedCrop;

    const currentStageObj = GROWTH_STAGES.find((s) => s.id === growthStage);
    const stageLabel = currentStageObj ? (language === 'fr' ? currentStageObj.fr : currentStageObj.ar) : growthStage;

    await runDiagnosis({
      imageBase64: imagePreview || undefined,
      description: description.trim() || undefined,
      cropType: cropLabel,
      wilaya,
      growthStage: stageLabel,
      imageName: imageFile?.name || (selectedSampleId ? `${selectedSampleId}.svg` : 'leaf.jpg'),
      language,
    });
  };

  const runDiagnosis = async (params: {
    imageBase64?: string;
    mimeType?: string;
    description?: string;
    cropType?: string;
    wilaya?: string;
    growthStage?: string;
    imageName?: string;
    language?: string;
  }) => {
    setIsProcessing(true);
    setErrorMsg(null);

    setProcessStep(language === 'fr' ? '1/3 - Intégration du contexte (Wilaya, stade de culture)...' : '1/3 - ربط سياق الحقل (الولاية، طور النمو، الأعراض)...');

    setTimeout(() => {
      setProcessStep(language === 'fr' ? '2/3 - Inférence multimodale & évaluation des risques...' : '2/3 - استدلال متعدد الوسائط وتقييم درجة اليقين والخطورة...');
    }, 700);

    setTimeout(() => {
      setProcessStep(language === 'fr' ? '3/3 - Élaboration du plan d’action immédiat et des alertes...' : '3/3 - صياغة خطة القرار: الإجراء المطلوب الآن وما يجب تجنبه...');
    }, 1400);

    try {
      const result = await requestDiagnosis(params);
      const enhancedResult: DiagnosisData = {
        ...result,
        id: `decision-${Date.now()}`,
        timestamp: Date.now(),
        imagePreview: params.imageBase64,
        wilayaContext: params.wilaya,
        growthStageContext: params.growthStage,
      };

      setDiagnosisResult(enhancedResult);
      setHistory((prev) => [enhancedResult, ...prev.slice(0, 9)]);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch {
      setErrorMsg(
        language === 'fr'
          ? 'Une erreur est survenue lors de l’analyse. Veuillez réessayer.'
          : 'حدث خطأ أثناء معالجة القرار. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsProcessing(false);
      setProcessStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-9">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3.5 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>
              {language === 'fr'
                ? 'De l’Image à la Décision : Système d’Aide à la Décision Agricole'
                : 'من الصورة إلى القرار — نظام ذكي لدعم القرار الزراعي الميداني'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {language === 'fr' ? (
              <>Votre Médecin des Plantes au Champ 🌾 <span className="text-emerald-700">Photographiez la feuille malade, recevez la solution</span></>
            ) : (
              <>طبيب نباتك في جيبك 🌾 <span className="text-emerald-700">صوّر الورقة المريضة وسنخبرك بالحل فوراً</span></>
            )}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Application ultra-simple conçue pour chaque agriculteur : pas de jargon technique, prenez une photo de la feuille malade et découvrez exactement quoi faire aujourd’hui pour sauver votre récolte.'
              : 'تطبيق مجاني وبسيط جداً في خدمة كل فلاح : لا تحتاج لأي خبرة بالهواتف أو التكنولوجيا، فقط التقط صورة لورقة نبتتك وسنخبرك بما تحتاجه بالعربية المبسطة، مع إمكانية سماع النصيحة بالصوت.'}
          </p>

          {/* Decision Workflow Steps Pill */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-slate-700">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">📸 1. صورة وسياق</span>
            <span className="text-slate-400">←</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">🧠 2. استدلال ويقين</span>
            <span className="text-slate-400">←</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">⚡ 3. إجراء الآن</span>
            <span className="text-slate-400">←</span>
            <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 border border-red-300">🛑 4. لا تفعل</span>
            <span className="text-slate-400">←</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">📅 5. موعد المتابعة</span>
          </div>

          {/* Farmer Friendly Tour / Help Banner */}
          <div className="mt-5 max-w-2xl mx-auto p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs shrink-0 text-base">
                📖
              </span>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-amber-950">
                  {language === 'fr' ? 'Nouveau sur l’application ? Consultez le guide simple' : 'أول مرة تستخدم التطبيق؟ تعرّف على طريقة الاستخدام في دقيقة'}
                </h4>
                <p className="text-[11px] text-amber-900/80 font-medium">
                  {language === 'fr' ? 'Découvrez en 3 étapes faciles comment photographier et traiter vos plantes.' : 'دليل مصور يشرح لك كيف تصوّر الورقة، ماذا ترش اليوم، وما الذي يجب أن تتجنبه.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0 w-full sm:w-auto justify-center"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Ouvrir le guide' : 'افتح دليل الفلاح'}</span>
            </button>
          </div>
        </div>

        {/* 1-Click Samples Carousel (PRD F5) */}
        <SampleCarousel
          language={language}
          onSelectSample={handleSelectSample}
          selectedSampleId={selectedSampleId}
          isProcessing={isProcessing}
        />

        {/* Session History (PRD F8) */}
        <SessionHistory
          history={history}
          onSelect={(item) => {
            setDiagnosisResult(item);
            resultRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          onClear={() => setHistory([])}
          language={language}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'single'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{language === 'fr' ? 'Diagnostic & Décision (Image + Contexte)' : 'تشخيص وقرار (صورة + سياق)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'batch'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{language === 'fr' ? 'Analyse par Lot (Conseillers)' : 'فحص جماعي (للمرشدين)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('text-only')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'text-only'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'fr' ? 'Consultation par Symptômes' : 'استشارة بالأعراض فقط'}</span>
            </button>
          </div>
        </div>

        {/* Work Area */}
        {activeTab === 'batch' ? (
          <BatchUploader
            language={language}
            onSelectResult={(res) => {
              setDiagnosisResult(res);
              resultRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-10 space-y-6">
            
            {/* PRD F1: CONTEXT FORM (نموذج السياق الزراعي الرباعي) */}
            <div className="p-5 rounded-2xl bg-emerald-900/5 border border-emerald-900/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'fr' ? '1. Contexte de la Parcelle (F1 - Décisif pour la précision)' : '1. سياق الحقل والمحصول (المطلب F1 - أساس دقة القرار)'}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  {language === 'fr' ? '4 paramètres rapides' : '4 معلومات سريعة فقط'}
                </span>
              </div>

              {/* 1. Crop Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {language === 'fr' ? 'نوع المحصول (Culture) :' : 'نوع المحصول :'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
                  {COMMON_CROPS.map((crop) => (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => setSelectedCrop(crop.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        selectedCrop === crop.id
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {language === 'fr' ? crop.fr : crop.ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2 & 3. Wilaya + Growth Stage in 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Wilaya selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'fr' ? 'الولاية الفلاحية (Wilaya) :' : 'الولاية الفلاحية :'}</span>
                  </label>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Growth Stage selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'fr' ? 'طور النمو (Stade végétatif) :' : 'طور نمو المحصول حالياً :'}</span>
                  </label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {GROWTH_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {language === 'fr' ? s.fr : s.ar}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

            </div>

            {/* Inputs Grid: Image + Description */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Photo Input (if single photo mode) */}
              {activeTab === 'single' && (
                <div className="lg:col-span-6 flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'fr' ? 'صورة الورقة أو العضو المصاب :' : 'صورة الورقة أو العضو المصاب :'}</span>
                  </label>

                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900 aspect-[4/3] flex items-center justify-center group shadow-inner">
                      <img
                        src={imagePreview}
                        alt="Leaf preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-white text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-slate-100"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{language === 'fr' ? 'Changer' : 'تغيير'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{language === 'fr' ? 'Supprimer' : 'إزالة'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="single-image-upload"
                      className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all group"
                    >
                      <input
                        id="single-image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="font-extrabold text-slate-800 text-sm mb-1">
                        {language === 'fr' ? 'Prendre ou téléverser une photo' : 'التقط صورة لورقة النبتة أو اسحبها هنا'}
                      </span>
                      <span className="text-xs text-slate-500">
                        JPG, PNG, WEBP (يتم تصغيرها تلقائياً لسرعة الاستدلال)
                      </span>
                    </label>
                  )}
                </div>
              )}

              {/* Description Input */}
              <div className={activeTab === 'single' ? 'lg:col-span-6 flex flex-col justify-between' : 'lg:col-span-12'}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'fr' ? 'الأعراض الميدانية الملاحظة :' : 'الأعراض الميدانية الملاحظة بالحقل :'}</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {activeTab === 'single' ? (language === 'fr' ? '(Optionnel)' : '(مستحسن للدقة)') : (language === 'fr' ? '(Obligatoire)' : '(مطلوب)')}
                    </span>
                  </label>

                  <textarea
                    rows={activeTab === 'single' ? 5 : 4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      language === 'fr'
                        ? 'Ex: Taches huileuses sur le bord des feuilles, feutrage blanc apparu après le brouillard d’hier matin, jaunissement débutant sur les feuilles du bas...'
                        : 'مثال: بقع بنية زيتية ظهرت بعد ضباب الأمس، مسحوق أبيض على ظهر الورقة، اصفرار الأوراق السفلية بعد سقية رذاذية...'
                    }
                    className="w-full rounded-2xl border border-slate-200 p-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 resize-none transition-all placeholder:text-slate-400"
                  ></textarea>

                  {/* Suggestion Chips */}
                  <div className="mt-2.5">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      {language === 'fr' ? 'Mots-clés fréquents :' : 'أعراض شائعة (انقر للإضافة السريعة) :'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(language === 'fr'
                        ? ['Taches huileuses', 'Poudre blanche', 'Jaunissement inter-nervaire', 'Dessèchement de la tige', 'Pustules orangées']
                        : ['بقع زيتية داكنة', 'مسحوق أبيض دقيقي', 'اصفرار بين العروق', 'اسوداد وتعفن الساق', 'بثور صدأ برتقالية']
                      ).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setDescription((prev) => (prev ? `${prev}، ${tag}` : tag))}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 text-[11px] font-medium transition-colors cursor-pointer border border-slate-200/60"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleRunDiagnosis}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{processStep || (language === 'fr' ? 'Analyse du contexte & élaboration de la décision...' : 'جارِ استدلال السياق وصياغة القرار الزراعي...')}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
                        <span>{language === 'fr' ? 'Générer la Décision & le Plan d’Action' : 'توليد القرار الزراعي وخطة التدخل الفوري'}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Diagnosis Result View */}
        <div ref={resultRef}>
          {diagnosisResult && (
            <div className="mb-12">
              <DiagnosisView
                data={diagnosisResult}
                language={language}
                soundEnabled={soundEnabled}
              />
            </div>
          )}
        </div>

        {/* PRD F12: Permanent Footer Disclaimer */}
        <div className="my-8 p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-600 text-xs flex items-center justify-center gap-2 text-center">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            {language === 'fr'
              ? 'Zira3i AI est un système expérimental d’aide à la décision pour le hackathon. Toujours corroborer les décisions critiques avec les services agricoles de wilaya.'
              : 'Zira3i AI نظام استرشادي لدعم القرار الزراعي — يُرجى دائماً تأكيد القرارات ذات التأثير الاقتصادي الكبير بالتنسيق مع مهندسي مديريات المصالح الفلاحية (DSA) والمعهد الوطني لحماية النباتات (INPV).'}
          </span>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span>🌾 Zira3i AI — من الصورة إلى القرار</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold">AgriChat Multi-modal Decision Engine</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'fr'
              ? 'Conçu pour l’agriculture algérienne & maghrébine (Soutien aux agriculteurs et conseillers)'
              : 'موجّه للفلاح والمرشد الزراعي الجزائري والمغاربي (دعم القرار وحماية المحاصيل)'}
          </p>
        </div>
      </footer>

      {/* Farmer Guide Modal */}
      <FarmerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={language}
        onTrySample={() => {
          const firstSample = SAMPLE_CASES[0];
          if (firstSample) handleSelectSample(firstSample);
        }}
      />

    </div>
  );
}
