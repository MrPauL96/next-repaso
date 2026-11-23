import Link from 'next/link'

// ─── SERVER COMPONENT (por defecto) ──────────────────────────────────────────
// En el App Router TODO componente es Server Component a menos que tenga 'use client'.
// Un Server Component:
//   - se ejecuta solo en el servidor (o en el build)
//   - puede ser async y hacer await de datos directamente (sin useEffect ni loading manual)
//   - puede leer la base de datos o secretos (process.env.DB_PASSWORD) sin exponerlos
//   - NO manda su JavaScript al navegador -> bundles más pequeños
//   - NO puede usar useState, useEffect ni onClick
//
// Esta página no lee datos del request, así que Next la PRE-RENDERIZA en build time
// (HTML estático servido desde CDN). Eso es lo que antes llamábamos SSG.
//
// Pregunta de entrevista: diferencias entre CSR, SSR, SSG, ISR y streaming.
//   CSR    el navegador recibe un HTML vacío y JavaScript arma la página (Angular clásico, Vite + React).
//   SSR    el servidor arma el HTML en cada request.
//   SSG    el HTML se arma una vez en el build.
//   ISR    SSG que se regenera cada cierto tiempo o a demanda (aquí: cacheLife + updateTag/revalidateTag).
//   Streaming / PPR  se manda primero lo estático y lo dinámico llega por partes con <Suspense>.
export default function HomePage() {
  return (
    <>
      <h1>Repaso de Next.js 16</h1>
      <p className="muted">
        App de vuelos para practicar los temas que más preguntan en entrevistas. Lee los comentarios de
        cada archivo; el índice está en README.md.
      </p>

      <div className="grid">
        <Link className="card" href="/flights">
          <h3>Vuelos</h3>
          <p className="muted">Server Components, búsqueda con searchParams, Suspense, loading y error.</p>
        </Link>
        <Link className="card" href="/flights/AV101">
          <h3>Detalle de vuelo</h3>
          <p className="muted">Ruta dinámica, generateStaticParams, generateMetadata y notFound.</p>
        </Link>
        <Link className="card" href="/bookings">
          <h3>Reservas</h3>
          <p className="muted">Server Actions, useActionState, validación y updateTag.</p>
        </Link>
        <a className="card" href="/api/flights?from=MDE">
          <h3>API</h3>
          <p className="muted">Route Handler GET /api/flights que devuelve JSON.</p>
        </a>
      </div>
    </>
  )
}
