# 🐐 Goat Farm Management System

A comprehensive, offline-capable web application for managing goat farm operations including attendance tracking, medical records, breeding logs, and more. Built with PHP, MySQL, and vanilla JavaScript as a Progressive Web App (PWA).

## 📋 Table of Contents

- [Features](#features)
- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Installation Guide](#installation-guide)
- [First-Time User Walkthrough](#first-time-user-walkthrough)
- [User Manual](#user-manual)
- [Administrator Guide](#administrator-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- **🔐 Role-Based Authentication**: Admin and Farmhand user roles with different permissions
- **📱 Barcode Scanning**: Hardware barcode scanner support with audio/visual feedback
- **📊 Attendance Tracking**: Daily goat attendance with duplicate prevention
- **🏥 Medical Records**: Complete health management system
- **🍼 Breeding Management**: Track breeding, pregnancy, and birth records
- **📈 Dashboard Analytics**: Real-time statistics and notifications
- **📤 Data Export**: CSV export functionality for all records

### Technical Features
- **🌐 Progressive Web App (PWA)**: Installable on mobile devices
- **📱 Offline Capability**: Works without internet connection
- **🔄 Auto-Sync**: Automatic data synchronization when online
- **📱 Mobile-First Design**: Optimized for smartphones and tablets
- **🔊 Audio Feedback**: Success/error sounds for operations
- **📳 Haptic Feedback**: Vibration feedback on mobile devices

## 🖥️ System Requirements

### Server Requirements
- **Web Server**: Apache 2.4+ or Nginx 1.18+
- **PHP**: Version 7.4 or higher
- **Database**: MySQL 5.7+ or SQLite 3.0+
- **Extensions**: PDO, PDO_MySQL (or PDO_SQLite)

### Client Requirements
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript**: Enabled
- **Storage**: 50MB available for offline data
- **Camera**: Optional, for future barcode scanning features

### Hardware (Optional)
- **Barcode Scanner**: USB or Bluetooth barcode scanner
- **Mobile Device**: Android 6.0+ or iOS 12.0+

## 🚀 Quick Start

### Demo Access
Try the system immediately with these demo credentials:

- **Admin Access**: `admin` / `password`
- **Farmhand Access**: `john_doe` / `password`

### 5-Minute Setup
1. **Download** and extract files to your web server
2. **Run** the database setup script
3. **Configure** database connection in `config/database.php`
4. **Access** the application in your browser
5. **Login** with demo credentials above

## 📦 Installation Guide

### Step 1: Download and Extract
\`\`\`bash
# Download the project files
git clone https://github.com/your-repo/goat-farm-management.git
cd goat-farm-management
\`\`\`

### Step 2: Database Setup

#### Option A: MySQL Setup (Recommended for Production)
1. Create a new MySQL database:
\`\`\`sql
CREATE DATABASE goat_farm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

2. Create a database user:
\`\`\`sql
CREATE USER 'goat_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON goat_farm.* TO 'goat_user'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

3. Import the database schema:
\`\`\`bash
mysql -u goat_user -p goat_farm < scripts/database_setup.sql
\`\`\`

#### Option B: SQLite Setup (Simpler for Testing)
1. Create the data directory:
\`\`\`bash
mkdir data
chmod 755 data
\`\`\`

2. The SQLite database will be created automatically when you first run the application.

### Step 3: Configure Database Connection
Edit `config/database.php`:

\`\`\`php
<?php
class Database {
    // For MySQL
    private $host = 'localhost';
    private $db_name = 'goat_farm';
    private $username = 'goat_user';
    private $password = 'your_secure_password';
    
    // For SQLite, the system will automatically fallback
    // No additional configuration needed
}
?>
\`\`\`

### Step 4: Set Permissions
\`\`\`bash
# Make sure web server can write to necessary directories
chmod 755 data/
chmod 644 config/database.php
\`\`\`

### Step 5: Web Server Configuration

#### Apache (.htaccess)
Create `.htaccess` in the root directory:
\`\`\`apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/$1.php [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
\`\`\`

#### Nginx
Add to your server block:
\`\`\`nginx
location /api/ {
    try_files $uri $uri.php =404;
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
}

# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
\`\`\`

### Step 6: Test Installation
1. Open your browser and navigate to your installation URL
2. You should see the login page
3. Use demo credentials to test:
   - **Admin**: `admin` / `password`
   - **Farmhand**: `john_doe` / `password`

## 👋 First-Time User Walkthrough

### Welcome to Your Goat Farm Management System!

This comprehensive walkthrough will guide you through your first experience with the system.

#### Step 1: First Login 🔑
1. **Open the Application**
   - Navigate to your installation URL in a web browser
   - You'll see the login screen with the goat emoji logo

2. **Choose Your Role**
   - **Admin Account**: Full access to all features
     - Username: `admin`
     - Password: `password`
   - **Farmhand Account**: Limited to daily operations
     - Username: `john_doe`
     - Password: `password`

3. **Login Process**
   - Enter your credentials
   - Click "Login"
   - You'll be redirected to the dashboard

#### Step 2: Dashboard Overview 📊
After logging in, you'll see the main dashboard with:

- **📊 Statistics Cards**: Quick overview of your farm
  - Total active goats (should show 5 sample goats)
  - Today's attendance count
  - Pending medical cases
  - Upcoming births

- **📢 Notifications Panel**: Important alerts and reminders
- **📈 Recent Activity**: Latest attendance records
- **🧭 Navigation Tabs**: Access different modules

**What you'll see:**
- Clean, mobile-friendly interface
- Real-time statistics updating
- Color-coded status indicators
- Responsive design that works on any device

#### Step 3: Your First Attendance Record 📋
Let's record your first goat attendance:

1. **Navigate to Attendance**
   - Click the "Attendance" tab in the navigation
   - You'll see today's date is pre-selected
   - The interface shows any existing attendance for today

2. **Scan a Goat**
   - Click "📱 Scan Barcode" button
   - A full-screen scanner window will appear
   - Try these sample barcodes:
     - `1234567890123` (Bella - Female Boer)
     - `1234567890124` (Max - Male Nubian)
     - `1234567890125` (Luna - Female Alpine)
   - Or manually type the ear tag: `GT001`, `GT002`, or `GT003`

3. **Confirm the Scan**
   - Click "Confirm" button
   - You'll hear a success sound (if audio is enabled)
   - See a green toast message: "✅ Attendance recorded for GT001 - Bella"
   - The goat's attendance is now recorded for today

4. **Try Duplicate Prevention**
   - Try scanning the same goat again
   - You'll see a warning: "⚠️ GT001 already marked present today"
   - This prevents duplicate entries

#### Step 4: Explore Medical Records 🏥
Let's add a medical record:

1. **Navigate to Medical Tab**
   - Click "Medical" tab in navigation
   - You'll see any existing medical records

2. **Add New Medical Record**
   - Click "+ Add Medical Record" button
   - A modal form will open

3. **Fill Out Medical Form**
   - **Select Goat**: Choose "GT001 - Bella" from dropdown
   - **Treatment Date**: Today's date (pre-filled)
   - **Health Complaint**: "Slight limp on front left leg"
   - **Treatment**: "Rest and observation"
   - **Medication**: "Anti-inflammatory" (optional)
   - **Dosage**: "5ml daily" (optional)
   - **Recovery Status**: "Ongoing"
   - **Notes**: "Monitor for improvement over next 3 days"

4. **Save the Record**
   - Click "Save Record"
   - You'll see a success message
   - The record appears in the medical records table

#### Step 5: Breeding Records (Admin Only) 🍼
If you're logged in as admin:

1. **Navigate to Breeding Tab**
   - Click "Breeding" tab
   - View existing breeding records

2. **Add Breeding Record**
   - Click "+ Add Breeding Record"
   - **Select Buck**: Choose "GT002 - Max" or "GT004 - Rocky"
   - **Select Doe**: Choose "GT001 - Bella" or "GT003 - Luna"
   - **Breeding Date**: Select a recent date
   - **Pregnancy Status**: "Suspected"
   - **Expected Due Date**: Calculate ~150 days from breeding
   - **Notes**: "First breeding for this pair"

3. **Save and Monitor**
   - Save the record
   - This will appear in upcoming births statistics

#### Step 6: Test Offline Functionality 📱
This is a key feature for farm workers:

1. **Disconnect from Internet**
   - Turn off WiFi or disconnect ethernet
   - Notice the yellow offline indicator appears at the top
   - Message: "📡 Offline Mode - Data will sync when connection is restored"

2. **Record Offline Attendance**
   - Go to Attendance tab
   - Try scanning another goat: `GT004` or `GT005`
   - You'll see: "📱 Offline: Attendance queued for GT004"
   - Data is stored locally in your browser

3. **Check Offline Storage**
   - The system stores data in browser's local storage
   - You can continue working without internet
   - All data is queued for synchronization

4. **Reconnect and Sync**
   - Reconnect to internet
   - The offline indicator disappears
   - Click the "🔄 Sync" button in the header
   - Watch your offline data sync to the server
   - Success message: "X records synced successfully"

#### Step 7: Install as Mobile App (PWA) 📲
Transform the web app into a native-like mobile app:

1. **On Mobile Browser (Android Chrome)**
   - Open the app in Chrome
   - Tap the menu (three dots)
   - Select "Add to Home Screen"
   - Choose app name and tap "Add"
   - App icon appears on home screen

2. **On Mobile Browser (iOS Safari)**
   - Open the app in Safari
   - Tap the share button (square with arrow)
   - Scroll down and tap "Add to Home Screen"
   - Edit name if desired and tap "Add"

3. **Desktop Installation (Chrome)**
   - Chrome will show an install prompt in the address bar
   - Click the install icon
   - App opens in its own window
   - Appears in your applications menu

#### Step 8: Explore Data Export (Admin Only) 📊
If you're an admin, test the export functionality:

1. **Navigate to Export Tab**
   - Click "Export" tab (admin only)
   - You'll see three export options

2. **Export Attendance Data**
   - Click "Export CSV" under "Attendance Records"
   - A CSV file downloads automatically
   - Open in Excel or Google Sheets to view data

3. **Export Other Data Types**
   - Try exporting medical records
   - Try exporting breeding records
   - Each export includes relevant data with timestamps

#### Step 9: Understand User Roles 👥
Test the difference between user roles:

1. **Admin Capabilities** (login as `admin`)
   - Can see all tabs including "Goats" and "Export"
   - Can add, edit, and delete goats
   - Can manage all records
   - Can export data
   - Full system access

2. **Farmhand Capabilities** (login as `john_doe`)
   - Can record attendance
   - Can add medical records
   - Can view breeding information
   - Cannot manage goats or export data
   - Limited to operational tasks

#### Step 10: Mobile Field Usage 📱
Simulate real farm usage:

1. **Use on Mobile Device**
   - Access the app on your smartphone
   - Notice the touch-friendly interface
   - Large buttons for easy tapping
   - Responsive design adapts to screen size

2. **Barcode Scanning Workflow**
   - Open attendance tab
   - Tap "Scan Barcode"
   - Use hardware scanner or manual entry
   - Get immediate audio/visual feedback
   - Continue to next goat quickly

3. **Offline Field Work**
   - Work in areas with poor internet
   - Record multiple attendances offline
   - Sync when back in WiFi range
   - No data loss during offline periods

### 🎯 Quick Tips for New Users

- **🔊 Enable Audio**: Turn on device sound for scanning feedback
- **📱 Use Mobile**: The app is optimized for mobile field work
- **🔄 Sync Regularly**: Sync data when you have internet connection
- **📊 Check Dashboard**: Review daily statistics each morning
- **🆘 Need Help**: Refer to the troubleshooting section below
- **🔐 Change Passwords**: Update default passwords for security
- **📋 Daily Routine**: Check notifications → Record attendance → Review medical cases

### 🚨 What to Do If Something Goes Wrong

- **Login Issues**: Check username/password, clear browser cookies
- **Barcode Not Working**: Try manual entry, check scanner connection
- **Offline Sync Failed**: Click sync button manually, check internet
- **App Slow**: Clear browser cache, restart browser
- **Data Missing**: Check if you're logged in with correct role

This completes your first-time walkthrough! You're now ready to use the Goat Farm Management System effectively.

## 📖 User Manual

### Authentication System

#### User Roles and Permissions
- **Admin**: Full system access
  - Manage goats (add, edit, delete)
  - Access all records and reports
  - Export data to CSV
  - Manage breeding records
  - View system statistics
  
- **Farmhand**: Operational access
  - Record daily attendance
  - Add medical records
  - View breeding information
  - Access dashboard statistics

#### Security Features
- Passwords encrypted using bcrypt
- Session-based authentication
- Role-based access control
- Secure password requirements
- Session timeout protection

### Dashboard Module

#### Statistics Overview
The dashboard provides real-time insights:

- **Total Goats**: Count of active goats in the system
- **Today's Attendance**: Number of goats marked present today
- **Pending Medical**: Ongoing medical cases requiring attention
- **Upcoming Births**: Expected births in the next 30 days

#### Notifications System
Automatic alerts are generated for:
- Missed attendance (goats not seen for 3+ days)
- Upcoming birth dates (within 7 days)
- Medical follow-ups required
- System maintenance reminders

#### Recent Activity Feed
- Latest attendance records
- Recent medical entries
- System events and updates
- User activity summary

### Attendance Tracking

#### Barcode Scanning Methods
1. **Hardware Scanners**
   - USB barcode scanners (keyboard emulation mode)
   - Bluetooth wireless scanners
   - Automatic detection and processing
   - Audio/visual feedback on successful scan

2. **Manual Entry**
   - Type barcode number directly
   - Enter ear tag as alternative
   - Keyboard shortcuts for quick entry
   - Auto-completion for known codes

#### Supported Barcode Formats
- **EAN-13**: 13-digit European Article Number
- **EAN-8**: 8-digit short version
- **Code 128**: Alphanumeric codes
- **Code 39**: Letters, numbers, and symbols
- **Custom Ear Tags**: Farm-specific formats (e.g., GT001, GT002)

#### Attendance Rules and Validation
- One attendance record per goat per day
- Duplicate attempts show warning message
- Historical attendance preserved indefinitely
- Offline records sync automatically when online
- Date-based filtering and searching

#### Offline Attendance Recording
- Records stored in browser's IndexedDB
- Automatic sync when connection restored
- Visual indicators for pending sync
- No data loss during offline periods
- Background sync every 30 seconds

### Medical Records Management

#### Creating Medical Records
1. **Select Goat**: Choose from dropdown of active goats
2. **Treatment Date**: Date of medical intervention
3. **Health Complaint**: Detailed description of issue
4. **Treatment Given**: Actions taken to address problem
5. **Medication**: Drugs administered (optional)
6. **Dosage**: Amount and frequency (optional)
7. **Recovery Status**: Current condition
8. **Additional Notes**: Extra observations

#### Recovery Status Options
- **Ongoing**: Treatment in progress, monitoring required
- **Recovered**: Goat has fully recovered from condition
- **Chronic**: Long-term condition requiring ongoing management

#### Medical History and Tracking
- Complete medical history per goat
- Chronological timeline of treatments
- Filter by date range or recovery status
- Export medical records for veterinary review
- Medication tracking and dosage history

### Breeding Management

#### Breeding Record Creation
- **Buck Selection**: Choose male goat from active list
- **Doe Selection**: Choose female goat from active list
- **Breeding Date**: When breeding occurred
- **Pregnancy Status**: Current pregnancy state
- **Due Date**: Expected birth date (calculated or manual)
- **Notes**: Additional breeding information

#### Pregnancy Status Tracking
- **Suspected**: Initial breeding recorded, pregnancy not confirmed
- **Confirmed**: Pregnancy confirmed by veterinarian or observation
- **Negative**: Breeding did not result in pregnancy

#### Birth Record Management
- **Birth Date**: Actual date of birth
- **Kids Born**: Total number of offspring
- **Kids Survived**: Number that survived birth
- **Complications**: Any issues during birth
- **Success Rate**: Breeding program analytics

#### Breeding Calendar and Alerts
- Due date calculations (150-day gestation)
- Upcoming birth notifications
- Breeding schedule planning
- Historical breeding success rates

### Goat Management (Admin Only)

#### Adding New Goats
**Required Information:**
- Ear tag (unique identifier)
- Gender (male/female)

**Optional Information:**
- Name
- Breed (Boer, Nubian, Alpine, etc.)
- Birth date
- Weight (in kg)
- Color description
- Barcode number

#### Goat Status Management
- **Active**: Normal, healthy goats in the herd
- **Sold**: Goats sold to other farms
- **Deceased**: Goats that have died

#### Bulk Operations
- Import goats from CSV file
- Bulk status updates
- Mass barcode assignment
- Batch editing capabilities

### Data Export System

#### Available Export Types
1. **Attendance Records**
   - Date, goat information, recorded by, notes
   - CSV format with timestamps
   - Filterable by date range

2. **Medical Records**
   - Treatment dates, complaints, medications
   - Recovery status and notes
   - Complete medical history

3. **Breeding Records**
   - Breeding pairs, dates, outcomes
   - Birth statistics and success rates
   - Pregnancy tracking data

#### Export Process
1. Navigate to Export tab (admin only)
2. Choose record type to export
3. Click "Export CSV" button
4. File downloads automatically with timestamp
5. Open in Excel, Google Sheets, or other spreadsheet software

#### Data Analysis
- Import into business intelligence tools
- Create custom reports and charts
- Track farm performance metrics
- Generate veterinary reports

### Offline Functionality (PWA)

#### How Offline Mode Works
- Service worker caches application files
- IndexedDB stores offline data locally
- LocalStorage provides backup storage
- Automatic synchronization when online

#### Offline Capabilities
- Record goat attendance
- View cached goat information
- Access recent records and history
- Continue working without internet connection
- Queue data for later synchronization

#### Sync Process and Conflict Resolution
- Manual sync via sync button
- Automatic sync when connection restored
- Background sync every 30 seconds
- Duplicate detection and prevention
- Conflict resolution for simultaneous edits

### Mobile App Features (PWA)

#### Progressive Web App Installation
1. **Android Chrome**
   - Tap menu → "Add to Home screen"
   - App installs like native application
   - Works offline with full functionality

2. **iOS Safari**
   - Tap share button → "Add to Home Screen"
   - Creates app icon on home screen
   - Standalone app experience

3. **Desktop Chrome**
   - Click install prompt in address bar
   - App opens in dedicated window
   - Appears in applications menu

#### Mobile Optimizations
- Touch-friendly buttons and inputs (44px minimum)
- Responsive design for all screen sizes
- Haptic feedback for scan confirmation
- Audio cues for successful operations
- Optimized for one-handed use
- Fast loading and smooth animations

#### Hardware Integration
- Camera access for future barcode scanning
- Vibration API for tactile feedback
- Audio API for sound notifications
- Geolocation for farm area tracking
- Device orientation support

## 👨‍💼 Administrator Guide

### User Management

#### Creating New Users
\`\`\`sql
-- Add new farmhand user
INSERT INTO users (username, password_hash, role, full_name) 
VALUES ('new_user', '$2y$10$...', 'farmhand', 'Full Name');
\`\`\`

#### Password Management
- Use strong passwords (8+ characters, mixed case, numbers, symbols)
- Change default passwords immediately
- Implement password rotation policy
- Monitor failed login attempts

#### Role-Based Permissions
\`\`\`php
// Check user permissions in PHP
if ($_SESSION['role'] === 'admin') {
    // Admin-only functionality
} else {
    // Farmhand functionality
}
\`\`\`

### Advanced Goat Management

#### Bulk Import Process
1. Prepare CSV file with goat data
2. Use database import tools
3. Validate data integrity
4. Update system statistics

#### Goat Lifecycle Management
- Track goat from birth to sale/death
- Maintain complete history
- Generate lifecycle reports
- Monitor herd composition

### Database Administration

#### Regular Maintenance Tasks
\`\`\`sql
-- Optimize database tables
OPTIMIZE TABLE goats, attendance, medical_logs, breeding_records;

-- Check table integrity
CHECK TABLE goats, attendance, medical_logs, breeding_records;

-- Update statistics
ANALYZE TABLE goats, attendance, medical_logs, breeding_records;
\`\`\`

#### Performance Monitoring
\`\`\`sql
-- Monitor slow queries
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Slow_queries';

-- Check database size
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'goat_farm';
\`\`\`

#### Backup Procedures
\`\`\`bash
#!/bin/bash
# Daily backup script
DATE=$(date +%Y%m%d)
mysqldump -u username -p goat_farm > backup_$DATE.sql
\`\`\`

### Security Configuration

#### Server Security
\`\`\`apache
# .htaccess security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000"
\`\`\`

#### Database Security
\`\`\`sql
-- Create dedicated database user
CREATE USER 'goat_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON goat_farm.* TO 'goat_app'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

#### File Permissions
\`\`\`bash
# Set secure file permissions
chmod 644 *.php
chmod 755 directories/
chmod 600 config/database.php
\`\`\`

### System Monitoring

#### Key Metrics to Monitor
- Database connection status
- Disk space usage
- PHP error logs
- Service worker registration
- Offline sync queue size
- User activity patterns

#### Log Analysis
\`\`\`bash
# Monitor PHP errors
tail -f /var/log/php/error.log

# Check web server errors
tail -f /var/log/apache2/error.log

# Database slow queries
tail -f /var/log/mysql/slow.log
\`\`\`

#### Performance Optimization
- Enable gzip compression
- Optimize database queries
- Use proper indexing
- Implement caching strategies
- Monitor resource usage

### Backup and Recovery

#### Automated Backup Strategy
\`\`\`bash
#!/bin/bash
# Comprehensive backup script
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/goat_farm"

# Database backup
mysqldump -u username -p goat_farm > $BACKUP_DIR/db_$DATE.sql

# File backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /path/to/app

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
\`\`\`

#### Recovery Procedures
\`\`\`bash
# Restore database
mysql -u username -p goat_farm < backup_20240115.sql

# Restore files
tar -xzf files_20240115.tar.gz -C /restore/path
\`\`\`

### Scaling Considerations

#### Database Scaling
- Implement read replicas for heavy read workloads
- Consider database partitioning for large datasets
- Use connection pooling for high concurrency
- Monitor query performance and optimize

#### Application Scaling
- Load balancer for multiple app servers
- CDN for static assets
- Redis for session storage
- Queue system for background tasks

## 🔧 API Documentation

### Authentication Endpoints

#### POST /api/login.php
Authenticate user with username and password.

**Request:**
\`\`\`json
{
  "username": "admin",
  "password": "password"
}
\`\`\`

**Response (Success):**
\`\`\`json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "full_name": "Farm Administrator"
  }
}
\`\`\`

**Response (Error):**
\`\`\`json
{
  "error": "Invalid credentials"
}
\`\`\`

#### GET /api/logout.php
Logout current user and destroy session.

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

### Dashboard Endpoints

#### GET /api/dashboard.php
Get dashboard statistics and recent activity.

**Headers:**
- Requires valid session

**Response:**
\`\`\`json
{
  "success": true,
  "stats": {
    "total_goats": 5,
    "todays_attendance": 3,
    "pending_medical": 1,
    "upcoming_births": 2
  },
  "notifications": [
    {
      "id": 1,
      "type": "breeding",
      "title": "Upcoming Birth",
      "message": "GT001 - Bella is due in 3 days",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "recent_attendance": [
    {
      "ear_tag": "GT001",
      "goat_name": "Bella",
      "user_name": "John Doe",
      "timestamp": "2024-01-15T08:30:00Z"
    }
  ],
  "user_role": "admin"
}
\`\`\`

### Goat Management Endpoints

#### GET /api/goats.php
Get all active goats or search by barcode.

**Parameters:**
- `barcode` (optional): Search for specific goat by barcode or ear tag

**Response (All Goats):**
\`\`\`json
{
  "success": true,
  "goats": [
    {
      "id": 1,
      "ear_tag": "GT001",
      "barcode": "1234567890123",
      "name": "Bella",
      "breed": "Boer",
      "gender": "female",
      "birth_date": "2023-03-15",
      "weight": 45.5,
      "color": "Brown",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

**Response (Single Goat by Barcode):**
\`\`\`json
{
  "success": true,
  "goat": {
    "id": 1,
    "ear_tag": "GT001",
    "barcode": "1234567890123",
    "name": "Bella",
    "breed": "Boer",
    "gender": "female",
    "birth_date": "2023-03-15",
    "weight": 45.5,
    "color": "Brown",
    "status": "active"
  }
}
\`\`\`

#### POST /api/goats.php
Add new goat (admin only).

**Headers:**
- Requires admin session

**Request:**
\`\`\`json
{
  "ear_tag": "GT006",
  "barcode": "1234567890128",
  "name": "Charlie",
  "breed": "Alpine",
  "gender": "male",
  "birth_date": "2023-06-01",
  "weight": 35.2,
  "color": "Black"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "id": 6
}
\`\`\`

#### PUT /api/goats.php
Update existing goat (admin only).

**Request:**
\`\`\`json
{
  "id": 1,
  "ear_tag": "GT001",
  "barcode": "1234567890123",
  "name": "Bella Updated",
  "breed": "Boer",
  "gender": "female",
  "birth_date": "2023-03-15",
  "weight": 47.0,
  "color": "Brown"
}
\`\`\`

#### DELETE /api/goats.php
Mark goat as deceased (admin only).

**Request:**
\`\`\`json
{
  "id": 1
}
\`\`\`

### Attendance Endpoints

#### GET /api/attendance.php
Get attendance records for specific date.

**Parameters:**
- `date` (optional): Date in YYYY-MM-DD format (defaults to today)

**Response:**
\`\`\`json
{
  "success": true,
  "attendance": [
    {
      "id": 1,
      "goat_id": 1,
      "ear_tag": "GT001",
      "goat_name": "Bella",
      "user_name": "John Doe",
      "attendance_date": "2024-01-15",
      "timestamp": "2024-01-15T08:30:00Z",
      "notes": "Healthy and active"
    }
  ]
}
\`\`\`

#### POST /api/attendance.php
Record goat attendance.

**Request:**
\`\`\`json
{
  "goat_id": 1,
  "notes": "Healthy and active",
  "sync_status": "synced"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "id": 123
}
\`\`\`

**Error Response (Duplicate):**
\`\`\`json
{
  "error": "Attendance already recorded for today"
}
\`\`\`

### Medical Records Endpoints

#### GET /api/medical.php
Get medical records, optionally filtered by goat.

**Parameters:**
- `goat_id` (optional): Filter by specific goat ID

**Response:**
\`\`\`json
{
  "success": true,
  "medical_logs": [
    {
      "id": 1,
      "goat_id": 1,
      "ear_tag": "GT001",
      "goat_name": "Bella",
      "user_name": "John Doe",
      "complaint": "Limping on front left leg",
      "treatment": "Rest and anti-inflammatory",
      "medication": "Banamine",
      "dosage": "2ml daily",
      "treatment_date": "2024-01-15",
      "recovery_status": "ongoing",
      "notes": "Monitor for improvement",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

#### POST /api/medical.php
Add new medical record.

**Request:**
\`\`\`json
{
  "goat_id": 1,
  "complaint": "Limping on front left leg",
  "treatment": "Rest and anti-inflammatory",
  "medication": "Banamine",
  "dosage": "2ml daily",
  "treatment_date": "2024-01-15",
  "recovery_status": "ongoing",
  "notes": "Monitor for improvement"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "id": 456
}
\`\`\`

#### PUT /api/medical.php
Update existing medical record.

**Request:**
\`\`\`json
{
  "id": 1,
  "complaint": "Limping on front left leg",
  "treatment": "Rest and anti-inflammatory - showing improvement",
  "medication": "Banamine",
  "dosage": "2ml daily",
  "recovery_status": "recovered",
  "notes": "Fully recovered after 5 days"
}
\`\`\`

### Breeding Records Endpoints

#### GET /api/breeding.php
Get all breeding records.

**Response:**
\`\`\`json
{
  "success": true,
  "breeding_records": [
    {
      "id": 1,
      "buck_id": 2,
      "doe_id": 1,
      "buck_ear_tag": "GT002",
      "buck_name": "Max",
      "doe_ear_tag": "GT001",
      "doe_name": "Bella",
      "breeding_date": "2024-01-01",
      "pregnancy_status": "confirmed",
      "due_date": "2024-06-01",
      "birth_date": null,
      "kids_born": 0,
      "kids_survived": 0,
      "notes": "First breeding for this doe",
      "created_by_name": "Farm Administrator",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
\`\`\`

#### POST /api/breeding.php
Add new breeding record.

**Request:**
\`\`\`json
{
  "buck_id": 2,
  "doe_id": 1,
  "breeding_date": "2024-01-01",
  "pregnancy_status": "suspected",
  "due_date": "2024-06-01",
  "notes": "First breeding for this doe"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "id": 789
}
\`\`\`

#### PUT /api/breeding.php
Update breeding record with birth information.

**Request:**
\`\`\`json
{
  "id": 1,
  "pregnancy_status": "confirmed",
  "due_date": "2024-06-01",
  "birth_date": "2024-05-28",
  "kids_born": 2,
  "kids_survived": 2,
  "notes": "Successful birth, twins both healthy"
}
\`\`\`

### Sync Endpoint

#### POST /api/sync.php
Sync offline data to server.

**Request:**
\`\`\`json
{
  "offline_data": [
    {
      "type": "attendance",
      "goat_id": 1,
      "attendance_date": "2024-01-15",
      "timestamp": "2024-01-15T10:30:00Z",
      "notes": "Recorded offline"
    },
    {
      "type": "attendance",
      "goat_id": 2,
      "attendance_date": "2024-01-15",
      "timestamp": "2024-01-15T10:32:00Z",
      "notes": ""
    }
  ]
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "synced_count": 2,
  "message": "2 records synced successfully"
}
\`\`\`

### Export Endpoints

#### GET /api/export.php
Export data as CSV (admin only).

**Parameters:**
- `type`: "attendance", "medical", or "breeding"

**Response:** CSV file download with appropriate headers

**Example CSV Output (Attendance):**
\`\`\`csv
attendance_date,ear_tag,goat_name,recorded_by,notes,timestamp
2024-01-15,GT001,Bella,John Doe,Healthy and active,2024-01-15 08:30:00
2024-01-15,GT002,Max,John Doe,,2024-01-15 08:32:00
\`\`\`

### Error Handling

All API endpoints return consistent error responses:

\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate entry)
- `500`: Internal Server Error

## 🗄️ Database Schema

### Complete Database Structure

#### Users Table
\`\`\`sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'farmhand') DEFAULT 'farmhand',
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
\`\`\`

#### Goats Table
\`\`\`sql
CREATE TABLE goats (
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

-- Indexes
CREATE INDEX idx_goats_ear_tag ON goats(ear_tag);
CREATE INDEX idx_goats_barcode ON goats(barcode);
CREATE INDEX idx_goats_status ON goats(status);
CREATE INDEX idx_goats_gender ON goats(gender);
\`\`\`

#### Attendance Table
\`\`\`sql
CREATE TABLE attendance (
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

-- Indexes
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_goat ON attendance(goat_id);
CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_sync ON attendance(sync_status);
\`\`\`

#### Medical Logs Table
\`\`\`sql
CREATE TABLE medical_logs (
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

-- Indexes
CREATE INDEX idx_medical_goat ON medical_logs(goat_id);
CREATE INDEX idx_medical_date ON medical_logs(treatment_date);
CREATE INDEX idx_medical_status ON medical_logs(recovery_status);
\`\`\`

#### Breeding Records Table
\`\`\`sql
CREATE TABLE breeding_records (
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

-- Indexes
CREATE INDEX idx_breeding_dates ON breeding_records(breeding_date, due_date);
CREATE INDEX idx_breeding_buck ON breeding_records(buck_id);
CREATE INDEX idx_breeding_doe ON breeding_records(doe_id);
CREATE INDEX idx_breeding_status ON breeding_records(pregnancy_status);
\`\`\`

#### Notifications Table
\`\`\`sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type ENUM('attendance', 'medical', 'breeding') NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    goat_id INTEGER,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goat_id) REFERENCES goats(id)
);

-- Indexes
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_date ON notifications(created_at);
\`\`\`

### Sample Data

#### Default Users
\`\`\`sql
INSERT INTO users (username, password_hash, role, full_name) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Farm Administrator'),
('john_doe', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmhand', 'John Doe'),
('mary_smith', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmhand', 'Mary Smith');
\`\`\`

#### Sample Goats
\`\`\`sql
INSERT INTO goats (ear_tag, barcode, name, breed, gender, birth_date, weight, color) VALUES 
('GT001', '1234567890123', 'Bella', 'Boer', 'female', '2023-03-15', 45.5, 'Brown'),
('GT002', '1234567890124', 'Max', 'Nubian', 'male', '2022-11-20', 65.2, 'Black'),
('GT003', '1234567890125', 'Luna', 'Alpine', 'female', '2023-01-10', 42.8, 'White'),
('GT004', '1234567890126', 'Rocky', 'Boer', 'male', '2022-08-05', 70.1, 'Brown'),
('GT005', '1234567890127', 'Daisy', 'Saanen', 'female', '2023-05-22', 38.9, 'White');
\`\`\`

### Database Maintenance

#### Regular Maintenance Queries
\`\`\`sql
-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
    table_rows
FROM information_schema.tables 
WHERE table_schema = 'goat_farm'
ORDER BY (data_length + index_length) DESC;

-- Optimize all tables
OPTIMIZE TABLE users, goats, attendance, medical_logs, breeding_records, notifications;

-- Check for orphaned records
SELECT COUNT(*) FROM attendance WHERE goat_id NOT IN (SELECT id FROM goats);
SELECT COUNT(*) FROM medical_logs WHERE goat_id NOT IN (SELECT id FROM goats);
SELECT COUNT(*) FROM breeding_records WHERE buck_id NOT IN (SELECT id FROM goats);
\`\`\`

#### Performance Monitoring
\`\`\`sql
-- Show slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- Check index usage
SHOW INDEX FROM goats;
SHOW INDEX FROM attendance;

-- Monitor table locks
SHOW OPEN TABLES WHERE In_use > 0;
\`\`\`

## 🔍 Troubleshooting

### Quick Diagnostic Checklist

When encountering issues, check these items first:

- [ ] **Browser Console**: Check for JavaScript errors (F12 → Console)
- [ ] **Network Tab**: Verify API requests are successful (F12 → Network)
- [ ] **PHP Error Log**: Check server-side errors
- [ ] **Database Connection**: Verify database is accessible
- [ ] **File Permissions**: Ensure proper file/folder permissions
- [ ] **Service Worker**: Check if PWA features are working
- [ ] **Internet Connection**: Verify online/offline status

### Authentication Issues

#### Problem: Cannot Login with Correct Credentials

**Symptoms:**
- "Invalid credentials" error with correct username/password
- Login form redirects back to login page
- Session not persisting

**Diagnostic Steps:**
\`\`\`php
// Check if user exists in database
SELECT * FROM users WHERE username = 'admin';

// Verify password hash
SELECT password_hash FROM users WHERE username = 'admin';

// Test password verification
$hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
var_dump(password_verify('password', $hash)); // Should return true
\`\`\`

**Solutions:**
1. **Clear Browser Cookies**
   \`\`\`javascript
   // Clear all cookies for the site
   document.cookie.split(";").forEach(function(c) { 
       document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
   });
   \`\`\`

2. **Check PHP Session Configuration**
   \`\`\`php
   // Add to config/database.php for debugging
   ini_set('session.cookie_httponly', 1);
   ini_set('session.use_strict_mode', 1);
   session_start();
   echo "Session ID: " . session_id();
   \`\`\`

3. **Reset User Password**
   \`\`\`sql
   -- Reset admin password to 'password'
   UPDATE users SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'admin';
   \`\`\`

#### Problem: Session Expires Too Quickly

**Solutions:**
\`\`\`php
// Extend session lifetime in config/auth.php
ini_set('session.gc_maxlifetime', 3600); // 1 hour
ini_set('session.cookie_lifetime', 3600);
\`\`\`

### Database Issues

#### Problem: Database Connection Failed

**Error Messages:**
- "Connection error: SQLSTATE[HY000] [1045] Access denied"
- "SQLSTATE[HY000] [2002] No such file or directory"

**Diagnostic Steps:**
\`\`\`bash
# Test MySQL connection
mysql -u goat_user -p -h localhost

# Check MySQL service status
systemctl status mysql

# Check MySQL error log
tail -f /var/log/mysql/error.log
\`\`\`

**Solutions:**
1. **Verify Database Credentials**
   \`\`\`php
   // Test connection in config/database.php
   try {
       $pdo = new PDO("mysql:host=localhost;dbname=goat_farm", "username", "password");
       echo "Connection successful";
   } catch(PDOException $e) {
       echo "Connection failed: " . $e->getMessage();
   }
   \`\`\`

2. **Create Database and User**
   \`\`\`sql
   CREATE DATABASE goat_farm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'goat_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON goat_farm.* TO 'goat_user'@'localhost';
   FLUSH PRIVILEGES;
   \`\`\`

3. **Check File Permissions**
   \`\`\`bash
   # For SQLite
   chmod 755 data/
   chmod 666 data/goat_farm.db
   chown www-data:www-data data/
   \`\`\`

#### Problem: Database Tables Don't Exist

**Solutions:**
\`\`\`bash
# Re-run database setup
mysql -u goat_user -p goat_farm < scripts/database_setup.sql

# Or manually create tables
mysql -u goat_user -p goat_farm
\`\`\`

### Barcode Scanner Issues

#### Problem: Barcode Scanner Not Working

**Symptoms:**
- Scanner input not detected
- No response when scanning
- Characters appearing in wrong order

**Diagnostic Steps:**
\`\`\`javascript
// Test scanner input detection
document.addEventListener('keypress', function(e) {
    console.log('Key pressed:', e.key, 'Code:', e.code);
});

// Check if scanner is in keyboard emulation mode
// Scanner should send characters followed by Enter key
\`\`\`

**Solutions:**
1. **Configure Scanner for Keyboard Emulation**
   - Most USB scanners need to be in "keyboard wedge" mode
   - Scan configuration barcodes from scanner manual
   - Ensure scanner sends Enter key after barcode

2. **Test Scanner in Text Editor**
   \`\`\`
   1. Open notepad or text editor
   2. Scan a barcode
   3. Should see barcode number followed by new line
   4. If not working, check scanner configuration
   \`\`\`

3. **Manual Entry Fallback**
   - Always provide manual entry option
   - Users can type barcode or ear tag
   - Implement auto-completion for known codes

#### Problem: Barcode Format Not Recognized

**Solutions:**
\`\`\`javascript
// Add custom barcode validation
function validateBarcodeFormat(barcode) {
    const formats = {
        ean13: /^\d{13}$/,
        ean8: /^\d{8}$/,
        code128: /^[\x00-\x7F]+$/,
        code39: /^[A-Z0-9\-.$/+%\s]+$/,
        ear_tag: /^[A-Z]{2}\d{3,6}$/i,
        custom: /^GT\d{3}$/ // Add your custom format
    };
    
    for (const [format, regex] of Object.entries(formats)) {
        if (regex.test(barcode)) {
            return { valid: true, format: format };
        }
    }
    
    return { valid: false, format: null };
}
\`\`\`

### PWA and Offline Issues

#### Problem: Service Worker Not Loading

**Symptoms:**
- PWA install prompt not showing
- Offline functionality not working
- Console errors about service worker

**Diagnostic Steps:**
\`\`\`javascript
// Check service worker registration
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log('Active service workers:', registrations.length);
    registrations.forEach(function(registration) {
        console.log('SW scope:', registration.scope);
        console.log('SW state:', registration.active.state);
    });
});

// Check if HTTPS is enabled (required for service workers)
console.log('Protocol:', window.location.protocol);
\`\`\`

**Solutions:**
1. **Ensure HTTPS is Enabled**
   \`\`\`apache
   # Force HTTPS in .htaccess
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   \`\`\`

2. **Fix Service Worker Path**
   \`\`\`javascript
   // Ensure correct service worker path
   if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('/sw.js', {
           scope: '/'
       }).then(function(registration) {
           console.log('SW registered:', registration);
       }).catch(function(error) {
           console.log('SW registration failed:', error);
       });
   }
   \`\`\`

3. **Clear Service Worker Cache**
   \`\`\`javascript
   // Clear all caches
   caches.keys().then(function(cacheNames) {
       return Promise.all(
           cacheNames.map(function(cacheName) {
               return caches.delete(cacheName);
           })
       );
   });
   \`\`\`

#### Problem: Offline Data Not Syncing

**Symptoms:**
- Data recorded offline doesn't appear after going online
- Sync button doesn't work
- Offline indicator stuck showing

**Diagnostic Steps:**
\`\`\`javascript
// Check offline data
console.log('Offline data:', localStorage.getItem('offline_data'));

// Check online status
console.log('Online:', navigator.onLine);

// Manual sync test
fetch('/api/sync.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({offline_data: []})
}).then(response => response.json())
.then(data => console.log('Sync result:', data));
\`\`\`

**Solutions:**
1. **Clear Corrupted Offline Data**
   \`\`\`javascript
   localStorage.removeItem('offline_data');
   
   // Clear IndexedDB
   indexedDB.deleteDatabase('GoatFarmDB');
   
   // Reload page
   window.location.reload();
   \`\`\`

2. **Manual Sync**
   \`\`\`javascript
   // Force sync
   document.getElementById('sync-btn').click();
   
   // Or call sync function directly
   handleSync();
   \`\`\`

3. **Check Network Connectivity**
   \`\`\`javascript
   // Test API connectivity
   fetch('/api/dashboard.php')
       .then(response => response.json())
       .then(data => console.log('API working:', data))
       .catch(error => console.log('API error:', error));
   \`\`\`

### Mobile and Responsive Issues

#### Problem: App Not Responsive on Mobile

**Symptoms:**
- Text too small on mobile
- Buttons hard to tap
- Layout broken on small screens

**Solutions:**
1. **Check Viewport Meta Tag**
   \`\`\`html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   \`\`\`

2. **Fix Touch Targets**
   \`\`\`css
   /* Ensure minimum touch target size */
   .btn {
       min-height: 44px;
       min-width: 44px;
       padding: 12px 16px;
   }
   
   /* Fix text scaling */
   html {
       -webkit-text-size-adjust: 100%;
   }
   \`\`\`

3. **Test Responsive Design**
   \`\`\`css
   /* Add responsive breakpoints */
   @media (max-width: 768px) {
       .container {
           padding: 1rem;
       }
       
       .btn {
           width: 100%;
           margin-bottom: 0.5rem;
       }
   }
   \`\`\`

#### Problem: PWA Not Installing on Mobile

**Android Chrome Solutions:**
1. **Check Manifest File**
   \`\`\`json
   {
       "name": "Goat Farm Manager",
       "short_name": "GoatFarm",
       "start_url": "/",
       "display": "standalone",
       "theme_color": "#2c5530",
       "background_color": "#ffffff",
       "icons": [
           {
               "src": "/icons/icon-192x192.png",
               "sizes": "192x192",
               "type": "image/png"
           },
           {
               "src": "/icons/icon-512x512.png",
               "sizes": "512x512",
               "type": "image/png"
           }
       ]
   }
   \`\`\`

2. **Verify HTTPS and Service Worker**
   - PWA requires HTTPS
   - Service worker must be registered
   - Manifest must be valid

**iOS Safari Solutions:**
\`\`\`html
<!-- Add iOS-specific meta tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Goat Farm">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
\`\`\`

### Performance Issues

#### Problem: Slow Page Loading

**Diagnostic Tools:**
\`\`\`javascript
// Measure page load time
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log('Page load time:', loadTime + 'ms');
});

// Check resource loading times
performance.getEntriesByType('resource').forEach(resource => {
    console.log(resource.name, resource.duration + 'ms');
});
\`\`\`

**Solutions:**
1. **Enable Compression**
   \`\`\`apache
   # Enable gzip compression in .htaccess
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/plain
       AddOutputFilterByType DEFLATE text/html
       AddOutputFilterByType DEFLATE text/css
       AddOutputFilterByType DEFLATE application/javascript
   </IfModule>
   \`\`\`

2. **Set Cache Headers**
   \`\`\`apache
   <IfModule mod_expires.c>
       ExpiresActive on
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
   </IfModule>
   \`\`\`

3. **Optimize Database Queries**
   \`\`\`sql
   -- Add missing indexes
   CREATE INDEX idx_attendance_date_goat ON attendance(attendance_date, goat_id);
   
   -- Optimize tables
   OPTIMIZE TABLE goats, attendance, medical_logs, breeding_records;
   \`\`\`

#### Problem: High Memory Usage

**PHP Memory Optimization:**
\`\`\`php
// Optimize PHP settings
ini_set('memory_limit', '256M');
ini_set('max_execution_time', 300);

// Use prepared statements and free memory
$stmt = $pdo->prepare("SELECT * FROM goats WHERE id = ?");
$stmt->execute([$id]);
$result = $stmt->fetch();
$stmt = null; // Free memory
\`\`\`

**JavaScript Memory Optimization:**
\`\`\`javascript
// Clear large objects when done
let largeDataArray = [];
// ... use array
largeDataArray = null; // Free memory

// Use event delegation instead of multiple listeners
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-scan')) {
        handleScan();
    }
});
\`\`\`

### Audio and Feedback Issues

#### Problem: No Sound Feedback

**Diagnostic Steps:**
\`\`\`javascript
// Check audio context support
function testAudio() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Audio context state:', audioContext.state);
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    } catch (error) {
        console.error('Audio not supported:', error);
    }
}
\`\`\`

**Solutions:**
1. **User Interaction Required**
   \`\`\`javascript
   // Audio requires user interaction first
   document.addEventListener('click', function() {
       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
       if (audioContext.state === 'suspended') {
           audioContext.resume();
       }
   }, { once: true });
   \`\`\`

2. **Alternative Audio Method**
   \`\`\`javascript
   // Use HTML5 audio as fallback
   function playAlternativeSound() {
       const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
       audio.play().catch(e => console.log('Audio play failed:', e));
   }
   \`\`\`

### Getting Additional Help

#### Information to Collect Before Seeking Help

1. **System Information**
   - Operating system and version
   - Web server (Apache/Nginx) and version
   - PHP version (`php -v`)
   - Database type and version
   - Browser and version

2. **Error Details**
   - Exact error message
   - Steps to reproduce the issue
   - When the issue started occurring
   - Any recent changes made

3. **Log Files**
   \`\`\`bash
   # Common log file locations
   /var/log/apache2/error.log          # Apache errors
   /var/log/nginx/error.log            # Nginx errors
   /var/log/php/error.log              # PHP errors
   /var/log/mysql/error.log            # MySQL errors
   \`\`\`

#### Debug Mode

Enable debug mode for more detailed error information:

\`\`\`php
// Add to config/database.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Enable query logging
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/error.log');
\`\`\`

\`\`\`javascript
// Enable JavaScript debugging
localStorage.setItem('debug', 'true');

// Log all AJAX requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('Fetch request:', args);
    return originalFetch.apply(this, args)
        .then(response => {
            console.log('Fetch response:', response);
            return response;
        });
};
\`\`\`

#### Creating a Support Request

Include this information in your support request:

\`\`\`
**Issue Description:**
Brief description of the problem

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**System Information:**
- OS: Ubuntu 20.04
- Web Server: Apache 2.4.41
- PHP: 7.4.3
- Database: MySQL 8.0.25
- Browser: Chrome 96.0.4664.110

**Error Messages:**
[Paste any error messages here]

**Additional Context:**
Any other relevant information
\`\`\`

This troubleshooting guide covers the most common issues you might encounter. For issues not covered here, check the system logs and use the debugging tools provided to gather more information about the problem.

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Submit pull request with detailed description

### Code Standards
- Follow PSR-4 autoloading standards for PHP
- Use meaningful variable and function names
- Comment complex logic
- Test on multiple browsers and devices

### Security Guidelines
- Never commit passwords or API keys
- Validate all user inputs
- Use prepared statements for database queries
- Implement proper authentication
