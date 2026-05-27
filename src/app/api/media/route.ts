import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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
      uploadedAt: item.uploadedAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media items' }, { status: 500 });
  }
}

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

    // Get image dimensions if it's an image
    let width = 0;
    let height = 0;
    if (file.type.startsWith('image/')) {
      try {
        // Use a simple approach: store the buffer and read dimensions
        // For simplicity, we'll rely on the browser/client to provide dimensions
        // or parse them server-side
        const dimStr = formData.get('width') as string | null;
        const dimHStr = formData.get('height') as string | null;
        if (dimStr) width = parseInt(dimStr, 10) || 0;
        if (dimHStr) height = parseInt(dimHStr, 10) || 0;
      } catch {
        // Ignore dimension parsing errors
      }
    }

    // Store metadata in DB (no base64 — file is already on disk at /public/uploads/)
    const mediaItem = await db.mediaItem.create({
      data: {
        name: file.name,
        url,
        width,
        height,
        size: file.size,
        mimeType: file.type,
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
      uploadedAt: mediaItem.uploadedAt.toISOString(),
    };

    return NextResponse.json(parsed, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload media';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
