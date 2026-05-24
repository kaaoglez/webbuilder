import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const page = await db.page.findUnique({ where: { id } });
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

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

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const page = await db.page.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.template !== undefined && { template: body.template }),
        ...(body.sections !== undefined && { sections: JSON.stringify(body.sections) }),
        ...(body.theme !== undefined && { theme: JSON.stringify(body.theme) }),
        ...(body.status !== undefined && { status: body.status }),
        updatedAt: new Date(),
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

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
