export enum MinigameType {
  WordsFromLetters = 'WordsFromLetters',
  SentenceRearrangement = 'SentenceRearrangement',
  Choices = 'Choices',
}

export interface WordsFromLetters {
  letters: string[];
  words: string[];
}

export interface SentenceRearrangement {
  correct_answer: string[];
  parts: string[];
  currentAnswer?: string[];
  explanation: string;
}

type Choice = {
  choice: string;
  answer: boolean;
};

export interface Choices {
  reading_material_id: string;
  question: string;
  choices: Choice[];
  explanation: string;
}

export interface Minigame {
  id: string;
  reading_material_id: string;
  minigame_type: number;
  part_num: number;
  metadata: string;
  max_score: number;
  created_at: string;
}
