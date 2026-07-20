import { useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "../../components/BottomNav";
import { BookProgressList } from "../../components/BookProgressList";
import { EmptyState } from "../../components/EmptyState";
import { HomeHeader } from "../../components/HomeHeader";
import { LoadingState } from "../../components/LoadingState";
import { StatusSummary } from "../../components/StatusSummary";
import { mockBooks, mockCounts } from "../../data/mock-books";

type HomeState = "loading" | "empty" | "ready";

export default function HomeScreen(): React.ReactElement {
  const [state, setState] = useState<HomeState>("ready");

  const cycleState = () => {
    setState((prev) => (prev === "ready" ? "empty" : prev === "empty" ? "loading" : "ready"));
  };

  return (
    <SafeAreaView className="flex-1 bg-clay-bg" edges={["top", "bottom"]}>
      <ScrollView className="flex-1" contentContainerClassName="gap-[20px] pb-[16px]">
        <Pressable onLongPress={cycleState}>
          <HomeHeader />
        </Pressable>
        <StatusSummary finished={mockCounts.finished} inProgress={mockCounts.inProgress} />
        {state === "ready" && <BookProgressList books={mockBooks} />}
        {state === "empty" && <EmptyState />}
        {state === "loading" && <LoadingState />}
      </ScrollView>
      <BottomNav activeTab="main" />
    </SafeAreaView>
  );
}
