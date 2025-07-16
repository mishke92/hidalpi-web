<?php
/**
 * Endpoint para registro de empresas
 * 
 * Permite registrar nuevas empresas en el sistema
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
$campos_requeridos = ['nombre', 'ruc', 'representante_legal'];
if (!validarCamposRequeridos($datos, $campos_requeridos)) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'Campos requeridos: nombre, ruc, representante_legal'
    ], 400);
}

// Limpiar y validar datos
$nombre = limpiarDato($datos['nombre']);
$ruc = limpiarDato($datos['ruc']);
$direccion = isset($datos['direccion']) ? limpiarDato($datos['direccion']) : null;
$telefono = isset($datos['telefono']) ? limpiarDato($datos['telefono']) : null;
$email = isset($datos['email']) ? limpiarDato($datos['email']) : null;
$representante_legal = limpiarDato($datos['representante_legal']);
$sector = isset($datos['sector']) ? limpiarDato($datos['sector']) : null;
$descripcion = isset($datos['descripcion']) ? limpiarDato($datos['descripcion']) : null;

// Validar formato de RUC (debe tener 11 dígitos)
if (!preg_match('/^\d{11}$/', $ruc)) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'El RUC debe tener exactamente 11 dígitos numéricos'
    ], 400);
}

// Validar formato de email si se proporciona
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'El formato del email no es válido'
    ], 400);
}

// Validar longitud de campos
if (strlen($nombre) > 255) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'El nombre no puede exceder 255 caracteres'
    ], 400);
}

if (strlen($representante_legal) > 255) {
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'El nombre del representante legal no puede exceder 255 caracteres'
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
    // Verificar si el RUC ya existe
    $stmt = $conexion->prepare("SELECT id FROM empresas WHERE ruc = ?");
    $stmt->bind_param("s", $ruc);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows > 0) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Ya existe una empresa registrada con este RUC'
        ], 409);
    }
    
    // Verificar si el email ya existe (si se proporciona)
    if ($email) {
        $stmt = $conexion->prepare("SELECT id FROM empresas WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows > 0) {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Ya existe una empresa registrada con este email'
            ], 409);
        }
    }
    
    // Insertar nueva empresa
    $stmt = $conexion->prepare(
        "INSERT INTO empresas (nombre, ruc, direccion, telefono, email, representante_legal, sector, descripcion) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    
    $stmt->bind_param(
        "ssssssss", 
        $nombre, 
        $ruc, 
        $direccion, 
        $telefono, 
        $email, 
        $representante_legal, 
        $sector, 
        $descripcion
    );
    
    if ($stmt->execute()) {
        $empresa_id = $conexion->insert_id;
        
        // Obtener los datos de la empresa recién creada
        $stmt = $conexion->prepare("SELECT * FROM empresas WHERE id = ?");
        $stmt->bind_param("i", $empresa_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $empresa = $resultado->fetch_assoc();
        
        enviarRespuesta([
            'error' => false,
            'mensaje' => 'Empresa registrada exitosamente',
            'empresa' => $empresa
        ], 201);
    } else {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error al registrar la empresa: ' . $stmt->error
        ], 500);
    }
    
} catch (Exception $e) {
    error_log("Error en registrar_empresa.php: " . $e->getMessage());
    enviarRespuesta([
        'error' => true,
        'mensaje' => 'Error interno del servidor'
    ], 500);
} finally {
    cerrarConexion($conexion);
}
?>