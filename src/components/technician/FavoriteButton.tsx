'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function FavoriteButton({ technicianId }: { technicianId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkFavorite() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      setClientId(user.id);
      
      const { data } = await supabase
        .from('favorite_technicians')
        .select('*')
        .eq('client_id', user.id)
        .eq('technician_id', technicianId)
        .single();
        
      if (data) {
        setIsFavorite(true);
      }
      setLoading(false);
    }
    checkFavorite();
  }, [technicianId]);

  const toggleFavorite = async () => {
    if (!clientId) {
      router.push('/portal/login');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (isFavorite) {
      await supabase
        .from('favorite_technicians')
        .delete()
        .eq('client_id', clientId)
        .eq('technician_id', technicianId);
      setIsFavorite(false);
    } else {
      await supabase
        .from('favorite_technicians')
        .insert({
          client_id: clientId,
          technician_id: technicianId
        });
      setIsFavorite(true);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>;
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        isFavorite 
          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500 border border-rose-200 dark:border-rose-900/50' 
          : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-200'
      }`}
      title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}
