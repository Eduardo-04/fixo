import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normaliza y formatea un número de teléfono mexicano para WhatsApp.
 * Elimina caracteres no numéricos y asegura el prefijo internacional (+52 o 52).
 */
export function formatWhatsAppPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('52') && cleaned.length >= 12) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `52${cleaned}`;
  }
  return cleaned;
}

/**
 * Convierte un texto a un slug apto para URL (ej. "Juan Pérez Climas" -> "juan-perez-climas")
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Formateador de fechas para México
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
