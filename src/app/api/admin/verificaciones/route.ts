import { NextResponse } from 'next/server';
import { approveOrRejectVerification } from '@/app/actions';

/**
 * GET /api/admin/verificaciones
 * Información del endpoint para pruebas en navegador
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    description: 'Endpoint REST de aprobación de INE de Fixo',
    webInterface: 'Visita /admin/verificaciones en tu navegador para la interfaz gráfica',
    usage: {
      method: 'POST',
      body: {
        documentId: 'string',
        profileId: 'string',
        status: 'verified | rejected',
        adminNotes: 'opcional'
      }
    }
  });
}

/**
 * POST /api/admin/verificaciones
 * Body JSON:
 * {
 *   "documentId": "uuid",
 *   "profileId": "uuid",
 *   "status": "verified" | "rejected",
 *   "adminNotes": "opcional"
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentId, profileId, status, adminNotes } = body;

    if (!documentId || !profileId || !status) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: documentId, profileId, status' },
        { status: 400 }
      );
    }

    const result = await approveOrRejectVerification(
      documentId,
      profileId,
      status,
      adminNotes
    );

    return NextResponse.json({
      message: `Documento ${status === 'verified' ? 'aprobado' : 'rechazado'} con éxito`,
      ...result,
    });
  } catch (error: any) {
    console.error('[API Verificaciones Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno al procesar la verificación' },
      { status: 500 }
    );
  }
}
