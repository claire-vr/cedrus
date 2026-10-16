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
 * "door · beib → anaa (me · my)" → beibei, rather than "door" → beib.
 */
const FORMS_ONLY_TOPICS = ['possessive-pronouns'];

/** Forms that get their own Review cards. */
function isPracticeForm(form: ItemForm) {
  return form.form.startsWith('possessive') || form.form === 'addressee';
}

/** One form as a Review card. */
function formCard(item: Item, form: ItemForm): PracticeCard {
  const label = formLabel({ tense: form.form, person: form.person });
  return {
    id: `form:${item.id}:${form.form}:${form.person}`,
    // Possessives show the base word to build from (beib → beibei);
    // addressee phrases don't, since the base already is the answer for a man.
    context:
      form.form === 'addressee'
        ? item.english
        : `${item.english} · ${item.lebanese}`,
    prompt: label.main,
    cue: label.hint || undefined,
    answer: form.lebanese
  };
}

/**
 * The cards for one word: the word itself, plus one card per possessive or
 * addressee form. Phrases with addressee forms (to a man / a woman / a group)
 * and words in forms-only topics are asked only per form.
 */
function cardsForItem(item: Item): PracticeCard[] {
  if (!item.lebanese) return [];
  const practice = item.forms.filter(isPracticeForm);
  const formsOnly =
    practice.length > 0 &&
    (FORMS_ONLY_TOPICS.includes(item.topicId) ||
      practice.some((form) => form.form === 'addressee'));
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

/** Every conjugated form of a verb in the chosen tenses as a drill card. */
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
        context: verb.infinitive
          ? `${verb.english} · ${verb.infinitive}`
          : verb.english,
        prompt: label.main,
        cue: label.hint ? `${label.hint} · ${tense}` : tense,
        answer: form.lebanese
      };
    });
}
