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
console.log(chalk.bgBlueBright("                  Made by Dolan       "));

console.log("");
console.log(
  chalk.green(
    "Generate a vitest test (spec) file for a TypeScript file with best practices. Scaffold the test and mock all imports"
  )
);
console.log(
  chalk.blue(
    `ℹ️ Note: Every so often, run "npx create-vitest@latest" to update to the latest version. 🍆 `
  )
);
console.log("");
console.log(
  chalk.bgWhite.bold("GitHub: https://github.com/dolanmiu/create-vitest")
);
console.log("");

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
          validate: async (input) => {
            if (input === "") {
              return "You must specify a file name!";
            }

            if (!/^[a-zA-Z0-9-_/\\]+\.tsx?$/.test(input)) {
              return "The file name must end in .ts or .tsx";
            }

            if (!fs.existsSync(path.join(process.cwd(), input))) {
              return "The file does not exist!";
            }

            if (
              fs.existsSync(
                path.join(process.cwd(), getNewFileName(input, "spec"))
              ) ||
              fs.existsSync(
                path.join(process.cwd(), getNewFileName(input, "test"))
              )
            ) {
              return "A test file already exists for this file!";
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

  const { filePath } = createFileDetails(fileName ?? answers.fileName);
  const newFileName = getNewFileName(
    fileName ?? answers.fileName,
    answers.suffix
  );
  console.log(chalk.green(`Generating ${newFileName}...`));

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const content = await createTest(newFileName, fileContent);
  fs.promises.writeFile(
    path.join(process.cwd(), removePathPrefixFromCwd(filePath), newFileName),
    content
  );
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

const getNewFileName = (fileName: string, suffix: string) => {
  const { fileNameWithoutExtension, fileExtension } =
    createFileDetails(fileName);
  return `${fileNameWithoutExtension}.${suffix}${fileExtension}`;
};

const removePathPrefixFromCwd = (filePath: string) => {
  return path.dirname(filePath).replace(process.cwd(), "");
};
