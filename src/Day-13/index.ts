import { readFile } from "../utils";
import { Node } from "../types";

type Claw = { a: Node; b: Node; p: Node };
let dataLines: Claw[] = [];
const BUTTON_A_REGEX = /^Button A: X\+(\d+), Y\+(\d+)$/;
const BUTTON_B_REGEX = /^Button B: X\+(\d+), Y\+(\d+)$/;
const PRIZE_REGEX = /^Prize: X=(\d+), Y=(\d+)$/;
const BUTTON_A_COST = 3;
const BUTTON_B_COST = 1;
const PRICE_INCREASE = 10_000_000_000_000;

await readFile(import.meta.dirname, "./input.txt", (file) => {
  dataLines = file
    .split(/\n\s*\n/)
    .map((block) => block.split("\n"))
    .map((lines) => ({
      a: BUTTON_A_REGEX.exec(lines[0]).slice(1).map(Number) as Node,
      b: BUTTON_B_REGEX.exec(lines[1]).slice(1).map(Number) as Node,
      p: PRIZE_REGEX.exec(lines[2]).slice(1).map(Number) as Node,
    }));
});

function calculate({ a, b, p }: Claw): Node {
  const A = (p[1] * b[0] - p[0] * b[1]) / (a[1] * b[0] - a[0] * b[1]);
  const B = (p[0] - a[0] * A) / b[0];
  return [A, B];
}

function calculateFirstResult(clawData: Claw[]) {
  return clawData
    .map((claw) => calculate(claw))
    .filter(([A, B]) => Number.isInteger(A) && Number.isInteger(B))
    .reduce((acc, [A, B]) => acc + A * BUTTON_A_COST + B * BUTTON_B_COST, 0);
}

function calculateSecondResult(clawData: Claw[]) {
  return clawData
    .map(({ a, b, p }) =>
      calculate({ a, b, p: [p[0] + PRICE_INCREASE, p[1] + PRICE_INCREASE] })
    )
    .filter(([A, B]) => Number.isInteger(A) && Number.isInteger(B))
    .reduce((acc, [A, B]) => acc + A * BUTTON_A_COST + B * BUTTON_B_COST, 0);
}

const firstResult = calculateFirstResult(dataLines);
const secondResult = calculateSecondResult(dataLines);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
