"use client";

import React from "react";

export interface CompanyProfileData {
  companyName: string;
  rccm: string;
  niu: string;
  phone: string;
  address: string;
}

export interface Step3CompanyProps {
  data: CompanyProfileData;
  loading?: boolean;
  error?: string;
  onChange: (field: keyof CompanyProfileData, value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.SubmitEvent) => void;
}

export function Step3Company({
  data,
  loading = false,
  error = "",
  onChange,
  onBack,
  onSubmit,
}: Step3CompanyProps): React.JSX.Element {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      {/* Barre de progression locale */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Étape 3 sur 4 : Profil Structure
        </span>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-10 bg-primary rounded-full"></div>
          <div className="h-1.5 w-10 bg-primary rounded-full"></div>
          <div className="h-1.5 w-10 bg-primary rounded-full shadow-[0_0_8px_rgba(46,177,178,0.5)]"></div>
          <div className="h-1.5 w-10 bg-surface-variant rounded-full"></div>
        </div>
      </div>

      {/* Titre et description */}
      <div className="w-full max-w-2xl mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-on-surface mb-3">
          Informations de votre structure
        </h1>
        <p className="text-body-md text-on-surface-variant leading-relaxed">
          Afin de configurer votre environnement de gestion, veuillez renseigner
          les informations administratives de votre entité juridique.
        </p>
      </div>

      {/* Formulaire avec effet Glassmorphism */}
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/60 shadow-[0_32px_64px_-16px_rgba(46,177,178,0.1)] p-8 md:p-12 space-y-8"
      >
        {/* Nom de la société */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="companyName"
            className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            Nom de l&apos;entreprise ou SCI{" "}
            <span className="text-error">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            required
            placeholder="Ex: SCI Les Hautes Pierres"
            value={data.companyName}
            onChange={(e) => onChange("companyName", e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all font-body-md"
          />
        </div>

        {/* RCCM & NIU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="flex flex-col justify-end gap-2">
            <label
              htmlFor="rccm"
              className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant min-h-[2.5rem] flex items-end"
            >
              Numéro d&apos;immatriculation (RCCM / SIREN)
            </label>
            <input
              id="rccm"
              type="text"
              placeholder="Ex: 802 938 475"
              value={data.rccm}
              onChange={(e) => onChange("rccm", e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all font-body-md"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label
              htmlFor="niu"
              className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant min-h-[2.5rem] flex items-end"
            >
              Identifiant Fiscal (NIU / TVA / NIF)
            </label>
            <input
              id="niu"
              type="text"
              placeholder="Ex: FR89802938475"
              value={data.niu}
              onChange={(e) => onChange("niu", e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all font-body-md"
            />
          </div>
        </div>

        {/* Téléphone */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="companyPhone"
            className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            Numéro de téléphone de contact <span className="text-error">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-on-surface-variant material-symbols-outlined text-[20px]">
              call
            </span>
            <input
              id="companyPhone"
              type="tel"
              required
              placeholder="+33 1 23 45 67 89"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all font-body-md"
            />
          </div>
        </div>

        {/* Adresse */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="companyAddress"
            className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            Adresse du siège social <span className="text-error">*</span>
          </label>
          <textarea
            id="companyAddress"
            required
            rows={3}
            placeholder="Numéro, rue, bâtiment, code postal, ville"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all font-body-md resize-none"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-error/10 border border-error/20 text-error rounded text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30">
          <button
            type="button"
            disabled={loading}
            onClick={onBack}
            className="px-6 py-3 font-semibold text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center gap-2 tracking-wide disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
            <span>Retour</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 font-semibold text-body-md bg-primary text-on-primary hover:opacity-90 shadow-sm shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                <span>Finalisation...</span>
              </>
            ) : (
              <>
                <span>Suivant</span>
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
