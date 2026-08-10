import React, { useState } from 'react';
import { Phone, Settings, Users } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { colors } from './src/theme';
import { useAppFonts } from './src/theme';
import { EmptyState } from './src/components/organisms/EmptyState';
import { NavigationBar, NavTab } from './src/components/organisms/NavigationBar';
import { ChatsScreen, ConversationScreen } from './src/screens';

export default function App() {
  const [fontsLoaded] = useAppFonts();
  const [activeTab, setActiveTab] = useState<NavTab>('chats');
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  if (!fontsLoaded) return null;

  if (openChatId) {
    return (
      <SafeAreaProvider>
        <View style={styles.root}>
          <ConversationScreen chatId={openChatId} onBack={() => setOpenChatId(null)} />
          <StatusBar style="light" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {activeTab === 'chats' && <ChatsScreen onOpenChat={setOpenChatId} />}
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
        <StatusBar style="light" />
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
  return (
    <View style={[styles.root, styles.centered]}>
      <EmptyState icon={icon} title={title} description={description} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
  },
});
