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

export function DashboardNav(): React.JSX.Element {
  const pathname: string = usePathname() || "";

  const isBoardActive: boolean = pathname === "/dashboard";
  const isGestionActive: boolean = pathname.startsWith("/dashboard/gestion");
  const isCaisseActive: boolean = pathname.startsWith("/dashboard/caisse");
  const isRapportsActive: boolean = pathname.startsWith("/dashboard/rapports");
  const isContactsActive: boolean = pathname.startsWith("/dashboard/contacts");
  const isConfigurationActive: boolean = pathname.startsWith(
    "/dashboard/configuration"
  );

  const groups: NavGroup[] = [
    {
      label: "",
      mainItem: {
        label: "Board",
        href: "/dashboard",
        icon: "dashboard",
        isActive: isBoardActive,
      },
      subItems: [],
    },
    {
      label: "Gestion Immobilière",
      mainItem: {
        label: "Gestion",
        href: "/dashboard/gestion",
        icon: "description",
        isActive: isGestionActive,
      },
      subItems: [
        {
          label: "Propriétés",
          href: "/dashboard/gestion/proprietes",
          icon: "apartment",
          isActive: pathname.startsWith("/dashboard/gestion/proprietes"),
        },
        {
          label: "Baux & Contrats",
          href: "",
          icon: "history_edu",
          children: [
            {
              label: "Baux",
              href: "/dashboard/gestion/baux",
              isActive: pathname.startsWith("/dashboard/gestion/baux"),
            },
            {
              label: "Échéances",
              href: "/dashboard/gestion/echeances",
              isActive: pathname.startsWith("/dashboard/gestion/echeances"),
            },
            {
              label: "Lignes de Charges",
              href: "/dashboard/gestion/charges",
              isActive: pathname.startsWith("/dashboard/gestion/charges"),
            },
            {
              label: "Cautions Gérées",
              href: "/dashboard/gestion/cautions",
              isActive: pathname.startsWith("/dashboard/gestion/cautions"),
            },
          ],
        },
        {
          label: "Impayés & Moratoires",
          href: "",
          icon: "money_off",
          children: [
            {
              label: "Moratoires",
              href: "/dashboard/gestion/moratoires",
              isActive: pathname === "/dashboard/gestion/moratoires",
            },
            {
              label: "Échéances Moratoire",
              href: "/dashboard/gestion/moratoires/echeances",
              isActive: pathname.startsWith(
                "/dashboard/gestion/moratoires/echeances"
              ),
            },
          ],
        },
        {
          label: "Travaux",
          href: "/dashboard/gestion/travaux",
          icon: "handyman",
          isActive: pathname.startsWith("/dashboard/gestion/travaux"),
        },
        {
          label: "Avances sur Loyer",
          href: "/dashboard/gestion/avances",
          icon: "payments",
          isActive: pathname.startsWith("/dashboard/gestion/avances"),
        },
      ],
    },
    {
      label: "Caisse & Finances",
      mainItem: {
        label: "Caisse",
        href: "/dashboard/caisse",
        icon: "account_balance_wallet",
        isActive: isCaisseActive,
      },
      subItems: [
        {
          label: "Encaissements",
          href: "",
          icon: "add_circle",
          children: [
            {
              label: "Encaisser Loyer",
              href: "/dashboard/caisse/encaissements/loyer",
              isActive: pathname.startsWith(
                "/dashboard/caisse/encaissements/loyer"
              ),
            },
            {
              label: "Encaisser Moratoire",
              href: "/dashboard/caisse/encaissements/moratoire",
              isActive: pathname.startsWith(
                "/dashboard/caisse/encaissements/moratoire"
              ),
            },
          ],
        },
        {
          label: "Décaissements",
          href: "",
          icon: "remove_circle",
          children: [
            {
              label: "Payer Avance Propriétaire",
              href: "/dashboard/caisse/decaissements/avance-proprietaire",
              isActive: pathname.startsWith(
                "/dashboard/caisse/decaissements/avance-proprietaire"
              ),
            },
            {
              label: "Travaux d'Entretien Général",
              href: "/dashboard/caisse/decaissements/travaux-entretien",
              isActive: pathname.startsWith(
                "/dashboard/caisse/decaissements/travaux-entretien"
              ),
            },
            {
              label: "Payer Propriétaire",
              href: "/dashboard/caisse/decaissements/payer-proprietaire",
              isActive: pathname.startsWith(
                "/dashboard/caisse/decaissements/payer-proprietaire"
              ),
            },
            {
              label: "Autres Décaissements",
              href: "/dashboard/caisse/decaissements/autres",
              isActive: pathname.startsWith(
                "/dashboard/caisse/decaissements/autres"
              ),
            },
            {
              label: "Rembourser Caution",
              href: "/dashboard/caisse/decaissements/rembourser-caution",
              isActive: pathname.startsWith(
                "/dashboard/caisse/decaissements/rembourser-caution"
              ),
            },
            {
              label: "Payer Taxes",
              href: "/dashboard/caisse/decaissements/payer-taxes",
              isActive: pathname.startsWith(
                "/dashboard/caisse/decaissements/payer-taxes"
              ),
            },
          ],
        },
        {
          label: "Transferts",
          href: "",
          icon: "swap_horiz",
          children: [
            {
              label: "Approvisionnement de Caisse",
              href: "/dashboard/caisse/transferts/approvisionnement",
              isActive: pathname.startsWith(
                "/dashboard/caisse/transferts/approvisionnement"
              ),
            },
            {
              label: "Versement à la Banque",
              href: "/dashboard/caisse/transferts/versement-banque",
              isActive: pathname.startsWith(
                "/dashboard/caisse/transferts/versement-banque"
              ),
            },
            {
              label: "Tous les Transferts",
              href: "/dashboard/caisse/transferts/tous",
              isActive: pathname.startsWith(
                "/dashboard/caisse/transferts/tous"
              ),
            },
          ],
        },
        {
          label: "État de Caisse",
          href: "/dashboard/caisse/etat",
          icon: "receipt",
          isActive: pathname.startsWith("/dashboard/caisse/etat"),
        },
        {
          label: "État de Caisse (PDF)",
          href: "/dashboard/caisse/etat-pdf",
          icon: "picture_as_pdf",
          isActive: pathname.startsWith("/dashboard/caisse/etat-pdf"),
        },
      ],
    },
    {
      label: "Analyses & Rapports",
      mainItem: {
        label: "Rapports",
        href: "/dashboard/rapports",
        icon: "analytics",
        isActive: isRapportsActive,
      },
      subItems: [
        {
          label: "Gestion (CRG)",
          href: "",
          icon: "bar_chart",
          children: [
            {
              label: "Compte Rendu de Gestion",
              href: "/dashboard/rapports/gestion/crg",
              isActive: pathname.startsWith("/dashboard/rapports/gestion/crg"),
            },
            {
              label: "Lignes CRG (Détails)",
              href: "/dashboard/rapports/gestion/lignes-crg",
              isActive: pathname.startsWith(
                "/dashboard/rapports/gestion/lignes-crg"
              ),
            },
          ],
        },
        {
          label: "Fiscalité (Taxes)",
          href: "",
          icon: "receipt_long",
          children: [
            {
              label: "Rapport des Taxes",
              href: "/dashboard/rapports/fiscalite/rapport-taxes",
              isActive: pathname.startsWith(
                "/dashboard/rapports/fiscalite/rapport-taxes"
              ),
            },
            {
              label: "Lignes de Taxes (Détails)",
              href: "/dashboard/rapports/fiscalite/lignes-taxes",
              isActive: pathname.startsWith(
                "/dashboard/rapports/fiscalite/lignes-taxes"
              ),
            },
          ],
        },
      ],
    },
    {
      label: "Répertoire Contacts",
      mainItem: {
        label: "Contacts",
        href: "/dashboard/contacts",
        icon: "group",
        isActive: isContactsActive,
      },
      subItems: [
        {
          label: "Locataires",
          href: "/dashboard/contacts/locataires",
          icon: "person",
          isActive: pathname.startsWith("/dashboard/contacts/locataires"),
        },
        {
          label: "Propriétaires",
          href: "/dashboard/contacts/proprietaires",
          icon: "badge",
          isActive: pathname.startsWith("/dashboard/contacts/proprietaires"),
        },
        {
          label: "Ouvriers",
          href: "/dashboard/contacts/ouvriers",
          icon: "engineering",
          isActive: pathname.startsWith("/dashboard/contacts/ouvriers"),
        },
        {
          label: "Gardiens",
          href: "/dashboard/contacts/gardiens",
          icon: "security",
          isActive: pathname.startsWith("/dashboard/contacts/gardiens"),
        },
        {
          label: "Bénéficiaires",
          href: "/dashboard/contacts/beneficiaires",
          icon: "diversity_1",
          isActive: pathname.startsWith("/dashboard/contacts/beneficiaires"),
        },
      ],
    },
    {
      label: "Configuration",
      mainItem: {
        label: "Config",
        href: "/dashboard/configuration",
        icon: "settings",
        isActive: isConfigurationActive,
      },
      subItems: [
        {
          label: "Géographie & Immeubles",
          href: "",
          icon: "map",
          children: [
            {
              label: "Zones Géographiques",
              href: "/dashboard/configuration/geographie/zones",
              isActive: pathname.startsWith(
                "/dashboard/configuration/geographie/zones"
              ),
            },
            {
              label: "Quartiers",
              href: "/dashboard/configuration/geographie/quartiers",
              isActive: pathname.startsWith(
                "/dashboard/configuration/geographie/quartiers"
              ),
            },
            {
              label: "Types de Bien",
              href: "/dashboard/configuration/geographie/types-bien",
              isActive: pathname.startsWith(
                "/dashboard/configuration/geographie/types-bien"
              ),
            },
          ],
        },
        {
          label: "Types d'Opérations",
          href: "",
          icon: "category",
          children: [
            {
              label: "Types de Charge",
              href: "/dashboard/configuration/operations/types-charge",
              isActive: pathname.startsWith(
                "/dashboard/configuration/operations/types-charge"
              ),
            },
            {
              label: "Types de Travaux",
              href: "/dashboard/configuration/operations/types-travaux",
              isActive: pathname.startsWith(
                "/dashboard/configuration/operations/types-travaux"
              ),
            },
            {
              label: "Métiers",
              href: "/dashboard/configuration/operations/metiers",
              isActive: pathname.startsWith(
                "/dashboard/configuration/operations/metiers"
              ),
            },
            {
              label: "Types de Décaissement",
              href: "/dashboard/configuration/operations/types-decaissement",
              isActive: pathname.startsWith(
                "/dashboard/configuration/operations/types-decaissement"
              ),
            },
            {
              label: "Catégories de Reçu",
              href: "/dashboard/configuration/operations/categories-recu",
              isActive: pathname.startsWith(
                "/dashboard/configuration/operations/categories-recu"
              ),
            },
          ],
        },
        {
          label: "Finance & Banques",
          href: "",
          icon: "account_balance",
          children: [
            {
              label: "Journaux",
              href: "/dashboard/configuration/finances/journaux",
              isActive: pathname.startsWith(
                "/dashboard/configuration/finances/journaux"
              ),
            },
            {
              label: "Banques",
              href: "/dashboard/configuration/finances/banques",
              isActive: pathname.startsWith(
                "/dashboard/configuration/finances/banques"
              ),
            },
            {
              label: "Comptes Bancaires",
              href: "/dashboard/configuration/finances/comptes-bancaires",
              isActive: pathname.startsWith(
                "/dashboard/configuration/finances/comptes-bancaires"
              ),
            },
            {
              label: "Taxes",
              href: "/dashboard/configuration/finances/taxes",
              isActive: pathname.startsWith(
                "/dashboard/configuration/finances/taxes"
              ),
            },
          ],
        },
        {
          label: "Système",
          href: "",
          icon: "dns",
          children: [
            {
              label: "Paramètres",
              href: "/dashboard/configuration/systeme/parametres",
              isActive: pathname.startsWith(
                "/dashboard/configuration/systeme/parametres"
              ),
            },
          ],
        },
      ],
    },
  ];

  const mobileShortcuts: MobileShortcutItem[] = [
    {
      label: "Board",
      href: "/dashboard",
      icon: "dashboard",
      isActive: isBoardActive,
    },
    {
      label: "Gestion",
      href: "/dashboard/gestion",
      icon: "description",
      isActive: isGestionActive,
    },
    {
      label: "Contacts",
      href: "/dashboard/contacts",
      icon: "group",
      isActive: isContactsActive,
    },
  ];
  const footerActions: FooterActionItem[] = [
    { label: "Aide & Support", href: "/dashboard/support", icon: "help" },
  ];

  return (
    <Navigation
      logoSlot={
        <Link href="/dashboard">
          <Logo height={32} />
        </Link>
      }
      groups={groups}
      mobileShortcuts={mobileShortcuts}
      footerActions={footerActions}
      userButtonSlot={<UserButton />}
      mobileMenuToggleId="dashboard-mobile-menu"
    />
  );
}
