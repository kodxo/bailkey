import React, { Suspense } from "react";
import { checkRole } from "@/lib/clerk/check-role";
import { redirect } from "next/navigation";
import {
  DashboardSplitGrid,
  DashboardLayout,
  DashboardMain,
  DashboardSidebar,
  DashboardToolbar,
} from "@/components/layout/dashboard-split-pane";
import {
  DashboardPageContainer,
  DashboardPageHeader,
} from "@/components/layout/dashboard-page-layout";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { TenantsFilterBar } from "@/components/admin/tenants/tenants-filter-bar";
import { TenantsMetricsServer } from "@/components/admin/tenants/tenants-metrics-server";
import { TenantsTableServer } from "@/components/admin/tenants/tenants-table-server";
import { TenantsSidebarServer } from "@/components/admin/tenants/tenants-sidebar-server";

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

  const breadcrumbItems = [
    { label: "Administration", href: "/admin" },
    { label: "Locataires" },
  ];

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Gestion des Locataires
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez les locataires, accédez à leurs contrats et informations de contact.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        <Suspense fallback={<div className="h-24 bg-surface-container-low animate-pulse rounded" />}>
          <TenantsMetricsServer search={search} type={type} />
        </Suspense>

        <DashboardSplitGrid>
          <DashboardMain>
            <DashboardToolbar>
              <TenantsFilterBar />
            </DashboardToolbar>
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
          </DashboardMain>
          <DashboardSidebar>
            <Suspense fallback={<div className="h-64 bg-surface-container-low animate-pulse rounded" />}>
              <TenantsSidebarServer selectedId={selectedId} edit={edit} />
            </Suspense>
          </DashboardSidebar>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
