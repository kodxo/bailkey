/* eslint-disable react/no-unescaped-entities */
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function MarketingNotFound() {
  return (
    <div className="min-h-screen  flex flex-col">
      <Navbar />
      {/* Main Content Canvas */}
      <main className="mt-20 grow flex items-center justify-center px-margin py-xl relative overflow-hidden">
        {/* Ambient Background Decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-[800px] h-[800px] rounded-full bg-linear-to-tr from-primary-container/20 to-transparent blur-3xl mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center">
          {/* 404 Display */}
          <div className="mb-8 relative">
            <h1 className="font-display text-[120px] leading-none text-on-surface font-extrabold tracking-tighter opacity-10">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[64px] text-primary"
                data-weight="fill"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                architecture
              </span>
            </div>
          </div>
          {/* Message */}
          <h2 className="font-h1 text-h1 text-on-surface mb-4">
            Page non trouvée
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-10">
            L'adresse que vous recherchez semble avoir été modifiée ou déplacée.
            Nous vous invitons à retourner à la structure principale ou à
            explorer nos solutions.
          </p>
          {/* Actions (Glassmorphism Bento Container) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter w-full max-w-2xl">
            <Link
              className="group bg-surface-container-lowest/80 backdrop-blur-xl border border-glass-border p-6 rounded-none flex flex-col items-center justify-center text-center hover:bg-surface-container transition-colors duration-300 shadow-[0_32px_64px_-16px_rgba(46,177,178,0.1)]"
              href="/"
            >
              <span className="material-symbols-outlined text-primary mb-3 text-[32px]">
                home
              </span>
              <h3 className="font-h3 text-h3 text-on-surface mb-2 group-hover:text-primary transition-colors">
                Retour à l'accueil
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Revenez à la page principale de BailKey.
              </p>
            </Link>
            <a
              className="group bg-surface-container-lowest/80 backdrop-blur-xl border border-glass-border p-6 rounded-none flex flex-col items-center justify-center text-center hover:bg-surface-container transition-colors duration-300 shadow-[0_32px_64px_-16px_rgba(46,177,178,0.1)]"
              href="#"
            >
              <span className="material-symbols-outlined text-primary mb-3 text-[32px]">
                explore
              </span>
              <h3 className="font-h3 text-h3 text-on-surface mb-2 group-hover:text-primary transition-colors">
                Nos Solutions
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Découvrez nos outils de gestion immobilière.
              </p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
