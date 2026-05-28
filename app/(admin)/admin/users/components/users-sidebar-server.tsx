import React from "react";
import { fetchUsersAction } from "@/lib/actions/users.actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export async function UsersSidebarServer({
  selectedId,
}: {
  selectedId?: string;
}) {
  if (!selectedId) {
    return (
      <Card className="border-outline-variant/60 shadow-md">
        <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
          <CardTitle className="text-h3 font-display">Fiche Utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="pt-xl pb-xl flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-sm opacity-60">
            touch_app
          </span>
          <p className="text-body-md text-center px-md">
            Sélectionnez un utilisateur dans le tableau pour afficher ses
            détails complets.
          </p>
        </CardContent>
      </Card>
    );
  }

  // To fetch a single user, we can either search by ID or use a custom action.
  // We'll use fetchUsersAction with a limit of 1 since we only need one user.
  // Wait, clerkClient().users.getUser(id) is better.
  // I will just use fetchUsersAction because I need the formatUserItems output.
  // But wait, fetchUsersAction doesn't filter by ID easily natively. 
  // Let's create an action or use clerk locally if we don't want to export a new action.
  // Let's use `clerkClient` directly here.
  const { clerkClient } = await import("@clerk/nextjs/server");
  const { formatUserItems } = await import("@/lib/actions/users.actions");
  
  const client = await clerkClient();
  let selectedUser = null;
  try {
    const rawUser = await client.users.getUser(selectedId);
    if (rawUser) {
      const formatted = await formatUserItems([rawUser]);
      selectedUser = formatted[0];
    }
  } catch (error) {
    console.error("Error fetching selected user:", error);
  }

  if (!selectedUser) {
    return (
      <Card className="border-outline-variant/60 shadow-md">
        <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
          <CardTitle className="text-h3 font-display">Fiche Utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="pt-xl pb-xl flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-sm text-error">
            error
          </span>
          <p className="text-body-md text-center">Utilisateur introuvable.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-outline-variant/60 shadow-md">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
        <CardTitle className="text-h3 font-display">Fiche Utilisateur</CardTitle>
      </CardHeader>
      <CardContent className="pt-md flex flex-col items-center text-center">
        <Avatar
          src={selectedUser.imageUrl}
          alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
          fallback={(
            selectedUser.firstName.charAt(0) + selectedUser.lastName.charAt(0)
          ).toUpperCase() || "U"}
          size="lg"
          className="mb-sm shadow-sm border-2 border-primary/20"
        />
        <h4 className="text-h2 font-bold text-on-surface mb-xs">
          {selectedUser.firstName} {selectedUser.lastName}
        </h4>
        <p className="text-body-md text-on-surface-variant mb-md select-all font-mono bg-surface-container px-2 py-1 rounded break-all max-w-full">
          {selectedUser.email}
        </p>

        <div className="w-full border-t border-outline-variant/40 pt-md flex flex-col gap-sm text-left">
          <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
            <span className="text-label-caps uppercase text-on-surface-variant">
              Rôle Actuel
            </span>
            {selectedUser.role === "admin" ? (
              <Badge variant="default" dot>
                Administrateur
              </Badge>
            ) : (
              <Badge variant="surface" dot>
                Membre Standard
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
            <span className="text-label-caps uppercase text-on-surface-variant">
              Inscription
            </span>
            <span className="text-body-sm text-on-surface font-semibold">
              {new Intl.DateTimeFormat("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(selectedUser.createdAt))}
            </span>
          </div>

          <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
            <span className="text-label-caps uppercase text-on-surface-variant">
              Dernière Connexion
            </span>
            <span className="text-body-sm text-on-surface font-semibold">
              {selectedUser.lastSignInAt
                ? new Intl.DateTimeFormat("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(selectedUser.lastSignInAt))
                : "Jamais"}
            </span>
          </div>

          <div className="flex flex-col gap-1 bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
            <span className="text-label-caps uppercase text-on-surface-variant">
              Identifiant Unique (ID)
            </span>
            <span className="text-[11px] font-mono text-on-surface-variant truncate select-all">
              {selectedUser.id}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
