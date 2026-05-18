"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage(): React.JSX.Element {
  const router = useRouter();
  const [profileType, setProfileType] = useState<"INDIVIDUAL" | "COMPANY">("INDIVIDUAL");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    router.push("/onboarding");
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-on-surface mb-2">
          Créer un compte
        </h1>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          Rejoignez les professionnels de l&apos;immobilier et simplifiez la
          gestion de vos actifs.
        </p>
      </div>

      {/* Social Login */}
      <button
        type="button"
        onClick={() => router.push("/onboarding")}
        className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-surface-container-low text-on-surface font-semibold text-xs tracking-wider uppercase transition-colors border border-outline-variant mb-6 cursor-pointer"
      >
        <svg height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            fill="#FFC107"
          ></path>
          <path
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            fill="#FF3D00"
          ></path>
          <path
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            fill="#4CAF50"
          ></path>
          <path
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            fill="#1976D2"
          ></path>
        </svg>
        S&apos;inscrire avec Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px bg-outline-variant flex-1"></div>
        <span className="text-xs font-semibold uppercase text-on-surface-variant tracking-wider">
          Ou avec email
        </span>
        <div className="h-px bg-outline-variant flex-1"></div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Profile Type Selector */}
        <div className="flex gap-4">
          <label className="flex-1">
            <input
              type="radio"
              name="profile_type"
              checked={profileType === "INDIVIDUAL"}
              onChange={() => setProfileType("INDIVIDUAL")}
              className="peer hidden"
            />
            <div className="h-14 border border-outline-variant flex items-center justify-center cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary font-semibold text-xs tracking-wider uppercase">
              Individuel
            </div>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              name="profile_type"
              checked={profileType === "COMPANY"}
              onChange={() => setProfileType("COMPANY")}
              className="peer hidden"
            />
            <div className="h-14 border border-outline-variant flex items-center justify-center cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary font-semibold text-xs tracking-wider uppercase">
              Entreprise
            </div>
          </label>
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Nom complet
          </label>
          <input
            id="fullName"
            type="text"
            required
            placeholder="Entrez votre nom complet"
            className="h-12 border border-outline-variant bg-surface-bright text-on-surface px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Entrez votre adresse email"
            className="h-12 border border-outline-variant bg-surface-bright text-on-surface px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Mot de passe
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Créez un mot de passe"
              className="w-full h-12 border border-outline-variant bg-surface-bright text-on-surface px-4 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>

          {/* Password Strength Indicator */}
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex gap-1 h-1.5 w-full">
              <div className="flex-1 bg-error/40"></div>
              <div className="flex-1 bg-surface-variant"></div>
              <div className="flex-1 bg-surface-variant"></div>
              <div className="flex-1 bg-surface-variant"></div>
            </div>
            <span className="text-xs text-on-surface-variant">
              Niveau de sécurité faible
            </span>
          </div>
        </div>

        {/* Terms and Privacy Checkbox */}
        <label className="flex items-start gap-3 mt-2 cursor-pointer group">
          <div className="relative flex items-center justify-center w-5 h-5 border border-outline-variant bg-surface-bright group-hover:border-primary mt-0.5 transition-colors">
            <input type="checkbox" required className="opacity-0 absolute inset-0 cursor-pointer peer" />
            <span className="material-symbols-outlined text-[16px] text-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
              check
            </span>
          </div>
          <span className="font-body-md text-sm text-on-surface-variant leading-snug">
            J&apos;accepte les{" "}
            <Link href="/" className="text-primary hover:underline font-medium">
              Conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/" className="text-primary hover:underline font-medium">
              Politique de confidentialité
            </Link>{" "}
            de BailKey.
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="h-12 w-full bg-[#2EB1B2] hover:bg-[#269798] text-white font-semibold text-xs tracking-wider uppercase mt-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          Créer mon compte professionnel
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center font-body-md text-sm text-on-surface-variant">
        <span>Vous avez déjà un compte ?</span>
        <Link href="/sign-in" className="font-semibold text-primary hover:underline ml-1.5 transition-colors">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
