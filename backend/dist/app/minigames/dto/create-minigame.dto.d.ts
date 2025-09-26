export declare class CreateMinigameDto {
    reading_material_id: string;
    part_num: number;
}
export declare class CreateWordsFromLettersGame extends CreateMinigameDto {
    part_num: number;
    letters: string[];
    words: string[];
}
export declare class ChoicesObject {
    choice: string;
    answer: boolean;
}
export declare class CreateChoicesGame extends CreateMinigameDto {
    question: string;
    choices: ChoicesObject[];
    explanation: string;
}
export declare class CreateSentenceRearrangementGame extends CreateMinigameDto {
    correct_answer: string[];
    parts: string[];
    explanation: string;
}
