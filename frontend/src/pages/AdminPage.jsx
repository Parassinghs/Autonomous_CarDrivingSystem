import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTrainingLogs,
  createTrainingLog,
  deleteTrainingLog,
  verifyAdmin,
} from "../lib/api";
import { ArrowLeft, Trash2, Plus, KeyRound, LogIn } from "lucide-react";
import { toast } from "sonner";

const initialForm = {
  title: "",
  description: "",
  thumbnail_url: "",
  video_url: "",
  episode: "",
  duration: "",
  metric: "",
};

export default function AdminPage() {
  const nav = useNavigate();
  const [passcode, setPasscode] = useState(localStorage.getItem("av_passcode") || "");
  const [authed, setAuthed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (passcode) tryLogin(passcode);
    // eslint-disable-next-line
  }, []);

  const tryLogin = async (p) => {
    try {
      await verifyAdmin(p);
      setAuthed(true);
      localStorage.setItem("av_passcode", p);
      loadLogs();
    } catch {
      setAuthed(false);
      if (p !== "") toast.error("Invalid passcode");
    }
  };

  const loadLogs = async () => {
    try {
      const data = await fetchTrainingLogs();
      setLogs(data || []);
    } catch (e) {
      toast.error("Failed to load logs");
    }
  };

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.thumbnail_url) {
      toast.error("Title, description and thumbnail URL are required.");
      return;
    }
    setSaving(true);
    try {
      await createTrainingLog(form, passcode);
      toast.success("Training log added.");
      setForm(initialForm);
      loadLogs();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this training log?")) return;
    try {
      await deleteTrainingLog(id, passcode);
      toast.success("Deleted.");
      setLogs((l) => l.filter((x) => x.id !== id));
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to delete");
    }
  };

  const inputCls =
    "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all";

  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="grid-floor absolute inset-0 pointer-events-none" />
        <div
          data-testid="admin-login-card"
          className="relative glass-strong rounded-2xl p-8 sm:p-10 w-full max-w-md"
        >
          <button
            onClick={() => nav("/")}
            data-testid="admin-back-home"
            className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280] hover:text-white mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to site
          </button>
          <div className="w-12 h-12 rounded-lg grid place-items-center bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] mb-5">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl text-white tracking-tight">
            CMS · Authentication
          </h1>
          <p className="text-[#A0AAB5] text-sm mt-2 leading-relaxed">
            Enter the admin passcode to manage training logs. Default for local
            development: <span className="font-mono-ui text-[#00E5FF]">paras-av-2026</span>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              tryLogin(passcode);
            }}
            className="mt-6 space-y-4"
          >
            <input
              data-testid="admin-passcode-input"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className={inputCls}
              autoFocus
            />
            <button
              data-testid="admin-login-button"
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#00E5FF] text-black font-semibold tracking-[0.14em] uppercase text-[12px] px-7 py-3.5 rounded-md hover:bg-white transition-colors"
            >
              <LogIn className="w-4 h-4" /> Enter CMS
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <button
              onClick={() => nav("/")}
              data-testid="admin-back-home"
              className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280] hover:text-white inline-flex items-center gap-2 mb-3"
            >
              <ArrowLeft className="w-3 h-3" /> Back to site
            </button>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tighter text-white">
              Training Logs <span className="neon-text">CMS</span>
            </h1>
          </div>
          <button
            data-testid="admin-logout"
            onClick={() => {
              localStorage.removeItem("av_passcode");
              setPasscode("");
              setAuthed(false);
            }}
            className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#A0AAB5] hover:text-[#00E5FF] transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Create form */}
        <form
          data-testid="admin-create-form"
          onSubmit={submit}
          className="glass-strong rounded-2xl p-6 sm:p-8 mb-10"
        >
          <h2 className="font-display text-xl text-white mb-5 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#00E5FF]" /> Add training episode
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title *">
              <input
                data-testid="admin-input-title"
                className={inputCls}
                value={form.title}
                onChange={onChange("title")}
                required
              />
            </Field>
            <Field label="Episode (e.g. EP-042)">
              <input
                data-testid="admin-input-episode"
                className={inputCls}
                value={form.episode}
                onChange={onChange("episode")}
              />
            </Field>
            <Field label="Thumbnail URL *">
              <input
                data-testid="admin-input-thumbnail"
                className={inputCls}
                value={form.thumbnail_url}
                onChange={onChange("thumbnail_url")}
                placeholder="https://..."
                required
              />
            </Field>
            <Field label="Video URL (YouTube / MP4)">
              <input
                data-testid="admin-input-video"
                className={inputCls}
                value={form.video_url}
                onChange={onChange("video_url")}
                placeholder="https://youtu.be/..."
              />
            </Field>
            <Field label="Duration (e.g. 06:21)">
              <input
                data-testid="admin-input-duration"
                className={inputCls}
                value={form.duration}
                onChange={onChange("duration")}
              />
            </Field>
            <Field label="Metric (e.g. Reward +1284)">
              <input
                data-testid="admin-input-metric"
                className={inputCls}
                value={form.metric}
                onChange={onChange("metric")}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description *">
                <textarea
                  data-testid="admin-input-description"
                  rows={3}
                  className={`${inputCls} resize-none`}
                  value={form.description}
                  onChange={onChange("description")}
                  required
                />
              </Field>
            </div>
          </div>
          <div className="mt-6">
            <button
              data-testid="admin-submit-button"
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#00E5FF] text-black font-semibold tracking-[0.14em] uppercase text-[12px] px-6 py-3 rounded-md hover:bg-white transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> {saving ? "Saving..." : "Add Episode"}
            </button>
          </div>
        </form>

        {/* List */}
        <h2 className="font-display text-xl text-white mb-5">
          {logs.length} episode{logs.length === 1 ? "" : "s"} in archive
        </h2>
        <div data-testid="admin-list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map((l) => (
            <div
              key={l.id}
              data-testid={`admin-row-${l.id}`}
              className="glass rounded-xl p-4 flex gap-4 items-start"
            >
              <img
                src={l.thumbnail_url}
                alt={l.title}
                className="w-28 h-20 object-cover rounded-md flex-shrink-0 border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 font-mono-ui text-[10px] tracking-[0.2em] uppercase text-[#6b7280]">
                  {l.episode || "EP-—"} · {l.duration || "—:—"}
                </div>
                <h3 className="text-white font-medium truncate">{l.title}</h3>
                <p className="text-sm text-[#A0AAB5] line-clamp-2 mt-1">
                  {l.description}
                </p>
              </div>
              <button
                data-testid={`admin-delete-${l.id}`}
                onClick={() => remove(l.id)}
                className="w-9 h-9 grid place-items-center rounded-md border border-white/10 text-[#A0AAB5] hover:text-red-400 hover:border-red-400/40 transition-colors flex-shrink-0"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label className="block">
    <span className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280] mb-2 block">
      {label}
    </span>
    {children}
  </label>
);
