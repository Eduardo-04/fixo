import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export function createClient() {
  let cookieStore: any;
  try {
    cookieStore = cookies();
  } catch {
    // En Route Handlers o contextos sin request context directo
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mockfixo.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore?.get ? cookieStore.get(name)?.value : undefined;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Can be ignored if called from a Server Component
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // Can be ignored if called from a Server Component
        }
      },
    },
  });
}
