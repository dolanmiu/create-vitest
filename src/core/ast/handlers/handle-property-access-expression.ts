import { Node, SyntaxKind } from "ts-morph";

import { ParsePayload } from "../types/parse-payload";

export const handlePropertyAccessExpression = (
  node: Node,
  parsePayload: ParsePayload
): ParsePayload => {
  const [object, property] = node.getChildrenOfKind(SyntaxKind.Identifier);

  return {
    ...parsePayload,
    propertyAccess: {
      ...parsePayload.propertyAccess,
      [object.getText()]: new Set<string>([
        ...(parsePayload.propertyAccess[object.getText()] ?? []),
        property.getText(),
      ]),
    },
  };
};
