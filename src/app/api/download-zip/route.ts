import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';

// Directories and files to exclude from the ZIP
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  'db',
  '.env',
  '*.log',
];

function shouldExclude(filePath: string): boolean {
  const parts = filePath.replace(/\\/g, '/').split('/');
  for (const part of parts) {
    for (const pattern of EXCLUDE_PATTERNS) {
      if (pattern.startsWith('*')) {
        if (part.endsWith(pattern.slice(1))) return true;
      } else if (part === pattern) {
        return true;
      }
    }
  }
  return false;
}

function addDirectoryToZip(zip: JSZip, dirPath: string, basePath: string = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (shouldExclude(relativePath)) continue;

    if (entry.isDirectory()) {
      addDirectoryToZip(zip, fullPath, relativePath);
    } else if (entry.isFile()) {
      try {
        const content = fs.readFileSync(fullPath);
        zip.file(relativePath, content);
      } catch {
        // Skip files that can't be read (symlinks, permissions, etc.)
      }
    }
  }
}

export async function GET() {
  try {
    const projectDir = process.cwd();
    const zip = new JSZip();

    addDirectoryToZip(zip, projectDir);

    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="pageforge-v2.zip"',
        'Content-Length': String(buffer.length),
      },
    });
  } catch (error) {
    console.error('Download ZIP error:', error);
    return NextResponse.json({ error: 'Failed to generate ZIP' }, { status: 500 });
  }
}
