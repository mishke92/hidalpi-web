<?php
/**
 * API de contacto - Endpoint para envío de mensajes de contacto
 * Contact API - Endpoint for sending contact messages
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'POST':
        procesarContacto($input);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

/**
 * Procesar formulario de contacto
 */
function procesarContacto($input) {
    $requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
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
    if (isset($input['name']) && !empty($input['name'])) {
        $name = trim($input['name']);
        if (strlen($name) < 2) {
            $errors[] = 'El nombre debe tener al menos 2 caracteres';
        }
        if (strlen($name) > 100) {
            $errors[] = 'El nombre no puede tener más de 100 caracteres';
        }
        if (!preg_match('/^[a-zA-ZÀ-ÿ\s]+$/', $name)) {
            $errors[] = 'El nombre solo puede contener letras y espacios';
        }
    }
    
    // Validar teléfono
    if (isset($input['phone']) && !empty($input['phone'])) {
        if (!validarTelefonoEcuador($input['phone'])) {
            $errors[] = 'Formato de teléfono inválido para Ecuador';
        }
    }
    
    // Validar asunto
    if (isset($input['subject']) && !empty($input['subject'])) {
        $subject = trim($input['subject']);
        if (strlen($subject) < 3) {
            $errors[] = 'El asunto debe tener al menos 3 caracteres';
        }
        if (strlen($subject) > 200) {
            $errors[] = 'El asunto no puede tener más de 200 caracteres';
        }
    }
    
    // Validar mensaje
    if (isset($input['message']) && !empty($input['message'])) {
        $message = trim($input['message']);
        if (strlen($message) < 10) {
            $errors[] = 'El mensaje debe tener al menos 10 caracteres';
        }
        if (strlen($message) > 2000) {
            $errors[] = 'El mensaje no puede tener más de 2000 caracteres';
        }
    }
    
    // Si hay errores, devolver el primer error
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => $errors[0], 'success' => false]);
        return;
    }
    
    // Limpiar datos
    $contactData = [
        'name' => sanitizeString($input['name']),
        'email' => sanitizeString($input['email']),
        'phone' => sanitizeString($input['phone']),
        'subject' => sanitizeString($input['subject']),
        'message' => sanitizeString($input['message']),
        'consultationType' => $input['consultationType'] ?? 'general',
        'preferredContact' => $input['preferredContact'] ?? 'email',
        'urgency' => $input['urgency'] ?? 'normal',
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    // Aquí normalmente se guardaría en la base de datos
    // y se enviaría un email al equipo legal
    
    // Simular procesamiento
    $saved = saveContactMessage($contactData);
    $emailSent = sendContactEmail($contactData);
    
    if ($saved && $emailSent) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado correctamente. Nos pondremos en contacto con usted pronto.',
            'reference' => 'CON-' . time()
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error al procesar el mensaje. Por favor, intente nuevamente.',
            'success' => false
        ]);
    }
}

/**
 * Guardar mensaje de contacto
 */
function saveContactMessage($data) {
    // Simular guardado en base de datos
    // En una implementación real, esto se guardaría en una tabla de contactos
    
    try {
        // Guardar en archivo temporal para demo
        $logFile = __DIR__ . '/../logs/contact_messages.log';
        $logEntry = date('Y-m-d H:i:s') . ' - ' . json_encode($data) . PHP_EOL;
        
        // Crear directorio si no existe
        $logDir = dirname($logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        return true;
    } catch (Exception $e) {
        error_log('Error saving contact message: ' . $e->getMessage());
        return false;
    }
}

/**
 * Enviar email de contacto
 */
function sendContactEmail($data) {
    // Simular envío de email
    // En una implementación real, esto enviaría un email al equipo legal
    
    try {
        // Preparar email
        $to = 'info@hidalpi.com';
        $subject = 'Nuevo mensaje de contacto: ' . $data['subject'];
        $message = "
        Nuevo mensaje de contacto recibido:
        
        Nombre: {$data['name']}
        Email: {$data['email']}
        Teléfono: {$data['phone']}
        Asunto: {$data['subject']}
        Tipo de consulta: {$data['consultationType']}
        Urgencia: {$data['urgency']}
        Método de contacto preferido: {$data['preferredContact']}
        
        Mensaje:
        {$data['message']}
        
        Fecha: {$data['timestamp']}
        IP: {$data['ip']}
        ";
        
        $headers = [
            'From: ' . $data['email'],
            'Reply-To: ' . $data['email'],
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // En desarrollo, solo simular el envío
        error_log('Email simulado enviado a: ' . $to);
        error_log('Asunto: ' . $subject);
        
        return true;
    } catch (Exception $e) {
        error_log('Error sending contact email: ' . $e->getMessage());
        return false;
    }
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
 * Sanitizar string
 */
function sanitizeString($input) {
    if (empty($input)) return '';
    
    return trim(htmlspecialchars($input, ENT_QUOTES, 'UTF-8'));
}
?>