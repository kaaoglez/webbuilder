import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { normalizeConfig, type ThemeConfig } from '@/lib/wp-theme-generator';

// ═══════════════════════════════════════════════════════════════
// AI Theme Generator — Converts natural language to ThemeConfig
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Eres un experto diseñador de temas WordPress. Tu trabajo es generar un JSON de configuración de tema basado en la descripción del usuario.

REGLAS ESTRICTAS:
1. Responde SOLO con JSON válido. Nada de texto antes ni después.
2. IMPORTANTE: Asegúrate de que TODOS los strings estén correctamente entre comillas dobles. Revisa que no falten comillas de cierre.
3. El JSON debe seguir esta estructura EXACTA:

{
  "name": "Nombre del Tema",
  "slug": "slug-del-tema",
  "description": "Descripción corta del theme",
  "siteTitle": "Título del Sitio",
  "tagline": "Eslogan o tagline",
  "logoUrl": "",
  "primaryColor": "#hex",
  "secondaryColor": "#hex",
  "accentColor": "#hex",
  "backgroundColor": "#FFFFFF",
  "textColor": "#1F2937",
  "headingFont": "Nombre de Font",
  "bodyFont": "Nombre de Font",
  "borderRadius": 8,
  "navItems": [
    { "label": "Inicio", "url": "/" },
    { "label": "Texto", "url": "#section-tipo" }
  ],
  "sections": [
    {
      "type": "hero|about|services|features|testimonials|pricing|cta|contact|gallery|faq|stats|team|blog_posts",
      "enabled": true,
      "title": "Título de la sección",
      "subtitle": "Subtítulo opcional",
      "data": { ... datos específicos del tipo }
    }
  ],
  "footerColumns": [
    { "title": "Columna", "links": [{ "label": "Link", "url": "#" }] }
  ],
  "copyrightText": "© 2025 Nombre. Todos los derechos reservados.",
  "socialLinks": [
    { "platform": "facebook|twitter|instagram|linkedin|youtube", "url": "https://..." }
  ],
  "pages": [
    {
      "id": "page-id",
      "name": "Nombre Página",
      "slug": "slug-pagina",
      "sections": [ ... mismas secciones que arriba ]
    }
  ]
}

TIPOS DE SECCIÓN DISPONIBLES y sus datos:
- hero: { title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, backgroundImage (URL de unsplash si aplica), overlayOpacity }
- about: { title, subtitle, image, stats: [{value, label}] }
- services: { title, subtitle, items: [{icon:"⚡", title, description}], columns: 2|3|4 }
- features: { title, subtitle, items: [{icon:"✦", title, description}], columns: 2|3|4 }
- testimonials: { title, subtitle, testimonials: [{quote, name, role, rating:5}] }
- pricing: { title, subtitle, plans: [{name, price, period, features:[string], highlighted, ctaText}] }
- cta: { title, subtitle, ctaText, ctaLink }
- contact: { title, subtitle, email, phone, address, showForm:true }
- gallery: { title, subtitle, images:[{src, alt}], columns: 2|3|4 }
- faq: { title, subtitle, items: [{question, answer}] }
- stats: { title, items: [{icon:"📊", value, label}] }
- team: { title, members: [{name, role, bio, avatar, socials:[{platform, url}]}] }
- blog_posts: { title, subtitle }

PALETAS DE COLORES POR INDUSTRIA:
- Restaurante/Comida: primary #1B5E20, secondary #2E7D32, accent #FF6F00
- Médico/Salud: primary #0D47A1, secondary #1565C0, accent #00ACC1
- Tecnología: primary #1A237E, secondary #283593, accent #00E676
- Educación: primary #4A148C, secondary #6A1B9A, accent #FFC107
- Inmobiliaria: primary #263238, secondary #37474F, accent #FF5722
- E-commerce/Tienda: primary #B71C1C, secondary #C62828, accent #FFD600
- Portafolio/Creativo: primary #212121, secondary #424242, accent #E040FB
- Legal/Abogados: primary #1B1B1B, secondary #3E2723, accent #FFB300
- Fitness/Deporte: primary #BF360C, secondary #D84315, accent #76FF03
- Iglesia/Religioso: primary #311B92, secondary #4527A0, accent #FFD54F
- Fotografía: primary #212121, secondary #424242, accent #F50057
- Constructora: primary #E65100, secondary #EF6C00, accent #00BFA5
- Por defecto: primary #1B4332, secondary #2D6A4F, accent #F59E0B

Fuentes recomendadas:
- Moderno/tecnológico: Inter, Poppins, Montserrat
- Elegante/premium: Playfair Display, Merriweather, Lora
- Corporativo: Roboto, Open Sans, Source Sans Pro
- Creativo: Oswald, Raleway, Nunito
- Clásico/serif: Playfair Display + Lato, Merriweather + Source Sans Pro

NAVEGACIÓN:
- Siempre incluir "Inicio" con url "/"
- Los links de secciones internas usan formato "#section-tipo" (ej: "#section-services")
- Agregar links a páginas custom como "/slug-de-pagina"
- Máximo 6 items de navegación

DIRECTRICES DE CONTENIDO:
- Genera contenido realista y profesional en español
- Los textos deben ser relevantes al negocio descrito
- Para imágenes de hero, usa URLs de unsplash con formato: https://images.unsplash.com/photo-XXXX?w=1920&q=80
- Si el usuario menciona un negocio específico, usa ese nombre
- Los precios deben ser realistas para el tipo de negocio
- Los testimonios deben sonar auténticos
- Genera al menos 4-6 secciones relevantes al negocio
- Si el usuario menciona páginas adicionales, créalas en el array "pages"
`;

// Cache the ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// ─── JSON Extraction & Repair ─────────────────────────────────

function extractJsonString(raw: string): string {
  let jsonStr = raw.trim();

  // Remove markdown code blocks if present
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  // Find the outermost JSON object
  const braceStart = jsonStr.indexOf('{');
  const braceEnd = jsonStr.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd !== -1) {
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);
  }

  return jsonStr;
}

function attemptJsonRepair(jsonStr: string): string {
  let repaired = jsonStr;

  // Fix common AI mistakes:
  // 1. Missing closing quote on property values (e.g., "name": "Ana Torres,)
  //    Pattern: after a value like "text",  next char should be , or } or ]
  repaired = repaired.replace(/"([^"]*?)"\s*([,}\]])\s*([a-zA-Z_])/g, '"$1"$2\n  "$3');

  // 2. Trailing commas before } or ]
  repaired = repaired.replace(/,\s*([}\]])/g, '$1');

  // 3. Unescaped newlines inside strings
  repaired = repaired.replace(/\n(?=[^"{}[\],\n]*")/g, '\\n');

  return repaired;
}

function tryParseJson(raw: string): { config: ThemeConfig | null; error: string | null } {
  // Attempt 1: Direct parse after extraction
  const extracted = extractJsonString(raw);
  try {
    return { config: JSON.parse(extracted), error: null };
  } catch {
    // continue
  }

  // Attempt 2: Repair and parse
  const repaired = attemptJsonRepair(extracted);
  try {
    return { config: JSON.parse(repaired), error: null };
  } catch {
    // continue
  }

  // Attempt 3: Ask LLM to fix its own JSON
  return { config: null, error: 'JSON inválido' };
}

// ─── Request Handler ──────────────────────────────────────────

interface GenerateRequest {
  prompt: string;
  currentConfig?: Partial<ThemeConfig>;
  mode?: 'generate' | 'refine';
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, currentConfig, mode = 'generate' } = body;

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: 'Describe tu sitio con al menos 5 caracteres' },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    let userMessage: string;

    if (mode === 'refine' && currentConfig) {
      userMessage = `Tengo este theme actual:\n${JSON.stringify(currentConfig, null, 2)}\n\nEl usuario pide estos cambios: "${prompt}"\n\nDevuelve el JSON COMPLETO actualizado con los cambios solicitados. Mantén todo lo que no se pidió cambiar.`;
    } else {
      userMessage = prompt;
    }

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      thinking: { type: 'disabled' },
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: 'La IA no generó una respuesta' },
        { status: 500 }
      );
    }

    // Try to parse the JSON (with repair attempts)
    let parseResult = tryParseJson(raw);

    // If JSON is still invalid, ask the LLM to fix itself
    if (!parseResult.config) {
      console.warn('[AI Theme] Initial JSON parse failed, asking LLM to repair...');
      const extracted = extractJsonString(raw);

      const fixCompletion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: 'Eres un reparador de JSON. Recibes JSON roto y lo devuelves arreglado. Responde SOLO con JSON válido.' },
          { role: 'user', content: `Este JSON tiene errores de sintaxis. Repáralo y devuelve SOLO el JSON válido arreglado:\n\n${extracted}` },
        ],
        thinking: { type: 'disabled' },
      });

      const fixRaw = fixCompletion.choices[0]?.message?.content;
      if (fixRaw) {
        parseResult = tryParseJson(fixRaw);
      }
    }

    if (!parseResult.config) {
      console.error('[AI Theme] All JSON parse attempts failed');
      return NextResponse.json(
        { error: 'La IA generó una respuesta con errores de formato. Intenta de nuevo.' },
        { status: 500 }
      );
    }

    // Normalize the config to fill missing fields
    const normalizedConfig = normalizeConfig(parseResult.config);

    return NextResponse.json({
      success: true,
      config: normalizedConfig,
    });
  } catch (err) {
    console.error('AI Theme Generation Error:', err);
    return NextResponse.json(
      { error: `Error al generar: ${err instanceof Error ? err.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}
