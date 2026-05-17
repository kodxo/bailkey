import React from "react";

export const metadata = {
  title: "Tableau de bord | BailKey",
  description: "Vue d'ensemble de votre gestion immobilière sur BailKey.",
};

export default function DashboardPage(): React.JSX.Element {
  return (
    <div className="flex-1 p-md space-y-lg w-full max-w-[1600px] mx-auto">
      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* KPI Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Valeur du Portefeuille
              </p>
              <h3 className="font-h1 text-h1 text-on-surface mt-1">
                12.4M FCFA
              </h3>
            </div>
            <div className="bg-primary-container/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-[24px]">
                account_balance
              </span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-primary font-medium flex items-center">
              <span className="material-symbols-outlined text-[16px] mr-1">
                trending_up
              </span>{" "}
              +5.2%
            </span>
            <span className="text-on-surface-variant ml-2 text-xs">
              vs mois dernier
            </span>
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Taux d&apos;Occupation
              </p>
              <h3 className="font-h1 text-h1 text-on-surface mt-1">96.5%</h3>
            </div>
            <div className="bg-accent/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-accent-foreground text-[24px]">
                apartment
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-2 mt-2 relative z-10">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: "96.5%" }}
            ></div>
          </div>
        </div>

        {/* KPI Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Impayés Actifs
              </p>
              <h3 className="font-h1 text-h1 text-on-surface mt-1">
                850k FCFA
              </h3>
            </div>
            <div className="bg-error-container p-2 rounded-lg">
              <span className="material-symbols-outlined text-on-error-container text-[24px]">
                warning
              </span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-error font-medium flex items-center">
              <span className="material-symbols-outlined text-[16px] mr-1">
                trending_down
              </span>{" "}
              -2.1%
            </span>
            <span className="text-on-surface-variant ml-2 text-xs">
              vs mois dernier
            </span>
          </div>
        </div>

        {/* KPI Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Interventions
              </p>
              <h3 className="font-h1 text-h1 text-on-surface mt-1">12</h3>
            </div>
            <div className="bg-tertiary-container/30 p-2 rounded-lg">
              <span className="material-symbols-outlined text-tertiary text-[24px]">
                plumbing
              </span>
            </div>
          </div>
          <div className="text-sm text-on-surface-variant">
            <span className="font-medium text-on-surface">3</span> critiques en
            attente
          </div>
        </div>
      </div>

      {/* Main Features Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Cash Flow Chart Simulation (Span 2) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-md flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-h3 text-h3 text-on-surface font-semibold">
              Flux de Trésorerie
            </h2>
            <select className="bg-surface-container-low border-none text-sm rounded-lg py-1 px-3 focus:ring-primary text-on-surface-variant cursor-pointer">
              <option>Ce mois</option>
              <option>Mois dernier</option>
              <option>Cette année</option>
            </select>
          </div>
          {/* Simulated Chart Area */}
          <div className="flex-1 min-h-[300px] w-full bg-surface-container-low/50 rounded-lg border border-dashed border-outline-variant/50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-around px-4 pb-8 pt-4 gap-2">
              <div className="w-full bg-primary/20 rounded-t-sm h-[40%] relative">
                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[80%]"></div>
              </div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[60%] relative">
                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[90%]"></div>
              </div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[30%] relative">
                <div className="absolute bottom-0 w-full bg-outline-variant rounded-t-sm h-[120%]"></div>
              </div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[70%] relative">
                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[85%]"></div>
              </div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[50%] relative">
                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[70%]"></div>
              </div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[80%] relative">
                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[95%]"></div>
              </div>
            </div>
            <span className="text-on-surface-variant/50 font-medium z-10 bg-surface-container-lowest px-3 py-1 rounded-full shadow-sm text-xs">
              Zone Graphique Interactive
            </span>
          </div>
        </div>

        {/* Recent Activities Panel */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col overflow-hidden">
          <div className="p-md border-b border-outline-variant/30 bg-surface-container-low/30">
            <h2 className="font-h3 text-h3 text-on-surface font-semibold">
              Activités Récentes
            </h2>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[380px]">
            <ul className="divide-y divide-outline-variant/20">
              <li className="p-4 hover:bg-surface-container-lowest transition-colors flex gap-4 items-start">
                <div className="bg-primary-container/20 p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    payments
                  </span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-medium">
                    Loyer encaissé - Apt 4B
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Locataire: Jean Dupont
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Il y a 2 heures
                  </p>
                </div>
                <div className="ml-auto text-sm font-semibold text-primary">
                  +150k
                </div>
              </li>
              <li className="p-4 hover:bg-surface-container-lowest transition-colors flex gap-4 items-start">
                <div className="bg-tertiary-container/20 p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">
                    handyman
                  </span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-medium">
                    Demande de travaux créée
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Fuite d&apos;eau - Résidence Les Palmiers
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Il y a 5 heures
                  </p>
                </div>
              </li>
              <li className="p-4 hover:bg-surface-container-lowest transition-colors flex gap-4 items-start">
                <div className="bg-error-container/30 p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-error text-[20px]">
                    warning
                  </span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-medium">
                    Retard de paiement signalé
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Bail #1042 - Échéance dépassée
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Hier</p>
                </div>
              </li>
              <li className="p-4 hover:bg-surface-container-lowest transition-colors flex gap-4 items-start">
                <div className="bg-surface-container-high p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    description
                  </span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-medium">
                    CRG Généré
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Mois de Septembre cloturé
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Hier</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="p-3 border-t border-outline-variant/30 text-center bg-surface-container-low/30">
            <button
              type="button"
              className="text-sm font-medium text-primary hover:text-primary-fixed-dim transition-colors cursor-pointer"
            >
              Voir tout l&apos;historique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
