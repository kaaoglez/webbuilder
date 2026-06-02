import JSZip from 'jszip';

/**
 * Creates a ZIP file for a WordPress theme or plugin.
 * All files are placed inside a root folder named after the slug.
 */
export async function createThemeZip(
  files: Map<string, string>,
  themeSlug: string
): Promise<Uint8Array> {
  return createZip(files, themeSlug);
}

/**
 * Creates a ZIP file for a WordPress plugin.
 * All files are placed inside a root folder named after the slug.
 */
export async function createPluginZip(
  files: Map<string, string>,
  pluginSlug: string
): Promise<Uint8Array> {
  return createZip(files, pluginSlug);
}

/**
 * Core ZIP creation function shared by theme and plugin generators.
 */
async function createZip(
  files: Map<string, string>,
  slug: string
): Promise<Uint8Array> {
  const zip = new JSZip();
  const folder = zip.folder(slug);

  if (!folder) {
    throw new Error(`Failed to create folder: ${slug}`);
  }

  for (const [filePath, content] of files) {
    folder.file(filePath, content);
  }

  return await zip.generateAsync({ type: 'uint8array' });
}
