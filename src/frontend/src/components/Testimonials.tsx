import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    name: "Aminata K.",
    neighborhood: "Tokoin",
    quote:
      "Le spray ORAE est devenu indispensable dans ma cuisine. Il nettoie tout en quelques secondes !",
  },
  {
    name: "Kofi Mensah",
    neighborhood: "Bé",
    quote:
      "J'achète le bidon 1L chaque semaine pour toute la famille. Efficace et vraiment économique.",
  },
  {
    name: "Fatoumata D.",
    neighborhood: "Plateau",
    quote:
      "Je l'utilise aussi dans mon salon de coiffure. Mes clientes adorent la propreté impeccable.",
  },
  {
    name: "Yao Agbessi",
    neighborhood: "Adidogomé",
    quote:
      "La recharge 5L est parfaite pour mon restaurant. Je recommande ORAE sans hésitation.",
  },
  {
    name: "Akosua B.",
    neighborhood: "Démocratic",
    quote:
      "Produit local de qualité. Je suis fière de soutenir une marque togolaise comme ORAE.",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  }, []);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(next, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, next]);

  const t = TESTIMONIALS[current];

  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Ils font confiance à ORAE
          </p>
          <h2
            className="font-display font-bold text-foreground leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Déjà adoptés par plusieurs{" "}
            <span className="text-primary">familles à Lomé.</span>
          </h2>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          data-ocid="testimonials.carousel"
        >
          {/* Navigation arrows */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            aria-label="Témoignage précédent"
            data-ocid="testimonials.prev_button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 sm:w-5 sm:h-5"
              role="img"
              aria-label="Précédent"
            >
              <title>Précédent</title>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            aria-label="Témoignage suivant"
            data-ocid="testimonials.next_button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 sm:w-5 sm:h-5"
              role="img"
              aria-label="Suivant"
            >
              <title>Suivant</title>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Card container */}
          <div className="overflow-hidden px-10 sm:px-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="bg-card rounded-2xl border border-border shadow-card p-6 sm:p-8 text-center"
                data-ocid={`testimonials.item.${current + 1}`}
              >
                {/* Stars */}
                <div
                  className="flex justify-center gap-1 mb-4"
                  aria-label="5 étoiles"
                >
                  {["s1", "s2", "s3", "s4", "s5"].map((key) => (
                    <svg
                      key={key}
                      viewBox="0 0 20 20"
                      fill="oklch(0.52 0.18 150)"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground text-base sm:text-lg leading-relaxed mb-6 font-medium">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-primary-foreground flex-shrink-0"
                    style={{ background: "oklch(0.52 0.18 150)" }}
                    aria-hidden
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.neighborhood}, Lomé
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current
                    ? "bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Aller au témoignage ${i + 1}`}
                data-ocid={`testimonials.dot.${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
