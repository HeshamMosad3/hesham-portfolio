"use client";

import { useEffect, useRef } from "react";
import { mountCanvas } from "@/lib/canvas";

/**
 * A field of dots arranged along drifting sine waves. Dots near the pointer
 * grow and light up; the whole field breathes slowly on its own.
 */
export default function DotWave() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    return mountCanvas(host, (s, t) => {
      const { ctx, w, h, pointer } = s;
      ctx.clearRect(0, 0, w, h);
      const rows = 6;
      const gap = Math.max(11, w / 40);
      for (let r = 0; r < rows; r++) {
        const baseY = h * 0.1 + r * gap * 1.9;
        const amp = h * (0.07 + r * 0.01);
        const phase = t * 0.5 + r * 0.45;
        for (let x = -gap; x < w + gap; x += gap) {
          const y = baseY + Math.sin(x / (w * 0.22) + phase) * amp + Math.cos(x / (w * 0.5) - t * 0.3) * amp * 0.4;
          // fade out towards the bottom-right so the wave frames the portrait
          const fade = Math.max(0, 1 - (x / w) * 0.85) * Math.max(0, 1 - r / rows);
          let size = 1.3 + fade * 1.2;
          let a = 0.12 + fade * 0.55;
          if (pointer) {
            const d = Math.hypot(pointer.x - x, pointer.y - y);
            const k = Math.max(0, 1 - d / (w * 0.22));
            size += k * 2.4;
            a = Math.min(1, a + k * 0.7);
          }
          ctx.fillStyle = `rgba(255,181,71,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }, []);

  return <div ref={ref} className="ps-dots" aria-hidden="true" />;
}
