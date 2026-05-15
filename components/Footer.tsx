"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
              <Link
                className="w-10 h-10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors gsap-button"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  language
                </span>
              </Link>
              <Link
                className="w-10 h-10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors gsap-button"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
              </Link>
              <Link
                className="w-10 h-10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors gsap-button"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  phone
                </span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-6">
              Produit
            </h4>
            <ul className="flex flex-col gap-3 text-body-sm text-on-surface-variant">
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  href="/solutions"
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  href="/pricing"
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Sécurité
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-6">
              Ressources
            </h4>
            <ul className="flex flex-col gap-3 text-body-sm text-on-surface-variant">
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Études de cas
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  href="/posts"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Webinaires
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-h3 text-body-md font-semibold text-on-surface mb-6">
              Société
            </h4>
            <ul className="flex flex-col gap-3 text-body-sm text-on-surface-variant">
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  À propos
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Carrières
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Partenaires
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant">
            © 2024 BailKey Asset Management. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <Link className="hover:text-primary transition-colors" href="#">
              Mentions Légales
            </Link>
            <Link className="hover:text-primary transition-colors" href="#">
              Politique de Confidentialité
            </Link>
            <Link className="hover:text-primary transition-colors" href="#">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
