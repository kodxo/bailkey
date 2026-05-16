"use client";

import { useState } from "react";

// Composant réutilisable pour la FAQ
const FAQItem = ({
  question,
  answer,
  isOpenInitial = false,
}: {
  question: string;
  answer: string;
  isOpenInitial?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(isOpenInitial);

  return (
    <div className="border border-outline-variant p-6 rounded-none bg-surface">
      <h3
        className="font-h3 text-h3 text-on-surface mb-2 flex justify-between items-center cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span
          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </h3>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-outline-variant/50" : "grid-rows-[0fr] opacity-0"}`}
      >
        <p className="font-body-md text-body-md text-on-surface-variant overflow-hidden">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  // Calcul du prix Pro (Exemple: 20% de réduction en annuel)
  const proPriceMonthly = 15000;
  const proPriceAnnual = proPriceMonthly * 12 * 0.8; // 144 000 FCFA/an

  return (
    <>
      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="px-6 max-w-7xl mx-auto text-center mb-16">
          <h1 className="font-display text-display text-on-background mb-4 max-w-4xl mx-auto tracking-tight">
            Une tarification transparente pour votre patrimoine.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
            Choisissez le plan adapté à vos besoins de gestion locative.
          </p>

          {/* Toggle Mensuel / Annuel */}
          <div className="inline-flex items-center bg-surface-container p-1 rounded-none border border-outline-variant transition-colors">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 font-body-md font-medium rounded-none transition-all ${!isAnnual ? "bg-background shadow-sm text-on-background" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 font-body-md font-medium rounded-none flex items-center gap-2 transition-all ${isAnnual ? "bg-background shadow-sm text-on-background" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Annuel
              <span className="bg-tertiary-container text-on-tertiary-container font-label-caps text-label-caps px-2 py-0.5 rounded-none">
                Économisez 20%
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 max-w-7xl mx-auto pb-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="bg-surface border border-outline-variant p-8 flex flex-col rounded-none relative transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-8">
                <h3 className="font-h3 text-h3 text-on-surface mb-2">
                  Starter
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant min-h-[48px]">
                  Idéal pour démarrer avec un petit portefeuille immobilier.
                </p>
              </div>
              <div className="mb-8">
                <span className="font-display text-display text-on-background">
                  Gratuit
                </span>
              </div>
              <button className="w-full border-2 border-primary text-primary font-body-md font-semibold py-3 rounded-none mb-8 hover:bg-primary/5 transition-colors">
                Commencer
              </button>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Gestion des Baux
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Quittances de Loyer
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Tableau de Bord Basique
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Nombre Max de Biens: 3
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Nombre Max d&apos;Utilisateurs: 1
                  </span>
                </li>
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-background border-2 border-primary p-8 flex flex-col rounded-none relative shadow-[0_32px_64px_-16px_rgba(26,101,112,0.15)] transform md:-translate-y-4 transition-transform hover:-translate-y-5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary font-label-caps px-4 py-1 rounded-none">
                LE PLUS POPULAIRE
              </div>
              <div className="mb-8 mt-4">
                <h3 className="font-h3 text-h3 text-on-background mb-2">Pro</h3>
                <p className="font-body-md text-body-md text-on-surface-variant min-h-[48px]">
                  Pour les gestionnaires professionnels — toutes les
                  automatisations incluses.
                </p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="font-display text-display text-on-background">
                  {isAnnual
                    ? (proPriceAnnual / 12).toLocaleString("fr-FR")
                    : proPriceMonthly.toLocaleString("fr-FR")}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  {" "}
                  FCFA/mois
                </span>
              </div>
              {isAnnual && (
                <div className="text-sm text-primary font-medium -mt-6 mb-6">
                  Facturé {proPriceAnnual.toLocaleString("fr-FR")} FCFA par an
                </div>
              )}
              <button className="w-full bg-primary text-on-primary font-body-md font-semibold py-3 rounded-none mb-8 hover:shadow-lg transition-shadow">
                Essai Gratuit 14 Jours
              </button>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Gestion des Baux & Quittances
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Relances & Facturation Auto
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    GED Complète
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Tableau de Bord Avancé & CRG
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Nombre Max de Biens: 20
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Nombre Max d&apos;Utilisateurs: 3
                  </span>
                </li>
              </ul>
            </div>

            {/* Agence */}
            <div className="bg-surface-container-low border border-outline-variant p-8 flex flex-col rounded-none relative transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-8">
                <h3 className="font-h3 text-h3 text-on-surface mb-2">Agence</h3>
                <p className="font-body-md text-body-md text-on-surface-variant min-h-[48px]">
                  Solution complète pour les agences immobilières — sur devis,
                  biens illimités.
                </p>
              </div>
              <div className="mb-8">
                <span className="font-h2 text-h2 text-on-background">
                  Sur devis
                </span>
              </div>
              <button className="w-full bg-on-surface text-background font-body-md font-semibold py-3 rounded-none mb-8 hover:bg-on-surface-variant transition-colors">
                Contacter les ventes
              </button>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Toutes les fonctionnalités Pro
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    API & Intégrations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Multi-Utilisateurs & Support Prioritaire
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                  <span className="font-body-md text-on-surface">
                    Onboarding Dédié
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="bg-surface-container-low py-24 border-t border-outline-variant">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-h2 text-h2 text-center text-on-background mb-12">
              Comparaison détaillée des fonctionnalités
            </h2>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-outline-variant">
                    <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant w-1/4 uppercase tracking-wider">
                      Fonctionnalité
                    </th>
                    <th className="py-4 px-4 font-h3 text-h3 text-on-background w-1/4 text-center">
                      Starter
                    </th>
                    <th className="py-4 px-4 font-h3 text-h3 text-on-background w-1/4 text-center bg-primary/5 border-b-2 border-primary">
                      Pro
                    </th>
                    <th className="py-4 px-4 font-h3 text-h3 text-on-background w-1/4 text-center">
                      Agence
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  {/* Fonctionnalités de base */}
                  <tr className="bg-surface-container">
                    <td
                      className="py-3 px-4 font-h3 text-h3 text-on-background border-b border-outline-variant"
                      colSpan={4}
                    >
                      Fonctionnalités Clés
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface transition-colors">
                    <td className="py-4 px-4 text-on-surface">
                      Nombre Max de Biens
                    </td>
                    <td className="py-4 px-4 text-center text-on-surface-variant">
                      3
                    </td>
                    <td className="py-4 px-4 text-center text-on-background font-medium bg-primary/5">
                      20
                    </td>
                    <td className="py-4 px-4 text-center text-on-surface-variant">
                      Illimités
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface transition-colors">
                    <td className="py-4 px-4 text-on-surface">
                      Gestion des Baux
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="material-symbols-outlined text-primary">
                        check
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center bg-primary/5">
                      <span className="material-symbols-outlined text-primary">
                        check
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="material-symbols-outlined text-primary">
                        check
                      </span>
                    </td>
                  </tr>

                  {/* Automatisations */}
                  <tr className="bg-surface-container">
                    <td
                      className="py-3 px-4 font-h3 text-h3 text-on-background border-b border-outline-variant mt-4"
                      colSpan={4}
                    >
                      Automatisations & GED
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface transition-colors">
                    <td className="py-4 px-4 text-on-surface">
                      Relances Automatiques
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="material-symbols-outlined text-outline-variant">
                        remove
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center bg-primary/5">
                      <span className="material-symbols-outlined text-primary">
                        check
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="material-symbols-outlined text-primary">
                        check
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface transition-colors">
                    <td className="py-4 px-4 text-on-surface">GED Complète</td>
                    <td className="py-4 px-4 text-center">
                      <span className="material-symbols-outlined text-outline-variant">
                        remove
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center bg-primary/5">
                      <span className="material-symbols-outlined text-primary">
                        check
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="material-symbols-outlined text-primary">
                        check
                      </span>
                    </td>
                  </tr>

                  {/* Entreprise */}
                  <tr className="bg-surface-container">
                    <td
                      className="py-3 px-4 font-h3 text-h3 text-on-background border-b border-outline-variant mt-4"
                      colSpan={4}
                    >
                      Fonctions Agence
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface transition-colors">
                    <td className="py-4 px-4 text-on-surface">
                      API & Intégrations
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="material-symbols-outlined text-outline-variant">
                        remove
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center bg-primary/5">
                      <span className="material-symbols-outlined text-outline-variant">
                        remove
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="material-symbols-outlined text-primary">
                        check
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-h2 text-h2 text-on-background mb-4">
              Questions Fréquentes
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Tout ce que vous devez savoir sur notre tarification.
            </p>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="Comment fonctionne l'intégration Odoo 19 ?"
              answer="L'intégration Odoo 19, disponible dans le plan Entreprise, permet une synchronisation bidirectionnelle en temps réel de vos données locatives avec votre système comptable global, assurant une intégrité totale des données."
              isOpenInitial={true}
            />
            <FAQItem
              question="Mes données sont-elles sécurisées ?"
              answer="Absolument. Nous utilisons un chiffrement de bout en bout et nos bases de données PostgreSQL sont hébergées de manière sécurisée en stricte conformité."
            />
            <FAQItem
              question="Proposez-vous une assistance à la configuration ?"
              answer="Oui, pour les plans Agence et Entreprise, un expert dédié vous accompagne lors de l'onboarding pour configurer vos accès et importer vos données existantes."
            />
          </div>
        </section>
      </main>
    </>
  );
}
