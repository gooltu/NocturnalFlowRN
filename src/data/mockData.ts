import { PresenceState, DeliveryState, AttachmentStatus } from '@nocturnalflow/design-system';

export interface Contact {
  id: string;
  name: string;
  initials: string;
  presence: PresenceState;
  level: number;
  xp: number;
  xpMax: number;
}

export type MessageItem =
  | {
    id: string;
    type: 'divider';
    label: string;
  }
  | {
    id: string;
    type: 'text';
    sender: 'me' | 'them';
    text: string;
    timestamp: string;
    status?: DeliveryState;
    /** id of another message in the same chat this one replies to — resolved
     * to a `QuotedMessage` at render time via `quotedContentFor`, so a reply
     * can quote a message of any kind, not just text. */
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'media';
    sender: 'me' | 'them';
    imageUri: string;
    caption?: string;
    timestamp: string;
    reactions?: { emoji: string; count: number }[];
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'voice';
    sender: 'me' | 'them';
    duration: string;
    timestamp: string;
    /** Relative bar heights (0-1) — set on messages sent via the recorder so
     * the bubble reflects what was actually "recorded" instead of the
     * bubble's generic default pattern. */
    waveform?: number[];
    /** Local file URI from expo-audio, set only on messages actually sent
     * via the recorder — the scripted mock voice messages below have none,
     * since no real audio was ever recorded for them. */
    uri?: string;
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'sticker';
    sender: 'me' | 'them';
    imageUri: string;
    timestamp: string;
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'gif';
    sender: 'me' | 'them';
    imageUri: string;
    timestamp: string;
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'video';
    sender: 'me' | 'them';
    thumbnailUri: string;
    duration: string;
    timestamp: string;
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'document';
    sender: 'me' | 'them';
    fileName: string;
    fileSize: string;
    fileType: string;
    /** Omit for the normal, fully-downloaded look. */
    status?: AttachmentStatus;
    timestamp: string;
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'location';
    sender: 'me' | 'them';
    label: string;
    address?: string;
    mapImageUri?: string;
    status?: AttachmentStatus;
    timestamp: string;
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'contact';
    sender: 'me' | 'them';
    name: string;
    subtitle?: string;
    avatarUri?: string;
    initials?: string;
    status?: AttachmentStatus;
    timestamp: string;
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  }
  | {
    id: string;
    type: 'link';
    sender: 'me' | 'them';
    url: string;
    title?: string;
    description?: string;
    imageUri?: string;
    siteName?: string;
    status?: AttachmentStatus;
    timestamp: string;
    replyToId?: string;
    /** Group-thread sender label, shown as a header above incoming bubbles
     * when the chat's `context` is `'group'`. Ignored for `sender: 'me'` and
     * in direct chats — `MessageBubble` never shows a header in either case. */
    senderName?: string;
  };

export interface ChatSummary {
  id: string;
  contact: Contact;
  /** Omit (or `'direct'`) for a 1-on-1 thread. `'group'` makes incoming
   * bubbles show a sender-name header — wired via each `MessageItem`'s
   * `senderName`. */
  context?: 'direct' | 'group';
  snippet: string;
  timestamp: string;
  unreadCount: number;
  isTyping?: boolean;
  messages: MessageItem[];
}

/** Each entry below is a bubble-type verification chat, not a "real" scripted
 * conversation: the contact name is the bubble type itself so the chat list
 * doubles as a table of contents, and every message inside it exists purely
 * to exercise one incoming/outgoing × state combination for that type. Keep
 * this shape (one type per chat, every state represented) when adding a new
 * `MessageItem` type — it's what makes visual QA fast. */
export const chats: ChatSummary[] = [
  {
    id: 'text-bubble',
    contact: {
      id: 'text-bubble',
      name: 'Text',
      initials: 'TX',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + sent/delivered/seen + reply',
    timestamp: '09:06',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      { id: 'text-in', type: 'text', sender: 'them', text: 'Hey — did the export finish?', timestamp: '09:01' },
      {
        id: 'text-out-sent',
        type: 'text',
        sender: 'me',
        text: 'Yep, uploading now.',
        timestamp: '09:02',
        status: 'sent',
      },
      {
        id: 'text-out-delivered',
        type: 'text',
        sender: 'me',
        text: 'Should be visible on your end.',
        timestamp: '09:03',
        status: 'delivered',
      },
      {
        id: 'text-out-seen',
        type: 'text',
        sender: 'me',
        text: 'Nice, I can see it 👍',
        timestamp: '09:04',
        status: 'seen',
      },
      {
        id: 'text-reply-in',
        type: 'text',
        sender: 'them',
        text: 'Got it, thanks!',
        timestamp: '09:05',
        replyToId: 'text-out-seen',
      },
      {
        id: 'text-reply-out',
        type: 'text',
        sender: 'me',
        text: 'Anytime — let me know if anything looks off.',
        timestamp: '09:06',
        status: 'sent',
        replyToId: 'text-in',
      },
    ],
  },
  {
    id: 'image-bubble',
    contact: {
      id: 'image-bubble',
      name: 'Image',
      initials: 'IMG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing, with/without caption + reply',
    timestamp: '09:06',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'image-in-plain',
        type: 'media',
        sender: 'them',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-in-plain/800/600',
        timestamp: '09:01',
      },
      {
        id: 'image-in-caption',
        type: 'media',
        sender: 'them',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-in-caption/800/600',
        caption: 'Found this spot downtown',
        timestamp: '09:02',
      },
      {
        id: 'image-out-plain',
        type: 'media',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-out-plain/800/600',
        timestamp: '09:03',
      },
      {
        id: 'image-out-caption',
        type: 'media',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-out-caption/800/600',
        caption: "Here's the final crop",
        timestamp: '09:04',
      },
      {
        id: 'image-reply-in',
        type: 'media',
        sender: 'them',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-reply-in/800/600',
        caption: 'Love this crop',
        timestamp: '09:05',
        replyToId: 'image-out-caption',
      },
      {
        id: 'image-reply-out',
        type: 'media',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-reply-out/800/600',
        timestamp: '09:06',
        replyToId: 'image-in-caption',
      },
    ],
  },
  {
    id: 'sticker-bubble',
    contact: {
      id: 'sticker-bubble',
      name: 'Sticker',
      initials: 'ST',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing + reply',
    timestamp: '09:04',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'sticker-in',
        type: 'sticker',
        sender: 'them',
        imageUri: 'https://picsum.photos/seed/nocturnal-sticker-in/300/300',
        timestamp: '09:01',
      },
      {
        id: 'sticker-out',
        type: 'sticker',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-sticker-out/300/300',
        timestamp: '09:02',
      },
      {
        id: 'sticker-reply-in',
        type: 'sticker',
        sender: 'them',
        imageUri: 'https://picsum.photos/seed/nocturnal-sticker-reply-in/300/300',
        timestamp: '09:03',
        replyToId: 'sticker-out',
      },
      {
        id: 'sticker-reply-out',
        type: 'sticker',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-sticker-reply-out/300/300',
        timestamp: '09:04',
        replyToId: 'sticker-in',
      },
    ],
  },
  {
    id: 'gif-bubble',
    contact: {
      id: 'gif-bubble',
      name: 'GIF',
      initials: 'GIF',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing + reply',
    timestamp: '09:04',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'gif-in',
        type: 'gif',
        sender: 'them',
        imageUri: 'https://picsum.photos/seed/nocturnal-gif-in/480/320',
        timestamp: '09:01',
      },
      {
        id: 'gif-out',
        type: 'gif',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-gif-out/480/320',
        timestamp: '09:02',
      },
      {
        id: 'gif-reply-in',
        type: 'gif',
        sender: 'them',
        imageUri: 'https://picsum.photos/seed/nocturnal-gif-reply-in/480/320',
        timestamp: '09:03',
        replyToId: 'gif-out',
      },
      {
        id: 'gif-reply-out',
        type: 'gif',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-gif-reply-out/480/320',
        timestamp: '09:04',
        replyToId: 'gif-in',
      },
    ],
  },
  {
    id: 'video-bubble',
    contact: {
      id: 'video-bubble',
      name: 'Video',
      initials: 'VID',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing + reply',
    timestamp: '09:04',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'video-in',
        type: 'video',
        sender: 'them',
        thumbnailUri: 'https://picsum.photos/seed/nocturnal-video-in/800/450',
        duration: '0:45',
        timestamp: '09:01',
      },
      {
        id: 'video-out',
        type: 'video',
        sender: 'me',
        thumbnailUri: 'https://picsum.photos/seed/nocturnal-video-out/800/450',
        duration: '1:12',
        timestamp: '09:02',
      },
      {
        id: 'video-reply-in',
        type: 'video',
        sender: 'them',
        thumbnailUri: 'https://picsum.photos/seed/nocturnal-video-reply-in/800/450',
        duration: '0:18',
        timestamp: '09:03',
        replyToId: 'video-out',
      },
      {
        id: 'video-reply-out',
        type: 'video',
        sender: 'me',
        thumbnailUri: 'https://picsum.photos/seed/nocturnal-video-reply-out/800/450',
        duration: '0:33',
        timestamp: '09:04',
        replyToId: 'video-in',
      },
    ],
  },
  {
    id: 'voice-bubble',
    contact: {
      id: 'voice-bubble',
      name: 'Voice',
      initials: 'VC',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing + reply',
    timestamp: '09:04',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      { id: 'voice-in', type: 'voice', sender: 'them', duration: '0:09', timestamp: '09:01' },
      { id: 'voice-out', type: 'voice', sender: 'me', duration: '0:22', timestamp: '09:02' },
      {
        id: 'voice-reply-in',
        type: 'voice',
        sender: 'them',
        duration: '0:07',
        timestamp: '09:03',
        replyToId: 'voice-out',
      },
      {
        id: 'voice-reply-out',
        type: 'voice',
        sender: 'me',
        duration: '0:11',
        timestamp: '09:04',
        replyToId: 'voice-in',
      },
    ],
  },
  {
    id: 'document-bubble',
    contact: {
      id: 'document-bubble',
      name: 'Document',
      initials: 'DOC',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing, ready/downloading/failed + reply',
    timestamp: '09:08',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'doc-in-ready',
        type: 'document',
        sender: 'them',
        fileName: 'Design_Spec_v3.pdf',
        fileSize: '2.4 MB',
        fileType: 'pdf',
        timestamp: '09:01',
      },
      {
        id: 'doc-out-ready',
        type: 'document',
        sender: 'me',
        fileName: 'Sprint_Notes.docx',
        fileSize: '184 KB',
        fileType: 'docx',
        timestamp: '09:02',
      },
      {
        id: 'doc-in-downloading',
        type: 'document',
        sender: 'them',
        fileName: 'Release_Build.zip',
        fileSize: '18.2 MB',
        fileType: 'zip',
        status: 'downloading',
        timestamp: '09:03',
      },
      {
        id: 'doc-out-downloading',
        type: 'document',
        sender: 'me',
        fileName: 'Contract_Draft.pdf',
        fileSize: '1.1 MB',
        fileType: 'pdf',
        status: 'downloading',
        timestamp: '09:04',
      },
      {
        id: 'doc-in-failed',
        type: 'document',
        sender: 'them',
        fileName: 'Onboarding_Deck.pptx',
        fileSize: '6.7 MB',
        fileType: 'pptx',
        status: 'failed',
        timestamp: '09:05',
      },
      {
        id: 'doc-out-failed',
        type: 'document',
        sender: 'me',
        fileName: 'Invoice_0421.pdf',
        fileSize: '340 KB',
        fileType: 'pdf',
        status: 'failed',
        timestamp: '09:06',
      },
      {
        id: 'doc-reply-in',
        type: 'document',
        sender: 'them',
        fileName: 'Sprint_Notes_Reviewed.docx',
        fileSize: '190 KB',
        fileType: 'docx',
        timestamp: '09:07',
        replyToId: 'doc-out-ready',
      },
      {
        id: 'doc-reply-out',
        type: 'document',
        sender: 'me',
        fileName: 'Design_Spec_v4.pdf',
        fileSize: '2.6 MB',
        fileType: 'pdf',
        timestamp: '09:08',
        replyToId: 'doc-in-ready',
      },
    ],
  },
  {
    id: 'location-bubble',
    contact: {
      id: 'location-bubble',
      name: 'Location',
      initials: 'LOC',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing, ready/downloading/failed + reply',
    timestamp: '09:17',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'loc-in-ready',
        type: 'location',
        sender: 'them',
        label: 'Rooftop Bar',
        address: '212 8th Ave, New York, NY',
        mapImageUri: 'https://picsum.photos/seed/nocturnal-map-rooftop/800/500',
        timestamp: '09:10',
      },
      {
        id: 'loc-out-ready',
        type: 'location',
        sender: 'me',
        label: 'Studio Office',
        address: '88 Lafayette St, New York, NY',
        mapImageUri: 'https://picsum.photos/seed/nocturnal-map-studio/800/500',
        timestamp: '09:11',
      },
      {
        id: 'loc-in-downloading',
        type: 'location',
        sender: 'them',
        label: 'Current Location',
        status: 'downloading',
        timestamp: '09:12',
      },
      {
        id: 'loc-out-downloading',
        type: 'location',
        sender: 'me',
        label: 'Meeting Point',
        status: 'downloading',
        timestamp: '09:13',
      },
      {
        id: 'loc-in-failed',
        type: 'location',
        sender: 'them',
        label: 'Shared Location',
        status: 'failed',
        timestamp: '09:14',
      },
      {
        id: 'loc-out-failed',
        type: 'location',
        sender: 'me',
        label: 'Shared Location',
        status: 'failed',
        timestamp: '09:15',
      },
      {
        id: 'loc-reply-in',
        type: 'location',
        sender: 'them',
        label: 'Nearby Cafe',
        address: '10 Bond St, New York, NY',
        mapImageUri: 'https://picsum.photos/seed/nocturnal-map-reply-in/800/500',
        timestamp: '09:16',
        replyToId: 'loc-out-ready',
      },
      {
        id: 'loc-reply-out',
        type: 'location',
        sender: 'me',
        label: 'Parking Garage',
        address: '5 Astor Pl, New York, NY',
        mapImageUri: 'https://picsum.photos/seed/nocturnal-map-reply-out/800/500',
        timestamp: '09:17',
        replyToId: 'loc-in-ready',
      },
    ],
  },
  {
    id: 'contact-bubble',
    contact: {
      id: 'contact-bubble',
      name: 'Contact',
      initials: 'CT',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing, ready/downloading/failed + reply',
    timestamp: '09:27',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'contact-in-ready',
        type: 'contact',
        sender: 'them',
        name: 'Priya Nair',
        subtitle: '+1 (415) 555-0148',
        initials: 'PN',
        timestamp: '09:20',
      },
      {
        id: 'contact-out-ready',
        type: 'contact',
        sender: 'me',
        name: 'Marcus Webb',
        subtitle: '+1 (212) 555-0199',
        avatarUri: 'https://picsum.photos/seed/nocturnal-contact-marcus/200/200',
        timestamp: '09:21',
      },
      {
        id: 'contact-in-downloading',
        type: 'contact',
        sender: 'them',
        name: 'Contact card',
        status: 'downloading',
        timestamp: '09:22',
      },
      {
        id: 'contact-out-downloading',
        type: 'contact',
        sender: 'me',
        name: 'Contact card',
        status: 'downloading',
        timestamp: '09:23',
      },
      {
        id: 'contact-in-failed',
        type: 'contact',
        sender: 'them',
        name: 'Contact card',
        status: 'failed',
        timestamp: '09:24',
      },
      {
        id: 'contact-out-failed',
        type: 'contact',
        sender: 'me',
        name: 'Contact card',
        status: 'failed',
        timestamp: '09:25',
      },
      {
        id: 'contact-reply-in',
        type: 'contact',
        sender: 'them',
        name: 'Elena Ruiz',
        subtitle: '+1 (650) 555-0173',
        initials: 'ER',
        timestamp: '09:26',
        replyToId: 'contact-out-ready',
      },
      {
        id: 'contact-reply-out',
        type: 'contact',
        sender: 'me',
        name: 'Sam Torres',
        subtitle: '+1 (917) 555-0122',
        initials: 'ST',
        timestamp: '09:27',
        replyToId: 'contact-in-ready',
      },
    ],
  },
  {
    id: 'link-bubble',
    contact: {
      id: 'link-bubble',
      name: 'Link',
      initials: 'LK',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    snippet: 'Incoming + outgoing, ready/downloading/failed + reply',
    timestamp: '09:37',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'link-in-ready',
        type: 'link',
        sender: 'them',
        url: 'reactnative.dev/blog',
        title: "What's New in React Native 0.81",
        description: 'A rundown of the latest architecture and tooling improvements.',
        siteName: 'React Native Blog',
        imageUri: 'https://picsum.photos/seed/nocturnal-link-rn/800/420',
        timestamp: '09:30',
      },
      {
        id: 'link-out-ready',
        type: 'link',
        sender: 'me',
        url: 'expo.dev/changelog',
        title: 'Expo SDK 57 Changelog',
        description: 'New APIs, config plugins and platform support in this release.',
        siteName: 'Expo',
        imageUri: 'https://picsum.photos/seed/nocturnal-link-expo/800/420',
        timestamp: '09:31',
      },
      {
        id: 'link-in-downloading',
        type: 'link',
        sender: 'them',
        url: 'youtube.com/watch?v=abc123',
        status: 'downloading',
        timestamp: '09:32',
      },
      {
        id: 'link-out-downloading',
        type: 'link',
        sender: 'me',
        url: 'medium.com/@team/design-tokens',
        status: 'downloading',
        timestamp: '09:33',
      },
      {
        id: 'link-in-failed',
        type: 'link',
        sender: 'them',
        url: 'news.ycombinator.com/item?id=1',
        status: 'failed',
        timestamp: '09:34',
      },
      {
        id: 'link-out-failed',
        type: 'link',
        sender: 'me',
        url: 'github.com/expo/expo',
        status: 'failed',
        timestamp: '09:35',
      },
      {
        id: 'link-reply-in',
        type: 'link',
        sender: 'them',
        url: 'expo.dev/eas',
        title: 'EAS Build Overview',
        description: 'Cloud builds for iOS and Android from a single command.',
        siteName: 'Expo',
        imageUri: 'https://picsum.photos/seed/nocturnal-link-reply-in/800/420',
        timestamp: '09:36',
        replyToId: 'link-out-ready',
      },
      {
        id: 'link-reply-out',
        type: 'link',
        sender: 'me',
        url: 'reactnative.dev/docs/next/getting-started',
        title: 'React Native — Getting Started',
        description: 'Set up your environment and create your first app.',
        siteName: 'React Native',
        imageUri: 'https://picsum.photos/seed/nocturnal-link-reply-out/800/420',
        timestamp: '09:37',
        replyToId: 'link-in-ready',
      },
    ],
  },

  /** Group-chat counterparts of every bubble type above — same content
   * shapes, but `context: 'group'` plus two different `senderName`s on the
   * incoming messages, to verify the per-sender header renders (and changes)
   * correctly for each kind. Outgoing bubbles never get a header, group or
   * not, so one outgoing message per chat is enough to confirm that holds. */
  {
    id: 'text-group',
    contact: {
      id: 'text-group',
      name: 'Text Group',
      initials: 'TG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'text-group-priya',
        type: 'text',
        sender: 'them',
        senderName: 'Priya Nair',
        text: 'Anyone free to review the PR?',
        timestamp: '09:01',
      },
      {
        id: 'text-group-marcus',
        type: 'text',
        sender: 'them',
        senderName: 'Marcus Webb',
        text: 'I can take a look after lunch.',
        timestamp: '09:02',
      },
      {
        id: 'text-group-me',
        type: 'text',
        sender: 'me',
        text: "I'll check it now.",
        timestamp: '09:03',
        status: 'sent',
      },
    ],
  },
  {
    id: 'image-group',
    contact: {
      id: 'image-group',
      name: 'Image Group',
      initials: 'IG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'image-group-priya',
        type: 'media',
        sender: 'them',
        senderName: 'Priya Nair',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-group-priya/800/600',
        timestamp: '09:01',
      },
      {
        id: 'image-group-marcus',
        type: 'media',
        sender: 'them',
        senderName: 'Marcus Webb',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-group-marcus/800/600',
        caption: 'From the offsite',
        timestamp: '09:02',
      },
      {
        id: 'image-group-me',
        type: 'media',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-img-group-me/800/600',
        timestamp: '09:03',
      },
    ],
  },
  {
    id: 'sticker-group',
    contact: {
      id: 'sticker-group',
      name: 'Sticker Group',
      initials: 'SG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'sticker-group-priya',
        type: 'sticker',
        sender: 'them',
        senderName: 'Priya Nair',
        imageUri: 'https://picsum.photos/seed/nocturnal-sticker-group-priya/300/300',
        timestamp: '09:01',
      },
      {
        id: 'sticker-group-marcus',
        type: 'sticker',
        sender: 'them',
        senderName: 'Marcus Webb',
        imageUri: 'https://picsum.photos/seed/nocturnal-sticker-group-marcus/300/300',
        timestamp: '09:02',
      },
      {
        id: 'sticker-group-me',
        type: 'sticker',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-sticker-group-me/300/300',
        timestamp: '09:03',
      },
    ],
  },
  {
    id: 'gif-group',
    contact: {
      id: 'gif-group',
      name: 'GIF Group',
      initials: 'GG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'gif-group-priya',
        type: 'gif',
        sender: 'them',
        senderName: 'Priya Nair',
        imageUri: 'https://picsum.photos/seed/nocturnal-gif-group-priya/480/320',
        timestamp: '09:01',
      },
      {
        id: 'gif-group-marcus',
        type: 'gif',
        sender: 'them',
        senderName: 'Marcus Webb',
        imageUri: 'https://picsum.photos/seed/nocturnal-gif-group-marcus/480/320',
        timestamp: '09:02',
      },
      {
        id: 'gif-group-me',
        type: 'gif',
        sender: 'me',
        imageUri: 'https://picsum.photos/seed/nocturnal-gif-group-me/480/320',
        timestamp: '09:03',
      },
    ],
  },
  {
    id: 'video-group',
    contact: {
      id: 'video-group',
      name: 'Video Group',
      initials: 'VG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'video-group-priya',
        type: 'video',
        sender: 'them',
        senderName: 'Priya Nair',
        thumbnailUri: 'https://picsum.photos/seed/nocturnal-video-group-priya/800/450',
        duration: '0:28',
        timestamp: '09:01',
      },
      {
        id: 'video-group-marcus',
        type: 'video',
        sender: 'them',
        senderName: 'Marcus Webb',
        thumbnailUri: 'https://picsum.photos/seed/nocturnal-video-group-marcus/800/450',
        duration: '0:52',
        timestamp: '09:02',
      },
      {
        id: 'video-group-me',
        type: 'video',
        sender: 'me',
        thumbnailUri: 'https://picsum.photos/seed/nocturnal-video-group-me/800/450',
        duration: '0:14',
        timestamp: '09:03',
      },
    ],
  },
  {
    id: 'voice-group',
    contact: {
      id: 'voice-group',
      name: 'Voice Group',
      initials: 'VO',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'voice-group-priya',
        type: 'voice',
        sender: 'them',
        senderName: 'Priya Nair',
        duration: '0:12',
        timestamp: '09:01',
      },
      {
        id: 'voice-group-marcus',
        type: 'voice',
        sender: 'them',
        senderName: 'Marcus Webb',
        duration: '0:31',
        timestamp: '09:02',
      },
      {
        id: 'voice-group-me',
        type: 'voice',
        sender: 'me',
        duration: '0:08',
        timestamp: '09:03',
      },
    ],
  },
  {
    id: 'document-group',
    contact: {
      id: 'document-group',
      name: 'Document Group',
      initials: 'DG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'document-group-priya',
        type: 'document',
        sender: 'them',
        senderName: 'Priya Nair',
        fileName: 'Agenda.pdf',
        fileSize: '210 KB',
        fileType: 'pdf',
        timestamp: '09:01',
      },
      {
        id: 'document-group-marcus',
        type: 'document',
        sender: 'them',
        senderName: 'Marcus Webb',
        fileName: 'Budget_Q3.xlsx',
        fileSize: '96 KB',
        fileType: 'xlsx',
        timestamp: '09:02',
      },
      {
        id: 'document-group-me',
        type: 'document',
        sender: 'me',
        fileName: 'Notes.docx',
        fileSize: '48 KB',
        fileType: 'docx',
        timestamp: '09:03',
      },
    ],
  },
  {
    id: 'location-group',
    contact: {
      id: 'location-group',
      name: 'Location Group',
      initials: 'LG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'location-group-priya',
        type: 'location',
        sender: 'them',
        senderName: 'Priya Nair',
        label: 'Conference Center',
        address: '655 W 34th St, New York, NY',
        mapImageUri: 'https://picsum.photos/seed/nocturnal-map-group-priya/800/500',
        timestamp: '09:01',
      },
      {
        id: 'location-group-marcus',
        type: 'location',
        sender: 'them',
        senderName: 'Marcus Webb',
        label: 'Lunch Spot',
        address: '30 W 26th St, New York, NY',
        mapImageUri: 'https://picsum.photos/seed/nocturnal-map-group-marcus/800/500',
        timestamp: '09:02',
      },
      {
        id: 'location-group-me',
        type: 'location',
        sender: 'me',
        label: "Meeting In 10",
        address: '20 W 34th St, New York, NY',
        mapImageUri: 'https://picsum.photos/seed/nocturnal-map-group-me/800/500',
        timestamp: '09:03',
      },
    ],
  },
  {
    id: 'contact-group',
    contact: {
      id: 'contact-group',
      name: 'Contact Group',
      initials: 'CG',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'contact-group-priya',
        type: 'contact',
        sender: 'them',
        senderName: 'Priya Nair',
        name: 'Elena Ruiz',
        subtitle: '+1 (650) 555-0173',
        initials: 'ER',
        timestamp: '09:01',
      },
      {
        id: 'contact-group-marcus',
        type: 'contact',
        sender: 'them',
        senderName: 'Marcus Webb',
        name: 'Sam Torres',
        subtitle: '+1 (917) 555-0122',
        initials: 'ST',
        timestamp: '09:02',
      },
      {
        id: 'contact-group-me',
        type: 'contact',
        sender: 'me',
        name: 'Dana Kim',
        subtitle: '+1 (312) 555-0166',
        initials: 'DK',
        timestamp: '09:03',
      },
    ],
  },
  {
    id: 'link-group',
    contact: {
      id: 'link-group',
      name: 'Link Group',
      initials: 'LK',
      presence: 'online',
      level: 1,
      xp: 0,
      xpMax: 100,
    },
    context: 'group',
    snippet: 'Priya, Marcus + you — sender headers',
    timestamp: '09:03',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'link-group-priya',
        type: 'link',
        sender: 'them',
        senderName: 'Priya Nair',
        url: 'figma.com/blog',
        title: 'Whats New in Figma',
        description: 'Latest updates to components and variables.',
        siteName: 'Figma Blog',
        imageUri: 'https://picsum.photos/seed/nocturnal-link-group-priya/800/420',
        timestamp: '09:01',
      },
      {
        id: 'link-group-marcus',
        type: 'link',
        sender: 'them',
        senderName: 'Marcus Webb',
        url: 'notion.so/blog',
        title: 'Notion Product Updates',
        description: 'New database views and AI features.',
        siteName: 'Notion Blog',
        imageUri: 'https://picsum.photos/seed/nocturnal-link-group-marcus/800/420',
        timestamp: '09:02',
      },
      {
        id: 'link-group-me',
        type: 'link',
        sender: 'me',
        url: 'linear.app/changelog',
        title: 'Linear Changelog',
        description: 'Weekly product updates from the Linear team.',
        siteName: 'Linear',
        imageUri: 'https://picsum.photos/seed/nocturnal-link-group-me/800/420',
        timestamp: '09:03',
      },
    ],
  },
];

export interface CurrentUser {
  name: string;
  level: number;
  xp: number;
  xpMax: number;
  gems: number;
  crates: number;
}

/** The signed-in player, used by the Chats header's gamebar and currencies. */
export const currentUser: CurrentUser = {
  name: 'You',
  level: 1,
  xp: 112,
  xpMax: 300,
  gems: 24,
  crates: 3,
};
