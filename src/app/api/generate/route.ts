import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sectionType, context, theme } = await request.json();

    // Use z-ai-web-dev-sdk for LLM content generation
    const { AIGateway } = await import('z-ai-web-dev-sdk');
    const ai = new AIGateway();

    const prompt = buildPrompt(sectionType, context, theme);

    const result = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto creador de contenido web. Genera contenido profesional, atractivo y en español para sitios web. Responde SOLO con JSON válido, sin markdown ni backticks.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = result.choices?.[0]?.message?.content || '';

    // Try to parse JSON from the response
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    let parsed;
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = extractFallback(content);
      }
    } else {
      parsed = extractFallback(content);
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Generation failed';
    console.error('[AI Generate]', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildPrompt(sectionType: string, context: string, theme: Record<string, string>): string {
  const themeDesc = theme ? `Temas de la marca: primario ${theme.primaryColor || '#0F766E'}` : '';

  const prompts: Record<string, string> = {
    hero: `Genera contenido para una sección HERO de una página web. ${themeDesc}
Contexto del negocio: ${context || 'Empresa de tecnología'}
Responde con JSON: {"title": "título principal (max 8 palabras)", "subtitle": "subtítulo descriptivo (1-2 frases)", "ctaText": "texto del botón principal (2-3 palabras)", "secondaryCtaText": "texto del botón secundario"}`,

    features: `Genera contenido para una sección de CARACTERÍSTICAS. ${themeDesc}
Contexto: ${context || 'Empresa de tecnología'}
Responde con JSON: {"title": "título de la sección", "subtitle": "subtítulo", "features": [{"title": "nombre feature", "description": "descripción breve (1 frase)", "icon": "Zap|Shield|Sparkles|BarChart3|Headphones|Puzzle|Globe|Cpu|Lock|Rocket|Heart|Target"}]}`,

    about: `Genera contenido para una sección SOBRE NOSOTROS. ${themeDesc}
Contexto: ${context || 'Empresa de tecnología'}
Responde con JSON: {"title": "título", "description": "texto descriptivo (3-4 frases profesionales)", "stats": [{"value": "número+", "label": "descriptor"}]}`,

    testimonials: `Genera contenido para TESTIMONIOS. ${themeDesc}
Contexto: ${context || 'Empresa de tecnología'}
Responde con JSON: {"title": "título", "subtitle": "subtítulo", "testimonials": [{"name": "nombre español", "role": "cargo, empresa", "quote": "testimonio (2-3 frases)", "rating": 5}]}`,

    pricing: `Genera contenido para PRECIOS. ${themeDesc}
Contexto: ${context || 'Empresa de tecnología'}
Responde con JSON: {"title": "título", "subtitle": "subtítulo", "plans": [{"name": "nombre plan", "price": "XX", "period": "/mes", "description": "breve desc", "features": ["feature 1", "feature 2"], "highlighted": false, "ctaText": "Empezar"}]}`,

    cta: `Genera contenido para una sección de LLAMADA A LA ACCIÓN. ${themeDesc}
Contexto: ${context || 'Empresa de tecnología'}
Responde con JSON: {"title": "título motivador", "subtitle": "subtítulo persuasivo", "ctaText": "texto del botón"}`,

    faq: `Genera contenido para PREGUNTAS FRECUENTES. ${themeDesc}
Contexto: ${context || 'Empresa de tecnología'}
Responde con JSON: {"title": "título", "subtitle": "subtítulo", "items": [{"question": "pregunta", "answer": "respuesta (2-3 frases)"}]}`,

    team: `Genera contenido para sección de EQUIPO. ${themeDesc}
Contexto: ${context || 'Empresa de tecnología'}
Responde con JSON: {"title": "título", "subtitle": "subtítulo", "members": [{"name": "nombre español", "role": "cargo", "bio": "bio breve (1 frase)"}]}`,

    footer: `Genera contenido para el FOOTER. ${themeDesc}
Contexto: ${context || 'Empresa de tecnología'}
Responde con JSON: {"brandName": "nombre de marca", "brandDescription": "descripción (1 frase)", "copyright": "texto copyright"}`,
  };

  return prompts[sectionType] || prompts.hero;
}

function extractFallback(content: string) {
  // Simple fallback: try to extract useful text
  const lines = content.split('\n').filter((l: string) => l.trim());
  return {
    title: lines[0] || 'Contenido Generado',
    subtitle: lines.slice(1, 3).join(' ') || 'Contenido generado por IA',
    raw: content,
  };
}
