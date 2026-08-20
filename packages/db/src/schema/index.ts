import {
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `threadline_${name}`);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  region: text("region").notNull(),
  signupDate: timestamp("signup_date").notNull(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  revenue: numeric("revenue", { precision: 10, scale: 2 }).notNull(),
  region: text("region").notNull(),
  saleDate: timestamp("sale_date").notNull(),
});
