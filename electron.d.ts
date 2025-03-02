export interface ElectronAPI {
  openVideoDialog: () => Promise<string | null>;
  renderRemotionVideo: (
    videoSrc: string,
    overlayText: string,
    progressCallback: (progress: number) => void,
  ) => Promise<string>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
