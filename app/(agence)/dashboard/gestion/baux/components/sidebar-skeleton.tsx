import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function SidebarSkeleton(): React.JSX.Element {
  return (
    <Card className="border-outline-variant/60 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md">
        <div className="h-5 w-40 bg-outline-variant/20 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="pt-md flex flex-col gap-md animate-pulse">
        {/* Fake tabs */}
        <div className="flex border-b border-outline-variant/40 mb-2">
          <div className="flex-1 py-2 flex justify-center">
            <div className="h-4 w-16 bg-outline-variant/20 rounded" />
          </div>
          <div className="flex-1 py-2 flex justify-center">
            <div className="h-4 w-20 bg-outline-variant/15 rounded" />
          </div>
        </div>

        {/* Reference line */}
        <div className="border-b border-outline-variant/40 pb-sm">
          <div className="h-3 w-20 bg-outline-variant/15 rounded mb-2" />
          <div className="h-6 w-48 bg-outline-variant/20 rounded mb-2" />
          <div className="h-4 w-36 bg-outline-variant/15 rounded" />
        </div>

        {/* Metrics rows */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40"
          >
            <div className="h-3 w-24 bg-outline-variant/15 rounded" />
            <div className="h-4 w-20 bg-outline-variant/20 rounded" />
          </div>
        ))}

        {/* CTA button */}
        <div className="h-10 w-full bg-outline-variant/20 rounded mt-sm" />
      </CardContent>
    </Card>
  );
}
