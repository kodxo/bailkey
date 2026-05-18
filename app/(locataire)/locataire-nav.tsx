"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Navigation,
  type NavGroup,
  type MobileShortcutItem,
  type FooterActionItem,
} from "@/components/ui/navigation";

export function LocataireNav(): React.JSX.Element {
  const pathname: string = usePathname() || "";

  const isDashboardActive: boolean = pathname === "/locataire/dashboard";
  const isBailActive: boolean = pathname.startsWith("/locataire/bail");
  const isPaiementsActive: boolean = pathname.startsWith("/locataire/paiements");
  const isIncidentsActive: boolean = pathname.startsWith("/locataire/incidents");
  const isContactActive: boolean = pathname.startsWith("/locataire/contact");

  const groups: NavGroup[] = [
    {
      label: "",
      mainItem: {
        label: "Accueil",
        href: "/locataire/dashboard",
        icon: "dashboard",
        isActive: isDashboardActive,
      },
      subItems: [],
    },
    {
      label: "Mon Contrat",
      mainItem: {
        label: "Bail",
        href: "/locataire/bail",
        icon: "description",
        isActive: isBailActive,
      },
      subItems: [
        {
          label: "Détails du bail",
          href: "/locataire/bail",
          icon: "contract",
          isActive: pathname === "/locataire/bail",
        },
        {
          label: "Quittances",
          href: "/locataire/bail/quittances",
          icon: "receipt",
          isActive: pathname.startsWith("/locataire/bail/quittances"),
        },
        {
          label: "Assurance habitation",
          href: "/locataire/bail/assurance",
          icon: "verified_user",
          isActive: pathname.startsWith("/locataire/bail/assurance"),
        },
        {
          label: "État des lieux",
          href: "/locataire/bail/etat-des-lieux",
          icon: "fact_check",
          isActive: pathname.startsWith("/locataire/bail/etat-des-lieux"),
        },
      ],
    },
    {
      label: "Finances",
      mainItem: {
        label: "Loyer",
        href: "/locataire/paiements",
        icon: "payments",
        isActive: isPaiementsActive,
      },
      subItems: [
        {
          label: "Payer mon loyer",
          href: "/locataire/paiements/payer",
          icon: "credit_card",
          isActive: pathname.startsWith("/locataire/paiements/payer"),
        },
        {
          label: "Historique des paiements",
          href: "/locataire/paiements/historique",
          icon: "history",
          isActive: pathname.startsWith("/locataire/paiements/historique"),
        },
        {
          label: "Moyens de paiement",
          href: "/locataire/paiements/methodes",
          icon: "account_balance_wallet",
          isActive: pathname.startsWith("/locataire/paiements/methodes"),
        },
      ],
    },
    {
      label: "Maintenance & Travaux",
      mainItem: {
        label: "Incidents",
        href: "/locataire/incidents",
        icon: "plumbing",
        isActive: isIncidentsActive,
      },
      subItems: [
        {
          label: "Déclarer un incident",
          href: "/locataire/incidents/nouveau",
          icon: "add_alert",
          isActive: pathname === "/locataire/incidents/nouveau",
        },
        {
          label: "Suivi des interventions",
          href: "/locataire/incidents",
          icon: "construction",
          isActive: pathname === "/locataire/incidents",
        },
      ],
    },
    {
      label: "Communication",
      mainItem: {
        label: "Contact",
        href: "/locataire/contact",
        icon: "forum",
        isActive: isContactActive,
      },
      subItems: [
        {
          label: "Contacter l'agence",
          href: "/locataire/contact",
          icon: "support_agent",
          isActive: pathname === "/locataire/contact",
        },
        {
          label: "Guide du locataire",
          href: "/locataire/guide",
          icon: "menu_book",
          isActive: pathname.startsWith("/locataire/guide"),
        },
      ],
    },
  ];

  const mobileShortcuts: MobileShortcutItem[] = [
    {
      label: "Accueil",
      href: "/locataire/dashboard",
      icon: "dashboard",
      isActive: isDashboardActive,
    },
    {
      label: "Bail",
      href: "/locataire/bail",
      icon: "description",
      isActive: isBailActive,
    },
    {
      label: "Paiements",
      href: "/locataire/paiements",
      icon: "payments",
      isActive: isPaiementsActive,
    },
    {
      label: "Incidents",
      href: "/locataire/incidents",
      icon: "plumbing",
      isActive: isIncidentsActive,
    },
  ];

  const footerActions: FooterActionItem[] = [
    { label: "Aide & Support", href: "/locataire/contact", icon: "help" },
  ];

  return (
    <Navigation
      logoSlot={
        <Link href="/locataire/dashboard">
          <Logo height={32} />
        </Link>
      }
      groups={groups}
      mobileShortcuts={mobileShortcuts}
      footerActions={footerActions}
      userButtonSlot={<UserButton />}
      mobileMenuToggleId="locataire-mobile-menu"
    />
  );
}
