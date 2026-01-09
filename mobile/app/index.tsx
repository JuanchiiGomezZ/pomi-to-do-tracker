import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore, selectIsAuthenticated } from '@/features/auth/stores/auth.store';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Redirect based on auth state after loading
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tool)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
