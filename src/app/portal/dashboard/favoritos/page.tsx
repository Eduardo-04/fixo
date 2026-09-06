import { Heart } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import TechnicianCard from '@/components/directory/TechnicianCard';

export default async function FavoritesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let favorites: any[] = [];

  if (user) {
    const { data } = await supabase
      .from('favorite_technicians')
      .select(`
        id,
        technician:profiles!favorite_technicians_technician_id_fkey(
          id,
          full_name,
          slug,
          avatar_url,
          bio,
          city,
          rating_average,
          reviews_count,
          is_pro,
          experience_years,
          emits_cfdi,
          neighborhoods_covered,
          phone_whatsapp,
          verification_status,
          technician_categories(
            categories(name)
          )
        )
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      favorites = data.map((fav: any) => ({
        ...fav.technician,
        rating: fav.technician.rating_average,
        categories: fav.technician.technician_categories?.map((tc: any) => tc.categories) || []
      }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
          Técnicos Favoritos
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Guarda aquí a los técnicos de confianza que ya contrataste o que te interesan.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-sm">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Aún no tienes favoritos
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto mb-6">
            Explora el directorio y guarda a los especialistas que mejor se adapten a tus necesidades haciendo clic en el corazón.
          </p>
          <Link
            href="/"
            className="inline-flex bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
          >
            Explorar Directorio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((tech: any) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      )}
    </div>
  );
}
