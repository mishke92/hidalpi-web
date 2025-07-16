<?php
// Configuración de la base de datos para XAMPP
$host = "localhost";
$username = "root";
$password = "";
$database = "hidalpi_db";

// Crear conexión
$conn = new mysqli($host, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Configurar charset UTF-8
$conn->set_charset("utf8");

// Configurar cabeceras para permitir CORS (Cross-Origin Resource Sharing)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Función para sanitizar datos de entrada
function sanitize_input($data) {
    global $conn;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $conn->real_escape_string($data);
}

// Función para enviar respuesta JSON
function send_response($success, $message, $data = null) {
    $response = array(
        "success" => $success,
        "message" => $message
    );
    
    if ($data !== null) {
        $response["data"] = $data;
    }
    
    echo json_encode($response);
    exit();
}
?>