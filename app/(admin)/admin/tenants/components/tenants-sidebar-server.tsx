import React from "react";
import { getTenantById } from "@/lib/dal/tenants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TenantFormClient } from "./tenant-form-client";
import { TenantEditButton } from "./tenant-edit-button";

export async function TenantsSidebarServer({
  selectedId,
  edit,
}: {
  selectedId?: string;
  edit?: string;
}) {
  if (edit === "true" && !selectedId) {
    return <TenantFormClient />;
  }

  if (!selectedId) {
    return (
      <Card className="border-outline-variant/60 shadow-md">
        <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
          <CardTitle className="text-h3 font-display">Fiche Locataire</CardTitle>
        </CardHeader>
        <CardContent className="pt-xl pb-xl flex flex-col items-center text-on-surface-variant text-center">
          <span
            className="material-symbols-outlined text-4xl mb-sm opacity-60"
            data-icon="real_estate_agent"
          >
            real_estate_agent
          </span>
          <p className="text-body-md">
            Sélectionnez un locataire pour afficher ses informations ou ajoutez-en un nouveau.
          </p>
        </CardContent>
      </Card>
    );
  }

  const res = await getTenantById(selectedId);
  const selectedTenant = res.tenant;

  if (!selectedTenant) {
    return (
      <Card className="border-outline-variant/60 shadow-md">
        <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
          <CardTitle className="text-h3 font-display">Fiche Locataire</CardTitle>
        </CardHeader>
        <CardContent className="pt-xl pb-xl flex flex-col items-center text-on-surface-variant text-center">
          <span className="material-symbols-outlined text-4xl mb-sm text-error">
            error
          </span>
          <p className="text-body-md">Locataire introuvable.</p>
        </CardContent>
      </Card>
    );
  }

  if (edit === "true") {
    return <TenantFormClient tenant={selectedTenant} />;
  }

  return (
    <Card className="border-outline-variant/60 shadow-md">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">Fiche Locataire</CardTitle>
      </CardHeader>
      <CardContent className="pt-md">
        <div className="flex flex-col items-center text-center">
          <Avatar
            src=""
            alt={selectedTenant.firstName || selectedTenant.companyName || "T"}
            fallback={
              (selectedTenant.type === "COMPANY"
                ? selectedTenant.companyName?.charAt(0)
                : selectedTenant.firstName?.charAt(0)) || "T"
            }
            size="lg"
            className="mb-sm shadow-sm border-2 border-primary/20"
          />
          <h4 className="text-h2 font-bold text-on-surface mb-xs">
            {selectedTenant.type === "COMPANY"
              ? selectedTenant.companyName
              : `${selectedTenant.firstName || ""} ${selectedTenant.lastName || ""}`}
          </h4>
          <p className="text-body-md text-on-surface-variant mb-md font-mono bg-surface-container px-2 py-1 rounded break-all max-w-full">
            {selectedTenant.email || "Aucun email renseigné"}
          </p>

          <div className="w-full border-t border-outline-variant/40 pt-md flex flex-col gap-sm text-left">
            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Type
              </span>
              {selectedTenant.type === "COMPANY" ? (
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
                {selectedTenant.phone || "N/D"}
              </span>
            </div>

            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Adresse
              </span>
              <span className="text-body-sm font-semibold truncate max-w-[180px]">
                {selectedTenant.address || "N/D"}
              </span>
            </div>

            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Baux en cours
              </span>
              <span className="text-body-sm font-bold text-primary">
                {selectedTenant.activeLeasesCount}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-md">
          <TenantEditButton tenantId={selectedTenant.id} />
        </div>
      </CardContent>
    </Card>
  );
}
