import { useState } from "react";
import { Player } from "@remotion/player";
import { MyComposition } from "../../remotion/Composition";

export default function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState(
    "Strand Road Tramore\nWaterford\nX91 DD73",
  );
  const [durationInFrames, setDurationInFrames] = useState(300);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const handleSelectVideo = async () => {
    if (window.electron) {
      const videoUrl = await window.electron.openVideoDialog();
      if (videoUrl) {
        setVideoSrc(videoUrl);

        const videoElement = document.createElement("video");
        videoElement.src = videoUrl;
        videoElement.load();

        videoElement.onloadedmetadata = () => {
          const totalFrames = Math.floor(videoElement.duration * 30);
          setDurationInFrames(totalFrames);
          console.log("🎬 Duration in Frames:", totalFrames);
        };
      }
    }
  };

  const handleRenderVideo = async () => {
    if (!videoSrc) return;
    setRendering(true);
    setProgress(0);

    await window.electron.renderRemotionVideo(
      videoSrc,
      overlayText,
      (newProgress) => setProgress(newProgress),
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
              inputProps={{ videoSrc, overlayText, durationInFrames }}
              durationInFrames={durationInFrames}
              fps={30}
              compositionWidth={1280}
              compositionHeight={720}
              controls
              acknowledgeRemotionLicense
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
                    background: "#980202",
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
