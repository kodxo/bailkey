import React from "react";
import { getTenants } from "@/lib/dal/tenants";
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
import { TenantRow } from "./tenant-row";
import { TenantEditButton } from "./tenant-edit-button";

export async function TenantsTableServer({
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
  const res = await getTenants();
  const allTenants = res.tenants || [];

  const filteredTenants = allTenants.filter((t) => {
    const fullName =
      `${t.firstName || ""} ${t.lastName || ""} ${t.companyName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      (t.email && t.email.toLowerCase().includes(search.toLowerCase())) ||
      (t.phone && t.phone.toLowerCase().includes(search.toLowerCase()));
    const matchesType = type === "all" || t.type === type;
    return matchesSearch && matchesType;
  });

  const totalCount = filteredTenants.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentBatch = filteredTenants.slice(startIndex, startIndex + pageSize);

  return (
    <div className="relative flex flex-col transition-all">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>LOCATAIRE</TableHead>
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
                Aucun locataire trouvé.
              </TableCell>
            </TableRow>
          ) : (
            currentBatch.map((ten) => {
              const isSelected = selectedId === ten.id;
              const displayName =
                ten.type === "COMPANY"
                  ? ten.companyName || "Société"
                  : `${ten.firstName || ""} ${ten.lastName || ""}`.trim() ||
                    "Anonyme";
              const initial = displayName.charAt(0).toUpperCase() || "T";

              return (
                <TenantRow key={ten.id} tenantId={ten.id} isSelected={isSelected}>
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
                          {ten.email || "Aucun email"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-md text-on-surface-variant">
                      {ten.phone || "Non renseigné"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {ten.type === "COMPANY" ? (
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
                    <TenantEditButton tenantId={ten.id} />
                  </TableCell>
                </TenantRow>
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
