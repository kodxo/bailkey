import "@/components/loading.module.css"
import Image from "next/image";

export default function Loading() {
  return (
    <div className="bg-surface text-on-surface h-screen w-screen overflow-hidden flex flex-col items-center justify-center selection:bg-primary/20">
      {/* Loading Container */}
      <main className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto p-gutter z-10 animate-pulse-soft">
        {/* Architectural Geometric Indicator */}
        <div className="relative w-32 h-32 mb-xl flex items-end justify-center gap-[4px] border-b-2 border-surface-dim pb-1">
          {/* Geometric "Building" Bars */}
          <div
            className="w-[12px] bg-primary rounded-t-sm opacity-60 building-line-1"
            style={{ height: 48 }}
          ></div>
          <div
            className="w-[12px] bg-primary rounded-t-sm opacity-80 building-line-2"
            style={{ height: 72 }}
          ></div>
          <div
            className="w-[12px] bg-primary rounded-t-sm opacity-40 building-line-3"
            style={{ height: 32 }}
          ></div>
          <div
            className="w-[12px] bg-primary rounded-t-sm opacity-90 building-line-4"
            style={{ height: 56 }}
          ></div>
          <div
            className="w-[12px] bg-primary rounded-t-sm opacity-50 building-line-5"
            style={{ height: 40 }}
          ></div>
          {/* Structural Grid Overlay Effect (Glassmorphism hint) */}
          <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent opacity-20 pointer-events-none"></div>
        </div>
        {/* Typography */}
        <div className="text-center space-y-md">
          <h1 className="font-h2 text-h2 text-primary tracking-tight">
            <Image
              src="/logo.png"
              alt="BailKey Logo"
              height={200}
              width={200}
              className="h-12 w-auto mx-auto"
            />
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-light tracking-wide">
            Initialisation de votre espace...
          </p>
        </div>
        {/* Progress Track (Subtle) */}
        <div className="w-48 h-[2px] bg-surface-variant rounded-full mt-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-primary rounded-full w-1/3 animate-[translateX_2s_infinite_linear]"></div>
        </div>
      </main>
      {/* Background Structural Elements (Ambient Depth) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Diffused light circle mimicking the primary brand color */}
        <div className="absolute w-[600px] h-[600px] bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-5"></div>
        {/* Geometric structural lines in background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              height="40"
              id="grid"
              patternUnits="userSpaceOnUse"
              width="40"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
              ></path>
            </pattern>
          </defs>
          <rect
            className="text-on-surface"
            fill="url(#grid)"
            height="100%"
            width="100%"
          ></rect>
        </svg>
      </div>
    </div>
  );
}
