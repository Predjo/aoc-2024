export default function (plop) {
  plop.setGenerator("basics", {
    description: "Create an AOC day folder and scripts",
    prompts: [
      {
        type: "input",
        name: "day",
        message: "What day are you working on?",
      },
    ], // array of inquirer prompts
    actions: [
      {
        type: "add",
        path: "src/Day-{{zeroPadding day}}/index.ts",
        templateFile: ".templates/index.hbs",
      },
      {
        type: "add",
        path: "src/Day-{{zeroPadding day}}/README.md",
        templateFile: ".templates/README.hbs",
      },
      {
        type: "add",
        path: "src/Day-{{zeroPadding day}}/input.txt",
        templateFile: ".templates/input.hbs",
      },
    ],
  });

  plop.setHelper("zeroPadding", function (text) {
    return String(text).padStart(2, "0");
  });
}
