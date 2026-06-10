import React from "react";
import { ArrowDown, Radio } from "lucide-react";

const IFRAME_URL =
  process.env.REACT_APP_IFRAME_URL ||
  "https://connector.eagle3dstreaming.com/v5/parasTheGreat/AutonomousCar/default";

export default function Hero() {
  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative pt-36 sm:pt-40 lg:pt-44 pb-20 overflow-hidden"
    >
      {/* Background grid floor */}
      <div className="absolute inset-0 grid-floor pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Tag line */}
        <div className="flex items-center gap-3 rise-in" style={{ animationDelay: "60ms" }}>
          <span className="inline-flex items-center gap-2 glass rounded-full pl-2 pr-4 py-1.5">
            <span className="relative grid w-5 h-5 place-items-center">
              <span className="absolute inset-0 rounded-full bg-[#00E5FF]/30 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
            </span>
            <span className="text-[11px] tracking-[0.28em] uppercase text-[#A0AAB5]">
              Live · Build v0.7.3
            </span>
          </span>
          <span className="hidden sm:inline text-[11px] tracking-[0.28em] uppercase text-[#6b7280] font-mono-ui">
            Project: 0xA1 · Paras Singh
          </span>
        </div>

        {/* Headline */}
        <h1
          data-testid="hero-headline"
          className="mt-7 font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] font-black tracking-tighter leading-[0.95] text-white max-w-5xl rise-in"
          style={{ animationDelay: "160ms" }}
        >
          Real-Time{" "}
          <span className="relative inline-block">
            <span className="neon-text">Autonomous</span>
          </span>{" "}
          <br className="hidden sm:block" />
          AI Simulation
        </h1>

        {/* Subhead */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start rise-in" style={{ animationDelay: "260ms" }}>
          <p className="lg:col-span-7 text-lg text-[#A0AAB5] leading-relaxed max-w-2xl">
            A continuously-running reinforcement learning agent piloting a
            virtual vehicle through procedurally-generated cityscapes. Streamed
            in real time from a GPU node — every frame is a decision, every
            decision is a gradient.
          </p>

          <div className="lg:col-span-5 lg:justify-self-end flex items-center gap-4 lg:gap-6 font-mono-ui">
            <div data-testid="stat-fps" className="text-right">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#6b7280]">
                Sim FPS
              </div>
              <div className="text-2xl text-white">60.0</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div data-testid="stat-timesteps" className="text-right">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#6b7280]">
                Timesteps
              </div>
              <div className="text-2xl text-white">
                4.21<span className="text-[#00E5FF]">M</span>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div data-testid="stat-reward" className="text-right">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#6b7280]">
                Avg Reward
              </div>
              <div className="text-2xl text-white">+1284</div>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-9 flex flex-wrap items-center gap-4 rise-in" style={{ animationDelay: "360ms" }}>
          <a
            href="#simulation"
            data-testid="hero-cta-launch"
            className="inline-flex items-center gap-2 bg-[#00E5FF] text-black font-semibold tracking-[0.14em] uppercase text-[12px] px-7 py-4 rounded-md hover:bg-white transition-colors shadow-[0_0_30px_rgba(0,229,255,0.35)]"
          >
            <Radio className="w-4 h-4" /> Launch Simulation
          </a>
          <a
            href="#archive"
            data-testid="hero-cta-archive"
            className="inline-flex items-center gap-2 bg-transparent border border-white/15 text-white tracking-[0.14em] uppercase text-[12px] px-7 py-4 rounded-md hover:border-white transition-colors"
          >
            View Training Archive <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Iframe wrapper */}
      <div
        id="simulation"
        className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mt-16 rise-in"
        style={{ animationDelay: "500ms" }}
      >
        <div className="flex items-center justify-between mb-3 font-mono-ui">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-[#6b7280]">
            <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
            Eagle3D · GPU Stream · WebRTC
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase text-[#6b7280]">
            <span>NODE-EU-04</span>
            <span className="text-[#00E5FF]">●</span>
            <span>online</span>
          </div>
        </div>

        <div
          data-testid="hero-iframe-wrapper"
          className="relative aspect-video w-full rounded-2xl overflow-hidden neon-border pulse-glow scanline"
        >
          {/* Decorative corner brackets */}
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          <iframe
            data-testid="hero-iframe"
            src={IFRAME_URL}
            title="Autonomous AI Simulation"
            className="w-full h-full block bg-black"
            allow="autoplay; fullscreen; gamepad; xr-spatial-tracking; microphone *; camera *; accelerometer; gyroscope"
            allowFullScreen
          />
        </div>

        <div className="mt-3 font-mono-ui text-[11px] tracking-[0.24em] uppercase text-[#6b7280]">
          // If the stream takes a moment to load, the GPU node is warming up. Reload to reconnect.
        </div>
      </div>
    </section>
  );
}

const Corner = ({ pos }) => {
  const map = {
    tl: "top-3 left-3 border-l border-t",
    tr: "top-3 right-3 border-r border-t",
    bl: "bottom-3 left-3 border-l border-b",
    br: "bottom-3 right-3 border-r border-b",
  };
  return (
    <span
      aria-hidden
      className={`absolute w-5 h-5 border-[#00E5FF] ${map[pos]} pointer-events-none`}
    />
  );
};
