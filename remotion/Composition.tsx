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
                  bottom: "20px", // Adjust positioning as needed
                  left: "20px",
                  display: "flex",
                  alignItems: "center",

                  color: "white",
                  fontSize: "20px",
                  transform: `translateY(${translateY}px)`,
                  opacity,
                }}
            >
              {/* Animated Icon */}
              <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
              >
                <IconAnimation />
              </div>

              <div
                  style={{
                    backgroundColor: "#000000FF",
                    borderRadius: "12px",
                    paddingLeft: "100px",
                    paddingRight: "30px"
                  }}
              >

                {/* ✅ Multi-line text with proper formatting */}
                <div style={{ whiteSpace: "pre-line" }}>{overlayText}</div>
              </div>

            </div>

      )}
    </AbsoluteFill>
  );
};
