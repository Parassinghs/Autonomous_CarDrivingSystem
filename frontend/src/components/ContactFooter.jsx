import React, { useState } from "react";
import { submitContact } from "../lib/api";
import { Linkedin, Mail, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactFooter() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please complete the required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await submitContact(form);
      setDone(true);
      toast.success("Transmission received. I'll be in touch.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to send. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all";

  return (
    <footer id="contact" data-testid="contact-section" className="relative pt-20 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: title + identity */}
          <div className="lg:col-span-5">
            <div className="text-[11px] font-mono-ui tracking-[0.32em] uppercase text-[#00E5FF] mb-4">
              // Establish handshake
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
              Let's build the <span className="neon-text">next</span> mile.
            </h2>
            <p className="mt-6 text-[#A0AAB5] leading-relaxed max-w-md">
              Open to research collaborations, robotics roles, and conversations
              about reinforcement learning, perception, and motion planning.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href="mailto:parassinghme@gmail.com"
                data-testid="contact-link-email"
                className="group flex items-center gap-4 glass rounded-xl p-4 hover:border-[#00E5FF]/40 transition-colors"
              >
                <div className="w-11 h-11 grid place-items-center rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280]">
                    Email
                  </div>
                  <div className="text-white group-hover:text-[#00E5FF] transition-colors">
                    parassinghme@gmail.com
                  </div>
                </div>
              </a>
              <a
                href="https://www.linkedin.com/in/paras-singh-9b422129b/"
                target="_blank"
                rel="noreferrer"
                data-testid="contact-link-linkedin"
                className="group flex items-center gap-4 glass rounded-xl p-4 hover:border-[#00E5FF]/40 transition-colors"
              >
                <div className="w-11 h-11 grid place-items-center rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                  <Linkedin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280]">
                    LinkedIn
                  </div>
                  <div className="text-white group-hover:text-[#00E5FF] transition-colors">
                    paras-singh-9b422129b
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <form
              data-testid="contact-form"
              onSubmit={submit}
              className="glass-strong rounded-2xl p-6 sm:p-8 lg:p-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280] mb-2 block">
                    Name *
                  </label>
                  <input
                    data-testid="contact-input-name"
                    type="text"
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder="Ada Lovelace"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280] mb-2 block">
                    Email *
                  </label>
                  <input
                    data-testid="contact-input-email"
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="ada@analytical.engine"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280] mb-2 block">
                  Subject
                </label>
                <input
                  data-testid="contact-input-subject"
                  type="text"
                  value={form.subject}
                  onChange={onChange("subject")}
                  placeholder="Research collaboration"
                  className={inputCls}
                />
              </div>

              <div className="mt-5">
                <label className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280] mb-2 block">
                  Message *
                </label>
                <textarea
                  data-testid="contact-input-message"
                  rows={5}
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="Tell me about your simulation, your hardware, or your wildest idea..."
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              <div className="mt-7 flex items-center justify-between gap-4 flex-wrap">
                <div className="font-mono-ui text-[10px] tracking-[0.28em] uppercase text-[#6b7280]">
                  Encrypted · No tracking · 24h response
                </div>
                <button
                  data-testid="contact-submit-button"
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#00E5FF] text-black font-semibold tracking-[0.14em] uppercase text-[12px] px-7 py-3.5 rounded-md hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,229,255,0.25)]"
                >
                  {done ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Sent
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> {submitting ? "Sending..." : "Transmit"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-10">
          <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[#6b7280]">
            © 2026 · AV.SIM · Paras Singh · All transmissions logged
          </div>
          <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[#6b7280] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Reactor stable · 0xA1
          </div>
        </div>
      </div>
    </footer>
  );
}
