import { useForm, useAuth, GuestRoute } from "@/features/auth";
import {
  loginSchema,
  type LoginFormData,
} from "@/features/auth/schemas/auth.schema";
import { Controller } from "react-hook-form";
import { router } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { View } from "react-native";
import { Button, TextInput, Text } from "@/shared/components/ui";
import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher";

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ schema: loginSchema });

  const { login, isLoggingIn, loginError } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <GuestRoute>
      <View style={styles.container}>
        <Text variant="h1">Welcome Back</Text>
        <Text variant="body" color="secondary">
          Sign in to continue
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              placeholder="Enter your password"
              error={errors.password?.message}
            />
          )}
        />

        {loginError && (
          <Text variant="caption" color="error" style={styles.error}>
            {loginError.message}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoggingIn}
            style={styles.button}
          />
        </View>

        <View style={styles.linkContainer}>
          <Text variant="body" color="primary">
            Dont have an account?{" "}
          </Text>
          <Text
            variant="body"
            color="primary"
            onPress={() => router.push("/(auth)/register")}
          >
            Sign Up
          </Text>
        </View>
      </View>
    </GuestRoute>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing(6), // 24px
    backgroundColor: theme.colors.background,
  },
  buttonContainer: {
    marginTop: theme.spacing(2), // 8px
  },
  button: {
    width: "100%",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(6), // 24px
  },
  error: {
    marginBottom: theme.spacing(3),
    textAlign: "center",
  },
}));
