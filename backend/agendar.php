<?php
require_once 'db.php';

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(false, "Método no permitido. Use POST.");
}

// Obtener datos del POST
$input = json_decode(file_get_contents("php://input"), true);

// Validar datos requeridos
$required_fields = ['cliente_id', 'fecha_cita', 'servicio'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        send_response(false, "El campo '$field' es requerido.");
    }
}

// Sanitizar datos
$cliente_id = intval($input['cliente_id']);
$empresa_id = isset($input['empresa_id']) ? intval($input['empresa_id']) : null;
$fecha_cita = sanitize_input($input['fecha_cita']);
$duracion_minutos = isset($input['duracion_minutos']) ? intval($input['duracion_minutos']) : 60;
$servicio = sanitize_input($input['servicio']);
$descripcion = isset($input['descripcion']) ? sanitize_input($input['descripcion']) : null;
$prioridad = isset($input['prioridad']) ? sanitize_input($input['prioridad']) : 'media';
$modalidad = isset($input['modalidad']) ? sanitize_input($input['modalidad']) : 'presencial';
$ubicacion = isset($input['ubicacion']) ? sanitize_input($input['ubicacion']) : null;
$url_reunion = isset($input['url_reunion']) ? sanitize_input($input['url_reunion']) : null;
$creado_por_bot = isset($input['creado_por_bot']) ? (bool)$input['creado_por_bot'] : false;
$sitio_origen = isset($input['sitio_origen']) ? sanitize_input($input['sitio_origen']) : 'web';
$notas_adicionales = isset($input['notas_adicionales']) ? sanitize_input($input['notas_adicionales']) : null;

// Validar formato de fecha
$date = DateTime::createFromFormat('Y-m-d H:i:s', $fecha_cita);
if (!$date || $date->format('Y-m-d H:i:s') !== $fecha_cita) {
    send_response(false, "La fecha de cita debe tener el formato YYYY-MM-DD HH:MM:SS.");
}

// Verificar que la fecha no sea en el pasado
if ($date <= new DateTime()) {
    send_response(false, "La fecha de cita no puede ser en el pasado.");
}

// Validar prioridad
if (!in_array($prioridad, ['baja', 'media', 'alta'])) {
    send_response(false, "La prioridad debe ser: baja, media o alta.");
}

// Validar modalidad
if (!in_array($modalidad, ['presencial', 'virtual', 'telefonica'])) {
    send_response(false, "La modalidad debe ser: presencial, virtual o telefonica.");
}

// Validar duración
if ($duracion_minutos < 15 || $duracion_minutos > 480) {
    send_response(false, "La duración debe estar entre 15 y 480 minutos.");
}

// Verificar que el cliente existe
$check_cliente = $conn->prepare("SELECT id, nombre, apellido FROM clientes WHERE id = ? AND estado = 'activo'");
$check_cliente->bind_param("i", $cliente_id);
$check_cliente->execute();
$result_cliente = $check_cliente->get_result();

if ($result_cliente->num_rows === 0) {
    send_response(false, "El cliente especificado no existe o no está activo.");
}

$cliente_data = $result_cliente->fetch_assoc();

// Verificar que la empresa existe (si se proporciona)
if ($empresa_id) {
    $check_empresa = $conn->prepare("SELECT id, nombre FROM empresas WHERE id = ? AND estado = 'activa'");
    $check_empresa->bind_param("i", $empresa_id);
    $check_empresa->execute();
    $result_empresa = $check_empresa->get_result();

    if ($result_empresa->num_rows === 0) {
        send_response(false, "La empresa especificada no existe o no está activa.");
    }
    
    $empresa_data = $result_empresa->fetch_assoc();
} else {
    // Si no se especifica empresa, usar la empresa por defecto (Hidalpi & Asociados)
    $check_empresa = $conn->prepare("SELECT id, nombre FROM empresas WHERE ruc = '20123456789' AND estado = 'activa'");
    $check_empresa->execute();
    $result_empresa = $check_empresa->get_result();
    
    if ($result_empresa->num_rows > 0) {
        $empresa_data = $result_empresa->fetch_assoc();
        $empresa_id = $empresa_data['id'];
    }
}

// Verificar disponibilidad de horario (no permitir citas superpuestas)
$fecha_fin = clone $date;
$fecha_fin->add(new DateInterval('PT' . $duracion_minutos . 'M'));
$fecha_fin_str = $fecha_fin->format('Y-m-d H:i:s');

$check_disponibilidad = $conn->prepare("
    SELECT id FROM agendamientos 
    WHERE empresa_id = ? 
    AND estado IN ('pendiente', 'confirmada') 
    AND (
        (fecha_cita <= ? AND DATE_ADD(fecha_cita, INTERVAL duracion_minutos MINUTE) > ?) OR
        (fecha_cita < ? AND DATE_ADD(fecha_cita, INTERVAL duracion_minutos MINUTE) >= ?)
    )
");

$check_disponibilidad->bind_param("issss", $empresa_id, $fecha_cita, $fecha_cita, $fecha_fin_str, $fecha_fin_str);
$check_disponibilidad->execute();
$result_disponibilidad = $check_disponibilidad->get_result();

if ($result_disponibilidad->num_rows > 0) {
    send_response(false, "Ya existe una cita programada en ese horario. Por favor, elija otro horario.");
}

// Validar URL de reunión para modalidad virtual
if ($modalidad === 'virtual' && empty($url_reunion)) {
    send_response(false, "Para citas virtuales es necesario proporcionar la URL de la reunión.");
}

// Insertar nuevo agendamiento
$stmt = $conn->prepare("
    INSERT INTO agendamientos 
    (cliente_id, empresa_id, fecha_cita, duracion_minutos, servicio, descripcion, prioridad, modalidad, ubicacion, url_reunion, creado_por_bot, sitio_origen, notas_adicionales) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param("iississssisss", $cliente_id, $empresa_id, $fecha_cita, $duracion_minutos, $servicio, $descripcion, $prioridad, $modalidad, $ubicacion, $url_reunion, $creado_por_bot, $sitio_origen, $notas_adicionales);

if ($stmt->execute()) {
    $agendamiento_id = $conn->insert_id;
    
    // Registrar en historial de cambios
    $historial_stmt = $conn->prepare("INSERT INTO historial_cambios (tabla_afectada, registro_id, accion, datos_nuevos, fecha_cambio) VALUES (?, ?, ?, ?, NOW())");
    $tabla = 'agendamientos';
    $accion = 'INSERT';
    $datos_nuevos = json_encode([
        'id' => $agendamiento_id,
        'cliente_id' => $cliente_id,
        'empresa_id' => $empresa_id,
        'fecha_cita' => $fecha_cita,
        'duracion_minutos' => $duracion_minutos,
        'servicio' => $servicio,
        'descripcion' => $descripcion,
        'prioridad' => $prioridad,
        'modalidad' => $modalidad,
        'ubicacion' => $ubicacion,
        'url_reunion' => $url_reunion,
        'creado_por_bot' => $creado_por_bot,
        'sitio_origen' => $sitio_origen,
        'notas_adicionales' => $notas_adicionales
    ]);
    
    $historial_stmt->bind_param("siss", $tabla, $agendamiento_id, $accion, $datos_nuevos);
    $historial_stmt->execute();
    
    send_response(true, "Agendamiento creado exitosamente.", [
        'id' => $agendamiento_id,
        'cliente' => $cliente_data['nombre'] . ' ' . $cliente_data['apellido'],
        'empresa' => isset($empresa_data) ? $empresa_data['nombre'] : 'N/A',
        'fecha_cita' => $fecha_cita,
        'servicio' => $servicio,
        'modalidad' => $modalidad,
        'creado_por_bot' => $creado_por_bot
    ]);
} else {
    send_response(false, "Error al crear el agendamiento: " . $conn->error);
}

$stmt->close();
$conn->close();
?>