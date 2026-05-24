import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/settings — Get all global settings (key-value pairs)
export async function GET() {
  try {
    const settings = await db.globalSetting.findMany({
      orderBy: { category: 'asc' },
    });

    const parsed = settings.map((setting) => ({
      id: setting.id,
      key: setting.key,
      value: setting.value,
      category: setting.category,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/settings — Upsert settings (body: { key, value, category })
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { key, value, category } = body;

    if (!key) {
      return NextResponse.json({ error: 'key is required' }, { status: 400 });
    }

    const existing = await db.globalSetting.findUnique({ where: { key } });

    const setting = existing
      ? await db.globalSetting.update({
          where: { key },
          data: {
            ...(value !== undefined && { value }),
            ...(category !== undefined && { category }),
          },
        })
      : await db.globalSetting.create({
          data: {
            key,
            value: value || '',
            category: category || 'general',
          },
        });

    const parsed = {
      id: setting.id,
      key: setting.key,
      value: setting.value,
      category: setting.category,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
    };

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upsert settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
