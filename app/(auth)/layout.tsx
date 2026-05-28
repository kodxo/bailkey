import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-surface font-body-md antialiased text-on-surface">
      {/* Left Pane: Visual & Testimonial */}
      <div
        className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-surface-variant flex-col justify-between p-12 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/auth/login-image.png')`,
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Decorative elements / Logo area */}
        <div className="relative z-10 flex items-center">
          <Link href="/" className="inline-block">
            <img
              alt="BailKey Logo"
              className="h-10 w-auto brightness-0 invert drop-shadow"
              src="/logo.png"
            />
          </Link>
        </div>

        {/* Testimonial Panel */}
        <div className="relative z-10 mt-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)]">
            <p className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed font-display">
              &quot;BailKey a transformé notre rigueur opérationnelle. La
              précision des états des lieux et la fluidité de la plateforme nous
              permettent de gérer notre parc avec une confiance absolue.&quot;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2EB1B2] flex items-center justify-center text-white font-bold text-lg">
                MJ
              </div>
              <div>
                <div className="font-bold text-white text-lg font-display">
                  Marc Jolibois
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/80 font-inter">
                  Directeur des Opérations, Apex Immo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Form Area */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col bg-surface min-h-screen relative">
        {/* Header with Back Button */}
        <header className="absolute top-0 w-full flex items-center justify-between px-6 py-6 lg:px-12 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase font-inter">
              Retour
            </span>
          </Link>
          <div className="flex md:hidden items-center">
            <img
              alt="BailKey Logo"
              className="h-8"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM6CuHRyZUts-cW3kTdPVBCl5iAL6SMZ2A77kGtHDbl1YQnmcWHTEACm04Cq7oYV-ED7hGCqDbVeVe4ZRR9o4gTjZD58V6b8k_mOFvUvw24l0FOauhJdHfK3l0B2mix7s0z3XyAHe-K9E6J9TzN6e4MtD4vnpZndzezZ01xCMswnlWOII9ezCRR1cJmcSurNuuyBnkfmhnihOeE5ny07NKdCdoBk0hW9wv488v015805rvd8m3gkI0MDVg8Ka0mP-gMN_zc4llBIA"
            />
          </div>
        </header>

        {/* Children (Form / Content) */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
