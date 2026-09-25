import React, { useState } from 'react';
import { UploadCloud, FileImage, CheckCircle, AlertCircle, Loader2, Play, Trash2 } from 'lucide-react';
import { BatchItem, DiagnosisData, SupportedLanguage } from '../types/diagnosis';
import { compressImage, requestDiagnosis } from '../utils/api';

interface BatchUploaderProps {
  language: SupportedLanguage;
  onSelectResult: (data: DiagnosisData) => void;
}

export const BatchUploader: React.FC<BatchUploaderProps> = ({
  language,
  onSelectResult,
}) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: BatchItem[] = [];
    const maxFiles = 8; // Sensible batch limit for browser memory

    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        previewUrl,
        name: file.name,
        status: 'pending',
      });
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
    setProgress(0);
  };

  const handleRunBatch = async () => {
    if (items.length === 0 || isProcessingBatch) return;

    setIsProcessingBatch(true);
    setProgress(0);

    const updated = [...items];
    let completedCount = 0;

    for (let i = 0; i < updated.length; i++) {
      const current = updated[i];
      if (current.status === 'done') {
        completedCount++;
        setProgress(Math.round((completedCount / updated.length) * 100));
        continue;
      }

      current.status = 'processing';
      setItems([...updated]);

      try {
        let base64 = '';
        let mimeType = 'image/jpeg';
        if (current.file) {
          const compressed = await compressImage(current.file, 1000, 1000, 0.8);
          base64 = compressed.base64;
          mimeType = compressed.mimeType;
        }

        const res = await requestDiagnosis({
          imageBase64: base64,
          mimeType,
          imageName: current.name,
          language,
        });

        current.status = 'done';
        current.result = res;
      } catch (err: any) {
        current.status = 'error';
        current.error = err?.message || 'فشل الفحص';
      }

      completedCount++;
      setProgress(Math.round((completedCount / updated.length) * 100));
      setItems([...updated]);
    }

    setIsProcessingBatch(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {language === 'fr' ? 'Diagnostic par Lot (Multi-Images)' : 'الفحص الجماعي (دفعة صور متعددة)'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'fr'
              ? 'Idéal pour les ingénieurs agronomes et conseillers analysant plusieurs parcelles ou plusieurs feuilles à la fois.'
              : 'مخصص للمرشدين الزراعيين والمهندسين لفحص عدة عينات أو حقول دفعة واحدة (حتى 8 صور).'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={isProcessingBatch}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Vider' : 'مسح الكل'}</span>
            </button>
          )}

          <button
            onClick={handleRunBatch}
            disabled={items.length === 0 || isProcessingBatch}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessingBatch ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'fr' ? `Traitement (${progress}%)` : `جارِ الفحص (${progress}%)`}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{language === 'fr' ? 'Lancer l’analyse groupée' : 'بدء الفحص الجماعي'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessingBatch && (
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-600 h-2 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Drop Zone */}
      <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors block">
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isProcessingBatch}
        />
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-xs">
          <UploadCloud className="w-6 h-6" />
        </div>
        <span className="font-bold text-slate-800 text-sm">
          {language === 'fr'
            ? 'Cliquez ou glissez plusieurs photos de feuilles ici'
            : 'اضغط هنا أو اسحب مجموعة صور لأوراق المحصول للتحليل الجماعي'}
        </span>
        <span className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP (حتى 8 صور دفعة واحدة)</span>
      </label>

      {/* Items Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col justify-between relative group"
            >
              <div>
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-slate-200 relative">
                  <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-2 right-2">
                    {item.status === 'processing' && (
                      <span className="p-1 rounded-full bg-amber-500 text-white shadow-xs inline-flex">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </span>
                    )}
                    {item.status === 'done' && (
                      <span className="p-1 rounded-full bg-emerald-600 text-white shadow-xs inline-flex">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="p-1 rounded-full bg-red-600 text-white shadow-xs inline-flex">
                        <AlertCircle className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-800 truncate mb-1">
                  {item.name}
                </div>

                {item.result && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-md truncate">
                      {item.result.diseaseName}
                    </div>
                    <div className="text-[10px] text-slate-600 line-clamp-1 font-medium">
                      ⚡ {item.result.actionNow.headline}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                {item.result ? (
                  <button
                    onClick={() => onSelectResult(item.result!)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                  >
                    {language === 'fr' ? 'Voir le rapport' : 'عرض التقرير'}
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400">
                    {item.status === 'processing' ? 'جارِ التحليل...' : 'في انتظار البدء'}
                  </span>
                )}

                {!isProcessingBatch && (
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
