import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the media item first to get the file path
    const mediaItem = await db.mediaItem.findUnique({ where: { id } });
    if (!mediaItem) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    // Delete the file from disk if it exists
    const filePath = path.join(process.cwd(), 'public', mediaItem.url);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete from database
    await db.mediaItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete media item' }, { status: 500 });
  }
}
