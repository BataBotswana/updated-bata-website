import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { addProductImage, createManagedProduct, getManagedProduct, listManagedProducts, listStorefrontContent, removeManagedProduct, removeProductImage, reorderProductImages, saveStorefrontContent, updateManagedProduct } from "./db";
import { storagePut } from "./storage";
import { TRPCError } from "@trpc/server";

const productInput = z.object({
  handle: z.string().min(3).max(150),
  title: z.string().min(2).max(180),
  brand: z.string().min(2).max(100),
  category: z.enum(["Women", "Men", "Kids", "Industrial"]),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().nullable().optional(),
  tag: z.string().max(50).nullable().optional(),
  description: z.string().max(3000).nullable().optional(),
  sizes: z.array(z.string().min(1).max(10)).min(1),
  colors: z.array(z.object({ name: z.string().min(1).max(50), hex: z.string().regex(/^#[0-9a-fA-F]{3,8}$/) })).min(1),
  status: z.enum(["draft", "active"]),
});

function serializeProduct(input: z.infer<typeof productInput>) {
  return { ...input, sizesJson: JSON.stringify(input.sizes), colorsJson: JSON.stringify(input.colors) };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  storefront: router({
    products: publicProcedure.query(async () => { try { return await listManagedProducts(false); } catch (error) { if (error instanceof Error && error.message === "Database unavailable") return []; throw error; } }),
    product: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => { try { return await getManagedProduct(input.id, false); } catch (error) { if (error instanceof Error && error.message === "Database unavailable") return undefined; throw error; } }),
    content: publicProcedure.query(async () => { try { return await listStorefrontContent(); } catch (error) { if (error instanceof Error && error.message === "Database unavailable") return []; throw error; } }),
  }),
  admin: router({
    products: adminProcedure.query(() => listManagedProducts(true)),
    createProduct: adminProcedure.input(productInput).mutation(async ({ input }) => {
      const id = await createManagedProduct(serializeProduct(input));
      return getManagedProduct(id, true);
    }),
    updateProduct: adminProcedure.input(z.object({ id: z.number().int().positive(), product: productInput.partial() })).mutation(async ({ input }) => {
      const patch = input.product;
      const serialized = {
        ...patch,
        ...(patch.sizes ? { sizesJson: JSON.stringify(patch.sizes) } : {}),
        ...(patch.colors ? { colorsJson: JSON.stringify(patch.colors) } : {}),
      };
      delete (serialized as { sizes?: unknown }).sizes;
      delete (serialized as { colors?: unknown }).colors;
      return updateManagedProduct(input.id, serialized);
    }),
    deleteProduct: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await removeManagedProduct(input.id);
      return { success: true } as const;
    }),
    addImageUrl: adminProcedure.input(z.object({ productId: z.number().int().positive(), url: z.string().url(), alt: z.string().max(255).nullable().optional(), position: z.number().int().min(0).default(0) })).mutation(async ({ input }) => {
      return addProductImage(input.productId, input.url, input.alt ?? null, input.position);
    }),
    uploadProductImage: adminProcedure.input(z.object({ productId: z.number().int().positive(), dataUrl: z.string().max(8_500_000), filename: z.string().max(150), alt: z.string().max(255).nullable().optional(), position: z.number().int().min(0).default(0) })).mutation(async ({ input }) => {
      const match = input.dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/);
      if (!match) throw new TRPCError({ code: "BAD_REQUEST", message: "Upload a JPG, PNG, or WEBP image." });
      const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
      if (bytes.length > 6 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Images must be 6 MB or smaller." });
      const extension = match[1] === "image/jpeg" ? "jpg" : match[1].split("/")[1];
      const safeName = input.filename.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) || "product-angle";
      const stored = await storagePut(`products/${input.productId}/${safeName}.${extension}`, bytes, match[1]);
      const id = await addProductImage(input.productId, stored.url, input.alt ?? null, input.position);
      return { id, url: stored.url };
    }),
    deleteImage: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await removeProductImage(input.id);
      return { success: true } as const;
    }),
    reorderImages: adminProcedure.input(z.object({ productId: z.number().int().positive(), imageIds: z.array(z.number().int().positive()).min(1) })).mutation(({ input }) => reorderProductImages(input.productId, input.imageIds)),
    content: adminProcedure.query(() => listStorefrontContent()),
    saveContent: adminProcedure.input(z.object({ contentKey: z.string().min(2).max(100), label: z.string().min(2).max(150), value: z.string().min(1).max(3000) })).mutation(({ input }) => saveStorefrontContent(input.contentKey, input.label, input.value)),
  }),
});

export type AppRouter = typeof appRouter;
