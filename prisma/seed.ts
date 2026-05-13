import { prisma } from "@/lib/db";

async function main() {
  console.log("Start seeding...");

  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------------------------------------
  // 1. Création de l'auteur : Directeur des Opérations
  // ---------------------------------------------------------------------------
  const jeanMarc = await prisma.user.create({
    data: {
      name: "Jean-Marc Laurent",
      role: "Directeur des Opérations",
      avatarUrl:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
      posts: {
        create: [
          {
            title: "Optimiser la rentabilité de votre parc immobilier en 2026",
            slug: "optimiser-rentabilite-parc-immobilier-2026",
            category: "Guide",
            readingTime: 8,
            coverImage:
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
            coverImageAlt: "Façade d'un immeuble de bureaux moderne",
            content: `
La gestion immobilière moderne exige une précision chirurgicale. La véritable rentabilité ne naît pas seulement de l'acquisition de nouveaux actifs, mais de la maîtrise absolue des flux opérationnels existants.

## La centralisation des données

Aujourd'hui, de nombreux gestionnaires s'appuient encore sur des fichiers Excel dispersés. Cette fragmentation entraîne des retards de paiement, des erreurs de calcul et une perte de temps considérable. En centralisant vos données (baux, paiements, interventions techniques) sur une plateforme unique, vous gagnez en visibilité et en réactivité.

## Automatisation des flux financiers

L'automatisation de la facturation et des quittances de loyer permet une réduction moyenne de 22% des coûts de traitement administratif lors de la première année d'implémentation. 

* **Relances automatiques :** Diminution drastique des impayés.
* **Réconciliation bancaire :** Suivi en temps réel de la trésorerie.
* **Tableaux de bord :** Prise de décision éclairée basée sur des métriques fiables.
            `,
          },
          {
            title: "Comment AlphaCap a digitalisé la gestion de ses 400 lots",
            slug: "cas-client-alphacap-digitalisation-400-lots",
            category: "Cas Client",
            readingTime: 5,
            coverImage:
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
            coverImageAlt: "Intérieur d'une belle propriété",
            content: `
AlphaCap, agence immobilière en pleine croissance, faisait face à un défi majeur : comment scaler sa gestion locative sans exploser sa masse salariale ?

## Le défi initial

Avec 400 lots sous gestion, l'équipe passait 60% de son temps sur des tâches à faible valeur ajoutée : saisie manuelle, envoi de courriers, et gestion des appels pour des problèmes techniques mineurs.

## La solution apportée

En déployant un portail locataire interactif et un système de ticketing pour les interventions techniques, AlphaCap a transformé son modèle. Les locataires peuvent désormais déclarer un incident directement via leur smartphone, déclenchant automatiquement un ordre de mission vers les prestataires affiliés.

**Résultat :** Une satisfaction client en hausse de 40% et un gain de temps de 15 heures par semaine par gestionnaire.
            `,
          },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------------
  // 2. Création de l'auteur : Expert Immobilier
  // ---------------------------------------------------------------------------
  const amina = await prisma.user.create({
    data: {
      name: "Amina Sow",
      role: "Experte Marchés Immobiliers",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      posts: {
        create: [
          {
            title: "Tendances du marché immobilier tertiaire en Afrique",
            slug: "tendances-marche-immobilier-tertiaire-afrique-2026",
            category: "Analyse",
            readingTime: 6,
            coverImage:
              "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200",
            coverImageAlt: "Quartier d'affaires en pleine effervescence",
            content: `
Le paysage urbain africain est en pleine mutation. La demande pour des espaces de bureaux flexibles et connectés ne cesse de croître dans les grandes métropoles.

## L'essor des espaces hybrides

Post-pandémie, le modèle hybride s'est pérennisé. Les entreprises recherchent des baux plus flexibles et des espaces capables de s'adapter au travail collaboratif. Pour les propriétaires, cela signifie repenser l'aménagement et les services inclus.

## Connectivité et gestion intelligente

Les locataires professionnels exigent aujourd'hui des "Smart Buildings". La capacité à surveiller la consommation énergétique, à gérer les accès de manière biométrique et à offrir une connectivité internet redondante devient un critère de sélection primordial, influençant directement la valeur locative du bien.
            `,
          },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------------
  // 3. Création de l'auteur : CTO / Tech Lead
  // ---------------------------------------------------------------------------
  const jessy = await prisma.user.create({
    data: {
      name: "Jessy Pango",
      role: "Directeur Technique",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      posts: {
        create: [
          {
            title: "Architecture SaaS : Pourquoi nous parions sur Next.js",
            slug: "architecture-saas-pourquoi-nextjs",
            category: "Actualité",
            readingTime: 4,
            coverImage:
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
            coverImageAlt: "Écran d'ordinateur affichant du code",
            content: `
La performance d'une plateforme métier ne doit faire l'objet d'aucun compromis. Pour garantir une expérience fluide à nos utilisateurs, même lors du traitement de milliers de données locatives, le choix de la stack technique est crucial.

## Server Components et vitesse d'exécution

En utilisant les Server Components de Next.js, nous réduisons drastiquement la charge sur le navigateur de nos clients. L'interface se charge instantanément, car le gros du calcul (récupération des loyers, calcul des charges) est effectué côté serveur.

## Sécurité et fiabilité

Couplé à Prisma et une base de données PostgreSQL robuste, notre architecture garantit l'intégrité absolue des données financières de nos clients. Une infrastructure conçue pour évoluer sans friction.
            `,
          },
        ],
      },
    },
  });

  console.log(
    `Seeding finished. Created users: ${jeanMarc.name}, ${amina.name}, ${jessy.name}`,
  );
  console.log(`Total posts created: 4`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
