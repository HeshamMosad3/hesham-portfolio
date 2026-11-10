/**
 * Shared 2D canvas lifecycle: DPR-aware sizing, pointer tracking in local
 * coordinates, pausing when off-screen, and reduced-motion handling.
 */
export type Ctx2D = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  /** Pointer in canvas CSS pixels, or null when outside. */
  pointer: { x: number; y: number } | null;
  reduced: boolean;
};

export function mountCanvas(
  host: HTMLElement,
  draw: (s: Ctx2D, t: number, dt: number) => void,
  opts: { onClick?: (s: Ctx2D, x: number, y: number) => void } = {},
): () => void {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => canvas.remove();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state: Ctx2D = { ctx, w: 0, h: 0, pointer: null, reduced };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.w = host.clientWidth;
    state.h = host.clientHeight;
    canvas.width = Math.max(1, Math.round(state.w * dpr));
    canvas.height = Math.max(1, Math.round(state.h * dpr));
    canvas.style.width = `${state.w}px`;
    canvas.style.height = `${state.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced) draw(state, performance.now() / 1000, 0);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom };
  };
  const onMove = (e: PointerEvent) => {
    const p = local(e);
    state.pointer = p.inside ? { x: p.x, y: p.y } : null;
  };
  const onLeave = () => (state.pointer = null);
  const onClick = (e: PointerEvent) => {
    const p = local(e);
    if (p.inside && opts.onClick) opts.onClick(state, p.x, p.y);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("pointerdown", onClick);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(host);

  let raf = 0;
  let last = performance.now();
  // 30 fps on phones / touch devices: these drawings are ambient, not interactive there.
  const minGap = !window.matchMedia("(pointer: fine)").matches || (navigator.hardwareConcurrency || 8) <= 4 ? 1000 / 30 : 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden || reduced) { last = now; return; }
    if (now - last < minGap) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    draw(state, now / 1000, dt);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    host.removeEventListener("pointerdown", onClick);
    canvas.remove();
  };
}
