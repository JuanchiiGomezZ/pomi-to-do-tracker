# Mobile: Architecture

## Stack

- **Framework:** Expo 54 + React Native 0.81
- **Navigation:** Expo Router (file-based routing)
- **State Management:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Styling:** Unistyles
- **Internationalization:** i18next
- **Storage:** MMKV + Expo SecureStore
- **Lists:** Flash List

## Project Structure

```
mobile/
├── src/
│   ├── app/                    # Expo Router (file-based routing)
│   │   ├── (auth)/            # Auth layout group
│   │   ├── (tool)/            # Protected layout group
│   │   ├── +html.tsx          # HTML fallback
│   │   ├── _layout.tsx        # Root layout
│   │   ├── index.tsx          # Entry point
│   │   └── providers.tsx      # App providers
│   │
│   ├── features/              # Feature modules
│   │   └── auth/
│   │       ├── components/    # Feature-specific components
│   │       ├── hooks/         # Feature-specific hooks
│   │       ├── services/      # API services
│   │       ├── stores/        # Zustand stores
│   │       ├── types/         # TypeScript types
│   │       ├── schemas/       # Zod schemas
│   │       └── utils/         # Feature utilities
│   │
│   ├── shared/                # Shared resources
│   │   ├── components/
│   │   │   └── ui/            # Base UI components
│   │   ├── hooks/             # Shared hooks
│   │   ├── lib/               # API client
│   │   ├── utils/             # Helper functions
│   │   ├── i18n/              # i18n configuration
│   │   ├── locales/           # Translation files
│   │   └── styles/            # Unistyles themes
│   │
│   └── constants/             # App constants
│
├── android/                   # Android native code
├── ios/                       # iOS native code
├── app.json                   # Expo config
├── babel.config.js
└── tsconfig.json
```

## Navigation Structure

### File-Based Routing

**File:** `src/app/(tool)/dashboard.tsx`

```typescript
import { View, Text } from 'react-native';
import { useAuth } from '@/features/auth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <View>
      <Text>Welcome, {user?.email}</Text>
    </View>
  );
}
```

### Layout Groups

**Auth routes:** `src/app/(auth)/_layout.tsx`
```typescript
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
```

**Protected routes:** `src/app/(tool)/_layout.tsx`
```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ToolLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

## Theme System

**File:** `src/shared/styles/theme.ts`

```typescript
export const themes = {
  light: {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      text: {
        primary: '#000000',
        secondary: '#666666',
      },
      error: '#FF3B30',
      success: '#34C759',
      border: '#E5E5EA',
      muted: '#F2F2F7',
    },
    spacing: (n: number) => n * 4,
    fontSize: {
      sm: 12,
      base: 14,
      lg: 16,
      xl: 20,
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
    },
  },
  dark: {
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      background: '#000000',
      text: {
        primary: '#FFFFFF',
        secondary: '#8E8E93',
      },
      error: '#FF453A',
      success: '#30D158',
      border: '#38383A',
      muted: '#1C1C1E',
    },
    // ... same structure
  },
};
```

**Usage with Unistyles:**

```typescript
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing(4),
  },
  text: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
  },
}));
```

## Feature Module Pattern

Each feature contains everything related to that feature:

```
feature-name/
├── components/        # UI components
├── hooks/            # Custom hooks
├── services/         # API calls
├── stores/           # Zustand stores
├── types/            # TypeScript definitions
├── schemas/          # Zod validation schemas
├── utils/            # Helper functions
└── index.ts          # Public exports
```

**Benefits:**
- Co-location of related code
- Clear boundaries
- Easy to delete/move features
- Avoids circular dependencies

## Providers Setup

**File:** `src/app/providers.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UnistylesProvider } from 'react-native-unistyles';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UnistylesProvider>
        {children}
      </UnistylesProvider>
    </QueryClientProvider>
  );
}
```

## Constants

**File:** `src/constants/index.ts`

```typescript
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'app_theme',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;
```

## Environment Variables

**File:** `mobile/.env`

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Access in code:
```typescript
import { API_URL } from '@/constants';
```

## Best Practices

### ✅ DO

- Use Expo Router file-based routing
- Group related code in features
- Use Unistyles for consistent theming
- Keep components under 200 lines
- Extract logic to custom hooks
- Use TypeScript for all props

### ❌ DON'T

- Mix feature logic with UI components
- Use inline styles
- Forget to handle loading/error states
- Duplicate component code
- Skip prop type definitions
