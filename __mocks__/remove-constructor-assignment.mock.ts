export const REMOVE_CONSTRUCTOR_ASSIGNMENT_MOCK = `
import {
  ClassDeclaration,
  Node,
  Scope,
  SourceFile,
  StatementedNode,
  SyntaxKind,
} from "ts-morph";

import { getParent, getScope, iterate } from "./util";

export const removeConstructorAssignment = (sourceFile: SourceFile): void => {
  sourceFile.forEachDescendant((node: Node) => {
    if (node.getKind() === SyntaxKind.Parameter) {
      if (node.getParent().getKind() === SyntaxKind.Constructor) {
        const classDeclaration = getParent(node, SyntaxKind.ClassDeclaration);
        const identifier = iterate(node, {
          only: [SyntaxKind.Identifier],
        });
        const scope = getScope(node);
        (classDeclaration as any as ClassDeclaration).insertProperty(0, {
          scope,
          isStatic: false,
          name: identifier,
          type: node.getType().getText(),
        });
      }
    }
  });

  sourceFile.forEachDescendant((node: Node) => {
    if (node.getKind() === SyntaxKind.Parameter) {
      if (node.getParent().getKind() === SyntaxKind.Constructor) {
        const identifier = iterate(node, {
          only: [SyntaxKind.Identifier],
        });
        (node.getParent() as any as StatementedNode).insertStatements(
          0,
          "test"
        );
      }
    }
  });
  console.log(sourceFile.getText());
};
`;
