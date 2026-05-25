const WA_LINK = `https://wa.me/22890555323?text=${encodeURIComponent("Bonjour, je souhaite commander le savon ORAE :\nProduit :\nQuantité :\nLocalisation :\nMerci")}`;

export function HeroSection() {
  return (
    <section
      className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background"
      data-ocid="hero.section"
    >
      {/* LEFT column: text content — vertically centered */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:py-0 order-2 md:order-1">
        <p className="text-sm font-semibold uppercase tracking-widest text-foreground mb-5">
          Savon Liquide · Lomé
        </p>

        <h1
          className="font-display font-bold leading-none mb-6 text-foreground"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
        >
          Propreté fiable.
          <br />
          <span className="text-primary">Prix juste.</span>
          <br />
          Livraison rapide.
        </h1>

        <p className="text-foreground text-base sm:text-lg mb-10 max-w-sm leading-relaxed">
          Savon liquide efficace et économique — livré rapidement à Lomé.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex items-center justify-center gap-2 py-4 px-8 rounded-2xl text-lg font-bold shadow-elevated"
            data-ocid="hero.whatsapp_button"
          >
            <WhatsAppIcon />
            Commander sur WhatsApp
          </a>
          <a
            href="#commander"
            className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-semibold border-2 border-primary/40 text-primary hover:bg-primary/5 transition-smooth"
            data-ocid="hero.order_form_link"
          >
            Composer ma commande
          </a>
        </div>

        <p className="text-foreground text-xs mt-8 italic">
          Orae, pour tout ce qui compte.
        </p>
      </div>

      {/* RIGHT column: product image in rounded frame — landscape ratio for two bottles side-by-side */}
      <div className="relative w-full md:w-[52%] lg:w-[55%] min-h-[55vw] md:min-h-0 order-1 md:order-2 flex items-center justify-center p-8 md:p-12">
        <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-elevated bg-[#FAFAFA]">
          <img
            src="/assets/images/hero_lifestyle.jpeg"
            alt="Produits ORAE - savon liquide Lomé Togo"
            className="w-full h-auto object-contain block"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.508 5.832L0 24l6.335-1.481A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.964-1.343l-.357-.21-3.757.877.894-3.642-.232-.373A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
    </svg>
  );
}
