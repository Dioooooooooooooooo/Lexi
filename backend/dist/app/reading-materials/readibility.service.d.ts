export declare class ReadabilityService {
    private static readonly commonAbbreviations;
    private static readonly digraphsAndDiphthongs;
    private static readonly specialCases;
    private static readonly commonSingleSyllableWords;
    calculateFleschScore(content: string): number;
    private countSentences;
    private extractWords;
    private countWords;
    private countSyllables;
    private estimateSyllables;
    private isVowel;
    private isConsonant;
    private escapeRegex;
}
