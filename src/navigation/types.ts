import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { HeaderProps } from '@nocturnalflow/design-system';

export type RootStackParamList = {
  Tabs: undefined;
  Conversation: { chatId: string };
  SelectContacts: undefined;
  Gallery: undefined;
};

export type TabParamList = {
  chats: undefined;
  calls: undefined;
  contacts: undefined;
  settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/** Everything `Header` needs beyond `title`/`onBack` (which the navigator itself
 * derives from `options.title` and the back-stack). Set via `navigation.setOptions`. */
export type HeaderExtraProps = Partial<Omit<HeaderProps, 'title' | 'onBack'>>;

/** `NativeStackNavigationOptions`/`BottomTabNavigationOptions` are `type` aliases in
 * @react-navigation 7.x, not `interface`s, so they can't be declaration-merged —
 * these intersections are the options shape actually passed to `Stack.Screen`/
 * `Tab.Screen`/`navigation.setOptions` throughout `src/`. */
export type AppStackOptions = NativeStackNavigationOptions & { headerProps?: HeaderExtraProps };
export type AppTabOptions = BottomTabNavigationOptions & { headerProps?: HeaderExtraProps };
