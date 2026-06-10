import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TechSpecs from "../components/TechSpecs";
import Ticker from "../components/Ticker";
import TrainingLogs from "../components/TrainingLogs";
import ContactFooter from "../components/ContactFooter";

export default function Landing() {
  return (
    <div data-testid="landing-root" className="relative">
      <Navbar />
      <Hero />
      <Ticker />
      <TechSpecs />
      <TrainingLogs />
      <ContactFooter />
    </div>
  );
}
