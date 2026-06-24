# Database Schema - Machinery Rental Management System

## Tables Overview

### 1. Users Table
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150),
  role VARCHAR(50) DEFAULT 'user', -- admin, staff, user
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Equipment Table
```sql
CREATE TABLE equipment (
  equipment_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(100) NOT NULL, -- mixer, vibrator, compactor, winch, etc.
  model VARCHAR(100),
  serial_number VARCHAR(100) UNIQUE,
  purchase_date DATE,
  rental_rate_per_day DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'available', -- available, rented, maintenance, retired
  location VARCHAR(255),
  condition VARCHAR(50), -- excellent, good, fair, poor
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Customers Table
```sql
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company_name VARCHAR(150),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  tax_id VARCHAR(50),
  rating INT DEFAULT 0, -- 1-5 rating
  total_rentals INT DEFAULT 0,
  total_spent DECIMAL(15, 2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_rental_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Rentals Table
```sql
CREATE TABLE rentals (
  rental_id SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL,
  customer_id INT NOT NULL,
  rental_start_date TIMESTAMP NOT NULL,
  expected_return_date TIMESTAMP NOT NULL,
  actual_return_date TIMESTAMP,
  rental_status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled, overdue
  equipment_condition_at_checkout VARCHAR(50),
  equipment_condition_at_return VARCHAR(50),
  delivery_location VARCHAR(255),
  return_location VARCHAR(255),
  rental_cost DECIMAL(10, 2) NOT NULL,
  late_fee DECIMAL(10, 2) DEFAULT 0.00,
  damage_fee DECIMAL(10, 2) DEFAULT 0.00,
  total_cost DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0.00,
  remaining_balance DECIMAL(15, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

### 5. Payments Table
```sql
CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  rental_id INT NOT NULL,
  customer_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50), -- cash, card, check, transfer
  transaction_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed, refunded
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rental_id) REFERENCES rentals(rental_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

### 6. Location Tracking Table
```sql
CREATE TABLE location_tracking (
  location_id SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL,
  rental_id INT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_delivery_point BOOLEAN DEFAULT false,
  is_return_point BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id),
  FOREIGN KEY (rental_id) REFERENCES rentals(rental_id)
);
```

### 7. Customer Ratings Table
```sql
CREATE TABLE customer_ratings (
  rating_id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  rental_id INT NOT NULL,
  rating INT NOT NULL, -- 1-5 rating
  punctuality INT, -- 1-5
  equipment_care INT, -- 1-5
  communication INT, -- 1-5
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (rental_id) REFERENCES rentals(rental_id)
);
```

### 8. Maintenance History Table
```sql
CREATE TABLE maintenance_history (
  maintenance_id SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL,
  maintenance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  maintenance_type VARCHAR(100), -- repair, inspection, cleaning, etc.
  description TEXT,
  cost DECIMAL(10, 2),
  technician_name VARCHAR(100),
  next_maintenance_date DATE,
  status VARCHAR(50) DEFAULT 'completed', -- pending, in-progress, completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
);
```

### 9. Invoices Table
```sql
CREATE TABLE invoices (
  invoice_id SERIAL PRIMARY KEY,
  rental_id INT NOT NULL,
  customer_id INT NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL,
  subtotal DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0.00,
  total_amount DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, viewed, partially_paid, paid
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rental_id) REFERENCES rentals(rental_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

## Indexes for Performance

```sql
-- Equipment Indexes
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_type ON equipment(type);

-- Customer Indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_is_active ON customers(is_active);

-- Rental Indexes
CREATE INDEX idx_rentals_customer_id ON rentals(customer_id);
CREATE INDEX idx_rentals_equipment_id ON rentals(equipment_id);
CREATE INDEX idx_rentals_status ON rentals(rental_status);
CREATE INDEX idx_rentals_dates ON rentals(rental_start_date, expected_return_date);

-- Payment Indexes
CREATE INDEX idx_payments_rental_id ON payments(rental_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Location Tracking Indexes
CREATE INDEX idx_location_equipment_id ON location_tracking(equipment_id);
CREATE INDEX idx_location_rental_id ON location_tracking(rental_id);
CREATE INDEX idx_location_timestamp ON location_tracking(timestamp);
```

## Relationships Summary

- **Equipment** ← → **Rentals** (1 to Many)
- **Customers** ← → **Rentals** (1 to Many)
- **Customers** ← → **Payments** (1 to Many)
- **Rentals** ← → **Payments** (1 to Many)
- **Equipment** ← → **Location Tracking** (1 to Many)
- **Rentals** ← → **Location Tracking** (1 to Many)
- **Customers** ← → **Customer Ratings** (1 to Many)
- **Rentals** ← → **Customer Ratings** (1 to Many)
- **Equipment** ← → **Maintenance History** (1 to Many)
- **Rentals** ← → **Invoices** (1 to Many)
- **Customers** ← → **Invoices** (1 to Many)
