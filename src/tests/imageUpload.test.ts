import { describe, it, expect } from 'vitest';
import { sniffImageMime, checkImageFile, MAX_IMAGE_BYTES } from '@/features/uploads/imageUpload';

const bytes = (...b: number[]) => new Uint8Array(b);
const PNG = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0);
const JPEG = bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0);
const GIF = bytes(0x47, 0x49, 0x46, 0x38, 0x39, 0x61);
const WEBP = bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50);

/** Minimal File stand-in: vitest runs in node, which has no File. */
function fakeFile(content: Uint8Array, type = '', size = content.length): File {
  return {
    size,
    type,
    slice: (start: number, end: number) => ({
      arrayBuffer: async () => content.slice(start, end).buffer,
    }),
  } as unknown as File;
}

describe('sniffImageMime', () => {
  it('recognises each allowed format by its magic bytes', () => {
    expect(sniffImageMime(PNG)).toBe('image/png');
    expect(sniffImageMime(JPEG)).toBe('image/jpeg');
    expect(sniffImageMime(GIF)).toBe('image/gif');
    expect(sniffImageMime(WEBP)).toBe('image/webp');
  });

  it('rejects formats that are not on the allowlist', () => {
    // %PDF
    expect(sniffImageMime(bytes(0x25, 0x50, 0x44, 0x46, 0x2d))).toBeNull();
    // <svg — script-bearing, and deliberately NOT allowed
    expect(sniffImageMime(bytes(0x3c, 0x73, 0x76, 0x67))).toBeNull();
    // <!DOCTYPE html
    expect(sniffImageMime(bytes(0x3c, 0x21, 0x44, 0x4f, 0x43))).toBeNull();
    // PK — a zip/office document
    expect(sniffImageMime(bytes(0x50, 0x4b, 0x03, 0x04))).toBeNull();
  });

  it('does not read past the end of a short buffer', () => {
    expect(() => sniffImageMime(bytes(0x89))).not.toThrow();
    expect(sniffImageMime(bytes())).toBeNull();
  });

  it('requires the WEBP tag, not just a RIFF container', () => {
    // RIFF....AVI  — a RIFF file that is not a WEBP
    expect(sniffImageMime(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x41, 0x56, 0x49, 0x20))).toBeNull();
  });
});

describe('checkImageFile', () => {
  it('accepts a real image', async () => {
    expect(await checkImageFile(fakeFile(PNG, 'image/png'))).toEqual({ ok: true, mime: 'image/png' });
  });

  it('rejects a file renamed to look like an image', async () => {
    // A PDF claiming to be a PNG — the bytes decide, not the declared type.
    const pdf = bytes(0x25, 0x50, 0x44, 0x46, 0x2d, 0x31);
    expect(await checkImageFile(fakeFile(pdf, 'image/png'))).toEqual({ ok: false, reason: 'not-an-image' });
  });

  it('rejects an image whose declared type contradicts its bytes', async () => {
    expect(await checkImageFile(fakeFile(PNG, 'image/jpeg'))).toEqual({ ok: false, reason: 'type-mismatch' });
  });

  it('rejects an oversized file before reading it', async () => {
    expect(await checkImageFile(fakeFile(PNG, 'image/png', MAX_IMAGE_BYTES + 1)))
      .toEqual({ ok: false, reason: 'too-large' });
  });

  it('rejects an empty file', async () => {
    expect(await checkImageFile(fakeFile(bytes(), '', 0))).toEqual({ ok: false, reason: 'empty' });
  });

  it('accepts a file the browser gave no type for, when the bytes are good', async () => {
    expect(await checkImageFile(fakeFile(GIF, ''))).toEqual({ ok: true, mime: 'image/gif' });
  });
});
