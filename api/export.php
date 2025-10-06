<?php
require_once '../config/database.php';
require_once '../config/auth.php';

requireAdmin();

$type = $_GET['type'] ?? 'attendance';
$database = new Database();
$db = $database->getConnection();

try {
    switch ($type) {
        case 'attendance':
            $query = "SELECT a.attendance_date, g.ear_tag, g.name as goat_name, 
                      u.full_name as recorded_by, a.notes, a.timestamp
                      FROM attendance a 
                      JOIN goats g ON a.goat_id = g.id 
                      JOIN users u ON a.user_id = u.id 
                      ORDER BY a.attendance_date DESC, g.ear_tag";
            $filename = 'attendance_export_' . date('Y-m-d') . '.csv';
            break;
            
        case 'medical':
            $query = "SELECT m.treatment_date, g.ear_tag, g.name as goat_name, 
                      m.complaint, m.treatment, m.medication, m.dosage, 
                      m.recovery_status, u.full_name as recorded_by
                      FROM medical_logs m 
                      JOIN goats g ON m.goat_id = g.id 
                      JOIN users u ON m.user_id = u.id 
                      ORDER BY m.treatment_date DESC";
            $filename = 'medical_export_' . date('Y-m-d') . '.csv';
            break;
            
        case 'breeding':
            $query = "SELECT b.breeding_date, 
                      buck.ear_tag as buck_ear_tag, buck.name as buck_name,
                      doe.ear_tag as doe_ear_tag, doe.name as doe_name,
                      b.pregnancy_status, b.due_date, b.birth_date,
                      b.kids_born, b.kids_survived
                      FROM breeding_records b 
                      JOIN goats buck ON b.buck_id = buck.id 
                      JOIN goats doe ON b.doe_id = doe.id 
                      ORDER BY b.breeding_date DESC";
            $filename = 'breeding_export_' . date('Y-m-d') . '.csv';
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid export type']);
            exit();
    }
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll();
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    
    $output = fopen('php://output', 'w');
    
    if (!empty($data)) {
        // Write headers
        fputcsv($output, array_keys($data[0]));
        
        // Write data
        foreach ($data as $row) {
            fputcsv($output, $row);
        }
    }
    
    fclose($output);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Export error: ' . $e->getMessage()]);
}
?>
