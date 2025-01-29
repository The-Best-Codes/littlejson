#!/usr/bin/env node

import { decode, encode } from "@msgpack/msgpack";
import { program } from "commander";
import consola from "consola";
import { readFile, stat, writeFile } from "fs/promises";
import { basename, extname, join } from "path";
import { version } from "../package.json";

program.version(version || "0.0.0");

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

async function getFileSize(filePath: string): Promise<number> {
  const stats = await stat(filePath);
  return stats.size;
}

async function compressFile(inputFile: string, outputFile: string | undefined) {
  try {
    const inputSize = await getFileSize(inputFile);
    consola.debug(`ℹ Compressing ${inputFile}...`);

    const data = await readFile(inputFile, "utf-8");
    const json = JSON.parse(data);
    const compressed = encode(json);

    const defaultOutputFile = `${basename(inputFile, extname(inputFile))}.ljson`;
    const outputPath = outputFile || join(process.cwd(), defaultOutputFile);

    await writeFile(outputPath, compressed);
    const outputSize = await getFileSize(outputPath);

    const percentageChange = ((outputSize - inputSize) / inputSize) * 100;
    const percentageDisplay = Math.abs(percentageChange).toFixed(2);
    consola.success(`Compressed ${inputFile} to ${outputPath}`);
    consola.info(`Original size: ${formatBytes(inputSize)}`);
    consola.info(`Compressed size: ${formatBytes(outputSize)}`);

    if (percentageChange < 0) {
      consola.success(`Compression ratio: ${percentageDisplay}% smaller`);
    } else {
      consola.warn(`Compression ratio: ${percentageDisplay}% (not smaller)`);
    }
  } catch (error: any) {
    consola.error(`Error compressing ${inputFile}: ${error.message}`);
    process.exit(1);
  }
}

async function decompressFile(
  inputFile: string,
  outputFile: string | undefined,
) {
  try {
    const inputSize = await getFileSize(inputFile);
    consola.debug(`ℹ Decompressing ${inputFile}...`);

    const data = await readFile(inputFile);
    const decompressed = decode(data);
    const json = JSON.stringify(decompressed, null, 2);

    const defaultOutputFile = `${basename(inputFile, extname(inputFile))}.json`;
    const outputPath = outputFile || join(process.cwd(), defaultOutputFile);

    await writeFile(outputPath, json);
    const outputSize = await getFileSize(outputPath);

    const percentageChange = ((outputSize - inputSize) / inputSize) * 100;
    const percentageDisplay = Math.abs(percentageChange).toFixed(2);

    consola.success(`Decompressed ${inputFile} to ${outputPath}`);
    consola.info(`Original size: ${formatBytes(inputSize)}`);
    consola.info(`Decompressed size: ${formatBytes(outputSize)}`);
    consola.info(`Size change: ${percentageDisplay}%`);
  } catch (error: any) {
    consola.error(`Error decompressing ${inputFile}: ${error.message}`);
    process.exit(1);
  }
}

program
  .command("compress")
  .argument("<input-file>", "Path to the JSON input file")
  .argument("[output-file]", "Path to the output file")
  .action(async (inputFile, outputFile) => {
    await compressFile(inputFile, outputFile);
  });

program
  .command("decompress")
  .argument("<input-file>", "Path to the ljson input file")
  .argument("[output-file]", "Path to the output file")
  .action(async (inputFile, outputFile) => {
    await decompressFile(inputFile, outputFile);
  });

program.parse();
