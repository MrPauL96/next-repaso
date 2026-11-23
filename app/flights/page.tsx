import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FlightCard } from '@/components/flight-card'
import { SearchForm } from '@/components/search-form'
import { getFlights } from '@/lib/flights'

export const metadata: Metadata = { title: 'Vuelos' }

// ─── searchParams es una PROMESA (Next 15+, obligatorio en 16) ────────────────
// /flights?from=MDE&to=BOG  ->  searchParams resuelve a { from: 'MDE', to: 'BOG' }
// Lo mismo pasa con params, cookies() y headers(): hay que hacer await.
// Next tiene un helper global PageProps<'/flights'> para tiparlo; aquí lo escribo a mano para que se vea.
type SearchParams = Promise<{ from?: string; to?: string }>

// Esta página NO es async y NO hace await de searchParams arriba.
// Le pasa la promesa a <Results>, que la resuelve DENTRO de <Suspense>.
// Resultado: el título y el formulario forman parte del "static shell" (llegan al instante)
// y solo los resultados se streamean cuando están listos.
// Si hicieras `await searchParams` aquí arriba, toda la página esperaría.
export default function FlightsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <h1>Vuelos</h1>

      {/*
        SearchForm usa useSearchParams (lee la URL en el cliente).
        Va dentro de Suspense porque la URL solo se conoce en el request.
      */}
      <Suspense fallback={<p className="muted">Cargando buscador…</p>}>
        <SearchForm />
      </Suspense>

      {/*
        <Suspense> muestra el fallback mientras <Results> resuelve sus promesas.
        Equivale a un *ngIf="data$ | async; else loading" en Angular, pero declarado
        en el árbol y con streaming desde el servidor.
      */}
      <Suspense fallback={<ResultsSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  )
}

// Un Server Component async: hace await de datos directamente, sin useEffect ni useState.
// Pregunta de entrevista: "¿cómo haces fetching de datos en Next?"
//   - En Server Components: async/await directo (lo recomendado).
//   - En Client Components: TanStack Query/SWR, o el hook use() de React con una promesa
//     que te pasa un Server Component.
//   - Evita los "waterfalls": si necesitas dos datos independientes, usa Promise.all.
async function Results({ searchParams }: { searchParams: SearchParams }) {
  const { from, to } = await searchParams
  const flights = await getFlights({ from, to })

  if (flights.length === 0) {
    return <p className="muted">No hay vuelos para esa búsqueda.</p>
  }

  return (
    <section className="grid" aria-label="Resultados">
      {flights.map((flight) => (
        // key: identificador estable para que React sepa qué elemento es cuál al re-renderizar.
        // Equivale a trackBy en *ngFor / track en @for. Nunca uses el índice si la lista se reordena.
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </section>
  )
}

function ResultsSkeleton() {
  return (
    <div className="grid" aria-busy="true" aria-label="Cargando resultados">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  )
}
