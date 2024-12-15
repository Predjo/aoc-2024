import { readFile, getSymbolNode, cloneMatrix, intersection } from "../utils";
import type { StringMatrix, Node, Direction } from "../types";
import { DIRECTION_LIST } from "../constants";

type Move = "^" | ">" | "v" | "<";

const ROBOT_SYMBOL = "@";
const WALL_SYMBOL = "#";
const BOX_SYMBOL = "O";
const EMPTY_SYMBOL = ".";
const DIRECTION_MAP: Record<Move, [Direction, Direction]> = {
  "^": DIRECTION_LIST[0],
  ">": DIRECTION_LIST[1],
  v: DIRECTION_LIST[2],
  "<": DIRECTION_LIST[3],
};
const BOX_LEFT_SYMBOL = "[";
const BOX_RIGHT_SYMBOL = "]";

type Width = 0 | 1;
type Box = { p: Node; w: Width };

const mapData: StringMatrix = [];
let movesData: Move[] = [];

await readFile(import.meta.dirname, "./input.txt", (file) => {
  const parts = file.split(/\n\s*\n/);
  parts
    .at(0)
    .split("\n")
    .forEach((line) => {
      mapData.push(line.split(""));
    });
  movesData = parts.at(1).replace(/\s/g, "").split("") as Move[];
});

function getBoxList(map: StringMatrix, isWide: boolean = false): Box[] {
  const boxList = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === (isWide ? BOX_LEFT_SYMBOL : BOX_SYMBOL))
        boxList.push({ p: [i, j], w: isWide ? 1 : 0 });
    }
  }
  return boxList;
}

function getBoxesInWay(
  [x, y]: Node,
  w: Width,
  [i, j]: [Direction, Direction],
  boxList: Box[]
): Box[] {
  return boxList.filter(
    (b) =>
      !(b.p[0] === x && b.p[1] === y) &&
      b.p[0] === x + i &&
      !!intersection([b.p[1], b.p[1] + b.w], [y + j, y + j + w]).length
  );
}

function canMove(
  [x, y]: Node,
  width: Width,
  [i, j]: [Direction, Direction],
  map: StringMatrix,
  boxList: Box[]
) {
  const [nX, nY] = [x + i, y + j];
  if (map[nX][nY] === WALL_SYMBOL || map[nX][nY + width] === WALL_SYMBOL)
    return false;

  const boxesInWay = getBoxesInWay([x, y], width, [i, j], boxList);

  if (boxesInWay.length) {
    return boxesInWay.reduce(
      (acc, box) => acc && canMove(box.p, box.w, [i, j], map, boxList),
      true
    );
  }

  return true;
}

function moveBoxes(box: Box, [i, j]: [Direction, Direction], boxList: Box[]) {
  const [nX, nY] = [box.p.at(0) + i, box.p.at(1) + j];
  const boxesInWay = getBoxesInWay(box.p, box.w, [i, j], boxList);
  boxesInWay.forEach((b) => moveBoxes(b, [i, j], boxList));
  box.p = [nX, nY];
}

function moveRobot(
  [x, y]: Node,
  [i, j]: [Direction, Direction],
  boxList: Box[]
): Node {
  const [nX, nY] = [x + i, y + j];

  const boxesInWay = getBoxesInWay([x, y], 0, [i, j], boxList);
  boxesInWay.forEach((b) => moveBoxes(b, [i, j], boxList));

  return [nX, nY];
}

const wideSymbolRecord = {
  [ROBOT_SYMBOL]: [ROBOT_SYMBOL, EMPTY_SYMBOL],
  [EMPTY_SYMBOL]: [EMPTY_SYMBOL, EMPTY_SYMBOL],
  [WALL_SYMBOL]: [WALL_SYMBOL, WALL_SYMBOL],
  [BOX_SYMBOL]: [BOX_LEFT_SYMBOL, BOX_RIGHT_SYMBOL],
};

function widenMap(map: StringMatrix): StringMatrix {
  return map.map((line) => line.flatMap((symbol) => wideSymbolRecord[symbol]));
}

function sumBoxCoordinates(boxList: Box[]): number {
  return boxList.reduce((sum, box) => sum + box.p.at(0) * 100 + box.p.at(1), 0);
}

function calculateFirstResult(map: StringMatrix, moveList: Move[]) {
  const clonedMap = cloneMatrix(map);
  const boxList = getBoxList(clonedMap, false);
  let activeNode = getSymbolNode(map, ROBOT_SYMBOL);

  moveList.forEach((move) => {
    if (canMove(activeNode, 0, DIRECTION_MAP[move], clonedMap, boxList))
      activeNode = moveRobot(activeNode, DIRECTION_MAP[move], boxList);
  });

  return sumBoxCoordinates(boxList);
}

function calculateSecondResult(map: StringMatrix, moveList: Move[]) {
  const clonedMap = widenMap(cloneMatrix(map));
  const boxList = getBoxList(clonedMap, true);
  let activeNode = getSymbolNode(clonedMap, ROBOT_SYMBOL);

  moveList.forEach((move) => {
    if (canMove(activeNode, 0, DIRECTION_MAP[move], clonedMap, boxList)) {
      activeNode = moveRobot(activeNode, DIRECTION_MAP[move], boxList);
    }
  });

  return sumBoxCoordinates(boxList);
}

const firstResult = calculateFirstResult(mapData, movesData);
const secondResult = calculateSecondResult(mapData, movesData);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
