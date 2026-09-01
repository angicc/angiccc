import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ERA_BACKDROPS } from '@/features/content/eraBackdrops';

/**
 * Resolve an era's backdrop artwork, falling forward until something loads.
 *
 * Two surfaces show this artwork — the landing-page era timeline and the era
 * preview pages — and they style it completely differently: a masked panel
 * behind one column, and a full-bleed hero. Only the source resolution is
 * shared, so this is a hook rather than a component.
 *
 * `src` is undefined when there is nothing to show, which happens in three
 * ways, all of which must leave the page looking like it did before artwork
 * existed rather than showing a broken frame:
 *
 *  - the era has no entry;
 *  - every candidate has failed to load;
 *  - the visitor asked for reduced motion. Most of these are animated GIFs and
 *    a GIF cannot be paused with CSS, so honouring that preference means not
 *    loading the image at all.
 *
 * Pass `onError` to the <img>. Each failure advances to the next candidate:
 * the local file first, then the remote fallback where one is justified.
 */
export function useEraBackdrop(eraId: string): { src?: string; onError: () => void } {
  const backdrop = ERA_BACKDROPS[eraId];
  const [attempt, setAttempt] = useState(0);
  const reducedMotion = useReducedMotion();

  const candidates = [backdrop?.local, backdrop?.remote].filter(Boolean) as string[];
  return {
    src: reducedMotion ? undefined : candidates[attempt],
    onError: () => setAttempt(n => n + 1),
  };
}
