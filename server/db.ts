import { asc, desc, eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, productImages, products, storefrontContent, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

function requireDb<T>(database: T | null): T {
  if (!database) throw new Error("Database unavailable");
  return database;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (["name", "email", "loginMethod"] as const).forEach((field) => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type ManagedProductInput = {
  handle: string;
  title: string;
  brand: string;
  category: "Women" | "Men" | "Kids" | "Industrial";
  price: number;
  compareAtPrice?: number | null;
  tag?: string | null;
  description?: string | null;
  sizesJson: string;
  colorsJson: string;
  status: "draft" | "active";
};

async function withImages<T extends { id: number }>(records: T[]) {
  const db = requireDb(await getDb());
  if (records.length === 0) return records.map((record) => ({ ...record, images: [] }));
  const allImages = await db.select().from(productImages).orderBy(asc(productImages.position), asc(productImages.id));
  return records.map((record) => ({ ...record, images: allImages.filter((image) => image.productId === record.id) }));
}

export async function listManagedProducts(includeDrafts = false) {
  const db = requireDb(await getDb());
  const rows = includeDrafts
    ? await db.select().from(products).orderBy(desc(products.updatedAt))
    : await db.select().from(products).where(eq(products.status, "active")).orderBy(desc(products.updatedAt));
  return withImages(rows);
}

export async function getManagedProduct(id: number, includeDrafts = false) {
  const db = requireDb(await getDb());
  const rows = includeDrafts
    ? await db.select().from(products).where(eq(products.id, id)).limit(1)
    : await db.select().from(products).where(eq(products.id, id)).limit(1);
  const product = rows[0];
  if (!product || (!includeDrafts && product.status !== "active")) return undefined;
  return (await withImages([product]))[0];
}

export async function createManagedProduct(input: ManagedProductInput) {
  const db = requireDb(await getDb());
  const result = await db.insert(products).values(input);
  return Number(result[0].insertId);
}

export async function updateManagedProduct(id: number, input: Partial<ManagedProductInput>) {
  const db = requireDb(await getDb());
  await db.update(products).set(input).where(eq(products.id, id));
  return getManagedProduct(id, true);
}

export async function removeManagedProduct(id: number) {
  const db = requireDb(await getDb());
  await db.delete(productImages).where(eq(productImages.productId, id));
  await db.delete(products).where(eq(products.id, id));
}

export async function addProductImage(productId: number, url: string, alt: string | null, position: number) {
  const db = requireDb(await getDb());
  const result = await db.insert(productImages).values({ productId, url, alt, position });
  return Number(result[0].insertId);
}

export async function removeProductImage(id: number) {
  const db = requireDb(await getDb());
  await db.delete(productImages).where(eq(productImages.id, id));
}

export async function reorderProductImages(productId: number, imageIds: number[]) {
  const db = requireDb(await getDb());
  const existing = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.productId, productId));
  const validIds = imageIds.filter((id, index) => existing.some((image) => image.id === id) && imageIds.indexOf(id) === index);
  await Promise.all(validIds.map((id, position) => db.update(productImages).set({ position }).where(and(eq(productImages.id, id), eq(productImages.productId, productId)))));
  return withImages(await db.select().from(products).where(eq(products.id, productId)));
}

export async function listStorefrontContent() {
  const db = requireDb(await getDb());
  return db.select().from(storefrontContent).orderBy(asc(storefrontContent.label));
}

export async function saveStorefrontContent(contentKey: string, label: string, value: string) {
  const db = requireDb(await getDb());
  await db.insert(storefrontContent).values({ contentKey, label, value }).onDuplicateKeyUpdate({ set: { label, value } });
  const rows = await db.select().from(storefrontContent).where(eq(storefrontContent.contentKey, contentKey)).limit(1);
  return rows[0];
}
