import React from "react";
import { getOwners } from "@/lib/dal/owners";
import { MetricCard } from "@/components/ui/metric-card";

export async function OwnersMetricsServer({
  search,
  type,
}: {
  search: string;
  type: string;
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

  const individualCount = filteredOwners.filter((o) => o.type === "INDIVIDUAL").length;
  const companyCount = filteredOwners.filter((o) => o.type === "COMPANY").length;

  return (
    <section className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
      <MetricCard value={filteredOwners.length} label="Total Propriétaires (filtrés)" />
      <MetricCard
        value={individualCount}
        label="Particuliers"
        valueClassName="text-primary font-bold"
      />
      <MetricCard
        value={companyCount}
        label="Sociétés"
        valueClassName="text-tertiary font-bold"
      />
    </section>
  );
}
