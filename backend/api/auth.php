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
    $errors = [];
    
    // Validar campos requeridos
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            $errors[] = "El campo '$field' es requerido";
        }
    }
    
    // Validar email
    if (isset($input['email']) && !empty($input['email'])) {
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Formato de email inválido';
        }
    }
    
    // Validar nombre
    if (isset($input['nombre']) && !empty($input['nombre'])) {
        $nombre = trim($input['nombre']);
        if (strlen($nombre) < 2) {
            $errors[] = 'El nombre debe tener al menos 2 caracteres';
        }
        if (strlen($nombre) > 100) {
            $errors[] = 'El nombre no puede tener más de 100 caracteres';
        }
        if (!preg_match('/^[a-zA-ZÀ-ÿ\s]+$/', $nombre)) {
            $errors[] = 'El nombre solo puede contener letras y espacios';
        }
    }
    
    // Validar teléfono si se proporciona
    if (isset($input['telefono']) && !empty($input['telefono'])) {
        if (!validarTelefonoEcuador($input['telefono'])) {
            $errors[] = 'Formato de teléfono inválido para Ecuador';
        }
    }
    
    // Validar cédula si se proporciona
    if (isset($input['cedula']) && !empty($input['cedula'])) {
        if (!validarCedulaEcuador($input['cedula'])) {
            $errors[] = 'Número de cédula inválido';
        }
    }
    
    // Validar RUC si se proporciona
    if (isset($input['ruc']) && !empty($input['ruc'])) {
        if (!validarRUCEcuador($input['ruc'])) {
            $errors[] = 'Formato de RUC inválido';
        }
    }
    
    // Validar contraseña
    if (isset($input['password']) && !empty($input['password'])) {
        $passwordValidation = validarContrasena($input['password']);
        if (!$passwordValidation['valid']) {
            $errors[] = $passwordValidation['message'];
        }
    }
    
    // Validar país
    if (isset($input['pais']) && !empty($input['pais'])) {
        $paisesValidos = ['Ecuador', 'Colombia', 'Perú', 'Venezuela', 'Brasil', 'Argentina', 'Chile', 'Uruguay', 'Paraguay', 'Bolivia'];
        if (!in_array($input['pais'], $paisesValidos)) {
            $errors[] = 'País no válido';
        }
    }
    
    // Si hay errores, devolver el primer error
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => $errors[0], 'success' => false]);
        return;
    }
    
    $resultado = $authService->registrar(
        trim($input['nombre']),
        trim($input['email']),
        $input['password'],
        $input['tipo_usuario'] ?? 'cliente',
        trim($input['pais']),
        trim($input['provincia']),
        trim($input['canton']),
        $input['telefono'] ?? '',
        $input['cedula'] ?? '',
        $input['direccion'] ?? '',
        $input['codigo_postal'] ?? '',
        $input['empresa_id'] ?? null,
        $input['notificaciones'] ?? true,
        $input['newsletter'] ?? false
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
    $errors = [];
    
    // Validar campos requeridos
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            $errors[] = "El campo '$field' es requerido";
        }
    }
    
    // Validar formato de email
    if (isset($input['email']) && !empty($input['email'])) {
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Formato de email inválido';
        }
    }
    
    // Validar longitud de contraseña
    if (isset($input['password']) && !empty($input['password'])) {
        if (strlen($input['password']) < 8) {
            $errors[] = 'La contraseña debe tener al menos 8 caracteres';
        }
    }
    
    // Si hay errores, devolver el primer error
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => $errors[0], 'success' => false]);
        return;
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

/**
 * Validar teléfono de Ecuador
 */
function validarTelefonoEcuador($telefono) {
    $telefono = preg_replace('/\D/', '', $telefono);
    
    // Móvil: 09XXXXXXXX (10 dígitos)
    // Fijo: 0XXXXXXX (8 dígitos)
    // Internacional: 593XXXXXXXXX
    
    if (substr($telefono, 0, 3) === '593') {
        return strlen($telefono) === 12 && preg_match('/^593[2-9]\d{8}$/', $telefono);
    } elseif (substr($telefono, 0, 1) === '0') {
        return (strlen($telefono) === 10 && preg_match('/^09\d{8}$/', $telefono)) ||
               (strlen($telefono) === 8 && preg_match('/^0[2-7]\d{6}$/', $telefono));
    }
    
    return false;
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

/**
 * Validar RUC de Ecuador
 */
function validarRUCEcuador($ruc) {
    $ruc = preg_replace('/\D/', '', $ruc);
    
    if (strlen($ruc) !== 13) return false;
    
    // Debe terminar en 001
    if (substr($ruc, -3) !== '001') return false;
    
    // Obtener los primeros 10 dígitos para validar
    $cedula = substr($ruc, 0, 10);
    
    // Validar con la función de cédula
    return validarCedulaEcuador($cedula);
}

/**
 * Validar contraseña
 */
function validarContrasena($password) {
    if (strlen($password) < 8) {
        return ['valid' => false, 'message' => 'La contraseña debe tener al menos 8 caracteres'];
    }
    
    if (!preg_match('/[A-Z]/', $password)) {
        return ['valid' => false, 'message' => 'La contraseña debe contener al menos una letra mayúscula'];
    }
    
    if (!preg_match('/[a-z]/', $password)) {
        return ['valid' => false, 'message' => 'La contraseña debe contener al menos una letra minúscula'];
    }
    
    if (!preg_match('/\d/', $password)) {
        return ['valid' => false, 'message' => 'La contraseña debe contener al menos un número'];
    }
    
    return ['valid' => true, 'message' => 'Contraseña válida'];
}
?>