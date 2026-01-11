# Mobile: State Management

## Stack

- **Client State:** Zustand
- **Server State:** TanStack Query (React Query)
- **Form State:** React Hook Form
- **Storage:** MMKV + Expo SecureStore

## State Categories

```
┌─────────────────────────────────────────────────┐
│ Client State (Zustand)                          │
│ - Authentication state                          │
│ - UI state (modals, themes)                     │
│ - User preferences                              │
│ - Persistent storage with SecureStore           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Server State (TanStack Query)                   │
│ - User data from API                            │
│ - Cached API responses                          │
│ - Automatic refetching                          │
│ - Background updates                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Form State (React Hook Form)                    │
│ - Input values                                  │
│ - Validation errors                             │
│ - Form submission state                         │
└─────────────────────────────────────────────────┘
```

## Zustand (Client State)

### Auth Store Example

**File:** `mobile/src/features/auth/stores/auth.store.ts`

```typescript
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import type { User } from '../types/auth.types';
import { STORAGE_KEYS } from '@/constants';

// Custom storage for SecureStore
const createSecureStorage = () => ({
  getItem: async (name: string): Promise<string | null> => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
});

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createSecureStorage()),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for better performance
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectAuthActions = (state: AuthState) => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  setToken: state.setToken,
  setLoading: state.setLoading,
});
```

**Usage in components:**
```typescript
import { useAuthStore, selectIsAuthenticated } from '@/features/auth/stores/auth.store';

function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <View>
      <Text>{user?.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## TanStack Query (Server State)

### Query Hook Pattern

**File:** `mobile/src/features/auth/hooks/useAuth.ts`

```typescript
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants';
import { authApi } from '../services/auth.service';
import { useAuthStore, selectIsAuthenticated } from '../stores/auth.store';
import type { User } from '../types/auth.types';

// Query Keys
export const authQueryKeys = {
  all: ['auth'] as const,
  me: ['auth', 'me'] as const,
};

// Navigate to login
const navigateToLogin = () => {
  router.replace('/(auth)/login' as const);
};

// Navigate to dashboard
const navigateToDashboard = () => {
  router.replace('/(tool)/dashboard' as const);
};

export function useLogin() {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      login(data.user, data.accessToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      navigateToDashboard();
    },
    onError: (error) => {
      throw new Error(error.response?.data?.message || 'An error occurred');
    },
  });
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return useQuery<User>({
    queryKey: authQueryKeys.me,
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Usage in Components

```typescript
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });
}

function UsersList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <UserCard user={item} />}
    />
  );
}
```

### Mutation with Optimistic Update

```typescript
export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.toggle(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

## Selectors

### Why Use Selectors

```typescript
// ❌ Bad - Re-renders on any state change
const user = useAuthStore((state) => state);

// ✅ Good - Only re-renders when specific data changes
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore(selectIsAuthenticated);
```

### Memoized Selectors

```typescript
import { createSelector } from '@tanstack/react-query';

// For complex derived state
const selectUserDisplayName = createSelector(
  [(state: AuthState) => state.user],
  (user) => user ? `${user.firstName} ${user.lastName}` : 'Guest'
);
```

## Storage Pattern

### SecureStore for Sensitive Data

```typescript
import * as SecureStore from 'expo-secure-store';

async function storeToken(token: string) {
  await SecureStore.setItemAsync('access_token', token);
}

async function getToken() {
  return await SecureStore.getItemAsync('access_token');
}

async function deleteToken() {
  await SecureStore.deleteItemAsync('access_token');
}
```

### MMKV for Non-Sensitive Data

```typescript
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'app-storage',
  encryptionKey: 'optional-encryption-key',
});

storage.set('theme', 'dark');
const theme = storage.getString('theme');
storage.delete('theme');
```

## Best Practices

### ✅ DO

- Use Zustand for client state
- Use React Query for server state
- Create custom storage for SecureStore
- Use selectors to prevent re-renders
- Invalidate queries after mutations
- Handle loading and error states
- Implement optimistic updates for better UX

### ❌ DON'T

- Store server data in Zustand
- Put form state in global store
- Create one massive store
- Forget to handle error states
- Over-fetch data
- Duplicate state across stores
- Store sensitive data in MMKV
