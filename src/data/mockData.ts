import { PresenceState } from '../components/atoms/Avatar';
import { DeliveryState } from '../components/atoms/DeliveryStatus';

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
      replyTo?: { senderName: string; snippet: string };
    }
  | {
      id: string;
      type: 'media';
      sender: 'me' | 'them';
      imageUri: string;
      caption?: string;
      timestamp: string;
      reactions?: { emoji: string; count: number }[];
    }
  | {
      id: string;
      type: 'voice';
      sender: 'me' | 'them';
      duration: string;
      timestamp: string;
    };

export interface ChatSummary {
  id: string;
  contact: Contact;
  snippet: string;
  timestamp: string;
  unreadCount: number;
  isTyping?: boolean;
  messages: MessageItem[];
}

export const chats: ChatSummary[] = [
  {
    id: 'maya-chen',
    contact: {
      id: 'maya-chen',
      name: 'Maya Chen',
      initials: 'MC',
      presence: 'online',
      level: 1,
      xp: 112,
      xpMax: 300,
    },
    snippet: 'Sounds good — see you at eight',
    timestamp: '21:04',
    unreadCount: 3,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'm1',
        type: 'text',
        sender: 'them',
        text: 'Pushed the dark palette — charcoal layers read much better at night.',
        timestamp: '20:58',
      },
      { id: 'm2', type: 'text', sender: 'them', text: 'Take a look when you can', timestamp: '23:02' },
      {
        id: 'm3',
        type: 'text',
        sender: 'me',
        text: 'Just opened it — the 4 px tail corners makes grouping obvious.',
        timestamp: '21:04',
        status: 'seen',
      },
      {
        id: 'm4',
        type: 'media',
        sender: 'them',
        imageUri: 'https://picsum.photos/seed/nocturnal-rooftop/800/600',
        caption: 'Rooftop, just before the rain',
        timestamp: '21:07',
        reactions: [{ emoji: '❤️', count: 2 }],
      },
      { id: 'm5', type: 'voice', sender: 'me', duration: '0:14', timestamp: '21:09' },
      {
        id: 'm6',
        type: 'text',
        sender: 'me',
        text: 'Sounds good — see you at eight',
        timestamp: '21:12',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'rahul-kapoor',
    contact: {
      id: 'rahul-kapoor',
      name: 'Rahul Kapoor',
      initials: 'RK',
      presence: 'online',
      level: 4,
      xp: 210,
      xpMax: 350,
    },
    snippet: 'Send the build to TestFlight',
    timestamp: '19:41',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      { id: 'm1', type: 'text', sender: 'them', text: 'Build 214 is green on CI.', timestamp: '19:20' },
      {
        id: 'm2',
        type: 'text',
        sender: 'them',
        text: 'Send the build to TestFlight',
        timestamp: '19:41',
      },
      {
        id: 'm3',
        type: 'text',
        sender: 'me',
        text: 'On it — uploading now.',
        timestamp: '19:43',
        status: 'sent',
      },
    ],
  },
  {
    id: 'design-team',
    contact: {
      id: 'design-team',
      name: 'Design Team',
      initials: 'DT',
      presence: 'offline',
      level: 7,
      xp: 40,
      xpMax: 500,
    },
    snippet: 'Aisha: palette tokens are locked',
    timestamp: '18:12',
    unreadCount: 1,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      {
        id: 'm1',
        type: 'text',
        sender: 'them',
        text: 'Palette tokens are locked, syncing to the .pen file now.',
        timestamp: '18:12',
      },
    ],
  },
  {
    id: 'sofia-lang',
    contact: {
      id: 'sofia-lang',
      name: 'Sofia Lang',
      initials: 'SL',
      presence: 'online',
      level: 2,
      xp: 275,
      xpMax: 300,
    },
    snippet: 'Voice message · 0:14',
    timestamp: '17:30',
    unreadCount: 0,
    isTyping: true,
    messages: [
      { id: 'd1', type: 'divider', label: 'Today' },
      { id: 'm1', type: 'voice', sender: 'them', duration: '0:14', timestamp: '17:30' },
    ],
  },
  {
    id: 'jonas-diaz',
    contact: {
      id: 'jonas-diaz',
      name: 'Jonas Diaz',
      initials: 'JD',
      presence: 'offline',
      level: 3,
      xp: 5,
      xpMax: 320,
    },
    snippet: 'You: shipping it tonight.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Yesterday' },
      { id: 'm1', type: 'text', sender: 'me', text: 'Shipping it tonight.', timestamp: '22:10', status: 'seen' },
    ],
  },
  {
    id: 'amara-osei',
    contact: {
      id: 'amara-osei',
      name: 'Amara Osei',
      initials: 'AM',
      presence: 'online',
      level: 5,
      xp: 150,
      xpMax: 400,
    },
    snippet: 'Can you review the sheet?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    messages: [],
  },
  {
    id: 'neel-barot',
    contact: {
      id: 'neel-barot',
      name: 'Neel Barot',
      initials: 'NB',
      presence: 'offline',
      level: 9,
      xp: 480,
      xpMax: 600,
    },
    snippet: 'Thanks! That fixed it 🙏',
    timestamp: 'Tue',
    unreadCount: 0,
    messages: [
      { id: 'd1', type: 'divider', label: 'Tuesday' },
      {
        id: 'm1',
        type: 'text',
        sender: 'them',
        text: 'Thanks! That fixed it 🙏',
        timestamp: 'Tue · 09:14',
        replyTo: { senderName: 'You', snippet: 'Try clearing the Metro cache first' },
      },
    ],
  },
];
