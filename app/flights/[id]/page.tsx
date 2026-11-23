import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookingForm } from '@/components/booking-form'
import { FavoriteButton } from '@/components/favorite-button'
import { getAllFlightIds, getFlightById } from '@/lib/flights'

// ─── RUTA DINÁMICA [id] ──────────────────────────────────────────────────────
// La carpeta [id] captura cualquier valor: /flights/AV101 -> params = { id: 'AV101' }.
// Equivale a { path: 'flights/:id' } en Angular, y params a ActivatedRoute.paramMap.
// Otras variantes: [...slug] (catch-all) y [[...slug]] (catch-all opcional).
type Params = Promise<{ id: string }>

// ─── generateStaticParams ────────────────────────────────────────────────────
// Le dice a Next qué ids pre-renderizar en BUILD time (SSG para rutas dinámicas).
// Los ids que no estén aquí se renderizan la primera vez que alguien los visita
// y luego quedan cacheados (eso es ISR).
// Con cacheComponents activado, debe devolver AL MENOS un elemento.
export function generateStaticParams() {
  return getAllFlightIds().map((id) => ({ id }))
}

// ─── generateMetadata ────────────────────────────────────────────────────────
// Metadata dinámica para SEO: el <title> depende del vuelo.
// getFlightById está cacheado con 'use cache', así que llamarlo aquí y en la página
// no hace dos consultas a la "base de datos".
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const flight = await getFlightById(id)
  if (!flight) return { title: 'Vuelo no encontrado' }
  return {
    title: `${flight.from} → ${flight.to} (${flight.id})`,
    description: `${flight.airline}, desde US$ ${flight.priceUsd}`,
  }
}

export default async function FlightDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const flight = await getFlightById(id)

  // notFound() lanza un error especial que Next convierte en la UI de not-found.tsx.
  // Es un error ESPERADO, por eso no cae en error.tsx.
  //
  // Pregunta avanzada: "¿por qué /flights/NOEXISTE responde 200 y no 404?"
  // Con streaming, Next ya mandó el shell con status 200 antes de saber que el vuelo no existe,
  // y un status HTTP no se puede cambiar después de empezar a responder.
  // Next agrega <meta name="robots" content="noindex"> para que Google no lo indexe.
  // Si necesitas un 404 real, valida antes de renderizar (en proxy.ts).
  if (!flight) notFound()

  // Formatear fechas en el servidor evita "hydration mismatch" por zonas horarias distintas
  // entre servidor y navegador. Aquí fijo la zona horaria para que siempre salga igual.
  const departure = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Bogota',
  }).format(new Date(flight.departure))

  return (
    <>
      <h1>
        {flight.from} → {flight.to}
      </h1>
      <div className="card">
        <p>
          {flight.airline} · vuelo {flight.id}
        </p>
        <p className="muted">Salida: {departure}</p>
        <p>
          <strong>US$ {flight.priceUsd}</strong> · {flight.seatsLeft} sillas disponibles
        </p>
        <FavoriteButton flightId={flight.id} />
      </div>

      <h2>Reservar</h2>
      {flight.seatsLeft === 0 ? (
        <p className="error">Este vuelo está agotado.</p>
      ) : (
        // BookingForm es Client Component y recibe solo datos serializables (un string).
        <BookingForm flightId={flight.id} />
      )}
    </>
  )
}
