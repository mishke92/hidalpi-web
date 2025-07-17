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
    
    if (!validarRUCEcuador($input['ruc'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de RUC inválido', 'success' => false]);
        return;
    }
    
    try {
        // Verificar si el RUC ya existe
        $stmt = $pdo->prepare("SELECT id FROM empresas WHERE ruc = ?");
        $stmt->execute([trim($input['ruc'])]);
        
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'El RUC ya está registrado', 'success' => false]);
            return;
        }
        
        // Verificar si el email ya existe
        $stmt = $pdo->prepare("SELECT id FROM empresas WHERE email = ?");
        $stmt->execute([trim($input['email'])]);
        
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'El email ya está registrado', 'success' => false]);
            return;
        }
        
        // Insertar nueva empresa
        $query = "INSERT INTO empresas (nombre, tipo_empresa, ruc, telefono, email, direccion, ciudad, provincia, canton, pais, codigo_postal, sitio_web, descripcion, servicios_principales, representante_nombre, representante_email, representante_telefono, representante_cedula) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([
            trim($input['nombre']),
            trim($input['tipo_empresa'] ?? ''),
            trim($input['ruc']),
            trim($input['telefono']),
            trim($input['email']),
            trim($input['direccion'] ?? ''),
            trim($input['ciudad']),
            trim($input['provincia']),
            trim($input['canton']),
            trim($input['pais'] ?? 'Ecuador'),
            trim($input['codigo_postal'] ?? ''),
            trim($input['sitio_web'] ?? ''),
            trim($input['descripcion'] ?? ''),
            trim($input['servicios_principales'] ?? ''),
            trim($input['representante_nombre'] ?? ''),
            trim($input['representante_email'] ?? ''),
            trim($input['representante_telefono'] ?? ''),
            trim($input['representante_cedula'] ?? '')
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
            echo json_encode(['error' => 'Error al crear la empresa', 'success' => false]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear empresa: ' . $e->getMessage(), 'success' => false]);
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

/**
 * Validar RUC de Ecuador
 */
function validarRUCEcuador($ruc) {
    $ruc = preg_replace('/\D/', '', $ruc);
    
    if (strlen($ruc) !== 13) return false;
    
    if (!preg_match('/001$/', $ruc)) return false;
    
    $cedula = substr($ruc, 0, 10);
    return validarCedulaEcuador($cedula);
}

/**
 * Validar cédula de Ecuador
 */
function validarCedulaEcuador($cedula) {
    $cedula = preg_replace('/\D/', '', $cedula);
    
    if (strlen($cedula) !== 10) return false;
    
    $provincia = intval(substr($cedula, 0, 2));
    if ($provincia < 1 || $provincia > 24) return false;
    
    $tercerDigito = intval($cedula[2]);
    if ($tercerDigito >= 6) return false;
    
    $suma = 0;
    for ($i = 0; $i < 9; $i++) {
        $digito = intval($cedula[$i]);
        if ($i % 2 === 0) {
            $digito *= 2;
            if ($digito > 9) $digito -= 9;
        }
        $suma += $digito;
    }
    
    $digitoVerificador = ((ceil($suma / 10) * 10) - $suma) % 10;
    $digitoReal = intval($cedula[9]);
    
    return $digitoVerificador === $digitoReal;
}
?>