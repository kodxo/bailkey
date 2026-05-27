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
import { Button } from "@/components/ui/button";

export interface MockSchedule {
  id: string;
  tenantName: string;
  propertyInfo: string;
  date: string;
  amount: number;
  remaining: number;
  status: "OVERDUE" | "PENDING" | "PARTIAL" | "PAID";
  isLocked: boolean;
  payments?: {
    id: string;
    amount: number;
    date: string;
    method: string;
    reference?: string;
  }[];
}

interface SchedulesTableProps {
  schedules: MockSchedule[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SchedulesTable({
  schedules,
  selectedId,
  onSelect,
}: SchedulesTableProps): React.JSX.Element {
  return (
    <Table wrapperClassName="max-h-[calc(100vh-250px)] rounded-none">
      <TableHeader>
          <TableRow>
            <TableHead>STATUT</TableHead>
            <TableHead>LOCATAIRE / BIEN</TableHead>
            <TableHead>ÉCHÉANCE</TableHead>
            <TableHead className="text-right">MONTANT</TableHead>
            <TableHead className="text-right">RESTANT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((s) => {
            const isSelected = selectedId === s.id;
            return (
              <TableRow
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`cursor-pointer transition-colors relative ${
                  isSelected 
                    ? "bg-primary/5 font-medium after:absolute after:inset-y-0 after:left-0 after:w-1 after:bg-primary" 
                    : "hover:bg-surface-container-low"
                }`}
              >
                <TableCell>
                  {s.status === "OVERDUE" && (
                    <Badge variant="destructive">
                      <span className="material-symbols-outlined text-[14px]" data-icon="error">error</span>
                      En retard
                    </Badge>
                  )}
                  {s.status === "PENDING" && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <span className="material-symbols-outlined text-[14px] mr-1" data-icon="pending">pending</span>
                      À venir
                    </Badge>
                  )}
                  {s.status === "PARTIAL" && (
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                      <span className="material-symbols-outlined text-[14px] mr-1" data-icon="tonality">tonality</span>
                      Partiel
                    </Badge>
                  )}
                  {s.status === "PAID" && (
                    <Badge variant="default">
                      <span className="material-symbols-outlined text-[14px]" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Payé
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-body-md font-bold text-on-surface leading-snug">
                      {s.tenantName}
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                      {s.propertyInfo}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${s.status === "OVERDUE" ? "text-error font-bold" : "text-on-surface-variant"}`}>
                    {s.date}
                  </span>
                </TableCell>
                <TableCell className="text-right text-on-surface-variant">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(s.amount)}
                </TableCell>
                <TableCell className={`text-right font-bold text-h3 ${s.status === "OVERDUE" ? "text-error" : "text-on-surface"}`}>
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(s.remaining)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
    </Table>
  );
}
