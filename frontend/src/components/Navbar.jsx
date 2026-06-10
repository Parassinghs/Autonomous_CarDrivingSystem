import React from "react";
import { Linkedin, Mail, Cpu } from "lucide-react";

export default function Navbar() {
  const linkClass =
    "text-[13px] tracking-[0.18em] uppercase text-[#A0AAB5] hover:text-white transition-colors duration-200";

  return (
    <header
      data-testid="site-navbar"
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-5">
        <div className="glass-strong rounded-2xl px-5 sm:px-7 py-3.5 flex items-center justify-between">
          <a
            href="#hero"
            data-testid="brand-logo"
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-7 h-7 rounded-md grid place-items-center bg-[#00E5FF]/10 border border-[#00E5FF]/40">
              <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" strokeWidth={2.4} />
            </div>
            <span className="font-display text-sm tracking-[0.25em] text-white">
              AV<span className="text-[#00E5FF]">.</span>SIM
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#simulation" data-testid="nav-sim" className={linkClass}>
              Simulation
            </a>
            <a href="#tech" data-testid="nav-tech" className={linkClass}>
              Tech
            </a>
            <a href="#archive" data-testid="nav-archive" className={linkClass}>
              Archive
            </a>
            <a href="#contact" data-testid="nav-contact" className={linkClass}>
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/paras-singh-9b422129b/"
              target="_blank"
              rel="noreferrer"
              data-testid="nav-linkedin"
              className="hidden sm:grid w-9 h-9 place-items-center rounded-md border border-white/10 hover:border-[#00E5FF]/60 text-[#A0AAB5] hover:text-[#00E5FF] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:parassinghme@gmail.com"
              data-testid="nav-email"
              className="hidden sm:grid w-9 h-9 place-items-center rounded-md border border-white/10 hover:border-[#00E5FF]/60 text-[#A0AAB5] hover:text-[#00E5FF] transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              data-testid="nav-cta"
              className="bg-[#00E5FF] text-black font-semibold text-[12px] tracking-[0.18em] uppercase px-4 py-2.5 rounded-md hover:bg-white transition-colors duration-200"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
