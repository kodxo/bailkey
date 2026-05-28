import React from "react";
import { getTenantById } from "@/lib/dal/tenants";
import { TenantsDetailsPane } from "./tenants-details-pane";

interface TenantsSidebarServerProps {
  selectedId?: string;
  mode?: string;
}

export async function TenantsSidebarServer({
  selectedId,
  mode,
}: TenantsSidebarServerProps): Promise<React.JSX.Element> {
  const propertyRes = selectedId 
    ? await getTenantById(selectedId) 
    : { tenant: null };

  const selectedTenant = propertyRes.tenant || null;
  const currentMode = mode === "create" ? "create" : mode === "edit" ? "edit" : "view";

  return (
    <TenantsDetailsPane
      selectedTenant={selectedTenant}
      mode={currentMode}
    />
  );
}
