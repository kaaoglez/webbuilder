import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const projectDir = path.resolve(process.cwd(), '..');
    const zipPath = path.join(projectDir, 'pageforge-v2.zip');

    // Generate fresh ZIP
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    execSync(
      `cd "${path.resolve(process.cwd())}" && zip -r "${zipPath}" . -x "node_modules/*" ".next/*" ".git/*" "db/*" "*.log"`,
      { stdio: 'pipe' }
    );

    if (!fs.existsSync(zipPath)) {
      return NextResponse.json({ error: 'ZIP generation failed' }, { status: 500 });
    }

    const fileBuffer = fs.readFileSync(zipPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="pageforge-v2.zip"',
        'Content-Length': String(fileBuffer.length),
      },
    });
  } catch (error) {
    console.error('Download ZIP error:', error);
    return NextResponse.json({ error: 'Failed to generate ZIP' }, { status: 500 });
  }
}
