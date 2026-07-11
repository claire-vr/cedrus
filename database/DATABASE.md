# Cedrus Database

This folder contains the first Cedrus learning database extracted from `CALF (dragged).pdf`.

The PDF is treated as the source of truth. Spelling, capitalization, punctuation, transliteration, French accents, curly quotes, and ligatures such as `ﬁ` are preserved as extracted.

## Files

- `items.csv`: one row per learning concept or lesson shell.
- `forms.csv`: grammatical or lexical forms for items. Every extracted item has `translation` and, when present, `pronunciation`. Explicit possessive/prepositional forms from the PDF are also stored with forms such as `possessive_1s`, `possessive_2sm`, and `possessive_3p`.
- `examples.csv`: example sentences from the PDF. Examples are attached to the containing lesson item because the PDF presents them as lesson-level example lists rather than linking each sentence to one exact concept.
- `categories.csv`: logical category names extracted from the PDF structure.
- `lessons.csv`: major PDF headings in PDF order.
- `relationships.csv`: explicit containment relationships from lessons to items, plus explicit possessive/prepositional form relationships where the PDF lists forms under a base expression.

## Structure

`items.csv` is the central table. Other tables refer to `items.id` through `item_id`, `from_item`, or `to_item`.

The initial lesson items are:

1. Greetings
2. Questions
3. Prepositions

These IDs are used in `examples.csv` for lesson-level example sentences.

## Assumptions

- Major headings were treated as lessons: `Greetings`, `Questions`, and `Prepositions`.
- The two `Example sentences` headings were treated as sub-sections, not separate lessons.
- Lines under `Example sentences` were stored in `examples.csv`, not as standalone learning items.
- Possessive preposition blocks were represented both as individual items and as forms on their base item.
- `translation` and `pronunciation` are used in `forms.csv` because the requested form examples included those values.
- Categories are a simple controlled list only. No item-category join table was requested, so no mapping table was created.

## Manual Review

Some PDF lines do not contain a machine-readable divider between English and Lebanese columns. Those rows were split conservatively and marked in `items.csv` notes with `Split requires manual review against PDF.` when the split came from manual inspection or remained uncertain. Example rows do not have a notes column, so long example sentences should also be checked against the PDF before bulk import.

Manual review is especially useful for:

- Long lines whose English text contains parentheses near the column boundary.
- Lines containing several alternatives separated by `/`.
- Lines where the PDF combines grammar notes and examples in one visual row.
- The extracted ligature `ﬁ`, which appears in words such as `maﬁ` and `ﬁi` exactly as the PDF text stream provided it.

No missing values were guessed. If no Lebanese value could be separated confidently for an item, the pronunciation form was left blank rather than invented.
