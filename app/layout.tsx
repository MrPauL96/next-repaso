import type { Metadata } from 'next'
import { FavoritesProvider } from '@/components/favorites-provider'
import { NavLinks } from '@/components/nav-links'
import './globals.css'

// ─── APP ROUTER: cómo se arma una ruta ───────────────────────────────────────
// En el App Router las rutas salen de las CARPETAS dentro de app/:
//   app/page.tsx              -> /
//   app/flights/page.tsx      -> /flights
//   app/flights/[id]/page.tsx -> /flights/AV101   ([id] = segmento dinámico)
//   app/api/flights/route.ts  -> /api/flights     (endpoint HTTP, no una página)
//
// Archivos especiales por carpeta:
//   layout.tsx    UI que envuelve a las páginas hijas y NO se vuelve a montar al navegar
//   page.tsx      la página en sí; sin page.tsx la ruta no existe
//   loading.tsx   fallback mientras carga (por debajo es un <Suspense>)
//   error.tsx     error boundary del segmento (tiene que ser Client Component)
//   not-found.tsx lo que se muestra cuando llamas notFound()
//
// Comparación con Angular: el layout es como el AppComponent con <router-outlet>,
// solo que aquí `children` ocupa el lugar del router-outlet.
//
// Pregunta de entrevista: "¿App Router o Pages Router?"
// Pages Router (pages/, getServerSideProps, getStaticProps) es el modelo legacy.
// App Router (app/) es el modelo actual: Server Components, layouts anidados,
// streaming y Server Actions. Muchas empresas tienen apps en ambos, por eso preguntan.

// ─── METADATA ────────────────────────────────────────────────────────────────
// Reemplaza al <Head> del Pages Router y a los servicios Title/Meta de Angular.
// Sirve para SEO: título, descripción, Open Graph, etc.
// Puede ser estática (este objeto) o dinámica (generateMetadata, ver app/flights/[id]/page.tsx).
export const metadata: Metadata = {
  title: { default: 'Vuelos · Repaso Next.js', template: '%s · Vuelos' },
  description: 'Proyecto de repaso de Next.js 16 con App Router',
}

// El root layout es OBLIGATORIO y es el único que debe tener <html> y <body>.
// Es un Server Component: no tiene 'use client', así que no manda su JavaScript al navegador.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/*
          FavoritesProvider es un Client Component (usa Context y useState).
          Patrón clave de entrevista: un Client Component PUEDE recibir Server Components
          como `children`. Los hijos siguen renderizándose en el servidor; el provider
          solo agrega interactividad alrededor. Así no conviertes toda la app en cliente.
        */}
        <FavoritesProvider>
          <header className="site">
            <strong>✈️ Vuelos</strong>
            <NavLinks />
          </header>
          <main>{children}</main>
        </FavoritesProvider>
      </body>
    </html>
  )
}
