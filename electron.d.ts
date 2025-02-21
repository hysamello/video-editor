export interface ElectronAPI {
  sendOverlayImage: (imageData: string) => void; // Send overlay image data
  onOverlayImageSaved: (callback: (filePath: string) => void) => void; // Listen for saved image path
  exportVideoWithImage: (imagePath: string) => void; // Export video with the overlay image
  onVideoExported: (callback: (filePath: string) => void) => void; // Listen for exported video path
  openVideoDialog: () => Promise<string | null>; // Open video selection dialog
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
