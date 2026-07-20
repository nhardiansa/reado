import { Text, View } from "react-native";

import { ClayCard } from "@/components/ClayCard";

interface HomeHeaderProps {
  onAddPress?: () => void;
}

export function HomeHeader({ onAddPress }: HomeHeaderProps): React.ReactElement {
  return (
    <View className="flex-row items-center justify-between px-[22px]">
      <View className="gap-[2px]">
        <Text className="font-jetbrains text-[12px] text-clay-text">HALO, RANGGA</Text>
        <Text className="font-archivo text-[34px] leading-[34px] tracking-[-1px] text-clay-text">
          Bookshelf
        </Text>
      </View>
      <ClayCard
        as="Pressable"
        radius="button"
        className="h-[46px] w-[48px] items-center justify-center bg-clay-accent"
        onPress={onAddPress}
        testID="add-btn"
      >
        <Text className="font-archivo text-[26px] leading-none text-clay-text">+</Text>
      </ClayCard>
    </View>
  );
}
