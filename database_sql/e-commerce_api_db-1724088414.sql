CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial NOT NULL UNIQUE,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL DEFAULT ''customer'',
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	PRIMARY KEY ("user_id")
);

CREATE TABLE IF NOT EXISTS "products" (
	"product_id" serial NOT NULL UNIQUE,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"price" numeric(10,0) NOT NULL,
	"stock" bigint NOT NULL CHECK (stock >= 0),
	"category_id" bigint NOT NULL,
	PRIMARY KEY ("product_id")
);

CREATE TABLE IF NOT EXISTS "categories" (
	"category_id" serial NOT NULL UNIQUE,
	"category_name" varchar(255) NOT NULL,
	PRIMARY KEY ("category_id")
);

CREATE TABLE IF NOT EXISTS "orders" (
	"order_id" serial NOT NULL UNIQUE,
	"user_id" bigint NOT NULL,
	"order_date" timestamp with time zone NOT NULL,
	"total_price" numeric(10,0) NOT NULL,
	"total_items" bigint NOT NULL,
	"payment_status" varchar(255) NOT NULL,
	"address_id" bigint NOT NULL,
	PRIMARY KEY ("order_id")
);

CREATE TABLE IF NOT EXISTS "order_items" (
	"order_items_id" serial NOT NULL UNIQUE,
	"order_id" bigint NOT NULL,
	"product_id" bigint NOT NULL,
	"quantity" bigint NOT NULL CHECK (quantity > 0),
	"total_price" numeric(10,0) NOT NULL,
	PRIMARY KEY ("order_items_id")
);

CREATE TABLE IF NOT EXISTS "cart" (
	"cart_id" serial NOT NULL UNIQUE,
	"user_id" bigint NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	PRIMARY KEY ("cart_id")
);

CREATE TABLE IF NOT EXISTS "cart_items" (
	"cart_item_id" serial NOT NULL UNIQUE,
	"cart_id" bigint NOT NULL,
	"product_id" bigint NOT NULL,
	"quantity" bigint NOT NULL CHECK (quantity > 0),
	"total_price" numeric(10,0) NOT NULL,
	PRIMARY KEY ("cart_item_id")
);

CREATE TABLE IF NOT EXISTS "addresses" (
	"address_id" serial NOT NULL UNIQUE,
	"street" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"postal_code" varchar(255) NOT NULL,
	"user_id" bigint NOT NULL,
	PRIMARY KEY ("address_id")
);


ALTER TABLE "products" ADD CONSTRAINT "products_fk5" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id");

ALTER TABLE "orders" ADD CONSTRAINT "orders_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");

ALTER TABLE "orders" ADD CONSTRAINT "orders_fk6" FOREIGN KEY ("address_id") REFERENCES "addresses"("address_id");
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_fk1" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id");

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_fk2" FOREIGN KEY ("product_id") REFERENCES "products"("product_id");
ALTER TABLE "cart" ADD CONSTRAINT "cart_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_fk1" FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id");

ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_fk2" FOREIGN KEY ("product_id") REFERENCES "products"("product_id");
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk6" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");