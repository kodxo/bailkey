"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <main className="grow pt-[80px]">
        {/* Hero Section */}
        <section className="relative bg-surface-container-highest overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/about/hero.png"
              alt="A striking architectural perspective of a modern corporate building interior, featuring clean lines, glass panels, and steel structures."
              fill
              className="w-full h-full object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-surface-container-highest via-surface-container-highest/80 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-gutter py-xl md:py-24 lg:py-32 flex flex-col justify-center min-h-[614px]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface glass-border border mb-6">
                <span className="material-symbols-outlined text-primary text-sm">
                  verified
                </span>
                <span className="font-label-caps text-label-caps text-primary tracking-wider uppercase">
                  Édité par KODXO
                </span>
              </div>
              <h1 className="font-display text-display text-on-surface mb-6 leading-tight">
                L&apos;Excellence en Gestion Immobilière
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
                BailKey est une solution de pointe propulsée par Odoo 19, conçue
                pour offrir aux professionnels de l&apos;immobilier un équilibre
                parfait entre vision globale et contrôle opérationnel
                granulaire.
              </p>
              <div className="flex gap-4">
                <button className="bg-primary text-on-primary px-8 py-4 hover:bg-primary-container shadow-sm hover:shadow-md font-medium text-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-300 ">
                  Découvrir nos solutions
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* Notre Mission */}
        <section className="py-xl bg-surface">
          <div className="max-w-7xl mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
              <div className="order-2 lg:order-1 relative">
                <Image
                  src="/images/about/mission.png"
                  alt="A focused professional in a modern, light-filled office analyzing complex data on a high-end digital dashboard."
                  width={800}
                  height={500}
                  className="relative z-10 w-full h-[500px] object-cover shadow-[0_32px_64px_-16px_rgba(46,177,178,0.1)] border border-outline-variant"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-4">
                  Notre Mission
                </h2>
                <h3 className="font-h1 text-h1 text-on-surface mb-6">
                  Simplifier le quotidien des bailleurs
                </h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                  Nous croyons que la gestion immobilière ne devrait pas être
                  synonyme de complexité administrative. Notre mission est
                  d&apos;apporter une précision technologique chirurgicale aux
                  défis quotidiens des professionnels de l&apos;immobilier.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  En automatisant les processus répétitifs et en centralisant
                  les données critiques, BailKey libère un temps précieux pour
                  ce qui compte vraiment : la valorisation de vos actifs et la
                  satisfaction de vos locataires.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Expertise KODXO */}
        <section className="py-xl bg-surface-container">
          <div className="max-w-7xl mx-auto px-gutter">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-4">
                L&apos;Expertise
              </h2>
              <h3 className="font-h1 text-h1 text-on-surface mb-6">
                La puissance de KODXO x Odoo
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Une intégration logicielle sans faille pour une plateforme
                d&apos;une robustesse inégalée, conçue pour les exigences du
                haut de gamme.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-surface p-8 border border-outline-variant shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                  <span
                    className="material-symbols-outlined text-primary text-2xl"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    architecture
                  </span>
                </div>
                <h4 className="font-h3 text-h3 text-on-surface mb-4">
                  Architecture Systémique
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Développé sur le socle Odoo 19, BailKey bénéficie d&apos;une
                  architecture modulaire éprouvée, garantissant scalabilité et
                  performance même pour les portefeuilles les plus denses.
                </p>
              </div>
              {/* Feature Card 2 */}
              <div className="bg-surface p-8 border border-outline-variant shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                  <span
                    className="material-symbols-outlined text-primary text-2xl"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    security
                  </span>
                </div>
                <h4 className="font-h3 text-h3 text-on-surface mb-4">
                  Intégration Sécurisée
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  L&apos;expertise KODXO assure une protection des données sans
                  compromis, avec des protocoles de sécurité de niveau
                  entreprise et une traçabilité complète des opérations.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Valeurs */}
        <section className="py-xl bg-surface relative overflow-hidden">
          {/* Background decorative element */}
          <div className="absolute right-0 top-0 w-1/3 h-full bg-surface-container-highest/30 transform skew-x-12 translate-x-1/4 z-0"></div>
          <div className="max-w-7xl mx-auto px-gutter relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-h1 text-h1 text-on-surface">
                Nos Valeurs Fondamentales
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="glass-panel p-8 text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 transition-all duration-500 cursor-default">
                <div className="w-16 h-16 rounded-none bg-primary flex items-center justify-center mb-6 shadow-sm">
                  <span
                    className="material-symbols-outlined text-on-primary text-3xl"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    straighten
                  </span>
                </div>
                <h4 className="font-h3 text-h3 text-on-surface mb-3">
                  Rigueur
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Une approche systématique et méthodique dans chaque ligne de
                  code et chaque fonctionnalité que nous déployons.
                </p>
              </div>
              {/* Value 2 */}
              <div className="glass-panel p-8 text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 transition-all duration-500 cursor-default">
                <div className="w-16 h-16 rounded-none bg-primary flex items-center justify-center mb-6 shadow-sm">
                  <span
                    className="material-symbols-outlined text-on-primary text-3xl"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    lightbulb
                  </span>
                </div>
                <h4 className="font-h3 text-h3 text-on-surface mb-3">
                  Innovation
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  L&apos;utilisation des dernières avancées technologiques pour
                  anticiper et résoudre les défis de la gestion moderne.
                </p>
              </div>
              {/* Value 3 */}
              <div className="glass-panel p-8 text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 transition-all duration-500 cursor-default">
                <div className="w-16 h-16 rounded-none bg-primary flex items-center justify-center mb-6 shadow-sm">
                  <span
                    className="material-symbols-outlined text-on-primary text-3xl"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    my_location
                  </span>
                </div>
                <h4 className="font-h3 text-h3 text-on-surface mb-3">
                  Précision
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Des données exactes, des tableaux de bord clairs, et des
                  outils conçus pour une exactitude chirurgicale.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-xl bg-primary-container relative">
          <div className="max-w-4xl mx-auto px-gutter text-center relative z-10">
            <h2 className="font-h1 text-h1 text-on-primary-container mb-6">
              Prêt à transformer votre gestion immobilière ?
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container/80 mb-10">
              Rejoignez les professionnels qui font confiance à
              l&apos;architecture de précision de BailKey.
            </p>
            <button className="bg-surface text-primary px-8 py-4 hover:bg-surface-bright transition-all duration-200 shadow-sm hover:shadow-md font-bold text-lg inline-flex items-center gap-2 border border-transparent hover:scale-[1.02] active:scale-95">
              Découvrir nos solutions
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          {/* Geometric accent */}
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t-2 border-r-2 border-on-primary/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-b-2 border-l-2 border-on-primary/20"></div>
        </section>
      </main>
    </>
  );
}
