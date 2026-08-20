# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

NocturnalFlowRN is an Expo (SDK 57) / React Native chat-messaging UI design-system showcase app.
There is no backend — all data comes from `src/data/mockData.ts`. The app's purpose is to build
and demonstrate a component library (atoms/molecules/organisms) that implements the design spec
in `designsys.md`, sourced from the Pencil canvas file `NocturnalFlowDS.pen`.

## Commands

- `npm start` — start the Expo dev server
- `npm run ios` / `npm run android` / `npm run web` — start the dev server targeting a platform
- No lint or test scripts/config exist in this repo yet.

## Architecture

### Monorepo layout

This is an npm-workspaces monorepo (`"workspaces": ["packages/*"]` in the root `package.json`).
The app lives at the repo root exactly as before; the theme system and component library live in
the workspace package `packages/design-system/` (`@nocturnalflow/design-system`) and are consumed
by the app via a plain package import, not relative paths:
```ts
import { useThemeColors, ButtonPrimary, Header, MessageBubble } from '@nocturnalflow/design-system';
```
The package has a single flat barrel (`packages/design-system/src/index.ts`) re-exporting theme +
atoms + molecules + organisms — there's no subpath structure (`/theme`, `/components/...`) to
import from. `src/screens/*` and `src/data/mockData.ts` stay app-specific and are not part of the
package. After changing anything under `packages/design-system/`, no build step is needed — Metro
auto-detects the npm workspace (Expo SDK 52+) and transforms the linked source directly.

A separate, non-workspace project can consume this same package without publishing it, by adding
`"@nocturnalflow/design-system": "file:../NocturnalFlowRN/packages/design-system"` (path to this
repo) to its own `package.json` and running `npm install` — Metro resolves `file:`-linked packages
the same way it resolves workspace packages.

`packages/design-system/CLAUDE.md` is the consumer-facing API reference for the package (full
component/prop index, theme-token reference, setup steps) — it travels with the package into any
consuming repo. This root file documents the package's *internal* conventions for people editing
its source; that one documents its *external* API for people importing it.

### App shell (no navigation library)

`App.tsx` does not use React Navigation. Screen switching is manual `useState` inside `AppContent`:
`ChatsScreen` → (on open) → `ConversationScreen`, with `NavigationBar` driving placeholder tabs.
`App.tsx` wraps everything in `ThemeProvider` then `SafeAreaProvider`, and gates first render on
`useAppFonts()`.

There is a `SHOW_GALLERY` const at the top of `App.tsx`. When `true`, it bypasses the normal chat
flow entirely and always renders `MessageBubbleGalleryScreen` — a dev/showcase screen for the
component library. Check this flag's value before assuming the chat flow is what's running.

### Theme system (`packages/design-system/src/theme/`)

Everything is re-exported from the barrel `theme/index.ts` (and from there up through the
package's top-level barrel). Token files are small and
single-purpose: `colors.ts` (raw dark palette, Material-3-style names), `themes.ts` (`dark`/`light`
palettes + `ThemeName`/`ThemeColors` types), `spacing.ts` (4px-grid `spacing` + `radius`),
`typography.ts` (`fontFamilies` + `typography` scale), `motion.ts`, `states.ts` (pressed/disabled
opacity), `icons.ts`, `useAppFonts.ts`.

`ThemeProvider.tsx` holds theme state in a context and exposes three hooks — this is the only
sanctioned way to consume theming:
- `useTheme()` — full context (`themeName`, `colors`, `setTheme`, `toggleTheme`)
- `useThemeColors()` — just the current `colors`
- `useStyles<T>(makeStyles: (colors: ThemeColors) => T)` — builds a memoized `StyleSheet` from a
  module-level `makeStyles(colors)` factory, recomputed on theme change. This is the dominant
  styling pattern across every component.

**Never import `colors.ts` directly or hardcode hex values in components** — always go through
`useThemeColors()`/`useStyles()` so the light/dark swap keeps working.

### Component library (`packages/design-system/src/components/{atoms,molecules,organisms}`)

Each tier has a barrel `index.ts` (`export * from './X'` per component). Convention, consistent
across the whole library:
- Named exports only (`export function ComponentName(...)`), each with a `ComponentNameProps`
  interface and a JSDoc block above it describing visual/behavioral intent, not just types.
- Styling via a module-level `const makeStyles = (colors: ThemeColors) => StyleSheet.create({...})`
  consumed through `useStyles(makeStyles)`; conditional styles (pressed/disabled) are applied as
  inline array entries referencing `states.pressedOpacity` / `states.disabledOpacity`, never
  `:hover` or color-alone.
- Theme tokens (`spacing`, `radius`, `typography`, `states`, `iconTokens`) are imported directly
  from `'../../theme'`.

### Design system source of truth

`designsys.md` is a **prescriptive spec**, not notes — treat its language ("never hardcode",
"must", "always") as binding when adding or changing components/tokens. It is itself derived from
`NocturnalFlowDS.pen`, the Pencil canvas (visual source of truth for every color/font/radius
token). **Never `Read`/`Grep` the `.pen` file directly — it's encrypted; use the `pencil` MCP
tools** (`get_app_state`, `get_guidelines`, `execute`) if you need to inspect or modify it.

Rules from `designsys.md` most likely to matter when touching components:
- Colors: reference token *names* only, never raw hex — enables a future light-theme swap.
- Outgoing-bubble text uses `on-primary-container`, not pure black.
- 4px spacing grid; 44×44px minimum touch targets (`hitSlop` where needed).
- Must use `SafeAreaView`/`useSafeAreaInsets`; `ChatInputBar` must use `KeyboardAvoidingView` (or
  `react-native-keyboard-controller`).
- Android: explicitly set `elevation: 0` — depth comes from tonal layering, not shadows.
- Shape tiers: atoms use `rounded` (0.5rem); message bubbles use asymmetric corners
  (`[16,16,4,16]` / `[16,16,16,4]`); sheets/modals use top-only `rounded-xl`.
- Fonts load via `expo-font`/`@expo-google-fonts/*` gated behind `useFonts()`; never disable OS
  font scaling.
- `Header` is fully prop-driven (`title`, `subtitle`, `presence`, `onBack`, `avatar`, `actions`,
  `gamebar`, `rightSlot`) — "nothing is implied by context." There is intentionally no separate
  `GameHeader` component; reject reintroducing one.
- Message bubbles are **one** `MessageBubble` component parametrized by `direction`/`context`/
  `content.kind` — the 45 permutations in the `.pen` file are rendered outputs of that one
  component, not 45 separate components to build.

### MessageBubble is the only message-bubble component

`packages/design-system/src/components/molecules/MessageBubble/` (folder component:
`MessageBubble.tsx`, `types.ts`, `bubbleTheme.ts`, `parts/*`) is the single unified bubble used
everywhere: both `MessageBubbleGalleryScreen.tsx` (showcases all content-type × state permutations)
and `ConversationScreen.tsx` (the real chat screen, mapping `MessageItem.type` from
`src/data/mockData.ts` onto `content.kind`) render through it. The older `BubbleIncoming`/
`BubbleOutgoing` molecules (text-only, no reply/attachment support) have been removed — don't
reintroduce them. `MediaBubble`/`VoiceNote`/`ReplyPreview` still exist as independent molecules for
standalone use, but `ConversationScreen` no longer calls them directly — their functionality
(image/text-image, voice, and nested quoted replies) is covered by `MessageBubble`'s `content.kind`
and `replyTo` props.
