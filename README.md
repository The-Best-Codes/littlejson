# littlejson

**A lightweight CLI for compressing and decompressing JSON files.**

`littlejson` utilizes MessagePack for efficient binary serialization of JSON data, offering potentially significant size reductions for your JSON files.

## Features

- **Compress JSON to LJSON:** Reduces file size using MessagePack binary encoding.
- **Decompress LJSON to JSON:** Restores compressed LJSON files back to readable JSON format.
- **Simple CLI:** Easy-to-use command-line interface with clear instructions.
- **File size analysis:** Provides details about the original size, compressed/decompressed size, and the percentage of change.

## Installation

**Global Installation:**
If you perform a global installation, you can use the `littlejson` command directly instead of running it through `npx`.

```bash
npm install -g littlejson
```

## Usage

### Compressing JSON Files

To compress a JSON file into a `.ljson` file:

```bash
npx littlejson compress <input-file.json> [output-file.ljson]
```

- `<input-file.json>`: The path to your JSON input file.
- `[output-file.ljson]`: (Optional) The desired path for the compressed output file. If not provided, the output file will be named with the same base name as the input but with the `.ljson` extension, saved in the current working directory.

**Example:**

```bash
npx littlejson compress data.json compressed.ljson
# or
npx littlejson compress data.json
```

### Decompressing LJSON Files

To decompress a `.ljson` file back into a `.json` file:

```bash
npx littlejson decompress <input-file.ljson> [output-file.json]
```

- `<input-file.ljson>`: The path to your LJSON input file.
- `[output-file.json]`: (Optional) The desired path for the decompressed output file. If not provided, the output file will be named with the same base name as the input but with the `.json` extension, saved in the current working directory.

**Example:**

```bash
npx littlejson decompress compressed.ljson decompressed.json
# or
npx littlejson decompress compressed.ljson
```

## Output

The CLI provides useful details upon completion:

- Success/error messages
- Original file size
- Compressed/Decompressed file size
- Compression/Size change percentage

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.
