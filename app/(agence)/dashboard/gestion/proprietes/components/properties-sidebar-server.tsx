import React from "react";
import { getPropertyById } from "@/lib/dal/properties";
import { getOwners } from "@/lib/dal/owners";
import { PropertiesDetailsPane } from "./properties-details-pane";

interface PropertiesSidebarServerProps {
  selectedId?: string;
  mode?: string;
}

export async function PropertiesSidebarServer({
  selectedId,
  mode,
}: PropertiesSidebarServerProps): Promise<React.JSX.Element> {
  const propertyRes = selectedId ? await getPropertyById(selectedId) : { property: null };
  const ownersRes = await getOwners();

  const selectedProperty = propertyRes.property || null;
  const allOwners = ownersRes.owners || [];
  
  const currentMode = mode === "create" ? "create" : mode === "edit" ? "edit" : "view";

  return (
    <PropertiesDetailsPane
      selectedProperty={selectedProperty}
      allOwners={allOwners}
      mode={currentMode}
    />
  );
}
