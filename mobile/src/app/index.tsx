import { useEffect } from "react";
import { router } from "expo-router";
import {
  useAuthStore,
  selectIsAuthenticated,
} from "@/features/auth/stores/auth.store";
import { ScreenWrapper } from "@/shared/components/ui";

export default function Index() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Redirect based on auth state after loading
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/(tool)/dashboard");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, isAuthenticated]);

  return <ScreenWrapper loading centered />;
}
