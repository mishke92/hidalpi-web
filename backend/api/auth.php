<?php
/**
 * API de autenticación - Endpoints de registro, login y logout
 * Authentication API - Registration, login and logout endpoints
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../auth/AuthService.php';

$authService = new AuthService();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'POST':
        $action = $_GET['action'] ?? '';
        
        switch ($action) {
            case 'register':
                registrarUsuario($authService, $input);
                break;
            case 'login':
                iniciarSesion($authService, $input);
                break;
            case 'logout':
                cerrarSesion($authService);
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
            case 'status':
                estadoSesion($authService);
                break;
            case 'user':
                obtenerUsuario($authService);
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
 * Registrar nuevo usuario
 */
function registrarUsuario($authService, $input) {
    error_log(json_encode($input)); // Esto escribe en el log de PHP
    $requiredFields = ['nombre', 'email', 'password', 'pais', 'provincia', 'canton'];
    
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "El campo '$field' es requerido"]);
            return;
        }
    }
    
    $resultado = $authService->registrar(
        trim($input['nombre']),
        trim($input['email']),
        $input['password'],
        $input['tipo_usuario'] ?? 'cliente',
        trim($input['pais']),
        trim($input['provincia']),
        trim($input['canton'])
    );
    
    if ($resultado['success']) {
        http_response_code(201);
        echo json_encode([
            'message' => $resultado['message'],
            'success' => true
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'error' => $resultado['message'],
            'success' => false
        ]);
    }
}

/**
 * Iniciar sesión
 */
function iniciarSesion($authService, $input) {
    $requiredFields = ['email', 'password'];
    
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "El campo '$field' es requerido"]);
            return;
        }
    }
    
    $resultado = $authService->iniciarSesion(
        trim($input['email']),
        $input['password']
    );
    
    if ($resultado['success']) {
        echo json_encode([
            'message' => $resultado['message'],
            'success' => true,
            'user' => [
                'id' => $resultado['usuario']['id'],
                'nombre' => $resultado['usuario']['nombre'],
                'email' => $resultado['usuario']['email'],
                'tipo' => $resultado['usuario']['tipo_usuario']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'error' => $resultado['message'],
            'success' => false
        ]);
    }
}

/**
 * Cerrar sesión
 */
function cerrarSesion($authService) {
    $resultado = $authService->cerrarSesion();
    
    echo json_encode([
        'message' => $resultado['message'],
        'success' => $resultado['success']
    ]);
}

/**
 * Verificar estado de sesión
 */
function estadoSesion($authService) {
    $autenticado = $authService->estaAutenticado();
    $esAdmin = $authService->esAdministrador();
    
    echo json_encode([
        'authenticated' => $autenticado,
        'isAdmin' => $esAdmin,
        'user' => $autenticado ? $authService->obtenerUsuarioActual() : null
    ]);
}

/**
 * Obtener información del usuario actual
 */
function obtenerUsuario($authService) {
    $authService->requiereAutenticacion();
    
    $usuario = $authService->obtenerUsuarioActual();
    
    echo json_encode([
        'user' => $usuario,
        'success' => true
    ]);
}
?>