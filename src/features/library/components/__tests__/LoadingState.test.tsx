import { render } from "@testing-library/react-native";

import { LoadingState } from "../LoadingState";

jest.mock("react-native-reanimated", () => {
  const { View } = jest.requireActual("react-native");
  return {
    __esModule: true,
    default: { View },
    useAnimatedStyle: jest.fn(() => ({})),
    withRepeat: jest.fn((v: unknown) => v),
    withTiming: jest.fn((v: unknown) => v),
  };
});

describe("LoadingState", () => {
  it("renders 3 skeleton cards", async () => {
    const { toJSON } = await render(<LoadingState />);
    expect(toJSON()).not.toBeNull();
  });
});
