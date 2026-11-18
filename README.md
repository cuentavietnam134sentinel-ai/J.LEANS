# J.LEANS · Portfolio de Fotografía de Paisaje

Sitio web de portafolio/álbum de fotografía de paisaje para Juan Manuel. Construido con Vite, HTML, CSS vanilla y JavaScript, integrado con Supabase (Autenticación, Storage y Base de Datos).

## Tecnología

- **Build Tool**: Vite
- **Estilo**: CSS vanilla con variables CSS y Google Fonts
- **JavaScript**: Módulos ES6
- **Base de Datos**: Supabase (PostgreSQL)
- **Almacenamiento**: Supabase Storage
- **Autenticación**: Supabase Auth

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Supabase

## Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/j-leans-portfolio.git
   cd j-leans-portfolio
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   - Copia el archivo `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edita el archivo `.env` y coloca tu URL de Supabase y la clave anon key:
     ```bash
     VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
     VITE_SUPABASE_ANON_KEY=tu-clave-anon
     ```

4. **Configurar Supabase:**
   - Ve a tu proyecto en [Supabase](https://supabase.com/dashboard).
   - Ejecuta el script SQL de `supabase/setup.sql` en el Editor SQL para crear la tabla `photos`, las políticas de RLS y el bucket de almacenamiento `photos`.
   - Verifica que el bucket `photos` esté configurado como **público**.

5. **Ejecutar el proyecto en desarrollo:**
   ```bash
   npm run dev
   ```
   - Abre `http://localhost:3000` en tu navegador.

## Panel de Administración

El panel de administración está oculto por seguridad. Para acceder:

1. Haz clic en el hash de la URL o escribe `#admin` al final de la dirección (ej: `http://localhost:3000/#admin`).
2. Inicia sesión con las credenciales de Supabase Auth.
3. Una vez autenticado, podrás:
   - Subir nuevas fotografías (se comprimen automáticamente a ~2000px de ancho).
   - Eliminar fotografías existentes.

## Estructura del Proyecto

```
j-leans-portfolio/
├── public/
│   └── (archivos estáticos si los hay)
├── src/ (opcional, se puede usar para modularizar)
├── js/
│   ├── supabase.js    # Inicialización del cliente de Supabase
│   ├── main.js        # Lógica principal, nav, observers
│   ├── album.js       # Renderizado del álbum y lightbox
│   └── admin.js       # Lógica del panel de administración
├── css/
│   └── styles.css     # Estilos principales
├── supabase/
│   └── setup.sql      # Script SQL de inicialización
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

## Construir para Producción

```bash
npm run build
```

Los archivos generados quedarán en la carpeta `dist/`. Para previsualizar la versión de producción localmente:

```bash
npm run preview
```

## Despliegue en Vercel

1. Conecta tu repositorio de GitHub a Vercel.
2. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. El build se ejecutará automáticamente con `npm run build`.
4. ¡Listo! Tu sitio estará disponible en la URL de Vercel.

## Personalización

- **Colores**: Edita las variables CSS en `css/styles.css` (por ejemplo, `--bg-color`, `--accent`).
- **Fuentes**: Las fuentes actualmente son `Instrument Serif` y `Plus Jakarta Sans` de Google Fonts.
- **Fotografías**: Todas las fotos se cargan dinámicamente desde Supabase Storage y se listan en la tabla `photos`.

## Mantenimiento

- Para agregar más fotos, subelas desde el panel de administración o insertalas directamente en la tabla `photos` de Supabase.
- Las políticas de Row Level Security (RLS) están configuradas para permitir lectura pública y escritura/eliminación solo para usuarios autenticados.