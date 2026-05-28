import React from "react";

interface ActiveFilterBannerProps {
  label: string;
  onClear: () => void;
  clearLabel?: string;
}

export function ActiveFilterBanner({
  label,
  onClear,
  clearLabel = "Afficher tout",
}: ActiveFilterBannerProps) {
  return (
    <div className="bg-primary-container text-on-primary-container px-4 py-3 mb-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined">filter_list</span>
        <span className="font-medium text-body-md">{label}</span>
      </div>
      <button
        onClick={onClear}
        className="text-body-sm flex items-center gap-1 hover:underline font-medium"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
        {clearLabel}
      </button>
    </div>
  );
}
