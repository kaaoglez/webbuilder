import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const website = await db.website.findUnique({ where: { id } });
    if (!website) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      ...website,
      navigation: JSON.parse(website.navigation),
      theme: JSON.parse(website.theme),
      seo: JSON.parse(website.seo),
      blog: JSON.parse(website.blog),
      forms: JSON.parse(website.forms),
      integrations: JSON.parse(website.integrations),
      pages: JSON.parse(website.pages),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const website = await db.website.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.domain !== undefined && { domain: body.domain }),
        ...(body.navigation !== undefined && { navigation: JSON.stringify(body.navigation) }),
        ...(body.theme !== undefined && { theme: JSON.stringify(body.theme) }),
        ...(body.seo !== undefined && { seo: JSON.stringify(body.seo) }),
        ...(body.blog !== undefined && { blog: JSON.stringify(body.blog) }),
        ...(body.forms !== undefined && { forms: JSON.stringify(body.forms) }),
        ...(body.integrations !== undefined && { integrations: JSON.stringify(body.integrations) }),
        ...(body.pages !== undefined && { pages: JSON.stringify(body.pages) }),
        ...(body.status !== undefined && { status: body.status }),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(website);
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.website.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
