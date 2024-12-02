import { readFileLines } from "../utils";

const dataLeft: number[] = [];
const dataRight: number[] = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const splitLine = line.replace(/  +/g, " ").split(" ");
  dataLeft.push(Number(splitLine[0]));
  dataRight.push(Number(splitLine[1]));
});

dataLeft.sort();
dataRight.sort();

const totalDistance = dataLeft.reduce(
  (acc, currentLeftValue, index) =>
    acc + Math.abs(currentLeftValue - dataRight[index]),
  0
);

const countDict: Record<number, number> = {};

dataRight.forEach((val) => {
  countDict[val] = (countDict[val] ?? 0) + 1;
});

const totalSimilarity = dataLeft.reduce(
  (acc, currentLeftValue) =>
    acc + (countDict[currentLeftValue] ?? 0) * currentLeftValue,
  0
);

console.log("Total distance is", totalDistance);
console.log("Total similarity is", totalSimilarity);
