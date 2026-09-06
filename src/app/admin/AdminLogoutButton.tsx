'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/portal/login');
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex w-full items-center gap-2 mt-4 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Cerrar Sesión</span>
    </button>
  );
}
