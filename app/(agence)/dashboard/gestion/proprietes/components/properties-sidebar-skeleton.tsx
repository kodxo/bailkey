import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function PropertiesSidebarSkeleton(): React.JSX.Element {
  return (
    <Card className="border-outline-variant/60 shadow-md overflow-hidden animate-pulse">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-sm flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <div className="h-6 w-48 bg-outline-variant/20 rounded" />
        </div>
        <div className="flex border-b border-outline-variant/60 pt-2 gap-4">
          <div className="h-4 w-24 bg-outline-variant/20 rounded" />
          <div className="h-4 w-24 bg-outline-variant/15 rounded" />
          <div className="h-4 w-20 bg-outline-variant/15 rounded" />
        </div>
      </CardHeader>
      <CardContent className="pt-md flex flex-col gap-md">
        {[1, 2, 3, 4, 5].map((i) => (
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
