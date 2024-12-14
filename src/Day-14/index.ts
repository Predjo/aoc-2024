import { readFileLines, mod, range, createMatrix } from "../utils";
import { Node, StringMatrix } from "../types";

type Robot = { p: Node; v: Node };
const dataLines: Robot[] = [];

await readFileLines(import.meta.dirname, "./input.txt", (line) => {
  const [px, py, vx, vy] = line
    .replace(/(p=)|(v=)/g, "")
    .replace(" ", ",")
    .split(",")
    .map(Number);

  dataLines.push({
    p: [px, py],
    v: [vx, vy],
  });
});

function move(
  robot: Robot,
  seconds: number,
  width: number,
  height: number
): Node {
  const [x, y] = robot.p;
  const [vx, vy] = robot.v;

  return [mod(x + seconds * vx, width), mod(y + seconds * vy, height)];
}

function getQuadrantIndex(robot: Robot, width: number, height: number): number {
  return (
    (robot.p[0] - Math.floor(width / 2) < 0 ? 0 : 1) +
    (robot.p[1] - Math.floor(height / 2) < 0 ? 0 : 2)
  );
}

function calculateFirstResult(
  data: Robot[],
  seconds: number,
  width: number,
  height: number
) {
  return data
    .map((r) => ({ ...r, p: move(r, seconds, width, height) }))
    .filter(
      (r) =>
        r.p[0] !== Math.floor(width / 2) && r.p[1] !== Math.floor(height / 2)
    )
    .reduce(
      (acc, r) =>
        acc.toSpliced(
          getQuadrantIndex(r, width, height),
          1,
          acc[getQuadrantIndex(r, width, height)] + 1
        ),
      Array(4).fill(0) as number[]
    )
    .reduce((acc, val) => acc * val);
}

/** Plot all positions as stars(*) in a joined string matrix */
function draw(data: Robot[], width: number, height: number): string[] {
  const map = createMatrix(height, width, ".");
  data.forEach((d) => {
    map[d.p[0]][d.p[1]] = "*";
  });
  return map.map((l) => l.join(""));
}

/** Find drawings with continuous string of 8 stars(*) */
function calculateSecondResult(data: Robot[], width: number, height: number) {
  return Array.from(range(10000, 0))
    .map((seconds) => [
      draw(
        data.map((r) => ({ ...r, p: move(r, seconds, width, height) })),
        width,
        height
      ),
      seconds,
    ])
    .filter(([map]: [string[], number]) =>
      map.some((line) => line.includes("*********"))
    )
    .at(0)
    .at(1);
}

const firstResult = calculateFirstResult(dataLines, 100, 101, 103);
const secondResult = calculateSecondResult(dataLines, 101, 103);

console.log("First result is", firstResult);
console.log("Second result is", secondResult);
