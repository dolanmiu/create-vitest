import { AggregateImport, ParsedImport } from "./ast/types/parse-payload";

export const aggregateImports = (
  imports: ParsedImport[]
): AggregateImport[] => {
  // We can not have the same import twice

  const uniqueImports = imports.reduce(
    (acc: AggregateImport[], curr: ParsedImport) => {
      const existingImport = acc.find(
        (i) => i.packageName === curr.packageName
      );

      const aggregateImport: AggregateImport = {
        packageName: curr.packageName,
        defaultImports: [
          ...(existingImport ? existingImport.defaultImports : []),
          ...(curr.type === "default" ||
          curr.type === "default-and-named" ||
          curr.type === "default-and-namespace"
            ? [curr.defaultImport]
            : []),
        ],
        namespaceImports: [
          ...(existingImport ? existingImport.namespaceImports : []),
          ...(curr.type === "namespace" || curr.type === "default-and-namespace"
            ? [curr.namespaceImport]
            : []),
        ],
        namedImports: [
          ...(existingImport ? existingImport.namedImports : []),
          ...(curr.type === "named" || curr.type === "default-and-named"
            ? [...curr.namedImports]
            : []),
        ],
      };

      return [
        ...acc.filter((i) => i.packageName !== curr.packageName),
        aggregateImport,
      ];
    },
    [] as AggregateImport[]
  );

  return uniqueImports;
};
