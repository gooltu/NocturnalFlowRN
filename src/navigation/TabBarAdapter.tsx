import React from 'react';
import { MessageCircle, Phone, Settings, Users } from 'lucide-react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationBar, NavTabItem } from '@nocturnalflow/design-system';
import type { TabParamList } from './types';

type AppTab = keyof TabParamList;

/** This app's concrete tab set — count, labels and icons are all defined
 * here, at the app layer; `NavigationBar` itself has no built-in tabs. */
const TABS: NavTabItem<AppTab>[] = [
  { key: 'chats', label: 'Chats', icon: MessageCircle },
  { key: 'calls', label: 'Calls', icon: Phone },
  { key: 'contacts', label: 'Contacts', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
];

/** Renders the design system's `NavigationBar` (a plain `tabs`/`active`/
 * `onChange` component, unaware of react-navigation) as a `bottom-tabs`
 * custom `tabBar`. Tab route names are the lowercase `AppTab` literals, so
 * no name-mapping is needed between the two. */
export function renderTabBar({ state, navigation }: BottomTabBarProps) {
  const active = state.routeNames[state.index] as AppTab;
  return (
    <NavigationBar
      tabs={TABS}
      active={active}
      onChange={(tab) => navigation.navigate(tab)}
    />
  );
}
