"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname(); // Récupère l'URL actuelle

  useGSAP(
    () => {
      const navTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: typeof document !== "undefined" ? document.body : "body",
          start: "top top",
          end: "top -100",
          scrub: 1,
        },
      });

      navTimeline.fromTo(
        "#nav-pill",
        {
          width: "95%",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          backgroundColor: "rgba(245, 250, 250, 0.9)", // Valeur exacte de bg-surface/90
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // shadow-sm
        },
        {
          width: "70%",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          backgroundColor: "rgba(251, 248, 252, 0.95)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          ease: "power2.inOut",
        },
        0,
      );
    },
    { scope: navRef },
  );

  // Configuration centralisée de vos liens
  const navLinks = [
    { name: "À propos", href: "/about" },
    { name: "Plateforme", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Tarifs", href: "/pricing" },
    { name: "Ressources", href: "/posts" },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full px-4"
      id="nav-wrapper"
    >
      <div
        className="bg-surface/90 backdrop-blur-md w-[95%] max-w-7xl mx-auto px-8 py-4 mt-6 border border-outline-variant/30 shadow-sm flex items-center justify-between gap-8 transform-gpu"
        id="nav-pill"
      >
        <div className="text-xl font-bold tracking-tighter text-on-surface">
          <Link href="/" className="flex items-center">
            <Image
              alt="BailKey Logo"
              className="h-8 w-auto"
              id="logo-full"
              src="/logo.png"
              width={120}
              height={32}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        <div className="hidden md:flex font-h3 text-body-sm font-medium tracking-tight justify-center flex-grow gap-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-all duration-300 pb-1 font-display ${
                  isActive
                    ? "text-primary font-semibold border-b-2 border-primary" // Style Actif (équivalent au Teal de votre maquette)
                    : "text-on-surface-variant hover:text-primary" // Style Inactif
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors font-h3 text-body-sm font-medium tracking-tight font-display px-4 whitespace-nowrap"
            href="/connexion"
          >
            Connexion
          </Link>
          <button className="bg-primary text-on-primary px-6 py-2 font-h3 text-body-sm font-medium tracking-tight whitespace-nowrap gsap-button font-display">
            Commencer
          </button>
        </div>
      </div>
    </nav>
  );
}
