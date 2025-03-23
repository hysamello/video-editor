import VideoPlayer from "./components/VideoPlayer.tsx";

function App() {
  return (
    <div style={{
        textAlign: "center",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 50 }}>
      <h1>Icon Animation</h1>
      <VideoPlayer />
    </div>
  );
}

export default App;
