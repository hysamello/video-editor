export interface ElectronAPI {
  sendOverlayData: (data: {
    text?: string;
    position: { x: number; y: number };
  }) => void;
  onOverlayAdded: (
    callback: (data: {
      text?: string;
      position: { x: number; y: number };
    }) => void,
  ) => void;
  exportVideo: (overlayText: string) => void;
  onVideoExported: (callback: (filePath: string) => void) => void;
  sendVideoPath: (videoPath: string) => void;
  openVideoDialog: () => Promise<string | null>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
