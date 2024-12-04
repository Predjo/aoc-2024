import { readFileLines } from "../utils";

const dataLines: string[][] = [];

const XMAS = "XMAS";
const MAS = "MAS";

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const formatLine = line.split("");
  dataLines.push(formatLine);
});

type Direction = -1 | 0 | 1;

function getMatrixSlice(
  data: string[][],
  verticalIndex: number = 0,
  verticalDirection: Direction = 1,
  horizontalIndex: number = 0,
  horizontalDirection: Direction = 1,
  size: number = 4
): string {
  const slice: string[] = [];
  for (let i = 0; i < size; i++) {
    slice.push(
      data[verticalIndex + verticalDirection * i]?.[
        horizontalIndex + horizontalDirection * i
      ] ?? ""
    );
  }

  return slice.join("");
}

const XMAS_CODES = [XMAS, XMAS.split("").reverse().join("")];
function countXmas(data: string[][]) {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const horizontalSlice = getMatrixSlice(data, i, 0, j - 3, 1);
      if (XMAS_CODES.includes(horizontalSlice)) count++;

      const verticalSlice = getMatrixSlice(data, i - 3, 1, j, 0);
      if (XMAS_CODES.includes(verticalSlice)) count++;

      const diagonalLeftSlice = getMatrixSlice(data, i - 3, 1, j - 3, 1);
      if (XMAS_CODES.includes(diagonalLeftSlice)) count++;

      const diagonalRightSlice = getMatrixSlice(data, i - 3, 1, j + 3, -1);
      if (XMAS_CODES.includes(diagonalRightSlice)) count++;
    }
  }

  return count;
}

const MAS_CODES = [MAS, MAS.split("").reverse().join("")];
function countX(data: string[][]) {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const diagonalLeftSlice = getMatrixSlice(data, i - 1, 1, j - 1, 1, 3);
      const diagonalRightSlice = getMatrixSlice(data, i - 1, 1, j + 1, -1, 3);

      if (
        MAS_CODES.includes(diagonalLeftSlice) &&
        MAS_CODES.includes(diagonalRightSlice)
      ) {
        count++;
      }
    }
  }

  return count;
}

const result = countXmas(dataLines);

const resultX = countX(dataLines);

console.log("Total xmas is", result);
console.log("Total X-mas is", resultX);
