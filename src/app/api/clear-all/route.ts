import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    await db.project.deleteMany();
    await db.mediaItem.deleteMany();

    return NextResponse.json({ success: true, message: 'All data cleared from database' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to clear database';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
