import { examples, items, rules, slugify } from '@/data/database';
import type { Tense, Verb, VerbForm, VerbRule } from '@/types/verbs';

/** The "Verbs" topic of vocabulary.csv, with its tenses from forms.csv. */
export const verbs: Verb[] = items
  .filter((item) => item.topicId === 'verbs')
  .map((item) => ({
    id: slugify(item.english.replace(/^to /, '')),
    english: item.english,
    infinitive: item.lebanese || null,
    forms: [
      // The base form lives in vocabulary.csv; show it at the top of the present.
      ...(item.lebanese
        ? [
            {
              tense: 'present continuous',
              person: 'infinitive',
              lebanese: item.lebanese
            }
          ]
        : []),
      ...item.forms.map((form) => ({
        tense: form.form,
        person: form.person,
        lebanese: form.lebanese
      }))
    ],
    examples: examples
      .filter(
        (example) => example.topic === 'Verbs' && example.item === item.english
      )
      .map((example) => ({
        english: example.english,
        lebanese: example.lebanese,
        reference: example.reference || null
      }))
  }));

export const verbRules: VerbRule[] = rules.filter(
  (rule) => rule.topic === 'Verbs'
);

export const tenseOrder: Tense[] = [
  'present continuous',
  'present perfect',
  'future',
  'imperative',
  'active participle'
];

export const tenseLabels: Record<string, string> = {
  'present continuous': 'Present',
  'present perfect': 'Past',
  future: 'Future',
  imperative: 'Imperative',
  'active participle': 'Active participle'
};

export const tenseDescriptions: Record<string, string> = {
  'present continuous': 'Present continuous: I write, I am writing',
  'present perfect': 'Present perfect: I wrote, I have written',
  future: 'Future: I will write',
  imperative: 'Imperative: Write!',
  'active participle': 'Active participle: the state of the doer'
};

export const personOrder = [
  'infinitive',
  'anaa',
  'enta',
  'ente',
  'huuwe',
  'hiiye',
  'nehna',
  'entoo',
  'henne',
  'male, singular',
  'female, singular',
  'plural'
];

export const personLabels: Record<string, { english: string; hint?: string }> =
  {
    infinitive: { english: 'base form' },
    anaa: { english: 'I' },
    enta: { english: 'you (m)' },
    ente: { english: 'you (f)' },
    huuwe: { english: 'he' },
    hiiye: { english: 'she' },
    nehna: { english: 'we' },
    entoo: { english: 'you (pl)' },
    henne: { english: 'they' },
    'male, singular': { english: 'masculine', hint: 'anaa / enta / huuwe' },
    'female, singular': { english: 'feminine', hint: 'anaa / ente / hiiye' },
    plural: { english: 'plural', hint: 'nehna / entoo / henne' }
  };

/** For possessive forms of prepositions: "with me", "with you (m)" … */
export const objectLabels: Record<string, string> = {
  anaa: 'me',
  enta: 'you (m)',
  ente: 'you (f)',
  huuwe: 'him',
  hiiye: 'her',
  nehna: 'us',
  entoo: 'you (pl)',
  henne: 'them'
};

// Which rules (by their "about" column in rules.csv) belong with which tense.
const ruleTopicsByTense: Record<string, string[]> = {
  'present continuous': [
    'prefix',
    'ente / entoo / henne',
    'alef ma2Suura',
    'infinitive'
  ],
  imperative: ['imperative'],
  'active participle': ['active participle'],
  future: ['kein / kuun']
};

const specialVerbTopics: Record<string, string[]> = {
  want: ['possessive verbs'],
  have: ['possessive verbs', 'kein / kuun'],
  can: ['possessive verbs', 'fii'],
  should: ['leizem'],
  'be-specific-use': ['kein / kuun']
};

export function getVerb(id: string | undefined) {
  return verbs.find((verb) => verb.id === id);
}

export function sortedVerbs() {
  return [...verbs].sort((a, b) =>
    stripTo(a.english).localeCompare(stripTo(b.english))
  );
}

export function stripTo(english: string) {
  return english.replace(/^to /, '');
}

export function tensesOf(verb: Verb): string[] {
  const present = new Set(verb.forms.map((form) => form.tense));
  const known = tenseOrder.filter((tense) => present.has(tense));
  const unknown = [...present].filter(
    (tense) => !tenseOrder.includes(tense as Tense)
  );
  return [...known, ...unknown];
}

export function formsFor(verb: Verb, tense: string): VerbForm[] {
  const rank = (person: string) => {
    const index = personOrder.indexOf(person);
    return index === -1 ? personOrder.length : index;
  };
  return verb.forms
    .filter((form) => form.tense === tense)
    .sort((a, b) => rank(a.person) - rank(b.person));
}

/** Persons with a conjugated form in the present (excluding the base form). */
export function conjugatedCount(verb: Verb) {
  return verb.forms.filter(
    (form) =>
      form.tense === 'present continuous' && form.person !== 'infinitive'
  ).length;
}

export function rulesFor(verb: Verb): VerbRule[] {
  const topics = new Set([
    ...tensesOf(verb).flatMap((tense) => ruleTopicsByTense[tense] ?? []),
    ...(specialVerbTopics[verb.id] ?? [])
  ]);
  return verbRules.filter((rule) => topics.has(rule.about));
}

export function matchesSearch(verb: Verb, query: string) {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(verb.english).includes(q) ||
    verb.forms.some((form) => normalize(form.lebanese).includes(q))
  );
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
