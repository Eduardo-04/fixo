import { MessageSquare, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function MyReviewsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let reviews: any[] = [];
  
  if (user) {
    const { data } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        technician:profiles!reviews_profile_id_fkey(
          full_name,
          slug,
          avatar_url
        )
      `)
      .eq('reviewer_id', user.id)
      .order('created_at', { ascending: false });
      
    if (data) reviews = data;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
          Mis Reseñas
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Historial de las opiniones y calificaciones que has dejado a los técnicos.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Sin historial de reseñas
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
            Tus opiniones ayudan a toda la comunidad. La próxima vez que contrates a un técnico, no olvides volver a su perfil para dejarle una reseña.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                      {review.technician?.avatar_url ? (
                        <img src={review.technician.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-800 text-white">
                          {review.technician?.full_name?.charAt(0) || 'T'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {review.technician?.full_name || 'Técnico'}
                      </h4>
                      <div className="text-[10px] text-slate-400">
                        {new Date(review.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                    ))}
                  </div>
                </div>
                
                {review.comment && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                )}
              </div>
              
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between">
                <Link 
                  href={`/t/${review.technician?.slug}`}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center gap-1"
                >
                  Ver Perfil
                </Link>
                <Link 
                  href={`/t/${review.technician?.slug}#resenas`}
                  className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1"
                >
                  Editar Reseña
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
