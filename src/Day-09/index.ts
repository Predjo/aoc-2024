import { readFileLines, cloneMatrix } from "../utils";

let dataLines: string[] = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const formatLine = line.replace(/  +/g, " ").split("");
  dataLines = formatLine;
});

function transformDataToBlocks(data: string[]): (number | null)[][] {
  return data.map((val, index) =>
    Array(Number(val)).fill(index % 2 === 0 ? index / 2 : null)
  );
}

function transformDataToList(data: string[]): (number | null)[] {
  return transformDataToBlocks(data).flat();
}

function defragList(data: (number | null)[]): number[] {
  let defragData = data.slice();
  const nullIndexList = data
    .map((d, i) => (d === null ? i : undefined))
    .filter((d) => d !== undefined);
  let nullCount = nullIndexList.length;
  let activeNullIndex = nullIndexList[0];

  while (nullCount > 0 && activeNullIndex < defragData.length) {
    const block = defragData.pop();
    if (block !== null) {
      defragData = defragData.with(activeNullIndex, block);
      nullCount--;
      activeNullIndex = nullIndexList[nullIndexList.length - nullCount];
    }
  }

  return defragData;
}

function defragBlock(data: (number | null)[][]): number[] {
  let defragData = cloneMatrix(data);
  let processedBlockCount = 0;

  while (defragData.length > processedBlockCount) {
    const activeBlockIndex = defragData.length - 1 - processedBlockCount;
    const block = defragData[activeBlockIndex];

    if (!block.includes(null)) {
      const blockSize = block.length;

      const nullBlockWithSpaceIndex = defragData.findIndex(
        (b, i) =>
          i < activeBlockIndex && b.includes(null) && b.length >= blockSize
      );

      if (nullBlockWithSpaceIndex !== -1) {
        const newNullBlockSize =
          defragData[nullBlockWithSpaceIndex].length - blockSize;

        defragData = defragData
          .toSpliced(activeBlockIndex, 1, Array(blockSize).fill(null))
          .toSpliced(
            nullBlockWithSpaceIndex,
            1,
            block,
            Array(newNullBlockSize).fill(null)
          );
      }
    }
    processedBlockCount++;
  }

  return defragData.flat();
}

function calculateFirstResult(data: string[]) {
  return defragList(transformDataToList(data)).reduce(
    (acc, val, i) => acc + val * i
  );
}

function calculateSecondResult(data: string[]) {
  return defragBlock(transformDataToBlocks(data)).reduce(
    (acc, val, index) => acc + index * val,
    0
  );
}

const firstResult = calculateFirstResult(dataLines);
const secondResult = calculateSecondResult(dataLines);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
