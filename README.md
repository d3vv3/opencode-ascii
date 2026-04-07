# opencode-ascii

An [OpenCode](https://opencode.ai) plugin that automatically substitutes unicode characters with ASCII-safe equivalents in AI responses and file edits.

## Why?

LLMs love to reach for typographic characters — em-dashes, curly quotes, arrows, emoji — that look great in a browser but cause friction in terminals, code, config files, and plain-text tooling. This plugin intercepts output at two points:

- **AI text responses** (`experimental.text.complete`) — rewrites text parts before they are stored.
- **File write/edit tool calls** (`tool.execute.before`) — rewrites `write`, `edit`, `multiedit`, and `apply_patch` tool arguments before execution.

## Installation

Add the package to your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-ascii"]
}
```

OpenCode will install the package automatically via Bun at startup.

## Configuration

All four substitution categories are **enabled by default**. Disable any category by passing options:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["opencode-ascii", {
      "punctuation": true,
      "arrows": true,
      "math": true,
      "emojis": false
    }]
  ]
}
```

| Option        | Type    | Default | Description                                  |
|---------------|---------|---------|----------------------------------------------|
| `punctuation` | boolean | `true`  | Em/en dashes, ellipsis, curly/smart quotes   |
| `arrows`      | boolean | `true`  | `→` → `->`, `←` → `<-`, `⇒` → `=>`, etc.  |
| `math`        | boolean | `true`  | `≠` → `!=`, `≤` → `<=`, `×` → `*`, etc.   |
| `emojis`      | boolean | `true`  | Common emoji -> `:shortcode:` labels         |

## Substitution reference

### Punctuation

| Unicode | Character | ASCII |
|---------|-----------|-------|
| U+2014  | — | `--` |
| U+2013  | – | `-` |
| U+2026  | … | `...` |
| U+201C  | " | `"` |
| U+201D  | " | `"` |
| U+2018  | ' | `'` |
| U+2019  | ' | `'` |
| U+00AB  | « | `"` |
| U+00BB  | » | `"` |
| U+2022  | • | `-` |

### Arrows

| Unicode | Character | ASCII |
|---------|-----------|-------|
| U+2192  | → | `->` |
| U+2190  | ← | `<-` |
| U+2191  | ↑ | `^` |
| U+2193  | ↓ | `v` |
| U+21D2  | ⇒ | `=>` |
| U+21D0  | ⇐ | `<=` |
| U+21D4  | ⇔ | `<=>` |
| U+2194  |  | `<->` |

### Math operators

| Unicode | Character | ASCII |
|---------|-----------|-------|
| U+2260  | ≠ | `!=` |
| U+2264  | ≤ | `<=` |
| U+2265  | ≥ | `>=` |
| U+00D7  | × | `*` |
| U+00F7  | ÷ | `/` |
| U+00B1  | ± | `+/-` |
| U+2212  | − | `-` |
| U+221E  | ∞ | `inf` |
| U+2248  | ≈ | `~=` |
| U+221A  | √ | `sqrt` |

### Emojis

| Unicode | Character | ASCII |
|---------|-----------|-------|
| U+2713  | ✓ | `:white_check_mark:` |
| U+274C  | ❌ | `:x:` |
| U+26A0  | ⚠ | `:warning:` |
| U+2139  | ℹ | `:information_source:` |
| U+2B50  | ⭐ | `:star:` |
| U+1F525 | 🔥 | `:fire:` |
| U+1F680 | 🚀 | `:rocket:` |
| U+1F41B | 🐛 | `:bug:` |
| U+1F4DD | 📝 | `:memo:` |
| U+1F512 | 🔒 | `:lock:` |
| U+1F513 | 🔓 | `:unlock:` |
| U+1F4C1 | 📁 | `:file_folder:` |
| U+1F4C4 | 📄 | `:page_facing_up:` |
| U+1F44D | 👍 | `:+1:` |
| U+1F44E | 👎 | `:-1:` |

and many more!

See [`src/substitutions.ts`](src/substitutions.ts) for the full list.

## How it works

The plugin uses two hooks:

1. **`experimental.text.complete`** — fired by OpenCode after each AI text part finishes streaming. The plugin rewrites `output.text` in place before it is persisted.

2. **`tool.execute.before`** — fired before any tool executes. The plugin rewrites:
   - `output.args.content` for the `write` tool
   - `output.args.newString` for the `edit` tool (never `oldString` — it must match existing file content exactly)
   - each `output.args.edits[].newString` for the `multiedit` tool
   - `output.args.patchText` for the `apply_patch` tool

Substitution uses a single compiled regex built from all active mappings, so there is no O(n) string-replace loop per character.

## License

MIT
