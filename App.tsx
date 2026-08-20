import React, { useState } from 'react';
import { Phone, Settings, Users } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import {
  useAppFonts,
  ThemeProvider,
  useStyles,
  useTheme,
  ThemeColors,
  EmptyState,
  NavigationBar,
  NavTab,
} from '@nocturnalflow/design-system';
import { ChatsScreen, ConversationScreen, SelectContactsScreen } from './src/screens';
import { MessageBubbleGalleryScreen } from './src/screens/MessageBubbleGalleryScreen';

const SHOW_GALLERY = false;

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const styles = useStyles(makeStyles);
  const { themeName } = useTheme();
  const barStyle = themeName === 'dark' ? 'light' : 'dark';
  const [fontsLoaded] = useAppFonts();
  const [activeTab, setActiveTab] = useState<NavTab>('chats');
  const [openChatId, setOpenChatId] = useState<string | null>(null);
  const [showSelectContacts, setShowSelectContacts] = useState(false);

  if (!fontsLoaded) return null;

  if (SHOW_GALLERY) {
    return (
      <SafeAreaProvider>
        <View style={styles.root}>
          <MessageBubbleGalleryScreen />
          <StatusBar style={barStyle} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (openChatId) {
    return (
      <SafeAreaProvider>
        <View style={styles.root}>
          <ConversationScreen chatId={openChatId} onBack={() => setOpenChatId(null)} />
          <StatusBar style={barStyle} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (showSelectContacts) {
    return (
      <SafeAreaProvider>
        <View style={styles.root}>
          <SelectContactsScreen
            onBack={() => setShowSelectContacts(false)}
            onSelectContact={(chatId) => {
              setShowSelectContacts(false);
              setOpenChatId(chatId);
            }}
          />
          <StatusBar style={barStyle} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {activeTab === 'chats' && (
          <ChatsScreen onOpenChat={setOpenChatId} onNewMessage={() => setShowSelectContacts(true)} />
        )}
        {activeTab === 'calls' && (
          <PlaceholderTab icon={Phone} title="No calls yet" description="Your call history will show up here." />
        )}
        {activeTab === 'contacts' && (
          <PlaceholderTab icon={Users} title="No contacts yet" description="People you message will appear here." />
        )}
        {activeTab === 'settings' && (
          <PlaceholderTab icon={Settings} title="Settings" description="Account, notifications, and privacy controls." />
        )}
        <NavigationBar active={activeTab} onChange={setActiveTab} />
        <StatusBar style={barStyle} />
      </View>
    </SafeAreaProvider>
  );
}

function PlaceholderTab({
  icon,
  title,
  description,
}: {
  icon: React.ComponentProps<typeof EmptyState>['icon'];
  title: string;
  description: string;
}) {
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.root, styles.centered]}>
      <EmptyState icon={icon} title={title} description={description} />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
  },
});
