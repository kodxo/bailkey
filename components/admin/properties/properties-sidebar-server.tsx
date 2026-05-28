import React from "react";
import { getPropertyById } from "@/lib/dal/properties";
import { getOwners } from "@/lib/dal/owners";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyFormClient } from "./property-form-client";
import { PropertyEditButton } from "./property-edit-button";

export async function PropertiesSidebarServer({
  selectedId,
  edit,
}: {
  selectedId?: string;
  edit?: string;
}) {
  const ownersRes = await getOwners();
  const initialOwners = ownersRes.owners || [];

  if (edit === "true" && !selectedId) {
    return <PropertyFormClient initialOwners={initialOwners} />;
  }

  if (!selectedId) {
    return (
      <Card className="border-outline-variant/60 shadow-md">
        <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
          <CardTitle className="text-h3 font-display">Fiche Propriété</CardTitle>
        </CardHeader>
        <CardContent className="pt-xl pb-xl flex flex-col items-center text-on-surface-variant text-center">
          <span
            className="material-symbols-outlined text-4xl mb-sm opacity-60"
            data-icon="apartment"
          >
            apartment
          </span>
          <p className="text-body-md">
            Sélectionnez une propriété pour afficher ses informations ou ajoutez-en une nouvelle.
          </p>
        </CardContent>
      </Card>
    );
  }

  const res = await getPropertyById(selectedId);
  const selectedProperty = res.property;

  if (!selectedProperty) {
    return (
      <Card className="border-outline-variant/60 shadow-md">
        <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
          <CardTitle className="text-h3 font-display">Fiche Propriété</CardTitle>
        </CardHeader>
        <CardContent className="pt-xl pb-xl flex flex-col items-center text-on-surface-variant text-center">
          <span className="material-symbols-outlined text-4xl mb-sm text-error">
            error
          </span>
          <p className="text-body-md">Propriété introuvable.</p>
        </CardContent>
      </Card>
    );
  }

  if (edit === "true") {
    return <PropertyFormClient property={selectedProperty} initialOwners={initialOwners} />;
  }

  return (
    <Card className="border-outline-variant/60 shadow-md">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">Fiche Propriété</CardTitle>
      </CardHeader>
      <CardContent className="pt-md">
        <div className="flex flex-col gap-md">
          <div className="border-b border-outline-variant/40 pb-sm">
            <span className="text-body-sm font-mono text-primary font-bold">
              {selectedProperty.reference}
            </span>
            <h4 className="text-h2 font-bold text-on-surface mb-xs mt-1">
              {selectedProperty.designation}
            </h4>
            <p className="text-body-sm text-on-surface-variant">
              {selectedProperty.address}, {selectedProperty.city}
            </p>
          </div>

          <div className="flex flex-col gap-sm text-left">
            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Loyer de base
              </span>
              <span className="text-body-md text-on-surface font-bold">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: selectedProperty.currency,
                  maximumFractionDigits: 0,
                }).format(selectedProperty.baseRent)}
              </span>
            </div>

            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Statut
              </span>
              <span>
                {selectedProperty.status === "AVAILABLE" && (
                  <Badge variant="default">Disponible</Badge>
                )}
                {selectedProperty.status === "RENTED" && (
                  <Badge variant="destructive">Loué</Badge>
                )}
                {selectedProperty.status === "UNDER_MAINTENANCE" && (
                  <Badge variant="surface">En travaux</Badge>
                )}
                {selectedProperty.status === "UNAVAILABLE" && (
                  <Badge variant="surface">Indisponible</Badge>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Type de bien
              </span>
              <span className="text-body-sm text-on-surface font-semibold">
                {selectedProperty.propertyType}
              </span>
            </div>

            <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant">
                Surface / Pièces
              </span>
              <span className="text-body-sm text-on-surface font-semibold">
                {selectedProperty.area ? `${selectedProperty.area} m²` : "N/D"} /{" "}
                {selectedProperty.roomsCount || "N/D"}
              </span>
            </div>

            <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-label-caps uppercase text-on-surface-variant block mb-1">
                Propriétaires (Indivision)
              </span>
              {selectedProperty.owners && selectedProperty.owners.length > 0 ? (
                selectedProperty.owners.map((o) => (
                  <div key={o.id} className="flex justify-between text-body-sm">
                    <span className="font-semibold">{o.fullName}</span>
                    <span className="text-on-surface-variant">{o.share}%</span>
                  </div>
                ))
              ) : (
                <span className="text-body-sm text-on-surface-variant">
                  Aucun propriétaire rattaché
                </span>
              )}
            </div>
          </div>

          <PropertyEditButton propertyId={selectedProperty.id} />
        </div>
      </CardContent>
    </Card>
  );
}
