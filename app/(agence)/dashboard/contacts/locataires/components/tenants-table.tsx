import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TenantDTO } from "@/lib/types/property";
import { LegalEntityType } from "@/lib/generated/prisma/enums";

interface TenantsTableProps {
  tenants: TenantDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TenantsTable({
  tenants,
  selectedId,
  onSelect,
}: TenantsTableProps): React.JSX.Element {
  return (
    <Table wrapperClassName="max-h-[calc(100vh-250px)] rounded-none">
      <TableHeader>
        <TableRow>
          <TableHead>LOCATAIRE</TableHead>
          <TableHead>CONTACT</TableHead>
          <TableHead>BAUX ACTIFS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="p-lg text-center text-on-surface-variant font-medium"
            >
              Aucun locataire trouvé.
            </TableCell>
          </TableRow>
        ) : (
          tenants.map((tenant) => {
            const isSelected = selectedId === tenant.id;
            const isCompany = tenant.type === LegalEntityType.COMPANY;
            const displayName = isCompany
              ? tenant.companyName || "Entreprise Inconnue"
              : `${tenant.firstName || ""} ${tenant.lastName || ""}`.trim();

            return (
              <TableRow
                key={tenant.id}
                onClick={() => onSelect(tenant.id)}
                className={`cursor-pointer transition-colors relative ${
                  isSelected
                    ? "bg-primary/5 font-medium after:absolute after:inset-y-0 after:left-0 after:w-1 after:bg-primary"
                    : "hover:bg-surface-container-low"
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      fallback={displayName.charAt(0)}
                      size="sm"
                      className="rounded-full bg-primary/10 text-primary"
                    />
                    <div className="flex flex-col">
                      <span className="text-body-md font-bold text-on-surface leading-snug">
                        {displayName}
                      </span>
                      <span className="text-body-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          {isCompany ? "domain" : "person"}
                        </span>
                        {isCompany ? "Personne Morale" : "Personne Physique"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      {tenant.email || "Non renseigné"}
                    </div>
                    <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      {tenant.phone || "Non renseigné"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {tenant.activeLeasesCount > 0 ? (
                    <Badge variant="default" dot>
                      {tenant.activeLeasesCount} Bail(s)
                    </Badge>
                  ) : (
                    <Badge variant="surface">Aucun</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
