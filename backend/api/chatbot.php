<?php
/**
 * API para chatbots - Información de empresas y horarios
 * Chatbot API - Company and schedule information
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

class ChatbotAPI {
    private $pdo;
    
    public function __construct() {
        $this->pdo = getConnection();
    }
    
    /**
     * Procesar consulta del chatbot
     * Process chatbot query
     */
    public function procesarConsulta($query) {
        $query = strtolower(trim($query));
        
        // Detectar intención de la consulta
        if (preg_match('/empresa|compañ|bufete|firma/i', $query)) {
            return $this->obtenerInformacionEmpresas();
        } elseif (preg_match('/servicio|asesor|consulta|legal/i', $query)) {
            return $this->obtenerInformacionServicios();
        } elseif (preg_match('/horario|hora|tiempo|disponible/i', $query)) {
            return $this->obtenerInformacionHorarios();
        } elseif (preg_match('/abogado|lawyer|attorney/i', $query)) {
            return $this->obtenerInformacionAbogados();
        } elseif (preg_match('/precio|costo|tarifa|valor/i', $query)) {
            return $this->obtenerInformacionPrecios();
        } elseif (preg_match('/contacto|telefono|email|direccion/i', $query)) {
            return $this->obtenerInformacionContacto();
        } elseif (preg_match('/cita|agenda|reserva/i', $query)) {
            return $this->obtenerInformacionCitas();
        } else {
            return $this->respuestaGeneral();
        }
    }
    
    /**
     * Obtener información de empresas
     */
    private function obtenerInformacionEmpresas() {
        try {
            $stmt = $this->pdo->query("
                SELECT nombre, descripcion, servicios_principales, ciudad, telefono, email
                FROM empresas 
                WHERE activo = TRUE
                ORDER BY nombre
            ");
            $empresas = $stmt->fetchAll();
            
            $response = [
                'type' => 'empresas',
                'message' => 'Aquí tienes información sobre nuestras empresas asociadas:',
                'data' => $empresas,
                'suggestions' => [
                    'Ver servicios disponibles',
                    'Consultar horarios',
                    'Información de contacto',
                    'Agendar una cita'
                ]
            ];
            
            return $response;
            
        } catch (Exception $e) {
            return $this->respuestaError();
        }
    }
    
    /**
     * Obtener información de servicios
     */
    private function obtenerInformacionServicios() {
        try {
            $stmt = $this->pdo->query("
                SELECT nombre, descripcion, duracion_minutos, precio
                FROM servicios 
                WHERE activo = TRUE
                ORDER BY nombre
            ");
            $servicios = $stmt->fetchAll();
            
            $response = [
                'type' => 'servicios',
                'message' => 'Estos son los servicios legales que ofrecemos:',
                'data' => $servicios,
                'suggestions' => [
                    'Ver precios',
                    'Consultar horarios disponibles',
                    'Información de abogados',
                    'Agendar una cita'
                ]
            ];
            
            return $response;
            
        } catch (Exception $e) {
            return $this->respuestaError();
        }
    }
    
    /**
     * Obtener información de horarios
     */
    private function obtenerInformacionHorarios() {
        $response = [
            'type' => 'horarios',
            'message' => 'Nuestros horarios de atención son:',
            'data' => [
                'horarios_atencion' => [
                    'lunes_a_viernes' => '8:00 AM - 6:00 PM',
                    'sabados' => '9:00 AM - 1:00 PM',
                    'domingos' => 'Cerrado'
                ],
                'horarios_citas' => [
                    'disponibles' => [
                        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                        '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
                        '16:00', '16:30', '17:00', '17:30', '18:00'
                    ],
                    'duracion_promedio' => '60 minutos',
                    'nota' => 'Los horarios pueden variar según el abogado y el tipo de consulta'
                ]
            ],
            'suggestions' => [
                'Ver abogados disponibles',
                'Consultar servicios',
                'Agendar una cita',
                'Información de contacto'
            ]
        ];
        
        return $response;
    }
    
    /**
     * Obtener información de abogados
     */
    private function obtenerInformacionAbogados() {
        try {
            $stmt = $this->pdo->query("
                SELECT 
                    a.nombre, 
                    a.apellido, 
                    a.especialidades, 
                    a.email,
                    e.nombre as empresa_nombre
                FROM abogados a
                LEFT JOIN empresas e ON a.empresa_id = e.id
                WHERE a.activo = TRUE
                ORDER BY a.nombre
            ");
            $abogados = $stmt->fetchAll();
            
            $response = [
                'type' => 'abogados',
                'message' => 'Estos son nuestros abogados especializados:',
                'data' => $abogados,
                'suggestions' => [
                    'Ver servicios disponibles',
                    'Consultar horarios',
                    'Información de precios',
                    'Agendar una cita'
                ]
            ];
            
            return $response;
            
        } catch (Exception $e) {
            return $this->respuestaError();
        }
    }
    
    /**
     * Obtener información de precios
     */
    private function obtenerInformacionPrecios() {
        try {
            $stmt = $this->pdo->query("
                SELECT nombre, precio, duracion_minutos
                FROM servicios 
                WHERE activo = TRUE AND precio IS NOT NULL
                ORDER BY precio
            ");
            $precios = $stmt->fetchAll();
            
            $response = [
                'type' => 'precios',
                'message' => 'Estos son nuestros precios por servicio:',
                'data' => $precios,
                'note' => 'Los precios pueden variar según la complejidad del caso. Contacta para una cotización específica.',
                'suggestions' => [
                    'Ver servicios detallados',
                    'Consultar abogados',
                    'Agendar una consulta',
                    'Información de contacto'
                ]
            ];
            
            return $response;
            
        } catch (Exception $e) {
            return $this->respuestaError();
        }
    }
    
    /**
     * Obtener información de contacto
     */
    private function obtenerInformacionContacto() {
        try {
            $stmt = $this->pdo->query("
                SELECT nombre, telefono, email, direccion, ciudad, departamento
                FROM empresas 
                WHERE activo = TRUE
                ORDER BY nombre
            ");
            $contactos = $stmt->fetchAll();
            
            $response = [
                'type' => 'contacto',
                'message' => 'Aquí tienes nuestra información de contacto:',
                'data' => $contactos,
                'general_info' => [
                    'telefono_principal' => '+57 1 234 5678',
                    'email_principal' => 'info@hidalpi.com',
                    'sitio_web' => 'https://hidalpi.com',
                    'whatsapp' => '+57 300 123 4567'
                ],
                'suggestions' => [
                    'Agendar una cita',
                    'Ver servicios',
                    'Consultar horarios',
                    'Información de precios'
                ]
            ];
            
            return $response;
            
        } catch (Exception $e) {
            return $this->respuestaError();
        }
    }
    
    /**
     * Obtener información sobre citas
     */
    private function obtenerInformacionCitas() {
        $response = [
            'type' => 'citas',
            'message' => 'Para agendar una cita necesitas:',
            'data' => [
                'requisitos' => [
                    'Nombre completo',
                    'Número de teléfono',
                    'Email de contacto',
                    'Tipo de consulta legal',
                    'Preferencia de fecha y hora'
                ],
                'proceso' => [
                    '1. Selecciona el tipo de servicio',
                    '2. Elige el abogado (opcional)',
                    '3. Selecciona fecha y hora',
                    '4. Completa tus datos',
                    '5. Confirma la cita'
                ],
                'politicas' => [
                    'Las citas se confirman por email',
                    'Llega 10 minutos antes',
                    'Cancelaciones con 24h de anticipación',
                    'Trae documentos relevantes'
                ]
            ],
            'suggestions' => [
                'Ver horarios disponibles',
                'Consultar precios',
                'Información de abogados',
                'Contactar directamente'
            ]
        ];
        
        return $response;
    }
    
    /**
     * Respuesta general para consultas no específicas
     */
    private function respuestaGeneral() {
        $response = [
            'type' => 'general',
            'message' => '¡Hola! Soy el asistente virtual de HidalPi Web. ¿En qué puedo ayudarte?',
            'data' => [
                'servicios_disponibles' => [
                    'Información sobre nuestras empresas',
                    'Servicios legales disponibles',
                    'Horarios de atención',
                    'Información de nuestros abogados',
                    'Precios y tarifas',
                    'Datos de contacto',
                    'Proceso para agendar citas'
                ]
            ],
            'suggestions' => [
                'Ver nuestras empresas',
                'Consultar servicios',
                'Horarios disponibles',
                'Información de contacto',
                'Agendar una cita'
            ]
        ];
        
        return $response;
    }
    
    /**
     * Respuesta de error
     */
    private function respuestaError() {
        return [
            'type' => 'error',
            'message' => 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente o contacta directamente.',
            'data' => [
                'contacto_directo' => [
                    'telefono' => '+57 1 234 5678',
                    'email' => 'info@hidalpi.com',
                    'whatsapp' => '+57 300 123 4567'
                ]
            ],
            'suggestions' => [
                'Intentar nuevamente',
                'Contactar por teléfono',
                'Enviar email',
                'Usar WhatsApp'
            ]
        ];
    }
    
    /**
     * Buscar información específica
     */
    public function buscarInformacion($tipo, $filtros = []) {
        switch ($tipo) {
            case 'empresa':
                return $this->buscarEmpresa($filtros);
            case 'servicio':
                return $this->buscarServicio($filtros);
            case 'abogado':
                return $this->buscarAbogado($filtros);
            default:
                return $this->respuestaError();
        }
    }
    
    /**
     * Buscar empresa específica
     */
    private function buscarEmpresa($filtros) {
        try {
            $query = "SELECT * FROM empresas WHERE activo = TRUE";
            $params = [];
            
            if (!empty($filtros['nombre'])) {
                $query .= " AND nombre LIKE ?";
                $params[] = '%' . $filtros['nombre'] . '%';
            }
            
            if (!empty($filtros['ciudad'])) {
                $query .= " AND ciudad LIKE ?";
                $params[] = '%' . $filtros['ciudad'] . '%';
            }
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);
            $empresas = $stmt->fetchAll();
            
            return [
                'type' => 'busqueda_empresa',
                'message' => 'Resultados de búsqueda:',
                'data' => $empresas,
                'total' => count($empresas)
            ];
            
        } catch (Exception $e) {
            return $this->respuestaError();
        }
    }
    
    /**
     * Buscar servicio específico
     */
    private function buscarServicio($filtros) {
        try {
            $query = "SELECT * FROM servicios WHERE activo = TRUE";
            $params = [];
            
            if (!empty($filtros['nombre'])) {
                $query .= " AND nombre LIKE ?";
                $params[] = '%' . $filtros['nombre'] . '%';
            }
            
            if (!empty($filtros['precio_max'])) {
                $query .= " AND precio <= ?";
                $params[] = $filtros['precio_max'];
            }
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);
            $servicios = $stmt->fetchAll();
            
            return [
                'type' => 'busqueda_servicio',
                'message' => 'Servicios encontrados:',
                'data' => $servicios,
                'total' => count($servicios)
            ];
            
        } catch (Exception $e) {
            return $this->respuestaError();
        }
    }
    
    /**
     * Buscar abogado específico
     */
    private function buscarAbogado($filtros) {
        try {
            $query = "
                SELECT a.*, e.nombre as empresa_nombre
                FROM abogados a
                LEFT JOIN empresas e ON a.empresa_id = e.id
                WHERE a.activo = TRUE
            ";
            $params = [];
            
            if (!empty($filtros['especialidad'])) {
                $query .= " AND a.especialidades LIKE ?";
                $params[] = '%' . $filtros['especialidad'] . '%';
            }
            
            if (!empty($filtros['nombre'])) {
                $query .= " AND (a.nombre LIKE ? OR a.apellido LIKE ?)";
                $params[] = '%' . $filtros['nombre'] . '%';
                $params[] = '%' . $filtros['nombre'] . '%';
            }
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);
            $abogados = $stmt->fetchAll();
            
            return [
                'type' => 'busqueda_abogado',
                'message' => 'Abogados encontrados:',
                'data' => $abogados,
                'total' => count($abogados)
            ];
            
        } catch (Exception $e) {
            return $this->respuestaError();
        }
    }
}

// Manejar solicitudes
$chatbotAPI = new ChatbotAPI();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['query'])) {
        $response = $chatbotAPI->procesarConsulta($input['query']);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } elseif (isset($input['buscar'])) {
        $response = $chatbotAPI->buscarInformacion(
            $input['buscar']['tipo'],
            $input['buscar']['filtros'] ?? []
        );
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Consulta no válida'], JSON_UNESCAPED_UNICODE);
    }
} elseif ($method === 'GET') {
    // Endpoint para obtener información básica
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'info':
            echo json_encode([
                'message' => 'API de Chatbot para HidalPi Web',
                'version' => '1.0.0',
                'endpoints' => [
                    'POST /' => 'Procesar consulta de chatbot',
                    'GET /?action=info' => 'Información de la API',
                    'GET /?action=help' => 'Ayuda sobre uso'
                ]
            ], JSON_UNESCAPED_UNICODE);
            break;
        case 'help':
            echo json_encode([
                'message' => 'Ayuda para usar la API de Chatbot',
                'usage' => [
                    'Para hacer una consulta' => 'POST con {"query": "tu consulta"}',
                    'Para buscar información' => 'POST con {"buscar": {"tipo": "empresa|servicio|abogado", "filtros": {...}}}',
                    'Ejemplos de consultas' => [
                        'Información sobre empresas',
                        'Servicios disponibles',
                        'Horarios de atención',
                        'Precios y tarifas',
                        'Contacto'
                    ]
                ]
            ], JSON_UNESCAPED_UNICODE);
            break;
        default:
            $response = $chatbotAPI->respuestaGeneral();
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
            break;
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
}
?>