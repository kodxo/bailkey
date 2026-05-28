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

export function AdminNav(): React.JSX.Element {
  const pathname: string = usePathname() || "";

  const isContentActive: boolean =
    pathname === "/admin" ||
    pathname.startsWith("/admin/editor") ||
    pathname.startsWith("/admin/media");

  const isArticlesActive: boolean =
    pathname === "/admin" || pathname.startsWith("/admin/editor");

  const isMediaActive: boolean = pathname.startsWith("/admin/media");
  const isUsersActive: boolean = pathname.startsWith("/admin/users");

  const isSettingsGroupActive: boolean = pathname.startsWith("/admin/users");

  const groups: NavGroup[] = [
    {
      label: "Gestion Contenu",
      mainItem: {
        label: "Contenu",
        href: "/admin",
        icon: "folder",
        isActive: isContentActive,
      },
      subItems: [
        {
          label: "Articles",
          href: "/admin",
          icon: "article",
          isActive: isArticlesActive,
        },
        {
          label: "Médias",
          href: "/admin/media",
          icon: "photo_library",
          isActive: isMediaActive,
        },
        {
          label: "Catégories",
          href: "/admin",
          icon: "category",
          isActive: false,
        },
        { label: "Mots-clés", href: "/admin", icon: "sell", isActive: false },
      ],
    },
    {
      label: "Paramètres",
      mainItem: {
        label: "Config",
        href: "/admin/users",
        icon: "settings",
        isActive: isSettingsGroupActive,
      },
      subItems: [
        {
          label: "Utilisateurs",
          href: "/admin/users",
          icon: "group",
          isActive: isUsersActive,
        },
        {
          label: "Propriétaires",
          href: "/admin/owners",
          icon: "person_4",
          isActive: pathname.startsWith("/admin/owners"),
        },
        {
          label: "Propriétés",
          href: "/admin/properties",
          icon: "domain",
          isActive: pathname.startsWith("/admin/properties"),
        },
        {
          label: "Locataires",
          href: "/admin/tenants",
          icon: "group",
          isActive: pathname.startsWith("/admin/tenants"),
        },
        {
          label: "Sécurité",
          href: "/admin",
          icon: "security",
          isActive: false,
        },
      ],
    },
  ];

  const mobileShortcuts: MobileShortcutItem[] = [
    {
      label: "Articles",
      href: "/admin",
      icon: "article",
      isActive: isArticlesActive,
    },
    {
      label: "Médias",
      href: "/admin/media",
      icon: "photo_library",
      isActive: isMediaActive,
    },
    {
      label: "Utilisateurs",
      href: "/admin/users",
      icon: "group",
      isActive: isUsersActive,
    },
  ];

  const footerActions: FooterActionItem[] = [
    { label: "Support", href: "/admin", icon: "help" },
  ];

  return (
    <Navigation
      logoSlot={
        <Link href="/">
          <Logo height={32} />
        </Link>
      }
      groups={groups}
      mobileShortcuts={mobileShortcuts}
      footerActions={footerActions}
      userButtonSlot={<UserButton />}
      mobileMenuToggleId="mobile-menu-toggle"
    />
  );
}
