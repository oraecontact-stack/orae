export interface Product {
  id: string;
  name: string;
  shortName: string;
  price: number;
  unit: string;
  isPack: boolean;
  badge?: string;
  description?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "orae-1l",
    name: "ORAE 1L",
    shortName: "ORAE 1L",
    price: 2000,
    unit: "bouteille",
    isPack: false,
  },
  {
    id: "orae-press-on",
    name: "ORAE Press On 0.5l",
    shortName: "Press On 0.5l",
    price: 1200,
    unit: "flacon",
    isPack: false,
  },
  {
    id: "orae-recharge",
    name: "Recharge 5L",
    shortName: "Recharge 5L",
    price: 10000,
    unit: "recharge",
    isPack: false,
  },
];

export const PACKS: Product[] = [
  {
    id: "pack-decouverte",
    name: "Pack Découverte",
    shortName: "Pack Découverte",
    price: 3000,
    unit: "pack",
    isPack: true,
    badge: "−5%",
    description: "1L + 1 Press On 0.5l — parfait pour découvrir ORAE",
  },
  {
    id: "pack-maison",
    name: "Pack Jeune",
    shortName: "Pack Jeune",
    price: 6500,
    unit: "pack",
    isPack: true,
    badge: "−10%",
    description: "3L + 1 Press On 0.5l — idéal pour la maison",
  },
  {
    id: "pack-famille",
    name: "Pack Famille",
    shortName: "Pack Famille",
    price: 13000,
    unit: "pack",
    isPack: true,
    badge: "−10%",
    description: "6L + 2 Press On 0.5l — économique pour toute la famille",
  },
  {
    id: "pack-pro",
    name: "Pack Pro",
    shortName: "Pack Pro",
    price: 20200,
    unit: "pack",
    isPack: true,
    badge: "−10%",
    description: "10L + 2 Press On 0.5l — idéal pour les professionnels",
  },
];

export function buildWhatsAppMessage(
  items: OrderItem[],
  address: string,
  productsTotal: number,
  deliveryFee?: number,
  distanceKm?: number,
  durationMins?: number,
): string {
  const lines = items.map(
    ({ product, quantity }) =>
      `• ${product.name} x${quantity} = ${(product.price * quantity).toLocaleString("fr-FR")} FCFA`,
  );
  const totalArticles = items.reduce((s, i) => s + i.quantity, 0);
  const grandTotal =
    deliveryFee != null ? productsTotal + deliveryFee : productsTotal;
  let deliveryLine: string;
  if (deliveryFee != null) {
    const details: string[] = [];
    if (distanceKm != null) details.push(`${distanceKm} km`);
    if (durationMins != null) details.push(`${durationMins} min de trajet`);
    const detailStr = details.length > 0 ? ` (${details.join(" · ")})` : "";
    deliveryLine = `Frais de livraison (estimation)${detailStr} : ${deliveryFee.toLocaleString("fr-FR")} FCFA`;
  } else {
    deliveryLine = "Frais de livraison : À confirmer sur WhatsApp";
  }
  const msg = [
    "Bonjour, je souhaite commander le savon ORAE :",
    "",
    ...lines,
    "",
    `Sous-total produits (${totalArticles} article${totalArticles > 1 ? "s" : ""}) : ${productsTotal.toLocaleString("fr-FR")} FCFA`,
    deliveryLine,
    `TOTAL : ${grandTotal.toLocaleString("fr-FR")} FCFA`,
    "",
    `Adresse de livraison : ${address || "à préciser"}`,
    "",
    "* Les frais de livraison sont une estimation. Le montant final sera confirmé à la prise en charge.",
    "",
    "Sur WhatsApp, on règle juste l'heure de livraison. Merci !",
  ].join("\n");
  return `https://wa.me/22890555323?text=${encodeURIComponent(msg)}`;
}
