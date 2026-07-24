import { createMuteState, type MuteState } from "./ui/mute-state.ts";
import { resolvePiperVoiceSelection, setPiperMuted, type PiperPreferenceOptions, type PiperPreferenceResolution } from "./tts/piper-preferences.ts";

export type VoiceSettingsStartupState = {
  selection: PiperPreferenceResolution;
  muteState: MuteState;
};

export async function loadVoiceSettingsStartupState(options: PiperPreferenceOptions = {}): Promise<VoiceSettingsStartupState> {
  const selection = await resolvePiperVoiceSelection(options);
  return {
    selection,
    muteState: createMuteState(selection.muted),
  };
}

export async function persistVoiceSettingsMute(muted: boolean, options: PiperPreferenceOptions = {}): Promise<void> {
  await setPiperMuted(muted, options);
}
