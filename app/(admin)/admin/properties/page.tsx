import React, { Suspense } from "react";
import { checkRole } from "@/lib/clerk/check-role";
import { redirect } from "next/navigation";
import {
  DashboardSplitGrid,
  DashboardMain,
  DashboardSidebar,
  DashboardToolbar,
} from "@/components/layout/dashboard-split-pane";
import { PropertiesFilterBar } from "@/components/admin/properties/properties-filter-bar";
import { PropertiesMetricsServer } from "@/components/admin/properties/properties-metrics-server";
import { PropertiesTableServer } from "@/components/admin/properties/properties-table-server";
import { PropertiesSidebarServer } from "@/components/admin/properties/properties-sidebar-server";

export const metadata = {
  title: "Bailkey - Gestion des Propriétés",
};

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    type?: string;
    edit?: string;
    selectedId?: string;
  }>;
}): Promise<React.JSX.Element> {
  if (!(await checkRole("super_admin"))) {
    redirect("/");
  }

  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const search = params?.search || "";
  const status = params?.status || "all";
  const type = params?.type || "all";
  const edit = params?.edit || "false";
  const selectedId = params?.selectedId;

  return (
    <div className="flex flex-col gap-lg h-full">
      <Suspense fallback={<div className="h-24 bg-surface-container-low animate-pulse rounded" />}>
        <PropertiesMetricsServer search={search} status={status} type={type} />
      </Suspense>

      <DashboardSplitGrid>
        <DashboardMain>
          <DashboardToolbar>
            <PropertiesFilterBar />
          </DashboardToolbar>
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                progress_activity
              </span>
            </div>
          }>
            <PropertiesTableServer
              page={page}
              pageSize={10}
              search={search}
              type={type}
              status={status}
              selectedId={selectedId}
            />
          </Suspense>
        </DashboardMain>
        <DashboardSidebar>
          <Suspense fallback={<div className="h-64 bg-surface-container-low animate-pulse rounded" />}>
            <PropertiesSidebarServer selectedId={selectedId} edit={edit} />
          </Suspense>
        </DashboardSidebar>
      </DashboardSplitGrid>
    </div>
  );
}
