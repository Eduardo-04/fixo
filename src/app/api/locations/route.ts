import { NextResponse } from 'next/server';
import locations from '@/lib/mexico-locations.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateParam = searchParams.get('state');

  // Si envían un estado específico, devolver solo los municipios de ese estado
  if (stateParam) {
    const municipalities = (locations as Record<string, string[]>)[stateParam];
    if (municipalities) {
      return NextResponse.json({ state: stateParam, municipalities });
    }
    return NextResponse.json({ error: 'Estado no encontrado' }, { status: 404 });
  }

  // Devolver todo el catálogo
  return NextResponse.json(locations);
}
