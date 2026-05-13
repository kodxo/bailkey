import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function PostDetailPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow pt-[120px] pb-xl px-gutter md:px-xl max-w-7xl mx-auto w-full">
        {/* Article Header */}
        <header className="mb-xl max-w-4xl">
          <div className="flex items-center space-x-4 mb-6">
            <span className="font-label-caps text-label-caps text-primary bg-primary-container/20 px-3 py-1 uppercase tracking-wider">
              Guide
            </span>
            <span className="text-sm text-on-surface-variant flex items-center">
              <span
                className="material-symbols-outlined text-[18px] mr-1"
                data-weight="regular"
              >
                calendar_today
              </span>
              24 Octobre 2024
            </span>
            <span className="text-sm text-on-surface-variant flex items-center">
              <span
                className="material-symbols-outlined text-[18px] mr-1"
                data-weight="regular"
              >
                schedule
              </span>
              8 min de lecture
            </span>
          </div>
          <h1 className="font-display text-display text-on-surface mb-8">
            Optimiser la rentabilité de votre parc immobilier avec Odoo 19
          </h1>
          <div className="flex items-center space-x-4">
            <Image
              alt="Author Avatar"
              className="w-12 h-12 object-cover bg-surface-container"
              data-alt="A professional headshot of a corporate real estate expert. The lighting is bright and modern, creating a clean, trustworthy aesthetic. The background is a soft, muted grey. The overall mood is confident and authoritative."
              src="https://lh3.googleusercontent.com/aida/ADBb0ugubDjGfPuVmMSOS54lqHg9TM4euefgkUp_rL9rJd1OnwRLb7h5VpWSLcTYY7yrhe0PrSurti1Hyv8eZpMoWGa7lxyBLK9Vq6q2Ir2FX2nUC5U_WB2_TKuytePl44yiVWMmqowNnKsiteoV_hAVhShg3eJn8j35F6CxqhaHyRhC32YMHCjD9hDI8PmCk9QPbTNFV1cvixqf18r0bbAhQas4UcT4rP670Soz0WCPYt5njtdaWSQmWsHsGg1bNDtri5KccIphYStOEw"
              width={48}
              height={48}
            />
            <div>
              <div className="font-h3 text-h3 text-on-surface">
                Jean-Marc Laurent
              </div>
              <div className="text-sm text-on-surface-variant">
                Directeur des Opérations, BailKey
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div
          className="w-full h-[500px] mb-xl relative bg-surface-container overflow-hidden shadow-lg"
          style={{ boxShadow: "0 32px 64px -16px rgba(46, 177, 178, 0.1)" }}
        >
          <Image
            alt="Architectural Real Estate Cover"
            className="object-cover"
            fill
            priority
            data-alt="A cinematic, wide-angle shot of a modern, high-end commercial building facade bathed in soft, early morning light. The architecture is characterized by clean lines, expansive glass panels reflecting the sky, and precise geometric shapes. The color palette is composed of cool greys, slate blues, and a subtle hint of teal in the reflections, establishing a premium, corporate modern aesthetic."
            src="https://lh3.googleusercontent.com/aida/ADBb0ug2SCjJ4Y4uvU2VXyrktzzAJBtVQBGhaiP3RLMNiTW0xhghBThJ7DXJVdTs68rYUzvQNXBMhuKK3gYmjjI4KGRf0mdUSocM9uGVwuCjf-g1_YdVQiMpV5tcHYPQgBpMxQuIMHn_i2fozn92bW3XbYGKyBYfhxgQ9uEWKTOhQEVX6EZfL23AoscJTyAzVrxK6nbzuQuH7sLKaTmcKzryjX6FOyxJ5IcOcfcFGT7oE2xF2jL3_jB4qLGBT12LKfBZFfKaAXI5Mmfj"
          />
        </div>

        {/* Article Body & Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-xl">
          {/* Main Content */}
          <article className="lg:w-2/3 max-w-3xl prose prose-slate">
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <h2 className="font-h2 text-h2 text-on-surface mt-10 mb-4">
              La centralisation des données
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
              quia consequuntur magni dolores eos qui ratione voluptatem sequi
              nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
              sit amet.
            </p>
            <blockquote className="my-8 pl-6 border-l-4 border-primary bg-surface-container-low p-6 font-h3 text-h3 text-on-surface italic shadow-sm relative overflow-hidden">
              &quot;La véritable rentabilité ne naît pas seulement de
              l&apos;acquisition de nouveaux actifs, mais de la maîtrise absolue
              des flux opérationnels existants.&quot;
            </blockquote>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat
              voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
              ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
              consequatur?
            </p>
            <h2 className="font-h2 text-h2 text-on-surface mt-10 mb-4">
              Automatisation des flux financiers
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit
              esse quam nihil molestiae consequatur, vel illum qui dolorem eum
              fugiat quo voluptas nulla pariatur? At vero eos et accusamus et
              iusto odio dignissimos ducimus qui blanditiis praesentium
              voluptatum deleniti atque corrupti quos dolores et quas molestias
              excepturi sint occaecati cupiditate non provident.
            </p>
            <div className="bg-surface-container p-8 my-8 border border-outline-variant shadow-sm">
              <h3 className="font-h3 text-h3 text-on-surface mb-3 flex items-center">
                <span className="material-symbols-outlined text-primary mr-2">
                  lightbulb
                </span>
                Point Clé
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                L&apos;intégration d&apos;Odoo 19 permet une réduction moyenne
                de 22% des coûts de traitement administratif lors de la première
                année d&apos;implémentation.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-[120px]">
              <h3 className="font-h3 text-h3 text-on-surface mb-6 border-b border-outline-variant pb-2">
                Articles recommandés
              </h3>
              <div className="space-y-6">
                {/* Related Article 1 */}
                <a
                  className="group block bg-surface-container-low border border-transparent hover:border-primary/30 transition-colors shadow-sm"
                  href="#"
                >
                  <div className="h-32 bg-surface-variant relative overflow-hidden">
                    <Image
                      alt="Office building"
                      className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      fill
                      data-alt="A low-angle perspective of a glass-facade office building reaching towards a clear blue sky. The geometric patterns of the windows create a structured, corporate modern look. The lighting is bright and clear, reflecting a professional and organized environment."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJlmxqjKW14_EsrvLXwFwmsUGTTk5oLlu1h7Hfx0W8Jz7s_0lVM7NrvIY9v5BoBodQ-oLbOfjaiCZZeEMHjksADVOFIfs7CsgTqGihflZQ5d2L7DDEYAn_EXl2MGXzKlTCGq8YY4Dan9asmesLCP_asR7BGxS71_LmO7aZcZnL8NBPd4YZK1OR4KMqeCZwd8iZ6QIcHCMAf6V4IT1Li_qfoRcTHQ6aZRJMvgSe6XEDzSqWp3b8pPYVCYb_eg2DqONZJhJVbMSwhD4"
                    />
                  </div>
                  <div className="p-4">
                    <span className="font-label-caps text-label-caps text-primary mb-2 block uppercase">
                      Analyse
                    </span>
                    <h4 className="font-body-lg text-body-lg text-on-surface font-semibold group-hover:text-primary transition-colors leading-snug">
                      Tendances du marché tertiaire Q3 2024
                    </h4>
                  </div>
                </a>
                {/* Related Article 2 */}
                <a
                  className="group block bg-surface-container-low border border-transparent hover:border-primary/30 transition-colors shadow-sm"
                  href="#"
                >
                  <div className="h-32 bg-surface-variant relative overflow-hidden">
                    <Image
                      alt="Architecture abstract"
                      className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      fill
                      data-alt="An abstract detail shot of modern interior architecture, featuring clean lines, light wood panels, and stark white walls. The lighting is diffused and soft, creating a calm, systematic mood. The aesthetic is highly precise and clean."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdd1Osu4IYlegcii3RDUlORyE_DgzI29dNIf2EpqEd8IqiWLMG_ZX5bxDToF-LHtPcQu-2AD70TWmmZ6N7DWCtg0vWFJUNrKw9-kPEtIOGcq3bfse0Zi1FsCyUxSM0Sz-khr2chZBl96C5lqarp121mQTtAm9MuYxQFkk5b8RkGH-NEMylU0bf2gn2kiHIXC_itypwtVtEFurEJUNZQgf9iR01WaimjMc6S3T6RKjuy5QHa6FDXoOWBf9gqnIB1e_m5wWGL6kcVyc"
                    />
                  </div>
                  <div className="p-4">
                    <span className="font-label-caps text-label-caps text-primary mb-2 block uppercase">
                      Cas Client
                    </span>
                    <h4 className="font-body-lg text-body-lg text-on-surface font-semibold group-hover:text-primary transition-colors leading-snug">
                      Comment AlphaCap a digitalisé 400 lots
                    </h4>
                  </div>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
