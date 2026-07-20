import { Text, View } from "react-native";

import { ClayCard } from "@/components/ClayCard";
import type { HomeBook } from "../types";

interface BookProgressCardProps {
  book: HomeBook;
  onPress?: (id: string) => void;
}

export function BookProgressCard({ book, onPress }: BookProgressCardProps): React.ReactElement {
  return (
    <ClayCard
      as="Pressable"
      onPress={() => onPress?.(book.id)}
      className="flex-row gap-[14px] bg-clay-card p-[15px]"
    >
      <ClayCard
        radius="button"
        borderWidth="emphasized"
        className="h-[92px] w-[64px] rounded-[4px] bg-clay-card"
      />
      <View className="flex-1 gap-[3px]">
        <Text className="font-archivo text-[18px] leading-tight text-clay-text" numberOfLines={2}>
          {book.title}
        </Text>
        <Text className="font-jetbrains text-[12px] text-clay-text">{book.author}</Text>
        <View className="flex-row justify-between">
          <Text className="font-jetbrains text-[12px] text-clay-text">
            p.{book.currentPage} / {book.totalPages}
          </Text>
          <Text className="font-archivo text-[14px] text-clay-text">{book.percent}%</Text>
        </View>
      </View>
    </ClayCard>
  );
}
