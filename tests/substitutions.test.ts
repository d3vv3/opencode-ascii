import { describe, it, expect } from "vitest";
import {
  PUNCTUATION,
  ARROWS,
  MATH,
  EMOJIS,
  buildSubstitutions,
  buildRegex,
  applySubstitutions,
} from "../src/substitutions";

// ---------------------------------------------------------------------------
// Array structure
// ---------------------------------------------------------------------------

describe("substitution arrays", () => {
  it("PUNCTUATION entries are all [string, string] pairs", () => {
    for (const [from, to] of PUNCTUATION) {
      expect(typeof from).toBe("string");
      expect(typeof to).toBe("string");
      expect(from.length).toBeGreaterThan(0);
    }
  });

  it("ARROWS entries are all [string, string] pairs", () => {
    for (const [from, to] of ARROWS) {
      expect(typeof from).toBe("string");
      expect(typeof to).toBe("string");
    }
  });

  it("MATH entries are all [string, string] pairs", () => {
    for (const [from, to] of MATH) {
      expect(typeof from).toBe("string");
      expect(typeof to).toBe("string");
    }
  });

  it("EMOJIS entries are all [string, string] pairs", () => {
    for (const [from, to] of EMOJIS) {
      expect(typeof from).toBe("string");
      expect(typeof to).toBe("string");
    }
  });

  it("EMOJIS emoji codepoints above U+FFFF are single surrogate pairs (not mis-escaped)", () => {
    // Every entry whose 'from' side is a supplementary plane character
    // must have .length === 2 (JS surrogate pair), NOT 3 or more
    // (which would indicate the \uXXXX mis-encoding concatenated extra chars).
    for (const [from] of EMOJIS) {
      const cp = from.codePointAt(0) ?? 0;
      if (cp > 0xffff) {
        // Surrogate pair = 2 UTF-16 code units. A mis-escaped \u1F680 would be
        // \u1F68 (1 unit) + "0" (1 unit) = 2 units but wrong character.
        // So we also verify the codepoint is actually what we expect.
        expect(from.length).toBe(2); // surrogate pair
        // Confirm it round-trips correctly
        expect(String.fromCodePoint(cp)).toBe(from);
      }
    }
  });

  it("rocket emoji 🚀 is correctly encoded in EMOJIS", () => {
    const rocket = EMOJIS.find(([k]) => k === "\u{1F680}");
    expect(rocket).toBeDefined();
    expect(rocket![0]).toBe("🚀");
    expect(rocket![1]).toBe("[>>]");
  });

  it("light bulb emoji 💡 is correctly encoded in EMOJIS", () => {
    const bulb = EMOJIS.find(([k]) => k === "\u{1F4A1}");
    expect(bulb).toBeDefined();
    expect(bulb![0]).toBe("💡");
  });
});

// ---------------------------------------------------------------------------
// buildSubstitutions
// ---------------------------------------------------------------------------

describe("buildSubstitutions", () => {
  it("returns all 4 categories by default (empty config)", () => {
    const subs = buildSubstitutions({});
    const fromSet = new Set(subs.map(([k]) => k));
    // Should contain entries from every category
    expect(fromSet.has("\u2014")).toBe(true); // em dash -- PUNCTUATION
    expect(fromSet.has("\u2192")).toBe(true); // arrow ->  ARROWS
    expect(fromSet.has("\u2260")).toBe(true); // !=        MATH
    expect(fromSet.has("\u{1F680}")).toBe(true); // 🚀    EMOJIS
  });

  it("respects punctuation: false", () => {
    const subs = buildSubstitutions({ punctuation: false });
    const fromSet = new Set(subs.map(([k]) => k));
    expect(fromSet.has("\u2014")).toBe(false); // em dash excluded
    expect(fromSet.has("\u2192")).toBe(true); // arrows still in
  });

  it("respects arrows: false", () => {
    const subs = buildSubstitutions({ arrows: false });
    const fromSet = new Set(subs.map(([k]) => k));
    expect(fromSet.has("\u2192")).toBe(false);
    expect(fromSet.has("\u2014")).toBe(true);
  });

  it("respects math: false", () => {
    const subs = buildSubstitutions({ math: false });
    const fromSet = new Set(subs.map(([k]) => k));
    expect(fromSet.has("\u2260")).toBe(false);
    expect(fromSet.has("\u2014")).toBe(true);
  });

  it("respects emojis: false", () => {
    const subs = buildSubstitutions({ emojis: false });
    const fromSet = new Set(subs.map(([k]) => k));
    expect(fromSet.has("\u{1F680}")).toBe(false);
    expect(fromSet.has("\u2014")).toBe(true);
  });

  it("returns empty array when all categories disabled", () => {
    const subs = buildSubstitutions({
      punctuation: false,
      arrows: false,
      math: false,
      emojis: false,
    });
    expect(subs.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// buildRegex
// ---------------------------------------------------------------------------

describe("buildRegex", () => {
  it("returns a global regex", () => {
    const subs = buildSubstitutions({});
    const regex = buildRegex(subs);
    expect(regex.flags).toContain("g");
  });

  it("matches characters from the substitution set", () => {
    const subs: Array<[string, string]> = [["\u2014", "--"]];
    const regex = buildRegex(subs);
    expect("\u2014".match(regex)).not.toBeNull();
    expect("hello".match(regex)).toBeNull();
  });

  it("matches supplementary plane emoji correctly", () => {
    const subs: Array<[string, string]> = [["\u{1F680}", "[>>]"]];
    const regex = buildRegex(subs);
    expect("launch 🚀 now".match(regex)).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// applySubstitutions
// ---------------------------------------------------------------------------

describe("applySubstitutions", () => {
  function makeEngine(pairs: Array<[string, string]>) {
    const map = new Map<string, string>(pairs);
    const regex = buildRegex(pairs);
    return (text: string) => {
      regex.lastIndex = 0;
      return applySubstitutions(text, regex, map);
    };
  }

  it("replaces em dash with double hyphen", () => {
    const sub = makeEngine([["\u2014", "--"]]);
    expect(sub("foo \u2014 bar")).toBe("foo -- bar");
  });

  it("replaces right arrow", () => {
    const sub = makeEngine([["\u2192", "->"]]);
    expect(sub("go \u2192 next")).toBe("go -> next");
  });

  it("replaces not-equal sign", () => {
    const sub = makeEngine([["\u2260", "!="]]);
    expect(sub("x \u2260 y")).toBe("x != y");
  });

  it("replaces rocket emoji (supplementary plane)", () => {
    const sub = makeEngine([["\u{1F680}", "[>>]"]]);
    expect(sub("launch \u{1F680} now")).toBe("launch [>>] now");
  });

  it("replaces multiple different characters in one pass", () => {
    const sub = makeEngine([
      ["\u2014", "--"],
      ["\u2192", "->"],
      ["\u{1F680}", "[>>]"],
    ]);
    expect(sub("\u2014 \u2192 \u{1F680}")).toBe("-- -> [>>]");
  });

  it("leaves unrecognised characters untouched", () => {
    const sub = makeEngine([["\u2014", "--"]]);
    expect(sub("hello world")).toBe("hello world");
  });

  it("handles empty string", () => {
    const sub = makeEngine([["\u2014", "--"]]);
    expect(sub("")).toBe("");
  });

  it("handles text with no unicode", () => {
    const subs = buildSubstitutions({});
    const map = new Map<string, string>(subs);
    const regex = buildRegex(subs);
    const text = "const x = 'hello world';";
    regex.lastIndex = 0;
    expect(applySubstitutions(text, regex, map)).toBe(text);
  });

  it("handles repeated substitution calls with the same regex (lastIndex reset)", () => {
    const pairs: Array<[string, string]> = [["\u2014", "--"]];
    const map = new Map<string, string>(pairs);
    const regex = buildRegex(pairs);
    for (let i = 0; i < 5; i++) {
      regex.lastIndex = 0;
      expect(applySubstitutions("a \u2014 b", regex, map)).toBe("a -- b");
    }
  });
});

// ---------------------------------------------------------------------------
// Full pipeline (buildSubstitutions -> buildRegex -> applySubstitutions)
// ---------------------------------------------------------------------------

describe("full pipeline", () => {
  it("substitutes all 4 categories in a single text", () => {
    const subs = buildSubstitutions({});
    const map = new Map<string, string>(subs);
    const regex = buildRegex(subs);

    const input = "dash \u2014 arrow \u2192 not-equal \u2260 rocket \u{1F680}";
    regex.lastIndex = 0;
    const result = applySubstitutions(input, regex, map);
    expect(result).toBe("dash -- arrow -> not-equal != rocket [>>]");
  });

  it("PUNCTUATION: covers the most common cases", () => {
    const subs = buildSubstitutions({
      arrows: false,
      math: false,
      emojis: false,
    });
    const map = new Map<string, string>(subs);
    const regex = buildRegex(subs);

    const cases: [string, string][] = [
      ["\u2014", "--"], // em dash
      ["\u2013", "-"], // en dash
      ["\u2026", "..."], // ellipsis
      ["\u201C", '"'], // left double quotation mark
      ["\u201D", '"'], // right double quotation mark
      ["\u2018", "'"], // left single quotation mark
      ["\u2019", "'"], // right single quotation mark
    ];

    for (const [unicode, ascii] of cases) {
      regex.lastIndex = 0;
      expect(applySubstitutions(unicode, regex, map)).toBe(ascii);
    }
  });

  it("ARROWS: covers common arrow characters", () => {
    const subs = buildSubstitutions({
      punctuation: false,
      math: false,
      emojis: false,
    });
    const map = new Map<string, string>(subs);
    const regex = buildRegex(subs);

    const cases: [string, string][] = [
      ["\u2192", "->"], // rightwards arrow
      ["\u2190", "<-"], // leftwards arrow
      ["\u2194", "<->"], // left right arrow
      ["\u21D2", "=>"], // rightwards double arrow
    ];

    for (const [unicode, ascii] of cases) {
      regex.lastIndex = 0;
      expect(applySubstitutions(unicode, regex, map)).toBe(ascii);
    }
  });

  it("MATH: covers key math symbols", () => {
    const subs = buildSubstitutions({
      punctuation: false,
      arrows: false,
      emojis: false,
    });
    const map = new Map<string, string>(subs);
    const regex = buildRegex(subs);

    const cases: [string, string][] = [
      ["\u2260", "!="], // not equal
      ["\u2264", "<="], // less-than or equal
      ["\u2265", ">="], // greater-than or equal
      ["\u00D7", "*"], // multiplication
      ["\u00F7", "/"], // division
    ];

    for (const [unicode, ascii] of cases) {
      regex.lastIndex = 0;
      expect(applySubstitutions(unicode, regex, map)).toBe(ascii);
    }
  });
});
