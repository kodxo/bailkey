"use client";

import React, { useState } from "react";
import type { LeaseDTO } from "@/lib/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LeaseSchedulesList } from "@/components/schedules/lease-schedules-list";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RelationalLink } from "@/components/ui/relational-link";
import { LeaseStatus } from "@/lib/generated/prisma/enums";

interface LeaseDetailViewProps {
  lease: LeaseDTO;
}

export function LeaseDetailView({ lease }: LeaseDetailViewProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"details" | "schedules">("details");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleStartEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedLeaseId", lease.id);
    params.set("mode", "edit");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Card className="border-outline-variant/60 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">
          Détails du Contrat
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-md max-h-[calc(100vh-220px)] overflow-y-auto">
        <div className="flex flex-col gap-md">
          {lease.status === "DRAFT" && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-orange-800 text-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined">warning</span>
                Bail en brouillon
              </div>
              <p>Aucune échéance ne sera générée tant que le bail est en brouillon. Passez le statut à "Actif" pour déclencher la facturation.</p>
            </div>
          )}

          <div className="flex border-b border-outline-variant/40 mb-2">
            <button
              className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Détails
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "schedules"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
              onClick={() => setActiveTab("schedules")}
            >
              Échéancier
            </button>
          </div>

          {activeTab === "details" ? (
            <>
              <div className="border-b border-outline-variant/40 pb-sm">
                <div className="flex items-center gap-2">
                  <span className="text-body-sm font-mono text-primary font-bold">
                    {lease.propertyReference}
                  </span>
                  <RelationalLink entityType="property" entityId={lease.propertyId} />
                </div>
                <h4 className="text-h2 font-bold text-on-surface mb-xs mt-1">
                  {lease.propertyDesignation}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-body-sm text-on-surface-variant font-medium bg-surface-container px-2.5 py-1 rounded-lg inline-block">
                    Locataire : {lease.tenantFullName}
                  </p>
                  <RelationalLink entityType="tenant" entityId={lease.tenantId} />
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left">
                <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                  <span className="text-label-caps uppercase text-on-surface-variant">Loyer Mensuel</span>
                  <span className="text-body-md text-on-surface font-bold font-mono">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XAF",
                      maximumFractionDigits: 0,
                    }).format(lease.rentAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                  <span className="text-label-caps uppercase text-on-surface-variant">Caution versée</span>
                  <span className="text-body-md text-primary font-bold font-mono">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XAF",
                      maximumFractionDigits: 0,
                    }).format(lease.depositAmount || 0)}
                  </span>
                </div>

                {lease.charges && lease.charges.length > 0 && (
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
                    <span className="text-label-caps uppercase text-on-surface-variant mb-2 block">Charges Additionnelles</span>
                    <div className="space-y-2">
                      {lease.charges.map((charge: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary" data-icon={charge.accountingMode === 'CREDIT' ? 'add_circle' : 'remove_circle'}>
                              {charge.accountingMode === 'CREDIT' ? 'add_circle' : 'remove_circle'}
                            </span>
                            {charge.name}
                          </span>
                          <span className="font-mono font-medium">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "XAF",
                              maximumFractionDigits: 0,
                            }).format(charge.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                  <span className="text-label-caps uppercase text-on-surface-variant">Statut</span>
                  <span>
                    {lease.status === LeaseStatus.ACTIVE && <Badge variant="default">Actif</Badge>}
                    {lease.status === LeaseStatus.DRAFT && <Badge variant="surface">Brouillon</Badge>}
                    {lease.status === LeaseStatus.TERMINATED && <Badge variant="destructive">Résilié</Badge>}
                    {lease.status === LeaseStatus.EXPIRED && <Badge variant="surface">Expiré</Badge>}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                  <span className="text-label-caps uppercase text-on-surface-variant">Période</span>
                  <span className="text-body-sm font-semibold">
                    {new Date(lease.startDate).toLocaleDateString("fr-FR")} →{" "}
                    {lease.endDate ? new Date(lease.endDate).toLocaleDateString("fr-FR") : "Indéterminée"}
                  </span>
                </div>
              </div>

              <Button onClick={handleStartEdit} className="w-full mt-sm">
                <span className="material-symbols-outlined text-sm mr-2 select-none" data-icon="edit">edit</span>
                Modifier le contrat
              </Button>
            </>
          ) : (
            <LeaseSchedulesList leaseId={lease.id} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
