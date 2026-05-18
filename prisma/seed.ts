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

  // ---------------------------------------------------------------------------
  // 4. CRÉATION DU PATRIMOINE IMMOBILIER (PROPRIÉTÉS, PROPRIÉTAIRES, LOCATAIRES, BAUX)
  // ---------------------------------------------------------------------------
  console.log("\n🏢 Création du patrimoine immobilier de démo...");

  const orgId = "org_default_bailkey";

  // Nettoyage préalable
  await prisma.lease.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.propertyOwner.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.owner.deleteMany();

  // Création Propriétaires
  const owner1 = await prisma.owner.create({
    data: {
      organizationId: orgId,
      type: "INDIVIDUAL",
      firstName: "Jean-Paul",
      lastName: "Kamga",
      email: "jp.kamga@invest.cm",
      phone: "+237 671234567",
      address: "Bonapriso, Douala",
      identityDocument: "CNI-2021-987654",
    },
  });

  const owner2 = await prisma.owner.create({
    data: {
      organizationId: orgId,
      type: "COMPANY",
      companyName: "SCI Horizon Immo",
      email: "contact@horizon-immo.cm",
      phone: "+237 699887766",
      address: "Avenue de Gaulle, Akwa",
      registrationNumber: "RC/DLA/2018/B/1452",
      taxNumber: "M111812345678W",
    },
  });
  console.log("   ✅ 2 Propriétaires créés.");

  // Création Propriétés
  const prop1 = await prisma.property.create({
    data: {
      organizationId: orgId,
      reference: "APP-AKW-001",
      designation: "Appartement F4 Moderne - Akwa Résidentiel",
      description: "Superbe appartement traversant au 3ème étage avec grand balcon et parking surveillé.",
      propertyType: "APARTMENT",
      address: "Rue Drouot, Akwa",
      city: "Douala",
      neighborhood: "Akwa",
      area: 145,
      roomsCount: 4,
      baseRent: 350000,
      currency: "XAF",
      status: "RENTED",
      createdById: createdAuthors[0].id,
      owners: {
        create: [{ ownerId: owner1.id, share: 100 }],
      },
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      organizationId: orgId,
      reference: "VIL-BON-002",
      designation: "Villa Duplex de Standing - Bonapriso",
      description: "Villa luxueuse avec piscine, jardin arboré et dépendances sécurisées.",
      propertyType: "VILLA",
      address: "Rue des Palmiers, Bonapriso",
      city: "Douala",
      neighborhood: "Bonapriso",
      area: 320,
      roomsCount: 7,
      baseRent: 1200000,
      currency: "XAF",
      status: "AVAILABLE",
      createdById: createdAuthors[0].id,
      owners: {
        create: [{ ownerId: owner2.id, share: 100 }],
      },
    },
  });

  const prop3 = await prisma.property.create({
    data: {
      organizationId: orgId,
      reference: "COM-KOT-003",
      designation: "Espace Commercial RDC - Boulevard de la Liberté",
      description: "Local commercial avec grande vitrine sur un axe très fréquenté.",
      propertyType: "COMMERCIAL_SPACE",
      address: "Boulevard de la Liberté, Akwa",
      city: "Douala",
      neighborhood: "Akwa",
      area: 90,
      roomsCount: 2,
      baseRent: 500000,
      currency: "XAF",
      status: "AVAILABLE",
      createdById: createdAuthors[0].id,
      owners: {
        create: [
          { ownerId: owner1.id, share: 60 },
          { ownerId: owner2.id, share: 40 },
        ],
      },
    },
  });
  console.log("   ✅ 3 Propriétés créées.");

  // Création Locataires
  const tenant1 = await prisma.tenant.create({
    data: {
      organizationId: orgId,
      type: "INDIVIDUAL",
      firstName: "Mireille",
      lastName: "Bengono",
      email: "mireille.b@gmail.com",
      phone: "+237 650998877",
      address: "Makepe, Douala",
      identityDocument: "CNI-2019-112233",
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      organizationId: orgId,
      type: "COMPANY",
      companyName: "Tech Solutions SARL",
      email: "admin@techsolutions.cm",
      phone: "+237 233445566",
      address: "Bali, Douala",
      registrationNumber: "RC/DLA/2020/B/890",
      taxNumber: "M052012398765A",
    },
  });
  console.log("   ✅ 2 Locataires créés.");

  // Création Baux
  const lease1 = await prisma.lease.create({
    data: {
      organizationId: orgId,
      propertyId: prop1.id,
      tenantId: tenant1.id,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2027, 0, 1),
      rentAmount: 350000,
      depositAmount: 700000,
      status: "ACTIVE",
    },
  });

  // Mise à jour de la propriété avec le currentLeaseId
  await prisma.property.update({
    where: { id: prop1.id },
    data: { currentLeaseId: lease1.id },
  });
  console.log("   ✅ 1 Contrat de bail actif créé.");

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
