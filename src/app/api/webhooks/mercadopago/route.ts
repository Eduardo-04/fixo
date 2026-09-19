import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // 1. Obtener los parámetros de la URL (notificaciones tipo Webhook/IPN)
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || url.searchParams.get('topic');
    const paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');

    // 2. También obtener el body por si viene en formato JSON
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // Body vacío o no JSON
    }

    // Extraemos de body o URL parameters
    const incomingType = type || (body as any)?.type || (body as any)?.topic;
    const incomingId = paymentId || (body as any)?.data?.id;

    if (incomingType === 'payment' && incomingId) {
      const accessToken = process.env.MP_ACCESS_TOKEN;
      
      if (!accessToken) {
        console.error('No se encontró MP_ACCESS_TOKEN en las variables de entorno.');
        return NextResponse.json({ error: 'Falta configuración de MP' }, { status: 500 });
      }

      // 3. Inicializar Mercado Pago
      const client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
      const payment = new Payment(client);

      // 4. Consultar el pago directamente a Mercado Pago por seguridad
      const paymentData = await payment.get({ id: incomingId });
      
      if (paymentData.status === 'approved') {
        const profileId = paymentData.external_reference;

        if (profileId) {
          // 5. Inicializar Supabase con clave de administrador (Service Role)
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

          if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Falta configuración de Supabase Service Role');
            return NextResponse.json({ error: 'Configuración interna fallida' }, { status: 500 });
          }

          const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

          // 6. Actualizar al usuario a PRO
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ is_pro: true })
            .eq('id', profileId);

          if (updateError) {
            console.error('Error al actualizar perfil en Supabase:', updateError);
            return NextResponse.json({ error: 'Fallo al actualizar DB' }, { status: 500 });
          }

          console.log(`¡Éxito! Perfil ${profileId} actualizado a PRO tras el pago ${incomingId}`);
          return NextResponse.json({ success: true });
        } else {
          console.error('El pago aprobado no tenía external_reference (ID del perfil)');
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error procesando Webhook de Mercado Pago:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
