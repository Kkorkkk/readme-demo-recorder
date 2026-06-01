import test from "node:test";
import assert from "node:assert/strict";
import { parseCliArgs, renderTranscript, renderSvg } from "../src/index.js";

test("renders markdown and svg transcripts", () => {
  const md = renderTranscript({ steps: [{ command: "tool --help", output: "Usage" }] });
  assert.match(md, /console/);
  assert.match(renderSvg(md), /<svg/);
});

test("records failing command exits instead of throwing", () => {
  const md = renderTranscript({ steps: [{ command: "node -e 'process.exit(3)'" }] }, true);
  assert.match(md, /# exit 3/);
});

test("validates recipe steps and CLI arguments", () => {
  assert.throws(() => renderTranscript({ steps: [{}] }), /command string/);
  assert.deepEqual(parseCliArgs(["examples/demo.json", "--run"]), { file: "examples/demo.json", run: true, svg: false });
  assert.throws(() => parseCliArgs([]), /Usage:/);
});
