// Credit: a resource I used to learn the basics of creating audio visualizers with javascript: https://www.youtube.com/watch?v=VXWvfrmpapI&t=1053s

export function initializeAudioVisualizer() {
  const canvas = document.getElementById('canvas-audio');
  const file = document.getElementById('file-upload');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  let audioSource;
  let analyser;

  file.addEventListener('change', function() {
    const files = this.files;
    const audio = document.getElementById('audio-player');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();

    audioSource = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = (canvas.width / 2) / bufferLength;
    let barHeight;
    let x;

    function animate() {
      x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);
      drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
      requestAnimationFrame(animate);
    }
    animate();
  });

  function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
    // Left side of visualizer
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 2;
      ctx.fillStyle = 'white';
      ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight - 15, barWidth, 15);
      const hue = i * 0.5;
      ctx.fillStyle = 'hsl(' + hue + ',100%,' + barHeight / 3 + '%)';
      ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    // Right side of visualizer
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 2;
      ctx.fillStyle = 'white';
      ctx.fillRect(x, canvas.height - barHeight - 15, barWidth, 15);
      const hue = i * 0.5;
      ctx.fillStyle = 'hsl(' + hue + ',100%,' + barHeight / 3 + '%)';
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}