import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import sharp from 'sharp';
import {
  generateThemeFiles,
  normalizeConfig,
  collectDataUrlsFromConfig,
  processImagesInContent,
  type ThemeConfig,
} from '@/lib/wp-theme-generator';

/**
 * POST /api/generate-theme
 *
 * Receives a ThemeConfig JSON body, generates all WordPress theme files,
 * packages them into a ZIP (with uploaded images embedded), and returns
 * the ZIP as a downloadable attachment.
 */
export async function POST(request: NextRequest) {
  try {
    const config: ThemeConfig = await request.json();

    // Validate required fields
    if (!config.name || !config.slug) {
      return NextResponse.json(
        { error: 'Theme name and slug are required' },
        { status: 400 }
      );
    }

    // Sanitize slug: lowercase, alphanumeric + hyphens only
    const sanitizedSlug = config.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!sanitizedSlug) {
      return NextResponse.json(
        { error: 'Theme slug must contain at least one valid character (a-z, 0-9)' },
        { status: 400 }
      );
    }

    // Normalize config with defaults for any missing fields
    const fullConfig = normalizeConfig({ ...config, slug: sanitizedSlug });

    // ─── Collect all base64 data:image URLs from the config ───
    const images = collectDataUrlsFromConfig(fullConfig);

    // ─── Generate theme files ────────────────────────────────
    const files = generateThemeFiles(fullConfig);

    // ─── Create ZIP ──────────────────────────────────────────
    const zip = new JSZip();
    const themeFolder = zip.folder(sanitizedSlug);

    if (!themeFolder) {
      return NextResponse.json(
        { error: 'Failed to create ZIP structure' },
        { status: 500 }
      );
    }

    // ─── Add processed text files to the ZIP ─────────────────
    for (const [filePath, content] of files) {
      // Determine file type for image URL replacement
      const ext = filePath.split('.').pop() || '';
      let fileType: 'php' | 'css' | 'js' = 'php';
      if (ext === 'css') fileType = 'css';
      else if (ext === 'js') fileType = 'js';

      // Replace any data:image URLs with WordPress-correct paths
      const processed = processImagesInContent(content, images, fileType);
      themeFolder.file(filePath, processed);
    }

    // ─── Embed image binary files under assets/img/ ──────────
    if (images.size > 0) {
      const imgFolder = themeFolder.folder('assets/img');
      if (imgFolder) {
        for (const [, entry] of images) {
          imgFolder.file(entry.filename, entry.buffer);
        }
      }
    }

    // ─── Generate screenshot.png (1200x900) ──────────────────
    const screenshotBuffer = await generateScreenshot(fullConfig);
    themeFolder.file('screenshot.png', screenshotBuffer);

    // Generate ZIP buffer and convert to Node.js Buffer for NextResponse compatibility
    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });
    const buffer = Buffer.from(zipBuffer);

    // Return as download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizedSlug}.zip"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Theme generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate theme', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Screenshot Generator — 1200×900 branded theme preview
// ─────────────────────────────────────────────────────────────

async function generateScreenshot(config: ThemeConfig): Promise<Buffer> {
  const W = 1200;
  const H = 900;
  const primary = config.primaryColor || '#2563EB';
  const secondary = config.secondaryColor || '#7C3AED';

  // Parse hex to RGB for compositing
  const r = (hex: string) => parseInt(hex.slice(1, 3), 16);
  const g = (hex: string) => parseInt(hex.slice(3, 5), 16);
  const b = (hex: string) => parseInt(hex.slice(5, 7), 16);

  // Create gradient background using SVG
  const svgGradient = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.15);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0.05);stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${W}" height="${H}" fill="url(#bg)" />
      
      <!-- Decorative shapes -->
      <circle cx="1050" cy="150" r="200" fill="rgba(255,255,255,0.05)" />
      <circle cx="150" cy="750" r="180" fill="rgba(255,255,255,0.04)" />
      <circle cx="900" cy="650" r="120" fill="rgba(255,255,255,0.06)" />
      
      <!-- Top bar -->
      <rect x="0" y="0" width="${W}" height="60" fill="url(#bar)" />
      <rect x="60" y="22" width="120" height="16" rx="4" fill="rgba(255,255,255,0.8)" />
      <rect x="600" y="24" width="60" height="12" rx="3" fill="rgba(255,255,255,0.4)" />
      <rect x="680" y="24" width="60" height="12" rx="3" fill="rgba(255,255,255,0.4)" />
      <rect x="760" y="24" width="60" height="12" rx="3" fill="rgba(255,255,255,0.4)" />
      <rect x="840" y="24" width="60" height="12" rx="3" fill="rgba(255,255,255,0.4)" />
      
      <!-- Hero section -->
      <text x="${W / 2}" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="800" fill="white" text-anchor="middle">${escapeXml(config.name || 'My Theme')}</text>
      <text x="${W / 2}" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="rgba(255,255,255,0.75)" text-anchor="middle">${escapeXml(config.tagline || config.description || 'A professional WordPress theme')}</text>
      
      <!-- CTA buttons -->
      <rect x="${W / 2 - 130}" y="360" width="120" height="40" rx="8" fill="white" />
      <rect x="${W / 2 + 10}" y="360" width="120" height="40" rx="8" fill="none" stroke="white" stroke-width="2" />
      <text x="${W / 2 - 70}" y="385" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="${primary}" text-anchor="middle">Get Started</text>
      <text x="${W / 2 + 70}" y="385" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="white" text-anchor="middle">Learn More</text>
      
      <!-- Feature cards -->
      <rect x="140" y="460" width="280" height="160" rx="12" fill="rgba(255,255,255,0.12)" />
      <rect x="460" y="460" width="280" height="160" rx="12" fill="rgba(255,255,255,0.12)" />
      <rect x="780" y="460" width="280" height="160" rx="12" fill="rgba(255,255,255,0.12)" />
      
      <text x="280" y="510" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-weight="600">Feature One</text>
      <rect x="255" y="525" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <text x="280" y="555" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="rgba(255,255,255,0.55)" text-anchor="middle">Short description of the</text>
      <text x="280" y="572" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="rgba(255,255,255,0.55)" text-anchor="middle">first feature goes here.</text>
      
      <text x="600" y="510" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-weight="600">Feature Two</text>
      <rect x="575" y="525" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <text x="600" y="555" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="rgba(255,255,255,0.55)" text-anchor="middle">Short description of the</text>
      <text x="600" y="572" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="rgba(255,255,255,0.55)" text-anchor="middle">second feature goes here.</text>
      
      <text x="920" y="510" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-weight="600">Feature Three</text>
      <rect x="895" y="525" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <text x="920" y="555" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="rgba(255,255,255,0.55)" text-anchor="middle">Short description of the</text>
      <text x="920" y="572" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="rgba(255,255,255,0.55)" text-anchor="middle">third feature goes here.</text>
      
      <!-- Footer -->
      <rect x="0" y="770" width="${W}" height="130" fill="rgba(0,0,0,0.2)" />
      <rect x="140" y="800" width="80" height="14" rx="3" fill="rgba(255,255,255,0.5)" />
      <text x="140" y="830" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="rgba(255,255,255,0.3)" text-anchor="middle">© 2025 ${escapeXml(config.name)}</text>
      
      <!-- PageForge badge -->
      <rect x="${W - 140}" y="830" width="100" height="28" rx="14" fill="rgba(255,255,255,0.1)" />
      <text x="${W - 90}" y="849" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="rgba(255,255,255,0.6)" text-anchor="middle">PageForge</text>
    </svg>
  `;

  // Render SVG to PNG using Sharp
  const pngBuffer = await sharp(Buffer.from(svgGradient))
    .png()
    .toBuffer();

  return pngBuffer;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .slice(0, 80); // Limit length for display
}
