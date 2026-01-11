# Mobile: API Integration

## Stack

- **HTTP Client:** Axios
- **State Management:** TanStack Query
- **Base URL:** Environment variable `EXPO_PUBLIC_API_URL`
- **Auth Storage:** Expo SecureStore

## API Configuration

**File:** `mobile/src/shared/lib/api.ts`

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL, STORAGE_KEYS } from '@/constants';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);

        if (refreshToken) {
          // Try to refresh tokens
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Store new tokens
          await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear storage and redirect to login
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
      }
    }

    return Promise.reject(error);
  }
);
```

## Service Layer Pattern

**File:** `mobile/src/features/auth/services/auth.service.ts`

```typescript
import { api } from '@/shared/lib/api';
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types/auth.types';

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },
};
```

## React Query Integration

**File:** `mobile/src/features/auth/hooks/useAuth.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants';
import { authApi } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';

// Error handler helper
const getErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: { message?: string } } };
  return err.response?.data?.message || 'An error occurred';
};

// Clear all auth storage
const clearAuthStorage = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
};

export function useLogin() {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      login(data.user, data.accessToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.replace('/(tool)/dashboard');
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          await authApi.logout(refreshToken);
        } catch {
          // Continue with logout even if server call fails
        }
      }
    },
    onSuccess: async () => {
      logout();
      await clearAuthStorage();
      await queryClient.clear();
      router.replace('/(auth)/login');
    },
  });
}
```

## Type Definitions

**File:** `mobile/src/features/auth/types/auth.types.ts`

```typescript
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  emailVerified: boolean;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

## Usage in Components

```typescript
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@/features/auth/hooks/useForm';
import { authSchema } from '@/features/auth/schemas/auth.schema';
import { TextInput } from '@/shared/components/ui/TextInput';
import Toast from 'react-native-toast-message';

export function LoginForm() {
  const loginMutation = useLogin();
  const form = useForm({
    schema: authSchema.login,
    defaultValues: { email: '', password: '' },
  });

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: (error as Error).message,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        label="Email"
        {...form.register('email')}
        error={form.errors.email?.message}
      />
      <TextInput
        label="Password"
        secureTextEntry
        {...form.register('password')}
        error={form.errors.password?.message}
      />
      <Button
        title="Login"
        onPress={form.handleSubmit(handleSubmit)}
        loading={loginMutation.isPending}
      />
    </Form>
  );
}
```

## Error Handling

```typescript
import Toast from 'react-native-toast-message';

function handleApiError(error: unknown): string {
  const axiosError = error as {
    response?: { data?: { message?: string }; status?: number };
    message?: string;
  };

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (axiosError.response?.status === 401) {
    return 'Session expired. Please login again.';
  }

  if (axiosError.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (axiosError.response?.status === 404) {
    return 'Resource not found.';
  }

  return axiosError.message || 'An unexpected error occurred.';
}

// Usage
try {
  await mutation.mutateAsync(data);
} catch (error) {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: handleApiError(error),
  });
}
```

## Request Cancellation

```typescript
import { useQuery, useAbortSignal } from '@tanstack/react-query';

export function useSearchUsers(query: string) {
  const abortSignal = useAbortSignal();

  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: async ({ signal }) => {
      const response = await api.get('/users/search', {
        params: { q: query },
        signal, // Pass AbortSignal to axios
      });
      return response.data;
    },
    enabled: query.length > 2, // Only search if query is long enough
  });
}
```

## Environment Variables

**File:** `mobile/.env`

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Access in code:**
```typescript
import { API_URL } from '@/constants';
```

## Best Practices

### ✅ DO

- Use service layer pattern
- Type all API responses
- Handle all error cases
- Use React Query for caching
- Show loading/error states
- Cancel requests when component unmounts
- Use environment variables for URLs
- Handle 401 with token refresh

### ❌ DON'T

- Make API calls directly in components
- Forget to handle errors
- Skip loading states
- Hardcode API URLs
- Duplicate API call logic
- Ignore network errors
- Store API data in global state
