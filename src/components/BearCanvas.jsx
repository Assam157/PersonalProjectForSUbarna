import React, { useRef, useEffect } from "react";

export default function BearLoveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    let t = 0;

    function drawBear() {
      // Body
      ctx.fillStyle = "#8b5a2b"; // brown bear
      ctx.beginPath();
      ctx.ellipse(W / 2, H / 2 + 40, 120, 140, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(W / 2, H / 2 - 120, 90, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.beginPath();
      ctx.arc(W / 2 - 60, H / 2 - 190, 30, 0, Math.PI * 2);
      ctx.arc(W / 2 + 60, H / 2 - 190, 30, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(W / 2 - 25, H / 2 - 130, 6, 0, Math.PI * 2);
      ctx.arc(W / 2 + 25, H / 2 - 130, 6, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.beginPath();
      ctx.arc(W / 2, H / 2 - 100, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawHeart() {
      ctx.fillStyle = "#b22222";
      ctx.beginPath();
      ctx.moveTo(W / 2, H / 2 + 10);
      ctx.bezierCurveTo(W / 2 - 30, H / 2 - 20, W / 2 - 70, H / 2 + 20, W / 2, H / 2 + 70);
      ctx.bezierCurveTo(W / 2 + 70, H / 2 + 20, W / 2 + 30, H / 2 - 20, W / 2, H / 2 + 10);
      ctx.fill();
    }

    function drawBandage(progress) {
      ctx.save();
      ctx.translate(W / 2, H / 2 + 30);
      ctx.rotate(-0.4 + progress * 0.4);
      ctx.fillStyle = "white";
      ctx.globalAlpha = Math.min(progress, 1);
      ctx.fillRect(-100 * progress, -12, 200 * progress, 24);

      // bandage lines
      ctx.strokeStyle = "#ddd";
      for (let i = -80; i < 80; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i * progress, -12);
        ctx.lineTo(i * progress, 12);
        ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function drawText(progress) {
      ctx.globalAlpha = progress;
      ctx.fillStyle = "white";
      ctx.font = "48px serif";
      ctx.textAlign = "center";
      ctx.fillText("I love you", W / 2, H - 80);
      ctx.globalAlpha = 1;
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawBear();
      drawHeart();

      const bandageProgress = Math.min(t / 120, 1);
      drawBandage(bandageProgress);

      if (t > 120) {
        drawText(Math.min((t - 120) / 80, 1));
      }

      t++;
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div style={{ background: "#1e1e1e", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <canvas ref={canvasRef} width={600} height={700} />
    </div>
  );
}
