'use client'

import { useFavorites } from './favorites-provider'

// Componente "hoja" interactivo: solo este botón es cliente.
// La tarjeta del vuelo que lo contiene sigue siendo Server Component.
export function FavoriteButton({ flightId }: { flightId: string }) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(flightId)

  return (
    <button
      type="button"
      className="ghost"
      // aria-pressed comunica a lectores de pantalla que es un botón de alternar (toggle).
      aria-pressed={active}
      onClick={() => toggle(flightId)}
    >
      {active ? '★ Favorito' : '☆ Guardar'}
    </button>
  )
}
