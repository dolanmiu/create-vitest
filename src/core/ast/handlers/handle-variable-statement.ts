import { Node, SyntaxKind } from "ts-morph";

import { ParsePayload } from "../types/parse-payload";

export const handleVariableStatement = (
  node: Node,
  parsePayload: ParsePayload
): ParsePayload => {
  const [e] =
    node
      .getChildrenOfKind(SyntaxKind.SyntaxList)[0]
      ?.getChildrenOfKind(SyntaxKind.ExportKeyword) ?? [];

  if (!e || e.getText() !== "export") {
    return parsePayload;
  }

  const list = node
    .getFirstChildByKindOrThrow(SyntaxKind.VariableDeclarationList)
    .getFirstChildByKindOrThrow(SyntaxKind.SyntaxList)
    .getChildrenOfKind(SyntaxKind.VariableDeclaration)
    .map((c) => c.getFirstChildByKindOrThrow(SyntaxKind.Identifier))
    .map((c) => c.getText());

  return {
    ...parsePayload,
    exports: [...parsePayload.exports, ...list],
  };
};
