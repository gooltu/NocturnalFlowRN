import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationBar, NavTab } from '@nocturnalflow/design-system';

/** Renders the design system's `NavigationBar` (a plain `active`/`onChange`
 * component, unaware of react-navigation) as a `bottom-tabs` custom `tabBar`.
 * Tab route names are the lowercase `NavTab` literals, so no name-mapping is
 * needed between the two. */
export function renderTabBar({ state, navigation }: BottomTabBarProps) {
  const active = state.routeNames[state.index] as NavTab;
  return (
    <NavigationBar
      active={active}
      onChange={(tab) => navigation.navigate(tab)}
    />
  );
}
