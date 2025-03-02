import { useState } from "react";
import { Player } from "@remotion/player";
import { MyComposition } from "../../remotion/Composition";

interface VideoPlayerProps {
  overlayText: string;
}

export default function VideoPlayer({ overlayText }: VideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const handleSelectVideo = async () => {
    if (window.electron) {
      const videoUrl = await window.electron.openVideoDialog();
      if (videoUrl) {
        setVideoSrc(videoUrl);
      } else {
        console.error("No video selected.");
      }
    }
  };

  const handleRenderVideo = async () => {
    if (!videoSrc) return;
    setRendering(true);
    setProgress(0); // Reset progress

    // Track rendering progress from Remotion logs
    await window.electron.renderRemotionVideo(
      videoSrc,
      overlayText,
      (newProgress: number) => {
        setProgress(newProgress);
      },
    );

    setRendering(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", textAlign: "center" }}>
      <button onClick={handleSelectVideo}>Select Video</button>

      {videoSrc && (
        <>
          {/* ✅ Reduce Player size to 70% */}
          <div style={{ transform: "scale(0.7)", transformOrigin: "center" }}>
            <Player
              component={MyComposition}
              inputProps={{ videoSrc, overlayText }}
              durationInFrames={300} // 10 seconds at 30fps
              fps={30}
              compositionWidth={1280}
              compositionHeight={720}
              controls
            />
          </div>

          <button onClick={handleRenderVideo} disabled={rendering}>
            {rendering ? "Rendering..." : "Export Video"}
          </button>

          {/* ✅ Show progress bar while rendering */}
          {rendering && (
            <div style={{ marginTop: 10 }}>
              <p>Rendering: {progress}%</p>
              <div
                style={{
                  width: "70%",
                  height: "10px",
                  background: "#ddd",
                  margin: "auto",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "#4caf50",
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
