export type Tense =
  | 'present continuous'
  | 'present perfect'
  | 'future'
  | 'imperative'
  | 'active participle';

export type VerbForm = {
  tense: Tense | string;
  person: string;
  lebanese: string;
};

export type VerbExample = {
  english: string;
  lebanese: string;
  reference: string | null;
};

export type Verb = {
  id: string;
  english: string;
  infinitive: string | null;
  forms: VerbForm[];
  examples: VerbExample[];
};

export type { Rule as VerbRule } from '@/types/types';
