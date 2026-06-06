"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdvancedFilterDialogProps {
  title?: string;
  description?: string;
  activeFiltersCount?: number;
  onReset?: () => void;
  onApply?: () => void;
  children: React.ReactNode;
}

export function AdvancedFilterDialog({
  title = "Filtres avancés",
  description = "Affinez votre recherche avec plus de critères.",
  activeFiltersCount = 0,
  onReset,
  onApply,
  children,
}: AdvancedFilterDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleApply = () => {
    if (onApply) onApply();
    setOpen(false); // Ferme la modale après application
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative ml-2 whitespace-nowrap h-10">
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Filtres
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {/* Contenu des filtres */}
        <div className="grid gap-4 py-4">
          {children}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between w-full">
          <Button variant="ghost" onClick={onReset}>
            Réinitialiser
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleApply}>Appliquer</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
