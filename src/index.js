#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export function renderTranscript(recipe, run = false) {
  const fence = String.fromCharCode(96, 96, 96);
  const lines = [fence + "console"];
  for (const step of recipe.steps || []) {
    if (!step.command || typeof step.command !== "string") throw new Error("Each step needs a command string.");
    lines.push(`$ ${step.command}`);
    let output = step.output || "";
    if (run) {
      const [cmd, ...args] = splitCommand(step.command);
      const result = spawnSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      output = `${result.stdout || ""}${result.stderr || ""}`.trimEnd();
      if (result.error) {
        output = result.error.message;
        lines.push("# exit 1");
      } else if (result.status !== 0) {
        lines.push(`# exit ${result.status ?? 1}`);
      }
    }
    if (output.trim()) lines.push(output.trimEnd());
  }
  lines.push(fence, "");
  return lines.join("\n");
}

function splitCommand(command) {
  const tokens = [];
  let current = "";
  let quote = null;
  for (let index = 0; index < command.length; index++) {
    const char = command[index];
    if (quote) {
      if (char === "\\") current += command[++index] || "";
      else if (char === quote) quote = null;
      else current += char;
    } else if (char === "'" || char === '"') {
      quote = char;
    } else if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (quote) throw new Error("Unclosed quote in command.");
  if (current) tokens.push(current);
  return tokens;
}

export function renderSvg(transcript) {
  const escaped = transcript.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="280"><rect width="100%" height="100%" fill="#111"/><foreignObject x="24" y="24" width="852" height="232"><pre xmlns="http://www.w3.org/1999/xhtml" style="color:#eee;font:15px monospace;white-space:pre-wrap">${escaped}</pre></foreignObject></svg>`;
}

export function parseCliArgs(args) {
  const file = args.find((arg) => !arg.startsWith("--"));
  if (!file) throw new Error("Usage: readme-demo-recorder recipe.json [--run] [--svg]");
  return { file, run: args.includes("--run"), svg: args.includes("--svg") };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { file, run, svg } = parseCliArgs(process.argv.slice(2));
    const transcript = renderTranscript(JSON.parse(readFileSync(file, "utf8")), run);
    console.log(svg ? renderSvg(transcript) : transcript);
  } catch (error) {
    console.error(`readme-demo-recorder: ${error.message}`);
    process.exit(2);
  }
}
