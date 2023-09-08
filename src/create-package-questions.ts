import { QuestionCollection } from "inquirer";

import { DeDupedParsePayload } from "./core/create-vitest-ast";
import { AggregateImport } from "./core/ast/types/parse-payload";

export const createPackageQuestions = ({
  imports,
  propertyAccess,
}: Omit<DeDupedParsePayload, "localMocks">): QuestionCollection[] => {
  return imports
    .map((importStatement, i) => {
      const globalMockQuestion: QuestionCollection = {
        type: "confirm",
        name: i.toString(), // index hack because inquirer doesn't support file path as name
        message: `Do you want to mock "${importStatement.packageName}"? (If this package only has types, you can skip this)`,
        default: true,
      };

      const localMockQuestion: QuestionCollection = {
        type: "confirm",
        name: `${i.toString()}-local`,
        message: `Do you want to mock "${importStatement.packageName}" locally for each test? (so you can modify it per test)`,
        default: false,
        when: (answers) => answers[i.toString()] === true,
      };

      const namedImportQuestions = importStatement.namedImports.map(
        (namedImport) =>
          ({
            type: "confirm",
            name: `${i.toString()}-named_import:${namedImport}`,
            message: `Do you want to locally mock "${namedImport}" from "${importStatement.packageName}"? (You can only mock functions. If this is not a function. Do not mock it!)`,
            default: true,
            when: (answers) => answers[`${i.toString()}-local`] === true,
          }) as QuestionCollection
      );

      const propertiesOfImport = getPropertyAccessFromImport(
        importStatement,
        propertyAccess
      );

      const propertyQuestions = propertiesOfImport
        .filter(
          (property) =>
            !isPropertyFromDefaultImport(
              property,
              importStatement,
              propertyAccess
            )
        )
        .map(
          (property) =>
            ({
              type: "confirm",
              name: `${i.toString()}-property:${property}`,
              message: `Do you want to locally mock "${property}" from "${importStatement.packageName}"? (You can only mock functions. If this is not a function. Do not mock it!)`,
              default: true,
              when: (answers) => answers[`${i.toString()}-local`] === true,
            }) as QuestionCollection
        );

      const defaultPropertyQuestion = propertiesOfImport
        .filter((property) =>
          isPropertyFromDefaultImport(property, importStatement, propertyAccess)
        )
        .map(
          (property) =>
            ({
              type: "confirm",
              name: `${i.toString()}-default_property:${property}`,
              message: `Do you want to locally mock "${property}" from the default import "${importStatement.packageName}"? (You can only mock functions. If this is not a function. Do not mock it!)`,
              default: true,
              when: (answers) => answers[`${i.toString()}-local`] === true,
            }) as QuestionCollection
        );

      return [
        globalMockQuestion,
        localMockQuestion,
        ...namedImportQuestions,
        ...propertyQuestions,
        ...defaultPropertyQuestion,
      ];
    })
    .flat();
};

const isPropertyFromDefaultImport = (
  property: string,
  importStatement: AggregateImport,
  propertyAccess: Record<string, Set<string>>
): boolean => {
  const defaultImport: string | undefined =
    importStatement.defaultImports.filter(
      (d) => d === importStatement.packageName
    )[0];

  if (!defaultImport) {
    return false;
  }

  return propertyAccess[defaultImport]?.has(property);
};

const getPropertyAccessFromImport = (
  importStatement: AggregateImport,
  propertyAccess: Record<string, Set<string>>
): string[] => {
  const defaultImports = importStatement.defaultImports
    .map((d) => Array.from(propertyAccess[d]))
    .flat();
  const namespaceImports = importStatement.namespaceImports
    .map((d) => Array.from(propertyAccess[d]))
    .flat();

  return [...defaultImports, ...namespaceImports];
};
