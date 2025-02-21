import { useState } from "react";

export default function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileUpload} />
      {videoSrc && <video controls width="100%" src={videoSrc} />}
    </div>
  );
}
