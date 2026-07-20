import { View } from "react-native";
import Animated, { useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";

import { ClayCard } from "@/components/ClayCard";

function SkeletonCard(): React.ReactElement {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(withTiming(1, { duration: 800 }), -1, true),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ClayCard shadow="none" className="flex-row gap-[14px] bg-clay-card p-[15px]">
        <ClayCard
          radius="button"
          borderWidth="emphasized"
          className="h-[92px] w-[64px] rounded-[4px] bg-clay-card"
        />
        <View className="flex-1 gap-[3px]">
          <View className="h-[18px] w-[70%] rounded-[4px] bg-clay-card" />
          <View className="h-[12px] w-[40%] rounded-[4px] bg-clay-card" />
          <View className="flex-row justify-between">
            <View className="h-[12px] w-[80px] rounded-[4px] bg-clay-card" />
            <View className="h-[14px] w-[40px] rounded-[4px] bg-clay-card" />
          </View>
        </View>
      </ClayCard>
    </Animated.View>
  );
}

export function LoadingState(): React.ReactElement {
  return (
    <View className="gap-[14px] px-[22px]">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}
