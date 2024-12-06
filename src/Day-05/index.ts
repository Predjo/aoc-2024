import { readFileLines } from "../utils";

const pageRulesData: [number, number][] = [];
const pageUpdatesData: number[][] = [];

let rulesFlag = true;

await readFileLines(import.meta.dirname, "./input.txt", (line: string) => {
  const formatLine = line.replace(/  +/g, " ");

  if (formatLine === "") {
    rulesFlag = false;
  } else {
    if (rulesFlag) {
      pageRulesData.push(formatLine.split("|").map(Number) as [number, number]);
    } else {
      pageUpdatesData.push(formatLine.split(",").map(Number));
    }
  }
});

function getLineIndexRecord(line: number[]): Record<number, number> {
  return line.reduce((acc, val, index) => ({ ...acc, [val]: index }), {});
}

function isValidLine(line: number[]): (rule: [number, number]) => boolean {
  const lineIndexRecord: Record<number, number> = getLineIndexRecord(line);

  return (rule) => {
    if (
      lineIndexRecord[rule[0]] === undefined ||
      lineIndexRecord[rule[1]] === undefined
    )
      return true;
    return lineIndexRecord[rule[0]] < lineIndexRecord[rule[1]];
  };
}

function fixLine(
  line: number[],
  predecessorRecord: Record<number, number[]>
): number[] {
  return line.toSorted((a, b) => {
    if (predecessorRecord[a]?.includes(b)) return 1;
    if (predecessorRecord[b]?.includes(a)) return -1;
    return 0;
  });
}

function getMiddleValue(dataLine: number[]) {
  return dataLine[Math.floor(dataLine.length / 2)];
}

function calculateFirstResult(
  dataLines: number[][],
  ruleLines: [number, number][]
) {
  return dataLines
    .filter((dataLine) =>
      ruleLines.every((rule) => isValidLine(dataLine)(rule))
    )
    .reduce((acc, val) => acc + getMiddleValue(val), 0);
}

function calculateSecondResult(
  dataLines: number[][],
  ruleLines: [number, number][]
) {
  const rulePredecessorRecord: Record<number, number[]> = ruleLines.reduce(
    (acc, val) => {
      return {
        ...acc,
        [val[1]]: [...(acc[val[1]] || []), val[0]],
      };
    },
    {}
  );

  return dataLines
    .filter((dataLine) =>
      ruleLines.some((rule) => !isValidLine(dataLine)(rule))
    )
    .map((line) => fixLine(line, rulePredecessorRecord))
    .reduce((acc, val) => acc + getMiddleValue(val), 0);
}

const resultOne = calculateFirstResult(pageUpdatesData, pageRulesData);
const resultTwo = calculateSecondResult(pageUpdatesData, pageRulesData);

console.log("First result is", resultOne);
console.log("Second result is", resultTwo);
