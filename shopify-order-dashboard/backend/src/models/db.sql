-- Create Database
CREATE DATABASE shopify_orders_db;

-- Connect to the database
\c shopify_orders_db;

-- Shops Table (stores merchant information)
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    shop_domain VARCHAR(255) UNIQUE NOT NULL,
    access_token TEXT NOT NULL,
    scope VARCHAR(255),
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    shop_domain VARCHAR(255) NOT NULL,
    shopify_order_id VARCHAR(255) UNIQUE NOT NULL,
    order_number VARCHAR(50),
    email VARCHAR(255),
    total_price DECIMAL(10, 2),
    currency VARCHAR(10),
    financial_status VARCHAR(50),
    fulfillment_status VARCHAR(50),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    shipping_address JSONB,
    billing_address JSONB,
    line_items_count INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fulfillment Items Table
CREATE TABLE fulfillment_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    return_id VARCHAR(255),
    line_item_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255),
    variant_id VARCHAR(255),
    sku VARCHAR(255),
    name VARCHAR(500),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2),
    reason TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Images Table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    return_item_id INTEGER REFERENCES fulfillment_items(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_shopify_order_id ON orders(shopify_order_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_shop_domain ON orders(shop_domain);
CREATE INDEX idx_fulfillment_items_order_id ON fulfillment_items(order_id);
CREATE INDEX idx_images_return_item_id ON images(return_item_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for shops table
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
