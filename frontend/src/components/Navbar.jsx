import React, { useState, useEffect } from "react";
import { Linkedin, Mail, Cpu, Shield, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#simulation", label: "Simulation", testid: "nav-sim" },
  { href: "#tech", label: "Tech", testid: "nav-tech" },
  { href: "#archive", label: "Archive", testid: "nav-archive" },
  { href: "#contact", label: "Contact", testid: "nav-contact" },
  { href: "/admin", label: "Admin", testid: "nav-admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass =
    "text-[13px] tracking-[0.18em] uppercase text-[#A0AAB5] hover:text-white transition-colors duration-200";

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-testid="site-navbar"
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pt-3 sm:pt-5">
        <div className="glass-strong rounded-2xl px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3">
          <a
            href="#hero"
            data-testid="brand-logo"
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="relative w-7 h-7 rounded-md grid place-items-center bg-[#00E5FF]/10 border border-[#00E5FF]/40">
              <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" strokeWidth={2.4} />
            </div>
            <span className="font-display text-sm tracking-[0.25em] text-white">
              AV<span className="text-[#00E5FF]">.</span>SIM
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} data-testid={l.testid} className={linkClass}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop right cluster */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="https://www.linkedin.com/in/paras-singh-9b422129b/"
              target="_blank"
              rel="noreferrer"
              data-testid="nav-linkedin"
              className="grid w-9 h-9 place-items-center rounded-md border border-white/10 hover:border-[#00E5FF]/60 text-[#A0AAB5] hover:text-[#00E5FF] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:parassinghme@gmail.com"
              data-testid="nav-email"
              className="grid w-9 h-9 place-items-center rounded-md border border-white/10 hover:border-[#00E5FF]/60 text-[#A0AAB5] hover:text-[#00E5FF] transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="/admin"
              data-testid="nav-admin-icon"
              className="grid w-9 h-9 place-items-center rounded-md border border-white/10 hover:border-[#00E5FF]/60 text-[#A0AAB5] hover:text-[#00E5FF] transition-colors"
              aria-label="Admin dashboard"
            >
              <Shield className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              data-testid="nav-cta"
              className="bg-[#00E5FF] text-black font-semibold text-[12px] tracking-[0.18em] uppercase px-4 py-2.5 rounded-md hover:bg-white transition-colors duration-200"
            >
              Get in touch
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            data-testid="nav-mobile-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden grid w-10 h-10 place-items-center rounded-md border border-white/15 text-white active:bg-white/5 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        data-testid="nav-mobile-drawer"
        className={`md:hidden fixed inset-x-0 top-[68px] z-40 transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="mx-4 glass-strong rounded-2xl p-5 border border-white/10">
          <nav className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`m-${l.testid}`}
                onClick={() => setOpen(false)}
                className="py-3.5 border-b border-white/5 last:border-0 text-white font-display text-base tracking-tight flex items-center justify-between active:text-[#00E5FF] transition-colors"
              >
                <span>{l.label}</span>
                <span className="font-mono-ui text-[10px] tracking-[0.24em] uppercase text-[#6b7280]">→</span>
              </a>
            ))}
          </nav>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <a
              href="https://www.linkedin.com/in/paras-singh-9b422129b/"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              data-testid="m-nav-linkedin"
              className="grid place-items-center py-3 rounded-md border border-white/10 text-[#A0AAB5] active:text-[#00E5FF]"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:parassinghme@gmail.com"
              onClick={() => setOpen(false)}
              data-testid="m-nav-email"
              className="grid place-items-center py-3 rounded-md border border-white/10 text-[#A0AAB5] active:text-[#00E5FF]"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              data-testid="m-nav-admin-icon"
              className="grid place-items-center py-3 rounded-md border border-white/10 text-[#A0AAB5] active:text-[#00E5FF]"
              aria-label="Admin"
            >
              <Shield className="w-4 h-4" />
            </a>
          </div>

          <a
            href="#contact"
            onClick={() => setOpen(false)}
            data-testid="m-nav-cta"
            className="mt-3 flex items-center justify-center bg-[#00E5FF] text-black font-semibold text-[12px] tracking-[0.18em] uppercase py-3.5 rounded-md active:bg-white transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  );
}
