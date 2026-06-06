import React from "react";
import { getProperties } from "@/lib/dal/properties";
import { PropertiesTableClient } from "./properties-table-client";
import { PropertyStatus, PropertyType } from "@/lib/generated/prisma/enums";

interface PropertiesTableServerProps {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  type: string;
  ownerId?: string;
  minRent?: string;
  maxRent?: string;
  roomsCount?: string;
}

export async function PropertiesTableServer({
  page,
  pageSize,
  search,
  status,
  type,
  ownerId,
  minRent,
  maxRent,
  roomsCount,
}: PropertiesTableServerProps): Promise<React.JSX.Element> {
  const { properties, totalCount } = await getProperties({
    status: status !== "all" ? (status as PropertyStatus) : undefined,
  });

  let displayProperties = properties || [];

  // Local filtering
  if (type !== "all") {
    displayProperties = displayProperties.filter(
      (p) => p.propertyType === type,
    );
  }
  if (ownerId && ownerId !== "all") {
    displayProperties = displayProperties.filter((p) => p.owners?.some(o => o.id === ownerId));
  }
  if (minRent) {
    displayProperties = displayProperties.filter(p => (p.baseRent || 0) >= parseFloat(minRent));
  }
  if (maxRent) {
    displayProperties = displayProperties.filter(p => (p.baseRent || 0) <= parseFloat(maxRent));
  }
  if (roomsCount && roomsCount !== "all") {
    const rc = parseInt(roomsCount, 10);
    displayProperties = displayProperties.filter(p => 
      rc >= 5 ? (p.roomsCount || 0) >= 5 : p.roomsCount === rc
    );
  }
  if (search) {
    const s = search.toLowerCase();
    displayProperties = displayProperties.filter(
      (p) =>
        p.designation.toLowerCase().includes(s) ||
        p.reference.toLowerCase().includes(s) ||
        p.city.toLowerCase().includes(s),
    );
  }

  const finalTotalCount = displayProperties.length;

  // Pagination
  const startIndex = (page - 1) * pageSize;
  displayProperties = displayProperties.slice(
    startIndex,
    startIndex + pageSize,
  );

  return (
    <PropertiesTableClient
      properties={displayProperties}
      totalCount={finalTotalCount}
      currentPage={page}
      pageSize={pageSize}
    />
  );
}
