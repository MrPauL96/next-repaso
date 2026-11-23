import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import type { Booking } from './types'

// "Base de datos" en memoria. Se guarda en globalThis para que sobreviva a los
// recargas en caliente (hot reload) de next dev. Se borra al reiniciar el servidor.
// En producción usarías Postgres, Prisma, Drizzle, etc.
const store = globalThis as unknown as { __bookings?: Booking[] }
store.__bookings ??= []

// Lectura cacheada con la etiqueta 'bookings'.
// Cuando la Server Action crea una reserva, llama updateTag('bookings')
// y esta lista se vuelve a calcular en el siguiente render.
export async function getBookings(): Promise<Booking[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('bookings')

  return [...store.__bookings!].reverse()
}

export async function saveBooking(booking: Booking): Promise<void> {
  store.__bookings!.push(booking)
}
