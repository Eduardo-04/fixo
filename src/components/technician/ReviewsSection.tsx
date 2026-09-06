'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Review {
  id: string;
  reviewer_id?: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: {
    full_name: string;
  };
}

interface ReviewsSectionProps {
  profileId: string;
  initialReviews: any[];
}

export default function ReviewsSection({ profileId, initialReviews }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(
    initialReviews.map(r => ({
      ...r,
      reviewer_id: r.reviewer_id,
      reviewer: r.reviewer || r.profiles || { full_name: r.author_name || 'Usuario Chambitas' }
    }))
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Buscar si el usuario ya tiene una reseña para precargarla
        const userReview = reviews.find(r => r.reviewer_id === user.id);
        if (userReview) {
          setExistingReviewId(userReview.id);
          setRating(userReview.rating);
          setComment(userReview.comment || '');
        }
      }
    }
    getUser();
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || rating < 1 || rating > 5) return;
    
    setIsSubmitting(true);
    
    try {
      if (existingReviewId) {
        // Actualizar reseña existente
        const { data, error } = await supabase
          .from('reviews')
          .update({
            rating,
            comment,
            created_at: new Date().toISOString()
          } as any)
          .eq('id', existingReviewId)
          .select(`
            *,
            reviewer:profiles!reviews_reviewer_id_fkey(full_name)
          `)
          .single();
          
        if (error) throw error;
        
        setReviews(reviews.map(r => r.id === existingReviewId ? (data as any) : r));
        alert('Reseña actualizada exitosamente.');
      } else {
        // Insertar nueva reseña
        const { data, error } = await supabase
          .from('reviews')
          .insert({
            profile_id: profileId,
            reviewer_id: userId,
            rating,
            comment
          } as any)
          .select(`
            *,
            reviewer:profiles!reviews_reviewer_id_fkey(full_name)
          `)
          .single();
          
        if (error) throw error;
        
        setReviews([data as any, ...reviews]);
        setExistingReviewId((data as any).id);
      }
      
      router.refresh();
      
    } catch (err: any) {
      console.error('Error enviando reseña:', err);
      alert('Hubo un error al enviar tu reseña. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            Reseñas de Clientes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Opiniones de personas que han contratado sus servicios
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 h-fit shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-primary" />
            {existingReviewId ? 'Edita tu reseña' : 'Dejar una reseña'}
          </h3>
          
          {!userId ? (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-4">
              <Lock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Inicia sesión para dejar una reseña auténtica y ayudar a otros usuarios.
              </p>
              <Link 
                href={`/portal/login?redirect=/t/${profileId}`}
                className="inline-block bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
              >
                Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-400 mb-1">
                  Calificación
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-400 mb-1">
                  Comentario (Opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="¿Cómo fue el servicio?"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:border-brand-primary focus:ring-brand-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : (existingReviewId ? 'Actualizar reseña' : 'Publicar reseña')}
              </button>
            </form>
          )}
        </div>

        {/* Lista de Reseñas */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center">
              <Star className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No hay reseñas aún</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Sé el primero en dejar tu opinión sobre el servicio.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {review.reviewer?.full_name || 'Usuario Chambitas'}
                    </span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">"{review.comment}"</p>
                  )}
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 flex justify-between">
                    <span>
                      {new Date(review.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {review.id === existingReviewId && (
                      <span className="text-brand-primary font-bold">Tu reseña</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
