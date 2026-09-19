# Contexto del Proyecto Chambitas

**Chambitas ("La red de tus mejores chambas")** es un directorio local y tarjeta digital con código QR para prestadores de servicios técnicos y oficios (plomería, electricidad, climas/refrigeración, mecánica, carpintería, cerrajería, etc.) en Tuxtla Gutiérrez, Chiapas.

El objetivo principal es conectar a clientes con técnicos verificados directamente vía WhatsApp, sin intermediar el dinero de la mano de obra. Adicionalmente, los clientes pueden dejar reseñas (y editarlas) y guardar técnicos en sus favoritos.

## Stack Tecnológico
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (Paleta industrial personalizada: `#EA580C` naranja, `#0F172A` slate, `#10B981` emerald, `#F8FAFC` slate claro)
- **Base de Datos y Backend:** Supabase (PostgreSQL, Storage, Auth simulado para desarrollo rápido)
- **PWA:** Configurado con `manifest.json` para instalarse como aplicación.

## Estructura de Rutas y Funcionalidades

Actualmente el sistema cuenta con **modo mock/desarrollo** activo para facilitar las pruebas.

### 🌐 Directorio Público (Clientes)
| Ruta | Descripción |
| :--- | :--- |
| **`/`** | **Inicio**: Buscador, banner de patrocinador, categorías y técnicos destacados. |
| **`/oficios/[slug]`** | **Listado por Categoría**: Filtros por colonia, palabra clave y facturación. |
| **`/t/[slug]`** | **Tarjeta Digital del Técnico**: QR dinámico, botón a WhatsApp y portafolio. |

### 🛠️ Portal del Técnico / Cliente (Privado)
| Ruta | Descripción |
| :--- | :--- |
| **`/portal/login`** | **Acceso**: Login y redirección inteligente. |
| **`/portal/dashboard`** | **Métricas**: Vistas, clics a WhatsApp y conversión (solo Técnicos). Inicio limpio (para Clientes). |
| **`/portal/dashboard/perfil`** | **Edición**: Datos de contacto, biografía y zonas atendidas. Oculta campos técnicos si el rol es `client`. |
| **`/portal/dashboard/portafolio`** | **Galería**: Subida de fotos comprimidas y switch Antes/Después (solo Técnicos). |
| **`/portal/dashboard/verificacion`** | **INE**: Subida de credencial para insignia verificada (solo Técnicos). |
| **`/portal/dashboard/mi-qr`** | **Generador de Volante**: Descarga de PDF/PNG con QR promocional (solo Técnicos). |
| **`/portal/dashboard/mis-resenas`** | **Reseñas**: Panel para gestionar y editar las reseñas dejadas a técnicos (Clientes). |
| **`/portal/dashboard/favoritos`** | **Favoritos**: Lista de técnicos guardados con acceso rápido a su perfil (Clientes). |

### 👑 Panel Superadmin
| Ruta | Descripción |
| :--- | :--- |
| **`/admin`** | **Métricas Maestras**: Resumen de plataforma. |
| **`/admin/verificaciones`** | **Cumplimiento LFPDPPP**: Revisión manual de INE, aprobación y purga de imágenes para evitar retención de datos sensibles. |
| **`/admin/banners`** | **Publicidad Local**: Gestión de patrocinadores. |

## Configuración de Supabase (Paso a Producción)

Para pasar del modo demo al modo real:

1. **Crear Proyecto**: En [supabase.com](https://supabase.com).
2. **Ejecutar SQL**: Correr los archivos de `supabase/migrations/` en el SQL Editor de Supabase (incluyendo reviews, favorites y auth triggers).
3. **Crear Storage Buckets**:
   - `public-media` (Public Bucket): Para fotos de perfil y portafolios.
   - `private-docs` (Private Bucket): Para documentos de verificación (INE).
4. **Configurar Variables de Entorno**: Actualizar `.env.local` con:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

## Analíticas y Publicidad (Meta Pixel & Google Analytics)

El código base ya cuenta con un componente `Analytics.tsx` inyectado en `layout.tsx` listo para rastrear tráfico y conversiones.
Para activarlo en el entorno de producción (Vercel) SIN tocar código, es necesario ir a la configuración del proyecto en Vercel -> **Settings** -> **Environment Variables** y agregar:

- `NEXT_PUBLIC_META_PIXEL_ID` (Para Facebook/Instagram Ads)
- `NEXT_PUBLIC_GA_ID` (Para Google Ads/Analytics)

*Nota: Una vez agregados, es necesario redesplegar (redeploy) en Vercel para que tomen efecto.*

## Últimas Mejoras Implementadas (Septiembre 2026)
- **SEO Dinámico:** Creación de `sitemap.ts` y `robots.ts` para indexación en Google.
- **Verificación Avanzada:** Requisito de 3 fotografías (INE Frente, INE Reverso y Selfie sosteniendo INE) para validar la identidad del técnico de forma segura.
- **Sistema de Reportes:** Botón al final de los perfiles públicos para denunciar perfiles fraudulentos. Creación de panel administrativo para revisar dichos reportes.
- **Páginas Legales:** Redacción de Aviso de Privacidad y Términos y Condiciones.
- **Publicidad Equitativa:** Rotación aleatoria de Banners Patrocinadores cuando hay más de un anunciante en la misma posición.
- **Límites de Almacenamiento (Portafolio):** Para proteger el servidor gratuito de Supabase, las cuentas gratuitas ahora tienen un límite de 6 fotografías en su portafolio, mientras que las cuentas PRO tienen un límite ampliado de 30 fotografías.

## 🚀 Pendientes por Desarrollar (Próximos Pasos)
- [x] **Automatización de Mercado Pago (Webhooks):** Ruta `/api/webhooks/mercadopago` creada e integrada con el SDK oficial (App configurada como "Suscripciones Chambitas" en MP). Pendiente que el usuario agregue el Webhook en MP y el Access Token en Vercel.
- [x] **Configuración de Correos en Supabase:** Entrar al panel de Supabase > Auth > URL Configuration y actualizar la *Site URL* y *Redirect URLs* al dominio de producción en Vercel para que funcione correctamente el reseteo de contraseña.
- [ ] **Expansión de Categorías (Fase 2):** Agregar "Barberías y Estética" o "Belleza y Cuidado Personal" una vez consolidado el nicho de reparaciones del hogar.
