import React from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { getAdminTenants } from "@/lib/dal/tenants";
import { TenantsDashboard } from "./tenants-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardTenantsPage(): Promise<React.JSX.Element> {
  const res = await getAdminTenants();
  const initialTenants = res.success ? res.tenants : [];

  return (
    <div className="p-md w-full max-w-[1400px] mx-auto flex flex-col gap-lg">
      <section className="border-b border-outline-variant pb-md flex flex-col gap-sm">
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Répertoire Contacts", href: "/dashboard/contacts" },
            { label: "Locataires" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Gestion des Locataires
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez vos locataires, suivez leurs coordonnées, leurs cautions et
            leur historique de location.
          </p>
        </div>
      </section>

      <TenantsDashboard initialTenants={initialTenants} />
    </div>
  );
}
