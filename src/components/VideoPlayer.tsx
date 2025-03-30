import { ChangeEvent, KeyboardEvent, useState } from "react";
import { Player } from "@remotion/player";
import { MyComposition } from "../../remotion/Composition";

export default function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState(
    "Strand Road Tramore\nWaterford\nX91 DD73",
  );

  const [startAt, setStartAt] = useState(3);

  const [duration, setDuration] = useState(10);
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
      startAt,
      duration,
      (newProgress) => setProgress(newProgress),
    );

    setRendering(false);
  };

  const handleChangeAddress = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const lines = inputValue.split("\n");

    if (lines.length <= 3) {
      setOverlayText(inputValue);
    } else {
      setOverlayText(lines.slice(0, 3).join("\n"));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const lines = overlayText.split("\n");

    // Prevent adding more lines via Enter
    if (e.key === "Enter" && lines.length >= 3) {
      e.preventDefault();
    }
  };

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <button onClick={handleSelectVideo}>Select Video</button>

      {videoSrc && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: "10px",
              padding: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "80%",
                alignItems: "flex-start",
              }}
            >
              <label htmlFor="overlay-text">Put address here</label>
              {/* ✅ Textarea for multi-line input */}
              <textarea
                value={overlayText}
                placeholder="Enter overlay text..."
                style={{
                  width: "100%",
                  height: "100px",
                  display: "block",
                  resize: "vertical",
                  padding: "10px",
                  fontSize: "16px",
                }}
                onChange={handleChangeAddress}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <label htmlFor="start">Start at</label>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                  }}
                >
                  <input
                    id="start"
                    type="number"
                    onChange={(e) => setStartAt(+e.target.value)}
                    value={startAt}
                    placeholder="Start at"
                  />
                  Seconds
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <label htmlFor="duration">Duration</label>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                  }}
                >
                  <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(+e.target.value)}
                    placeholder="Start at"
                  />
                  Seconds
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Video Player */}
          <div
            style={{
              transform: "scale(0.7)",
              transformOrigin: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Player
              component={MyComposition}
              inputProps={{
                videoSrc,
                overlayText,
                startAt,
                durationInFrames: duration * 30,
              }}
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
        </div>
      )}
    </div>
  );
}
