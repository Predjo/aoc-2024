import { readFileLines, range } from "../utils";

let dataLines: number[] = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const formatLine = line.replace(/  +/g, " ").split(" ").map(Number);
  dataLines = formatLine;
});

function cutNum(num: number): [number, number] {
  const string = num.toString();
  return [
    Number(string.slice(0, string.length / 2)),
    Number(string.slice(string.length / 2)),
  ];
}

function blink(data: number[]): number[] {
  return data
    .map((val) => {
      if (val === 0) return 1;
      if (val.toString().length % 2 === 0) return cutNum(val);
      return val * 2024;
    })
    .flat();
}

function blinkCount(values: number[], count: number): number {
  let currentCount = 0;
  let currentCache: Record<number, number> = values.reduce(
    (acc, val) => Object.assign(acc, { [val]: (acc[val] ?? 0) + 1 }),
    {}
  );
  while (currentCount < count) {
    const newCache = {};
    Object.entries(currentCache).forEach(([value, count]) => {
      if (count > 0) {
        const blinkData = blink([Number(value)]);

        blinkData.forEach((val) => {
          newCache[val] = (newCache[val] ?? 0) + count;
        });
      }
    });

    currentCount++;
    currentCache = newCache;
  }

  return Object.values(currentCache).reduce((acc, val) => acc + val, 0);
}

function calculateFirstResult(data: number[]) {
  return blinkCount(data, 25);
}

function calculateSecondResult(data: number[]) {
  return blinkCount(data, 75);
}

const firstResult = calculateFirstResult(dataLines);
const secondResult = calculateSecondResult(dataLines);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
