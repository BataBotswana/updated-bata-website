import { describe, expect, it } from "vitest";
import { managedProductToCatalog } from "./catalog";

describe("managedProductToCatalog", () => {
  it("preserves ordered image angles and converts managed attributes for the public storefront", () => {
    const product = managedProductToCatalog({
      id: 41,
      title: "Kgalagadi Work Boot",
      category: "Industrial",
      brand: "Bata Industrials",
      price: 1299,
      tag: "New",
      description: "A durable work boot.",
      sizesJson: '["6","7","8"]',
      colorsJson: '[{"name":"Black","hex":"#171717"}]',
      images: [
        { id: 1, url: "/manus-storage/boot-primary.jpg", alt: "Primary boot angle", position: 0 },
        { id: 2, url: "/manus-storage/boot-sole.jpg", alt: "Boot sole angle", position: 1 },
      ],
    });

    expect(product).toMatchObject({ id: 41, name: "Kgalagadi Work Boot", image: "/manus-storage/boot-primary.jpg", sizes: [6, 7, 8] });
    expect(product.gallery).toEqual(["/manus-storage/boot-primary.jpg", "/manus-storage/boot-sole.jpg"]);
    expect(product.colors).toEqual([{ name: "Black", hex: "#171717" }]);
  });
});
