import { QuotedMessage } from '../../molecules/MessageBubble/types';

/** One selectable sticker/GIF result. Deliberately generic — the design
 * system has no idea where this came from (Klipy, another provider, mocks);
 * the consumer maps its own API responses onto this shape. */
export interface PickerMediaItem {
  id: string | number;
  /** Small/cheap image for the grid. */
  previewUri: string;
  /** Full-resolution asset, sent as the message content on tap. */
  fullUri: string;
}

/** Controlled search state for one media tab (Sticker or GIF), owned by the
 * consumer. `query`/`onSearch` round-trip so the panel can show the current
 * search text without keeping its own copy — switching tabs and back
 * preserves each tab's last search instead of clobbering it. */
export interface MediaSearchState {
  items: PickerMediaItem[];
  loading: boolean;
  error?: string;
  query: string;
  /** Called on every keystroke; empty string means "show trending". The
   * consumer is expected to debounce before actually fetching. */
  onSearch: (query: string) => void;
}

export interface ChatInputBarProps {
  onSend?: (text: string) => void;
  onAttach?: () => void;
  /** Shows a reply bar above the composer, quoting this message. Typically
   * set from a bubble's `onSwipeReply`. */
  replyTo?: QuotedMessage;
  /** Called when the reply bar's close button is pressed. */
  onCancelReply?: () => void;
  /** Feeds the panel's Sticker tab. Omit to show that tab empty/disabled —
   * the emoji tab (bundled, no network) always works regardless. */
  stickers?: MediaSearchState;
  /** Feeds the panel's GIF tab. Same contract as `stickers`. */
  gifs?: MediaSearchState;
  /** A sticker was tapped — sends immediately, per the design: the panel
   * closes right after. */
  onSendSticker?: (item: PickerMediaItem) => void;
  /** A GIF was tapped — same fire-and-close behavior as `onSendSticker`. */
  onSendGif?: (item: PickerMediaItem) => void;
  /** The mic button's built-in recorder is a self-contained UI-only mock —
   * a real elapsed-time timer and a fake animated waveform, no actual mic
   * access. `onSendVoiceNote` fires with that mock's duration/waveform when
   * the user commits from the review step. To back it with real audio (e.g.
   * `expo-audio`), start capture in `onRecordingStart`, stop and hold onto
   * the file yourself in `onRecordingStop`, then attach it to whatever
   * message you construct when `onSendVoiceNote` fires — this component has
   * no concept of an audio file, only of the mock timing that drives its UI. */
  onSendVoiceNote?: (result: { duration: string; waveform: number[] }) => void;
  /** Fires the moment the mic button starts the mock recording. */
  onRecordingStart?: () => void;
  /** Fires when recording moves from the recording step to the review step
   * (user tapped stop) — this is when a real integration would stop mic
   * capture and finalize the audio file. */
  onRecordingStop?: () => void;
  /** Fires when the trash button is pressed, in either the recording or
   * review step — this is when a real integration should discard whatever
   * audio file it was holding onto (from `onRecordingStop`), since the mock
   * timer/waveform reset with no further signal otherwise. */
  onDiscardRecording?: () => void;
  /** Controls the review step's play/pause button. Omit both to use
   * `ChatInputBar`'s own mock toggle (just flips the icon, no real audio —
   * fine when there's no real recording behind it either). Provide both to
   * take over completely, e.g. wiring real playback of the file captured in
   * `onRecordingStop` — once provided, the internal mock toggle is bypassed
   * entirely, both props are required together. */
  previewPlaying?: boolean;
  onTogglePreviewPlayback?: () => void;
}
