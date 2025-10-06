<?php
/**
 * Goat Farm Management System - Troubleshooting Tool
 * 
 * This script checks if all components are properly installed and configured.
 * Run this file in your browser after installation to verify everything is working.
 * 
 * Usage: http://yoursite.com/troubleshoot.php
 */

// Start output buffering to capture any errors
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Security check - remove this file in production
if (file_exists('.production')) {
    die('Troubleshooting disabled in production mode. Delete .production file to enable.');
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐐 Goat Farm Management - System Troubleshoot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c5530 0%, #1e3a21 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .test-section {
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .test-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            font-weight: 600;
            font-size: 1.1rem;
            color: #2c5530;
        }
        
        .test-content {
            padding: 20px;
        }
        
        .test-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .test-item:last-child {
            border-bottom: none;
        }
        
        .test-name {
            font-weight: 500;
            flex: 1;
        }
        
        .test-result {
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
            min-width: 80px;
            text-align: center;
        }
        
        .status-pass {
            background: #d4edda;
            color: #155724;
        }
        
        .status-fail {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .status-info {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .details {
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
            font-size: 0.9rem;
            color: #666;
        }
        
        .error-details {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .code-block {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            margin: 10px 0;
            overflow-x: auto;
        }
        
        .summary {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-top: 30px;
        }
        
        .summary.warning {
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
        }
        
        .summary.error {
            background: linear-gradient(135deg, #dc3545 0%, #e83e8c 100%);
        }
        
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #2c5530;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 10px 5px;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #1e3a21;
        }
        
        .btn-secondary {
            background: #6c757d;
        }
        
        .btn-secondary:hover {
            background: #545b62;
        }
        
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 20px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 10px;
            }
            
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 20px;
            }
            
            .test-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐐 System Troubleshoot</h1>
            <p>Comprehensive system check for Goat Farm Management System</p>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
            </div>
        </div>
        
        <div class="content">
            <?php
            
            // Initialize test results
            $tests = [];
            $totalTests = 0;
            $passedTests = 0;
            $failedTests = 0;
            $warningTests = 0;
            
            // Helper function to add test result
            function addTest($category, $name, $status, $details = '', $solution = '') {
                global $tests, $totalTests, $passedTests, $failedTests, $warningTests;
                
                $tests[$category][] = [
                    'name' => $name,
                    'status' => $status,
                    'details' => $details,
                    'solution' => $solution
                ];
                
                $totalTests++;
                switch ($status) {
                    case 'pass': $passedTests++; break;
                    case 'fail': $failedTests++; break;
                    case 'warning': $warningTests++; break;
                }
            }
            
            // Test 1: PHP Environment
            echo "<div class='test-section'>";
            echo "<div class='test-header'>🔧 PHP Environment</div>";
            echo "<div class='test-content'>";
            
            // PHP Version
            $phpVersion = phpversion();
            $minPhpVersion = '7.4.0';
            if (version_compare($phpVersion, $minPhpVersion, '>=')) {
                addTest('php', 'PHP Version', 'pass', "Current: $phpVersion (Required: $minPhpVersion+)");
            } else {
                addTest('php', 'PHP Version', 'fail', "Current: $phpVersion (Required: $minPhpVersion+)", 
                    "Upgrade PHP to version $minPhpVersion or higher");
            }
            
            // Required Extensions
            $requiredExtensions = ['pdo', 'json', 'session', 'hash'];
            foreach ($requiredExtensions as $ext) {
                if (extension_loaded($ext)) {
                    addTest('php', "PHP Extension: $ext", 'pass', 'Loaded');
                } else {
                    addTest('php', "PHP Extension: $ext", 'fail', 'Not loaded', 
                        "Install PHP extension: sudo apt-get install php-$ext");
                }
            }
            
            // Optional Extensions
            $optionalExtensions = ['pdo_mysql', 'pdo_sqlite', 'gd', 'curl'];
            foreach ($optionalExtensions as $ext) {
                if (extension_loaded($ext)) {
                    addTest('php', "PHP Extension: $ext (optional)", 'pass', 'Loaded');
                } else {
                    addTest('php', "PHP Extension: $ext (optional)", 'warning', 'Not loaded', 
                        "Install for enhanced functionality: sudo apt-get install php-$ext");
                }
            }
            
            // Memory Limit
            $memoryLimit = ini_get('memory_limit');
            $memoryBytes = return_bytes($memoryLimit);
            if ($memoryBytes >= return_bytes('128M')) {
                addTest('php', 'Memory Limit', 'pass', "Current: $memoryLimit");
            } else {
                addTest('php', 'Memory Limit', 'warning', "Current: $memoryLimit (Recommended: 128M+)", 
                    "Increase memory_limit in php.ini");
            }
            
            // Max Execution Time
            $maxExecTime = ini_get('max_execution_time');
            if ($maxExecTime >= 30 || $maxExecTime == 0) {
                addTest('php', 'Max Execution Time', 'pass', "Current: " . ($maxExecTime == 0 ? 'Unlimited' : $maxExecTime . 's'));
            } else {
                addTest('php', 'Max Execution Time', 'warning', "Current: {$maxExecTime}s (Recommended: 30s+)", 
                    "Increase max_execution_time in php.ini");
            }
            
            echo "</div></div>";
            
            // Test 2: File System
            echo "<div class='test-section'>";
            echo "<div class='test-header'>📁 File System</div>";
            echo "<div class='test-content'>";
            
            // Required Files
            $requiredFiles = [
                'index.html' => 'Main application file',
                'config/database.php' => 'Database configuration',
                'config/auth.php' => 'Authentication configuration',
                'api/login.php' => 'Login API endpoint',
                'api/dashboard.php' => 'Dashboard API endpoint',
                'api/goats.php' => 'Goats API endpoint',
                'api/attendance.php' => 'Attendance API endpoint',
                'api/medical.php' => 'Medical API endpoint',
                'api/breeding.php' => 'Breeding API endpoint',
                'api/sync.php' => 'Sync API endpoint',
                'api/export.php' => 'Export API endpoint',
                'css/styles.css' => 'Main stylesheet',
                'js/app.js' => 'Main JavaScript file',
                'js/offline.js' => 'Offline functionality',
                'js/barcode.js' => 'Barcode scanning',
                'sw.js' => 'Service Worker',
                'manifest.json' => 'PWA Manifest',
                'scripts/database_setup.sql' => 'Database setup script'
            ];
            
            foreach ($requiredFiles as $file => $description) {
                if (file_exists($file)) {
                    $size = filesize($file);
                    addTest('files', $description, 'pass', "File exists ($file) - Size: " . formatBytes($size));
                } else {
                    addTest('files', $description, 'fail', "File missing: $file", 
                        "Ensure all files are uploaded correctly");
                }
            }
            
            // Directory Permissions
            $directories = [
                'data' => 'Data directory (for SQLite)',
                'config' => 'Configuration directory',
                'api' => 'API directory',
                'css' => 'CSS directory',
                'js' => 'JavaScript directory'
            ];
            
            foreach ($directories as $dir => $description) {
                if (is_dir($dir)) {
                    if (is_readable($dir)) {
                        $writable = is_writable($dir) ? 'writable' : 'read-only';
                        addTest('files', "$description permissions", 'pass', "Directory exists and is readable ($writable)");
                    } else {
                        addTest('files', "$description permissions", 'fail', "Directory exists but not readable", 
                            "Fix permissions: chmod 755 $dir");
                    }
                } else {
                    if ($dir === 'data') {
                        addTest('files', $description, 'warning', "Directory doesn't exist (will be created for SQLite)", 
                            "Create directory: mkdir $dir && chmod 755 $dir");
                    } else {
                        addTest('files', $description, 'fail', "Directory missing: $dir", 
                            "Create directory and upload files");
                    }
                }
            }
            
            echo "</div></div>";
            
            // Test 3: Database Connectivity
            echo "<div class='test-section'>";
            echo "<div class='test-header'>🗄️ Database Connectivity</div>";
            echo "<div class='test-content'>";
            
            // Test database configuration file
            if (file_exists('config/database.php')) {
                try {
                    require_once 'config/database.php';
                    
                    if (class_exists('Database')) {
                        addTest('database', 'Database class', 'pass', 'Database class found');
                        
                        // Test database connection
                        try {
                            $database = new Database();
                            $db = $database->getConnection();
                            
                            if ($db) {
                                addTest('database', 'Database connection', 'pass', 'Successfully connected to database');
                                
                                // Test database tables
                                $requiredTables = ['users', 'goats', 'attendance', 'medical_logs', 'breeding_records', 'notifications'];
                                
                                foreach ($requiredTables as $table) {
                                    try {
                                        $stmt = $db->prepare("SELECT COUNT(*) FROM $table");
                                        $stmt->execute();
                                        $count = $stmt->fetchColumn();
                                        addTest('database', "Table: $table", 'pass', "Table exists with $count records");
                                    } catch (Exception $e) {
                                        addTest('database', "Table: $table", 'fail', "Table missing or inaccessible: " . $e->getMessage(), 
                                            "Run database setup: mysql -u username -p database < scripts/database_setup.sql");
                                    }
                                }
                                
                                // Test sample data
                                try {
                                    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE username = 'admin'");
                                    $stmt->execute();
                                    $adminExists = $stmt->fetchColumn() > 0;
                                    
                                    if ($adminExists) {
                                        addTest('database', 'Sample data', 'pass', 'Admin user exists');
                                    } else {
                                        addTest('database', 'Sample data', 'warning', 'Admin user not found', 
                                            'Run database setup script to create sample data');
                                    }
                                } catch (Exception $e) {
                                    addTest('database', 'Sample data', 'fail', 'Error checking sample data: ' . $e->getMessage());
                                }
                                
                            } else {
                                addTest('database', 'Database connection', 'fail', 'Failed to connect to database', 
                                    'Check database credentials in config/database.php');
                            }
                            
                        } catch (Exception $e) {
                            addTest('database', 'Database connection', 'fail', 'Connection error: ' . $e->getMessage(), 
                                'Check database server is running and credentials are correct');
                        }
                        
                    } else {
                        addTest('database', 'Database class', 'fail', 'Database class not found in config/database.php', 
                            'Ensure config/database.php contains the Database class');
                    }
                    
                } catch (Exception $e) {
                    addTest('database', 'Database configuration', 'fail', 'Error loading config: ' . $e->getMessage(), 
                        'Check config/database.php for syntax errors');
                }
            } else {
                addTest('database', 'Database configuration', 'fail', 'config/database.php not found', 
                    'Upload the database configuration file');
            }
            
            echo "</div></div>";
            
            // Test 4: API Endpoints
            echo "<div class='test-section'>";
            echo "<div class='test-header'>🔌 API Endpoints</div>";
            echo "<div class='test-content'>";
            
            $apiEndpoints = [
                'api/login.php' => 'Authentication endpoint',
                'api/dashboard.php' => 'Dashboard data endpoint',
                'api/goats.php' => 'Goat management endpoint',
                'api/attendance.php' => 'Attendance tracking endpoint',
                'api/medical.php' => 'Medical records endpoint',
                'api/breeding.php' => 'Breeding records endpoint',
                'api/sync.php' => 'Offline sync endpoint',
                'api/export.php' => 'Data export endpoint'
            ];
            
            foreach ($apiEndpoints as $endpoint => $description) {
                if (file_exists($endpoint)) {
                    // Test if file is accessible
                    $content = file_get_contents($endpoint);
                    if (strpos($content, '<?php') !== false) {
                        addTest('api', $description, 'pass', "File exists and contains PHP code");
                    } else {
                        addTest('api', $description, 'warning', "File exists but may not be valid PHP", 
                            "Check file content and syntax");
                    }
                } else {
                    addTest('api', $description, 'fail', "File missing: $endpoint", 
                        "Upload the API endpoint file");
                }
            }
            
            echo "</div></div>";
            
            // Test 5: Web Server Configuration
            echo "<div class='test-section'>";
            echo "<div class='test-header'>🌐 Web Server Configuration</div>";
            echo "<div class='test-content'>";
            
            // Check if running on HTTPS
            $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;
            if ($isHttps) {
                addTest('server', 'HTTPS', 'pass', 'Site is running on HTTPS (required for PWA)');
            } else {
                addTest('server', 'HTTPS', 'warning', 'Site is running on HTTP', 
                    'Enable HTTPS for full PWA functionality and security');
            }
            
            // Check server software
            $serverSoftware = $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown';
            addTest('server', 'Web Server', 'info', "Server: $serverSoftware");
            
            // Check if mod_rewrite is available (for Apache)
            if (function_exists('apache_get_modules')) {
                $modules = apache_get_modules();
                if (in_array('mod_rewrite', $modules)) {
                    addTest('server', 'URL Rewriting', 'pass', 'mod_rewrite is enabled');
                } else {
                    addTest('server', 'URL Rewriting', 'warning', 'mod_rewrite not detected', 
                        'Enable mod_rewrite for clean URLs');
                }
            } else {
                addTest('server', 'URL Rewriting', 'info', 'Cannot detect mod_rewrite status');
            }
            
            // Check .htaccess file
            if (file_exists('.htaccess')) {
                $htaccessContent = file_get_contents('.htaccess');
                if (strpos($htaccessContent, 'RewriteEngine') !== false) {
                    addTest('server', '.htaccess Configuration', 'pass', '.htaccess file exists with rewrite rules');
                } else {
                    addTest('server', '.htaccess Configuration', 'warning', '.htaccess exists but no rewrite rules found');
                }
            } else {
                addTest('server', '.htaccess Configuration', 'warning', '.htaccess file not found', 
                    'Create .htaccess file for better URL handling and security');
            }
            
            echo "</div></div>";
            
            // Test 6: PWA Components
            echo "<div class='test-section'>";
            echo "<div class='test-header'>📱 PWA Components</div>";
            echo "<div class='test-content'>";
            
            // Check manifest.json
            if (file_exists('manifest.json')) {
                $manifestContent = file_get_contents('manifest.json');
                $manifest = json_decode($manifestContent, true);
                
                if ($manifest) {
                    $requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
                    $missingFields = [];
                    
                    foreach ($requiredFields as $field) {
                        if (!isset($manifest[$field])) {
                            $missingFields[] = $field;
                        }
                    }
                    
                    if (empty($missingFields)) {
                        addTest('pwa', 'PWA Manifest', 'pass', 'manifest.json is valid with all required fields');
                    } else {
                        addTest('pwa', 'PWA Manifest', 'warning', 'manifest.json missing fields: ' . implode(', ', $missingFields));
                    }
                } else {
                    addTest('pwa', 'PWA Manifest', 'fail', 'manifest.json contains invalid JSON', 
                        'Fix JSON syntax in manifest.json');
                }
            } else {
                addTest('pwa', 'PWA Manifest', 'fail', 'manifest.json not found', 
                    'Create manifest.json for PWA functionality');
            }
            
            // Check Service Worker
            if (file_exists('sw.js')) {
                $swContent = file_get_contents('sw.js');
                if (strpos($swContent, 'addEventListener') !== false) {
                    addTest('pwa', 'Service Worker', 'pass', 'sw.js exists and contains event listeners');
                } else {
                    addTest('pwa', 'Service Worker', 'warning', 'sw.js exists but may not be functional');
                }
            } else {
                addTest('pwa', 'Service Worker', 'fail', 'sw.js not found', 
                    'Create service worker for offline functionality');
            }
            
            // Check PWA icons
            $iconSizes = ['192x192', '512x512'];
            foreach ($iconSizes as $size) {
                $iconPath = "icons/icon-$size.png";
                if (file_exists($iconPath)) {
                    addTest('pwa', "PWA Icon ($size)", 'pass', "Icon exists: $iconPath");
                } else {
                    addTest('pwa', "PWA Icon ($size)", 'warning', "Icon missing: $iconPath", 
                        "Create PWA icon in $iconPath");
                }
            }
            
            echo "</div></div>";
            
            // Test 7: Security Configuration
            echo "<div class='test-section'>";
            echo "<div class='test-header'>🔒 Security Configuration</div>";
            echo "<div class='test-content'>";
            
            // Check if session is configured
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (session_status() === PHP_SESSION_ACTIVE) {
                addTest('security', 'PHP Sessions', 'pass', 'Sessions are working');
            } else {
                addTest('security', 'PHP Sessions', 'fail', 'Sessions not working', 
                    'Check PHP session configuration');
            }
            
            // Check session security settings
            $sessionSecure = ini_get('session.cookie_secure');
            $sessionHttpOnly = ini_get('session.cookie_httponly');
            
            if ($sessionHttpOnly) {
                addTest('security', 'Session HttpOnly', 'pass', 'Session cookies are HttpOnly');
            } else {
                addTest('security', 'Session HttpOnly', 'warning', 'Session cookies not HttpOnly', 
                    'Set session.cookie_httponly = 1 in php.ini');
            }
            
            // Check file permissions
            $configFile = 'config/database.php';
            if (file_exists($configFile)) {
                $perms = fileperms($configFile);
                $octal = substr(sprintf('%o', $perms), -4);
                
                if ($octal <= '0644') {
                    addTest('security', 'Config File Permissions', 'pass', "Permissions: $octal (secure)");
                } else {
                    addTest('security', 'Config File Permissions', 'warning', "Permissions: $octal (too permissive)", 
                        "Set secure permissions: chmod 644 $configFile");
                }
            }
            
            // Check for exposed sensitive files
            $sensitiveFiles = ['.env', 'config.php', 'database.sql', '.git', '.svn'];
            foreach ($sensitiveFiles as $file) {
                if (file_exists($file)) {
                    addTest('security', "Sensitive File: $file", 'warning', "File/directory exists and may be accessible", 
                        "Remove or protect sensitive files from web access");
                } else {
                    addTest('security', "Sensitive File: $file", 'pass', "File not found (good)");
                }
            }
            
            echo "</div></div>";
            
            // Display all test results
            foreach ($tests as $category => $categoryTests) {
                foreach ($categoryTests as $test) {
                    echo "<div class='test-item'>";
                    echo "<div class='test-name'>" . htmlspecialchars($test['name']) . "</div>";
                    echo "<div class='test-result status-" . $test['status'] . "'>";
                    
                    switch ($test['status']) {
                        case 'pass': echo '✅ PASS'; break;
                        case 'fail': echo '❌ FAIL'; break;
                        case 'warning': echo '⚠️ WARNING'; break;
                        case 'info': echo 'ℹ️ INFO'; break;
                    }
                    
                    echo "</div>";
                    echo "</div>";
                    
                    if ($test['details']) {
                        $detailClass = $test['status'] === 'fail' ? 'error-details' : 'details';
                        echo "<div class='$detailClass'>";
                        echo "<strong>Details:</strong> " . htmlspecialchars($test['details']);
                        if ($test['solution']) {
                            echo "<br><strong>Solution:</strong> " . htmlspecialchars($test['solution']);
                        }
                        echo "</div>";
                    }
                }
            }
            
            // Calculate overall status
            $overallStatus = 'success';
            $statusMessage = 'All systems operational! 🎉';
            
            if ($failedTests > 0) {
                $overallStatus = 'error';
                $statusMessage = "System has critical issues that need attention. ($failedTests failed tests)";
            } elseif ($warningTests > 0) {
                $overallStatus = 'warning';
                $statusMessage = "System is functional but has some recommendations. ($warningTests warnings)";
            }
            
            // Helper functions
            function return_bytes($val) {
                $val = trim($val);
                $last = strtolower($val[strlen($val)-1]);
                $val = (int)$val;
                switch($last) {
                    case 'g': $val *= 1024;
                    case 'm': $val *= 1024;
                    case 'k': $val *= 1024;
                }
                return $val;
            }
            
            function formatBytes($size, $precision = 2) {
                $base = log($size, 1024);
                $suffixes = array('B', 'KB', 'MB', 'GB', 'TB');
                return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
            }
            
            ?>
            
            <!-- Summary Section -->
            <div class="summary <?php echo $overallStatus; ?>">
                <h2>📊 System Status Summary</h2>
                <p><?php echo $statusMessage; ?></p>
                
                <div style="margin: 20px 0; font-size: 1.1rem;">
                    <strong>Test Results:</strong><br>
                    ✅ Passed: <?php echo $passedTests; ?> | 
                    ❌ Failed: <?php echo $failedTests; ?> | 
                    ⚠️ Warnings: <?php echo $warningTests; ?> | 
                    📊 Total: <?php echo $totalTests; ?>
                </div>
                
                <?php if ($failedTests === 0): ?>
                    <a href="index.html" class="btn">🚀 Launch Application</a>
                <?php endif; ?>
                
                <a href="?refresh=1" class="btn btn-secondary">🔄 Run Tests Again</a>
                
                <?php if ($failedTests > 0 || $warningTests > 0): ?>
                    <div style="margin-top: 20px; text-align: left;">
                        <h3>🛠️ Quick Fixes</h3>
                        
                        <?php if ($failedTests > 0): ?>
                            <div class="code-block">
                                <strong>Critical Issues Found:</strong><br>
                                • Check database connection and credentials<br>
                                • Ensure all required files are uploaded<br>
                                • Verify PHP extensions are installed<br>
                                • Run database setup script if tables are missing
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($warningTests > 0): ?>
                            <div class="code-block">
                                <strong>Recommended Improvements:</strong><br>
                                • Enable HTTPS for better security and PWA support<br>
                                • Create .htaccess file for URL rewriting<br>
                                • Set proper file permissions<br>
                                • Install optional PHP extensions for enhanced features
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
            
            <!-- System Information -->
            <div class="test-section">
                <div class="test-header">ℹ️ System Information</div>
                <div class="test-content">
                    <div class="code-block">
                        <strong>Server Information:</strong><br>
                        PHP Version: <?php echo phpversion(); ?><br>
                        Server Software: <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?><br>
                        Document Root: <?php echo $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'; ?><br>
                        Current Directory: <?php echo getcwd(); ?><br>
                        Server Time: <?php echo date('Y-m-d H:i:s T'); ?><br>
                        Memory Limit: <?php echo ini_get('memory_limit'); ?><br>
                        Max Execution Time: <?php echo ini_get('max_execution_time'); ?>s<br>
                        Upload Max Filesize: <?php echo ini_get('upload_max_filesize'); ?><br>
                        Post Max Size: <?php echo ini_get('post_max_size'); ?><br>
                        
                        <br><strong>Loaded PHP Extensions:</strong><br>
                        <?php echo implode(', ', get_loaded_extensions()); ?>
                    </div>
                </div>
            </div>
            
            <!-- Troubleshooting Tips -->
            <div class="test-section">
                <div class="test-header">💡 Troubleshooting Tips</div>
                <div class="test-content">
                    <h4>Common Issues and Solutions:</h4>
                    
                    <div class="code-block">
                        <strong>1. Database Connection Failed:</strong><br>
                        • Check MySQL/MariaDB service: <code>systemctl status mysql</code><br>
                        • Verify credentials in config/database.php<br>
                        • Test connection: <code>mysql -u username -p</code><br>
                        • For SQLite: ensure data/ directory is writable
                    </div>
                    
                    <div class="code-block">
                        <strong>2. File Permission Issues:</strong><br>
                        • Set directory permissions: <code>chmod 755 directory_name</code><br>
                        • Set file permissions: <code>chmod 644 file_name</code><br>
                        • For data directory: <code>chmod 755 data && chown www-data:www-data data</code>
                    </div>
                    
                    <div class="code-block">
                        <strong>3. PHP Extension Missing:</strong><br>
                        • Ubuntu/Debian: <code>sudo apt-get install php-extension-name</code><br>
                        • CentOS/RHEL: <code>sudo yum install php-extension-name</code><br>
                        • Restart web server after installation
                    </div>
                    
                    <div class="code-block">
                        <strong>4. Service Worker Not Loading:</strong><br>
                        • Ensure HTTPS is enabled<br>
                        • Check browser console for errors<br>
                        • Clear browser cache and reload<br>
                        • Verify sw.js is accessible
                    </div>
                    
                    <div class="code-block">
                        <strong>5. API Endpoints Not Working:</strong><br>
                        • Check .htaccess file exists and is configured<br>
                        • Verify mod_rewrite is enabled<br>
                        • Test direct file access: yoursite.com/api/login.php<br>
                        • Check PHP error logs
                    </div>
                </div>
            </div>
            
            <!-- Security Notice -->
            <div class="test-section">
                <div class="test-header">🔐 Security Notice</div>
                <div class="test-content">
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; color: #856404;">
                        <strong>⚠️ Important Security Reminder:</strong><br><br>
                        
                        1. <strong>Remove this troubleshoot.php file</strong> after completing setup<br>
                        2. <strong>Change default passwords</strong> for admin and demo accounts<br>
                        3. <strong>Enable HTTPS</strong> for production use<br>
                        4. <strong>Set proper file permissions</strong> (644 for files, 755 for directories)<br>
                        5. <strong>Keep PHP and database software updated</strong><br>
                        6. <strong>Regular backups</strong> of database and files<br><br>
                        
                        <strong>To disable this troubleshoot tool in production:</strong><br>
                        Create a file named <code>.production</code> in the root directory:<br>
                        <code>touch .production</code>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    
    <script>
        // Animate progress bar
        document.addEventListener('DOMContentLoaded', function() {
            const totalTests = <?php echo $totalTests; ?>;
            const passedTests = <?php echo $passedTests; ?>;
            const percentage = Math.round((passedTests / totalTests) * 100);
            
            setTimeout(function() {
                document.getElementById('progress-fill').style.width = percentage + '%';
            }, 500);
        });
        
        // Auto-refresh functionality
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('refresh')) {
            // Remove refresh parameter from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    </script>
</body>
</html>
