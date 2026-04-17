import JSZip from 'jszip';

/**
 * Downloads multiple image URLs as a single ZIP file.
 * Preserves order by naming files slide_01, slide_02, etc.
 */
export async function downloadSlidesAsZip(urls: string[], projectName: string = 'content_slides') {
  if (!urls || urls.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder(projectName) || zip;

  // Fetch all images and add to zip
  const fetchPromises = urls.map(async (url, index) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      
      // Determine extension from content type or URL
      const contentType = response.headers.get('Content-Type');
      let ext = 'png';
      if (contentType?.includes('jpeg')) ext = 'jpg';
      if (contentType?.includes('webp')) ext = 'webp';

      // Zero-padded naming for correct sorting (slide_01, slide_02, etc.)
      const fileName = `slide_${(index + 1).toString().padStart(2, '0')}.${ext}`;
      folder.file(fileName, blob);
    } catch (error) {
      console.error(`Failed to fetch image at ${url}:`, error);
    }
  });

  // Wait for all fetches to complete
  await Promise.all(fetchPromises);

  // Generate ZIP and trigger download
  const content = await zip.generateAsync({ type: 'blob' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `${projectName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
