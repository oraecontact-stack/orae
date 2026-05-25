import { motion } from "motion/react";

const ECO_PILLARS = [
  {
    title: "Fabriqué localement",
    description: "Conçu et produit à Lomé, pour tous les foyers.",
  },
  {
    title: "Moins de déchets",
    description: "Recharges économiques pour réduire les emballages.",
  },
  {
    title: "Moins de pollution",
    description: "Production locale = moins de transport.",
  },
  {
    title: "Économie locale",
    description: "Chaque achat soutient l'emploi togolais.",
  },
];

export function EcoSection() {
  return (
    <section className="bg-[#F0F4FF] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: big heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
              Engagement local
            </p>
            <h2
              className="font-display font-bold text-foreground leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
            >
              Un savon qui prend soin de tout.
              <br />
              <span className="text-secondary">Même de la planète.</span>
            </h2>
            <p className="text-foreground text-lg leading-relaxed">
              ORAE est conçu et fabriqué à Lomé. En choisissant ORAE, vous
              adoptez un produit local, économique, et plus respectueux de
              l&apos;environnement grâce à nos formats recharges.
            </p>
          </motion.div>

          {/* Right: eco pillars with generous spacing */}
          <div className="flex flex-col gap-8">
            {ECO_PILLARS.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-5"
              >
                <span
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-primary-foreground mt-0.5"
                  style={{ background: "oklch(0.52 0.18 160)" }}
                  aria-hidden
                >
                  ✓
                </span>
                <div>
                  <p className="text-foreground font-bold text-base leading-relaxed">
                    {pillar.title}
                  </p>
                  <p className="text-foreground text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
