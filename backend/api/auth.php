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
    error_log(json_encode($input)); // Log para debugging
    
    $requiredFields = ['nombre', 'email', 'password', 'tipo_usuario'];
    
    // Validar campos obligatorios básicos
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "El campo '$field' es requerido", 'success' => false]);
            return;
        }
    }
    
    // Validar campos de ubicación si se proporcionan
    $locationFields = ['pais', 'provincia', 'canton'];
    foreach ($locationFields as $field) {
        if (isset($input[$field]) && empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "El campo '$field' es requerido", 'success' => false]);
            return;
        }
    }
    
    // Sanitizar entrada
    $nombre = sanitizeInput($input['nombre']);
    $email = sanitizeInput($input['email']);
    $tipo_usuario = sanitizeInput($input['tipo_usuario']);
    
    // Validar nombre
    if (strlen($nombre) < 2 || strlen($nombre) > 100) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre debe tener entre 2 y 100 caracteres', 'success' => false]);
        return;
    }
    
    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'El formato del email no es válido', 'success' => false]);
        return;
    }
    
    // Validar tipo de usuario
    $validUserTypes = ['cliente', 'admin', 'abogado'];
    if (!in_array($tipo_usuario, $validUserTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Tipo de usuario no válido', 'success' => false]);
        return;
    }
    
    // Validar teléfono si se proporciona
    if (isset($input['telefono']) && !empty($input['telefono'])) {
        if (!validarTelefonoEcuador($input['telefono'])) {
            http_response_code(400);
            echo json_encode(['error' => 'El formato del teléfono no es válido para Ecuador', 'success' => false]);
            return;
        }
    }
    
    // Validar cédula si se proporciona
    if (isset($input['cedula']) && !empty($input['cedula'])) {
        if (!validarCedulaEcuador($input['cedula'])) {
            http_response_code(400);
            echo json_encode(['error' => 'El número de cédula no es válido', 'success' => false]);
            return;
        }
    }
    
    // Validar contraseña con políticas estrictas
    $passwordValidation = validarContrasenaEstricta($input['password']);
    if (!$passwordValidation['valid']) {
        http_response_code(400);
        echo json_encode(['error' => $passwordValidation['message'], 'success' => false]);
        return;
    }
    
    // Validar ubicación si se proporciona
    $pais = isset($input['pais']) ? sanitizeInput($input['pais']) : '';
    $provincia = isset($input['provincia']) ? sanitizeInput($input['provincia']) : '';
    $canton = isset($input['canton']) ? sanitizeInput($input['canton']) : '';
    
    if (!empty($pais) && !validarUbicacion($pais, $provincia, $canton)) {
        http_response_code(400);
        echo json_encode(['error' => 'La ubicación seleccionada no es válida', 'success' => false]);
        return;
    }
    
    $resultado = $authService->registrar(
        $nombre,
        $email,
        $input['password'],
        $tipo_usuario,
        $pais,
        $provincia,
        $canton,
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
    
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "El campo '$field' es requerido", 'success' => false]);
            return;
        }
    }
    
    // Sanitizar entrada
    $email = sanitizeInput($input['email']);
    
    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'El formato del email no es válido', 'success' => false]);
        return;
    }
    
    // Validar contraseña mínima
    if (strlen($input['password']) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres', 'success' => false]);
        return;
    }
    
    $resultado = $authService->iniciarSesion(
        $email,
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
 * Validar contraseña con políticas estrictas
 */
function validarContrasenaEstricta($password) {
    $errors = [];
    
    if (strlen($password) < 8) {
        $errors[] = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!preg_match('/[A-Z]/', $password)) {
        $errors[] = 'La contraseña debe contener al menos una letra mayúscula';
    }
    
    if (!preg_match('/[a-z]/', $password)) {
        $errors[] = 'La contraseña debe contener al menos una letra minúscula';
    }
    
    if (!preg_match('/\d/', $password)) {
        $errors[] = 'La contraseña debe contener al menos un número';
    }
    
    if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
        $errors[] = 'La contraseña debe contener al menos un carácter especial';
    }
    
    return [
        'valid' => count($errors) === 0,
        'message' => count($errors) > 0 ? implode(', ', $errors) : 'Contraseña válida'
    ];
}

/**
 * Sanitizar entrada de usuario
 */
function sanitizeInput($input) {
    if (is_string($input)) {
        return trim(htmlspecialchars($input, ENT_QUOTES, 'UTF-8'));
    }
    return $input;
}

/**
 * Validar ubicación (país, provincia, cantón)
 */
function validarUbicacion($pais, $provincia, $canton) {
    // Ubicaciones válidas para Ecuador
    $ubicacionesValidas = [
        'Ecuador' => [
            'El Oro' => ['Machala', 'Pasaje', 'Santa Rosa', 'Huaquillas', 'Arenillas'],
            'Guayas' => ['Guayaquil', 'Milagro', 'Durán', 'Samborondón'],
            'Pichincha' => ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo'],
            'Manabí' => ['Portoviejo', 'Manta', 'Chone', 'Montecristi'],
            'Azuay' => ['Cuenca', 'Gualaceo', 'Paute', 'Chordeleg']
        ],
        'Colombia' => [
            'Antioquia' => ['Medellín', 'Bello', 'Itagüí', 'Envigado'],
            'Bogotá D.C.' => ['Bogotá'],
            'Valle del Cauca' => ['Cali', 'Palmira', 'Buenaventura', 'Cartago']
        ],
        'Perú' => [
            'Lima' => ['Lima', 'Callao', 'San Juan de Lurigancho', 'San Martín de Porres'],
            'Cusco' => ['Cusco', 'Wanchaq', 'Santiago', 'San Sebastián'],
            'Arequipa' => ['Arequipa', 'Cayma', 'Cerro Colorado', 'Yanahuara']
        ],
        'Venezuela' => [
            'Distrito Capital' => ['Caracas'],
            'Miranda' => ['Los Teques', 'Guarenas', 'Guatire', 'Petare'],
            'Zulia' => ['Maracaibo', 'San Francisco', 'Ciudad Ojeda', 'Cabimas']
        ]
    ];
    
    if (!isset($ubicacionesValidas[$pais])) {
        return false;
    }
    
    if (!isset($ubicacionesValidas[$pais][$provincia])) {
        return false;
    }
    
    return in_array($canton, $ubicacionesValidas[$pais][$provincia]);
}

/**
 * Validar contraseña (versión original - mantener para compatibilidad)
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