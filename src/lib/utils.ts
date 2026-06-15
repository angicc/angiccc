import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')          // ## headers
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1') // ***bold italic***
    .replace(/\*\*(.+?)\*\*/g, '$1')      // **bold**
    .replace(/\*(.+?)\*/g, '$1')          // *italic*
    .replace(/^[\s]*[*\-]\s+/gm, '')      // bullet points (* or -)
    .replace(/\*/g, '')                    // any remaining asterisks
    .replace(/`{1,3}[^`]*`{1,3}/g, '')   // inline/block code
    .replace(/\n{3,}/g, '\n\n')           // collapse excess blank lines
    .trim();
}
