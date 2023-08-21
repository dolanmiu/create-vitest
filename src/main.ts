// #!/usr/bin/env
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { createTest } from "./core/create-test";
import fs from "fs";
import inquirer, { InputQuestion, QuestionCollection } from "inquirer";
import chalk from "chalk";

console.log(chalk.bgBlueBright.bold("                                      "));
console.log(chalk.bgBlueBright.bold("   🧪 Welcome to create vitest! 🏗️     "));
console.log("\n");
console.log(
  chalk.green(
    "Generate a vitest test file for a TypeScript file. Scaffold the test and mock all imports"
  )
);
console.log(
  chalk.blue(
    `ℹ️ Note: Every so often, run "npx create-vitest@latest" to update to the latest version. 🍆 `
  )
);
console.log("\n");

const {
  _: [fileName],
} = yargs(hideBin(process.argv)).argv as any;

export type Answers = {
  suffix: string;
  confirm: boolean;
  fileName?: string;
};

const questions: QuestionCollection[] = [
  ...(fileName
    ? []
    : [
        {
          type: "input",
          name: "fileName",
          message:
            "What is the name of the file you want to test? (Relative to current directory)",
          validate: (input) => {
            if (input === "") {
              return "You must specify a file name!";
            }

            if (!/^[a-zA-Z0-9-_]+\.tsx?$/.test(input)) {
              return "The file name must end in .ts or .tsx";
            }
            return true;
          },
        } as InputQuestion,
      ]),
  {
    type: "list",
    name: "suffix",
    message: "What suffix would you like the test to end in?",
    choices: ["spec", "test"],
  },
  {
    type: "confirm",
    name: "confirm",
    message: (a) =>
      `The path of the file is "${
        createFileDetails(fileName ?? a.fileName).filePath
      }". Is this correct?`,
  },
];

const askQuestions = async () => {
  const answers = await inquirer.prompt<Answers>(questions);

  if (!fileName && !answers.fileName) {
    console.log(chalk.red("You must specify a file name!"));
    process.exit(1);
  }

  const { filePath, fileNameWithoutExtension, fileExtension } =
    createFileDetails(fileName ?? answers.fileName);
  const newFileName = `${fileNameWithoutExtension}.${answers.suffix}${fileExtension}`;
  console.log(chalk.green(`Generating ${newFileName}...`));

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const content = await createTest(newFileName, fileContent);
  fs.promises.writeFile(path.join(process.cwd(), newFileName), content);
};

askQuestions();

const createFileDetails = (
  fileName: string
): {
  readonly filePath: string;
  readonly fileNameWithoutExtension: string;
  readonly fileExtension: string;
} => {
  const filePath = path.join(process.cwd(), fileName);
  const fileNameWithoutExtension = path.parse(filePath).name;
  const fileExtension = path.extname(filePath);

  return {
    filePath,
    fileNameWithoutExtension,
    fileExtension,
  };
};
