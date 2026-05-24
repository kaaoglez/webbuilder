═══════════════════════════════════════════════════════════════
REGLAS DE TRABAJO - NO BORRAR NUNCA
═══════════════════════════════════════════════════════════════

1. NUNCA hacer cambios sin que el usuario lo pida
2. ARREGLAR LAS COSAS SIN PERDER LO QUE TENEMOS — no sobreescribir, no rsync, no clonar sin permiso
3. SIEMPRE dar un download/*.zip AL TERMINAR cada ajuste, con las rutas completas (src/components/...)
4. El proyecto usa puerto 3000 (package.json "dev": "next dev -p 3000")
5. El dev server se arranca con: npm run dev (o bun run dev)
6. Repo del usuario:
7. El usuario tiene cambios locales que NO están en el repo — NUNCA sobreescribir sin preguntar
8. Guardar TODO en el worklog — cada cambio, cada fix, cada decisión
9. El usuario quiere un proyecto PROFESIONAL y ROBUSTO — calidad > velocidad
10. El usuario es el ÚNICO que actualiza el repo de GitHub — NUNCA hacer push, commit, ni modificar el repo
11. SIEMPRE PREGUNTAR ANTES DE MODIFICAR — nunca asumir en qué archivo o componente hay que hacer un cambio. Preguntar al usuario: "¿En qué archivo/componente quieres que haga este cambio?"
12. El usuario gestiona los flyers desde el panel admin (AdminFlyers.tsx), NO desde la página pública (CrearFolletoPage.tsx)
13. NUNCA entregar un zip sin ponerlo también en el worklog con la ruta completa del archivo. El worklog es la fuente de verdad.
14. SIEMPRE usar `zip download/nombre.zip src/components/...` (NUNCA `zip -j`). El zip SIEMPRE debe contener la ruta completa del archivo dentro (ej: `src/components/pages/FlyersPage.tsx`).
15. NUNCA ADIVINAR — si no sabes qué pasa, pide información al usuario (consola del navegador, screenshots, comportamiento exacto). Un dia el usuario me dijo que dejara de usar el metodo de la adivinanza y tenia razon.

═══════════════════════════════════════════════════════════════
