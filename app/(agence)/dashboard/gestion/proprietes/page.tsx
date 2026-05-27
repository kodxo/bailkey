import React, { Suspense } from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { PropertiesDataContainer } from "./properties-data-container";
import { PropertiesSkeleton } from "./properties-skeleton";

export const dynamic = "force-dynamic";

export default function DashboardPropertiesPage(): React.JSX.Element {
  return (
    <div className="p-md w-full max-w-[1400px] mx-auto flex flex-col gap-lg">
      <section className="border-b border-outline-variant pb-md flex flex-col gap-sm">
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Gestion Immobilière", href: "/dashboard/gestion" },
            { label: "Propriétés" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Gestion des Propriétés
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez votre catalogue immobilier, ajoutez de nouveaux biens et suivez leur statut locatif.
          </p>
        </div>
      </section>

      <Suspense fallback={<PropertiesSkeleton />}>
        <PropertiesDataContainer />
      </Suspense>
    </div>
  );
}
