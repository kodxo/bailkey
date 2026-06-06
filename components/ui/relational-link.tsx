"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Maps entity types to their corresponding dashboard routes.
 * The `selectedParam` is the query parameter used to pre-select the entity on the target page.
 */
const ENTITY_ROUTES: Record<RelationalEntityType, { basePath: string; selectedParam: string }> = {
  owner: {
    basePath: "/dashboard/contacts/proprietaires",
    selectedParam: "selectedId",
  },
  tenant: {
    basePath: "/dashboard/contacts/locataires",
    selectedParam: "selectedId",
  },
  property: {
    basePath: "/dashboard/gestion/proprietes",
    selectedParam: "selectedId",
  },
  lease: {
    basePath: "/dashboard/gestion/baux",
    selectedParam: "selectedLeaseId",
  },
};

export type RelationalEntityType = "owner" | "tenant" | "property" | "lease";

interface RelationalLinkProps {
  /** The type of entity being linked to */
  entityType: RelationalEntityType;
  /** The ID of the entity to navigate to */
  entityId: string | undefined | null;
  /** Optional custom tooltip text */
  tooltip?: string;
  /** Additional CSS classes for the link button */
  className?: string;
  /** Size variant */
  size?: "sm" | "md";
}

/**
 * A small icon-button link that navigates to the detail page of a related entity.
 * Place it next to relational select fields or relational display fields
 * to allow users to quickly jump to the referenced record.
 */
export function RelationalLink({
  entityType,
  entityId,
  tooltip,
  className,
  size = "sm",
}: RelationalLinkProps): React.JSX.Element | null {
  if (!entityId) return null;

  const route = ENTITY_ROUTES[entityType];
  const href = `${route.basePath}?${route.selectedParam}=${entityId}`;

  const defaultTooltips: Record<RelationalEntityType, string> = {
    owner: "Ouvrir la fiche propriétaire",
    tenant: "Ouvrir la fiche locataire",
    property: "Ouvrir la fiche propriété",
    lease: "Ouvrir le contrat de bail",
  };

  const icons: Record<RelationalEntityType, string> = {
    owner: "person",
    tenant: "badge",
    property: "apartment",
    lease: "description",
  };

  return (
    <Link
      href={href}
      title={tooltip || defaultTooltips[entityType]}
      className={cn(
        "inline-flex items-center justify-center shrink-0 rounded-md border border-outline-variant/40 bg-surface-container-lowest text-primary transition-all duration-200",
        "hover:bg-primary/10 hover:border-primary/40 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "active:scale-95",
        size === "sm" && "h-8 w-8",
        size === "md" && "h-10 w-10",
        className,
      )}
    >
      <span
        className={cn(
          "material-symbols-outlined select-none",
          size === "sm" && "text-[16px]",
          size === "md" && "text-[20px]",
        )}
        data-icon={icons[entityType]}
      >
        open_in_new
      </span>
    </Link>
  );
}

interface RelationalFieldWrapperProps {
  /** The type of entity being linked to */
  entityType: RelationalEntityType;
  /** The ID of the currently selected entity */
  entityId: string | undefined | null;
  /** The field content (e.g. a Select component) */
  children: React.ReactNode;
  /** Optional tooltip */
  tooltip?: string;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/**
 * Wraps a relational field (like a Select) with an inline link button
 * that opens the referenced entity's detail page.
 */
export function RelationalFieldWrapper({
  entityType,
  entityId,
  children,
  tooltip,
  className,
}: RelationalFieldWrapperProps): React.JSX.Element {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 min-w-0">{children}</div>
      <RelationalLink
        entityType={entityType}
        entityId={entityId}
        tooltip={tooltip}
        className="mt-auto"
      />
    </div>
  );
}
