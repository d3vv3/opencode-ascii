"use strict";
/**
 * Unicode → ASCII substitution mappings, organised by category.
 * Each entry is a tuple of [unicode, ascii].
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMOJIS = exports.MATH = exports.ARROWS = exports.PUNCTUATION = void 0;
exports.buildSubstitutions = buildSubstitutions;
exports.buildRegex = buildRegex;
exports.applySubstitutions = applySubstitutions;
exports.PUNCTUATION = [
    // Dashes
    ["\u2014", "--"], // em dash (—)
    ["\u2013", "-"], // en dash (–)
    ["\u2012", "-"], // figure dash (‒)
    ["\u2015", "--"], // horizontal bar (―)
    // Ellipsis
    ["\u2026", "..."], // horizontal ellipsis (…)
    // Curly / smart quotes — double
    ["\u201C", '"'], // left double quotation mark (")
    ["\u201D", '"'], // right double quotation mark (")
    ["\u201E", '"'], // double low-9 quotation mark („)
    ["\u201F", '"'], // double high-reversed-9 quotation mark (‟)
    ["\u00AB", '"'], // left-pointing double angle quotation mark («)
    ["\u00BB", '"'], // right-pointing double angle quotation mark (»)
    // Curly / smart quotes — single
    ["\u2018", "'"], // left single quotation mark (')
    ["\u2019", "'"], // right single quotation mark (')
    ["\u201A", "'"], // single low-9 quotation mark (‚)
    ["\u201B", "'"], // single high-reversed-9 quotation mark (‛)
    ["\u2039", "'"], // single left-pointing angle quotation mark (‹)
    ["\u203A", "'"], // single right-pointing angle quotation mark (›)
    // Miscellaneous punctuation
    ["\u2022", "-"], // bullet (•)
    ["\u2023", ">"], // triangular bullet (‣)
    ["\u2043", "-"], // hyphen bullet (⁃)
    ["\u00B7", "."], // middle dot (·)
    ["\u2027", "."], // hyphenation point (‧)
    ["\u2032", "'"], // prime (′)
    ["\u2033", '"'], // double prime (″)
];
exports.ARROWS = [
    ["\u2192", "->"], // rightwards arrow (→)
    ["\u2190", "<-"], // leftwards arrow (←)
    ["\u2191", "^"], // upwards arrow (↑)
    ["\u2193", "v"], // downwards arrow (↓)
    ["\u21D2", "=>"], // rightwards double arrow (⇒)
    ["\u21D0", "<="], // leftwards double arrow (⇐)
    ["\u21D4", "<=>"], // left right double arrow (⇔)
    ["\u2194", "<->"], // left right arrow (↔)
    ["\u21A6", "->"], // rightwards arrow from bar (↦)
    ["\u21A4", "<-"], // leftwards arrow from bar (↤)
    ["\u21E8", "->"], // rightwards white arrow (⇨)
    ["\u21E6", "<-"], // leftwards white arrow (⇦)
    ["\u2B9E", "->"], // black rightwards arrowhead (⮞) – U+2B9E
    ["\u27A1", "->"], // black rightwards arrow (➡)
    ["\u2B05", "<-"], // leftwards black arrow (⬅)
    ["\u2B06", "^"], // upwards black arrow (⬆)
    ["\u2B07", "v"], // downwards black arrow (⬇)
];
exports.MATH = [
    ["\u2260", "!="], // not equal to (≠)
    ["\u2264", "<="], // less-than or equal to (≤)
    ["\u2265", ">="], // greater-than or equal to (≥)
    ["\u00D7", "*"], // multiplication sign (×)
    ["\u00F7", "/"], // division sign (÷)
    ["\u00B1", "+/-"], // plus-minus sign (±)
    ["\u2212", "-"], // minus sign (−)
    ["\u221E", "inf"], // infinity (∞)
    ["\u2248", "~="], // almost equal to (≈)
    ["\u223C", "~"], // tilde operator (∼)
    ["\u221A", "sqrt"], // square root (√)
    ["\u2211", "sum"], // n-ary summation (∑)
    ["\u220F", "prod"], // n-ary product (∏)
    ["\u2202", "d"], // partial differential (∂)
    ["\u2207", "nabla"], // nabla (∇)
    ["\u2208", "in"], // element of (∈)
    ["\u2209", "not in"], // not an element of (∉)
    ["\u2229", "&"], // intersection (∩)
    ["\u222A", "|"], // union (∪)
    ["\u2282", "<="], // subset of (⊂)
    ["\u2283", ">="], // superset of (⊃)
    ["\u2227", "&&"], // logical and (∧)
    ["\u2228", "||"], // logical or (∨)
    ["\u00AC", "!"], // not sign (¬)
    ["\u2234", ":."], // therefore (∴)
    ["\u2235", ":'"], // because (∵)
];
exports.EMOJIS = [
    // Checkmarks / cross marks
    ["\u2713", "[x]"], // check mark (✓)
    ["\u2714", "[x]"], // heavy check mark (✔)
    ["\u2611", "[x]"], // ballot box with check (☑)
    ["\u2705", "[x]"], // white heavy check mark (✅)
    ["\u2717", "[!]"], // ballot x (✗)
    ["\u2718", "[!]"], // heavy ballot x (✘)
    ["\u274C", "[!]"], // cross mark (❌)
    ["\u274E", "[!]"], // cross mark button (❎)
    // Warnings / alerts
    ["\u26A0", "[!]"], // warning sign (⚠)
    ["\u2757", "[!]"], // heavy exclamation mark ornament (❗)
    ["\u2755", "[!]"], // white exclamation mark ornament (❕)
    ["\u26A1", "[!]"], // high voltage sign (⚡)
    // Info / ideas
    ["\u2139", "[i]"], // information source (ℹ)
    ["\u1F4A1", "[i]"], // light bulb (💡)
    // Stars / rating
    ["\u2B50", "[*]"], // white medium star (⭐)
    ["\u1F31F", "[*]"], // glowing star (🌟)
    ["\u2605", "[*]"], // black star (★)
    ["\u2606", "[*]"], // white star (☆)
    // Common emoji sequences
    ["\u1F525", "[fire]"], // fire (🔥)
    ["\u1F680", "[>>]"], // rocket (🚀)
    ["\u1F41B", "[bug]"], // bug (🐛)
    ["\u1F41E", "[bug]"], // lady beetle (🐞)
    ["\u1F4DD", "[note]"], // memo (📝)
    ["\u270F", "[note]"], // pencil (✏)
    ["\u1F512", "[lock]"], // lock (🔒)
    ["\u1F513", "[open]"], // open lock (🔓)
    ["\u1F4C1", "[dir]"], // file folder (📁)
    ["\u1F4C2", "[dir]"], // open file folder (📂)
    ["\u1F4C4", "[file]"], // page facing up (📄)
    ["\u1F4C3", "[file]"], // page with curl (📃)
    ["\u1F44D", "[+1]"], // thumbs up (👍)
    ["\u1F44E", "[-1]"], // thumbs down (👎)
    ["\u1F4AC", "[comment]"], // speech balloon (💬)
    ["\u1F4E6", "[pkg]"], // package (📦)
    ["\u1F517", "[link]"], // link (🔗)
    ["\u1F6A7", "[wip]"], // construction sign (🚧)
    ["\u2699", "[config]"], // gear (⚙)
    ["\u1F527", "[fix]"], // wrench (🔧)
    ["\u1F5D1", "[del]"], // wastebasket (🗑)
    ["\u1F310", "[web]"], // globe with meridians (🌐)
    ["\u1F4BB", "[pc]"], // personal computer (💻)
    ["\u1F4F1", "[phone]"], // mobile phone (📱)
    ["\u1F4E7", "[email]"], // e-mail (📧)
    ["\u1F4CA", "[chart]"], // bar chart (📊)
    ["\u1F4C8", "[up]"], // chart with upwards trend (📈)
    ["\u1F4C9", "[down]"], // chart with downwards trend (📉)
    ["\u2764", "[<3]"], // heavy black heart (❤)
    ["\u1F4AF", "[100]"], // hundred points (💯)
    ["\u1F44B", "[wave]"], // waving hand (👋)
    ["\u1F91D", "[deal]"], // handshake (🤝)
    ["\u1F4AA", "[strong]"], // flexed biceps (💪)
    ["\u1F914", "[?]"], // thinking face (🤔)
    ["\u1F644", "[eye-roll]"], // face with rolling eyes (🙄)
    ["\u1F4A5", "[boom]"], // collision (💥)
    ["\u1F389", "[party]"], // party popper (🎉)
    ["\u1F3C6", "[trophy]"], // trophy (🏆)
    ["\u1F4B0", "[money]"], // money bag (💰)
    ["\u231B", "[wait]"], // hourglass (⌛)
    ["\u23F3", "[wait]"], // hourglass with flowing sand (⏳)
    ["\u1F504", "[refresh]"], // counterclockwise arrows button (🔄)
    ["\u2705", "[done]"], // white heavy check mark (✅) — already above, kept for completeness
];
const DEFAULT_CONFIG = {
    punctuation: true,
    arrows: true,
    math: true,
    emojis: true,
};
/**
 * Build a combined substitution map from enabled categories.
 */
function buildSubstitutions(config = {}) {
    const resolved = { ...DEFAULT_CONFIG, ...config };
    const entries = [];
    if (resolved.punctuation)
        entries.push(...exports.PUNCTUATION);
    if (resolved.arrows)
        entries.push(...exports.ARROWS);
    if (resolved.math)
        entries.push(...exports.MATH);
    if (resolved.emojis)
        entries.push(...exports.EMOJIS);
    return entries;
}
/**
 * Build a compiled RegExp that matches all active unicode characters at once.
 * This is much faster than running replace() N times.
 */
function buildRegex(substitutions) {
    const pattern = substitutions
        .map(([ch]) => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
    return new RegExp(pattern, "gu");
}
/**
 * Apply substitutions to a string using a pre-built map and regex.
 */
function applySubstitutions(text, regex, map) {
    return text.replace(regex, (match) => map.get(match) ?? match);
}
