import React from "react";
import { getLeaseChargesPaginated } from "@/lib/dal/lease-charges";
import { getChargeTypes } from "@/lib/dal/charges";
import { getProperties } from "@/lib/dal/properties";
import { getTenants } from "@/lib/dal/tenants";
import { getLeases } from "@/lib/dal/leases";
import { LeaseChargesTableClient } from "./lease-charges-table-client";
import { LegalEntityType } from "@/lib/generated/prisma/enums";

interface LeaseChargesTableServerProps {
  page: number;
  pageSize: number;
  search?: string;
  propertyId?: string;
  tenantId?: string;
  chargeTypeId?: string;
}

export async function LeaseChargesTableServer({
  page,
  pageSize,
  search,
  propertyId,
  tenantId,
  chargeTypeId,
}: LeaseChargesTableServerProps) {
  const [
    leaseChargesRes,
    chargeTypesRes,
    propertiesRes,
    tenantsRes,
    leasesRes
  ] = await Promise.all([
    getLeaseChargesPaginated({ page, pageSize, search, propertyId, tenantId, chargeTypeId }),
    getChargeTypes(),
    getProperties(),
    getTenants(),
    getLeases({ page: 1, pageSize: 1000 }), // We need all active leases for the modal dropdown
  ]);

  const leaseCharges = leaseChargesRes.data || [];
  const totalCount = leaseChargesRes.total || 0;
  
  const chargeTypes = (chargeTypesRes.data || []).map(ct => ({ id: ct.id, name: ct.name }));
  const properties = (propertiesRes.properties || []).map(p => ({ id: p.id, name: p.designation }));
  const tenants = (tenantsRes.tenants || []).map(t => {
    const name = t.type === LegalEntityType.COMPANY ? t.companyName : `${t.firstName || ""} ${t.lastName || ""}`.trim();
    return { id: t.id, name: name || "Anonyme" };
  });

  const leases = (leasesRes.leases || []).map(l => ({
    id: l.id,
    propertyDesignation: l.propertyDesignation,
    tenantFullName: l.tenantFullName,
  }));

  return (
    <LeaseChargesTableClient
      leaseCharges={leaseCharges}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      chargeTypes={chargeTypes}
      properties={properties}
      tenants={tenants}
      leases={leases}
    />
  );
}
