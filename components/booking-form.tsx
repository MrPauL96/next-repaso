'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createBooking } from '@/app/bookings/actions'
import type { BookingFormState } from '@/lib/types'

const initialState: BookingFormState = { ok: false, message: '' }

// ─── FORMULARIOS CON SERVER ACTIONS (React 19) ───────────────────────────────
// useActionState(accion, estadoInicial) devuelve:
//   state       lo último que devolvió la acción (mensajes, errores por campo)
//   formAction  la función que pasas a <form action={...}>
//   isPending   true mientras la acción corre en el servidor
// Reemplaza al patrón viejo de onSubmit + preventDefault + fetch + useState(loading) + useState(error).
//
// Progressive enhancement: como usa <form action>, el formulario funciona incluso
// antes de que cargue el JavaScript.
export function BookingForm({ flightId }: { flightId: string }) {
  const [state, formAction, isPending] = useActionState(createBooking, initialState)

  return (
    <form action={formAction} className="stack card" noValidate>
      {/*
        Campo oculto para mandar el id del vuelo.
        Alternativa: createBooking.bind(null, flightId) para "pre-cargar" argumentos.
        Recuerda: el servidor debe validar este valor, porque el usuario lo puede cambiar.
      */}
      <input type="hidden" name="flightId" value={flightId} />

      <label>
        Nombre del pasajero
        <input
          name="passengerName"
          autoComplete="name"
          aria-invalid={Boolean(state.fieldErrors?.passengerName)}
          aria-describedby={state.fieldErrors?.passengerName ? 'name-error' : undefined}
        />
      </label>
      {state.fieldErrors?.passengerName && (
        <span id="name-error" className="error">
          {state.fieldErrors.passengerName}
        </span>
      )}

      <label>
        Correo
        <input
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
        />
      </label>
      {state.fieldErrors?.email && (
        <span id="email-error" className="error">
          {state.fieldErrors.email}
        </span>
      )}

      <SubmitButton />

      {/* role="status" + aria-live: el lector de pantalla anuncia el resultado. */}
      <p role="status" aria-live="polite" className={state.ok ? 'ok' : 'error'}>
        {state.message}
        {state.ok && (
          <>
            {' · '}
            <Link href="/bookings">Ver mis reservas</Link>
          </>
        )}
      </p>
      {isPending && <span className="muted">Enviando…</span>}
    </form>
  )
}

// useFormStatus lee el estado del <form> PADRE más cercano.
// Por eso tiene que estar en un componente hijo, no en el mismo componente que el <form>.
// Pregunta trampa de entrevista: "¿por qué useFormStatus siempre me da pending = false?"
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Reservando…' : 'Reservar'}
    </button>
  )
}
