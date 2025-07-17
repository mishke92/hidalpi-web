<?php
/**
 * API de empresas - Endpoints para gestión de empresas
 * Companies API - Company management endpoints
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
                crearEmpresa($input);
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
                listarEmpresas();
                break;
            case 'get':
                obtenerEmpresa($_GET['id'] ?? '');
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
 * Crear nueva empresa
 */
function crearEmpresa($input) {
    $pdo = getConnection();
    
    $requiredFields = ['nombre', 'ruc', 'telefono', 'email', 'ciudad', 'provincia', 'canton'];
    
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "El campo '$field' es requerido"]);
            return;
        }
    }
    
    try {
        // Verificar si el RUC ya existe
        $stmt = $pdo->prepare("SELECT id FROM empresas WHERE ruc = ?");
        $stmt->execute([trim($input['ruc'])]);
        
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'El RUC ya está registrado']);
            return;
        }
        
        // Insertar nueva empresa
        $query = "INSERT INTO empresas (nombre, ruc, telefono, email, direccion, ciudad, provincia, canton, pais, sitio_web, descripcion, servicios_principales) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([
            trim($input['nombre']),
            trim($input['ruc']),
            trim($input['telefono']),
            trim($input['email']),
            trim($input['direccion'] ?? ''),
            trim($input['ciudad']),
            trim($input['provincia']),
            trim($input['canton']),
            trim($input['pais'] ?? 'Ecuador'),
            trim($input['sitio_web'] ?? ''),
            trim($input['descripcion'] ?? ''),
            trim($input['servicios_principales'] ?? '')
        ]);
        
        if ($result) {
            http_response_code(201);
            echo json_encode([
                'message' => 'Empresa creada exitosamente',
                'success' => true,
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear la empresa']);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear empresa: ' . $e->getMessage()]);
    }
}

/**
 * Listar todas las empresas
 */
function listarEmpresas() {
    $pdo = getConnection();
    
    try {
        $stmt = $pdo->query("SELECT * FROM empresas WHERE activo = TRUE ORDER BY nombre");
        $empresas = $stmt->fetchAll();
        
        echo json_encode([
            'empresas' => $empresas,
            'success' => true
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al listar empresas: ' . $e->getMessage()]);
    }
}

/**
 * Obtener empresa por ID
 */
function obtenerEmpresa($id) {
    $pdo = getConnection();
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de empresa requerido']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM empresas WHERE id = ? AND activo = TRUE");
        $stmt->execute([$id]);
        $empresa = $stmt->fetch();
        
        if ($empresa) {
            echo json_encode([
                'empresa' => $empresa,
                'success' => true
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Empresa no encontrada']);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener empresa: ' . $e->getMessage()]);
    }
}
?>