<?php
/**
 * Endpoint para registro de clientes
 * 
 * Permite registrar nuevos clientes en el sistema
 * Métodos soportados: POST
 */

require_once 'db.php';

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'Método no permitido. Solo se acepta POST.'
    ], 405);
}

// Obtener datos del cuerpo de la petición
$input = file_get_contents('php://input');
$datos = json_decode($input, true);

// Si no hay datos JSON, intentar obtener de POST
if (!$datos) {
    $datos = $_POST;
}

// Validar campos requeridos
$campos_requeridos = ['nombre', 'apellido', 'documento'];
if (!validarCamposRequeridos($datos, $campos_requeridos)) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'Campos requeridos: nombre, apellido, documento'
    ], 400);
}

// Limpiar y validar datos
$nombre = limpiarDato($datos['nombre']);
$apellido = limpiarDato($datos['apellido']);
$documento = limpiarDato($datos['documento']);
$tipo_documento = isset($datos['tipo_documento']) ? limpiarDato($datos['tipo_documento']) : 'DNI';
$direccion = isset($datos['direccion']) ? limpiarDato($datos['direccion']) : null;
$telefono = isset($datos['telefono']) ? limpiarDato($datos['telefono']) : null;
$email = isset($datos['email']) ? limpiarDato($datos['email']) : null;
$fecha_nacimiento = isset($datos['fecha_nacimiento']) ? limpiarDato($datos['fecha_nacimiento']) : null;

// Validar tipo de documento
$tipos_documento_validos = ['DNI', 'CE', 'pasaporte'];
if (!in_array($tipo_documento, $tipos_documento_validos)) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'Tipo de documento no válido. Debe ser: DNI, CE o pasaporte'
    ], 400);
}

// Validar formato de documento según tipo
if ($tipo_documento === 'DNI') {
    if (!preg_match('/^\d{8}$/', $documento)) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'El DNI debe tener exactamente 8 dígitos numéricos'
        ], 400);
    }
} elseif ($tipo_documento === 'CE') {
    if (!preg_match('/^\d{9}$/', $documento)) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'El Carnet de Extranjería debe tener exactamente 9 dígitos numéricos'
        ], 400);
    }
} elseif ($tipo_documento === 'pasaporte') {
    if (strlen($documento) < 6 || strlen($documento) > 20) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'El pasaporte debe tener entre 6 y 20 caracteres'
        ], 400);
    }
}

// Validar formato de email si se proporciona
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'El formato del email no es válido'
    ], 400);
}

// Validar fecha de nacimiento si se proporciona
if ($fecha_nacimiento) {
    $fecha_obj = DateTime::createFromFormat('Y-m-d', $fecha_nacimiento);
    if (!$fecha_obj || $fecha_obj->format('Y-m-d') !== $fecha_nacimiento) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'El formato de la fecha de nacimiento debe ser YYYY-MM-DD'
        ], 400);
    }
    
    // Verificar que la fecha no sea futura
    if ($fecha_obj > new DateTime()) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'La fecha de nacimiento no puede ser futura'
        ], 400);
    }
    
    // Verificar edad mínima (18 años)
    $edad = (new DateTime())->diff($fecha_obj)->y;
    if ($edad < 18) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'El cliente debe ser mayor de edad (18 años)'
        ], 400);
    }
}

// Validar longitud de campos
if (strlen($nombre) > 255) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'El nombre no puede exceder 255 caracteres'
    ], 400);
}

if (strlen($apellido) > 255) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'El apellido no puede exceder 255 caracteres'
    ], 400);
}

// Obtener conexión a la base de datos
$conexion = obtenerConexion();
if (!$conexion) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'Error de conexión a la base de datos'
    ], 500);
}

try {
    // Verificar si el documento ya existe
    $stmt = $conexion->prepare("SELECT id FROM clientes WHERE documento = ?");
    $stmt->bind_param("s", $documento);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows > 0) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Ya existe un cliente registrado con este documento'
        ], 409);
    }
    
    // Verificar si el email ya existe (si se proporciona)
    if ($email) {
        $stmt = $conexion->prepare("SELECT id FROM clientes WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows > 0) {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Ya existe un cliente registrado con este email'
            ], 409);
        }
    }
    
    // Insertar nuevo cliente
    $stmt = $conexion->prepare(
        "INSERT INTO clientes (nombre, apellido, documento, tipo_documento, direccion, telefono, email, fecha_nacimiento) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    
    $stmt->bind_param(
        "ssssssss", 
        $nombre, 
        $apellido, 
        $documento, 
        $tipo_documento, 
        $direccion, 
        $telefono, 
        $email, 
        $fecha_nacimiento
    );
    
    if ($stmt->execute()) {
        $cliente_id = $conexion->insert_id;
        
        // Obtener los datos del cliente recién creado
        $stmt = $conexion->prepare("SELECT * FROM clientes WHERE id = ?");
        $stmt->bind_param("i", $cliente_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $cliente = $resultado->fetch_assoc();
        
        enviarRespuesta([
            'error' => false,
            'mensaje' => 'Cliente registrado exitosamente',
            'cliente' => $cliente
        ], 201);
    } else {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error al registrar el cliente: ' . $stmt->error
        ], 500);
    }
    
} catch (Exception $e) {
    error_log("Error en registrar_cliente.php: " . $e->getMessage());
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'Error interno del servidor'
    ], 500);
} finally {
    cerrarConexion($conexion);
}
?>