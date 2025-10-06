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
            $query = "SELECT b.*, 
                      buck.ear_tag as buck_ear_tag, buck.name as buck_name,
                      doe.ear_tag as doe_ear_tag, doe.name as doe_name,
                      u.full_name as created_by_name
                      FROM breeding_records b 
                      JOIN goats buck ON b.buck_id = buck.id 
                      JOIN goats doe ON b.doe_id = doe.id 
                      JOIN users u ON b.created_by = u.id 
                      ORDER BY b.breeding_date DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $breeding_records = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'breeding_records' => $breeding_records]);
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $query = "INSERT INTO breeding_records (buck_id, doe_id, breeding_date, pregnancy_status, due_date, notes, created_by) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([
                $input['buck_id'],
                $input['doe_id'],
                $input['breeding_date'],
                $input['pregnancy_status'] ?? 'suspected',
                $input['due_date'] ?? null,
                $input['notes'] ?? '',
                getCurrentUserId()
            ]);
            
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $query = "UPDATE breeding_records SET pregnancy_status = ?, due_date = ?, birth_date = ?, 
                      kids_born = ?, kids_survived = ?, notes = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([
                $input['pregnancy_status'],
                $input['due_date'],
                $input['birth_date'],
                $input['kids_born'],
                $input['kids_survived'],
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
