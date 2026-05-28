import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { checkRole } from "@/lib/clerk/check-role";
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

import { UsersTableServer } from "./components/users-table-server";
import { UsersSidebarServer } from "./components/users-sidebar-server";
import { UsersMetricsServer } from "./components/users-metrics-server";
import { UsersFilterBar } from "./components/users-filter-bar";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    role?: string;
    selectedId?: string;
  }>;
}): Promise<React.JSX.Element> {
  if (!(await checkRole("super_admin"))) {
    redirect("/");
  }

  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const search = params?.search || "";
  const role = params?.role || "all";
  const selectedId = params?.selectedId;

  const breadcrumbItems = [
    { label: "Administration", href: "/admin" },
    { label: "Utilisateurs" },
  ];

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Gestion des Utilisateurs
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Contrôlez les accès, attribuez des rôles administrateurs et visualisez
            les détails des membres.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        <Suspense fallback={<div className="h-24 bg-surface-variant animate-pulse rounded-md" />}>
          <UsersMetricsServer search={search} role={role} />
        </Suspense>

        <DashboardSplitGrid>
          <DashboardMain>
            <DashboardToolbar>
              <UsersFilterBar />
            </DashboardToolbar>

            <Suspense
              key={`table-${page}-${pageSize}-${search}-${role}`}
              fallback={<div className="h-64 bg-surface-variant animate-pulse rounded-md" />}
            >
              <UsersTableServer
                page={page}
                pageSize={pageSize}
                search={search}
                role={role}
                selectedId={selectedId}
              />
            </Suspense>
          </DashboardMain>

          <DashboardSidebar>
            <Suspense
              key={`sidebar-${selectedId || "none"}`}
              fallback={<div className="h-full min-h-[300px] bg-surface-variant animate-pulse rounded-md" />}
            >
              <UsersSidebarServer selectedId={selectedId} />
            </Suspense>
          </DashboardSidebar>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
