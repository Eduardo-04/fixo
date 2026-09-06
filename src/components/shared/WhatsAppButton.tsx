'use client';

import { useTransition } from 'react';
import { MessageCircle } from 'lucide-react';
import { trackWhatsAppClick } from '@/app/actions';
import { formatWhatsAppPhone } from '@/lib/utils';

interface WhatsAppButtonProps {
  phone: string;
  technicianName: string;
  profileId: string;
  className?: string;
  variant?: 'primary' | 'compact' | 'floating';
  customText?: string;
}

export default function WhatsAppButton({
  phone,
  technicianName,
  profileId,
  className = '',
  variant = 'primary',
  customText,
}: WhatsAppButtonProps) {
  const [isPending, startTransition] = useTransition();

  const formattedPhone = formatWhatsAppPhone(phone);
  const defaultMessage = `Hola ${technicianName}, vi tu perfil en Chambitas y me gustaría cotizar un servicio.`;
  const encodedMessage = encodeURIComponent(customText || defaultMessage);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Ejecuta el RPC de incremento atómico en background sin bloquear la navegación
    startTransition(() => {
      trackWhatsAppClick(profileId);
    });
  };

  if (variant === 'floating') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3.5 rounded-full font-bold shadow-xl shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all ${className}`}
        aria-label={`Contactar por WhatsApp a ${technicianName}`}
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="text-sm font-semibold tracking-wide">Contactar por WhatsApp</span>
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all ${className}`}
        aria-label={`Contactar por WhatsApp a ${technicianName}`}
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span>WhatsApp</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg shadow-[#25D366]/25 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto ${className}`}
      aria-label={`Contactar por WhatsApp a ${technicianName}`}
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      <span>Contactar por WhatsApp</span>
    </a>
  );
}
