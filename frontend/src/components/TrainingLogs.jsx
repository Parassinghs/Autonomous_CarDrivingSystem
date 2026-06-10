import React, { useEffect, useState } from "react";
import { fetchTrainingLogs } from "../lib/api";
import { Play, Clock, Activity, AlertCircle } from "lucide-react";

export default function TrainingLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchTrainingLogs()
      .then((data) => {
        if (mounted) setLogs(data || []);
      })
      .catch((e) => {
        if (mounted) setError(e?.message || "Failed to load logs");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="archive"
      data-testid="archive-section"
      className="relative py-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-[11px] font-mono-ui tracking-[0.32em] uppercase text-[#00E5FF] mb-4">
              // CMS · {logs.length} episodes archived
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
              Training Logs &amp; <span className="neon-text">Results</span>
            </h2>
          </div>
          <a
            href="/admin"
            data-testid="archive-admin-link"
            className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-[0.22em] uppercase text-[#A0AAB5] hover:text-[#00E5FF] transition-colors"
          >
            <Activity className="w-3.5 h-3.5" /> Open CMS
          </a>
        </div>

        {loading && <SkeletonGrid />}
        {error && (
          <div
            data-testid="archive-error"
            className="glass rounded-xl p-6 flex items-center gap-3 text-[#A0AAB5]"
          >
            <AlertCircle className="w-5 h-5 text-[#00E5FF]" />
            Unable to load archive: {error}
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div
            data-testid="archive-empty"
            className="glass rounded-2xl p-10 text-center text-[#A0AAB5]"
          >
            No training episodes yet. Open the CMS to add the first one.
          </div>
        )}

        {!loading && !error && logs.length > 0 && (
          <div
            data-testid="archive-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {logs.map((log, i) => (
              <VideoCard key={log.id} log={log} idx={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const VideoCard = ({ log, idx }) => {
  const open = () => {
    if (log.video_url) window.open(log.video_url, "_blank", "noreferrer");
  };
  return (
    <article
      data-testid={`video-card-${idx}`}
      onClick={open}
      className="group bg-[#0a0b10] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#00E5FF]/40 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,229,255,0.12)] hover:-translate-y-0.5"
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        <img
          src={log.thumbnail_url}
          alt={log.title}
          className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          loading="lazy"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        {/* play */}
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm bg-black/30">
          <div className="w-14 h-14 rounded-full bg-[#00E5FF] grid place-items-center text-black shadow-[0_0_30px_rgba(0,229,255,0.55)]">
            <Play className="w-5 h-5 ml-0.5" fill="black" />
          </div>
        </div>
        {/* badges */}
        {log.episode && (
          <span className="absolute top-3 left-3 font-mono-ui text-[10px] tracking-[0.24em] uppercase bg-black/60 backdrop-blur px-2.5 py-1 rounded text-[#00E5FF] border border-[#00E5FF]/30">
            {log.episode}
          </span>
        )}
        {log.duration && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 font-mono-ui text-[10px] tracking-[0.2em] uppercase bg-black/70 px-2 py-1 rounded text-white border border-white/15">
            <Clock className="w-3 h-3" /> {log.duration}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg leading-snug text-white group-hover:text-[#00E5FF] transition-colors">
          {log.title}
        </h3>
        <p className="mt-2.5 text-sm text-[#A0AAB5] leading-relaxed line-clamp-3">
          {log.description}
        </p>
        {log.metric && (
          <div className="mt-4 pt-4 border-t border-white/8 font-mono-ui text-[11px] tracking-[0.22em] uppercase text-[#00E5FF]">
            {log.metric}
          </div>
        )}
      </div>
    </article>
  );
};

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="rounded-xl overflow-hidden glass animate-pulse"
        style={{ height: 360 }}
      >
        <div className="aspect-video bg-white/[0.03]" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-white/[0.05] rounded w-2/3" />
          <div className="h-3 bg-white/[0.04] rounded w-full" />
          <div className="h-3 bg-white/[0.04] rounded w-5/6" />
        </div>
      </div>
    ))}
  </div>
);
