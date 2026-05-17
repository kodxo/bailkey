"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavNestedItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavNestedItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavSubItem {
  label: string;
  href: string;
  icon?: string;
  isActive?: boolean;
  children?: NavNestedItem[];
}

export interface NavGroup {
  label: string;
  mainItem: {
    label: string;
    href: string;
    icon: string;
    isActive?: boolean;
  };
  subItems: NavSubItem[];
}

export interface MobileShortcutItem {
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
}

export interface FooterActionItem {
  label: string;
  href?: string;
  icon: string;
  onClick?: () => void;
}

export interface NavigationProps {
  logoSlot?: React.ReactNode;
  groups: NavGroup[];
  mobileShortcuts: MobileShortcutItem[];
  footerActions?: FooterActionItem[];
  userButtonSlot?: React.ReactNode;
  mobileMenuToggleId?: string;
}

export function Navigation({
  logoSlot,
  groups,
  mobileShortcuts,
  footerActions = [],
  userButtonSlot,
  mobileMenuToggleId = "mobile-menu-toggle",
}: NavigationProps): React.JSX.Element {
  return (
    <>
      {/* Side Nav Rail (Medium/Desktop) */}
      <nav className="hidden md:flex flex-col py-md bg-surface border-r border-outline-variant shadow-none h-screen left-0 w-[88px] fixed top-0 z-50 transition-all duration-300 ease-in-out items-center">
        {logoSlot !== undefined && logoSlot !== null && (
          <div className="mb-lg flex flex-col items-center">
            {logoSlot}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-sm w-full">
          {groups.map((group: NavGroup, index: number): React.JSX.Element => (
            <div key={index} className="nav-item-group relative flex justify-center w-full group">
              <Link
                href={group.mainItem.href}
                className={cn(
                  "flex flex-col items-center justify-center p-sm w-[64px] h-[64px] rounded transition-colors cursor-pointer",
                  group.mainItem.isActive === true
                    ? "bg-primary-container/10 text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  data-icon={group.mainItem.icon}
                  style={{
                    fontVariationSettings: group.mainItem.isActive === true ? '"FILL" 1' : '"FILL" 0',
                  }}
                >
                  {group.mainItem.icon}
                </span>
                <span className="text-[10px] font-label-caps mt-1">{group.mainItem.label}</span>
              </Link>
              {/* Flyout Menu */}
              {group.subItems.length > 0 && (
                <div className="hidden group-hover:flex absolute left-[88px] top-0 bg-surface border border-outline-variant shadow-lg flex-col w-[280px] z-50 transition-all duration-200 rounded-r opacity-0 group-hover:opacity-100 invisible group-hover:visible py-3">
                  {group.label !== "" && (
                    <div className="px-4 py-2 mb-2 border-b border-outline-variant/60 bg-surface-container-low">
                      <span className="text-xs font-label-caps uppercase font-bold tracking-widest text-on-surface-variant">
                        {group.label}
                      </span>
                    </div>
                  )}
                  {group.subItems.map((sub: NavSubItem, sIdx: number): React.JSX.Element => (
                    <div key={sIdx} className={cn("flex flex-col", sIdx > 0 && "mt-3")}>
                      {sub.children !== undefined && sub.children.length > 0 ? (
                        <>
                          {sub.href !== undefined && sub.href !== "" ? (
                            <Link
                              href={sub.href}
                              className="px-4 py-1 text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider hover:text-on-surface transition-colors flex items-center gap-2"
                            >
                              {sub.icon !== undefined && sub.icon !== "" && (
                                <span className="material-symbols-outlined text-[16px]">{sub.icon}</span>
                              )}
                              <span>{sub.label}</span>
                            </Link>
                          ) : (
                            <div className="px-4 py-1 text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider flex items-center gap-2">
                              {sub.icon !== undefined && sub.icon !== "" && (
                                <span className="material-symbols-outlined text-[16px]">{sub.icon}</span>
                              )}
                              <span>{sub.label}</span>
                            </div>
                          )}
                          <div className="flex flex-col mt-1 space-y-0.5">
                            {sub.children.map((child: NavNestedItem, cIdx: number): React.JSX.Element => (
                              <Link
                                key={cIdx}
                                href={child.href}
                                className={cn(
                                  "flex items-center pl-7 pr-4 py-1.5 transition-colors text-sm rounded-r",
                                  child.isActive === true
                                    ? "bg-surface-container-highest text-primary font-medium border-l-3 border-primary"
                                    : "text-on-surface hover:bg-surface-container-high hover:text-on-surface border-l-3 border-transparent"
                                )}
                              >
                                <span>{child.label}</span>
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          className={cn(
                            "flex items-center gap-2 px-4 py-1.5 transition-colors text-sm rounded-r",
                            sub.isActive === true
                              ? "bg-surface-container-highest text-primary font-medium border-l-3 border-primary"
                              : "text-on-surface hover:bg-surface-container-high hover:text-on-surface border-l-3 border-transparent"
                          )}
                          href={sub.href}
                        >
                          {sub.icon !== undefined && sub.icon !== "" && (
                            <span
                              className="material-symbols-outlined text-[18px] text-on-surface-variant"
                              data-icon={sub.icon}
                            >
                              {sub.icon}
                            </span>
                          )}
                          <span>{sub.label}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-sm items-center w-full pt-md border-t border-outline-variant">
          {footerActions.map((action: FooterActionItem, aIdx: number): React.JSX.Element => {
            if (action.href !== undefined && action.href !== "") {
              return (
                <Link
                  key={aIdx}
                  className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] text-on-surface-variant hover:bg-surface-container-high transition-colors rounded"
                  href={action.href}
                  title={action.label}
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    data-icon={action.icon}
                  >
                    {action.icon}
                  </span>
                </Link>
              );
            }
            return (
              <button
                key={aIdx}
                onClick={action.onClick}
                className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] text-on-surface-variant hover:bg-surface-container-high transition-colors rounded cursor-pointer"
                title={action.label}
                type="button"
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  data-icon={action.icon}
                >
                  {action.icon}
                </span>
              </button>
            );
          })}
          {userButtonSlot !== undefined && userButtonSlot !== null && userButtonSlot}
        </div>
      </nav>

      {/* Mobile Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant z-60 md:hidden flex justify-around items-center h-16 transition-all duration-300 ease-in-out">
        {mobileShortcuts.map((item: MobileShortcutItem, index: number): React.JSX.Element => (
          <Link
            key={index}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-colors",
              item.isActive === true
                ? "text-primary bg-surface-container-low font-semibold"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            )}
            href={item.href}
          >
            <span className="material-symbols-outlined" data-icon={item.icon}>
              {item.icon}
            </span>
            <span className="text-[10px] font-label-caps mt-1">{item.label}</span>
          </Link>
        ))}
        <label
          className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
          htmlFor={mobileMenuToggleId}
        >
          <span className="material-symbols-outlined" data-icon="menu">
            menu
          </span>
          <span className="text-[10px] font-label-caps mt-1">Plus</span>
        </label>
      </nav>

      {/* Mobile Bottom Sheet Toggle & Backdrop */}
      <input className="peer hidden" id={mobileMenuToggleId} type="checkbox" />
      <label
        className="fixed inset-0 bg-on-background/50 z-55 hidden cursor-pointer md:hidden peer-checked:block"
        htmlFor={mobileMenuToggleId}
        id="mobile-bottom-sheet-backdrop"
      ></label>

      {/* Mobile Bottom Sheet Menu */}
      <div
        className="fixed bottom-16 left-0 w-full bg-surface border-t border-outline-variant z-55 transform translate-y-full transition-transform duration-300 ease-in-out md:hidden flex flex-col max-h-[70vh] overflow-y-auto pb-4 peer-checked:translate-y-0"
        id="mobile-bottom-sheet"
      >
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto my-3"></div>
        {groups.map((group: NavGroup, gIdx: number): React.JSX.Element => (
          <div key={gIdx} className={cn("px-4 py-2", gIdx > 0 && "border-t border-outline-variant mt-2")}>
            {group.label !== "" && (
              <h3 className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
                {group.label}
              </h3>
            )}
            <div className="flex flex-col gap-2">
              {group.subItems.map((sub: NavSubItem, sIdx: number): React.JSX.Element => (
                <div key={sIdx} className={cn("flex flex-col", sIdx > 0 && "mt-3")}>
                  {sub.children !== undefined && sub.children.length > 0 ? (
                    <>
                      {sub.href !== undefined && sub.href !== "" ? (
                        <Link
                          href={sub.href}
                          className="py-1 text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider flex items-center gap-2"
                        >
                          {sub.icon !== undefined && sub.icon !== "" && (
                            <span className="material-symbols-outlined text-[16px]">{sub.icon}</span>
                          )}
                          <span>{sub.label}</span>
                        </Link>
                      ) : (
                        <div className="py-1 text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider flex items-center gap-2">
                          {sub.icon !== undefined && sub.icon !== "" && (
                            <span className="material-symbols-outlined text-[16px]">{sub.icon}</span>
                          )}
                          <span>{sub.label}</span>
                        </div>
                      )}
                      <div className="flex flex-col pl-4 mt-1 space-y-1">
                        {sub.children.map((child: NavNestedItem, cIdx: number): React.JSX.Element => (
                          <Link
                            key={cIdx}
                            href={child.href}
                            className={cn(
                              "flex items-center p-2 rounded transition-colors text-base",
                              child.isActive === true
                                ? "bg-surface-container-lowest text-primary font-medium border-l-3 border-primary"
                                : "text-on-surface hover:bg-surface-container-low border-l-3 border-transparent"
                            )}
                          >
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      className={cn(
                        "flex items-center gap-3 p-2 rounded transition-colors text-base",
                        sub.isActive === true
                          ? "bg-surface-container-lowest text-primary font-medium border-l-3 border-primary"
                          : "text-on-surface hover:bg-surface-container-low border-l-3 border-transparent"
                      )}
                      href={sub.href}
                    >
                      {sub.icon !== undefined && sub.icon !== "" && (
                        <span
                          className="material-symbols-outlined text-[20px] text-on-surface-variant"
                          data-icon={sub.icon}
                        >
                          {sub.icon}
                        </span>
                      )}
                      <span>{sub.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
