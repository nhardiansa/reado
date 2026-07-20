import type { HomeBook } from "../types";

export const mockBooks: HomeBook[] = [
  {
    id: "1",
    title: "Tomorrow, and Tomorrow…",
    author: "Gabrielle Zevin",
    currentPage: 264,
    totalPages: 416,
    percent: 64,
  },
  {
    id: "2",
    title: "Project Hail Mary",
    author: "Andy Weir",
    currentPage: 104,
    totalPages: 476,
    percent: 22,
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    currentPage: 281,
    totalPages: 320,
    percent: 88,
  },
];

export const mockCounts = { finished: 12, inProgress: 3 };
