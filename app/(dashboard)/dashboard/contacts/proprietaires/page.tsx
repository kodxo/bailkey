import React from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { getAdminOwners } from "@/lib/dal/owners";
import { OwnersDashboard } from "./owners-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardOwnersPage(): Promise<React.JSX.Element> {
  const res = await getAdminOwners();
  const initialOwners = res.success ? res.owners : [];

  return (
    <div className="p-md w-full max-w-[1400px] mx-auto flex flex-col gap-lg">
      <section className="border-b border-outline-variant pb-md flex flex-col gap-sm">
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Répertoire Contacts", href: "/dashboard/contacts" },
            { label: "Propriétaires" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Gestion des Propriétaires
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez la base des propriétaires, leurs coordonnées et leurs documents d&apos;identité.
          </p>
        </div>
      </section>

      <OwnersDashboard initialOwners={initialOwners} />
    </div>
  );
}
