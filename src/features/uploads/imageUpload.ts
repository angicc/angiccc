// ─── Client-side image upload validation ──────────────────────────────────────
// The avatar picker used to check only file.size. Any file at all — a PDF, an
// HTML document, an SVG carrying script — was accepted, base64'd and stored,
// then rendered back through an <img src>. Browsers do sniff content, so
// "it's only in localStorage" is not a defence.
//
// This checks the bytes, not the name and not the browser-reported type, both
// of which the caller controls. Mirrors server/src/security/uploads.ts so the
// two ends agree on what is allowed.

export type AllowedImageMime = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/** Accepted by the file input. Kept in sync with the signatures below. */
export const ACCEPT_ATTRIBUTE = 'image/png,image/jpeg,image/webp,image/gif';

interface Signature { mime: AllowedImageMime; bytes: number[] }

const SIGNATURES: Signature[] = [
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46, -1, -1, -1, -1, 0x57, 0x45, 0x42, 0x50] },
];

export function sniffImageMime(bytes: Uint8Array): AllowedImageMime | null {
  for (const sig of SIGNATURES) {
    if (bytes.length < sig.bytes.length) continue;
    if (sig.bytes.every((b, i) => b === -1 || bytes[i] === b)) return sig.mime;
  }
  return null;
}

export type ImageCheck =
  | { ok: true; mime: AllowedImageMime }
  | { ok: false; reason: 'too-large' | 'empty' | 'not-an-image' | 'type-mismatch' };

/**
 * Read the head of the file and decide whether it is a real, allowed image.
 *
 * Only the first bytes are read, so a large rejected file is never fully
 * loaded into memory.
 */
export async function checkImageFile(file: File): Promise<ImageCheck> {
  if (file.size === 0) return { ok: false, reason: 'empty' };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, reason: 'too-large' };

  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const actual = sniffImageMime(head);
  if (!actual) return { ok: false, reason: 'not-an-image' };

  // A declared type that disagrees with the bytes is the signature of someone
  // renaming a file to slip past a type check.
  const declared = file.type?.toLowerCase();
  if (declared && declared !== actual) return { ok: false, reason: 'type-mismatch' };

  return { ok: true, mime: actual };
}
