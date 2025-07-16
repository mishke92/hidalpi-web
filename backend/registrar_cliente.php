<?php
require_once 'db.php';

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(false, "Método no permitido. Use POST.");
}

// Obtener datos del POST
$input = json_decode(file_get_contents("php://input"), true);

// Validar datos requeridos
$required_fields = ['nombre', 'apellido', 'email'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        send_response(false, "El campo '$field' es requerido.");
    }
}

// Sanitizar datos
$nombre = sanitize_input($input['nombre']);
$apellido = sanitize_input($input['apellido']);
$email = sanitize_input($input['email']);
$telefono = isset($input['telefono']) ? sanitize_input($input['telefono']) : null;
$dni = isset($input['dni']) ? sanitize_input($input['dni']) : null;
$direccion = isset($input['direccion']) ? sanitize_input($input['direccion']) : null;
$fecha_nacimiento = isset($input['fecha_nacimiento']) ? sanitize_input($input['fecha_nacimiento']) : null;
$genero = isset($input['genero']) ? sanitize_input($input['genero']) : null;
$empresa_id = isset($input['empresa_id']) ? intval($input['empresa_id']) : null;

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_response(false, "El formato del email no es válido.");
}

// Validar DNI si se proporciona (8 dígitos para Perú)
if ($dni && !preg_match('/^\d{8}$/', $dni)) {
    send_response(false, "El DNI debe tener 8 dígitos.");
}

// Validar género si se proporciona
if ($genero && !in_array($genero, ['masculino', 'femenino', 'otro'])) {
    send_response(false, "El género debe ser: masculino, femenino u otro.");
}

// Validar fecha de nacimiento si se proporciona
if ($fecha_nacimiento) {
    $date = DateTime::createFromFormat('Y-m-d', $fecha_nacimiento);
    if (!$date || $date->format('Y-m-d') !== $fecha_nacimiento) {
        send_response(false, "La fecha de nacimiento debe tener el formato YYYY-MM-DD.");
    }
}

// Verificar si el email ya existe
$check_email = $conn->prepare("SELECT id FROM clientes WHERE email = ?");
$check_email->bind_param("s", $email);
$check_email->execute();
$result = $check_email->get_result();

if ($result->num_rows > 0) {
    send_response(false, "Ya existe un cliente registrado con ese email.");
}

// Verificar si el DNI ya existe (solo si se proporciona)
if ($dni) {
    $check_dni = $conn->prepare("SELECT id FROM clientes WHERE dni = ?");
    $check_dni->bind_param("s", $dni);
    $check_dni->execute();
    $result = $check_dni->get_result();

    if ($result->num_rows > 0) {
        send_response(false, "Ya existe un cliente registrado con ese DNI.");
    }
}

// Verificar si la empresa existe (solo si se proporciona empresa_id)
if ($empresa_id) {
    $check_empresa = $conn->prepare("SELECT id FROM empresas WHERE id = ? AND estado = 'activa'");
    $check_empresa->bind_param("i", $empresa_id);
    $check_empresa->execute();
    $result = $check_empresa->get_result();

    if ($result->num_rows === 0) {
        send_response(false, "La empresa especificada no existe o no está activa.");
    }
}

// Insertar nuevo cliente
$stmt = $conn->prepare("INSERT INTO clientes (nombre, apellido, email, telefono, dni, direccion, fecha_nacimiento, genero, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssssi", $nombre, $apellido, $email, $telefono, $dni, $direccion, $fecha_nacimiento, $genero, $empresa_id);

if ($stmt->execute()) {
    $cliente_id = $conn->insert_id;
    
    // Registrar en historial de cambios
    $historial_stmt = $conn->prepare("INSERT INTO historial_cambios (tabla_afectada, registro_id, accion, datos_nuevos, fecha_cambio) VALUES (?, ?, ?, ?, NOW())");
    $tabla = 'clientes';
    $accion = 'INSERT';
    $datos_nuevos = json_encode([
        'id' => $cliente_id,
        'nombre' => $nombre,
        'apellido' => $apellido,
        'email' => $email,
        'telefono' => $telefono,
        'dni' => $dni,
        'direccion' => $direccion,
        'fecha_nacimiento' => $fecha_nacimiento,
        'genero' => $genero,
        'empresa_id' => $empresa_id
    ]);
    
    $historial_stmt->bind_param("siss", $tabla, $cliente_id, $accion, $datos_nuevos);
    $historial_stmt->execute();
    
    send_response(true, "Cliente registrado exitosamente.", [
        'id' => $cliente_id,
        'nombre' => $nombre,
        'apellido' => $apellido,
        'email' => $email,
        'nombre_completo' => $nombre . ' ' . $apellido
    ]);
} else {
    send_response(false, "Error al registrar el cliente: " . $conn->error);
}

$stmt->close();
$conn->close();
?>