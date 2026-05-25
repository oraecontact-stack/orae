import { useEffect, useRef } from "react";

type ModalType = "mentions" | "confidentialite";

interface LegalModalProps {
  type: ModalType;
  onClose: () => void;
}

const MENTIONS_CONTENT = {
  title: "Mentions Légales",
  sections: [
    {
      heading: "Éditeur du site",
      body: [
        "ORAE — Lomé, Togo",
        "Activité : Fabrication et vente de savon liquide",
        "Contact : info@oraeproducts.com / orae.contact@gmail.com",
        "WhatsApp : +229 90 55 53 23",
      ],
    },
    {
      heading: "Hébergement",
      body: [
        "Ce site est hébergé sur Internet Computer, une infrastructure décentralisée gérée par la DFINITY Foundation, Zurich, Suisse.",
      ],
    },
    {
      heading: "Propriété intellectuelle",
      body: [
        "L'ensemble du contenu de ce site (textes, images, logo, nom de marque ORAE) est la propriété exclusive d'ORAE. Toute reproduction, même partielle, est interdite sans autorisation écrite.",
      ],
    },
    {
      heading: "Responsabilité",
      body: [
        "Les informations, prix et disponibilités présentés sur ce site sont fournis à titre indicatif et peuvent être modifiés sans préavis. Les frais de livraison affichés sont des estimations calculées automatiquement selon la distance depuis notre point d'expédition (65RF+R9P, Lomé) — le montant exact est confirmé lors de la prise en charge de la commande via WhatsApp.",
        "ORAE ne saurait être tenu responsable des erreurs ou omissions dans le contenu du site.",
      ],
    },
    {
      heading: "Droit applicable",
      body: [
        "Le présent site est soumis au droit togolais. Tout litige relatif à son utilisation est de la compétence exclusive des tribunaux compétents de Lomé, Togo.",
      ],
    },
  ],
};

const CONFIDENTIALITE_CONTENT = {
  title: "Politique de Confidentialité",
  subtitle: "Dernière mise à jour : mai 2025",
  sections: [
    {
      heading: "Données collectées",
      body: [
        "ORAE ne collecte, ne stocke ni ne vend aucune donnée personnelle via ce site.",
        "Lors du calcul des frais de livraison, l'adresse saisie ou détectée est transmise à l'API Google Maps uniquement pour estimer la distance — aucune donnée n'est enregistrée sur nos serveurs.",
      ],
    },
    {
      heading: "Traitement des commandes",
      body: [
        "Toutes les commandes sont finalisées via WhatsApp. En utilisant WhatsApp, vous êtes soumis à la politique de confidentialité de Meta (WhatsApp). ORAE n'a accès qu'aux informations que vous partagez volontairement dans votre message.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "Ce site n'utilise aucun cookie de tracking, de publicité ciblée ou d'analyse comportementale. Aucune donnée de navigation n'est collectée.",
      ],
    },
    {
      heading: "API Google Maps",
      body: [
        "Ce site utilise l'API Google Maps pour estimer les distances de livraison. Cette utilisation est soumise aux Conditions d'utilisation et à la Politique de confidentialité de Google.",
      ],
    },
    {
      heading: "Vos droits",
      body: [
        "Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de rectification et de suppression de toute donnée vous concernant. Pour exercer ces droits, contactez-nous à : info@oraeproducts.com",
      ],
    },
    {
      heading: "Contact",
      body: ["ORAE — Lomé, Togo", "info@oraeproducts.com"],
    },
  ],
};

export function LegalModal({ type, onClose }: LegalModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const content =
    type === "mentions" ? MENTIONS_CONTENT : CONFIDENTIALITE_CONTENT;
  const subtitleText =
    type === "confidentialite"
      ? (
          CONFIDENTIALITE_CONTENT as typeof CONFIDENTIALITE_CONTENT & {
            subtitle?: string;
          }
        ).subtitle
      : undefined;

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Auto-focus close button
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.60)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (
          (e.key === "Enter" || e.key === " ") &&
          e.target === e.currentTarget
        )
          onClose();
      }}
      data-ocid="legal.modal"
    >
      <dialog
        ref={dialogRef}
        open
        aria-labelledby="legal-modal-title"
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl p-0 border-0 m-0"
        style={{
          background: "#fff",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5 border-b"
          style={{ borderColor: "rgba(26,43,95,0.10)" }}
        >
          <h2
            id="legal-modal-title"
            className="font-display font-bold text-xl leading-tight"
            style={{ color: "#1A2B5F" }}
          >
            {content.title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            data-ocid="legal.close_button"
            className="ml-4 flex items-center justify-center w-9 h-9 rounded-full transition-colors"
            style={{ background: "rgba(26,43,95,0.06)", color: "#1A2B5F" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-8 py-6 flex-1">
          {subtitleText && (
            <p
              className="text-sm font-medium mb-6"
              style={{ color: "#1A2B5F", opacity: 0.55 }}
            >
              {subtitleText}
            </p>
          )}
          <div className="space-y-6">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h3
                  className="font-display font-bold text-sm uppercase tracking-wide mb-2"
                  style={{ color: "#2E7D32" }}
                >
                  {section.heading}
                </h3>
                <div className="space-y-2">
                  {section.body.map((line) => (
                    <p
                      key={line.slice(0, 50)}
                      className="text-sm leading-relaxed"
                      style={{ color: "#1A2B5F", opacity: 0.85 }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-5 border-t flex justify-center"
          style={{ borderColor: "rgba(26,43,95,0.10)" }}
        >
          <button
            type="button"
            onClick={onClose}
            data-ocid="legal.confirm_button"
            className="px-8 py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "#2E7D32" }}
          >
            Fermer
          </button>
        </div>
      </dialog>
    </div>
  );
}
