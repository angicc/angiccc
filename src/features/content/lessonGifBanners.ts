// ─── Animated GIF lesson banners (Google Drive: "Historify GIFS") ────────────
// Source of truth is the owner's Drive folder, organized in four era
// subfolders. Each GIF is mapped to an EXPLICIT lesson id — never matched by
// name at runtime — so the binding is deterministic and reviewable.
//
// Serving: files are embedded via the googleusercontent image CDN, which
// serves raw bytes (animation preserved) for any file shared as
// "Anyone with the link can view". If a file is not public, the <img> errors
// and the banner falls back to the lesson's static image chain — the UI can
// never break on a permissions change.
//
// NOTE ON WATERMARKS: pixel-level watermark removal is not possible in the
// browser. The banner applies a slight cover-crop zoom to GIF sources, which
// keeps edge/corner watermarks outside the visible frame. For a true clean
// source, re-export the GIFs without the overlay and re-upload — the ids
// below stay valid because Drive keeps the file id on content update.

const gif = (driveFileId: string) => `https://lh3.googleusercontent.com/d/${driveFileId}`;

/** lessonId → animated banner URL. Grouped by Drive era subfolder. */
export const LESSON_GIF_BANNERS: Record<string, string> = {
  // ── Ancient Era ──
  'ancient-01': gif('1Jmhzo4H_kaDPYSNMmNZE4DgD7GT-EAOX'), // Ancient Mesopotamia and Egypt
  // Animated Greek-vase runners (Wikimedia Commons, public domain)
  'ancient-02': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Race-on-Greek-vase.gif',
  // Animated map of Roman expansion, Republic → Empire (Wikimedia Commons)
  'ancient-03': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Roman_Republic_Empire_map.gif',
  'ancient-04': gif('1eZIvgcJFYuPSX7sT4jHKqVp6zkQYnA0J'), // Ancient East
  'ancient-06': gif('1M5xqCDt50TuU-bh2nMVYpG9s3a59fajv'), // The Phoenicians

  // ── Middle Ages ──
  'medieval-01': gif('1ZStwdbw1ul6rWAuRsl6yEt-SVyqx6orr'), // Middle Ages
  'medieval-02': gif('1tqMs8x-FnSa2WC51Guh--tWFEVgT82Ge'), // The Crusades and the Islamic Golden Age
  'medieval-03': gif('1N2kM62RDPs9_jKSgYXOEpR3L0rnHmqEv'), // The Black Death and the Late Medieval Crisis
  'medieval-05': gif('1RDgidTwTuFKjinvJkCmp5p-AeHEDGhof'), // Mongol Empire
  'medieval-06': gif('1RJkjBSjNSK8SftVMZGSvY5xpsZbJz6-1'), // Medieval Japan

  // ── Early Modern ──
  'earlymod-01': gif('1Y3AHgo-ldZLm4rTGUVh24dh5ziQ4tYdP'), // The Renaissance
  'earlymod-03': gif('1l4llnA7Kx1oftiijriZZ-6tL0dqzabf9'), // Scientific Revolution
  'earlymod-04': gif('1nx-W8ygSh_i5oFZt3f4txy_ZaRLcTL4H'), // Age of Absolutism
  'earlymod-05': gif('1m46_lEkfbGYTisPX4eSeXsBQIr_o5X_H'), // Transatlantic Slave Trade
  'earlymod-06': gif('19_-qh7THn8cBMqpwGKTs8LR-FlsH4hZa'), // The Ottoman Empire
  'earlymod-07': gif('1k2gmwPIk6uLBpAP7nt6daAi7euSzBU3o'), // The Age of Revolution

  // ── Modern Era ──
  'modern-01': gif('1P_BIE4lZgswJJzqHUOZK-I-8h9UaqI5C'), // Industrial Revolution
  'modern-02': gif('1RFnOS_UYXCIU6DAKdT7dHwcw7RVmLb2L'), // World Wars
  'modern-03': gif('1BXHAKNyXNZHTaiUMV656NJLCQmLWHA1X'), // The Cold War
  'modern-04': gif('1r3K2DrEMcVfjjzJq_vYiNe5Upi6igG5g'), // Globalization and Contemporary World
  'modern-05': gif('1XGc0KGOM3z-DUfRy-wb11aSbKHyI3Gwz'), // Imperialism
  'modern-06': gif('19h9ddiRHiTwbjrMNiAzW4XlJ22GzRu5d'), // Yugoslav Wars
};

// ── GIF banners hosted on external gallery pages (e.g. makeagif.com) ─────────
// Some banner GIFs live on gallery pages whose direct media URL embeds an
// upload-date path segment that cannot be derived from the page URL alone
// (i.makeagif.com/media/<date>/<id>.gif). The page itself cannot be read
// cross-origin from the browser, so the media URL is resolved once per client
// through microlink.io's public, CORS-enabled metadata API (og:image of the
// page) and cached in localStorage. If resolution fails for any reason the
// lesson simply falls back to its static banner chain — the UI never breaks.
export const LESSON_GIF_PAGES: Record<string, string> = {
  // Alexander the Great (All Parts) — Ancient Macedonia lesson banner
  'ancient-07': 'https://makeagif.com/gif/alexander-the-great-all-parts-ErY-9P',
};

const GIF_PAGE_CACHE_PREFIX = 'historify:gifbanner:';

/** Resolve the direct media URL behind a lesson's GIF gallery page. */
export async function resolveGifPageBanner(lessonId: string): Promise<string | null> {
  const page = LESSON_GIF_PAGES[lessonId];
  if (!page) return null;
  try {
    const cached = localStorage.getItem(GIF_PAGE_CACHE_PREFIX + lessonId);
    if (cached) return cached;
  } catch { /* storage unavailable — resolve fresh */ }
  try {
    const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(page)}`);
    if (!res.ok) return null;
    const json = await res.json() as { data?: { image?: { url?: string } } };
    const url = json?.data?.image?.url;
    if (!url || !/^https:\/\/[^\s"']+\.(gif|webp|png|jpe?g)(\?.*)?$/i.test(url)) return null;
    try { localStorage.setItem(GIF_PAGE_CACHE_PREFIX + lessonId, url); } catch { /* best-effort */ }
    return url;
  } catch {
    return null;
  }
}

/** True when a resolved banner src is one of the animated GIF banners. */
export function isGifBanner(src: string): boolean {
  return src.startsWith('https://lh3.googleusercontent.com/d/')
    || src.includes('.makeagif.com/')
    || /\.gif(\?.*)?$/i.test(src);
}
