"use client";

import React, { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchProps {
  placeholder?: string;
  className?: string;
  onPendingChange?: (isPending: boolean) => void;
}

export function Search({ placeholder = "Rechercher...", className, onPendingChange }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    if (onPendingChange) {
      onPendingChange(isPending);
    }
  }, [isPending, onPendingChange]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 300);

  return (
    <Input
      iconName="search"
      placeholder={placeholder}
      defaultValue={searchParams.get("search")?.toString() || ""}
      onChange={(e) => handleSearch(e.target.value)}
      wrapperClassName={className || "border-none w-full bg-transparent px-sm py-sm"}
    />
  );
}
