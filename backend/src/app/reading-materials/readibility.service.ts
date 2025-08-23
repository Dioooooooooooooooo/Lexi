// src/readability/readability.service.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReadabilityService {
  // Common abbreviations to avoid false sentence endings
  private static readonly commonAbbreviations = new Set<string>([
    "mr.",
    "mrs.",
    "ms.",
    "dr.",
    "prof.",
    "st.",
    "jr.",
    "sr.",
    "co.",
    "ltd.",
    "inc.",
    "e.g.",
    "i.e.",
    "etc.",
    "vs.",
    "ph.d.",
    "m.d.",
    "b.a.",
    "m.a.",
  ]);

  // Common digraphs and diphthongs that count as one phonetic unit
  private static readonly digraphsAndDiphthongs = new Set<string>([
    "ai",
    "au",
    "ay",
    "ea",
    "ee",
    "ei",
    "eu",
    "ey",
    "ie",
    "oi",
    "oo",
    "ou",
    "oy",
    "ua",
    "ue",
    "ui",
  ]);

  // Special cases for words with non-standard syllable counts
  private static readonly specialCases = new Map<string, number>([
    ["business", 2],
    ["every", 2],
    ["different", 3],
    ["interesting", 3],
    ["evening", 2],
    ["literature", 4],
    ["beautiful", 3],
    ["science", 2],
    ["area", 3],
    ["being", 2],
    ["usually", 3],
    ["create", 2],
    ["average", 3],
    ["experience", 4],
    ["especially", 4],
  ]);

  // Common one-syllable words
  private static readonly commonSingleSyllableWords = new Set<string>([
    "and",
    "the",
    "it",
    "is",
    "was",
    "to",
    "for",
    "that",
    "on",
    "at",
    "with",
    "from",
    "by",
    "as",
    "but",
    "or",
    "nor",
    "yet",
    "so",
    "if",
    "in",
    "out",
    "up",
    "down",
  ]);

  /**
   * Calculates the Flesch Reading Ease score
   * @param content The text to analyze
   * @returns A score between 0 (very difficult) and 100 (very easy)
   */
  calculateFleschScore(content: string): number {
    content = content.toLowerCase();
    if (!content || content.trim().length === 0) {
      return 0;
    }

    const totalSentences = this.countSentences(content);
    const totalWords = this.countWords(content);
    const totalSyllables = this.countSyllables(content);

    if (totalSentences === 0 || totalWords === 0) {
      return 0;
    }

    const averageSentenceLength = totalWords / totalSentences;
    const averageSyllablesPerWord = totalSyllables / totalWords;

    // Flesch Reading Ease formula
    const score =
      206.835 - 1.015 * averageSentenceLength - 84.6 * averageSyllablesPerWord;

    // Ensure score is within bounds
    return Math.round(Math.max(0, Math.min(100, score)) * 10) / 10;
  }

  /**
   * Counts the number of sentences in the text with improved accuracy
   */
  private countSentences(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }

    // Preprocess text to handle abbreviations
    let processedText = text;
    for (const abbr of ReadabilityService.commonAbbreviations) {
      // Replace periods in abbreviations with a temporary marker
      const regex = new RegExp(`\\b${this.escapeRegex(abbr)}\\s`, "gi");
      processedText = processedText.replace(regex, match =>
        match.replace(".", "~"),
      );
    }

    // Count sentence endings (period, exclamation, question mark followed by space or end of string)
    const sentenceEndingRegex = /[.!?]+(?=\s|$)|\n+/g;
    const matches = processedText.match(sentenceEndingRegex);
    let count = matches ? matches.length : 0;

    // Restore original abbreviations
    processedText = processedText.replace(/~/g, ".");

    // If there are words but no sentence endings, count it as at least one sentence
    if (count === 0 && /\w/.test(processedText)) {
      return 1;
    }

    return count;
  }

  /**
   * Extracts and counts words from the text
   */
  private extractWords(text: string): string[] {
    if (!text || text.trim().length === 0) {
      return [];
    }

    // Extract words, handling contractions and possessives properly
    const words: string[] = [];
    const wordRegex = /\b[\w']+\b/g;
    let match: RegExpExecArray | null;

    while ((match = wordRegex.exec(text.toLowerCase())) !== null) {
      const word = match[0].replace(/^'|'$/g, ""); // Remove leading/trailing apostrophes
      if (word && /\w/.test(word)) {
        words.push(word);
      }
    }

    return words;
  }

  /**
   * Counts the number of words in the text
   */
  private countWords(text: string): number {
    return this.extractWords(text).length;
  }

  /**
   * Counts the total syllables in the text
   */
  private countSyllables(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }

    let syllables = 0;
    const words = this.extractWords(text);

    for (const word of words) {
      syllables += this.estimateSyllables(word);
    }

    return syllables;
  }

  /**
   * Estimates the number of syllables in a word with improved accuracy
   */
  private estimateSyllables(word: string): number {
    if (!word || word.length === 0) {
      return 0;
    }

    word = word.toLowerCase().trim();

    // Handle special cases
    const knownSyllables = ReadabilityService.specialCases.get(word);
    if (knownSyllables !== undefined) {
      return knownSyllables;
    }

    // Common single-syllable words
    if (ReadabilityService.commonSingleSyllableWords.has(word)) {
      return 1;
    }

    // Very short words are typically one syllable
    if (word.length <= 3) {
      return 1;
    }

    // Handle common suffixes
    let suffixAdjustment = 0;

    // Handle -es, -ed endings that often don't add syllables
    if (
      (word.endsWith("es") &&
        word.length > 3 &&
        !word.endsWith("ses") &&
        !word.endsWith("zes")) ||
      (word.endsWith("ed") &&
        word.length > 3 &&
        !this.isVowel(word[word.length - 3]))
    ) {
      word = word.substring(0, word.length - 2);
      // No adjustment needed as we're removing a non-syllable
    }

    // Handle -e ending (silent e)
    if (
      word.endsWith("e") &&
      word.length > 2 &&
      !this.isVowel(word[word.length - 2])
    ) {
      word = word.substring(0, word.length - 1);
      // No adjustment needed as we're removing a non-syllable
    }

    // Handle -le ending (usually counts as a syllable)
    if (
      word.endsWith("le") &&
      word.length > 3 &&
      this.isConsonant(word[word.length - 3])
    ) {
      suffixAdjustment = 1;
    }

    // Count vowel groups
    let count = 0;
    let lastWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isCurrentVowel = this.isVowel(word[i]);

      // Check for digraphs and diphthongs (count as one vowel sound)
      if (isCurrentVowel && i < word.length - 1 && this.isVowel(word[i + 1])) {
        const potentialDiphthong = word.substring(i, i + 2);
        if (ReadabilityService.digraphsAndDiphthongs.has(potentialDiphthong)) {
          // Skip the next vowel since we're counting this as one unit
          i++;
        }
      }

      if (isCurrentVowel && !lastWasVowel) {
        count++;
      }

      lastWasVowel = isCurrentVowel;
    }

    // Apply suffix adjustment
    count += suffixAdjustment;

    // Always return at least 1 syllable
    return Math.max(1, count);
  }

  /**
   * Checks if a character is a vowel
   */
  private isVowel(c: string): boolean {
    return "aeiouy".includes(c.toLowerCase());
  }

  /**
   * Checks if a character is a consonant
   */
  private isConsonant(c: string): boolean {
    return /[a-z]/i.test(c) && !this.isVowel(c);
  }

  /**
   * Escapes special regex characters in a string
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
