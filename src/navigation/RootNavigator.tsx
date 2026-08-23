import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConversationScreen, SelectContactsScreen } from '../screens';
import { MessageBubbleGalleryScreen } from '../screens/MessageBubbleGalleryScreen';
import { currentUser } from '../data/mockData';
import { renderHeader } from './HeaderAdapter';
import { TabNavigator } from './TabNavigator';
import type { AppStackOptions, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const selectContactsOptions: AppStackOptions = {
  title: 'Select Contact',
  headerProps: {
    gamebar: { level: currentUser.level, xpCurrent: currentUser.xp, xpMax: currentUser.xpMax },
  },
};

/** Root stack: the tab flow (its own header per-tab, so no header here), then
 * three full-screen pushes with no tab bar — `Conversation`, `SelectContacts`,
 * and the dev-only `Gallery` route (replaces the old `SHOW_GALLERY` bypass
 * flag; reachable from the Settings tab). */
export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
      <Stack.Screen name="SelectContacts" component={SelectContactsScreen} options={selectContactsOptions} />
      <Stack.Screen
        name="Gallery"
        component={MessageBubbleGalleryScreen}
        options={{ title: 'Component Gallery' }}
      />
    </Stack.Navigator>
  );
}
