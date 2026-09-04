'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { compressImage } from '@/lib/image-compression';

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  onFileReady: (compressedFile: File) => void;
  accept?: string;
  className?: string;
}

export default function ImageUploader({
  label,
  sublabel = 'Formatos JPG, PNG o WEBP. Máximo 10MB.',
  onFileReady,
  accept = 'image/*',
  className = '',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ originalSize: string; compressedSize: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const originalSizeFormatted = formatSize(file.size);

      // Compresión client-side inmediata
      const compressed = await compressImage(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1200,
        initialQuality: 0.8,
      });

      const compressedSizeFormatted = formatSize(compressed.size);

      setFileInfo({
        originalSize: originalSizeFormatted,
        compressedSize: compressedSizeFormatted,
      });

      const objectUrl = URL.createObjectURL(compressed);
      setPreview(objectUrl);

      // Notificar al padre con el archivo listo y optimizado
      onFileReady(compressed);
    } catch (err) {
      console.error('Error procesando imagen:', err);
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
          preview
            ? 'border-brand-accent bg-emerald-50/20'
            : 'border-slate-300 hover:border-brand-primary bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {compressing ? (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-2" />
            <p className="text-xs font-semibold text-slate-700">Optimizando imagen en el navegador...</p>
            <p className="text-[11px] text-slate-400">Convirtiendo a WebP para máxima velocidad</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-40 h-32 rounded-xl overflow-hidden shadow border border-slate-200">
              <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-100/80 px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" />
              <span>Optimizada con éxito: {fileInfo?.originalSize} → {fileInfo?.compressedSize}</span>
            </div>
            <p className="text-[11px] text-slate-500">Haz clic para cambiar imagen</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-brand-primary">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                Selecciona una foto desde tu dispositivo
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{sublabel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
