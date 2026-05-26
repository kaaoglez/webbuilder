import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/seo/[id] — Get specific SEO record
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const seo = await db.pageSEO.findUnique({ where: { id } });

    if (!seo) {
      return NextResponse.json({ error: 'SEO record not found' }, { status: 404 });
    }

    const parsed = {
      id: seo.id,
      pageId: seo.pageId,
      title: seo.title,
      description: seo.description,
      keywords: JSON.parse(seo.keywords),
      ogImage: seo.ogImage,
      ogType: seo.ogType,
      twitterCard: seo.twitterCard,
      canonicalUrl: seo.canonicalUrl,
      robotsIndex: seo.robotsIndex,
      robotsFollow: seo.robotsFollow,
      createdAt: seo.createdAt.toISOString(),
      updatedAt: seo.updatedAt.toISOString(),
    };

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch SEO record' }, { status: 500 });
  }
}

// DELETE /api/seo/[id] — Delete SEO record
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.pageSEO.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete SEO record' }, { status: 500 });
  }
}
