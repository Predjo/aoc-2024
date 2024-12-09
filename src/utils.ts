import fs from "fs";
import path from "path";
import readline from "readline";

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

export function cloneMatrix<T>(map: T[][]): T[][] {
  return map.map((arr) => {
    return arr.slice();
  });
}
