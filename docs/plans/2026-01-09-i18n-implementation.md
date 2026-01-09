# Sistema i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar sistema completo de internacionalización con i18next, MMKV persistence, TypeScript type-safety y organización por namespaces para español e inglés.

**Architecture:** Sistema basado en i18next + react-i18next con detección automática de idioma del dispositivo, persistencia síncrona en MMKV, y organización modular por namespaces (common, auth, dashboard, settings). Type-safety completo mediante module augmentation de i18next.

**Tech Stack:** i18next, react-i18next, expo-localization, MMKV (ya instalado), TypeScript

---

## Task 1: Instalar Dependencias

**Files:**
- Modify: `mobile/package.json`

**Step 1: Instalar paquetes i18n**

```bash
cd mobile
npm install i18next react-i18next expo-localization
```

Expected output: Packages installed successfully

**Step 2: Verificar instalación**

```bash
npm list i18next react-i18next expo-localization
```

Expected: Shows installed versions

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add i18next, react-i18next, and expo-localization"
```

---

## Task 2: Crear Estructura de Carpetas y Archivos Base

**Files:**
- Create: `mobile/src/shared/i18n/` (directory)
- Create: `mobile/src/shared/locales/en/` (directory)
- Create: `mobile/src/shared/locales/es/` (directory)

**Step 1: Crear carpetas de i18n**

```bash
cd mobile/src/shared
mkdir -p i18n
mkdir -p locales/en
mkdir -p locales/es
```

**Step 2: Verificar estructura**

```bash
ls -la i18n/
ls -la locales/
```

Expected: Directories created

**Step 3: Commit estructura**

```bash
git add -A
git commit -m "feat(i18n): create folder structure for translations"
```

---

## Task 3: Crear Archivos de Traducción - common.json

**Files:**
- Create: `mobile/src/shared/locales/es/common.json`
- Create: `mobile/src/shared/locales/en/common.json`

**Step 1: Crear common.json en español**

File: `mobile/src/shared/locales/es/common.json`

```json
{
  "buttons": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "confirm": "Confirmar",
    "back": "Volver"
  },
  "labels": {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito"
  },
  "errors": {
    "required": "Este campo es requerido",
    "invalid_email": "Correo electrónico inválido",
    "network_error": "Error de conexión",
    "generic": "Ha ocurrido un error"
  }
}
```

**Step 2: Crear common.json en inglés**

File: `mobile/src/shared/locales/en/common.json`

```json
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "confirm": "Confirm",
    "back": "Back"
  },
  "labels": {
    "email": "Email",
    "password": "Password",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "errors": {
    "required": "This field is required",
    "invalid_email": "Invalid email",
    "network_error": "Connection error",
    "generic": "An error occurred"
  }
}
```

**Step 3: Commit archivos common**

```bash
git add src/shared/locales/
git commit -m "feat(i18n): add common translations for es and en"
```

---

## Task 4: Crear Archivos de Traducción - auth.json

**Files:**
- Create: `mobile/src/shared/locales/es/auth.json`
- Create: `mobile/src/shared/locales/en/auth.json`

**Step 1: Crear auth.json en español**

File: `mobile/src/shared/locales/es/auth.json`

```json
{
  "login": {
    "title": "Iniciar Sesión",
    "subtitle": "Ingresa tus credenciales para continuar",
    "button": "Entrar",
    "forgot_password": "¿Olvidaste tu contraseña?",
    "no_account": "¿No tienes cuenta?",
    "sign_up": "Regístrate",
    "email_placeholder": "correo@ejemplo.com",
    "password_placeholder": "Tu contraseña"
  },
  "register": {
    "title": "Crear Cuenta",
    "subtitle": "Completa tus datos para registrarte",
    "button": "Registrarse",
    "have_account": "¿Ya tienes cuenta?",
    "sign_in": "Inicia sesión",
    "first_name_placeholder": "Nombre",
    "last_name_placeholder": "Apellido"
  },
  "errors": {
    "invalid_credentials": "Credenciales inválidas",
    "email_exists": "El correo ya está registrado",
    "weak_password": "La contraseña es muy débil"
  }
}
```

**Step 2: Crear auth.json en inglés**

File: `mobile/src/shared/locales/en/auth.json`

```json
{
  "login": {
    "title": "Sign In",
    "subtitle": "Enter your credentials to continue",
    "button": "Login",
    "forgot_password": "Forgot your password?",
    "no_account": "Don't have an account?",
    "sign_up": "Sign up",
    "email_placeholder": "email@example.com",
    "password_placeholder": "Your password"
  },
  "register": {
    "title": "Create Account",
    "subtitle": "Fill in your details to register",
    "button": "Register",
    "have_account": "Already have an account?",
    "sign_in": "Sign in",
    "first_name_placeholder": "First name",
    "last_name_placeholder": "Last name"
  },
  "errors": {
    "invalid_credentials": "Invalid credentials",
    "email_exists": "Email already registered",
    "weak_password": "Password is too weak"
  }
}
```

**Step 3: Commit archivos auth**

```bash
git add src/shared/locales/
git commit -m "feat(i18n): add auth translations for es and en"
```

---

## Task 5: Crear Archivos de Traducción - dashboard.json

**Files:**
- Create: `mobile/src/shared/locales/es/dashboard.json`
- Create: `mobile/src/shared/locales/en/dashboard.json`

**Step 1: Crear dashboard.json en español**

File: `mobile/src/shared/locales/es/dashboard.json`

```json
{
  "title": "Panel Principal",
  "welcome": "Bienvenido",
  "stats": {
    "title": "Estadísticas",
    "total": "Total",
    "active": "Activos",
    "completed": "Completados"
  },
  "actions": {
    "refresh": "Actualizar",
    "view_all": "Ver todo"
  }
}
```

**Step 2: Crear dashboard.json en inglés**

File: `mobile/src/shared/locales/en/dashboard.json`

```json
{
  "title": "Dashboard",
  "welcome": "Welcome",
  "stats": {
    "title": "Statistics",
    "total": "Total",
    "active": "Active",
    "completed": "Completed"
  },
  "actions": {
    "refresh": "Refresh",
    "view_all": "View all"
  }
}
```

**Step 3: Commit archivos dashboard**

```bash
git add src/shared/locales/
git commit -m "feat(i18n): add dashboard translations for es and en"
```

---

## Task 6: Crear Archivos de Traducción - settings.json

**Files:**
- Create: `mobile/src/shared/locales/es/settings.json`
- Create: `mobile/src/shared/locales/en/settings.json`

**Step 1: Crear settings.json en español**

File: `mobile/src/shared/locales/es/settings.json`

```json
{
  "title": "Configuración",
  "sections": {
    "account": "Cuenta",
    "preferences": "Preferencias",
    "about": "Acerca de"
  },
  "account": {
    "profile": "Perfil",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "logout": "Cerrar sesión"
  },
  "preferences": {
    "language": "Idioma",
    "theme": "Tema",
    "notifications": "Notificaciones"
  },
  "about": {
    "version": "Versión",
    "terms": "Términos y condiciones",
    "privacy": "Política de privacidad"
  }
}
```

**Step 2: Crear settings.json en inglés**

File: `mobile/src/shared/locales/en/settings.json`

```json
{
  "title": "Settings",
  "sections": {
    "account": "Account",
    "preferences": "Preferences",
    "about": "About"
  },
  "account": {
    "profile": "Profile",
    "email": "Email",
    "password": "Password",
    "logout": "Log out"
  },
  "preferences": {
    "language": "Language",
    "theme": "Theme",
    "notifications": "Notifications"
  },
  "about": {
    "version": "Version",
    "terms": "Terms and conditions",
    "privacy": "Privacy policy"
  }
}
```

**Step 3: Commit archivos settings**

```bash
git add src/shared/locales/
git commit -m "feat(i18n): add settings translations for es and en"
```

---

## Task 7: Crear Plugin MMKV Storage para i18next

**Files:**
- Create: `mobile/src/shared/i18n/storage.ts`

**Step 1: Crear archivo storage.ts**

File: `mobile/src/shared/i18n/storage.ts`

```typescript
import { storage } from "@shared/utils/storage";
import { STORAGE_KEYS } from "@constants";
import { getLocales } from "expo-localization";

/**
 * MMKV Language Detector Plugin para i18next
 *
 * Detecta el idioma del usuario en este orden:
 * 1. Idioma guardado en MMKV (preferencia del usuario)
 * 2. Idioma del dispositivo (si está soportado)
 * 3. Fallback a español
 */
export const mmkvLanguageDetector = {
  type: "languageDetector" as const,
  async: false,
  init: () => {
    // No initialization needed
  },
  detect: (): string => {
    // 1. Intentar obtener idioma guardado en MMKV
    const savedLanguage = storage.getString(STORAGE_KEYS.LANGUAGE);
    if (savedLanguage) {
      console.log("[i18n] Using saved language:", savedLanguage);
      return savedLanguage;
    }

    // 2. Detectar idioma del dispositivo
    const deviceLocales = getLocales();
    const deviceLanguage = deviceLocales[0]?.languageCode || "es";

    // 3. Verificar si el idioma del dispositivo está soportado
    const supportedLanguages = ["en", "es"];
    const finalLanguage = supportedLanguages.includes(deviceLanguage)
      ? deviceLanguage
      : "es";

    console.log("[i18n] Device language:", deviceLanguage);
    console.log("[i18n] Using language:", finalLanguage);

    return finalLanguage;
  },
  cacheUserLanguage: (language: string): void => {
    console.log("[i18n] Saving language preference:", language);
    storage.set(STORAGE_KEYS.LANGUAGE, language);
  },
};
```

**Step 2: Verificar que compile**

```bash
cd mobile
npm run typecheck
```

Expected: No TypeScript errors

**Step 3: Commit plugin storage**

```bash
git add src/shared/i18n/storage.ts
git commit -m "feat(i18n): add MMKV language detector plugin"
```

---

## Task 8: Crear Configuración Principal de i18next

**Files:**
- Create: `mobile/src/shared/i18n/config.ts`

**Step 1: Crear archivo config.ts**

File: `mobile/src/shared/i18n/config.ts`

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { mmkvLanguageDetector } from "./storage";

// Import de traducciones (síncronas para mejor rendimiento en mobile)
import commonEN from "@shared/locales/en/common.json";
import authEN from "@shared/locales/en/auth.json";
import dashboardEN from "@shared/locales/en/dashboard.json";
import settingsEN from "@shared/locales/en/settings.json";

import commonES from "@shared/locales/es/common.json";
import authES from "@shared/locales/es/auth.json";
import dashboardES from "@shared/locales/es/dashboard.json";
import settingsES from "@shared/locales/es/settings.json";

/**
 * Recursos de traducción organizados por idioma y namespace
 */
const resources = {
  en: {
    common: commonEN,
    auth: authEN,
    dashboard: dashboardEN,
    settings: settingsEN,
  },
  es: {
    common: commonES,
    auth: authES,
    dashboard: dashboardES,
    settings: settingsES,
  },
} as const;

/**
 * Inicialización de i18next con configuración para React Native
 */
i18n
  .use(mmkvLanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    defaultNS: "common",
    ns: ["common", "auth", "dashboard", "settings"],

    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },

    react: {
      useSuspense: false, // Importante: evita problemas en React Native
    },

    compatibilityJSON: "v3", // Importante: compatibilidad con Android

    // Debug solo en desarrollo
    debug: __DEV__,
  });

export default i18n;
```

**Step 2: Verificar que compile**

```bash
npm run typecheck
```

Expected: No TypeScript errors

**Step 3: Commit configuración**

```bash
git add src/shared/i18n/config.ts
git commit -m "feat(i18n): add i18next configuration with MMKV integration"
```

---

## Task 9: Crear Tipos TypeScript para Type-Safety

**Files:**
- Create: `mobile/src/shared/i18n/types.ts`

**Step 1: Crear archivo types.ts**

File: `mobile/src/shared/i18n/types.ts`

```typescript
import "i18next";

// Import tipos de archivos de traducción
import type commonEN from "@shared/locales/en/common.json";
import type authEN from "@shared/locales/en/auth.json";
import type dashboardEN from "@shared/locales/en/dashboard.json";
import type settingsEN from "@shared/locales/en/settings.json";

/**
 * Module augmentation de i18next para type-safety completo
 *
 * Esto proporciona:
 * - Autocomplete de translation keys en VSCode
 * - Type checking de keys inválidas
 * - Inferencia de tipos en useTranslation
 */
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof commonEN;
      auth: typeof authEN;
      dashboard: typeof dashboardEN;
      settings: typeof settingsEN;
    };
  }
}
```

**Step 2: Verificar que compile**

```bash
npm run typecheck
```

Expected: No TypeScript errors

**Step 3: Commit tipos**

```bash
git add src/shared/i18n/types.ts
git commit -m "feat(i18n): add TypeScript type definitions for autocomplete"
```

---

## Task 10: Crear Barrel Export de i18n

**Files:**
- Create: `mobile/src/shared/i18n/index.ts`

**Step 1: Crear archivo index.ts**

File: `mobile/src/shared/i18n/index.ts`

```typescript
/**
 * i18n module exports
 *
 * Import config para inicializar i18next
 * Import types para type-safety
 */
import "./config";
import "./types";

export { default as i18n } from "./config";
export { mmkvLanguageDetector } from "./storage";
```

**Step 2: Commit barrel export**

```bash
git add src/shared/i18n/index.ts
git commit -m "feat(i18n): add barrel export for i18n module"
```

---

## Task 11: Actualizar Constants con LANGUAGE Key

**Files:**
- Modify: `mobile/src/constants/index.ts`

**Step 1: Leer archivo actual**

```bash
cat src/constants/index.ts
```

**Step 2: Agregar LANGUAGE a STORAGE_KEYS**

File: `mobile/src/constants/index.ts`

Find the STORAGE_KEYS constant and add LANGUAGE:

```typescript
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language', // ← ADD THIS LINE
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;
```

**Step 3: Verificar que compile**

```bash
npm run typecheck
```

Expected: No errors

**Step 4: Commit constants update**

```bash
git add src/constants/index.ts
git commit -m "feat(i18n): add LANGUAGE storage key to constants"
```

---

## Task 12: Crear Hook useLanguage

**Files:**
- Create: `mobile/src/shared/hooks/useLanguage.ts`

**Step 1: Crear archivo useLanguage.ts**

File: `mobile/src/shared/hooks/useLanguage.ts`

```typescript
import { useTranslation } from "react-i18next";
import { getLocales } from "expo-localization";

/**
 * Idiomas soportados en la aplicación
 */
export type Language = "en" | "es";

/**
 * Hook personalizado para gestión de idioma
 *
 * Proporciona:
 * - Idioma actual
 * - Función para cambiar idioma
 * - Idioma del dispositivo
 * - Helpers de verificación
 *
 * @example
 * const { currentLanguage, changeLanguage, isSpanish } = useLanguage();
 *
 * // Cambiar a inglés
 * changeLanguage('en');
 *
 * // Verificar idioma actual
 * if (isSpanish) {
 *   // Lógica específica para español
 * }
 */
export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;

  /**
   * Cambia el idioma de la aplicación
   * Persiste automáticamente en MMKV
   */
  const changeLanguage = async (language: Language) => {
    await i18n.changeLanguage(language);
  };

  /**
   * Obtiene el idioma del dispositivo
   */
  const deviceLanguage = (getLocales()[0]?.languageCode as Language) || "es";

  return {
    /** Idioma actual de la aplicación */
    currentLanguage,

    /** Función para cambiar el idioma */
    changeLanguage,

    /** Idioma detectado del dispositivo */
    deviceLanguage,

    /** true si el idioma actual es inglés */
    isEnglish: currentLanguage === "en",

    /** true si el idioma actual es español */
    isSpanish: currentLanguage === "es",
  };
}
```

**Step 2: Verificar que compile**

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit hook**

```bash
git add src/shared/hooks/useLanguage.ts
git commit -m "feat(i18n): add useLanguage hook for language management"
```

---

## Task 13: Actualizar Barrel Export de Hooks

**Files:**
- Modify: `mobile/src/shared/hooks/index.ts`

**Step 1: Leer archivo actual**

```bash
cat src/shared/hooks/index.ts
```

**Step 2: Agregar exports de useLanguage**

File: `mobile/src/shared/hooks/index.ts`

Add these lines:

```typescript
export { useLanguage } from "./useLanguage";
export type { Language } from "./useLanguage";
```

Complete file should look like:

```typescript
export { useTheme } from "./useTheme";
export type { ThemeMode } from "./useTheme";
export { useLanguage } from "./useLanguage";
export type { Language } from "./useLanguage";
```

**Step 3: Verificar que compile**

```bash
npm run typecheck
```

Expected: No errors

**Step 4: Commit hook exports**

```bash
git add src/shared/hooks/index.ts
git commit -m "feat(i18n): export useLanguage hook"
```

---

## Task 14: Integrar i18n en Providers

**Files:**
- Modify: `mobile/src/app/providers.tsx`

**Step 1: Agregar import de i18n al inicio del archivo**

File: `mobile/src/app/providers.tsx`

Add this import at the TOP of the file (line 1 or 2):

```typescript
import "@shared/i18n"; // Inicializar i18next
```

Complete imports section should look like:

```typescript
import "@shared/i18n"; // Inicializar i18next
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ... rest of imports
```

**Step 2: Verificar que compile**

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Test en dispositivo/simulador**

```bash
npm start
```

Open app and check console for i18n initialization logs:
- "[i18n] Using saved language:" or "[i18n] Device language:"

**Step 4: Commit integration**

```bash
git add src/app/providers.tsx
git commit -m "feat(i18n): integrate i18next in app providers"
```

---

## Task 15: Crear Componente LanguageSwitcher

**Files:**
- Create: `mobile/src/shared/components/LanguageSwitcher.tsx`

**Step 1: Crear archivo LanguageSwitcher.tsx**

File: `mobile/src/shared/components/LanguageSwitcher.tsx`

```typescript
import { View, Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "./ui/Text";
import { useLanguage, type Language } from "@shared/hooks";

interface LanguageSwitcherProps {
  variant?: "toggle" | "selector";
}

/**
 * Language Switcher Component
 *
 * @example Toggle variant (simple switch)
 * <LanguageSwitcher variant="toggle" />
 *
 * @example Selector variant (full options with radio buttons)
 * <LanguageSwitcher variant="selector" />
 */
export function LanguageSwitcher({ variant = "selector" }: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage } = useLanguage();

  if (variant === "toggle") {
    const toggleLanguage = () => {
      changeLanguage(currentLanguage === "en" ? "es" : "en");
    };

    return (
      <Pressable style={styles.toggleButton} onPress={toggleLanguage}>
        <Text variant="body">
          {currentLanguage === "en" ? "🇺🇸 English" : "🇪🇸 Español"}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h4" style={styles.title}>
        Idioma / Language
      </Text>

      <View style={styles.optionsContainer}>
        <LanguageOption
          label="🇪🇸 Español"
          description="Español"
          isSelected={currentLanguage === "es"}
          onPress={() => changeLanguage("es")}
        />

        <LanguageOption
          label="🇺🇸 English"
          description="English"
          isSelected={currentLanguage === "en"}
          onPress={() => changeLanguage("en")}
        />
      </View>
    </View>
  );
}

interface LanguageOptionProps {
  label: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
}

function LanguageOption({ label, description, isSelected, onPress }: LanguageOptionProps) {
  return (
    <Pressable
      style={[styles.option, isSelected && styles.optionSelected]}
      onPress={onPress}
    >
      <View style={styles.optionContent}>
        <Text variant="body" color={isSelected ? "primary" : "secondary"}>
          {label}
        </Text>
        <Text variant="caption" color="tertiary">
          {description}
        </Text>
      </View>

      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  optionsContainer: {
    gap: theme.spacing(2),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(4),
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.muted,
  },
  optionContent: {
    gap: theme.spacing(1),
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  toggleButton: {
    padding: theme.spacing(3),
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
}));
```

**Step 2: Verificar que compile**

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit component**

```bash
git add src/shared/components/LanguageSwitcher.tsx
git commit -m "feat(i18n): add LanguageSwitcher component with toggle and selector variants"
```

---

## Task 16: Agregar LanguageSwitcher a Settings Screen

**Files:**
- Modify: `mobile/src/app/(tool)/settings.tsx`

**Step 1: Leer archivo actual**

```bash
cat src/app/\(tool\)/settings.tsx
```

**Step 2: Importar LanguageSwitcher**

Add import at the top:

```typescript
import { LanguageSwitcher } from "@shared/components/LanguageSwitcher";
```

**Step 3: Agregar LanguageSwitcher al layout**

Add LanguageSwitcher component in the appropriate location (after ThemeSwitcher if exists, or in preferences section):

```typescript
<View style={styles.section}>
  <LanguageSwitcher variant="selector" />
</View>
```

**Step 4: Test en simulador**

```bash
npm start
```

Navigate to Settings screen and verify:
- LanguageSwitcher renders correctly
- Clicking options changes language
- Selection persists after app restart

**Step 5: Commit integration**

```bash
git add src/app/\(tool\)/settings.tsx
git commit -m "feat(i18n): add LanguageSwitcher to settings screen"
```

---

## Task 17: Migrar Login Screen a i18n (Ejemplo)

**Files:**
- Modify: `mobile/src/app/(auth)/login.tsx`

**Step 1: Leer archivo actual de login**

```bash
cat src/app/\(auth\)/login.tsx
```

**Step 2: Importar useTranslation**

Add import at the top:

```typescript
import { useTranslation } from "react-i18next";
```

**Step 3: Usar hook useTranslation en el componente**

Inside the component function:

```typescript
const { t } = useTranslation('auth');
```

**Step 4: Reemplazar textos hardcodeados con t()**

Replace hardcoded strings with translation keys:

BEFORE:
```typescript
<Text variant="h1">Iniciar Sesión</Text>
<Text variant="body">Ingresa tus credenciales</Text>
```

AFTER:
```typescript
<Text variant="h1">{t('login.title')}</Text>
<Text variant="body">{t('login.subtitle')}</Text>
```

For all strings in the login screen:
- Title → `{t('login.title')}`
- Subtitle → `{t('login.subtitle')}`
- Button text → `{t('login.button')}`
- Email placeholder → `{t('login.email_placeholder')}`
- Password placeholder → `{t('login.password_placeholder')}`
- "No account?" → `{t('login.no_account')}`
- "Sign up" → `{t('login.sign_up')}`

**Step 5: Test cambio de idioma**

```bash
npm start
```

Verify:
- Login screen shows in detected language
- Changing language in settings updates login screen
- Both Spanish and English translations work

**Step 6: Commit migration**

```bash
git add src/app/\(auth\)/login.tsx
git commit -m "feat(i18n): migrate login screen to use i18next translations"
```

---

## Task 18: Migrar Register Screen a i18n

**Files:**
- Modify: `mobile/src/app/(auth)/register.tsx`

**Step 1: Importar useTranslation**

```typescript
import { useTranslation } from "react-i18next";
```

**Step 2: Usar hook en componente**

```typescript
const { t } = useTranslation('auth');
```

**Step 3: Reemplazar strings con translations**

Replace all hardcoded strings:
- Title → `{t('register.title')}`
- Subtitle → `{t('register.subtitle')}`
- Button → `{t('register.button')}`
- First name placeholder → `{t('register.first_name_placeholder')}`
- Last name placeholder → `{t('register.last_name_placeholder')}`
- Email placeholder → `{t('login.email_placeholder')}`
- Password placeholder → `{t('login.password_placeholder')}`
- "Have account?" → `{t('register.have_account')}`
- "Sign in" → `{t('register.sign_in')}`

**Step 4: Test translations**

```bash
npm start
```

Verify register screen in both languages.

**Step 5: Commit migration**

```bash
git add src/app/\(auth\)/register.tsx
git commit -m "feat(i18n): migrate register screen to use i18next translations"
```

---

## Task 19: Migrar Dashboard Screen a i18n

**Files:**
- Modify: `mobile/src/app/(tool)/dashboard.tsx`

**Step 1: Importar useTranslation**

```typescript
import { useTranslation } from "react-i18next";
```

**Step 2: Usar hook con namespace dashboard**

```typescript
const { t } = useTranslation('dashboard');
```

**Step 3: Reemplazar strings**

Replace hardcoded strings with translation keys from dashboard namespace:
- Title → `{t('title')}`
- Welcome message → `{t('welcome')}`
- Stats section → `{t('stats.title')}`, etc.

**Step 4: Test translations**

```bash
npm start
```

**Step 5: Commit migration**

```bash
git add src/app/\(tool\)/dashboard.tsx
git commit -m "feat(i18n): migrate dashboard screen to use i18next translations"
```

---

## Task 20: Actualizar Settings Screen con Traducciones

**Files:**
- Modify: `mobile/src/app/(tool)/settings.tsx`

**Step 1: Importar useTranslation**

```typescript
import { useTranslation } from "react-i18next";
```

**Step 2: Usar hook con namespace settings**

```typescript
const { t } = useTranslation('settings');
```

**Step 3: Reemplazar strings**

Replace strings:
- Title → `{t('title')}`
- Section titles → `{t('sections.account')}`, `{t('sections.preferences')}`
- Account items → `{t('account.profile')}`, etc.
- Preferences items → `{t('preferences.language')}`, `{t('preferences.theme')}`

**Step 4: Test translations**

```bash
npm start
```

**Step 5: Commit migration**

```bash
git add src/app/\(tool\)/settings.tsx
git commit -m "feat(i18n): migrate settings screen to use i18next translations"
```

---

## Task 21: Test de Detección Automática de Idioma

**Files:**
- Test manual en dispositivo/simulador

**Step 1: Limpiar storage (simular primera instalación)**

En el simulador/dispositivo, eliminar y reinstalar la app o ejecutar:

```bash
# iOS Simulator
xcrun simctl uninstall booted com.yourapp.bundleid
npm run ios

# Android
adb uninstall com.yourapp.bundleid
npm run android
```

**Step 2: Verificar detección de idioma**

1. Cambiar idioma del dispositivo a español
2. Abrir app
3. Verificar que la app está en español
4. Cerrar app
5. Cambiar idioma del dispositivo a inglés
6. Abrir app
7. Verificar que la app está en inglés

**Step 3: Verificar persistencia**

1. Con app en inglés, ir a Settings
2. Cambiar a español
3. Cerrar app completamente
4. Abrir app
5. Verificar que sigue en español (ignora idioma del dispositivo)

**Step 4: Verificar fallback**

1. Cambiar idioma del dispositivo a francés (no soportado)
2. Limpiar storage y abrir app
3. Verificar que la app está en español (fallback)

**Step 5: Documentar resultados**

Crear archivo: `docs/testing/i18n-manual-tests.md` con resultados

---

## Task 22: Test de Type-Safety

**Files:**
- Test en VSCode

**Step 1: Verificar autocomplete**

En cualquier componente, escribir:

```typescript
const { t } = useTranslation('auth');
t('login.') // ← Debería mostrar autocomplete con: title, subtitle, button, etc.
```

**Step 2: Verificar errores de TypeScript**

Escribir una key inválida:

```typescript
t('login.invalid_key') // ← Debería mostrar error de TypeScript
```

**Step 3: Verificar inferencia de namespaces**

```typescript
t('auth:login.title')     // ✅ Válido
t('common:buttons.save')  // ✅ Válido
t('invalid:key')          // ❌ Error
```

**Step 4: Verificar que el build falla con keys inválidas**

```bash
npm run typecheck
```

Expected: Build fails if invalid keys exist

---

## Task 23: Actualizar Documentación README

**Files:**
- Modify: `mobile/README.md` (create if doesn't exist)

**Step 1: Agregar sección de i18n**

Add section to README:

```markdown
## Internacionalización (i18n)

Este proyecto usa **i18next** para traducciones con soporte completo de TypeScript.

### Idiomas Soportados

- 🇪🇸 Español (por defecto)
- 🇺🇸 Inglés

### Uso en Componentes

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('namespace');

  return <Text>{t('key')}</Text>;
}
```

### Namespaces Disponibles

- `common` - Botones, labels, errores comunes
- `auth` - Login, registro
- `dashboard` - Dashboard
- `settings` - Configuración

### Agregar Traducciones

1. Editar archivos en `src/shared/locales/[idioma]/[namespace].json`
2. TypeScript autocomplete actualizará automáticamente
3. Reiniciar Metro si es necesario

### Cambiar Idioma

```typescript
import { useLanguage } from '@shared/hooks';

function MyComponent() {
  const { changeLanguage } = useLanguage();

  changeLanguage('en'); // Cambiar a inglés
}
```

### Agregar Nuevo Idioma

1. Crear carpeta `src/shared/locales/[código]/`
2. Copiar archivos JSON de `es/` o `en/`
3. Traducir contenido
4. Actualizar tipo `Language` en `useLanguage.ts`
5. Agregar al array `supportedLanguages` en `storage.ts`

Para más información, ver: `docs/plans/2026-01-09-i18n-design.md`
```

**Step 2: Commit documentación**

```bash
git add mobile/README.md
git commit -m "docs: add i18n section to README"
```

---

## Task 24: Crear CHANGELOG Entry

**Files:**
- Modify: `CHANGELOG.md` or Create: `docs/CHANGELOG.md`

**Step 1: Agregar entrada de i18n**

Add to CHANGELOG:

```markdown
## [Unreleased]

### Added
- Complete i18n system with i18next and react-i18next
- Spanish and English language support
- MMKV-based language persistence
- TypeScript type-safety with autocomplete for translation keys
- LanguageSwitcher component (toggle and selector variants)
- Automatic device language detection with fallback to Spanish
- Namespace-based translation organization (common, auth, dashboard, settings)
- useLanguage hook for language management
- Migrated login, register, dashboard, and settings screens to i18n

### Changed
- Updated providers to initialize i18next
- Updated constants with LANGUAGE storage key
- Updated hooks barrel export with useLanguage
```

**Step 2: Commit changelog**

```bash
git add CHANGELOG.md
git commit -m "docs: add i18n implementation to changelog"
```

---

## Task 25: Final Verification and Cleanup

**Files:**
- All project files

**Step 1: Run full type check**

```bash
cd mobile
npm run typecheck
```

Expected: No errors

**Step 2: Run linter**

```bash
npm run lint
```

Fix any linting issues if found.

**Step 3: Test app en ambos idiomas**

```bash
npm start
```

Complete flow test:
1. Open app (should detect device language)
2. Navigate to Settings
3. Change language to English
4. Verify all screens update
5. Close and reopen app
6. Verify language persists
7. Change back to Spanish
8. Verify all screens update

**Step 4: Verificar archivos creados**

```bash
ls -la src/shared/i18n/
ls -la src/shared/locales/
```

Expected files:
- `i18n/config.ts`
- `i18n/storage.ts`
- `i18n/types.ts`
- `i18n/index.ts`
- `locales/en/*.json` (4 files)
- `locales/es/*.json` (4 files)

**Step 5: Clean commit history**

Review git log:

```bash
git log --oneline -15
```

Expected: ~25 commits with clear messages

**Step 6: Create summary commit**

```bash
git add -A
git commit -m "feat(i18n): complete i18n implementation

- Add i18next, react-i18next, and expo-localization
- Implement MMKV language detector plugin
- Add TypeScript type-safety with autocomplete
- Create translation files for es and en (common, auth, dashboard, settings)
- Add useLanguage hook and LanguageSwitcher component
- Migrate all screens to use translations
- Add comprehensive documentation

Closes #[issue-number]"
```

---

## Testing Checklist

- [ ] App detects device language correctly
- [ ] Fallback to Spanish works for unsupported languages
- [ ] Language preference persists after app restart
- [ ] LanguageSwitcher changes language in real-time
- [ ] All migrated screens show correct translations
- [ ] TypeScript autocomplete works for translation keys
- [ ] Invalid translation keys show TypeScript errors
- [ ] No console errors in development
- [ ] No TypeScript errors in build
- [ ] Translations load synchronously (no flicker)

## Success Criteria

✅ All translation files created for es and en
✅ i18next configured with MMKV persistence
✅ TypeScript type-safety working with autocomplete
✅ useLanguage hook implemented and exported
✅ LanguageSwitcher component created
✅ Settings screen includes LanguageSwitcher
✅ Login, register, dashboard, and settings screens migrated
✅ Language detection and persistence working correctly
✅ Documentation updated
✅ All tests passing

## Next Steps

After implementation:
1. Migrate remaining screens to i18n
2. Add more namespaces as needed (errors, notifications, etc.)
3. Consider integrating with translation management platform (Phrase, Lokalise, etc.)
4. Add i18next-parser for automatic key extraction
5. Consider adding more languages (Portuguese, French, etc.)
