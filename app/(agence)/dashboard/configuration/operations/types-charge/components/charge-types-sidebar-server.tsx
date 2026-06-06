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
      <div className="py-xl flex flex-col items-center text-on-surface-variant text-center">
        <span
          className="material-symbols-outlined text-4xl mb-sm opacity-60"
          data-icon="category"
        >
          category
        </span>
        <p className="text-body-md">
          Sélectionnez une charge dans le tableau pour la modifier ou créez-en une nouvelle.
        </p>
      </div>
    );
  }

  return (
    <div className="sticky top-4 h-[calc(100vh-120px)]">
      <ChargeTypeForm initialData={selectedCharge} />
    </div>
  );
}
