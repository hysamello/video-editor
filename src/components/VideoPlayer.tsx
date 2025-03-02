import { useState } from "react";
import { Player } from "@remotion/player";
import { MyComposition } from "../../remotion/Composition";

export default function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState(
    "Strand Road Tramore\nWaterford\nX91 DD73",
  );
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
    <div style={{ textAlign: "center", position: "relative" }}>
      <button onClick={handleSelectVideo}>Select Video</button>

      {videoSrc && (
        <>
          {/* ✅ Textarea for multi-line input */}
          <textarea
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            placeholder="Enter overlay text..."
            style={{
              width: "80%",
              height: "100px",
              margin: "10px auto",
              display: "block",
              resize: "vertical",
              padding: "10px",
              fontSize: "16px",
            }}
          />

          {/* ✅ Video Player */}
          <div style={{ transform: "scale(0.7)", transformOrigin: "center" }}>
            <Player
              component={MyComposition}
              inputProps={{ videoSrc, overlayText }}
              durationInFrames={300}
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
