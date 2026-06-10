import React from "react";
import { Brain, Zap, Route } from "lucide-react";

const SPECS = [
  {
    icon: Brain,
    label: "01 / Decision",
    title: "Reinforcement Learning",
    body:
      "A proximal-policy agent learns end-to-end from raw perception, optimizing a shaped reward that balances safety, comfort, and progress. Trained across 1.2M+ timesteps in domain-randomized cityscapes.",
    metric: "PPO · γ=0.99 · λ=0.95",
  },
  {
    icon: Zap,
    label: "02 / Perception",
    title: "Real-Time Raytracing",
    body:
      "DXR-accelerated ray tracing renders photometric reflections, wet asphalt caustics, and night-time glare. The perception stack ingests rendered frames at 60 Hz with sub-16ms latency.",
    metric: "60 FPS · RT cores",
  },
  {
    icon: Route,
    label: "03 / Planning",
    title: "Spline Pathfinding",
    body:
      "A Catmull-Rom spline planner stitches local waypoints into continuously differentiable trajectories. Lateral control uses Stanley + adaptive look-ahead with <0.12m RMS lateral error.",
    metric: "RMSE 0.118m",
  },
];

export default function TechSpecs() {
  return (
    <section id="tech" data-testid="tech-section" className="relative py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7">
            <div className="text-[11px] font-mono-ui tracking-[0.32em] uppercase text-[#00E5FF] mb-4">
              // System Architecture
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
              Three pillars of <span className="neon-text">autonomy</span>.
            </h2>
          </div>
          <p className="lg:col-span-5 text-[#A0AAB5] leading-relaxed">
            The stack is intentionally minimal — every component is justified
            by an ablation. Below: the three subsystems that turn pixels into
            steering commands.
          </p>
        </div>

        <div data-testid="tech-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SPECS.map((s, idx) => (
            <SpecCard key={s.title} idx={idx} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

const SpecCard = ({ icon: Icon, label, title, body, metric, idx }) => (
  <article
    data-testid={`tech-spec-card-${idx}`}
    className="group relative overflow-hidden rounded-2xl glass p-7 sm:p-8 hover:border-[#00E5FF]/40 transition-all duration-500 hover:-translate-y-1"
    style={{ minHeight: 360 }}
  >
    {/* Hover glow gradient */}
    <div
      aria-hidden
      className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#00E5FF]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
    />
    {/* Top row: icon + label */}
    <div className="flex items-center justify-between relative z-10">
      <div className="w-12 h-12 grid place-items-center rounded-lg bg-[#00E5FF]/8 border border-[#00E5FF]/30 text-[#00E5FF] group-hover:bg-[#00E5FF]/15 transition-colors">
        <Icon className="w-5 h-5" strokeWidth={2.2} />
      </div>
      <span className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[#6b7280]">
        {label}
      </span>
    </div>

    <h3 className="mt-6 font-display text-2xl sm:text-[26px] tracking-tight text-white relative z-10">
      {title}
    </h3>
    <p className="mt-3.5 text-[15px] leading-relaxed text-[#A0AAB5] relative z-10">
      {body}
    </p>

    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between relative z-10">
      <span className="font-mono-ui text-[11px] tracking-[0.22em] uppercase text-[#A0AAB5]">
        {metric}
      </span>
      <span className="font-mono-ui text-[11px] tracking-[0.22em] uppercase text-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity">
        → online
      </span>
    </div>
  </article>
);
