'use client'
// Los error boundaries TIENEN que ser Client Components: React los maneja en el navegador.

import { useEffect } from 'react'

// ─── error.tsx ───────────────────────────────────────────────────────────────
// Atrapa errores INESPERADOS (un throw, una API caída) en este segmento y sus hijos.
// El resto de la app (layout, navegación) sigue funcionando.
//
// Dos tipos de errores (pregunta de entrevista):
//   - Esperados: validación de un formulario, "no encontrado". Se devuelven como datos
//     o se usa notFound(). No deberían llegar aquí.
//   - Inesperados: bugs, servicios caídos. Se lanzan con throw y los atrapa este archivo.
//
// En Next 16.3+ la prop para reintentar es `retry` (vuelve a pedir los datos y re-renderiza).
// En tutoriales viejos vas a ver `reset`, que solo re-renderiza sin volver a pedir datos.
export default function FlightsError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Aquí mandarías el error a Sentry, Datadog, etc.
    console.error(error)
  }, [error])

  // En producción, los errores que vienen del servidor llegan con un mensaje genérico
  // y un error.digest (un id) para no filtrar detalles internos al usuario.
  const message = error instanceof Error ? error.message : 'Error desconocido'

  return (
    <div className="card" role="alert">
      <h2>Algo salió mal cargando los vuelos</h2>
      <p className="error">{message}</p>
      <button onClick={() => retry()}>Reintentar</button>
    </div>
  )
}
