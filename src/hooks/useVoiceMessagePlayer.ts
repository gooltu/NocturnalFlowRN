import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

/** Real playback for one voice-note bubble, kept entirely in the app layer.
 * `uri` is undefined for the scripted mock voice messages in mockData.ts
 * (no real audio ever existed for those) — `useAudioPlayer(null)` is a
 * harmless no-op source, so `toggle` just does nothing and `playing` stays
 * false, leaving those bubbles to fall back to MessageBubble's own
 * uncontrolled local toggle exactly as before. */
export function useVoiceMessagePlayer(uri?: string) {
  const player = useAudioPlayer(uri ?? null);
  const status = useAudioPlayerStatus(player);

  const toggle = () => {
    if (!uri) return;
    if (status.playing) {
      player.pause();
      return;
    }
    // Resume from pause, but restart from 0 once playback has run out —
    // otherwise a finished note's play button would look inert.
    const finished = status.duration > 0 && status.currentTime >= status.duration;
    if (finished) player.seekTo(0);
    player.play();
  };

  return {
    playing: status.playing,
    progress: status.duration > 0 ? status.currentTime / status.duration : 0,
    toggle,
  };
}
