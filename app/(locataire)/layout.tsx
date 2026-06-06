import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { UserButton } from "@clerk/nextjs";
import { LocataireNav } from "./locataire-nav";

export const metadata = {
  title: "Portail Locataire | BailKey",
  description: "Gérez votre location, vos paiements et vos demandes en toute simplicité.",
};

export default function LocataireLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="bg-background text-on-background font-body-md flex min-h-screen transition-all duration-300 ease-in-out">
      {/* Side Nav Rail & Mobile Navigation */}
      <LocataireNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-[88px] w-full bg-surface-bright transition-all duration-300 ease-in-out pb-[80px] md:pb-0 relative">
        {/* TopNavBar (Mobile Header) */}
        <header className="flex justify-between items-center w-full px-md h-16 sticky top-0 z-40 bg-surface border-b border-outline-variant text-primary md:hidden transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-sm">
            <Link href="/locataire/dashboard" className="flex items-center">
              <Logo height={24} priority />
            </Link>
          </div>
          <div className="flex items-center gap-sm">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary-container/10">
              <span className="material-symbols-outlined" data-icon="search">
                search
              </span>
            </Button>
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
