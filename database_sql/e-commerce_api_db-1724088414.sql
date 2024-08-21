CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"role" varchar(255) NOT NULL DEFAULT 'customer',
	"created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "categories" (
	"category_id" serial PRIMARY KEY,
	"category_name" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "products" (
	"product_id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10,2) NOT NULL CHECK (price >= 0),
	"stock" bigint NOT NULL CHECK (stock >= 0),
	"category_id" int NOT NULL,
	FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "addresses" (
	"address_id" serial PRIMARY KEY,
	"street" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"postal_code" varchar(255) NOT NULL,
	"user_id" int NOT NULL,
	FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "orders" (
	"order_id" serial PRIMARY KEY,
	"user_id" int NOT NULL,
	"order_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"total_price" numeric(10,2) NOT NULL CHECK (total_price >= 0),
	"total_items" int NOT NULL CHECK (total_items > 0),
	"payment_status" varchar(255) NOT NULL,
	"address_id" int NOT NULL,
	FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
	FOREIGN KEY ("address_id") REFERENCES "addresses"("address_id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "order_items" (
	"order_items_id" serial PRIMARY KEY,
	"order_id" int NOT NULL,
	"product_id" int NOT NULL,
	"quantity" int NOT NULL CHECK (quantity > 0),
	"total_price" numeric(10,2) NOT NULL CHECK (total_price >= 0),
	FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE,
	FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "cart" (
	"cart_id" serial PRIMARY KEY,
	"user_id" int NOT NULL,
	"created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "cart_items" (
	"cart_item_id" serial PRIMARY KEY,
	"cart_id" int NOT NULL,
	"product_id" int NOT NULL,
	"quantity" int NOT NULL CHECK (quantity > 0),
	"total_price" numeric(10,2) NOT NULL CHECK (total_price >= 0),
	FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id") ON DELETE CASCADE,
	FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE SET NULL
);