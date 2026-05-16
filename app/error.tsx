/* eslint-disable react/no-unescaped-entities */
"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";

export default function Error() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow flex flex-col items-center justify-center px-gutter py-xl">
        <div className="max-w-2xl w-full mx-auto flex flex-col items-center text-center space-y-md">
          <div className="relative w-full max-w-md mx-auto aspect-video mb-lg rounded-xl overflow-hidden border border-glass-border shadow-[0_32px_64px_-16px_rgba(0,105,106,0.1)] bg-surface-container-low flex items-center justify-center group  z-10 before:absolute before:inset-0 before:bg-white/20 before:backdrop-blur-md">
            <Image
              alt="Technical maintenance"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
              src="/images/technical-maintenance.png"
              fill
              priority
            />
            <span
              className="material-symbols-outlined text-[80px] text-primary relative z-20"
              style={{ fontVariationSettings: '"FILL" 0' }}
            >
              build_circle
            </span>
          </div>
          <div className="space-y-sm">
            <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
              Erreur Système 500
            </span>
            <h1 className="font-display text-display text-on-surface">
              Une erreur technique est survenue.
            </h1>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Notre équipe d'ingénierie a été notifiée de ce dysfonctionnement.
            L'intégrité de vos données est assurée pendant que nous résolvons ce
            problème avec la précision requise.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-sm mt-lg">
            <button className="bg-primary text-primary-foreground font-label-caps text-label-caps px-lg py-sm rounded-full shadow-[0_4px_12px_rgba(0,105,106,0.2)] hover:-translate-y-0.5 transition-transform duration-200 uppercase tracking-wider">
              Réessayer
            </button>
            <a
              className="text-on-surface-variant font-label-caps text-label-caps px-lg py-sm rounded-full border border-outline-variant/50 hover:bg-surface-variant/30 transition-colors duration-200 uppercase tracking-wider flex items-center gap-xs"
              href="#"
            >
              Support technique
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="mt-xl text-center">
            <span className="font-body-md text-body-md text-outline">
              ID de référence:
              <span className="font-mono text-sm opacity-70">
                BK-ERR-948A2C
              </span>
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
