export const TEST_MOCK = `
import { vi, describe, it, expect, afterAll } from "vitest";

vi.mock("fs", {
  promises: {
    writeFile: vi.fn(),
  },
});
vi.mock("prettier", {});

describe("createTest", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should work", async () => {
    expect(true).toEqual(true);
  });
});

describe("createAwesome", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should work", async () => {
    expect(true).toEqual(true);
  });
});
`;
