'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSystemAnnouncement(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'No autorizado' };

  // Verify if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { success: false, error: 'No autorizado' };
  }

  const title = formData.get('title') as string;
  const message = formData.get('message') as string;
  const type = formData.get('type') as string;
  const link_url = formData.get('link_url') as string;
  const link_text = formData.get('link_text') as string;
  const is_active = formData.get('is_active') === 'true';

  const { error } = await supabase
    .from('system_announcements')
    .insert({
      title,
      message,
      type,
      link_url,
      link_text,
      is_active,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    // If we only want one active announcement, we could also update existing ones
    return { success: false, error: error.message };
  }

  // Desactivar los demás
  await supabase
    .from('system_announcements')
    .update({ is_active: false })
    .neq('title', title); // Not bulletproof but works for a simple system

  revalidatePath('/admin/anuncios');
  revalidatePath('/portal/dashboard');
  
  return { success: true };
}
