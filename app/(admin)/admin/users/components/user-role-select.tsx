"use client";

import React, { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { Roles } from "@/types/globals";
import { updateUserRoleAction } from "../_actions";
import { useRouter } from "next/navigation";

export function UserRoleSelect({
  userId,
  initialRole,
}: {
  userId: string;
  initialRole: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Roles;
    startTransition(async () => {
      const res = await updateUserRoleAction(userId, newRole);
      if (res.success) {
        toast.success("Rôle utilisateur mis à jour avec succès.");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur lors du changement de rôle.");
      }
    });
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Select
        value={initialRole}
        disabled={isPending}
        onChange={handleRoleChange}
        options={[
          { label: "Administrateur", value: "admin" },
          { label: "Membre", value: "user" },
        ]}
        className="bg-surface-container-low border border-outline-variant px-2 py-1 rounded text-body-sm font-semibold cursor-pointer focus:ring-2 focus:ring-primary focus:outline-hidden"
      />
    </div>
  );
}
