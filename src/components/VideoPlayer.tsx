import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import IconAnimation from "./IconAnimation.tsx";

interface VideoPlayerProps {
  overlayText: string;
}

export default function VideoPlayer({ overlayText }: VideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleSelectVideo = async () => {
    if (window.electron) {
      const videoPath = await window.electron.openVideoDialog();
      if (videoPath) {
        setVideoSrc(`file://${videoPath}`);
        console.log("Video path:", videoPath);
      } else {
        console.error("No video selected.");
      }
    }
  };

  const handleCaptureOverlay = async () => {
    if (!overlayRef.current || !window.electron) return;

    const canvas = await html2canvas(overlayRef.current);
    const image = canvas.toDataURL("image/png");

    window.electron.sendOverlayImage(image);
    window.electron.onOverlayImageSaved((filePath) => {
      console.log("Overlay saved at:", filePath);
      window.electron.exportVideoWithImage(filePath);
    });
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button onClick={handleSelectVideo}>Select Video</button>
      {videoSrc && (
        <div ref={videoRef} className="relative">
          <video height="600px" controls width="100%" src={videoSrc} />

          {/* Overlay on top of the video */}
          <div
            ref={overlayRef}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
          >
            <div className="ml-10 w-96 h-32 bg-black rounded-2xl text-container flex items-center gap-4 opacity-80">
              <div className="w-36 h-36 rounded-full bg-blue-50 flex items-center justify-center">
                <IconAnimation />
              </div>
              <div className="pl-4 h-full justify-center flex flex-col gap-2 text-xl text-white">
                <p>{overlayText || "Strand Road Tramore"}</p>
                <p>Waterford</p>
                <p>X91 DD73</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <button onClick={handleCaptureOverlay}>Capture & Export Overlay</button>
    </div>
  );
}
