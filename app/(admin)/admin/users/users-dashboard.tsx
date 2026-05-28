"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { Roles } from "@/types/globals";
import { updateUserRoleAction, fetchUsersAction } from "./_actions";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Search } from "@/components/ui/search";
import { Select } from "@/components/ui/select";
import { TablePagination } from "@/components/ui/pagination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";

export interface OrganizationBrief {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: Roles;
  createdAt: number;
  lastSignInAt: number | null;
  organizations?: OrganizationBrief[];
}

export interface UsersDashboardProps {
  initialUsers: UserItem[];
  initialTotalCount: number;
}

export function UsersDashboard({
  initialUsers,
  initialTotalCount,
}: UsersDashboardProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(
    initialUsers[0] || null
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const pageSize = 10;
  const isInitialMount = useRef(true);

  // Synchronisation avec l'API serveur Clerk lors du changement de page ou de recherche
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    startTransition(async () => {
      // Pour une recherche large si on a un filtre de rôle, on charge un batch ou on applique la pagination
      const res = await fetchUsersAction({
        page: currentPage,
        pageSize: pageSize,
        query: searchTerm || undefined,
      });

      if (res.success) {
        let finalUsers = res.users;
        let finalTotal = res.totalCount;

        // Filtrage par rôle en post-traitement si actif
        if (roleFilter !== "all") {
          finalUsers = finalUsers.filter((u) => u.role === roleFilter);
          finalTotal = finalUsers.length; // Estimation locale pour la vue courante
        }

        setUsers(finalUsers);
        setTotalCount(finalTotal);

        if (finalUsers.length > 0 && !selectedUser) {
          setSelectedUser(finalUsers[0]);
        }
      } else {
        toast.error(res.error || "Erreur de chargement des utilisateurs.");
      }
    });
  }, [searchTerm, currentPage, roleFilter]);

  // Si on change la recherche ou le filtre, on réinitialise à la page 1
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val);
    setCurrentPage(1);
  };

  const handleRoleChange = (userId: string, newRoleString: string) => {
    const newRole = newRoleString as Roles;
    startTransition(async () => {
      const res = await updateUserRoleAction(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null));
        }
        toast.success("Rôle utilisateur mis à jour avec succès.");
      } else {
        toast.error(res.error || "Erreur lors du changement de rôle.");
      }
    });
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  return (
    <div className="flex flex-col gap-lg">
      {/* Metrics Row */}
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

      {/* Main Grid: Left Panel (Table) 70% / Right Panel (Details) 30% */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        {/* Left Panel: Table & Filters */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          {/* Filters Bar */}
          <div className="bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden">
            <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
              <Search
                placeholder="Rechercher par nom ou email (serveur)..."
                defaultValue={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center px-sm py-xs">
              <Select
                label="Rôle:"
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
                options={[
                  { label: "Tous", value: "all" },
                  { label: "Administrateurs", value: "admin" },
                  { label: "Membres", value: "user" },
                ]}
                wrapperClassName="border-none py-sm"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="relative flex flex-col transition-all">
            {isPending && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-xs z-20 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">
                  progress_activity
                </span>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UTILISATEUR</TableHead>
                  <TableHead>INSCRIPTION</TableHead>
                  <TableHead>STATUT</TableHead>
                  <TableHead className="text-right">MODIFIER RÔLE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="p-lg text-center text-on-surface-variant font-medium"
                    >
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const isSelected = selectedUser?.id === user.id;
                    return (
                      <TableRow
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-primary-container/10 font-medium" : ""
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-sm">
                            <Avatar
                              src={user.imageUrl}
                              alt={`${user.firstName} ${user.lastName}`}
                              fallback={(
                                user.firstName.charAt(0) + user.lastName.charAt(0)
                              ).toUpperCase() || "U"}
                              size="md"
                            />
                            <div className="flex flex-col">
                              <span className="text-body-md font-bold text-on-surface leading-snug">
                                {user.firstName} {user.lastName}
                              </span>
                              <span className="text-body-sm text-on-surface-variant truncate max-w-[200px]">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-on-surface-variant">
                          {new Intl.DateTimeFormat("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(user.createdAt))}
                        </TableCell>
                        <TableCell>
                          {user.role === "admin" ? (
                            <Badge variant="default" dot>
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="surface" dot>
                              Membre
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Select
                            value={user.role}
                            disabled={isPending}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            options={[
                              { label: "Administrateur", value: "admin" },
                              { label: "Membre", value: "user" },
                            ]}
                            className="bg-surface-container-low border border-outline-variant px-2 py-1 rounded text-body-sm font-semibold cursor-pointer focus:ring-2 focus:ring-primary focus:outline-hidden"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Server Pagination Component */}
            <TablePagination
              total={totalCount}
              start={startIndex + 1}
              end={endIndex}
              disabledPrev={currentPage <= 1 || isPending}
              disabledNext={currentPage >= totalPages || totalPages <= 1 || isPending}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </div>
        </div>

        {/* Right Panel: Details or Summary */}
        <div className="lg:col-span-1 flex flex-col sticky top-6">
          <Card className="border-outline-variant/60 shadow-md">
            <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
              <CardTitle className="text-h3 font-display">
                Fiche Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-md flex flex-col items-center text-center">
              {selectedUser ? (
                <>
                  <Avatar
                    src={selectedUser.imageUrl}
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    fallback={(
                      selectedUser.firstName.charAt(0) +
                      selectedUser.lastName.charAt(0)
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
                </>
              ) : (
                <div className="py-xl flex flex-col items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-sm opacity-60">
                    touch_app
                  </span>
                  <p className="text-body-md">
                    Sélectionnez un utilisateur dans le tableau pour afficher
                    ses détails complets.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
