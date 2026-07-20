import { Pressable, View } from "react-native";

type ClayCardAs = "View" | "Pressable";
type ClayBorderWidth = "standard" | "emphasized";
type ClayShadow = "default" | "emphasized" | "none";
type ClayRadius = "card" | "button" | "modal";

interface ClayCardProps {
  as?: ClayCardAs;
  borderWidth?: ClayBorderWidth;
  shadow?: ClayShadow;
  radius?: ClayRadius;
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  testID?: string;
}

const borderClass: Record<ClayBorderWidth, string> = {
  standard: "border-clay",
  emphasized: "border-clay-emphasized",
};

const shadowClass: Record<ClayShadow, string> = {
  default: "shadow-clay",
  emphasized: "shadow-clay-emphasized",
  none: "",
};

const radiusClass: Record<ClayRadius, string> = {
  card: "rounded-clay",
  button: "rounded-clay-button",
  modal: "rounded-clay-modal",
};

export function ClayCard({
  as = "View",
  borderWidth = "emphasized",
  shadow = "default",
  radius: radiusKey = "card",
  className,
  children,
  onPress,
  testID,
}: ClayCardProps): React.ReactElement {
  const composed = `border ${borderClass[borderWidth]} ${shadowClass[shadow]} ${radiusClass[radiusKey]} ${className ?? ""}`;

  if (as === "Pressable") {
    return (
      <Pressable onPress={onPress} className={composed} testID={testID}>
        {children}
      </Pressable>
    );
  }
  return (
    <View className={composed} testID={testID}>
      {children}
    </View>
  );
}
