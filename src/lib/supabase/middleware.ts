import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mockfixo.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // Intentar refrescar la sesión del usuario si existe
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // En modo preview/desarrollo sin Supabase configurado en producción, no bloquear
    const isMockEnv = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mockfixo');

    if (!isMockEnv) {
      // Rutas protegidas del técnico
      if (path.startsWith('/portal/dashboard') && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/portal/login';
        url.searchParams.set('redirectedFrom', path);
        return NextResponse.redirect(url);
      }

      // Rutas protegidas del administrador
      if (path.startsWith('/admin') && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/portal/login';
        url.searchParams.set('redirectedFrom', path);
        return NextResponse.redirect(url);
      }
    }
  } catch (err) {
    // Si la conexión Supabase falla (por ejemplo en preview sin credenciales reales), permitir navegación libre
    console.warn('[Fixo Auth Middleware] Supabase unreachable or mock mode active');
  }

  return response;
}
