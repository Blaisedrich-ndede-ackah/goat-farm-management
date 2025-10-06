<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/auth.php';

requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
$database = new Database();
$db = $database->getConnection();

try {
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $offline_data = $input['offline_data'] ?? [];
        
        $synced_count = 0;
        
        foreach ($offline_data as $record) {
            if ($record['type'] === 'attendance') {
                // Check if already exists
                $query = "SELECT id FROM attendance WHERE goat_id = ? AND attendance_date = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$record['goat_id'], $record['attendance_date']]);
                
                if (!$stmt->fetch()) {
                    $query = "INSERT INTO attendance (goat_id, user_id, attendance_date, notes, timestamp) 
                              VALUES (?, ?, ?, ?, ?)";
                    $stmt = $db->prepare($query);
                    $stmt->execute([
                        $record['goat_id'],
                        getCurrentUserId(),
                        $record['attendance_date'],
                        $record['notes'] ?? '',
                        $record['timestamp']
                    ]);
                    $synced_count++;
                }
            }
        }
        
        echo json_encode([
            'success' => true, 
            'synced_count' => $synced_count,
            'message' => "$synced_count records synced successfully"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Sync error: ' . $e->getMessage()]);
}
?>
