export type Consent = "accepted" | "declined" | null;
type Pixel = ((...args: unknown[]) => void) & {
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  callMethod?: (...args: unknown[]) => void;
};
declare global {
  interface Window {
    fbq?: Pixel;
    _fbq?: Pixel;
  }
}
let pageViewSent = false;
let initializedPixel = "";
export function readConsent(): Consent {
  try {
    const v = localStorage.getItem("sn-consent");
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}
export function saveConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem("sn-consent", value);
  } catch {
    /* Some in-app browsers block storage. */
  }
}
export function validPixel(id: string) {
  return /^\d+$/.test(id);
}
export function enableAnalytics(id: string) {
  if (!validPixel(id)) return;
  if (!window.fbq) {
    const f: Pixel = (...args) => {
      if (f.callMethod) f.callMethod(...args);
      else f.queue!.push(args);
    };
    f.queue = [];
    f.loaded = true;
    f.version = "2.0";
    window.fbq = f;
    window._fbq = f;
    const script = document.createElement("script");
    script.id = "sn-meta-pixel";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
  if (initializedPixel !== id) {
    window.fbq("init", id);
    initializedPixel = id;
  }
  window.fbq("consent", "grant");
  if (!pageViewSent) {
    window.fbq("track", "PageView");
    pageViewSent = true;
  }
}
export function revokeAnalytics() {
  window.fbq?.("consent", "revoke");
}
export function trackCta(
  consent: Consent,
  id: string,
  placement: string,
  productName: string,
  price: number,
) {
  if (consent !== "accepted" || !validPixel(id)) return;
  window.fbq?.("trackCustom", "RecipeCTAClick", {
    placement,
    content_name: productName,
    value: price,
    currency: "BRL",
  });
}
