"use client";

import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("@/components/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="grow bg-surface-container-highest border border-outline-variant rounded-none relative overflow-hidden min-h-[300px] flex items-center justify-center">
      <p className="text-on-surface-variant font-medium">
        Chargement de la carte...
      </p>
    </div>
  ),
});

export default function ContactPage() {
  const parisCoords: [number, number] = [48.8719, 2.3113];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow pt-32 pb-xl px-gutter max-w-[1440px] mx-auto w-full">
        {/* Header Section  */}
        <header className="mb-xl max-w-3xl">
          <h1 className="font-display text-display text-on-surface mb-xs uppercase tracking-tight">
            Contactez l&apos;Expertise BailKey
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Nos experts sont à votre disposition pour optimiser votre gestion
            immobilière.
          </p>
        </header>
        {/* Bento Grid Layout  */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Contact Form Area (Left Column, 7 spans)  */}
          <section className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-lg rounded-none shadow-glass relative overflow-hidden">
            {/* Architectural subtle accent  */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <h2 className="font-h2 text-h2 text-on-surface mb-md">
              Envoyer un message
            </h2>
            <form action="#" className="space-y-md" method="POST">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                <div className="flex flex-col gap-base">
                  <label
                    className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                    htmlFor="name"
                  >
                    Nom Complet
                  </label>
                  <input
                    className="bg-surface font-body-md text-body-md text-on-surface border border-outline-variant rounded-none p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                    id="name"
                    name="name"
                    placeholder="Jean Dupont"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-base">
                  <label
                    className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                    htmlFor="email"
                  >
                    Adresse Email
                  </label>
                  <input
                    className="bg-surface font-body-md text-body-md text-on-surface border border-outline-variant rounded-none p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                    id="email"
                    name="email"
                    placeholder="jean.dupont@entreprise.fr"
                    type="email"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-base">
                <label
                  className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                  htmlFor="subject"
                >
                  Sujet
                </label>
                <select
                  className="bg-surface font-body-md text-body-md text-on-surface border border-outline-variant rounded-none p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none"
                  id="subject"
                  name="subject"
                >
                  <option>Demande de démonstration</option>
                  <option>Support technique</option>
                  <option>Informations tarifaires</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="flex flex-col gap-base">
                <label
                  className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  className="bg-surface font-body-md text-body-md text-on-surface border border-outline-variant rounded-none p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors resize-none"
                  id="message"
                  name="message"
                  placeholder="Décrivez votre besoin..."
                  rows={5}
                />
              </div>
              <div className="pt-sm">
                <button
                  className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-8 py-4 rounded-none hover:bg-surface-tint transition-colors w-full md:w-auto shadow-sm active:scale-[0.98]"
                  type="submit"
                >
                  Envoyer la demande
                </button>
              </div>
            </form>
          </section>
          {/* Contact Info & Map Area (Right Column, 5 spans)  */}
          <section className="lg:col-span-5 flex flex-col gap-gutter">
            {/* Info Card  */}
            <div className="bg-surface-container border border-outline-variant p-md rounded-none relative">
              <div className="absolute -left-px top-md bottom-md w-[2px] bg-primary-container"></div>
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">
                Coordonnées
              </h3>
              <ul className="space-y-sm">
                <li className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-primary mt-1"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    location_on
                  </span>
                  <div>
                    <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                      Siège Social
                    </span>
                    <span className="block font-body-md text-body-md text-on-surface">
                      128 Rue du Faubourg Saint-Honoré
                      <br />
                      75008 Paris, France
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-primary mt-1"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    call
                  </span>
                  <div>
                    <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                      Téléphone
                    </span>
                    <span className="block font-body-md text-body-md text-on-surface">
                      +33 (0)1 42 68 53 00
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-primary mt-1"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    mail
                  </span>
                  <div>
                    <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                      Email Général
                    </span>
                    <span className="block font-body-md text-body-md text-on-surface">
                      contact@bailkey.fr
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-primary mt-1"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    schedule
                  </span>
                  <div>
                    <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                      Heures d&apos;Ouverture
                    </span>
                    <span className="block font-body-md text-body-md text-on-surface">
                      Lun - Ven : 09h00 - 18h30
                      <br />
                      Support technique 24/7 pour les clients Enterprise.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            {/* Interactive Map */}
            <div
              className="grow border border-outline-variant rounded-none relative overflow-hidden min-h-[300px] z-10 shadow-inner"
              data-location="Paris"
            >
              <ContactMap center={parisCoords} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
