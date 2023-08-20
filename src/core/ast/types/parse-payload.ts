export type ImportType =
  | "default"
  | "namespace"
  | "named"
  | "none"
  | "default-and-named"
  | "default-and-namespace";

export type Import = {
  readonly packageName: string;
};

export type NamedImport = Import & {
  readonly type: "named";
  readonly namedImports: readonly string[];
};

export type DefaultImport = Import & {
  readonly type: "default";
  readonly defaultImport: string;
};

export type NamespaceImport = Import & {
  readonly type: "namespace";
  readonly namespaceImport: string;
};

export type NoneImport = Import & {
  readonly type: "none";
};

export type DefaultAndNamedImport = Import & {
  readonly type: "default-and-named";
  readonly defaultImport: string;
  readonly namedImports: readonly string[];
};

export type DefaultAndNamespaceImport = Import & {
  readonly type: "default-and-namespace";
  readonly defaultImport: string;
  readonly namespaceImport: string;
};

export type ParsedImport =
  | NamedImport
  | DefaultImport
  | NamespaceImport
  | NoneImport
  | DefaultAndNamedImport
  | DefaultAndNamespaceImport;

export type AggregateImport = {
  readonly packageName: string;
  readonly defaultImports: readonly string[];
  readonly namespaceImports: readonly string[];
  readonly namedImports: readonly string[];
};

export type ParsePayload = {
  readonly imports: ParsedImport[];
  readonly propertyAccess: Record<string, Set<string>>;
  readonly exports: readonly string[];
};
