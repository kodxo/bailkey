"use client";

import React from "react";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-background " id="hero-bg-lines">
      {/* CSS encapsulé pour les animations spécifiques à ce SVG */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes travelAnim {
          0% { stroke-dasharray: 0, 3000; stroke-dashoffset: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dasharray: 600, 3000; stroke-dashoffset: -2000; opacity: 0; }
        }
        @keyframes pulseDot {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatAnim {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .data-particle-1 {
          stroke-linecap: round;
          animation: travelAnim 12s ease-in-out infinite;
        }
        .data-particle-2 {
          stroke-linecap: round;
          animation: travelAnim 15s ease-in-out infinite;
          animation-delay: 3s;
        }
        .pulse-dot {
          animation: pulseDot 4s infinite ease-in-out;
          transform-origin: center;
        }
        .spin-slow {
          animation: spinSlow 30s linear infinite;
          transform-origin: center;
        }
        .floating-element {
          animation: floatAnim 10s ease-in-out infinite;
        }
      `,
        }}
      />

      <svg
        className="absolute bottom-0 right-0 w-full h-full opacity-70 pointer-events-none"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dégradés ultra-doux pour les piliers de fond */}
          <linearGradient id="pillar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a6570" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#1a6570" stopOpacity="0.0" />
          </linearGradient>

          {/* Dégradés pour les ondes organiques */}
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60d8d9" stopOpacity="0" />
            <stop offset="20%" stopColor="#60d8d9" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#1a6570" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1a6570" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a6570" stopOpacity="0" />
            <stop offset="30%" stopColor="#1a6570" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#60d8d9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60d8d9" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#284adf" stopOpacity="0" />
            <stop offset="50%" stopColor="#284adf" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1a6570" stopOpacity="0" />
          </linearGradient>

          {/* Flou subtil (Glow léger) */}
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Piliers d'arrière-plan (très estompés, comme sur la maquette) */}
        <g>
          <rect
            x="50"
            y="300"
            width="120"
            height="700"
            rx="24"
            fill="url(#pillar-grad)"
          />
          <rect
            x="300"
            y="150"
            width="180"
            height="850"
            rx="24"
            fill="url(#pillar-grad)"
          />
          <rect
            x="750"
            y="250"
            width="140"
            height="750"
            rx="24"
            fill="url(#pillar-grad)"
          />
        </g>

        {/* 2. Ondes organiques (Les courbes de la maquette) */}
        <g fill="none">
          {/* Onde Supérieure (Douce) */}
          <path
            d="M-100 450 C 200 550, 500 350, 1100 450"
            stroke="url(#wave-grad-3)"
            strokeWidth="1.5"
          />
          {/* Onde Centrale (Principale, plus colorée) */}
          <path
            d="M-100 650 C 350 450, 650 750, 1200 500"
            stroke="url(#wave-grad-1)"
            strokeWidth="2.5"
          />
          {/* Onde Inférieure (Entrelacée) */}
          <path
            d="M-100 750 C 400 850, 700 550, 1200 650"
            stroke="url(#wave-grad-2)"
            strokeWidth="2"
          />
        </g>

        {/* 3. Particules de lumière voyageant sur les ondes */}
        <g fill="none" strokeWidth="4" filter="url(#soft-glow)">
          <path
            d="M-100 650 C 350 450, 650 750, 1200 500"
            stroke="#60d8d9"
            className="data-particle-1"
          />
          <path
            d="M-100 750 C 400 850, 700 550, 1200 650"
            stroke="#1a6570"
            className="data-particle-2"
          />
        </g>

        {/* 4. Éléments UI "Radar" (Concentriques et épurés) */}
        <g>
          {/* Le grand radar sur la droite (visible sur la maquette) */}
          <g transform="translate(850, 500)" className="floating-element">
            <circle cx="0" cy="0" r="45" fill="#60d8d9" opacity="0.05" />
            <circle
              cx="0"
              cy="0"
              r="24"
              fill="none"
              stroke="#1a6570"
              strokeWidth="1"
              strokeDasharray="4 6"
              className="spin-slow"
              opacity="0.4"
            />
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="none"
              stroke="#60d8d9"
              strokeWidth="2"
              opacity="0.6"
            />
            <circle cx="0" cy="0" r="4" fill="#1a6570" className="pulse-dot" />
          </g>

          {/* Un petit radar subtil à gauche */}
          <g transform="translate(180, 600)">
            <circle cx="0" cy="0" r="30" fill="#284adf" opacity="0.03" />
            <circle
              cx="0"
              cy="0"
              r="10"
              fill="none"
              stroke="#1a6570"
              strokeWidth="1"
              opacity="0.3"
            />
            <circle cx="0" cy="0" r="3" fill="#60d8d9" className="pulse-dot" />
          </g>

          {/* Point d'intersection supérieur */}
          <g transform="translate(600, 380)">
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="none"
              stroke="#1a6570"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <circle cx="0" cy="0" r="2" fill="#60d8d9" />
          </g>
        </g>
      </svg>

      {/* Overlay très léger pour assurer la lisibilité parfaite du texte */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80 z-10 pointer-events-none"></div>
    </div>
  );
}
