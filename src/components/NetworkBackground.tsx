import React, { useEffect, useRef } from "react";

interface NetworkBackgroundProps {
  isDarkMode: boolean;
}

export const NetworkBackground: React.FC<NetworkBackgroundProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particles setup
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
    }[] = [];

    const colorsDark = ["#38bdf8", "#818cf8", "#c084fc", "#34d399"];
    const colorsLight = ["#0284c7", "#4f46e5", "#9333ea", "#059669"];

    for (let i = 0; i < particleCount; i++) {
      const colors = isDarkMode ? colorsDark : colorsLight;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background radial gradient
      const bgGradient = ctx.createRadialGradient(
        width / 2,
        height / 3,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );

      if (isDarkMode) {
        bgGradient.addColorStop(0, "rgba(5, 6, 11, 0.4)");
        bgGradient.addColorStop(0.5, "rgba(5, 6, 11, 0.7)");
        bgGradient.addColorStop(1, "rgba(5, 6, 11, 0.95)");
      } else {
        bgGradient.addColorStop(0, "rgba(241, 245, 249, 0.85)");
        bgGradient.addColorStop(0.6, "rgba(226, 232, 240, 0.92)");
        bgGradient.addColorStop(1, "rgba(203, 213, 225, 0.98)");
      }

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        p1.pulse += 0.03;

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isDarkMode ? 0.25 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDarkMode
              ? `rgba(99, 102, 241, ${alpha})`
              : `rgba(79, 70, 229, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Mouse interaction line
        const mdx = p1.x - mouseX;
        const mdy = p1.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          const alpha = (1 - mdist / 180) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = isDarkMode
            ? `rgba(56, 189, 248, ${alpha})`
            : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Draw particle dot
        const currentRadius = p1.radius + Math.sin(p1.pulse) * 0.5;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = isDarkMode ? 8 : 4;
        ctx.shadowColor = p1.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-500"
    />
  );
};
