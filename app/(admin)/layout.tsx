import "./global-admin.css";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { AdminNav } from "./admin-nav";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="bg-background text-on-background font-body-md flex min-h-screen transition-all duration-300 ease-in-out">
      {/* Side Nav Rail & Mobile Navigation */}
      <AdminNav />

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
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary-container/10">
              <span className="material-symbols-outlined" data-icon="search">
                search
              </span>
            </Button>
            <Image
              alt="Administrator profile photo"
              width={32}
              height={32}
              className="w-8 h-8 object-cover ml-xs border border-outline-variant rounded-full"
              src="/images/admin/profile.png"
            />
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
