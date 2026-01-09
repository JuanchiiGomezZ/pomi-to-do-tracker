# Plan: Integración de Unistyles 3.0 en Mobile App

## Objetivo

Integrar Unistyles 3.0 como sistema de estilos en la app mobile, con:

- Sistema de colores completo para tema claro/oscuro
- Arquitectura escalable y mantenible
- Estructura consistente con el frontend (carpeta `src/`)
- Breakpoints responsive para móviles y tablets
- Sistema de spacing, typography y radius tokens

## Arquitectura Propuesta

### Estructura de carpetas final

```
mobile/
  ├── src/                          # NUEVA raíz de código
  │   ├── app/                      # Migrado de mobile/app/
  │   │   ├── (auth)/
  │   │   ├── (tool)/
  │   │   ├── _layout.tsx
  │   │   ├── providers.tsx
  │   │   ├── index.tsx
  │   │   └── +html.tsx             # NUEVO: SSR web support
  │   │
  │   ├── features/                 # Migrado de mobile/features/
  │   │   └── auth/
  │   │
  │   ├── shared/                   # NUEVA carpeta
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── lib/
  │   │   ├── styles/               # NUEVO: Sistema Unistyles
  │   │   │   ├── theme.ts          # Definición de temas light/dark
  │   │   │   ├── breakpoints.ts    # Breakpoints responsive
  │   │   │   ├── unistyles.ts      # Configuración principal
  │   │   │   └── index.ts          # Barrel export
  │   │   └── constants/
  │   │
  │   └── constants/                # Migrado de mobile/constants/
  │
  ├── assets/                       # Permanece en raíz
  ├── index.ts                      # NUEVO: Entry point Expo Router
  ├── babel.config.js               # ACTUALIZAR
  ├── tsconfig.json                 # ACTUALIZAR
  ├── package.json                  # ACTUALIZAR
  └── app.json
```

### Stack tecnológico

- **Unistyles 3.0**: Sistema de estilos principal
- **react-native-nitro-modules 0.13.0**: Peer dependency (versión fija)
- **react-native-edge-to-edge**: Soporte edge-to-edge
- **Expo Router**: Ya integrado
- **TypeScript**: Type-safety completo

## Pasos de Implementación

### Fase 1: Reestructuración de carpetas

**1.1 Crear estructura base**

```bash
mkdir -p mobile/src
mkdir -p mobile/src/shared/{components,hooks,lib,styles,constants}
```

**1.2 Migrar carpetas existentes**

```bash
# Desde mobile/
mv app src/
mv features src/
mv constants src/
```

**1.3 Actualizar imports en archivos migrados**

- Buscar todos los archivos `.tsx` y `.ts` en `src/`
- Actualizar imports relativos que ahora estén rotos
- Cambiar referencias a `@/` para que usen los nuevos path aliases

### Fase 2: Instalación de dependencias

**2.1 Instalar paquetes**

```bash
cd mobile
npm install react-native-unistyles@3.0.0 react-native-nitro-modules@0.13.0 react-native-edge-to-edge
```

**2.2 Actualizar package.json**

Archivo: `mobile/package.json`

```json
{
  "name": "mobile",
  "main": "index.ts", // CAMBIAR de "expo-router/entry"
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    // ... dependencias existentes
    "react-native-unistyles": "^3.0.0",
    "react-native-nitro-modules": "0.13.0",
    "react-native-edge-to-edge": "^1.0.0"
  }
}
```

### Fase 3: Configuración de herramientas

**3.1 Actualizar babel.config.js**

Archivo: `mobile/babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-transform-export-namespace-from",
      [
        "babel-plugin-module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@app": "./src/app",
            "@features": "./src/features",
            "@shared": "./src/shared",
            "@constants": "./src/constants",
          },
        },
      ],
      [
        "react-native-unistyles/plugin",
        {
          root: "src",
          debug: false, // Cambiar a true para debugging
        },
      ],
      "react-native-reanimated/plugin", // IMPORTANTE: Debe ser el último
    ],
  };
};
```

**3.2 Actualizar tsconfig.json**

Archivo: `mobile/tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@app/*": ["src/app/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@constants/*": ["src/constants/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

**3.3 Crear index.ts (entry point)**

Archivo: `mobile/index.ts`

```typescript
import "expo-router/entry";
import "./src/shared/styles/unistyles";
```

### Fase 4: Crear sistema de estilos

**4.1 Crear definición de temas**

Archivo: `mobile/src/shared/styles/theme.ts`

```typescript
export const lightTheme = {
  colors: {
    // Base
    background: "#FFFFFF",
    foreground: "#F5F5F5",
    card: "#FFFFFF",
    muted: "#F5F5F5",

    // Text
    text: {
      primary: "#000000",
      secondary: "#666666",
      tertiary: "#999999",
      inverse: "#FFFFFF",
      muted: "#999999",
    },

    // Brand
    primary: "#007AFF",
    secondary: "#5856D6",

    // Semantic
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF3B30",
    info: "#007AFF",

    // UI
    border: "#E5E5E5",
    divider: "#E5E5E5",
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  // Spacing system (4pt grid)
  spacing: (multiplier: number) => multiplier * 4,

  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Typography
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
} as const;

export const darkTheme = {
  colors: {
    // Base
    background: "#000000",
    foreground: "#1C1C1E",
    card: "#1C1C1E",
    muted: "#2C2C2E",

    // Text
    text: {
      primary: "#FFFFFF",
      secondary: "#EBEBF5",
      tertiary: "#EBEBF599", // 60% opacity
      inverse: "#000000",
      muted: "#8E8E93",
    },

    // Brand (ajustados para dark mode)
    primary: "#0A84FF",
    secondary: "#5E5CE6",

    // Semantic (ajustados para dark mode)
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    info: "#0A84FF",

    // UI
    border: "#38383A",
    divider: "#38383A",
    overlay: "rgba(0, 0, 0, 0.7)",
  },

  spacing: (multiplier: number) => multiplier * 4,

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
} as const;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type Theme = typeof lightTheme;
```

**4.2 Crear breakpoints**

Archivo: `mobile/src/shared/styles/breakpoints.ts`

```typescript
export const breakpoints = {
  xs: 0, // Phones pequeños (< 375px)
  sm: 375, // Phones estándar (iPhone SE, etc)
  md: 414, // Phones grandes (iPhone Pro Max, etc)
  lg: 768, // Tablets portrait
  xl: 1024, // Tablets landscape
} as const;

export type Breakpoint = keyof typeof breakpoints;
```

**4.3 Crear configuración principal de Unistyles**

Archivo: `mobile/src/shared/styles/unistyles.ts`

```typescript
import { StyleSheet } from "react-native-unistyles";
import { themes } from "./theme";
import { breakpoints } from "./breakpoints";

// Type declarations para TypeScript
type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof themes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// Configuración de Unistyles
StyleSheet.configure({
  themes: {
    light: themes.light,
    dark: themes.dark,
  },
  breakpoints,
  settings: {
    adaptiveThemes: true, // Cambia automáticamente según el sistema
  },
});
```

**4.4 Crear barrel export**

Archivo: `mobile/src/shared/styles/index.ts`

```typescript
export { themes, lightTheme, darkTheme } from "./theme";
export type { Theme } from "./theme";
export { breakpoints } from "./breakpoints";
export type { Breakpoint } from "./breakpoints";
export * from "./unistyles";
```

### Fase 5: Configuración de Expo Router para SSR Web

**5.1 Crear archivo +html.tsx**

Archivo: `mobile/src/app/+html.tsx`

```typescript
import React from "react";
import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";
import "../shared/styles/unistyles";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Fase 6: Actualizar archivos existentes

**6.1 Actualizar imports en providers.tsx**

Archivo: `mobile/src/app/providers.tsx`

Cambiar todos los imports relativos por path aliases:

- `@/features/*` → `@features/*`
- `@/constants` → `@constants`

**6.2 Actualizar imports en todos los layouts**

Archivos a actualizar:

- `mobile/src/app/_layout.tsx`
- `mobile/src/app/(auth)/_layout.tsx`
- `mobile/src/app/(tool)/_layout.tsx`

Asegurar que usen path aliases correctos.

**6.3 Crear componente de ejemplo (opcional)**

Archivo: `mobile/src/shared/components/StyledButton.tsx`

```typescript
import { StyleSheet } from "react-native-unistyles";
import { Pressable, Text } from "react-native";
import type { ViewStyle, TextStyle } from "react-native";

interface StyledButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

export function StyledButton({
  title,
  onPress,
  variant = "primary",
}: StyledButtonProps) {
  return (
    <Pressable style={styles.button(variant)} onPress={onPress}>
      <Text style={styles.text(variant)}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: (variant: "primary" | "secondary"): ViewStyle => ({
    backgroundColor:
      variant === "primary" ? theme.colors.primary : theme.colors.secondary,
    paddingVertical: theme.spacing(3),
    paddingHorizontal: theme.spacing(6),
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  }),
  text: (variant: "primary" | "secondary"): TextStyle => ({
    color: theme.colors.text.inverse,
    fontSize: theme.fontSize.base,
    fontWeight: "600",
  }),
}));
```

## Archivos Críticos

### Archivos a CREAR:

1. `mobile/index.ts` - Entry point
2. `mobile/src/app/+html.tsx` - SSR web support
3. `mobile/src/shared/styles/theme.ts` - Temas
4. `mobile/src/shared/styles/breakpoints.ts` - Breakpoints
5. `mobile/src/shared/styles/unistyles.ts` - Config
6. `mobile/src/shared/styles/index.ts` - Exports

### Archivos a MODIFICAR:

1. `mobile/package.json` - Cambiar main, agregar deps
2. `mobile/babel.config.js` - Agregar plugin Unistyles
3. `mobile/tsconfig.json` - Actualizar paths
4. `mobile/src/app/providers.tsx` - Actualizar imports
5. `mobile/src/app/_layout.tsx` - Actualizar imports
6. Todos los archivos en `src/app/` - Actualizar imports

### Archivos a MOVER:

1. `mobile/app/` → `mobile/src/app/`
2. `mobile/features/` → `mobile/src/features/`
3. `mobile/constants/` → `mobile/src/constants/`

## Verificación End-to-End

### 1. Limpieza y rebuild

```bash
# Limpiar cache de Metro
npm start -- --clear

# Limpiar build de Expo
npx expo prebuild --clean

# Correr en iOS
npx expo run:ios

# Correr en Android
npx expo run:android
```

### 2. Verificar tema adaptativo

1. Abrir la app
2. Ir a configuración del sistema (iOS/Android)
3. Cambiar entre modo claro/oscuro
4. Verificar que la app cambia automáticamente

### 3. Verificar breakpoints

1. Abrir la app en diferentes dispositivos/simuladores:
   - iPhone SE (sm)
   - iPhone 15 Pro Max (md)
   - iPad (lg)
2. Verificar que los estilos responsive se aplican correctamente

### 4. Verificar TypeScript

1. Abrir cualquier componente
2. Importar `StyleSheet` de `react-native-unistyles`
3. Crear estilos: `StyleSheet.create(theme => ({...}))`
4. Verificar autocompletado en `theme.colors.`, `theme.spacing()`, etc.

### 5. Debug mode (si hay problemas)

En `babel.config.js`, cambiar:

```javascript
["react-native-unistyles/plugin", { root: "src", debug: true }];
```

Restart Metro y revisar console para ver dependencias detectadas.

## Rollback (si es necesario)

Si algo sale mal:

1. Restaurar `package.json` (main: "expo-router/entry")
2. Mover carpetas de vuelta: `mv src/* .`
3. Desinstalar: `npm uninstall react-native-unistyles react-native-nitro-modules react-native-edge-to-edge`
4. Eliminar plugin de babel.config.js
5. `npx expo prebuild --clean`

## Notas Importantes

- **Orden de plugins Babel:** Unistyles debe estar ANTES de Reanimated
- **Versión fija de nitro-modules:** Usar 0.13.0 exactamente
- **Cache de Metro:** Siempre limpiar después de cambios en babel.config.js
- **TypeScript:** Los tipos se infieren automáticamente gracias a los declarations
- **Breakpoints responsive:** Opcional pero muy útil para tablets
- **adaptiveThemes:** Cambia automáticamente según el sistema operativo

## Próximos Pasos (Post-implementación)

1. Migrar componentes existentes a usar Unistyles
2. Crear biblioteca de componentes compartidos con Unistyles
3. Documentar patrones de uso en el equipo
4. Considerar agregar más utilidades al tema (shadows, etc.)
