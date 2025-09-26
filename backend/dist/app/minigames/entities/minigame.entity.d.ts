import { ChoicesObject } from '../dto/create-minigame.dto';
export declare class MinigameEnt {
    part_num: number;
}
export declare class WordsFromLettersGame extends MinigameEnt {
    letters: string[];
    words: string[];
}
export declare class SentenceRearrangementGame extends MinigameEnt {
    correct_answer: string[];
    parts: string[];
    explanation: string;
}
export declare class ChoicesGame extends MinigameEnt {
    question: string;
    choices: ChoicesObject[];
    explanation: string;
}
