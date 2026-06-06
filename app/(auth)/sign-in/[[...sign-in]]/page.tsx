"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignInPage(): React.JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-on-surface mb-2 tracking-tight">
          Connexion
        </h1>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          Bienvenue sur l&apos;interface de gestion BailKey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Ex: nom@domaine.com"
            className="h-14 border border-outline-variant bg-surface text-on-surface px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Mot de passe
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Votre mot de passe"
              className="w-full h-14 border border-outline-variant bg-surface text-on-surface px-4 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-on-surface-variant hover:text-on-surface hover:bg-transparent"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 border border-outline-variant bg-surface-bright group-hover:border-primary transition-colors">
              <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer peer" />
              <span className="material-symbols-outlined text-[16px] text-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                check
              </span>
            </div>
            <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
              Rester connecté
            </span>
          </label>
          <Link href="/" className="font-body-md text-sm text-primary hover:underline font-medium transition-colors">
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#2EB1B2] hover:bg-[#269798] text-white"
        >
          <span>Se connecter</span>
          <span className="material-symbols-outlined text-[20px] ml-2">arrow_forward</span>
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="h-px bg-outline-variant/60 flex-1"></div>
        <span className="text-xs font-semibold uppercase text-on-surface-variant tracking-wider">
          Ou
        </span>
        <div className="h-px bg-outline-variant/60 flex-1"></div>
      </div>

      {/* Social Login */}
      <Button
        variant="outline"
        type="button"
        onClick={() => router.push("/dashboard")}
        className="w-full bg-transparent hover:bg-surface-variant/50"
      >
        <svg height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg" className="mr-2">
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
        Se connecter avec Google
      </Button>

      {/* Signup Link */}
      <div className="mt-8 text-center font-body-md text-sm text-on-surface-variant">
        <span>Vous n&apos;avez pas de compte ?</span>
        <Link href="/sign-up" className="font-semibold text-primary hover:underline ml-1.5 transition-colors">
          S&apos;inscrire
        </Link>
      </div>
    </div>
  );
}
