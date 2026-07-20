import { View } from "react-native";

import { BookProgressCard } from "./BookProgressCard";
import type { HomeBook } from "../types";

interface BookProgressListProps {
  books: HomeBook[];
  onBookPress?: (id: string) => void;
}

export function BookProgressList({ books, onBookPress }: BookProgressListProps): React.ReactElement {
  return (
    <View className="gap-[14px] px-[22px]">
      {books.map((book) => (
        <BookProgressCard key={book.id} book={book} onPress={onBookPress} />
      ))}
    </View>
  );
}
