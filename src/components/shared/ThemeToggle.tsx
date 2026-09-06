'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevenir hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8"></div>;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors flex items-center justify-center"
      title="Cambiar tema"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 sm:w-4 sm:h-4" />
      ) : (
        <Moon className="w-5 h-5 sm:w-4 sm:h-4" />
      )}
    </button>
  );
}
