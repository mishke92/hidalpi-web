<?php
/**
 * Endpoint para agendar citas
 * 
 * Permite agendar nuevas citas en el sistema
 * Métodos soportados: POST, GET, PUT, DELETE
 */

require_once 'db.php';

// Manejar diferentes métodos HTTP
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'POST':
        crearAgendamiento();
        break;
    case 'GET':
        obtenerAgendamientos();
        break;
    case 'PUT':
        actualizarAgendamiento();
        break;
    case 'DELETE':
        eliminarAgendamiento();
        break;
    default:
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Método no permitido'
        ], 405);
}

/**
 * Crear nuevo agendamiento
 */
function crearAgendamiento() {
    // Obtener datos del cuerpo de la petición
    $input = file_get_contents('php://input');
    $datos = json_decode($input, true);
    
    // Si no hay datos JSON, intentar obtener de POST
    if (!$datos) {
        $datos = $_POST;
    }
    
    // Validar campos requeridos
    $campos_requeridos = ['cliente_id', 'empresa_id', 'servicio', 'fecha_cita'];
    if (!validarCamposRequeridos($datos, $campos_requeridos)) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Campos requeridos: cliente_id, empresa_id, servicio, fecha_cita'
        ], 400);
    }
    
    // Limpiar y validar datos
    $cliente_id = (int) $datos['cliente_id'];
    $empresa_id = (int) $datos['empresa_id'];
    $servicio = limpiarDato($datos['servicio']);
    $fecha_cita = limpiarDato($datos['fecha_cita']);
    $estado = isset($datos['estado']) ? limpiarDato($datos['estado']) : 'pendiente';
    $observaciones = isset($datos['observaciones']) ? limpiarDato($datos['observaciones']) : null;
    $creado_por_bot = isset($datos['creado_por_bot']) ? (bool) $datos['creado_por_bot'] : false;
    $prioridad = isset($datos['prioridad']) ? limpiarDato($datos['prioridad']) : 'media';
    
    // Validar IDs
    if ($cliente_id <= 0 || $empresa_id <= 0) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Los IDs de cliente y empresa deben ser números positivos'
        ], 400);
    }
    
    // Validar estado
    $estados_validos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
    if (!in_array($estado, $estados_validos)) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Estado no válido. Debe ser: pendiente, confirmada, cancelada o completada'
        ], 400);
    }
    
    // Validar prioridad
    $prioridades_validas = ['baja', 'media', 'alta'];
    if (!in_array($prioridad, $prioridades_validas)) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Prioridad no válida. Debe ser: baja, media o alta'
        ], 400);
    }
    
    // Validar formato de fecha
    $fecha_obj = DateTime::createFromFormat('Y-m-d H:i:s', $fecha_cita);
    if (!$fecha_obj || $fecha_obj->format('Y-m-d H:i:s') !== $fecha_cita) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'El formato de la fecha debe ser YYYY-MM-DD HH:MM:SS'
        ], 400);
    }
    
    // Verificar que la fecha no sea pasada
    if ($fecha_obj < new DateTime()) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'La fecha de la cita no puede ser en el pasado'
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
        // Verificar que el cliente existe
        $stmt = $conexion->prepare("SELECT id FROM clientes WHERE id = ? AND estado = 'activo'");
        $stmt->bind_param("i", $cliente_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows === 0) {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Cliente no encontrado o inactivo'
            ], 404);
        }
        
        // Verificar que la empresa existe
        $stmt = $conexion->prepare("SELECT id FROM empresas WHERE id = ? AND estado = 'activa'");
        $stmt->bind_param("i", $empresa_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows === 0) {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Empresa no encontrada o inactiva'
            ], 404);
        }
        
        // Verificar disponibilidad horaria (no permitir citas en la misma hora)
        $stmt = $conexion->prepare(
            "SELECT id FROM agendamientos 
             WHERE empresa_id = ? AND fecha_cita = ? AND estado != 'cancelada'"
        );
        $stmt->bind_param("is", $empresa_id, $fecha_cita);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows > 0) {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Ya existe una cita agendada para esta fecha y hora'
            ], 409);
        }
        
        // Insertar nuevo agendamiento
        $stmt = $conexion->prepare(
            "INSERT INTO agendamientos 
             (cliente_id, empresa_id, servicio, fecha_cita, estado, observaciones, creado_por_bot, prioridad) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        
        $stmt->bind_param(
            "iissssss", 
            $cliente_id, 
            $empresa_id, 
            $servicio, 
            $fecha_cita, 
            $estado, 
            $observaciones, 
            $creado_por_bot, 
            $prioridad
        );
        
        if ($stmt->execute()) {
            $agendamiento_id = $conexion->insert_id;
            
            // Obtener los datos del agendamiento recién creado con información completa
            $stmt = $conexion->prepare("SELECT * FROM vista_agendamientos WHERE id = ?");
            $stmt->bind_param("i", $agendamiento_id);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $agendamiento = $resultado->fetch_assoc();
            
            enviarRespuesta([
                'error' => false,
                'mensaje' => 'Agendamiento creado exitosamente',
                'agendamiento' => $agendamiento
            ], 201);
        } else {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Error al crear el agendamiento: ' . $stmt->error
            ], 500);
        }
        
    } catch (Exception $e) {
        error_log("Error en agendar.php (crear): " . $e->getMessage());
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error interno del servidor'
        ], 500);
    } finally {
        cerrarConexion($conexion);
    }
}

/**
 * Obtener agendamientos
 */
function obtenerAgendamientos() {
    $conexion = obtenerConexion();
    if (!$conexion) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error de conexión a la base de datos'
        ], 500);
    }
    
    try {
        // Parámetros de consulta
        $cliente_id = isset($_GET['cliente_id']) ? (int) $_GET['cliente_id'] : null;
        $empresa_id = isset($_GET['empresa_id']) ? (int) $_GET['empresa_id'] : null;
        $estado = isset($_GET['estado']) ? limpiarDato($_GET['estado']) : null;
        $fecha_desde = isset($_GET['fecha_desde']) ? limpiarDato($_GET['fecha_desde']) : null;
        $fecha_hasta = isset($_GET['fecha_hasta']) ? limpiarDato($_GET['fecha_hasta']) : null;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
        
        // Construir consulta con filtros
        $sql = "SELECT * FROM vista_agendamientos WHERE 1=1";
        $params = [];
        $types = "";
        
        if ($cliente_id) {
            $sql .= " AND cliente_id = ?";
            $params[] = $cliente_id;
            $types .= "i";
        }
        
        if ($empresa_id) {
            $sql .= " AND empresa_id = ?";
            $params[] = $empresa_id;
            $types .= "i";
        }
        
        if ($estado) {
            $sql .= " AND estado = ?";
            $params[] = $estado;
            $types .= "s";
        }
        
        if ($fecha_desde) {
            $sql .= " AND fecha_cita >= ?";
            $params[] = $fecha_desde;
            $types .= "s";
        }
        
        if ($fecha_hasta) {
            $sql .= " AND fecha_cita <= ?";
            $params[] = $fecha_hasta;
            $types .= "s";
        }
        
        $sql .= " ORDER BY fecha_cita DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= "ii";
        
        $stmt = $conexion->prepare($sql);
        if ($types) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        $agendamientos = [];
        while ($row = $resultado->fetch_assoc()) {
            $agendamientos[] = $row;
        }
        
        enviarRespuesta([
            'error' => false,
            'agendamientos' => $agendamientos,
            'total' => count($agendamientos)
        ]);
        
    } catch (Exception $e) {
        error_log("Error en agendar.php (obtener): " . $e->getMessage());
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error interno del servidor'
        ], 500);
    } finally {
        cerrarConexion($conexion);
    }
}

/**
 * Actualizar agendamiento
 */
function actualizarAgendamiento() {
    // Obtener ID del agendamiento de la URL
    $agendamiento_id = isset($_GET['id']) ? (int) $_GET['id'] : null;
    
    if (!$agendamiento_id) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'ID de agendamiento requerido'
        ], 400);
    }
    
    // Obtener datos del cuerpo de la petición
    $input = file_get_contents('php://input');
    $datos = json_decode($input, true);
    
    if (!$datos) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Datos de actualización requeridos'
        ], 400);
    }
    
    $conexion = obtenerConexion();
    if (!$conexion) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error de conexión a la base de datos'
        ], 500);
    }
    
    try {
        // Verificar que el agendamiento existe
        $stmt = $conexion->prepare("SELECT * FROM agendamientos WHERE id = ?");
        $stmt->bind_param("i", $agendamiento_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows === 0) {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Agendamiento no encontrado'
            ], 404);
        }
        
        $agendamiento_actual = $resultado->fetch_assoc();
        
        // Construir consulta de actualización dinámicamente
        $campos_actualizables = [];
        $valores = [];
        $types = "";
        
        if (isset($datos['estado'])) {
            $estado = limpiarDato($datos['estado']);
            $estados_validos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
            if (in_array($estado, $estados_validos)) {
                $campos_actualizables[] = "estado = ?";
                $valores[] = $estado;
                $types .= "s";
            }
        }
        
        if (isset($datos['fecha_cita'])) {
            $fecha_cita = limpiarDato($datos['fecha_cita']);
            $fecha_obj = DateTime::createFromFormat('Y-m-d H:i:s', $fecha_cita);
            if ($fecha_obj && $fecha_obj->format('Y-m-d H:i:s') === $fecha_cita) {
                $campos_actualizables[] = "fecha_cita = ?";
                $valores[] = $fecha_cita;
                $types .= "s";
            }
        }
        
        if (isset($datos['observaciones'])) {
            $campos_actualizables[] = "observaciones = ?";
            $valores[] = limpiarDato($datos['observaciones']);
            $types .= "s";
        }
        
        if (isset($datos['prioridad'])) {
            $prioridad = limpiarDato($datos['prioridad']);
            $prioridades_validas = ['baja', 'media', 'alta'];
            if (in_array($prioridad, $prioridades_validas)) {
                $campos_actualizables[] = "prioridad = ?";
                $valores[] = $prioridad;
                $types .= "s";
            }
        }
        
        if (empty($campos_actualizables)) {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'No hay campos válidos para actualizar'
            ], 400);
        }
        
        // Actualizar agendamiento
        $sql = "UPDATE agendamientos SET " . implode(", ", $campos_actualizables) . " WHERE id = ?";
        $valores[] = $agendamiento_id;
        $types .= "i";
        
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param($types, ...$valores);
        
        if ($stmt->execute()) {
            // Registrar cambio en historial si cambió el estado
            if (isset($datos['estado']) && $datos['estado'] !== $agendamiento_actual['estado']) {
                $stmt_historial = $conexion->prepare(
                    "INSERT INTO historial_agendamientos 
                     (agendamiento_id, estado_anterior, estado_nuevo, observaciones) 
                     VALUES (?, ?, ?, ?)"
                );
                $observaciones_historial = "Cambio de estado automático";
                $stmt_historial->bind_param(
                    "isss", 
                    $agendamiento_id, 
                    $agendamiento_actual['estado'], 
                    $datos['estado'], 
                    $observaciones_historial
                );
                $stmt_historial->execute();
            }
            
            // Obtener datos actualizados
            $stmt = $conexion->prepare("SELECT * FROM vista_agendamientos WHERE id = ?");
            $stmt->bind_param("i", $agendamiento_id);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $agendamiento = $resultado->fetch_assoc();
            
            enviarRespuesta([
                'error' => false,
                'mensaje' => 'Agendamiento actualizado exitosamente',
                'agendamiento' => $agendamiento
            ]);
        } else {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Error al actualizar el agendamiento: ' . $stmt->error
            ], 500);
        }
        
    } catch (Exception $e) {
        error_log("Error en agendar.php (actualizar): " . $e->getMessage());
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error interno del servidor'
        ], 500);
    } finally {
        cerrarConexion($conexion);
    }
}

/**
 * Eliminar agendamiento
 */
function eliminarAgendamiento() {
    $agendamiento_id = isset($_GET['id']) ? (int) $_GET['id'] : null;
    
    if (!$agendamiento_id) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'ID de agendamiento requerido'
        ], 400);
    }
    
    $conexion = obtenerConexion();
    if (!$conexion) {
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error de conexión a la base de datos'
        ], 500);
    }
    
    try {
        // Verificar que el agendamiento existe
        $stmt = $conexion->prepare("SELECT id FROM agendamientos WHERE id = ?");
        $stmt->bind_param("i", $agendamiento_id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows === 0) {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Agendamiento no encontrado'
            ], 404);
        }
        
        // Eliminar agendamiento
        $stmt = $conexion->prepare("DELETE FROM agendamientos WHERE id = ?");
        $stmt->bind_param("i", $agendamiento_id);
        
        if ($stmt->execute()) {
            enviarRespuesta([
                'error' => false,
                'mensaje' => 'Agendamiento eliminado exitosamente'
            ]);
        } else {
            enviarRespuesta([
                'error' => true,
                'mensaje' => 'Error al eliminar el agendamiento: ' . $stmt->error
            ], 500);
        }
        
    } catch (Exception $e) {
        error_log("Error en agendar.php (eliminar): " . $e->getMessage());
        enviarRespuesta([
            'error' => true,
            'mensaje' => 'Error interno del servidor'
        ], 500);
    } finally {
        cerrarConexion($conexion);
    }
}
?>