import React from "react";
import { getProperties } from "@/lib/dal/properties";
import { MetricCard } from "@/components/ui/metric-card";

export async function PropertiesMetricsServer({
  search,
  status,
  type,
}: {
  search: string;
  status: string;
  type: string;
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

  const availableCount = filteredProperties.filter((p) => p.status === "AVAILABLE").length;
  const rentedCount = filteredProperties.filter((p) => p.status === "RENTED").length;

  return (
    <section className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
      <MetricCard value={filteredProperties.length} label="Total Propriétés (filtrées)" />
      <MetricCard
        value={availableCount}
        label="Disponibles"
        valueClassName="text-primary font-bold"
      />
      <MetricCard
        value={rentedCount}
        label="En Location"
        valueClassName="text-tertiary font-bold"
      />
    </section>
  );
}
