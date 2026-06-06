import React, { Suspense } from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import {
  DashboardPageContainer,
  DashboardPageHeader,
} from "@/components/layout/dashboard-page-layout";
import {
  DashboardLayout,
  DashboardSplitGrid,
  DashboardMain,
  DashboardSidebar,
  DashboardToolbar,
} from "@/components/layout/dashboard-split-pane";
import { Search } from "@/components/ui/search";
import { getChargeTypesPaginated, getChargeTypeById } from "@/lib/dal/charges";
import { ChargeTypesTableServer } from "./components/charge-types-table-server";
import { ChargeTypesSidebarServer } from "./components/charge-types-sidebar-server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Types de Charge | Configuration | Bailkey",
  description: "Gestion du catalogue des charges",
};

export default async function ChargeTypesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    selectedId?: string;
    mode?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const search = params?.search || "";
  const selectedId = params?.selectedId;
  const mode = params?.mode;

  const [listRes, selectedRes] = await Promise.all([
    getChargeTypesPaginated({ page, pageSize, search }),
    selectedId ? getChargeTypeById(selectedId) : Promise.resolve({ data: undefined }),
  ]);

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Configuration", href: "/dashboard/configuration" },
            { label: "Types d'Opérations" },
            { label: "Types de Charge" },
          ]}
        />
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
              Types de Charge
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Gérez le catalogue des charges (encaissements et dépenses) applicables aux baux.
            </p>
          </div>
          <Link href={`?mode=create`}>
            <Button>
              <span className="material-symbols-outlined mr-2 text-[18px]">add</span>
              Nouvelle Charge
            </Button>
          </Link>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        <DashboardSplitGrid>
          <DashboardMain>
            <DashboardToolbar>
              <Search placeholder="Rechercher une charge..." />
            </DashboardToolbar>
            <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
              <ChargeTypesTableServer
                data={listRes.data || []}
                total={listRes.total || 0}
                page={page}
                pageSize={pageSize}
                selectedId={selectedId}
              />
            </Suspense>
          </DashboardMain>

          <DashboardSidebar>
            <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
              <ChargeTypesSidebarServer
                selectedCharge={selectedRes.data}
                mode={mode}
              />
            </Suspense>
          </DashboardSidebar>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
