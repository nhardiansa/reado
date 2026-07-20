import { mockBooks, mockCounts } from "../mock-books";
import type { HomeBook } from "../../types";

describe("mock-books", () => {
  it("exports 3 books with correct shape", () => {
    expect(mockBooks).toHaveLength(3);
    mockBooks.forEach((b: HomeBook) => {
      expect(typeof b.id).toBe("string");
      expect(typeof b.title).toBe("string");
      expect(typeof b.author).toBe("string");
      expect(typeof b.currentPage).toBe("number");
      expect(typeof b.totalPages).toBe("number");
      expect(typeof b.percent).toBe("number");
    });
  });

  it("matches mockup data exactly", () => {
    expect(mockBooks[0]).toEqual({
      id: "1",
      title: "Tomorrow, and Tomorrow…",
      author: "Gabrielle Zevin",
      currentPage: 264,
      totalPages: 416,
      percent: 64,
    });
    expect(mockBooks[1]).toEqual({
      id: "2",
      title: "Project Hail Mary",
      author: "Andy Weir",
      currentPage: 104,
      totalPages: 476,
      percent: 22,
    });
    expect(mockBooks[2]).toEqual({
      id: "3",
      title: "Atomic Habits",
      author: "James Clear",
      currentPage: 281,
      totalPages: 320,
      percent: 88,
    });
  });

  it("exports counts finished:12, inProgress:3", () => {
    expect(mockCounts).toEqual({ finished: 12, inProgress: 3 });
  });
});
