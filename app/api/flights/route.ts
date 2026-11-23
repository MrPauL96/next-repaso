import type { NextRequest } from 'next/server'
import { getFlights } from '@/lib/flights'

// ─── ROUTE HANDLER ───────────────────────────────────────────────────────────
// route.ts crea un endpoint HTTP en /api/flights usando las APIs web estándar Request y Response.
// Exportas una función por verbo: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.
// Es como un @RestController de Spring Boot o un handler de Express.
//
// Pregunta de entrevista: "¿Route Handler o Server Action?"
//   - Server Action: mutaciones que dispara TU propia UI (formularios, botones). Siempre es POST.
//   - Route Handler: cuando un TERCERO consume la API (app móvil, webhook de Stripe, otro servicio),
//     cuando necesitas GET públicos, o controlar status, headers y CORS a mano.
//   - Para LEER datos en tu propia UI no necesitas ninguno: usa un Server Component.
//
// Patrón "Backend for Frontend" (BFF): Next actúa como capa intermedia que llama
// a tu backend real (por ejemplo Spring Boot) y le devuelve al front solo lo que necesita.
//
// Con Cache Components, leer request.nextUrl hace que este GET corra en cada request.
// getFlights() sigue cacheado por dentro con 'use cache'.
export async function GET(request: NextRequest) {
  const from = request.nextUrl.searchParams.get('from') ?? undefined
  const to = request.nextUrl.searchParams.get('to') ?? undefined

  const flights = await getFlights({ from, to })

  return Response.json(
    { count: flights.length, flights },
    { headers: { 'Cache-Control': 'public, max-age=60' } },
  )
}
