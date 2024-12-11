import { readFileLines } from "../utils";
import type { NumberMatrix } from "../types";

const dataLines: string[] = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  dataLines.push(line);
});

const data = dataLines.join("");

const mulRegexp = /mul\(([0-9]+),([0-9]+)\)/g;
const doRegexp = /(do\(\)|don't\(\))/g;

const complexRegexp = new RegExp(mulRegexp.source + "|" + doRegexp.source, "g");

function extractAllValidCommands(text: string) {
  return Array.of(text.match(complexRegexp))[0];
}

function extractSimplePairs(text: string) {
  return Array.from(text.matchAll(mulRegexp), (line) => [
    Number(line[1]),
    Number(line[2]),
  ]);
}

function extractComplexPairs(text: string) {
  let doFlag = true;
  return (
    extractAllValidCommands(text)
      ?.filter((val) => {
        if (val.includes("do(")) {
          doFlag = true;
          return false;
        }

        if (val.includes("don't(")) {
          doFlag = false;
          return false;
        }

        return doFlag;
      })
      .flatMap(extractSimplePairs) ?? []
  );
}

function multiplyPairs(pairs: NumberMatrix) {
  return pairs.reduce((acc, val) => acc + val[0] * val[1], 0);
}

const simpleResult = multiplyPairs(extractSimplePairs(data));
const complexResult = multiplyPairs(extractComplexPairs(data));

console.log("Simple total result is", simpleResult);
console.log("Complex total result is", complexResult);
