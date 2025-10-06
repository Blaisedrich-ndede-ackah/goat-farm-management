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
            if (isset($_GET['barcode'])) {
                // Search by barcode
                $query = "SELECT * FROM goats WHERE barcode = ? AND status = 'active'";
                $stmt = $db->prepare($query);
                $stmt->execute([$_GET['barcode']]);
                $goat = $stmt->fetch();
                
                if ($goat) {
                    echo json_encode(['success' => true, 'goat' => $goat]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Goat not found']);
                }
            } else {
                // Get all goats
                $query = "SELECT * FROM goats WHERE status = 'active' ORDER BY ear_tag";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $goats = $stmt->fetchAll();
                
                echo json_encode(['success' => true, 'goats' => $goats]);
            }
            break;
            
        case 'POST':
            requireAdmin();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $query = "INSERT INTO goats (ear_tag, barcode, name, breed, gender, birth_date, weight, color, created_by) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([
                $input['ear_tag'],
                $input['barcode'],
                $input['name'],
                $input['breed'],
                $input['gender'],
                $input['birth_date'],
                $input['weight'],
                $input['color'],
                getCurrentUserId()
            ]);
            
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
            break;
            
        case 'PUT':
            requireAdmin();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $query = "UPDATE goats SET ear_tag = ?, barcode = ?, name = ?, breed = ?, gender = ?, 
                      birth_date = ?, weight = ?, color = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([
                $input['ear_tag'],
                $input['barcode'],
                $input['name'],
                $input['breed'],
                $input['gender'],
                $input['birth_date'],
                $input['weight'],
                $input['color'],
                $input['id']
            ]);
            
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            requireAdmin();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $query = "UPDATE goats SET status = 'deceased' WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$input['id']]);
            
            echo json_encode(['success' => true]);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
