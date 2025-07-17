<?php
/**
 * API para obtener datos del dashboard de administración
 * API to get admin dashboard data
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../auth/AuthService.php';
require_once '../config/database.php';

$authService = new AuthService();
$authService->requiereAdministrador();

$pdo = getConnection();
$type = $_GET['type'] ?? 'dashboard';

switch ($type) {
    case 'dashboard':
        obtenerEstadisticasDashboard($pdo);
        break;
    case 'empresas':
        obtenerEmpresas($pdo);
        break;
    case 'clientes':
        obtenerClientes($pdo);
        break;
    case 'citas':
        obtenerCitas($pdo);
        break;
    case 'abogados':
        obtenerAbogados($pdo);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Tipo de datos no válido']);
        break;
}

/**
 * Obtener estadísticas del dashboard
 */
function obtenerEstadisticasDashboard($pdo) {
    try {
        $stats = [];
        
        // Total de empresas
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM empresas WHERE activo = TRUE");
        $stats['total_empresas'] = $stmt->fetch()['total'];
        
        // Total de clientes
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM clientes WHERE activo = TRUE");
        $stats['total_clientes'] = $stmt->fetch()['total'];
        
        // Total de citas
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM citas");
        $stats['total_citas'] = $stmt->fetch()['total'];
        
        // Total de abogados
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM abogados WHERE activo = TRUE");
        $stats['total_abogados'] = $stmt->fetch()['total'];
        
        echo json_encode($stats);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener estadísticas: ' . $e->getMessage()]);
    }
}

/**
 * Obtener listado de empresas
 */
function obtenerEmpresas($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT id, nombre, nit, telefono, email, ciudad, departamento, activo, fecha_creacion
            FROM empresas
            ORDER BY fecha_creacion DESC
        ");
        $empresas = $stmt->fetchAll();
        
        echo json_encode($empresas);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener empresas: ' . $e->getMessage()]);
    }
}

/**
 * Obtener listado de clientes
 */
function obtenerClientes($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT id, nombre, apellido, cedula, telefono, email, ciudad, departamento, activo, fecha_creacion
            FROM clientes
            ORDER BY fecha_creacion DESC
        ");
        $clientes = $stmt->fetchAll();
        
        echo json_encode($clientes);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener clientes: ' . $e->getMessage()]);
    }
}

/**
 * Obtener listado de citas
 */
function obtenerCitas($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT 
                c.id, 
                c.fecha_cita, 
                c.hora_cita, 
                c.estado, 
                c.precio, 
                c.fecha_creacion,
                cl.nombre as cliente_nombre,
                cl.apellido as cliente_apellido,
                a.nombre as abogado_nombre,
                a.apellido as abogado_apellido,
                s.nombre as servicio_nombre
            FROM citas c
            INNER JOIN clientes cl ON c.cliente_id = cl.id
            INNER JOIN abogados a ON c.abogado_id = a.id
            INNER JOIN servicios s ON c.servicio_id = s.id
            ORDER BY c.fecha_creacion DESC
        ");
        $citas = $stmt->fetchAll();
        
        echo json_encode($citas);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener citas: ' . $e->getMessage()]);
    }
}

/**
 * Obtener listado de abogados
 */
function obtenerAbogados($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT 
                a.id, 
                a.nombre, 
                a.apellido, 
                a.cedula, 
                a.telefono, 
                a.email, 
                a.especialidades, 
                a.activo,
                e.nombre as empresa_nombre
            FROM abogados a
            LEFT JOIN empresas e ON a.empresa_id = e.id
            ORDER BY a.nombre ASC
        ");
        $abogados = $stmt->fetchAll();
        
        echo json_encode($abogados);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener abogados: ' . $e->getMessage()]);
    }
}
?>