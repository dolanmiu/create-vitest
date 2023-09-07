export const SEPARATE_EXPORT_MOCK = `
import path from "path";
import { vi, describe, it, expect, afterAll } from "vitest";
import viDefault, { vi, describe, it, expect } from "vitest"
import * as ff from 'test';
import defaultMember, * as coolModule from "my-module";
import "module-name";

const getPostCssConfig = (): any | undefined => {
  defaultMember();
  ff.wow();
  ff.world();
  coolModule.hello();
  viDefault.awesome();
  try {
    const file = require(path.join(process.cwd(), "postcss.config.js"));

    return file;
  } catch {}

  try {
    const file = require(path.join(process.cwd(), "postcss.config.cjs"));

    return file;
  } catch {}

  try {
    const file = require(path.join(process.cwd(), "postcss.config.json"));

    return file;
  } catch {}

  return {
    plugins: {},
  };
};

const postCssPluginsToArray = (config: { plugins: any }): string[] => {
  return Object.keys(config.plugins);
};

export { getPostCssConfig, postCssPluginsToArray };
`;