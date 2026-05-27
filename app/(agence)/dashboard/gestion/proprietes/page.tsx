import React from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { getProperties } from "@/lib/dal/properties";
import { getOwners } from "@/lib/dal/owners";
import { PropertiesDashboard } from "./properties-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPropertiesPage(): Promise<React.JSX.Element> {
  const [propertiesRes, ownersRes] = await Promise.all([
    getProperties(),
    getOwners(),
  ]);

  const initialProperties = propertiesRes.success ? propertiesRes.properties : [];
  const initialOwners = ownersRes.success ? ownersRes.owners : [];

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

      <PropertiesDashboard
        initialProperties={initialProperties}
        initialOwners={initialOwners}
      />
    </div>
  );
}
