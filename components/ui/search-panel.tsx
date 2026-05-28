import React from "react";
import { Search } from "@/components/ui/search";
import { Select } from "@/components/ui/select";

export interface SearchPanelProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchDefaultValue?: string;
  onSearchChange?: (val: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function SearchPanel({
  showSearch = true,
  searchPlaceholder = "Rechercher...",
  searchDefaultValue,
  onSearchChange,
  children,
  className = "",
}: SearchPanelProps) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden ${className}`}>
      {showSearch && (
        <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
          <Search
            placeholder={searchPlaceholder}
            defaultValue={searchDefaultValue}
            onChange={onSearchChange}
          />
        </div>
      )}
      {children && (
        <div className="flex items-center gap-2 px-sm py-xs overflow-x-auto flex-wrap sm:flex-nowrap">
          {children}
        </div>
      )}
    </div>
  );
}

export function SearchPanelSelect(props: React.ComponentProps<typeof Select>) {
  return (
    <Select
      {...props}
      wrapperClassName={`border-none py-sm ${props.wrapperClassName || ""}`}
    />
  );
}

export interface SearchPanelTabsProps {
  options: { label: string; value: string }[];
  value: string;
  onChange?: (val: string) => void;
  label?: string;
}

export function SearchPanelTabs({
  options,
  value,
  onChange,
  label
}: SearchPanelTabsProps) {
  return (
    <div className="flex items-center gap-xs ml-auto sm:ml-sm shrink-0">
      {label && (
        <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mr-xs shrink-0 select-none hidden sm:inline">
          {label}
        </span>
      )}
      <div className="flex border border-outline-variant overflow-hidden shrink-0 rounded-xs">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange?.(opt.value)}
              className={`px-sm py-[4px] text-label-caps font-label-caps border-r last:border-r-0 border-outline-variant transition-colors uppercase cursor-pointer ${
                isActive 
                  ? "bg-primary text-on-primary" 
                  : "bg-transparent text-on-surface hover:bg-surface-variant"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
