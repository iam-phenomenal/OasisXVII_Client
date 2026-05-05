import { apiFetch } from "./client";

export interface PaymentMethodConfig {
  id: string;
  enabled: boolean;
  label: string;
  description: string;
}

export interface Settings {
  heroImages: string[];
  heroHeadline: string;
  heroSubheading: string;
  paymentMethods: PaymentMethodConfig[];
  logisticsFeeNgn: number;
  dutyTaxNgn: number;
}

export const DEFAULT_HERO_IMAGES: string[] = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCw4BbeWVDx2Yd5eqEZTodd7klydHlRdKvsGoErfPNfs5GB1mSqIPH7-xBqPI8aJeFgk8a2enrPlA3KzoEipd5af9POYjAN2m22Vgxer3gTILomoSr16xaBa30BVIV5J4t0bz0z2pRwxbW9EHijq0ehzcfxathfcxG4He8dOo3WkospvAo_jYU4Tf_oP5mKJFCGg4UB2VTFmSHo8_oM8KHq7BVVBmtshwVGoqRw7f6pwDtGRVQKCO9YB6EApjuTCsrRao5NYMmkcA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDTKQ2_Z33ExEBs5b7p8izRsRA0EnURr3P7Ic7-im9uvt3FzIo00XPHlNBNeuhgE7Gbbmeot7GBiwT5yNzwKRkHCPsHbH_yxG1J-bXm86EC4XKGkx5IvJeer09P4v041jS7ZoOWx7pok2RJ65ouhLtwYKrw0eVZ_EatnDSU6CS_YoJcXXW1H-RqmXJysTmJ3iM5j7Mj-6CedrUV9dHAk33-68rPRnFEaqfkTw1vUPGU1ReIPEywypbL0OH3tn-Nf7PETeLVIvQV3A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB2raYZzerU8FJKj7HSFMfD__k78vEbh0HF6S7Kej9sfMpSJFNwNJ_k_6jdkAYrQ6s0Hfg406_K4SK4cggEAxp8pTRnH2umwL-OdGtBJVj-b-yBrCRgN1A_i9lH3FOtSMUUiehDcqwuU6SY54JKagolSMJ_K7FTNhuiiw5oZLwFWeCxtaUmGaCqjgsfNK6NCbY9uVizLOYqQAWPxB72OS1Jig5WFRSFnoR0srxej0UfD-fFpDBDy68SNO-CcLvODb9H1zfu1AuIFg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ddsckBMIfDaznQ95xpFz06kSKYuTGR3JyCr68tsad9tVyAZKK_8LgI94GLoNYIvm85T2zDra16M_poAjUHjvNINMtvxC1UTwzRvZ9ayLMFlgwpJgu8BK9cL9kLoea4GQsglVFMa6Ec14xYhiENJSs3dEIiQyXh-rwqXoIMEihWgq5RTxPeoVtMdDhTMuJ-bYRW8SctE4QMWMkS8H8XnK--DkYvBi-eeCHGpX-JbAsEX754bCSJakeLjt_cZF586nm0QQOdCrjQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9EkSpIGSiSSJXWi-FU8UwR2kyMl_ooOl0jnw0l55NGps4KoWdjt8y0l5bZ9JLkWwPg4eRypK-3XpyNW2PzjPkhmpywyRwwJd_JaCpIy9GdIw0LDnnzUFcAvmIDRqUCreYnRKXWI_Q8wjEcR0SbjPbZkzPxdCX-st1us3VmBwVS4RkKFhgAKkHqeBKfOWYJykYbtszyDy3I7yO4RyA7-Xy01k3_SDhEJWdjRpFwN1j6s2XzE68j1DqeG_-kl5DnKsb8M8OjFInoA",
];

export const DEFAULT_HERO_HEADLINE = "WELCOME TO THE OASIS";
export const DEFAULT_HERO_SUBHEADING = "OWN AUTHENTIC STYLE & INCARNATE SWAG";

export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "paystack",
    enabled: true,
    label: "Paystack",
    description: "",
  },
  {
    id: "moniepoint",
    enabled: true,
    label: "Moniepoint - Bank Transfer",
    description: "",
  },
  {
    id: "zenith",
    enabled: true,
    label: "Zenith Bank - Bank Transfer",
    description: "",
  },
];

export const DEFAULT_LOGISTICS_FEE = 4500;
export const DEFAULT_DUTY_TAX = 11062;

export async function getSettings(): Promise<Settings | null> {
  try {
    return await apiFetch<Settings>("/settings", {
      next: { tags: ["settings"] },
    });
  } catch {
    return null;
  }
}