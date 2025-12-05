export function drawVisualizer(ctx, canvas, bufferLength, barWidth, dataArray) {
  let x = 0;

  // Left side
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 2;
    const hue = i * 0.5;

    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight - 15, barWidth, 15);

    ctx.fillStyle = `hsl(${hue},100%,${barHeight / 3}%)`;
    ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth;
  }

  // Right side
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 2;
    const hue = i * 0.5;

    ctx.fillStyle = "white";
    ctx.fillRect(x, canvas.height - barHeight - 15, barWidth, 15);

    ctx.fillStyle = `hsl(${hue},100%,${barHeight / 3}%)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth;
  }
}
