import { StyleSheet } from "react-native-unistyles";
import { Pressable, Text, ActivityIndicator } from "react-native";
import type { ViewStyle } from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "ghost" ? "#007AFF" : "#FFFFFF"} />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
    borderRadius: theme.radius.md,
  },
  button_primary: {
    backgroundColor: theme.colors.primary,
  },
  button_secondary: {
    backgroundColor: theme.colors.secondary,
  },
  button_ghost: {
    backgroundColor: "transparent",
  },
  button_sm: {
    height: 36,
  },
  button_md: {
    height: 48,
  },
  button_lg: {
    height: 56,
  },
  text: {
    fontWeight: "600",
  },
  text_primary: {
    color: theme.colors.text.inverse,
  },
  text_secondary: {
    color: theme.colors.text.inverse,
  },
  text_ghost: {
    color: theme.colors.primary,
  },
  text_sm: {
    fontSize: theme.fontSize.sm,
  },
  text_md: {
    fontSize: theme.fontSize.base,
  },
  text_lg: {
    fontSize: theme.fontSize.lg,
  },
  disabled: {
    opacity: 0.5,
  },
}));
