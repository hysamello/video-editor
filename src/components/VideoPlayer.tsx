import { useState } from "react";

interface VideoPlayerProps {
  overlayText: string;
  position: { x: number; y: number };
}

export default function VideoPlayer({
  overlayText,
  position,
}: VideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleSelectVideo = async () => {
    if (window.electron) {
      const videoPath = await window.electron.openVideoDialog();
      if (videoPath) {
        setVideoSrc(`file://${videoPath}`);
        console.log("Caminho do vídeo selecionado:", videoPath);
      } else {
        console.error("Nenhum vídeo selecionado.");
      }
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button onClick={handleSelectVideo}>Selecionar Vídeo</button>
      {videoSrc && (
        <div style={{ position: "relative" }}>
          <video controls width="100%" src={videoSrc} />
          {/* Overlay Preview */}
          <div
            style={{
              position: "absolute",
              top: `${position.y}px`,
              left: `${position.x}px`,
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
              pointerEvents: "none", // Prevents interference with video controls
            }}
          >
            {overlayText}
          </div>
        </div>
      )}
    </div>
  );
}
