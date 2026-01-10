import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useUnistyles } from "react-native-unistyles";

type MaterialCommunityIconsProps = ComponentProps<
  typeof MaterialCommunityIcons
>;
export type IconName = MaterialCommunityIconsProps["name"];

type IconColor =
  | "text"
  | "primary"
  | "muted"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "foreground"
  | "background";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface IconProps
  extends Omit<MaterialCommunityIconsProps, "color" | "size"> {
  color?: IconColor;
  size?: IconSize;
}

const getColorValue = (
  color: IconColor,
  themeColors: {
    text: { primary: string };
    primary: string;
    muted: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    foreground: string;
    background: string;
  }
): string => {
  const colorMap: Record<IconColor, string> = {
    text: themeColors.text.primary,
    primary: themeColors.primary,
    muted: themeColors.muted,
    success: themeColors.success,
    warning: themeColors.warning,
    error: themeColors.error,
    info: themeColors.info,
    foreground: themeColors.foreground,
    background: themeColors.background,
  };

  return colorMap[color];
};

export function Icon({ color = "text", size = "md", ...props }: IconProps) {
  const { theme } = useUnistyles();
  const colorValue = getColorValue(color, theme.colors);
  const sizeValue = theme.iconSizes[size];

  return (
    <MaterialCommunityIcons color={colorValue} size={sizeValue} {...props} />
  );
}
