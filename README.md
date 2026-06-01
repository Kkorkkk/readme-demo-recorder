# README Demo Recorder

Generate README-ready command transcripts from a small recipe.

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
