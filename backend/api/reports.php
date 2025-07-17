<?php
/**
 * API para generar reportes en formato CSV
 * API to generate CSV reports
 */

header('Content-Type: application/csv');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../auth/AuthService.php';
require_once '../config/database.php';

$authService = new AuthService();
$authService->requiereAdministrador();

$pdo = getConnection();
$type = $_GET['type'] ?? '';

switch ($type) {
    case 'empresas':
        generarReporteEmpresas($pdo);
        break;
    case 'clientes':
        generarReporteClientes($pdo);
        break;
    case 'citas':
        generarReporteCitas($pdo);
        break;
    case 'abogados':
        generarReporteAbogados($pdo);
        break;
    case 'servicios':
        generarReporteServicios($pdo);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Tipo de reporte no válido']);
        break;
}

/**
 * Generar reporte de empresas en CSV
 */
function generarReporteEmpresas($pdo) {
    $filename = 'reporte_empresas_' . date('Y-m-d_H-i-s') . '.csv';
    header("Content-Disposition: attachment; filename=\"$filename\"");
    
    try {
        $stmt = $pdo->query("
            SELECT 
                id as 'ID',
                nombre as 'Nombre',
                nit as 'NIT',
                telefono as 'Teléfono',
                email as 'Email',
                direccion as 'Dirección',
                ciudad as 'Ciudad',
                departamento as 'Departamento',
                pais as 'País',
                sitio_web as 'Sitio Web',
                servicios_principales as 'Servicios Principales',
                CASE WHEN activo = 1 THEN 'Activo' ELSE 'Inactivo' END as 'Estado',
                fecha_creacion as 'Fecha Creación',
                fecha_actualizacion as 'Fecha Actualización'
            FROM empresas
            ORDER BY fecha_creacion DESC
        ");
        
        $empresas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($empresas)) {
            echo "No hay datos de empresas para exportar";
            return;
        }
        
        // Generar CSV
        $output = fopen('php://output', 'w');
        
        // Escribir encabezados
        fputcsv($output, array_keys($empresas[0]), ';');
        
        // Escribir datos
        foreach ($empresas as $empresa) {
            fputcsv($output, $empresa, ';');
        }
        
        fclose($output);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error al generar reporte: " . $e->getMessage();
    }
}

/**
 * Generar reporte de clientes en CSV
 */
function generarReporteClientes($pdo) {
    $filename = 'reporte_clientes_' . date('Y-m-d_H-i-s') . '.csv';
    header("Content-Disposition: attachment; filename=\"$filename\"");
    
    try {
        $stmt = $pdo->query("
            SELECT 
                id as 'ID',
                nombre as 'Nombre',
                apellido as 'Apellido',
                cedula as 'Cédula',
                telefono as 'Teléfono',
                email as 'Email',
                direccion as 'Dirección',
                ciudad as 'Ciudad',
                departamento as 'Departamento',
                fecha_nacimiento as 'Fecha Nacimiento',
                CASE 
                    WHEN genero = 'M' THEN 'Masculino'
                    WHEN genero = 'F' THEN 'Femenino'
                    ELSE 'Otro'
                END as 'Género',
                CASE WHEN activo = 1 THEN 'Activo' ELSE 'Inactivo' END as 'Estado',
                fecha_creacion as 'Fecha Creación',
                fecha_actualizacion as 'Fecha Actualización'
            FROM clientes
            ORDER BY fecha_creacion DESC
        ");
        
        $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($clientes)) {
            echo "No hay datos de clientes para exportar";
            return;
        }
        
        // Generar CSV
        $output = fopen('php://output', 'w');
        
        // Escribir encabezados
        fputcsv($output, array_keys($clientes[0]), ';');
        
        // Escribir datos
        foreach ($clientes as $cliente) {
            fputcsv($output, $cliente, ';');
        }
        
        fclose($output);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error al generar reporte: " . $e->getMessage();
    }
}

/**
 * Generar reporte de citas en CSV
 */
function generarReporteCitas($pdo) {
    $filename = 'reporte_citas_' . date('Y-m-d_H-i-s') . '.csv';
    header("Content-Disposition: attachment; filename=\"$filename\"");
    
    try {
        $stmt = $pdo->query("
            SELECT 
                c.id as 'ID',
                CONCAT(cl.nombre, ' ', cl.apellido) as 'Cliente',
                cl.email as 'Email Cliente',
                cl.telefono as 'Teléfono Cliente',
                CONCAT(a.nombre, ' ', a.apellido) as 'Abogado',
                e.nombre as 'Empresa',
                s.nombre as 'Servicio',
                c.fecha_cita as 'Fecha Cita',
                c.hora_cita as 'Hora Cita',
                c.estado as 'Estado',
                c.precio as 'Precio',
                c.notas as 'Notas',
                c.fecha_creacion as 'Fecha Creación',
                c.fecha_actualizacion as 'Fecha Actualización'
            FROM citas c
            INNER JOIN clientes cl ON c.cliente_id = cl.id
            INNER JOIN abogados a ON c.abogado_id = a.id
            INNER JOIN empresas e ON c.empresa_id = e.id
            INNER JOIN servicios s ON c.servicio_id = s.id
            ORDER BY c.fecha_cita DESC, c.hora_cita DESC
        ");
        
        $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($citas)) {
            echo "No hay datos de citas para exportar";
            return;
        }
        
        // Generar CSV
        $output = fopen('php://output', 'w');
        
        // Escribir encabezados
        fputcsv($output, array_keys($citas[0]), ';');
        
        // Escribir datos
        foreach ($citas as $cita) {
            fputcsv($output, $cita, ';');
        }
        
        fclose($output);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error al generar reporte: " . $e->getMessage();
    }
}

/**
 * Generar reporte de abogados en CSV
 */
function generarReporteAbogados($pdo) {
    $filename = 'reporte_abogados_' . date('Y-m-d_H-i-s') . '.csv';
    header("Content-Disposition: attachment; filename=\"$filename\"");
    
    try {
        $stmt = $pdo->query("
            SELECT 
                a.id as 'ID',
                a.nombre as 'Nombre',
                a.apellido as 'Apellido',
                a.cedula as 'Cédula',
                a.telefono as 'Teléfono',
                a.email as 'Email',
                a.especialidades as 'Especialidades',
                e.nombre as 'Empresa',
                CASE WHEN a.activo = 1 THEN 'Activo' ELSE 'Inactivo' END as 'Estado',
                a.fecha_creacion as 'Fecha Creación',
                a.fecha_actualizacion as 'Fecha Actualización'
            FROM abogados a
            LEFT JOIN empresas e ON a.empresa_id = e.id
            ORDER BY a.nombre ASC
        ");
        
        $abogados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($abogados)) {
            echo "No hay datos de abogados para exportar";
            return;
        }
        
        // Generar CSV
        $output = fopen('php://output', 'w');
        
        // Escribir encabezados
        fputcsv($output, array_keys($abogados[0]), ';');
        
        // Escribir datos
        foreach ($abogados as $abogado) {
            fputcsv($output, $abogado, ';');
        }
        
        fclose($output);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error al generar reporte: " . $e->getMessage();
    }
}

/**
 * Generar reporte de servicios en CSV
 */
function generarReporteServicios($pdo) {
    $filename = 'reporte_servicios_' . date('Y-m-d_H-i-s') . '.csv';
    header("Content-Disposition: attachment; filename=\"$filename\"");
    
    try {
        $stmt = $pdo->query("
            SELECT 
                s.id as 'ID',
                s.nombre as 'Nombre',
                s.descripcion as 'Descripción',
                s.duracion_minutos as 'Duración (min)',
                s.precio as 'Precio',
                COUNT(c.id) as 'Total Citas',
                CASE WHEN s.activo = 1 THEN 'Activo' ELSE 'Inactivo' END as 'Estado',
                s.fecha_creacion as 'Fecha Creación',
                s.fecha_actualizacion as 'Fecha Actualización'
            FROM servicios s
            LEFT JOIN citas c ON s.id = c.servicio_id
            GROUP BY s.id, s.nombre, s.descripcion, s.duracion_minutos, s.precio, s.activo, s.fecha_creacion, s.fecha_actualizacion
            ORDER BY s.nombre ASC
        ");
        
        $servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($servicios)) {
            echo "No hay datos de servicios para exportar";
            return;
        }
        
        // Generar CSV
        $output = fopen('php://output', 'w');
        
        // Escribir encabezados
        fputcsv($output, array_keys($servicios[0]), ';');
        
        // Escribir datos
        foreach ($servicios as $servicio) {
            fputcsv($output, $servicio, ';');
        }
        
        fclose($output);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error al generar reporte: " . $e->getMessage();
    }
}
?>