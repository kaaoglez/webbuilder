import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// ─────────────────────────────────────────────────────────────
// GET /api/media — List all media items
// ─────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const mediaItems = await db.mediaItem.findMany({
      orderBy: { uploadedAt: 'desc' },
    });

    const parsed = mediaItems.map((item) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      alt: item.alt,
      caption: item.caption,
      width: item.width,
      height: item.height,
      size: item.size,
      mimeType: item.mimeType,
      mediaType: item.mediaType,
      uploadedAt: item.uploadedAt.toISOString(),
      ...(item.data ? { data: item.data } : {}),
    }));

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media items' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/media — Upload a file and create a MediaItem
// ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique ID for the file
    const fileId = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${fileId}-${safeFilename}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Write file to disk
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Build the URL path
    const url = `/uploads/${fileName}`;

    // Get image dimensions from client
    let width = 0;
    let height = 0;
    if (file.type.startsWith('image/')) {
      try {
        const dimStr = formData.get('width') as string | null;
        const dimHStr = formData.get('height') as string | null;
        if (dimStr) width = parseInt(dimStr, 10) || 0;
        if (dimHStr) height = parseInt(dimHStr, 10) || 0;
      } catch {
        // Ignore dimension parsing errors
      }
    }

    // Detect mediaType from MIME
    let mediaType = 'image';
    if (file.type.startsWith('image/')) mediaType = 'image';
    else if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';
    else if (
      file.type === 'application/pdf' ||
      file.type.includes('document') ||
      file.type.includes('spreadsheet') ||
      file.type.includes('presentation')
    ) mediaType = 'document';
    else mediaType = 'other';

    // Store metadata in DB
    const mediaItem = await db.mediaItem.create({
      data: {
        name: file.name,
        url,
        width,
        height,
        size: file.size,
        mimeType: file.type,
        mediaType,
      },
    });

    const parsed = {
      id: mediaItem.id,
      name: mediaItem.name,
      url: mediaItem.url,
      alt: mediaItem.alt,
      caption: mediaItem.caption,
      width: mediaItem.width,
      height: mediaItem.height,
      size: mediaItem.size,
      mimeType: mediaItem.mimeType,
      mediaType: mediaItem.mediaType,
      uploadedAt: mediaItem.uploadedAt.toISOString(),
      ...(mediaItem.data ? { data: mediaItem.data } : {}),
    };

    return NextResponse.json(parsed, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload media';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/media?id=xxx — Delete a media item by ID
// ─────────────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required query parameter: id' },
        { status: 400 },
      );
    }

    // Find the media item
    const mediaItem = await db.mediaItem.findUnique({ where: { id } });
    if (!mediaItem) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    // Delete file from filesystem if url starts with /uploads/
    if (mediaItem.url.startsWith('/uploads/')) {
      const fileName = path.basename(mediaItem.url);
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    // Delete from database
    await db.mediaItem.delete({ where: { id } });

    return NextResponse.json({ success: true, deleted: id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete media item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// PUT /api/media — Update a media item's metadata (alt/caption)
// ─────────────────────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, alt, caption } = body as {
      id?: string;
      alt?: string;
      caption?: string;
    };

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 },
      );
    }

    // Check that the media item exists
    const existing = await db.mediaItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    // Build update payload
    const updateData: { alt?: string; caption?: string } = {};
    if (alt !== undefined) updateData.alt = alt;
    if (caption !== undefined) updateData.caption = caption;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update. Provide alt and/or caption.' },
        { status: 400 },
      );
    }

    const updated = await db.mediaItem.update({
      where: { id },
      data: updateData,
    });

    const parsed = {
      id: updated.id,
      name: updated.name,
      url: updated.url,
      alt: updated.alt,
      caption: updated.caption,
      width: updated.width,
      height: updated.height,
      size: updated.size,
      mimeType: updated.mimeType,
      mediaType: updated.mediaType,
      uploadedAt: updated.uploadedAt.toISOString(),
      ...(updated.data ? { data: updated.data } : {}),
    };

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update media item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
