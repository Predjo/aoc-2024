import { readFileLines } from "../utils";
import type { NumberMatrix } from "../types";

const dataLines: NumberMatrix = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const result = line.split(":");
  dataLines.push([
    Number(result.at(0)),
    ...result.at(1).trim().split(" ").map(Number),
  ]);
});

function isDivisor(a: number, b: number) {
  return a % b === 0;
}

function isConcatenated(result: number, operator: number) {
  return new RegExp(`${operator}$`).test(result.toString());
}

function unConcatenate(result: number, operator: number) {
  return Number(result.toString().replace(new RegExp(`${operator}$`), ""));
}

/**
 * Going backwards use recursion to validate a result using reverse operation
 * of sum and mul with remaining operators
 * */
function isValidSimpleEquation(result: number, operators: number[]): boolean {
  if (operators.length < 2) return operators[0] === result;

  const activeOperator = operators.at(-1);
  const remainingOperators = operators.slice(0, -1);

  const operations = [
    isValidSimpleEquation(result - activeOperator, remainingOperators),
  ];

  if (isDivisor(result, activeOperator)) {
    operations.push(
      isValidSimpleEquation(result / activeOperator, remainingOperators)
    );
  }

  return operations.reduce((acc, op) => acc || op, false);
}

/**
 * Going backwards use recursion to validate a result using reverse operation
 * of sum, mul and concatenate and remaining operators
 * */
function isValidComplexEquation(result: number, operators: number[]): boolean {
  if (operators.length < 2) return operators[0] === result;

  const activeOperator = operators.at(-1);
  const remainingOperators = operators.slice(0, -1);

  const operations = [
    isValidComplexEquation(result - activeOperator, remainingOperators),
  ];

  if (isDivisor(result, activeOperator)) {
    operations.push(
      isValidComplexEquation(result / activeOperator, remainingOperators)
    );
  }

  if (isConcatenated(result, activeOperator)) {
    const unConcatenatedResult = unConcatenate(result, activeOperator);
    operations.push(
      isValidComplexEquation(unConcatenatedResult, remainingOperators)
    );
  }

  return operations.reduce((acc, op) => acc || op, false);
}

function calculateFirstResult(dataLines: NumberMatrix) {
  return dataLines
    .filter(([result, ...operators]) =>
      isValidSimpleEquation(result, operators)
    )
    .reduce((sum, [value]) => sum + value, 0);
}

function calculateSecondResult(dataLines: NumberMatrix) {
  return dataLines
    .filter(([result, ...operators]) =>
      isValidComplexEquation(result, operators)
    )
    .reduce((sum, [value]) => sum + value, 0);
}

const firstResult = calculateFirstResult(dataLines);
const secondResult = calculateSecondResult(dataLines);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
