import React from "react";
import { cn } from "@/lib/utils";

/**
 * Conteneur de niveau "Page" pour les vues du dashboard.
 * Assure un espacement constant par rapport aux bords de l'écran et limite la largeur max.
 */
export const DashboardPageContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("p-md w-full max-w-[1400px] mx-auto flex flex-col gap-lg", className)}>
    {children}
  </div>
);

/**
 * Section d'en-tête de la page (typiquement contenant le Breadcrumb, le Titre et la description).
 * Soulignée par une bordure.
 */
export const DashboardPageHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <section className={cn("border-b border-outline-variant pb-md flex flex-col gap-sm", className)}>
    {children}
  </section>
);
