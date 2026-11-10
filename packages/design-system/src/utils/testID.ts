/** Builds a child testID from a parent one using dot-separated segments:
 * `subTestID('chats.header', 'action', 'more')` → `'chats.header.action.more'`.
 * Returns `undefined` when `base` is undefined, so child IDs only exist when the
 * consumer opted in by passing a `testID` to the parent component. Segments that
 * are `undefined` are skipped. */
export function subTestID(
  base: string | undefined,
  ...parts: Array<string | number | undefined>
): string | undefined {
  if (!base) return undefined;
  const segments = parts.filter((p): p is string | number => p !== undefined && p !== '');
  return [base, ...segments].join('.');
}

/** Normalises free text (a route name, a label) into one testID segment:
 * camelCase/PascalCase and spaces become kebab-case, anything else non-
 * alphanumeric is dropped. `'SelectContacts'` → `'select-contacts'`,
 * `'New Group'` → `'new-group'`. */
export function testIDSegment(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
