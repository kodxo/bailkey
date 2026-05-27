"use client";

import React, { useState } from "react";
import { SchedulesMetrics } from "./components/schedules-metrics";
import { SchedulesTable, type MockSchedule } from "./components/schedules-table";
import { ScheduleDetailsPane } from "./components/schedule-details-pane";
import { Input } from "@/components/ui/input";
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

  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== initialSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) params.set("search", searchTerm);
        else params.delete("search");
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, initialSearch, pathname, router, searchParams]);

  const handleStatusChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") params.set("status", val);
    else params.delete("status");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newPageSize.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Transform Prisma payload to expected display type
  const displaySchedules: MockSchedule[] = initialSchedules.map(s => {
    const amount = typeof s.amount === 'number' ? s.amount : Number(s.amount);
    const amountPaid = typeof s.amountPaid === 'number' ? s.amountPaid : Number(s.amountPaid);
    
    return {
      id: s.id,
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
          {/* Search Bar */}
          <DashboardToolbar>
            <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
              <Input
                iconName="search"
                placeholder="Rechercher locataire, bien, paiement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                wrapperClassName="border-none w-full bg-transparent px-sm py-sm"
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
          <SchedulesTable 
            schedules={displaySchedules}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <TablePagination
            total={totalCount}
            start={(currentPage - 1) * pageSize + 1}
            end={Math.min(currentPage * pageSize, totalCount)}
            disabledPrev={currentPage <= 1}
            disabledNext={currentPage >= totalPages || totalPages <= 1}
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
