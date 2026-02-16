<?php
/**
 * Configuración de la base de datos
 * Database configuration
 */

require_once __DIR__ . '/env.php';

// Cargar variables de entorno
try {
    Env::load();
} catch (Exception $e) {
    error_log("Failed to load environment: " . $e->getMessage());
    die("Configuration error. Please check server logs.");
}

// Configuración de la base de datos desde variables de entorno
$host = Env::get('DB_HOST', 'localhost');
$dbname = Env::get('DB_NAME', 'hidalpi_web');
$username = Env::get('DB_USER', 'root');
$password = Env::get('DB_PASSWORD', '');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log("Database connection error: " . $e->getMessage());
    die("Database connection failed. Please check server logs.");
}

// Función para obtener la conexión
function getConnection() {
    global $pdo;
    return $pdo;
}
?>