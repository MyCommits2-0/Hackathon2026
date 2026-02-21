-- =====================================================
-- Admission Management & Discount Engine Database
-- =====================================================

CREATE DATABASE admission_management_db;
USE admission_management_db;

-- =====================================================
-- 1️⃣ STUDENTS TABLE
-- =====================================================

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    registration_id INT NOT NULL,

    amount_paid DECIMAL(10,2) NOT NULL,

    payment_mode ENUM('CASH','UPI','CARD','NETBANKING') NOT NULL,

    payment_status ENUM('SUCCESS','FAILED','PENDING') DEFAULT 'SUCCESS',

    transaction_reference VARCHAR(100),

    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (registration_id)
        REFERENCES registrations(id)
        ON DELETE CASCADE
);
-- =====================================================
-- 2️⃣ COURSES TABLE
-- =====================================================

CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3️⃣ BATCHES TABLE
-- =====================================================

CREATE TABLE batches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    batch_name VARCHAR(150) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    capacity INT NOT NULL,
    location_mode ENUM('ONLINE', 'OFFLINE') NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- =====================================================
-- 4️⃣ REGISTRATIONS TABLE
-- =====================================================

CREATE TABLE registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_code VARCHAR(50) UNIQUE NOT NULL,
    student_id INT NOT NULL,
    batch_id INT NOT NULL,
    original_fee DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (batch_id) REFERENCES batches(id),

    UNIQUE KEY unique_active_registration (student_id, status)
);

-- =====================================================
-- 5️⃣ DISCOUNT TYPES TABLE
-- =====================================================

CREATE TABLE discount_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- =====================================================
-- 6️⃣ DISCOUNTS TABLE
-- =====================================================

CREATE TABLE discounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    discount_name VARCHAR(150) NOT NULL,
    discount_type_id INT NOT NULL,

    value_type ENUM('FLAT', 'PERCENTAGE') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,

    start_date DATE,
    end_date DATE,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (discount_type_id) REFERENCES discount_types(id)
);

-- =====================================================
-- 7️⃣ DISCOUNT - BATCH MAPPING
-- =====================================================

CREATE TABLE discount_batches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    discount_id INT NOT NULL,
    batch_id INT NOT NULL,

    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,

    UNIQUE (discount_id, batch_id)
);

-- =====================================================
-- 8️⃣ DISCOUNT - STUDENT MAPPING
-- =====================================================

CREATE TABLE discount_students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    discount_id INT NOT NULL,
    student_id INT NOT NULL,

    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,

    UNIQUE (discount_id, student_id)
);



CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =====================================================
-- 9️⃣ DISCOUNT - COMBO BATCHES TABLE
-- =====================================================

CREATE TABLE discount_combo_batches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    discount_id INT NOT NULL,
    batch_id INT NOT NULL,

    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- =====================================================
-- 🔟 REGISTRATION DISCOUNTS TABLE
-- =====================================================

CREATE TABLE registration_discounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT NOT NULL,
    discount_id INT NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (discount_id) REFERENCES discounts(id),

    UNIQUE (registration_id)
);

-- =====================================================
-- END OF DATABASE SCRIPT
-- =====================================================