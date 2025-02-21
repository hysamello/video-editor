import { useState, useEffect } from "react";

export default function OverlayEditor() {
  const [text, setText] = useState("");
  const [position] = useState({ x: 50, y: 50 });

  const handleAddOverlay = () => {
    if (window.electron) {
      window.electron.sendOverlayData({ text, position });
    } else {
      console.error("Electron API not available");
    }
  };

  const handleExportVideo = () => {
    if (window.electron) {
      window.electron.exportVideo(text);
    } else {
      console.error("Electron API not available");
    }
  };

  useEffect(() => {
    if (window.electron) {
      window.electron.onOverlayAdded((data) => {
        console.log("Overlay received:", data);
      });

      window.electron.onVideoExported((filePath) => {
        alert(`Vídeo exportado para: ${filePath}`);
      });
    }
  }, []);

  return (
    <div>
      <h2>Overlay Editor</h2>
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAddOverlay}>Add Overlay</button>
      <button onClick={handleExportVideo}>Export Video</button>
    </div>
  );
}
