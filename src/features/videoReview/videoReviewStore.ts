import { HISTORY_VIDEOS } from './videoData';

const SCHEDULE_KEY  = 'historify:videoSchedule';
const COMPLETED_KEY = 'historify:videoCompleted';
const VIDEO_XP_KEY  = 'historify:videoXp:';

interface VideoSchedule {
  videoIndex: number;
  assignedAt: string;
}

const PERIOD_MS = 12 * 60 * 60 * 1000; // 12 hours

function loadSchedule(): VideoSchedule {
  const raw = localStorage.getItem(SCHEDULE_KEY);
  if (raw) return JSON.parse(raw);
  const initial: VideoSchedule = { videoIndex: 0, assignedAt: new Date().toISOString() };
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(initial));
  return initial;
}

function advanceIfNeeded(): VideoSchedule {
  const s = loadSchedule();
  const elapsed = Date.now() - new Date(s.assignedAt).getTime();
  if (elapsed >= PERIOD_MS) {
    const next: VideoSchedule = {
      videoIndex: (s.videoIndex + 1) % HISTORY_VIDEOS.length,
      assignedAt: new Date().toISOString(),
    };
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(next));
    return next;
  }
  return s;
}

export function getCurrentVideo() {
  const s = advanceIfNeeded();
  return HISTORY_VIDEOS[s.videoIndex];
}

export function getTimeUntilNextVideo(): number {
  const s = loadSchedule();
  const elapsed = Date.now() - new Date(s.assignedAt).getTime();
  return Math.max(0, PERIOD_MS - elapsed);
}

export function hasReviewedCurrentVideo(userId: string): boolean {
  const s = loadSchedule();
  const key = `${COMPLETED_KEY}:${userId}`;
  const raw = localStorage.getItem(key);
  if (!raw) return false;
  const completed: Record<string, string> = JSON.parse(raw);
  // Check if reviewed during current period
  const reviewedAt = completed[String(s.videoIndex)];
  if (!reviewedAt) return false;
  return Date.now() - new Date(reviewedAt).getTime() < PERIOD_MS;
}

export function markCurrentVideoReviewed(userId: string): void {
  const s = loadSchedule();
  const key = `${COMPLETED_KEY}:${userId}`;
  const raw = localStorage.getItem(key);
  const completed: Record<string, string> = raw ? JSON.parse(raw) : {};
  completed[String(s.videoIndex)] = new Date().toISOString();
  localStorage.setItem(key, JSON.stringify(completed));
}

export function getVideoXp(userId: string): number {
  const raw = localStorage.getItem(VIDEO_XP_KEY + userId);
  return raw ? parseInt(raw, 10) : 0;
}

export function addVideoXp(userId: string, xp: number): number {
  const current = getVideoXp(userId);
  const next = current + xp;
  localStorage.setItem(VIDEO_XP_KEY + userId, String(next));
  return next;
}

export function getVideoReviewCount(userId: string): number {
  const key = `${COMPLETED_KEY}:${userId}`;
  const raw = localStorage.getItem(key);
  if (!raw) return 0;
  const completed: Record<string, string> = JSON.parse(raw);
  return Object.keys(completed).length;
}

export function formatCountdown(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}
