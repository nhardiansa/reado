module.exports = {
  preset: "jest-expo",
  rootDir: ".",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}", "<rootDir>/__tests__/**/*.test.{ts,tsx}"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-clone-referenced-element|@nozbe/watermelondb|nativewind|lucide-react-native)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/app/**"],
};
