import React, { useRef, useEffect, useState } from "react";
import gifshot from "gifshot";

export default function BearCanvas() {
  const canvasRef = useRef(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    let t = 0;
    let frames = [];
    let animationId;

    /* ================= DRAW FUNCTIONS ================= */

    function drawBrownBear(heartPulse, happy) {
      ctx.fillStyle = "#8b5a2b";

      ctx.beginPath();
      ctx.ellipse(W / 2 + 80, H / 2 + 70, 110, 140, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(W / 2 + 80, H / 2 - 90, 85, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(W / 2 + 25, H / 2 - 155, 28, 0, Math.PI * 2);
      ctx.arc(W / 2 + 135, H / 2 - 155, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(W / 2 + 55, H / 2 - 105, 6, 0, Math.PI * 2);
      ctx.arc(W / 2 + 105, H / 2 - 105, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (happy) ctx.arc(W / 2 + 80, H / 2 - 70, 25, 0, Math.PI);
      else ctx.arc(W / 2 + 80, H / 2 - 55, 25, Math.PI, 0);
      ctx.stroke();

      ctx.save();
      ctx.translate(W / 2 + 80, H / 2 + 30);
      ctx.scale(heartPulse, heartPulse);
      ctx.fillStyle = "#b22222";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-30, -20, -60, 20, 0, 60);
      ctx.bezierCurveTo(60, 20, 30, -20, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function drawWhiteBear(x, reach) {
      ctx.fillStyle = "#f5f5f5";

      ctx.beginPath();
      ctx.ellipse(x, H / 2 + 80, 95, 120, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, H / 2 - 70, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x - 45, H / 2 - 125, 22, 0, Math.PI * 2);
      ctx.arc(x + 45, H / 2 - 125, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(x - 18, H / 2 - 85, 5, 0, Math.PI * 2);
      ctx.arc(x + 18, H / 2 - 85, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, H / 2 - 55, 20, 0, Math.PI);
      ctx.stroke();

      ctx.strokeStyle = "#eee";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(x + 60, H / 2 + 40);
      ctx.lineTo(x + 60 + reach * 80, H / 2 + 20);
      ctx.stroke();
    }

    function drawBandage(progress) {
      ctx.save();
      ctx.translate(W / 2 + 80, H / 2 + 45);
      ctx.rotate(-0.35);
      ctx.fillStyle = "white";
      ctx.fillRect(-90 * progress, -10, 180 * progress, 20);
      ctx.restore();
    }

    function drawText(alpha) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "white";
      ctx.font = "48px serif";
      ctx.textAlign = "center";
      ctx.fillText("I love you", W / 2, H - 60);
      ctx.globalAlpha = 1;
    }

    /* ================= ANIMATION LOOP ================= */

    function animate() {
      ctx.clearRect(0, 0, W, H);

      const walk = Math.min(t / 120, 1);
      const x = -120 + walk * (W / 2 - 40);
      const reach = Math.max(0, Math.min((t - 120) / 60, 1));
      const heartbeat = t < 160 ? 1 + Math.sin(t * 0.3) * 0.08 : 1;
      const happy = t > 180;

      drawBrownBear(heartbeat, happy);
      drawWhiteBear(x, reach);

      if (t > 140) drawBandage(Math.min((t - 140) / 80, 1));
      if (t > 220) drawText(Math.min((t - 220) / 80, 1));

      // 🎥 RECORD FRAMES
      if (recording && t <= 300) {
        frames.push(canvas.toDataURL("image/png"));
      }

      // 🎁 EXPORT GIF
      if (recording && t === 300) {
       gifshot.createGIF(
  {
    images: frames,
    gifWidth: W,
    gifHeight: H,
    frameDuration: 6,
  },
  (res) => {
    if (!res.error) {
      // Convert base64 → Blob
      const byteString = atob(res.image.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: "image/gif" });
      const url = URL.createObjectURL(blob);

      // Force download
      const a = document.createElement("a");
      a.href = url;
      a.download = "bear_love.gif";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
);

        setRecording(false);
      }

      t += 1;
      animationId = requestAnimationFrame(animate);
    }

    // 🔁 RESET WHEN RECORDING STARTS
    t = 0;
    frames = [];

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [recording]);

  return (
    <div
      style={{
        background: "#1e1e1e",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas ref={canvasRef} width={760} height={720} />
   
    </div>
  );
}


