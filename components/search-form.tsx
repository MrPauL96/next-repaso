'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

// ─── ESTADO EN LA URL ────────────────────────────────────────────────────────
// Los filtros viven en la URL (?from=MDE&to=BOG), no en un useState global.
// Ventajas: se pueden compartir por link, sobreviven a recargar la página,
// funciona el botón "atrás" y el servidor puede leerlos para renderizar.
// Pregunta de entrevista frecuente: "¿dónde guardarías el estado de los filtros?"
export function SearchForm() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ─── INPUT CONTROLADO ──────────────────────────────────────────────────
  // El valor del input lo maneja React con useState (como [(ngModel)] en Angular).
  // La alternativa es un input NO controlado: defaultValue + leer con un ref o FormData.
  const [from, setFrom] = useState(searchParams.get('from') ?? '')
  const [to, setTo] = useState(searchParams.get('to') ?? '')

  // useTransition: marca la navegación como "no urgente".
  // El input sigue respondiendo mientras el servidor calcula los nuevos resultados,
  // e isPending te dice si la transición sigue en curso.
  const [isPending, startTransition] = useTransition()

  // useRef: un valor que persiste entre renders SIN provocar re-render.
  // Sirve para referencias al DOM (como @ViewChild) o, como aquí, para saber si es el primer render.
  const isFirstRender = useRef(true)

  // ─── DEBOUNCE CON useEffect Y CLEANUP ──────────────────────────────────
  // Espera 400 ms después de que el usuario deja de escribir para actualizar la URL.
  // La función que retorna el efecto es el CLEANUP: corre antes del siguiente efecto
  // y al desmontar. Aquí cancela el timer anterior. Equivale a debounceTime(400)
  // + takeUntil(destroy$) en RxJS.
  // Pregunta de entrevista: "¿para qué sirve el return de useEffect?"
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (from) params.set('from', from.toUpperCase())
      if (to) params.set('to', to.toUpperCase())
      const query = params.toString()

      startTransition(() => {
        // replace en vez de push para no llenar el historial con cada tecla.
        router.replace(query ? `${pathname}?${query}` : pathname)
      })
    }, 400)

    return () => clearTimeout(timer)
  }, [from, to, pathname, router])

  return (
    <form className="card" role="search" onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
        <label>
          Origen
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="MDE" maxLength={3} />
        </label>
        <label>
          Destino
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="BOG" maxLength={3} />
        </label>
        {/* aria-live anuncia el cambio a lectores de pantalla sin mover el foco. */}
        <span className="muted" aria-live="polite">
          {isPending ? 'Buscando…' : ''}
        </span>
      </div>
    </form>
  )
}
