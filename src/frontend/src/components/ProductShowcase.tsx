import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

const WA_BASE = "https://wa.me/22890555323?text=";

const SHOWCASE_PRODUCTS = [
  {
    id: "orae-1l",
    name: "ORAE 1L",
    price: "2 000 FCFA",
    image: "/assets/images/1litre_new.jpeg",
    imageAlt: "1L - Savon liquide ORAE format familial",
    tag: "Format économique",
    bullets: [
      "Idéal pour la famille",
      "Recharge économique",
      "Usage quotidien",
    ],
    waText:
      "Bonjour, je souhaite commander le savon ORAE 1L.\nQuantité :\nLocalisation :\nMerci",
  },
  {
    id: "orae-press-on",
    name: "ORAE Press On 0.5l",
    price: "1 200 FCFA",
    image: "/assets/images/0.5litre.jpeg",
    imageAlt: "Press On 0.5l - Savon liquide ORAE format pratique",
    tag: "Format pratique",
    bullets: [
      "Pratique et rapide",
      "Idéal cuisine, mains, surfaces",
      "Format moderne",
    ],
    waText:
      "Bonjour, je souhaite commander le savon ORAE Press On 0.5l.\nQuantité :\nLocalisation :\nMerci",
  },
];

export function ProductShowcase() {
  return (
    <section
      id="produits"
      className="bg-[#FFF6F0] py-24 px-6 overflow-x-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Nos produits
          </p>
          <h2
            className="font-display font-bold text-foreground leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Deux formats,{" "}
            <span className="text-primary">un seul engagement.</span>
          </h2>
        </motion.div>

        {/* Side-by-side grid on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SHOWCASE_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group"
              data-ocid={`products.item.${index + 1}`}
            >
              <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-card flex flex-col h-full">
                {/* Product image — portrait ratio for vertical bottle, consistent across both cards */}
                <div className="w-full overflow-hidden flex items-center justify-center aspect-[3/4] bg-white">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    className="w-full h-full object-contain transition-smooth p-2"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-6 flex-1">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                      {product.tag}
                    </span>
                    <h3 className="font-display font-bold text-xl text-foreground mb-1">
                      {product.name}
                    </h3>
                    <p
                      className="font-bold text-3xl mb-5"
                      style={{ color: "#FF6B00" }}
                    >
                      {product.price}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {product.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-3 text-foreground text-sm"
                        >
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: "oklch(0.52 0.18 150 / 0.15)",
                              color: "oklch(0.42 0.18 150)",
                            }}
                          >
                            ✓
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={`${WA_BASE}${encodeURIComponent(product.waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`products.whatsapp_button.${index + 1}`}
                  >
                    <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-6 py-3 font-semibold">
                      <WhatsAppIcon />
                      Commander via WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* PACKS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Nos packs
          </p>
          <h2
            className="font-display font-bold text-foreground leading-tight mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Packs{" "}
            <span className="text-secondary">groupés &amp; économiques</span>
          </h2>
          <p className="text-foreground text-base sm:text-lg max-w-xl">
            Économisez jusqu&apos;à 5% sur nos packs — plus vous prenez, plus
            vous économisez.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PACKS.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
              data-ocid={`packs.item.${index + 1}`}
            >
              <div
                className="rounded-3xl border-2 border-primary/20 overflow-hidden shadow-card flex flex-col h-full"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.97 0.04 150 / 0.25), oklch(0.96 0.03 160 / 0.15))",
                }}
              >
                {/* Pack header */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-sm font-bold px-3 py-1 rounded-full text-primary-foreground"
                      style={{ background: "oklch(0.52 0.18 150)" }}
                    >
                      {pack.name}
                    </span>
                    <span
                      className="text-sm font-bold px-3 py-1 rounded-full"
                      style={{
                        color: "#FF6B00",
                        background: "rgba(255,107,0,0.1)",
                      }}
                    >
                      {pack.discount}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    {pack.subtitle}
                  </p>
                  <ul className="space-y-1">
                    {pack.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-foreground text-sm"
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            background: "oklch(0.52 0.18 150 / 0.15)",
                            color: "oklch(0.42 0.18 150)",
                          }}
                        >
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto px-6 pb-6 pt-2">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-muted-foreground line-through text-sm">
                      {pack.originalPrice.toLocaleString("fr-FR")} FCFA
                    </span>
                    <span
                      className="font-bold text-2xl"
                      style={{ color: "#FF6B00" }}
                    >
                      {pack.discountedPrice.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <a
                    href={`${WA_BASE}${encodeURIComponent(pack.waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`packs.whatsapp_button.${index + 1}`}
                  >
                    <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-6 py-3 font-semibold">
                      <WhatsAppIcon />
                      Commander ce pack
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PACKS = [
  {
    id: "pack-decouverte",
    name: "Pack Découverte",
    subtitle: "1L + 1 Press On 0.5l — parfait pour découvrir ORAE",
    items: ["1× ORAE 1L", "1× ORAE Press On 0.5l"],
    originalPrice: 3200,
    discountedPrice: 3000,
    discount: "−5%",
    waText:
      "Bonjour, je souhaite commander le Pack Découverte ORAE (1L + Press On 0.5l).\nQuantité :\nLocalisation :\nMerci",
  },
  {
    id: "pack-maison",
    name: "Pack Jeune",
    subtitle: "3L + 1 Press On 0.5l — idéal pour la maison",
    items: ["3× ORAE 1L", "1× ORAE Press On 0.5l"],
    originalPrice: 7200,
    discountedPrice: 6500,
    discount: "−10%",
    waText:
      "Bonjour, je souhaite commander le Pack Jeune ORAE (3L + 1 Press On 0.5l).\nQuantité :\nLocalisation :\nMerci",
  },
  {
    id: "pack-famille",
    name: "Pack Famille",
    subtitle: "6L + 2 Press On 0.5l — économique pour toute la famille",
    items: ["6× ORAE 1L", "2× ORAE Press On 0.5l"],
    originalPrice: 14400,
    discountedPrice: 13000,
    discount: "−10%",
    waText:
      "Bonjour, je souhaite commander le Pack Famille ORAE (6L + 2 Press On 0.5l).\nQuantité :\nLocalisation :\nMerci",
  },
  {
    id: "pack-pro",
    name: "Pack Pro",
    subtitle: "10L + 2 Press On 0.5l — idéal pour les professionnels",
    items: ["10× ORAE 1L", "2× ORAE Press On 0.5l"],
    originalPrice: 22400,
    discountedPrice: 20200,
    discount: "−10%",
    waText:
      "Bonjour, je souhaite commander le Pack Pro ORAE (10L + 2 Press On 0.5l).\nQuantité :\nLocalisation :\nMerci",
  },
];

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 mr-2"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.508 5.832L0 24l6.335-1.481A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.964-1.343l-.357-.21-3.757.877.894-3.642-.232-.373A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
    </svg>
  );
}
