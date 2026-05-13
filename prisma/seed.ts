import { prisma } from "@/lib/db";
import { PostCategory, PostStatus } from "@/lib/generated/prisma/enums";

async function main() {
  console.log("Démarrage du seeding pour Bailkey...");

  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------------------------------------
  // 1. Auteur : Expert Immobilier (Focus Marché Local)
  // ---------------------------------------------------------------------------
  const laurent = await prisma.user.create({
    data: {
      name: "Laurent N.",
      role: "Expert en Stratégie Foncière",
      avatarUrl:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
      posts: {
        create: [
          {
            title: "Digitaliser la gestion locative entre Douala et Yaoundé",
            slug: "digitaliser-gestion-locative-douala-yaounde",
            category: PostCategory.GUIDE,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date(),
            readingTime: 6,
            coverImage:
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
            coverImageAlt: "Vue aérienne d'un quartier d'affaires moderne",
            excerpt:
              "La fragmentation des données immobilières ralentit la rentabilité. Découvrez comment centraliser vos actifs sur l'axe Douala-Yaoundé.",
            metaTitle:
              "Digitalisation Gestion Locative Douala Yaoundé | Bailkey",
            metaDescription:
              "Guide complet pour digitaliser et optimiser la gestion de vos actifs immobiliers au Cameroun avec des outils SaaS modernes.",
            content: `
La gestion immobilière moderne exige une précision chirurgicale. La véritable rentabilité ne naît pas seulement de l'acquisition de nouveaux actifs, mais de la maîtrise absolue des flux opérationnels existants.

## La centralisation des données : Un enjeu majeur

Aujourd'hui, de nombreux gestionnaires opérant sur plusieurs villes s'appuient encore sur des fichiers Excel dispersés. Cette fragmentation entraîne des retards de paiement, des erreurs de calcul et une perte de temps considérable lors des redditions de comptes. 

En centralisant vos données (baux, paiements, interventions techniques) sur une plateforme cloud unique, vous gagnez en visibilité immédiate, peu importe où vous vous trouvez.
            `,
            tags: {
              connectOrCreate: [
                {
                  where: { slug: "digitalisation" },
                  create: { name: "Digitalisation", slug: "digitalisation" },
                },
                {
                  where: { slug: "gestion-locative" },
                  create: {
                    name: "Gestion Locative",
                    slug: "gestion-locative",
                  },
                },
              ],
            },
          },
          {
            title: "Brouillon : Les nouvelles régulations fiscales 2026",
            slug: "nouvelles-regulations-fiscales-2026",
            category: PostCategory.ACTUALITE,
            status: PostStatus.DRAFT,
            // Pas de publishedAt ni de readingTime car c'est un brouillon
            excerpt:
              "Aperçu des impacts fiscaux sur les revenus fonciers pour l'année à venir.",
            content:
              "Ce texte est en cours de rédaction. Il abordera les optimisations possibles...",
            tags: {
              connectOrCreate: [
                {
                  where: { slug: "fiscalite" },
                  create: { name: "Fiscalité", slug: "fiscalite" },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------------
  // 2. Auteur : Pôle Tech / ERP
  // ---------------------------------------------------------------------------
  const techLead = await prisma.user.create({
    data: {
      name: "Pôle Ingénierie",
      role: "Équipe Technique Bailkey",
      avatarUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200&h=200",
      posts: {
        create: [
          {
            title:
              "Optimisation de l'infrastructure SaaS : Pourquoi nous utilisons Next.js",
            slug: "optimisation-infrastructure-saas-nextjs",
            category: PostCategory.ANALYSE,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date(new Date().setDate(new Date().getDate() - 5)), // Publié il y a 5 jours
            readingTime: 8,
            coverImage:
              "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1200",
            coverImageAlt: "Architecture serveur et code",
            excerpt:
              "Plongée technique dans l'architecture qui permet à Bailkey de traiter des milliers de lots locatifs sans latence.",
            metaTitle: "Architecture SaaS Next.js pour l'Immobilier",
            metaDescription:
              "Découvrez nos choix architecturaux avec Next.js et Prisma pour garantir des performances extrêmes à nos gestionnaires immobiliers.",
            content: `
La performance d'une plateforme métier ne doit faire l'objet d'aucun compromis. Pour garantir une expérience fluide à nos utilisateurs, même lors du traitement de milliers de données locatives, le choix de la stack technique est crucial.

## Server Components et vitesse d'exécution

En utilisant les Server Components de Next.js, nous réduisons drastiquement la charge sur le navigateur de nos clients. L'interface se charge instantanément, car le gros du calcul (récupération des loyers, consolidation financière) est effectué directement côté serveur, sans dépendre d'applications de consolidation tierces obsolètes.

## Sécurité des bases de données

Couplé à Prisma, notre architecture garantit l'intégrité absolue des données financières de nos clients. Un schéma strict est la première ligne de défense.
            `,
            tags: {
              connectOrCreate: [
                {
                  where: { slug: "tech" },
                  create: { name: "Tech", slug: "tech" },
                },
                {
                  where: { slug: "saas" },
                  create: { name: "SaaS", slug: "saas" },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(
    `Seeding terminé. Auteurs créés : ${laurent.name}, ${techLead.name}`,
  );
}

main()
  .catch((e) => {
    console.error("Erreur durant le seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
