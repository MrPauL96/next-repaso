# Repaso de Next.js 16 (App Router)

App de vuelos para repasar lo que piden las empresas y lo que preguntan en entrevistas.
Cada archivo tiene comentarios en español que explican el concepto, con comparaciones con Angular.

Versiones: Next.js 16.4, React 19.3, TypeScript.

## Cómo correrlo

```bash
npm install
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción: mira la tabla de rutas al final
npm start        # sirve el build
```

En la tabla de `npm run build`, los símbolos dicen cómo se renderiza cada ruta:
`○` estática, `◐` Partial Prerender (shell estático + partes en streaming), `ƒ` dinámica.

## Índice: tema → archivo

| Tema | Archivo |
|---|---|
| Estructura del App Router, layouts, metadata | `app/layout.tsx` |
| Server Components, CSR/SSR/SSG/ISR/streaming | `app/page.tsx` |
| `'use client'`, `<Link>`, `usePathname` | `components/nav-links.tsx` |
| Context, custom hooks, `useEffect`, `useMemo`, `useCallback`, hidratación | `components/favorites-provider.tsx` |
| Server Component que contiene un Client Component, props serializables, `key` | `components/flight-card.tsx` |
| `searchParams` como promesa, `<Suspense>`, evitar waterfalls | `app/flights/page.tsx` |
| Estado en la URL, inputs controlados, `useTransition`, `useRef`, debounce con cleanup | `components/search-form.tsx` |
| `loading.tsx` | `app/flights/loading.tsx` |
| `error.tsx`, errores esperados vs inesperados, `retry` | `app/flights/error.tsx` |
| Rutas dinámicas, `generateStaticParams`, `generateMetadata`, `notFound`, 200 vs 404 con streaming | `app/flights/[id]/page.tsx` |
| Caché: `'use cache'`, `cacheLife`, `cacheTag`, `server-only` | `lib/flights.ts`, `lib/bookings.ts` |
| Server Actions, validación, seguridad, `updateTag` vs `revalidateTag` | `app/bookings/actions.ts` |
| `useActionState`, `useFormStatus`, accesibilidad en formularios | `components/booking-form.tsx` |
| Route Handlers, BFF, Route Handler vs Server Action | `app/api/flights/route.ts` |
| `proxy.ts` (antes `middleware.ts`) | `proxy.ts` |
| Configuración: Cache Components, PPR | `next.config.ts` |

## Ejercicios sugeridos

1. Agrega `app/flights/[id]/loading.tsx` y compara con el `loading.tsx` del padre.
2. Lanza un `throw new Error('API caída')` en `getFlights` y mira cómo actúa `error.tsx`.
3. Cambia `BookingForm` para que use `createBooking.bind(null, flightId)` en vez del input oculto.
4. Agrega un `POST` en `app/api/flights/route.ts` y llámalo con `curl`.
5. Activa la protección comentada en `proxy.ts` y crea una página `/login` que ponga la cookie `session`.
6. Usa `useOptimistic` para que la reserva aparezca antes de que responda el servidor.

## Preguntas típicas de entrevista (respuesta corta)

**¿Server Component o Client Component?**
Server por defecto. Client solo para estado, efectos, eventos o APIs del navegador. Pon `'use client'` en las hojas del árbol.

**¿Un Client Component puede renderizar un Server Component?**
No puede importarlo, pero sí recibirlo como `children` o como prop. Así funcionan los providers en el layout.

**¿Qué es la hidratación y qué causa un hydration mismatch?**
React conecta los eventos al HTML que vino del servidor. Falla si el cliente renderiza algo distinto: `Date.now()`, `Math.random()`, `window` o `localStorage` en el render, o zonas horarias diferentes. Solución: mover eso a `useEffect` o calcularlo en el servidor.

**¿Cómo se hace fetching de datos?**
En Server Components con `async/await`. En el cliente con TanStack Query/SWR o `use()`. Usa `Promise.all` para evitar waterfalls.

**¿Cómo funciona la caché en Next 16?**
Con Cache Components no se cachea nada por defecto. Usas `'use cache'` + `cacheLife` + `cacheTag`, e invalidas con `updateTag` (Server Actions, lectura inmediata) o `revalidateTag(tag, 'max')` (stale-while-revalidate). Lo que depende del request va en `<Suspense>`.

**¿Qué es Partial Prerendering (PPR)?**
La misma página mezcla un shell estático (CDN, instantáneo) con partes dinámicas que llegan por streaming dentro de `<Suspense>`.

**¿Server Action o Route Handler?**
Server Action para mutaciones desde tu UI. Route Handler para APIs que consumen terceros, webhooks o GET públicos.

**¿Las Server Actions son seguras?**
Son endpoints POST públicos. Siempre valida la entrada y verifica autenticación y permisos dentro de la acción.

**¿Qué cambió en Next 15 y 16?**
`params`, `searchParams`, `cookies()` y `headers()` son asíncronos. `middleware.ts` pasó a `proxy.ts`. Turbopack es el bundler por defecto. Llegaron Cache Components (`'use cache'`), `updateTag` y React 19.2. `error.tsx` usa `retry`. Se eliminó `next lint`.

**App Router vs Pages Router**
Pages Router (`pages/`, `getServerSideProps`, `getStaticProps`, `_app.tsx`) es el modelo legacy. App Router (`app/`) trae Server Components, layouts anidados, streaming y Server Actions.

**¿Cómo optimizas el rendimiento?**
Menos `'use client'`, `<Suspense>` para streaming, `next/image` y `next/font`, `dynamic()` para lazy loading de componentes pesados, caché con `'use cache'` y medir con Lighthouse y Core Web Vitals.
