import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Public products managed by the Bata admin. Price amounts are stored in whole pula.
 * Variable attributes use JSON text so a single product can expose numerous sizes and colours.
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  handle: varchar("handle", { length: 150 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  category: mysqlEnum("category", ["Women", "Men", "Kids", "Industrial"]).notNull(),
  price: int("price").notNull(),
  compareAtPrice: int("compareAtPrice"),
  tag: varchar("tag", { length: 50 }),
  description: text("description"),
  sizesJson: text("sizesJson").notNull(),
  colorsJson: text("colorsJson").notNull(),
  status: mysqlEnum("status", ["draft", "active"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Ordered product-gallery images; file bytes remain in managed storage, while this table stores their URLs and metadata. */
export const productImages = mysqlTable("product_images", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }),
  position: int("position").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Copy and promo controls for public storefront sections, keyed by stable content identifiers. */
export const storefrontContent = mysqlTable("storefront_content", {
  id: int("id").autoincrement().primaryKey(),
  contentKey: varchar("contentKey", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 150 }).notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StoreProduct = typeof products.$inferSelect;
export type InsertStoreProduct = typeof products.$inferInsert;
export type StoreProductImage = typeof productImages.$inferSelect;
export type StorefrontContent = typeof storefrontContent.$inferSelect;
