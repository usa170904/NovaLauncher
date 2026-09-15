import {Linking, NativeEventEmitter, NativeModules, Platform} from 'react-native';

type NovaVoiceNative = {
  isServiceRunning(): Promise<boolean>;
  hasMicrophonePermission(): Promise<boolean>;
  startVoiceService(language: string): Promise<boolean>;
  stopVoiceService(): Promise<boolean>;
  startRecognition(language: string): Promise<boolean>;
  stopRecognition(): Promise<boolean>;
};

type NovaLauncherNative = {
  isDefaultLauncher(): Promise<boolean>;
  requestDefaultLauncher(): Promise<boolean>;
};

type NovaMediaNative = {
  dispatchMediaAction(action: 'play' | 'pause' | 'next' | 'previous'): Promise<boolean>;
};

type NovaMiuiNative = {
  openBatteryOptimizationSettings(): Promise<boolean>;
};

type NovaTelecomNative = {
  isCallScreeningRoleHeld(): Promise<boolean>;
};

type NovaAiNative = {
  saveProvider(provider: string, apiKey: string, baseUrl: string, model: string): Promise<boolean>;
  listProviders(): Promise<Array<{provider: string; configured: boolean; baseUrl: string; model: string}>>;
  chat(provider: string, prompt: string): Promise<string>;
  generateWallpaper(provider: string, prompt: string, width: number, height: number): Promise<{imageUrl?: string; imageBase64?: string}>;
  applyWallpaper(imageUrl: string): Promise<boolean>;
};

const native = NativeModules;
export const NovaLauncher = native.NovaLauncher as NovaLauncherNative | undefined;
export const NovaVoice = native.NovaVoice as NovaVoiceNative | undefined;
export const NovaMedia = native.NovaMedia as NovaMediaNative | undefined;
export const NovaMiui = native.NovaMiui as NovaMiuiNative | undefined;
export const NovaTelecom = native.NovaTelecom as NovaTelecomNative | undefined;
export const NovaAi = native.NovaAi as NovaAiNative | undefined;

export const voiceEvents =
  Platform.OS === 'android' && NovaVoice ? new NativeEventEmitter(NovaVoice as any) : null;

export function openWebSearch(query: string) {
  return Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
}
