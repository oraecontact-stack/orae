import { motion } from "motion/react";
import { useState } from "react";

export function WhyOrae() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-[#F0F4FF] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2
            className="font-display font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#1A2B5F" }}
          >
            Pourquoi ORAE&nbsp;?
          </h2>
        </motion.div>

        {/* Intro visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-8"
        >
          <p
            className="text-base leading-relaxed mb-4"
            style={{ color: "#1A2B5F" }}
          >
            Parce qu&apos;au fond, on cherche tous la même chose&nbsp;: un
            produit simple, efficace et agréable à utiliser au quotidien.
          </p>
          <ul className="flex flex-col gap-2 pl-2 mb-4">
            {[
              "Un savon qui nettoie bien.",
              "Qui laisse une bonne odeur.",
              "Qui dure.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#F97316" }}
                />
                <span
                  className="text-base leading-relaxed"
                  style={{ color: "#1A2B5F" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-base leading-relaxed" style={{ color: "#1A2B5F" }}>
            Mais aujourd&apos;hui, ce n&apos;est pas toujours évident.
          </p>
        </motion.div>

        {/* Expanded content */}
        <motion.div
          initial={false}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {/* Bloc tension */}
          <div
            className="mb-10 pl-5 border-l-4"
            style={{ borderColor: "#F97316" }}
          >
            <p
              className="text-base leading-relaxed"
              style={{ color: "#1A2B5F" }}
            >
              Parfois les produits sont trop chers.
              <br />
              Parfois ils ne durent pas.
              <br />
              Parfois ils sont pratiques… mais pas vraiment efficaces.
              <br />
              <span className="font-semibold">
                Alors on a voulu faire les choses autrement.
              </span>
            </p>
          </div>

          {/* Bloc mission (citation) */}
          <div
            className="mb-10 rounded-2xl p-6"
            style={{
              background: "rgba(249,115,22,0.07)",
              border: "1px solid rgba(249,115,22,0.18)",
            }}
          >
            <p
              className="text-base leading-relaxed font-display"
              style={{ color: "#1A2B5F" }}
            >
              ORAE est né d&apos;une idée très simple&nbsp;:
              <br />
              <span className="font-bold text-lg">
                Créer un savon liquide moderne, accessible et pensé pour la
                vraie vie.
              </span>
              <br />
              <br />
              Pas un produit compliqué. Pas un produit qu&apos;on hésite à
              utiliser tous les jours.
              <br />
              Mais un savon fait pour accompagner naturellement le
              quotidien&nbsp;: dans la cuisine, dans la salle de bain, au
              travail, à la maison, et partout où la propreté compte.
            </p>
          </div>

          {/* Bloc émotion */}
          <div className="mb-10">
            <p
              className="text-base font-semibold mb-2"
              style={{ color: "#1A2B5F" }}
            >
              Pourquoi ORAE&nbsp;?
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#1A2B5F" }}
            >
              Parce qu&apos;il y a quelque chose de rassurant dans un espace
              propre.
              <br />
              Cette sensation après avoir nettoyé.
              <br />
              Cette fraîcheur qu&apos;on remarque immédiatement.
              <br />
              Cette bouteille qu&apos;on garde près de l&apos;évier et
              qu&apos;on utilise tous les jours sans même y penser.
              <br />
              <span className="italic">
                Ce sont de petites choses… mais ce sont souvent elles qui
                rendent le quotidien plus agréable.
              </span>
            </p>
          </div>

          {/* Bloc usage réel */}
          <div
            className="mb-10 pl-5 border-l-4"
            style={{ borderColor: "#1A2B5F" }}
          >
            <p
              className="text-base leading-relaxed"
              style={{ color: "#1A2B5F" }}
            >
              ORAE a été pensé pour les vraies habitudes des familles et des
              professionnels.
              <br />
              Une bouteille qu&apos;on peut garder. Des recharges plus
              économiques. Des formats adaptés aux besoins du quotidien.
              <br />
              <span className="font-semibold">
                Parce qu&apos;au final, les produits qu&apos;on aime vraiment
                sont souvent les plus simples&nbsp;: ceux qui facilitent la vie
                sans la compliquer.
              </span>
            </p>
          </div>

          {/* Questions rhétoriques */}
          <div className="mb-10">
            <p
              className="text-base leading-relaxed italic"
              style={{ color: "#1A2B5F" }}
            >
              Pourquoi jeter une bouteille à chaque fois, quand on peut
              simplement la recharger&nbsp;?
              <br />
              Pourquoi payer plus pour quelque chose de compliqué, quand une
              solution simple peut faire le travail efficacement&nbsp;?
            </p>
          </div>

          {/* Positioning */}
          <div
            className="mb-10 rounded-2xl p-5"
            style={{ background: "rgba(26,43,95,0.05)" }}
          >
            <p
              className="font-display font-bold text-lg"
              style={{ color: "#1A2B5F" }}
            >
              ORAE, c&apos;est une manière plus pratique, plus moderne et plus
              intelligente de consommer au quotidien.
            </p>
          </div>

          {/* Croyance */}
          <div
            className="mb-10 rounded-2xl p-6"
            style={{
              background: "rgba(249,115,22,0.07)",
              border: "1px solid rgba(249,115,22,0.18)",
            }}
          >
            <p
              className="text-base leading-relaxed"
              style={{ color: "#1A2B5F" }}
            >
              Mais surtout&hellip; ORAE existe parce que nous croyons qu&apos;un
              espace propre change la façon dont on se sent.
              <br />
              On se sent mieux. Plus tranquille. Plus à l&apos;aise chez soi.
              <br />
              <span className="font-semibold">
                Et parfois, ce sont justement ces petits détails du quotidien
                qui font toute la différence.
              </span>
            </p>
          </div>

          {/* Conclusion */}
          <div className="mb-10">
            <p
              className="text-base leading-relaxed font-semibold mb-3"
              style={{ color: "#1A2B5F" }}
            >
              Alors pourquoi ORAE&nbsp;? Parce qu&apos;ORAE a été pensé pour les
              vrais besoins, les vraies habitudes, et tous les espaces qui
              comptent vraiment.
            </p>
          </div>
        </motion.div>

        {/* Voir plus / Voir moins button */}
        <div className="flex justify-center mb-10">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 font-semibold text-sm transition-all duration-200 hover:shadow-md"
            style={{
              borderColor: "#F97316",
              color: "#F97316",
              background: expanded ? "rgba(249,115,22,0.07)" : "transparent",
            }}
            data-ocid="why_orae.voir_plus_button"
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                Voir moins
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </>
            ) : (
              <>
                Voir plus
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Tagline finale — always visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-14"
        >
          <p
            className="font-display font-bold leading-tight"
            style={{ fontSize: "clamp(1.6rem, 5vw, 2.6rem)", color: "#F97316" }}
          >
            Pureté. Partout. Toujours.
          </p>
        </motion.div>

        {/* SEO paragraph — discret */}
        <div className="border-t border-border pt-8">
          <p
            className="text-xs leading-relaxed max-w-2xl"
            style={{ color: "#9ca3af" }}
          >
            ORAE est le <strong>savon liquide économique</strong> de référence à{" "}
            <strong>Lomé, Togo</strong>. Notre <strong>savon pas cher</strong>{" "}
            s&apos;adapte à tous les besoins de votre famille. Commandez votre{" "}
            <strong>savon liquide à Lomé</strong> directement via WhatsApp,
            livré rapidement dans tout Lomé.
          </p>
        </div>
      </div>
    </section>
  );
}
