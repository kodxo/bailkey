import React from "react";
import type { ChargeTypeDTO } from "@/lib/dal/charges";
import { ChargeTypeForm } from "./charge-type-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ChargeTypesSidebarServerProps {
  selectedCharge?: ChargeTypeDTO;
  mode?: string;
}

export function ChargeTypesSidebarServer({
  selectedCharge,
  mode,
}: ChargeTypesSidebarServerProps) {
  if (!selectedCharge && mode !== "create") {
    return (
      <Card className="border-outline-variant/60 shadow-md rounded-none overflow-hidden h-full min-h-[400px] flex items-center justify-center bg-surface-container-lowest relative sticky top-4">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-tertiary/5 pointer-events-none" />
        <CardContent className="p-xl flex flex-col items-center justify-center text-center text-on-surface-variant relative z-10 ">
          <div className="w-24 h-24 mb-6 rounded-full bg-surface flex items-center justify-center shadow-inner border border-outline-variant/30 ring-4 ring-primary/5">
            <span
              className="material-symbols-outlined text-[48px] text-primary/40"
              data-icon="category"
            >
              category
            </span>
          </div>
          <h3 className="text-h3 font-display text-on-surface mb-2">
            Catalogue des Charges
          </h3>
          <p className="font-body-md text-body-md leading-relaxed mb-6">
            Sélectionnez une charge dans le tableau pour la modifier ou créez-en une nouvelle.
          </p>
          <Link href="?mode=create">
            <Button>
              <span className="material-symbols-outlined mr-2">add</span>
              Nouvelle Charge
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="sticky top-4 h-[calc(100vh-120px)]">
      <ChargeTypeForm initialData={selectedCharge} />
    </div>
  );
}
