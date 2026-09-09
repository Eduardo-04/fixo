import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { Category } from '@/types/database';

interface CategoryCardProps {
  category: Category;
  count?: number;
}

export default function CategoryCard({ category, count }: CategoryCardProps) {
  // Obtener dinámicamente el icono de Lucide o fallback a Wrench
  const IconComponent = (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon_name] || Icons.Wrench;

  return (
    <Link
      href={`/oficios/${category.slug}`}
      className="group relative bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-primary/40 dark:hover:border-brand-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4 text-left"
    >
      <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-50 text-brand-primary border border-orange-100 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
        <IconComponent className="w-5 h-5 stroke-[2]" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-primary transition-colors truncate">
          {category.name}
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
          {category.description || 'Especialistas listos'}
        </p>
      </div>

      {count !== undefined && (
        <span className="shrink-0 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}
