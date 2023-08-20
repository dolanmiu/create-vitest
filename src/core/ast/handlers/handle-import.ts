// Many different types of imports
// https://stackoverflow.com/questions/45867553/es6-typescript-import-import-and-names-on-a-single-line
import { Node, SyntaxKind, ImportClause } from "ts-morph";

import { ParsePayload } from "../types/parse-payload";

export const handleImport = (
  node: Node,
  parsePayload: ParsePayload
): ParsePayload => {
  const packageName = node
    .getChildrenOfKind(SyntaxKind.StringLiteral)[0]
    .getText()
    .replace(/['"]+/g, "");
  const importClause = node.getChildrenOfKind(SyntaxKind.ImportClause)[0];

  let output = parsePayload;

  if (importClause === undefined) {
    // No import clause e.g. import "prettier";

    output = {
      ...output,
      imports: [
        ...output.imports,
        {
          type: "none",
          packageName,
        },
      ],
    };
  } else if (
    importClause.getChildrenOfKind(SyntaxKind.NamedImports).length > 0 &&
    importClause.getChildrenOfKind(SyntaxKind.Identifier).length > 0
  ) {
    // Default and named imports e.g. import viDefault, { vi, describe, it, expect } from "vitest";

    const defaultImport = getDefaultImportName(importClause);
    const namedImports = getNamedImports(importClause);

    output = {
      ...output,
      imports: [
        ...output.imports,
        {
          type: "default-and-named",
          packageName,
          defaultImport,
          namedImports,
        },
      ],
    };
  } else if (
    importClause.getChildrenOfKind(SyntaxKind.NamespaceImport).length > 0 &&
    importClause.getChildrenOfKind(SyntaxKind.Identifier).length > 0
  ) {
    // Default and namespace imports e.g. import viDefault, * as vi from "vitest";

    const defaultImport = getDefaultImportName(importClause);
    const namespaceImport = getNamespaceImport(importClause);

    output = {
      ...output,
      imports: [
        ...output.imports,
        {
          type: "default-and-namespace",
          packageName,
          defaultImport,
          namespaceImport,
        },
      ],
    };
  } else if (
    importClause.getChildrenOfKind(SyntaxKind.NamedImports).length > 0
  ) {
    // Named imports e.g. import { vi, describe, it, expect } from "vitest";

    output = {
      ...output,
      imports: [
        ...output.imports,
        {
          type: "named",
          packageName,
          namedImports: getNamedImports(importClause),
        },
      ],
    };
  } else if (
    importClause.getChildrenOfKind(SyntaxKind.NamespaceImport).length > 0
  ) {
    // Namespace imports e.g. import * as prettier from "prettier";

    const namespaceImport = getNamespaceImport(importClause);

    output = {
      ...output,
      imports: [
        ...output.imports,
        {
          type: "namespace",
          packageName,
          namespaceImport: namespaceImport,
        },
      ],
    };
  } else {
    // Default imports e.g. import prettier from "prettier";
    const importName = getDefaultImportName(importClause);
    output = {
      ...output,
      imports: [
        ...output.imports,
        {
          type: "default",
          packageName,
          defaultImport: importName,
        },
      ],
    };
  }

  return output;
};

const getDefaultImportName = (importClause: ImportClause): string => {
  const defaultImport = importClause.getChildrenOfKind(
    SyntaxKind.Identifier
  )[0];

  return defaultImport.getText();
};

const getNamedImports = (importClause: ImportClause): string[] => {
  const namedImports = importClause.getChildrenOfKind(
    SyntaxKind.NamedImports
  )[0];
  const syntaxList = namedImports.getChildrenOfKind(SyntaxKind.SyntaxList)[0];
  const importSpecifiers = syntaxList.getChildrenOfKind(
    SyntaxKind.ImportSpecifier
  );

  return importSpecifiers.map((importSpecifier) =>
    importSpecifier.getChildrenOfKind(SyntaxKind.Identifier)[0].getText()
  );
};

const getNamespaceImport = (importClause: ImportClause): string => {
  const namespaceImport = importClause.getChildrenOfKind(
    SyntaxKind.NamespaceImport
  )[0];

  return namespaceImport.getChildrenOfKind(SyntaxKind.Identifier)[0].getText();
};
