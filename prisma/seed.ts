import { prisma } from "@/lib/db";

async function main() {
  console.log("🚀 Démarrage du seeding pour Bailkey...");

  // Nettoyage de la base de données
  console.log("🧹 Nettoyage des données existantes...");
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();

  // ---------------------------------------------------------------------------
  // 1. RÉFÉRENCEMENT DES AUTEURS (CLERK DÉMO)
  // ---------------------------------------------------------------------------
  console.log("👤 Référencement des auteurs de démo (gérés par Clerk)...");

  const createdAuthors = [
    {
      id: "user_seed_laurent",
      name: "Laurent N.",
      role: "Expert en Stratégie Foncière",
    },
    {
      id: "user_seed_sophie",
      name: "Sophie M.",
      role: "Juriste Immobilier & Régulation",
    },
    {
      id: "user_seed_tech",
      name: "Pôle Ingénierie",
      role: "Équipe Technique Bailkey",
    },
    {
      id: "user_seed_marc",
      name: "Marc A.",
      role: "Directeur de l'Innovation",
    },
  ];

  for (const author of createdAuthors) {
    console.log(`   ✅ Auteur référencé : ${author.name} (${author.role})`);
  }

  // ---------------------------------------------------------------------------
  // 2. CRÉATION DES TAGS
  // ---------------------------------------------------------------------------
  console.log("\n🏷️ Création des tags...");

  const tagData = [
    { name: "Digitalisation", slug: "digitalisation" },
    { name: "Gestion Locative", slug: "gestion-locative" },
    { name: "Fiscalité", slug: "fiscalite" },
    { name: "Tech", slug: "tech" },
    { name: "SaaS", slug: "saas" },
    { name: "Rentabilité", slug: "rentabilite" },
    { name: "Immobilier Commercial", slug: "immobilier-commercial" },
    { name: "Automatisation", slug: "automatisation" },
    { name: "Législation", slug: "legislation" },
    { name: "Afrique Centrale", slug: "afrique-centrale" },
  ];

  const createdTags = [];
  for (const tag of tagData) {
    const t = await prisma.tag.create({ data: tag });
    createdTags.push(t);
  }
  console.log(`   ✅ ${createdTags.length} tags créés.`);

  // ---------------------------------------------------------------------------
  // 3. CRÉATION DES POSTS (Partie 1)
  // ---------------------------------------------------------------------------
  console.log("\n📝 Création des articles (Batch 1)...");

  // Post 1 : Guide
  const post1 = await prisma.post.create({
    data: {
      title: "Digitaliser la gestion locative entre Douala et Yaoundé",
      slug: "digitaliser-gestion-locative-douala-yaounde",
      category: "GUIDE",
      status: "PUBLISHED",
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 10)),
      readingTime: 6,
      coverImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
      coverImageAlt: "Vue aérienne d'un quartier d'affaires moderne",
      excerpt:
        "La fragmentation des données immobilières ralentit la rentabilité. Découvrez comment centraliser vos actifs sur l'axe Douala-Yaoundé.",
      metaTitle: "Digitalisation Gestion Locative Douala Yaoundé | Bailkey",
      metaDescription:
        "Guide complet pour digitaliser et optimiser la gestion de vos actifs immobiliers au Cameroun avec des outils SaaS modernes.",
      content: `La gestion immobilière moderne exige une précision chirurgicale. La véritable rentabilité ne naît pas seulement de l'acquisition de nouveaux actifs, mais de la maîtrise absolue des flux opérationnels existants.

## La centralisation des données : Un enjeu majeur

Aujourd'hui, de nombreux gestionnaires opérant sur plusieurs villes s'appuient encore sur des fichiers Excel dispersés. Cette fragmentation entraîne des retards de paiement, des erreurs de calcul et une perte de temps considérable lors des redditions de comptes. 

> Le passage au numérique n'est plus une option, c'est une nécessité de survie économique pour les agences.

En centralisant vos données (baux, paiements, interventions techniques) sur une plateforme cloud unique, vous gagnez en visibilité immédiate, peu importe où vous vous trouvez.`,
      authorId: createdAuthors[0].id, // Laurent N.
      tags: {
        connect: [
          { slug: "digitalisation" },
          { slug: "gestion-locative" },
          { slug: "afrique-centrale" },
        ],
      },
    },
  });
  console.log(`   ✅ Article créé : ${post1.title}`);

  // Post 2 : Analyse
  const post2 = await prisma.post.create({
    data: {
      title:
        "Optimisation de l'infrastructure SaaS : Pourquoi nous utilisons Next.js",
      slug: "optimisation-infrastructure-saas-nextjs",
      category: "ANALYSE",
      status: "PUBLISHED",
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      readingTime: 8,
      coverImage:
        "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1200",
      coverImageAlt: "Architecture serveur et code",
      excerpt:
        "Plongée technique dans l'architecture qui permet à Bailkey de traiter des milliers de lots locatifs sans latence.",
      metaTitle: "Architecture SaaS Next.js pour l'Immobilier",
      metaDescription:
        "Découvrez nos choix architecturaux avec Next.js et Prisma pour garantir des performances extrêmes à nos gestionnaires immobiliers.",
      content: `La performance d'une plateforme métier ne doit faire l'objet d'aucun compromis. Pour garantir une expérience fluide à nos utilisateurs, même lors du traitement de milliers de données locatives, le choix de la stack technique est crucial.

## Server Components et vitesse d'exécution

En utilisant les Server Components de Next.js, nous réduisons drastiquement la charge sur le navigateur de nos clients. L'interface se charge instantanément, car le gros du calcul (récupération des loyers, consolidation financière) est effectué directement côté serveur.

## Sécurité des bases de données

Couplé à Prisma, notre architecture garantit l'intégrité absolue des données financières de nos clients. Un schéma strict est la première ligne de défense contre les erreurs d'incohérence comptable.`,
      authorId: createdAuthors[2].id, // Pôle Ingénierie
      tags: {
        connect: [
          { slug: "tech" },
          { slug: "saas" },
          { slug: "automatisation" },
        ],
      },
    },
  });
  console.log(`   ✅ Article créé : ${post2.title}`);

  // ---------------------------------------------------------------------------
  // 4. CRÉATION DES POSTS (Partie 2)
  // ---------------------------------------------------------------------------
  console.log("\n📝 Création des articles (Batch 2)...");

  // Post 3 : Étude de cas (Cas Client)
  const post3 = await prisma.post.create({
    data: {
      title: "Comment l'agence Haussmann a réduit ses impayés de 30%",
      slug: "etude-de-cas-agence-haussmann",
      category: "CAS_CLIENT",
      status: "PUBLISHED",
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      readingTime: 5,
      coverImage:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200",
      coverImageAlt: "Façade d'un immeuble de rapport",
      excerpt:
        "Analyse détaillée de la stratégie mise en place par une agence leader pour automatiser ses relances et sécuriser ses revenus locatifs.",
      metaTitle: "Étude de Cas : Réduction des Impayés | Bailkey",
      metaDescription:
        "Découvrez comment l'automatisation des relances avec Bailkey permet de réduire significativement les retards de paiement de loyers.",
      content: `Gérer les retards de paiement est l'une des tâches les plus chronophages pour un gestionnaire locatif. L'agence Haussmann gérait historiquement ses relances manuellement.

## Le problème des relances manuelles

Chaque 5 du mois, l'équipe comptable devait pointer les relevés bancaires, identifier les manquements, rédiger des emails ou courriers, et suivre les réponses. Un processus lourd, sujet aux erreurs, et souvent exécuté avec retard.

> La clé n'est pas d'être sévère, mais d'être systématique et réactif. L'automatisation permet cette rigueur sans l'effort humain.

## La solution : Relances automatisées et portail locataire

En intégrant Bailkey, l'agence a configuré des scénarios de relance : 
1. J+3 : SMS de rappel amical
2. J+7 : Email formel avec lien de paiement sécurisé
3. J+15 : Mise en demeure générée automatiquement au format PDF

Résultat : une baisse de 30% des retards dès le deuxième mois.`,
      authorId: createdAuthors[1].id, // Sophie M.
      tags: {
        connect: [{ slug: "automatisation" }, { slug: "rentabilite" }],
      },
      relatedPosts: {
        connect: [{ id: post1.id }], // Lier l'étude de cas au guide sur la digitalisation
      },
    },
  });
  console.log(`   ✅ Article créé : ${post3.title}`);

  // Post 4 : Brouillon (Actualité)
  const post4 = await prisma.post.create({
    data: {
      title: "Les nouvelles réglementations de la gestion locative en 2026",
      slug: "nouvelles-reglementations-gestion-locative-2026",
      category: "ACTUALITE",
      status: "DRAFT",
      // Pas de publishedAt ni readingTime pour un draft
      excerpt:
        "Un tour d'horizon complet des changements législatifs à venir, notamment sur les normes énergétiques et l'encadrement des loyers.",
      metaTitle: "Réglementations Immobilières 2026",
      content: `Ce texte est en cours de rédaction. Il abordera :
- Les nouvelles normes DPE
- L'impact sur la rentabilité nette
- Comment anticiper avec Bailkey`,
      authorId: createdAuthors[1].id, // Sophie M.
      tags: {
        connect: [{ slug: "legislation" }, { slug: "fiscalite" }],
      },
    },
  });
  console.log(`   ✅ Article créé : ${post4.title} (Brouillon)`);

  console.log("\n🎉 Seeding terminé avec succès !");
}

main()
  .catch((e: unknown) => {
    console.error("❌ Erreur durant le seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
