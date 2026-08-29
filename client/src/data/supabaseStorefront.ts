import { useEffect, useState } from "react";
import type { CatalogProduct } from "./catalog";

export type StorefrontContent = {
  logo_url: string;
  hero_image: string;
  women_image: string;
  men_image: string;
  kids_image: string;
  campaign_image: string;
  newsletter_image: string;
  sale_image: string;
  safari_logo: string;
  safari_image: string;
  north_star_logo: string;
  north_star_image: string;
  power_logo: string;
  power_image: string;
  toughees_image: string;
  industrials_logo: string;
  industrials_image: string;
};

type StorefrontResponse = {
  products: CatalogProduct[];
  content: StorefrontContent;
  source: { buckets: string[] };
};

const supabaseUrl = String(import.meta.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const supabaseAnonKey = String(import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
const storefrontUrl = `${supabaseUrl}/functions/v1/bata-storefront?action=catalog&v=3`;

let storefrontRequest: Promise<StorefrontResponse> | null = null;

async function fetchStorefront() {
  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  if (!storefrontRequest) {
    storefrontRequest = fetch(storefrontUrl, {
      cache: "no-store",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    }).then(async (response) => {
      const payload = await response.json() as StorefrontResponse & { error?: string };
      if (!response.ok || payload.error) throw new Error(payload.error ?? "Unable to load the Bata catalogue");
      return payload;
    }).catch((error) => {
      storefrontRequest = null;
      throw error;
    });
  }
  return storefrontRequest;
}

export function useSupabaseStorefront() {
  const [data, setData] = useState<StorefrontResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchStorefront().then((response) => {
      if (!mounted) return;
      setData(response);
      setError(null);
      setIsLoading(false);
    }).catch((reason: unknown) => {
      if (!mounted) return;
      setError(reason instanceof Error ? reason : new Error("Unable to load the Bata catalogue"));
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return {
    products: data?.products ?? [],
    content: data?.content ?? null,
    source: data?.source ?? null,
    error,
    isError: Boolean(error),
    isLoading,
  };
}

export function resetSupabaseStorefrontCache() {
  storefrontRequest = null;
}
