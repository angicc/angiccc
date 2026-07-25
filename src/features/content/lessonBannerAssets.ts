// ─── Contextual banner asset router ──────────────────────────────────────────
// Resolves the banner image candidates for a lesson as an explicit, ordered
// chain keyed on the lesson ID — never a random pick, never a shared epoch
// folder. Resolution order:
//   1. curated override for this exact lesson id (fixes weak/broken DB assets)
//   2. the lesson's own imageUrl (its explicit content binding)
//   3. the era's guaranteed-good hero image
// If every candidate fails to load, the banner renders the era's procedural
// SVG backdrop (see EraBannerBackdrop) — styled per era, never blank.

import { LESSON_GIF_BANNERS } from '@/features/content/lessonGifBanners';
import { localLessonBanner, DEFAULT_BANNER_GIF } from '@/features/content/lessonLocalBanners';

/** Curated per-lesson replacements where the dataset asset is generic or frail. */
const LESSON_BANNER_OVERRIDES: Record<string, string> = {
  // Globalization: the dataset points at a generic city photo also used as the
  // modern-era fallback — give the lesson its own distinct asset.
  'modern-04': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=60',
};

/** Era hero images — fixed, reliable, one per era. Final real-image stage. */
export const ERA_HERO_IMAGES: Record<string, string> = {
  // Stonehenge — a famous Wikimedia file referenced via Special:FilePath, which
  // redirects by filename (no fragile MD5 hash path) — anchors the prehistoric
  // fallback chain so a prehistoric lesson banner can never render blank.
  prehistoric:    'https://commons.wikimedia.org/wiki/Special:FilePath/Stonehenge2007_07_30.jpg',
  ancient:        'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=60',
  'middle-ages':  'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1200&q=60',
  'early-modern': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=60',
  modern:         'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=60',
};

// ── Per-lesson animated banner (self-contained, always renders) ──────────────
// Every lesson gets its OWN distinct animated banner — not one image/GIF shared
// across an era. It is a self-contained animated SVG data-URI (no external host,
// so it can never fail to load), seeded by the lesson id so each lesson has a
// unique hue shift, particle field, orbit motion and offset, and carrying the
// lesson's own category emblem emoji. This replaces the era-generic pool GIF /
// era SVG: distinct per lesson AND guaranteed to display.
const ERA_BANNER_PAL: Record<string, { c1: string; c2: string; accent: string; particle: string }> = {
  prehistoric:    { c1: '#3b2412', c2: '#7c2d12', accent: '#fb923c', particle: '#fdba74' },
  ancient:        { c1: '#3a2c08', c2: '#78560c', accent: '#f59e0b', particle: '#fcd34d' },
  byzantine:      { c1: '#241243', c2: '#4c1d95', accent: '#c4b5fd', particle: '#ddd6fe' },
  'middle-ages':  { c1: '#0b1e3a', c2: '#1e3a8a', accent: '#60a5fa', particle: '#bfdbfe' },
  'early-modern': { c1: '#062b22', c2: '#065f46', accent: '#34d399', particle: '#a7f3d0' },
  modern:         { c1: '#3a0a1c', c2: '#9f1239', accent: '#fb7185', particle: '#fecdd3' },
};

function bHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function bRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** A unique, always-rendering animated banner for one lesson (data-URI SVG). */
export function lessonAnimatedBanner(lessonId: string, eraId: string, emblem = ''): string {
  const pal = ERA_BANNER_PAL[eraId] ?? ERA_BANNER_PAL.ancient;
  const r = bRng(bHash(lessonId));
  const hue = Math.round(r() * 50 - 25);         // per-lesson colour shift ±25°
  const emX = 620 + Math.round(r() * 100);       // emblem/orbit horizontal offset
  const spin = (16 + Math.round(r() * 12));      // orbit period
  const em = /\p{Extended_Pictographic}/u.test(emblem) ? emblem : '';
  let parts = '';
  for (let i = 0; i < 14; i++) {
    const cx = Math.round(r() * 840), cy = Math.round(30 + r() * 300);
    const rad = (1 + r() * 2.6).toFixed(1), dur = (4 + r() * 5).toFixed(1);
    const dy = (10 + r() * 22).toFixed(0), beg = (-r() * 7).toFixed(1);
    parts += `<circle cx="${cx}" cy="${cy}" r="${rad}"><animate attributeName="cy" values="${cy};${cy - Number(dy)};${cy}" dur="${dur}s" begin="${beg}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.12;0.8;0.12" dur="${dur}s" begin="${beg}s" repeatCount="indefinite"/></circle>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 360" preserveAspectRatio="xMidYMid slice" width="840" height="360">`
    + `<defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${pal.c1}"/><stop offset="1" stop-color="${pal.c2}"/></linearGradient>`
    + `<radialGradient id="g" cx="0.28" cy="0.3" r="0.85"><stop offset="0" stop-color="${pal.accent}" stop-opacity="0.5"/><stop offset="1" stop-color="${pal.accent}" stop-opacity="0"/></radialGradient>`
    + `<filter id="h"><feColorMatrix type="hueRotate" values="${hue}"/></filter></defs>`
    + `<g filter="url(#h)"><rect width="840" height="360" fill="url(#s)"/>`
    + `<rect width="840" height="360" fill="url(#g)"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="6s" repeatCount="indefinite"/></rect>`
    + `<g opacity="0.12"><rect x="-260" y="-40" width="150" height="440" fill="#ffffff" transform="skewX(-16)"><animate attributeName="x" values="-260;1040" dur="8s" repeatCount="indefinite"/></rect></g>`
    + `<g transform="translate(${emX} 188)" opacity="0.45"><circle r="86" fill="none" stroke="${pal.accent}" stroke-opacity="0.32" stroke-width="2"/><circle r="58" fill="none" stroke="${pal.accent}" stroke-opacity="0.5" stroke-width="1.4"/><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${spin}s" repeatCount="indefinite"/><circle cx="86" cy="0" r="6" fill="${pal.accent}"/></g></g>`
    + `<g fill="${pal.particle}">${parts}</g></g>`
    + (em ? `<text x="${emX}" y="232" font-size="120" text-anchor="middle" opacity="0.16">${em}</text>` : '')
    + `</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/**
 * The full deterministic candidate chain for a lesson banner. Duplicates are
 * collapsed so a failing URL is never retried at a later stage.
 * Order: curated local GIF (owner's per-lesson banner set) → explicit
 * lesson-specific external GIF → per-lesson animated banner (always renders,
 * unique to this lesson) → curated override → lesson image → era hero →
 * generic default GIF.
 *
 * The curated local GIF (public/assets/banners/{era}/{slug}.gif) sits at the
 * head: when the file exists it becomes the banner; when it is absent the
 * <img onError> chain simply advances, so a lesson keeps its own distinct
 * existing banner rather than ever showing blank. The per-lesson animated
 * banner (a self-contained data-URI) is the guaranteed always-rendering stage;
 * the static images and DEFAULT_BANNER_GIF below it are deep safety nets.
 */
export function resolveBannerCandidates(lessonId: string, eraId: string, imageUrl?: string, emblem?: string): string[] {
  const chain = [
    localLessonBanner(lessonId),
    LESSON_GIF_BANNERS[lessonId],
    lessonAnimatedBanner(lessonId, eraId, emblem ?? ''),
    LESSON_BANNER_OVERRIDES[lessonId],
    imageUrl,
    ERA_HERO_IMAGES[eraId] ?? ERA_HERO_IMAGES.ancient,
    DEFAULT_BANNER_GIF,
  ].filter((u): u is string => Boolean(u));
  return [...new Set(chain)];
}
