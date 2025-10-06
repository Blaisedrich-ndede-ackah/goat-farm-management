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
            $goat_id = $_GET['goat_id'] ?? null;
            
            if ($goat_id) {
                $query = "SELECT m.*, g.ear_tag, g.name as goat_name, u.full_name as user_name 
                          FROM medical_logs m 
                          JOIN goats g ON m.goat_id = g.id 
                          JOIN users u ON m.user_id = u.id 
                          WHERE m.goat_id = ? 
                          ORDER BY m.treatment_date DESC";
                $stmt = $db->prepare($query);
                $stmt->execute([$goat_id]);
            } else {
                $query = "SELECT m.*, g.ear_tag, g.name as goat_name, u.full_name as user_name 
                          FROM medical_logs m 
                          JOIN goats g ON m.goat_id = g.id 
                          JOIN users u ON m.user_id = u.id 
                          ORDER BY m.treatment_date DESC LIMIT 50";
                $stmt = $db->prepare($query);
                $stmt->execute();
            }
            
            $medical_logs = $stmt->fetchAll();
            echo json_encode(['success' => true, 'medical_logs' => $medical_logs]);
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $query = "INSERT INTO medical_logs (goat_id, user_id, complaint, treatment, medication, dosage, treatment_date, recovery_status, notes) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([
                $input['goat_id'],
                getCurrentUserId(),
                $input['complaint'],
                $input['treatment'] ?? '',
                $input['medication'] ?? '',
                $input['dosage'] ?? '',
                $input['treatment_date'],
                $input['recovery_status'] ?? 'ongoing',
                $input['notes'] ?? ''
            ]);
            
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $query = "UPDATE medical_logs SET complaint = ?, treatment = ?, medication = ?, dosage = ?, 
                      recovery_status = ?, notes = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([
                $input['complaint'],
                $input['treatment'],
                $input['medication'],
                $input['dosage'],
                $input['recovery_status'],
                $input['notes'],
                $input['id']
            ]);
            
            echo json_encode(['success' => true]);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
