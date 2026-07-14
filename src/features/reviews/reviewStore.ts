// ─── App reviews (client) ─────────────────────────────────────────────────────
// Real testimonials, written by real users. With a backend configured the
// landing page lists the global review feed and signed-in users publish
// through it; without one, reviews live in this device's localStorage so the
// feature stays fully demo-able.

export interface AppReview {
  author: string;
  role: string;
  rating: number;       // 1–5
  text: string;
  createdAt: string;    // ISO
}

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '');
const LOCAL_KEY = 'historify:app-reviews';

export function localReviews(): AppReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function saveLocal(reviews: AppReview[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(reviews.slice(0, 24))); } catch { /* full */ }
}

/** Server feed when configured; null means "use local". */
export async function fetchReviews(): Promise<AppReview[] | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/api/reviews`);
    if (!res.ok) return null;
    const json = (await res.json()) as { reviews?: AppReview[] };
    return json.reviews ?? null;
  } catch { return null; }
}

/**
 * Publish (or revise) the caller's review. Tries the server first; always
 * mirrors locally so the author sees their words immediately.
 */
export async function submitReview(review: { author: string; role: string; rating: number; text: string }): Promise<'server' | 'local'> {
  const entry: AppReview = { ...review, createdAt: new Date().toISOString() };
  const mine = localReviews().filter(r => r.author !== review.author);
  saveLocal([entry, ...mine]);

  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: review.rating, text: review.text, role: review.role }),
      });
      if (res.ok) return 'server';
    } catch { /* fall through to local */ }
  }
  return 'local';
}
