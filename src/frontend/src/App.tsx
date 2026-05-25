import { BubbleBackground } from "@/components/BubbleBackground";
import { EcoSection } from "@/components/EcoSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { InactivityPopup } from "@/components/InactivityPopup";
import { OrderForm } from "@/components/OrderForm";
import { ProductShowcase } from "@/components/ProductShowcase";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { Testimonials } from "@/components/Testimonials";
import { WhyOrae } from "@/components/WhyOrae";

/* Header / Navbar */
function Header() {
  const WA_LINK = `https://wa.me/22890555323?text=${encodeURIComponent(
    "Bonjour, je souhaite commander le savon ORAE :\nProduit :\nQuantité :\nLocalisation :\nMerci",
  )}`;
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src="/assets/images/logo_fond_transparent_1.png"
            alt="ORAE"
            className="h-8 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="font-display font-bold text-xl text-primary">
            ORAE
          </span>
        </div>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp text-sm py-2 px-4 flex items-center gap-1.5"
          data-ocid="header.whatsapp_button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.508 5.832L0 24l6.335-1.481A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.964-1.343l-.357-.21-3.757.877.894-3.642-.232-.373A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
          </svg>
          Commander
        </a>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen bg-background"
      style={{ scrollBehavior: "smooth" }}
    >
      <BubbleBackground />
      <Header />
      {/* Push content below fixed header */}
      <div className="pt-[72px]">
        <HeroSection />
        <section id="avantages">
          <WhyOrae />
        </section>
        <section id="produits">
          <ProductShowcase />
        </section>
        <section id="commande">
          <OrderForm />
        </section>
        <section id="temoignages">
          <Testimonials />
        </section>
        <section id="eco">
          <EcoSection />
        </section>
        <Footer />
      </div>
      <StickyWhatsApp />
      <InactivityPopup />
    </div>
  );
}
