import { csvRecords } from '@/data/csv';
import type { Example, Item, Rule, Topic } from '@/types/types';

/*
 * All content comes from the CSV files in /database (exported from
 * "Cedrus database.numbers"). Vite bundles them at build time, so there is
 * no import step: edit, export, and the app picks the change up.
 *
 * Files are matched by name prefix, so both "vocabulary.csv" and the
 * "vocabulary-Table 1.csv" that Numbers produces work.
 */
const files = import.meta.glob('/database/*.csv', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

function load(name: string, required: string[]) {
  const matches = Object.keys(files).filter((path) =>
    path.split('/').pop()!.toLowerCase().startsWith(name)
  );
  if (matches.length === 0) {
    throw new Error(`database/${name}.csv is missing`);
  }
  if (matches.length > 1) {
    throw new Error(
      `More than one CSV for "${name}" in /database: ${matches.join(', ')}. Keep only one.`
    );
  }
  return csvRecords(files[matches[0]], required, matches[0]);
}

export function slugify(value: string) {
  return (
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      // Keep letters and digits of any script, so Arabic letters get their own id.
      .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'item'
  );
}

const vocabularyRows = load('vocabulary', ['topic', 'english', 'lebanese']);
const formRows = load('forms', ['item', 'form', 'person', 'lebanese']);
const ruleRows = load('rules', ['topic', 'rule']);
const exampleRows = load('examples', ['topic', 'english', 'lebanese']);

// ---- topics ----
// Order: topics that only have rules (e.g. "Language rules") first, then the
// order in which topics first appear in vocabulary.csv.
const vocabularyTopics = vocabularyRows.map((row) => row.topic).filter(Boolean);
const rulesOnlyTopics = ruleRows
  .map((row) => row.topic)
  .filter((topic) => topic && !vocabularyTopics.includes(topic));
export const topics: Topic[] = [
  ...new Set([...rulesOnlyTopics, ...vocabularyTopics])
].map((name) => ({ id: slugify(name), name }));

// ---- items with their forms ----
const formsByItem = new Map<string, Item['forms']>();
for (const row of formRows) {
  if (!row.item || !row.lebanese) continue;
  const list = formsByItem.get(row.item) ?? [];
  list.push({
    form: row.form.toLowerCase(),
    person: normalizePerson(row.person),
    lebanese: row.lebanese
  });
  formsByItem.set(row.item, list);
}

const usedIds = new Set<string>();
export const items: Item[] = vocabularyRows
  .filter((row) => row.topic && row.english)
  .map((row) => {
    let id = slugify(`${row.topic} ${row.english}`);
    for (let n = 2; usedIds.has(id); n++)
      id = slugify(`${row.topic} ${row.english} ${n}`);
    usedIds.add(id);
    return {
      id,
      topicId: slugify(row.topic),
      topic: row.topic,
      english: row.english,
      lebanese: row.lebanese,
      type: row.type ?? '',
      notes: row.notes ?? '',
      follows: row.follows ?? '',
      forms: formsByItem.get(row.english) ?? []
    };
  });

if (import.meta.env.DEV) {
  const known = new Set(items.map((item) => item.english));
  const orphans = [...formsByItem.keys()].filter((name) => !known.has(name));
  if (orphans.length > 0) {
    console.warn(
      'forms.csv rows whose item is not in vocabulary.csv:',
      orphans
    );
  }
}

// ---- rules and examples ----
export const rules: Rule[] = ruleRows
  .filter((row) => row.rule)
  .map((row, index) => ({
    id: index + 1,
    topic: row.topic,
    about: row.about ?? '',
    text: row.rule
  }));

export const examples: Example[] = exampleRows.map((row) => ({
  topic: row.topic,
  item: row.item ?? '',
  english: row.english,
  lebanese: row.lebanese,
  reference: row.reference ?? ''
}));

// ---- helpers ----
/** The phrase an item answers (its `follows`), if any. */
export function parentOf(item: Item) {
  if (!item.follows) return undefined;
  return items.find(
    (other) => other.topicId === item.topicId && other.english === item.follows
  );
}

export function itemsInTopic(topicId: string | undefined) {
  return items.filter((item) => item.topicId === topicId);
}

export function getTopic(topicId: string | undefined) {
  return topics.find((topic) => topic.id === topicId);
}

export function rulesForTopic(topicName: string) {
  return rules.filter((rule) => rule.topic === topicName);
}

/** Example sentences linked to one word (their `item` is the word's English). */
export function examplesForItem(item: Item) {
  return examples.filter(
    (example) => example.topic === item.topic && example.item === item.english
  );
}

/**
 * Example sentences of a topic that are not linked to one of its words
 * (linked ones are shown under their word instead).
 */
export function examplesForTopic(topicName: string) {
  const words = new Set(
    items.filter((item) => item.topic === topicName).map((item) => item.english)
  );
  return examples.filter(
    (example) => example.topic === topicName && !words.has(example.item)
  );
}

function normalizePerson(person: string) {
  const value = person.trim().toLowerCase();
  const fixes: Record<string, string> = {
    invinitive: 'infinitive',
    ne7na: 'nehna'
  };
  return fixes[value] ?? value;
}
