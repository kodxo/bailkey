import React from "react";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { checkRole } from "@/lib/clerk/check-role";
import { Roles } from "@/types/globals";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { UsersDashboard, UserItem } from "./users-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage(): Promise<React.JSX.Element> {
  if (!(await checkRole("admin"))) {
    redirect("/");
  }

  const client = await clerkClient();
  const res = await client.users.getUserList();

  const rawUsers = Array.isArray(res) ? res : res.data || [];
  const totalCount =
    !Array.isArray(res) && typeof res.totalCount === "number"
      ? res.totalCount
      : rawUsers.length;

  const initialUsers: UserItem[] = rawUsers.map((u) => ({
    id: u.id,
    email: u.emailAddresses[0]?.emailAddress || "Aucun email",
    firstName: u.firstName || "",
    lastName: u.lastName || "",
    imageUrl: u.imageUrl || "",
    role: (u.publicMetadata?.role as Roles) || "user",
    createdAt: u.createdAt,
    lastSignInAt: u.lastSignInAt || null,
  }));

  return (
    <div className="p-md w-full max-w-[1400px] mx-auto flex flex-col gap-lg">
      <section className="border-b border-outline-variant pb-md flex flex-col gap-sm">
        <BreadcrumbNav
          items={[
            { label: "Administration", href: "/admin" },
            { label: "Utilisateurs" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Gestion des Utilisateurs
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Contrôlez les accès, attribuez des rôles administrateurs et visualisez
            les détails des membres.
          </p>
        </div>
      </section>

      <UsersDashboard
        initialUsers={initialUsers}
        initialTotalCount={totalCount}
      />
    </div>
  );
}

