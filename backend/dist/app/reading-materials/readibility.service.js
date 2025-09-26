"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReadabilityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadabilityService = void 0;
const common_1 = require("@nestjs/common");
let ReadabilityService = ReadabilityService_1 = class ReadabilityService {
    calculateFleschScore(content) {
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
        const score = 206.835 - 1.015 * averageSentenceLength - 84.6 * averageSyllablesPerWord;
        return Math.round(Math.max(0, Math.min(100, score)) * 10) / 10;
    }
    countSentences(text) {
        if (!text || text.trim().length === 0) {
            return 0;
        }
        let processedText = text;
        for (const abbr of ReadabilityService_1.commonAbbreviations) {
            const regex = new RegExp(`\\b${this.escapeRegex(abbr)}\\s`, "gi");
            processedText = processedText.replace(regex, match => match.replace(".", "~"));
        }
        const sentenceEndingRegex = /[.!?]+(?=\s|$)|\n+/g;
        const matches = processedText.match(sentenceEndingRegex);
        let count = matches ? matches.length : 0;
        processedText = processedText.replace(/~/g, ".");
        if (count === 0 && /\w/.test(processedText)) {
            return 1;
        }
        return count;
    }
    extractWords(text) {
        if (!text || text.trim().length === 0) {
            return [];
        }
        const words = [];
        const wordRegex = /\b[\w']+\b/g;
        let match;
        while ((match = wordRegex.exec(text.toLowerCase())) !== null) {
            const word = match[0].replace(/^'|'$/g, "");
            if (word && /\w/.test(word)) {
                words.push(word);
            }
        }
        return words;
    }
    countWords(text) {
        return this.extractWords(text).length;
    }
    countSyllables(text) {
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
    estimateSyllables(word) {
        if (!word || word.length === 0) {
            return 0;
        }
        word = word.toLowerCase().trim();
        const knownSyllables = ReadabilityService_1.specialCases.get(word);
        if (knownSyllables !== undefined) {
            return knownSyllables;
        }
        if (ReadabilityService_1.commonSingleSyllableWords.has(word)) {
            return 1;
        }
        if (word.length <= 3) {
            return 1;
        }
        let suffixAdjustment = 0;
        if ((word.endsWith("es") &&
            word.length > 3 &&
            !word.endsWith("ses") &&
            !word.endsWith("zes")) ||
            (word.endsWith("ed") &&
                word.length > 3 &&
                !this.isVowel(word[word.length - 3]))) {
            word = word.substring(0, word.length - 2);
        }
        if (word.endsWith("e") &&
            word.length > 2 &&
            !this.isVowel(word[word.length - 2])) {
            word = word.substring(0, word.length - 1);
        }
        if (word.endsWith("le") &&
            word.length > 3 &&
            this.isConsonant(word[word.length - 3])) {
            suffixAdjustment = 1;
        }
        let count = 0;
        let lastWasVowel = false;
        for (let i = 0; i < word.length; i++) {
            const isCurrentVowel = this.isVowel(word[i]);
            if (isCurrentVowel && i < word.length - 1 && this.isVowel(word[i + 1])) {
                const potentialDiphthong = word.substring(i, i + 2);
                if (ReadabilityService_1.digraphsAndDiphthongs.has(potentialDiphthong)) {
                    i++;
                }
            }
            if (isCurrentVowel && !lastWasVowel) {
                count++;
            }
            lastWasVowel = isCurrentVowel;
        }
        count += suffixAdjustment;
        return Math.max(1, count);
    }
    isVowel(c) {
        return "aeiouy".includes(c.toLowerCase());
    }
    isConsonant(c) {
        return /[a-z]/i.test(c) && !this.isVowel(c);
    }
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
};
exports.ReadabilityService = ReadabilityService;
ReadabilityService.commonAbbreviations = new Set([
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
ReadabilityService.digraphsAndDiphthongs = new Set([
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
ReadabilityService.specialCases = new Map([
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
ReadabilityService.commonSingleSyllableWords = new Set([
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
exports.ReadabilityService = ReadabilityService = ReadabilityService_1 = __decorate([
    (0, common_1.Injectable)()
], ReadabilityService);
//# sourceMappingURL=readibility.service.js.map