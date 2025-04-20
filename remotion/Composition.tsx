import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig, interpolate, Easing,
} from "remotion";
import IconAnimation from "../src/components/IconAnimation";
import * as React from "react";

type CompositionProps = {
  videoSrc: string;
  overlayText: string;
  startAt: number;
  color: string;
  durationInFrames: number;
};

export const MyComposition: React.FC<CompositionProps> = ({
  videoSrc,
  overlayText,
  startAt,
    color,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = startAt * fps;

  const fadeStart = appear + durationInFrames;
  const fadeDurationInFrames = 30;
  const adjustedFrameFade = frame - fadeStart;

  const fadeOutProgress = interpolate(
      adjustedFrameFade < 0 ? 0 : adjustedFrameFade,
      [0, fadeDurationInFrames],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: t => t, // or Easing.out(Easing.ease) if desired
      }
  );

  const opacity = frame < fadeStart ? 1 : fadeOutProgress;

  const durationInSeconds = 2; // Animation duration
  const totalFrames = durationInSeconds * fps; // Total animation frames

  const adjustedFrame = frame - appear;

  const progress = interpolate(
      adjustedFrame < 0 ? 0 : adjustedFrame, // Clamp below 0
      [0, totalFrames],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.ease), // Optional: smooth ease-in-out
      }
  );

  const maxWidth = 500; // Adjust to fit text properly
  const width = progress * maxWidth; // Expands smoothly from 0px to maxWidth

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        width: "100%",
      }}
    >
      {/* Background Video */}
      <Video src={videoSrc} style={{ width: "100%", height: "100%" }} />

      {/* ✅ Overlay - Positioned at Bottom Left with Animation */}
      {frame >= appear && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100px", // Adjust positioning as needed
                  left: "100px",
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  fontSize: "20px",
                  opacity: Number(opacity),
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
                <IconAnimation startAt={appear} color={color} />
              </div>


              <div
                  style={{
                    backgroundColor: `${color}`,
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
                {frame > appear + 30 && (
                    <div style={{
                      whiteSpace: "pre-line",
                      overflow: "hidden",
                      fontWeight: "bold",
                      }}>{overlayText}
                    </div>

                )}
              </div>

            </div>

      )}
    </AbsoluteFill>
  );
};
