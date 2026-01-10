# Toast Notifications System Design

**Date:** 2026-01-10
**Status:** Approved
**Author:** Design Brainstorming Session

## Overview

Implementation of a custom toast notification system for the mobile React Native app using `react-native-toast-message` with full theme integration, i18n support, and haptic feedback.

## Requirements

### Toast Types (6 total)

1. **Success** - Positive confirmations (green)
2. **Error** - Critical errors (red)
3. **Warning** - Important warnings (orange)
4. **Info** - Informational messages (blue)
5. **Primary** - Branded messages (brand blue)
6. **Loading** - In-progress operations (with spinner)

### Key Features

- **Theme Integration**: Uses Unistyles theme (colors, spacing, radius, fonts)
- **i18n Support**: Auto-detects translation keys or uses plain text
- **Flexible API**: Helper functions with sensible defaults, fully configurable
- **Visual Feedback**: Icons for each toast type
- **Swipe to Dismiss**: All toasts are swipeable
- **Configurable Duration**: Per-toast or use defaults
- **Top Positioning**: Slides down from top with custom animation

## Architecture

### Integration Points

**App Entry**
- Toast component rendered in `src/app/_layout.tsx` after all routes
- Positioned with high zIndex above all content

**Theme Integration**
- Custom toast configs consume Unistyles theme
- Colors, spacing, radius, fonts all from theme
- Automatically adapts to light/dark mode

**i18n Integration**
- Smart translation helper detects keys (format: `namespace.key`)
- Falls back to plain text if not a translation key
- Supports both translated and plain text messages

**Icon System**
- Uses existing `@expo/vector-icons` package
- 24x24 size (`theme.iconSizes.md`)

### File Structure

```
src/shared/
├── components/
│   └── ui/
│       └── Toast/
│           ├── index.ts              # Public exports
│           ├── Toast.tsx             # Component wrapper
│           ├── toastConfig.tsx       # Custom toast layouts
│           └── toastHelpers.ts       # i18n utilities & show helpers
└── locales/
    ├── en/
    │   └── toast.json               # Toast-specific translations
    └── es/
        └── toast.json
```

## Visual Design

### Toast Layout Structure

Each toast consists of:

**Container**
- Rounded corners: `theme.radius.md` (12px)
- Subtle shadow for elevation
- Padding: `theme.spacing(3)` (12px)
- Background: Semi-transparent based on type

**Left Border**
- 4px thick colored border
- Color matches toast type (success/error/warning/info/primary)

**Icon Section**
- 24x24 icon (`theme.iconSizes.md`)
- Color matches toast type
- Icons:
  - Success: checkmark (Ionicons `checkmark-circle`)
  - Error: X (Ionicons `close-circle`)
  - Warning: warning (Ionicons `warning`)
  - Info: info (Ionicons `information-circle`)
  - Primary: star (Ionicons `star`)
  - Loading: spinner (ActivityIndicator)

**Content Section**
- **Title**: Main message
  - Font: Poppins Medium
  - Size: `theme.fontSize.base` (16px)
  - Color: `theme.colors.text.primary`
- **Message**: Optional subtitle/description
  - Font: Poppins Regular
  - Size: `theme.fontSize.sm` (14px)
  - Color: `theme.colors.text.secondary`

**Close Button** (optional)
- Small X button on the right
- Only shown for toasts that don't auto-dismiss
- Tappable area: 32x32

### Toast Type Colors

Using existing theme semantic colors:

| Type    | Border Color           | Background Color                    |
|---------|------------------------|-------------------------------------|
| Success | `theme.colors.success` | success with 10% opacity            |
| Error   | `theme.colors.error`   | error with 10% opacity              |
| Warning | `theme.colors.warning` | warning with 10% opacity            |
| Info    | `theme.colors.info`    | info with 10% opacity               |
| Primary | `theme.colors.primary` | primary with 10% opacity            |
| Loading | N/A (no border)        | `theme.colors.muted`                |

### Default Durations

- **Success**: 3000ms (3 seconds)
- **Error**: 5000ms (5 seconds)
- **Warning**: 5000ms (5 seconds)
- **Info**: 3000ms (3 seconds)
- **Primary**: 3000ms (3 seconds)
- **Loading**: 0 (indefinite - must be manually dismissed)

All toasts are swipeable to dismiss early.

## i18n Integration

### Translation Detection

Smart translation helper that:
1. Checks if string contains a dot (e.g., `"auth.login_success"`)
2. Attempts translation using i18next
3. Falls back to original string if:
   - Translation not found
   - String is plain text (no dot)

### Translation Key Format

```
namespace.key
```

Examples:
- `auth.login_success`
- `toast.error_generic`
- `dashboard.welcome_back`

### Locale Files

Add `toast.json` to both `en/` and `es/`:

```json
{
  "success_generic": "Success!",
  "error_generic": "Something went wrong",
  "warning_generic": "Warning",
  "info_generic": "Info",
  "loading_generic": "Loading..."
}
```

## Helper API

### Simple Usage

```typescript
import { toast } from '@shared/components/ui/Toast';

// With translation key
toast.success('auth.login_success');

// With plain text
toast.error('Something went wrong!');

// With custom duration
toast.warning('auth.session_expiring', { duration: 6000 });
```

### Advanced Usage

```typescript
// With title and message
toast.info({
  title: 'auth.update_available',
  message: 'auth.update_description',
  duration: 5000
});

// Loading toast (must be dismissed manually)
const loadingId = toast.loading('common.saving');
// Later...
toast.hide(loadingId);

// Primary branded messages
toast.primary({
  title: 'dashboard.welcome_back',
  message: 'dashboard.last_login'
});

// Mix translation keys and plain text
toast.success({
  title: 'auth.login_success',
  message: 'Welcome back, John!'
});
```

### Helper Function Signatures

```typescript
interface ToastOptions {
  title?: string;
  message?: string;
  duration?: number;
}

// String shorthand (title only)
toast.success(title: string, options?: Omit<ToastOptions, 'title'>): void;
toast.error(title: string, options?: Omit<ToastOptions, 'title'>): void;
toast.warning(title: string, options?: Omit<ToastOptions, 'title'>): void;
toast.info(title: string, options?: Omit<ToastOptions, 'title'>): void;
toast.primary(title: string, options?: Omit<ToastOptions, 'title'>): void;
toast.loading(title: string, options?: Omit<ToastOptions, 'title'>): string; // returns toast ID

// Object form (full options)
toast.success(options: ToastOptions): void;
toast.error(options: ToastOptions): void;
toast.warning(options: ToastOptions): void;
toast.info(options: ToastOptions): void;
toast.primary(options: ToastOptions): void;
toast.loading(options: ToastOptions): string; // returns toast ID

// Hide/dismiss
toast.hide(toastId?: string): void; // Hide specific toast or all toasts
```

## Implementation Files

### 1. toastConfig.tsx

Defines custom toast layouts:

**BaseToast Component**
- Used for: success, error, warning, info, primary
- Props: type, title, message, onClose
- Renders: colored border, icon, title, optional message, optional close button
- Uses: `useStyles()` hook for theme access

**LoadingToast Component**
- Used for: loading type
- Props: title, message
- Renders: spinner (ActivityIndicator), title, optional message
- No border, muted background

**Config Export**
```typescript
export const toastConfig = {
  success: (props) => <BaseToast type="success" {...props} />,
  error: (props) => <BaseToast type="error" {...props} />,
  warning: (props) => <BaseToast type="warning" {...props} />,
  info: (props) => <BaseToast type="info" {...props} />,
  primary: (props) => <BaseToast type="primary" {...props} />,
  loading: (props) => <LoadingToast {...props} />
};
```

### 2. toastHelpers.ts

Translation and helper functions:

**translateText Function**
```typescript
function translateText(text: string): string {
  // Detect if looks like translation key (contains dot)
  if (text.includes('.')) {
    const translated = i18n.t(text);
    // If translation found, use it; otherwise use original
    return translated !== text ? translated : text;
  }
  return text;
}
```

**Helper Functions**
- Each helper (success, error, etc.) calls `Toast.show()` with:
  - Type-specific defaults
  - Translated title/message
  - Custom or default duration
  - Position: 'top'
  - Swipeable: true

### 3. Toast.tsx

Simple wrapper:
```typescript
import ToastComponent from 'react-native-toast-message';
import { toastConfig } from './toastConfig';

export const Toast = () => (
  <ToastComponent config={toastConfig} />
);
```

### 4. index.ts

Public exports:
```typescript
export { Toast } from './Toast';
export { toast } from './toastHelpers';
```

## App Integration

### _layout.tsx

Add Toast component after all content:

```typescript
import { Toast } from '@shared/components/ui/Toast';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {/* existing app content */}
        <Slot />

        {/* Toast at the end, renders on top */}
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

### Update i18n config

Add toast namespace to `src/shared/i18n/config.ts`:

```typescript
const resources = {
  en: {
    common: commonEN,
    auth: authEN,
    dashboard: dashboardEN,
    settings: settingsEN,
    toast: toastEN, // Add this
  },
  es: {
    common: commonES,
    auth: authES,
    dashboard: dashboardES,
    settings: settingsES,
    toast: toastES, // Add this
  },
};

// Update namespaces
i18n.init({
  // ...
  defaultNS: "common",
  ns: ["common", "auth", "dashboard", "settings", "toast"], // Add toast
});
```

## Animation & Behavior

**Entrance Animation**
- Slide down from top
- Duration: 300ms
- Easing: ease-out

**Exit Animation**
- Slide up (when swiped up)
- Fade out (when auto-dismissed)
- Duration: 200ms

**Positioning**
- Top: 60px from screen top (below status bar)
- Horizontal margins: 16px (`theme.spacing(4)`)
- Max width: Screen width - 32px

**Swipe Behavior**
- Swipe up to dismiss
- Threshold: 20px
- All toast types are swipeable

## Testing Checklist

- [ ] All 6 toast types render correctly
- [ ] Light/dark theme switching works
- [ ] Translation keys are detected and translated
- [ ] Plain text messages work without translation
- [ ] Custom durations override defaults
- [ ] Loading toast stays until manually dismissed
- [ ] Swipe to dismiss works on all types
- [ ] Icons display correctly for each type
- [ ] Title and message both support i18n
- [ ] Multiple toasts can be shown simultaneously
- [ ] toast.hide() dismisses specific toast
- [ ] toast.hide() with no ID dismisses all toasts

## Usage Examples

### Authentication Flow

```typescript
// Login success
toast.success('auth.login_success');

// Login error
toast.error('auth.invalid_credentials');

// Session expiring warning
toast.warning({
  title: 'auth.session_expiring',
  message: 'auth.please_save_work',
  duration: 8000
});
```

### Data Operations

```typescript
// Saving data
const saveToast = toast.loading('common.saving');

try {
  await saveData();
  toast.hide(saveToast);
  toast.success('common.save_success');
} catch (error) {
  toast.hide(saveToast);
  toast.error('common.save_error');
}
```

### Branded Messages

```typescript
// Welcome message
toast.primary({
  title: 'dashboard.welcome_back',
  message: 'dashboard.daily_tip'
});
```

## Dependencies

- `react-native-toast-message`: ^2.2.0 (to be installed)
- `@expo/vector-icons`: Already installed
- `react-native-reanimated`: Already installed (used by toast library)
- `react-native-gesture-handler`: Already installed (for swipe)

## Migration Path

1. Install dependency
2. Create Toast component files
3. Add toast locale files (en/es)
4. Update i18n config
5. Integrate Toast in _layout.tsx
6. Replace any existing toast/alert implementations
7. Test all toast types in both themes
8. Document usage in team wiki/docs

## Future Enhancements (Out of Scope)

- Haptic feedback integration (can be added later)
- Sound effects (optional)
- Toast queue management (library handles this)
- Custom positions (bottom toasts)
- Action buttons in toasts
- Progress bars for loading toasts
