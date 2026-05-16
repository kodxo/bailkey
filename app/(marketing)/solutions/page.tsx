/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

export default function SolutionsPage() {
  return (
    <>
      <main className="pt-[88px]">
        {/* Hero Section */}
        <section className="relative bg-surface-container-lowest border-b border-outline-variant/50 py-24 px-6 lg:px-12 overflow-hidden flex items-center min-h-[716px]">
          {/* Architectural grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          ></div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="flex flex-col gap-6">
              <span className="font-label-caps text-label-caps text-primary uppercase">
                Architecture Institutionnelle
              </span>
              <h1 className="font-display text-display text-on-surface">
                Des solutions sur-mesure pour chaque bailleur.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Alliez efficacité opérationnelle et précision architecturale
                dans la gestion de votre parc immobilier. Une vision holistique
                pour un contrôle granulaire.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <button className="bg-primary text-on-primary font-h3 text-h3 px-8 py-3 hover:bg-primary-container hover:text-on-primary-container transition-all hover:shadow-lg">
                  Découvrir Odoo 19
                </button>
                <button className="border border-outline text-on-surface font-h3 text-h3 px-8 py-3 hover:bg-surface-container transition-all">
                  Voir l'Architecture
                </button>
              </div>
            </div>

            <div className="relative h-[500px] w-full shadow-2xl bg-surface-container border border-outline-variant/50">
              <Image
                alt="Façade de bâtiment en verre moderne"
                className="w-full h-full object-cover grayscale-20 contrast-[1.1]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF0ouT2rMGlbbWFQDjetX0rAyvrbM_-7cfZW8yL7x9FTQmXglB8GPmHUL-SRvYJcMIdHgAPmTpnRuxM-X7zh1Bn0zctpXyn9ifm5LmnQsbaJ8nkA8HX244If7vgyxXNvFR0s9WQ_9Wcyq171aHkzkoMroLI4DGV6XQlZ7IApiNyQ2Ddj95EKbVb79OwKQcnd-vtUHpgwe3jTkhgNYq40yeVM2eRVJspBwn9qAA4xkqEXH36SRSozWiTibQDH_ENej-3IxsfE6_uU4"
                fill
                priority
              />
              {/* Floating Data Card */}
              <div className="absolute bottom-8 -left-8 glass-panel p-6 border-l-4 border-l-primary w-72">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    Taux d'occupation
                  </span>
                  <span className="material-symbols-outlined text-primary">
                    show_chart
                  </span>
                </div>
                <div className="font-h1 text-h1 text-on-surface">98.4%</div>
                <div className="w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent my-4"></div>
                <div className="font-body-md text-body-md text-on-surface-variant text-sm">
                  +1.2% ce trimestre
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Gestion des Baux */}
        <section className="py-24 px-6 lg:px-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="font-h2 text-h2 text-on-surface mb-4">
                  Gestion des Baux & Automatisation
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  La fondation de votre architecture de gestion. Centralisez,
                  automatisez et sécurisez l'ensemble du cycle de vie de vos
                  contrats de location avec Odoo 19.
                </p>
              </div>
              <span className="font-label-caps text-label-caps text-primary border border-primary px-4 py-2 uppercase tracking-widest whitespace-nowrap">
                Module Odoo 19
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant/50 p-8 hover:-translate-y-1 transition-transform duration-300 group shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-3">
                  Contrats Intelligents
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Génération dynamique de baux commerciaux et d'habitation,
                  signatures électroniques intégrées.
                </p>
                <div className="mt-6 w-8 h-1 bg-primary group-hover:w-full transition-all duration-500"></div>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant/50 p-8 hover:-translate-y-1 transition-transform duration-300 group shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">
                    receipt_long
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-3">
                  Quittances Automatisées
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Émission et envoi planifiés des avis d'échéance et quittances.
                  Historique traçable.
                </p>
                <div className="mt-6 w-8 h-1 bg-primary group-hover:w-full transition-all duration-500"></div>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-surface-container-lowest border border-outline-variant/50 p-8 hover:-translate-y-1 transition-transform duration-300 group shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface mb-3">
                  Indexation ILAT/ICC
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Calcul automatique des révisions de loyer basées sur les
                  indices de référence officiels.
                </p>
                <div className="mt-6 w-8 h-1 bg-primary group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Suivi Financier (Bento Layout) */}
        <section className="py-24 px-6 lg:px-12 bg-surface-container-lowest border-y border-outline-variant/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="font-h2 text-h2 text-on-surface mb-4">
                Suivi Financier & Trésorerie
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Une visibilité chirurgicale sur les flux de trésorerie. De
                l'encaissement au traitement des moratoires, gardez le contrôle
                total.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
              {/* Bento Large Image */}
              <div className="md:col-span-2 md:row-span-2 relative bg-surface-container border border-outline-variant/50 overflow-hidden">
                <Image
                  alt="Tableau de bord financier"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8kPcKu1oiKoIQ06mQB3l_1lIxWQlNRSORyF-v2OgQj3QqRPWtu-gW1PYjESLygeBNYMAePgOzCbc-Y4IiItDEaEUy5LZ17BV0J1hpM9HtjA2b4ci6k8dxS1OI21h4obxcgLpLdT-a0C1zAoBMy1H0ao3sjy0dOJ7GNhaWdVvvqevHMLQ6tOKXPRBqCqKQUz4yDI7pg1jmZkSXbcNL_suElNMxBLq_2G6C5-gE7HnX6h2G_gF7pIgrr44FbEWV6ukSJbj-q6fy2yc"
                  fill
                />
                <div className="absolute inset-0 bg-linear-to-t from-surface-container-highest to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="font-label-caps text-label-caps text-primary mb-2">
                    Module Cashbox
                  </div>
                  <h3 className="font-h2 text-h2 text-on-surface">
                    Rapprochement Bancaire
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 bg-surface/80 p-2 backdrop-blur-sm inline-block">
                    Synchronisation en temps réel avec vos comptes de gestion.
                  </p>
                </div>
              </div>

              {/* Bento Small 1 */}
              <div className="md:col-span-2 md:row-span-1 bg-surface-container-lowest border border-outline-variant/50 p-6 flex flex-col justify-center shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-error/10 text-error flex items-center justify-center shrink-0 rounded-full">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div>
                    <h3 className="font-h3 text-h3 text-on-surface mb-2">
                      Gestion des Impayés
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Workflows de relance automatisés et transmission au
                      contentieux.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bento Small 2 */}
              <div className="md:col-span-1 md:row-span-1 bg-primary text-on-primary p-6 flex flex-col justify-between shadow-sm">
                <span className="material-symbols-outlined text-3xl opacity-80">
                  account_balance
                </span>
                <div>
                  <div className="font-h1 text-h1">2.4M€</div>
                  <div className="font-label-caps text-label-caps mt-1 opacity-80">
                    Encaissements Mensuels
                  </div>
                </div>
              </div>

              {/* Bento Small 3 */}
              <div className="md:col-span-1 md:row-span-1 bg-surface-container-lowest border border-outline-variant/50 p-6 flex flex-col justify-center shadow-sm">
                <h3 className="font-h3 text-h3 text-on-surface mb-2">
                  Moratoires
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                  Échéanciers structurés et suivi des paiements partiels.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Maintenance & Opérations */}
        <section className="py-24 px-6 lg:px-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative p-8 bg-surface-container border border-outline-variant/50">
                {/* Technical diagram representation */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-surface border-l-2 border-primary shadow-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">
                      engineering
                    </span>
                    <div className="flex-1">
                      <div className="font-label-caps text-label-caps text-on-surface">
                        Intervention Plomberie - Bât. A
                      </div>
                      <div className="font-body-md text-body-md text-on-surface-variant text-sm">
                        Prestataire: Aquatech SAS
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-primary-container text-on-primary-container text-xs font-semibold">
                      En cours
                    </span>
                  </div>

                  <div className="w-full h-px bg-linear-to-r from-transparent via-outline-variant/50 to-transparent"></div>

                  <div className="flex items-center gap-4 p-4 bg-surface border-l-2 border-outline shadow-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">
                      hvac
                    </span>
                    <div className="flex-1">
                      <div className="font-label-caps text-label-caps text-on-surface">
                        Maintenance CVC Annuelle
                      </div>
                      <div className="font-body-md text-body-md text-on-surface-variant text-sm">
                        Planifiée: 12 Nov 2024
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-surface-container-high text-on-surface text-xs font-semibold">
                      À venir
                    </span>
                  </div>

                  <div className="w-full h-px bg-linear-to-r from-transparent via-outline-variant/50 to-transparent"></div>

                  <div className="flex items-center gap-4 p-4 bg-surface border-l-2 border-outline shadow-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">
                      cleaning_services
                    </span>
                    <div className="flex-1">
                      <div className="font-label-caps text-label-caps text-on-surface">
                        Nettoyage Parties Communes
                      </div>
                      <div className="font-body-md text-body-md text-on-surface-variant text-sm">
                        Rapport quotidien validé
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-tertiary text-on-tertiary text-xs font-semibold">
                      Terminé
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="font-h2 text-h2 text-on-surface mb-6">
                  Maintenance & Opérations
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                  Coordonnez les interventions techniques avec une précision
                  d'horloger. Gérez vos prestataires et optimisez la
                  récupération des charges.
                </p>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">
                      check_box
                    </span>
                    <div>
                      <strong className="font-h3 text-h3 text-on-surface block mb-1">
                        Gestion des Travaux
                      </strong>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        Du devis à la réception, suivez chaque étape des
                        interventions lourdes.
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">
                      check_box
                    </span>
                    <div>
                      <strong className="font-h3 text-h3 text-on-surface block mb-1">
                        Personnel de Terrain
                      </strong>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        Plannings, bons d'intervention mobiles et validation des
                        passages.
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">
                      check_box
                    </span>
                    <div>
                      <strong className="font-h3 text-h3 text-on-surface block mb-1">
                        Charges Récupérables
                      </strong>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        Ventilation analytique et reddition annuelle
                        automatisée.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Digitalisation & Expérience */}
        <section className="py-24 px-6 lg:px-12 bg-on-surface text-surface-container-lowest">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="font-h2 text-h2 mb-4">
              Digitalisation & Expérience
            </h2>
            <p className="font-body-md text-body-md text-surface-variant/80 max-w-2xl mx-auto">
              Offrez une expérience premium à vos locataires grâce à nos
              interfaces connectées, développées sous Flutter pour une fluidité
              absolue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-surface/10 border border-surface/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 rounded-full">
                <span className="material-symbols-outlined text-3xl">
                  smartphone
                </span>
              </div>
              <h3 className="font-h3 text-h3 mb-3">App Mobile Flutter</h3>
              <p className="font-body-md text-body-md text-surface-variant/60">
                Application native iOS & Android pour un accès instantané aux
                documents et demandes d'intervention.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-surface/10 border border-surface/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 rounded-full">
                <span className="material-symbols-outlined text-3xl">web</span>
              </div>
              <h3 className="font-h3 text-h3 mb-3">Portail Locataire</h3>
              <p className="font-body-md text-body-md text-surface-variant/60">
                Espace web sécurisé pour le paiement des loyers, l'historique et
                la communication avec le gestionnaire.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-surface/10 border border-surface/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 rounded-full">
                <span className="material-symbols-outlined text-3xl">
                  notifications_active
                </span>
              </div>
              <h3 className="font-h3 text-h3 mb-3">Notifications Push</h3>
              <p className="font-body-md text-body-md text-surface-variant/60">
                Alertes en temps réel pour les échéances, travaux dans
                l'immeuble ou colis en attente.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
