'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// ─── CONTEXT: estado compartido en el cliente ────────────────────────────────
// Context evita el "prop drilling" (pasar props por 5 niveles).
// Equivale a un servicio Angular con providedIn: 'root' + un BehaviorSubject.
//
// Pregunta de entrevista: "¿Context, Redux, Zustand o TanStack Query?"
//   - Context: estado global pequeño y que cambia poco (tema, usuario, favoritos).
//     Cada cambio re-renderiza a TODOS los consumidores, por eso no sirve para estado que cambia mucho.
//   - Redux Toolkit / Zustand: estado de cliente grande o muy cambiante. Redux es el equivalente a NgRx.
//   - TanStack Query / SWR: estado del SERVIDOR en el cliente (caché, reintentos, refetch).
//   - En Next con App Router, mucho del "estado del servidor" ya lo resuelven
//     los Server Components, así que necesitas menos librerías de estado.

type FavoritesContextValue = {
  favorites: string[]
  isFavorite: (id: string) => boolean
  toggle: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

const STORAGE_KEY = 'favorite-flights'

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  // ─── useEffect y la HIDRATACIÓN ──────────────────────────────────────────
  // Este componente se renderiza primero en el SERVIDOR, donde no existe localStorage.
  // Si leyera localStorage directamente en useState, el HTML del servidor (lista vacía)
  // no coincidiría con el del cliente (lista con favoritos) -> "hydration mismatch".
  // Solución: arrancar igual que el servidor y leer localStorage en un efecto,
  // que SOLO corre en el navegador después de hidratar.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) setFavorites(JSON.parse(saved) as string[])
  }, []) // [] = solo al montar, como ngOnInit

  // Guarda cada vez que cambia `favorites` (el arreglo de dependencias define cuándo corre).
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  // useCallback: guarda la MISMA referencia de la función entre renders.
  // Importa cuando la pasas a hijos memorizados o a dependencias de efectos.
  const toggle = useCallback((id: string) => {
    // Forma funcional de setState: usa el valor anterior y evita estados viejos (stale state).
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }, [])

  // useMemo: memoriza el objeto del contexto. Sin esto, cada render crearía un objeto nuevo
  // y TODOS los consumidores se re-renderizarían aunque nada haya cambiado.
  // (El React Compiler puede hacer esto automático, pero en entrevistas lo preguntan igual.)
  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite: (id) => favorites.includes(id), toggle }),
    [favorites, toggle],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

// ─── CUSTOM HOOK ─────────────────────────────────────────────────────────────
// Un custom hook es una función que empieza con "use" y usa otros hooks.
// Sirve para reutilizar lógica con estado. Es lo más parecido a inyectar un servicio en Angular.
// Reglas de los hooks: llamarlos siempre en el nivel superior del componente,
// nunca dentro de if, for o funciones anidadas.
export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>')
  return ctx
}
