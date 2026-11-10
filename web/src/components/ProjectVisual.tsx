"use client";

import { useEffect, useRef } from "react";
import { mountCanvas, type Ctx2D } from "@/lib/canvas";

const INK = "#0a0a09";
const PAPER = "rgba(240,236,226,";
const PRIMARY = "255,181,71";
const SECONDARY = "60,224,192";

/* -------------------------------------------------------------------------- */
/* QR: a live module grid that renews every 30 seconds (like the real system) */
/* and can be renewed early by clicking. Modules near the cursor light up.    */
/* -------------------------------------------------------------------------- */
function qrScene(host: HTMLElement) {
  const N = 25;
  const CYCLE = 30;
  let grid: number[] = [];
  let flip: number[] = []; // per-module transition 0..1
  let born = performance.now() / 1000;
  let scan = 0;

  const isFinder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const lr = r < 7 ? r : r - (N - 7);
    const lc = c < 7 ? c : c - (N - 7);
    const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6;
    const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
    return edge || core ? 1 : 0;
  };
  const regen = () => {
    const next: number[] = [];
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        if (isFinder(r, c)) next.push(finderOn(r, c));
        else if ((r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8)) next.push(0);
        else next.push(Math.random() > 0.52 ? 1 : 0);
      }
    flip = next.map((v, i) => (grid.length && grid[i] !== v ? 0 : 1));
    grid = next;
    born = performance.now() / 1000;
    scan = 0;
  };
  regen();

  return mountCanvas(
    host,
    (s: Ctx2D, t: number, dt: number) => {
      const { ctx, w, h, pointer } = s;
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, w, h);

      // background dot grid
      ctx.fillStyle = `${PAPER}0.06)`;
      for (let y = 12; y < h; y += 22) for (let x = 12; x < w; x += 22) ctx.fillRect(x, y, 1.5, 1.5);

      const elapsed = t - born;
      if (!s.reduced && elapsed >= CYCLE) regen();

      const size = Math.min(w, h) * 0.66;
      const cell = size / N;
      const ox = (w - size) / 2;
      const oy = (h - size) / 2 + h * 0.02;

      // plate
      ctx.fillStyle = "rgba(240,236,226,0.03)";
      ctx.strokeStyle = "rgba(240,236,226,0.1)";
      ctx.lineWidth = 1;
      roundRect(ctx, ox - cell * 1.6, oy - cell * 1.6, size + cell * 3.2, size + cell * 3.2, 18);
      ctx.fill();
      ctx.stroke();

      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const i = r * N + c;
          if (flip[i] < 1) flip[i] = Math.min(1, flip[i] + dt * (2 + ((r + c) % 5) * 0.4));
          if (!grid[i]) continue;
          const cx = ox + c * cell + cell / 2;
          const cy = oy + r * cell + cell / 2;
          let near = 0;
          if (pointer) {
            const d = Math.hypot(pointer.x - cx, pointer.y - cy);
            near = Math.max(0, 1 - d / (size * 0.28));
          }
          const f = s.reduced ? 1 : easeOut(flip[i]);
          const sz = cell * (0.82 * f + near * 0.35);
          const finder = isFinder(r, c);
          ctx.fillStyle = finder ? `rgba(${PRIMARY},${0.9})` : near > 0.02 ? `rgba(${PRIMARY},${0.35 + near * 0.65})` : `${PAPER}${0.82})`;
          roundRect(ctx, cx - sz / 2, cy - sz / 2, sz, sz, Math.min(3, sz * 0.25));
          ctx.fill();
        }
      }

      // scan line
      scan = (scan + dt * 0.45) % 1;
      const sy = oy + scan * size;
      const g = ctx.createLinearGradient(0, sy - 30, 0, sy + 2);
      g.addColorStop(0, `rgba(${PRIMARY},0)`);
      g.addColorStop(1, `rgba(${PRIMARY},0.35)`);
      ctx.fillStyle = g;
      ctx.fillRect(ox - cell, sy - 30, size + cell * 2, 32);
      ctx.fillStyle = `rgba(${PRIMARY},0.9)`;
      ctx.fillRect(ox - cell, sy, size + cell * 2, 1.5);

      // countdown ring (real 30s cycle)
      const remain = Math.max(0, CYCLE - elapsed);
      const R = Math.max(18, Math.min(w, h) * 0.06);
      const rx = w - R - 22;
      const ry = R + 22;
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(240,236,226,0.12)";
      ctx.beginPath();
      ctx.arc(rx, ry, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${PRIMARY},1)`;
      ctx.beginPath();
      ctx.arc(rx, ry, R, -Math.PI / 2, -Math.PI / 2 + (remain / CYCLE) * Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#f0ece2";
      ctx.font = `600 ${Math.round(R * 0.62)}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(Math.ceil(remain)).padStart(2, "0"), rx, ry + 1);
    },
    { onClick: () => regen() },
  );
}

/* -------------------------------------------------------------------------- */
/* Graph: seekers ↔ AI hub ↔ companies. Nodes dodge the cursor and spring back;
/* data packets travel along the edges.                                       */
/* -------------------------------------------------------------------------- */
function graphScene(host: HTMLElement) {
  type Node = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; kind: 0 | 1 | 2 };
  let nodes: Node[] = [];
  let edges: [number, number][] = [];
  let packets: { e: number; p: number; v: number }[] = [];
  let built = { w: 0, h: 0 };

  const build = (w: number, h: number) => {
    nodes = [];
    edges = [];
    const rnd = mulberry(7);
    const hub = { hx: w / 2, hy: h / 2, x: w / 2, y: h / 2, vx: 0, vy: 0, r: Math.min(w, h) * 0.06, kind: 2 as const };
    nodes.push(hub);
    const side = (kind: 0 | 1, cx: number) => {
      const start = nodes.length;
      for (let i = 0; i < 9; i++) {
        const a = rnd() * Math.PI * 2;
        const d = Math.min(w, h) * (0.12 + rnd() * 0.2);
        const hx = cx + Math.cos(a) * d * 0.9;
        const hy = h / 2 + Math.sin(a) * d * 1.25;
        nodes.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, r: 3 + rnd() * 4, kind });
      }
      for (let i = start; i < nodes.length; i++) {
        if (rnd() > 0.35) edges.push([i, 0]);
        const j = start + Math.floor(rnd() * 9);
        if (j !== i) edges.push([i, j]);
      }
    };
    side(0, w * 0.2);
    side(1, w * 0.8);
    // a few direct matches
    for (let k = 0; k < 4; k++) edges.push([1 + Math.floor(rnd() * 9), 10 + Math.floor(rnd() * 9)]);
    packets = edges.map((_, i) => ({ e: i, p: rnd(), v: 0.15 + rnd() * 0.35 }));
    built = { w, h };
  };

  return mountCanvas(
    host,
    (s: Ctx2D, t: number, dt: number) => {
      const { ctx, w, h, pointer } = s;
      if (built.w !== w || built.h !== h) build(w, h);
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = `${PAPER}0.06)`;
      for (let y = 12; y < h; y += 22) for (let x = 12; x < w; x += 22) ctx.fillRect(x, y, 1.5, 1.5);

      // physics
      for (const n of nodes) {
        let fx = (n.hx - n.x) * 6;
        let fy = (n.hy - n.y) * 6;
        if (pointer) {
          const dx = n.x - pointer.x, dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          const R = Math.min(w, h) * 0.22;
          if (d < R) {
            const k = (1 - d / R) * 900 * (n.kind === 2 ? 0.25 : 1);
            fx += (dx / d) * k;
            fy += (dy / d) * k;
          }
        }
        if (!s.reduced) {
          n.vx = (n.vx + fx * dt) * 0.86;
          n.vy = (n.vy + fy * dt) * 0.86;
          n.x += n.vx * dt * 6;
          n.y += n.vy * dt * 6;
        }
        n.y += Math.sin(t * 1.2 + n.hx) * 0.08;
      }

      // nearest node to pointer
      let hot = -1;
      if (pointer) {
        let best = 40;
        nodes.forEach((n, i) => {
          const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (d < best) { best = d; hot = i; }
        });
      }

      // edges
      edges.forEach(([a, b]) => {
        const A = nodes[a], B = nodes[b];
        const lit = hot === a || hot === b;
        ctx.strokeStyle = lit ? `rgba(${PRIMARY},0.8)` : b === 0 || a === 0 ? `rgba(${SECONDARY},0.22)` : `${PAPER}0.12)`;
        ctx.lineWidth = lit ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      });

      // packets
      for (const p of packets) {
        p.p = (p.p + p.v * dt) % 1;
        const [a, b] = edges[p.e];
        const A = nodes[a], B = nodes[b];
        const x = A.x + (B.x - A.x) * p.p;
        const y = A.y + (B.y - A.y) * p.p;
        ctx.fillStyle = b === 0 || a === 0 ? `rgba(${SECONDARY},0.95)` : `rgba(${PRIMARY},0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes
      nodes.forEach((n, i) => {
        if (n.kind === 2) {
          const pr = n.r * (1 + Math.sin(t * 2) * 0.06);
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr * 3.2);
          g.addColorStop(0, `rgba(${SECONDARY},0.35)`);
          g.addColorStop(1, `rgba(${SECONDARY},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pr * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${SECONDARY},1)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(${SECONDARY},0.5)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pr * 1.6 + Math.sin(t * 2) * 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = INK;
          ctx.font = `700 ${Math.round(pr * 0.7)}px ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("AI", n.x, n.y + 1);
          return;
        }
        const isHot = i === hot;
        ctx.fillStyle = isHot ? `rgba(${PRIMARY},1)` : n.kind === 0 ? "#f0ece2" : "rgba(240,236,226,0.55)";
        ctx.beginPath();
        if (n.kind === 0) ctx.arc(n.x, n.y, n.r * (isHot ? 1.8 : 1), 0, Math.PI * 2);
        else {
          const q = n.r * (isHot ? 1.8 : 1.1);
          roundRect(ctx, n.x - q, n.y - q, q * 2, q * 2, 2);
        }
        ctx.fill();
      });
    },
    {
      onClick: (s, x, y) => {
        // click sends a burst of packets from the nearest node
        let best = -1, bd = Infinity;
        nodes.forEach((n, i) => {
          const d = Math.hypot(n.x - x, n.y - y);
          if (d < bd) { bd = d; best = i; }
        });
        edges.forEach(([a, b], i) => {
          if (a === best || b === best) packets.push({ e: i, p: 0, v: 0.6 + Math.random() * 0.4 });
        });
        if (packets.length > 160) packets.splice(0, packets.length - 160);
      },
    },
  );
}

export default function ProjectVisual({ kind }: { kind: "qr" | "graph" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    return kind === "qr" ? qrScene(host) : graphScene(host);
  }, [kind]);
  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
}

/* helpers */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
function mulberry(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
