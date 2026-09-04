import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
  initialQuality?: number;
}

/**
 * Comprime una imagen en el navegador del cliente antes de subir a Supabase Storage.
 * Convierte preferentemente a WebP, resolución máxima 1200px y calidad 0.8.
 */
export async function compressImage(
  imageFile: File,
  customOptions?: CompressionOptions
): Promise<File> {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8,
    ...customOptions,
  };

  try {
    const compressedBlob = await imageCompression(imageFile, defaultOptions);
    const newFileName = imageFile.name.replace(/\.[^/.]+$/, "") + ".webp";
    
    return new File([compressedBlob], newFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('[Image Compression] Error compressing image, returning original:', error);
    return imageFile;
  }
}
