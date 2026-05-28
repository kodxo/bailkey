"use client";

import React, { useState } from "react";
import { SchedulesMetrics } from "./components/schedules-metrics";
import { SchedulesTable, type MockSchedule } from "./components/schedules-table";
import { ScheduleDetailsPane } from "./components/schedule-details-pane";
import { Search } from "@/components/ui/search";
import { Select } from "@/components/ui/select";
import { TablePagination } from "@/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  DashboardLayout,
  DashboardSplitGrid,
  DashboardMain,
  DashboardSidebar,
  DashboardToolbar,
} from "@/components/layout/dashboard-split-pane";
import { ActiveFilterBanner } from "@/components/ui/active-filter-banner";

interface SchedulesDashboardProps {
  initialSchedules: any[];
  initialSelectedSchedule?: any;
  totalCount?: number;
  overdueCount?: number;
  pendingCount?: number;
  totalAmount?: number;
  totalPaid?: number;
  currentPage?: number;
  pageSize?: number;
  initialSearch?: string;
  initialStatus?: string;
  initialLeaseId?: string;
}

export function SchedulesDashboard({ 
  initialSchedules = [],
  initialSelectedSchedule = null,
  totalCount = 0,
  overdueCount = 0,
  pendingCount = 0,
  totalAmount = 0,
  totalPaid = 0,
  currentPage = 1,
  pageSize = 10,
  initialSearch = "",
  initialStatus = "all",
  initialLeaseId,
}: SchedulesDashboardProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const selectedId = searchParams.get("selectedId");

  const setSelectedId = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("selectedId", id);
    } else {
      params.delete("selectedId");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [isTransitionPending, startTransition] = React.useTransition();
  const [isSearchPending, setIsSearchPending] = useState(false);

  const handleStatusChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") params.set("status", val);
    else params.delete("status");
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newPageSize.toString());
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearLeaseFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("leaseId");
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Transform Prisma payload to expected display type
  const displaySchedules: MockSchedule[] = initialSchedules.map(s => {
    const amount = typeof s.amount === 'number' ? s.amount : Number(s.amount);
    const amountPaid = typeof s.amountPaid === 'number' ? s.amountPaid : Number(s.amountPaid);
    
    return {
      id: s.id,
      leaseId: s.leaseId,
      tenantName: s.lease?.tenant ? `${s.lease.tenant.lastName || ""} ${s.lease.tenant.firstName || ""}`.trim() || s.lease.tenant.companyName || "Locataire Inconnu" : "Locataire Inconnu",
      propertyInfo: s.lease?.property ? s.lease.property.name : "Bien Inconnu",
      date: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(s.dueDate)),
      amount: amount,
      remaining: amount - amountPaid,
      status: s.status,
      isLocked: s.isLocked,
      payments: s.payments ? s.payments.map((p: any) => ({
        id: p.id,
        amount: typeof p.amount === 'number' ? p.amount : Number(p.amount),
        date: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(p.paymentDate)),
        method: p.paymentMethod,
        reference: p.reference
      })) : []
    };
  });

  let selectedSchedule: MockSchedule | null = null;
  if (initialSelectedSchedule) {
    const s = initialSelectedSchedule;
    const amount = typeof s.amount === 'number' ? s.amount : Number(s.amount);
    const amountPaid = typeof s.amountPaid === 'number' ? s.amountPaid : Number(s.amountPaid);
    
    selectedSchedule = {
      id: s.id,
      leaseId: s.leaseId,
      tenantName: s.lease?.tenant ? `${s.lease.tenant.lastName || ""} ${s.lease.tenant.firstName || ""}`.trim() || s.lease.tenant.companyName || "Locataire Inconnu" : "Locataire Inconnu",
      propertyInfo: s.lease?.property ? s.lease.property.name : "Bien Inconnu",
      date: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(s.dueDate)),
      amount: amount,
      remaining: amount - amountPaid,
      status: s.status,
      isLocked: s.isLocked,
      payments: s.payments ? s.payments.map((p: any) => ({
        id: p.id,
        amount: typeof p.amount === 'number' ? p.amount : Number(p.amount),
        date: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(p.paymentDate)),
        method: p.paymentMethod,
        reference: p.reference
      })) : []
    };
  } else {
    selectedSchedule = displaySchedules.find((s) => s.id === selectedId) || null;
  }

  return (
    <DashboardLayout className="mt-4">
      <SchedulesMetrics 
        totalAmount={totalAmount}
        totalPaid={totalPaid}
        overdueCount={overdueCount}
      />
      
      <DashboardSplitGrid>
        <DashboardMain>
          {initialLeaseId && (
            <ActiveFilterBanner
              label="Filtré sur un contrat spécifique"
              onClear={clearLeaseFilter}
            />
          )}
          {/* Search Bar */}
          <DashboardToolbar>
            <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
              <Search
                placeholder="Rechercher locataire, bien, paiement..."
                onPendingChange={setIsSearchPending}
              />
            </div>
            <div className="flex items-center px-sm py-xs">
              <Select
                label="Filtrer par :"
                value={initialStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={[
                  { label: "Tous (Priorité Retards)", value: "all" },
                  { label: "En retard", value: "OVERDUE" },
                  { label: "À venir", value: "PENDING" },
                  { label: "Partiel", value: "PARTIAL" },
                  { label: "Payé", value: "PAID" },
                ]}
                wrapperClassName="border-none py-sm min-w-[200px]"
              />
            </div>
          </DashboardToolbar>
          
          {/* Table */}
          <div className="relative">
            <SchedulesTable 
              schedules={displaySchedules}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            { (isTransitionPending || isSearchPending) && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-xs z-20 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">
                  progress_activity
                </span>
              </div>
            )}
          </div>
          <TablePagination
            total={totalCount}
            start={(currentPage - 1) * pageSize + 1}
            end={Math.min(currentPage * pageSize, totalCount)}
            disabledPrev={currentPage <= 1 || isTransitionPending || isSearchPending}
            disabledNext={currentPage >= totalPages || totalPages <= 1 || isTransitionPending || isSearchPending}
            onPrev={() => handlePageChange(Math.max(currentPage - 1, 1))}
            onNext={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </DashboardMain>

        <DashboardSidebar>
           <ScheduleDetailsPane 
             selectedSchedule={selectedSchedule} 
             onCancel={() => setSelectedId(null)}
           />
        </DashboardSidebar>
      </DashboardSplitGrid>
    </DashboardLayout>
  );
}
