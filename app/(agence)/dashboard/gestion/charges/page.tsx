import { getChargeTypes } from "@/lib/dal/charges";
import { ChargesTableClient } from "./components/charges-table-client";
import {
  DashboardPageContainer,
} from "@/components/layout/dashboard-page-layout";
import { DashboardMain } from "@/components/layout/dashboard-split-pane";

export const metadata = {
  title: "Catalogue des Charges | Bailkey",
};

export default async function ChargesPage() {
  const { data: charges = [] } = await getChargeTypes();

  return (
    <DashboardPageContainer>
      <DashboardMain>
        <div className="max-w-5xl mx-auto w-full pt-8 px-4 sm:px-8">
          <ChargesTableClient charges={charges} />
        </div>
      </DashboardMain>
    </DashboardPageContainer>
  );
}
