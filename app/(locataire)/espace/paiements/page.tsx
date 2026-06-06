"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface TransactionRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: string;
  status: "Payé" | "En attente" | "En retard";
  downloadable: boolean;
}

export default function LocatairePaiementsPage(): React.JSX.Element {
  const [filter, setFilter] = useState<"Tous" | "Payés" | "En attente" | "En retard">("Tous");

  const transactions: TransactionRecord[] = [
    {
      id: "TX-1",
      invoiceNumber: "INV-26-11",
      date: "05 Nov 2026",
      description: "Loyer Novembre 2026",
      amount: "250 000 FCFA",
      status: "En attente",
      downloadable: false,
    },
    {
      id: "TX-2",
      invoiceNumber: "INV-26-10",
      date: "05 Oct 2026",
      description: "Loyer Octobre 2026",
      amount: "250 000 FCFA",
      status: "Payé",
      downloadable: true,
    },
    {
      id: "TX-3",
      invoiceNumber: "FEE-26-09",
      date: "15 Sep 2026",
      description: "Frais de retard - Septembre",
      amount: "15 000 FCFA",
      status: "En retard",
      downloadable: true,
    },
    {
      id: "TX-4",
      invoiceNumber: "INV-26-09",
      date: "05 Sep 2026",
      description: "Loyer Septembre 2026",
      amount: "250 000 FCFA",
      status: "Payé",
      downloadable: true,
    },
  ];

  const filteredTransactions: TransactionRecord[] = transactions.filter((tx) => {
    if (filter === "Tous") return true;
    if (filter === "Payés") return tx.status === "Payé";
    if (filter === "En attente") return tx.status === "En attente";
    if (filter === "En retard") return tx.status === "En retard";
    return true;
  });

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full space-y-10 animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-on-surface tracking-tight">
          Paiements et Factures
        </h1>
        <p className="text-body-lg text-on-surface-variant font-body-md mt-1">
          Gérez votre solde et consultez l&apos;historique de vos transactions.
        </p>
      </div>

      {/* Top Row : Balance Bento Card */}
      <div className="bg-surface border border-outline-variant/40 shadow-md p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10 flex flex-col gap-2">
          <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              account_balance
            </span>
            Solde Actuel
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold font-display text-on-surface tracking-tight">
              250 000
            </span>
            <span className="text-2xl font-bold font-display text-on-surface-variant">
              FCFA
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-error/10 text-error rounded font-bold">
              <span className="material-symbols-outlined text-[14px]">
                warning
              </span>
            </span>
            <span className="text-sm font-semibold text-error font-body-md">
              Échéance : 05 Novembre 2026
            </span>
          </div>
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <Button className="w-full md:w-auto px-8 h-14">
            <span className="material-symbols-outlined text-[20px]">
              payments
            </span>
            Effectuer un paiement
          </Button>
        </div>
      </div>

      {/* Data Panel : Payment History */}
      <div className="bg-surface border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
        {/* Panel Header & Controls */}
        <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-bright">
          <h3 className="text-xl font-bold font-display text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">
              history
            </span>
            Historique des paiements
          </h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1.5 border border-outline-variant/30 overflow-x-auto w-full sm:w-auto">
              {(["Tous", "Payés", "En attente", "En retard"] as const).map(
                (tab): React.JSX.Element => (
                  <Button
                    variant="ghost"
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 h-8 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                      filter === tab
                        ? "bg-surface text-on-surface shadow-sm font-bold"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-transparent"
                    }`}
                  >
                    {tab}
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-md">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-36">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">
                  Montant
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center w-40">
                  Statut
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center w-28">
                  Quittance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredTransactions.map(
                (tx: TransactionRecord): React.JSX.Element => (
                  <tr
                    key={tx.id}
                    className={`hover:bg-surface-container-lowest transition-colors group ${
                      tx.status === "En retard" ? "bg-error/5" : ""
                    }`}
                  >
                    <td className="px-6 py-5 text-sm font-semibold text-on-surface whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-6 py-5">
                      <p
                        className={`text-base font-semibold ${
                          tx.status === "En retard"
                            ? "text-error"
                            : "text-on-surface"
                        }`}
                      >
                        {tx.description}
                      </p>
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1 font-body-md">
                        Facture #{tx.invoiceNumber}
                      </p>
                    </td>
                    <td
                      className={`px-6 py-5 text-base font-extrabold font-display text-right whitespace-nowrap ${
                        tx.status === "En retard"
                          ? "text-error"
                          : "text-on-surface"
                      }`}
                    >
                      {tx.amount}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {tx.status === "En attente" && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-tertiary/10 text-tertiary border border-tertiary/20">
                          <span className="w-1.5 h-1.5 bg-tertiary mr-2 rounded-full animate-pulse"></span>
                          En attente
                        </span>
                      )}
                      {tx.status === "Payé" && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                          <span className="w-1.5 h-1.5 bg-primary mr-2 rounded-full"></span>
                          Payé
                        </span>
                      )}
                      {tx.status === "En retard" && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-error/10 text-error border border-error/20">
                          <span className="w-1.5 h-1.5 bg-error mr-2 rounded-full animate-ping"></span>
                          En retard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {tx.downloadable ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-on-surface-variant hover:text-primary transition-colors p-2"
                          title="Télécharger la quittance"
                        >
                          <span className="material-symbols-outlined text-[22px]">
                            download
                          </span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-outline-variant p-2"
                          title="Non disponible"
                          disabled
                        >
                          <span className="material-symbols-outlined text-[22px]">
                            download
                          </span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-bright">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Affichage de {filteredTransactions.length} sur {transactions.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              title="Page précédente"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              title="Page suivante"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
