export type PreviewPage = { src: string; alt: string };
export type Category = {
  name: string;
  description: string;
  image: string;
  examples: string[];
};
export type Review = {
  name: string;
  rating: number;
  comment: string;
  date: string;
  photo?: string;
};
export type SiteConfig = {
  productName: string;
  price: number;
  checkoutServiceFee?: number;
  recipeCount: number;
  checkoutUrl: string;
  supportEmail: string;
  contactName: string;
  metaPixelId: string;
  coverImage: string;
  productImageSrcSet?: string;
  previewPages: PreviewPage[];
  categories: Category[];
  images: { hero: string; heroMobile: string; editorial: string };
  deliveryText: string;
  paymentMethods: string[];
  refundText: string;
  termsUrl: string;
  refundUrl: string;
  privacyUrl: string;
  reviews: Review[];
};
export function getCheckoutUrl(raw: string) {
  const u = new URL(raw);
  if (u.protocol !== "https:")
    throw Error("O checkout precisa de uma URL HTTPS real.");
  return u.href;
}
export function parseConfig(raw: unknown): SiteConfig {
  const c = raw as SiteConfig;
  if (
    !c ||
    typeof c.productName !== "string" ||
    !Number.isFinite(c.price) ||
    c.price <= 0 ||
    !Array.isArray(c.categories) ||
    !Array.isArray(c.previewPages)
  )
    throw Error("Configuração inválida");
  getCheckoutUrl(c.checkoutUrl);
  return c;
}
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    price,
  );
