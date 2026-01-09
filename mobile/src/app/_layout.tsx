import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Providers from './providers';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
