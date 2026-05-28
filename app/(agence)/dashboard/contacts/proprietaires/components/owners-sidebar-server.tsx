import React from "react";
import { getOwnerById } from "@/lib/dal/owners";
import { OwnersDetailsPane } from "./owners-details-pane";

interface OwnersSidebarServerProps {
  selectedId?: string;
  mode?: string;
}

export async function OwnersSidebarServer({
  selectedId,
  mode,
}: OwnersSidebarServerProps): Promise<React.JSX.Element> {
  const propertyRes = selectedId 
    ? await getOwnerById(selectedId) 
    : { owner: null };

  const selectedOwner = propertyRes.owner || null;
  const currentMode = mode === "create" ? "create" : mode === "edit" ? "edit" : "view";

  return (
    <OwnersDetailsPane
      selectedOwner={selectedOwner}
      mode={currentMode}
    />
  );
}
