import { useState } from "react";
import VideoPlayer from "./VideoPlayer";

export default function OverlayEditor() {
  const [text, setText] = useState("");
  const [position] = useState({ x: 50, y: 50 });

  const handleExportVideo = () => {
    if (window.electron) {
      window.electron.exportVideo(text);
    } else {
      console.error("Electron API not available");
    }
  };

  return (
    <div>
      {/* Pass text and position directly to VideoPlayer */}
      <VideoPlayer overlayText={text} position={position} />
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleExportVideo}>Export Video</button>
    </div>
  );
}
