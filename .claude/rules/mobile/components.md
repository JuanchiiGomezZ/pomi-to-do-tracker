# Mobile: Components

## UI Library Stack

- **Base:** React Native 0.81
- **Styling:** Unistyles
- **Icons:** Custom Icon component (wrapper around @expo/vector-icons/MaterialCommunityIcons)
- **Lists:** Flash List
- **Bottom Sheets:** @gorhom/bottom-sheet
- **Forms:** React Hook Form + Zod

## Base UI Components

Location: `mobile/src/shared/components/ui/`

### TextInput Component

**File:** `mobile/src/shared/components/ui/TextInput.tsx`

```typescript
import { StyleSheet } from "react-native-unistyles";
import { TextInput as RNTextInput, View, Text } from "react-native";
import { useState, forwardRef } from "react";
import type { TextInputProps as RNTextInputProps, ViewStyle, TextStyle } from "react-native";

type TextInputVariant = "default" | "outlined";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  error?: string;
  variant?: TextInputVariant;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  function TextInput({ label, error, variant = "default", containerStyle, inputStyle, ...props }, ref) {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {props.required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <RNTextInput
          ref={ref}
          style={[
            styles.input,
            styles[`input_${variant}`],
            isFocused && styles.input_focused,
            error && styles.input_error,
            inputStyle,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#999999"
          {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.spacing(4),
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing(2),
  },
  required: {
    color: theme.colors.error,
  },
  input: {
    height: 56,
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(3),
    borderRadius: theme.radius.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
  },
  input_default: {
    backgroundColor: theme.colors.muted,
  },
  input_outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input_focused: {
    borderColor: theme.colors.primary,
  },
  input_error: {
    borderColor: theme.colors.error,
  },
  error: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));
```

**Usage:**
```typescript
import { TextInput } from '@/shared/components/ui/TextInput';

<TextInput
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email?.message}
  required
/>
```

## Flash List (Efficient Lists)

**File:** `mobile/src/features/users/components/UserList.tsx`

```typescript
import { FlashList } from '@shopify/flash-list';
import { Text, View, StyleSheet } from 'react-native';
import type { User } from '../types/users.types';

interface UserListProps {
  users: User[];
  onUserPress: (userId: string) => void;
}

export function UserList({ users, onUserPress }: UserListProps) {
  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity onPress={() => onUserPress(item.id)}>
      <View style={styles.userCard}>
        <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlashList
      data={users}
      renderItem={renderItem}
      estimatedItemSize={80}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text>No users found</Text>}
      onEndReached={() => loadMore()}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  userCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
```

## Bottom Sheet

**File:** `mobile/src/features/tasks/components/TaskBottomSheet.tsx`

```typescript
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface TaskBottomSheetProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function TaskBottomSheet({ children, onClose }: TaskBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresent = () => {
    bottomSheetRef.current?.present();
  };

  const handleDismiss = () => {
    bottomSheetRef.current?.dismiss();
    onClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      onDismiss={handleDismiss}
      snapPoints={['50%', '75%', '90%']}
      index={1}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});
```

## Toast Notifications

**File:** `mobile/src/shared/components/ui/Toast/ToastProvider.tsx`

```typescript
import Toast, { type ToastConfig } from 'react-native-toast-message';

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.toast}>
      <Text style={styles.title}>{text1}</Text>
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={[styles.toast, styles.error]}>
      <Text style={styles.title}>{text1}</Text>
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  ),
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  error: {
    backgroundColor: '#FF3B30',
  },
  title: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  message: {
    marginTop: 4,
    color: '#FFFFFF',
  },
});
```

## Icon Component

**File:** `mobile/src/shared/components/ui/Icon.tsx`

```typescript
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useUnistyles } from "react-native-unistyles";

type MaterialCommunityIconsProps = ComponentProps<typeof MaterialCommunityIcons>;
export type IconName = MaterialCommunityIconsProps["name"];

export type IconColor =
  | "text"
  | "primary"
  | "muted"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "foreground"
  | "background";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface IconProps extends Omit<MaterialCommunityIconsProps, "color" | "size"> {
  color?: IconColor;
  size?: IconSize;
  /** Adds a rounded background with the same color at 15% opacity */
  withBackground?: boolean;
}

export function Icon({
  color = "text",
  size = "md",
  withBackground = false,
  ...props
}: IconProps) {
  const { theme } = useUnistyles();
  const colorValue = theme.colors[color] as string;
  const sizeValue = theme.iconSizes[size];

  const padding = withBackground ? sizeValue * 0.35 : 0;

  return (
    <MaterialCommunityIcons
      color={colorValue}
      size={sizeValue}
      style={
        withBackground
          ? {
              backgroundColor: `${colorValue}26`,
              borderRadius: (sizeValue + padding * 2) / 2,
              padding,
            }
          : undefined
      }
      {...props}
    />
  );
}
```

**Usage:**
```typescript
import { Icon } from '@/shared/components/ui/Icon';

// Different colors
<Icon name="home" color="text" />
<Icon name="home" color="primary" />
<Icon name="home" color="success" />
<Icon name="home" color="error" />

// Different sizes
<Icon name="settings" size="sm" />
<Icon name="settings" size="md" />
<Icon name="settings" size="lg" />

// With background
<Icon name="check" color="success" withBackground />

// Navigation usage
<Icon
  name="log-out-outline"
  color="error"
  size="lg"
  onPress={handleLogout}
/>
```

## Styling with Unistyles

**Usage in components:**

```typescript
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing(4),
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(4),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing(3),
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
}));
```

## Best Practices

### ✅ DO

- Use Unistyles for consistent theming
- Create reusable base components
- Use Flash List for long lists
- Keep components under 200 lines
- Extract logic to custom hooks
- Use TypeScript for props
- Follow platform conventions

### ❌ DON'T

- Use inline styles
- Create wrapper components unnecessarily
- Mix feature logic with UI components
- Forget to handle loading/error states
- Duplicate component code
