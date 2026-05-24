import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/seo?pageId=xxx — Get SEO settings for a page
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    const seo = await db.pageSEO.findFirst({
      where: { pageId },
    });

    if (!seo) {
      return NextResponse.json(null);
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
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

// PUT /api/seo — Upsert SEO settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { pageId, title, description, keywords, ogImage, ogType, twitterCard, canonicalUrl, robotsIndex, robotsFollow } = body;

    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    const existing = await db.pageSEO.findFirst({ where: { pageId } });

    const seo = existing
      ? await db.pageSEO.update({
          where: { id: existing.id },
          data: {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(keywords !== undefined && { keywords: JSON.stringify(keywords) }),
            ...(ogImage !== undefined && { ogImage }),
            ...(ogType !== undefined && { ogType }),
            ...(twitterCard !== undefined && { twitterCard }),
            ...(canonicalUrl !== undefined && { canonicalUrl }),
            ...(robotsIndex !== undefined && { robotsIndex }),
            ...(robotsFollow !== undefined && { robotsFollow }),
          },
        })
      : await db.pageSEO.create({
          data: {
            pageId,
            title: title || '',
            description: description || '',
            keywords: JSON.stringify(keywords || []),
            ogImage: ogImage || '',
            ogType: ogType || 'website',
            twitterCard: twitterCard || 'summary_large_image',
            canonicalUrl: canonicalUrl || '',
            robotsIndex: robotsIndex ?? true,
            robotsFollow: robotsFollow ?? true,
          },
        });

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upsert SEO settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
