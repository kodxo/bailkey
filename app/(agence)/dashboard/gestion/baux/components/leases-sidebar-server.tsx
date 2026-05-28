import React from "react";
import { getLeaseById } from "@/lib/dal/leases";
import { getProperties } from "@/lib/dal/properties";
import { PropertyStatus } from "@/lib/generated/prisma/enums";
import { getTenants } from "@/lib/dal/tenants";
import { LeaseDetailView } from "./lease-detail-view";
import { LeaseFormClient } from "./lease-form-client";

interface LeasesSidebarServerProps {
  selectedLeaseId?: string;
  mode?: string;
}

export async function LeasesSidebarServer({
  selectedLeaseId,
  mode,
}: LeasesSidebarServerProps): Promise<React.JSX.Element> {
  // Mode create or edit: fetch properties + tenants
  if (mode === "create" || mode === "edit") {
    const selectedLeaseRes = selectedLeaseId
      ? await getLeaseById(selectedLeaseId)
      : { lease: null };

    const [propsRes, tenantsRes] = await Promise.all([
      getProperties({
        status: PropertyStatus.AVAILABLE,
        includeIds: selectedLeaseRes.lease?.propertyId
          ? [selectedLeaseRes.lease.propertyId]
          : undefined,
      }),
      getTenants(),
    ]);

    const properties = propsRes.success && propsRes.properties ? propsRes.properties : [];
    const tenants = tenantsRes.success && tenantsRes.tenants ? tenantsRes.tenants : [];

    return (
      <LeaseFormClient
        mode={mode as "create" | "edit"}
        lease={selectedLeaseRes.lease ?? undefined}
        properties={properties}
        tenants={tenants}
      />
    );
  }

  // Mode view: fetch selected lease details
  if (selectedLeaseId) {
    const { lease } = await getLeaseById(selectedLeaseId);
    if (lease) {
      return <LeaseDetailView lease={lease} />;
    }
  }

  // Empty state
  return (
    <div className="py-xl flex flex-col items-center text-on-surface-variant text-center">
      <span
        className="material-symbols-outlined text-4xl mb-sm opacity-60"
        data-icon="history_edu"
      >
        history_edu
      </span>
      <p className="text-body-md">
        Sélectionnez un contrat de location pour afficher ses détails ou créez-en
        un nouveau.
      </p>
    </div>
  );
}
