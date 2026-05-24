# ============================================
#  PAGEFORGE - Creador de Paginas Web
# ============================================

## Requisitos para Windows

| Herramienta | Version | Descarga |
|---|---|---|
| **Node.js** | 18 o superior | https://nodejs.org (LTS recomendado) |
| **Git** | Cualquiera | https://git-scm.com/download/win |

> **Nota:** Puedes usar npm (viene con Node.js) o Bun (mas rapido) como gestor de paquetes.

---

## Instalacion en Windows con VS Code

### Paso 1: Prepara tu carpeta

1. Abre VS Code
2. Abre la terminal: `Ctrl + ` ` (backtick) o Menu > Terminal > New Terminal
3. Navega a donde quieras crear el proyecto:
```powershell
cd C:\MisProyectos
```

### Paso 2: Descomprime el proyecto

1. Descarga el archivo `PageForge.zip`
2. Descomprime la carpeta
3. Renombra la carpeta a `pageforge`
4. Abre la carpeta en VS Code:
```powershell
cd C:\MisProyectos\pageforge
code .
```

### Paso 3: Configura la base de datos

Crea el archivo `.env` copiando el ejemplo:
```powershell
copy .env.example .env
```

Crea la carpeta para la base de datos:
```powershell
mkdir db
```

### Paso 4: Instala dependencias

```powershell
npm install
```

> Si prefieres Bun (mas rapido):
> ```powershell
> # Instala Bun primero: https://bun.sh
> bun install
> ```

### Paso 5: Inicializa la base de datos

```powershell
npx prisma db push
```

> Con Bun: `bunx prisma db push`

### Paso 6: Ejecuta el proyecto

```powershell
npm run dev
```

> Con Bun: `bun run dev`

### Paso 7: Abre en tu navegador

```
http://localhost:3000
```

---

## Estructura del Proyecto

```
pageforge/
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
├── public/
│   ├── logo.svg            # Logo
│   └── pageforge-logo.png  # Logo PNG
├── src/
│   ├── app/
│   │   ├── page.tsx        # Pagina principal
│   │   ├── layout.tsx      # Layout general
│   │   ├── globals.css     # Estilos globales
│   │   └── api/            # APIs REST
│   │       ├── pages/      # CRUD de paginas
│   │       ├── websites/   # CRUD de sitios
│   │       ├── blog/       # Blog posts
│   │       └── generate/   # Generador HTML
│   ├── components/
│   │   ├── builder/        # Componentes del editor
│   │   └── ui/             # Componentes shadcn/ui
│   ├── hooks/              # Hooks personalizados
│   └── lib/                # Store, tipos, templates
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Funcionalidades

- **7 Plantillas**: Landing, Portfolio, Restaurant, SaaS, Agency, E-Commerce, Blog
- **12 Tipos de Secciones**: Hero, Features, About, Testimonials, Pricing, CTA, Contact, Gallery, FAQ, Stats, Team, Footer
- **Selector de Iconos**: 3600+ iconos Lucide con busqueda visual
- **Gestor de Imagenes**: Drag & drop upload + galeria
- **Editor de Temas**: Colores, fuentes, presets
- **Vista Previa en Vivo**: Responsive (movil/tablet/desktop)
- **Blog Integrado**: Sistema de posts con editor
- **SEO**: Configuracion de meta tags
- **Formularios**: Constructor de formularios de contacto
- **Navegacion**: Constructor de menus
- **Exportar HTML**: Descarga tu sitio como archivo HTML

---

## Comandos Disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para produccion |
| `npm run start` | Inicia servidor de produccion |
| `npm run lint` | Revisa calidad del codigo |
| `npx prisma db push` | Sincroniza base de datos |
| `npx prisma studio` | Abre administrador visual de DB |

---

## Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estatico
- **Tailwind CSS 4** - Estilos
- **shadcn/ui** - Componentes UI
- **Prisma** - ORM con SQLite
- **Zustand** - Estado del cliente
- **Lucide React** - Iconos

---

## Problemas Comunes en Windows

### Error: "prisma not found"
```powershell
npm install prisma --save-dev
npx prisma db push
```

### Error: Puerto 3000 en uso
```powershell
# Mata el proceso en el puerto 3000
npx kill-port 3000
# O usa otro puerto:
$env:PORT=3001; npm run dev
```

### Error: "Cannot find module"
```powershell
# Borra node_modules y reinstala
rmdir /s /q node_modules
npm install
```

---

Hecho con Next.js, Tailwind CSS y shadcn/ui
