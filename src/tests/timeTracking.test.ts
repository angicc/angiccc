import { describe, it, expect, beforeEach } from 'vitest';
import { getTimeSpent, recordStudySeconds, totalStudySeconds, formatDuration } from '@/features/progress/timeTracking';

// The suite runs in the node environment, so there is no DOM. A minimal
// in-memory localStorage is enough here and avoids pulling in jsdom for one
// module whose only browser dependency is this API.
const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
} as Storage;

describe('timeTracking', () => {
  beforeEach(() => localStorage.clear());

  it('starts empty and accumulates per era', () => {
    expect(totalStudySeconds('u1')).toBe(0);
    recordStudySeconds('u1', 'byzantine', 30);
    recordStudySeconds('u1', 'byzantine', 15);
    recordStudySeconds('u1', 'ancient', 60);
    const spent = getTimeSpent('u1');
    expect(spent.byEra.byzantine).toBe(45);
    expect(spent.byEra.ancient).toBe(60);
    expect(totalStudySeconds('u1')).toBe(105);
  });

  it('keeps learners separate', () => {
    recordStudySeconds('u1', 'ancient', 100);
    expect(totalStudySeconds('u2')).toBe(0);
  });

  it('files era-less time under other, and still counts it', () => {
    recordStudySeconds('u1', null, 40);
    expect(getTimeSpent('u1').other).toBe(40);
    expect(totalStudySeconds('u1')).toBe(40);
  });

  it('ignores non-positive durations rather than corrupting the tally', () => {
    recordStudySeconds('u1', 'ancient', 50);
    recordStudySeconds('u1', 'ancient', 0);
    recordStudySeconds('u1', 'ancient', -900);
    expect(totalStudySeconds('u1')).toBe(50);
  });

  it('survives corrupted storage instead of throwing', () => {
    localStorage.setItem('historify:timeSpent:u1', 'not json');
    expect(() => getTimeSpent('u1')).not.toThrow();
    expect(totalStudySeconds('u1')).toBe(0);
  });

  it('formats durations readably at every scale', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3600)).toBe('1h 00m');
    expect(formatDuration(7530)).toBe('2h 05m');
  });
});
