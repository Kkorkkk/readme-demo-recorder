# README Demo Recorder

[![CI](https://github.com/Kkorkkk/readme-demo-recorder/actions/workflows/ci.yml/badge.svg)](https://github.com/Kkorkkk/readme-demo-recorder/actions/workflows/ci.yml)

Generate README-ready command transcripts from a small recipe.

## Install

```bash
npx readme-demo-recorder examples/demo.json
npm install -g readme-demo-recorder
readme-demo-recorder examples/demo.json
```

## Quick start

```bash
npm install
npm test
node src/index.js examples/demo.json
node src/index.js examples/demo.json --run
```

Without `--run`, expected output in the recipe is rendered. With `--run`, commands execute in the current shell.

## Safety

`--run` executes the commands in the recipe without a shell. Only use it with recipe files you wrote or trust. Failed commands are recorded with an exit code instead of stopping the whole transcript.

Use `--fail-on-error` with `--run` when a README demo should fail CI if any command exits non-zero. Command execution has a 30 second timeout and a bounded output buffer.

## Status

Experimental 0.1 CLI. The tool is small on purpose, with no runtime dependencies. Review generated commands, code, and reports before using them in production workflows.
