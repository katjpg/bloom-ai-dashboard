export const Hero = () => (
  <main 
    className="relative flex flex-col items-center justify-center min-h-screen px-4 dark bg-background"
    style={{
      background: `radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                   var(--background)`
    }}
  >
    <div className="flex flex-col items-center gap-10 w-full max-w-7xl">
      <h1 className="text-center uppercase font-semibold text-balance">
        <span className="hero-text-blur-in inline-block motion-delay-500">
          KEEP YOUR GAMING
        </span>
        <br />
        <span className="hero-text-blur-in motion-delay-700 inline-block">
          COMMUNITY
        </span>
        <br />
        <span className="hero-text-blur-in motion-delay-[900ms] inline-block">
          SAFE & POSITIVE
        </span>
      </h1>
      <p className="text-center text-gray-400 font-normal text-balance md:text-xl max-w-3xl hero-text-blur-in motion-delay-1500">
        AI-powered moderation and sentiment analysis for Roblox experiences.
        Detect toxicity, protect player data, and reward positive behavior—all in real-time.
      </p>
    </div>
  </main>
);