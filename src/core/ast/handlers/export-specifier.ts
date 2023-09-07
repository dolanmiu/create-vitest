import { Node, SyntaxKind } from "ts-morph";

import { ParsePayload } from "../types/parse-payload";

export const handleExportSpecifier = (
  node: Node,
  parsePayload: ParsePayload
): ParsePayload => {
  const identifiers = node.getChildrenOfKind(SyntaxKind.Identifier);

  if (identifiers.length === 0) {
    return parsePayload;
  }

  const lastIdentifier = identifiers[identifiers.length - 1];

  return {
    ...parsePayload,
    exports: [...parsePayload.exports, lastIdentifier.getText()],
  };
};
