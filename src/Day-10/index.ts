import { Node, NumberMatrix, readFileLines } from "../utils";
import { DIRECTION_LIST } from "../constants";

const dataLines: NumberMatrix = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const formatLine = line.replace(/  +/g, " ").split("").map(Number);
  dataLines.push(formatLine);
});

function findZeroNodes(map: NumberMatrix): Node[] {
  return map
    .reduce((acc, ln, x) => acc.concat(ln.map((_, y) => [x, y])), [] as Node[])
    .filter(([x, y]) => map[x][y] === 0);
}

function findValidNeighborNodes([x, y]: Node, map: NumberMatrix): Node[] {
  return DIRECTION_LIST.map(([xOff, yOff]) => [x + xOff, y + yOff]).filter(
    ([xN, yN]) => map[xN]?.[yN] === map[x][y] + 1
  ) as Node[];
}

function removeDuplicates(nodes: Node[]): Node[] {
  return nodes.filter((_, i) => {
    return (
      i ===
      nodes.findIndex((n) => {
        return n.join() === nodes[i].join();
      })
    );
  });
}

/** Recursive function to climb valid trails and find peaks */
function climb(node: Node, map: NumberMatrix): Node[] {
  const [x, y] = node;
  if (map[x][y] === 9) {
    return [node];
  }

  return findValidNeighborNodes([x, y], map).reduce(
    (acc, node) => acc.concat(climb(node, map)),
    []
  );
}

function calculateFirstResult(data: NumberMatrix) {
  return findZeroNodes(data).reduce((acc, node) => {
    return acc + removeDuplicates(climb(node, data)).length;
  }, 0);
}

function calculateSecondResult(data: NumberMatrix) {
  return findZeroNodes(data).reduce((acc, node) => {
    return acc + climb(node, data).length;
  }, 0);
}

const firstResult = calculateFirstResult(dataLines);
const secondResult = calculateSecondResult(dataLines);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
