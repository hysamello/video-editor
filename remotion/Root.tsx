import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MyVideo"
    component={MyComposition}
    durationInFrames={300} // Only first 10 seconds
    fps={30}
    width={1280}
    height={720}
    defaultProps={{ videoSrc: "", overlayText: "Default Text" }}
  />
);
