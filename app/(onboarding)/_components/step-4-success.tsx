"use client";

import React from "react";

export interface Step4SuccessProps {
  role: "owner" | "tenant" | null;
  operationType: "individual" | "company" | null;
  entityName: string;
  onFinish: () => void;
}

export function Step4Success({
  role,
  operationType,
  entityName,
  onFinish,
}: Step4SuccessProps): React.JSX.Element {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      {/* Barre de progression locale */}
      <div className="w-full flex items-center justify-between mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Étape 4 sur 4 : Configuration terminée
        </span>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-10 bg-primary rounded-full"></div>
          <div className="h-1.5 w-10 bg-primary rounded-full"></div>
          <div className="h-1.5 w-10 bg-primary rounded-full"></div>
          <div className="h-1.5 w-10 bg-primary rounded-full shadow-[0_0_8px_rgba(46,177,178,0.5)]"></div>
        </div>
      </div>

      {/* Conteneur de succès avec Glassmorphism */}
      <div className="w-full bg-surface border border-outline-variant/60 shadow-lg p-10 md:p-14 flex flex-col items-center text-center">
        {/* Icône de succès */}
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
          <span
            className="material-symbols-outlined text-primary text-[56px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        <h1 className="text-4xl font-bold font-display text-on-surface mb-3">
          Tout est prêt !
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-10 leading-relaxed font-body-md">
          Vos informations ont été enregistrées avec succès. Votre environnement
          de gestion professionnelle est maintenant entièrement configuré.
        </p>

        {/* Récapitulatif */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant/40 p-6 mb-10 flex flex-col gap-4 text-left shadow-sm">
          <h3 className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
            Récapitulatif de votre compte
          </h3>

          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-[28px]">
              {role === "owner" ? "real_estate_agent" : "person"}
            </span>
            <div className="flex flex-col">
              <span className="text-body-md font-semibold text-on-surface font-display">
                {role === "owner"
                  ? "Espace Propriétaire / Bailleur"
                  : "Espace Locataire"}
              </span>
              <span className="text-xs text-on-surface-variant capitalize">
                Compte :{" "}
                {operationType === "company"
                  ? "Structure (SCI/Entreprise)"
                  : "Particulier"}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-outline-variant/30"></div>

          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-[28px]">
              {operationType === "company" ? "domain" : "account_circle"}
            </span>
            <div className="flex flex-col">
              <span className="text-body-md font-semibold text-on-surface font-display">
                {entityName || "Profil Principal"}
              </span>
              <span className="text-xs text-on-surface-variant">
                Identité administrative enregistrée
              </span>
            </div>
          </div>
        </div>

        {/* Bouton principal pour accéder au dashboard */}
        <button
          type="button"
          onClick={onFinish}
          className="w-full py-4 px-8 bg-primary text-on-primary font-semibold text-body-lg shadow-md shadow-primary/25 hover:opacity-90 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>Accéder à mon espace</span>
          <span className="material-symbols-outlined text-[24px]">
            arrow_forward
          </span>
        </button>

        <p className="mt-8 text-xs text-on-surface-variant/80 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>Vos données sont sécurisées et chiffrées de bout en bout.</span>
        </p>
      </div>
    </div>
  );
}
