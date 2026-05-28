import React from "react";
import { getOwnerById } from "@/lib/dal/owners";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { OwnerFormClient } from "./owner-form-client";
import { OwnerEditButton } from "./owner-edit-button";

export async function OwnersSidebarServer({
  selectedId,
  edit,
}: {
  selectedId?: string;
  edit?: string;
}) {
  if (edit === "true" && !selectedId) {
    return <OwnerFormClient />;
  }

  if (!selectedId) {
    return (
      <Card className="border-outline-variant/60 shadow-md">
        <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
          <CardTitle className="text-h3 font-display">Fiche Propriétaire</CardTitle>
        </CardHeader>
        <CardContent className="pt-xl pb-xl flex flex-col items-center text-on-surface-variant text-center">
          <span
            className="material-symbols-outlined text-4xl mb-sm opacity-60"
            data-icon="person_4"
          >
            person_4
          </span>
          <p className="text-body-md">
            Sélectionnez un propriétaire pour afficher ses informations ou ajoutez-en un nouveau.
          </p>
        </CardContent>
      </Card>
    );
  }

  const res = await getOwnerById(selectedId);
  const selectedOwner = res.owner;

  if (!selectedOwner) {
    return (
      <Card className="border-outline-variant/60 shadow-md">
        <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
          <CardTitle className="text-h3 font-display">Fiche Propriétaire</CardTitle>
        </CardHeader>
        <CardContent className="pt-xl pb-xl flex flex-col items-center text-on-surface-variant text-center">
          <span className="material-symbols-outlined text-4xl mb-sm text-error">
            error
          </span>
          <p className="text-body-md">Propriétaire introuvable.</p>
        </CardContent>
      </Card>
    );
  }

  if (edit === "true") {
    return <OwnerFormClient owner={selectedOwner} />;
  }

  return (
    <Card className="border-outline-variant/60 shadow-md">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">Fiche Propriétaire</CardTitle>
      </CardHeader>
      <CardContent className="pt-md">
        <div className="flex flex-col items-center text-center">
          <Avatar
            src=""
            alt={selectedOwner.firstName || selectedOwner.companyName || "O"}
            fallback={
              (selectedOwner.type === "COMPANY"
                ? selectedOwner.companyName?.charAt(0)
                : selectedOwner.firstName?.charAt(0)) || "P"
            }
            size="lg"
            className="mb-sm shadow-sm border-2 border-primary/20"
          />
          <h4 className="text-h2 font-bold text-on-surface mb-xs">
            {selectedOwner.type === "COMPANY"
              ? selectedOwner.companyName
              : `${selectedOwner.firstName || ""} ${selectedOwner.lastName || ""}`}
          </h4>
          <p className="text-body-md text-on-surface-variant mb-md font-mono bg-surface-container px-2 py-1 rounded break-all max-w-full">
            {selectedOwner.email || "Aucun email renseigné"}
          </p>

          <div className="w-full border-t border-outline-variant/40 pt-md flex flex-col gap-sm text-left">
            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Type
              </span>
              {selectedOwner.type === "COMPANY" ? (
                <Badge variant="default">Société</Badge>
              ) : (
                <Badge variant="surface">Particulier</Badge>
              )}
            </div>

            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Téléphone
              </span>
              <span className="text-body-sm font-semibold">
                {selectedOwner.phone || "N/D"}
              </span>
            </div>

            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Adresse
              </span>
              <span className="text-body-sm font-semibold truncate max-w-[180px]">
                {selectedOwner.address || "N/D"}
              </span>
            </div>

            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Biens rattachés
              </span>
              <span className="text-body-sm font-bold text-primary">
                {selectedOwner.propertiesCount}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
