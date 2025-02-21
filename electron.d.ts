export interface ElectronAPI {
  openVideoDialog: () => Promise<string | null>;
  sendOverlayData: (data: {
    text?: string;
    icon?: string;
    position: { x: number; y: number };
  }) => void;
  onOverlayAdded: (
    callback: (data: {
      text?: string;
      icon?: string;
      position: { x: number; y: number };
    }) => void,
  ) => void;
  exportVideo: () => void;
  onVideoExported: (callback: (filePath: string) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
