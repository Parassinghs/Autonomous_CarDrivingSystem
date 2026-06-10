import React, { useEffect, useRef, useState } from "react";

/**
 * Cinematic neon cursor:
 *   - Crisp center dot that tracks the mouse instantly.
 *   - Soft halo that lerps behind (spring-like follow).
 *   - On hover over interactive elements the halo expands + intensifies.
 *   - Ripple wave trail emitted on motion that fades out (the "wavy" pattern).
 *
 * Disabled automatically on touch / coarse pointer devices so mobile is unaffected.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const rippleLayerRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip on touch / coarse pointer screens
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const dot = dotRef.current;
    const halo = haloRef.current;
    const layer = rippleLayerRef.current;
    if (!dot || !halo || !layer) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let hx = mx;
    let hy = my;
    let lastRippleX = mx;
    let lastRippleY = my;
    let rafId = 0;
    let hovering = false;

    const HOVER_SELECTOR =
      'a, button, input, textarea, select, label, [role="button"], [data-cursor="hover"]';

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;

      // Emit a ripple every ~40px of movement
      const dx = mx - lastRippleX;
      const dy = my - lastRippleY;
      if (dx * dx + dy * dy > 1600) {
        spawnRipple(mx, my);
        lastRippleX = mx;
        lastRippleY = my;
      }

      // Hover state — detect element under cursor
      const el = document.elementFromPoint(mx, my);
      const isHover = !!(el && el.closest && el.closest(HOVER_SELECTOR));
      if (isHover !== hovering) {
        hovering = isHover;
        halo.classList.toggle("cursor-halo--hover", hovering);
        dot.classList.toggle("cursor-dot--hover", hovering);
      }
    };

    const onDown = () => {
      halo.classList.add("cursor-halo--down");
      spawnRipple(mx, my, true);
    };
    const onUp = () => halo.classList.remove("cursor-halo--down");
    const onLeave = () => {
      dot.style.opacity = "0";
      halo.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      halo.style.opacity = "1";
    };

    const spawnRipple = (x, y, big = false) => {
      const r = document.createElement("span");
      r.className = "cursor-ripple" + (big ? " cursor-ripple--big" : "");
      r.style.left = x + "px";
      r.style.top = y + "px";
      layer.appendChild(r);
      // Cleanup once animation ends
      r.addEventListener("animationend", () => r.remove(), { once: true });
    };

    const tick = () => {
      // Instant dot follow
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      // Soft halo follow (lerp)
      hx += (mx - hx) * 0.18;
      hy += (my - hy) * 0.18;
      halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add("cursor-active");
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={rippleLayerRef} className="cursor-ripple-layer" aria-hidden />
      <div ref={haloRef} className="cursor-halo" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
