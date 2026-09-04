'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, FileCheck2, Filter } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  initialNeighborhood?: string;
  initialCfdiOnly?: boolean;
  className?: string;
  onFilterChange?: (filters: { query: string; neighborhood: string; cfdiOnly: boolean }) => void;
}

const COMMON_NEIGHBORHOODS = [
  'Todas las colonias',
  'Terán',
  'Plan de Ayala',
  'Las Palmas',
  'Moctezuma',
  'Centro',
  'El Retiro',
  'Colonia Maya',
  'Patria Nueva',
  'San Roque',
  'Copoya',
  'Chiapa de Corzo',
];

export default function SearchBar({
  initialQuery = '',
  initialNeighborhood = 'Todas las colonias',
  initialCfdiOnly = false,
  className = '',
  onFilterChange,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [neighborhood, setNeighborhood] = useState(initialNeighborhood);
  const [cfdiOnly, setCfdiOnly] = useState(initialCfdiOnly);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({ query, neighborhood, cfdiOnly });
      return;
    }

    // Navegar a resultados
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (neighborhood && neighborhood !== 'Todas las colonias') params.set('colonia', neighborhood);
    if (cfdiOnly) params.set('cfdi', 'true');

    router.push(`/oficios/todos?${params.toString()}`);
  };

  const handleToggleCfdi = (checked: boolean) => {
    setCfdiOnly(checked);
    if (onFilterChange) {
      onFilterChange({ query, neighborhood, cfdiOnly: checked });
    }
  };

  const handleNeighborhoodChange = (selected: string) => {
    setNeighborhood(selected);
    if (onFilterChange) {
      onFilterChange({ query, neighborhood: selected, cfdiOnly });
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 p-2.5 sm:p-3 flex flex-col md:flex-row items-stretch gap-2.5"
      >
        {/* Input término de búsqueda */}
        <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-100 focus-within:border-brand-primary focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onFilterChange) onFilterChange({ query: e.target.value, neighborhood, cfdiOnly });
            }}
            placeholder="¿Qué servicio necesitas? (ej. minisplit, fuga, chapa, corto)"
            className="w-full bg-transparent border-0 focus:ring-0 text-sm sm:text-base text-brand-base placeholder:text-slate-400 p-0"
          />
        </div>

        {/* Selector de Colonia */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-100 min-w-[190px]">
          <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
          <select
            value={neighborhood}
            onChange={(e) => handleNeighborhoodChange(e.target.value)}
            className="w-full bg-transparent border-0 focus:ring-0 text-xs sm:text-sm text-slate-700 p-0 cursor-pointer"
          >
            {COMMON_NEIGHBORHOODS.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Buscar */}
        <button
          type="submit"
          className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-brand-primary/25 transition-all shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Buscar Técnico</span>
        </button>
      </form>

      {/* Checkbox y Filtros Rápidos */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
          <input
            type="checkbox"
            checked={cfdiOnly}
            onChange={(e) => handleToggleCfdi(e.target.checked)}
            className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary h-4 w-4 transition-colors"
          />
          <span className="flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-brand-accent inline" />
            <span>Solo técnicos que facturan (CFDI)</span>
          </span>
        </label>

        <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 shrink-0">Popular:</span>
          {['Minisplit', 'Fuga de agua', 'Chapa rota', 'Tablero eléctrico'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setQuery(term);
                if (onFilterChange) onFilterChange({ query: term, neighborhood, cfdiOnly });
              }}
              className="bg-slate-200/70 hover:bg-slate-300/80 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors shrink-0"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
