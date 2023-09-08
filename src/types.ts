import { SpyOnMockConfig } from "./core/create-vitest-ast";

export type InitialAnswers = {
  suffix: string;
  confirm: boolean;
  fileName?: string;
};

export type ModuleMockAnswers = SpyOnMockConfig & {
  type: "named_import" | "default" | "root";
  value: boolean;
};
