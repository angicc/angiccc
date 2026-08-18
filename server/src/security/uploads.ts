// ─── Upload allowlisting ──────────────────────────────────────────────────────
// Trusting a client-declared MIME type is the same as not checking: the browser
// sends whatever the caller says, and `image/png` costs nothing to claim. The
// only honest check is the file's own leading bytes.
//
// Allowlist, never blocklist. A blocklist is a bet that you enumerated every
// dangerous type, and SVG alone (which carries script) is enough to lose it.

export type AllowedImageMime = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

/** Max bytes for a profile image. Enforced on the decoded bytes, not on the
 *  base64 text, which is ~33% larger and would let a bigger file through. */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

interface Signature { mime: AllowedImageMime; bytes: number[]; offset?: number }

/** Magic numbers. `-1` matches any byte at that position. */
const SIGNATURES: Signature[] = [
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  // WEBP is "RIFF????WEBP": the 4 size bytes in between are file-specific.
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46, -1, -1, -1, -1, 0x57, 0x45, 0x42, 0x50] },
];

function matches(buf: Uint8Array, sig: Signature): boolean {
  const at = sig.offset ?? 0;
  if (buf.length < at + sig.bytes.length) return false;
  return sig.bytes.every((b, i) => b === -1 || buf[at + i] === b);
}

/** The real type of these bytes, or null when it is not an allowed image. */
export function sniffImageMime(buf: Uint8Array): AllowedImageMime | null {
  for (const sig of SIGNATURES) if (matches(buf, sig)) return sig.mime;
  return null;
}

export interface UploadCheck {
  ok: boolean;
  mime?: AllowedImageMime;
  error?: string;
}

/**
 * Validate an image upload by content.
 *
 * `declaredMime` is accepted as a hint only: if it disagrees with the bytes,
 * the bytes win and the upload is refused — a mismatch is the signature of
 * someone trying to smuggle one type past a check for another.
 */
export function checkImageUpload(buf: Uint8Array, declaredMime?: string): UploadCheck {
  if (buf.length === 0) return { ok: false, error: 'The file is empty.' };
  if (buf.length > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'Image must be under 2 MB.' };
  }
  const actual = sniffImageMime(buf);
  if (!actual) {
    return { ok: false, error: 'Only PNG, JPEG, WEBP or GIF images are accepted.' };
  }
  if (declaredMime && declaredMime.toLowerCase() !== actual) {
    return { ok: false, error: 'The file contents do not match its declared type.' };
  }
  return { ok: true, mime: actual };
}

/** Decode a `data:` URL into its bytes and declared type, or null if malformed. */
export function parseDataUrl(dataUrl: string): { bytes: Uint8Array; mime: string } | null {
  const m = /^data:([a-z0-9.+/-]+);base64,(.*)$/i.exec(dataUrl);
  if (!m) return null;
  try {
    const bin = Buffer.from(m[2], 'base64');
    return { bytes: new Uint8Array(bin), mime: m[1].toLowerCase() };
  } catch {
    return null;
  }
}
