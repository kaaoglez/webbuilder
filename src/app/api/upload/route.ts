import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { db } from '@/lib/db';

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function detectMediaType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-powerpoint' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimeType === 'text/plain' ||
    mimeType === 'text/csv'
  ) {
    return 'document';
  }
  return 'other';
}

// ─────────────────────────────────────────────────────────────
// POST /api/upload — Upload one or more images
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró ningún archivo en la solicitud.' },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const results: Array<{
      url: string;
      name: string;
      size: number;
      mimeType: string;
      mediaType: string;
      width: number;
      height: number;
      id: string;
    }> = [];
    const errors: Array<{ name: string; error: string }> = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        errors.push({ name: 'unknown', error: 'Campo de archivo no válido.' });
        continue;
      }

      // Validate type
      if (!ACCEPTED_TYPES.has(file.type)) {
        errors.push({
          name: file.name,
          error: `Tipo "${file.type}" no soportado. Usa JPG, PNG, WebP, GIF o SVG.`,
        });
        continue;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        errors.push({
          name: file.name,
          error: `El archivo excede el límite de 5 MB (${(file.size / 1024 / 1024).toFixed(1)} MB).`,
        });
        continue;
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = EXT_MAP[file.type] || path.extname(file.name) || '.bin';
        const uniqueName = `${uuidv4()}${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        let finalUrl = `/uploads/${uniqueName}`;
        let finalSize = buffer.length;
        let finalMimeType = file.type;
        let width = 0;
        let height = 0;

        // ── Optimize raster images with sharp ───────────────
        if (file.type !== 'image/svg+xml') {
          let pipeline = sharp(buffer);

          // Convert to WebP for better compression (except GIFs which may be animated)
          if (file.type !== 'image/gif') {
            pipeline = pipeline.webp({ quality: 80 });
            finalMimeType = 'image/webp';
          }

          const optimizedBuffer = await pipeline.toBuffer();

          // Extract metadata (width/height) from the processed image
          try {
            const metadata = await sharp(optimizedBuffer).metadata();
            width = metadata.width || 0;
            height = metadata.height || 0;
          } catch {
            // Ignore metadata extraction errors — dimensions will remain 0
          }

          // Use webp extension for optimized images (except GIF)
          const finalName =
            file.type !== 'image/gif'
              ? `${uuidv4()}.webp`
              : uniqueName;
          const finalPath = path.join(UPLOAD_DIR, finalName);

          await fs.writeFile(finalPath, optimizedBuffer);

          finalUrl = `/uploads/${finalName}`;
          finalSize = optimizedBuffer.length;
        } else {
          // SVG — save as-is
          await fs.writeFile(filePath, buffer);
        }

        const mediaType = detectMediaType(finalMimeType);

        // ── Create MediaItem in database ───────────────────
        const mediaItem = await db.mediaItem.create({
          data: {
            name: file.name,
            url: finalUrl,
            size: finalSize,
            mimeType: finalMimeType,
            mediaType,
            width,
            height,
          },
        });

        results.push({
          url: finalUrl,
          name: file.name,
          size: finalSize,
          mimeType: finalMimeType,
          mediaType,
          width,
          height,
          id: mediaItem.id,
        });
      } catch (err) {
        errors.push({
          name: file.name,
          error: err instanceof Error ? err.message : 'Error al procesar la imagen.',
        });
      }
    }

    // ── Response ─────────────────────────────────────────────
    if (results.length === 0) {
      return NextResponse.json(
        {
          error: 'No se pudo subir ninguna imagen.',
          details: errors,
        },
        { status: 422 }
      );
    }

    // If only one file was uploaded, return it directly (backward compat)
    if (results.length === 1) {
      return NextResponse.json({
        url: results[0].url,
        name: results[0].name,
        size: results[0].size,
        id: results[0].id,
        mimeType: results[0].mimeType,
        mediaType: results[0].mediaType,
        width: results[0].width,
        height: results[0].height,
        ...(errors.length > 0 ? { warnings: errors } : {}),
      });
    }

    // Multiple files
    return NextResponse.json({
      files: results,
      ...(errors.length > 0 ? { warnings: errors } : {}),
    });
  } catch (err) {
    console.error('[Upload API] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la subida.' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/upload — Delete an uploaded image
// ─────────────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro "url" con la ruta del archivo.' },
        { status: 400 }
      );
    }

    // Security: only allow deleting from /uploads/
    const decodedUrl = decodeURIComponent(fileUrl);
    if (!decodedUrl.startsWith('/uploads/')) {
      return NextResponse.json(
        { error: 'Solo se pueden eliminar archivos de /uploads/.' },
        { status: 403 }
      );
    }

    // Prevent directory traversal
    const fileName = path.basename(decodedUrl);
    const filePath = path.join(UPLOAD_DIR, fileName);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'El archivo no existe.' },
        { status: 404 }
      );
    }

    await fs.unlink(filePath);

    return NextResponse.json({ success: true, deleted: decodedUrl });
  } catch (err) {
    console.error('[Upload API] Delete error:', err);
    return NextResponse.json(
      { error: 'Error interno al eliminar el archivo.' },
      { status: 500 }
    );
  }
}
