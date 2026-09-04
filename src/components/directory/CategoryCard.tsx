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
      className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-primary border border-orange-100 flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 shadow-sm">
        <IconComponent className="w-6 h-6 stroke-[2]" />
      </div>

      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1">
        {category.name}
      </h3>

      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
        {category.description || 'Especialistas verificados y cotización directa por WhatsApp.'}
      </p>

      <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-brand-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Ver técnicos disponibles →
        </span>
        {count !== undefined && (
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}
