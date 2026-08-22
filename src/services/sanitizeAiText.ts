// ─── Repair obviously corrupt characters in generated text ───────────────────
//
// The fast model occasionally emitted a stray CJK character in the middle of a
// Cyrillic word — "историјата живее во絀细", "четири絀 области", "22% масперон".
// It reached the reader inside Smart Quiz verdicts, Study Plan analyses and
// Crisis Room assessments, where it reads as a rendering fault in the app
// rather than a model slip.
//
// Moving those surfaces to the deep model is the actual fix; this is the net
// under it. A model is a probabilistic system and will occasionally emit
// garbage no prompt prevents, and the cost of that garbage is borne entirely
// by the reader.
//
// The rule is deliberately narrow: only a CJK character that is WELDED INTO a
// run of another script is removed. A deliberate one — a kanji quoted in a
// lesson about Japan, standing on its own or between spaces or brackets — is
// left alone, because that is content rather than corruption and this module
// has no business guessing at it.

/** Han, Hiragana, Katakana, Hangul, and the CJK symbol/punctuation blocks. */
const CJK = '\\u3000-\\u303F\\u3040-\\u309F\\u30A0-\\u30FF\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uAC00-\\uD7AF\\uF900-\\uFAFF\\uFF65-\\uFF9F';
/** Letters of the scripts this app actually writes in. */
const LATIN_CYRILLIC = 'A-Za-z\\u00C0-\\u024F\\u0370-\\u03FF\\u0400-\\u04FF';

// A CJK run touching a Latin/Cyrillic letter on either side is corruption:
// no natural text in these six languages welds the scripts inside one word.
const WELDED_AFTER = new RegExp(`([${LATIN_CYRILLIC}])[${CJK}]+`, 'gu');
const WELDED_BEFORE = new RegExp(`[${CJK}]+([${LATIN_CYRILLIC}])`, 'gu');

/**
 * Strip CJK characters fused into Latin or Cyrillic words.
 *
 * Returns the text unchanged when there is nothing welded, so the common case
 * costs one failed regex test and no allocation.
 */
export function stripWeldedScripts(text: string): string {
  if (!text) return text;
  let out = text.replace(WELDED_AFTER, '$1').replace(WELDED_BEFORE, '$1');
  // One pass can leave a character welded on the far side of a run it just
  // shortened ("во絀细四области"), so settle it — bounded, never open-ended.
  for (let i = 0; i < 3 && WELDED_AFTER.test(out); i++) {
    WELDED_AFTER.lastIndex = 0;
    out = out.replace(WELDED_AFTER, '$1').replace(WELDED_BEFORE, '$1');
  }
  WELDED_AFTER.lastIndex = 0;
  return out;
}

/** True when the text carries a script weld — used by tests and diagnostics. */
export function hasWeldedScripts(text: string): boolean {
  WELDED_AFTER.lastIndex = 0;
  WELDED_BEFORE.lastIndex = 0;
  const welded = WELDED_AFTER.test(text) || WELDED_BEFORE.test(text);
  WELDED_AFTER.lastIndex = 0;
  WELDED_BEFORE.lastIndex = 0;
  return welded;
}
