import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResourcesGrid } from "@/components/ResourcesGrid";
import { getPublishedPosts } from "@/lib/dal/posts";

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Ressources & Expertise | BailKey",
  description:
    "Explorez nos guides, études de cas et articles pour optimiser la gestion de votre portefeuille immobilier.",
};

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function ResourcesPage() {
  const { posts } = await getPublishedPosts();

  return (
    <>
      <Navbar />

      <main className="grow pt-32 pb-xl px-6 max-w-7xl mx-auto w-full min-h-screen">
        {/* Hero Section */}
        <section className="mb-16 text-center md:text-left">
          <h1 className="font-display text-display text-on-surface mb-4">
            Ressources & Expertise
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Explorez nos guides, études de cas et articles pour optimiser la
            gestion de votre portefeuille immobilier grâce à des stratégies
            éprouvées et des technologies de pointe.
          </p>
        </section>

        {/* Client Component : Filtres + Grille dynamique */}
        <ResourcesGrid posts={posts} />

        {/* Newsletter Section */}
        <section className="bg-surface-container border border-outline-variant/50 p-8 rounded-none mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="md:w-1/2">
            <h2 className="font-h1 text-h1 text-on-surface mb-2">
              Restez informé de nos expertises
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Recevez nos dernières publications directement dans votre boîte
              mail.
            </p>
          </div>
          <form
            className="w-full md:w-1/2 flex flex-col sm:flex-row gap-2"
            action="#"
          >
            <input
              className="grow bg-surface-container-lowest border border-outline rounded-none px-4 py-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-on-surface-variant/50"
              placeholder="Votre adresse email professionnelle"
              type="email"
              required
            />
            <button
              className="bg-primary text-on-primary font-h3 text-sm uppercase tracking-wider px-6 py-3 rounded-none hover:bg-primary/90 transition-colors whitespace-nowrap"
              type="submit"
            >
              S&apos;inscrire
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
