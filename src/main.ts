// #!/usr/bin/env
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { createTest } from "./core/create-test";
import fs from "fs";
import inquirer, { InputQuestion, QuestionCollection } from "inquirer";
import chalk from "chalk";
import { getFileProperties } from "./core/get-file-properties";
import { InitialAnswers } from "./types";
import { createPackageQuestions } from "./create-package-questions";
import {
  checkIfTestFileExists,
  createFileDetails,
  getNewFileName,
  removePathPrefixFromCwd,
} from "./path-utils";

console.log(chalk.bgBlueBright.bold("                                      "));
console.log(chalk.bgBlueBright.bold("   🧪 Welcome to create vitest! 🏗️     "));
console.log(chalk.bgBlueBright("                      by Dolan        "));

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

if (fileName) {
  if (!/^[a-zA-Z0-9-_/\\]+\.tsx?$/.test(fileName)) {
    console.log(chalk.red("The file name must end in .ts or .tsx"));
    process.exit(1);
  }

  if (!fs.existsSync(path.join(process.cwd(), fileName))) {
    console.log(chalk.red("The file does not exist!"));
    process.exit(1);
  }

  if (checkIfTestFileExists(fileName)) {
    console.log(
      chalk.red(
        "A test file already exists for this file! Please delete the existing test file and try again."
      )
    );
    process.exit(1);
  }
}

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

            if (checkIfTestFileExists(input)) {
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
  const answers = await inquirer.prompt<InitialAnswers>(questions);

  if (!fileName && !answers.fileName) {
    console.log(chalk.red("You must specify a file name!"));
    process.exit(1);
  }

  const { filePath } = createFileDetails(fileName ?? answers.fileName);
  const newFileName = getNewFileName(
    fileName ?? answers.fileName,
    answers.suffix
  );

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const filePayload = getFileProperties(newFileName, fileContent);

  const moduleQuestions = createPackageQuestions(filePayload.imports);
  const moduleAnswers =
    await inquirer.prompt<Record<string, boolean>>(moduleQuestions);

  const includeModules = new Set(
    Object.entries(moduleAnswers)
      .filter(([_, value]) => !!value)
      .map(([packageName]) => packageName)
  );

  console.log(chalk.green(`Generating ${newFileName}...`));

  const content = await createTest({
    ...filePayload,
    imports: filePayload.imports.filter((_, i) =>
      includeModules.has(i.toString())
    ),
  });

  fs.promises.writeFile(
    path.join(process.cwd(), removePathPrefixFromCwd(filePath), newFileName),
    content
  );
};

askQuestions();
