<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/auth.php';

requireLogin();

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get dashboard statistics
    $stats = [];
    
    // Total goats
    $query = "SELECT COUNT(*) as total FROM goats WHERE status = 'active'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['total_goats'] = $stmt->fetch()['total'];
    
    // Today's attendance
    $query = "SELECT COUNT(*) as total FROM attendance WHERE attendance_date = CURRENT_DATE";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['todays_attendance'] = $stmt->fetch()['total'];
    
    // Pending medical cases
    $query = "SELECT COUNT(*) as total FROM medical_logs WHERE recovery_status = 'ongoing'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['pending_medical'] = $stmt->fetch()['total'];
    
    // Upcoming births (next 30 days)
    $query = "SELECT COUNT(*) as total FROM breeding_records WHERE due_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY) AND birth_date IS NULL";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['upcoming_births'] = $stmt->fetch()['total'];
    
    // Recent notifications
    $query = "SELECT * FROM notifications WHERE is_read = 0 ORDER BY created_at DESC LIMIT 5";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $notifications = $stmt->fetchAll();
    
    // Recent attendance (last 7 days)
    $query = "SELECT a.*, g.ear_tag, g.name as goat_name, u.full_name as user_name 
              FROM attendance a 
              JOIN goats g ON a.goat_id = g.id 
              JOIN users u ON a.user_id = u.id 
              WHERE a.attendance_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
              ORDER BY a.timestamp DESC LIMIT 10";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $recent_attendance = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'notifications' => $notifications,
        'recent_attendance' => $recent_attendance,
        'user_role' => getCurrentUserRole()
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
