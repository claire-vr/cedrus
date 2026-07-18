export type Topic = {
  id: string;
  name: string;
};

export type Item = {
  id: string;
  type: 'word' | 'grammar' | 'rule' | 'dialogue';
  english: string;
  lebanese: string;
  topicId: string;
  notes?: string;
};
