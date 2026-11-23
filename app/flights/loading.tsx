// ─── loading.tsx ─────────────────────────────────────────────────────────────
// Next envuelve automáticamente el page.tsx de esta carpeta (y las rutas hijas,
// como /flights/[id]) en un <Suspense fallback={<Loading />}>.
// Al navegar, el layout se queda visible e interactivo y esto aparece al instante
// mientras llega el contenido.
//
// Diferencia con <Suspense> manual: loading.tsx cubre TODA la página del segmento;
// <Suspense> te deja elegir qué partes esperan y cuáles no (más granular).
export default function Loading() {
  return (
    <div aria-busy="true">
      <p className="muted">Cargando vuelos…</p>
      <div className="skeleton" />
    </div>
  )
}
