import type { PracticeCard } from '@/components/practice/PracticeSession';
import { items } from '@/data/database';
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

/** One possessive form as a Review card. */
function possessiveCard(item: Item, form: ItemForm): PracticeCard {
  const label = formLabel({ tense: form.form, person: form.person });
  return {
    id: `form:${item.id}:${form.form}:${form.person}`,
    context: `${item.english} · ${item.lebanese}`,
    prompt: label.main,
    cue: label.hint || undefined,
    answer: form.lebanese
  };
}

/**
 * All Review cards for a set of words: each word itself, plus one card per
 * possessive form (prepositions, possessive pronouns). In forms-only topics
 * the word itself is skipped.
 */
export function reviewCards(words: Item[]): PracticeCard[] {
  return words.flatMap((item) => {
    if (!item.lebanese) return [];
    const possessive = item.forms.filter((form) =>
      form.form.startsWith('possessive')
    );
    const base =
      FORMS_ONLY_TOPICS.includes(item.topicId) && possessive.length > 0
        ? []
        : [vocabularyCard(item)];
    return [...base, ...possessive.map((form) => possessiveCard(item, form))];
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
