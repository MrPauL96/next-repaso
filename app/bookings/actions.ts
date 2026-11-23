'use server'
// ─── 'use server' ────────────────────────────────────────────────────────────
// Con la directiva arriba del archivo, TODAS las funciones exportadas son Server Functions.
// Una Server Action es una función que corre en el servidor pero la llamas desde el cliente
// como si fuera local. Next crea por debajo un endpoint POST. No escribes fetch ni un controller.
//
// Comparación: en Angular harías this.http.post('/api/bookings', body) contra tu Spring Boot.
// Aquí el formulario llama la función directamente y Next se encarga del viaje de red.
//
// ⚠️ SEGURIDAD (pregunta de entrevista): una Server Action es un endpoint público.
// Cualquiera puede llamarla con un POST aunque no esté en tu UI. SIEMPRE:
//   1. Valida la entrada (aquí a mano; en proyectos reales con Zod).
//   2. Verifica autenticación y autorización DENTRO de la acción.
//   3. No confíes en campos ocultos del formulario para decidir permisos.

import { updateTag } from 'next/cache'
import { saveBooking } from '@/lib/bookings'
import { getFlightById } from '@/lib/flights'
import type { BookingFormState } from '@/lib/types'

// Firma para usar con useActionState: (estadoAnterior, formData) => nuevoEstado.
export async function createBooking(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  // const session = await auth()
  // if (!session) return { ok: false, message: 'Debes iniciar sesión' }

  const flightId = String(formData.get('flightId') ?? '')
  const passengerName = String(formData.get('passengerName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()

  // Validación en el SERVIDOR. La del navegador (required, type="email") es solo comodidad:
  // se puede saltar fácilmente, así que la que cuenta es esta.
  const fieldErrors: BookingFormState['fieldErrors'] = {}
  if (passengerName.length < 3) fieldErrors.passengerName = 'Escribe el nombre completo'
  if (!/^\S+@\S+\.\S+$/.test(email)) fieldErrors.email = 'Correo inválido'

  if (Object.keys(fieldErrors).length > 0) {
    // Error ESPERADO: se devuelve como dato, no con throw.
    return { ok: false, message: 'Revisa los campos', fieldErrors }
  }

  const flight = await getFlightById(flightId)
  if (!flight || flight.seatsLeft === 0) {
    return { ok: false, message: 'El vuelo ya no está disponible' }
  }

  await saveBooking({
    id: crypto.randomUUID(),
    flightId,
    passengerName,
    email,
    createdAt: new Date().toISOString(),
  })

  // ─── INVALIDAR CACHÉ DESPUÉS DE MUTAR ────────────────────────────────────
  // getBookings() tiene cacheTag('bookings'). updateTag lo expira YA, así el usuario
  // ve su reserva en la siguiente pantalla ("read your own writes").
  //   updateTag(tag)            solo en Server Actions; el siguiente render espera datos frescos.
  //   revalidateTag(tag, 'max') sirve también en Route Handlers; muestra lo viejo mientras
  //                             recalcula en segundo plano (stale-while-revalidate).
  //   revalidatePath('/ruta')   invalida por ruta en vez de por etiqueta.
  updateTag('bookings')

  // Podrías redirigir con redirect('/bookings') (de next/navigation).
  // Aquí devuelvo un mensaje para mostrar cómo useActionState pinta el resultado.
  return { ok: true, message: `Reserva confirmada para ${passengerName}` }
}
