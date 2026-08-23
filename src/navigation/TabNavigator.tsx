import React from 'react';
import { Phone, Settings, Users } from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { ChatsScreen, PlaceholderScreen } from '../screens';
import { renderHeader } from './HeaderAdapter';
import { renderTabBar } from './TabBarAdapter';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

function SettingsScreen() {
  const navigation = useNavigation();
  return (
    <PlaceholderScreen
      icon={Settings}
      title="Settings"
      description="Account, notifications, and privacy controls."
      actionLabel="Component Gallery"
      onAction={() => navigation.navigate('Gallery')}
    />
  );
}

/** Chats/Calls/Contacts/Settings, rendered through the floating-capsule
 * `NavigationBar` (via `TabBarAdapter`) instead of the default tab bar. Only
 * the `chats` screen shows a header — matches today's behavior, where the
 * other three tabs are bare `EmptyState` placeholders. */
export function TabNavigator() {
  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={{ header: renderHeader }}>
      <Tab.Screen name="chats" component={ChatsScreen} />
      <Tab.Screen name="calls" options={{ headerShown: true }}>
        {() => (
          <PlaceholderScreen icon={Phone} title="No calls yet" description="Your call history will show up here." />
        )}
      </Tab.Screen>
      <Tab.Screen name="contacts" options={{ headerShown: true }}>
        {() => (
          <PlaceholderScreen icon={Users} title="No contacts yet" description="People you message will appear here." />
        )}
      </Tab.Screen>
      <Tab.Screen name="settings" component={SettingsScreen} options={{ headerShown: true }} />
    </Tab.Navigator>
  );
}
