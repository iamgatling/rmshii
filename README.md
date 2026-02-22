# rmshii

A lightning-fast CLI tool to strip out unwanted comments and emojis from AI-generated code.

Because nobody has the time to manually delete `// Here is your updated function! 🚀✨` 50 times a day.

## Installation

You don't even need to install it to use it! The easiest way is to run it on-the-fly using `npx`:

```bash
npx rmshii [options] [target]
```

Or, if you find yourself using it constantly, install it globally:

```bash
npm install -g rmshii
```

(If installed globally, you can just type `rmshii` instead of `npx rmshii`)

## Usage

By default, rmshii targets the current directory if no path is provided. It recursively scans folders and safely ignores node_modules and hidden directories (like .git).

### Options

- `-c, --comments` : Remove code comments (single and multi-line)
- `-e, --emoji` : Remove all emojis
- `-a, --all` : Remove both comments and emojis
- `-V, --version` : Output the current version
- `-h, --help` : Display help for command

### Examples

Clean all comments in the current directory:

```bash
npx rmshii -c
```

Clean only emojis in a specific folder (src/):

```bash
npx rmshii -e src/
```

Nuke both comments and emojis in a single file:

```bash
npx rmshii -a app.js
```

## Supported File Types

rmshii currently supports cleaning the following file extensions:

- .js, .jsx
- .ts, .tsx
- .py
- .html
- .css

## License

ISC
