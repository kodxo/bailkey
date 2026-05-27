import React from "react";

export function LeasesSkeleton(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center p-xl h-64 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xs">
      <div className="flex flex-col items-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-sm" data-icon="progress_activity">
          progress_activity
        </span>
        <span className="text-on-surface-variant font-medium">Chargement des baux...</span>
      </div>
    </div>
  );
}
