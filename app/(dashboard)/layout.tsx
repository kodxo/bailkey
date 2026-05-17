import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "./dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="bg-background text-on-background font-body-md flex min-h-screen transition-all duration-300 ease-in-out">
      {/* Side Nav Rail & Mobile Navigation */}
      <DashboardNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-[88px] w-full bg-surface-bright transition-all duration-300 ease-in-out pb-[80px] md:pb-0 relative">
        {/* TopNavBar (Mobile Header) */}
        <header className="flex justify-between items-center w-full px-md h-16 sticky top-0 z-40 bg-surface border-b border-outline-variant text-primary md:hidden transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-sm">
            <Link href="/" className="flex items-center">
              <Logo height={24} priority />
            </Link>
          </div>
          <div className="flex items-center gap-sm">
            <button className="text-primary hover:bg-primary-container/10 transition-colors p-xs cursor-pointer">
              <span className="material-symbols-outlined" data-icon="search">
                search
              </span>
            </button>
            <UserButton />
          </div>
        </header>

        {/* Page Content Canvas (Renders Page Children) */}
        <div className="w-full flex flex-col transition-all duration-300 ease-in-out min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
