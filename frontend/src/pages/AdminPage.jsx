import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTrainingLogs,
  createTrainingLog,
  deleteTrainingLog,
  verifyAdmin,
} from "../lib/api";
import {
  ArrowLeft,
  Trash2,
  Plus,
  KeyRound,
  LogIn,
  ExternalLink,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialForm = { title: "", description: "", video_url: "" };

export default function AdminPage() {
  const nav = useNavigate();
  const [passcode, setPasscode] = useState(localStorage.getItem("av_passcode") || "");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (passcode) tryLogin(passcode, true);
    else setChecking(false);
    // eslint-disable-next-line
  }, []);

  const tryLogin = async (p, silent = false) => {
    try {
      await verifyAdmin(p);
      setAuthed(true);
      localStorage.setItem("av_passcode", p);
      await loadLogs();
    } catch {
      setAuthed(false);
      if (!silent && p !== "") toast.error("Invalid passcode");
    } finally {
      setChecking(false);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await fetchTrainingLogs();
      setLogs(data || []);
    } catch {
      toast.error("Failed to load records");
    }
  };

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    setSaving(true);
    try {
      // Backend requires thumbnail_url; auto-derive a sensible default if missing.
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        video_url: form.video_url.trim() || null,
        thumbnail_url: deriveThumbnail(form.video_url) ||
          "https://images.pexels.com/photos/3052727/pexels-photo-3052727.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      };
      await createTrainingLog(payload, passcode);
      toast.success("Record submitted.");
      setForm(initialForm);
      loadLogs();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await deleteTrainingLog(id, passcode);
      toast.success("Deleted.");
      setLogs((l) => l.filter((x) => x.id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to delete");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.description || "").toLowerCase().includes(q) ||
        (l.episode || "").toLowerCase().includes(q)
    );
  }, [logs, query]);

  const inputCls =
    "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all";

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="font-mono-ui text-[11px] tracking-[0.32em] uppercase text-[#6b7280]">
          // verifying session...
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center px-6 relative">
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
            Admin · Authentication
          </h1>
          <p className="text-[#A0AAB5] text-sm mt-2 leading-relaxed">
            Enter the admin passcode to manage simulation records.
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
              <LogIn className="w-4 h-4" /> Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-24 relative">
      <div className="absolute inset-0 grid-floor pointer-events-none opacity-60" />

      <div className="relative mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <button
              onClick={() => nav("/")}
              data-testid="admin-back-home"
              className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280] hover:text-white inline-flex items-center gap-2 mb-3"
            >
              <ArrowLeft className="w-3 h-3" /> Back to site
            </button>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tighter text-white">
                Admin <span className="neon-text">Dashboard</span>
              </h1>
              <span
                data-testid="admin-secure-badge"
                className="inline-flex items-center gap-1.5 font-mono-ui text-[10px] tracking-[0.24em] uppercase text-[#00E5FF] border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2.5 py-1 rounded"
              >
                <ShieldCheck className="w-3 h-3" /> Secure
              </span>
            </div>
            <p className="mt-3 text-[#A0AAB5] text-sm max-w-xl">
              Submit new simulation records and manage previously uploaded
              entries. All writes are authenticated server-side.
            </p>
          </div>
          <button
            data-testid="admin-logout"
            onClick={() => {
              localStorage.removeItem("av_passcode");
              setPasscode("");
              setAuthed(false);
            }}
            className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#A0AAB5] hover:text-[#00E5FF] transition-colors flex-shrink-0 mt-2"
          >
            Sign out
          </button>
        </div>

        {/* Submission form */}
        <form
          data-testid="admin-create-form"
          onSubmit={submit}
          className="glass-strong rounded-2xl p-6 sm:p-8 mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#00E5FF]" /> New record
            </h2>
            <span className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280]">
              // 3 fields · all required except video
            </span>
          </div>

          <div className="space-y-5">
            <Field label="Simulation Title">
              <input
                data-testid="admin-input-title"
                className={inputCls}
                value={form.title}
                onChange={onChange("title")}
                placeholder="Episode 043 — Rainy Intersection"
                required
              />
            </Field>

            <Field label="Short Description">
              <textarea
                data-testid="admin-input-description"
                rows={3}
                className={`${inputCls} resize-none`}
                value={form.description}
                onChange={onChange("description")}
                placeholder="Brief summary of the training run, environment, and key result."
                required
              />
            </Field>

            <Field label="Video Link">
              <input
                data-testid="admin-input-video"
                type="url"
                className={inputCls}
                value={form.video_url}
                onChange={onChange("video_url")}
                placeholder="https://youtu.be/... or https://example.com/clip.mp4"
              />
            </Field>
          </div>

          <div className="mt-7 flex items-center justify-end gap-3">
            <button
              type="button"
              data-testid="admin-reset-button"
              onClick={() => setForm(initialForm)}
              className="font-mono-ui text-[11px] tracking-[0.2em] uppercase text-[#A0AAB5] hover:text-white px-4 py-3 transition-colors"
            >
              Clear
            </button>
            <button
              data-testid="admin-submit-button"
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#00E5FF] text-black font-semibold tracking-[0.14em] uppercase text-[12px] px-6 py-3 rounded-md hover:bg-white transition-colors disabled:opacity-50 shadow-[0_0_24px_rgba(0,229,255,0.25)]"
            >
              <Plus className="w-4 h-4" /> {saving ? "Submitting..." : "Submit Record"}
            </button>
          </div>
        </form>

        {/* Records table */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-white/10">
            <div>
              <h2 className="font-display text-lg text-white">
                Uploaded records
              </h2>
              <p className="font-mono-ui text-[10px] tracking-[0.24em] uppercase text-[#6b7280] mt-1">
                {logs.length} total · {filtered.length} shown
              </p>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280]" />
              <input
                data-testid="admin-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title or description"
                className="w-full bg-black/40 border border-white/10 rounded-md pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#00E5FF]/60 transition-colors"
              />
            </div>
          </div>

          <div data-testid="admin-table-wrapper" className="overflow-x-auto">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-12 font-mono-ui text-[10px] tracking-[0.24em] uppercase text-[#6b7280] py-4">
                    #
                  </TableHead>
                  <TableHead className="font-mono-ui text-[10px] tracking-[0.24em] uppercase text-[#6b7280]">
                    Title
                  </TableHead>
                  <TableHead className="font-mono-ui text-[10px] tracking-[0.24em] uppercase text-[#6b7280] hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="font-mono-ui text-[10px] tracking-[0.24em] uppercase text-[#6b7280] w-24">
                    Video
                  </TableHead>
                  <TableHead className="font-mono-ui text-[10px] tracking-[0.24em] uppercase text-[#6b7280] w-20 text-right pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-testid="admin-table-body">
                {filtered.length === 0 && (
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableCell
                      colSpan={5}
                      className="text-center text-[#6b7280] py-14 font-mono-ui text-xs tracking-[0.2em] uppercase"
                    >
                      No records match.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((l, i) => (
                  <TableRow
                    key={l.id}
                    data-testid={`admin-row-${l.id}`}
                    className="border-white/10 hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell className="font-mono-ui text-[11px] text-[#6b7280] py-4">
                      {String(i + 1).padStart(2, "0")}
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <div className="text-white font-medium truncate">
                        {l.title}
                      </div>
                      {l.episode && (
                        <div className="font-mono-ui text-[10px] tracking-[0.22em] uppercase text-[#00E5FF]/80 mt-1">
                          {l.episode}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-[#A0AAB5] max-w-md">
                      <p className="line-clamp-2">{l.description}</p>
                    </TableCell>
                    <TableCell>
                      {l.video_url ? (
                        <a
                          href={l.video_url}
                          target="_blank"
                          rel="noreferrer"
                          data-testid={`admin-row-video-${l.id}`}
                          className="inline-flex items-center gap-1.5 font-mono-ui text-[11px] tracking-[0.2em] uppercase text-[#00E5FF] hover:text-white transition-colors"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="font-mono-ui text-[11px] text-[#6b7280]">
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <button
                        data-testid={`admin-delete-${l.id}`}
                        onClick={() => remove(l.id)}
                        className="inline-grid w-9 h-9 place-items-center rounded-md border border-white/10 text-[#A0AAB5] hover:text-red-400 hover:border-red-400/40 transition-colors"
                        aria-label="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

// Best-effort YouTube thumbnail from a video URL (used only as a fallback so
// the public archive cards still have an image when admin doesn't supply one).
function deriveThumbnail(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
  } catch {
    return null;
  }
  return null;
}
