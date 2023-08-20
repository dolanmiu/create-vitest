import { describe, it, expect } from "vitest";

import { GET_CONFIG_MOCK } from "@mocks/get-config.mock";

import { createTest } from "./create-test";

describe("createTest", () => {
  it("should create a test file", async () => {
    const output = await createTest("test.spec.ts", GET_CONFIG_MOCK);

    expect(output)
      .toEqual(`import { vi, describe, it, expect, afterAll, beforeAll } from "vitest";

vi.mock("path", () => ({
  default: vi.fn(),
}));
vi.mock("vitest", () => ({
  default: vi.fn(),
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
  default: vi.fn(),
  hello: vi.fn(),
}));
vi.mock("module-name", () => ({}));
`);
  });
});
