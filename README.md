# JsonFormatter

A simple command-line tool for formatting and validating JSON files with color highlighting.

## Installation

```bash
npm install -g json-formatter-cli
```

## Usage

Format a JSON file:
```bash
jsonf data.json
```

Compact output:
```bash
jsonf data.json -c
```

Custom indentation:
```bash
jsonf data.json -i 4
```

Disable colors:
```bash
jsonf data.json --no-color
```

Validate JSON only (no formatting):
```bash
jsonf data.json --validate-only
```

Sort object keys alphabetically:
```bash
jsonf data.json -s
```

Read from stdin:
```bash
echo '{"name":"test"}' | jsonf
```

## Features

- ✅ Pretty-print JSON with customizable indentation  
- ✅ Compact JSON output
- ✅ Syntax highlighting with colors
- ✅ JSON validation with helpful error messages
- ✅ stdin support for piped input
- ✅ Validate-only mode for syntax checking
- ✅ Sort object keys alphabetically

## License

MIT