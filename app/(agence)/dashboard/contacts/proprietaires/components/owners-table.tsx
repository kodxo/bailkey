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
import type { OwnerDTO } from "@/lib/types/property";
import { LegalEntityType } from "@/lib/generated/prisma/enums";

interface OwnersTableProps {
  owners: OwnerDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function OwnersTable({
  owners,
  selectedId,
  onSelect,
}: OwnersTableProps): React.JSX.Element {
  return (
    <Table wrapperClassName="max-h-[calc(100vh-250px)] rounded-none">
      <TableHeader>
        <TableRow>
          <TableHead>PROPRIÉTAIRE</TableHead>
          <TableHead>CONTACT</TableHead>
          <TableHead>PROPRIÉTÉS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {owners.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="p-lg text-center text-on-surface-variant font-medium"
            >
              Aucun propriétaire trouvé.
            </TableCell>
          </TableRow>
        ) : (
          owners.map((owner) => {
            const isSelected = selectedId === owner.id;
            const isCompany = owner.type === LegalEntityType.COMPANY;
            const displayName = isCompany
              ? owner.companyName || "Entreprise Inconnue"
              : `${owner.firstName || ""} ${owner.lastName || ""}`.trim();

            return (
              <TableRow
                key={owner.id}
                onClick={() => onSelect(owner.id)}
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
                      {owner.email || "Non renseigné"}
                    </div>
                    <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      {owner.phone || "Non renseigné"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {owner.propertiesCount > 0 ? (
                    <Badge variant="default" dot>
                      {owner.propertiesCount} Bien(s)
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
