import React, { Suspense } from "react";
import { checkRole } from "@/lib/clerk/check-role";
import { redirect } from "next/navigation";
import { DashboardSplitGrid } from "@/components/ui/dashboard-split-grid";
import { OwnersFilterBar } from "./components/owners-filter-bar";
import { OwnersMetricsServer } from "./components/owners-metrics-server";
import { OwnersTableServer } from "./components/owners-table-server";
import { OwnersSidebarServer } from "./components/owners-sidebar-server";

export const metadata = {
  title: "Bailkey - Gestion des Propriétaires",
};

export default async function AdminOwnersPage({
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
        <OwnersMetricsServer search={search} type={type} />
      </Suspense>

      <DashboardSplitGrid
        toolbar={<OwnersFilterBar />}
        main={
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                progress_activity
              </span>
            </div>
          }>
            <OwnersTableServer
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
            <OwnersSidebarServer selectedId={selectedId} edit={edit} />
          </Suspense>
        }
      />
    </div>
  );
}
