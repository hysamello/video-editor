export interface ElectronAPI {
  openVideoDialog: () => Promise<string | null>; // Open video selection dialog
  copyVideoToPublic: (videoPath: string) => Promise<string | null>; // Copy video to public folder
  renderRemotionVideo: (
    videoPath: string,
    overlayText: string,
  ) => Promise<string>; // Render video using Remotion
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
