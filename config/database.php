<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'goat_farm';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            // Try MySQL first, fallback to SQLite
            if (class_exists('PDO') && in_array('mysql', PDO::getAvailableDrivers())) {
                $this->conn = new PDO(
                    "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                    $this->username,
                    $this->password
                );
            } else {
                // Fallback to SQLite
                $this->conn = new PDO("sqlite:../data/goat_farm.db");
            }
            
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}
?>
