import { readFileLines, cloneMatrix } from "../utils";
import type { Node, StringMatrix } from "../types";

const dataLines: StringMatrix = [];
const ANTINODE_KEY = "#";

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const formatLine = line.replace(/  +/g, " ").split("");
  dataLines.push(formatLine);
});

/** Record where keys are antenna symbols and entries are a list of nodes */
function getNodeCoordinateRecord(map: StringMatrix): Record<string, Node[]> {
  return map.reduce(
    (acc, line, lineIndex) => ({
      ...acc,
      ...line
        .map((node, nodeIndex) => [node, lineIndex, nodeIndex])
        .filter((nodeTuple) => nodeTuple[0] !== ".")
        .reduce(
          (nodeAcc, nodeTuple) => ({
            ...nodeAcc,
            [nodeTuple.at(0)]: [
              ...(acc[nodeTuple.at(0)] ?? []),
              nodeTuple.slice(1),
            ],
          }),
          {}
        ),
    }),
    {}
  );
}

function getNodeDiff(firstNode: Node, secondNode: Node): Node {
  return [secondNode[0] - firstNode[0], secondNode[1] - firstNode[1]];
}

/** Calculate next Node location with the provided step */
function calcNodeLocation(node: Node, diff: Node, step: number): Node {
  return [node.at(0) + step * diff.at(0), node.at(1) + step * diff.at(1)];
}

/** Calculate a list Node location with the provided step with coordinates between 0 and max */
function calcNodeList(
  node: Node,
  diff: Node,
  max: number
): (step: number) => Node[] {
  return (step) => {
    const nodes = [];
    let index = 0;

    while (true) {
      const nextNode = calcNodeLocation(node, diff, index * step);

      if (nextNode.every((n) => n >= 0 && n <= max)) {
        nodes.push(nextNode);
        index++;
      } else {
        break;
      }
    }

    return nodes;
  };
}

/**
 * For each type of antenna iterate thought all nodes and
 * calculate possible anti nodes locations while marking
 * the anti node location on a cloned map to avoid duplicates
 */
function calculateFirstResult(map: StringMatrix) {
  const activeMap = cloneMatrix(map);
  const coordinateRecord = getNodeCoordinateRecord(activeMap);
  const antennas = Object.keys(coordinateRecord);
  let antinodeCount = 0;

  antennas.forEach((antenna) =>
    coordinateRecord[antenna].slice(0, -1).forEach((activeNode, activeIndex) =>
      coordinateRecord[antenna]
        .slice(activeIndex + 1)
        .forEach((compareNode) => {
          const nodeDiff = getNodeDiff(activeNode, compareNode);
          const topAntinode = calcNodeLocation(activeNode, nodeDiff, -1);
          const bottomAntinode = calcNodeLocation(compareNode, nodeDiff, 1);

          [topAntinode, bottomAntinode].forEach((node) => {
            if (
              ![ANTINODE_KEY, undefined].includes(
                activeMap[node.at(0)]?.[node.at(1)]
              )
            ) {
              activeMap[node.at(0)][node.at(1)] = ANTINODE_KEY;
              antinodeCount++;
            }
          });
        })
    )
  );

  return antinodeCount;
}

/**
 * For each type of antenna iterate thought all nodes and
 * calculate possible anti nodes locations and their harmonics while marking
 * the anti node location on a cloned map to avoid duplicates
 */
function calculateSecondResult(map: StringMatrix) {
  const activeMap = cloneMatrix(map);
  const coordinateRecord = getNodeCoordinateRecord(activeMap);
  const antennas = Object.keys(coordinateRecord);
  let antinodeCount = 0;

  antennas.forEach((antenna) =>
    coordinateRecord[antenna].slice(0, -1).forEach((activeNode, activeIndex) =>
      coordinateRecord[antenna]
        .slice(activeIndex + 1)
        .forEach((compareNode) => {
          const nodeDiff = getNodeDiff(activeNode, compareNode);
          const calcFunc = calcNodeList(activeNode, nodeDiff, map.length - 1);
          const topAntinodeList = calcFunc(-1);
          const bottomAntinodeList = calcFunc(1);

          [...topAntinodeList, ...bottomAntinodeList].forEach((node) => {
            if (activeMap[node.at(0)][node.at(1)] !== ANTINODE_KEY) {
              activeMap[node.at(0)][node.at(1)] = ANTINODE_KEY;
              antinodeCount++;
            }
          });
        })
    )
  );

  return antinodeCount;
}

const firstResult = calculateFirstResult(dataLines);
const secondResult = calculateSecondResult(dataLines);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
