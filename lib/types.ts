// Tipos compartidos entre servidor y cliente.
// Un archivo de solo tipos se puede importar desde Server y Client Components sin problema,
// porque los tipos desaparecen al compilar (no agregan JavaScript al bundle del navegador).

export type Flight = {
  id: string
  airline: string
  from: string // código IATA, por ejemplo MDE
  to: string
  departure: string // ISO 8601, por ejemplo 2026-12-20T07:30:00-05:00
  durationMinutes: number
  priceUsd: number
  seatsLeft: number
}

export type Booking = {
  id: string
  flightId: string
  passengerName: string
  email: string
  createdAt: string
}

// Forma del estado que devuelve la Server Action de reservas.
// Patrón recomendado: los errores ESPERADOS (validación) se devuelven como datos,
// no se lanzan con throw. throw queda para bugs y errores inesperados (los atrapa error.tsx).
export type BookingFormState = {
  ok: boolean
  message: string
  fieldErrors?: Partial<Record<'passengerName' | 'email', string>>
}
