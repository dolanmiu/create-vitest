import { describe, it, expect } from "vitest";

import { GET_CONFIG_MOCK } from "@mocks/get-config.mock";
import { REMOVE_CONSTRUCTOR_ASSIGNMENT_MOCK } from "@mocks/remove-constructor-assignment.mock";

import { createTest } from "./create-test";

describe("createTest", () => {
  it("should create a test file", async () => {
    const output = await createTest("test.spec.ts", GET_CONFIG_MOCK);

    expect(output)
      .toEqual(`import { vi, describe, it, expect, afterAll, beforeAll } from "vitest";

vi.mock("path", () => ({
  default: {
    join: vi.fn(),
  },
}));
vi.mock("vitest", () => ({
  default: {
    awesome: vi.fn(),
  },
  vi: vi.fn(),
  describe: vi.fn(),
  it: vi.fn(),
  expect: vi.fn(),
  afterAll: vi.fn(),
}));
vi.mock("test", () => ({
  wow: vi.fn(),
  world: vi.fn(),
}));
vi.mock("my-module", () => ({
  default: {},
  hello: vi.fn(),
}));
vi.mock("module-name", () => ({}));

describe("my-awesome-tests", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  describe("getPostCssConfig", () => {
    it("should work", () => {
      expect(true).toBe(true);
    });
  });

  describe("postCssPluginsToArray", () => {
    it("should work", () => {
      expect(true).toBe(true);
    });
  });
});
`);
  });

  it("should create a test file with single export", async () => {
    const output = await createTest(
      "test.spec.ts",
      REMOVE_CONSTRUCTOR_ASSIGNMENT_MOCK
    );

    expect(output)
      .toEqual(`import { vi, describe, it, expect, afterAll, beforeAll } from "vitest";

vi.mock("ts-morph", () => ({
  ClassDeclaration: vi.fn(),
  Node: vi.fn(),
  Scope: vi.fn(),
  SourceFile: vi.fn(),
  StatementedNode: vi.fn(),
  SyntaxKind: vi.fn(),
}));
vi.mock("./util", () => ({
  getParent: vi.fn(),
  getScope: vi.fn(),
  iterate: vi.fn(),
}));

describe("removeConstructorAssignment", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should work", () => {
    expect(true).toBe(true);
  });
});
`);
  });
});
