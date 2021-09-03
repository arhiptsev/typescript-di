module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
    },
  },
  rootDir: "./",
  modulePathIgnorePatterns: ["<rootDir>/lib"],
  roots: ["<rootDir>"],
};
