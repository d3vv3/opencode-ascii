/**
 * Unicode → ASCII substitution mappings, organised by category.
 * Each entry is a tuple of [unicode, ascii].
 */
export type Category = "punctuation" | "arrows" | "math" | "emojis";
export declare const PUNCTUATION: Array<[string, string]>;
export declare const ARROWS: Array<[string, string]>;
export declare const MATH: Array<[string, string]>;
export declare const EMOJIS: Array<[string, string]>;
export type SubstitutionConfig = {
    punctuation?: boolean;
    arrows?: boolean;
    math?: boolean;
    emojis?: boolean;
};
/**
 * Build a combined substitution map from enabled categories.
 */
export declare function buildSubstitutions(config?: SubstitutionConfig): Array<[string, string]>;
/**
 * Build a compiled RegExp that matches all active unicode characters at once.
 * This is much faster than running replace() N times.
 */
export declare function buildRegex(substitutions: Array<[string, string]>): RegExp;
/**
 * Apply substitutions to a string using a pre-built map and regex.
 */
export declare function applySubstitutions(text: string, regex: RegExp, map: Map<string, string>): string;
