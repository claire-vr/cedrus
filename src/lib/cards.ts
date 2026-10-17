import type { PracticeCard } from '@/components/practice/PracticeSession';
import { items, parentOf } from '@/data/database';
import { formLabel, tenseLabels } from '@/data/verbs';
import type { Item, ItemForm } from '@/types/types';
import type { Verb } from '@/types/verbs';

/** A vocabulary word as a Review card: English → Lebanese. */
export function vocabularyCard(item: Item): PracticeCard {
  return {
    id: item.id,
    prompt: item.english,
    answer: item.lebanese,
    note: item.notes || undefined
  };
}

/**
 * Topics where Review asks only the possessive forms, not the base word:
 * "my door" → beibei, rather than "door" → beib.
 */
const FORMS_ONLY_TOPICS = ['possessive-pronouns'];

/** Forms whose base is the answer for one of them, so only the forms are asked. */
const SAY_TO_FORMS = ['addressee', 'speaker & addressee', 'person'];

/** Forms that get their own Review cards. */
function isPracticeForm(form: ItemForm) {
  return form.form.startsWith('possessive') || SAY_TO_FORMS.includes(form.form);
}

/** English pronouns per person, to build the question of a possessive form. */
const english: Record<string, { my: string; me: string; i: string }> = {
  anaa: { my: 'my', me: 'me', i: 'I' },
  enta: { my: 'your', me: 'you', i: 'you' },
  ente: { my: 'your', me: 'you', i: 'you' },
  huuwe: { my: 'his', me: 'him', i: 'he' },
  hiiye: { my: 'her', me: 'her', i: 'she' },
  nehna: { my: 'our', me: 'us', i: 'we' },
  entoo: { my: 'your', me: 'you', i: 'you' },
  henne: { my: 'their', me: 'them', i: 'they' }
};

/**
 * The English of a possessive form, without giving the Lebanese away:
 * door → "your door", with → "with him", at (someone’s place) → "at my place",
 * for your sake → "for our sake", because (+ person) → "because they".
 */
export function possessiveQuestion(item: Item, person: string) {
  const p = english[person];
  if (!p) return item.english;
  const text = item.english;
  if (item.type === 'noun') return `${p.my} ${text}`;
  if (/\(someone[’']s place\)/.test(text))
    return text.replace(/\(someone[’']s place\)/, `${p.my} place`);
  if (text.includes('(someone)')) return text.replace('(someone)', p.me);
  if (text.includes('(+ person)')) return text.replace('(+ person)', p.i);
  if (/\byour?\b/.test(text))
    return text.replace(/\byour\b/g, p.my).replace(/\byou\b/g, p.me);
  // A preposition: "with" → "with me", keeping a trailing "(destination)" last.
  const match = text.match(/^(.*?)(\s*\([^)]*\))?$/);
  return `${match?.[1] ?? text} ${p.me}${match?.[2] ?? ''}`;
}

/** One form as a Review card. */
function formCard(item: Item, form: ItemForm): PracticeCard {
  const id = `form:${item.id}:${form.form}:${form.person}`;
  if (form.form.startsWith('possessive')) {
    // "your door" in big, "enta" in small; the base word (beib) stays hidden.
    const variant = form.form.match(/\((.+)\)/)?.[1];
    return {
      id,
      prompt: possessiveQuestion(item, form.person),
      cue: variant ? `${form.person} · ${variant}` : form.person,
      answer: form.lebanese
    };
  }
  // Addressee, speaker and person forms: the phrase in big, who it is for in
  // small ("good night" · to a man, "How is … ?" · anaa · I).
  const label = formLabel({ tense: form.form, person: form.person });
  return {
    id,
    prompt: item.english,
    cue:
      form.form === 'person' && label.hint
        ? `${label.main} · ${label.hint}`
        : label.main,
    answer: form.lebanese
  };
}

/**
 * The cards for one word: the word itself, plus one card per possessive,
 * addressee, speaker or person form. Phrases with such forms (to a man / a
 * woman, man to a woman, anaa / enta …) and words in forms-only topics are
 * asked only per form.
 */
function cardsForItem(item: Item): PracticeCard[] {
  if (!item.lebanese) return [];
  const practice = item.forms.filter(isPracticeForm);
  const formsOnly =
    practice.length > 0 &&
    (FORMS_ONLY_TOPICS.includes(item.topicId) ||
      practice.some((form) => SAY_TO_FORMS.includes(form.form)));
  return [
    ...(formsOnly ? [] : [vocabularyCard(item)]),
    ...practice.map((form) => formCard(item, form))
  ];
}

/** The first phrase of a call-and-response chain ("peace be upon you"). */
function rootOf(item: Item): Item {
  const seen = new Set<string>();
  let current = item;
  for (
    let parent = parentOf(current);
    parent && !seen.has(parent.id);
    parent = parentOf(current)
  ) {
    seen.add(current.id);
    current = parent;
  }
  return current;
}

/** Which person an addressee card is for ("form:…:addressee:ente" → ente). */
function addresseeOf(card: PracticeCard) {
  const match = card.id.match(/:addressee:(\w+)$/);
  return match?.[1];
}

/**
 * All Review cards for a set of words. A phrase and its replies (the
 * `follows` column) form a group: they are always asked together, the reply
 * right after the phrase, showing what it answers ("↩ as salamo 3alaykom").
 * When both have addressee forms, they alternate per person: to a man, the
 * reply to a man, to a woman, …
 */
export function reviewCards(words: Item[]): PracticeCard[] {
  const groups = new Map<string, Item[]>();
  for (const item of words) {
    const root = rootOf(item);
    groups.set(root.id, [...(groups.get(root.id) ?? []), item]);
  }
  return [...groups.entries()].flatMap(([rootId, members]) => {
    if (members.length === 1) return cardsForItem(members[0]);
    const perItem = members.map((item) => {
      const parent = parentOf(item);
      const parentCards = parent ? cardsForItem(parent) : [];
      return cardsForItem(item).map((card) => {
        if (!parent) return { ...card, group: `pair:${rootId}` };
        // Show what this reply answers: the matching form, or the base phrase.
        const person = addresseeOf(card);
        const answered =
          parentCards.find((c) => person && addresseeOf(c) === person)
            ?.answer ?? parent.lebanese;
        return {
          ...card,
          group: `pair:${rootId}`,
          context: card.context
            ? `${card.context} · ↩ ${answered}`
            : `↩ ${answered}`
        };
      });
    });
    // Interleave per person when every member is asked per addressee form.
    const people = ['enta', 'ente', 'entoo'];
    const allAddressee = perItem.every(
      (cards) => cards.length > 0 && cards.every((card) => addresseeOf(card))
    );
    if (!allAddressee) return perItem.flat();
    return people.flatMap((person) =>
      perItem.flatMap((cards) =>
        cards.filter((card) => addresseeOf(card) === person)
      )
    );
  });
}

/** Review cards for one topic, or for every topic when no id is given. */
export function topicCards(topicId?: string): PracticeCard[] {
  return reviewCards(
    topicId ? items.filter((item) => item.topicId === topicId) : items
  );
}

/**
 * Every conjugated form of a verb in the chosen tenses as a drill card:
 * "to fail" in big, "Present · huuwe" in small (the base form stays hidden).
 */
export function verbCards(verb: Verb, tenses: string[]): PracticeCard[] {
  return verb.forms
    .filter(
      (form) => tenses.includes(form.tense) && form.person !== 'infinitive'
    )
    .map((form) => {
      const label = formLabel(form);
      const tense = tenseLabels[form.tense] ?? form.tense;
      return {
        id: `verb:${verb.id}:${form.tense}:${form.person}`,
        prompt: verb.english,
        // Participles keep their pronoun hint: "masculine (anaa / enta / huuwe)".
        cue:
          form.tense === 'active participle' && label.hint
            ? `${tense} · ${label.main} (${label.hint})`
            : `${tense} · ${label.main}`,
        answer: form.lebanese
      };
    });
}
