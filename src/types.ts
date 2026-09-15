export type NovaSettings = {
  voiceAssistant: boolean;
  bilingualRecognition: boolean;
  aiAutoReply: boolean;
  callScreener: boolean;
  samsungStylePanel: boolean;
  smartSorting: boolean;
  weatherWidget: boolean;
  stepsWidget: boolean;
  idleTimerMinutes: number | null;
  glowColor: string;
};

export const defaultNovaSettings: NovaSettings = {
  voiceAssistant: true,
  bilingualRecognition: true,
  aiAutoReply: false,
  callScreener: false,
  samsungStylePanel: true,
  smartSorting: true,
  weatherWidget: true,
  stepsWidget: true,
  idleTimerMinutes: 5,
  glowColor: '#8B5CF6',
};
