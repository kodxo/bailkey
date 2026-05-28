import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { PropertyDTO } from "@/lib/types/property";

interface PropertiesTableProps {
  properties: PropertyDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PropertiesTable({
  properties,
  selectedId,
  onSelect,
}: PropertiesTableProps): React.JSX.Element {
  return (
    <Table wrapperClassName="max-h-[calc(100vh-250px)] rounded-none">
      <TableHeader>
        <TableRow>
          <TableHead>PROPRIÉTÉ</TableHead>
          <TableHead>LOCALISATION</TableHead>
          <TableHead>LOYER</TableHead>
          <TableHead>STATUT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="p-lg text-center text-on-surface-variant font-medium"
            >
              Aucune propriété trouvée.
            </TableCell>
          </TableRow>
        ) : (
          properties.map((prop) => {
            const isSelected = selectedId === prop.id;
            const coverImg =
              prop.images.find((i) => i.isCover)?.url || prop.images[0]?.url;

            return (
              <TableRow
                key={prop.id}
                onClick={() => onSelect(prop.id)}
                className={`cursor-pointer transition-colors relative ${
                  isSelected
                    ? "bg-primary/5 font-medium after:absolute after:inset-y-0 after:left-0 after:w-1 after:bg-primary"
                    : "hover:bg-surface-container-low"
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={coverImg || ""}
                      alt={prop.designation}
                      fallback={prop.designation.charAt(0)}
                      size="md"
                      className="rounded-lg object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-body-md font-bold text-on-surface leading-snug">
                        {prop.designation}
                      </span>
                      <span className="text-body-sm font-mono text-primary">
                        {prop.reference}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-body-md text-on-surface-variant">
                    {prop.city}{" "}
                    {prop.neighborhood ? `- ${prop.neighborhood}` : ""}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-body-md font-semibold text-on-surface">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: prop.currency || "EUR",
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
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
