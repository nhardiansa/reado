import { render } from "@testing-library/react-native";

import { BookProgressList } from "../BookProgressList";
import { mockBooks } from "../../data/mock-books";

describe("BookProgressList", () => {
  it("renders one card per book", async () => {
    const { getByText } = await render(<BookProgressList books={mockBooks} />);
    expect(getByText("Tomorrow, and Tomorrow…")).toBeTruthy();
    expect(getByText("Project Hail Mary")).toBeTruthy();
    expect(getByText("Atomic Habits")).toBeTruthy();
  });

  it("renders empty View when books is empty", async () => {
    const { toJSON } = await render(<BookProgressList books={[]} />);
    expect(toJSON()).not.toBeNull();
  });
});
