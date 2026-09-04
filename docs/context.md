# Contexto del Proyecto FIXO

**Fixo ("La red de tus mejores chambas")** es un directorio local y tarjeta digital con código QR para prestadores de servicios técnicos y oficios (plomería, electricidad, climas/refrigeración, mecánica, carpintería, cerrajería, etc.) en Tuxtla Gutiérrez, Chiapas.

El objetivo principal es conectar a clientes con técnicos verificados directamente vía WhatsApp, sin intermediar el dinero de la mano de obra.

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

### 🛠️ Portal del Técnico (Privado)
| Ruta | Descripción |
| :--- | :--- |
| **`/portal/login`** | **Acceso**: Botón de acceso rápido (Demo Carlos Morales). |
| **`/portal/dashboard`** | **Métricas**: Vistas, clics a WhatsApp y conversión. |
| **`/portal/dashboard/perfil`** | **Edición**: Datos de contacto y zonas atendidas. |
| **`/portal/dashboard/portafolio`** | **Galería**: Subida de fotos comprimidas y switch Antes/Después. |
| **`/portal/dashboard/verificacion`** | **INE**: Subida de credencial para insignia verificada. |
| **`/portal/dashboard/mi-qr`** | **Generador de Volante**: Descarga de PDF/PNG con QR promocional. |

### 👑 Panel Superadmin
| Ruta | Descripción |
| :--- | :--- |
| **`/admin`** | **Métricas Maestras**: Resumen de plataforma. |
| **`/admin/verificaciones`** | **Cumplimiento LFPDPPP**: Revisión manual de INE, aprobación y purga de imágenes para evitar retención de datos sensibles. |
| **`/admin/banners`** | **Publicidad Local**: Gestión de patrocinadores. |

## Configuración de Supabase (Paso a Producción)

Para pasar del modo demo al modo real:

1. **Crear Proyecto**: En [supabase.com](https://supabase.com).
2. **Ejecutar SQL**: Correr el archivo `supabase/migrations/20240101_init.sql` en el SQL Editor de Supabase. Esto crea las 6 tablas principales (`profiles`, `categories`, `technician_categories`, `portfolio_items`, `verification_documents`, `banners`) y funciones/políticas (RLS).
3. **Crear Storage Buckets**:
   - `public-media` (Public Bucket): Para fotos de perfil y portafolios.
   - `private-docs` (Private Bucket): Para documentos de verificación (INE).
4. **Configurar Variables de Entorno**: Actualizar `.env.local` con:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```
