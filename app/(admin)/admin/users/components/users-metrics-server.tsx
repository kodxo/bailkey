import React from "react";
import { fetchUsersAction } from "@/lib/actions/users.actions";
import { MetricCard } from "@/components/ui/metric-card";

export async function UsersMetricsServer({
  search,
  role,
}: {
  search: string;
  role: string;
}) {
  // To get the true metrics based on current filters, we do a fetch.
  // Note: doing a full fetch here just for metrics is fine because `fetchUsersAction` caches inside Clerk/NextJS or we can just fetch without limit.
  // Actually, wait, `fetchUsersAction` takes `pageSize`. If we want the real total, we can just fetch 1 item and get `totalCount`.
  const res = await fetchUsersAction({
    page: 1,
    pageSize: 10,
    query: search || undefined,
  });

  const totalCount = res.totalCount || 0;
  
  // Since we cannot easily get counts by role natively via Clerk without fetching all users, 
  // we will just show the total matching users, or we use local estimation for the page if role != "all".
  // Let's just show "Total Utilisateurs", "Admins (sur la page)", "Membres (sur la page)" like the old component did.
  let adminCount = 0;
  let userCount = 0;
  
  if (res.users) {
    adminCount = res.users.filter((u) => u.role === "admin").length;
    userCount = res.users.filter((u) => u.role === "user").length;
  }

  return (
    <section className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
      <MetricCard value={totalCount} label="Total Utilisateurs" />
      <MetricCard
        value={adminCount}
        label="Admins (sur page)"
        valueClassName="text-primary font-bold"
      />
      <MetricCard
        value={userCount}
        label="Membres (sur page)"
        valueClassName="text-tertiary font-bold"
      />
    </section>
  );
}
