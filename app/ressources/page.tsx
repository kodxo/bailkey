"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Typage et données pour rendre les cartes dynamiques
type ResourceType = "Tous" | "Guides" | "Études de cas" | "Blog" | "Webinaires";

const resources = [
  {
    id: 1,
    type: "Guides" as ResourceType,
    title: "Optimiser ses charges avec Odoo 19",
    description:
      "Découvrez les meilleures pratiques pour réduire vos coûts opérationnels de 15% grâce aux nouvelles fonctionnalités d'Odoo 19 dédiées à l'immobilier.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgW0bN8LxRSXapTRrXmcR1Ugo8WJKWOYbTgVbSYpYJTH5B0h_WvIXM2T3T8I7wrlqkelsyh4GKcGYXTev7rhQMP1cu0VScz_gwrs33EirkyT2OAeO0aAHW-FjF4Dr3axcz_Jx6gKm7rLYZptS9rB6D3oFSshtWiZZr40vLmLmbZU3dI2JCoxfa-WQCpENZS1VyPIYbmHCxUf7DlKNvlJJlH2aza8OIFAY4_b-a5j4Ui0Zq-uFpop1GRU_NDcGQFfFF9nJRASazQAw",
    tagColor: "bg-primary text-on-primary",
  },
  {
    id: 2,
    type: "Études de cas" as ResourceType,
    title: "Comment l'agence Haussmann a réduit ses impayés de 30%",
    description:
      "Analyse détaillée de la stratégie mise en place par une agence parisienne leader pour automatiser ses relances et sécuriser ses revenus locatifs.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByteUL6tZ6ifwRi1LQMuBYJW4OFbDTXei0dQXfRcJZjf-IVdokGXFsf46CLRE_8Z9SqBAciZzLb8wMsZyaERLagy_WbC11wn28vLfDtD_pP1dMrBj2tI25EAI7mU02Rvt6ZlH-fnixTA3suPfm12TRO2w5NRPNSyImSHAURAld12PVP3GC7mDKFfKKuoRoH7UY3-yfkUvQTdbz2Kf-cktHlwVB2lVOaTDsVjTkmcguv7FdB3oIvlmLgyq0XFVgDpfCtx3awRzyPU0",
    tagColor: "bg-secondary text-on-secondary",
  },
  {
    id: 3,
    type: "Blog" as ResourceType,
    title: "Les nouvelles réglementations de la gestion locative en 2025",
    description:
      "Un tour d'horizon complet des changements législatifs à venir, notamment sur les DPE et l'encadrement des loyers dans les zones tendues.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCn5j45q0fYAR5hRMKlqkQfDb8LGrHVH95QlRhE-lamJeQ2cCzle7yTibVlRTXNedtRDUbg2ee_T8Jd4VrnSOJJKc9-C9TuSLPDVctcLaiaEvbAg25XTKDk0xgO0WmTr04KjAioTYToUFBcJrNi5ceIh97YKeHca9_3k66XMPAteQ6hwjikf9PGcnDr1VxWJButV5y9K5Uzgxx1UpxYgEcE4ynkkY5wvNNYeruxrOxtjTt_9BVHQre2CkQds2A_gdZM4KqD75qGFFU",
    tagColor: "bg-surface text-on-surface border border-outline",
  },
  {
    id: 4,
    type: "Webinaires" as ResourceType,
    title: "Automatisation des baux : gagnez 10h par semaine",
    description:
      "Replay de notre session live montrant comment diviser par 3 le temps passé sur la rédaction et la signature des contrats de location.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtNH8fKOJVlGt6ssu3Pr9LiPimMUwmWT6kPhQ6eOkzKFIXRIPM9wIxr17J6ts_6l4fWomeBw_zA43UYUOpArccLzJaB9InDI8rsu07x_vcyNLc8j9oQsWqjSoxrgHmfvPVVR4I20mg0VIc-g294pif3jMFiS4Z-pXk7cybzUoyQPQzu9RDPLCjVqs015VDp7dEqaxaVNIRXLQPEz8NUeg3TWtXVHzGzoQViLznZfa0wxZJ2bzVF-3r0UlkZk2V2DGchsEojpO-GVE",
    tagColor: "bg-tertiary text-on-tertiary",
  },
];

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<ResourceType>("Tous");

  const filters: ResourceType[] = [
    "Tous",
    "Guides",
    "Études de cas",
    "Blog",
    "Webinaires",
  ];

  // Filtrer les ressources en fonction du bouton actif
  const filteredResources = resources.filter(
    (resource) => activeFilter === "Tous" || resource.type === activeFilter,
  );

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-32 pb-xl px-6 max-w-7xl mx-auto w-full min-h-screen">
        {/* Hero Section */}
        <section className="mb-16 text-center md:text-left">
          <h1 className="font-display text-display text-on-surface mb-4">
            Ressources & Expertise
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Explorez nos guides, études de cas et articles pour optimiser la
            gestion de votre portefeuille immobilier grâce à des stratégies
            éprouvées et des technologies de pointe.
          </p>
        </section>

        {/* Filter Bar */}
        <section className="mb-12 flex flex-wrap gap-2 border-b border-outline-variant/50 pb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-none font-label-caps text-label-caps tracking-widest uppercase transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-on-primary"
                  : "bg-transparent border border-outline text-on-surface hover:bg-surface-variant"
              }`}
            >
              {filter}
            </button>
          ))}
        </section>

        {/* Resources Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {filteredResources.map((resource) => (
            <article
              key={resource.id}
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-none shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="h-48 bg-surface-variant overflow-hidden relative">
                <Image
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={resource.image}
                  fill
                />
                <span
                  className={`absolute top-4 left-4 px-2 py-1 font-label-caps text-label-caps uppercase rounded-none ${resource.tagColor}`}
                >
                  {resource.type}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-h2 text-h2 text-on-surface mb-2">
                  {resource.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                  {resource.description}
                </p>
                <a
                  className="font-h3 text-sm text-primary hover:text-primary-container inline-flex items-center gap-2 font-semibold uppercase tracking-wider transition-colors"
                  href="#"
                >
                  Lire la suite
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter Section */}
        <section className="bg-surface-container border border-outline-variant/50 p-8 rounded-none mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="md:w-1/2">
            <h2 className="font-h1 text-h1 text-on-surface mb-2">
              Restez informé de nos expertises
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Recevez nos dernières publications directement dans votre boîte
              mail.
            </p>
          </div>
          <form
            className="w-full md:w-1/2 flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="flex-grow bg-surface-container-lowest border border-outline rounded-none px-4 py-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-on-surface-variant/50"
              placeholder="Votre adresse email professionnelle"
              type="email"
              required
            />
            <button
              className="bg-primary text-on-primary font-h3 text-sm uppercase tracking-wider px-6 py-3 rounded-none hover:bg-primary/90 transition-colors whitespace-nowrap"
              type="submit"
            >
              S'inscrire
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
