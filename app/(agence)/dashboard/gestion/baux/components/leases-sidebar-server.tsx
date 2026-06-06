import React from "react";
import { getLeaseById } from "@/lib/dal/leases";
import { getProperties } from "@/lib/dal/properties";
import { PropertyStatus } from "@/lib/generated/prisma/enums";
import { getTenants } from "@/lib/dal/tenants";
import { LeaseDetailView } from "./lease-detail-view";
import { LeaseFormClient } from "./lease-form-client";

import { getChargeTypes } from "@/lib/dal/charges";

interface LeasesSidebarServerProps {
  selectedLeaseId?: string;
  mode?: string;
}

export async function LeasesSidebarServer({
  selectedLeaseId,
  mode,
}: LeasesSidebarServerProps): Promise<React.JSX.Element> {
  // Mode create or edit: fetch properties + tenants + charges
  if (mode === "create" || mode === "edit") {
    const selectedLeaseRes = selectedLeaseId
      ? await getLeaseById(selectedLeaseId)
      : { lease: null };

    const propsRes = await getProperties({
      status: PropertyStatus.AVAILABLE,
      includeIds: selectedLeaseRes.lease?.propertyId
        ? [selectedLeaseRes.lease.propertyId]
        : undefined,
    });
    
    const tenantsRes = await getTenants();
    const chargeTypesRes = await getChargeTypes();

    const properties = propsRes.success && propsRes.properties ? propsRes.properties : [];
    const tenants = tenantsRes.success && tenantsRes.tenants ? tenantsRes.tenants : [];
    const chargeTypes = chargeTypesRes.success && chargeTypesRes.data ? chargeTypesRes.data : [];

    return (
      <LeaseFormClient
        mode={mode as "create" | "edit"}
        lease={selectedLeaseRes.lease ?? undefined}
        properties={properties}
        tenants={tenants}
        chargeTypes={chargeTypes}
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
