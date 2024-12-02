import { readFileLines } from "../utils";

const data: number[][] = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const splitLine = line.replace(/  +/g, " ").split(" ");
  data.push(splitLine.map((n) => Number(n)));
});

function isSafeLine(line: number[]): boolean {
  const direction = Math.sign(line[0] - line[1]);

  for (let index = 1; index < line.length; index++) {
    const difference = line[index - 1] - line[index];

    const newDirection = Math.sign(difference);
    if (newDirection !== direction) {
      return false;
    }

    const distance = Math.abs(difference);
    if (!distance || distance > 3) {
      return false;
    }
  }

  return true;
}

function isSafeTolerant(line: number[]): boolean {
  if (isSafeLine(line)) {
    return true;
  }

  for (let index = 0; index < line.length; index++) {
    if (isSafeLine(line.slice(0, index).concat(line.slice(index + 1)))) {
      return true;
    }
  }

  return false;
}

const totalSafe = data.reduce(
  (acc, line) => acc + (isSafeLine(line) ? 1 : 0),
  0
);

const totalTolerate = data.reduce(
  (acc, line) => acc + (isSafeTolerant(line) ? 1 : 0),
  0
);

console.log("Total safe reports is", totalSafe);
console.log("Total tolerate reports is", totalTolerate);
