import React, { Suspense } from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { OwnersDataContainer } from "./owners-data-container";
import { OwnersSkeleton } from "./owners-skeleton";

export const dynamic = "force-dynamic";

export default function DashboardOwnersPage(): React.JSX.Element {
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

      <Suspense fallback={<OwnersSkeleton />}>
        <OwnersDataContainer />
      </Suspense>
    </div>
  );
}
