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
  correctAnswer?: string[];
  parts: string[];
  explanation: string;
}

type Choice = {
  choice: string;
  answer: boolean;
};

export interface Choices {
  choices: Choice[];
  answer: string;
  explanation: string;
}

export interface Minigame {
  id: string;
  readingMaterialId: string;
  minigameType: MinigameType;
  metaData: string;
  MaxScore: number;
  createdAt: string;
}
