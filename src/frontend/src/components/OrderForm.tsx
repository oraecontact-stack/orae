import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type OrderItem,
  PACKS,
  PRODUCTS,
  buildWhatsAppMessage,
} from "@/types/order";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const ORIGIN = "65RF+R9P, Lomé, Togo";

function calcTieredFee(km: number): number {
  if (km <= 2) return 500;
  let fee = 500;
  const segments: [number, number, number][] = [
    [2, 4, 125],
    [4, 7, 75],
    [7, 15, 90],
    [15, 20, 70],
    [20, 999999, 30],
  ];
  for (const [from, to, rate] of segments) {
    if (km <= from) break;
    const rangeKm = Math.min(km, to) - from;
    fee += rangeKm * rate;
  }
  return fee;
}

type DeliveryState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; km: number; fee: number; durationMins: number }
  | { status: "error"; message: string };

// Google Maps types (loaded via script tag in index.html)
declare global {
  interface Window {
    googleMapsReady: boolean;
    initGoogleMaps: () => void;
    google: {
      maps: {
        places: {
          Autocomplete: new (
            el: HTMLInputElement,
            opts?: object,
          ) => GooglePlacesAutocomplete;
        };
        Geocoder: new () => GoogleGeocoder;
        DistanceMatrixService: new () => GoogleDistanceMatrixService;
        TravelMode: { DRIVING: string };
      };
    };
  }
}

interface GooglePlacesAutocomplete {
  addListener: (event: string, cb: () => void) => void;
  getPlace: () => { formatted_address?: string; name?: string };
}

interface GoogleGeocoder {
  geocode: (
    req: { location: { lat: number; lng: number } },
    cb: (results: Array<{ formatted_address: string }>, status: string) => void,
  ) => void;
}

interface DistanceMatrixResponse {
  status: string;
  rows: Array<{
    elements: Array<{
      status: string;
      distance: { value: number };
      duration: { value: number };
    }>;
  }>;
}

interface GoogleDistanceMatrixService {
  getDistanceMatrix: (
    req: {
      origins: string[];
      destinations: string[];
      travelMode: string;
    },
    cb: (response: DistanceMatrixResponse, status: string) => void,
  ) => void;
}

function calculateDelivery(
  destination: string,
): Promise<{ km: number; fee: number; durationMins: number }> {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps?.DistanceMatrixService) {
      reject(
        new Error(
          "Google Maps non chargé. Veuillez réessayer dans quelques secondes.",
        ),
      );
      return;
    }
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [ORIGIN],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        console.log(
          "[ORAE Distance Matrix] status:",
          status,
          "response:",
          response,
        );
        if (status === "REQUEST_DENIED") {
          reject(
            new Error(
              "Accès à l'API de distance refusé. Vérifiez la configuration.",
            ),
          );
          return;
        }
        if (status !== "OK") {
          reject(
            new Error(
              `Calcul de distance impossible (${status}). Veuillez réessayer.`,
            ),
          );
          return;
        }
        const el = response.rows?.[0]?.elements?.[0];
        if (!el || el.status === "ZERO_RESULTS") {
          reject(
            new Error(
              "Aucun itinéraire trouvé pour cette adresse. Veuillez préciser votre quartier.",
            ),
          );
          return;
        }
        if (el.status !== "OK") {
          reject(
            new Error(
              `Adresse introuvable (${el.status}). Veuillez préciser votre adresse complète.`,
            ),
          );
          return;
        }
        const rawKm = el.distance.value / 1000;
        const km = Math.ceil(rawKm);
        const durationMins = el.duration.value / 60;
        const distanceCost = calcTieredFee(rawKm);
        const durationCost = durationMins * 10;
        const fee = Math.ceil((distanceCost + durationCost) / 100) * 100;
        resolve({ km, fee, durationMins: Math.ceil(durationMins) });
      },
    );
  });
}

function QuantityControl({
  value,
  onChange,
  ocidPrefix,
}: {
  value: number;
  onChange: (v: number) => void;
  ocidPrefix: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        aria-label="Diminuer"
        data-ocid={`${ocidPrefix}.minus_button`}
      >
        <span className="text-lg leading-none">−</span>
      </Button>
      <span
        className="w-7 text-center font-semibold text-foreground text-sm"
        data-ocid={`${ocidPrefix}.qty`}
      >
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        onClick={() => onChange(value + 1)}
        aria-label="Augmenter"
        data-ocid={`${ocidPrefix}.plus_button`}
      >
        <span className="text-lg leading-none">+</span>
      </Button>
    </div>
  );
}

export function OrderForm() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [address, setAddress] = useState("");
  const [delivery, setDelivery] = useState<DeliveryState>({ status: "idle" });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GooglePlacesAutocomplete | null>(null);

  const allProducts = [...PRODUCTS, ...PACKS];

  const setQty = (id: string, qty: number) =>
    setQuantities((prev) => ({ ...prev, [id]: qty }));

  const orderItems: OrderItem[] = allProducts
    .filter((p) => (quantities[p.id] ?? 0) > 0)
    .map((p) => ({ product: p, quantity: quantities[p.id] }));

  const productsTotal = orderItems.reduce(
    (s, { product, quantity }) => s + product.price * quantity,
    0,
  );
  const deliveryFee = delivery.status === "ok" ? delivery.fee : undefined;
  const deliveryKm = delivery.status === "ok" ? delivery.km : undefined;
  const deliveryDurationMins =
    delivery.status === "ok" ? delivery.durationMins : undefined;
  const grandTotal = productsTotal + (deliveryFee ?? 0);
  const totalArticles = orderItems.reduce((s, i) => s + i.quantity, 0);

  const waLink = buildWhatsAppMessage(
    orderItems,
    address,
    productsTotal,
    deliveryFee,
    deliveryKm,
    deliveryDurationMins,
  );
  const canOrder = orderItems.length > 0;

  // Init Google Places Autocomplete once Maps script loads
  useEffect(() => {
    const initAutocomplete = () => {
      if (
        !addressInputRef.current ||
        !window.google?.maps?.places?.Autocomplete ||
        autocompleteRef.current
      )
        return;
      const ac = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "tg" },
        },
      );
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        const addr = place.formatted_address || place.name || "";
        setAddress(addr);
        setDelivery({ status: "idle" });
      });
      autocompleteRef.current = ac;
    };

    if (window.googleMapsReady) {
      initAutocomplete();
    } else {
      window.addEventListener("google-maps-ready", initAutocomplete);
    }
    return () => {
      window.removeEventListener("google-maps-ready", initAutocomplete);
    };
  }, []);

  const handleCalculate = useCallback(async () => {
    if (!address.trim()) return;
    setDelivery({ status: "loading" });
    try {
      const result = await calculateDelivery(address);
      setDelivery({
        status: "ok",
        km: result.km,
        fee: result.fee,
        durationMins: result.durationMins,
      });
    } catch {
      setDelivery({
        status: "error",
        message:
          "Adresse introuvable. Veuillez préciser votre quartier ou adresse complète.",
      });
    }
  }, [address]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError(
        "Géolocalisation non disponible sur cet appareil. Veuillez saisir votre adresse manuellement.",
      );
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            if (!window.google?.maps?.Geocoder) {
              setGeoLoading(false);
              setGeoError(
                "Google Maps non chargé. Veuillez saisir votre adresse manuellement.",
              );
              return;
            }
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                setGeoLoading(false);
                if (status === "OK" && results?.[0]) {
                  const addr = results[0].formatted_address;
                  setAddress(addr);
                  setDelivery({ status: "loading" });
                  calculateDelivery(addr)
                    .then((r) =>
                      setDelivery({
                        status: "ok",
                        km: r.km,
                        fee: r.fee,
                        durationMins: r.durationMins,
                      }),
                    )
                    .catch(() =>
                      setDelivery({
                        status: "error",
                        message:
                          "Adresse introuvable. Veuillez la saisir manuellement.",
                      }),
                    );
                } else {
                  setGeoError(
                    "Impossible de détecter votre adresse. Veuillez la saisir manuellement.",
                  );
                }
              },
            );
          } catch {
            setGeoLoading(false);
            setGeoError(
              "Erreur de géolocalisation. Veuillez saisir votre adresse manuellement.",
            );
          }
        },
        (err) => {
          setGeoLoading(false);
          if (err.code === err.PERMISSION_DENIED) {
            setGeoError(
              "Géolocalisation refusée. Veuillez saisir votre adresse manuellement.",
            );
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setGeoError(
              "Position non disponible. Veuillez saisir votre adresse manuellement.",
            );
          } else {
            setGeoError(
              "Délai de géolocalisation dépassé. Veuillez saisir votre adresse manuellement.",
            );
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    } catch {
      setGeoLoading(false);
      setGeoError(
        "Géolocalisation non disponible. Veuillez saisir votre adresse manuellement.",
      );
    }
  }, []);

  return (
    <section id="commander" className="bg-[#FFF6F0] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
            Commande directe
          </h2>
          <p className="text-center text-lg font-semibold text-primary mb-1">
            Composez votre commande
          </p>
          <p className="text-center text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            Choisissez vos quantités, validez, et finalisez l&apos;heure et les
            frais de livraison sur WhatsApp avec un récapitulatif
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Product selection */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="individuels" data-ocid="order.tabs">
              <TabsList className="w-full mb-4">
                <TabsTrigger
                  value="individuels"
                  className="flex-1"
                  data-ocid="order.tab.individuels"
                >
                  Produits individuels
                </TabsTrigger>
                <TabsTrigger
                  value="packs"
                  className="flex-1"
                  data-ocid="order.tab.packs"
                >
                  Packs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="individuels">
                <div className="space-y-3">
                  {PRODUCTS.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border"
                    >
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {product.name}
                        </p>
                        <p className="text-primary font-bold text-sm">
                          {product.price.toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                      <QuantityControl
                        value={quantities[product.id] ?? 0}
                        onChange={(v) => setQty(product.id, v)}
                        ocidPrefix={`order.${product.id}`}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="packs">
                <div className="space-y-3">
                  {PACKS.map((pack) => (
                    <div
                      key={pack.id}
                      className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground text-sm">
                            {pack.name}
                          </p>
                          {pack.badge && (
                            <Badge className="text-xs bg-primary text-primary-foreground">
                              {pack.badge}
                            </Badge>
                          )}
                        </div>
                        {pack.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {pack.description}
                          </p>
                        )}
                        <p className="text-primary font-bold text-sm mt-1">
                          {pack.price.toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                      <QuantityControl
                        value={quantities[pack.id] ?? 0}
                        onChange={(v) => setQty(pack.id, v)}
                        ocidPrefix={`order.${pack.id}`}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Summary panel */}
          <div className="lg:col-span-2">
            <div
              className="bg-card rounded-2xl border border-border p-4 lg:sticky lg:top-28"
              data-ocid="order.summary_panel"
            >
              <h3 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <CartIcon />
                Panier
              </h3>

              {orderItems.length === 0 ? (
                <p
                  className="text-muted-foreground text-sm py-4 text-center"
                  data-ocid="order.empty_state"
                >
                  Aucun article sélectionné.
                </p>
              ) : (
                <ul className="space-y-2 mb-3">
                  {orderItems.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-foreground truncate pr-2">
                        {product.shortName} ×{quantity}
                      </span>
                      <span className="font-semibold text-foreground whitespace-nowrap">
                        {(product.price * quantity).toLocaleString("fr-FR")}{" "}
                        FCFA
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Products subtotal */}
              <div className="border-t border-border pt-3 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Produits ({totalArticles} article
                    {totalArticles > 1 ? "s" : ""})
                  </span>
                  <span className="font-semibold text-foreground">
                    {productsTotal.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>

              {/* Delivery section */}
              <div className="border-t border-border pt-3 mb-3">
                <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                  📍 Adresse de livraison
                </p>
                {/* Geolocation button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mb-2 text-xs border-primary/40 text-primary hover:bg-primary/10 flex items-center gap-1.5 justify-center"
                  onClick={handleGeolocate}
                  disabled={geoLoading}
                  data-ocid="order.geolocate_button"
                  aria-label="Utiliser ma localisation actuelle"
                >
                  {geoLoading ? (
                    <svg
                      className="animate-spin h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                  ) : (
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                  )}
                  Ma localisation
                </Button>
                {geoError && (
                  <p
                    className="text-xs text-destructive mb-2"
                    data-ocid="order.geo_error_state"
                  >
                    {geoError}
                  </p>
                )}
                <div className="flex gap-2 mb-2">
                  <Input
                    ref={addressInputRef}
                    placeholder="Ex: Tokoin, Bè, Agbalepedogan…"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setDelivery({ status: "idle" });
                      setGeoError(null);
                    }}
                    className="text-sm flex-1 min-w-0"
                    data-ocid="order.address_input"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    disabled={!address.trim() || delivery.status === "loading"}
                    onClick={handleCalculate}
                    data-ocid="order.calculate_delivery_button"
                  >
                    {delivery.status === "loading" ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="animate-spin h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        …
                      </span>
                    ) : (
                      "Calculer"
                    )}
                  </Button>
                </div>

                {delivery.status === "loading" && (
                  <p
                    className="text-xs text-muted-foreground"
                    data-ocid="order.delivery_loading_state"
                  >
                    Calcul de la distance en cours\u2026
                  </p>
                )}
                {delivery.status === "ok" && (
                  <div
                    className="rounded-lg bg-primary/5 px-3 py-2 text-sm"
                    data-ocid="order.delivery_success_state"
                  >
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance</span>
                      <span className="font-medium text-foreground">
                        {delivery.km} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Durée estimée
                      </span>
                      <span className="font-medium text-foreground">
                        {delivery.durationMins} min
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold mt-1 pt-1 border-t border-border">
                      <span className="text-foreground">
                        Estimation livraison
                      </span>
                      <span className="text-primary">
                        {delivery.fee.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground italic mt-2 leading-snug">
                      * Estimation basée sur la distance. Le montant exact sera
                      confirmé lors de la prise en charge sur WhatsApp.
                    </p>
                  </div>
                )}
                {delivery.status === "error" && (
                  <p
                    className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1"
                    data-ocid="order.delivery_error_state"
                  >
                    {delivery.message}
                  </p>
                )}
                {delivery.status === "idle" && !address.trim() && (
                  <p className="text-xs text-muted-foreground">
                    Tarif dégressif par km + 10 FCFA/min de trajet
                  </p>
                )}
                {delivery.status === "idle" && address.trim() && (
                  <p className="text-xs text-muted-foreground">
                    Cliquez sur \u00ab\u00a0Calculer\u00a0\u00bb pour estimer la
                    livraison.
                  </p>
                )}
              </div>

              {/* Grand total */}
              <div className="border-t border-border pt-3 mb-3">
                <div className="flex justify-between font-bold text-sm">
                  <span>
                    Total
                    {deliveryFee != null
                      ? " (estimation livraison incluse)"
                      : ""}
                  </span>
                  <span className="text-primary">
                    {deliveryFee != null
                      ? `${grandTotal.toLocaleString("fr-FR")} FCFA`
                      : `${productsTotal.toLocaleString("fr-FR")} FCFA`}
                  </span>
                </div>
                {deliveryFee == null && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    + livraison (entrez votre adresse ci-dessus)
                  </p>
                )}
              </div>

              <a
                href={canOrder ? waLink : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!canOrder}
                tabIndex={canOrder ? 0 : -1}
                data-ocid="order.whatsapp_button"
              >
                <Button
                  type="button"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                  disabled={!canOrder}
                >
                  <WhatsAppIcon />
                  Commander sur WhatsApp
                </Button>
              </a>
              <p className="text-xs text-muted-foreground text-center mt-2 leading-tight">
                Vous connaissez déjà le montant. Sur WhatsApp, on règle juste
                l&apos;heure de livraison.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

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
