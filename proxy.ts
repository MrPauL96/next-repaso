import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── PROXY (antes "middleware") ──────────────────────────────────────────────
// En Next 16 middleware.ts pasó a llamarse proxy.ts y la función exportada, proxy.
// Si en una entrevista dicen "middleware", es esto mismo.
//
// Corre ANTES de que se renderice cualquier ruta. Sirve para:
//   - autenticación rápida: si no hay cookie de sesión, redirigir a /login
//   - redirecciones y rewrites (URLs viejas, A/B testing, multi-idioma)
//   - agregar headers (seguridad, ids de trazabilidad)
// Equivale a un guard (canActivate) + un HttpInterceptor de Angular, pero en el servidor.
//
// Buenas prácticas:
//   - Que sea liviano: corre en cada request que coincida con el matcher.
//   - No hagas aquí toda la autorización: vuelve a verificar en la página o en la Server Action.
//     El proxy es una primera barrera, no la única.
export function proxy(request: NextRequest) {
  // Ejemplo 1: URL en español que redirige a la ruta real.
  if (request.nextUrl.pathname.startsWith('/vuelos')) {
    const url = request.nextUrl.clone()
    url.pathname = request.nextUrl.pathname.replace('/vuelos', '/flights')
    return NextResponse.redirect(url)
  }

  // Ejemplo 2 (comentado): proteger rutas privadas.
  // if (request.nextUrl.pathname.startsWith('/bookings') && !request.cookies.has('session')) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // Ejemplo 3: dejar pasar la petición, agregando un header a la respuesta.
  const response = NextResponse.next()
  response.headers.set('x-repaso', 'next-16')
  return response
}

// matcher: en qué rutas corre el proxy.
// Se excluyen los archivos estáticos para no gastar ejecuciones en CSS, JS e imágenes.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
