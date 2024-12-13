import { readFileLines, cloneMatrix, allEqual } from "../utils";
import { StringMatrix, Node, NumberMatrix } from "../types";
import { DIRECTION_LIST } from "../constants";

const dataLines: StringMatrix = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const formatLine = line.replace(/  +/g, " ").split("");
  dataLines.push(formatLine);
});

function getValidNeighbors([x, y]: Node, map: StringMatrix): Node[] {
  return DIRECTION_LIST.map((d) => [d[0] + x, d[1] + y] as Node).filter(
    (n) => map[n[0]]?.[n[1]] === map[x][y]
  );
}

function getNodePerimeters([x, y]: Node, map: StringMatrix): Node[] {
  return DIRECTION_LIST.map((d) => [d[0] + x, d[1] + y] as Node).filter(
    (n) => map[n[0]]?.[n[1]] !== map[x][y]
  );
}

function getNodePerimeterCount(node: Node, map: StringMatrix): number {
  return getNodePerimeters(node, map).length;
}

function getLNodes(node: Node, map: StringMatrix): Node[] {
  return getValidNeighbors(node, map)
    .flatMap((n1, i, arr) => arr.slice(i).map((n2) => [n1, n2]))
    .filter(([n1, n2]) => n1[0] !== n2[0] && n1[0] !== n2[0])
    .map(([n1, n2]) => [
      Math.abs(node[0] - n1[0] - n2[0]),
      Math.abs(node[1] - n1[1] - n2[1]),
    ]);
}

function getInnerCornerCount(node: Node, map: StringMatrix): number {
  return getLNodes(node, map).filter(
    ([x, y]) => map[x][y] !== map[node[0]][node[1]]
  ).length;
}

function getOuterCornerCount(node: Node, map: StringMatrix) {
  const perimeters = getNodePerimeters(node, map);
  if ([4, 0].includes(perimeters.length)) return perimeters.length;
  if ([3, 1].includes(perimeters.length)) return perimeters.length - 1;
  const [[x1, y1], [x2, y2]] = perimeters;
  if (x1 === x2 || y1 === y2) return 0;
  return 1;
}

/** [nodeCount, perimeterCount, cornerCount] */
type Tuple3 = [number, number, number];

/**
 * Recursive function for traversing neighbor nodes of the same type
 * While counting them, their perimeters and their corners
 *  */
function traverseArea(
  node: Node,
  map: StringMatrix,
  record: NumberMatrix
): Tuple3 {
  const [x, y] = node;
  if (record[x][y]) return [0, 0, 0];

  record[x][y] = 1;
  const neighbors = getValidNeighbors(node, map);

  const nodeData: Tuple3 = [
    1,
    getNodePerimeterCount(node, map),
    getOuterCornerCount(node, map) + getInnerCornerCount(node, map),
  ];

  if (!neighbors.length) return nodeData;

  return neighbors
    .filter((n) => !record[n[0]][n[1]])
    .reduce(
      (acc, n) => traverseArea(n, map, record).map((c, i) => c + acc[i]),
      nodeData
    ) as Tuple3;
}

function calculateFirstResult(map: StringMatrix) {
  let count = 0;
  const record = cloneMatrix(map, 0);
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (!record[x][y]) {
        const [area, perimeter] = traverseArea([x, y], map, record);
        count += area * perimeter;
      }
    }
  }

  return count;
}

function calculateSecondResult(map: StringMatrix) {
  let count = 0;
  const record = cloneMatrix(map, 0);
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (!record[x][y]) {
        const [area, , sides] = traverseArea([x, y], map, record);
        count += area * sides;
      }
    }
  }

  return count;
}

const firstResult = calculateFirstResult(dataLines);
const secondResult = calculateSecondResult(dataLines);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
