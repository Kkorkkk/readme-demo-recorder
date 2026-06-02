# README Demo Recorder

[![CI](https://github.com/Kkorkkk/readme-demo-recorder/actions/workflows/ci.yml/badge.svg)](https://github.com/Kkorkkk/readme-demo-recorder/actions/workflows/ci.yml)

## Overview / 项目说明

English: README Demo Recorder renders or runs small command recipes and turns the result into README-ready terminal transcripts. It helps keep demo blocks consistent, reviewable, and easy to regenerate when a CLI changes.

中文：README Demo Recorder 会渲染或执行小型命令配方，并生成适合放进 README 的终端演示片段。它可以让 CLI 项目的演示块更统一、更容易评审，也方便在命令变化后重新生成。

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
