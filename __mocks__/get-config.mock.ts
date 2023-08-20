export const GET_CONFIG_MOCK = `
import path from "path";
import { vi, describe, it, expect, afterAll } from "vitest";
import viDefault, { vi, describe, it, expect } from "vitest"
import * as ff from 'test';
import defaultMember, * as coolModule from "my-module";
import "module-name";

export const getPostCssConfig = (): any | undefined => {
  defaultMember();
  ff.wow();
  ff.world();
  coolModule.hello();
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

export const postCssPluginsToArray = (config: { plugins: any }): string[] => {
  return Object.keys(config.plugins);
};
`;