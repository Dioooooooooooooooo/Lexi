import { ChoicesObject } from '../dto/create-minigame.dto';

export class MinigameEnt {
  part_num: number;
}

export class WordsFromLettersGame extends MinigameEnt {
  letters: string[];
  words: string[];
}

export class SentenceRearrangementGame extends MinigameEnt {
  correct_answer: string[];
  parts: string[];
  explanation: string;
}

export class ChoicesGame extends MinigameEnt {
  question: string;
  choices: ChoicesObject[];
  explanation: string;
}
