---
name: Nocturnal Flow
platform: react-native-expo
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d8c3b4'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#a08d80'
  outline-variant: '#534439'
  surface-tint: '#ffb77d'
  primary: '#ffc69a'
  on-primary: '#4d2600'
  primary-container: '#f4a460'
  on-primary-container: '#6e3900'
  inverse-primary: '#8d4f11'
  secondary: '#c8c6c6'
  on-secondary: '#303030'
  secondary-container: '#474747'
  on-secondary-container: '#b6b5b4'
  tertiary: '#d3d1d0'
  on-tertiary: '#313030'
  tertiary-container: '#b7b5b5'
  on-tertiary-container: '#474747'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
  # --- added: status & feedback colors ---
  success: '#8ed08a'
  on-success: '#0a3a0a'
  warning: '#ffcf6b'
  on-warning: '#3d2c00'
  presence-online: '#8ed08a'
  presence-offline: '#6e6e6e'
  read-receipt: '#8fc7ff'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
  margin-mobile: 8px
  gutter-chat: 12px
motion:
  duration-instant: 100ms
  duration-fast: 150ms
  duration-standard: 250ms
  duration-slow: 400ms
  easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1)
  easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
  easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1)
states:
  pressed-opacity: 0.7
  disabled-opacity: 0.38
  pressed-scale: 0.97
icons:
  library: lucide-react-native
  stroke-width: 2
  size-sm: 16px
  size-md: 20px
  size-lg: 24px
---

## Brand & Style

The design system is engineered for a premium, high-contrast mobile messaging experience built in **React Native / Expo**. It prioritizes legibility and visual comfort during extended nighttime usage. The aesthetic blends **Modern Minimalism** and **Tactile Depth**, using deep charcoal surfaces to minimize eye strain while employing the `primary` sandy-orange as a high-energy focal point for interaction.

The emotional response should be one of focused intimacy and sophisticated reliability. The UI avoids pure black (`#000000`) to prevent "smearing" on OLED screens, opting instead for a layered charcoal palette (`surface-container-lowest` → `surface-container-highest`) that provides a sense of physical space through subtle tonal shifts.

**Theme scope:** this system is dark-only by design — there is no light-mode token set. If a light theme is ever required, components must be built to reference token *names* (e.g. `surface`, `on-surface`) rather than hardcoded hex values, so a second theme file can be swapped in without touching component code. All guidance below assumes token-name usage, never raw hex, inside components.

## Colors

All colors are defined once in the frontmatter and referenced by token name — never hardcode a hex value in a component. Roles below map prose intent to the actual token.

| Role | Token | Value | Usage |
|---|---|---|---|
| App background | `background` / `surface` | `#121414` | Base layer for all screens |
| Base (lowest) | `surface-container-lowest` | `#0d0e0f` | Rarely-used deepest recess (e.g. status bar area) |
| Card / bubble surface | `surface-container` | `#1e2020` | Incoming message bubbles, cards, search bars |
| Elevated surface | `surface-container-high` | `#282a2b` | Modals, sheets, menus |
| Primary text | `on-surface` | `#e2e2e2` | Body copy, functional icon fill |
| Secondary / metadata text | `on-surface-variant` | `#d8c3b4` | Timestamps, typing indicators, receded labels |
| Primary CTA / active state | `primary` | `#ffc69a` | Buttons, badges, active toggles |
| Primary CTA text | `on-primary` | `#4d2600` | Text/icon drawn on top of `primary` fills |
| Strong accent fill | `primary-container` | `#f4a460` | Outgoing bubble background, high-emphasis chips |
| Text on strong accent | `on-primary-container` | `#6e3900` | Text on `primary-container` fills |
| Outline / dividers | `outline` | `#a08d80` | 1px borders, input outlines |
| Subtle outline | `outline-variant` | `#534439` | Low-emphasis dividers |
| Error | `error` / `on-error` | `#ffb4ab` / `#690005` | Validation, destructive actions |
| Success | `success` / `on-success` | `#8ed08a` / `#0a3a0a` | Sent confirmations, positive toasts |
| Warning | `warning` / `on-warning` | `#ffcf6b` / `#3d2c00` | Connectivity issues, rate limits |
| Online presence | `presence-online` | `#8ed08a` | Avatar presence dot |
| Offline presence | `presence-offline` | `#6e6e6e` | Avatar presence dot |
| Read receipt | `read-receipt` | `#8fc7ff` | "Seen" double-check tint |

**Note on outgoing-bubble text:** use `on-primary-container` (`#6e3900`, a dark brown), not pure black — pure black on `primary-container` fails to match the rest of the palette's warm-neutral system and looks visually disconnected.

## Typography

- **Headlines** (`headline-lg`, `headline-md`) use **Plus Jakarta Sans** at Bold/Semi-Bold to anchor views like Chat Lists or Settings headers. Use `headline-lg-mobile` (22px/28) as the default on-device size; reserve `headline-lg` (24px/32) for tablet or landscape breakpoints.
- **Body** (`body-lg`, `body-md`) uses **Inter**. Message content defaults to `body-lg` (16px) for readability; secondary UI copy uses `body-md` (14px).
- **Labels** (`label-lg`, `label-sm`) use **Inter** at reduced size/increased tracking for timestamps, typing indicators, and metadata, always in `on-surface-variant`.

**Font loading (Expo-specific):** Plus Jakarta Sans and Inter are not system fonts. Load them with `expo-font` / `@expo-google-fonts/plus-jakarta-sans` and `@expo-google-fonts/inter`, and gate the first render behind `useFonts()` with an `AppLoading` or splash-screen hold — do not let text flash in system font before swap.

**Dynamic type / accessibility:** Do not disable OS font scaling. Test all `typography` tokens against iOS "Larger Text" and Android font-scale up to at least 130%; use `allowFontScaling` intentionally (true for body/labels, consider capping scale on fixed-height headers to avoid layout breakage) rather than disabling it globally.

## Layout & Spacing

A **4px soft-grid**. All components and layouts increment by 4px (`xs`–`xxxl`).

- **Mobile Viewport:** 8px side margins (`margin-mobile`).
- **Message Grouping:** Same-sender messages get a 4px (`xs`) vertical gap; different-sender messages get 12px (`gutter-chat`).
- **Touch Targets:** All interactive atoms maintain a minimum 44×44px hit area (use `hitSlop` in RN when the visual asset is smaller than 44px).
- **Safe areas:** All screens must respect device safe areas via `react-native-safe-area-context` (`SafeAreaView` / `useSafeAreaInsets`) — particularly the notch/Dynamic Island on top and the home-indicator on bottom.
- **Keyboard handling:** The Chat Input Bar must sit inside a `KeyboardAvoidingView` (`behavior="padding"` on iOS, `"height"` on Android) or use `react-native-keyboard-controller` for smoother native-driven avoidance. This is the single most failure-prone piece of a messenger UI — test on both platforms explicitly.

## Elevation & Depth

Depth is communicated through **Tonal Layering**, not traditional shadows.

- **Level 0 (Base):** `surface` — main app background.
- **Level 1 (Surface):** `surface-container` — message bubbles, search bars, cards.
- **Level 2 (Overlay):** `surface-container-high`, or a subtle 1px `outline-variant` border — context menus, modals, tooltips.

A subtle inner glow (0.5px white stroke at 5% opacity) may be applied to the Primary CTA for a slightly "tactile" raised look.

**Platform note:** iOS respects `shadow*` props naturally and tonal layering alone reads correctly. **Android applies Material elevation/shadow by default on many native components** — explicitly set `elevation: 0` (or `styles.android.elevation` in Paper-based components) wherever a component would otherwise cast an unwanted default shadow, so the tonal-layering approach isn't undercut by platform defaults.

## Motion

- `duration-instant` (100ms): micro-feedback — checkbox toggle, icon state swap.
- `duration-fast` (150ms): press/ripple feedback, bubble appearance.
- `duration-standard` (250ms): screen transitions, modal/sheet presentation.
- `duration-slow` (400ms): typing-indicator loop, presence-dot pulse.
- Use `easing-decelerate` for elements entering the screen, `easing-accelerate` for elements leaving, `easing-standard` for everything else (e.g. `Animated`/`Reanimated` config).
- Prefer `react-native-reanimated` for anything running on the interaction thread (message send animation, keyboard-linked transitions) to avoid JS-thread jank during scroll-heavy chat views.

## States & Feedback

- **Pressed:** apply `states.pressed-opacity` (0.7) or `states.pressed-scale` (0.97) via `Pressable`'s `style` callback — never rely on `:hover`, which doesn't exist on touch.
- **Disabled:** apply `states.disabled-opacity` (0.38) and disable touch handling; do not rely on color alone to convey disabled state (contrast requirement).
- **Delivery status (outgoing messages):** single check = sent, double check in `on-surface-variant` = delivered, double check in `read-receipt` = seen.
- **Presence indicator:** 8px dot on the avatar's bottom-right, `presence-online` or `presence-offline`, with a 1.5px `surface` border so it reads clearly against any avatar image.
- **Toasts / inline banners:** use `surface-container-high` background with `warning`/`error`/`success` left-border accent (3px) and matching icon; auto-dismiss after 4s for non-critical, persist for connectivity/error states until resolved.

## Shapes

Consistently **Rounded**, to evoke friendliness and safety.

- **Atoms:** Buttons and input fields use `rounded` (0.5rem).
- **Molecules:** Chat bubbles use asymmetric rounding — the corner pointing to the sender's side uses 4px, the other three corners use `rounded-lg` (1rem).
- **Organisms:** Bottom sheets and modals use `rounded-xl` on the top corners only.

## Components

The component library is drawn in **`NocturnalFlowDS.pen`** (Pencil canvas), which is the visual source of truth: every colour, font and radius token below exists there as a document variable, and each component is a reusable symbol instanced into the "Nocturnal Flow — Component Library" board. Two assembled reference screens — **Chats** and **Conversation** — are built entirely from those instances. See [Canvas Source](#canvas-source) for the inventory.

### Atoms
- **Buttons:** Primary buttons use `primary` fill with `on-primary` text, 44px tall, `rounded` corners, and a 0.5px white inner stroke at ~5% opacity for the tactile lift. Ghost buttons use a 1px `primary` border with `primary` text. Apply `states.pressed-opacity` on press, `states.disabled-opacity` when disabled.
- **Icon Button:** 44×44 circular. Filled variant = `primary` fill with `on-primary` glyph (send). Quiet variant = `surface-container-high` fill with `on-surface-variant` glyph (attach).
- **Inputs:** Search and chat inputs use `surface-container` background, `outline-variant` 1px border on focus, 16px internal padding, 48px tall (44px inside the Chat Input Bar).
- **Icons:** `lucide-react-native`, 2px stroke weight, sized per `icons.size-sm/md/lg`.
- **Avatar:** circular, `surface-container-high` fill with monogram initials in Plus Jakarta Sans. Sizes 48 (chat list), 40 (header), 32 (compact/inline). The presence dot is omitted at 32.
- **Unread Badge:** `rounded-full` `primary` pill, 20px tall, count in Inter 11/600 `on-primary`. Widens for `99+`.
- **Delivery Status:** timestamp in `label-sm` followed by a 14px check glyph — see the delivery-status rule in States & Feedback.
- **Progress Bar:** determinate linear progress for uploads, downloads and any measured task.
  - **Track:** 6px tall, `rounded-full`, `surface-container-high`, `overflow: hidden`.
  - **Indicator:** `rounded-full`, `primary` fill, full track height, width driven by percent.
  - **Meta row** (optional, `space-between` above the track, 8px gap): label in `label-lg` `on-surface`, value in `label-sm` `on-surface-variant`. Omit it for a bare track inside dense UI.
  - **States:** in-progress = `primary`; complete = `success` at 100% with the value label also in `success`; failed = `error` fill with an `error` label and a "Retry" affordance in place of the percentage. Indeterminate = a short (~30% of track) segment that translates across the track instead of growing.
  - **Motion:** animate the determinate width with `duration-standard` + `easing-standard`; loop the indeterminate segment's `translateX` at `duration-slow` + `easing-standard`. Drive both from a Reanimated shared value — animate `translateX` rather than `width` for the indeterminate case to keep it off the JS thread.
  - **Accessibility:** expose `accessibilityRole="progressbar"` with `accessibilityValue={{min, max, now}}`; never communicate the failed state by colour alone — the label carries it too.

### Molecules
- **Message Bubbles (Incoming):** `surface-container` background, `on-surface` text.
- **Message Bubbles (Outgoing):** `primary-container` background, `on-primary-container` text.
- **Media Message Bubble:** image/video fills the bubble shape with `rounded` corners matching the parent bubble; caption text (if any) sits below in `body-md` on a `surface-container` footer strip. Voice-note variant shows a waveform + play button + `label-sm` duration.
- **Reply / Quote Preview:** a compact left-bordered (2px `outline`) block above the composed message or inside a bubble, showing sender name (`label-lg`) and a single-line truncated snippet (`body-md`, `on-surface-variant`) of the quoted message.
- **Reaction Pills:** small `rounded-full` chips (26px tall) using `surface-container-high` background with a 1px `outline-variant` border, emoji + count in `label-sm`, anchored to the bottom edge of a bubble with a 6px gap. The "reacted by me" state swaps to an `inverse-primary` fill with a `primary` border and count.
- **Chat List Item:** horizontal layout — 48px circular avatar (with presence dot), vertical stack of Title (`headline-md`) and Snippet (`body-md`), trailing timestamp (`label-sm`) above an optional Unread Badge. Unread rows sit on a `surface-container-low` fill with the snippet promoted to `on-surface`; muted rows drop to 60% opacity.
- **Typing Indicator:** an incoming-shaped bubble containing three 7px `on-surface-variant` dots at 100/60/35% opacity, cycling on a `duration-slow` loop.
- **Day Divider:** centred `rounded-full` chip on `surface-container`, date in `label-sm` `on-surface-variant`, separating message groups by day.

### Organisms
- **Chat Input Bar:** fixed bottom container, `background`-colored with a 1px `outline-variant` top hairline, containing a 44px `surface-container` composer field (placeholder + trailing mic icon), a "plus" attachment button, and a circular send button; wrapped in keyboard-avoidance per the Layout section. The send button sits at `states.disabled-opacity` until the field has content; the field gains its `outline-variant` border while focused.
- **Header:** sticky top bar, 60px tall, `background` at 80% opacity with a `blur(10px)` backdrop and a 1px `outline-variant` bottom hairline. Contains back chevron, 40px avatar, identity stack (name in Plus Jakarta Sans 17/600 + presence line in `label-sm`), and trailing call / overflow icons. The presence line carries `presence-online` when online and `on-surface-variant` for "typing…" or last-seen copy.
- **Game Header:** the Header with a 24px gamification strip docked beneath it (80px total), separated by a 1px `outline-variant` divider. The strip pairs a level label, a track-only Progress Bar instance for XP, and an XP counter, all in `primary`. *Note: the strip's labels currently render at 8px, below the `label-sm` floor — raise them to `label-sm` (11px) or grow the strip before shipping, since 8px fails legibility at 130% font scale.*
- **Navigation Bar:** a floating capsule rather than an edge-to-edge bar — inset 16px from the sides and 12px above the bottom, 56px tall, corner radius = half the height, 6px inner padding. `surface-container-high` at 70% opacity with a `blur(12px)` backdrop and a soft outer shadow. Each tab is an icon (22px) above a 10px label; the active tab gets a `primary`-tinted capsule highlight (`primary` at ~12% opacity) with `primary` icon and label, inactive tabs use `on-surface-variant`.
- **Empty State:** centered 72px `surface-container` icon halo + `headline-md` title + centered `body-md` supporting text + a Ghost Button action, used for empty chat list, empty conversation, or no-search-results states.
- **Loading Skeleton:** shimmer blocks using `surface-container` → `surface-container-high` gradient pulse (`duration-slow`, looped) for chat-list rows and message bubbles while content loads. The chat-list row is a 48px circle plus two stacked bars (14px and 12px, `rounded-full`); stack rows at descending opacity so the list fades out down the screen.
- **Toast / Inline Banner:** `surface-container-high` card, `rounded`, with a 3px left border and matching leading icon in `warning` / `error` / `success`, a `body-md` semibold title, a `body-md` (13px) body line in `on-surface-variant`, and a trailing dismiss glyph. Dismissal timing per States & Feedback.
- **Attachment Bottom Sheet:** `surface-container-high` sheet with `rounded-xl` top corners only, a 36×4 `outline-variant` grabber, and a row of equal-width options (64px `surface-container` tile with a `primary` icon above a `label-sm` caption): Photos, Camera, File, Audio.

## Canvas Source

`NocturnalFlowDS.pen` holds 24 reusable components, laid out above the "Nocturnal Flow — Component Library" board and instanced into it by tier.

| Tier | Component | Node |
|---|---|---|
| Atoms | Avatar | `c9jsV1` |
| Atoms | Button Primary | `PuZ1D` |
| Atoms | Button Ghost | `WCNF8` |
| Atoms | Icon Button | `OEC6O` |
| Atoms | Input Field | `XnCYR` |
| Atoms | Unread Badge | `U0NsL` |
| Atoms | Delivery Status | `KPwjD` |
| Atoms | Progress Bar | `V6k8E` |
| Molecules | Bubble Incoming | `vimdq` |
| Molecules | Bubble Outgoing | `Wfl0W` |
| Molecules | Media Bubble | `Yl6Ol` |
| Molecules | Voice Note | `k1tKOI` |
| Molecules | Reply Preview | `limpy` |
| Molecules | Reaction Pill | `b77JZ4` |
| Molecules | Typing Indicator | `c5arMN` |
| Molecules | Chat List Item | `WuUhY` |
| Organisms | Header | `k5CZ3p` |
| Organisms | Game Header | `FMtXL` |
| Organisms | Chat Input Bar | `PKGKz` |
| Organisms | Navigation Bar | `x1QWPw` |
| Organisms | Empty State | `mMWID` |
| Organisms | Skeleton Row | `kfp0x` |
| Organisms | Toast | `u1Weu` |
| Organisms | Attachment Sheet | `X1p187` |

Reference screens: **Screen / Chats** (`FwKyl`) and **Screen / Conversation** (`ViaSO`), both 390pt wide and composed only of instances.

**Reading the canvas into code:**
- Pencil has no percentage sizing, so proportional values are baked as pixels against a fixed base — the Progress Bar indicator is sized against a 240pt track (`width = 2.4 × percent`). In RN, express these as percentage strings or flex, not the literal canvas numbers.
- Message bubbles are capped at 260pt on the board (250pt inside the reference screens); in RN cap them with `maxWidth: '75%'` instead.
- Avatars use monogram initials on canvas as a stand-in for photo sources.
- Blur backdrops (Header, Game Header, Navigation Bar) are canvas approximations of `expo-blur`'s `BlurView`; the fill opacity shown is the tint behind the blur.
