import Link from 'next/link'
import type { Flight } from '@/lib/types'
import { FavoriteButton } from './favorite-button'

// Server Component SIN 'use client' que contiene un Client Component (FavoriteButton).
// Esa es la composición correcta: la tarjeta es HTML del servidor y solo el botón hidrata.
//
// Regla de la frontera servidor -> cliente:
// las props que le pasas a un Client Component deben ser SERIALIZABLES
// (string, number, boolean, arrays, objetos planos, Date, promesas, Server Actions).
// No puedes pasarle funciones normales ni instancias de clases.
export function FlightCard({ flight }: { flight: Flight }) {
  const hours = Math.floor(flight.durationMinutes / 60)
  const minutes = flight.durationMinutes % 60

  return (
    <article className="card">
      <h3>
        <Link href={`/flights/${flight.id}`}>
          {flight.from} → {flight.to}
        </Link>
      </h3>
      <p className="muted">
        {flight.airline} · {flight.id} · {hours}h {minutes}m
      </p>
      <p>
        <strong>US$ {flight.priceUsd}</strong>{' '}
        {flight.seatsLeft === 0 ? (
          <span className="error">Agotado</span>
        ) : (
          <span className="muted">{flight.seatsLeft} sillas</span>
        )}
      </p>
      <FavoriteButton flightId={flight.id} />
    </article>
  )
}
