import { useState, useEffect } from "react";

export default function OverlayEditor() {
  const [text, setText] = useState("");
  const [icon, setIcon] = useState("");
  const [position] = useState({ x: 50, y: 50 });

  const handleAddOverlay = () => {
    if (window.electron) {
      window.electron.sendOverlayData({ text, icon, position });
    } else {
      console.error("Electron API not available");
    }
  };

  useEffect(() => {
    if (window.electron) {
      window.electron.onOverlayAdded((data) => {
        console.log("Overlay received:", data);
      });
    }
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter icon URL"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      />
      <button onClick={handleAddOverlay}>Add Overlay</button>
    </div>
  );
}
