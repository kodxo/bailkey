import React from "react";
import { Search } from "@/components/ui/search";

export function SearchPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function SearchPanelInput({ 
  placeholder = "Rechercher...", 
  defaultValue,
  onChange 
}: { 
  placeholder?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
}) {
  return (
    <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
      <Search
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
}

export function SearchPanelFilters({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2 px-sm py-xs overflow-x-auto ${className}`}>
      {children}
    </div>
  );
}
