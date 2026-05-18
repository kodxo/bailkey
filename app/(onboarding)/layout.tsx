import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Bienvenue sur BailKey | Configuration de votre compte",
  description: "Finalisez la configuration de votre espace de gestion immobilière BailKey en quelques étapes simples.",
};

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default async function OnboardingLayout({
  children,
}: OnboardingLayoutProps): Promise<React.JSX.Element> {
  const authObject = await auth();
  const metadata = authObject.sessionClaims?.metadata;
  const onboardingComplete: boolean = !!metadata?.onboardingComplete;
  const role = metadata?.role;

  if (onboardingComplete) {
    if (role === "tenant") {
      redirect("/locataire/dashboard");
    } else if (role === "super_admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body-md relative overflow-hidden transition-all duration-300">
      {/* Effet d'arrière-plan avec cercles flous */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* En-tête minimaliste */}
      <header className="w-full px-8 py-6 sticky top-0 z-40 backdrop-blur-md bg-surface/80 border-b border-outline-variant/30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Logo height={32} priority />
          </Link>
          <span className="hidden md:inline-block px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Configuration
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span>Besoin d&apos;aide ?</span>
          </Link>
          <div className="h-4 w-px bg-outline-variant/40"></div>
          <UserButton />
        </div>
      </header>

      {/* Zone centrale de contenu (Écrans d'onboarding) */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 py-12 md:py-16 z-10">
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Pied de page minimaliste */}
      <footer className="w-full py-6 px-8 border-t border-outline-variant/30 bg-surface-container-lowest/50 text-center flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant z-10">
        <p>© 2026 BailKey Asset Management. Tous droits réservés.</p>
        <div className="flex items-center gap-6">
          <Link href="/contact" className="hover:text-primary transition-colors">
            Support
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Confidentialité
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Conditions d&apos;utilisation
          </Link>
        </div>
      </footer>
    </div>
  );
}
