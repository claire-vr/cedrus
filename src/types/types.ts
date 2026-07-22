export type Topic = {
  id: string;
  name: string;
};

export type ItemType = 'word' | 'grammar' | 'rule' | 'dialogue';

export type Form = {
  label: string;
  lebanese: string;
};

export type Example = {
  english: string;
  lebanese: string;
};

export type Item = {
  id: string;
  type: ItemType;

  english: string;
  lebanese: string;

  topicId: string;

  notes?: string;
};
