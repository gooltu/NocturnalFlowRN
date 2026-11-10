import React from 'react';
import { Header, testIDSegment } from '@nocturnalflow/design-system';
import type { HeaderExtraProps } from './types';

interface HeaderAdapterProps {
  options: { title?: string; headerProps?: HeaderExtraProps };
  back?: { title?: string } | undefined;
  navigation: { goBack: () => void };
  route: { name: string };
}

/** Shared `screenOptions.header` renderer for both the root stack and the tab
 * navigator — renders the design system's `Header` from whatever `options`/
 * `back`/`navigation` the calling navigator passes in. Screens supply the rest
 * of `Header`'s props (subtitle/avatar/actions/gamebar/...) via the
 * `headerProps` option (see `types.ts`), set through `navigation.setOptions`.
 * The header's E2E testID is `<route-name>.header` (kebab-cased, e.g.
 * `conversation.header`, `select-contacts.header`, `chats.header`). */
export function renderHeader({ options, back, navigation, route }: HeaderAdapterProps) {
  return (
    <Header
      title={options.title ?? ''}
      onBack={back ? () => navigation.goBack() : undefined}
      testID={`${testIDSegment(route.name)}.header`}
      {...options.headerProps}
    />
  );
}
