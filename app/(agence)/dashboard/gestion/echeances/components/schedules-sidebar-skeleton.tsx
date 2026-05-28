import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function SchedulesSidebarSkeleton(): React.JSX.Element {
  return (
    <Card className="border-outline-variant/60 shadow-md rounded-none overflow-hidden h-full min-h-[400px]">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
        <div className="h-5 w-44 bg-outline-variant/20 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="p-md flex flex-col gap-md animate-pulse">
        {/* Info block */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-none">
          <div className="h-5 w-32 bg-outline-variant/20 rounded mb-2" />
          <div className="h-4 w-40 bg-outline-variant/15 rounded mb-3" />
          <div className="flex justify-between items-end border-t border-outline-variant/30 pt-2 mt-2">
            <div className="h-3 w-20 bg-outline-variant/15 rounded" />
            <div className="h-6 w-24 bg-outline-variant/20 rounded" />
          </div>
        </div>

        {/* Form fields */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-3 w-28 bg-outline-variant/15 rounded" />
            <div className="h-10 w-full bg-outline-variant/20 rounded" />
          </div>
        ))}

        {/* CTA buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="h-10 w-full bg-outline-variant/20 rounded" />
          <div className="h-10 w-full bg-outline-variant/15 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
