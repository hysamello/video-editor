import { useState } from "react";
import VideoPlayer from "./VideoPlayer";

export default function OverlayEditor() {
  const [text, setText] = useState("");

  return (
    <div>
      <h2>Overlay Editor</h2>
      <input
        type="text"
        placeholder="Enter Address"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {/* Live preview with VideoPlayer */}
      <VideoPlayer overlayText={text} />
    </div>
  );
}
