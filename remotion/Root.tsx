import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MyVideo"
    component={MyComposition}
    durationInFrames={900}
    fps={30}
    width={1280}
    height={720}
    defaultProps={{ videoSrc: "", overlayText: "Default Text", startAt: 0, durationInFrames: 10 * 30, color: "#000000" }}
  />
);
