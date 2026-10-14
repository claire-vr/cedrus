/**
 * Learning progress, saved on this device (localStorage).
 *
 * Every practice card has a stable id (a vocabulary item id, or
 * "verb:<verb>:<tense>:<person>" for the conjugation drill) and a "box":
 * knowing a card moves it up a box, missing it sends it back to box 1.
 * The box decides when the card is due again (spaced repetition).
 */

export type CardProgress = {
  box: number;
  /** When the card should be practised again (ms since epoch). */
  due: number;
  correct: number;
  wrong: number;
  last: number;
};

export type Progress = Record<string, CardProgress>;

const STORAGE_KEY = 'cedrus-progress-v1';
const DAY = 24 * 60 * 60 * 1000;

/** Days until a card is due again, by box (index = box). */
export const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30, 60];
const MAX_BOX = INTERVAL_DAYS.length - 1;
/** From this box on, a card counts as "known". */
export const KNOWN_BOX = 3;

let cache: Progress | null = null;

export function loadProgress(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function save(progress: Progress) {
  cache = progress;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable (private mode): keep it for this session.
  }
}

/** Records an answer and returns the card's new progress. */
export function recordAnswer(
  cardId: string,
  knewIt: boolean,
  now = Date.now()
): CardProgress {
  const progress = { ...loadProgress() };
  const previous = progress[cardId];
  const box = knewIt ? Math.min((previous?.box ?? 0) + 1, MAX_BOX) : 1;
  const updated: CardProgress = {
    box,
    due: knewIt ? now + INTERVAL_DAYS[box] * DAY : now,
    correct: (previous?.correct ?? 0) + (knewIt ? 1 : 0),
    wrong: (previous?.wrong ?? 0) + (knewIt ? 0 : 1),
    last: now
  };
  progress[cardId] = updated;
  save(progress);
  return updated;
}

export type CardStatus = 'new' | 'due' | 'learning' | 'known';

export function statusOf(
  cardId: string,
  progress = loadProgress(),
  now = Date.now()
): CardStatus {
  const card = progress[cardId];
  if (!card) return 'new';
  if (card.due <= now) return 'due';
  return card.box >= KNOWN_BOX ? 'known' : 'learning';
}

export function summarize(cardIds: string[], now = Date.now()) {
  const progress = loadProgress();
  const counts = { new: 0, due: 0, learning: 0, known: 0 };
  for (const id of cardIds) counts[statusOf(id, progress, now)]++;
  return counts;
}

/**
 * Picks the cards for one round: due cards first (most overdue first), then
 * new cards in random order, up to `limit`. If nothing is due or new, it
 * falls back to a random selection so you can always keep practising.
 */
export function pickSession<T extends { id: string }>(
  cards: T[],
  limit = 20,
  now = Date.now()
): { cards: T[]; extra: boolean } {
  const progress = loadProgress();
  const due = cards
    .filter((card) => statusOf(card.id, progress, now) === 'due')
    .sort((a, b) => progress[a.id].due - progress[b.id].due);
  const fresh = shuffle(
    cards.filter((card) => statusOf(card.id, progress, now) === 'new')
  );
  const picked = [...due, ...fresh].slice(0, limit);
  if (picked.length > 0) return { cards: shuffle(picked), extra: false };
  return { cards: shuffle(cards).slice(0, limit), extra: true };
}

/** Fisher–Yates shuffle (unbiased). */
export function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Forget all progress (used by Settings). */
export function resetProgress() {
  save({});
}
