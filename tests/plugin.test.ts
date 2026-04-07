import { describe, it, expect, vi } from "vitest";
import AsciiPlugin from "../src/index";
import type { PluginInput, PluginOptions, Hooks } from "@opencode-ai/plugin";

// Minimal stub satisfying the PluginInput type shape used by AsciiPlugin
// (we only need it to not throw; AsciiPlugin ignores _ctx entirely).
const stubInput = {} as unknown as PluginInput;

async function makeHooks(options?: PluginOptions): Promise<Hooks> {
  return AsciiPlugin(stubInput, options);
}

// ---------------------------------------------------------------------------
// experimental.text.complete hook
// ---------------------------------------------------------------------------

describe("experimental.text.complete hook", () => {
  it("substitutes unicode in AI text output", async () => {
    const hooks = await makeHooks();
    const output = {
      text: "The result is ≠ 0 and we use → to indicate flow.",
    };
    await hooks["experimental.text.complete"]?.(
      { sessionID: "s1", messageID: "m1", partID: "p1" },
      output,
    );
    expect(output.text).toBe(
      "The result is != 0 and we use -> to indicate flow.",
    );
  });

  it("substitutes emoji in AI text output", async () => {
    const hooks = await makeHooks();
    const output = { text: "Deployed 🚀 successfully!" };
    await hooks["experimental.text.complete"]?.(
      { sessionID: "s1", messageID: "m1", partID: "p1" },
      output,
    );
    expect(output.text).toBe("Deployed :rocket: successfully!");
  });

  it("leaves plain ASCII unchanged", async () => {
    const hooks = await makeHooks();
    const output = { text: "hello -> world != foo" };
    await hooks["experimental.text.complete"]?.(
      { sessionID: "s1", messageID: "m1", partID: "p1" },
      output,
    );
    expect(output.text).toBe("hello -> world != foo");
  });

  it("skips substitution when emojis disabled", async () => {
    const hooks = await makeHooks({ emojis: false });
    const output = { text: "rocket 🚀 and dash —" };
    await hooks["experimental.text.complete"]?.(
      { sessionID: "s1", messageID: "m1", partID: "p1" },
      output,
    );
    expect(output.text).toBe("rocket 🚀 and dash --"); // emoji kept, dash replaced
  });
});

// ---------------------------------------------------------------------------
// tool.execute.before hook -- write tool
// ---------------------------------------------------------------------------

describe("tool.execute.before: write", () => {
  const baseInput = { tool: "write", sessionID: "s1", callID: "c1" };

  it("substitutes unicode in args.content", async () => {
    const hooks = await makeHooks();
    const output = {
      args: {
        filePath: "/tmp/test.txt",
        content: "value ≠ 0 → result",
      },
    };
    await hooks["tool.execute.before"]?.(baseInput, output);
    expect(output.args.content).toBe("value != 0 -> result");
  });

  it("substitutes emoji in args.content", async () => {
    const hooks = await makeHooks();
    const output = {
      args: { filePath: "/tmp/test.txt", content: "launch 🚀 ready" },
    };
    await hooks["tool.execute.before"]?.(baseInput, output);
    expect(output.args.content).toBe("launch :rocket: ready");
  });

  it("does not modify filePath", async () => {
    const hooks = await makeHooks();
    const output = {
      args: { filePath: "/tmp/test—path.txt", content: "hello" },
    };
    await hooks["tool.execute.before"]?.(baseInput, output);
    // filePath should NOT be touched
    expect(output.args.filePath).toBe("/tmp/test—path.txt");
  });
});

// ---------------------------------------------------------------------------
// tool.execute.before hook -- edit tool
// ---------------------------------------------------------------------------

describe("tool.execute.before: edit", () => {
  const baseInput = { tool: "edit", sessionID: "s1", callID: "c1" };

  it("substitutes unicode in args.newString only", async () => {
    const hooks = await makeHooks();
    const output = {
      args: {
        filePath: "/tmp/test.txt",
        oldString: "old — value", // must NOT be changed (must match file)
        newString: "new — value",
      },
    };
    await hooks["tool.execute.before"]?.(baseInput, output);
    expect(output.args.newString).toBe("new -- value");
    expect(output.args.oldString).toBe("old — value"); // unchanged
  });

  it("substitutes emoji in args.newString", async () => {
    const hooks = await makeHooks();
    const output = {
      args: {
        filePath: "/tmp/f.txt",
        oldString: "x",
        newString: "fire 🔥",
      },
    };
    await hooks["tool.execute.before"]?.(baseInput, output);
    expect(output.args.newString).toBe("fire :fire:");
  });
});

// ---------------------------------------------------------------------------
// tool.execute.before hook -- multiedit tool
// ---------------------------------------------------------------------------

describe("tool.execute.before: multiedit", () => {
  const baseInput = { tool: "multiedit", sessionID: "s1", callID: "c1" };

  it("substitutes unicode in each edit's newString", async () => {
    const hooks = await makeHooks();
    const output = {
      args: {
        filePath: "/tmp/test.txt",
        edits: [
          { oldString: "a — b", newString: "a — b replaced" },
          { oldString: "x", newString: "y → z" },
        ],
      },
    };
    await hooks["tool.execute.before"]?.(baseInput, output);
    expect(output.args.edits[0].newString).toBe("a -- b replaced");
    expect(output.args.edits[1].newString).toBe("y -> z");
  });

  it("does not change oldString in any edit", async () => {
    const hooks = await makeHooks();
    const output = {
      args: {
        filePath: "/tmp/test.txt",
        edits: [
          {
            oldString: "must ≠ change",
            newString: "changed ≠ value",
          },
        ],
      },
    };
    await hooks["tool.execute.before"]?.(baseInput, output);
    expect(output.args.edits[0].oldString).toBe("must ≠ change"); // unchanged
    expect(output.args.edits[0].newString).toBe("changed != value");
  });

  it("handles empty edits array gracefully", async () => {
    const hooks = await makeHooks();
    const output = { args: { filePath: "/tmp/test.txt", edits: [] } };
    await expect(
      hooks["tool.execute.before"]?.(baseInput, output),
    ).resolves.not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// tool.execute.before hook -- apply_patch tool
// ---------------------------------------------------------------------------

describe("tool.execute.before: apply_patch", () => {
  const baseInput = { tool: "apply_patch", sessionID: "s1", callID: "c1" };

  it("substitutes unicode in args.patchText", async () => {
    const hooks = await makeHooks();
    const output = {
      args: {
        patchText:
          "--- a/file.txt\n+++ b/file.txt\n@@ -1 +1 @@\n-old\n+new → value",
      },
    };
    await hooks["tool.execute.before"]?.(baseInput, output);
    expect(output.args.patchText).toContain("+new -> value");
  });

  it("does NOT use args.patch (wrong field name)", async () => {
    // Regression test: old code used args.patch; correct field is args.patchText
    const hooks = await makeHooks();
    const output = { args: { patch: "wrong — field" } };
    await hooks["tool.execute.before"]?.(baseInput, output);
    // args.patch should be untouched; patchText is undefined so nothing happens
    expect(output.args.patch).toBe("wrong — field");
  });
});

// ---------------------------------------------------------------------------
// Unhandled tools -- hook is a no-op for unknown tool IDs
// ---------------------------------------------------------------------------

describe("tool.execute.before: unhandled tools", () => {
  it("does nothing for bash tool", async () => {
    const hooks = await makeHooks();
    const output = { args: { command: "echo —" } };
    await hooks["tool.execute.before"]?.(
      { tool: "bash", sessionID: "s1", callID: "c1" },
      output,
    );
    expect(output.args.command).toBe("echo —"); // unchanged
  });

  it("does nothing for read tool", async () => {
    const hooks = await makeHooks();
    const output = { args: { filePath: "/tmp/file —.txt" } };
    await hooks["tool.execute.before"]?.(
      { tool: "read", sessionID: "s1", callID: "c1" },
      output,
    );
    expect(output.args.filePath).toBe("/tmp/file —.txt"); // unchanged
  });
});

// ---------------------------------------------------------------------------
// Plugin options -- categories disabled
// ---------------------------------------------------------------------------

describe("plugin options", () => {
  it("returns empty hooks when all categories disabled", async () => {
    const hooks = await makeHooks({
      punctuation: false,
      arrows: false,
      math: false,
      emojis: false,
    });
    // Hooks should be empty (no keys registered)
    expect(hooks["experimental.text.complete"]).toBeUndefined();
    expect(hooks["tool.execute.before"]).toBeUndefined();
  });

  it("only applies enabled categories", async () => {
    const hooks = await makeHooks({
      punctuation: true,
      arrows: false,
      math: false,
      emojis: false,
    });
    const output = { text: "dash — arrow → not-equal ≠" };
    await hooks["experimental.text.complete"]?.(
      { sessionID: "s1", messageID: "m1", partID: "p1" },
      output,
    );
    // Only punctuation substituted; arrows and math left alone
    expect(output.text).toBe("dash -- arrow → not-equal ≠");
  });
});
