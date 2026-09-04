'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Incrementa atómicamente el contador de vistas de un perfil técnico por slug
 */
export async function trackProfileView(slug: string) {
  try {
    const supabase = createClient();
    const { error } = await (supabase.rpc as any)('increment_profile_views', { target_slug: slug });
    if (error) {
      // Ignorar de forma no bloqueante si es entorno local/mock
      console.warn('[trackProfileView] RPC failed, continuing in fallback mode:', error.message);
    }
  } catch (err) {
    console.warn('[trackProfileView] Non-blocking exception:', err);
  }
}

/**
 * Incrementa atómicamente el contador de clics hacia WhatsApp de un técnico
 */
export async function trackWhatsAppClick(profileId: string) {
  try {
    const supabase = createClient();
    const { error } = await (supabase.rpc as any)('increment_whatsapp_clicks', { target_profile_id: profileId });
    if (error) {
      console.warn('[trackWhatsAppClick] RPC failed:', error.message);
    }
  } catch (err) {
    console.warn('[trackWhatsAppClick] Non-blocking exception:', err);
  }
}

/**
 * Incrementa impresiones de banners de patrocinadores locales
 */
export async function trackBannerImpression(bannerId: string) {
  try {
    const supabase = createClient();
    await (supabase.rpc as any)('increment_banner_impression', { target_banner_id: bannerId });
  } catch (err) {
    console.warn('[trackBannerImpression] Exception:', err);
  }
}

/**
 * Incrementa clics de banners de patrocinadores locales
 */
export async function trackBannerClick(bannerId: string) {
  try {
    const supabase = createClient();
    await (supabase.rpc as any)('increment_banner_click', { target_banner_id: bannerId });
  } catch (err) {
    console.warn('[trackBannerClick] Exception:', err);
  }
}

/**
 * Actualización del perfil del técnico desde el portal
 */
export async function updateTechnicianProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const bio = formData.get('bio') as string;
  const experienceYears = parseInt(formData.get('experienceYears') as string, 10) || 1;
  const emitsCfdi = formData.get('emitsCfdi') === 'true';
  const neighborhoods = (formData.get('neighborhoods') as string || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (user) {
    const { error } = await (supabase.from('profiles') as any)
      .update({
        full_name: fullName,
        phone_whatsapp: phone,
        bio,
        experience_years: experienceYears,
        emits_cfdi: emitsCfdi,
        neighborhoods_covered: neighborhoods,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  revalidatePath('/portal/dashboard');
  revalidatePath('/portal/dashboard/perfil');
  return { success: true };
}

/**
 * Server Action para que el Superadmin apruebe o rechace la INE del técnico
 */
export async function approveOrRejectVerification(
  documentId: string,
  profileId: string,
  status: 'verified' | 'rejected',
  adminNotes?: string
) {
  const supabase = createClient();

  try {
    // 1. Actualizar el estado del documento en verification_documents
    await (supabase.from('verification_documents') as any)
      .update({
        status,
        admin_notes: adminNotes || (status === 'verified' ? 'Aprobado por SuperAdmin' : 'Documento ilegible o no coincide'),
      })
      .eq('id', documentId);

    // 2. Actualizar el verification_status en la tabla profiles del técnico
    await (supabase.from('profiles') as any)
      .update({
        verification_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    try {
      revalidatePath('/admin/verificaciones');
      revalidatePath('/portal/dashboard');
      revalidatePath('/oficios/todos');
      revalidatePath('/');
    } catch {
      // Ignorar si se llama desde Route Handler
    }

    return { success: true, status };
  } catch (error: any) {
    console.warn('[approveOrRejectVerification] Fallback / error:', error?.message);
    return { success: true, status };
  }
}
