import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { DeliveryState } from '../../atoms/DeliveryStatus';

/** Which side of the thread the message sits on. Drives fill, text colour,
 * corner rounding and alignment. */
export type MessageDirection = 'incoming' | 'outgoing';

/** 1-on-1 vs group thread. In a group, incoming bubbles carry a sender header;
 * neither context renders an avatar — identity comes from the Header. */
export type MessageContext = 'direct' | 'group';

/** Plain text. Wraps at the bubble's max width; a short message simply
 * occupies one line, which is why there is no separate single-line variant. */
export interface TextMessageContent {
  kind: 'text';
  text: string;
}

/** A single photo filling the bubble shape. */
export interface ImageMessageContent {
  kind: 'image';
  source: ImageSourcePropType;
  /** Defaults to 4:3. */
  aspectRatio?: number;
  onPress?: () => void;
}

/** 2×2 grid with a `+N` overflow badge on the last tile when more than four
 * photos are supplied. Two photos render as a single row, three as a row plus
 * a full-width tile. */
export interface ImageGroupMessageContent {
  kind: 'imageGroup';
  sources: ImageSourcePropType[];
  onPressItem?: (index: number) => void;
}

/** Photo stacked above a caption inside one container. */
export interface TextImageMessageContent {
  kind: 'textImage';
  source: ImageSourcePropType;
  caption: string;
  aspectRatio?: number;
  onPress?: () => void;
}

/** Sticker art. Renders with no bubble fill — art plus timestamp only. */
export interface StickerMessageContent {
  kind: 'sticker';
  source: ImageSourcePropType;
  /** Square edge length. Defaults to 132. */
  size?: number;
}

/** Animated image with a `GIF` pill badge, top-left. */
export interface GifMessageContent {
  kind: 'gif';
  source: ImageSourcePropType;
  aspectRatio?: number;
  onPress?: () => void;
}

/** Thumbnail with a centred play control and a duration badge, bottom-right. */
export interface VideoMessageContent {
  kind: 'video';
  thumbnail: ImageSourcePropType;
  duration: string;
  aspectRatio?: number;
  onPlay?: () => void;
}

/** Play control, waveform and duration counter. */
export interface VoiceMessageContent {
  kind: 'voice';
  duration: string;
  /** Relative bar heights (0-1). A default pattern is used if omitted. */
  waveform?: number[];
  /** 0-1 playback position; bars before it render at full opacity. */
  progress?: number;
  /** Supply with `onTogglePlay` to control playback from outside; omit to let
   * the bubble track its own play state. */
  playing?: boolean;
  onTogglePlay?: () => void;
}

/** Transfer state for content that must be fetched before it's usable.
 * Omit for the normal, fully-loaded look — `'downloading'` shows an
 * intermediate progress treatment, `'failed'` shows a failure glyph (and,
 * where a handler is given, a tap-to-retry). */
export type AttachmentStatus = 'downloading' | 'failed';

/** A shared file: name, size and type badge. `onPress` opens/saves it when
 * loaded; while `status` is `'downloading'` or `'failed'` it instead retries
 * or is disabled, at the consumer's discretion. */
export interface DocumentMessageContent {
  kind: 'document';
  fileName: string;
  fileSize: string;
  /** Short extension (`'pdf'`, `'doc'`, `'zip'`, ...) — drives the glyph. */
  fileType: string;
  status?: AttachmentStatus;
  onPress?: () => void;
}

/** A shared pin: static map thumbnail plus a label/address. Omit `mapImage`
 * to show a generic map placeholder tile (e.g. while a real preview is still
 * being generated). */
export interface LocationMessageContent {
  kind: 'location';
  mapImage?: ImageSourcePropType;
  label: string;
  address?: string;
  status?: AttachmentStatus;
  onPress?: () => void;
}

/** A shared contact card: avatar (or initials fallback), name and a subtitle
 * line (phone number, etc). */
export interface ContactMessageContent {
  kind: 'contact';
  name: string;
  subtitle?: string;
  avatar?: ImageSourcePropType;
  initials?: string;
  status?: AttachmentStatus;
  onPress?: () => void;
}

/** An unfurled link preview: title/description/image pulled from the target
 * page, plus the site name and raw URL. Any of the unfurled fields may be
 * absent (e.g. while `status === 'downloading'`, or a page with no OG tags). */
export interface LinkMessageContent {
  kind: 'link';
  url: string;
  title?: string;
  description?: string;
  image?: ImageSourcePropType;
  siteName?: string;
  status?: AttachmentStatus;
  onPress?: () => void;
}

export type MessageContent =
  | TextMessageContent
  | ImageMessageContent
  | ImageGroupMessageContent
  | TextImageMessageContent
  | StickerMessageContent
  | GifMessageContent
  | VideoMessageContent
  | VoiceMessageContent
  | DocumentMessageContent
  | LocationMessageContent
  | ContactMessageContent
  | LinkMessageContent;

/** What the quoted message was. Each kind renders its own 40pt artefact
 * alongside the sender name inside the quote block. */
export type QuotedContent =
  | { kind: 'text'; snippet: string }
  | { kind: 'image'; thumbnail: ImageSourcePropType }
  | { kind: 'video'; thumbnail: ImageSourcePropType; duration?: string }
  | { kind: 'sticker'; source: ImageSourcePropType }
  | { kind: 'gif'; thumbnail: ImageSourcePropType }
  | { kind: 'imageGroup'; thumbnails: ImageSourcePropType[]; count?: number }
  | { kind: 'voice'; duration: string }
  | { kind: 'document'; fileName: string }
  | { kind: 'location'; label: string }
  | { kind: 'contact'; name: string }
  | { kind: 'link'; title?: string; url: string };

/** The message being replied to, rendered as a nested quote block at the top
 * of the bubble. */
export interface QuotedMessage {
  senderName: string;
  content: QuotedContent;
  /** Jump to the quoted message. */
  onPress?: () => void;
}

export interface MessageBubbleProps {
  direction: MessageDirection;
  /** Defaults to `'direct'`. */
  context?: MessageContext;
  /** Shown as the sender header on incoming group messages; ignored otherwise. */
  senderName?: string;
  content: MessageContent;
  replyTo?: QuotedMessage;
  timestamp: string;
  /** Outgoing only — incoming messages have no delivery state to report. */
  status?: DeliveryState;
  onPress?: () => void;
  onLongPress?: () => void;
  /** Enables swipe-to-reply (drag toward the thread's center, release past a
   * threshold) when provided. Fires once per completed swipe; the bubble
   * always springs back to place, whether or not the threshold was met. */
  onSwipeReply?: () => void;
  style?: StyleProp<ViewStyle>;
}
