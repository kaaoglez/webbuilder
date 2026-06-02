# PageForge v2 — Cambios vs Repositorio (commit e3d99a3)

Generado el 2025-06-01

---

## Resumen

- **14 archivos** con cambios de contenido real
- **2 archivos nuevos** (AdvancedOptions.tsx, OnboardingOverlay.tsx)
- **1 archivo eliminado** (src/app/api/upload/route.ts)
- **11 archivos modificados** con funcionalidades nuevas/corregidas

---

## Archivos Nuevos

### `src/components/pageforge/AdvancedOptions.tsx` (+40 líneas)
Componente reutilizable colapsable "Opciones Avanzadas".
Oculta campos técnicos del usuario final (slugs, versiones, widgets).
Usado en InfoTab y TemplatesTab.

### `src/components/pageforge/OnboardingOverlay.tsx` (+245 líneas)
Modal de bienvenida de 6 pasos para nuevos usuarios.
Se muestra solo una vez (localStorage via settings-store).
Pasos: Bienvenida, Plantillas, Secciones, Vista Previa, Campos Ocultos, Exportar.

---

## Archivos Modificados

### `src/app/layout.tsx` (+4 -4)
- `lang="en"` → `lang="es"`
- Acentos en metadata: Diseña, válidos

### `src/app/page.tsx` (+14 -10)
- Integración de OnboardingOverlay
- Textos en español: Dashboard→Panel, Template Library→Biblioteca de Plantillas
- Acentos corregidos: generación, Diseña, imágenes, Configuración, línea, válidos

### `src/components/pageforge/DashboardCards.tsx` (+10 -10)
- Textos en español: Diseña, código, más, categorías, válido, Rápidas, Gestión
- Template Library → Biblioteca de Plantillas
- Demo content → Contenido demo, 1-click import → Importar con 1 clic
- Auto-save → Auto-guardado, Re-export → Re-exportar, Gestión central

### `src/components/pageforge/Sidebar.tsx` (+10 -10)
- Dashboard → Panel, Template Library → Biblioteca de Plantillas
- Configuracion → Configuración (con acento)
- Online → En línea, WordPress Generator → Generador WordPress

### `src/components/pageforge/TemplateLibrary.tsx` (+11 -11)
- 10 labels de secciones traducidas: About→Sobre Nosotros, Services→Servicios, etc.
- Título: Template Library → Biblioteca de Plantillas

### `src/components/pageforge/TemplatesTab.tsx` (+49 -44)
- Widgets del Sidebar envueltos en AdvancedOptions (ocultos por defecto)
- Info de exportación .php envuelta en AdvancedOptions (ocultos por defecto)

### `src/components/pageforge/ThemeEditor.tsx` (+517 -225)
Cambios más grandes:
- Live preview profesional con device toggles (Desktop/Tablet/Mobile)
- Browser chrome frame con URL bar
- Preview de fuentes Google en dropdowns
- 20 paletas de color preset en ColorPickerField
- Barra de progreso de completitud del theme (rojo/amber/emerald)
- Diálogo de confirmación AlertDialog antes de exportar
- Botones de duplicar sección (Copy icon) y mover arriba/abajo
- AdvancedOptions en InfoTab (slug, versión, textDomain, tags ocultos)
- Fix: duplicate keys #section-hero con counter suffix

### `src/components/pageforge/ThemeLivePreview.tsx` (+27 -27)
- Todos los placeholder texts traducidos al español
- Blog posts, features, services, CTA buttons, form fields, copyright, etc.

### `src/lib/settings-store.ts` (+5 -0)
- Nuevo campo: hasOnboarded: boolean (default: false)
- Persistido en localStorage

### `src/lib/templates.ts` (+590 -590)
- 16 plantillas completas traducidas al español
- Nombres, descripciones y todo el contenido demo

### `src/lib/theme-editor-store.ts` (+22 -4)
- Nueva acción: duplicateSection(index) — clona sección con "(copia)"
- 5 plantillas preconstruidas traducidas: Single Post→Artículo Individual, etc.

---

## Archivo Eliminado

### `src/app/api/upload/route.ts` (-279 líneas)
Archivo de ruta de API eliminado (no usado / reubicado).
