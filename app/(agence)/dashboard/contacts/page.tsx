import React from "react";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Répertoire Contacts | BailKey",
  description: "Gestion de vos contacts, locataires, propriétaires et partenaires sur BailKey.",
};

interface ContactCategoryCardDTO {
  title: string;
  description: string;
  href: string;
  icon: string;
  countLabel?: string;
  badge?: string;
  badgeColor?: string;
}

export default function ContactsLandingPage(): React.JSX.Element {
  const categories: ContactCategoryCardDTO[] = [
    {
      title: "Locataires",
      description: "Gérez les dossiers locataires, leurs informations personnelles, pièces d'identité et personnes de contact en cas d'urgence.",
      href: "/dashboard/contacts/locataires",
      icon: "person",
      badge: "Principal",
      badgeColor: "bg-primary text-on-primary",
    },
    {
      title: "Propriétaires & Bailleurs",
      description: "Consultez et éditez les fiches des propriétaires en indivision ou en nom propre, gérez leurs comptes de versement.",
      href: "/dashboard/contacts/proprietaires",
      icon: "badge",
      badge: "Principal",
      badgeColor: "bg-primary text-on-primary",
    },
    {
      title: "Ouvriers & Techniciens",
      description: "Répertoire des prestataires techniques : plombiers, électriciens, maçons et entreprises partenaires de dépannage.",
      href: "/dashboard/contacts/ouvriers",
      icon: "engineering",
    },
    {
      title: "Gardiens & Concierges",
      description: "Informations de contact du personnel sur site chargé de la surveillance, du nettoyage et de la conciergerie des résidences.",
      href: "/dashboard/contacts/gardiens",
      icon: "security",
    },
    {
      title: "Bénéficiaires & Mandataires",
      description: "Ayants droit, bénéficiaires de comptes et mandataires légaux autorisés à percevoir ou valider des transactions.",
      href: "/dashboard/contacts/beneficiaires",
      icon: "diversity_1",
    },
  ];

  return (
    <div className="p-md w-full max-w-[1400px] mx-auto flex flex-col gap-lg">
      <section className="border-b border-outline-variant pb-md flex flex-col gap-sm">
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Répertoire Contacts" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Répertoire des Contacts
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-3xl">
            Centralisez et retrouvez facilement l&apos;ensemble de vos interlocuteurs : locataires en place, propriétaires bailleurs, prestataires de travaux et personnel de sécurité.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/50 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-12 -mt-12 group-hover:bg-secondary/15 transition-colors pointer-events-none" />

            <div className="flex flex-col gap-sm relative z-10">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-secondary-container/40 group-hover:bg-secondary text-secondary group-hover:text-on-secondary flex items-center justify-center transition-all duration-300 shadow-xs">
                  <span className="material-symbols-outlined text-[26px] select-none">
                    {cat.icon}
                  </span>
                </div>
                {cat.badge && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${cat.badgeColor || "bg-surface-container-high text-on-surface-variant"}`}>
                    {cat.badge}
                  </span>
                )}
              </div>

              <h3 className="text-h3 font-display font-bold text-on-surface group-hover:text-secondary transition-colors mt-2">
                {cat.title}
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-md mt-sm border-t border-outline-variant/30 flex items-center text-secondary text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Ouvrir le répertoire
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
