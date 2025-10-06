<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/auth.php';

requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
$database = new Database();
$db = $database->getConnection();

try {
    switch ($method) {
        case 'GET':
            $date = $_GET['date'] ?? date('Y-m-d');
            $query = "SELECT a.*, g.ear_tag, g.name as goat_name, u.full_name as user_name 
                      FROM attendance a 
                      JOIN goats g ON a.goat_id = g.id 
                      JOIN users u ON a.user_id = u.id 
                      WHERE a.attendance_date = ? 
                      ORDER BY a.timestamp DESC";
            $stmt = $db->prepare($query);
            $stmt->execute([$date]);
            $attendance = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'attendance' => $attendance]);
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Check if attendance already exists for today
            $query = "SELECT id FROM attendance WHERE goat_id = ? AND attendance_date = CURRENT_DATE";
            $stmt = $db->prepare($query);
            $stmt->execute([$input['goat_id']]);
            
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Attendance already recorded for today']);
                break;
            }
            
            // Insert new attendance record
            $query = "INSERT INTO attendance (goat_id, user_id, attendance_date, notes, sync_status) 
                      VALUES (?, ?, CURRENT_DATE, ?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([
                $input['goat_id'],
                getCurrentUserId(),
                $input['notes'] ?? '',
                $input['sync_status'] ?? 'synced'
            ]);
            
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
