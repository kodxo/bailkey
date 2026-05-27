import { getLeases, getLeaseById } from "@/lib/dal/leases";
import { getProperties } from "@/lib/dal/properties";
import { getTenants } from "@/lib/dal/tenants";
import { LeasesDashboard } from "./leases-dashboard";

export async function LeasesDataContainer({
  searchParams,
}: {
  searchParams?: { page?: string; pageSize?: string; search?: string; status?: string; selectedLeaseId?: string };
}): Promise<React.JSX.Element> {
  const page = parseInt(searchParams?.page || "1", 10);
  const pageSize = parseInt(searchParams?.pageSize || "10", 10);
  const search = searchParams?.search || "";
  const status = searchParams?.status || "all";
  const selectedLeaseId = searchParams?.selectedLeaseId;

  const [leasesRes, propsRes, tenantsRes, selectedLeaseRes] = await Promise.all([
    getLeases({ page, pageSize, search, status }),
    getProperties(),
    getTenants(),
    selectedLeaseId ? getLeaseById(selectedLeaseId) : Promise.resolve({ lease: null }),
  ]);

  const initialLeases = leasesRes.success && leasesRes.leases ? leasesRes.leases : [];
  const initialProperties = propsRes.success && propsRes.properties ? propsRes.properties : [];
  const initialTenants = tenantsRes.success && tenantsRes.tenants ? tenantsRes.tenants : [];
  const initialSelectedLease = selectedLeaseRes.lease;

  return (
    <LeasesDashboard
      initialLeases={initialLeases}
      initialProperties={initialProperties}
      initialTenants={initialTenants}
      initialSelectedLease={initialSelectedLease}
      totalCount={leasesRes.totalCount || 0}
      activeCount={leasesRes.activeCount || 0}
      draftCount={leasesRes.draftCount || 0}
      currentPage={page}
      pageSize={pageSize}
      initialSearch={search}
      initialStatus={status}
    />
  );
}
