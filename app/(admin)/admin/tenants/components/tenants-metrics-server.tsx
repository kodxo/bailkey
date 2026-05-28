import React from "react";
import { getTenants } from "@/lib/dal/tenants";
import { MetricCard } from "@/components/ui/metric-card";

export async function TenantsMetricsServer({
  search,
  type,
}: {
  search: string;
  type: string;
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

  const individualCount = filteredTenants.filter((t) => t.type === "INDIVIDUAL").length;
  const companyCount = filteredTenants.filter((t) => t.type === "COMPANY").length;

  return (
    <section className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
      <MetricCard value={filteredTenants.length} label="Total Locataires (filtrés)" />
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
