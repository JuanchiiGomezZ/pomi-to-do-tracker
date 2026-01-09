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
    lineHeight: 1.4,
  },
  variant_h1: {
    fontSize: theme.fontSize["3xl"],
    fontWeight: "bold",
  },
  variant_h2: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: "bold",
  },
  variant_h3: {
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
  },
  variant_h4: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
  },
  variant_body: {
    fontSize: theme.fontSize.base,
  },
  variant_bodySmall: {
    fontSize: theme.fontSize.sm,
  },
  variant_caption: {
    fontSize: theme.fontSize.xs,
  },
  variant_overline: {
    fontSize: 10,
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
