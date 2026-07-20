import { render } from "@testing-library/react-native";

import HomeScreen from "../";

jest.mock("react-native-reanimated", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  const AnimatedView = (props: { children?: React.ReactNode }) => React.createElement(View, props);
  AnimatedView.displayName = "Animated.View";
  return {
    __esModule: true,
    default: { View: AnimatedView },
    useAnimatedStyle: jest.fn(() => ({})),
    withRepeat: jest.fn((v: unknown) => v),
    withTiming: jest.fn((v: unknown) => v),
  };
});

describe("HomeScreen", () => {
  it("renders ready state with mock books", async () => {
    const { getByText } = await render(<HomeScreen />);
    expect(getByText("HALO, RANGGA")).toBeTruthy();
    expect(getByText("Bookshelf")).toBeTruthy();
    expect(getByText("Tomorrow, and Tomorrow…")).toBeTruthy();
    expect(getByText("12")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
  });
});
