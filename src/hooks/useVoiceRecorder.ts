import { useRef } from 'react';
import { RecordingPresets, requestRecordingPermissionsAsync, useAudioRecorder } from 'expo-audio';

/** Real mic recording via expo-audio, kept entirely in the app layer —
 * `@nocturnalflow/design-system` has no idea this exists. Wire `start`/
 * `stop`/`discard` to `ChatInputBar`'s `onRecordingStart`/`onRecordingStop`/
 * `onDiscardRecording`; the design system's own mock timer/waveform keep
 * driving the visible UI regardless, this just captures the real file
 * alongside it. */
export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const uriRef = useRef<string | null>(null);

  const start = async () => {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) return;
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stop = async (): Promise<string | null> => {
    if (recorder.isRecording) {
      await recorder.stop();
    }
    uriRef.current = recorder.uri;
    return recorder.uri;
  };

  /** No explicit file cleanup — expo-audio records into the OS cache/temp
   * directory, which the platform reclaims on its own. Deleting it
   * immediately would need `expo-file-system` for one line of tidiness this
   * demo app doesn't need. */
  const discard = () => {
    uriRef.current = null;
  };

  return { start, stop, discard };
}
