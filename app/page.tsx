"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. Hero Entrance
      const heroWords = gsap.utils.toArray(".hero-word");
      gsap.fromTo(
        heroWords,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.2,
        },
      );
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.8,
        },
      );
      gsap.fromTo(
        "#hero-bg-lines",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
      );

      // 2. Hero Dashboard Chart & Numbers Reveal
      ScrollTrigger.create({
        trigger: "#hero-dashboard",
        start: "top 80%",
        onEnter: () => {
          gsap.to(".chart-bar", {
            scaleY: 1,
            duration: 1,
            stagger: 0.05,
            ease: "power3.out",
            delay: 0.5,
          });
          gsap.fromTo(
            "#rent-progress",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.5, ease: "power2.out", delay: 1 },
          );

          // Animate Numbers safely for React
          const numbers = gsap.utils.toArray(".data-number") as HTMLElement[];
          numbers.forEach((el) => {
            const finalValue = parseFloat(el.getAttribute("data-value") || "0");
            const prefix = el.getAttribute("data-prefix") || "";
            const suffix = el.getAttribute("data-suffix") || "";

            const obj = { val: 0 };
            gsap.to(obj, {
              val: finalValue,
              duration: 2,
              ease: "power2.out",
              delay: 0.5,
              onUpdate: () => {
                el.innerText = prefix + obj.val.toFixed(1) + suffix;
              },
            });
          });
        },
      });

      // 3. Scroll-Triggered Reveals for Sections
      const featureSections = gsap.utils.toArray(
        ".feature-section",
      ) as HTMLElement[];
      featureSections.forEach((section) => {
        gsap.set(section, { autoAlpha: 1 }); // Ensure visibility

        const text = section.querySelector(".feature-text");
        const img = section.querySelector(".feature-img");
        const floatCard = section.querySelector(".feature-float-card");

        gsap.fromTo(
          text,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 75%" },
          },
        );

        gsap.fromTo(
          img,
          { y: -30, scale: 1.05 },
          {
            y: 30,
            scale: 1,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        if (floatCard) {
          gsap.fromTo(
            floatCard,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 60%" },
            },
          );
        }
      });

      // 4. Feature specific progress bar
      ScrollTrigger.create({
        trigger: "#tresorerie-progress",
        start: "top 85%",
        onEnter: () =>
          gsap.fromTo(
            "#tresorerie-progress",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.5, ease: "power2.out" },
          ),
      });

      // 5. Interactive Elements (Hover effects for the main page)
      const buttons = gsap.utils.toArray(".gsap-button") as HTMLElement[];
      buttons.forEach((btn) => {
        btn.addEventListener("mouseenter", () =>
          gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" }),
        );
        btn.addEventListener("mouseleave", () =>
          gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" }),
        );
      });

      const cards = gsap.utils.toArray(".gsap-card") as HTMLElement[];
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () =>
          gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out" }),
        );
        card.addEventListener("mouseleave", () =>
          gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" }),
        );
      });
    },
    { scope: container },
  );

  return (
    <>
      <Navbar />
      <main ref={container}>
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 pb-16 overflow-hidden">
          <HeroBackground />

          <div className="container mx-auto px-gutter relative z-20 flex flex-col items-center text-center mt-8">
            <h1
              className="font-display text-display text-on-surface mb-6 max-w-4xl tracking-tight"
              id="hero-title"
            >
              <span className="hero-word">Gérez</span>{" "}
              <span className="hero-word">votre</span>{" "}
              <span className="hero-word">patrimoine</span>{" "}
              <span className="hero-word">avec</span>{" "}
              <span className="hero-word">précision.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10 hero-subtitle">
              La solution SaaS institutionnelle pour les gestionnaires
              immobiliers exigeants. Centralisez vos données, automatisez vos
              flux et optimisez vos rendements.
            </p>
            <div className="flex gap-4 mb-16 hero-subtitle">
              <a
                className="text-on-surface-variant hover:text-primary transition-colors font-h3 text-body-sm font-medium tracking-tight font-display px-4 whitespace-nowrap inline-flex items-center"
                href="#"
              >
                Connexion
              </a>
              <a
                className="bg-primary text-on-primary px-margin py-3 font-h3 text-body-md font-medium shadow-md gsap-button inline-block"
                href="#footer"
              >
                Demander une démo
              </a>
              <a
                className="bg-transparent text-primary px-margin py-3 font-h3 text-body-md font-medium border border-primary/30 hover:bg-primary/5 transition-colors gsap-button inline-block"
                href="#patrimoine"
              >
                Découvrir la plateforme
              </a>
            </div>

            <div
              className="relative w-full max-w-5xl mx-auto hero-subtitle"
              id="hero-dashboard"
            >
              <div className="glass-panel overflow-hidden border border-outline-variant/40 shadow-2xl relative z-10">
                <div className="h-12 border-b border-outline-variant/30 bg-surface/50 flex items-center justify-between px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-outline-variant/50"></div>
                    <div className="w-3 h-3 rounded-full bg-outline-variant/50"></div>
                    <div className="w-3 h-3 rounded-full bg-outline-variant/50"></div>
                  </div>
                  <div className="text-xs font-label-caps text-on-surface-variant/70 tracking-widest">
                    PORTFOLIO OVERVIEW
                  </div>
                  <div className="w-16"></div>
                </div>
                <div className="flex h-[450px] bg-surface-container-lowest">
                  <div className="w-48 border-r border-outline-variant/30 bg-surface-container-lowest/50 p-4 flex flex-col gap-2">
                    <div className="h-8 bg-primary/10 flex items-center px-3 mb-4">
                      <span className="material-symbols-outlined text-[16px] text-primary mr-2">
                        dashboard
                      </span>
                      <div className="h-2 w-16 bg-primary/40"></div>
                    </div>
                    <div className="h-8 bg-surface flex items-center px-3">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50 mr-2">
                        apartment
                      </span>
                      <div className="h-2 w-20 bg-on-surface-variant/20"></div>
                    </div>
                    <div className="h-8 bg-surface flex items-center px-3">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50 mr-2">
                        analytics
                      </span>
                      <div className="h-2 w-14 bg-on-surface-variant/20"></div>
                    </div>
                    <div className="h-8 bg-surface flex items-center px-3">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50 mr-2">
                        receipt_long
                      </span>
                      <div className="h-2 w-18 bg-on-surface-variant/20"></div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-6 bg-surface-container-lowest">
                    <div className="flex justify-between items-end">
                      <div>
                        <div
                          className="text-h1 font-display font-semibold text-on-surface mb-1 data-number"
                          data-prefix="€"
                          data-suffix="M"
                          data-value="12.4"
                        >
                          €0
                        </div>
                        <div className="text-sm font-body-sm text-on-surface-variant">
                          Valeur du Portfolio Estimée
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-right">
                          <div
                            className="text-h3 font-display font-medium text-primary data-number"
                            data-suffix="%"
                            data-value="96.5"
                          >
                            0%
                          </div>
                          <div className="text-xs font-label-caps text-on-surface-variant">
                            Taux d'occupation
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-h3 font-display font-medium text-tertiary data-number"
                            data-suffix="%"
                            data-value="5.2"
                          >
                            0%
                          </div>
                          <div className="text-xs font-label-caps text-on-surface-variant">
                            Rendement net
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6 h-full">
                      <div className="w-2/3 border border-outline-variant/30 p-4 flex flex-col">
                        <div className="text-sm font-medium mb-4 text-on-surface">
                          Cash Flow Annuel
                        </div>
                        <div
                          className="flex-1 flex items-end gap-2 px-2"
                          id="cash-flow-chart"
                        >
                          {[
                            40, 50, 45, 60, 55, 70, 65, 85, 80, 95, 90, 100,
                          ].map((height, i) => (
                            <div
                              key={i}
                              className="w-1/12 bg-primary/80 rounded-t-sm chart-bar"
                              style={{ height: `${height}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="w-1/3 flex flex-col gap-4">
                        <div className="border border-outline-variant/30 p-4 flex-1">
                          <div className="text-sm font-medium mb-3 text-on-surface">
                            Répartition
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-primary border-r-tertiary"></div>
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary"></div>
                                <div className="h-2 w-full bg-on-surface-variant/20"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-tertiary"></div>
                                <div className="h-2 w-2/3 bg-on-surface-variant/20"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border border-outline-variant/30 p-4 flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-on-surface">
                              Loyers perçus
                            </span>
                            <span className="text-xs font-semibold text-primary">
                              85%
                            </span>
                          </div>
                          <div className="h-2 bg-surface-container overflow-hidden">
                            <div
                              className="h-full bg-primary w-[85%] origin-left"
                              id="rent-progress"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col">
          {/* Gestion de Patrimoine Section */}
          <section
            className="feature-section min-h-screen flex items-center justify-center relative overflow-hidden w-full bg-surface-container-lowest py-24"
            id="patrimoine"
          >
            <div className="container mx-auto px-gutter relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-5/12 feature-text">
                <div className="flex gap-4 items-center mb-6">
                  <div className="h-px bg-primary w-12"></div>
                  <span className="font-label-caps text-primary tracking-widest uppercase">
                    Gestion de Patrimoine
                  </span>
                </div>
                <h2 className="font-display text-[40px] leading-tight text-on-surface mb-6 font-semibold">
                  Une structure hiérarchique
                  <br />
                  <span className="text-primary font-light">
                    pour vos actifs.
                  </span>
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-10 max-w-lg">
                  Modélisez votre patrimoine avec précision : Immeubles, Étages,
                  et Lots. Gérez une variété de biens, du résidentiel au
                  commercial, avec une flexibilité totale.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-md gsap-card mb-8">
                  <div className="border border-outline-variant/50 p-4 bg-surface cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-h3 text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                          Le Haussmann
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          Paris 8ème • Immeuble entier
                        </p>
                      </div>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        Premium
                      </span>
                    </div>
                    <div className="flex flex-col mt-4 text-sm border-t border-outline-variant/20 pt-3 gap-2">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Étages:</span>
                        <span className="font-semibold text-on-surface">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Lots:</span>
                        <span className="font-semibold text-on-surface">
                          24
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <a
                  className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-container transition-colors"
                  href="#baux"
                >
                  <span>Découvrir le module suivant</span>
                  <span className="material-symbols-outlined">
                    arrow_downward
                  </span>
                </a>
              </div>
              <div className="w-full lg:w-7/12 relative h-[600px] overflow-hidden rounded-sm">
                <Image
                  alt="Modern Architecture Building"
                  className="w-full h-full object-cover shadow-xl feature-img"
                  src="/modern_architecture_building.png"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 bg-surface/90 backdrop-blur-md p-6 border border-outline-variant/30 flex justify-between items-center shadow-lg feature-float-card">
                  <div>
                    <div className="text-xs font-label-caps text-on-surface-variant mb-1">
                      DIVERSITÉ DES BIENS
                    </div>
                    <div className="text-h2 font-display font-bold text-on-surface">
                      Tous types d'actifs
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        Résidentiel
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Appartements, Villas
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-on-surface">
                        Commercial
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Bureaux, Commerces
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gestion des Baux Section */}
          <section
            className="feature-section min-h-screen flex items-center justify-center relative overflow-hidden w-full bg-surface-container py-24"
            id="baux"
          >
            <div className="container mx-auto px-gutter relative z-10 flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="w-full lg:w-5/12 feature-text">
                <div className="flex gap-4 items-center mb-6">
                  <div className="h-px bg-primary w-12"></div>
                  <span className="font-label-caps text-primary tracking-widest uppercase">
                    Gestion des Baux
                  </span>
                </div>
                <h2 className="font-display text-[40px] leading-tight text-on-surface mb-6 font-semibold">
                  Automatisation complète
                  <br />
                  <span className="text-primary font-light">
                    du cycle locatif.
                  </span>
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-10 max-w-lg">
                  Odoo 19 propulse notre moteur de gestion. Création
                  d'échéanciers, génération automatique de quittances, et
                  indexation des loyers sans intervention manuelle.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-md gsap-card mb-8">
                  <div className="border border-outline-variant/50 p-4 bg-surface cursor-pointer group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">
                          autorenew
                        </span>
                        <h4 className="font-h3 text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                          Génération Auto
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        Actif
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      145 quittances générées ce mois-ci automatiquement.
                    </p>
                  </div>
                </div>
                <a
                  className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-container transition-colors"
                  href="#finance"
                >
                  <span>Découvrir le module suivant</span>
                  <span className="material-symbols-outlined">
                    arrow_downward
                  </span>
                </a>
              </div>
              <div className="w-full lg:w-7/12 relative h-[600px] overflow-hidden rounded-sm">
                <Image
                  alt="Professional Office Workspace"
                  className="w-full h-full object-cover shadow-xl feature-img"
                  src="/professional_office_workspace.png"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 bg-surface/90 backdrop-blur-md p-6 border border-outline-variant/30 flex justify-between items-center shadow-lg feature-float-card">
                  <div>
                    <div className="text-xs font-label-caps text-on-surface-variant mb-1">
                      EFFICACITÉ
                    </div>
                    <div className="text-h2 font-display font-bold text-on-surface">
                      Zéro saisie manuelle
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        Échéanciers
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Automatisés
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Finance & Comptabilité Section */}
          <section
            className="feature-section min-h-screen flex items-center justify-center relative overflow-hidden w-full bg-surface-container-lowest py-24"
            id="finance"
          >
            <div className="container mx-auto px-gutter relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-5/12 feature-text">
                <div className="flex gap-4 items-center mb-6">
                  <div className="h-px bg-primary w-12"></div>
                  <span className="font-label-caps text-primary tracking-widest uppercase">
                    Finance & Comptabilité
                  </span>
                </div>
                <h2 className="font-display text-[40px] leading-tight text-on-surface mb-6 font-semibold">
                  Maîtrise totale
                  <br />
                  <span className="text-primary font-light">
                    de vos flux financiers.
                  </span>
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-10 max-w-lg">
                  Suivez les impayés avec rigueur, gérez votre trésorerie
                  (cashbox) en temps réel, et mettez en place des moratoires
                  structurés en cas de besoin.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-md gsap-card mb-8">
                  <div className="border border-outline-variant/50 p-4 bg-surface cursor-pointer group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">
                          account_balance_wallet
                        </span>
                        <h4 className="font-h3 text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                          Vue Trésorerie
                        </h4>
                      </div>
                    </div>
                    <div className="h-2 bg-surface-container overflow-hidden mt-3">
                      <div
                        className="h-full bg-tertiary w-[75%] origin-left"
                        id="tresorerie-progress"
                      ></div>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2 text-right">
                      Taux de recouvrement: 75%
                    </p>
                  </div>
                </div>
                <a
                  className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-container transition-colors"
                  href="#maintenance"
                >
                  <span>Découvrir le module suivant</span>
                  <span className="material-symbols-outlined">
                    arrow_downward
                  </span>
                </a>
              </div>
              <div className="w-full lg:w-7/12 relative h-[600px] overflow-hidden rounded-sm">
                <Image
                  alt="Financial Analytics Graph on Glass"
                  className="w-full h-full object-cover shadow-xl feature-img"
                  src="/financial_analytics_graph_on_glass.png"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 bg-surface/90 backdrop-blur-md p-6 border border-outline-variant/30 flex justify-between items-center shadow-lg feature-float-card">
                  <div>
                    <div className="text-xs font-label-caps text-on-surface-variant mb-1">
                      TRANSPARENCE
                    </div>
                    <div className="text-h2 font-display font-bold text-on-surface">
                      Visibilité financière
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        Cashbox
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Temps réel
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-on-surface">
                        Impayés
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Suivi rigoureux
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Maintenance & Digitalisation Section */}
          <section
            className="feature-section min-h-screen flex items-center justify-center relative overflow-hidden w-full bg-surface-container py-24"
            id="maintenance"
          >
            <div className="container mx-auto px-gutter relative z-10 flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="w-full lg:w-5/12 feature-text">
                <div className="flex gap-4 items-center mb-6">
                  <div className="h-px bg-primary w-12"></div>
                  <span className="font-label-caps text-primary tracking-widest uppercase">
                    Maintenance & Digitalisation
                  </span>
                </div>
                <h2 className="font-display text-[40px] leading-tight text-on-surface mb-6 font-semibold">
                  Une expérience locataire
                  <br />
                  <span className="text-primary font-light">
                    moderne et connectée.
                  </span>
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-10 max-w-lg">
                  Portail locataire dédié et application mobile (Flutter) pour
                  une gestion fluide. Centralisez les demandes d'intervention et
                  suivez les prestataires en direct.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-md gsap-card mb-8">
                  <div className="border border-outline-variant/50 p-4 bg-surface cursor-pointer group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">
                          build
                        </span>
                        <h4 className="font-h3 text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                          Ticket #4092
                        </h4>
                      </div>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        En cours
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      Plomberie - Le Haussmann, Lot 12
                    </p>
                  </div>
                </div>
                <a
                  className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-container transition-colors"
                  href="#footer"
                >
                  <span>Découvrir le module suivant</span>
                  <span className="material-symbols-outlined">
                    arrow_downward
                  </span>
                </a>
              </div>
              <div className="w-full lg:w-7/12 relative h-[600px] overflow-hidden rounded-sm">
                <Image
                  alt="Person using a smartphone app for real estate"
                  className="w-full h-full object-cover shadow-xl feature-img"
                  src="/person_using_a_smartphone_app_for_real_estate.png"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 bg-surface/90 backdrop-blur-md p-6 border border-outline-variant/30 flex justify-between items-center shadow-lg feature-float-card">
                  <div>
                    <div className="text-xs font-label-caps text-on-surface-variant mb-1">
                      ACCESSIBILITÉ
                    </div>
                    <div className="text-h2 font-display font-bold text-on-surface">
                      Portail & App Mobile
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        Flutter App
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        iOS & Android
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
