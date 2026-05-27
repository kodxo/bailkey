import React, { Suspense } from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { LeasesDataContainer } from "./leases-data-container";
import { LeasesSkeleton } from "./leases-skeleton";
import {
  DashboardPageContainer,
  DashboardPageHeader,
} from "@/components/layout/dashboard-page-layout";

export const dynamic = "force-dynamic";

export default async function DashboardLeasesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string; selectedLeaseId?: string }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Gestion Immobilière", href: "/dashboard/gestion" },
            { label: "Baux & Contrats" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Contrats de Location (Baux)
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez vos contrats de location, le montant des cautions et les dates
            d&apos;échéance.
          </p>
        </div>
      </DashboardPageHeader>

      <Suspense fallback={<LeasesSkeleton />} key={JSON.stringify(params)}>
        <LeasesDataContainer searchParams={params} />
      </Suspense>
    </DashboardPageContainer>
  );
}
