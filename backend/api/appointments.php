<?php
/**
 * API de citas - Endpoints para gestión de citas/agendamientos
 * Appointments API - Appointment management endpoints
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';
require_once '../auth/AuthService.php';

$authService = new AuthService();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'POST':
        $action = $_GET['action'] ?? '';
        
        switch ($action) {
            case 'create':
                crearCita($input);
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Acción no válida']);
                break;
        }
        break;
        
    case 'GET':
        $action = $_GET['action'] ?? '';
        
        switch ($action) {
            case 'list':
                listarCitas();
                break;
            case 'get':
                obtenerCita($_GET['id'] ?? '');
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Acción no válida']);
                break;
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

/**
 * Crear nueva cita
 */
function crearCita($input) {
    $pdo = getConnection();
    
    $requiredFields = ['nombre', 'email', 'telefono', 'servicio', 'abogado', 'fecha', 'hora'];
    
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "El campo '$field' es requerido", 'success' => false]);
            return;
        }
    }
    
    // Validaciones adicionales
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de email inválido', 'success' => false]);
        return;
    }
    
    if (!validarTelefonoEcuador($input['telefono'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de teléfono inválido', 'success' => false]);
        return;
    }
    
    // Validar fecha
    $fechaCita = DateTime::createFromFormat('Y-m-d', $input['fecha']);
    $hoy = new DateTime();
    $hoy->setTime(0, 0, 0);
    
    if (!$fechaCita || $fechaCita < $hoy) {
        http_response_code(400);
        echo json_encode(['error' => 'La fecha debe ser válida y no puede ser anterior a hoy', 'success' => false]);
        return;
    }
    
    // Validar hora
    $horasValidas = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
    if (!in_array($input['hora'], $horasValidas)) {
        http_response_code(400);
        echo json_encode(['error' => 'Hora no válida', 'success' => false]);
        return;
    }
    
    try {
        // Primero crear o encontrar el cliente
        $stmt = $pdo->prepare("SELECT id FROM clientes WHERE email = ?");
        $stmt->execute([trim($input['email'])]);
        $cliente = $stmt->fetch();
        
        if (!$cliente) {
            // Crear nuevo cliente
            $nombreCompleto = explode(' ', trim($input['nombre']), 2);
            $nombre = $nombreCompleto[0];
            $apellido = $nombreCompleto[1] ?? '';
            
            $stmt = $pdo->prepare("INSERT INTO clientes (nombre, apellido, email, telefono, activo) VALUES (?, ?, ?, ?, TRUE)");
            $stmt->execute([$nombre, $apellido, trim($input['email']), trim($input['telefono'])]);
            $cliente_id = $pdo->lastInsertId();
        } else {
            $cliente_id = $cliente['id'];
        }
        
        // Obtener IDs de servicio y abogado
        $stmt = $pdo->prepare("SELECT id FROM servicios WHERE nombre = ? OR id = ?");
        $stmt->execute([trim($input['servicio']), trim($input['servicio'])]);
        $servicio = $stmt->fetch();
        
        if (!$servicio) {
            http_response_code(400);
            echo json_encode(['error' => 'Servicio no encontrado', 'success' => false]);
            return;
        }
        
        $stmt = $pdo->prepare("SELECT id, empresa_id FROM abogados WHERE id = ? OR nombre = ?");
        $stmt->execute([trim($input['abogado']), trim($input['abogado'])]);
        $abogado = $stmt->fetch();
        
        if (!$abogado) {
            http_response_code(400);
            echo json_encode(['error' => 'Abogado no encontrado', 'success' => false]);
            return;
        }
        
        // Verificar disponibilidad
        $stmt = $pdo->prepare("SELECT id FROM citas WHERE fecha_cita = ? AND hora_cita = ? AND abogado_id = ? AND estado != 'cancelada'");
        $stmt->execute([trim($input['fecha']), trim($input['hora']), $abogado['id']]);
        
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'El horario ya está ocupado para este abogado', 'success' => false]);
            return;
        }
        
        // Crear la cita
        $query = "INSERT INTO citas (cliente_id, abogado_id, servicio_id, empresa_id, fecha_cita, hora_cita, estado, notas) 
                  VALUES (?, ?, ?, ?, ?, ?, 'pendiente', ?)";
        
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([
            $cliente_id,
            $abogado['id'],
            $servicio['id'],
            $abogado['empresa_id'],
            trim($input['fecha']),
            trim($input['hora']),
            trim($input['descripcion'] ?? '')
        ]);
        
        if ($result) {
            http_response_code(201);
            echo json_encode([
                'message' => 'Cita creada exitosamente',
                'success' => true,
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear la cita', 'success' => false]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear cita: ' . $e->getMessage(), 'success' => false]);
    }
}

/**
 * Listar todas las citas
 */
function listarCitas() {
    $pdo = getConnection();
    
    try {
        $query = "SELECT c.*, 
                         cl.nombre as cliente_nombre, cl.apellido as cliente_apellido, cl.email as cliente_email,
                         a.nombre as abogado_nombre, a.apellido as abogado_apellido,
                         s.nombre as servicio_nombre, s.duracion_minutos,
                         e.nombre as empresa_nombre
                  FROM citas c
                  JOIN clientes cl ON c.cliente_id = cl.id
                  JOIN abogados a ON c.abogado_id = a.id
                  JOIN servicios s ON c.servicio_id = s.id
                  JOIN empresas e ON c.empresa_id = e.id
                  ORDER BY c.fecha_cita DESC, c.hora_cita DESC";
        
        $stmt = $pdo->query($query);
        $citas = $stmt->fetchAll();
        
        echo json_encode([
            'citas' => $citas,
            'success' => true
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al listar citas: ' . $e->getMessage()]);
    }
}

/**
 * Obtener cita por ID
 */
function obtenerCita($id) {
    $pdo = getConnection();
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de cita requerido']);
        return;
    }
    
    try {
        $query = "SELECT c.*, 
                         cl.nombre as cliente_nombre, cl.apellido as cliente_apellido, cl.email as cliente_email,
                         a.nombre as abogado_nombre, a.apellido as abogado_apellido,
                         s.nombre as servicio_nombre, s.duracion_minutos,
                         e.nombre as empresa_nombre
                  FROM citas c
                  JOIN clientes cl ON c.cliente_id = cl.id
                  JOIN abogados a ON c.abogado_id = a.id
                  JOIN servicios s ON c.servicio_id = s.id
                  JOIN empresas e ON c.empresa_id = e.id
                  WHERE c.id = ?";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute([$id]);
        $cita = $stmt->fetch();
        
        if ($cita) {
            echo json_encode([
                'cita' => $cita,
                'success' => true
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Cita no encontrada']);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener cita: ' . $e->getMessage()]);
    }
}

/**
 * Validar teléfono de Ecuador
 */
function validarTelefonoEcuador($telefono) {
    $telefono = preg_replace('/\D/', '', $telefono);
    
    if (substr($telefono, 0, 3) === '593') {
        return strlen($telefono) === 12 && preg_match('/^593[2-9]\d{8}$/', $telefono);
    } elseif (substr($telefono, 0, 1) === '0') {
        return (strlen($telefono) === 10 && preg_match('/^09\d{8}$/', $telefono)) ||
               (strlen($telefono) === 8 && preg_match('/^0[2-7]\d{6}$/', $telefono));
    }
    
    return false;
}
?>