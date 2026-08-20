CREATE TABLE "threadline_customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"region" text NOT NULL,
	"signup_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "threadline_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "threadline_sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"revenue" numeric(10, 2) NOT NULL,
	"region" text NOT NULL,
	"sale_date" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "threadline_sales" ADD CONSTRAINT "threadline_sales_product_id_threadline_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."threadline_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threadline_sales" ADD CONSTRAINT "threadline_sales_customer_id_threadline_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."threadline_customers"("id") ON DELETE no action ON UPDATE no action;