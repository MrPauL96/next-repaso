import type { NextConfig } from 'next'

// next.config.ts es la configuración global del framework (como angular.json + algo de environment).
//
// cacheComponents: activa el modelo moderno de Next 16:
//   - Nada se cachea "por magia". Tú decides qué se cachea con la directiva 'use cache'.
//   - Lo que no está cacheado y depende del request (cookies, searchParams, fetch sin caché)
//     tiene que ir dentro de <Suspense>, para que Next pueda servir primero un "static shell"
//     (HTML estático instantáneo) y luego "streamear" lo dinámico.
//   - A esa mezcla de estático + dinámico en la misma página se le llama
//     Partial Prerendering (PPR). Es pregunta frecuente de entrevista en 2025-2026.
//
// partialPrefetching: el <Link> precarga solo el "App Shell" de la ruta destino
// (lo estático), así la navegación se siente instantánea.
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Hay un package-lock.json en la carpeta de usuario; sin esto Turbopack la toma como raíz.
  turbopack: { root: __dirname },
}

export default nextConfig
