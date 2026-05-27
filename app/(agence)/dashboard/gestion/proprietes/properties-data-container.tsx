import React from "react";
import { getProperties } from "@/lib/dal/properties";
import { getOwners } from "@/lib/dal/owners";
import { PropertiesDashboard } from "./properties-dashboard";

export async function PropertiesDataContainer(): Promise<React.JSX.Element> {
  const [propertiesRes, ownersRes] = await Promise.all([
    getProperties(),
    getOwners(),
  ]);

  const initialProperties = propertiesRes.success && propertiesRes.properties ? propertiesRes.properties : [];
  const initialOwners = ownersRes.success && ownersRes.owners ? ownersRes.owners : [];

  return (
    <PropertiesDashboard
      initialProperties={initialProperties}
      initialOwners={initialOwners}
    />
  );
}
