#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

export function renderTranscript(recipe, run = false) {
  const fence = String.fromCharCode(96, 96, 96);
  const lines = [fence + "console"];
  for (const step of recipe.steps || []) {
    lines.push(`$ ${step.command}`);
    let output = step.output || "";
    if (run) {
      try {
        output = execSync(step.command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      } catch (error) {
        output = `${error.stdout || ""}${error.stderr || ""}`.trimEnd();
        lines.push(`# exit ${error.status ?? 1}`);
      }
    }
    if (output.trim()) lines.push(output.trimEnd());
  }
  lines.push(fence, "");
  return lines.join("\n");
}

export function renderSvg(transcript) {
  const escaped = transcript.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="280"><rect width="100%" height="100%" fill="#111"/><foreignObject x="24" y="24" width="852" height="232"><pre xmlns="http://www.w3.org/1999/xhtml" style="color:#eee;font:15px monospace;white-space:pre-wrap">${escaped}</pre></foreignObject></svg>`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: readme-demo-recorder recipe.json [--run] [--svg]");
    process.exit(1);
  }
  try {
    const transcript = renderTranscript(JSON.parse(readFileSync(file, "utf8")), process.argv.includes("--run"));
    console.log(process.argv.includes("--svg") ? renderSvg(transcript) : transcript);
  } catch (error) {
    console.error(`readme-demo-recorder: ${error.message}`);
    process.exit(2);
  }
}
