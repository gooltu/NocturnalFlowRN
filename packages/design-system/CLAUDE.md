# CLAUDE.md — @nocturnalflow/design-system

Guidance for Claude Code (or any LLM) when using this package **as a dependency** in a consuming
app. This file lives inside the package itself so it travels with it — whether linked via npm
workspaces (in-repo) or `file:../path/to/NocturnalFlowRN/packages/design-system` (cross-repo) —
and is visible to an LLM working in the consumer, not just in this repo.

If you're editing the package's own source, see the root `CLAUDE.md` of NocturnalFlowRN instead —
it documents the internal conventions (styling pattern, folder layout, `designsys.md` spec). This
file is the *consumer-facing* API reference.

## Setup a consuming app needs

1. Add the dependency — either an npm workspace entry (`"@nocturnalflow/design-system": "*"` if
   inside this monorepo) or `"@nocturnalflow/design-system": "file:../NocturnalFlowRN/packages/design-system"`
   in a separate repo — then `npm install`. Metro resolves both the same way (auto-detected for
   npm workspaces on Expo SDK 52+, and for `file:` links generally); no `metro.config.js` changes
   needed.
2. The package only declares `peerDependencies` (see `package.json`) — the consumer must have
   these installed directly: `react`, `react-native`, `expo`, `expo-blur`, `expo-font`,
   `react-native-reanimated`, `react-native-worklets`, `react-native-gesture-handler`,
   `react-native-svg`, `react-native-safe-area-context`, `expo-haptics`, `rn-emoji-keyboard`,
   `lucide-react-native`,
   `@expo-google-fonts/inter`, `@expo-google-fonts/plus-jakarta-sans`. Install with
   `npx expo install <pkg>`, not plain `npm install` — it resolves the SDK-matched version.
3. Wrap the app root in `GestureHandlerRootView`, then `ThemeProvider`, then `SafeAreaProvider`
   (`GestureHandlerRootView` outermost — gestures silently do nothing without it, no error thrown;
   `SafeAreaProvider` must be outermost of anything reading safe-area insets), and gate first
   render on `useAppFonts()`:
   ```tsx
   import { ThemeProvider, useAppFonts } from '@nocturnalflow/design-system';
   import { GestureHandlerRootView } from 'react-native-gesture-handler';
   import { SafeAreaProvider } from 'react-native-safe-area-context';

   export default function App() {
     return (
       <GestureHandlerRootView style={{ flex: 1 }}>
         <ThemeProvider>
           <SafeAreaProvider>
             <RootContent />
           </SafeAreaProvider>
         </ThemeProvider>
       </GestureHandlerRootView>
     );
   }

   function RootContent() {
     const [fontsLoaded] = useAppFonts();
     if (!fontsLoaded) return null;
     // ... render real UI
   }
   ```
4. Everything is imported from the single flat barrel — there is no subpath structure:
   ```ts
   import { useThemeColors, ButtonPrimary, Header, MessageBubble } from '@nocturnalflow/design-system';
   ```

## The one rule that matters most

**Never hardcode a color, spacing value, or font.** Every visual token comes from this package's
theme system. Get colors via `useThemeColors()` (or the fuller `useTheme()`), spacing/radius from
the `spacing`/`radius` exports, text styles from `typography`. This is what makes the light/dark
theme swap (`toggleTheme()`) work for free — a component that hardcodes `#1b1c1c` or `padding: 16`
breaks it silently.

The dominant styling pattern in every component built with this package:
```tsx
import { useStyles, ThemeColors, spacing, typography } from '@nocturnalflow/design-system';
import { StyleSheet } from 'react-native';

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: { backgroundColor: colors.surfaceContainer, padding: spacing.md },
  title: { ...typography.headlineMd, color: colors.onSurface },
});

function MyScreen() {
  const styles = useStyles(makeStyles); // memoized, rebuilds on theme change
  // ...
}
```
`makeStyles` must be a module-level constant (not redefined per render) — `useStyles` uses it as a
memo dependency.

## Theme hooks (`ThemeProvider.tsx`)

- `useTheme()` → `{ themeName, colors, setTheme(name), toggleTheme() }` — full context.
- `useThemeColors()` → just `colors` (`ThemeColors`), the common case.
- `useStyles<T>(makeStyles: (colors: ThemeColors) => T)` → memoized `StyleSheet` from a
  module-level factory.
- `<ThemeProvider initialTheme="dark">` — optional prop, defaults to `'dark'`.

## Theme tokens

- `spacing` — 4px grid: `xs=4 sm=8 md=16 lg=24 xl=32 xxl=48 xxxl=64`, plus `marginMobile=8`,
  `gutterChat=12`.
- `radius` — `sm=4 DEFAULT=8 md=12 lg=16 xl=24 full=9999`.
- `typography` — `Record<TypographyToken, TextStyle>` with keys `headlineLg`, `headlineLgMobile`,
  `headlineMd`, `bodyLg`, `bodyMd`, `labelLg`, `labelSm`. Spread into a style array/object; already
  carries `fontFamily`/`fontSize`/`lineHeight`(/`letterSpacing` on labels).
- `fontFamilies` — raw family-name strings (`jakartaBold`, `jakartaSemiBold`, `interRegular`,
  `interMedium`, `interSemiBold`) if you need one outside `typography`.
- `states` — `pressedOpacity=0.7`, `disabledOpacity=0.38`, `pressedScale=0.97`. Apply as inline
  style-array entries on press/disabled, never `:hover` or color-alone.
- `iconTokens` — for sizing `lucide-react-native` icons directly: `strokeWidth=2`, `sizeSm=16`,
  `sizeMd=20`, `sizeLg=24`.
- `duration` / `easing` — Reanimated timing tokens (`instant/fast/standard/slow`,
  `standard/decelerate/accelerate` bezier curves).
- `ThemeColors` — type of the full color-token map (~60 keys: `surface*`, `onSurface*`, `primary*`,
  `secondary*`, `tertiary*`, `error*`, semantic tokens like `presenceOnline`, `readReceipt`,
  `buttonGlow`, `backdrop`, `headerScrim`, `navBar`, `navActive`). Never import `colors.ts`
  directly or reference a hex value — always go through a `ThemeColors` instance.

## Component index

Atoms — small, single-purpose, no sub-component composition:

| Component | Key props | Notes |
|---|---|---|
| `Avatar` | `source?`, `initials?`, `size=48`, `presence?: 'online'\|'offline'\|'none'` | Falls back to initials on `primaryContainer` when no `source`. |
| `ButtonPrimary` | `label`, `onPress?`, `disabled?` | Filled CTA, 44px min height. |
| `ButtonGhost` | `label`, `onPress?`, `disabled?` | Outlined, transparent fill. |
| `IconButton` | `icon: LucideIcon`, `onPress?`, `variant?: 'plain'\|'filled'`, `size?: 'sm'\|'md'\|'lg'`, `active?`, `disabled?` | Always hit-slops up to a 44×44 target regardless of visual icon size. |
| `ImageIcon` | `source`, `size=40`, `tile?`, `onPress?`, `label?`, `disabled?` | Raster (PNG) art for game/reward affordances — **not** for functional glyphs. |
| `SVGImageIcon` | `icon: SVGIconName`, `size=40`, `tile?`, `onPress?`, `label?`, `disabled?` | Vector counterpart to `ImageIcon`, `react-native-svg`-backed. `SVGIconName` = `'coin'\|'diamond'\|'j3'..'j17'\|'logo'\|'xp'`. |
| `InputField` | extends `TextInputProps` + `icon?: LucideIcon` | Search/chat text input. |
| `ReactionPill` | `emoji`, `count`, `active?`, `onPress?` | Small chip, meant to anchor to a bubble's bottom edge. |
| `DeliveryStatus` | `status: 'sent'\|'delivered'\|'seen'`, `size=14`, `tone?: 'default'\|'onAccent'` | Use `tone="onAccent"` when drawn on a `primaryContainer` fill (e.g. inside an outgoing bubble). |
| `UnreadBadge` | `count` | Renders `null` when `count <= 0`; caps display at `"99+"`. |

Molecules — composed from atoms:

| Component | Key props | Notes |
|---|---|---|
| `MessageBubble` | see below | **The** message-bubble component — read its section before using any of the others. |
| `ChatListItem` | `name`, `snippet`, `timestamp`, `avatarSource?`, `avatarInitials`, `presence?`, `unreadCount?`, `onPress?` | One row of a chat list. |
| `TypingIndicator` | *(none)* | Three-dot pulse loop. |
| `ProgressBar` | `progress` (0–1), `label?`, `value?` | Also used bare (no label/value) inside `Header`'s gamebar. |
| `MediaBubble` | `source`, `caption?`, `timestamp`, `variant?: 'incoming'\|'outgoing'`, `icon?: SVGIconName` | Standalone image bubble. Superseded by `MessageBubble` `content.kind: 'image'/'textImage'` for chat-thread use — keep for other one-off image-bubble needs. |
| `VoiceNote` | `duration`, `variant?`, `waveform?: number[]`, `icon?: SVGIconName` | Standalone voice-note bubble. Superseded by `MessageBubble` `content.kind: 'voice'` for chat-thread use. |
| `ReplyPreview` | `senderName`, `snippet` | Standalone quoted-reply block. Superseded by `MessageBubble`'s `replyTo` prop (nested reply) for chat-thread use — this stays useful above a composer, before send. |

Organisms — screen-level regions:

| Component | Key props | Notes |
|---|---|---|
| `Header` | `title`, `subtitle?`, `presence?`, `onBack?`, `showBack?`, `avatar?: {source?, initials?}`, `actions?: HeaderAction[]`, `gamebar?: {level, xpCurrent, xpMax}`, `rightSlot?: ReactNode` | Fully prop-driven — nothing is implied by context. Pass `title` alone for a list-screen header; add `onBack`+`avatar`+`presence`+`subtitle` for a conversation header. `HeaderAction = { key, label, icon? XOR image?, onPress?, active?, disabled? }`. `rightSlot` replaces `actions` entirely when supplied. There is intentionally no separate "GameHeader" — the gamebar is one optional prop. |
| `ChatInputBar` | `onSend?: (text: string) => void`, `onAttach?: () => void`, `replyTo?: QuotedMessage`, `onCancelReply?: () => void`, `stickers?: MediaSearchState`, `gifs?: MediaSearchState`, `onSendSticker?: (item: PickerMediaItem) => void`, `onSendGif?: (item: PickerMediaItem) => void`, `onSendVoiceNote?: (result: {duration: string; waveform: number[]}) => void`, `onRecordingStart?: () => void`, `onRecordingStop?: () => void`, `onDiscardRecording?: () => void`, `previewPlaying?: boolean`, `onTogglePreviewPlayback?: () => void` | Composer. Already wraps itself in `KeyboardAvoidingView` — don't double-wrap. Passing `replyTo` shows a reply bar (quoted sender + snippet/glyph via `describeQuotedContent`, close button) above the input row — pair with a bubble's `onSwipeReply` (see below) and clear it in `onSend`. A leading emoji-face button toggles a fixed-height (320) Emoji/Sticker/GIF panel *in place of* the native keyboard (ref-based blur/focus, no `react-native-keyboard-controller` needed) — Emoji is a bundled Unicode grid (tap inserts into the text field), Sticker/GIF are network-backed (tap sends immediately via `onSendSticker`/`onSendGif`, then the panel closes). The mic button (shown when the text field is empty) opens a record → stop → review → send flow in place of the composer row — see the voice-recorder section below. See `MediaSearchState`/`PickerMediaItem` below. |
| `AttachmentSheet` | `visible`, `onClose`, `onSelect?: (kind: 'photos'\|'camera'\|'file'\|'audio') => void` | Bottom sheet, top-only rounded corners. |
| `EmptyState` | `icon?: LucideIcon` (defaults to `MessageCircle`), `title`, `description`, `actionLabel?`, `onAction?` | Generic empty/no-results state. |
| `NavigationBar` | `active: NavTab`, `onChange: (tab: NavTab) => void` | `NavTab = 'chats'\|'calls'\|'contacts'\|'settings'` — fixed 4-tab set, not extensible via props. |
| `SkeletonRow` | *(none)* | Shimmer placeholder for a loading chat-list row or bubble. |
| `Toast` | `variant: 'success'\|'warning'\|'error'`, `title`, `description?`, `icon?`, `persist?`, `onDismiss?` | Auto-dismisses after 4s unless `persist` is set — pass `persist` for connectivity/error states that need explicit resolution. |

## `MessageBubble` — the message-bubble component

`MessageBubble` is the single component for every message in a thread — one component parametrized
by `direction`/`context`/`content.kind`, not a family of per-type bubble components. Don't build a
new bubble component for a new content type; add a `MessageContent` variant instead (upstream
change, in this package, not in the consumer).

```tsx
<MessageBubble
  direction="outgoing"           // 'incoming' | 'outgoing' — required
  context="direct"               // 'direct' | 'group' — default 'direct'
  senderName="Maya Chen"         // shown as sender header, incoming + group only
  content={{ kind: 'text', text: 'On my way' }}
  replyTo={{ senderName: 'Dev Rao', content: { kind: 'text', snippet: 'New palette is in the shared folder' } }}
  timestamp="21:04"
  status="seen"                  // outgoing only: 'sent' | 'delivered' | 'seen'
  onPress={...}
  onLongPress={...}
  onSwipeReply={...}             // enables swipe-to-reply — see below
/>
```

`content: MessageContent` is a discriminated union on `kind`:
- `{ kind: 'text', text }`
- `{ kind: 'image', source, aspectRatio?, onPress? }`
- `{ kind: 'imageGroup', sources: ImageSourcePropType[], onPressItem?(index) }` — 2×2 grid, `+N`
  overflow badge past 4.
- `{ kind: 'textImage', source, caption, aspectRatio?, onPress? }`
- `{ kind: 'sticker', source, size? }` — no bubble fill, art + timestamp only.
- `{ kind: 'gif', source, aspectRatio?, onPress? }` — renders a `GIF` badge.
- `{ kind: 'video', thumbnail, duration, aspectRatio?, onPlay? }`
- `{ kind: 'voice', duration, waveform?: number[], progress?: number, playing?, onTogglePlay? }`

`replyTo: QuotedMessage = { senderName, content: QuotedContent, onPress? }` renders a nested quote
block inside the bubble. `QuotedContent` is a **separate**, narrower union (thumbnails/snippets,
not full content — e.g. `{ kind: 'image', thumbnail }` not `source`): `text`, `image`, `video`,
`sticker`, `gif`, `imageGroup`, `voice`.

Reactions (e.g. `ReactionPill` rows) are **not** part of `MessageBubble` — render them separately,
positioned under the bubble, keyed off your own message data.

`onSwipeReply?: () => void` enables WhatsApp/iMessage-style swipe-to-reply: dragging the bubble
toward the thread's center (right for incoming, left for outgoing) reveals a reply icon and, past a
threshold, fires this callback once — the bubble always springs back to place afterward, it never
stays displaced. Typical wiring: the callback sets your own "replying to" state, which you then pass
into `ChatInputBar`'s `replyTo`/`onCancelReply` (see the component index above) and clear on send.
`describeQuotedContent(content: QuotedContent)` (exported alongside `MessageBubble`) returns the
same `{ label, Glyph? }` pair the in-bubble quote uses, for building a matching reply-bar preview or
snippet text yourself.

## `ChatInputBar`'s Sticker/GIF tabs — bring your own data source

The package has **no idea Klipy (or any GIF/sticker provider) exists** — `stickers`/`gifs` are typed
generically so any backend can feed them:
```ts
interface PickerMediaItem { id: string | number; previewUri: string; fullUri: string }
interface MediaSearchState {
  items: PickerMediaItem[];
  loading: boolean;
  error?: string;
  query: string;                          // round-tripped so switching tabs doesn't lose it
  onSearch: (query: string) => void;      // '' means "show trending" — debounce before fetching
}
```
Omit `stickers`/`gifs` entirely and those tabs just show "unavailable" — the Emoji tab (bundled,
no network) always works regardless. The reference implementation (Klipy-backed) lives in the
*consuming app*, not here: `src/api/klipy.ts` (fetch + response mapping) and
`src/hooks/useMediaPicker.ts` (the `MediaSearchState` producer, one hook per tab) in this repo's own
`ConversationScreen.tsx` usage, if you want a working example to copy for a different provider.

## `ChatInputBar`'s mic button — mock recorder, real integration seams

Tapping the mic (visible whenever the text field is empty) replaces the composer row with a
record → stop → review → send flow: **recording** (pulsing dot, live timer, live fake waveform,
trash to cancel, a checkmark button to stop), then **reviewing** (play/pause over a frozen
waveform, timer showing final length, trash to discard, send arrow to commit). Like the
Sticker/GIF tabs, **the package has no concept of a real audio file or microphone** — the timer and
waveform are a self-contained mock (`setInterval`, `Math.random()` bar heights) purely so the UI
has something to show. `onSendVoiceNote({ duration, waveform })` fires on commit with that mock
data — `duration` is a real elapsed-time string (`"0:06"`), not a placeholder.

To back it with real audio (e.g. `expo-audio`), the seams are `onRecordingStart` (fires when the
mic is tapped — start real mic capture here), `onRecordingStop` (fires on the stop button, i.e.
recording → reviewing — stop capture and hold onto the resulting file here, in your own state),
`onDiscardRecording` (fires on the trash button, from either step — discard whatever file you were
holding onto), and `onSendVoiceNote` (fires on commit — attach whatever real audio you captured to
the message you construct; the mock `duration`/`waveform` are still useful for the message's
*display*, they just won't line up with the real file unless you also track your own elapsed time).
`onDiscardRecording` does **not** fire after a successful send — only on an explicit discard.

The review step's play/pause button is a separate seam: by default it's `ChatInputBar`'s own mock
toggle (flips the icon, no real audio — fine when nothing real was captured either). Pass **both**
`previewPlaying` and `onTogglePreviewPlayback` to take it over completely — e.g. wire them to real
playback of the file you got from `onRecordingStop`, so reviewing before sending actually plays back
what was recorded. Provide both together; the internal mock toggle is fully bypassed once either is
set, so a consumer can't accidentally end up with the icon controlled but the audio not (or vice
versa).

## Common gotchas

- Forgetting `GestureHandlerRootView`/`ThemeProvider`/`SafeAreaProvider`/`useAppFonts()` at the
  root — every hook in this package (`useTheme`, `useThemeColors`, `useStyles`, anything using
  `useSafeAreaInsets`) throws or silently misbehaves without the latter three; `onSwipeReply` and
  any other gesture does nothing at all (no error) without `GestureHandlerRootView`.
- Reaching for `MediaBubble`/`VoiceNote`/`ReplyPreview` inside a message thread — use
  `MessageBubble`'s `content.kind` / `replyTo` instead; those three are for standalone use outside
  a thread (e.g. `ReplyPreview` above an unsent composer).
- Hardcoding hex colors or raw `px` spacing instead of theme tokens — breaks the light/dark swap.
- Passing both `icon` and `image` on a `HeaderAction` — they're mutually exclusive (vector vs
  raster); only one renders.
