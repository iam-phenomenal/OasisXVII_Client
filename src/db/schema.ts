// Shared with Oasis_XVII_Admin/src/db/ - keep in sync until monorepo refactor
import {
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const currencyEnum = pgEnum("currency", ["NGN", "USD"]);

export const categoryEnum = pgEnum("category", [
  "tops",
  "bottoms",
  "accessories",
  "footwear",
]);

export const badgeEnum = pgEnum("badge", ["New Drop", "Limited", "Sold Out"]);

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "draft",
  "archived",
]);

export type PaymentMethodConfig = {
  id: "paystack" | "moniepoint" | "zenith";
  enabled: boolean;
  label: string;
  description: string;
};

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  category: categoryEnum("category").notNull(),
  badge: badgeEnum("badge"),
  status: productStatusEnum("status").notNull().default("active"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),
  relatedProductIds: jsonb("related_product_ids")
    .$type<string[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  heroImages: jsonb("hero_images").$type<string[]>().notNull().default([]),
  heroHeadline: text("hero_headline"),
  heroSubheading: text("hero_subheading"),
  paymentMethods: jsonb("payment_methods")
    .$type<PaymentMethodConfig[]>()
    .notNull()
    .default([]),
  logisticsFeeNgn: numeric("logistics_fee_ngn", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  dutyTaxNgn: numeric("duty_tax_ngn", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Settings = typeof settings.$inferSelect;

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
