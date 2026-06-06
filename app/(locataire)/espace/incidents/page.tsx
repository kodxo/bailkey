import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Maintenance et Requêtes - Espace Locataire | BailKey",
  description: "Gérez vos demandes d'intervention technique et suivez l'avancement des réparations.",
};

interface IncidentRequest {
  id: string;
  reference: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  status: "En cours" | "Planifié" | "Résolu";
}

export default function LocataireIncidentsPage(): React.JSX.Element {
  const activeIncidents: IncidentRequest[] = [
    {
      id: "INC-1",
      reference: "#REQ-1042",
      date: "12 Octobre 2026",
      title: "Fuite sous l'évier de la cuisine",
      description: "L'eau goutte continuellement sous l'évier, formant une flaque.",
      icon: "plumbing",
      status: "En cours",
    },
    {
      id: "INC-2",
      reference: "#REQ-1045",
      date: "15 Octobre 2026",
      title: "Prise défectueuse au salon",
      description: "La prise murale près de la fenêtre ne fournit plus de courant.",
      icon: "electrical_services",
      status: "Planifié",
    },
  ];

  const historyIncidents: IncidentRequest[] = [
    {
      id: "INC-3",
      reference: "#REQ-0988",
      date: "05 Septembre 2026",
      title: "Révision du chauffage",
      description: "Contrôle annuel de la chaudière et purge des radiateurs.",
      icon: "hvac",
      status: "Résolu",
    },
    {
      id: "INC-4",
      reference: "#REQ-0812",
      date: "12 Juillet 2026",
      title: "Remplacement badge accès",
      description: "Délivrance d'un nouveau badge magnétique pour le hall.",
      icon: "key",
      status: "Résolu",
    },
  ];

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full space-y-10 animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-outline-variant/20">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-on-surface tracking-tight">
            Maintenance et Requêtes
          </h1>
          <p className="text-body-lg text-on-surface-variant font-body-md mt-1">
            Gérez vos demandes d&apos;intervention et suivez leur résolution.
          </p>
        </div>
        <Link
          href="/locataire/incidents/nouveau"
          className="bg-primary text-on-primary hover:opacity-90 flex items-center justify-center gap-2 px-8 py-4 font-semibold text-sm transition-all shadow-md active:scale-95 shrink-0 text-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Signaler un incident</span>
        </Link>
      </div>

      {/* Layout Grid : Bento Style */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column : Active Requests (Spans 2 cols) */}
        <section className="xl:col-span-2 flex flex-col gap-6 font-body-md">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <h2 className="text-xl font-bold font-display text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">
                pending_actions
              </span>
              Requêtes en cours
            </h2>
            <span className="text-xs font-bold bg-surface-container-high text-on-surface-variant px-3 py-1 uppercase tracking-wider">
              {activeIncidents.length} Active(s)
            </span>
          </div>

          <div className="space-y-4">
            {activeIncidents.map(
              (incident: IncidentRequest): React.JSX.Element => (
                <article
                  key={incident.id}
                  className="bg-surface border border-outline-variant/30 p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <div className="flex items-start sm:items-center gap-5">
                    <div className="h-14 w-14 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[28px]">
                        {incident.icon}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        <span>{incident.reference}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                        <span>{incident.date}</span>
                      </div>
                      <h3 className="text-lg font-bold font-display text-on-surface">
                        {incident.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                        {incident.description}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 self-start sm:self-auto mt-2 sm:mt-0">
                    {incident.status === "En cours" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        En cours
                      </div>
                    )}
                    {incident.status === "Planifié" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px]">
                          calendar_today
                        </span>
                        Planifié
                      </div>
                    )}
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        {/* Right Column : History List */}
        <aside className="xl:col-span-1 flex flex-col gap-6 font-body-md">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <h2 className="text-xl font-bold font-display text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
                history
              </span>
              Historique
            </h2>
            <Button variant="ghost" className="text-primary hover:bg-primary/5 hover:text-primary text-xs font-bold uppercase tracking-wider transition-colors">
              Tout voir
            </Button>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/20 flex flex-col overflow-hidden shadow-sm divide-y divide-outline-variant/20">
            {historyIncidents.map(
              (item: IncidentRequest): React.JSX.Element => (
                <div
                  key={item.id}
                  className="p-5 flex items-start gap-4 hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 bg-surface flex items-center justify-center shrink-0 border border-outline-variant/30 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      <span>{item.reference}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-base text-on-surface font-semibold mt-1">
                      {item.title}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">
                        check_circle
                      </span>
                      <span>Résolu</span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
