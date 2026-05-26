import JSZip from 'jszip';

/**
 * Creates a ZIP file for a WordPress theme.
 * All files are placed inside a root folder named after the theme slug.
 */
export async function createThemeZip(
  files: Map<string, string>,
  themeSlug: string
): Promise<Uint8Array> {
  const zip = new JSZip();
  const themeFolder = zip.folder(themeSlug);

  if (!themeFolder) {
    throw new Error(`Failed to create theme folder: ${themeSlug}`);
  }

  for (const [filePath, content] of files) {
    themeFolder.file(filePath, content);
  }

  return await zip.generateAsync({ type: 'uint8array' });
}

/**
 * Creates a ZIP file for a WordPress plugin.
 * All files are placed inside a root folder named after the plugin slug.
 */
export async function createPluginZip(
  files: Map<string, string>,
  pluginSlug: string
): Promise<Uint8Array> {
  const zip = new JSZip();
  const pluginFolder = zip.folder(pluginSlug);

  if (!pluginFolder) {
    throw new Error(`Failed to create plugin folder: ${pluginSlug}`);
  }

  for (const [filePath, content] of files) {
    pluginFolder.file(filePath, content);
  }

  return await zip.generateAsync({ type: 'uint8array' });
}
