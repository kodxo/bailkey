import React from "react";
import { cn } from "@/lib/utils";

/**
 * Composant racine pour les tableaux de bord.
 * Gère l'espacement principal (gap-lg).
 */
export const DashboardLayout = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("flex flex-col gap-lg", className)}>
    {children}
  </div>
);

/**
 * Ligne du haut pour les KPIs (MetricCards) et les actions (boutons).
 * Défilement horizontal sur mobile.
 */
export const DashboardMetrics = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <section className={cn("flex gap-sm overflow-x-auto pb-2 md:pb-0 items-center w-full", className)}>
    {children}
  </section>
);

/**
 * Conteneur de grille pour séparer la vue en deux (liste / détails).
 * Par défaut : 1/3 - 2/3 (grid-cols-1 lg:grid-cols-3)
 */
export const DashboardSplitGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-md items-start", className)}>
    {children}
  </div>
);

/**
 * Panneau principal gauche (occupant 2 colonnes sur 3 sur grand écran).
 * Typiquement utilisé pour la recherche et le tableau.
 */
export const DashboardMain = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("lg:col-span-2 flex flex-col gap-md", className)}>
    {children}
  </div>
);

/**
 * Panneau secondaire droit (occupant 1 colonne sur 3).
 * Collant (sticky) pour rester visible lors du défilement de la liste.
 */
export const DashboardSidebar = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("lg:col-span-1 flex flex-col sticky top-[80px] self-start z-10", className)}>
    {children}
  </div>
);

/**
 * Barre d'outils (Recherche, Filtres) située en haut du panneau principal.
 */
export const DashboardToolbar = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden rounded-none", className)}>
    {children}
  </div>
);
