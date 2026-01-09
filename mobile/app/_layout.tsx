import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Providers from './providers';

export default function RootLayout() {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tool)" />
      </Stack>
      <StatusBar style="auto" />
    </Providers>
  );
}
