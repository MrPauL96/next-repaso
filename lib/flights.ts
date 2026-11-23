import 'server-only'
// 'server-only' hace que el build FALLE si un Client Component importa este archivo.
// Así garantizas que la lógica de datos (y cualquier secreto) nunca llegue al navegador.
// Pregunta de entrevista: "¿cómo evitas filtrar código o secretos del servidor al cliente?"

import { cacheLife, cacheTag } from 'next/cache'
import type { Flight } from './types'

// Datos falsos. En un proyecto real esto sería una consulta a la base de datos
// o un fetch a una API (por ejemplo, tu backend en Spring Boot).
const FLIGHTS: Flight[] = [
  { id: 'AV101', airline: 'Avianca', from: 'MDE', to: 'BOG', departure: '2026-12-20T07:30:00-05:00', durationMinutes: 55, priceUsd: 89, seatsLeft: 12 },
  { id: 'LA202', airline: 'LATAM', from: 'MDE', to: 'MIA', departure: '2026-12-21T10:15:00-05:00', durationMinutes: 210, priceUsd: 340, seatsLeft: 4 },
  { id: 'AV303', airline: 'Avianca', from: 'BOG', to: 'MAD', departure: '2026-12-22T19:40:00-05:00', durationMinutes: 600, priceUsd: 780, seatsLeft: 20 },
  { id: 'CM404', airline: 'Copa', from: 'MDE', to: 'PTY', departure: '2026-12-23T06:00:00-05:00', durationMinutes: 90, priceUsd: 210, seatsLeft: 0 },
  { id: 'JA505', airline: 'JetSMART', from: 'BOG', to: 'CTG', departure: '2026-12-24T13:20:00-05:00', durationMinutes: 80, priceUsd: 45, seatsLeft: 30 },
  { id: 'AA606', airline: 'American', from: 'MIA', to: 'JFK', departure: '2026-12-26T08:45:00-05:00', durationMinutes: 170, priceUsd: 160, seatsLeft: 7 },
]

// Simula la latencia de una base de datos o API para que veas loading.tsx y Suspense en acción.
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── 'use cache' a nivel de DATOS ────────────────────────────────────────────
// La directiva 'use cache' cachea el RESULTADO de la función.
// - Los argumentos (from, to) forman parte de la llave de caché:
//   getFlights({ from: 'MDE' }) y getFlights({ from: 'BOG' }) son entradas distintas.
// - cacheLife('hours') define cuánto tiempo vive (perfiles: seconds, minutes, hours, days, weeks, max).
// - cacheTag('flights') le pone una etiqueta para invalidarla después a demanda
//   con updateTag('flights') o revalidateTag('flights', 'max').
//
// Comparación con Angular: es parecido a cachear un Observable con shareReplay,
// pero en el SERVIDOR y compartido entre usuarios.
export async function getFlights(filters: { from?: string; to?: string } = {}): Promise<Flight[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('flights')

  await delay(600)

  const from = filters.from?.trim().toUpperCase()
  const to = filters.to?.trim().toUpperCase()

  return FLIGHTS.filter((f) => (!from || f.from === from) && (!to || f.to === to))
}

export async function getFlightById(id: string): Promise<Flight | undefined> {
  'use cache'
  cacheLife('hours')
  cacheTag(`flight-${id}`)

  await delay(300)
  return FLIGHTS.find((f) => f.id === id)
}

// Sin 'use cache': se usa en generateStaticParams, que corre en build time.
export function getAllFlightIds(): string[] {
  return FLIGHTS.map((f) => f.id)
}
