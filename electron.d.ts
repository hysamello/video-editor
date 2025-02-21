export interface ElectronAPI {
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
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
