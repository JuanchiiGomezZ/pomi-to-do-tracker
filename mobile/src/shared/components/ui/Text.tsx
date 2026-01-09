import { StyleSheet } from "react-native-unistyles";
import { Text as RNText } from "react-native";
import type { TextStyle } from "react-native";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "body" | "bodySmall" | "caption" | "overline";
type TextColor = "primary" | "secondary" | "tertiary" | "inverse" | "muted" | "success" | "warning" | "error";

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  style?: TextStyle;
  numberOfLines?: number;
  selectable?: boolean;
  onPress?: () => void;
}

export function Text({
  children,
  variant = "body",
  color = "primary",
  style,
  numberOfLines,
  selectable = false,
  onPress,
}: TextProps) {
  return (
    <RNText
      style={[styles.text, styles[`variant_${variant}`], styles[`color_${color}`], style]}
      numberOfLines={numberOfLines}
      selectable={selectable}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create((theme) => ({
  text: {
    // lineHeight in RN must be absolute pixels, not multiplier
    // It's set per variant below
  },
  variant_h1: {
    fontSize: theme.fontSize["3xl"],
    lineHeight: theme.fontSize["3xl"] * 1.3,
    fontWeight: "bold",
  },
  variant_h2: {
    fontSize: theme.fontSize["2xl"],
    lineHeight: theme.fontSize["2xl"] * 1.3,
    fontWeight: "bold",
  },
  variant_h3: {
    fontSize: theme.fontSize.xl,
    lineHeight: theme.fontSize.xl * 1.3,
    fontWeight: "bold",
  },
  variant_h4: {
    fontSize: theme.fontSize.lg,
    lineHeight: theme.fontSize.lg * 1.3,
    fontWeight: "bold",
  },
  variant_body: {
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * 1.5,
  },
  variant_bodySmall: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
  },
  variant_caption: {
    fontSize: theme.fontSize.xs,
    lineHeight: theme.fontSize.xs * 1.5,
  },
  variant_overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500",
  },
  color_primary: {
    color: theme.colors.text.primary,
  },
  color_secondary: {
    color: theme.colors.text.secondary,
  },
  color_tertiary: {
    color: theme.colors.text.tertiary,
  },
  color_inverse: {
    color: theme.colors.text.inverse,
  },
  color_muted: {
    color: theme.colors.text.muted,
  },
  color_success: {
    color: theme.colors.success,
  },
  color_warning: {
    color: theme.colors.warning,
  },
  color_error: {
    color: theme.colors.error,
  },
}));
