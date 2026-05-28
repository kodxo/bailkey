import React from "react";
import { getOwners } from "@/lib/dal/owners";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ServerTablePagination } from "@/components/ui/server-pagination";
import { OwnerRow } from "./owner-row";
import { OwnerEditButton } from "./owner-edit-button";

export async function OwnersTableServer({
  page,
  pageSize,
  search,
  type,
  selectedId,
}: {
  page: number;
  pageSize: number;
  search: string;
  type: string;
  selectedId?: string;
}) {
  const res = await getOwners();
  const allOwners = res.owners || [];

  const filteredOwners = allOwners.filter((o) => {
    const fullName =
      `${o.firstName || ""} ${o.lastName || ""} ${o.companyName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(search.toLowerCase())) ||
      (o.phone && o.phone.toLowerCase().includes(search.toLowerCase()));
    const matchesType = type === "all" || o.type === type;
    return matchesSearch && matchesType;
  });

  const totalCount = filteredOwners.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentBatch = filteredOwners.slice(startIndex, startIndex + pageSize);

  return (
    <div className="relative flex flex-col transition-all">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PROPRIÉTAIRE</TableHead>
            <TableHead>CONTACT</TableHead>
            <TableHead>TYPE</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBatch.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="p-lg text-center text-on-surface-variant font-medium"
              >
                Aucun propriétaire trouvé.
              </TableCell>
            </TableRow>
          ) : (
            currentBatch.map((own) => {
              const isSelected = selectedId === own.id;
              const displayName =
                own.type === "COMPANY"
                  ? own.companyName || "Société"
                  : `${own.firstName || ""} ${own.lastName || ""}`.trim() ||
                    "Anonyme";
              const initial = displayName.charAt(0).toUpperCase() || "P";

              return (
                <OwnerRow key={own.id} ownerId={own.id} isSelected={isSelected}>
                  <TableCell>
                    <div className="flex items-center gap-sm">
                      <Avatar
                        src=""
                        alt={displayName}
                        fallback={initial}
                        size="md"
                      />
                      <div className="flex flex-col">
                        <span className="text-body-md font-bold text-on-surface leading-snug">
                          {displayName}
                        </span>
                        <span className="text-body-sm text-on-surface-variant truncate max-w-[200px]">
                          {own.email || "Aucun email"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-md text-on-surface-variant">
                      {own.phone || "Non renseigné"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {own.type === "COMPANY" ? (
                      <Badge variant="default" dot>
                        Société
                      </Badge>
                    ) : (
                      <Badge variant="surface" dot>
                        Particulier
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <OwnerEditButton ownerId={own.id} />
                  </TableCell>
                </OwnerRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <ServerTablePagination
        total={totalCount}
        currentPage={page}
        pageSize={pageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
