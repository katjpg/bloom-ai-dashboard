"use client";

import { ReactNode } from "react";

interface StepCardProps {
  content: ReactNode;
}

export function StepCard({ content }: StepCardProps) {
  return (
    <div className="relative backdrop-blur-lg rounded-xl lg:rounded-2xl border border-neutral-700/50 bg-neutral-800/30 p-4 h-[380px]">
      <div className="flex items-center justify-center h-full">
        {content}
      </div>
    </div>
  );
}
