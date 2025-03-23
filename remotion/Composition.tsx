import {
  AbsoluteFill,
  Video,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import IconAnimation from "../src/components/IconAnimation";
import * as React from "react";

type CompositionProps = {
  videoSrc: string;
  overlayText: string;
  startAt: number;
};

export const MyComposition: React.FC<CompositionProps> = ({
  videoSrc,
  overlayText,
    startAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = startAt * fps;
  const goFor = 300;

  const fadeStart = appear + goFor;
  const fadeDurationInFrames = 30; // 1 second fade at 30fps

  // Use spring only after fadeStart
  const fadeOutProgress = spring({
    frame: Math.max(0, frame - fadeStart),
    fps,
    config: {
      damping: 20,
      stiffness: 100,
      mass: 0.5,
    },
    durationInFrames: fadeDurationInFrames,
  });

  // Reverse progress so 1 → 0 (visible to invisible)
  const opacity = frame < fadeStart ? 1 : 1 - fadeOutProgress;

  const durationInSeconds = 2; // Animation duration
  const totalFrames = durationInSeconds * fps; // Total animation frames

  // Smooth growth using spring()
  const progress = spring({
        frame: Math.max(0, frame - appear), // Ensures smooth stop at full width
    fps,
    config: {
      stiffness: 50,
      damping: 10,
      mass: 0.5,
    },
    durationInFrames: totalFrames, // Ensure full animation cycle
  });

  const maxWidth = 500; // Adjust to fit text properly
  const width = progress * maxWidth; // Expands smoothly from 0px to maxWidth

  return (
    <AbsoluteFill style={{
      backgroundColor: "black",
      width: "100%"
    }}>
      {/* Background Video */}
      <Video src={videoSrc} style={{ width: "100%", height: "100%" }} />

      {/* ✅ Overlay - Positioned at Bottom Left with Animation */}
      {opacity > 0 && frame >= appear && (
            <div
                style={{
                  position: "absolute",
                  bottom: "100px", // Adjust positioning as needed
                  left: "100px",
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  fontSize: "20px",
                  opacity,
                }}
            >
              {/* Animated Icon */}
              <div
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute"
                  }}
              >
                <IconAnimation startAt={startAt * fps} />
              </div>

              <div
                  style={{
                    backgroundColor: "#000000FF",
                    borderRadius: "20px",
                    marginLeft: "30px",
                    height: "100px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: `${width}px`, // ✅ Explicit width growth
                    overflow: "hidden", // Prevents content from showing before expansion
                  }}
              >
                {/* ✅ Multi-line text with proper formatting */}
                <div style={{
                  whiteSpace: "pre-line",
                  overflow: "hidden",
                }}>{overlayText}</div>
              </div>

            </div>

      )}
    </AbsoluteFill>
  );
};
