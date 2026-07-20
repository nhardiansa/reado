import { Text, View } from "react-native";
import { BookOpen } from "lucide-react-native";

import { ClayCard } from "@/components/ClayCard";

interface EmptyStateProps {
  onAddPress?: () => void;
}

export function EmptyState({ onAddPress }: EmptyStateProps): React.ReactElement {
  return (
    <View className="flex-1 items-center justify-center gap-[12px] px-[22px]">
      <ClayCard
        shadow="none"
        radius="button"
        className="h-[64px] w-[64px] items-center justify-center bg-clay-card"
      >
        <BookOpen size={28} color="#141414" />
      </ClayCard>
      <Text className="font-archivo text-[22px] text-clay-text">Belum ada buku</Text>
      <Text className="font-jetbrains text-[12px] text-clay-text">Tambah buku pertamamu</Text>
      <ClayCard
        as="Pressable"
        radius="button"
        className="h-[46px] w-[48px] items-center justify-center bg-clay-accent"
        onPress={onAddPress}
        testID="empty-add-btn"
      >
        <Text className="font-archivo text-[26px] leading-none text-clay-text">+</Text>
      </ClayCard>
    </View>
  );
}
