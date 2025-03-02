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
      <Video src={videoSrc} />

      {/* Overlay */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="ml-10 w-96 h-32 bg-black rounded-2xl text-container flex items-center gap-4 opacity-80">
          <div className="w-36 h-36 rounded-full bg-blue-50 flex items-center justify-center">
            <IconAnimation />
          </div>
          <div className="pl-4 h-full justify-center flex flex-col gap-2 text-xl text-white">
            <p>{overlayText || "Strand Road Tramore"}</p>
            <p>Waterford</p>
            <p>X91 DD73</p>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
