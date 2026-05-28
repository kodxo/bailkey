import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const SKELETON_ROWS = 10;

export function SchedulesTableSkeleton(): React.JSX.Element {
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
        {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
          <TableRow key={i} className="animate-pulse">
            <TableCell>
              <div className="h-6 w-20 bg-outline-variant/20 rounded-full" />
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-28 bg-outline-variant/20 rounded" />
                <div className="h-3 w-24 bg-outline-variant/15 rounded" />
              </div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-24 bg-outline-variant/20 rounded" />
            </TableCell>
            <TableCell className="text-right">
              <div className="h-4 w-16 bg-outline-variant/20 rounded ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <div className="h-5 w-20 bg-outline-variant/20 rounded ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
