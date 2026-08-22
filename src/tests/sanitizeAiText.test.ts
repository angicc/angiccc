import { describe, it, expect } from 'vitest';
import { stripWeldedScripts, hasWeldedScripts } from '@/services/sanitizeAiText';

// The real strings that reached the screen, from the Macedonian Study Plan and
// Smart Quiz verdicts.
describe('stripWeldedScripts', () => {
  it('removes CJK welded into a Cyrillic word', () => {
    expect(stripWeldedScripts('историјата живее во絀细: Крас е богатиот триумвир'))
      .toBe('историјата живее во: Крас е богатиот триумвир');
    expect(stripWeldedScripts('целосно отвора четири絀 области во исто време'))
      .toBe('целосно отвора четири области во исто време');
  });

  it('removes CJK welded on either side', () => {
    expect(stripWeldedScripts('絀细области')).toBe('области');
    expect(stripWeldedScripts('во絀细области')).toBe('вообласти');
  });

  it('leaves deliberate CJK that stands on its own', () => {
    // A lesson about Japan may legitimately quote the script. Corruption is
    // welded into a word; quoted content is not.
    const s = 'The samurai code 武士道 shaped the warrior class.';
    expect(stripWeldedScripts(s)).toBe(s);
    expect(stripWeldedScripts('Бушидо (武士道) е кодекс.')).toBe('Бушидо (武士道) е кодекс.');
  });

  it('leaves clean text untouched in every script the app writes', () => {
    for (const s of [
      'Втора светска војна почна во 1939 година.',
      'Der Zweite Weltkrieg begann 1939.',
      'La Seconde Guerre mondiale a commencé en 1939.',
      'Вторая мировая война началась в 1939 году.',
      '',
    ]) expect(stripWeldedScripts(s)).toBe(s);
  });

  it('detects welds without altering the input', () => {
    expect(hasWeldedScripts('четири絀 области')).toBe(true);
    expect(hasWeldedScripts('武士道 alone')).toBe(false);
    expect(hasWeldedScripts('чисто македонски текст')).toBe(false);
  });

  it('is stable when called twice', () => {
    const once = stripWeldedScripts('во絀细четири絀 области');
    expect(stripWeldedScripts(once)).toBe(once);
  });
});
