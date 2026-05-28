import React from "react";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { PropertiesMetrics } from "./properties-metrics";
import { PropertyStatus } from "@/lib/generated/prisma/enums";

export async function PropertiesMetricsServer(): Promise<React.JSX.Element> {
  const { orgId } = await getAuthContext();

  const [totalCount, availableCount, rentedCount] = await Promise.all([
    prisma.property.count({ where: { organizationId: orgId } }),
    prisma.property.count({
      where: { organizationId: orgId, status: PropertyStatus.AVAILABLE },
    }),
    prisma.property.count({
      where: { organizationId: orgId, status: PropertyStatus.RENTED },
    }),
  ]);

  return (
    <PropertiesMetrics
      totalCount={totalCount}
      availableCount={availableCount}
      rentedCount={rentedCount}
    />
  );
}
