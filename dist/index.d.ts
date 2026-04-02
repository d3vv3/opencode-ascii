import type { Plugin } from "@opencode-ai/plugin";
import { type SubstitutionConfig } from "./substitutions";
/**
 * Options accepted by AsciiPlugin.
 *
 * All categories default to `true` (enabled).
 * Set a category to `false` to skip substitution for it.
 *
 * @example
 * // opencode.json — disable emoji and math substitutions
 * {
 *   "plugin": [["opencode-ascii", { "emojis": false, "math": false }]]
 * }
 */
export type AsciiPluginOptions = SubstitutionConfig;
/**
 * AsciiPlugin — substitutes unicode characters with ASCII equivalents
 * in AI responses and file write/edit operations.
 *
 * Covered hooks:
 *  - `experimental.text.complete` : rewrites completed AI text parts
 *  - `tool.execute.before`        : rewrites `write`, `edit`, `multiedit`, and `apply_patch` tool arguments
 */
export declare const AsciiPlugin: Plugin;
export default AsciiPlugin;
