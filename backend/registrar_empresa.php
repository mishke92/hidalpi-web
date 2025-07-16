<?php
require_once 'db.php';

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(false, "Método no permitido. Use POST.");
}

// Obtener datos del POST
$input = json_decode(file_get_contents("php://input"), true);

// Validar datos requeridos
$required_fields = ['nombre', 'ruc', 'email'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        send_response(false, "El campo '$field' es requerido.");
    }
}

// Sanitizar datos
$nombre = sanitize_input($input['nombre']);
$ruc = sanitize_input($input['ruc']);
$email = sanitize_input($input['email']);
$telefono = isset($input['telefono']) ? sanitize_input($input['telefono']) : null;
$direccion = isset($input['direccion']) ? sanitize_input($input['direccion']) : null;
$contacto_principal = isset($input['contacto_principal']) ? sanitize_input($input['contacto_principal']) : null;
$sector = isset($input['sector']) ? sanitize_input($input['sector']) : null;

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_response(false, "El formato del email no es válido.");
}

// Validar formato de RUC (11 dígitos para Perú)
if (!preg_match('/^\d{11}$/', $ruc)) {
    send_response(false, "El RUC debe tener 11 dígitos.");
}

// Verificar si el RUC ya existe
$check_ruc = $conn->prepare("SELECT id FROM empresas WHERE ruc = ?");
$check_ruc->bind_param("s", $ruc);
$check_ruc->execute();
$result = $check_ruc->get_result();

if ($result->num_rows > 0) {
    send_response(false, "Ya existe una empresa registrada con ese RUC.");
}

// Verificar si el email ya existe
$check_email = $conn->prepare("SELECT id FROM empresas WHERE email = ?");
$check_email->bind_param("s", $email);
$check_email->execute();
$result = $check_email->get_result();

if ($result->num_rows > 0) {
    send_response(false, "Ya existe una empresa registrada con ese email.");
}

// Insertar nueva empresa
$stmt = $conn->prepare("INSERT INTO empresas (nombre, ruc, email, telefono, direccion, contacto_principal, sector) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $nombre, $ruc, $email, $telefono, $direccion, $contacto_principal, $sector);

if ($stmt->execute()) {
    $empresa_id = $conn->insert_id;
    
    // Registrar en historial de cambios
    $historial_stmt = $conn->prepare("INSERT INTO historial_cambios (tabla_afectada, registro_id, accion, datos_nuevos, fecha_cambio) VALUES (?, ?, ?, ?, NOW())");
    $tabla = 'empresas';
    $accion = 'INSERT';
    $datos_nuevos = json_encode([
        'id' => $empresa_id,
        'nombre' => $nombre,
        'ruc' => $ruc,
        'email' => $email,
        'telefono' => $telefono,
        'direccion' => $direccion,
        'contacto_principal' => $contacto_principal,
        'sector' => $sector
    ]);
    
    $historial_stmt->bind_param("siss", $tabla, $empresa_id, $accion, $datos_nuevos);
    $historial_stmt->execute();
    
    send_response(true, "Empresa registrada exitosamente.", [
        'id' => $empresa_id,
        'nombre' => $nombre,
        'ruc' => $ruc,
        'email' => $email
    ]);
} else {
    send_response(false, "Error al registrar la empresa: " . $conn->error);
}

$stmt->close();
$conn->close();
?>