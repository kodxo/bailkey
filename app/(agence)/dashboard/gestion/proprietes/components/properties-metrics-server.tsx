import React from "react";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { PropertiesMetrics } from "./properties-metrics";
import { PropertyStatus } from "@/lib/generated/prisma/enums";

export async function PropertiesMetricsServer(): Promise<React.JSX.Element> {
  const { orgId } = await getAuthContext();

  const totalCount = await prisma.property.count({ where: { organizationId: orgId } });
  const availableCount = await prisma.property.count({
    where: { organizationId: orgId, status: PropertyStatus.AVAILABLE },
  });
  const rentedCount = await prisma.property.count({
    where: { organizationId: orgId, status: PropertyStatus.RENTED },
  });

  return (
    <PropertiesMetrics
      totalCount={totalCount}
      availableCount={availableCount}
      rentedCount={rentedCount}
    />
  );
}
