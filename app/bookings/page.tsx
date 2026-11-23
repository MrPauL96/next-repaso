import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { getBookings } from '@/lib/bookings'

export const metadata: Metadata = { title: 'Reservas' }

// La lista viene de getBookings(), cacheado con cacheTag('bookings').
// Cuando la Server Action llama updateTag('bookings'), esta lista se recalcula.
export default function BookingsPage() {
  return (
    <>
      <h1>Mis reservas</h1>
      <Suspense fallback={<p className="muted">Cargando reservas…</p>}>
        <BookingList />
      </Suspense>
    </>
  )
}

async function BookingList() {
  const bookings = await getBookings()

  if (bookings.length === 0) {
    return (
      <p className="muted">
        Aún no tienes reservas. <Link href="/flights">Busca un vuelo</Link>.
      </p>
    )
  }

  return (
    <ul>
      {bookings.map((b) => (
        <li key={b.id} className="card">
          <strong>{b.passengerName}</strong> · <Link href={`/flights/${b.flightId}`}>{b.flightId}</Link>
          <div className="muted">{b.email}</div>
        </li>
      ))}
    </ul>
  )
}
