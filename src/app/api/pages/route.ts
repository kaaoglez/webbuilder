import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const pages = await db.page.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON fields before sending to client
    const parsed = pages.map((page) => ({
      id: page.id,
      name: page.name,
      template: page.template,
      sections: JSON.parse(page.sections),
      theme: JSON.parse(page.theme),
      status: page.status,
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, template, sections, theme, status, createdAt, updatedAt } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const page = await db.page.create({
      data: {
        name,
        template: template || 'landing',
        sections: JSON.stringify(sections || []),
        theme: JSON.stringify(theme || {}),
        status: status || 'DRAFT',
      },
    });

    const parsed = {
      id: page.id,
      name: page.name,
      template: page.template,
      sections: JSON.parse(page.sections),
      theme: JSON.parse(page.theme),
      status: page.status,
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    };

    return NextResponse.json(parsed, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create page';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
