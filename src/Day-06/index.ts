import { readFileLines } from "../utils";

const dataLines: string[][] = [];

type Direction = -1 | 0 | 1;
const DIRECTION_LIST: [Direction, Direction][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const DIRECTION_SYMBOLS = ["↑", "→", "↓", "←"];
const CROSS_SYMBOL = "+";
const PATH_SYMBOL = "X";
const OBSCURATION_SYMBOL = "#";
const EXTRA_OBSCURATION_SYMBOL = "0";

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const formatLine = line.replace(/  +/g, " ").split("");
  dataLines.push(formatLine);
});

function getStartingPosition(map: string[][]): [number, number] {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "^") return [i, j];
    }
  }

  return undefined;
}

function cloneMap(map: string[][]): string[][] {
  return map.map((arr) => {
    return arr.slice();
  });
}

function move(position: [number, number], direction: [Direction, Direction]) {
  return [position[0] + direction[0], position[1] + direction[1]] as [
    number,
    number
  ];
}

function getSymbol(position: [number, number], map: string[][]) {
  return map[position[0]]?.[position[1]];
}

function setSymbol(
  position: [number, number],
  map: string[][],
  symbol: string
) {
  map[position[0]][position[1]] = symbol;
}

function nextMove(
  position: [number, number],
  direction: [Direction, Direction],
  map: string[][]
) {
  return getSymbol(move(position, direction), map);
}

function calculateFirstResult(map: string[][]) {
  const activeMap = cloneMap(map);
  let position = getStartingPosition(map);
  let directionKey = 0;
  let moveCount = 1; // Start move

  do {
    if (getSymbol(position, activeMap) === ".") {
      setSymbol(position, activeMap, PATH_SYMBOL);
      moveCount++;
    }

    while (
      nextMove(position, DIRECTION_LIST[directionKey], activeMap) ===
      OBSCURATION_SYMBOL
    ) {
      directionKey = (directionKey + 1) % 4;
    }

    position = move(position, DIRECTION_LIST[directionKey]);
  } while (
    nextMove(position, DIRECTION_LIST[directionKey], activeMap) !== undefined
  );

  moveCount++; // Exit move

  return moveCount;
}

function calculateSecondResult(map: string[][]) {
  const startPosition = getStartingPosition(map);
  const startDirection = 0;

  let position = [...startPosition] as [number, number];
  let directionKey = startDirection;

  let loopCount = 0;

  // Loop through obstructions
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if ([i, j].join() !== startPosition.join()) {
        const activeMap = cloneMap(map);
        activeMap[i][j] = EXTRA_OBSCURATION_SYMBOL; // Mark the obstruction

        do {
          const activeSymbol = getSymbol(position, activeMap);

          // Encountering a same position and direction indicates a loop
          if (activeSymbol === DIRECTION_SYMBOLS[directionKey]) {
            loopCount++;
            break;
          }

          // Mark a field with a direction or cross
          setSymbol(
            position,
            activeMap,
            DIRECTION_SYMBOLS.includes(activeSymbol)
              ? CROSS_SYMBOL
              : DIRECTION_SYMBOLS[directionKey]
          );

          while (
            [OBSCURATION_SYMBOL, EXTRA_OBSCURATION_SYMBOL].includes(
              nextMove(position, DIRECTION_LIST[directionKey], activeMap)
            )
          ) {
            directionKey = (directionKey + 1) % 4;
          }

          position = move(position, DIRECTION_LIST[directionKey]);
        } while (
          nextMove(position, DIRECTION_LIST[directionKey], activeMap) !==
          undefined
        );

        // Reset
        position = [...startPosition] as [number, number];
        directionKey = startDirection;
      }
    }
  }
  return loopCount;
}

const resultOne = calculateFirstResult(dataLines);
const resultTwo = calculateSecondResult(dataLines);

console.log("First result is", resultOne);
console.log("Second result is", resultTwo);
