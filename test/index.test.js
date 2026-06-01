import test from "node:test";
import assert from "node:assert/strict";
import { renderTranscript, renderSvg } from "../src/index.js";

test("renders markdown and svg transcripts", () => {
  const md = renderTranscript({ steps: [{ command: "tool --help", output: "Usage" }] });
  assert.match(md, /console/);
  assert.match(renderSvg(md), /<svg/);
});
