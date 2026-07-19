import expoFlatConfig from "eslint-config-expo/flat.js";

export default [
  ...expoFlatConfig,
  {
    ignores: ["dist/", "web-build/", ".expo/", "coverage/", "node_modules/"],
  },
];
