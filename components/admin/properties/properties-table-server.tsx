import React from "react";
import { getProperties } from "@/lib/dal/properties";
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
import { PropertyRow } from "./property-row";
import { PropertyEditButton } from "./property-edit-button";

export async function PropertiesTableServer({
  page,
  pageSize,
  search,
  status,
  type,
  selectedId,
}: {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  type: string;
  selectedId?: string;
}) {
  const res = await getProperties();
  const allProperties = res.properties || [];

  const filteredProperties = allProperties.filter((p) => {
    const matchesSearch =
      p.designation.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || p.status === status;
    const matchesType = type === "all" || p.propertyType === type;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCount = filteredProperties.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentBatch = filteredProperties.slice(startIndex, startIndex + pageSize);

  return (
    <div className="relative flex flex-col transition-all">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PROPRIÉTÉ</TableHead>
            <TableHead>LOCALISATION</TableHead>
            <TableHead>LOYER</TableHead>
            <TableHead>STATUT</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBatch.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="p-lg text-center text-on-surface-variant font-medium"
              >
                Aucune propriété trouvée.
              </TableCell>
            </TableRow>
          ) : (
            currentBatch.map((prop) => {
              const isSelected = selectedId === prop.id;
              return (
                <PropertyRow key={prop.id} propertyId={prop.id} isSelected={isSelected}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-body-md font-bold text-on-surface leading-snug">
                        {prop.designation}
                      </span>
                      <span className="text-body-sm font-mono text-primary select-all">
                        {prop.reference}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-md text-on-surface-variant">
                      {prop.city} {prop.neighborhood ? `- ${prop.neighborhood}` : ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-md font-semibold text-on-surface">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: prop.currency,
                        maximumFractionDigits: 0,
                      }).format(prop.baseRent)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {prop.status === "AVAILABLE" && (
                      <Badge variant="default" dot>
                        Disponible
                      </Badge>
                    )}
                    {prop.status === "RENTED" && (
                      <Badge variant="destructive" dot>
                        Loué
                      </Badge>
                    )}
                    {prop.status === "UNDER_MAINTENANCE" && (
                      <Badge variant="surface" dot>
                        En travaux
                      </Badge>
                    )}
                    {prop.status === "UNAVAILABLE" && (
                      <Badge variant="surface">Indisponible</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <PropertyEditButton propertyId={prop.id} />
                  </TableCell>
                </PropertyRow>
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
