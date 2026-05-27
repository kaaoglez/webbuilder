import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { generatePluginFiles, normalizePluginConfig } from '@/lib/wp-plugin-generator';

interface ExportSettings {
  includeScreenshot?: boolean;
  minifyCSS?: boolean;
  includeREADME?: boolean;
}

interface PluginRequest {
  name: string;
  slug?: string;
  pluginType: string;
  [key: string]: unknown;
  _exportSettings?: ExportSettings;
}

/**
 * POST /api/generate-plugin
 *
 * Recibe un objeto PluginConfig en JSON, genera todos los archivos del plugin WordPress,
 * los empaqueta en un ZIP y lo devuelve como archivo descargable.
 */
export async function POST(request: NextRequest) {
  try {
    const config: PluginRequest = await request.json();
    const exportSettings: ExportSettings = config._exportSettings || { includeScreenshot: true, minifyCSS: false, includeREADME: true };
    const { _exportSettings: _, ...cleanConfig } = config;

    // Validar campos obligatorios
    if (!config.name || !config.pluginType) {
      return NextResponse.json(
        { error: 'El nombre y el tipo de plugin son obligatorios' },
        { status: 400 }
      );
    }

    // Validar tipo de plugin
    const validTypes = [
      'contact-form', 'slider', 'custom-post-type', 'shortcodes', 'widget',
      'social-share', 'seo', 'google-maps', 'countdown', 'pricing-table',
      'testimonials', 'maintenance-mode', 'custom-login', 'breadcrumbs', 'related-posts',
    ];
    if (!validTypes.includes(config.pluginType)) {
      return NextResponse.json(
        { error: `Tipo de plugin no válido. Tipos disponibles: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Sanitizar slug: minúsculas, solo alfanuméricos y guiones
    const rawSlug = config.slug || config.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const sanitizedSlug = rawSlug || 'my-plugin';

    // Normalizar configuración con valores por defecto
    const fullConfig = normalizePluginConfig({ ...cleanConfig, slug: sanitizedSlug });

    // Generar archivos del plugin
    const files = generatePluginFiles(fullConfig);

    // Crear ZIP
    const zip = new JSZip();
    const pluginFolder = zip.folder(sanitizedSlug);

    if (!pluginFolder) {
      return NextResponse.json(
        { error: 'Error al crear la estructura ZIP' },
        { status: 500 }
      );
    }

    for (const [filePath, content] of files) {
      // Skip readme.txt if includeREADME is false
      if (filePath === 'readme.txt' && !exportSettings.includeREADME) continue;
      pluginFolder.file(filePath, content);
    }

    // Generar buffer del ZIP
    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });
    const buffer = Buffer.from(zipBuffer);

    // Devolver como descarga
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizedSlug}.zip"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error al generar el plugin:', error);
    return NextResponse.json(
      { error: 'Error al generar el plugin', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
