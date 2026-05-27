import React from "react";
import { getOwners } from "@/lib/dal/owners";
import { OwnersDashboard } from "./owners-dashboard";

export async function OwnersDataContainer(): Promise<React.JSX.Element> {
  const res = await getOwners();
  const initialOwners = res.success && res.owners ? res.owners : [];

  return <OwnersDashboard initialOwners={initialOwners} />;
}
