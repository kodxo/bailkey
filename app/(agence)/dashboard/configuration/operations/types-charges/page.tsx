import React from "react";
import { getChargeTypes } from "@/lib/dal/charges";
import { ChargesTableClient } from "./components/charges-table-client";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import {
  DashboardPageContainer,
  DashboardPageHeader,
} from "@/components/layout/dashboard-page-layout";
import {
  DashboardLayout,
  DashboardSplitGrid,
  DashboardMain,
} from "@/components/layout/dashboard-split-pane";

export const metadata = {
  title: "Catalogue des Charges | Bailkey",
};

export default async function ChargesPage() {
  const { data: charges = [] } = await getChargeTypes();

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Gestion Immobilière", href: "/dashboard/gestion" },
            { label: "Types de Charges" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Types de Charges
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez le catalogue des charges applicables à vos baux.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        <DashboardSplitGrid>
          <DashboardMain>
            <ChargesTableClient charges={charges} />
          </DashboardMain>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
