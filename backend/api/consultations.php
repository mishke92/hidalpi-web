<?php
/**
 * API de consultas - Endpoints para consultas gratuitas y personalizadas
 * Consultation API - Free and personalized consultation endpoints
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
            case 'create_free':
                crearConsultaGratuita($input);
                break;
            case 'create_personalized':
                crearConsultaPersonalizada($input);
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Acción no válida', 'success' => false]);
                break;
        }
        break;
        
    case 'GET':
        $action = $_GET['action'] ?? '';
        
        switch ($action) {
            case 'list':
                listarConsultas();
                break;
            case 'get':
                obtenerConsulta($_GET['id'] ?? '');
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Acción no válida', 'success' => false]);
                break;
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido', 'success' => false]);
        break;
}

/**
 * Crear nueva consulta gratuita
 */
function crearConsultaGratuita($input) {
    $pdo = getConnection();
    
    $requiredFields = ['nombre', 'email', 'telefono', 'consulta'];
    
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
    
    if (strlen(trim($input['consulta'])) < 20) {
        http_response_code(400);
        echo json_encode(['error' => 'La consulta debe tener al menos 20 caracteres', 'success' => false]);
        return;
    }
    
    try {
        // Verificar si ya existe una consulta gratuita pendiente del mismo email
        $stmt = $pdo->prepare("SELECT id FROM consultas WHERE email = ? AND tipo = 'gratuita' AND estado = 'pendiente' AND fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stmt->execute([trim($input['email'])]);
        
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Ya tiene una consulta gratuita pendiente. Puede solicitar una nueva consulta después de 30 días.', 'success' => false]);
            return;
        }
        
        // Crear la consulta
        $query = "INSERT INTO consultas (nombre, email, telefono, consulta, tipo, estado, area_legal, urgencia, fecha_creacion) 
                  VALUES (?, ?, ?, ?, 'gratuita', 'pendiente', ?, ?, NOW())";
        
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([
            trim($input['nombre']),
            trim($input['email']),
            trim($input['telefono']),
            trim($input['consulta']),
            trim($input['area_legal'] ?? 'General'),
            trim($input['urgencia'] ?? 'Normal')
        ]);
        
        if ($result) {
            // Enviar email de confirmación aquí si es necesario
            
            http_response_code(201);
            echo json_encode([
                'message' => 'Consulta gratuita enviada exitosamente. Recibirá una respuesta en las próximas 48 horas.',
                'success' => true,
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Error al enviar la consulta', 'success' => false]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al procesar consulta: ' . $e->getMessage(), 'success' => false]);
    }
}

/**
 * Crear nueva consulta personalizada
 */
function crearConsultaPersonalizada($input) {
    $pdo = getConnection();
    
    $requiredFields = ['nombre', 'email', 'telefono', 'consulta', 'tipo_servicio'];
    
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
    
    if (strlen(trim($input['consulta'])) < 50) {
        http_response_code(400);
        echo json_encode(['error' => 'La consulta personalizada debe tener al menos 50 caracteres', 'success' => false]);
        return;
    }
    
    $tiposServicio = ['asesoria', 'representacion', 'redaccion', 'revision', 'otro'];
    if (!in_array($input['tipo_servicio'], $tiposServicio)) {
        http_response_code(400);
        echo json_encode(['error' => 'Tipo de servicio no válido', 'success' => false]);
        return;
    }
    
    try {
        // Crear la consulta personalizada
        $query = "INSERT INTO consultas (nombre, email, telefono, consulta, tipo, estado, area_legal, urgencia, tipo_servicio, presupuesto_estimado, fecha_limite, empresa, fecha_creacion) 
                  VALUES (?, ?, ?, ?, 'personalizada', 'pendiente', ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([
            trim($input['nombre']),
            trim($input['email']),
            trim($input['telefono']),
            trim($input['consulta']),
            trim($input['area_legal'] ?? 'General'),
            trim($input['urgencia'] ?? 'Normal'),
            trim($input['tipo_servicio']),
            trim($input['presupuesto_estimado'] ?? ''),
            isset($input['fecha_limite']) ? trim($input['fecha_limite']) : null,
            trim($input['empresa'] ?? '')
        ]);
        
        if ($result) {
            // Enviar email de confirmación aquí si es necesario
            
            http_response_code(201);
            echo json_encode([
                'message' => 'Consulta personalizada enviada exitosamente. Nos pondremos en contacto con usted dentro de 24 horas.',
                'success' => true,
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Error al enviar la consulta', 'success' => false]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al procesar consulta: ' . $e->getMessage(), 'success' => false]);
    }
}

/**
 * Listar todas las consultas
 */
function listarConsultas() {
    $pdo = getConnection();
    
    try {
        $query = "SELECT * FROM consultas ORDER BY fecha_creacion DESC";
        $stmt = $pdo->query($query);
        $consultas = $stmt->fetchAll();
        
        echo json_encode([
            'consultas' => $consultas,
            'success' => true
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al listar consultas: ' . $e->getMessage(), 'success' => false]);
    }
}

/**
 * Obtener consulta por ID
 */
function obtenerConsulta($id) {
    $pdo = getConnection();
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de consulta requerido', 'success' => false]);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM consultas WHERE id = ?");
        $stmt->execute([$id]);
        $consulta = $stmt->fetch();
        
        if ($consulta) {
            echo json_encode([
                'consulta' => $consulta,
                'success' => true
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Consulta no encontrada', 'success' => false]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener consulta: ' . $e->getMessage(), 'success' => false]);
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