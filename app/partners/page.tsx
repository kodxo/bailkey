"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function PartnerPage() {
  return (
    <>
      <Navbar />
      {/* Main Content */}
      <main className="grow pt-32">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-margin pt-xl pb-xl flex flex-col md:flex-row items-center gap-xl relative z-10">
            <div className="md:w-1/2 flex flex-col items-start text-left z-10">
              <span className="font-label-caps text-label-caps text-primary tracking-wider uppercase mb-base block">
                Programme Partenaires
              </span>
              <h1 className="font-display text-display text-on-surface mb-md">
                Étendons ensemble les limites de la gestion immobilière
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
                Rejoignez l&apos;écosystème BailKey. Associez votre expertise à
                notre technologie pour offrir une expérience de gestion locative
                sans précédent aux professionnels de l&apos;immobilier haut de
                gamme.
              </p>
              <a
                className="bg-primary text-on-primary font-label-caps text-label-caps uppercase py-sm px-lg rounded-none hover:-translate-y-1 hover:shadow-lg transition-all duration-300 inline-flex items-center gap-xs hover:scale-[1.02] hover:brightness-110"
                href="#devenir-partenaire"
              >
                Devenir partenaire
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </a>
            </div>
            <div className="md:w-1/2 w-full h-[500px] relative">
              <Image
                alt="Architectural modern office space"
                className="w-full h-full object-cover rounded-none"
                src="/images/partners-hero.webp"
                width={800}
                height={500}
                priority
              />
              <div className="absolute bottom-md left-md bg-surface/90 backdrop-blur-md p-sm rounded-none border border-outline-variant/30 shadow-lg">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary">
                    handshake
                  </span>
                  <div>
                    <div className="font-label-caps text-label-caps text-on-surface uppercase mb-1">
                      Réseau d&apos;excellence
                    </div>
                    <div className="font-body-md text-sm font-semibold text-on-surface-variant">
                      Rejoignez 500+ partenaires
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none"></div>
        </section>

        {/* Partner Types Section */}
        <section className="py-xl bg-surface px-margin">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-xl">
              <h2 className="font-display text-[40px] leading-tight text-on-surface mb-sm font-semibold">
                Un écosystème conçu pour vous
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Que vous soyez expert technique, consultant ou éditeur de
                logiciels, le programme partenaire BailKey s&apos;adapte à votre
                modèle d&apos;affaires.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Type 1 */}
              <div className="bg-surface-container-lowest p-lg border border-outline-variant/30 hover:border-primary/50 transition-colors group hover:-translate-y-1 hover:shadow-xl  duration-300">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-md group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    integration_instructions
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-base font-semibold group-hover:text-primary transition-colors">
                  Intégrateurs
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  Déployez BailKey chez vos clients. Bénéficiez d&apos;un
                  accompagnement technique dédié et de marges avantageuses sur
                  les licences.
                </p>
                <ul className="space-y-xs font-body-md text-sm text-on-surface-variant mb-lg grow">
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Formation certifiante
                  </li>
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Support technique prioritaire
                  </li>
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Marges récurrentes
                  </li>
                </ul>
              </div>
              {/* Type 2 */}
              <div className="bg-surface-container-lowest p-lg border border-outline-variant/30 hover:border-primary/50 transition-colors group relative hover:-translate-y-1 hover:shadow-xl  duration-300">
                {/* Highlight Badge */}
                <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-caps text-label-caps px-xs py-base translate-x-1/2 -translate-y-1/2 rotate-12 hidden md:block uppercase tracking-wider font-bold">
                  POPULAIRE
                </div>
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-md group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    real_estate_agent
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-base font-semibold group-hover:text-primary transition-colors">
                  Experts Immobiliers
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  Recommandez BailKey à votre réseau. Idéal pour les
                  consultants, auditeurs et réseaux d&apos;agences cherchant à
                  moderniser leurs outils.
                </p>
                <ul className="space-y-xs font-body-md text-sm text-on-surface-variant mb-lg flex-grow">
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Modèle de commissionnement simple
                  </li>
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Kit de recommandation
                  </li>
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Portail partenaire dédié
                  </li>
                </ul>
              </div>
              {/* Type 3 */}
              <div className="bg-surface-container-lowest p-lg border border-outline-variant/30 hover:border-primary/50 transition-colors group hover:-translate-y-1 hover:shadow-xl  duration-300">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-md group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    api
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-base font-semibold group-hover:text-primary transition-colors">
                  Partenaires Technologiques
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  Connectez votre solution à BailKey. Créez des synergies pour
                  offrir une valeur ajoutée unique à nos clients communs.
                </p>
                <ul className="space-y-xs font-body-md text-sm text-on-surface-variant mb-lg flex-grow">
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Accès API étendu
                  </li>
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Environnement de test (Sandbox)
                  </li>
                  <li className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">
                      check
                    </span>
                    Présence dans notre marketplace
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Program Benefits Grid */}
        <section className="py-xl px-margin bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-xl items-center mb-xl">
              <div className="md:w-1/3">
                <h2 className="font-display text-[40px] leading-tight text-on-surface mb-sm font-semibold">
                  Les avantages du programme
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Nous investissons dans la réussite de nos partenaires en
                  fournissant les outils, ressources et soutiens nécessaires
                  pour générer de la croissance.
                </p>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {/* Benefit 1 */}
                <div className="flex gap-sm p-sm border-l-2 border-primary/20 hover:border-primary transition-colors hover:bg-primary/5 duration-200 cursor-default">
                  <span className="material-symbols-outlined text-primary text-2xl mt-1">
                    support_agent
                  </span>
                  <div>
                    <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-xs">
                      Support dédié
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      Un responsable partenaire attitré pour vous accompagner à
                      chaque étape de notre collaboration.
                    </p>
                  </div>
                </div>
                {/* Benefit 2 */}
                <div className="flex gap-sm p-sm border-l-2 border-primary/20 hover:border-primary transition-colors hover:bg-primary/5 duration-200 cursor-default">
                  <span className="material-symbols-outlined text-primary text-2xl mt-1">
                    payments
                  </span>
                  <div>
                    <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-xs">
                      Partage de revenus
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      Un modèle de rémunération attractif et transparent,
                      récompensant votre engagement.
                    </p>
                  </div>
                </div>
                {/* Benefit 3 */}
                <div className="flex gap-sm p-sm border-l-2 border-primary/20 hover:border-primary transition-colors hover:bg-primary/5 duration-200 cursor-default">
                  <span className="material-symbols-outlined text-primary text-2xl mt-1">
                    developer_board
                  </span>
                  <div>
                    <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-xs">
                      Accès technique privilégié
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      Documentation technique complète, accès anticipé aux
                      nouvelles fonctionnalités et API robustes.
                    </p>
                  </div>
                </div>
                {/* Benefit 4 */}
                <div className="flex gap-sm p-sm border-l-2 border-primary/20 hover:border-primary transition-colors hover:bg-primary/5 duration-200 cursor-default">
                  <span className="material-symbols-outlined text-primary text-2xl mt-1">
                    campaign
                  </span>
                  <div>
                    <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-xs">
                      Ressources marketing
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      Kits de communication, études de cas communes et
                      participation à nos événements de l&apos;industrie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-xl px-margin bg-inverse-surface text-inverse-on-surface relative overflow-hidden"
          id="devenir-partenaire"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary to-transparent pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-display text-[40px] leading-tight text-inverse-primary mb-md font-semibold">
              Prêt à construire l&apos;avenir de la gestion immobilière ?
            </h2>
            <p className="font-body-lg text-body-lg text-surface-variant mb-lg">
              Rejoignez le programme partenaire BailKey aujourd&apos;hui et
              commencez à offrir une valeur exceptionnelle à vos clients.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-sm">
              <a
                className="bg-primary text-on-primary font-label-caps text-label-caps uppercase py-sm px-lg rounded-none hover:-translate-y-1 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-center hover:scale-[1.02] hover:brightness-110"
                href="#"
              >
                Devenir partenaire BailKey
              </a>
              <a
                className="bg-transparent border border-outline text-inverse-on-surface font-label-caps text-label-caps uppercase py-sm px-lg rounded-none hover:bg-surface/10 transition-colors duration-300 w-full sm:w-auto text-center hover:border-primary"
                href="#"
              >
                Contacter l&apos;équipe
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
