import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { prisma } from "@/lib/db";

async function main() {
  console.log("🚀 Démarrage du seeding pour Bailkey...");

  console.log("👤 Récupération de tous les utilisateurs et organisations depuis Clerk...");
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new Error("Clerk Secret Key is missing in environment variables.");

  const headers = { Authorization: `Bearer ${secretKey}` };
  
  const usersRes = await fetch("https://api.clerk.com/v1/users?limit=100", { headers });
  if (!usersRes.ok) throw new Error("Failed to fetch Clerk users: " + await usersRes.text());
  const usersDataRaw = await usersRes.json();
  const allUsers: any[] = Array.isArray(usersDataRaw) ? usersDataRaw : usersDataRaw.data || [];

  const orgsRes = await fetch("https://api.clerk.com/v1/organizations?limit=100", { headers });
  if (!orgsRes.ok) throw new Error("Failed to fetch Clerk orgs: " + await orgsRes.text());
  const orgsDataRaw = await orgsRes.json();
  const allOrgs: any[] = Array.isArray(orgsDataRaw) ? orgsDataRaw : orgsDataRaw.data || [];

  if (allUsers.length === 0) throw new Error("Aucun utilisateur Clerk trouvé.");
  if (allOrgs.length === 0) console.warn("⚠️ Aucune organisation Clerk trouvée.");

  console.log(`   ✅ ${allUsers.length} utilisateurs Clerk trouvés.`);
  console.log(`   ✅ ${allOrgs.length} organisations Clerk trouvées.`);

  // Nettoyage de la base de données
  console.log("🧹 Nettoyage des données existantes...");
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.propertyOwner.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.owner.deleteMany();

  // ---------------------------------------------------------------------------
  // 1. RÉFÉRENCEMENT DES AUTEURS (CLERK)
  // ---------------------------------------------------------------------------
  console.log("\n👤 Référencement des auteurs de démo pour chaque utilisateur...");

  const createdAuthors = [];
  
  // On donne le premier user comme auteur principal
  const primaryUserId = allUsers[0].id;
  
  for (const clerkUser of allUsers) {
    const author = {
      id: clerkUser.id,
      name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : "Utilisateur Anonyme",
      role: "Membre Bailkey",
    };
    createdAuthors.push(author);
    console.log(`   ✅ Auteur référencé : ${author.name} (${author.id})`);
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
  // 3. CRÉATION DES POSTS
  // ---------------------------------------------------------------------------
  console.log("\n📝 Création des articles (Global)...");

  const post1 = await prisma.post.create({
    data: {
      title: "Digitaliser la gestion locative entre Douala et Yaoundé",
      slug: "digitaliser-gestion-locative-douala-yaounde",
      category: "GUIDE",
      status: "PUBLISHED",
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 10)),
      readingTime: 6,
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
      coverImageAlt: "Vue aérienne d'un quartier d'affaires moderne",
      excerpt: "La fragmentation des données immobilières ralentit la rentabilité. Découvrez comment centraliser vos actifs sur l'axe Douala-Yaoundé.",
      metaTitle: "Digitalisation Gestion Locative Douala Yaoundé | Bailkey",
      metaDescription: "Guide complet pour digitaliser et optimiser la gestion de vos actifs immobiliers au Cameroun avec des outils SaaS modernes.",
      content: `La gestion immobilière moderne exige une précision chirurgicale. La véritable rentabilité ne naît pas seulement de l'acquisition de nouveaux actifs, mais de la maîtrise absolue des flux opérationnels existants.`,
      authorId: primaryUserId,
      tags: { connect: [{ slug: "digitalisation" }, { slug: "gestion-locative" }] },
    },
  });
  console.log(`   ✅ Article créé : ${post1.title}`);

  const post2 = await prisma.post.create({
    data: {
      title: "Optimisation de l'infrastructure SaaS : Pourquoi nous utilisons Next.js",
      slug: "optimisation-infrastructure-saas-nextjs",
      category: "ANALYSE",
      status: "PUBLISHED",
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      readingTime: 8,
      coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1200",
      coverImageAlt: "Architecture serveur et code",
      excerpt: "Plongée technique dans l'architecture qui permet à Bailkey de traiter des milliers de lots locatifs sans latence.",
      metaTitle: "Architecture SaaS Next.js pour l'Immobilier",
      metaDescription: "Découvrez nos choix architecturaux avec Next.js et Prisma pour garantir des performances extrêmes à nos gestionnaires immobiliers.",
      content: `La performance d'une plateforme métier ne doit faire l'objet d'aucun compromis. Pour garantir une expérience fluide à nos utilisateurs.`,
      authorId: primaryUserId,
      tags: { connect: [{ slug: "tech" }, { slug: "saas" }] },
    },
  });
  console.log(`   ✅ Article créé : ${post2.title}`);

  // ---------------------------------------------------------------------------
  // 4. CRÉATION DU PATRIMOINE IMMOBILIER POUR CHAQUE ORGANISATION
  // ---------------------------------------------------------------------------
  console.log("\n🏢 Création du patrimoine immobilier de démo pour CHAQUE organisation...");

  for (const clerkOrg of allOrgs) {
    const orgId = clerkOrg.id;
    console.log(`\n   --- Organisation : ${clerkOrg.name || orgId} ---`);

    // Création Propriétaires
    const owner1 = await prisma.owner.create({
      data: {
        organizationId: orgId,
        type: "INDIVIDUAL",
        firstName: "Jean-Paul",
        lastName: "Kamga",
        email: `jp.kamga.${orgId.substring(0, 5)}@invest.cm`,
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
        email: `contact.${orgId.substring(0, 5)}@horizon-immo.cm`,
        phone: "+237 699887766",
        address: "Avenue de Gaulle, Akwa",
        registrationNumber: "RC/DLA/2018/B/1452",
        taxNumber: "M111812345678W",
      },
    });
    console.log("      ✅ 2 Propriétaires créés.");

    // Création Propriétés
    const prop1 = await prisma.property.create({
      data: {
        organizationId: orgId,
        reference: `APP-AKW-${orgId.substring(0, 4)}`,
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
        createdById: primaryUserId,
        owners: { create: [{ ownerId: owner1.id, share: 100 }] },
      },
    });

    const prop2 = await prisma.property.create({
      data: {
        organizationId: orgId,
        reference: `VIL-BON-${orgId.substring(0, 4)}`,
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
        createdById: primaryUserId,
        owners: { create: [{ ownerId: owner2.id, share: 100 }] },
      },
    });

    console.log("      ✅ 2 Propriétés créées.");

    // Création Locataires
    const tenant1 = await prisma.tenant.create({
      data: {
        organizationId: orgId,
        type: "INDIVIDUAL",
        firstName: "Mireille",
        lastName: "Bengono",
        email: `mireille.b.${orgId.substring(0, 5)}@gmail.com`,
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
        email: `admin.${orgId.substring(0, 5)}@techsolutions.cm`,
        phone: "+237 233445566",
        address: "Bali, Douala",
        registrationNumber: "RC/DLA/2020/B/890",
        taxNumber: "M052012398765A",
      },
    });
    console.log("      ✅ 2 Locataires créés.");

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
    console.log("      ✅ 1 Contrat de bail actif créé.");
  }

  console.log("\n🎉 Seeding terminé avec succès pour toutes les organisations !");
}

main()
  .catch((e: unknown) => {
    console.error("❌ Erreur durant le seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
