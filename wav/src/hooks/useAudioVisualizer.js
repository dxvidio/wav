import { useEffect, useRef } from "react";
import { drawVisualizer } from "../utils/drawVisualizer";

export function useAudioVisualizer(canvasRef, audioRef) {
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animationIdRef = useRef(null);

  // Canvas resizing logic (previously in useEffect)
  useEffect(() => {
    const canvas = canvasRef.current;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [canvasRef]);

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width / 2) / bufferLength;

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);

      drawVisualizer(ctx, canvas, bufferLength, barWidth, dataArray);
    }

    animate();
  };

  // Handles file upload & audio graph creation
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const audio = audioRef.current;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const audioCtx = audioCtxRef.current;

    audio.src = URL.createObjectURL(file);
    audio.load();

    const audioSource = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyserRef.current = analyser;

    startVisualizer();
  };

  return handleFileUpload;
}
