export type Topic = {
  id: string;
  name: string;
};

export type ItemForm = {
  form: string;
  person: string;
  lebanese: string;
};

export type Item = {
  id: string;
  topicId: string;
  topic: string;
  english: string;
  lebanese: string;
  type: string;
  notes: string;
  /** English of the phrase this one answers ("and upon you be peace" follows "peace be upon you"). */
  follows: string;
  /** English of the main word this one belongs to (slow → slowness). */
  related: string;
  forms: ItemForm[];
};

export type Rule = {
  id: number;
  topic: string;
  /** What the rule is about, e.g. "active participle" (the old "Topic" column). */
  about: string;
  text: string;
};

export type Example = {
  topic: string;
  item: string;
  english: string;
  lebanese: string;
  reference: string;
};
