"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function CareersPage() {
  return (
    <>
      <Navbar />
      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full min-h-[614px] flex items-center bg-surface-container-highest overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/careers/hero.png"
              alt="A high-end, modern architectural office interior bathed in natural light."
              fill
              className="object-cover opacity-40 mix-blend-multiply filter grayscale"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-margin w-full flex flex-col gap-sm md:w-2/3">
            <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
              Carrières
            </span>
            <h1 className="font-display text-display text-on-background">
              Rejoignez l&apos;excellence en gestion immobilière
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">
              Chez BailKey, nous construisons l&apos;avenir de la gestion de biens
              avec une précision architecturale. Découvrez nos opportunités et
              participez à l&apos;innovation.
            </p>
            <div className="mt-8">
              <button className="bg-primary text-primary-foreground px-8 py-4 font-body-md text-body-md font-semibold hover:opacity-90 transition-opacity hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-container transition-all">
                Voir les postes ouverts
              </button>
            </div>
          </div>
        </section>
        {/* Values Section */}
        <section className="py-xl px-margin max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="font-h1 text-h1 text-on-background mb-4">
              Notre ADN
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              L&apos;exigence et l&apos;innovation au cœur de chaque ligne de code et de
              chaque interaction client.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Value 1 */}
            <div className="bg-surface border border-outline-variant p-lg flex flex-col gap-4 hover:scale-[1.02] hover:border-primary transition-all duration-300 cursor-default">
              <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "24px" }}
                >
                  lightbulb
                </span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface">Innovation</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Nous repoussons les limites des technologies pour offrir des
                solutions de gestion fluides et prédictives.
              </p>
            </div>
            {/* Value 2 */}
            <div className="bg-surface border border-outline-variant p-lg flex flex-col gap-4 hover:scale-[1.02] hover:border-primary transition-all duration-300 cursor-default">
              <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "24px" }}
                >
                  architecture
                </span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface">Précision</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Chaque détail compte. Nous concevons nos interfaces et nos bases
                de données avec une rigueur architecturale.
              </p>
            </div>
            {/* Value 3 */}
            <div className="bg-surface border border-outline-variant p-lg flex flex-col gap-4 hover:scale-[1.02] hover:border-primary transition-all duration-300 cursor-default">
              <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "24px" }}
                >
                  verified_user
                </span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface">Rigueur</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                La fiabilité est notre promesse. Nos clients gèrent des actifs
                précieux, notre plateforme se doit d&apos;être infaillible.
              </p>
            </div>
          </div>
        </section>
        {/* Open Positions Section */}
        <section className="py-xl px-margin max-w-7xl mx-auto w-full bg-surface-container-low mb-xl border border-outline-variant">
          <div className="mb-12">
            <h2 className="font-h1 text-h1 text-on-background mb-2">
              Postes Ouverts
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Rejoignez nos équipes techniques, commerciales ou support.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {/* Job 1 */}
            <div className="bg-background border border-outline-variant p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary transition-colors group hover:bg-surface-bright hover:shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-primary">
                  TECH
                </span>
                <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary transition-colors">
                  Fullstack Developer Odoo
                </h3>
                <div className="flex gap-4 mt-2 text-on-surface-variant font-body-md text-body-md text-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                    Paris / Remote
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      schedule
                    </span>
                    Temps plein
                  </span>
                </div>
              </div>
              <button className="bg-surface border border-outline-variant text-on-surface px-6 py-3 font-body-md text-body-md font-semibold hover:bg-primary hover:text-primary-foreground transition-colors w-full md:w-auto hover:-translate-y-0.5 hover:shadow-md transition-all">
                Postuler
              </button>
            </div>
            {/* Job 2 */}
            <div className="bg-background border border-outline-variant p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary transition-colors group hover:bg-surface-bright hover:shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-primary">
                  SALES
                </span>
                <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary transition-colors">
                  Business Developer
                </h3>
                <div className="flex gap-4 mt-2 text-on-surface-variant font-body-md text-body-md text-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                    Lyon / Hybride
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      schedule
                    </span>
                    Temps plein
                  </span>
                </div>
              </div>
              <button className="bg-surface border border-outline-variant text-on-surface px-6 py-3 font-body-md text-body-md font-semibold hover:bg-primary hover:text-primary-foreground transition-colors w-full md:w-auto hover:-translate-y-0.5 hover:shadow-md transition-all">
                Postuler
              </button>
            </div>
            {/* Job 3 */}
            <div className="bg-background border border-outline-variant p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary transition-colors group hover:bg-surface-bright hover:shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-primary">
                  CUSTOMER SUCCESS
                </span>
                <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary transition-colors">
                  Customer Success Manager
                </h3>
                <div className="flex gap-4 mt-2 text-on-surface-variant font-body-md text-body-md text-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                    Paris / Hybride
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      schedule
                    </span>
                    Temps plein
                  </span>
                </div>
              </div>
              <button className="bg-surface border border-outline-variant text-on-surface px-6 py-3 font-body-md text-body-md font-semibold hover:bg-primary hover:text-primary-foreground transition-colors w-full md:w-auto hover:-translate-y-0.5 hover:shadow-md transition-all">
                Postuler
              </button>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-xl px-margin max-w-7xl mx-auto w-full text-center border-t border-outline-variant">
          <h2 className="font-h2 text-h2 text-on-background mb-4">
            Vous ne trouvez pas de poste correspondant ?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-2xl mx-auto">
            Nous sommes toujours à la recherche de talents exceptionnels.
            Envoyez-nous votre profil et nous vous contacterons si une
            opportunité se présente.
          </p>
          <button className="bg-secondary text-secondary-foreground border border-outline-variant px-8 py-4 font-body-md text-body-md font-semibold hover:bg-surface-variant transition-colors hover:-translate-y-0.5 hover:shadow-md hover:bg-surface-variant transition-all">
            Envoyer une candidature spontanée
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}
