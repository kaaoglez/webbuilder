import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const websites = await db.website.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(websites);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const website = await db.website.create({
      data: {
        name: body.name || 'Mi Sitio Web',
        navigation: JSON.stringify(body.navigation || []),
        theme: JSON.stringify(body.theme || {}),
        seo: JSON.stringify(body.seo || {}),
        blog: JSON.stringify(body.blog || {}),
        forms: JSON.stringify(body.forms || {}),
        integrations: JSON.stringify(body.integrations || {}),
        pages: JSON.stringify(body.pages || []),
        status: body.status || 'DRAFT',
      },
    });
    return NextResponse.json(website, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create website';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
