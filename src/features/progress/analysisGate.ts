// ─── Post-Lesson Analysis Gate — state, cooldown, and lock resolution ────────
// After completing a lesson the learner must write a 150–300-word analysis
// that Clio grades strictly; a grade of B or better unlocks the next lesson.
// Completion also starts a 30-minute reflection cooldown before any new
// lesson may begin. Both constraints are persisted per user in localStorage
// so they survive reloads; already-completed lessons are never re-locked.
import { useEffect, useState } from 'react';
import type { Lesson } from '@/types';
import { getEraLessons } from '@/features/content/lessonsData';

export const ANALYSIS_MIN_WORDS = 150;
export const ANALYSIS_MAX_WORDS = 300;
export const COOLDOWN_MS = 30 * 60 * 1000;
/** Score (0–100) at which a grade counts as a B — the minimum passing bar. */
export const PASS_SCORE = 80;

export type AnalysisGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';

export interface AnalysisRecord {
  grade: AnalysisGrade;
  score: number;
  words: number;
  at: string;
}

interface AnalysisState {
  /** lessonId → the passing analysis on record (failures are not stored). */
  passes: Record<string, AnalysisRecord>;
  /** Epoch ms until which starting a new lesson is blocked. */
  cooldownUntil: number;
  /** Lifetime submissions (pass or fail) — feeds achievements. */
  attempts: number;
}

const KEY = 'historify:analysis:';

export function loadAnalysisState(userId: string): AnalysisState {
  try {
    const raw = localStorage.getItem(KEY + userId);
    if (raw) {
      const p = JSON.parse(raw) as Partial<AnalysisState>;
      return { passes: p.passes ?? {}, cooldownUntil: p.cooldownUntil ?? 0, attempts: p.attempts ?? 0 };
    }
  } catch { /* corrupted state falls through to a clean slate */ }
  return { passes: {}, cooldownUntil: 0, attempts: 0 };
}

function saveAnalysisState(userId: string, s: AnalysisState) {
  localStorage.setItem(KEY + userId, JSON.stringify(s));
}

export function isAnalysisPassed(userId: string, lessonId: string): boolean {
  return Boolean(loadAnalysisState(userId).passes[lessonId]);
}

export function getAnalysisRecord(userId: string, lessonId: string): AnalysisRecord | null {
  return loadAnalysisState(userId).passes[lessonId] ?? null;
}

export function recordAnalysisAttempt(userId: string) {
  const s = loadAnalysisState(userId);
  s.attempts += 1;
  saveAnalysisState(userId, s);
}

export function recordAnalysisPass(userId: string, lessonId: string, grade: AnalysisGrade, score: number, words: number) {
  const s = loadAnalysisState(userId);
  s.passes[lessonId] = { grade, score, words, at: new Date().toISOString() };
  saveAnalysisState(userId, s);
}

/** Count of lessons with a passing analysis on record — feeds achievements. */
export function countAnalysisPasses(userId: string): number {
  return Object.keys(loadAnalysisState(userId).passes).length;
}

/** Called on lesson completion: opens the 30-minute reflection window. */
export function startCooldown(userId: string) {
  const s = loadAnalysisState(userId);
  s.cooldownUntil = Date.now() + COOLDOWN_MS;
  saveAnalysisState(userId, s);
}

export function getCooldownRemaining(userId: string): number {
  return Math.max(0, loadAnalysisState(userId).cooldownUntil - Date.now());
}

export type LessonLockReason = 'analysis' | 'cooldown' | 'sequence';

export interface LessonLock {
  locked: boolean;
  reason: LessonLockReason | null;
  /** For 'analysis'/'sequence' locks: the predecessor lesson that blocks. */
  blockingLessonId?: string;
}

/** Called when a lesson's analysis passes: ends the reflection cooldown early
 *  so the learner can proceed to the next lesson immediately. */
export function endCooldown(userId: string) {
  const s = loadAnalysisState(userId);
  s.cooldownUntil = 0;
  saveAnalysisState(userId, s);
}

/**
 * Resolve the progression lock for a lesson. Rules (identical on EVERY plan):
 *  - Completed lessons are always open (revisiting is free).
 *  - A lesson whose predecessor in the era is NOT completed → locked
 *    ('sequence') — no skipping ahead.
 *  - Predecessor completed: a 30-minute reflection cooldown gates the next
 *    lesson ('cooldown'). Passing the predecessor's written analysis ENDS the
 *    cooldown immediately, so the learner can either wait it out or reflect
 *    their way past it. Once analysis is passed OR the cooldown has elapsed,
 *    the lesson opens.
 * Subscription gating (canLesson) is a separate, additive concern; it can
 * lock further, never unlock past this gate.
 */
export function getLessonLock(userId: string, lesson: Lesson, completedLessons: string[]): LessonLock {
  if (completedLessons.includes(lesson.id)) return { locked: false, reason: null };
  const eraLessons = getEraLessons(lesson.eraId);
  const idx = eraLessons.findIndex(l => l.id === lesson.id);
  const prev = idx > 0 ? eraLessons[idx - 1] : null;
  if (prev && !completedLessons.includes(prev.id)) {
    return { locked: true, reason: 'sequence', blockingLessonId: prev.id };
  }
  // Passing the previous lesson's analysis clears the wait entirely.
  if (prev && isAnalysisPassed(userId, prev.id)) return { locked: false, reason: null };
  // Otherwise the 30-minute reflection cooldown gates the next lesson.
  if (prev && getCooldownRemaining(userId) > 0) {
    return { locked: true, reason: 'cooldown', blockingLessonId: prev.id };
  }
  return { locked: false, reason: null };
}

/** Live countdown hook — re-renders each second while the cooldown runs. */
export function useCooldownRemaining(userId: string | undefined): number {
  const [remaining, setRemaining] = useState(() => (userId ? getCooldownRemaining(userId) : 0));
  useEffect(() => {
    if (!userId) return;
    setRemaining(getCooldownRemaining(userId));
    const id = setInterval(() => {
      const r = getCooldownRemaining(userId);
      setRemaining(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [userId]);
  return remaining;
}

export function formatCooldown(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
