import React from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { getLeases } from "@/lib/dal/leases";
import { getProperties } from "@/lib/dal/properties";
import { getTenants } from "@/lib/dal/tenants";
import { LeasesDashboard } from "./leases-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardLeasesPage(): Promise<React.JSX.Element> {
  const [leasesRes, propsRes, tenantsRes] = await Promise.all([
    getLeases(),
    getProperties(),
    getTenants(),
  ]);

  const initialLeases = leasesRes.success ? leasesRes.leases : [];
  const initialProperties = propsRes.success ? propsRes.properties : [];
  const initialTenants = tenantsRes.success ? tenantsRes.tenants : [];

  return (
    <div className="p-md w-full max-w-[1400px] mx-auto flex flex-col gap-lg">
      <section className="border-b border-outline-variant pb-md flex flex-col gap-sm">
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Gestion Immobilière", href: "/dashboard/gestion" },
            { label: "Baux & Contrats" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Contrats de Location (Baux)
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez vos contrats de location, le montant des cautions et les dates d&apos;échéance.
          </p>
        </div>
      </section>

      <LeasesDashboard
        initialLeases={initialLeases}
        initialProperties={initialProperties}
        initialTenants={initialTenants}
      />
    </div>
  );
}
