'use client'
// ─── 'use client' ────────────────────────────────────────────────────────────
// Marca la FRONTERA entre servidor y cliente. Este archivo y todo lo que importe
// se manda al navegador como JavaScript.
// Necesitas 'use client' cuando usas:
//   - estado o efectos: useState, useEffect, useReducer, useContext
//   - eventos del navegador: onClick, onChange
//   - APIs del navegador: window, localStorage
//   - hooks del router de cliente: usePathname, useRouter, useSearchParams
// Regla de oro: pon 'use client' lo más abajo posible en el árbol (en las "hojas"),
// para mandar menos JavaScript.
//
// Ojo: "Client Component" NO significa que solo corre en el navegador.
// También se pre-renderiza a HTML en el servidor y luego se "hidrata" en el navegador.

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/flights', label: 'Vuelos' },
  { href: '/bookings', label: 'Reservas' },
]

export function NavLinks() {
  // usePathname: ruta actual. Equivale a router.url / ActivatedRoute en Angular.
  const pathname = usePathname()

  return (
    <nav aria-label="Principal">
      {LINKS.map((link) => {
        const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
        return (
          // <Link> navega sin recargar la página (SPA) y PRE-CARGA la ruta destino
          // cuando el link aparece en pantalla. Equivale a routerLink en Angular.
          // Usar <a href> normal recargaría la página completa.
          <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined}>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
