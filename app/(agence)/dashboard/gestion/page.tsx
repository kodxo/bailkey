import React from "react";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Gestion Immobilière | BailKey",
  description: "Catalogue et opérations de gestion de vos biens immobiliers sur BailKey.",
};

interface ModuleCardDTO {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

export default function GestionLandingPage(): React.JSX.Element {
  const cards: ModuleCardDTO[] = [
    {
      title: "Propriétés en Gestion",
      description: "Gérez l'ensemble de votre catalogue immobilier, ajoutez de nouveaux biens et suivez leur statut locatif en temps réel.",
      href: "/dashboard/gestion/proprietes",
      icon: "apartment",
      badge: "Actif",
      badgeColor: "bg-primary text-on-primary",
    },
    {
      title: "Baux & Contrats",
      description: "Rédigez et consultez les contrats de location, définissez les montants de loyer et gérez les dépôts de garantie.",
      href: "/dashboard/gestion/baux",
      icon: "history_edu",
      badge: "Actif",
      badgeColor: "bg-primary text-on-primary",
    },
    {
      title: "Échéances & Loyers",
      description: "Consultez les échéances de loyer générées, envoyez les avis d'échéance et suivez les paiements mensuels des locataires.",
      href: "/dashboard/gestion/echeances",
      icon: "event_available",
    },
    {
      title: "Lignes de Charges",
      description: "Saisissez et imputez les charges communes d'immeuble, suivez les consommations d'eau et d'électricité.",
      href: "/dashboard/gestion/charges",
      icon: "receipt_long",
    },
    {
      title: "Cautions Gérées",
      description: "Suivi comptable précis des dépôts de garantie encaissés, remboursés ou retenus en fin de bail.",
      href: "/dashboard/gestion/cautions",
      icon: "lock",
    },
    {
      title: "Impayés & Moratoires",
      description: "Gérez les relances pour retard de paiement et configurez des plans d'apurement (moratoires) avec suivi d'échéancier.",
      href: "/dashboard/gestion/moratoires",
      icon: "money_off",
      badge: "Important",
      badgeColor: "bg-error text-on-error",
    },
    {
      title: "Travaux & Interventions",
      description: "Enregistrez les demandes de dépannage, émettez des bons de travaux et coordonnez les interventions des techniciens.",
      href: "/dashboard/gestion/travaux",
      icon: "handyman",
    },
    {
      title: "Avances sur Loyer",
      description: "Suivez les avances financières versées par les locataires ou les pré-financements accordés aux bailleurs.",
      href: "/dashboard/gestion/avances",
      icon: "payments",
    },
  ];

  return (
    <div className="p-md w-full max-w-[1400px] mx-auto flex flex-col gap-lg">
      <section className="border-b border-outline-variant pb-md flex flex-col gap-sm">
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Gestion Immobilière" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Gestion Immobilière & Opérations
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-3xl">
            Accédez à tous les modules métiers pour piloter votre patrimoine, suivre vos baux, gérer les charges et encadrer la maintenance de vos immeubles.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/50 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors pointer-events-none" />

            <div className="flex flex-col gap-sm relative z-10">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary-container/30 group-hover:bg-primary text-primary group-hover:text-on-primary flex items-center justify-center transition-all duration-300 shadow-xs">
                  <span className="material-symbols-outlined text-[26px] select-none">
                    {card.icon}
                  </span>
                </div>
                {card.badge && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${card.badgeColor || "bg-surface-container-high text-on-surface-variant"}`}>
                    {card.badge}
                  </span>
                )}
              </div>

              <h3 className="text-h3 font-display font-bold text-on-surface group-hover:text-primary transition-colors mt-2">
                {card.title}
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="pt-md mt-sm border-t border-outline-variant/30 flex items-center text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Accéder au module
              <span className="material-symbols-outlined ml-1 text-base">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
