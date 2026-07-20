import { Pressable, View } from "react-native";
import { Library, MessageCircle, Settings } from "lucide-react-native";

import { ClayCard } from "@/components/ClayCard";

type TabKey = "main" | "reviews" | "settings";

interface BottomNavProps {
  activeTab?: TabKey;
}

const tabs: { key: TabKey; Icon: typeof Library }[] = [
  { key: "main", Icon: Library },
  { key: "reviews", Icon: MessageCircle },
  { key: "settings", Icon: Settings },
];

export function BottomNav({ activeTab = "main" }: BottomNavProps): React.ReactElement {
  return (
    <View className="h-[70px] flex-row border-clay border-t-[3px] bg-clay-card pt-[4px]">
      {tabs.map(({ key, Icon }) => {
        const isActive = key === activeTab;
        return (
          <Pressable key={key} className="flex-1 items-center justify-center" onPress={() => {}}>
            <ClayCard
              shadow="none"
              radius="button"
              className={`h-[32px] w-[32px] items-center justify-center ${
                isActive ? "bg-clay-accent" : "bg-transparent"
              }`}
            >
              <Icon size={18} color="#141414" />
            </ClayCard>
          </Pressable>
        );
      })}
    </View>
  );
}
