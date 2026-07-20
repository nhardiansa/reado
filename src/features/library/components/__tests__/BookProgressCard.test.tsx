import { fireEvent, render } from "@testing-library/react-native";
import { BookProgressCard } from "../BookProgressCard";
import type { HomeBook } from "../../types";

const book: HomeBook = {
  id: "1",
  title: "Tomorrow, and Tomorrow…",
  author: "Gabrielle Zevin",
  currentPage: 264,
  totalPages: 416,
  percent: 64,
};

describe("BookProgressCard", () => {
  it("renders title, author, page count, percent", async () => {
    const { getByText } = await render(<BookProgressCard book={book} />);
    expect(getByText("Tomorrow, and Tomorrow…")).toBeTruthy();
    expect(getByText("Gabrielle Zevin")).toBeTruthy();
    expect(getByText("p.264 / 416")).toBeTruthy();
    expect(getByText("64%")).toBeTruthy();
  });

  it("fires onPress with book id", async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<BookProgressCard book={book} onPress={onPress} />);
    fireEvent.press(getByText("Tomorrow, and Tomorrow…"));
    expect(onPress).toHaveBeenCalledWith("1");
  });
});
