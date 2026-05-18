import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Espace Locataire - Vue d'ensemble | BailKey",
  description: "Résumé de votre situation locative actuelle, paiements et requêtes en cours.",
};

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  amount?: string;
  status: "Complété" | "En cours";
  type: "payment" | "incident";
  reference?: string;
}

export default function LocataireDashboardPage(): React.JSX.Element {
  const recentActivities: ActivityItem[] = [
    {
      id: "ACT-1",
      title: "Paiement Loyer Octobre",
      date: "02 Octobre 2026",
      amount: "-150 000 FCFA",
      status: "Complété",
      type: "payment",
      reference: "Carte Bancaire",
    },
    {
      id: "ACT-2",
      title: "Fuite d'eau mineure (Cuisine)",
      date: "28 Septembre 2026",
      status: "En cours",
      type: "incident",
      reference: "Ticket #402",
    },
    {
      id: "ACT-3",
      title: "Paiement Loyer Septembre",
      date: "04 Septembre 2026",
      amount: "-150 000 FCFA",
      status: "Complété",
      type: "payment",
      reference: "Virement",
    },
  ];

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Header Section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[14px]">home</span>
          Locataire Actif
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-on-surface tracking-tight">
          Bonjour, Sarah 👋
        </h1>
        <p className="text-body-lg text-on-surface-variant font-body-md mt-1">
          Voici un résumé de votre situation locative actuelle.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Prochain Paiement (Featured - 8 cols) */}
        <div className="md:col-span-8 bg-surface border border-outline-variant/30 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all duration-500 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 h-full">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  calendar_today
                </span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Prochain Paiement
                </span>
              </div>
              <h3 className="text-4xl font-bold font-display text-on-surface tracking-tight">
                150 000 <span className="text-2xl text-on-surface-variant">FCFA</span>
              </h3>
              <p className="text-sm text-error font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">
                  error
                </span>
                Échéance : 05 Novembre 2026 (Dans 3 jours)
              </p>
            </div>
            <Link
              href="/locataire/paiements"
              className="px-8 py-4 bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg transform active:scale-95 flex-shrink-0 text-center"
            >
              Payer Maintenant
            </Link>
          </div>
        </div>

        {/* Détails du bail (4 cols) */}
        <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/30 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Détails du Bail
              </span>
              <span className="material-symbols-outlined text-on-surface-variant">
                home
              </span>
            </div>
            <h4 className="text-xl font-bold font-display text-on-surface mb-1">
              Résidence Les Palmiers
            </h4>
            <p className="text-sm text-on-surface-variant mb-6 font-body-md">
              Appartement 4B, Bâtiment A
            </p>
          </div>
          <div className="pt-4 border-t border-outline-variant/30 mt-auto">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">
                  Fin du contrat
                </p>
                <p className="text-sm text-on-surface font-semibold font-display">
                  31 Déc. 2026
                </p>
              </div>
              <Link
                href="/locataire/bail"
                className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
              >
                Voir le bail
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Stat 1 : Solde Actuel */}
        <div className="bg-surface border border-outline-variant/20 shadow-sm p-6 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">
              account_balance_wallet
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Solde actuel
            </p>
            <p className="text-2xl font-bold font-display text-on-surface mt-1">
              0 FCFA
            </p>
          </div>
        </div>

        {/* Stat 2 : Demandes Actives */}
        <div className="bg-surface border border-outline-variant/20 shadow-sm p-6 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">build</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Demandes actives
            </p>
            <p className="text-2xl font-bold font-display text-on-surface mt-1">
              1 En cours
            </p>
          </div>
        </div>

        {/* Stat 3 : Dernier Document */}
        <div className="bg-surface border border-outline-variant/20 shadow-sm p-6 flex items-center gap-4 transition-all hover:shadow-md group cursor-pointer">
          <div className="w-12 h-12 bg-secondary/10 text-secondary-foreground flex items-center justify-center group-hover:bg-secondary/20 transition-colors shrink-0">
            <span className="material-symbols-outlined text-[24px]">
              description
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Dernier document
            </p>
            <p className="text-base text-on-surface font-semibold truncate mt-1 font-body-md">
              Quittance Octobre
            </p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            arrow_forward
          </span>
        </div>
      </div>

      {/* Bottom Section : Activité Récente & Support */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activité Récente (2 cols) */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant/30 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
            <h3 className="text-xl font-bold font-display text-on-surface">
              Activité Récente
            </h3>
            <Link
              href="/locataire/paiements"
              className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
            >
              Tout voir
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {recentActivities.map((item: ActivityItem): React.JSX.Element => (
              <div
                key={item.id}
                className="p-6 flex items-center gap-4 hover:bg-surface-container-lowest transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold ${
                    item.type === "payment"
                      ? "bg-primary/10 text-primary"
                      : "bg-tertiary/10 text-tertiary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.type === "payment" ? "check_circle" : "plumbing"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-on-surface font-body-md">
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5 font-body-md">
                    {item.date} {item.reference ? `• ${item.reference}` : ""}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  {item.amount && (
                    <p className="text-base font-bold font-display text-on-surface">
                      {item.amount}
                    </p>
                  )}
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-semibold mt-1 ${
                      item.status === "Complété"
                        ? "bg-primary/10 text-primary"
                        : "bg-tertiary/10 text-tertiary"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Widget */}
        <div className="bg-inverse-surface text-inverse-on-surface border border-outline-variant/10 shadow-sm flex flex-col justify-center relative overflow-hidden group p-8">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-surface-container/10 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  support_agent
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-surface-container-lowest mb-2">
                Besoin d&apos;aide ?
              </h3>
              <p className="text-sm text-surface-variant mb-8 opacity-90 leading-relaxed font-body-md">
                Notre équipe de gestion immobilière est disponible pour répondre
                à vos questions ou organiser une intervention.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/locataire/incidents"
                className="w-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 border border-surface-container-lowest/20 text-surface-container-lowest font-semibold text-sm py-3 px-4 transition-colors flex items-center justify-between"
              >
                <span>Créer un ticket</span>
                <span className="material-symbols-outlined text-[18px]">add</span>
              </Link>
              <Link
                href="/locataire/contact"
                className="w-full bg-transparent hover:bg-surface-container-lowest/5 text-surface-container-lowest font-semibold text-sm py-3 px-4 transition-colors flex items-center justify-between border border-transparent"
              >
                <span>Contacter le gérant</span>
                <span className="material-symbols-outlined text-[18px]">call</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
