import fs from "fs";
import path from "path";
import readline from "readline";
import type { Matrix } from "./types";

export async function readFile(
  dirname: string,
  filePath: string,
  fileProcessor: (file: string) => void
) {
  const realPath = path.join(dirname, filePath);
  const file = fs.readFileSync(realPath, "utf8");
  fileProcessor(file);
}

export async function readFileLines(
  dirname: string,
  filePath: string,
  lineProcessor: (line: string) => void
) {
  const realPath = path.join(dirname, filePath);
  const file = readline.createInterface({
    input: fs.createReadStream(realPath),
    output: process.stdout,
    terminal: false,
  });

  for await (const line of file) {
    lineProcessor(line);
  }
}

export function cloneMatrix<T, F = T>(map: Matrix<T>, fill?: F): Matrix<F> {
  return map.map((arr) => {
    return fill !== undefined ? Array(arr.length).fill(fill) : arr.slice();
  });
}

export function* range(to: number, from: number = 0) {
  while (from < to) yield from++;
}

export function allEqual<T>(list: T[]): boolean {
  return list.every((v) => v === list[0]);
}
