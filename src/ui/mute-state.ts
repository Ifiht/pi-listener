export type MuteState = {
  mute(): boolean;
  unmute(): boolean;
  toggle(): boolean;
  isMuted(): boolean;
};

export function createMuteState(initialMuted = false): MuteState {
  let muted = initialMuted;

  return {
    mute(): boolean {
      muted = true;
      return muted;
    },
    unmute(): boolean {
      muted = false;
      return muted;
    },
    toggle(): boolean {
      muted = !muted;
      return muted;
    },
    isMuted(): boolean {
      return muted;
    },
  };
}
