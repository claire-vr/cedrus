# Cedrus database

Four CSV files hold all of the app's content. Edit them through `Cedrus database.numbers` (one sheet per file), then File → Export To → CSV and copy the files back here. The first row of each file is the header; column order doesn't matter, but the names do.

## vocabulary.csv

One row per word or expression.

| column   | meaning                                                                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| topic    | Section in Browse: Pronouns, Greetings, Questions, Prepositions, Adjectives, Verbs … A new name creates a new topic.                                |
| english  | The question side: English meaning, or Arabic script (a letter, a digit) to be read. For verbs: "to write". Must be unique when the item has forms. |
| lebanese | Lebanese in Latin script. For verbs, the base form (katab).                                                                                         |
| type     | expression, question word, preposition, pronoun, adjective, verb …                                                                                  |
| notes    | Optional remark shown under the word.                                                                                                               |

Anything written in Arabic script in `english` is shown large and asked as the question (Alphabet: ب → baa2; Numbers: ٣ → 3 tleiteh).

The topic "Verbs" opens the verbs section with conjugation tables. Topics appear in Browse in the order they first appear in this file; a topic that only has rules (like "Language rules") is listed first.

## forms.csv

Conjugations and other forms of a vocabulary item, one row per form.

| column   | meaning                                                                                                                                                                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| item     | The `english` of the vocabulary row it belongs to (e.g. "to write", "with").                                                                                                            |
| form     | Verbs: present continuous, present perfect, future, imperative, active participle. Prepositions: possessive. Adjectives: adjective, noun.                                               |
| person   | anaa, enta, ente, huuwe, hiiye, nehna, entoo, henne; "infinitive" for a base form (e.g. the past base raa7); male, singular / female, singular / plural for participles and adjectives. |
| lebanese | The form itself.                                                                                                                                                                        |

## rules.csv

| column | meaning                                                                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| topic  | Topic the rule belongs to (Verbs, Prepositions …). Shown on that topic's page.                                                                                                       |
| about  | Short label. For verbs it links rules to tenses: active participle, imperative, ente / entoo / henne, prefix, infinitive, alef ma2Suura, kein / kuun, possessive verbs, fii, leizem. |
| rule   | The rule text.                                                                                                                                                                       |

## examples.csv

| column    | meaning                                                                        |
| --------- | ------------------------------------------------------------------------------ |
| topic     | Topic the sentence belongs to.                                                 |
| item      | Optional: the vocabulary item it illustrates (verbs show these on their page). |
| english   | English sentence.                                                              |
| lebanese  | Lebanese sentence.                                                             |
| reference | Optional: the form it practises (active participle, infinitive …).             |

## Sources (merged October 2026)

- Cedurs_database.numbers: pronouns, adjectives, verbs, verb rules and examples.
- CALF.pages: every chapter (current spelling with 7 and 2), including its tables, rules and example sentences. Relatives' first names in the family table were left out because the site is public.
- The July CSV extraction and the hand-typed greetings in the app were checked against this; everything in them is included.

Earlier versions are kept in `archive/`.
