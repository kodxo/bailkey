import React, { Suspense } from "react";
import { checkRole } from "@/lib/clerk/check-role";
import { redirect } from "next/navigation";
import { DashboardSplitGrid } from "@/components/ui/dashboard-split-grid";
import { TenantsFilterBar } from "./components/tenants-filter-bar";
import { TenantsMetricsServer } from "./components/tenants-metrics-server";
import { TenantsTableServer } from "./components/tenants-table-server";
import { TenantsSidebarServer } from "./components/tenants-sidebar-server";

export const metadata = {
  title: "Bailkey - Gestion des Locataires",
};

export default async function AdminTenantsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
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
  const type = params?.type || "all";
  const edit = params?.edit || "false";
  const selectedId = params?.selectedId;

  return (
    <div className="flex flex-col gap-lg h-full">
      <Suspense fallback={<div className="h-24 bg-surface-container-low animate-pulse rounded" />}>
        <TenantsMetricsServer search={search} type={type} />
      </Suspense>

      <DashboardSplitGrid
        toolbar={<TenantsFilterBar />}
        main={
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                progress_activity
              </span>
            </div>
          }>
            <TenantsTableServer
              page={page}
              pageSize={10}
              search={search}
              type={type}
              selectedId={selectedId}
            />
          </Suspense>
        }
        sidebar={
          <Suspense fallback={<div className="h-64 bg-surface-container-low animate-pulse rounded" />}>
            <TenantsSidebarServer selectedId={selectedId} edit={edit} />
          </Suspense>
        }
      />
    </div>
  );
}
