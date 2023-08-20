import { SyntaxKind, Node } from "ts-morph";
import { ParsePayload } from "./types/parse-payload";
import { handleImport } from "./handlers/handle-import";
import { handlePropertyAccessExpression } from "./handlers/handle-property-access-expression";
import { handleVariableStatement } from "./handlers/handle-variable-statement";

// import {
//   handleAccessModifier,
//   handleAny,
//   handleBlock,
//   handleBooleanKeyword,
//   handleCallExpression,
//   handleClass,
//   handleConstructor,
//   handleExpressionStatement,
//   handleIdentifier,
//   handleLiterals,
//   handleStringLiterals,
//   handleParameter,
//   handlePropertyAccessExpression,
//   handlePropertyDeclaration,
//   handleStringKeyword,
//   handleSyntaxList,
//   handleVariableStatement,
//   handleVariableDeclarationList,
//   handleVariableDeclaration,
//   handleNumberKeyword,
//   handleThis,
//   handleEqualsToken,
//   handleMethodDeclaration,
//   handleNewKeyword,
//   handleNewExpression,
//   handleArrayLiteralExpression,
// } from "@components";

export const traverse = (
  node: Node,
  parsePayload: ParsePayload
): ParsePayload => {
  switch (node.getKind()) {
    // case SyntaxKind.ClassDeclaration:
    //   return handleClass(node, traverse);
    // case SyntaxKind.Constructor:
    //   return handleConstructor(node, traverse);
    // case SyntaxKind.Identifier:
    //   return handleIdentifier(node, traverse);
    // case SyntaxKind.PrivateKeyword:
    // case SyntaxKind.PublicKeyword:
    // case SyntaxKind.StaticKeyword:
    // case SyntaxKind.ProtectedKeyword:
    // case SyntaxKind.ReadonlyKeyword:
    //   return handleAccessModifier(node, traverse);
    // case SyntaxKind.MethodDeclaration:
    //   return handleMethodDeclaration(node);
    // case SyntaxKind.StringLiteral:
    //   return handleStringLiterals(node, traverse);
    // case SyntaxKind.BooleanKeyword:
    //   return handleBooleanKeyword(node, traverse);
    // case SyntaxKind.StringKeyword:
    //   return handleStringKeyword(node);
    // case SyntaxKind.ArrowFunction:
    //   // console.log("ArrowFunction", node.getText());
    //   break;
    // case SyntaxKind.AnyKeyword:
    //   return handleAny(node, traverse);
    // case SyntaxKind.Block:
    //   return handleBlock(node, traverse);
    // case SyntaxKind.ReturnStatement:
    //   // console.log("ReturnStatement", node.getText());
    //   break;
    // case SyntaxKind.ExpressionStatement:
    //   return handleExpressionStatement(node, traverse);
    // case SyntaxKind.CallExpression:
    //   return handleCallExpression(node, traverse);
    // case SyntaxKind.SyntaxList:
    //   return handleSyntaxList(node, traverse);
    // case SyntaxKind.BinaryExpression:
    //   // console.log("BinaryExpression", node.getText());
    //   break;
    // case SyntaxKind.ObjectLiteralExpression:
    //   // console.log("ObjectLiteralExpression", node.getText());
    //   break;
    // case SyntaxKind.PropertyAssignment:
    //   // console.log("PropertyAssignment", node.getText());
    //   break;
    // case SyntaxKind.NumericLiteral:
    //   return handleLiterals(node, traverse);
    // case SyntaxKind.PrefixUnaryExpression:
    //   // console.log("PrefixUnaryExpression", node.getText());
    //   break;
    // case SyntaxKind.PostfixUnaryExpression:
    //   // console.log("PostfixUnaryExpression", node.getText());
    //   break;
    // case SyntaxKind.ParenthesizedExpression:
    //   // console.log("ParenthesizedExpression", node.getText());
    //   break;
    // case SyntaxKind.ArrayLiteralExpression:
    //   return handleArrayLiteralExpression(node);
    // case SyntaxKind.ElementAccessExpression:
    //   // console.log("ElementAccessExpression", node.getText());
    //   break;
    case SyntaxKind.PropertyAccessExpression:
      parsePayload = handlePropertyAccessExpression(node, parsePayload);
      break;
    // case SyntaxKind.CommaToken:
    //   return handleIdentifier(node, traverse);
    // case SyntaxKind.Parameter:
    //   return handleParameter(node, traverse);
    // case SyntaxKind.PropertyDeclaration:
    //   return handlePropertyDeclaration(node);
    case SyntaxKind.VariableStatement:
      parsePayload = handleVariableStatement(node, parsePayload);
      break;
    // case SyntaxKind.VariableDeclarationList:
    //   return handleVariableDeclarationList(node);
    // case SyntaxKind.VariableDeclaration:
    //   return handleVariableDeclaration(node);
    // case SyntaxKind.NumberKeyword:
    //   return handleNumberKeyword(node);
    // case SyntaxKind.ThisKeyword:
    //   return handleThis(node);
    // case SyntaxKind.EqualsToken:
    //   return handleEqualsToken(node);
    // case SyntaxKind.NewKeyword:
    //   return handleNewKeyword(node);
    // case SyntaxKind.NewExpression:
    //   return handleNewExpression(node);
    case SyntaxKind.ImportDeclaration:
      parsePayload = handleImport(node, parsePayload);
      break;
  }
  //   console.log(node.getKindName());
  //   if (node.getChildCount() === 0) {
  //     console.log(node.getText());
  //   }
  //   console.log(node.getKindName());
  for (const child of node.getChildren()) {
    parsePayload = traverse(child, parsePayload);
  }

  return parsePayload;
};
