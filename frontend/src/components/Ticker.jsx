import React from "react";

const ITEMS = [
  "REINFORCEMENT LEARNING",
  "REAL-TIME RAYTRACING",
  "SPLINE PATHFINDING",
  "DOMAIN RANDOMIZATION",
  "SENSOR FUSION",
  "MOTION PLANNING",
  "POLICY GRADIENT",
  "PROXIMAL OPTIMIZATION",
  "PHOTOMETRIC PERCEPTION",
  "TRAJECTORY OPTIMIZATION",
];

export default function Ticker() {
  return (
    <div
      data-testid="ticker"
      className="relative overflow-hidden border-y border-white/10 bg-black/40 py-5"
    >
      <div className="flex w-max ticker-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="font-mono-ui text-[12px] tracking-[0.32em] uppercase text-[#A0AAB5] px-8 flex items-center gap-8"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
