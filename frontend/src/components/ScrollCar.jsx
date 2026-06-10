import React, { useEffect, useRef } from "react";
import { Car } from "lucide-react";

/**
 * Tiny neon car that travels along a curvy path on the right edge of the
 * viewport in response to scroll. Y is locked to scroll progress; X
 * oscillates as a sine wave so the car appears to weave; rotation follows
 * the tangent of the curve.
 *
 * Pure CSS transforms + a single requestAnimationFrame loop — no layout
 * thrash, no scroll-listener jank.
 */
export default function ScrollCar() {
  const wrapperRef = useRef(null);
  const targetY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip on coarse pointer / very small screens
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    if (!fine || !wide) return;

    const el = wrapperRef.current;
    if (!el) return;
    el.style.display = "block";

    let rafId = 0;

    const recompute = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docH > 0 ? Math.min(1, Math.max(0, scrollTop / docH)) : 0;
      // Target Y across viewport, leaving padding top/bottom
      const top = 80;
      const bottom = window.innerHeight - 80;
      targetY.current = top + progress * (bottom - top);
    };

    const onScroll = () => recompute();
    const onResize = () => recompute();

    const loop = () => {
      // Smooth follow
      currentY.current += (targetY.current - currentY.current) * 0.12;
      const y = currentY.current;

      // Sine wave on X based on Y — gives the "curve" path
      const amplitude = 38; // px
      const frequency = 0.012; // controls how wavy
      const x = Math.sin(y * frequency) * amplitude;

      // Tangent angle — derivative of sin gives cos, scale to a small tilt
      const slope = Math.cos(y * frequency) * amplitude * frequency;
      const angle = Math.atan2(1, 1 / slope) * (180 / Math.PI); // degrees
      // Clamp tilt
      const tilt = Math.max(-22, Math.min(22, slope * 18));

      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;

      rafId = requestAnimationFrame(loop);
    };

    recompute();
    currentY.current = targetY.current;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="scroll-car-track" aria-hidden>
      {/* Subtle curve guide (so the path reads as a "road") */}
      <svg
        className="scroll-car-path"
        viewBox="0 0 80 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M 40 0
             C 80 200, 0 350, 40 500
             C 80 650, 0 800, 40 1000"
          fill="none"
          stroke="rgba(0, 229, 255, 0.18)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
      </svg>

      <div
        ref={wrapperRef}
        className="scroll-car"
        data-testid="scroll-car"
        style={{ display: "none" }}
      >
        <span className="scroll-car-glow" />
        <Car className="scroll-car-icon" strokeWidth={2} />
      </div>
    </div>
  );
}
