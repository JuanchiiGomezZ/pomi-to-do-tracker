import { useEffect } from "react";
import { router, useRootNavigationState } from "expo-router";
import {
  useAuthStore,
  selectIsAuthenticated,
} from "@/features/auth/stores/auth.store";
import { ScreenWrapper } from "@/shared/components/ui";

export default function Index() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Wait for navigation to be ready before redirecting
    if (!rootNavigationState?.key) return;

    // Redirect based on auth state after loading
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/(tool)/dashboard");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, isAuthenticated, rootNavigationState?.key]);

  return <ScreenWrapper loading centered />;
}
