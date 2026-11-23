import Link from 'next/link'

// Se muestra cuando la página llama notFound(). Responde con status HTTP 404.
// Puedes tener uno por segmento; el más cercano gana. También hay un app/not-found.tsx global.
export default function FlightNotFound() {
  return (
    <div className="card">
      <h2>No encontramos ese vuelo</h2>
      <p className="muted">Revisa el código o vuelve a la lista.</p>
      <Link href="/flights">Ver vuelos</Link>
    </div>
  )
}
