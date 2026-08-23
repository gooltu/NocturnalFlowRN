import { useEffect, useRef, useState } from 'react';
import { MediaSearchState, PickerMediaItem } from '@nocturnalflow/design-system';
import { fetchGifs, fetchStickers } from '../api/klipy';

const DEBOUNCE_MS = 400;

const fetchers = {
  gifs: fetchGifs,
  stickers: fetchStickers,
};

/** Backs one Sticker or GIF tab: loads trending on first use, debounces
 * search-as-you-type, tracks loading/error. Returns the exact
 * `MediaSearchState` shape `ChatInputBar` expects. */
export function useMediaPicker(kind: 'gifs' | 'stickers'): MediaSearchState {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<PickerMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    const timer = setTimeout(
      () => {
        setLoading(true);
        setError(undefined);
        fetchers[kind](query)
          .then((result) => {
            if (requestId.current !== id) return;
            setItems(result);
          })
          .catch((err: Error) => {
            if (requestId.current !== id) return;
            setError(err.message);
          })
          .finally(() => {
            if (requestId.current !== id) return;
            setLoading(false);
          });
      },
      query ? DEBOUNCE_MS : 0
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, query]);

  return { items, loading, error, query, onSearch: setQuery };
}
