/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  roots: ["<rootDir>/src"],
  preset: "ts-jest/presets/js-with-ts-esm",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  transform: { "\\.ts$": "ts-jest" },
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: {
        jsx: "react",
      },
    },
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
