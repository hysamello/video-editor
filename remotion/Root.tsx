import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyComposition}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          videoSrc: "",
          overlayText: "Default Text",
        }}
      />
    </>
  );
};
