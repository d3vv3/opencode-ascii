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
    const rocket = EMOJIS.find(([k]) => k === "🚀");
    expect(rocket).toBeDefined();
    expect(rocket![0]).toBe("🚀");
    expect(rocket![1]).toBe("[>>]");
  });

  it("light bulb emoji 💡 is correctly encoded in EMOJIS", () => {
    const bulb = EMOJIS.find(([k]) => k === "💡");
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
    expect(fromSet.has("—")).toBe(true); // em dash -- PUNCTUATION
    expect(fromSet.has("→")).toBe(true); // arrow ->  ARROWS
    expect(fromSet.has("≠")).toBe(true); // !=        MATH
    expect(fromSet.has("🚀")).toBe(true); // 🚀       EMOJIS
  });

  it("respects punctuation: false", () => {
    const subs = buildSubstitutions({ punctuation: false });
    const fromSet = new Set(subs.map(([k]) => k));
    expect(fromSet.has("—")).toBe(false); // em dash excluded
    expect(fromSet.has("→")).toBe(true); // arrows still in
  });

  it("respects arrows: false", () => {
    const subs = buildSubstitutions({ arrows: false });
    const fromSet = new Set(subs.map(([k]) => k));
    expect(fromSet.has("→")).toBe(false);
    expect(fromSet.has("—")).toBe(true);
  });

  it("respects math: false", () => {
    const subs = buildSubstitutions({ math: false });
    const fromSet = new Set(subs.map(([k]) => k));
    expect(fromSet.has("≠")).toBe(false);
    expect(fromSet.has("—")).toBe(true);
  });

  it("respects emojis: false", () => {
    const subs = buildSubstitutions({ emojis: false });
    const fromSet = new Set(subs.map(([k]) => k));
    expect(fromSet.has("🚀")).toBe(false);
    expect(fromSet.has("—")).toBe(true);
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
    const subs: Array<[string, string]> = [["—", "--"]];
    const regex = buildRegex(subs);
    expect("—".match(regex)).not.toBeNull();
    expect("hello".match(regex)).toBeNull();
  });

  it("matches supplementary plane emoji correctly", () => {
    const subs: Array<[string, string]> = [["🚀", "[>>]"]];
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
    const sub = makeEngine([["—", "--"]]);
    expect(sub("foo — bar")).toBe("foo -- bar");
  });

  it("replaces right arrow", () => {
    const sub = makeEngine([["→", "->"]]);
    expect(sub("go → next")).toBe("go -> next");
  });

  it("replaces not-equal sign", () => {
    const sub = makeEngine([["≠", "!="]]);
    expect(sub("x ≠ y")).toBe("x != y");
  });

  it("replaces rocket emoji (supplementary plane)", () => {
    const sub = makeEngine([["🚀", "[>>]"]]);
    expect(sub("launch 🚀 now")).toBe("launch [>>] now");
  });

  it("replaces multiple different characters in one pass", () => {
    const sub = makeEngine([
      ["—", "--"],
      ["→", "->"],
      ["🚀", "[>>]"],
    ]);
    expect(sub("— → 🚀")).toBe("-- -> [>>]");
  });

  it("leaves unrecognised characters untouched", () => {
    const sub = makeEngine([["—", "--"]]);
    expect(sub("hello world")).toBe("hello world");
  });

  it("handles empty string", () => {
    const sub = makeEngine([["—", "--"]]);
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
    const pairs: Array<[string, string]> = [["—", "--"]];
    const map = new Map<string, string>(pairs);
    const regex = buildRegex(pairs);
    for (let i = 0; i < 5; i++) {
      regex.lastIndex = 0;
      expect(applySubstitutions("a — b", regex, map)).toBe("a -- b");
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

    const input = "dash — arrow → not-equal ≠ rocket 🚀";
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
      ["—", "--"], // em dash
      ["–", "-"], // en dash
      ["…", "..."], // ellipsis
      ["\u201C", '"'], // left double quotation mark (")
      ["\u201D", '"'], // right double quotation mark (")
      ["\u2018", "'"], // left single quotation mark (')
      ["\u2019", "'"], // right single quotation mark (')
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
      ["→", "->"], // rightwards arrow
      ["←", "<-"], // leftwards arrow
      ["↔", "<->"], // left right arrow
      ["⇒", "=>"], // rightwards double arrow
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
      ["≠", "!="], // not equal
      ["≤", "<="], // less-than or equal
      ["≥", ">="], // greater-than or equal
      ["×", "*"], // multiplication
      ["÷", "/"], // division
    ];

    for (const [unicode, ascii] of cases) {
      regex.lastIndex = 0;
      expect(applySubstitutions(unicode, regex, map)).toBe(ascii);
    }
  });
});
