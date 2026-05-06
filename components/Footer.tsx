"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const buttons = gsap.utils.toArray(".gsap-button") as HTMLElement[];
      buttons.forEach((btn) => {
        btn.addEventListener("mouseenter", () =>
          gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" }),
        );
        btn.addEventListener("mouseleave", () =>
          gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" }),
        );
      });
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="bg-surface-container-lowest border-t border-outline-variant/30 pt-16 pb-8"
      id="footer"
    >
      <div className="container mx-auto px-gutter max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Image
              alt="BailKey Logo"
              className="h-8 w-auto mb-6"
              src="/logo.png"
              width={120}
              height={32}
              style={{ width: "auto", height: "auto" }}
            />
            <p className="text-body-sm text-on-surface-variant mb-6">
              La plateforme logicielle de référence pour les gestionnaires de
              patrimoine immobilier. Centralisez, analysez et optimisez vos
              actifs en toute sécurité.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors gsap-button"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  language
                </span>
              </a>
              <a
                className="w-10 h-10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors gsap-button"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
              </a>
              <a
                className="w-10 h-10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors gsap-button"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  phone
                </span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-6">
              Produit
            </h4>
            <ul className="flex flex-col gap-3 text-body-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Solutions
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Tarifs
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Témoignages
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Sécurité
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-6">
              Ressources
            </h4>
            <ul className="flex flex-col gap-3 text-body-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Études de cas
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Blog
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Webinaires
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-6">
              Société
            </h4>
            <ul className="flex flex-col gap-3 text-body-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  À propos
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Carrières
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Contact
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Partenaires
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant">
            © 2024 BailKey Asset Management. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <a className="hover:text-primary transition-colors" href="#">
              Mentions Légales
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Politique de Confidentialité
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              CGU
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
