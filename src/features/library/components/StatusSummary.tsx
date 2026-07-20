import { Text, View } from "react-native";
import { Book, BookOpen } from "lucide-react-native";

import { ClayCard } from "@/components/ClayCard";

interface StatusSummaryProps {
  finished: number;
  inProgress: number;
}

export function StatusSummary({ finished, inProgress }: StatusSummaryProps): React.ReactElement {
  return (
    <View className="flex-row gap-[10px] px-[22px]">
      <ClayCard
        shadow="emphasized"
        className="h-[71px] w-[168px] flex-row items-center gap-[4px] bg-clay-card p-[15px]"
      >
        <ClayCard
          radius="button"
          borderWidth="emphasized"
          className="h-[35px] w-[35px] items-center justify-center bg-white"
        >
          <Book size={20} color="#141414" />
        </ClayCard>
        <View className="gap-[2px]">
          <Text className="font-archivo text-[28px] leading-none text-clay-text">{finished}</Text>
          <Text className="font-jetbrains text-[11px] text-clay-text">SELESAI</Text>
        </View>
      </ClayCard>

      <ClayCard
        shadow="emphasized"
        className="h-[71px] w-[168px] flex-row items-center gap-[4px] bg-clay-accent-pink p-[15px]"
      >
        <ClayCard
          radius="button"
          borderWidth="emphasized"
          className="h-[35px] w-[35px] items-center justify-center bg-white"
        >
          <BookOpen size={20} color="#FFFFFF" />
        </ClayCard>
        <View className="gap-[2px]">
          <Text className="font-archivo text-[28px] leading-none text-white">{inProgress}</Text>
          <Text className="font-jetbrains text-[11px] text-white">SEDANG</Text>
        </View>
      </ClayCard>
    </View>
  );
}
