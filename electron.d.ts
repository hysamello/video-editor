export interface ElectronAPI {
  openVideoDialog: () => Promise<string | null>;
  renderRemotionVideo: (
    videoSrc: string,
    overlayText: string,
    startAt: number,
    duration: number,
    progressCallback: (progress: number) => void,
  ) => Promise<string>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
