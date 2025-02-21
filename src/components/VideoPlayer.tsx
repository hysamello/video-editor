import { useState } from "react";

export default function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleSelectVideo = async () => {
    if (window.electron) {
      const videoPath = await window.electron.openVideoDialog();
      if (videoPath) {
        setVideoSrc(`file://${videoPath}`);
        console.log("Caminho do vídeo selecionado:", videoPath);
      } else {
        console.error("Nenhum vídeo selecionado.");
      }
    }
  };

  return (
    <div>
      <button onClick={handleSelectVideo}>Selecionar Vídeo</button>
      {videoSrc && <video controls width="100%" src={videoSrc} />}
    </div>
  );
}
