"use client";

import React from "react";

export interface Step1RoleProps {
  selectedRole: "owner" | "tenant" | null;
  onSelectRole: (role: "owner" | "tenant") => void;
  onNext: () => void;
}

export function Step1Role({
  selectedRole,
  onSelectRole,
  onNext,
}: Step1RoleProps): React.JSX.Element {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      {/* Barre de progression locale */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Étape 1 sur 4 : Choix du Rôle
        </span>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-10 bg-primary rounded-full shadow-[0_0_8px_rgba(46,177,178,0.5)]"></div>
          <div className="h-1.5 w-10 bg-surface-variant rounded-full"></div>
          <div className="h-1.5 w-10 bg-surface-variant rounded-full"></div>
          <div className="h-1.5 w-10 bg-surface-variant rounded-full"></div>
        </div>
      </div>

      {/* Titre et description */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-on-surface mb-4">
          Bienvenue sur BailKey !
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-body-md leading-relaxed">
          Pour configurer votre espace sur mesure, dites-nous en plus sur votre
          rôle.
        </p>
      </div>

      {/* Grille de sélection */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Option A : Propriétaire */}
        <button
          type="button"
          onClick={() => onSelectRole("owner")}
          className={`group relative flex flex-col items-center text-center p-10 bg-surface-container-lowest/80 backdrop-blur-md border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
            selectedRole === "owner"
              ? "border-primary bg-primary/5 shadow-[0_10px_30px_rgba(46,177,178,0.15)] scale-[1.02]"
              : "border-outline-variant hover:border-primary/60"
          }`}
        >
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              selectedRole === "owner"
                ? "bg-primary text-on-primary shadow-md"
                : "bg-surface-container text-primary group-hover:bg-primary/10"
            }`}
          >
            <span className="material-symbols-outlined text-[40px]">
              real_estate_agent
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-on-surface mb-2 font-display">
            Je suis Propriétaire / Gestionnaire
          </h3>
          <p className="text-body-md text-on-surface-variant">
            Je souhaite gérer mes biens immobiliers, suivre mes encaissements et
            automatiser ma comptabilité.
          </p>

          {/* Indicateur de sélection */}
          <div
            className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedRole === "owner"
                ? "bg-primary border-primary text-on-primary scale-100"
                : "border-outline-variant opacity-0 group-hover:opacity-50 scale-90"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] font-bold">
              check
            </span>
          </div>
        </button>

        {/* Option B : Locataire */}
        <button
          type="button"
          onClick={() => onSelectRole("tenant")}
          className={`group relative flex flex-col items-center text-center p-10 bg-surface-container-lowest/80 backdrop-blur-md border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
            selectedRole === "tenant"
              ? "border-primary bg-primary/5 shadow-[0_10px_30px_rgba(46,177,178,0.15)] scale-[1.02]"
              : "border-outline-variant hover:border-primary/60"
          }`}
        >
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              selectedRole === "tenant"
                ? "bg-primary text-on-primary shadow-md"
                : "bg-surface-container text-primary group-hover:bg-primary/10"
            }`}
          >
            <span className="material-symbols-outlined text-[40px]">
              person
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-on-surface mb-2 font-display">
            Je suis Locataire
          </h3>
          <p className="text-body-md text-on-surface-variant">
            Je souhaite consulter mon bail, télécharger mes quittances, déclarer
            des incidents et payer mon loyer.
          </p>

          {/* Indicateur de sélection */}
          <div
            className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedRole === "tenant"
                ? "bg-primary border-primary text-on-primary scale-100"
                : "border-outline-variant opacity-0 group-hover:opacity-50 scale-90"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] font-bold">
              check
            </span>
          </div>
        </button>
      </div>

      {/* Bouton Suivant */}
      <div className="w-full max-w-4xl flex justify-end pt-8 border-t border-outline-variant/30">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedRole}
          className={`px-8 py-3.5 font-semibold text-body-md flex items-center gap-2 shadow-sm transition-all duration-300 ${
            selectedRole
              ? "bg-primary text-on-primary hover:opacity-90 shadow-[0_4px_16px_rgba(46,177,178,0.3)] cursor-pointer translate-y-0"
              : "bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed"
          }`}
        >
          <span>Suivant</span>
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
