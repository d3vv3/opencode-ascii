/**
 * Unicode → ASCII substitution mappings, organised by category.
 * Each entry is a tuple of [unicode, ascii].
 */

export type Category = "punctuation" | "arrows" | "math" | "emojis";

export const PUNCTUATION: Array<[string, string]> = [
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

export const ARROWS: Array<[string, string]> = [
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

export const MATH: Array<[string, string]> = [
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

export const EMOJIS: Array<[string, string]> = [
  // Checkmarks / cross marks
  ["\u2713", ":white_check_mark:"], // check mark ([x])
  ["\u2714", ":white_check_mark:"], // heavy check mark ([x])
  ["\u2611", ":ballot_box_with_check:"], // ballot box with check ([x])
  ["\u2705", ":white_check_mark:"], // white heavy check mark ([done])
  ["\u2717", ":x:"], // ballot x ([!])
  ["\u2718", ":x:"], // heavy ballot x ([!])
  ["\u274C", ":x:"], // cross mark ([!])
  ["\u274E", ":x:"], // cross mark button ([!])
  // Warnings / alerts
  ["\u26A0", ":warning:"], // warning sign ([!])
  ["\u2757", ":exclamation:"], // heavy exclamation mark ornament ([!])
  ["\u2755", ":grey_exclamation:"], // white exclamation mark ornament ([!])
  ["\u26A1", ":zap:"], // high voltage sign ([!])
  // Info / ideas
  ["\u2139", ":information_source:"], // information source ([i])
  ["\u{1F4A1}", ":bulb:"], // light bulb ([i])
  // Stars / rating
  ["\u2B50", ":star:"], // white medium star ([*])
  ["\u{1F31F}", ":star2:"], // glowing star ([*])
  ["\u2605", ":star:"], // black star ([*])
  ["\u2606", ":star:"], // white star ([*])
  // Common emoji sequences
  ["\u{1F525}", ":fire:"], // fire ([fire])
  ["\u{1F680}", ":rocket:"], // rocket ([>>])
  ["\u{1F41B}", ":bug:"], // bug ([bug])
  ["\u{1F41E}", ":beetle:"], // lady beetle ([bug])
  ["\u{1F4DD}", ":memo:"], // memo ([note])
  ["\u270F", ":pencil2:"], // pencil ([note])
  ["\u{1F512}", ":lock:"], // lock ([lock])
  ["\u{1F513}", ":unlock:"], // open lock ([open])
  ["\u{1F4C1}", ":file_folder:"], // file folder ([dir])
  ["\u{1F4C2}", ":open_file_folder:"], // open file folder ([dir])
  ["\u{1F4C4}", ":page_facing_up:"], // page facing up ([file])
  ["\u{1F4C3}", ":page_with_curl:"], // page with curl ([file])
  ["\u{1F44D}", ":+1:"], // thumbs up ([+1])
  ["\u{1F44E}", ":-1:"], // thumbs down ([-1])
  ["\u{1F4AC}", ":speech_balloon:"], // speech balloon ([comment])
  ["\u{1F4E6}", ":package:"], // package ([pkg])
  ["\u{1F517}", ":link:"], // link ([link])
  ["\u{1F6A7}", ":construction:"], // construction sign ([wip])
  ["\u2699", ":gear:"], // gear ([config])
  ["\u{1F527}", ":wrench:"], // wrench ([fix])
  ["\u{1F5D1}", ":wastebasket:"], // wastebasket ([del])
  ["\u{1F310}", ":globe_with_meridians:"], // globe with meridians ([web])
  ["\u{1F4BB}", ":computer:"], // personal computer ([pc])
  ["\u{1F4F1}", ":iphone:"], // mobile phone ([phone])
  ["\u{1F4E7}", ":e-mail:"], // e-mail ([email])
  ["\u{1F4CA}", ":bar_chart:"], // bar chart ([chart])
  ["\u{1F4C8}", ":chart_with_upwards_trend:"], // chart with upwards trend ([up])
  ["\u{1F4C9}", ":chart_with_downwards_trend:"], // chart with downwards trend ([down])
  ["\u2764", ":heart:"], // heavy black heart ([<3])
  ["\u{1F4AF}", ":100:"], // hundred points ([100])
  ["\u{1F44B}", ":wave:"], // waving hand ([wave])
  ["\u{1F91D}", ":handshake:"], // handshake ([deal])
  ["\u{1F4AA}", ":muscle:"], // flexed biceps ([strong])
  ["\u{1F914}", ":thinking:"], // thinking face ([?])
  ["\u{1F644}", ":roll_eyes:"], // face with rolling eyes ([eye-roll])
  ["\u{1F4A5}", ":boom:"], // collision ([boom])
  ["\u{1F389}", ":tada:"], // party popper ([party])
  ["\u{1F3C6}", ":trophy:"], // trophy ([trophy])
  ["\u{1F4B0}", ":moneybag:"], // money bag ([money])
  ["\u231B", ":hourglass:"], // hourglass ([wait])
  ["\u23F3", ":hourglass_flowing_sand:"], // hourglass with flowing sand ([wait])
  ["\u{1F504}", ":arrows_counterclockwise:"], // counterclockwise arrows button ([refresh])
];

export type SubstitutionConfig = {
  punctuation?: boolean;
  arrows?: boolean;
  math?: boolean;
  emojis?: boolean;
};

const DEFAULT_CONFIG: Required<SubstitutionConfig> = {
  punctuation: true,
  arrows: true,
  math: true,
  emojis: true,
};

/**
 * Build a combined substitution map from enabled categories.
 */
export function buildSubstitutions(
  config: SubstitutionConfig = {},
): Array<[string, string]> {
  const resolved = { ...DEFAULT_CONFIG, ...config };
  const entries: Array<[string, string]> = [];
  if (resolved.punctuation) entries.push(...PUNCTUATION);
  if (resolved.arrows) entries.push(...ARROWS);
  if (resolved.math) entries.push(...MATH);
  if (resolved.emojis) entries.push(...EMOJIS);
  return entries;
}

/**
 * Build a compiled RegExp that matches all active unicode characters at once.
 * This is much faster than running replace() N times.
 */
export function buildRegex(substitutions: Array<[string, string]>): RegExp {
  const pattern = substitutions
    .map(([ch]) => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return new RegExp(pattern, "gu");
}

/**
 * Apply substitutions to a string using a pre-built map and regex.
 */
export function applySubstitutions(
  text: string,
  regex: RegExp,
  map: Map<string, string>,
): string {
  return text.replace(regex, (match) => map.get(match) ?? match);
}
