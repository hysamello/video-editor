import { useState } from "react";
import { Player } from "@remotion/player";
import { MyComposition } from "../../remotion/Composition";

interface VideoPlayerProps {
  overlayText: string;
}

export default function VideoPlayer({ overlayText }: VideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [outputVideo, setOutputVideo] = useState<string | null>(null);

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
    const outputPath = await window.electron.renderRemotionVideo(
      videoSrc,
      overlayText,
    );
    setOutputVideo(outputPath);
    setRendering(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button onClick={handleSelectVideo}>Select Video</button>
      {videoSrc && (
        <>
          {/* ✅ Use the dynamic URL */}
          <Player
            component={MyComposition}
            inputProps={{ videoSrc, overlayText }}
            durationInFrames={300} // 10 seconds at 30fps
            fps={30}
            compositionWidth={1280}
            compositionHeight={720}
            controls
          />

          <button onClick={handleRenderVideo} disabled={rendering}>
            {rendering ? "Rendering..." : "Export Video"}
          </button>
        </>
      )}
      {outputVideo && (
        <div>
          <p>Video rendered at: {outputVideo}</p>
          <video src={outputVideo} controls width="100%" />
        </div>
      )}
    </div>
  );
}
