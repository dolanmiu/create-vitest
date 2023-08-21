// #!/usr/bin/env
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { createTest } from "./core/create-test";
import fs from "fs";
import inquirer, { QuestionCollection } from "inquirer";
import chalk from "chalk";

console.log(chalk.bgBlueBright.bold("                                     "));
console.log(chalk.bgBlueBright.bold("   🎉 Welcome to create vitest! 🎉   "));
console.log(chalk.bgBlueBright.bold("                                      "));

const {
  _: [fileName],
} = yargs(hideBin(process.argv)).argv as any;

const filePath = path.join(process.cwd(), fileName);

const fileNameWithoutExtension = path.parse(filePath).name;

const fileExtension = path.extname(filePath);

export type Answers = {
  suffix: string;
  confirm: boolean;
};

const questions: QuestionCollection[] = [
  {
    type: "list",
    name: "suffix",
    message: "What suffix would you like the test to end in?",
    choices: ["spec", "test"],
  },
  {
    type: "confirm",
    name: "confirm",
    message: `The path of the file is "${filePath}". Is this correct?`,
  },
];

const askQuestions = async () => {
  const answers = await inquirer.prompt<Answers>(questions);
  const newFileName = `${fileNameWithoutExtension}.${answers.suffix}${fileExtension}`;
  console.log(chalk.green(`Generating ${newFileName}...`));

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const content = await createTest(newFileName, fileContent);
  fs.promises.writeFile(path.join(process.cwd(), newFileName), content);
};

askQuestions();
