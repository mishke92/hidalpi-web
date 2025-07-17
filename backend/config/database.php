<?php
/**
 * Configuración de la base de datos
 * Database configuration
 */

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'hidalpi_web';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}

// Función para obtener la conexión
function getConnection() {
    global $pdo;
    return $pdo;
}
?>