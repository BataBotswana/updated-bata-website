import { describe, expect, it } from "vitest";
import { DEFAULT_STOREFRONT_CONTENT, storefrontDefaults } from "./storefront";

describe("storefront content registry", () => {
  it("keeps every editor definition addressable by a stable key", () => {
    const keys = DEFAULT_STOREFRONT_CONTENT.map((item) => item.contentKey);
    expect(new Set(keys).size).toBe(keys.length);
    expect(storefrontDefaults.hero_image).toContain("/manus-storage/");
    expect(storefrontDefaults.campaign_image).toContain("/manus-storage/");
  });

  it("covers the public campaign, collections, catalogue, and footer", () => {
    expect(DEFAULT_STOREFRONT_CONTENT.map((item) => item.contentKey)).toEqual(expect.arrayContaining([
      "announcement",
      "hero_title",
      "hero_image",
      "women_image",
      "men_image",
      "kids_image",
      "campaign_heading",
      "campaign_image",
      "footer_tagline",
    ]));
  });
});
