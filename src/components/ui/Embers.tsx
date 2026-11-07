"use client";

import { useEffect, useRef } from "react";

type Ember = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
  life: number;
  lifeSpeed: number;
};

/** Brasas que suben flotando (canvas). Se pausa fuera de pantalla. */
export default function Embers({
  className = "",
  count = 80,
}: {
  className?: string;
  count?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let embers: Ember[] = [];

    const create = (anywhere: boolean): Ember => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + Math.random() * 60,
      radius: 0.6 + Math.random() * 2.2,
      speed: 0.25 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.35,
      phase: Math.random() * Math.PI * 2,
      life: anywhere ? Math.random() : 0,
      lifeSpeed: 0.0015 + Math.random() * 0.004,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const total = Math.max(20, Math.round(count * Math.min(1, width / 1200)));
      embers = Array.from({ length: total }, () => create(true));
    };

    const draw = (time: number) => {
      frame = window.requestAnimationFrame(draw);
      if (!visible) return;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < embers.length; i += 1) {
        const ember = embers[i];
        ember.y -= ember.speed;
        ember.x += ember.drift + Math.sin(time / 700 + ember.phase) * 0.28;
        ember.life += ember.lifeSpeed;

        if (ember.life >= 1 || ember.y < -20) {
          embers[i] = create(false);
          continue;
        }

        const flicker = 0.7 + Math.sin(time / 90 + ember.phase) * 0.3;
        const alpha = Math.sin(Math.PI * ember.life) * flicker;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, ${120 + Math.round(ember.life * 70)}, 50, ${alpha * 0.14})`;
        ctx.arc(ember.x, ember.y, ember.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, ${170 + Math.round(ember.life * 60)}, 90, ${alpha})`;
        ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(canvas);

    resize();
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [count]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}