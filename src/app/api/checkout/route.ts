import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Falta MP_ACCESS_TOKEN');
      return NextResponse.json({ error: 'Configuración de pagos incompleta' }, { status: 500 });
    }

    // Inicializar Mercado Pago
    const client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
    const preference = new Preference(client);

    // Crear la preferencia de pago (Checkout Pro)
    const body = {
      items: [
        {
          id: 'chambitas-pro',
          title: 'Suscripción Chambitas PRO',
          description: 'Beneficios PRO (Portafolio de 30 fotos, verificación y más)',
          quantity: 1,
          unit_price: 150, // Precio de ejemplo en MXN
          currency_id: 'MXN',
        }
      ],
      back_urls: {
        success: 'https://chambitas.shop/portal/dashboard?pago=exito',
        failure: 'https://chambitas.shop/portal/dashboard?pago=fallo',
        pending: 'https://chambitas.shop/portal/dashboard?pago=pendiente',
      },
      auto_return: 'approved',
      external_reference: userId, // Súper importante: aquí vinculamos el pago con el técnico
    };

    const response = await preference.create({ body });

    // Devolver el link de pago (init_point)
    return NextResponse.json({ url: response.init_point });

  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json({ error: 'Error al generar link de pago' }, { status: 500 });
  }
}
