-- Database setup for Goat Farm Management System
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'farmhand') DEFAULT 'farmhand',
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS goats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ear_tag VARCHAR(20) UNIQUE NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    name VARCHAR(50),
    breed VARCHAR(50),
    gender ENUM('male', 'female') NOT NULL,
    birth_date DATE,
    weight DECIMAL(5,2),
    color VARCHAR(30),
    status ENUM('active', 'sold', 'deceased') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    attendance_date DATE NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    sync_status ENUM('synced', 'pending') DEFAULT 'synced',
    FOREIGN KEY (goat_id) REFERENCES goats(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(goat_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS medical_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    complaint TEXT NOT NULL,
    treatment TEXT,
    medication VARCHAR(100),
    dosage VARCHAR(50),
    treatment_date DATE NOT NULL,
    recovery_status ENUM('ongoing', 'recovered', 'chronic') DEFAULT 'ongoing',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goat_id) REFERENCES goats(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS breeding_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buck_id INTEGER NOT NULL,
    doe_id INTEGER NOT NULL,
    breeding_date DATE NOT NULL,
    pregnancy_status ENUM('confirmed', 'suspected', 'negative') DEFAULT 'suspected',
    due_date DATE,
    birth_date DATE,
    kids_born INTEGER DEFAULT 0,
    kids_survived INTEGER DEFAULT 0,
    notes TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buck_id) REFERENCES goats(id),
    FOREIGN KEY (doe_id) REFERENCES goats(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type ENUM('attendance', 'medical', 'breeding') NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    goat_id INTEGER,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goat_id) REFERENCES goats(id)
);

-- Insert sample data
INSERT INTO users (username, password_hash, role, full_name) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Farm Administrator'),
('john_doe', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmhand', 'John Doe'),
('mary_smith', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmhand', 'Mary Smith');

INSERT INTO goats (ear_tag, barcode, name, breed, gender, birth_date, weight, color) VALUES 
('GT001', '1234567890123', 'Bella', 'Boer', 'female', '2023-03-15', 45.5, 'Brown'),
('GT002', '1234567890124', 'Max', 'Nubian', 'male', '2022-11-20', 65.2, 'Black'),
('GT003', '1234567890125', 'Luna', 'Alpine', 'female', '2023-01-10', 42.8, 'White'),
('GT004', '1234567890126', 'Rocky', 'Boer', 'male', '2022-08-05', 70.1, 'Brown'),
('GT005', '1234567890127', 'Daisy', 'Saanen', 'female', '2023-05-22', 38.9, 'White');

-- Create indexes for better performance
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_goat ON attendance(goat_id);
CREATE INDEX idx_medical_goat ON medical_logs(goat_id);
CREATE INDEX idx_breeding_dates ON breeding_records(breeding_date, due_date);
CREATE INDEX idx_goats_barcode ON goats(barcode);
CREATE INDEX idx_goats_ear_tag ON goats(ear_tag);
