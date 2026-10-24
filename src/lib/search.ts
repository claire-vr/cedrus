import { items } from '@/data/database';
import type { Item } from '@/types/types';

/** Lower-case, no accents, no dashes or punctuation: "Sh-Sheghel?" → "shsheghel". */
export function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[-’'?!.,;:()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Words matching a search in English or Lebanese, including their forms and
 * notes. Best matches first: English that starts with the search, then other
 * English or Lebanese matches, then matches only in a form or note.
 */
export function searchItems(query: string, limit = 60): Item[] {
  const q = normalize(query);
  if (!q) return [];
  const scored: { item: Item; score: number }[] = [];
  for (const item of items) {
    const english = normalize(item.english);
    const lebanese = normalize(item.lebanese);
    let score = 0;
    if (english.startsWith(q) || lebanese.startsWith(q)) score = 3;
    else if (english.includes(q) || lebanese.includes(q)) score = 2;
    else if (
      item.forms.some((form) => normalize(form.lebanese).includes(q)) ||
      normalize(item.notes).includes(q)
    )
      score = 1;
    if (score) scored.push({ item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
