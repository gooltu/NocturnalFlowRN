import { useRef } from 'react';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder } from 'expo-audio';

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
    // iOS puts the session in the `.record`/`.playAndRecord` category while
    // `allowsRecording` is true, which must be switched back off below —
    // otherwise a just-recorded file's playback can come out silent/routed
    // to the earpiece instead of the speaker.
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stop = async (): Promise<string | null> => {
    if (recorder.isRecording) {
      await recorder.stop();
    }
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    uriRef.current = recorder.uri;
    return recorder.uri;
  };

  /** No explicit file cleanup — expo-audio records into the OS cache/temp
   * directory, which the platform reclaims on its own. Deleting it
   * immediately would need `expo-file-system` for one line of tidiness this
   * demo app doesn't need. Discard can fire mid-recording (trash tapped
   * before stop), so it still needs to stop the recorder and release
   * `allowsRecording` itself — otherwise the session is left stuck in
   * recording mode for every bubble's playback afterward. */
  const discard = () => {
    if (recorder.isRecording) {
      recorder.stop();
      setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    }
    uriRef.current = null;
  };

  return { start, stop, discard };
}
