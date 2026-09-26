CREATE DATABASE IF NOT EXISTS supply_chain_intelligence;
USE supply_chain_intelligence;

CREATE TABLE IF NOT EXISTS stores (
  store_id VARCHAR(32) PRIMARY KEY,
  region VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS products (
  product_id VARCHAR(32) PRIMARY KEY,
  category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS forecasts (
  forecast_date DATE NOT NULL,
  store_id VARCHAR(32) NOT NULL,
  product_id VARCHAR(32) NOT NULL,
  forecast_demand DECIMAL(12,4) NOT NULL,
  selected_model VARCHAR(100) NOT NULL,
  PRIMARY KEY (forecast_date, store_id, product_id),
  FOREIGN KEY (store_id) REFERENCES stores(store_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS inventory_recommendations (
  store_id VARCHAR(32) NOT NULL,
  product_id VARCHAR(32) NOT NULL,
  current_inventory DECIMAL(12,2) NOT NULL,
  lead_time_demand DECIMAL(12,2) NOT NULL,
  safety_stock DECIMAL(12,2) NOT NULL,
  reorder_point DECIMAL(12,2) NOT NULL,
  recommended_order_quantity DECIMAL(12,2) NOT NULL,
  risk VARCHAR(20) NOT NULL,
  action VARCHAR(50),
  PRIMARY KEY (store_id, product_id),
  FOREIGN KEY (store_id) REFERENCES stores(store_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);
