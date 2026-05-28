import React from "react";
import Link from "next/link";

export default function LocataireNotFound(): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center min-h-[80vh] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Ambient Glow */}
      <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -top-10"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        {/* Badge 404 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">error</span>
          Erreur 404 - Portail Locataire
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-extrabold font-display text-on-surface tracking-tight">
            Page introuvable
          </h1>
          <p className="text-lg text-on-surface-variant font-body-md  mx-auto leading-relaxed">
            La page ou la quittance que vous recherchez n&apos;existe pas ou a
            été déplacée.
          </p>
        </div>

        {/* Action Cards Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link
            href="/locataire/dashboard"
            className="group p-6 bg-surface border border-outline-variant/30 hover:border-primary transition-all shadow-sm hover:shadow-md flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">
                home
              </span>
            </div>
            <h3 className="text-lg font-bold font-display text-on-surface group-hover:text-primary transition-colors">
              Tableau de bord
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 font-body-md">
              Retournez à l&apos;accueil de votre espace locataire.
            </p>
          </Link>

          <Link
            href="/locataire/paiements"
            className="group p-6 bg-surface border border-outline-variant/30 hover:border-primary transition-all shadow-sm hover:shadow-md flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-12 h-12 bg-tertiary/10 text-tertiary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">
                payments
              </span>
            </div>
            <h3 className="text-lg font-bold font-display text-on-surface group-hover:text-tertiary transition-colors">
              Mes Paiements
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 font-body-md">
              Consultez vos factures et effectuez un paiement.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
