"use client";

import React from "react";

export interface Step2OperationProps {
  operationType: "individual" | "company" | null;
  onSelectOperation: (type: "individual" | "company") => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Operation({
  operationType,
  onSelectOperation,
  onBack,
  onNext,
}: Step2OperationProps): React.JSX.Element {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      {/* Barre de progression locale */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Étape 2 sur 4 : Mode d&apos;opération
        </span>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-10 bg-primary rounded-full"></div>
          <div className="h-1.5 w-10 bg-primary rounded-full shadow-[0_0_8px_rgba(46,177,178,0.5)]"></div>
          <div className="h-1.5 w-10 bg-surface-variant rounded-full"></div>
          <div className="h-1.5 w-10 bg-surface-variant rounded-full"></div>
        </div>
      </div>

      {/* Titre et description */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-on-surface mb-4">
          Comment opérez-vous ?
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-body-md leading-relaxed">
          Sélectionnez le type d&apos;entité qui définit le mieux votre activité
          immobilière.
        </p>
      </div>

      {/* Grille de sélection */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Option 1 : Individu */}
        <button
          type="button"
          onClick={() => onSelectOperation("individual")}
          className={`group relative flex flex-col items-center text-center p-10 bg-surface-container-lowest/80 backdrop-blur-md border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
            operationType === "individual"
              ? "border-primary bg-primary/5 shadow-[0_10px_30px_rgba(46,177,178,0.15)] scale-[1.02]"
              : "border-outline-variant hover:border-primary/60"
          }`}
        >
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              operationType === "individual"
                ? "bg-primary text-on-primary shadow-md"
                : "bg-surface-container text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[40px]">
              person
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-on-surface mb-2 font-display">
            En mon nom propre
          </h3>
          <p className="text-body-md text-on-surface-variant font-medium">
            (Individu / LMNP / Propriétaire particulier)
          </p>

          <div
            className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
              operationType === "individual"
                ? "bg-primary border-primary text-on-primary scale-100"
                : "border-outline-variant opacity-0 group-hover:opacity-50 scale-90"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] font-bold">
              check
            </span>
          </div>
        </button>

        {/* Option 2 : Entreprise */}
        <button
          type="button"
          onClick={() => onSelectOperation("company")}
          className={`group relative flex flex-col items-center text-center p-10 bg-surface-container-lowest/80 backdrop-blur-md border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
            operationType === "company"
              ? "border-primary bg-primary/5 shadow-[0_10px_30px_rgba(46,177,178,0.15)] scale-[1.02]"
              : "border-outline-variant hover:border-primary/60"
          }`}
        >
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              operationType === "company"
                ? "bg-primary text-on-primary shadow-md"
                : "bg-surface-container text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[40px]">
              domain
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-on-surface mb-2 font-display">
            Pour une entreprise
          </h3>
          <p className="text-body-md text-on-surface-variant font-medium">
            (SCI, Agence immobilière, SAS, SARL)
          </p>

          <div
            className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
              operationType === "company"
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

      {/* Boutons d'actions */}
      <div className="w-full max-w-4xl flex items-center justify-between pt-8 border-t border-outline-variant/30">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 font-semibold text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center gap-2 tracking-wide"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          <span>Retour</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!operationType}
          className={`px-8 py-3.5 font-semibold text-body-md flex items-center gap-2 shadow-sm transition-all duration-300 ${
            operationType
              ? "bg-primary text-on-primary hover:opacity-90 shadow-[0_4px_16px_rgba(46,177,178,0.3)] cursor-pointer"
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
