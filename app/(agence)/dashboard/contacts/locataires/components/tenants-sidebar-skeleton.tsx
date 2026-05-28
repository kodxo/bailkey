import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function TenantsSidebarSkeleton(): React.JSX.Element {
  return (
    <Card className="border-outline-variant/60 shadow-md overflow-hidden animate-pulse">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-sm flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <div className="h-6 w-48 bg-outline-variant/20 rounded" />
        </div>
        <div className="flex items-center gap-3 mt-2">
           <div className="h-12 w-12 bg-outline-variant/20 rounded-full" />
           <div className="flex flex-col gap-1.5">
             <div className="h-5 w-32 bg-outline-variant/20 rounded" />
             <div className="h-3 w-24 bg-outline-variant/15 rounded" />
           </div>
        </div>
      </CardHeader>
      <CardContent className="pt-md flex flex-col gap-md">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-3 w-28 bg-outline-variant/20 rounded" />
            <div className="h-10 w-full bg-outline-variant/15 rounded" />
          </div>
        ))}
        <div className="h-10 w-full bg-outline-variant/20 rounded mt-4" />
      </CardContent>
    </Card>
  );
}
