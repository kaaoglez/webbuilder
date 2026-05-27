import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    const parsed = projects.map((project) => ({
      id: project.id,
      name: project.name,
      type: project.type,
      config: JSON.parse(project.config),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, config } = body;

    if (!name || !type || config === undefined) {
      return NextResponse.json(
        { error: 'Name, type, and config are required' },
        { status: 400 }
      );
    }

    if (type !== 'theme' && type !== 'plugin') {
      return NextResponse.json(
        { error: 'Type must be "theme" or "plugin"' },
        { status: 400 }
      );
    }

    const project = await db.project.create({
      data: {
        name,
        type,
        config: JSON.stringify(config),
      },
    });

    const parsed = {
      id: project.id,
      name: project.name,
      type: project.type,
      config: JSON.parse(project.config),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    return NextResponse.json(parsed, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
