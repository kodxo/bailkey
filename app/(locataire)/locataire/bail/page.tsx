import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Détails du Bail - Espace Locataire | BailKey",
  description: "Consultez les informations générales, conditions financières et documents de votre contrat de location.",
};

interface DocumentRecord {
  id: string;
  title: string;
  type: string;
  size: string;
  url: string;
}

export default function LocataireBailPage(): React.JSX.Element {
  const associatedDocuments: DocumentRecord[] = [
    {
      id: "DOC-1",
      title: "Contrat de bail signé",
      type: "PDF",
      size: "2.4 MB",
      url: "#",
    },
    {
      id: "DOC-2",
      title: "Attestation d'assurance",
      type: "PDF",
      size: "1.1 MB",
      url: "#",
    },
    {
      id: "DOC-3",
      title: "État des lieux d'entrée",
      type: "PDF",
      size: "4.8 MB",
      url: "#",
    },
  ];

  return (
    <div className="flex-1 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Hero Header Section */}
      <div className="relative h-72 w-full bg-surface-container-high overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop"
          alt="Property Exterior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 translate-y-6">
          <div className="bg-surface/90 backdrop-blur-md border border-glass-border p-6 shadow-lg flex items-center gap-6">
            <div className="w-14 h-14 bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                apartment
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-on-surface tracking-tight">
                Résidence Les Palmiers
              </h1>
              <p className="text-sm font-semibold text-primary flex items-center gap-2 mt-1 font-body-md">
                <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block animate-pulse"></span>
                Bail Actif • Appartement 4B
              </p>
            </div>
          </div>
          <button className="hidden md:flex items-center gap-2 bg-secondary-container text-on-secondary-container px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-secondary-fixed transition-colors shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">
              edit_document
            </span>
            Signaler un changement
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto p-6 md:p-12 pt-16 space-y-12">
        {/* Info & Financials Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations Générales (2 cols) */}
          <section className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/20 pb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">
                info
              </span>
              <h2 className="text-2xl font-bold font-display text-on-surface">
                Informations Générales
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 flex-1">
              <div>
                <span className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Type de contrat
                </span>
                <span className="text-xl font-bold font-display text-on-surface block tracking-tight">
                  Bail d&apos;habitation meublé
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Durée
                </span>
                <span className="text-xl font-bold font-display text-on-surface block tracking-tight">
                  1 an (Renouvelable)
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Date d&apos;effet
                </span>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    calendar_today
                  </span>
                  <span className="text-lg font-semibold font-display">
                    01 Septembre 2026
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Date d&apos;échéance
                </span>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    event
                  </span>
                  <span className="text-lg font-semibold font-display">
                    31 Août 2027
                  </span>
                </div>
              </div>
              <div className="md:col-span-2 pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Dépôt de garantie
                </span>
                <span className="text-2xl font-bold font-display text-on-surface">
                  300 000 FCFA
                </span>
              </div>
            </div>
          </section>

          {/* Conditions Financières */}
          <section className="bg-primary/10 border border-primary/20 p-8 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <span
                className="material-symbols-outlined text-primary text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
              <h2 className="text-2xl font-bold font-display text-on-surface">
                Conditions Financières
              </h2>
            </div>
            <div className="space-y-6 flex-1 relative z-10 font-body-md">
              <div className="flex justify-between items-end border-b border-primary/10 pb-3">
                <span className="text-base text-on-surface-variant font-medium">
                  Loyer de base
                </span>
                <span className="text-xl font-bold font-display text-on-surface">
                  125 000 FCFA
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-primary/10 pb-3">
                <span className="text-base text-on-surface-variant font-medium">
                  Provisions pour charges
                </span>
                <span className="text-xl font-bold font-display text-on-surface">
                  25 000 FCFA
                </span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-primary/20 relative z-10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Mensualité Totale
                </span>
              </div>
              <div className="text-4xl font-extrabold font-display text-primary tracking-tight">
                150 000 <span className="text-2xl">FCFA</span>
              </div>
              <Link
                href="/locataire/paiements"
                className="mt-6 w-full bg-surface text-primary border border-primary/30 py-3.5 px-6 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-colors duration-200 flex justify-center items-center gap-2 shadow-sm text-center"
              >
                <span className="material-symbols-outlined text-[18px]">
                  history
                </span>
                Voir l&apos;historique
              </Link>
            </div>
          </section>
        </div>

        {/* Documents Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
            <span className="material-symbols-outlined text-on-surface-variant text-[28px]">
              folder_open
            </span>
            <h2 className="text-2xl font-bold font-display text-on-surface">
              Documents Associés
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {associatedDocuments.map(
              (doc: DocumentRecord): React.JSX.Element => (
                <div
                  key={doc.id}
                  className="bg-surface-container-lowest border border-outline-variant/30 p-6 flex items-start gap-4 hover:shadow-md hover:border-primary/50 transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-error/10 text-error flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      picture_as_pdf
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold font-display text-on-surface truncate">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1 font-body-md">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                  <button
                    className="text-on-surface-variant group-hover:text-primary transition-colors p-1"
                    title="Télécharger"
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      download
                    </span>
                  </button>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
