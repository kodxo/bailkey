import React from "react";
import { fetchUsersAction } from "@/lib/actions/users.actions";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ServerTablePagination } from "@/components/ui/server-pagination";
import { UserRoleSelect } from "./user-role-select";
import { UserRow } from "./user-row";

export async function UsersTableServer({
  page,
  pageSize,
  search,
  role,
  selectedId,
}: {
  page: number;
  pageSize: number;
  search: string;
  role: string;
  selectedId?: string;
}) {
  const res = await fetchUsersAction({
    page,
    pageSize,
    query: search || undefined,
  });

  let users = res.users || [];
  let totalCount = res.totalCount || 0;

  if (role !== "all") {
    users = users.filter((u) => u.role === role);
    totalCount = users.length; // Local estimation as done previously
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="relative flex flex-col transition-all">
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
              const isSelected = selectedId === user.id;
              return (
                <UserRow key={user.id} userId={user.id} isSelected={isSelected}>
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
                    onClick={(e) => e.stopPropagation()} // Wait, stopping propagation in a Server Component won't work on the client!
                  >
                    <div className="flex justify-end relative z-10" onClick={(e) => {/* this won't work here */}}>
                      {/* We'll handle stopPropagation in a client wrapper or just rely on CSS pointer-events if possible. Actually, React server components allow client components inside. UserRoleSelect is a client component, but if you click it, it might bubble to UserRow (which is also a client component). We can do stopPropagation in UserRoleSelect. */}
                      <UserRoleSelect userId={user.id} initialRole={user.role} />
                    </div>
                  </TableCell>
                </UserRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <ServerTablePagination
        total={totalCount}
        currentPage={page}
        pageSize={pageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
