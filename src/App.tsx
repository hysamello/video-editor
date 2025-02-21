import VideoPlayer from "./components/VideoPlayer";
import OverlayEditor from "./components/OverlayEditor.tsx";

function App() {
  return (
    <div>
      <h1>Video Editor</h1>
      <VideoPlayer />
      <OverlayEditor />
    </div>
  );
}

export default App;
