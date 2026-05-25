import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "orae_popup_dismissed";
const INACTIVITY_DELAY = 40000; // 40 seconds

const WA_LINK = `https://wa.me/22890555323?text=${encodeURIComponent(
  "Bonjour, je souhaite commander le savon ORAE. Pouvez-vous m'aider ?",
)}`;

export function InactivityPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let timer: ReturnType<typeof setTimeout>;

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
          setVisible(true);
        }
      }, INACTIVITY_DELAY);
    }

    const events = ["mousemove", "scroll", "click", "touchstart"] as const;
    for (const e of events) {
      window.addEventListener(e, resetTimer, { passive: true });
    }
    resetTimer(); // Start timer on mount

    return () => {
      clearTimeout(timer);
      for (const e of events) {
        window.removeEventListener(e, resetTimer);
      }
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  function handleWhatsApp() {
    dismiss();
    window.open(WA_LINK, "_blank", "noopener,noreferrer");
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="inactivity-popup"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="fixed bottom-24 right-4 sm:bottom-24 sm:right-6 z-[60] w-[calc(100vw-2rem)] max-w-sm rounded-2xl shadow-elevated overflow-hidden"
          data-ocid="inactivity.popup"
          aria-label="Rappel de commande ORAE"
        >
          {/* Green card */}
          <div
            className="relative p-5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.42 0.18 150), oklch(0.52 0.18 150))",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-3 right-3 text-white/70 hover:text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Fermer"
              data-ocid="inactivity.close_button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="pr-6">
              <p className="text-2xl mb-2" aria-hidden="true">
                🧴
              </p>
              <h3 className="font-display font-bold text-white text-base leading-snug mb-1">
                Une question ? Commandez maintenant !
              </h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Notre équipe vous répond en quelques minutes sur WhatsApp.
              </p>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-white font-bold text-sm py-2.5 px-4 rounded-xl hover:bg-white/90 transition-colors"
                style={{ color: "oklch(0.42 0.18 150)" }}
                data-ocid="inactivity.whatsapp_button"
              >
                <WhatsAppIcon />
                Commander sur WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.508 5.832L0 24l6.335-1.481A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.964-1.343l-.357-.21-3.757.877.894-3.642-.232-.373A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
    </svg>
  );
}
