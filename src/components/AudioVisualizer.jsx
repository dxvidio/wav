import "../styles/AudioVisualizer.css";
import { useRef } from "react";
import { useAudioVisualizer } from "../hooks/useAudioVisualizer";

export default function AudioVisualizer() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Hook handles resizing, analyzer creation, animation loop, etc.
  const handleFileUpload = useAudioVisualizer(canvasRef, audioRef);

  return (
    <div className="container">
      <canvas id="canvas-audio" ref={canvasRef} />

      <div className="audio-container">
        <input
          id="file-upload"
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
        />
        <audio id="audio-player" ref={audioRef} controls />
      </div>
    </div>
  );
}
