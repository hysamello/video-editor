import {
  AbsoluteFill,
  Video,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import IconAnimation from "../src/components/IconAnimation";

type CompositionProps = {
  videoSrc: string;
  overlayText: string;
};

export const MyComposition: React.FC<CompositionProps> = ({
  videoSrc,
  overlayText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation for smooth fade-in and slide-up effect
  const translateY = spring({
    frame,
    fps,
    from: 50,
    to: 0,
    durationInFrames: 30,
  });

  const opacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Background Video */}
      <Video src={videoSrc} style={{ width: "100%", height: "100%" }} />

      {/* ✅ Overlay - Positioned at Bottom Left with Animation */}
      {frame < 300 && (
        <div
          style={{
            position: "absolute",
            bottom: "120px", // Adjust positioning as needed
            left: "120px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "15px",
            borderRadius: "12px",
            color: "white",
            fontSize: "20px",
            gap: "12px",
            transform: `translateY(${translateY}px)`,
            opacity,
          }}
        >
          {/* Animated Icon */}
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#4caf50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconAnimation />
          </div>

          {/* ✅ Multi-line text with proper formatting */}
          <div style={{ whiteSpace: "pre-line" }}>{overlayText}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
