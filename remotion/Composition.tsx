import { AbsoluteFill, Video } from "remotion";
import IconAnimation from "../src/components/IconAnimation";

type CompositionProps = {
  videoSrc: string;
  overlayText: string;
};

export const MyComposition: React.FC<CompositionProps> = ({
  videoSrc,
  overlayText,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Background Video */}
      <Video src={videoSrc} style={{ width: "100%", height: "100%" }} />

      {/* Overlay - Positioned at Bottom Left */}
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

        {/* Text Content */}
        <div>
          <p style={{ margin: "2px 0" }}>
            {overlayText || "Strand Road Tramore"}
          </p>
          <p style={{ margin: "2px 0" }}>Waterford</p>
          <p style={{ margin: "2px 0" }}>X91 DD73</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
