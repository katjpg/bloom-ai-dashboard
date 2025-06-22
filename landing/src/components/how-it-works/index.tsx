"use client";

import Container from "@/components/layout/container";
import { StepCard } from "./step-card";
import TerminalDemo from "./terminal-demo";
import { AnalyzeCard } from "./analyze-card";
import { ProtectCard } from "./protect-card";

export function HowItWorksSection() {
  const steps = [
    <TerminalDemo />,
    <AnalyzeCard />,
    <ProtectCard />
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
      {/* Section Title */}
      <Container>
        <h2 
          className="text-center uppercase font-semibold text-balance text-3xl md:text-5xl mb-4"
          style={{ 
            fontFamily: 'var(--font-clash-grotesk)',
            background: 'linear-gradient(to right bottom, rgb(255, 255, 255) 30%, rgba(255, 255, 255, 0.55))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          How It Works
        </h2>
        <p 
          className="text-center text-gray-400 text-lg md:text-xl mb-16 md:mb-20 max-w-3xl mx-auto"
          style={{ fontFamily: 'var(--font-uncut-sans)' }}
        >
          Seamless setup, instant community protection.
          <br />
          Simple integration in three easy steps.
        </p>
      </Container>

      {/* Steps */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <StepCard key={index} content={step} />
          ))}
        </div>
      </Container>
    </section>
  );
}