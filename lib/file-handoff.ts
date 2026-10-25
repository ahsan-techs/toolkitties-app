// Phase 1: Success Screen Bypass — carries a just-processed file's Blob
// straight into the next tool's dropzone via client-side navigation,
// so people never download + re-upload between chained tools.
// Lives only in browser memory for one SPA navigation. Nothing touches a server.

type FileHandoff = { blob: Blob; filename: string; toSlug: string };

let pending: FileHandoff | null = null;

export function setFileHandoff(data: FileHandoff) {
  pending = data;
}

export function consumeFileHandoff(currentSlug: string): FileHandoff | null {
  if (pending && pending.toSlug === currentSlug) {
    const data = pending;
    pending = null;
    return data;
  }
  return null;
}
