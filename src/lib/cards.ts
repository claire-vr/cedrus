import type { PracticeCard } from '@/components/practice/PracticeSession';
import { formLabel, tenseLabels } from '@/data/verbs';
import type { Item } from '@/types/types';
import type { Verb } from '@/types/verbs';

/** A vocabulary word as a Review card: English → Lebanese. */
export function vocabularyCard(item: Item): PracticeCard {
  return {
    id: item.id,
    prompt: item.english,
    answer: item.lebanese,
    arabic: item.arabic || undefined,
    note: item.notes || undefined
  };
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
