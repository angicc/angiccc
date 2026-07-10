const key = (userId: string) => `historify:bookmarks:${userId}`;

export function getBookmarks(userId: string): string[] {
  try { return JSON.parse(localStorage.getItem(key(userId)) ?? '[]'); } catch { return []; }
}

export function toggleBookmark(userId: string, lessonId: string): boolean {
  const current = getBookmarks(userId);
  const isBookmarked = current.includes(lessonId);
  const next = isBookmarked ? current.filter(id => id !== lessonId) : [...current, lessonId];
  localStorage.setItem(key(userId), JSON.stringify(next));
  return !isBookmarked;
}

export function isBookmarked(userId: string, lessonId: string): boolean {
  return getBookmarks(userId).includes(lessonId);
}
